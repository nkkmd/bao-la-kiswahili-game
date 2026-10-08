"use strict";

// 工程3の合格条件。未対応エンジンではFAILを返し、準備完了と区別する。
const assert = require("node:assert/strict");
const E = require("../../public/engine.js");
const F = require("./fixtures.json");
const O = require("./oracle.cjs");
const results = [];
const check = (id, fn) => {
  try { fn(); results.push({ id, status: "PASS" }); }
  catch (error) { results.push({ id, status: "FAIL", message: error.message }); }
};
const move = (start, step) => ({ row: start < 8 ? 0 : 1,
  index: start < 8 ? start : 15 - start, direction: step === 1 ? "right" : "left",
  type: "takata", phase: "mtaji" });
const total = state => state.pits.flat(2).reduce((a, b) => a + b, 0)
  + state.reserve.reduce((a, b) => a + b, 0) + state.pending.reduce((a, b) => a + b, 0);

check("initial-state", () => assert.equal(E.initialState().takasia, null));
for (const fixture of F.detectionCases) {
  check("detection/" + fixture.id, () => {
    assert.equal(typeof E.detectTakasia, "function", "detectTakasia API is not implemented");
    const original = JSON.stringify(fixture.state);
    assert.deepEqual(E.detectTakasia(fixture.state, fixture.attacker, fixture.previousMove), fixture.expected);
    assert.equal(JSON.stringify(fixture.state), original);
  });
}
check("E30/predecessor", () => {
  const result = E.applyMove(F.e30.predecessor, F.e30.move);
  assert.deepEqual(result.state, F.e30.post);
  assert.deepEqual(E.applyMoveForSearch(F.e30.predecessor, F.e30.move).state, result.state);
});
check("E30/legal-starts", () => {
  const expected = F.e30.responses.map(r => JSON.stringify(move(r.start, r.step))).sort();
  const observed = E.legalMoves(F.e30.post).map(m => JSON.stringify({ row: m.row, index: m.index,
    direction: m.direction, type: m.type, phase: m.phase })).sort();
  assert.deepEqual(observed, expected);
  for (const step of [-1, 1]) assert.throws(() => E.applyMove(F.e30.post, move(3, step)));
});
for (const fixture of [...F.e30.responses.map((r, i) => ({ ...r, id: "E30/reply-" + i,
  state: F.e30.post, expectedPits: r.pits })), ...F.sowingCases]) {
  check(fixture.id, () => {
    const original = JSON.stringify(fixture.state);
    const result = E.applyMove(fixture.state, move(fixture.start, fixture.step));
    const expected = O.playTakata(fixture.state, fixture.start, fixture.step).state;
    assert.deepEqual(result.state, expected);
    assert.deepEqual(result.state.pits[fixture.state.player], fixture.expectedPits);
    assert.deepEqual(E.applyMoveForSearch(fixture.state, move(fixture.start, fixture.step)).state, result.state);
    assert.equal(result.events.filter(e => e.kind === "lift" || e.kind === "relay").length, fixture.sowings);
    assert.ok(result.events.filter(e => e.kind === "lift" || e.kind === "relay")
      .every(e => !(e.position.row === 0 && e.position.index === 3)));
    assert.equal(total(result.state), 64);
    assert.equal(JSON.stringify(fixture.state), original);
  });
}
const failed = results.filter(row => row.status === "FAIL").length;
console.log(JSON.stringify({ status: failed ? "FAIL" : "PASS", checks: results.length,
  passed: results.length - failed, failed, results }, null, 2));
process.exitCode = failed ? 1 : 0;
