"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs");
const E = require("../tools/research/g5-01/transition/runtime-engine.cjs");
const I = require("../tools/research/g5-01/transition/independent-engine.cjs");
const R = require("../tools/research/g5-01/transition/run.cjs");
const F = require("../tools/takasia/fixtures.json");
const K = require("../tools/research/g5-01/measurement.cjs");

test("独立エンジンはimportせず、productionは基準mainのbyteを保持する", () => {
  assert.ok(!fs.readFileSync(require.resolve("../tools/research/g5-01/transition/independent-engine.cjs"), "utf8").includes("require("));
  assert.deepEqual(fs.readFileSync(require.resolve("../tools/research/g5-01/transition/runtime-engine.cjs")),
    fs.readFileSync(require.resolve("../public/engine.js")));
  assert.doesNotThrow(R.binding);
});
test("takasia検出の既知17条件をproductionと独立実装が照合する", () => {
  for (const f of F.detectionCases) assert.deepEqual(I.detectTakasia(f.state, f.attacker, f.previousMove), f.expected, f.id);
});
test("phase省略・誤記を入力のルール変更に使わず、違法開始を拒否する", () => {
  for (const phase of [undefined, "namua"]) {
    const m = { ...F.e30.move, phase };
    assert.deepEqual(R.normalize(I.applyMove(F.e30.predecessor, m).state), R.normalize(F.e30.post));
  }
  const before = structuredClone(F.e30.post);
  assert.throws(() => I.applyMove(F.e30.post, { type: "takata", phase: "mtaji", row: 0, index: 3, direction: "left" }));
  assert.deepEqual(F.e30.post, before);
});
test("nyumba停止・使用は子状態で識別し、pendingの終局保持を独立に計算する", () => {
  const cases = require("../tools/research/g5-01/transition/fixtures.cjs").corpus();
  const house = cases.find(f => f.id === "P9/capture-relay").state;
  assert.ok(I.moveVariants(house).some(m => m.houseChoice === "use"));
  assert.deepEqual(I.moveVariants(house).map(K.moveKey).sort(), E.moveVariantsForSearch(house).map(K.moveKey).sort());
  const terminal = cases.find(f => f.id === "LAST-FRONT-CAPTURE-PENDING").state;
  const m = I.legalMoves(terminal).find(m => m.index === 2 && m.direction === "right");
  const s = I.applyMove(terminal, m).state;
  assert.equal(s.winner, 0); assert.equal(s.pending[0], 3); assert.equal(s.takasia, null);
  assert.deepEqual(s.houseOwned, [false, false]);
});
test("takasia最終着地とruntime上限の優先順・資源停止を区別する", () => {
  const checks = R.boundaryChecks();
  assert.equal(checks[0].runtimeGuard, true); assert.equal(checks[1].runtimeGuard, false);
  assert.equal(checks[2].status, "ADMIN-CUTOFF"); assert.equal(checks[2].winnerAssigned, false);
});
test("固定fixtureと深さ2の全合法遷移が独立実装と一致する", () => {
  const measured = R.measure(R.binding().spec);
  assert.ok(measured.expandedParents > 40); assert.ok(measured.edges > 100);
  assert.equal(measured.transitionAlgorithmsIndependent, true);
  assert.equal(measured.scientificEvidenceAccess, false);
});
