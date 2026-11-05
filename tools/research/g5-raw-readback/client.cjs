"use strict";
// 通信実装を持たないraw読戻し部品。科学module・認証情報・保存先更新を扱わない。
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { performance } = require("node:perf_hooks");
const MiB = 1024 * 1024;
const LIMITS = Object.freeze({ maxBlobBytes: 48 * MiB, dataBytes: 256 * MiB,
  maxRequests: 6, chunkBytes: MiB, requestMs: 10000 });
const failure = code => Object.assign(new Error(code), { code });

function createRawReader({ request, deadline, now = () => performance.now(),
  requestMs = LIMITS.requestMs } = {}) {
  assert.equal(typeof request, "function", "RAW-TRANSPORT-REQUIRED");
  assert.equal(typeof now, "function");
  assert.ok(Number.isFinite(deadline), "RAW-FINITE-DEADLINE-REQUIRED");
  assert.ok(Number.isSafeInteger(requestMs) && requestMs > 0 && requestMs <= LIMITS.requestMs,
    "RAW-REQUEST-TIMEOUT-INVALID");
  let stopped = false, active = false, controller = null, lastTime = -Infinity;
  let requests = 0, reservedDataBytes = 0, reservedBodyBytes = 0, receivedBodyBytes = 0, verifiedBlobs = 0;
  let maxReadBufferBytes = 0;
  const seen = new Set();
  function clock() {
    const t = now();
    if (!Number.isFinite(t) || t < lastTime) throw failure("RAW-CLOCK-INVALID");
    lastTime = t;
    if (t >= deadline) throw failure("RAW-DEADLINE");
    return t;
  }
  function stop(reason = failure("RAW-STOPPED")) {
    stopped = true;
    if (controller && !controller.signal.aborted) controller.abort(reason);
  }
  function snapshot() {
    return Object.freeze({ stopped, active, requests, reservedDataBytes, reservedBodyBytes, receivedBodyBytes,
      verifiedBlobs, maxReadBufferBytes });
  }
  // Abortを無視する下位実装を待ち続けない。OS側の強制停止の代用ではない。
  function bounded(promise, signal) {
    if (signal.aborted) return Promise.reject(signal.reason);
    return new Promise((resolve, reject) => {
      const abort = () => { signal.removeEventListener("abort", abort); reject(signal.reason); };
      signal.addEventListener("abort", abort, { once: true });
      Promise.resolve(promise).then(value => {
        signal.removeEventListener("abort", abort);
        if (signal.aborted) reject(signal.reason); else resolve(value);
      }, error => { signal.removeEventListener("abort", abort); reject(error); });
    });
  }
  function cancelBody(body, reason) {
    try { Promise.resolve(body?.cancel(reason)).catch(() => {}); } catch {}
  }
  async function verifyBlob(expected) {
    if (stopped) throw failure("RAW-STOPPED");
    if (active) throw failure("RAW-CONCURRENT-REQUEST-REFUSED");
    active = true;
    let reader = null, response = null, timer = null;
    try {
      expected = Object.freeze({ bytes: expected?.bytes, sha256: expected?.sha256,
        gitBlob: expected?.gitBlob }); // await中に呼出側のmanifestが変わっても固定値を使う。
      assert.ok(expected && Number.isSafeInteger(expected.bytes) && expected.bytes >= 0 &&
        expected.bytes <= LIMITS.maxBlobBytes, "RAW-BLOB-SIZE-INVALID");
      assert.match(expected.sha256 ?? "", /^[a-f0-9]{64}$/, "RAW-SHA256-INVALID");
      assert.match(expected.gitBlob ?? "", /^[a-f0-9]{40}$/, "RAW-GIT-BLOB-INVALID");
      if (seen.has(expected.gitBlob)) throw failure("RAW-DUPLICATE-REFUSED");
      if (requests >= LIMITS.maxRequests || reservedDataBytes + expected.bytes > LIMITS.dataBytes)
        throw failure("RAW-BUDGET-EXHAUSTED");
      const started = clock();
      const until = Math.min(deadline, started + requestMs);
      seen.add(expected.gitBlob);
      reservedDataBytes += expected.bytes; // 失敗しても返却しない。
      reservedBodyBytes += expected.bytes + 1; // 余剰検出probeの最大1 byteも予約する。
      requests++;
      const ordinal = requests;
      const operationController = new AbortController();
      controller = operationController;
      const signal = operationController.signal;
      timer = setTimeout(() => operationController.abort(failure("RAW-REQUEST-TIMEOUT")),
        Math.max(1, Math.ceil(until - started)));
      function check() {
        if (signal.aborted) throw signal.reason;
        if (clock() >= until) throw failure("RAW-REQUEST-TIMEOUT");
      }
      const pending = Promise.resolve().then(() => {
        check();
        return request(Object.freeze({ method: "GET", redirect: "error", path: "/git/blobs/" + expected.gitBlob,
          headers: Object.freeze({ Accept: "application/vnd.github.raw+json",
            "Accept-Encoding": "identity" }), signal }));
      }).then(value => {
        if (signal.aborted) { cancelBody(value?.body, signal.reason); throw signal.reason; }
        return value;
      });
      response = await bounded(pending, signal);
      check();
      if (response?.status !== 200 || response.redirected) throw failure("RAW-HTTP-REFUSED");
      const encoding = response.headers?.get("content-encoding");
      if (encoding && encoding.toLowerCase() !== "identity") throw failure("RAW-ENCODING-REFUSED");
      const length = response.headers?.get("content-length");
      if (length !== null && length !== undefined &&
        (!/^(0|[1-9][0-9]*)$/.test(length) || Number(length) !== expected.bytes))
        throw failure("RAW-CONTENT-LENGTH-MISMATCH");
      const sha = crypto.createHash("sha256");
      const git = crypto.createHash("sha1").update("blob " + expected.bytes + "\0");
      let bytes = 0;
      if (response.body) {
        // BYOB byte streamに限定し、client側で全bodyを蓄積しない。
        reader = response.body.getReader({ mode: "byob" });
        let backing = new ArrayBuffer(LIMITS.chunkBytes);
        while (true) {
          check();
          // 期待量の後は1 byteだけをprobe。余剰があれば即停止する。
          const capacity = Math.min(backing.byteLength, expected.bytes - bytes + 1);
          const view = new Uint8Array(backing, 0, capacity);
          maxReadBufferBytes = Math.max(maxReadBufferBytes, backing.byteLength);
          const result = await bounded(reader.read(view), signal);
          check();
          const value = result.value;
          if (value?.byteLength) {
            receivedBodyBytes += value.byteLength;
            bytes += value.byteLength;
            if (bytes > expected.bytes) throw failure("RAW-EXCESS-BODY");
            sha.update(value); git.update(value);
          }
          if (result.done) break;
          if (!value || value.byteLength === 0) throw failure("RAW-EMPTY-READ");
          backing = value.buffer;
        }
      }
      check();
      if (bytes !== expected.bytes) throw failure("RAW-TRUNCATED-BODY");
      const sha256 = sha.digest("hex"), gitBlob = git.digest("hex");
      if (sha256 !== expected.sha256 || gitBlob !== expected.gitBlob)
        throw failure("RAW-DIGEST-MISMATCH");
      verifiedBlobs++;
      // blob一致だけを返す。D全体のACKや最終U_apiは認定しない。
      return Object.freeze({ blobReadbackVerified: true, bytes, sha256, gitBlob, ordinal });
    } catch (error) {
      stop(error);
      if (reader) { try { Promise.resolve(reader.cancel(error)).catch(() => {}); } catch {} }
      else cancelBody(response?.body, error);
      throw error;
    } finally {
      if (timer !== null) clearTimeout(timer);
      if (reader) { try { reader.releaseLock(); } catch {} }
      controller = null;
      active = false;
    }
  }
  return Object.freeze({ verifyBlob, stop, snapshot });
}
module.exports = { createRawReader, LIMITS };
