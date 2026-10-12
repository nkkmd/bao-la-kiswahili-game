"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const C = require("../tools/research/g5-04/core.cjs"), V = require("../tools/research/g5-04/verify.cjs");
const R = require("../tools/research/g5-04/run.cjs"), L = require("../tools/research/g5-04/lease.cjs");
const P = require("../tools/research/g5-01/transition/runtime-engine.cjs");
const M = require("../tools/research/g5-01/measurement.cjs");
const fixture = require("../tools/engineering/browser/pbai-p9/fixtures.json").rows.find(x => x.name === "forced-win").state;
const spec = { minPly: 0, maxPly: 2, minWidth: 2, maxWidth: 8, maxOccupied: 32,
  maxSmallFront: 64, probeDepth: 4, probeMaxWidth: 8, excludedShortDepth: 2, maxMicrostates: 8192 };
test("全手即終局fixtureは完全構造で独立一致し、勝敗解は別途照合する", () => {
  const p = C.probe(fixture, spec); assert.equal(p.status, "PROBE-COMPLETE");
  assert.equal(p.states.length, 3); assert.equal(p.edges.length, 2);
  assert.deepEqual(p, V.independentProbe(fixture, spec));
  assert.equal(C.screen(fixture, spec).status, "SCREEN-SHORT-EXCLUDED");
  assert.deepEqual(C.screen(fixture, spec), V.independentScreen(fixture, spec));
  const d = C.buildClosure(fixture, { maxStates: 4681, maxEdges: 4680, maxDomainMs: 10000, maxMicrostates: 8192 });
  assert.equal(d.complete, true); assert.equal(d.solution.results[d.rootKey].absoluteWinner, 1);
});
test("非終局の深さ境界は未閉包とし、DRAWや厳密解を付けない", () => {
  const p = C.probe(fixture, { ...spec, probeDepth: 0 });
  assert.equal(p.status, "PROBE-DEPTH-NOT-CLOSED"); assert.equal(p.edges.length, 0);
  assert.deepEqual(p, V.independentProbe(fixture, { ...spec, probeDepth: 0 }));
});
test("全合法手を保持し、幅超過と手内部上限を構造不成立と分離する", () => {
  const narrow = { ...spec, probeMaxWidth: 1 };
  assert.equal(C.probe(fixture, narrow).status, "PROBE-WIDTH-EXCLUDED");
  assert.deepEqual(C.probe(fixture, narrow), V.independentProbe(fixture, narrow));
  const cut = { ...spec, maxMicrostates: 1 };
  const relay = require("../tools/research/g5-01/transition/fixtures.cjs").corpus().find(f => f.id === "P9/capture-relay").state;
  assert.equal(C.probe(relay, cut).status, "PROBE-ADMIN-CUTOFF");
  assert.deepEqual(C.probe(relay, cut), V.independentProbe(relay, cut));
});
test("旧証拠は3 Studyの47483状態の和集合で、閉包への接触は解を拒否する", () => {
  const prior = C.priorFirewall(); assert.equal(prior.size, 47483); assert.ok(prior.has(M.rawKey(fixture)));
  const d = C.buildClosure(fixture, { maxStates: 4681, maxEdges: 4680, maxDomainMs: 10000, maxMicrostates: 8192 }, () => {}, prior);
  assert.equal(d.status, "PRIOR-READ-OVERLAP"); assert.equal(d.solution, null);
});
test("technical seed 123の保存sourceを独立再生し、draw改変を拒否する", () => {
  const source = C.generateSource(123, spec, new Set());
  assert.equal(source.stop, "PLY-LIMIT"); assert.equal(source.trace.length, 2);
  assert.doesNotThrow(() => V.replay(source, spec, new Set()));
  const bad = structuredClone(source); bad.trace[0].draws[0]++;
  assert.throws(() => V.replay(bad, spec, new Set()));
});
test("sourceの事前条件はmtajiと全手幅だけに依存し、phaseを限定する", () => {
  const width = P.moveVariantsForSearch(fixture).length;
  assert.equal(C.eligible(fixture, 0, width, spec), true);
  assert.equal(V.canSelect(fixture, 0, width, spec), true);
  assert.equal(C.eligible(P.initialState(), 0, 2, spec), false);
});
test("共有閉包は独立標本数に数えず、状態上限はnullで保存する", () => {
  assert.deepEqual(C.domainGroups([{ states: [{ id: "a" }] }, { states: [{ id: "a" }] }]), [[0,1]]);
  const d = C.buildClosure(fixture, { maxStates: 1, maxEdges: 4680, maxDomainMs: 10000, maxMicrostates: 8192 });
  assert.equal(d.status, "STATE-LIMIT"); assert.equal(d.solution, null); assert.ok(d.stopWitness.raw);
});
test("凍結仕様とleaseはrun・attempt・区画を結合し、二度目を拒否する", () => {
  const b = R.binding(); assert.equal(b.spec.closure.maxStates, 4681);
  const env = { GITHUB_ACTIONS: "true", GITHUB_REF_NAME: "research/g5-04-terminal-span-supply",
    GITHUB_RUN_ID: "123", GITHUB_RUN_ATTEMPT: "1", GITHUB_SHA: "technical-trigger" };
  const trigger = { binding: b.digest, stageId: b.spec.stageId, frozenSourceCommit: "technical-freeze" };
  const lease = L.leaseRecord(env, b, trigger); assert.doesNotThrow(() => R.checkLease(lease, b, env));
  assert.throws(() => L.leaseRecord({ ...env, GITHUB_RUN_ATTEMPT: "2" }, b, trigger));
  assert.throws(() => R.checkLease(lease, b, { ...env, GITHUB_SHA: "different" }));
});

test("二段階判定は短期層を除外し、3〜4手層と異常停止を区別する", () => {
  // これは抽象的な構造判定fixtureであり、Bao局面・科学的証拠ではない。
  const fake = status => ({ rootKey: "abstract", status, states: [], edges: [] });
  for (const final of ["PROBE-COMPLETE", "PROBE-DEPTH-NOT-CLOSED", "PROBE-WIDTH-EXCLUDED", "PROBE-ADMIN-CUTOFF"]) {
    const run = (_state, cfg) => fake(cfg.probeDepth === 2 ? "PROBE-DEPTH-NOT-CLOSED" : final);
    const actual = C.screen({}, spec, () => {}, run);
    assert.deepEqual(actual, V.independentScreen({}, spec, run));
    assert.deepEqual(actual.probes.map(p => p.depth), [2,4]);
    assert.equal(actual.status, ({ "PROBE-COMPLETE": "SCREEN-COMPLETE", "PROBE-DEPTH-NOT-CLOSED": "SCREEN-DEPTH-NOT-CLOSED", "PROBE-WIDTH-EXCLUDED": "SCREEN-WIDTH-EXCLUDED" })[final] ?? final);
  }
  const fatal = C.screen({}, spec, () => {}, () => fake("PROBE-ADMIN-CUTOFF"));
  assert.equal(fatal.probes.length, 1); assert.equal(fatal.status, "PROBE-ADMIN-CUTOFF");
});
