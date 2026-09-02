#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "../..");
const p = rel => path.join(ROOT, rel);
const planPath = p("doc/research-generation-3/PROGRAM_PLAN.md");
const planBefore = fs.readFileSync(planPath, "utf8");

function edit(rel, fn) {
  const f = p(rel);
  const before = fs.readFileSync(f, "utf8");
  const after = fn(before);
  if (after === before) return false;
  fs.writeFileSync(f, after);
  return true;
}
function insertAfterOnce(s, anchor, addition, guard, label) {
  if (s.includes(guard)) return s;
  if (!s.includes(anchor)) throw new Error(`${label}: anchor missing`);
  return s.replace(anchor, anchor + addition);
}

const changed = [];

if (edit("doc/transposition-concentration-tree-graph-divergence/README.md", s =>
  insertAfterOnce(
    s,
    "- `STUDY_1_FINAL_REPORT.md` — scientific/technical closureの正本\n",
    "- `../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md` — program-level closure decision\n",
    "2026-09-02-g3-03-technical-invalid-closure.md",
    "G3-03 README"
  ))) changed.push("doc/transposition-concentration-tree-graph-divergence/README.md");

if (edit("doc/transposition-concentration-tree-graph-divergence/REPRODUCIBILITY_INDEX.md", s =>
  insertAfterOnce(
    s,
    "- `DECISION_REGISTER.md`\n",
    "- `../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md`\n",
    "../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md",
    "G3-03 REPRO"
  ))) changed.push("doc/transposition-concentration-tree-graph-divergence/REPRODUCIBILITY_INDEX.md");

if (edit("doc/structural-forcing-corridor-decision-funnel/README.md", s =>
  insertAfterOnce(
    s,
    "- `STUDY_1_OVERVIEW.md` — 研究全体の概要\n",
    "- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md` — program-level closure decision\n",
    "2026-09-02-g3-04-formal-complete-closure.md",
    "G3-04 README"
  ))) changed.push("doc/structural-forcing-corridor-decision-funnel/README.md");

if (edit("doc/structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md", s => {
  if (s.includes("../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md")) return s;
  const anchor = "- `checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md`\n";
  if (!s.includes(anchor)) throw new Error("G3-04 REPRO closure anchor missing");
  return s.replace(anchor, anchor + "- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`\n- `../research-generation-3/checkpoints/2026-09-02-g3-04-formal-complete-closure.md`\n");
})) changed.push("doc/structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md");

if (edit("doc/structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md", s => {
  if (s.includes("program-level closure decision = RECORDED")) return s;
  const anchor = "## Repository lifecycle\n\n";
  if (!s.includes(anchor)) throw new Error("G3-04 CURRENT_STATUS repository lifecycle anchor missing");
  return s.replace(anchor, anchor + "program-level closure decision = RECORDED (`../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`)。RG3 closure checkpoint = `../research-generation-3/checkpoints/2026-09-02-g3-04-formal-complete-closure.md`。\n\n");
})) changed.push("doc/structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md");

if (edit("doc/research-generation-3/CURRENT_STATUS.md", s => {
  if (s.includes("`../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`")) return s;
  const anchor = "Canonical records:\n\n- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`\n";
  if (!s.includes(anchor)) throw new Error("RG3 CURRENT_STATUS G3-04 canonical block missing");
  const repl = "Canonical records:\n\n- `../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`\n- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`\n";
  s = s.replace(anchor, repl);
  const anchor2 = "- `../structural-forcing-corridor-decision-funnel/checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md`\n";
  if (!s.includes(anchor2)) throw new Error("RG3 CURRENT_STATUS G3-04 checkpoint anchor missing");
  return s.replace(anchor2, anchor2 + "- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`\n- `checkpoints/2026-09-02-g3-04-formal-complete-closure.md`\n");
})) changed.push("doc/research-generation-3/CURRENT_STATUS.md");

if (edit("doc/research-generation-3/README.md", s => {
  if (s.includes("2026-09-02-g3-04-formal-complete-closure.md")) return s;
  const anchor = "- `../research-program-decisions/2026-09-02-post-g3-03-g3-04-authorization-review.md`\n";
  if (!s.includes(anchor)) throw new Error("RG3 README canonical authorization anchor missing");
  return s.replace(anchor, anchor + "- `../research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`\n- `checkpoints/2026-09-02-g3-04-formal-complete-closure.md`\n");
})) changed.push("doc/research-generation-3/README.md");

if (edit("doc/RESEARCH_INDEX.md", s => {
  if (s.includes("research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md")) return s;
  const anchor = "- [`structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md`](structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md)\n";
  if (!s.includes(anchor)) throw new Error("RESEARCH_INDEX G3-04 details anchor missing");
  return s.replace(anchor, anchor + "- [`research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md`](research-program-decisions/2026-09-02-g3-04-formal-complete-closure.md) — G3-04 program-level closure / G3-05未承認境界\n- [`research-generation-3/checkpoints/2026-09-02-g3-04-formal-complete-closure.md`](research-generation-3/checkpoints/2026-09-02-g3-04-formal-complete-closure.md) — RG3 closure checkpoint\n");
})) changed.push("doc/RESEARCH_INDEX.md");

if (fs.readFileSync(planPath, "utf8") !== planBefore) throw new Error("historical PROGRAM_PLAN changed unexpectedly");

console.log(JSON.stringify({
  disposition: "G3-03-G3-04-PROGRAM-CLOSURE-LINKS-MATERIALIZED",
  changed,
  historicalProgramPlanModified: false,
  scientificEvidenceChanged: false,
  mainIntegrationPerformed: false
}, null, 2));
