"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const base = "doc/ai-engineering/public-ai-improvement-program-1/";

const gates = readJson(`${base}benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`);
const spec = readJson(`${base}candidates/PBAI-C004-v1-predevelopment-support-spec.json`);
const support = readJson(`${base}candidates/PBAI-C004-v1-predevelopment-support-result.json`);
const contract = readJson(`${base}candidates/PBAI-C004-v1.json`);
const pcx = readJson("doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json");
const c002Result = readJson(`${base}candidates/PBAI-C002-v1-development-result.json`);

assert.equal(support.status, "SUPPORT-PASS");
assert.equal(support.sourceMain, "04f5ddd2c97f3452bd7081fbcc3df24b70a89df9");
assert.equal(support.canonicalExecution.workflowRunId, 32917223072);
assert.equal(support.canonicalExecution.jobId, 98023357050);
assert.equal(support.canonicalExecution.artifactId, 9588624025);
assert.equal(support.canonicalExecution.artifactZipSha256,
  "5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e");
assert.equal(support.developmentPopulation.populationDigest,
  "fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734");
assert.deepEqual(support.developmentPopulation.support, { namua: 128, mtaji: 128, total: 256 });
assert.equal(support.measurement.d23TopSetDisjoint, 54);
assert.equal(support.measurement.d23TopSetOverlap, 202);
assert.equal(support.measurement.deterministicCanonicalBestStableAmongOverlap, 197);
assert.equal(support.measurement.deterministicCanonicalBestChangedAmongOverlap, 5);
assert.equal(support.measurement.phaseSupport.namuaTopSetDisjoint, 42);
assert.equal(support.measurement.phaseSupport.mtajiTopSetDisjoint, 12);
assert.equal(support.targetSupport.minimumEstimable, 48);
assert.equal(support.targetSupport.supportPass, true);
for (const value of Object.values(support.firewall)) assert.equal(value, false);
assert.equal(support.decision,
  "SUPPORT-PASS-ELIGIBLE-FOR-EXACT-CANDIDATE-CONTRACT-FREEZE");
assert.equal(support.decisionBoundary.positionComplexityStudyFormalDecisionRemains, "INCONCLUSIVE");

