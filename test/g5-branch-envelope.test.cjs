"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), os = require("node:os"), cp = require("node:child_process"), crypto = require("node:crypto");
const S = require("../tools/research/g5-branch-envelope/source.cjs"), I = require("../tools/research/g5-branch-envelope/independent-source.cjs");
const F = require("../tools/research/g5-branch-envelope/fixtures.cjs"), Storage = require("../tools/research/g5-branch-envelope/storage.cjs"), Closure = require("../tools/research/g5-branch-envelope/closure.cjs");
const M = require("../tools/research/g5-01/measurement.cjs"), BF = require("../tools/research/g5-compact-bfs/fixtures.cjs"), C = require("../doc/research-generation-5/branch-envelope-preflight-20261013/CONFIG.json");
const spec = C.sourceLimits, caps = C.smallStorageLimits;
function source(options = {}, excluded = new Set(), custom = spec, hooks = {}, seed = 1) {
  const a = F.sourceFixture("toy", options), b = F.sourceFixture("toy", options, true), context = { evidenceClass: "TECHNICAL-FIXTURE", fixtureId: "toy", allowedSeeds: C.fixtureSeeds };
  const result = S.generateFixture(seed, custom, a.initial, S.paired(a.api, b.api), excluded, context, hooks);
  I.replay(result, custom, b.initial, b.api, excluded, context); return { result, a, b, context };
}
function temp(callback) { const d = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-test-")); return Promise.resolve().then(() => callback(d)).finally(() => fs.rmSync(d, { recursive: true, force: true })); }
test("最初の適格rootと48 ply境界を独立再生する", () => {
  const { result } = source(); assert.equal(result.candidate.ply, 48); assert.ok(result.screens.some(s => s.ply === 50 && s.status === "BRANCH-ENVELOPE-ELIGIBLE")); assert.equal(result.stop, "NATURAL-TERMINAL");
  const p = source({}, new Set(), { ...spec, maxPly: 48 }).result; assert.equal(p.stop, "PLY-LIMIT"); assert.equal(p.candidate.ply, 48);
});
test("各子8手以内でも応手数合計17は除外する", () => {
  const { result } = source({ replyWidths: [8, 8, 1] }); assert.equal(result.screens[0].status, "AGGREGATE-WIDTH-EXCLUDED"); assert.equal(result.candidate.ply, 50);
  assert.equal(source({ replyWidths: [8, 8] }).result.candidate.ply, 48);
});
test("最初のroot/子/2 ply先が既読なら後のrootへ差し替えない", () => {
  for (const state of [F.state(48), F.state(600), F.state(49)]) {
    const r = source({}, new Set([M.rawKey(state)])).result; assert.equal(r.firstEligible.ply, 48); assert.equal(r.candidate, null); assert.equal(r.selectionStatus, "FIRST-ROOT-OVERLAP-EXCLUDED");
  }
  assert.equal(source({}, new Set([M.rawKey(F.state(0))])).result.candidate.ply, 48);
});
test("2 ply screenの未知・後続未知は自然敗北や代替候補にならない", () => {
  for (const options of [{ unknownReply: true }, { laterUnknown: true }]) {
    const r = source(options).result; assert.equal(r.stop, "SCREEN-REPLY-MOVE-RECURRENT"); assert.equal(r.candidate, null);
    assert.equal(r.screens.at(-1).branches[0].replies[0].outcome.witness.state, null);
  }
});
test("terminal子、個別応手上限、同種応手の判定を値なしで拒否する", () => {
  const f = F.sourceFixture("terminal", { terminalChild: true }), r = S.screen(F.state(48), 48, spec, f.api);
  assert.equal(r.status, "TERMINAL-CHILD-EXCLUDED");
  const root = { nonterminal: true, phase: "mtaji", reserve: [0, 0], width: 2 };
  assert.equal(S.structural(root, [{ nonterminal: true, width: 9, mode: "capture" }, { nonterminal: true, width: 1, mode: "takata" }], spec), "REPLY-WIDTH-EXCLUDED");
  assert.equal(S.structural(root, Array(2).fill({ nonterminal: true, width: 2, mode: "capture" }), spec), "HOMOGENEOUS-REPLY-EXCLUDED");
});
test("候補固定後の重複・件数不足・未選択を独立検算する", () => {
  const r = source().result, sources = [r, { ...r, fixtureId: "duplicate" }];
  const frozen = S.freezeCandidates(sources, 8); assert.equal(frozen.candidates.length, 1); I.verifyFrozen(sources, 8, frozen);
  assert.equal(frozen.dispositions[1].status, "DUPLICATE-FIRST-ROOT-EXCLUDED");
});
test("PRNG draw・選定root・screen欠落・metadata改変を拒否する", () => {
  const { result, b, context } = source();
  for (const mutate of [r => r.trace[0].draws[0]++, r => r.candidate.ply = 50, r => r.screens.pop(), r => r.trace[0].outcome.metadata.turn++]) {
    const bad = structuredClone(result); mutate(bad); assert.throws(() => I.replay(bad, spec, b.initial, b.api, new Set(), context));
  }
});
test("xorshift整数棄却は最後のdrawだけを採用し独立再生する", () => {
  const { result } = source({}, new Set(), spec, {}, 4166445141);
  assert.equal(result.trace[48].draws[0], 4294967295); assert.equal(result.trace[48].draws.length, 2);
  assert.throws(() => S.draw(1, 0)); assert.throws(() => S.draw(1, 4294967296));
});
test("科学seedとfixture未許可seed・実装不一致を開始前に拒否する", () => {
  const { a, b, context } = source();
  for (const seed of [50613001, 50613128, 2]) assert.throws(() => S.generateFixture(seed, spec, a.initial, a.api, new Set(), context));
  const wrong = { ...b.api, variants(s) { const r = b.api.variants(s); return { ...r, moves: [] }; } };
  assert.throws(() => S.generateFixture(1, spec, a.initial, S.paired(a.api, wrong), new Set(), context), /MISMATCH/);
});
test("512 ply上限とsource資源停止のprefixを保持する", () => {
  assert.equal(source({ long: true }, new Set(), { ...spec, maxPly: 512 }).result.trace.length, 512);
  let count = 0; const r = source({}, new Set(), spec, { check() { if (++count === 3) throw new S.Stop("GLOBAL-TIME-LIMIT"); } }).result;
  assert.equal(r.trace.length, 2); assert.equal(r.candidate, null); assert.equal(r.interruption.verification, "PREFIX-ONLY-NOT-FULL");
});
test("証拠予約域で書込前に停止し、最後のsnapshotとhash journalを保持する", () => temp(d => {
  const output = Storage.store(d, { ...caps, maxEvidenceBytes: 1000, storageReserveBytes: 500 });
  output.snapshot("checkpoint.json", { old: true }); output.append("reads.jsonl", { state: "fixed" });
  assert.throws(() => output.append("reads.jsonl", { padding: "x".repeat(500) }), /RESERVE/);
  assert.equal(Storage.replayJournal(fs.readFileSync(path.join(d, "reads.jsonl"))).length, 1);
  output.snapshot("finish.json", { complete: false, resumeAuthorized: false }, true); output.close();
  assert.equal(JSON.parse(fs.readFileSync(path.join(d, "checkpoint.json"))).old, true);
  assert.throws(() => Storage.store(d, caps), /EXISTING/);
}));
test("fsync直後のプロセス強制終了でもjournal prefixが再生できる", () => temp(d => {
  const storagePath = path.resolve(__dirname, "../tools/research/g5-branch-envelope/storage.cjs");
  const code = `const fs=require('node:fs'),S=require(${JSON.stringify(storagePath)});const s=S.store(process.argv[1],${JSON.stringify(caps)});for(let i=0;i<3;i++)s.append('reads.jsonl',{i});process.kill(process.pid,'SIGKILL');`;
  const child = cp.spawnSync(process.execPath, ["-e", code, d]); assert.equal(child.signal, "SIGKILL");
  assert.deepEqual(Storage.replayJournal(fs.readFileSync(path.join(d, "reads.jsonl"))), [{ i: 0 }, { i: 1 }, { i: 2 }]);
  const bytes = fs.readFileSync(path.join(d, "reads.jsonl")); assert.throws(() => Storage.replayJournal(bytes.subarray(0, -1)), /TRUNCATED/);
}));
test("snapshot fsync後rename前の障害で旧checkpointを失わない", () => temp(d => {
  let fail = false; const s = Storage.store(d, caps, stage => { if (fail && stage === "snapshot-fsync") throw Error("INJECTED-IO-FAILURE"); });
  s.snapshot("checkpoint.json", { v: 1 }); fail = true; assert.throws(() => s.snapshot("checkpoint.json", { v: 2 }), /INJECTED/); s.close();
  assert.equal(JSON.parse(fs.readFileSync(path.join(d, "checkpoint.json"))).v, 1); assert.ok(fs.existsSync(path.join(d, "checkpoint.json.tmp")));
}));
test("圧縮分割は全片hash・順序・解凍bytesを独立検算する", () => temp(async d => {
  fs.writeFileSync(path.join(d, "evidence.bin"), crypto.randomBytes(100000));
  const limits = { ...caps, maxBlobChunkBytes: 16000 }, index = await Storage.bundle(d, ["evidence.bin"], limits);
  assert.ok(index.shards.length > 1); await Storage.verifyBundle(d, index, limits);
  const bad = structuredClone(index); bad.shards.reverse(); await assert.rejects(Storage.verifyBundle(d, bad, limits));
  const file = path.join(d, index.shards[0].name), bytes = fs.readFileSync(file); bytes[5] ^= 1; fs.writeFileSync(file, bytes);
  await assert.rejects(Storage.verifyBundle(d, index, limits));
}));
test("gzip総量・片数上限停止はpartial indexを残し完全扱いを拒否する", async () => {
  for (const limit of [{ maxRepositoryBundleGzipBytes: 100 }, { maxBlobChunks: 1, maxBlobChunkBytes: 100 }]) await temp(async d => {
    fs.writeFileSync(path.join(d, "evidence.bin"), crypto.randomBytes(10000));
    const index = await Storage.bundle(d, ["evidence.bin"], { ...caps, ...limit });
    assert.equal(index.complete, false); assert.equal(index.archiveSha256, null); assert.ok(fs.existsSync(path.join(d, "BUNDLE_INDEX.json")));
    await assert.rejects(Storage.verifyBundle(d, index, caps));
  });
});
test("既知Bao完全閉包と途中既読停止は全辺検算・解の境界を守る", async () => {
  for (const blocked of [false, true]) await temp(d => {
    const p = BF.fixture("BAO-FORCED-WIN"), q = BF.fixture("BAO-FORCED-WIN", true), output = Storage.store(d, caps);
    const child = p.adapter.apply(p.state, p.adapter.variants(p.state).moves[0]).state;
    const r = Closure.runFixture(p, q, C.closureLimits, output, blocked ? new Set([M.rawKey(child)]) : new Set()); output.close();
    assert.equal(r.domain.complete, !blocked); assert.equal(r.solution === null, blocked);
    if (blocked) { assert.equal(r.stageStatus, "READ-FIREWALL-HIT"); assert.ok(r.domain.stopWitness.record); }
    else assert.equal(r.domain.ids.length, 3);
  });
});
test("BFS記録中の保存予約域停止はpartial graph・frontier・未知を保持する", () => temp(d => {
  const output = Storage.store(d, { ...caps, maxEvidenceBytes: 100000, storageReserveBytes: 90000 });
  const r = Closure.runFixture(BF.fixture("ABSTRACT-CHAIN-256"), BF.fixture("ABSTRACT-CHAIN-256", true), C.closureLimits, output); output.close();
  assert.equal(r.domain.complete, false); assert.equal(r.solution, null); assert.equal(r.stageStatus, "EVIDENCE-RESERVE-LIMIT"); assert.ok(r.domain.frontier.length);
  assert.ok(fs.existsSync(path.join(d, "closure.bin"))); assert.ok(fs.existsSync(path.join(d, "CHECKPOINT.json")));
}));
test("手内microstate RAWの既読も停止witnessへ保存する", () => temp(d => {
  const p = BF.fixture("BAO-RELAY-CAP-1"), q = BF.fixture("BAO-RELAY-CAP-1", true);
  const record = p.adapter.apply(p.state, p.adapter.variants(p.state).moves[0]);
  const hit = M.rawKey({ ...record.microstates[0], winner: null }); assert.notEqual(hit, M.rawKey(p.state));
  const output = Storage.store(d, caps), r = Closure.runFixture(p, q, C.closureLimits, output, new Set([hit])); output.close();
  assert.equal(r.stageStatus, "READ-FIREWALL-HIT"); assert.equal(r.solution, null); assert.equal(r.domain.stopWitness.raw, hit);
  assert.deepEqual(r.domain.stopWitness.record, record);
  const bad = structuredClone(r.domain); bad.stopWitness.record.relays++; assert.throws(() => Closure.verifyEdges(bad, q.adapter), /MISMATCH/);
}));
test("保存辺のmetadata・microstate hash・停止witness改変を独立検算で拒否する", () => temp(d => {
  const q = BF.fixture("BAO-FORCED-WIN", true), output = Storage.store(d, caps), r = Closure.runFixture(BF.fixture("BAO-FORCED-WIN"), q, C.closureLimits, output); output.close();
  for (const mutate of [v => v.edges[0].metadata.turn++, v => v.edges[0].microstateHash = "0".repeat(64), v => v.legal[0].pop()]) {
    const bad = structuredClone(r.domain); mutate(bad); assert.throws(() => Closure.verifyEdges(bad, q.adapter));
  }
}));
test("graph完成後の全体停止でも解をnullに戻し区画完了を主張しない", () => temp(d => {
  const output = Storage.store(d, caps);
  const r = Closure.runFixture(BF.fixture("BAO-FORCED-WIN"), BF.fixture("BAO-FORCED-WIN", true), C.closureLimits, output, new Set(), () => {
    const file = path.join(d, "closure.jsonl");
    if (fs.existsSync(file) && fs.readFileSync(file, "utf8").includes('"kind":"finish"')) throw new S.Stop("GLOBAL-TIME-LIMIT");
  }); output.close();
  assert.equal(r.domain.complete, true); assert.equal(r.interpretationComplete, false); assert.equal(r.solution, null); assert.equal(r.stageStatus, "GLOBAL-TIME-LIMIT");
}));
test("時間・RSSの管理停止を未知のまま閉じる", () => {
  const { budget } = require("../tools/research/g5-branch-envelope/budget.cjs"); let now = 0;
  const b = budget({ maxTotalMs: 10, maxRssBytes: 100, maxDomainMs: 5 }, () => now, () => 1);
  now = 5; assert.throws(() => b.check(0), /TIME-LIMIT/); now = 10; assert.throws(() => b.check(), /GLOBAL/);
  assert.throws(() => budget({ maxTotalMs: 100, maxRssBytes: 1 }, () => 0, () => 2).check(), /RSS/);
});
test("実上限256 MiB・16 MiB reserveと48 MiB分割を別プロセスで検証する", { timeout: 180000 }, () => {
  const script = path.resolve(__dirname, "../tools/research/g5-branch-envelope/capacity-smoke.cjs");
  for (const mode of ["boundary", "shards"]) {
    const result = JSON.parse(cp.execFileSync(process.execPath, [script, mode], { encoding: "utf8", timeout: 90000 }));
    if (mode === "boundary") assert.equal(result.totalBytes, 268435456); else assert.equal(result.shardBytes.length, 6);
  }
});
