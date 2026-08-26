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
const c002 = readJson(`${base}candidates/PBAI-C002-v1.json`);
const c002Result = readJson(`${base}candidates/PBAI-C002-v1-development-result.json`);
const c004 = readJson(`${base}candidates/PBAI-C004-v1.json`);
const c004Result = readJson(`${base}candidates/PBAI-C004-v1-development-result.json`);
const c001Auth = read("doc/engineering-program-decisions/2026-08-26-pbai-c001-v1-development-authorization.md");
const c002Auth = read("doc/engineering-program-decisions/2026-08-26-pbai-c002-v1-development-authorization.md");
const c004Auth = read("doc/engineering-program-decisions/2026-08-26-pbai-c004-v1-development-authorization.md");

for (const text of [
  index, readme, status, audit, baseline, bench, candidates, releases,
  c001Auth, c002Auth, c004Auth,
]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

// Program and public-lineage state.
assert.ok(readme.includes("PBAI-A/B/C COMPLETE"));
assert.ok(readme.includes("C002 HOLD / C004 HOLD / C001 SUPPORT PASS + EXACT CONTRACT FROZEN"));
assert.ok(readme.includes("Research Generation 2 outcomeはPBAI-P1へ逐次流入させない"));
assert.ok(status.includes("PBAI-A Research Generation 1 evidence audit = COMPLETE"));
assert.ok(status.includes("PBAI-B AI-GEN2 exact public baseline = COMPLETE"));
assert.ok(status.includes("PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN"));
assert.ok(status.includes("PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C001-v1 predevelopment support = PASS (108 >= 32; 64 selected)"));
assert.ok(status.includes("PBAI-C001-v1 exact contract = FROZEN ON CONTRACT BRANCH"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 1 only after C001 contract merge"));
assert.ok(status.includes("active candidate implementations = 0"));
assert.ok(status.includes("isolated development implementation attempts = 2"));
assert.ok(status.includes("public/main candidate implementations = 0"));
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

// Historical C002 contract and later HOLD remain intact.
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

// Historical C004 contract and later development-benefit HOLD remain intact.
assert.equal(c004.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c004.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c004.researchEvidence.formalDecision, "INCONCLUSIVE");
assert.equal(c004.mechanism.featureFlag, "pbaiC004D23RootTtFirst");
assert.equal(c004.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(c004Result.finalDevelopmentStatus, "DEVELOPMENT-BENEFIT-FAIL-HOLD");
assert.equal(c004Result.development.pullRequest, 58);
assert.equal(c004Result.development.pullRequestMerged, false);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioCandidateOverBaseline, 1);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioMaximum, 0.95);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioGatePassed, false);
assert.equal(c004Result.developmentGate.semanticSafetyPrimaryAndBoundary.rootScoreMismatchCount, 0);
assert.equal(c004Result.developmentGate.semanticSafetyPrimaryAndBoundary.catastrophicNewLossCount, 0);
assert.equal(c004Result.decision.developmentAuthorizationContinues, false);
assert.equal(c004Result.decision.validationAuthorized, false);
assert.equal(c004Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c004Result.decision.aiGen3PromotionAuthorized, false);
assert.equal(c004Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// New C001 support is baseline-only and pre-implementation.
assert.equal(c001Support.status, "SUPPORT-PASS");
assert.equal(c001Support.canonicalExecution.workflowRunId, 32952267253);
assert.equal(c001Support.canonicalExecution.jobId, 98126097111);
assert.equal(c001Support.canonicalExecution.artifactId, 9600601764);
assert.equal(c001Support.developmentPopulation.populationDigest,
  "fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734");
assert.equal(c001Support.targetSupport.eligible, 108);
assert.equal(c001Support.targetSupport.selected, 64);
assert.equal(c001Support.targetSupport.minimumEstimable, 32);
assert.equal(c001Support.targetSupport.supportPass, true);
assert.equal(c001Support.firewall.candidateImplementationObserved, false);
assert.equal(c001Support.firewall.candidateBenefitMetricsObserved, false);
assert.equal(c001Support.firewall.validationSeedsAccessed, false);
assert.equal(c001Support.firewall.releaseHoldoutSeedsAccessed, false);
assert.equal(c001Support.firewall.publicCodeChanged, false);

// New C001 exact contract is prospective relative to candidate outcomes.
assert.equal(c001.candidateId, "PBAI-C001");
assert.equal(c001.candidateVersion, "PBAI-C001-v1");
assert.equal(c001.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c001.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c001.baselineId, baselineManifest.baselineId);
assert.equal(c001.globalGateSpecId, gates.gateSpecId);
assert.equal(c001.candidateImplementationObservedBeforeFreeze, false);
assert.equal(c001.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(c001.researchGeneration2EvidenceIncluded, false);
assert.equal(c001.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(c001.researchEvidence.interpretationBoundary.legacySearchProvenStronger, false);
assert.equal(c001.researchEvidence.interpretationBoundary.legacySearchProvenToChooseBetterMoves, false);
assert.equal(c001.researchEvidence.interpretationBoundary.captureBranchExpansionProvenGoodForWinning, false);
assert.equal(c001.mechanism.featureFlag, "pbaiC001NamuaForcedCaptureLegacy");
assert.equal(c001.mechanism.defaultBeforeAdoption, false);
assert.equal(c001.mechanism.rootOnly, true);
assert.equal(c001.mechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(c001.mechanism.timeBudgetChangeAllowed, false);
assert.equal(c001.mechanism.evaluationProfileChangeAllowed, false);
assert.equal(c001.mechanism.evaluationWeightsChangeAllowed, false);
assert.equal(c001.mechanism.persistentTableOrCacheAllowed, false);
assert.equal(c001.mechanism.newSearchAlgorithmAllowed, false);
assert.deepEqual(c001.mechanism.publicCodeSurface, ["public/ai.js"]);
assert.equal(c001.candidateSpecificBenefitGate.development.topSetAgreementDeltaCandidateMinusBaselineMinimum, 0.05);
assert.equal(c001.candidateSpecificBenefitGate.development.meanNormalizedRankLossDeltaCandidateMinusBaselineMaximum, -0.02);
assert.equal(c001.candidateSpecificBenefitGate.development.catastrophicNewLossCountMaximum, 0);
assert.equal(c001.candidateSpecificBenefitGate.globalGateRelaxationAllowed, false);
assert.equal(c001.validationAndHoldoutFirewall.validationExecutionAuthorizedNow, false);
assert.equal(c001.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(c001.rollback.featureDefaultRemainsOffUntilAdoption, true);
assert.equal(c001.rollback.aiGenerationPromotionBeforePublicAdoption, false);

for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-C001 authorized = true only after exact-contract merge"));
assert.ok(candidates.includes("PBAI-C002 authorized = false / HOLD"));
assert.ok(candidates.includes("PBAI-C004 authorized = false / HOLD"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 1 after C001 contract merge"));
assert.ok(candidates.includes("public/main candidate implementations = 0"));
assert.ok(candidates.includes("release holdout execution = NOT-AUTHORIZED"));

// Authorization documents are scoped engineering provenance.
assert.ok(c001Auth.includes("feature flag = pbaiC001NamuaForcedCaptureLegacy"));
assert.ok(c001Auth.includes("release holdout = NOT AUTHORIZED"));
assert.ok(c001Auth.includes("AI-GEN3 = RESERVED / NOT AUTHORIZED"));
assert.ok(c002Auth.includes("feature flag = pbaiC002C03Ordering"));
assert.ok(c004Auth.includes("feature flag = pbaiC004D23RootTtFirst"));
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
