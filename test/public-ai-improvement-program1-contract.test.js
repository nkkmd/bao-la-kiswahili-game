"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readJson = (rel) => JSON.parse(read(rel));
const base = "doc/ai-engineering/public-ai-improvement-program-1/";

const index = read("doc/AI_ENGINEERING_INDEX.md");
const naming = read("doc/ai-engineering/AI_GENERATION_NAMING.md");
const readme = read(`${base}README.md`);
const status = read(`${base}CURRENT_STATUS.md`);
const audit = read(`${base}GENERATION_1_EVIDENCE_AUDIT.md`);
const baseline = read(`${base}BASELINE_SPEC.md`);
const baselineManifest = readJson(`${base}baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`);
const bench = read(`${base}BENCHMARK_PROTOCOL.md`);
const gates = readJson(`${base}benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`);
const candidates = read(`${base}CANDIDATE_REGISTER.md`);
const releases = read(`${base}RELEASE_REGISTER.md`);

const c001Support = readJson(`${base}candidates/PBAI-C001-v1-predevelopment-support-result.json`);
const c001 = readJson(`${base}candidates/PBAI-C001-v1.json`);
const c001Result = readJson(`${base}candidates/PBAI-C001-v1-development-result.json`);
const c002 = readJson(`${base}candidates/PBAI-C002-v1.json`);
const c002Result = readJson(`${base}candidates/PBAI-C002-v1-development-result.json`);
const c004 = readJson(`${base}candidates/PBAI-C004-v1.json`);
const c004Result = readJson(`${base}candidates/PBAI-C004-v1-development-result.json`);

