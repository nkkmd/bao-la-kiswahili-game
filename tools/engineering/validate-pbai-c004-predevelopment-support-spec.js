"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const spec = readJson(
  "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1-predevelopment-support-spec.json",
);
const gates = readJson(
  "doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json",
);
const pcx = readJson("doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json");

assert.equal(spec.schemaVersion, 1);
assert.equal(spec.program, "PBAI-P1");
assert.equal(spec.phase, "PBAI-D-PREDEVELOPMENT");
assert.equal(spec.candidateId, "PBAI-C004");
assert.equal(spec.candidateVersion, "PBAI-C004-v1");
assert.equal(spec.status, "FROZEN-PREDEVELOPMENT-SUPPORT-PROBE");
assert.equal(spec.contractFreezeSourceMain, "04f5ddd2c97f3452bd7081fbcc3df24b70a89df9");
assert.equal(spec.baselineId, gates.baselineId);
assert.equal(spec.globalGateSpecId, gates.gateSpecId);
assert.equal(spec.candidateImplementationObservedBeforeProbeFreeze, false);
assert.equal(spec.candidateOutcomeObservedBeforeProbeFreeze, false);
assert.equal(spec.researchGeneration2EvidenceIncluded, false);
assert.equal(spec.developmentAuthorizationGrantedByThisProbe, false);

assert.equal(pcx.primaryHypothesis.outcome.name, "D23Instability");
assert.equal(pcx.primaryHypothesis.outcome.definition,
  "1 iff exact TopSet_D2 and exact TopSet_D3 are disjoint; otherwise 0");
assert.deepEqual(pcx.measurement.depths, [2, 3]);
assert.equal(pcx.measurement.searchSemantics,
  "exact-full-window-root-candidates/phase2-value-semantics/v1");
assert.equal(pcx.measurement.evaluationProfile, "bao");
assert.equal(pcx.measurement.quiescenceDepth, 1);
assert.equal(pcx.measurement.orderQuiescenceCaptures, false);
assert.equal(spec.researchEvidence.formalStudyDecision, "INCONCLUSIVE");
assert.equal(spec.researchEvidence.stage2SelectedUniqueRuleStates, 862);
assert.equal(spec.researchEvidence.stage2D23InstabilityEvents, 203);
assert.equal(spec.researchEvidence.stage2D23StableEvents, 659);
assert.equal(spec.researchEvidence.interpretationBoundary.validatedHumanDifficultyClassifier, false);
assert.equal(spec.researchEvidence.interpretationBoundary.validatedGeneralPurposeComplexityClassifier, false);
assert.equal(spec.researchEvidence.interpretationBoundary.productionTriggerDirectlyAuthorizedByScientificStudy, false);

assert.equal(spec.plannedEngineeringMechanism.featureFlag, "pbaiC004D23RootTtFirst");
assert.equal(spec.plannedEngineeringMechanism.defaultBeforeAdoption, false);
assert.equal(spec.plannedEngineeringMechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(spec.plannedEngineeringMechanism.timeBudgetChangeAllowed, false);
assert.equal(spec.plannedEngineeringMechanism.evaluationChangeAllowed, false);
assert.equal(spec.plannedEngineeringMechanism.quiescenceChangeAllowed, false);
assert.equal(spec.plannedEngineeringMechanism.persistentTableOrCacheAllowed, false);
assert.equal(spec.plannedEngineeringMechanism.forcedMoveAllowed, false);
assert.equal(spec.plannedEngineeringMechanism.scientificClassifierCopiedIntoProduction, false);

assert.deepEqual(spec.developmentPopulation.sourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.development);
assert.equal(spec.developmentPopulation.maximumTrajectoryPlies, 160);
assert.equal(spec.developmentPopulation.populationTarget.namua, 128);
assert.equal(spec.developmentPopulation.populationTarget.mtaji, 128);
assert.equal(spec.developmentPopulation.populationTarget.total, 256);

assert.deepEqual(spec.supportMeasurement.depths, [2, 3]);
assert.equal(spec.supportMeasurement.searchSemantics, pcx.measurement.searchSemantics);
assert.equal(spec.supportMeasurement.evaluationProfile, "bao");
assert.equal(spec.supportMeasurement.quiescenceDepth, 1);
assert.equal(spec.supportMeasurement.orderQuiescenceCaptures, false);
assert.equal(spec.supportMeasurement.targetEligibility, "exact D2 and D3 TopSets are disjoint");
assert.equal(spec.supportMeasurement.targetMaximum, 64);
assert.equal(spec.supportMeasurement.minimumEstimableTargets, 48);
assert.equal(spec.supportMeasurement.candidateBenefitMetricsMayBeObservedDuringProbe, false);
assert.equal(spec.supportMeasurement.candidateCodeMayBeUsedDuringProbe, false);

assert.equal(spec.probeDecisionRule.sourceBlockReplacementAfterSupportObservationAllowed, false);
assert.equal(spec.probeDecisionRule.selectorReplacementAfterSupportObservationAllowed, false);
assert.equal(spec.probeDecisionRule.minimumSupportRetuningAfterObservationAllowed, false);
assert.equal(spec.probeDecisionRule.candidateImplementationBeforeSupportPassAllowed, false);
assert.equal(spec.firewall.validationSeedBlockAccessAuthorized, false);
assert.equal(spec.firewall.releaseHoldoutSeedBlockAccessAuthorized, false);
assert.equal(spec.firewall.candidateOutcomeMeasurementAuthorized, false);
assert.equal(spec.firewall.publicCodeChangeAuthorized, false);
assert.equal(spec.firewall.aiGen3PromotionAuthorized, false);

console.log("PBAI-C004-v1 predevelopment support specification: PASS");
