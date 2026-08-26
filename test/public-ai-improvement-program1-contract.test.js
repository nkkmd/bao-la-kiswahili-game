"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readJson = (rel) => JSON.parse(read(rel));

const index = read("doc/AI_ENGINEERING_INDEX.md");
const naming = read("doc/ai-engineering/AI_GENERATION_NAMING.md");
const readme = read("doc/ai-engineering/public-ai-improvement-program-1/README.md");
const status = read("doc/ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md");
const audit = read("doc/ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md");
const baseline = read("doc/ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md");
const baselineManifest = readJson(
  "doc/ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json",
);
const bench = read("doc/ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md");
const gateSpec = readJson(
  "doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json",
);
const candidates = read("doc/ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md");
const c002 = readJson(
  "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C002-v1.json",
);
const releases = read("doc/ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md");
const authDecision = read(
  "doc/engineering-program-decisions/2026-08-26-pbai-c002-v1-development-authorization.md",
);

for (const text of [index, readme, status, audit, baseline, bench, candidates, releases, authDecision]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

assert.ok(readme.includes("PBAI-A/B/C COMPLETE"));
assert.ok(readme.includes("PBAI-D PBAI-C002-v1 CONTRACT FROZEN"));
assert.ok(readme.includes("Research Generation 2 outcomeはPBAI-P1へ逐次流入させない"));
assert.ok(readme.includes("PBAI-E  isolated PBAI-C002-v1 development / ablation"));

assert.ok(status.includes("PBAI-A Research Generation 1 evidence audit = COMPLETE"));
assert.ok(status.includes("PBAI-B AI-GEN2 exact public baseline = COMPLETE"));
assert.ok(status.includes("PBAI-C global benchmark / numeric non-regression / release gates = COMPLETE / FROZEN"));
assert.ok(status.includes("PBAI-D first exact candidate contract = PBAI-C002-v1 / FROZEN"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 1"));
assert.ok(status.includes("candidate implementations = 0"));
assert.ok(status.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(status.includes("public AI code changed by PBAI-P1 = false"));
assert.ok(status.includes("Research Generation 2 evidence included = false"));
assert.ok(status.includes("AI-GEN3 promotion = NOT-AUTHORIZED"));

assert.ok(audit.includes("PBAI-A = COMPLETE"));
assert.ok(audit.includes("AI.stateKey != Research Generation 1 authoritative RAW identity contract"));

assert.ok(baseline.includes("Status: **FROZEN / PBAI-B COMPLETE**"));
assert.equal(baselineManifest.baselineFrozen, true);
assert.equal(baselineManifest.baselineId, "AI-GEN2-BASELINE-2026-08-26-v1");
assert.equal(baselineManifest.authorization.AI_GEN3PromotionAuthorized, false);

assert.ok(bench.includes("Status: **FROZEN / PBAI-C GLOBAL NUMERIC GATES COMPLETE**"));
assert.equal(gateSpec.status, "FROZEN-BEFORE-CANDIDATE-IMPLEMENTATION");
assert.equal(gateSpec.baselineId, baselineManifest.baselineId);
assert.equal(gateSpec.candidateImplementationsObservedBeforeFreeze, 0);
assert.equal(gateSpec.candidateOutcomesObservedBeforeFreeze, 0);
assert.equal(gateSpec.releaseHoldout.authorizedAtPBAI_C, false);
assert.equal(gateSpec.candidateSpecificGateFloor.mayRelaxGlobalGate, false);
assert.equal(gateSpec.releaseDecision.noAcceptableCandidateOutcome, "KEEP-AI-GEN2");

assert.equal(c002.candidateId, "PBAI-C002");
assert.equal(c002.candidateVersion, "PBAI-C002-v1");
assert.equal(c002.status, "FROZEN-FOR-DEVELOPMENT");
assert.equal(c002.authorization, "AUTHORIZED-FOR-DEVELOPMENT-AFTER-CONTRACT-MERGE");
assert.equal(c002.baselineId, baselineManifest.baselineId);
assert.equal(c002.globalGateSpecId, gateSpec.gateSpecId);
assert.equal(c002.candidateImplementationObservedBeforeFreeze, false);
assert.equal(c002.candidateOutcomeObservedBeforeFreeze, false);
assert.equal(c002.researchGeneration2EvidenceIncluded, false);
assert.equal(c002.researchEvidence.formalCandidate, "TM-S2-C03");
assert.equal(c002.researchEvidence.formalDecision, "CONFIRMED");
assert.equal(c002.researchEvidence.humanExpertFollowup.n, 0);
assert.equal(c002.mechanism.featureFlag, "pbaiC002C03Ordering");
assert.equal(c002.mechanism.defaultBeforeAdoption, false);
assert.equal(c002.mechanism.scope, "enhanced alpha-beta move ordering only");
assert.equal(c002.mechanism.selectiveExtensionAllowed, false);
assert.equal(c002.mechanism.evaluationBonusAllowed, false);
assert.equal(c002.mechanism.forcedMoveAllowed, false);
assert.equal(c002.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);
assert.equal(c002.candidateSpecificBenefitGate.globalGateRelaxationAllowed, false);

for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-C002 authorized = true"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 1"));
assert.ok(candidates.includes("candidate implementations = 0"));
assert.ok(candidates.includes("release holdout execution = NOT-AUTHORIZED"));

assert.ok(authDecision.includes("AUTHORIZE DEVELOPMENT AFTER THIS CONTRACT-FREEZE CHANGE IS MERGED"));
assert.ok(authDecision.includes("feature flag = pbaiC002C03Ordering"));
assert.ok(authDecision.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(authDecision.includes("AI-GEN3 = RESERVED / NOT-AUTHORIZED"));
assert.ok(releases.includes("NO PBAI-P1 PUBLIC RELEASE YET"));

for (const text of [index, naming, readme, status, baseline]) {
  assert.ok(text.includes("AI-GEN2"), "AI-GEN2 naming marker missing");
  assert.ok(text.includes("AI-GEN3"), "AI-GEN3 naming marker missing");
}
assert.ok(naming.includes("AI-GEN3 promotion before public adoption = prohibited"));
assert.ok(naming.includes("Research Generation 2"));

const forbiddenStatusClaims = [
  "Research Generation 2 evidence included = true",
  "candidate implementations = 1",
  "release holdout execution = AUTHORIZED",
  "public AI code changed by PBAI-P1 = true",
  "AI-GEN3 promotion = AUTHORIZED"
];
for (const claim of forbiddenStatusClaims) {
  assert.ok(!status.includes(claim), `unexpected PBAI state claim: ${claim}`);
}

console.log("PBAI-P1 engineering program contract audit: PASS");