for (const text of [index, readme, status, audit, baseline, bench, candidates, releases]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

// Current program and public-lineage state.
assert.ok(readme.includes("PBAI-A/B/C COMPLETE"));
assert.ok(readme.includes("C001 HOLD / C002 HOLD / C004 HOLD / no candidate authorized"));
assert.ok(readme.includes("Research Generation 2 outcomeはPBAI-P1へ逐次流入させない"));
assert.ok(status.includes("PBAI-A Research Generation 1 evidence audit = COMPLETE"));
assert.ok(status.includes("PBAI-B AI-GEN2 exact public baseline = COMPLETE"));
assert.ok(status.includes("PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN"));
assert.ok(status.includes("PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #61 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 0"));
assert.ok(status.includes("active candidate implementations = 0"));
assert.ok(status.includes("isolated development implementation attempts = 3"));
assert.ok(status.includes("public/main candidate implementations = 0"));
assert.ok(status.includes("validation execution = NOT-AUTHORIZED"));
assert.ok(status.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(status.includes("public AI code changed by PBAI-P1 = false"));
assert.ok(status.includes("Research Generation 2 evidence included = false"));
assert.ok(status.includes("AI-GEN3 promotion = NOT-AUTHORIZED"));

// Frozen A/B/C controls remain immutable.
assert.ok(audit.includes("PBAI-A = COMPLETE"));
assert.ok(audit.includes("AI.stateKey != Research Generation 1 authoritative RAW identity contract"));
assert.ok(baseline.includes("Status: **FROZEN / PBAI-B COMPLETE**"));
assert.equal(baselineManifest.baselineFrozen, true);
assert.equal(baselineManifest.baselineId, "AI-GEN2-BASELINE-2026-08-26-v1");
assert.equal(baselineManifest.authorization.AI_GEN3PromotionAuthorized, false);
assert.ok(bench.includes("Status: **FROZEN / PBAI-C GLOBAL NUMERIC GATES COMPLETE**"));
assert.equal(gates.status, "FROZEN-BEFORE-CANDIDATE-IMPLEMENTATION");
assert.equal(gates.candidateImplementationsObservedBeforeFreeze, 0);
assert.equal(gates.candidateOutcomesObservedBeforeFreeze, 0);
assert.equal(gates.releaseHoldout.authorizedAtPBAI_C, false);
assert.equal(gates.candidateSpecificGateFloor.mayRelaxGlobalGate, false);
assert.equal(gates.releaseDecision.noAcceptableCandidateOutcome, "KEEP-AI-GEN2");

// Historical C002 contract and HOLD remain intact.
assert.equal(c002.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c002.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c002.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(c002Result.finalDevelopmentStatus, "NON-ESTIMABLE-HOLD");
assert.equal(c002Result.materialization.candidateSupport.eligibleTargets, 5);
assert.equal(c002Result.materialization.candidateSupport.minimumEstimableTargets, 48);
assert.equal(c002Result.candidateBenefitMetricsObserved, false);
assert.equal(c002Result.decision.developmentAuthorizationContinues, false);
assert.equal(c002Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c002Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// Historical C004 contract and HOLD remain intact.
assert.equal(c004.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c004.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c004.researchEvidence.formalDecision, "INCONCLUSIVE");
assert.equal(c004.mechanism.featureFlag, "pbaiC004D23RootTtFirst");
assert.equal(c004Result.finalDevelopmentStatus, "DEVELOPMENT-FAIL-HOLD");
assert.equal(c004Result.development.pullRequest, 58);
assert.equal(c004Result.development.pullRequestMerged, false);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioCandidateOverBaseline, 1);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioGatePassed, false);
assert.equal(c004Result.decision.developmentAuthorizationContinues, false);
assert.equal(c004Result.decision.validationAuthorized, false);
assert.equal(c004Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c004Result.decision.aiGen3PromotionAuthorized, false);
assert.equal(c004Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// C001 support and exact contract remain prospective relative to the later outcome.
assert.equal(c001Support.status, "SUPPORT-PASS");
assert.equal(c001Support.canonicalExecution.workflowRunId, 32952267253);
assert.equal(c001Support.targetSupport.eligible, 108);
assert.equal(c001Support.targetSupport.selected, 64);
assert.equal(c001Support.targetSupport.minimumEstimable, 32);
assert.equal(c001Support.firewall.candidateImplementationObserved, false);
assert.equal(c001Support.firewall.candidateBenefitMetricsObserved, false);
assert.equal(c001Support.firewall.validationSeedsAccessed, false);
assert.equal(c001Support.firewall.releaseHoldoutSeedsAccessed, false);
assert.equal(c001.candidateId, "PBAI-C001");
assert.equal(c001.candidateVersion, "PBAI-C001-v1");
assert.equal(c001.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c001.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c001.candidateImplementationObservedBeforeFreeze, false);
assert.equal(c001.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(c001.researchGeneration2EvidenceIncluded, false);
assert.equal(c001.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(c001.researchEvidence.interpretationBoundary.legacySearchProvenStronger, false);
assert.equal(c001.researchEvidence.interpretationBoundary.legacySearchProvenToChooseBetterMoves, false);
assert.equal(c001.researchEvidence.interpretationBoundary.captureBranchExpansionProvenGoodForWinning, false);
assert.equal(c001.mechanism.featureFlag, "pbaiC001NamuaForcedCaptureLegacy");
assert.equal(c001.mechanism.defaultBeforeAdoption, false);
assert.deepEqual(c001.mechanism.publicCodeSurface, ["public/ai.js"]);
assert.equal(c001.candidateSpecificBenefitGate.development.topSetAgreementDeltaCandidateMinusBaselineMinimum, 0.05);
assert.equal(c001.candidateSpecificBenefitGate.development.meanNormalizedRankLossDeltaCandidateMinusBaselineMaximum, -0.02);
assert.equal(c001.candidateSpecificBenefitGate.development.severeLossRateExcessOverBaselineMaximum, 0);
assert.equal(c001.candidateSpecificBenefitGate.development.catastrophicNewLossCountMaximum, 0);
assert.equal(c001.validationAndHoldoutFirewall.validationExecutionAuthorizedNow, false);
assert.equal(c001.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);

// C001 binding development result closes v1 without rescue.
assert.equal(c001Result.finalDevelopmentStatus, "DEVELOPMENT-BENEFIT-FAIL-HOLD");
assert.equal(c001Result.development.baseMain, "65a335b455bfb288931487747d633315f71d1d17");
assert.equal(c001Result.development.headSha, "f9767c575e512c1e0d41c2ad4dd1a7a9c302e29f");
assert.equal(c001Result.development.pullRequest, 61);
assert.equal(c001Result.development.pullRequestMerged, false);
assert.equal(c001Result.development.pullRequestClosedWithoutMerge, true);
assert.equal(c001Result.development.mainPublicImplementationChanged, false);
assert.equal(c001Result.workflowProvenance.runId, 32957738413);
assert.equal(c001Result.workflowProvenance.jobId, 98143061656);
assert.equal(c001Result.workflowProvenance.artifactId, 9602744693);
assert.equal(c001Result.workflowProvenance.artifactZipSha256, "82fdffb39c967e8bf02abf3080ab1651fcfa1c88f881d0028ce5af3493d45762");
assert.equal(c001Result.population.selectedTargets, 64);
assert.equal(c001Result.reference.candidateCodeDefinedReference, false);
assert.equal(c001Result.developmentGate.topSetAgreement.baseline, 0.640625);
assert.equal(c001Result.developmentGate.topSetAgreement.candidate, 0.65625);
assert.equal(c001Result.developmentGate.topSetAgreement.deltaCandidateMinusBaseline, 0.015625);
assert.equal(c001Result.developmentGate.topSetAgreement.passed, false);
assert.equal(c001Result.developmentGate.meanNormalizedRankLoss.deltaCandidateMinusBaseline, -0.011718750000000028);
assert.equal(c001Result.developmentGate.meanNormalizedRankLoss.passed, false);
assert.equal(c001Result.developmentGate.severeLoss.baselineCount, 2);
assert.equal(c001Result.developmentGate.severeLoss.candidateCount, 3);
assert.equal(c001Result.developmentGate.severeLoss.excessCandidateMinusBaseline, 0.015625);
assert.equal(c001Result.developmentGate.severeLoss.passed, false);
assert.equal(c001Result.developmentGate.catastrophicNewLoss.count, 0);
assert.equal(c001Result.developmentGate.catastrophicNewLoss.passed, true);
assert.equal(c001Result.developmentGate.searchWork.medianRatioCandidateOverBaseline, 0.2772631454984396);
assert.equal(c001Result.developmentGate.searchWork.medianRatioPassed, true);
assert.equal(c001Result.developmentGate.searchWork.fractionRootsWithRatioAbove2, 0);
assert.equal(c001Result.developmentGate.developmentPass, false);
assert.equal(c001Result.decision.candidateStatus, "HOLD");
assert.equal(c001Result.decision.developmentAuthorizationContinues, false);
assert.equal(c001Result.decision.sameVersionRetuningAllowed, false);
assert.equal(c001Result.decision.sameVersionMechanismRescueAllowed, false);
assert.equal(c001Result.decision.validationAuthorized, false);
assert.equal(c001Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c001Result.decision.publicAdoptionAuthorized, false);
assert.equal(c001Result.decision.aiGen3PromotionAuthorized, false);
assert.equal(c001Result.decision.mainPublicResult, "KEEP-AI-GEN2");
assert.equal(c001Result.executionBoundary.validationExecuted, false);
assert.equal(c001Result.executionBoundary.releaseHoldoutExecuted, false);
assert.equal(c001Result.executionBoundary.validationSeedsAccessed, false);
assert.equal(c001Result.executionBoundary.releaseHoldoutSeedsAccessed, false);
assert.equal(c001Result.executionBoundary.researchGeneration2EvidenceIncluded, false);

for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-C001 authorized = false / HOLD"));
assert.ok(candidates.includes("PBAI-C002 authorized = false / HOLD"));
assert.ok(candidates.includes("PBAI-C003 authorized = false"));
assert.ok(candidates.includes("PBAI-C004 authorized = false / HOLD"));
assert.ok(candidates.includes("PBAI-C005 authorized = false"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 0"));
assert.ok(candidates.includes("public/main candidate implementations = 0"));
assert.ok(candidates.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(releases.includes("NO PBAI-P1 PUBLIC RELEASE YET"));

for (const text of [index, naming, readme, status, baseline]) {
  assert.ok(text.includes("AI-GEN2"), "AI-GEN2 naming marker missing");
  assert.ok(text.includes("AI-GEN3"), "AI-GEN3 naming marker missing");
}
assert.ok(naming.includes("AI-GEN3 promotion before public adoption = prohibited"));
assert.ok(naming.includes("Research Generation 2"));

for (const claim of [
  "Research Generation 2 evidence included = true",
  "release holdout execution = AUTHORIZED",
  "public AI code changed by PBAI-P1 = true",
  "AI-GEN3 promotion = AUTHORIZED",
]) {
  assert.ok(!status.includes(claim), `unexpected PBAI state claim: ${claim}`);
}

console.log("PBAI-P1 engineering program contract audit: PASS");
