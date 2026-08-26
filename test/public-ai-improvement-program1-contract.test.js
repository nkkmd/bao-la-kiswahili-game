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
const resume = read(`${base}RESUME_HERE.md`);
const status = read(`${base}CURRENT_STATUS.md`);
const audit = read(`${base}GENERATION_1_EVIDENCE_AUDIT.md`);
const baseline = read(`${base}BASELINE_SPEC.md`);
const baselineManifest = readJson(`${base}baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`);
const bench = read(`${base}BENCHMARK_PROTOCOL.md`);
const gates = readJson(`${base}benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`);
const candidates = read(`${base}CANDIDATE_REGISTER.md`);
const decisions = read(`${base}DECISION_REGISTER.md`);
const releases = read(`${base}RELEASE_REGISTER.md`);

const c001 = readJson(`${base}candidates/PBAI-C001-v1.json`);
const c001Result = readJson(`${base}candidates/PBAI-C001-v1-development-result.json`);
const c002Result = readJson(`${base}candidates/PBAI-C002-v1-development-result.json`);
const c003Spec = readJson(`${base}candidates/PBAI-C003-v1-predevelopment-support-spec.json`);
const c003Result = readJson(`${base}candidates/PBAI-C003-v1-predevelopment-support-result.json`);
const c004Result = readJson(`${base}candidates/PBAI-C004-v1-development-result.json`);