assert.equal(contract.schemaVersion, 1);
assert.equal(contract.program, "PBAI-P1");
assert.equal(contract.phase, "PBAI-D");
assert.equal(contract.candidateId, "PBAI-C004");
assert.equal(contract.candidateVersion, "PBAI-C004-v1");
assert.equal(contract.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(contract.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(contract.contractFreezeSourceMain, support.sourceMain);
assert.equal(contract.baselineId, gates.baselineId);
assert.equal(contract.globalGateSpecId, gates.gateSpecId);
assert.equal(contract.candidateImplementationObservedBeforeFreeze, false);
assert.equal(contract.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(contract.researchGeneration2EvidenceIncluded, false);
assert.equal(contract.predevelopmentSupport.supportPass, true);
assert.equal(contract.predevelopmentSupport.eligiblePrimaryTargets, 54);
assert.equal(contract.predevelopmentSupport.minimumEstimablePrimaryTargets, 48);
assert.equal(contract.predevelopmentSupport.candidateCodeUsed, false);
assert.equal(contract.predevelopmentSupport.candidateBenefitMetricsObserved, false);
assert.equal(contract.predevelopmentSupport.validationSeedsAccessed, false);
assert.equal(contract.predevelopmentSupport.releaseHoldoutSeedsAccessed, false);

assert.equal(contract.researchEvidence.formalDecision, "INCONCLUSIVE");
assert.equal(pcx.primaryHypothesis.outcome.definition,
  "1 iff exact TopSet_D2 and exact TopSet_D3 are disjoint; otherwise 0");
assert.equal(contract.researchEvidence.reproducibleInstrument.definition,
  "exact TopSet_D2 and exact TopSet_D3 are disjoint");
assert.equal(contract.researchEvidence.interpretationBoundary.validatedHumanDifficultyClassifier, false);
assert.equal(contract.researchEvidence.interpretationBoundary.validatedGeneralComplexityClassifier, false);
assert.equal(contract.researchEvidence.interpretationBoundary.scientificD23ClassifierCopiedIntoProduction, false);
assert.equal(contract.researchEvidence.interpretationBoundary.engineeringSuccessMayChangeScientificDecision, false);

assert.equal(contract.mechanism.featureFlag, "pbaiC004D23RootTtFirst");
assert.equal(contract.mechanism.defaultBeforeAdoption, false);
assert.equal(contract.mechanism.activationEarliestSearchDepth, 4);
assert.equal(contract.mechanism.runtimeExactTopSetComputationAllowed, false);
assert.equal(contract.mechanism.runtimeScientificClassifierUseAllowed, false);
assert.equal(contract.mechanism.rootOnly, true);
assert.equal(contract.mechanism.internalNodeOrderingChangeAllowed, false);
assert.equal(contract.mechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(contract.mechanism.timeBudgetChangeAllowed, false);
assert.equal(contract.mechanism.evaluationChangeAllowed, false);
assert.equal(contract.mechanism.quiescenceChangeAllowed, false);
assert.equal(contract.mechanism.persistentTableOrCacheAllowed, false);
assert.equal(contract.mechanism.forcedMoveAllowed, false);
assert.deepEqual(contract.mechanism.affectedPublicCode, ["public/ai.js"]);
assert.ok(contract.mechanism.explicitlyUnaffectedPublicCode.includes("public/engine.js"));
assert.ok(contract.mechanism.explicitlyUnaffectedPublicCode.includes("public/ai-config.js"));
assert.ok(contract.mechanism.explicitlyUnaffectedPublicCode.includes("public/ai-worker.js"));
assert.deepEqual(contract.runtimeTrigger.eligibleLevels, ["hard", "expert"]);
assert.equal(contract.runtimeTrigger.requiresDepth2CompletedWithoutTimeout, true);
assert.equal(contract.runtimeTrigger.requiresDepth3CompletedWithoutTimeout, true);
assert.equal(contract.runtimeTrigger.noCrossCallState, true);
assert.equal(contract.orderingPlacement.mustNotOverrideImmediateWin, true);

assert.deepEqual(contract.candidateSpecificPopulation.developmentSourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.development);
assert.deepEqual(contract.candidateSpecificPopulation.validationSourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.validation);
assert.equal(contract.candidateSpecificPopulation.releaseHoldoutSourceSeedBlock.start,
  gates.decisionQuality.sourceSeedBlocks.releaseHoldout.start);
assert.equal(contract.candidateSpecificPopulation.releaseHoldoutSourceSeedBlock.end,
  gates.decisionQuality.sourceSeedBlocks.releaseHoldout.end);
assert.equal(contract.candidateSpecificPopulation.releaseHoldoutSourceSeedBlock.executionAuthorizedNow, false);
assert.equal(contract.candidateSpecificPopulation.primaryTarget.developmentSupportAlreadyObserved, 54);
assert.equal(contract.candidateSpecificPopulation.primaryTarget.minimumEstimableRoots.development, 48);
assert.equal(contract.candidateSpecificPopulation.boundaryTriggerStratum.developmentSupportAlreadyObserved, 5);
assert.equal(contract.candidateSpecificPopulation.negativeControl.developmentSupportAlreadyObserved, 197);

assert.equal(contract.candidateSpecificBenefitGate.development.medianNodeRatioMaximum, 0.95);
assert.equal(contract.candidateSpecificBenefitGate.validation.medianNodeRatioMaximum, 0.95);
assert.equal(contract.candidateSpecificBenefitGate.releaseHoldout.medianNodeRatioMaximum, 0.97);
assert.equal(contract.candidateSpecificBenefitGate.semanticSafetyOnPrimaryAndBoundaryRoots.rootScoreMismatchMaximum, 0);
assert.equal(contract.candidateSpecificBenefitGate.semanticSafetyOnPrimaryAndBoundaryRoots.candidateSelectedMoveOutsideFrozenD4ReferenceTopSetMaximum, 0);
assert.equal(contract.candidateSpecificBenefitGate.semanticSafetyOnPrimaryAndBoundaryRoots.catastrophicNewLossMaximum, 0);
assert.equal(contract.candidateSpecificBenefitGate.boundaryTriggerCostGate.aggregateNodeRatioCandidateOverBaselineMaximum, 1.10);
assert.equal(contract.candidateSpecificBenefitGate.globalGateRelaxationAllowed, false);
assert.equal(contract.operationalBudget.additionalPersistentMemoryBytesMaximum, 0);
assert.equal(contract.operationalBudget.additionalPublicAiJsBytesMaximum, 4096);
assert.equal(contract.operationalBudget.newPublicAssetAllowed, false);
assert.equal(contract.developmentStoppingRule.maximumMechanismVersionsUnderThisCandidateContract, 1);
assert.equal(contract.developmentStoppingRule.postOutcomeRuntimeTriggerRetuningAllowed, false);
assert.equal(contract.developmentStoppingRule.postOutcomeOrderingPlacementRetuningAllowed, false);
assert.equal(contract.developmentStoppingRule.postOutcomePrimaryTargetRetuningAllowed, false);
assert.equal(contract.developmentStoppingRule.postOutcomeBoundaryDefinitionRetuningAllowed, false);
assert.equal(contract.developmentStoppingRule.postOutcomeBenefitThresholdRetuningAllowed, false);
assert.equal(contract.validationAndHoldoutFirewall.developmentExecutionAllowedAfterContractMerge, true);
assert.equal(contract.validationAndHoldoutFirewall.validationExecutionAllowedOnlyAfterDevelopmentBenefitAndSafetyPass, true);
assert.equal(contract.validationAndHoldoutFirewall.validationMayTuneImplementation, false);
assert.equal(contract.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(contract.validationAndHoldoutFirewall.tuningAfterHoldoutInspectionAllowed, false);
assert.equal(contract.rollback.aiGenerationPromotionBeforePublicAdoption, false);

// C002 remains a closed historical HOLD and is not rescued by selecting C004.
assert.equal(c002Result.finalDevelopmentStatus, "NON-ESTIMABLE-HOLD");
assert.equal(c002Result.decision.developmentAuthorizationContinues, false);
assert.equal(c002Result.decision.mainPublicResult, "KEEP-AI-GEN2");

console.log("PBAI-C004-v1 exact candidate contract: PASS");
