"use strict";
// メモリ内byte streamのみ。HTTP server/socket/科学moduleを使用しない。
const test = require("node:test"), assert = require("node:assert/strict");
const crypto = require("node:crypto"), { performance } = require("node:perf_hooks");
const { createRawReader, LIMITS } = require("./client.cjs");
const MiB = 1024 * 1024;
function descriptor(size, byte = 0xa5) {
  const block = Buffer.alloc(65536, byte), sha = crypto.createHash("sha256"),
    git = crypto.createHash("sha1").update("blob " + size + "\0");
  for (let left = size; left > 0; left -= Math.min(left, block.length)) {
    const piece = block.subarray(0, Math.min(left, block.length)); sha.update(piece); git.update(piece);
  }
  return { bytes: size, sha256: sha.digest("hex"), gitBlob: git.digest("hex") };
}
function response(size, { byte = 0xa5, status = 200, headers = {}, failAt = Infinity,
  stall = false, onCancel = () => {}, onPull = () => {} } = {}) {
  let sent = 0;
  return new Response(new ReadableStream({ type: "bytes", pull(c) {
    onPull();
    if (stall) return new Promise(() => {});
    if (sent >= failAt) { c.error(Error("fixture-cut")); return; }
    if (sent === size) { c.close(); c.byobRequest?.respond(0); return; }
    const view = c.byobRequest.view, n = Math.min(view.byteLength, size - sent, 65536);
    view.fill(byte, 0, n); sent += n; c.byobRequest.respond(n);
  }, cancel: onCancel }), { status, headers });
}
function client(request, options = {}) {
  return createRawReader({ request, deadline: performance.now() + 10000, ...options });
}

test("48 MiBを全量蓄積せず読み戻し、Pythonで固定した二hashと一致する", async () => {
  const expected = { bytes: 48 * MiB,
    sha256: "14d60307ec0f77dc1d495d74c4c9067eae1f316082ce3e43d1879d2478a85c60",
    gitBlob: "56904f0010a6f6c9e00a5f34bf63007b4191ed56" };
  let calls = 0;
  const c = client(async q => {
    calls++; assert.equal(q.method, "GET"); assert.equal(q.redirect, "error"); assert.equal(q.path, "/git/blobs/" + expected.gitBlob);
    assert.equal(q.headers.Accept, "application/vnd.github.raw+json");
    return response(expected.bytes, { headers: { "Content-Length": String(expected.bytes) } });
  });
  const r = await c.verifyBlob(expected);
  assert.equal(calls, 1); assert.equal(r.blobReadbackVerified, true);
  assert.equal(c.snapshot().receivedBodyBytes, expected.bytes);
  assert.ok(c.snapshot().maxReadBufferBytes <= MiB);
  assert.equal("acknowledged" in r, false);
});

test("過大な期待size・hash・期限を要求前に拒否する", async () => {
  for (const patch of [{ bytes: 48 * MiB + 1 }, { bytes: -1 }, { sha256: "bad" }, { gitBlob: "../x" }]) {
    let calls = 0; const c = client(async () => { calls++; });
    await assert.rejects(c.verifyBlob({ ...descriptor(1), ...patch })); assert.equal(calls, 0);
  }
  let calls = 0; const c = client(async () => { calls++; }, { now: () => 1, deadline: 1 });
  await assert.rejects(c.verifyBlob(descriptor(1)), /RAW-DEADLINE/); assert.equal(calls, 0);
});

test("途中切断・短いbody・余分な1 byte・同長改変を拒否し再送しない", async () => {
  const expected = descriptor(65537);
  for (const make of [() => response(65537, { failAt: 65536 }), () => response(65536),
    () => response(65538), () => response(65537, { byte: 0xa4 })]) {
    let calls = 0; const c = client(async () => { calls++; return make(); });
    await assert.rejects(c.verifyBlob(expected));
    await assert.rejects(c.verifyBlob(descriptor(2)), /RAW-STOPPED/);
    assert.equal(calls, 1); assert.equal(c.snapshot().stopped, true);
    assert.equal(c.snapshot().verifiedBlobs, 0);
    assert.ok(c.snapshot().receivedBodyBytes <= expected.bytes + 1);
  }
});

test("status・redirect・encoding・Content-Lengthをbody読取前に拒否する", async () => {
  for (const make of [() => response(3, { status: 206 }),
    () => response(3, { headers: { "Content-Encoding": "gzip" } }),
    () => response(3, { headers: { "Content-Length": "4" } }),
    () => response(3, { headers: { "Content-Length": "+3" } }),
    () => ({ status: 200, redirected: true, body: null })]) {
    const c = client(async () => make()); await assert.rejects(c.verifyBlob(descriptor(3)));
    assert.equal(c.snapshot().receivedBodyBytes, 0);
  }
});

test("接続応答なしとbody停止を期限で中断し、signalとcancelを伝える", async () => {
  let signal, calls = 0;
  const c = client(q => { calls++; signal = q.signal; return new Promise(() => {}); }, { requestMs: 25 });
  await assert.rejects(c.verifyBlob(descriptor(1)), /RAW-REQUEST-TIMEOUT/);
  assert.equal(signal.aborted, true); assert.equal(calls, 1);
  let cancelled = 0;
  const b = client(async () => response(1, { stall: true, onCancel: () => cancelled++ }), { requestMs: 25 });
  await assert.rejects(b.verifyBlob(descriptor(1)), /RAW-REQUEST-TIMEOUT/);
  assert.equal(cancelled, 1);
});

