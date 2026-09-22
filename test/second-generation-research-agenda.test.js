"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");
const agenda = read("doc/FUTURE_RESEARCH_AGENDA.md");
const index = read("doc/RESEARCH_INDEX.md");
const synthesis = read("doc/research-generation-2/FINAL_SYNTHESIS.md");
const programDecision = read("doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md");

// This is a Generation-2 content-preservation audit, not a pin on the
// repository-wide agenda layout. FUTURE_RESEARCH_AGENDA.md is now a current
// cross-generation agenda, while the closed Generation-2 study inventory and
// decisions are preserved in FINAL_SYNTHESIS.md and the historical program
// decision.
const versionMatch = agenda.match(/^Version:\s*(\d+)\.(\d+)\.(\d+)$/m);
assert.ok(versionMatch, "FUTURE_RESEARCH_AGENDA.md missing semantic Version line");
assert.ok(Number(versionMatch[1]) >= 2, "FUTURE_RESEARCH_AGENDA.md regressed below Generation-2 agenda version");

assert.ok(agenda.includes("Research Generation 2: **Closed (2026-08-31)**"),
  "FUTURE_RESEARCH_AGENDA.md missing closed Generation-2 status");
assert.ok(agenda.includes("[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)"),
  "FUTURE_RESEARCH_AGENDA.md missing Generation-2 synthesis navigation");

assert.ok(synthesis.includes("Core agenda: `G2-01..G2-12`"));
assert.ok(synthesis.includes("状態: **`PROGRAM CLOSED / INTEGRATED TO MAIN`**"));
for (let i = 1; i <= 12; i += 1) {
  const label = `G2-${String(i).padStart(2, "0")}`;
  assert.ok(synthesis.includes(`| \`${label}\``) || synthesis.includes(`\`${label}\``),
    `Generation-2 synthesis missing ${label}`);
}
assert.ok(synthesis.includes("G2-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING"));
assert.ok(synthesis.includes("`G2-05` | `DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`"));
assert.ok(synthesis.includes("公開AIの棋力・速度・UX・deploymentを研究endpointにしない。"));
assert.ok(synthesis.includes("RAW state identity = authoritative"));

assert.ok(programDecision.includes("Generation 2 core = G2-01 .. G2-12"));
assert.ok(programDecision.includes("Human track = G2-H01 (independent / non-blocking)"));
assert.ok(programDecision.includes("AI improvement = separate engineering program, outside Generation 2 scientific endpoints"));
assert.ok(programDecision.includes("G2-05 Deep RAW State-Space Enumeration Study 1 closure"));

assert.ok(index.includes("第二世代の純粋研究プログラム"), "RESEARCH_INDEX missing Generation 2 navigation");
assert.ok(/独立(?:した)?engineering track/.test(index), "RESEARCH_INDEX missing research/AI separation");

console.log("Second-generation pure research agenda audit: PASS");
