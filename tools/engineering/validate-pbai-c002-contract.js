"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const contract = readJson("doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1.json");
const gates = readJson("doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json");
const formal = readJson("doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json");

assert.equal(contract.schemaVersion, 1);
assert.equal(contract.program, "PBAI-P1");
assert.equal(contract.phase, "PBAI-D");
assert.equal(contract.candidateId, "PBAI-C002");
assert.equal(contract.candidateVersion, "PBAI-C002-v1");
assert.equal(contract.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(contract.contractFreezeSourceMain, "1cc5377178047e03f9225634c63eae9025480de7");
assert.equal(contract.baselineId, gates.baselineId);
assert.equal(contract.globalGateSpecId, gates.gateSpecId);
assert.equal(contract.candidateImplementationObservedBeforeFreeze, false);
assert.equal(contract.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(contract.researchGeneration2EvidenceIncluded, false);

const c03 = formal.formalCandidates.find((item) => item.candidateId === "TM-S2-C03");
assert.ok(c03, "TM-S2-C03 missing from frozen research definition");
assert.equal(contract.researchEvidence.formalCandidate, "TM-S2-C03");
assert.equal(contract.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(contract.researchEvidence.canonicalCandidateKey, c03.canonicalCandidateKey);
assert.equal(contract.researchEvidence.candidateDefinitionSha256,
  "667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8");
assert.equal(contract.researchEvidence.formalSpecSha256,
  "83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8");
assert.deepEqual(c03.preconditions, ["reusablePits=0-2"]);
assert.equal(c03.phase, "mtaji");
assert.equal(c03.moveAbstractionMode, "coarse-no-index");
assert.equal(c03.consequence, "actorNyumbaSeedsDeltaSign=0");

assert.equal(contract.mechanism.featureFlag, "pbaiC002C03Ordering");
assert.equal(contract.mechanism.defaultBeforeAdoption, false);
assert.equal(contract.mechanism.scope, "enhanced alpha-beta move ordering only");
assert.equal(contract.mechanism.selectiveExtensionAllowed, false);
assert.equal(contract.mechanism.evaluationBonusAllowed, false);
assert.equal(contract.mechanism.forcedMoveAllowed, false);
assert.equal(contract.mechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(contract.mechanism.timeBudgetChangeAllowed, false);
assert.equal(contract.mechanism.persistentTableOrCacheAllowed, false);
assert.deepEqual(contract.mechanism.affectedPublicCode, ["public/ai.js"]);
assert.ok(contract.mechanism.explicitlyUnaffectedPublicCode.includes("public/engine.js"));
assert.ok(contract.mechanism.explicitlyUnaffectedPublicCode.includes("public/ai-config.js"));
assert.ok(contract.mechanism.explicitlyUnaffectedPublicCode.includes("public/ai-worker.js"));

assert.equal(contract.trigger.statePhase, "mtaji");
assert.equal(contract.trigger.actorReusablePits.minimum, 0);
assert.equal(contract.trigger.actorReusablePits.maximum, 2);
assert.equal(contract.trigger.minimumLegalMoveVariants, 2);
assert.equal(contract.trigger.moveAbstractionMode, "coarse-no-index");
assert.deepEqual(contract.trigger.matchingMoveFamily, {
  type: "takata",
  phase: "mtaji",
  row: 1,
  direction: "right",
  side: null,
  houseChoice: null,
  houseTwo: false,
  index: "IGNORED-BY-FROZEN-ABSTRACTION",
});
assert.equal(contract.trigger.researchConsequenceNotUsedAsRuntimeTrigger,
  "actorNyumbaSeedsDeltaSign=0");
assert.equal(contract.trigger.pairedDiagnosticConsequenceNotUsed,
  "worstReplyActorCaptureMoveDeltaSign=0");

assert.equal(contract.orderingPlacement.mustNotOverrideImmediateWin, true);
assert.equal(contract.orderingPlacement.mustNotOverrideEnabledTtMoveFirstPreferredMove, true);
assert.equal(contract.orderingPlacement.mustNotOverrideCapturedSeedOrdering, true);

assert.deepEqual(contract.candidateSpecificPopulation.developmentSourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.development);
assert.deepEqual(contract.candidateSpecificPopulation.validationSourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.validation);
assert.equal(contract.candidateSpecificPopulation.releaseHoldoutSourceSeedBlock.start,
  gates.decisionQuality.sourceSeedBlocks.releaseHoldout.start);
assert.equal(contract.candidateSpecificPopulation.releaseHoldoutSourceSeedBlock.end,
  gates.decisionQuality.sourceSeedBlocks.releaseHoldout.end);
assert.equal(contract.candidateSpecificPopulation.releaseHoldoutSourceSeedBlock.executionAuthorizedNow, false);
assert.equal(contract.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(contract.validationAndHoldoutFirewall.tuningAfterHoldoutInspectionAllowed, false);

assert.equal(contract.candidateSpecificBenefitGate.primaryEndpoint,
  "fixed-depth D4 search-node efficiency on eligible target roots with candidate feature on versus feature off");
assert.equal(contract.candidateSpecificBenefitGate.development.medianNodeRatioMaximum, 0.95);
assert.equal(contract.candidateSpecificBenefitGate.validation.medianNodeRatioMaximum, 0.95);
assert.equal(contract.candidateSpecificBenefitGate.releaseHoldout.medianNodeRatioMaximum, 0.97);
assert.equal(contract.candidateSpecificBenefitGate.semanticSafetyOnTargetRoots.rootScoreMismatchMaximum, 0);
assert.equal(contract.candidateSpecificBenefitGate.semanticSafetyOnTargetRoots.candidateSelectedMoveOutsideFrozenD4ReferenceTopSetMaximum, 0);
assert.equal(contract.candidateSpecificBenefitGate.semanticSafetyOnTargetRoots.catastrophicNewLossMaximum, 0);
assert.equal(contract.candidateSpecificBenefitGate.globalGateRelaxationAllowed, false);

assert.equal(contract.operationalBudget.additionalPersistentMemoryBytesMaximum, 0);
assert.equal(contract.operationalBudget.additionalPublicAiJsBytesMaximum, 4096);
assert.equal(contract.operationalBudget.newPublicAssetAllowed, false);
assert.equal(contract.developmentStoppingRule.maximumMechanismVersionsUnderThisCandidateContract, 1);
assert.equal(contract.developmentStoppingRule.postOutcomeTriggerRetuningAllowed, false);
assert.equal(contract.developmentStoppingRule.postOutcomeOrderingPlacementRetuningAllowed, false);
assert.equal(contract.developmentStoppingRule.postOutcomeBenefitThresholdRetuningAllowed, false);
assert.equal(contract.rollback.aiGenerationPromotionBeforePublicAdoption, false);

console.log("PBAI-C002-v1 candidate contract: PASS");
