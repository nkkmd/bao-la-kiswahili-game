#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const base = "doc/ai-engineering/public-ai-improvement-program-1/";
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const spec = readJson(`${base}candidates/PBAI-C001-v1-predevelopment-support-spec.json`);
const support = readJson(`${base}candidates/PBAI-C001-v1-predevelopment-support-result.json`);
const contract = readJson(`${base}candidates/PBAI-C001-v1.json`);
const gates = readJson(`${base}benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`);
const c002 = readJson(`${base}candidates/PBAI-C002-v1-development-result.json`);
const c004 = readJson(`${base}candidates/PBAI-C004-v1-development-result.json`);

assert.equal(contract.schemaVersion, 1);
assert.equal(contract.program, "PBAI-P1");
assert.equal(contract.phase, "PBAI-D-EXACT-CANDIDATE-CONTRACT");
assert.equal(contract.candidateId, "PBAI-C001");
assert.equal(contract.candidateVersion, "PBAI-C001-v1");
assert.equal(contract.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(contract.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(contract.contractFreezeSourceMain, "06ef21c5ca3ef1bca90aa37a5ca5d4b2cf262bde");
assert.equal(contract.baselineId, gates.baselineId);
assert.equal(contract.globalGateSpecId, gates.gateSpecId);
assert.equal(contract.candidateImplementationObservedBeforeFreeze, false);
assert.equal(contract.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(contract.researchGeneration2EvidenceIncluded, false);

assert.equal(spec.status, "FROZEN-PREDEVELOPMENT-SUPPORT-PROBE");
assert.equal(support.status, "SUPPORT-PASS");
assert.equal(support.targetSupport.eligible, 108);
assert.equal(support.targetSupport.selected, 64);
assert.equal(support.targetSupport.minimumEstimable, 32);
assert.equal(support.targetSupport.supportPass, true);
assert.equal(support.firewall.candidateImplementationObserved, false);
assert.equal(support.firewall.candidateBenefitMetricsObserved, false);
assert.equal(support.firewall.validationSeedsAccessed, false);
assert.equal(support.firewall.releaseHoldoutSeedsAccessed, false);
assert.equal(support.firewall.publicCodeChanged, false);
assert.equal(support.decisionBoundary.candidateImplementationAuthorizedByThisResult, false);

assert.equal(contract.predevelopmentSupport.status, "SUPPORT-PASS");
assert.equal(contract.predevelopmentSupport.eligible, 108);
assert.equal(contract.predevelopmentSupport.selectedDevelopmentTargets, 64);
assert.equal(contract.predevelopmentSupport.minimumEstimable, 32);
assert.equal(contract.predevelopmentSupport.populationDigest,
  support.developmentPopulation.populationDigest);
assert.equal(contract.predevelopmentSupport.selectedTargetRefsSha256,
  support.targetSupport.selectedRefsSha256);
assert.equal(contract.predevelopmentSupport.mtajiControlRefsSha256,
  support.controls.mtaji.selectedRefsSha256);
assert.equal(contract.predevelopmentSupport.namuaNonForcedControlRefsSha256,
  support.controls.namuaNonForced.selectedRefsSha256);

assert.equal(contract.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(contract.researchEvidence.interpretationBoundary.legacySearchProvenStronger, false);
assert.equal(contract.researchEvidence.interpretationBoundary.legacySearchProvenToChooseBetterMoves, false);
assert.equal(contract.researchEvidence.interpretationBoundary.captureBranchExpansionProvenGoodForWinning, false);
assert.equal(contract.researchEvidence.interpretationBoundary.scientificCbeClassifierUsedByCandidate, false);
assert.equal(contract.researchEvidence.interpretationBoundary.phaseTransitionStudyFormalDecisionChanged, false);

const mechanism = contract.mechanism;
assert.equal(mechanism.featureFlag, "pbaiC001NamuaForcedCaptureLegacy");
assert.equal(mechanism.defaultBeforeAdoption, false);
assert.deepEqual(mechanism.allowedLevels, ["hard", "expert"]);
assert.equal(mechanism.rootOnly, true);
assert.equal(mechanism.eligibleOnlyWhenBaselineSearchIsEnhancedFamily, true);
assert.equal(mechanism.explicitLegacyProfileRemainsLegacy, true);
assert.equal(mechanism.mctsProfileRemainsMcts, true);
assert.equal(mechanism.runtimeTrigger.phase, "namua");
assert.equal(mechanism.runtimeTrigger.minimumLegalMoveVariants, 2);
assert.equal(mechanism.runtimeTrigger.allLegalMoveVariantsType, "capture");
assert.equal(mechanism.runtimeTrigger.historyRequired, false);
assert.equal(mechanism.runtimeTrigger.futureOutcomeRequired, false);
assert.equal(mechanism.runtimeTrigger.exactTopSetRequired, false);
assert.equal(mechanism.runtimeTrigger.morphologyClusterRequired, false);
assert.equal(mechanism.runtimeTrigger.scientificCbeClassifierRequired, false);
assert.equal(mechanism.evaluationProfileChangeAllowed, false);
assert.equal(mechanism.evaluationWeightsChangeAllowed, false);
assert.equal(mechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(mechanism.timeBudgetChangeAllowed, false);
assert.equal(mechanism.quiescenceParameterChangeAllowed, false);
assert.equal(mechanism.persistentTableOrCacheAllowed, false);
assert.equal(mechanism.forcedMoveAllowed, false);
assert.equal(mechanism.newSearchAlgorithmAllowed, false);
assert.deepEqual(mechanism.publicCodeSurface, ["public/ai.js"]);
assert.equal(mechanism.otherPublicCodeChangeAllowed, false);
assert.equal(mechanism.maximumAddedPublicAiBytes, 4096);

assert.deepEqual(contract.populations.development.sourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.development);
assert.deepEqual(contract.populations.validation.sourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.validation);
assert.deepEqual(contract.populations.releaseHoldout.sourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.releaseHoldout);
assert.equal(contract.populations.development.primaryTargetSelectedBeforeCandidateOutcome, 64);
assert.equal(contract.populations.validation.accessAuthorizedNow, false);
assert.equal(contract.populations.releaseHoldout.accessAuthorizedNow, false);

const benefit = contract.candidateSpecificBenefitGate;
assert.equal(benefit.reference.semantics, gates.decisionQuality.reference.semantics);
assert.equal(benefit.reference.depth, gates.decisionQuality.reference.depth);
assert.equal(benefit.reference.evaluationProfile, "bao");
assert.equal(benefit.candidateAndBaselineBudget.level, "hard");
assert.equal(benefit.candidateAndBaselineBudget.maxDepth, 3);
assert.equal(benefit.candidateAndBaselineBudget.timeLimitMs, "Infinity");
assert.equal(benefit.development.topSetAgreementDeltaCandidateMinusBaselineMinimum, 0.05);
assert.equal(benefit.development.meanNormalizedRankLossDeltaCandidateMinusBaselineMaximum, -0.02);
assert.equal(benefit.development.severeLossRateExcessOverBaselineMaximum, 0);
assert.equal(benefit.development.catastrophicNewLossCountMaximum, 0);
assert.equal(benefit.development.medianSearchWorkRatioCandidateOverBaselineMaximum, 1.5);
assert.equal(benefit.development.fractionRootsWithSearchWorkRatioAbove2Maximum, 0.1);
assert.equal(benefit.validation.topSetAgreementDeltaCandidateMinusBaselineMinimum, 0.05);
assert.equal(benefit.releaseHoldout.topSetAgreementDeltaCandidateMinusBaselineMinimum, 0.03);
assert.equal(benefit.globalGateRelaxationAllowed, false);

assert.equal(contract.controlGates.featureAbsentOrFalse, "must reproduce frozen AI-GEN2 behavior");
assert.equal(contract.controlGates.mtajiControlsFeatureOn.triggerExpected, false);
assert.equal(contract.controlGates.mtajiControlsFeatureOn.selectedMoveMustEqualFeatureOff, true);
assert.equal(contract.controlGates.namuaNonForcedControlsFeatureOn.triggerExpected, false);
assert.equal(contract.controlGates.namuaNonForcedControlsFeatureOn.selectedMoveMustEqualFeatureOff, true);
assert.equal(contract.controlGates.easyAndNormalLevelsAffected, false);
assert.equal(contract.controlGates.explicitMctsProfileAffected, false);
assert.equal(contract.controlGates.explicitLegacyProfileSemanticChangeAllowed, false);

assert.equal(contract.developmentFailureRule.sameVersionMechanismRetuningAllowed, false);
assert.equal(contract.developmentFailureRule.sameVersionTriggerRetuningAllowed, false);
assert.equal(contract.developmentFailureRule.sameVersionPopulationRetuningAllowed, false);
assert.equal(contract.developmentFailureRule.sameVersionThresholdRetuningAllowed, false);
assert.equal(contract.developmentFailureRule.validationAfterDevelopmentFailureAuthorized, false);
assert.equal(contract.developmentFailureRule.releaseHoldoutAfterDevelopmentFailureAuthorized, false);
assert.equal(contract.validationAndHoldoutFirewall.validationExecutionAuthorizedNow, false);
assert.equal(contract.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(contract.rollback.featureDefaultRemainsOffUntilAdoption, true);
assert.equal(contract.rollback.failedCandidateMainPublicResult, "KEEP-AI-GEN2");
assert.equal(contract.rollback.aiGenerationPromotionBeforePublicAdoption, false);

assert.equal(c002.finalDevelopmentStatus, "NON-ESTIMABLE-HOLD");
assert.equal(c002.decision.developmentAuthorizationContinues, false);
assert.equal(c004.finalDevelopmentStatus, "DEVELOPMENT-FAIL-HOLD");
assert.equal(c004.decision.developmentAuthorizationContinues, false);

for (const value of [
  contract.predevelopmentSupport.selectedTargetRefsSha256,
  contract.predevelopmentSupport.mtajiControlRefsSha256,
  contract.predevelopmentSupport.namuaNonForcedControlRefsSha256,
]) {
  assert.match(value, /^[0-9a-f]{64}$/);
}

console.log("PBAI-C001-v1 exact candidate contract: PASS");
