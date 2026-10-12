"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const C = require("../tools/research/g5-01/development/core.cjs");
const R = require("../tools/research/g5-01/development/run.cjs");
const V = require("../tools/research/g5-01/development/verify.cjs");
const L = require("../tools/research/g5-01/development/lease.cjs");
const P = require("../tools/research/g5-01/transition/runtime-engine.cjs");
const M = require("../tools/research/g5-01/measurement.cjs");
const fixture = require("../tools/engineering/browser/pbai-p9/fixtures.json").rows.find(f => f.name === "forced-win").state;
const resources = { maxStates: 50, maxEdges: 500, maxDomainMs: 10000, maxMicrostates: 8192 };

test("閉包の上限到達は未完として保持し、完全な小領域だけを解く", () => {
  const complete = C.buildClosure(fixture, resources);
  assert.equal(complete.complete, true); assert.equal(complete.nodes.length, complete.states.length);
  assert.ok(complete.solution); assert.equal(complete.solution.results[complete.rootKey].absoluteWinner, 1);
  const capped = C.buildClosure(fixture, { ...resources, maxStates: 1 });
  assert.equal(capped.status, "STATE-LIMIT"); assert.equal(capped.complete, false); assert.equal(capped.solution, null);
  const edgeStop = C.buildClosure(fixture, { ...resources, maxEdges: 0 }); assert.equal(edgeStop.status, "EDGE-LIMIT");
  const timeStop = C.buildClosure(fixture, { ...resources, maxDomainMs: -1 }); assert.equal(timeStop.status, "TIME-LIMIT");
});
test("共有する閉包を連結domain群として数える", () => {
  assert.deepEqual(C.domainGroups([{ states: [{ id: "a" }, { id: "b" }] },
    { states: [{ id: "c" }] }, { states: [{ id: "b" }, { id: "d" }] }]), [[0,2],[1]]);
});
test("source規則は同じ記録を独立再生でき、draw改変を拒否する", () => {
  // seed 123は固定technical control。科学的割当区画は使わない。
  const spec = { minPly: 48, maxPly: 2, minWidth: 2, maxWidth: 12,
    maxOccupied: 12, maxSmallFront: 8, maxMicrostates: 8192 };
  const source = C.generateSource(123, spec, new Set());
  assert.equal(source.trace.length, 2); assert.equal(source.stop, "PLY-LIMIT");
  assert.doesNotThrow(() => V.replay(source, spec, new Set()));
  const bad = structuredClone(source); bad.trace[0].draws[0]++;
  assert.throws(() => V.replay(bad, spec, new Set()));
});
test("root選定は実行前の状態条件だけを使う", () => {
  const spec = { minPly: 48, minWidth: 2, maxWidth: 12, maxOccupied: 12, maxSmallFront: 8 };
  const s = { ...structuredClone(fixture), takasia: null }, width = P.moveVariantsForSearch(s).length;
  assert.equal(C.eligible(s, 47, width, spec), false);
  assert.equal(C.eligible(s, 48, width, spec), V.canSelect(s, 48, width, spec));
  assert.ok(C.technicalFirewall().has(M.rawKey(s)));
});
test("leaseはrun・attempt・ソース結合と区画を固定し、再試行を拒否する", () => {
  const b = R.binding();
  const env = { GITHUB_ACTIONS: "true", GITHUB_REF_NAME: "research/g5-01-measurement-readiness",
    GITHUB_RUN_ID: "123", GITHUB_RUN_ATTEMPT: "1", GITHUB_SHA: "technical-trigger" };
  const trigger = { binding: b.digest, stageId: b.spec.stageId, frozenSourceCommit: "technical-frozen" };
  const lease = L.leaseRecord(env, b, trigger); assert.doesNotThrow(() => R.checkLease(lease, b, env));
  for (const extra of [{ GITHUB_ACTIONS: "false" }, { GITHUB_RUN_ID: "124" }, { GITHUB_SHA: "different" }]) {
    assert.throws(() => R.checkLease(lease, b, { ...env, ...extra }));
  }
  assert.throws(() => L.leaseRecord({ ...env, GITHUB_RUN_ATTEMPT: "2" }, b, trigger));
  assert.throws(() => L.leaseRecord(env, b, { ...trigger, binding: "different" }));
});
