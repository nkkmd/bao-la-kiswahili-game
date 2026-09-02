#!/usr/bin/env node
"use strict";

const cp = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const oldScript = path.join(__dirname, "finalize-g3-03-g3-04-doc-consistency.js");
const futurePath = path.join(ROOT, "doc/FUTURE_RESEARCH_AGENDA.md");
const planPath = path.join(ROOT, "doc/research-generation-3/PROGRAM_PLAN.md");

const planBefore = fs.readFileSync(planPath, "utf8");
cp.execFileSync(process.execPath, [oldScript], { stdio: "inherit" });

let s = fs.readFileSync(futurePath, "utf8");
const oldLine = "- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: LGTGMIV closure後の別authorization reviewを経て`EBRWS-STUDY1`としてprospectively開始。Stage 0は`STAGE0-PASS`。Stage 1はauthorized runのcanonical artifact materialization failureと、workflow armingに起因するunintended duplicate scientific executionによるexactly-one-execution contract違反のためfail-closedで`CLOSED / TECHNICAL-INVALID`。formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。**P0 / CLOSED / TECHNICAL-INVALID / NEXT PROGRAM REVIEW REQUIRED**";
const newLine = "- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: LGTGMIV closure後の別authorization reviewを経て`EBRWS-STUDY1`としてprospectively開始。Stage 0は`STAGE0-PASS`。Stage 1はauthorized runのcanonical artifact materialization failureと、workflow armingに起因するunintended duplicate scientific executionによるexactly-one-execution contract違反のためfail-closedで`CLOSED / TECHNICAL-INVALID`。formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。**P0 / CLOSED / TECHNICAL-INVALID**";
if (s.includes(oldLine)) {
  s = s.replace(oldLine, newLine);
} else if (!s.includes(newLine)) {
  throw new Error("FUTURE_RESEARCH_AGENDA: exact G3-02 Wave A line missing");
}
fs.writeFileSync(futurePath, s);

if (fs.readFileSync(planPath, "utf8") !== planBefore) {
  throw new Error("historical PROGRAM_PLAN changed unexpectedly");
}

console.log(JSON.stringify({
  disposition: "G3-03-G3-04-DOC-CONSISTENCY-FINALIZED-V2",
  futureG302StaleReviewTokenRemoved: true,
  historicalProgramPlanModified: false,
  mainIntegrationPerformed: false
}));
