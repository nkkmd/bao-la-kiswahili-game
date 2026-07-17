"use strict";

const assert = require("node:assert/strict");
const {
  averageRanks,
  buildSummary,
  groupSummary,
  houseClass,
  legalBucket,
  markdown,
  mean,
  median,
  pearson,
  spearman,
} = require("../tools/experiments/analyze-joseki-position-patterns.js");

assert.equal(mean([1, 2, 3]), 2);
assert.equal(median([3, 1, 2]), 2);
assert.equal(median([4, 1, 3, 2]), 2.5);
assert.deepEqual(averageRanks([10, 10, 20]), [1.5, 1.5, 3]);
assert.equal(pearson([1, 2, 3], [2, 4, 6]), 1);
assert.equal(spearman([1, 2, 3], [9, 5, 1]), -1);
assert.equal(legalBucket(0), "terminal");
assert.equal(legalBucket(1), "forced-move");
assert.equal(legalBucket(4), "2-4");
assert.equal(legalBucket(7), "5-7");
assert.equal(legalBucket(8), "8+");
assert.equal(houseClass([true, true]), "both-owned");
assert.equal(houseClass([true, false]), "south-only");
assert.equal(houseClass([false, true]), "north-only");
assert.equal(houseClass([false, false]), "neither-owned");

const base = {
  stateHash: "state",
  moveKeys: ["move"],
  phase2MoveKey: "a",
  phase2ConditionUnanimous: false,
  phase2BaselineAgreementRate: 0.5,
  mctsUnanimous: false,
  mctsPhase2AgreementRate: 1 / 3,
  southHouseOwned: true,
  boardSeedDifference: 0,
  frontSeedDifference: 0,
  nyumbaSeedDifference: 0,
};
const rows = [
  { ...base, nodeId: "a", legalMoveCount: 2, legalBucket: "2-4", forcedCapture: true,
    houseClass: "south-only", baoD2Score: -10 },
  { ...base, nodeId: "b", legalMoveCount: 8, legalBucket: "8+", forcedCapture: false,
    houseClass: "neither-owned", southHouseOwned: false, baoD2Score: 20, mctsUnanimous: true },
];
const group = groupSummary(rows, "all", "all");
assert.equal(group.nodes, 2);
assert.equal(group.score.mean, 5);
assert.equal(group.score.median, 5);
assert.equal(group.score.positiveRate, 0.5);

const summary = buildSummary({
  tree: { treeHash: "tree" },
  rows,
  phase2Verification: { verificationHash: "phase2" },
  mctsVerification: { verificationHash: "mcts" },
}, {});
assert.equal(summary.integrity.nodes, 2);
assert.equal(summary.counterexamples.lowBranchForcedMctsDisagreement[0].nodeId, "a");
assert.equal(summary.counterexamples.highBranchMctsUnanimity[0].nodeId, "b");
assert.match(markdown(summary), /8 ply局面パターン/);

console.log("Joseki position pattern tests passed");
