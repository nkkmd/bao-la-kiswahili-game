"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "doc/position-evaluation-empirical-outcome-calibration-replication");

const s0 = JSON.parse(fs.readFileSync(path.join(DIR, "preregistration/STAGE_0_TECHNICAL_SPEC.json"), "utf8"));
const s1 = JSON.parse(fs.readFileSync(path.join(DIR, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json"), "utf8"));
const s2 = JSON.parse(fs.readFileSync(path.join(DIR, "preregistration/STAGE_2_FORMAL_SPEC.json"), "utf8"));
const protocol = fs.readFileSync(path.join(DIR, "STUDY_1_PROTOCOL.md"), "utf8");
const decision = fs.readFileSync(path.join(DIR, "DECISION_REGISTER.md"), "utf8");

for (const spec of [s0, s1, s2]) {
  assert.equal(spec.studyId, "PEOCR-STUDY1");
  assert.equal(spec.programLabel, "G2-01");
  assert.equal(spec.researchGeneration, "Research Generation 2");
  assert.equal(spec.baselineMainHead, "9e9cb6e2525f09a873e741db9f8fa42696839fbe");
}

assert.equal(s0.scientificInferenceAuthorized, false);
assert.equal(s0.scientificOutcomeGenerationAuthorized, false);
assert.equal(s0.quarantinedSmokeSeeds.scientificReuseAllowed, false);

assert.equal(s1.stage1GenerationAuthorized, false);
assert.equal(s1.generation1Boundary.upstreamFormalDecision, "INCONCLUSIVE");
assert.equal(s1.generation1Boundary.decisionImmutable, true);
assert.equal(s1.generation1Boundary.upstreamDataFormalReuseAllowed, false);
assert.equal(s1.population.games, 2048);
assert.equal(s1.population.seedEnd - s1.population.seedStart + 1, s1.population.games);
assert.equal(s1.modelDevelopment.primaryFamily, "phase-stratified-isotonic-PAVA");
assert.equal(s1.modelDevelopment.candidateFamilySelectionPerformed, false);
assert.deepEqual(s1.modelDevelopment.formalPredictionClipping, {
  lower: 0.01,
  upper: 0.99,
  appliedAfterPAVAFit: true,
  appliedToAllStage2FormalMetrics: true
});

assert.equal(s2.stage2GenerationAuthorized, false);
assert.equal(s2.population.games, 8192);
assert.equal(s2.population.seedEnd - s2.population.seedStart + 1, s2.population.games);
assert.ok(s1.population.seedEnd < s2.population.seedStart, "Stage 1 and Stage 2 seed blocks must be disjoint");
assert.deepEqual(s2.identityFirewall.forbiddenAcrossStage1Stage2, [
  "historicalTrajectoryHash",
  "openingPrefixHash",
  "rawStateKey"
]);
assert.equal(s2.identityFirewall.overlapAction, "exclude-without-replacement");
assert.equal(s2.identityFirewall.seedExtensionAllowed, false);
assert.equal(s2.readinessGates.minimumUniqueHistoricalTrajectoriesAfterStage1Firewall, 4500);
assert.equal(s2.readinessGates.minimumSelectedUniqueRawStates, 4000);
assert.equal(s2.readinessGates.minimumNamuaSelectedStates, 1750);
assert.equal(s2.readinessGates.minimumMtajiSelectedStates, 1750);
assert.equal(s2.primaryFormalEvaluation.uncertainty.replicates, 20000);
assert.equal(s2.primaryFormalEvaluation.successCriteriaAllRequired.pairedBrierSkillLower95GreaterThan, 0);
assert.equal(s2.primaryFormalEvaluation.successCriteriaAllRequired.pairedLogLossSkillLower95GreaterThan, 0);
assert.equal(s2.primaryFormalEvaluation.successCriteriaAllRequired.pooledModelBrierMaximum, 0.18);
assert.equal(s2.primaryFormalEvaluation.successCriteriaAllRequired.namuaModelBrierMaximum, 0.25);
assert.equal(s2.primaryFormalEvaluation.successCriteriaAllRequired.mtajiModelBrierMaximum, 0.12);

for (const spec of [s1, s2]) {
  assert.deepEqual(spec.rawStateIdentity.fields, [
    "pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"
  ]);
  assert.equal(spec.rawStateIdentity.symmetryCanonicalizationAllowed, false);
  assert.equal(spec.interpretationBoundary.priorStudyDecisionRevisionAuthorized, false);
  assert.equal(spec.interpretationBoundary.publicAiQualityClaimAuthorized, false);
}

assert.ok(protocol.includes("PEC-STUDY1") && protocol.includes("INCONCLUSIVE"));
assert.ok(protocol.includes("Research Generation 2"));
assert.ok(protocol.includes("public AI"));
assert.ok(decision.includes("No additional PEC Stage 2 games"));

console.log("G2-01 calibration replication contract audit: PASS");
