"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Contract = require("../tools/experiments/lib/blunder-misvaluation-stage1-contract.js");
const Validator = require("../tools/experiments/validate-blunder-misvaluation-stage1-spec.js");

const ROOT = path.resolve(__dirname, "..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
);

assert.equal(Contract.STAGE1_ID, "BMP-S1-EXPLORATORY-2026-08-20-v1");
assert.equal(Contract.GAME_COUNT, 2048);
assert.equal(Contract.SEED_START, 22400001);
assert.equal(Contract.SEED_END, 22402048);
assert.deepEqual(Contract.PHASE_QUOTA, { namua: 600, mtaji: 600 });
assert.equal(Contract.PRIMARY_REFERENCE.depth, 3);
assert.equal(Contract.PRIMARY_REFERENCE.quiescenceDepth, 1);
assert.equal(Contract.PRIMARY_REFERENCE.evaluationProfile, "bao");

const loaded = Validator.loadSpec(SPEC_PATH);
assert.equal(Validator.validateSpec(loaded.spec), true);
assert.match(loaded.specSha256, /^[0-9a-f]{64}$/);

const matcherA = Contract.matcherKey({
  phase: "mtaji",
  preconditionTokens: [
    { family: "reusablePitsBins", value: "0-2" },
    { family: "legalMoveCountBins", value: "3-4" },
  ],
  moveAbstractionMode: "coarse-no-index",
  moveAbstractionKey: "{\"type\":\"takata\",\"row\":1,\"direction\":\"right\"}",
});
const matcherB = Contract.matcherKey({
  phase: "mtaji",
  preconditionTokens: [
    { family: "legalMoveCountBins", value: "3-4" },
    { family: "reusablePitsBins", value: "0-2" },
  ],
  moveAbstractionMode: "coarse-no-index",
  moveAbstractionKey: "{\"type\":\"takata\",\"row\":1,\"direction\":\"right\"}",
});
assert.equal(matcherA, matcherB, "precondition order must not change matcher identity");

assert.throws(() => Contract.matcherKey({
  phase: "mtaji",
  preconditionTokens: [
    { family: "legalMoveCountBins", value: "2" },
    { family: "legalMoveCountBins", value: "3-4" },
  ],
  moveAbstractionMode: "indexed",
  moveAbstractionKey: "x",
}), /At most one precondition token per family/);

const candidateA = Contract.candidateKey({
  phase: "namua",
  preconditionTokens: [{ family: "captureRegime", value: "mixed" }],
  moveAbstractionMode: "indexed",
  moveAbstractionKey: "move-A",
  failureToken: "d2TopSetAndD3NonTop",
});
const candidateB = Contract.candidateKey({
  phase: "namua",
  preconditionTokens: [{ family: "captureRegime", value: "mixed" }],
  moveAbstractionMode: "indexed",
  moveAbstractionKey: "move-A",
  failureToken: "actorLegalMoveDeltaNegative",
});
assert.notEqual(candidateA, candidateB, "failure signature must remain part of candidate identity");
assert.equal(Contract.failureFamilyForToken("d2TopSetAndD3NonTop"), "horizon-misvaluation");
assert.equal(Contract.failureFamilyForToken("staticTopSetAndD3NonTop"), "static-misvaluation");

assert.equal(Contract.patternComplexity({
  preconditionTokens: [{ family: "captureRegime", value: "mixed" }],
  moveAbstractionMode: "coarse-no-index",
}), 1);
assert.equal(Contract.patternComplexity({
  preconditionTokens: [
    { family: "captureRegime", value: "mixed" },
    { family: "legalMoveCountBins", value: "3-4" },
  ],
  moveAbstractionMode: "indexed",
}), 3);

assert.equal(Contract.d3InferiorEvent({
  isTopSet: false,
  isBelowStateMedian: true,
  decisionLoss: { crossDomain: false, domainDrop: 0 },
}), true);
assert.equal(Contract.d3InferiorEvent({
  isTopSet: false,
  isBelowStateMedian: false,
  decisionLoss: { crossDomain: true, domainDrop: 1 },
}), true);
assert.equal(Contract.d3InferiorEvent({
  isTopSet: false,
  isBelowStateMedian: false,
  decisionLoss: { crossDomain: false, domainDrop: 0 },
}), false);
assert.equal(Contract.d3InferiorEvent({
  isTopSet: true,
  isBelowStateMedian: true,
  decisionLoss: { crossDomain: false, domainDrop: 0 },
}), false);

const support1 = [
  { historicalTrajectoryHash: "t2", ruleStateKey: "r2", moveKey: "m2" },
  { historicalTrajectoryHash: "t1", ruleStateKey: "r1", moveKey: "m1" },
];
const support2 = support1.slice().reverse();
assert.equal(Contract.supportIdentityHash(support1), Contract.supportIdentityHash(support2),
  "support identity must be order independent");

const passingSummary = {
  opportunityUniqueHistoricalTrajectories: 30,
  opportunityUniqueRuleStates: 30,
  failurePositiveUniqueHistoricalTrajectories: 21,
  distinctOpeningPrefixes: 8,
  maximumSingleOpeningPrefixShare: 0.25,
  generationStrata: 4,
  maximumSingleGenerationStratumShare: 0.40,
  failureSignatureRate: 0.70,
  d3InferiorRate: 0.75,
  d3TopSetRate: 0.10,
  medianNormalizedRankLoss: 0.60,
};
assert.equal(Contract.candidatePassesPromotion(passingSummary), true);

for (const [field, value] of [
  ["opportunityUniqueHistoricalTrajectories", 23],
  ["opportunityUniqueRuleStates", 23],
  ["failurePositiveUniqueHistoricalTrajectories", 15],
  ["distinctOpeningPrefixes", 5],
  ["maximumSingleOpeningPrefixShare", 0.41],
  ["generationStrata", 2],
  ["maximumSingleGenerationStratumShare", 0.61],
  ["failureSignatureRate", 0.64],
  ["d3InferiorRate", 0.69],
  ["d3TopSetRate", 0.21],
  ["medianNormalizedRankLoss", 0.49],
]) {
  assert.equal(Contract.candidatePassesPromotion({ ...passingSummary, [field]: value }), false,
    `promotion must fail when ${field} crosses frozen gate`);
}

const specText = fs.readFileSync(SPEC_PATH, "utf8");
assert.equal(Contract.sha256Text(specText), loaded.specSha256);

console.log("Blunder / misvaluation Stage 1 contract tests passed");
