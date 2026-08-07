"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Robustness = require("../tools/experiments/lib/phase-transition-robustness.js");
const Runner = require("../tools/experiments/run-phase-transition-robustness.js");
const Evaluator = require("../tools/experiments/evaluate-phase-transition-robustness.js");

const loaded = Robustness.loadPreregistration(
  path.join(__dirname, "../config/experiments/phase-transition-robustness-v1.json"),
);
assert.equal(loaded.config.experimentId, "E-011");
assert.equal(loaded.config.conditions.length, 5);
assert.equal(loaded.config.corpus.gamesPerCondition, 400);
assert.equal(Robustness.conditionById(loaded.config, "C3").evaluationProfile, "bao-v2");

const supplement = JSON.parse(fs.readFileSync(path.join(
  __dirname,
  "../config/experiments/phase-transition-robustness-v1-trajectory-supplement.json",
), "utf8"));
assert.equal(supplement.status, "preregistered-supplement");
assert.equal(supplement.basePreregistration.sha256, loaded.sha256);
assert.equal(supplement.decisionPolicy.changesOriginalConditionSuccessCriteria, false);
assert.equal(supplement.decisionPolicy.changesOriginalGlobalDecisionRule, false);

const built = Runner.buildConditionConfig(
  loaded.config,
  Robustness.conditionById(loaded.config, "C2"),
  2,
  "fixture",
  loaded.sha256,
);
assert.equal(built.condition.id, "C2");
assert.equal(built.condition.maxDepth, 3);
assert.equal(built.execution.mode, "fixture");
assert.equal(built.execution.actualGames, 2);
assert.equal(built.experiment.preregistrationConfigSha256, loaded.sha256);

const normalized = Runner.normalizeGameIdentity({
  gameIndex: 4,
  gameId: "old",
  conditionId: "C0",
  initialStateHash: "initial",
  openingStateHash: "incorrect-late-state",
  openingPliesApplied: 2,
  observations: [{ gameId: "old", conditionId: "C0" }],
  moves: [
    { source: "opening-random", afterStateHash: "opening-1" },
    { source: "opening-random", afterStateHash: "opening-2" },
    { source: "ai-c0", afterStateHash: "ai-1" },
  ],
}, Robustness.conditionById(loaded.config, "C4"));
assert.equal(normalized.gameId, "pt-e011-c4-0004");
assert.equal(normalized.conditionId, "C4");
assert.equal(normalized.openingStateHash, "opening-2");
assert.equal(normalized.observations[0].conditionId, "C4");
assert.equal(normalized.moves[0].source, "opening-random");
assert.equal(normalized.moves[2].source, "ai-c4");
assert.equal(Runner.openingBoundaryHash({
  initialStateHash: "initial",
  openingPliesApplied: 0,
  moves: [],
}), "initial");

function result({
  candidates = 12,
  expansion = 5,
  controls = 10000,
  riskRatio = 3,
  direction = true,
  decision = "confirmed",
} = {}) {
  return {
    decision,
    counts: {
      primaryCandidates: candidates,
      candidateExpansion: expansion,
      primaryControls: controls,
    },
    rates: { riskRatio },
    checks: {
      minimumPrimaryCandidateCount: candidates >= 12,
      minimumExpansionCandidateCount: expansion >= 5,
      minimumControlPointCount: controls >= 10000,
      minimumRiskRatio: riskRatio >= 3,
      candidateRateGreaterThanControlRate: direction,
    },
  };
}

assert.equal(Robustness.conditionStatus(result()), "pass");
assert.equal(Robustness.conditionStatus(result({ candidates: 11 })), "insufficient");
assert.equal(Robustness.conditionStatus(result({ riskRatio: 2 })), "fail");
assert.equal(Robustness.conditionStatus(result({ decision: "inconclusive" })), "inconclusive");

const csvRows = Evaluator.conditionCsvRows([{
  conditionId: "C0",
  role: "reference",
  status: "pass",
  parameters: {
    level: "hard",
    evaluationProfile: "bao",
    searchProfile: "phase2",
    maxDepth: 2,
  },
  result: result(),
  trajectorySensitivity: {
    trajectoryPlyDeduplicatedEndpoint: {
      counts: { candidates: 5, candidateExpansion: 2, controls: 7000, controlExpansion: 210 },
      rates: { riskRatio: 13 },
    },
    candidateStructure: {
      uniqueTrajectoryCount: 4,
      uniqueExpansionTrajectoryCount: 2,
      uniqueArchetypeCount: 5,
      uniqueExpansionArchetypeCount: 2,
      largestTrajectoryPlyMultiplicity: 6,
    },
  },
}]);
assert.equal(csvRows[0].uniqueTrajectoryPlyCandidates, 5);
assert.equal(csvRows[0].trajectoryPlyDeduplicatedRiskRatio, 13);
assert.equal(csvRows[0].largestTrajectoryPlyMultiplicity, 6);

function conditionResult(conditionId, status, riskRatio = 3) {
  return {
    conditionId,
    status,
    result: { rates: { riskRatio } },
  };
}

const allPass = loaded.config.conditions.map((condition) =>
  conditionResult(condition.id, "pass"));
assert.equal(Robustness.globalDecision(loaded.config, allPass), "robust");

const partial = allPass.map((item) => ({ ...item }));
partial.find((item) => item.conditionId === "C4").status = "insufficient";
assert.equal(Robustness.globalDecision(loaded.config, partial), "partially-robust");

const twoFailures = allPass.map((item) => ({ ...item }));
twoFailures.find((item) => item.conditionId === "C3").status = "fail";
twoFailures.find((item) => item.conditionId === "C4").status = "fail";
assert.equal(Robustness.globalDecision(loaded.config, twoFailures), "not-robust");

const oneFailure = allPass.map((item) => ({ ...item }));
oneFailure.find((item) => item.conditionId === "C4").status = "fail";
assert.equal(Robustness.globalDecision(loaded.config, oneFailure), "inconclusive");

const reversed = allPass.map((item) => ({ ...item }));
const reversedCondition = reversed.find((item) => item.conditionId === "C2");
reversedCondition.status = "fail";
reversedCondition.result.rates.riskRatio = 0.8;
assert.equal(Robustness.globalDecision(loaded.config, reversed), "not-robust");

const missing = allPass.filter((item) => item.conditionId !== "C4");
assert.equal(Robustness.globalDecision(loaded.config, missing), "inconclusive");

console.log("phase transition robustness tests passed");
