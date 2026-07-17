"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
  buildCorpus,
  validateCorpus,
} = require("../tools/experiments/generate-joseki-continuation-corpus.js");
const {
  FIXED_THRESHOLDS,
  HORIZONS,
  playContinuation,
  resultConditions,
} = require("../tools/experiments/run-joseki-continuations.js");
const { replay } = require("../tools/experiments/verify-joseki-continuations.js");
const { summarizeRows } = require("../tools/experiments/analyze-joseki-continuations.js");

assert.deepEqual(HORIZONS, [120, 180]);
assert.equal(FIXED_THRESHOLDS.horizon180TerminalRateMinimum, 0.75);
assert.equal(FIXED_THRESHOLDS.scoreWinnerAgreementMinimum, 0.60);
assert.equal(FIXED_THRESHOLDS.horizonWinnerFlipRateMaximum, 0.10);
assert.equal(resultConditions().length, 12);

const treeFile = "artifacts/joseki-study/corpus/candidate-tree-8ply.json";
const summaryFile = "artifacts/joseki-study/summaries/phase-4-summary.json";
const phase2 = "artifacts/joseki-study/phase-4";
const tree = JSON.parse(fs.readFileSync(treeFile, "utf8"));
const summary = JSON.parse(fs.readFileSync(summaryFile, "utf8"));
const first = buildCorpus(tree, summary, phase2, treeFile);
const second = buildCorpus(tree, summary, phase2, treeFile);
assert.equal(first.corpusHash, second.corpusHash);
assert.equal(first.entries.length, 3);
assert.deepEqual(first.entries.map(({ sourceConditions }) => sourceConditions.length).sort(), [1, 2, 3]);
assert.equal(validateCorpus(first, tree, summary, phase2), true);

const condition = {
  id: "fixture",
  baseConditionId: "bao-d1",
  horizon: 10,
  config: {
    conditionId: "fixture",
    baseConditionId: "bao-d1",
    level: "hard",
    searchProfile: "phase2",
    evaluationProfile: "bao",
    maxDepth: 1,
    timeLimitMs: "Infinity",
    maxTotalPlies: 10,
  },
};
const result = playContinuation(first.entries[0], condition, tree.treeHash);
assert.equal(result.openingPlies, 8);
assert.ok(result.continuationPlies <= 2);
assert.equal(result.totalPlies, result.openingPlies + result.continuationPlies);
assert.equal(replay(first.entries[0], result), true);

const rows = [
  { winner: 0, predictedWinner: 0, continuationPlies: 10 },
  { winner: 1, predictedWinner: 0, continuationPlies: 20 },
  { winner: null, predictedWinner: 1, continuationPlies: 30 },
];
const aggregate = summarizeRows(rows, "fixture", "fixture");
assert.equal(aggregate.terminalRate, 2 / 3);
assert.equal(aggregate.scoreWinnerAgreementRate, 0.5);
assert.equal(aggregate.averageContinuationPlies, 20);

console.log("Joseki continuation tests passed");