test("timeout後に遅れて届いた応答もcancelし、新規要求を出さない", async () => {
  let resolve, cancelled = 0, calls = 0;
  const c = client(() => { calls++; return new Promise(r => { resolve = r; }); }, { requestMs: 25 });
  await assert.rejects(c.verifyBlob(descriptor(1)), /RAW-REQUEST-TIMEOUT/);
  resolve(response(1, { onCancel: () => cancelled++ }));
  await new Promise(r => setImmediate(r));
  assert.equal(cancelled, 1);
  await assert.rejects(c.verifyBlob(descriptor(2)), /RAW-STOPPED/); assert.equal(calls, 1);
});

test("body読取中の共通期限到達と時計逆行を成功にしない", async () => {
  for (const end of [100, -1]) {
    let time = 0;
    const c = client(async () => response(1, { onPull: () => { time = end; } }),
      { deadline: 100, now: () => time });
    await assert.rejects(c.verifyBlob(descriptor(1)), /RAW-(DEADLINE|CLOCK-INVALID)/);
    assert.equal(c.snapshot().verifiedBlobs, 0);
  }
});

test("外側stopで待機を打切り、成功後も同じblobを再要求しない", async () => {
  const c = client(() => new Promise(() => {}));
  const pending = c.verifyBlob(descriptor(1));
  await new Promise(r => setImmediate(r)); c.stop();
  await assert.rejects(pending, /RAW-STOPPED/);
  let calls = 0; const ok = client(async () => { calls++; return response(1); });
  await ok.verifyBlob(descriptor(1));
  await assert.rejects(ok.verifyBlob(descriptor(1)), /RAW-DUPLICATE-REFUSED/); assert.equal(calls, 1);
});

test("同時要求を拒否し、request数上限は要求前に止める", async () => {
  let resolve, calls = 0;
  const c = client(() => { calls++; return new Promise(r => { resolve = r; }); });
  const first = c.verifyBlob(descriptor(1));
  await assert.rejects(c.verifyBlob(descriptor(2)), /RAW-CONCURRENT/);
  await new Promise(r => setImmediate(r)); resolve(response(1)); await first;
  assert.equal(calls, 1);
  let requests = 0;
  const bounded = client(async () => { requests++; return response(requests); });
  for (let n = 1; n <= 6; n++) await bounded.verifyBlob(descriptor(n));
  await assert.rejects(bounded.verifyBlob(descriptor(7)), /RAW-BUDGET-EXHAUSTED/);
  assert.equal(requests, LIMITS.maxRequests);
});

test("非byte streamを拒否し、空blobは固定された二hashを検査する", async () => {
  const invalid = client(async () => new Response(new ReadableStream({ start(c) { c.close(); } })));
  await assert.rejects(invalid.verifyBlob(descriptor(1)));
  const empty = client(async () => new Response(null, { status: 200 }));
  assert.equal((await empty.verifyBlob(descriptor(0))).bytes, 0);
});


test("累積256 MiBを越える予約を要求前に止め、境界ちょうどの6片は照合できる", async () => {
  for (const finalMiB of [17, 16]) {
    let calls = 0;
    const c = client(async () => {
      const i = calls++; return response((i < 5 ? 48 : finalMiB) * MiB, { byte: i + 1 });
    });
    for (let i = 0; i < 5; i++) await c.verifyBlob(descriptor(48 * MiB, i + 1));
    if (finalMiB === 17) {
      await assert.rejects(c.verifyBlob(descriptor(17 * MiB, 6)), /RAW-BUDGET-EXHAUSTED/);
      assert.equal(calls, 5); assert.equal(c.snapshot().reservedDataBytes, 240 * MiB);
    } else {
      await c.verifyBlob(descriptor(16 * MiB, 6));
      assert.equal(calls, 6); assert.equal(c.snapshot().reservedDataBytes, 256 * MiB);
      assert.equal(c.snapshot().reservedBodyBytes, 256 * MiB + 6);
      assert.equal(c.snapshot().receivedBodyBytes, 256 * MiB);
    }
  }
});

test("接続の例外とGit blobだけの不一致でも一回で閉じる", async () => {
  let calls = 0; const c = client(async () => { calls++; throw Error("fixture-connect-lost"); });
  await assert.rejects(c.verifyBlob(descriptor(1)), /fixture-connect-lost/);
  await assert.rejects(c.verifyBlob(descriptor(2)), /RAW-STOPPED/); assert.equal(calls, 1);
  const wrong = client(async () => response(3));
  await assert.rejects(wrong.verifyBlob({ ...descriptor(3), gitBlob: "0".repeat(40) }), /RAW-DIGEST-MISMATCH/);
});


test("await中の入力manifest変更で予約量と検算対象を差し替えられない", async () => {
  const expected = descriptor(3);
  const c = client(async () => {
    Object.assign(expected, descriptor(5)); return response(5);
  });
  await assert.rejects(c.verifyBlob(expected), /RAW-EXCESS-BODY/);
  assert.equal(c.snapshot().reservedDataBytes, 3);
  assert.equal(c.snapshot().receivedBodyBytes, 4);
  assert.equal(c.snapshot().verifiedBlobs, 0);
});
