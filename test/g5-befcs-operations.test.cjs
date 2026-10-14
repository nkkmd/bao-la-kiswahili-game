"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), os = require("node:os"), path = require("node:path"), cp = require("node:child_process");
const R = require("../tools/research/g5-befcs-operations/registry.cjs"), I = require("../tools/research/g5-befcs-operations/independent-registry.cjs");
const { supervise } = require("../tools/research/g5-befcs-operations/supervisor.cjs"), S = require("../tools/research/g5-branch-envelope/storage.cjs");
const worker = path.resolve(__dirname, "../tools/research/g5-befcs-operations/worker-fixture.cjs");
const request = (overrides = {}) => ({ evidenceClass: "TECHNICAL-REGISTRY-FIXTURE", stageId: "FIXTURE-1", runId: "fixture-run-1", runAttempt: 1, binding: "1".repeat(64), block: { start: 1, count: 128 }, ...overrides });
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-ops-test-")), remote = path.join(root, "remote.git");
  cp.execFileSync("git", ["init", "--quiet", "--bare", remote]);
  const a = R.open(path.join(root, "a"), remote), b = R.open(path.join(root, "b"), remote);
  return { root, remote, a, b, close: () => fs.rmSync(root, { recursive: true, force: true }) };
}
test("全区画leaseはremote receiptへ保存され、二取得・重複範囲を拒否する", () => {
  const f = fixture(); try {
    const x = f.a.acquire(request()); assert.equal(f.b.read().sha, x.sha);
    assert.throws(() => f.b.acquire(request()), /DUPLICATE-STAGE/);
    assert.throws(() => f.b.acquire(request({ stageId: "FIXTURE-2", block: { start: 128, count: 2 } })), /BLOCK-OVERLAP/);
    assert.equal(I.verify(path.join(f.root, "a"), x.sha).logicalReadsMarked, 0);
  } finally { f.close(); }
});
test("attempt 2・科学区画・未実装の科学認可を拒否する", () => {
  const f = fixture(); try {
    assert.throws(() => f.a.acquire(request({ runAttempt: 2 })));
    assert.throws(() => f.a.acquire(request({ block: { start: 50613001, count: 128 } })), /SCIENTIFIC-BLOCK-REFUSED/);
    assert.throws(() => f.a.acquire(request({ evidenceClass: "SCIENTIFIC" })), /SCIENCE-ENTRY-NOT-IMPLEMENTED/);
    assert.equal(f.a.read().sha, null);
  } finally { f.close(); }
});
test("競合した古いheadでは更新できず、他者の記録を保持する", () => {
  const f = fixture(); try {
    const before = f.a.acquire(request()); f.b.acquire(request({ stageId: "FIXTURE-2", block: { start: 1000, count: 2 } }));
    assert.throws(() => f.a.commit(before.sha, before.record), /CAS-CONFLICT/);
    const current = f.a.read(); assert.equal(current.record.leases.length, 2); I.verify(path.join(f.root, "a"), current.sha);
  } finally { f.close(); }
});
test("各読取りのcallbackより前にremote consume commitが存在する", () => {
  const f = fixture(); try {
    f.a.acquire(request()); const order = [];
    for (let index = 0; index < 3; index++) f.a.consume("FIXTURE-1", "fixture-run-1", index, (id, receipt) => {
      const state = f.b.read(); assert.equal(state.sha, receipt); assert.equal(state.record.leases[0].consumes.length, index + 1); order.push(id);
    }, "1".repeat(64));
    assert.deepEqual(order, [1, 2, 3]); I.verify(path.join(f.root, "a"), f.a.read().sha);
  } finally { f.close(); }
});
test("consume失敗・binding/run不一致・順番違いではcallbackへ進まない", () => {
  const f = fixture(); try {
    f.a.acquire(request()); let reads = 0; const callback = () => reads++;
    assert.throws(() => f.a.consume("FIXTURE-1", "wrong", 0, callback, "1".repeat(64)));
    assert.throws(() => f.a.consume("FIXTURE-1", "fixture-run-1", 1, callback, "1".repeat(64)));
    assert.throws(() => f.a.consume("FIXTURE-1", "fixture-run-1", 0, callback, "2".repeat(64)));
    // lease commit後にremoteを失わせ、保存失敗時の読取禁止を検査する。
    fs.renameSync(f.remote, f.remote + "-offline");
    assert.throws(() => f.a.consume("FIXTURE-1", "fixture-run-1", 0, callback, "1".repeat(64))); assert.equal(reads, 0);
  } finally { f.close(); }
});
test("callback内の強制的失敗後もconsume markerを取り消さず、同番号を再読しない", () => {
  const f = fixture(); try {
    f.a.acquire(request()); assert.throws(() => f.a.consume("FIXTURE-1", "fixture-run-1", 0, () => { throw Error("after-marker"); }, "1".repeat(64)), /after-marker/);
    assert.equal(f.b.read().record.leases[0].consumes.length, 1);
    assert.throws(() => f.b.consume("FIXTURE-1", "fixture-run-1", 0, () => assert.fail("retry"), "1".repeat(64)), /DUPLICATE-CONSUME/);
  } finally { f.close(); }
});
test("128 logical IDの全逐次消費を独立履歴検査する（PRNG読取りは0）", () => {
  const f = fixture(); try {
    f.a.acquire(request()); let seen = 0;
    for (let n = 0; n < 128; n++) f.a.consume("FIXTURE-1", "fixture-run-1", n, id => { assert.equal(id, n + 1); seen++; }, "1".repeat(64));
    const result = I.verify(path.join(f.root, "a"), f.a.read().sha); assert.equal(result.logicalReadsMarked, 128); assert.equal(result.commits, 129); assert.equal(seen, 128);
    assert.throws(() => f.a.consume("FIXTURE-1", "fixture-run-1", 128, () => assert.fail(), "1".repeat(64)));
  } finally { f.close(); }
});
test("mirrorは元byte hash・逐次履歴を保持し、順番違いと改変を拒否する", () => {
  const f = fixture(); try {
    f.a.acquire(request()); const first = f.a.mirror("FIXTURE-1", "fixture-run-1", 0, { "journal.jsonl": Buffer.from("a\n") });
    const last = f.a.mirror("FIXTURE-1", "fixture-run-1", 1, { "journal.jsonl": Buffer.from("a\nb\n") });
    assert.equal(I.verify(path.join(f.root, "a"), last.sha).mirrors, 2);
    assert.throws(() => f.a.mirror("FIXTURE-1", "fixture-run-1", 1, {}), /SEQUENCE-CONFLICT/);
    const bad = f.a.read(); bad.record.mirrors[0].files[0].sha256 = "0".repeat(64);
    const forged = f.a.commit(bad.sha, bad.record); assert.throws(() => I.verify(path.join(f.root, "a"), forged.sha));
    assert.ok(first.sha !== last.sha);
  } finally { f.close(); }
});
test("独立履歴検査はbeforeReadの改変を拒否する", () => {
  const f = fixture(); try {
    f.a.acquire(request()); f.a.consume("FIXTURE-1", "fixture-run-1", 0, () => {}, "1".repeat(64));
    const current = f.a.read(); current.record.leases[0].consumes[0].beforeRead = false;
    const forged = f.a.commit(current.sha, current.record); assert.throws(() => I.verify(path.join(f.root, "a"), forged.sha));
  } finally { f.close(); }
});
test("複数processの合算RSSが上限を超えたらgroup全体を止める", async () => {
  const result = await supervise(process.execPath, [worker, "group"], { maxRssBytes: 160 * 1024 * 1024, maxTotalMs: 5000, pollMs: 10 });
  assert.equal(result.status, "AGGREGATE-RSS-LIMIT"); assert.equal(result.maxProcesses, 2); assert.equal(result.solution, null);
});
test("workerがSIGTERMを無視してもkillし、fsync済journal・終局未知を保持する", async () => {
  const f = fixture(); try {
    const directory = path.join(f.root, "worker"), result = await supervise(process.execPath, [worker, "ignore-term", directory], { maxRssBytes: 1073741824, maxTotalMs: 400, killGraceMs: 50 });
    assert.equal(result.status, "GLOBAL-TIME-LIMIT"); assert.equal(result.signal, "SIGKILL"); assert.equal(result.solution, null);
    const records = S.replayJournal(fs.readFileSync(path.join(directory, "fixture.jsonl"))); assert.ok(records.length > 0);
    const snapshot = JSON.parse(fs.readFileSync(path.join(directory, "CHECKPOINT.json"))); assert.ok(snapshot.savedRows <= records.length); assert.equal(snapshot.solution, null);
  } finally { f.close(); }
});
test("稼働中mirrorと終了mirrorの両方をremoteから復元する", async () => {
  const f = fixture(); try {
    f.a.acquire(request()); const directory = path.join(f.root, "worker"), phases = []; let sequence = 0;
    const result = await supervise(process.execPath, [worker, "journal", directory], { maxRssBytes: 1073741824, maxTotalMs: 650, mirrorEveryTicks: 4 }, {
      async mirror(final) {
        if (!fs.existsSync(path.join(directory, "fixture.jsonl"))) return;
        const bytes = fs.readFileSync(path.join(directory, "fixture.jsonl"));
        const end = bytes.lastIndexOf(10) + 1; const prefix = bytes.subarray(0, end); S.replayJournal(prefix);
        f.a.mirror("FIXTURE-1", "fixture-run-1", sequence++, { "fixture.jsonl": prefix, "coverage.json": Buffer.from(JSON.stringify({ final, partialTailBytes: bytes.length - end, complete: false, solution: null })) }); phases.push(final);
      }
    });
    assert.equal(result.status, "GLOBAL-TIME-LIMIT"); assert.ok(phases.includes(false)); assert.equal(phases.at(-1), true);
    const receipt = f.a.read(); assert.equal(I.verify(path.join(f.root, "a"), receipt.sha).mirrors, phases.length);
    const last = receipt.record.mirrors.at(-1).files.find(file => file.name === "fixture.jsonl");
    const saved = Buffer.concat(last.chunks.map(c => cp.execFileSync("git", ["show", receipt.sha + ":" + c.object], { cwd: path.join(f.root, "a") }))); assert.ok(S.replayJournal(saved).length > 0);
  } finally { f.close(); }
});
test("mirrorの分割再利用と累積byte上限を検査する", () => {
  const f = fixture(); try {
    f.a.acquire(request()); const limits = { chunkBytes: 4, maxStoredBytes: 12 };
    f.a.mirror("FIXTURE-1", "fixture-run-1", 0, { "fixture.bin": Buffer.from("aaaabbbb") }, limits);
    const last = f.a.mirror("FIXTURE-1", "fixture-run-1", 1, { "fixture.bin": Buffer.from("aaaabbbbcccc") }, limits);
    I.verify(path.join(f.root, "a"), last.sha);
    assert.throws(() => f.a.mirror("FIXTURE-1", "fixture-run-1", 2, { "fixture.bin": Buffer.from("aaaabbbbccccd") }, limits), /STORAGE-LIMIT/);
    assert.equal(f.a.read().sha, last.sha);
  } finally { f.close(); }
});
test("journal末尾断片をbyte保存し、完全prefixだけを検算する", () => {
  const { capture } = require("../tools/research/g5-befcs-operations/capture.cjs"), f = fixture(); try {
    const directory = path.join(f.root, "capture"), output = S.store(directory, { maxEvidenceBytes: 4096, storageReserveBytes: 1024 });
    output.append("fixture.jsonl", { fixture: true }); output.close();
    fs.appendFileSync(path.join(directory, "fixture.jsonl"), '{"partial":');
    const bytes = fs.readFileSync(path.join(directory, "fixture.jsonl")), result = capture(directory, 4096);
    assert.deepEqual(result.files["fixture.jsonl"], bytes); assert.equal(result.journals["fixture.jsonl"].verifiedRows, 1);
    assert.equal(result.journals["fixture.jsonl"].partialTailBytes, 11); assert.equal(result.solution, null);
    assert.throws(() => capture(directory, 1), /CAPTURE-LIMIT/);
  } finally { f.close(); }
});
test("mirror保存が失敗したら科学値を付けずworkerを停止する", async () => {
  const f = fixture(); try {
    let failures = 0;
    const result = await supervise(process.execPath, [worker, "journal", path.join(f.root, "worker")], { maxRssBytes: 1073741824, maxTotalMs: 3000, mirrorEveryTicks: 2 }, {
      async mirror() { failures++; throw Error("remote-unavailable"); }
    });
    assert.equal(result.status, "MIRROR-FAILURE"); assert.equal(result.solution, null); assert.ok(failures >= 1); assert.equal(result.mirrorError, "remote-unavailable");
  } finally { f.close(); }
});
