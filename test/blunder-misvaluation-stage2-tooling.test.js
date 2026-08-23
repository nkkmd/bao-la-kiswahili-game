"use strict";

const assert = require("node:assert/strict");
const Formal = require("../tools/experiments/lib/blunder-misvaluation-stage2-formal.js");
const Validator = require("../tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js");

function approximate(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

function testContract() {
  const result = Validator.validate();
  assert.equal(result.passed, true);
  assert.equal(result.independentMeasurementVerificationRequired, true);
}

function testFrozenFailureTokens() {
  const record = {
    transition: {
      actorDelta: {
        legalMoveCount: -2,
        captureMoveCount: -1,
      },
    },
    responseEnvelope: {
      replyCount: 3,
      actorDeltaFromRoot: {
        frontConnections: { min: -2, max: 1, mean: -0.5 },
        captureMoveCount: { min: -3, max: -1, mean: -2 },
      },
    },
  };
  const candidates = [
    ["worstReplyActorFrontConnectionsDeltaNegative", true],
    ["actorCaptureMoveDeltaNegative", true],
    ["actorLegalMoveDeltaNegative", true],
    ["allRepliesActorCaptureMoveDeltaNegative", true],
  ];
  for (const [failureToken, expected] of candidates) {
    assert.equal(Formal.failureTokenHolds(record, { failureToken }), expected);
  }

  const notAllReplies = JSON.parse(JSON.stringify(record));
  notAllReplies.responseEnvelope.actorDeltaFromRoot.captureMoveCount.max = 0;
  assert.equal(Formal.failureTokenHolds(
    notAllReplies,
    { failureToken: "allRepliesActorCaptureMoveDeltaNegative" },
  ), false);
  assert.throws(() => Formal.failureTokenHolds(record, { failureToken: "unexpected-token" }));
}

function testExactBinomialAndHolm() {
  approximate(Formal.exactBinomialUpper(4, 4, 0.5), 0.0625);
  approximate(Formal.exactBinomialUpper(0, 4, 0.5), 1);
  const adjusted = Formal.holmBonferroni([
    { id: "a", pValue: 0.001 },
    { id: "b", pValue: 0.01 },
    { id: "c", pValue: 0.03 },
  ], 0.05);
  approximate(adjusted.find((x) => x.id === "a").adjustedPValue, 0.003);
  approximate(adjusted.find((x) => x.id === "b").adjustedPValue, 0.02);
  approximate(adjusted.find((x) => x.id === "c").adjustedPValue, 0.03);
  assert.equal(adjusted.every((x) => x.rejected), true);
}

function testEstimabilityAndDecision() {
  const spec = {
    estimabilityGates: {
      minimumOpportunityUniqueHistoricalTrajectories: 96,
      minimumOpportunityUniqueRuleStates: 96,
      minimumDistinctOpeningPrefixes: 48,
      maximumSingleOpeningPrefixShare: 0.1,
      minimumGenerationStrata: 4,
      maximumSingleGenerationStratumShare: 0.5,
    },
    coPrimaryEndpoints: [
      { id: "failure-signature-recurrence", minimumObservedRateForConfirmation: 0.65 },
      { id: "d3-inferior-recurrence", minimumObservedRateForConfirmation: 0.70 },
    ],
    multiplicity: { familyWiseAlpha: 0.05 },
    consistencyGates: {
      maximumD3TopSetRate: 0.2,
      minimumMedianNormalizedRankLoss: 0.5,
    },
  };
  const summary = {
    formalCandidateId: "BMP-S2-CXX",
    technicalIntegrityPassed: true,
    uniqueHistoricalTrajectories: 100,
    uniqueRuleStates: 100,
    distinctOpeningPrefixes: 80,
    maximumSingleOpeningPrefixShare: 0.04,
    generationStrata: 6,
    maximumSingleGenerationStratumShare: 0.2,
    failureSignatureRate: 0.8,
    d3InferiorRate: 0.75,
    d3TopSetRate: 0.1,
    medianNormalizedRankLoss: 0.6,
  };
  summary.estimabilityGates = Formal.estimabilityGates(summary, spec);
  assert.equal(Object.values(summary.estimabilityGates).every(Boolean), true);
  const endpoints = [
    { endpoint: "failure-signature-recurrence", adjustedPValue: 0.01 },
    { endpoint: "d3-inferior-recurrence", adjustedPValue: 0.02 },
  ];
  assert.equal(Formal.candidateDecision(summary, endpoints, spec), "CONFIRMED");
  assert.equal(Formal.candidateDecision(
    { ...summary, d3InferiorRate: 0.69 }, endpoints, spec,
  ), "NOT-CONFIRMED");
  const nonEstimable = { ...summary, uniqueHistoricalTrajectories: 95 };
  nonEstimable.estimabilityGates = Formal.estimabilityGates(nonEstimable, spec);
  assert.equal(Formal.candidateDecision(nonEstimable, endpoints, spec), "INCONCLUSIVE-NOT-ESTIMABLE");
  assert.equal(Formal.candidateDecision(
    { ...summary, technicalIntegrityPassed: false }, endpoints, spec,
  ), "TECHNICAL-INCONCLUSIVE");
}

testContract();
testFrozenFailureTokens();
testExactBinomialAndHolm();
testEstimabilityAndDecision();
console.log("blunder-misvaluation-stage2-tooling.test.js: PASS");
