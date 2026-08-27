"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Legacy = require("../tools/experiments/lib/position-complexity-search-diagnostic.js");
const SRDR = require("../tools/experiments/lib/search-reliability-decision-robustness.js");

const BASE_OPTIONS = {
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
  legalMoveOrdering: "engine",
};

function forcedWinFixture() {
  return {
    pits: [
      [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
      [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
    ],
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 1,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 50,
    pending: [0, 0],
  };
}

function scoreMap(result) {
  return Object.fromEntries(result.candidates.map(({ moveKey, score }) => [moveKey, score]));
}

function compareLegacy(state, depth) {
  const legacy = Legacy.analyzeRootCandidates(state, depth, BASE_OPTIONS);
  const current = SRDR.analyzeExactCondition(state, depth, BASE_OPTIONS).result;
  assert.equal(current.bestScore, legacy.bestScore, `best score agrees at depth ${depth}`);
  assert.deepEqual(current.topSetMoveKeys, legacy.topSetMoveKeys, `TopSet agrees at depth ${depth}`);
  assert.deepEqual(scoreMap(current), scoreMap(legacy), `all root candidate scores agree at depth ${depth}`);
}

{
  const state = E.initialState();
  const before = JSON.stringify(state);
  for (const depth of [1, 2, 3]) compareLegacy(state, depth);
  assert.equal(JSON.stringify(state), before, "controlled search does not mutate source state");
}

{
  const state = forcedWinFixture();
  compareLegacy(state, 4);
  const result = SRDR.analyzeExactCondition(state, 4, BASE_OPTIONS);
  assert.equal(result.result.bestScoreClass, "root-win-mate-domain");
  assert.equal(result.principalVariation.moveKeys[0], result.result.canonicalBestMoveKey);
  assert.equal(result.principalVariation.score, result.result.bestScore);
}

{
  const state = E.initialState();
  const first = SRDR.analyzeExactCondition(state, 3, BASE_OPTIONS);
  const second = SRDR.analyzeExactCondition(state, 3, BASE_OPTIONS);
  assert.deepEqual(first, second, "identical exact conditions are deterministic");
  assert.equal(first.principalVariation.moveKeys[0], first.result.canonicalBestMoveKey);
  assert.ok(first.principalVariation.nominalPlyLength >= 1 && first.principalVariation.nominalPlyLength <= 3);
}

{
  const state = E.initialState();
  const d1 = SRDR.analyzeExactCondition(state, 1, BASE_OPTIONS).nodeBudgetUsed;
  const d2 = SRDR.analyzeExactCondition(state, 2, BASE_OPTIONS).nodeBudgetUsed;
  const d3 = SRDR.analyzeExactCondition(state, 3, BASE_OPTIONS).nodeBudgetUsed;
  assert.ok(d1 > 1 && d2 > d1 && d3 > d2, "technical fixture has increasing exact search costs");

  const belowD1 = SRDR.analyzeBudgetCondition(state, 3, d1 - 1, BASE_OPTIONS);
  assert.equal(belowD1.estimable, false);
  assert.equal(belowD1.completedDepth, 0);
  assert.equal(belowD1.nonEstimableReason, "NODE_BUDGET_BELOW_COMPLETE_DEPTH1_ROOT_ITERATION");

  const beforeD2 = SRDR.analyzeBudgetCondition(state, 3, d1 + d2 - 1, BASE_OPTIONS);
  assert.equal(beforeD2.completedDepth, 1, "partial depth-2 iteration is discarded");
  const throughD2 = SRDR.analyzeBudgetCondition(state, 3, d1 + d2, BASE_OPTIONS);
  assert.equal(throughD2.completedDepth, 2, "exact cumulative budget completes depth 2");
  const throughD3 = SRDR.analyzeBudgetCondition(state, 3, d1 + d2 + d3, BASE_OPTIONS);
  assert.equal(throughD3.completedDepth, 3, "exact cumulative budget completes depth 3");
  assert.deepEqual(scoreMap(throughD2.result), scoreMap(SRDR.analyzeExactCondition(state, 2, BASE_OPTIONS).result));
}

{
  const state = E.initialState();
  const engineOrder = SRDR.analyzeExactCondition(state, 2, { ...BASE_OPTIONS, legalMoveOrdering: "engine" });
  const canonical = SRDR.analyzeExactCondition(state, 2, { ...BASE_OPTIONS, legalMoveOrdering: "canonical" });
  const reverse = SRDR.analyzeExactCondition(state, 2, { ...BASE_OPTIONS, legalMoveOrdering: "reverse-canonical" });
  assert.deepEqual(scoreMap(engineOrder.result), scoreMap(canonical.result), "exact scores are invariant to canonical ordering");
  assert.deepEqual(scoreMap(engineOrder.result), scoreMap(reverse.result), "exact scores are invariant to reverse ordering");
}

{
  const state = E.initialState();
  const unordered = SRDR.analyzeExactCondition(state, 2, { ...BASE_OPTIONS, orderQuiescenceCaptures: false });
  const ordered = SRDR.analyzeExactCondition(state, 2, { ...BASE_OPTIONS, orderQuiescenceCaptures: true });
  assert.deepEqual(scoreMap(unordered.result), scoreMap(ordered.result),
    "quiescence capture ordering does not alter exact complete-depth root scores");
}

{
  const state = E.initialState();
  const originalIdentity = SRDR.rawIdentityKey(state);
  const administrativeCopy = JSON.parse(JSON.stringify(state));
  administrativeCopy.turn = (administrativeCopy.turn || 0) + 999;
  administrativeCopy.reason = "administrative-only-change";
  assert.equal(SRDR.rawIdentityKey(administrativeCopy), originalIdentity,
    "turn/reason remain outside authoritative RAW identity");
  const scientificCopy = JSON.parse(JSON.stringify(state));
  scientificCopy.pending = [1, 0];
  assert.notEqual(SRDR.rawIdentityKey(scientificCopy), originalIdentity,
    "pending remains inside authoritative RAW identity");
}

console.log("Search Reliability / Decision Robustness Stage 0 tests passed");
