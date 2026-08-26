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
const decisions = read(`${base}DECISION_REGISTER.md`);
const releases = read(`${base}RELEASE_REGISTER.md`);
const c002 = readJson(`${base}candidates/PBAI-C002-v1.json`);
const c002Result = readJson(`${base}candidates/PBAI-C002-v1-development-result.json`);
const c004Support = readJson(`${base}candidates/PBAI-C004-v1-predevelopment-support-result.json`);
const c004 = readJson(`${base}candidates/PBAI-C004-v1.json`);
const c004Result = readJson(`${base}candidates/PBAI-C004-v1-development-result.json`);
const c002Auth = read("doc/engineering-program-decisions/2026-08-26-pbai-c002-v1-development-authorization.md");
const c004Auth = read("doc/engineering-program-decisions/2026-08-26-pbai-c004-v1-development-authorization.md");

for (const text of [index, readme, status, audit, baseline, bench, candidates, decisions, releases, c002Auth, c004Auth]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

// Program and public-lineage state.
assert.ok(readme.includes("PBAI-A/B/C COMPLETE"));
assert.ok(readme.includes("C002 HOLD / C004 HOLD"));
assert.ok(readme.includes("no candidate currently authorized"));
assert.ok(readme.includes("Research Generation 2 outcomeはPBAI-P1へ逐次流入させない"));
assert.ok(status.includes("PBAI-A Research Generation 1 evidence audit = COMPLETE"));
assert.ok(status.includes("PBAI-B AI-GEN2 exact public baseline = COMPLETE"));
assert.ok(status.includes("PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN"));
assert.ok(status.includes("PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("PBAI-C004-v1 = DEVELOPMENT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 0"));
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

// Historical C002 authorization contract remains frozen; later result controls current disposition.
assert.equal(c002.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c002.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c002.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(c002Result.finalDevelopmentStatus, "NON-ESTIMABLE-HOLD");
assert.equal(c002Result.developmentPullRequestMerged, false);
assert.equal(c002Result.candidateBenefitMetricsObserved, false);
assert.equal(c002Result.materialization.candidateSupport.eligibleTargets, 5);
assert.equal(c002Result.materialization.candidateSupport.minimumEstimableTargets, 48);
assert.equal(c002Result.decision.developmentAuthorizationContinues, false);
assert.equal(c002Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c002Result.decision.mainPublicResult, "KEEP-AI-GEN2");

// C004 support remains baseline-only and pre-implementation.
assert.equal(c004Support.status, "SUPPORT-PASS");
assert.equal(c004Support.canonicalExecution.workflowRunId, 32917223072);
assert.equal(c004Support.developmentPopulation.populationDigest,
  "fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734");
assert.equal(c004Support.targetSupport.eligible, 54);
assert.equal(c004Support.targetSupport.minimumEstimable, 48);
assert.equal(c004Support.targetSupport.supportPass, true);
assert.equal(c004Support.measurement.deterministicCanonicalBestChangedAmongOverlap, 5);
assert.equal(c004Support.measurement.deterministicCanonicalBestStableAmongOverlap, 197);
assert.equal(c004Support.firewall.candidateImplementationObserved, false);
assert.equal(c004Support.firewall.candidateBenefitMetricsObserved, false);
assert.equal(c004Support.firewall.validationSeedsAccessed, false);
assert.equal(c004Support.firewall.releaseHoldoutSeedsAccessed, false);

// Historical C004 exact contract remains immutable after the candidate closes.
assert.equal(c004.candidateId, "PBAI-C004");
assert.equal(c004.candidateVersion, "PBAI-C004-v1");
assert.equal(c004.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c004.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c004.baselineId, baselineManifest.baselineId);
assert.equal(c004.globalGateSpecId, gates.gateSpecId);
assert.equal(c004.candidateImplementationObservedBeforeFreeze, false);
assert.equal(c004.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(c004.researchGeneration2EvidenceIncluded, false);
assert.equal(c004.researchEvidence.formalDecision, "INCONCLUSIVE");
assert.equal(c004.researchEvidence.interpretationBoundary.validatedHumanDifficultyClassifier, false);
assert.equal(c004.researchEvidence.interpretationBoundary.validatedGeneralComplexityClassifier, false);
assert.equal(c004.mechanism.featureFlag, "pbaiC004D23RootTtFirst");
assert.equal(c004.mechanism.defaultBeforeAdoption, false);
assert.equal(c004.mechanism.rootOnly, true);
assert.equal(c004.mechanism.searchDepthBudgetChangeAllowed, false);
assert.equal(c004.mechanism.timeBudgetChangeAllowed, false);
assert.equal(c004.mechanism.evaluationChangeAllowed, false);
assert.equal(c004.mechanism.quiescenceChangeAllowed, false);
assert.equal(c004.mechanism.persistentTableOrCacheAllowed, false);
assert.equal(c004.mechanism.forcedMoveAllowed, false);
assert.equal(c004.candidateSpecificPopulation.primaryTarget.developmentSupportAlreadyObserved, 54);
assert.equal(c004.candidateSpecificPopulation.boundaryTriggerStratum.developmentSupportAlreadyObserved, 5);
assert.equal(c004.candidateSpecificPopulation.negativeControl.developmentSupportAlreadyObserved, 197);
assert.equal(c004.candidateSpecificBenefitGate.globalGateRelaxationAllowed, false);
assert.equal(c004.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(c004.rollback.aiGenerationPromotionBeforePublicAdoption, false);

// Later C004 development result is now authoritative for current candidate disposition.
assert.equal(c004Result.finalDevelopmentStatus, "DEVELOPMENT-FAIL-HOLD");
assert.equal(c004Result.development.pullRequest, 58);
assert.equal(c004Result.development.pullRequestMerged, false);
assert.equal(c004Result.development.pullRequestClosedWithoutMerge, true);
assert.equal(c004Result.development.mainPublicImplementationChanged, false);
assert.equal(c004Result.workflowProvenance.runId, 32918902388);
assert.equal(c004Result.workflowProvenance.jobId, 98028290217);
assert.equal(c004Result.workflowProvenance.artifactId, 9589217604);
assert.equal(c004Result.population.digest,
  "fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734");
assert.equal(c004Result.population.primarySelected, 54);
assert.equal(c004Result.population.boundarySelected, 5);
assert.equal(c004Result.population.negativeControlsSelected, 32);
assert.equal(c004Result.preMetricSafety.status, "PASS");
assert.equal(c004Result.preMetricSafety.candidateBenefitMetricsObservedBeforePass, false);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioCandidateOverBaseline, 1);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioMaximum, 0.95);
assert.equal(c004Result.developmentGate.primary.medianNodeRatioGatePassed, false);
assert.equal(c004Result.developmentGate.primary.fractionRootsCandidateNodesLessThanOrEqualBaseline,
  46 / 54);
assert.equal(c004Result.developmentGate.primary.fractionNonWorseGatePassed, true);
assert.equal(c004Result.developmentGate.semanticSafetyPrimaryAndBoundary.rootScoreMismatchCount, 0);
assert.equal(c004Result.developmentGate.semanticSafetyPrimaryAndBoundary.candidateOutsideFrozenD4TopSetCount, 0);
assert.equal(c004Result.developmentGate.semanticSafetyPrimaryAndBoundary.catastrophicNewLossCount, 0);
assert.equal(c004Result.developmentGate.boundary.aggregateNodeRatioCandidateOverBaseline, 1);
assert.equal(c004Result.developmentGate.boundary.passed, true);
assert.equal(c004Result.developmentGate.negativeControl.triggerFailureCount, 0);
assert.equal(c004Result.developmentGate.negativeControl.exactEqualityFailureCount, 0);
assert.equal(c004Result.developmentGate.allGateBooleans.medianNodeRatio, false);
assert.equal(c004Result.developmentGate.developmentPass, false);
assert.equal(c004Result.decision.candidateStatus, "HOLD");
assert.equal(c004Result.decision.developmentAuthorizationContinues, false);
assert.equal(c004Result.decision.sameVersionRetuningAllowed, false);
assert.equal(c004Result.decision.validationAuthorized, false);
assert.equal(c004Result.decision.releaseHoldoutAuthorized, false);
assert.equal(c004Result.decision.publicAdoptionAuthorized, false);
assert.equal(c004Result.decision.aiGen3PromotionAuthorized, false);
assert.equal(c004Result.decision.mainPublicResult, "KEEP-AI-GEN2");
assert.equal(c004Result.executionBoundary.validationExecuted, false);
assert.equal(c004Result.executionBoundary.releaseHoldoutExecuted, false);
assert.equal(c004Result.executionBoundary.researchGeneration2EvidenceIncluded, false);

for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-C002 authorized = false / HOLD"));
assert.ok(candidates.includes("PBAI-C004 authorized = false / HOLD"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 0"));
assert.ok(candidates.includes("isolated development implementation attempts = 2"));
assert.ok(candidates.includes("public/main candidate implementations = 0"));
assert.ok(candidates.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(decisions.includes("D41 — PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD"));

// Historical authorization documents remain provenance, not current authorization.
assert.ok(c002Auth.includes("feature flag = pbaiC002C03Ordering"));
assert.ok(c004Auth.includes("feature flag = pbaiC004D23RootTtFirst"));
assert.ok(c004Auth.includes("release holdout = NOT AUTHORIZED"));
assert.ok(c004Auth.includes("AI-GEN3 = RESERVED / NOT AUTHORIZED"));
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
