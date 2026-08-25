"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const index = read("doc/AI_ENGINEERING_INDEX.md");
const naming = read("doc/ai-engineering/AI_GENERATION_NAMING.md");
const readme = read("doc/ai-engineering/public-ai-improvement-program-1/README.md");
const status = read("doc/ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md");
const audit = read("doc/ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md");
const baseline = read("doc/ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md");
const baselineManifest = JSON.parse(read(
  "doc/ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json",
));
const bench = read("doc/ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md");
const gateSpec = JSON.parse(read(
  "doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json",
));
const candidates = read("doc/ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md");
const decisions = read("doc/ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md");
const releases = read("doc/ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md");
const namingDecision = read("doc/engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md");

for (const text of [index, readme, status, audit, baseline, bench, candidates, decisions, releases]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

assert.ok(readme.includes("Research Generation 2 outcomeはPBAI-P1へ逐次流入させない"));
assert.ok(readme.includes("PBAI-D exact candidate contract next"));

assert.ok(status.includes("PBAI-A Research Generation 1 evidence audit = COMPLETE"));
assert.ok(status.includes("PBAI-B AI-GEN2 exact public baseline = COMPLETE"));
assert.ok(status.includes("PBAI-C global benchmark / numeric non-regression / release gates = COMPLETE / FROZEN"));
assert.ok(status.includes("PBAI-C gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 0"));
assert.ok(status.includes("candidate implementations = 0"));
assert.ok(status.includes("release holdout execution = NOT-AUTHORIZED"));
assert.ok(status.includes("public AI code changed by PBAI-P1 = false"));
assert.ok(status.includes("Research Generation 2 evidence included = false"));

assert.ok(audit.includes("PBAI-A = COMPLETE"));
assert.ok(audit.includes("AI.stateKey != Research Generation 1 authoritative RAW identity contract"));

assert.ok(baseline.includes("Status: **FROZEN / PBAI-B COMPLETE**"));
assert.equal(baselineManifest.baselineFrozen, true);
assert.equal(baselineManifest.baselineId, "AI-GEN2-BASELINE-2026-08-26-v1");
assert.equal(baselineManifest.authorization.candidateImplementationAuthorized, false);
assert.equal(baselineManifest.authorization.AI_GEN3PromotionAuthorized, false);

assert.ok(bench.includes("Status: **FROZEN / PBAI-C GLOBAL NUMERIC GATES COMPLETE**"));
assert.ok(bench.includes("PBAI-C-GLOBAL-GATES-2026-08-26-v1"));
assert.ok(bench.includes("release holdout executionは**NOT-AUTHORIZED**"));
assert.ok(bench.includes("core observed candidate score >= 0.50"));
assert.ok(bench.includes("catastrophic new loss count = 0"));
assert.ok(bench.includes("median elapsed(candidate / baseline) <= 1.05"));
assert.ok(bench.includes("KEEP-AI-GEN2"));

assert.equal(gateSpec.status, "FROZEN-BEFORE-CANDIDATE-IMPLEMENTATION");
assert.equal(gateSpec.baselineId, baselineManifest.baselineId);
assert.equal(gateSpec.candidateImplementationsObservedBeforeFreeze, 0);
assert.equal(gateSpec.candidateOutcomesObservedBeforeFreeze, 0);
assert.equal(gateSpec.researchGeneration2EvidenceIncluded, false);
assert.equal(gateSpec.fixedDepthStrength.globalGate.validation.coreObservedScoreMinimum, 0.50);
assert.equal(gateSpec.fixedDepthStrength.globalGate.releaseHoldout.coreObservedScoreMinimum, 0.50);
assert.equal(gateSpec.fixedDepthStrength.globalGate.lockedValidationPlusHoldout.coreOneSided95LowerBoundMinimum, 0.48);
assert.equal(gateSpec.decisionQuality.gate.validation.catastrophicNewLossCountMaximum, 0);
assert.equal(gateSpec.operationalQuality.gate.crashOrUnhandledExceptionCountMaximum, 0);
assert.equal(gateSpec.correctnessAndRegression.publicEngineSha256MustRemain,
  baselineManifest.fileIdentity["public/engine.js"].sha256);
assert.equal(gateSpec.releaseHoldout.authorizedAtPBAI_C, false);
assert.equal(gateSpec.candidateSpecificGateFloor.mayRelaxGlobalGate, false);
assert.equal(gateSpec.releaseDecision.noAcceptableCandidateOutcome, "KEEP-AI-GEN2");

for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-C GLOBAL GATES FROZEN / NO CANDIDATE AUTHORIZED FOR IMPLEMENTATION"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 0"));
assert.ok((candidates.match(/EVIDENCE-AUDIT-READY/g) || []).length >= 5,
  "all initial candidates remain evidence-audit-ready");

assert.ok(decisions.includes("D23 — Global gate-spec identity and pre-outcome freeze"));
assert.ok(decisions.includes("D24 — Playing-strength non-inferiority rule"));
assert.ok(decisions.includes("D31 — PBAI-C complete; PBAI-D is next"));
assert.ok(releases.includes("NO PBAI-P1 PUBLIC RELEASE YET"));

for (const text of [index, naming, readme, status, baseline, namingDecision]) {
  assert.ok(text.includes("AI-GEN2"), "AI-GEN2 naming marker missing");
  assert.ok(text.includes("AI-GEN3"), "AI-GEN3 naming marker missing");
}
assert.ok(naming.includes("AI-GEN1"));
assert.ok(naming.includes("`bao-v2`という既存experimental evaluation profile名は`AI-GEN2`を意味しない"));
assert.ok(naming.includes("AI-GEN3 promotion before public adoption = prohibited"));
assert.ok(naming.includes("Research Generation 2"));
assert.ok(status.includes("AI-GEN3 promotion = NOT-AUTHORIZED"));
assert.ok(namingDecision.includes("AI-GEN3 promotion authorized now = false"));

const forbidden = [
  "Research Generation 2 evidence included = true",
  "AUTHORIZED-FOR-DEVELOPMENT = 1",
  "candidate implementations = 1",
  "release holdout execution = AUTHORIZED",
  "public AI code changed by PBAI-P1 = true",
  "AI-GEN3 promotion = AUTHORIZED"
];
for (const f of forbidden) {
  assert.ok(!status.includes(f), `unexpected PBAI state claim: ${f}`);
}

console.log("PBAI-P1 engineering program contract audit: PASS");
