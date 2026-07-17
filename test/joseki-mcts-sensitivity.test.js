"use strict";

const assert = require("node:assert/strict");
const { buildTree } = require("../tools/experiments/generate-joseki-tree.js");
const {
  buildSample,
  legalBucket,
  validateSample,
} = require("../tools/experiments/generate-joseki-mcts-sample.js");
const {
  FIXED_THRESHOLDS,
  ITERATIONS,
  SEEDS,
  conditions,
  evaluateNode,
} = require("../tools/experiments/run-joseki-mcts-sensitivity.js");
const { iterationSummary } = require("../tools/experiments/analyze-joseki-mcts-sensitivity.js");

assert.equal(legalBucket(2), "2-4");
assert.equal(legalBucket(5), "5-7");
assert.equal(legalBucket(8), "8+");
assert.equal(legalBucket(1), null);
assert.deepEqual(ITERATIONS, [12, 48, 192]);
assert.deepEqual(SEEDS, [1, 2, 3]);
assert.equal(FIXED_THRESHOLDS.highIterationUnanimousConsensusMinimum, 0.50);
assert.equal(FIXED_THRESHOLDS.unanimousConsensusImprovementMinimum, 0.20);

const tree = buildTree(2);
const first = buildSample(tree, "fixture-tree.json", 1, 2);
const second = buildSample(tree, "fixture-tree.json", 1, 2);
assert.equal(first.sampleHash, second.sampleHash);
assert.equal(first.counts.nodes, 2);
assert.equal(first.counts.strata, 2);
assert.equal(validateSample(first, tree), true);
const damaged = structuredClone(first);
damaged.nodes[0].stateHash = "0".repeat(64);
assert.throws(() => validateSample(damaged, tree), /Sample hash mismatch/);

const selectedConditions = conditions();
assert.equal(selectedConditions.length, 9);
assert.equal(new Set(selectedConditions.map(({ id }) => id)).size, 9);
const selectedNode = tree.nodes.find(({ nodeId }) => nodeId === first.nodes[0].nodeId);
const evaluation = evaluateNode(selectedNode, tree.treeHash, selectedConditions[0]);
assert.equal(evaluation.stats.simulations, 12);
assert.equal(evaluation.legalMoveCount, first.nodes[0].legalMoveCount);
assert.ok(evaluation.stats.mctsRoot.length > 0);

const fake = (move, iterations, phase2MoveKey = "a") => ({
  iterations,
  recommendedMoveKey: move,
  stats: { mctsRoot: [{ moveKey: move, visits: iterations, averageValue: 0 }] },
  phase2MoveKey,
});
const rows = [{
  stratum: "2-4/mixed",
  phase2MoveKey: "a",
  results: [fake("a", 12), fake("a", 12), fake("b", 12)],
}];
const summary = iterationSummary(12, rows, ["2-4/mixed"]);
assert.equal(summary.unanimousConsensusRate, 0);
assert.equal(summary.phase2AgreementRate, 2 / 3);
assert.equal(summary.averageSelectedMoveVisits, 12);

console.log("Joseki MCTS sensitivity tests passed");
