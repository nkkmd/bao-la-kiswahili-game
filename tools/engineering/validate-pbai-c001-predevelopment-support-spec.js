#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readJson = (rel) => JSON.parse(read(rel));

const base = "doc/ai-engineering/public-ai-improvement-program-1/";
const spec = readJson(`${base}candidates/PBAI-C001-v1-predevelopment-support-spec.json`);
const gates = readJson(`${base}benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`);
const phaseStatus = read("doc/phase-transition/CURRENT_STATUS.md");

assert.equal(spec.schemaVersion, 1);
assert.equal(spec.program, "PBAI-P1");
assert.equal(spec.phase, "PBAI-D-PREDEVELOPMENT");
assert.equal(spec.candidateId, "PBAI-C001");
assert.equal(spec.candidateVersion, "PBAI-C001-v1");
assert.equal(spec.status, "FROZEN-PREDEVELOPMENT-SUPPORT-PROBE");
assert.equal(spec.contractFreezeSourceMain, "06ef21c5ca3ef1bca90aa37a5ca5d4b2cf262bde");
assert.equal(spec.baselineId, gates.baselineId);
assert.equal(spec.globalGateSpecId, gates.gateSpecId);
assert.equal(spec.candidateImplementationObservedBeforeProbeFreeze, false);
assert.equal(spec.candidateOutcomeObservedBeforeProbeFreeze, false);
assert.equal(spec.researchGeneration2EvidenceIncluded, false);
assert.equal(spec.developmentAuthorizationGrantedByThisProbe, false);

assert.equal(spec.researchEvidence.primaryStudy, "Phase Transition Study 1");
assert.equal(spec.researchEvidence.formalExperiment, "E-020 / H18");
assert.equal(spec.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(spec.researchEvidence.interpretationBoundary.legacySearchProvenStronger, false);
assert.equal(spec.researchEvidence.interpretationBoundary.legacySearchProvenToChooseBetterMoves, false);
assert.equal(spec.researchEvidence.interpretationBoundary.captureBranchExpansionProvenGoodForWinning, false);
assert.equal(spec.researchEvidence.interpretationBoundary.universalSearchProfilePreference, false);
assert.equal(spec.researchEvidence.interpretationBoundary.productionTriggerDirectlyAuthorizedByScientificStudy, false);
assert.equal(spec.researchEvidence.interpretationBoundary.engineeringHypothesisOnly, true);
assert.match(phaseStatus, /E-020 \/ H18[\s\S]*CONFIRMED/);
assert.ok(phaseStatus.includes("固定 `hard / bao / depth3` のlegacy > phase2のみ"));

const mechanism = spec.plannedEngineeringMechanism;
assert.equal(mechanism.featureFlag, "pbaiC001NamuaForcedCaptureLegacy");
assert.equal(mechanism.defaultBeforeAdoption, false);
assert.equal(mechanism.eligibleRootOnly, true);
assert.equal(mechanism.switchTarget, "existing public/ai.js legacy alpha-beta search path");
assert.equal(mechanism.baselineComparator, "existing enhanced alpha-beta path");
assert.equal(mechanism.evaluationProfileChangeAllowed, false);
assert.equal(mechanism.evaluationWeightsChangeAllowed, false);
assert.equal(mechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(mechanism.timeBudgetChangeAllowed, false);
assert.equal(mechanism.persistentTableOrCacheAllowed, false);
assert.equal(mechanism.forcedMoveAllowed, false);
assert.equal(mechanism.newSearchAlgorithmAllowed, false);
assert.equal(mechanism.scientificClassifierCopiedIntoProduction, false);
assert.deepEqual(mechanism.affectedPublicCode, ["public/ai.js"]);

const trigger = spec.plannedRuntimeTrigger;
assert.equal(trigger.statePhase, "namua");
assert.equal(trigger.terminalExcluded, true);
assert.equal(trigger.minimumLegalMoveVariants, 2);
assert.equal(trigger.allLegalMoveVariantsMustHaveType, "capture");

assert.deepEqual(spec.developmentPopulation.sourceSeedBlock,
  gates.decisionQuality.sourceSeedBlocks.development);
assert.equal(spec.developmentPopulation.maximumTrajectoryPlies, 160);
assert.equal(spec.developmentPopulation.populationTarget.namua, 128);
assert.equal(spec.developmentPopulation.populationTarget.mtaji, 128);
assert.equal(spec.developmentPopulation.populationTarget.total, 256);

assert.equal(spec.supportMeasurement.candidateCodeMayBeUsedDuringProbe, false);
assert.equal(spec.supportMeasurement.candidateBenefitMetricsMayBeObservedDuringProbe, false);
assert.deepEqual(spec.supportMeasurement.targetEligibility, [
  "nonterminal",
  "phase=namua",
  "minimum 2 legal moveVariants",
  "all legal moveVariants have type=capture",
]);
assert.equal(spec.supportMeasurement.targetMaximum, 64);
assert.equal(spec.supportMeasurement.minimumEstimableTargets, 32);
assert.equal(spec.supportMeasurement.phaseControl.class, "mtaji");
assert.equal(spec.supportMeasurement.phaseControl.selectionMaximum, 32);
assert.equal(spec.supportMeasurement.namuaNonForcedControl.selectionMaximum, 32);

assert.equal(spec.plannedCandidateSpecificBenefit.notMeasuredByThisProbe, true);
assert.equal(spec.plannedCandidateSpecificBenefit.developmentSearchCondition,
  "hard / bao / maxDepth=3 / timeLimitMs=Infinity");
assert.equal(spec.probeDecisionRule.supportPass, "eligible targets >= 32");
assert.equal(spec.probeDecisionRule.supportFail, "NON-ESTIMABLE/HOLD before implementation");
assert.equal(spec.probeDecisionRule.sourceBlockReplacementAfterSupportObservationAllowed, false);
assert.equal(spec.probeDecisionRule.selectorReplacementAfterSupportObservationAllowed, false);
assert.equal(spec.probeDecisionRule.triggerDefinitionReplacementAfterSupportObservationAllowed, false);
assert.equal(spec.probeDecisionRule.minimumSupportRetuningAfterObservationAllowed, false);
assert.equal(spec.probeDecisionRule.candidateImplementationBeforeSupportPassAllowed, false);

assert.equal(spec.firewall.validationSeedBlockAccessAuthorized, false);
assert.equal(spec.firewall.releaseHoldoutSeedBlockAccessAuthorized, false);
assert.equal(spec.firewall.candidateOutcomeMeasurementAuthorized, false);
assert.equal(spec.firewall.publicCodeChangeAuthorized, false);
assert.equal(spec.firewall.aiGen3PromotionAuthorized, false);

console.log("PBAI-C001-v1 predevelopment support specification: PASS");
