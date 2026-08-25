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
const bench = read("doc/ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md");
const candidates = read("doc/ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md");
const decisions = read("doc/ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md");
const releases = read("doc/ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md");
const namingDecision = read("doc/engineering-program-decisions/2026-08-26-ai-generation-naming-convention.md");

for (const text of [index, readme, status, audit, baseline, bench, candidates, decisions, releases]) {
  assert.ok(text.includes("PBAI-P1"), "PBAI-P1 marker missing");
}

assert.ok(readme.includes("Generation-2 research outcomesはPBAI-P1へ逐次流入させない"));
assert.ok(readme.includes("public AIの評価関数、探索、重み、UI、worker、時間配分、state identityを変更するcandidate implementation"));
assert.ok(status.includes("candidate implementations = 0"));
assert.ok(status.includes("public AI code changed by program establishment = false"));
assert.ok(baseline.includes("baselineFrozen = false"));
assert.ok(bench.includes("release holdoutはcandidate tuningに使用しない"));
assert.ok(bench.includes("Ablation rule"));
assert.ok(candidates.includes("PBAI-C001"));
assert.ok(candidates.includes("PBAI-C005"));
assert.ok(candidates.includes("NO CANDIDATE AUTHORIZED FOR IMPLEMENTATION"));
assert.ok(decisions.includes("No unvalidated win-probability semantics"));
assert.ok(decisions.includes("RAW identity remains authoritative"));
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
assert.ok(baseline.includes("generationLineage = AI-GEN2"));
assert.ok(baseline.includes("AI-GEN3 promotionAuthorized = false"));
assert.ok(namingDecision.includes("AI-GEN3 promotion authorized now = false"));

const forbidden = [
  "Generation-2 research outcomes are included",
  "baselineFrozen = true",
  "candidate implementations = 1",
  "public AI code changed by program establishment = true"
];
for (const f of forbidden) {
  assert.ok(!status.includes(f), `unexpected establishment-state claim: ${f}`);
}

console.log("PBAI-P1 engineering program contract audit: PASS");
