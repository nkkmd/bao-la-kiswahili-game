"use strict";

const assert = require("node:assert/strict");
const Evaluator = require("../tools/experiments/evaluate-phase-transition-independent-confirmation.js");

const config = {
  experimentId: "E-017",
  analysisVersion: "test-independent-confirmation",
  status: "preregistered-not-run",
  corpus: {
    profile: "pilot-v2",
    games: 3,
    baseSeed: 100,
    level: "hard",
    evaluationProfile: "bao",
    searchProfile: "phase2",
    maxDepth: 2,
  },
  primaryPopulation: { minimumPliesRemaining: 9 },
  successCriteria: {
    minimumRawPrimaryCandidateRows: 3,
    minimumUniqueCandidateTrajectoryPly: 2,
    minimumUniqueCandidateTrajectories: 2,
    minimumUniqueExpansionTrajectoryPly: 2,
    minimumUniqueExpansionTrajectories: 2,
    minimumUniqueControlTrajectoryPly: 3,
    minimumDeduplicatedRiskRatio: 3,
    requireDeduplicatedCandidateRateGreaterThanControlRate: true,
  },
};

const manifest = {
  completedGames: 3,
  configHash: "fixture-hash",
  config: {
    profile: "pilot-v2",
    games: 3,
    baseSeed: 100,
    condition: {
      level: "hard",
      evaluator: "bao",
      search: "phase2",
      maxDepth: 2,
    },
  },
};

const games = [
  { gameId: "g1", seed: 100, trajectoryHash: "trajectory-a", configHash: "fixture-hash" },
  { gameId: "g2", seed: 101, trajectoryHash: "trajectory-b", configHash: "fixture-hash" },
  { gameId: "g3", seed: 102, trajectoryHash: "trajectory-b", configHash: "fixture-hash" },
];

const candidates = [
  {
    gameId: "g1", candidatePly: "10", distanceToTerminal: "20",
    classification: "capture-branch-expansion", archetypeId: "a1",
  },
  {
    gameId: "g2", candidatePly: "12", distanceToTerminal: "20",
    classification: "capture-branch-expansion", archetypeId: "a2",
  },
  {
    gameId: "g3", candidatePly: "12", distanceToTerminal: "20",
    classification: "capture-branch-expansion", archetypeId: "a2",
  },
];

const controls = [
  {
    gameId: "g1", ply: "20", distanceToTerminal: "20",
    classification: "temporary-spike",
  },
  {
    gameId: "g2", ply: "21", distanceToTerminal: "20",
    classification: "temporary-spike",
  },
  {
    gameId: "g3", ply: "22", distanceToTerminal: "20",
    classification: "capture-branch-expansion",
  },
];

assert.deepEqual(Evaluator.expectedSeeds(config), [100, 101, 102]);

const confirmed = Evaluator.evaluate(
  config, manifest, games, candidates, controls,
);
assert.equal(confirmed.decision, "confirmed");
assert.equal(confirmed.endpoints.raw.counts.candidates, 3);
assert.equal(
  confirmed.endpoints.trajectoryPlyDeduplicated.counts.candidates,
  2,
);
assert.equal(confirmed.candidateStructure.uniqueTrajectoryCount, 2);
assert.equal(confirmed.candidateStructure.uniqueExpansionTrajectoryCount, 2);
assert.equal(
  confirmed.endpoints.trajectoryPlyDeduplicated.rates.riskRatio,
  3,
);

const failedCandidates = candidates.map((row, index) => index === 0
  ? { ...row, classification: "temporary-spike" }
  : row);
const notConfirmed = Evaluator.evaluate(
  config, manifest, games, failedCandidates, controls,
);
assert.equal(notConfirmed.decision, "not-confirmed");
assert.equal(
  notConfirmed.endpointChecks.minimumUniqueExpansionTrajectoryPly,
  false,
);

const inconclusive = Evaluator.evaluate(
  config,
  { ...manifest, completedGames: 2 },
  games,
  candidates,
  controls,
);
assert.equal(inconclusive.decision, "inconclusive");
assert.equal(inconclusive.corpusChecks.manifestCompletedGames, false);

const operationalFailure = Evaluator.inconclusiveResult(
  config,
  new Error("candidate-control-metrics.csv is missing"),
);
assert.equal(operationalFailure.decision, "inconclusive");
assert.match(operationalFailure.error, /candidate-control-metrics/);
const operationalCsv = Evaluator.csvRows(operationalFailure);
assert.equal(operationalCsv[0].decision, "inconclusive");
assert.equal(operationalCsv[0].corpusValid, false);

console.log("phase transition independent confirmation evaluator tests passed");