for (const text of [index, readme, resume, status, audit, baseline, bench, candidates, decisions, releases]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

// Program/public state.
assert.ok(readme.includes("PBAI-A/B/C COMPLETE"));
assert.ok(readme.includes("C001 HOLD / C002 HOLD / C003 HOLD / C004 HOLD / C005 not authorized"));
assert.ok(status.includes("PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #61 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD / PR #63 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C005 = EVIDENCE-AUDIT-READY / NOT AUTHORIZED"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 0"));
assert.ok(status.includes("active candidate implementations = 0"));
assert.ok(status.includes("public/main candidate implementations = 0"));
assert.ok(status.includes("validation execution = NOT-AUTHORIZED"));
assert.ok(status.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(status.includes("public AI code changed by PBAI-P1 = false"));
assert.ok(status.includes("Research Generation 2 evidence included = false"));
assert.ok(status.includes("AI-GEN3 promotion = NOT-AUTHORIZED"));

// Frozen A/B/C controls.
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

// Historical C001 closure remains binding.
assert.equal(c001.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c001.mechanism.featureFlag, "pbaiC001NamuaForcedCaptureLegacy");
assert.equal(c001Result.finalDevelopmentStatus, "DEVELOPMENT-FAIL-HOLD");
assert.equal(c001Result.development.pullRequest, 61);
assert.equal(c001Result.development.pullRequestMerged, false);
assert.equal(c001Result.developmentGate.developmentPass, false);
assert.equal(c001Result.decision.developmentAuthorizationContinues, false);
assert.equal(c001Result.decision.validationAuthorized, false);
assert.equal(c001Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c001Result.decision.aiGen3PromotionAuthorized, false);
assert.equal(c001Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// Historical C002 closure remains binding.
assert.equal(c002Result.finalDevelopmentStatus, "NON-ESTIMABLE-HOLD");
assert.equal(c002Result.materialization.candidateSupport.eligibleTargets, 5);
assert.equal(c002Result.materialization.candidateSupport.minimumEstimableTargets, 48);
assert.equal(c002Result.candidateBenefitMetricsObserved, false);
assert.equal(c002Result.decision.developmentAuthorizationContinues, false);
assert.equal(c002Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c002Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// Historical C004 closure remains binding.
assert.equal(c004Result.finalDevelopmentStatus, "DEVELOPMENT-FAIL-HOLD");
assert.equal(c004Result.development.pullRequest, 58);
assert.equal(c004Result.development.pullRequestMerged, false);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioCandidateOverBaseline, 1);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioMaximum, 0.95);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioGatePassed, false);
assert.equal(c004Result.decision.developmentAuthorizationContinues, false);
assert.equal(c004Result.decision.validationAuthorized, false);
assert.equal(c004Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c004Result.decision.aiGen3PromotionAuthorized, false);
assert.equal(c004Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// C003 support contract was prospective and support-only.
assert.equal(c003Spec.candidateId, "PBAI-C003");
assert.equal(c003Spec.candidateVersion, "PBAI-C003-v1");
assert.equal(c003Spec.status, "FROZEN-PREDEVELOPMENT-SUPPORT-PROBE");
assert.equal(c003Spec.freezeSourceMain, "5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06");
assert.equal(c003Spec.researchEvidence.formalDecision, "EXACT-SOLVED-WITHIN-FROZEN-DOMAIN");
assert.equal(c003Spec.researchEvidence.stateCount, 8);
assert.deepEqual(c003Spec.identityContract.requiredFields, ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
assert.equal(c003Spec.identityContract.aiStateKeyAllowed, false);
assert.equal(c003Spec.identityContract.symmetryCanonicalizationAllowed, false);
assert.equal(c003Spec.identityContract.missingPendingAllowed, false);
assert.equal(c003Spec.firewall.candidateImplementationObserved, false);
assert.equal(c003Spec.firewall.candidateBenefitMetricsObserved, false);
assert.equal(c003Spec.firewall.validationSeedBlockAccessAuthorized, false);
assert.equal(c003Spec.firewall.releaseHoldoutSeedBlockAccessAuthorized, false);

// C003 binding result is identity-gate non-estimability, not a zero-hit result.
assert.equal(c003Result.finalSupportStatus, "NON-ESTIMABLE-PRACTICAL-REACHABILITY-HOLD");
assert.equal(c003Result.failureStage, "STRICT-RAW-IDENTITY-BINDING");
assert.equal(c003Result.failureReason, "ORACLE-STORED-ROW-REHASH-MISMATCH");
assert.equal(c003Result.workflowProvenance.workflowRunId, 32960056255);
assert.equal(c003Result.workflowProvenance.jobId, 98150197902);
assert.equal(c003Result.workflowProvenance.pullRequest, 63);
assert.equal(c003Result.workflowProvenance.pullRequestMerged, false);
assert.equal(c003Result.workflowProvenance.pullRequestClosedWithoutMerge, true);
assert.equal(c003Result.identityBindingResult.passed, false);
assert.equal(c003Result.identityBindingResult.reachabilityMeasurementExecuted, false);
assert.equal(c003Result.identityBindingResult.trajectoriesWithNonterminalOracleHit, null);
assert.equal(c003Result.identityBindingResult.uniqueNonterminalOracleStatesHit, null);
assert.equal(c003Result.identityBindingResult.zeroHitConclusionAuthorized, false);
assert.equal(c003Result.identityBindingResult.knownAffectedRepositoryRowsFromORISC.length, 3);
assert.equal(c003Result.identityBindingResult.firstObservedMismatch.storedStateKey, "469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6");
assert.equal(c003Result.identityBindingResult.firstObservedMismatch.strictRawRecomputedKey, "7849cf1069ca9c966d111bb83a1fb36915abedb4a8533083778fb67f71a39a70");
assert.equal(c003Result.identityBindingResult.firstObservedMismatch.identityFieldDifference, "pending");
assert.equal(c003Result.researchBoundary.restrictedEndgameFormalDecisionChanged, false);
assert.equal(c003Result.researchBoundary.oriscFormalDecisionChanged, false);
assert.equal(c003Result.firewall.candidateImplementationObserved, false);
assert.equal(c003Result.firewall.candidateBenefitMetricsObserved, false);
assert.equal(c003Result.firewall.validationSeedsAccessed, false);
assert.equal(c003Result.firewall.releaseHoldoutSeedsAccessed, false);
assert.equal(c003Result.firewall.publicCodeChanged, false);
assert.equal(c003Result.firewall.developmentAuthorizationGranted, false);
assert.equal(c003Result.firewall.aiGen3PromotionAuthorized, false);
assert.equal(c003Result.noRescueRule.sameVersionIdentityRelaxationAllowed, false);
assert.equal(c003Result.noRescueRule.sameVersionSeedBlockExpansionAllowed, false);
assert.equal(c003Result.noRescueRule.sameVersionSyntheticFixtureSubstitutionAllowed, false);
assert.equal(c003Result.mainPublicResult, "KEEP-AI-GEN2");

// Central docs and restart checkpoint agree on zero authorization and C005 read-only next step.
for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-C003 authorized = false / HOLD"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 0"));
assert.ok(resume.includes("The next task is **PBAI-C005 read-only production-surface audit**"));
assert.ok(resume.includes("hit count = null / unmeasured"));
assert.ok(resume.includes("zero-hit conclusion = NOT AUTHORIZED"));
assert.ok(decisions.includes("D48 — PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD"));
assert.ok(releases.includes("NO PBAI-P1 PUBLIC RELEASE YET"));

for (const text of [index, naming, readme, resume, status, baseline]) {
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
