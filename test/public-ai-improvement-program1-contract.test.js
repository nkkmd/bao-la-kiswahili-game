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
const candidates = read("doc/ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md");
const decisions = read("doc/ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md");
const releases = read("doc/ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md");
const namingDecision = read("doc/engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md");

for (const text of [index, readme, status, audit, baseline, bench, candidates, decisions, releases]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

assert.ok(readme.includes("Research Generation 2 research outcomesはPBAI-P1へ逐次流入させない"));
assert.ok(readme.includes("Candidate implementationはまだ禁止する"));

assert.ok(status.includes("PBAI-A Research Generation 1 evidence audit = COMPLETE"));
assert.ok(status.includes("PBAI-B AI-GEN2 exact public baseline = COMPLETE"));
assert.ok(status.includes("AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1"));
assert.ok(status.includes("PBAI-C benchmark framework = FRAMEWORK-FROZEN"));
assert.ok(status.includes("PBAI-C numeric non-regression / release gates = NOT-FROZEN / NEXT"));
assert.ok(status.includes("AUTHORIZED-FOR-DEVELOPMENT = 0"));
assert.ok(status.includes("candidate implementations = 0"));
assert.ok(status.includes("public AI code changed by PBAI-P1 = false"));
assert.ok(status.includes("Research Generation 2 evidence included = false"));

assert.ok(audit.includes("PBAI-A = COMPLETE"));
assert.ok(audit.includes("14-Study Research Generation 1 scientific evidence core")
  || audit.includes("14 Study core"));
assert.ok(audit.includes("AI.stateKey != Research Generation 1 authoritative RAW identity contract"));
assert.ok(audit.includes("candidate development authorization = 0"));

assert.ok(baseline.includes("Status: **FROZEN / PBAI-B COMPLETE**"));
assert.ok(baseline.includes("AI-GEN2-BASELINE-2026-08-26-v1"));
assert.ok(baseline.includes("baselineFrozen = true"));
assert.ok(baseline.includes("PBAI-C numeric non-regression/release gates = NOT-FROZEN"));
assert.ok(baseline.includes("AI-GEN3 promotionAuthorized = false"));

assert.equal(baselineManifest.baselineFrozen, true);
assert.equal(baselineManifest.baselineId, "AI-GEN2-BASELINE-2026-08-26-v1");
assert.equal(baselineManifest.generationLineage, "AI-GEN2");
assert.equal(baselineManifest.sourceOfTruth.repositoryCommit,
  "f4ae3b11901180cbe417b3e643e2b357d8045d2d");
assert.equal(baselineManifest.authorization.candidateImplementationAuthorized, false);
assert.equal(baselineManifest.authorization.authorizedForDevelopmentCount, 0);
assert.equal(baselineManifest.authorization.PBAI_C_numericGatesFrozen, false);
assert.equal(baselineManifest.authorization.AI_GEN3PromotionAuthorized, false);

assert.ok(bench.includes("release holdoutはcandidate tuningに使用しない"));
assert.ok(bench.includes("Ablation rule"));

for (const id of ["PBAI-C001", "PBAI-C002", "PBAI-C003", "PBAI-C004", "PBAI-C005"]) {
  assert.ok(candidates.includes(id), `${id} missing`);
}
assert.ok(candidates.includes("PBAI-A COMPLETE / NO CANDIDATE AUTHORIZED FOR IMPLEMENTATION"));
assert.ok(candidates.includes("AUTHORIZED-FOR-DEVELOPMENT count = 0"));
assert.ok((candidates.match(/EVIDENCE-AUDIT-READY/g) || []).length >= 5,
  "all initial candidates should be evidence-audit-ready");

assert.ok(decisions.includes("No unvalidated win-probability semantics"));
assert.ok(decisions.includes("RAW identity remains authoritative"));
assert.ok(decisions.includes("D11 — Canonical Research Generation 1 evidence core"));
assert.ok(decisions.includes("D12 — PBAI-A complete"));
assert.ok(decisions.includes("D13 — Current `AI.stateKey` is not the Research Generation 1 RAW identity contract"));
assert.ok(decisions.includes("D16 — Exact AI-GEN2 baseline identity"));
assert.ok(decisions.includes("D22 — PBAI-B complete; PBAI-C numeric gate freeze is next"));
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
  "public AI code changed by PBAI-P1 = true",
  "AI-GEN3 promotion = AUTHORIZED"
];
for (const f of forbidden) {
  assert.ok(!status.includes(f), `unexpected PBAI state claim: ${f}`);
}

console.log("PBAI-P1 engineering program contract audit: PASS");
