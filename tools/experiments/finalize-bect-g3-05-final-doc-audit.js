#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "../..");
const p = rel => path.join(ROOT, rel);
const read = rel => fs.readFileSync(p(rel), "utf8");
const write = (rel, s) => fs.writeFileSync(p(rel), s);
function mustReplace(s, oldText, newText, label) {
  if (s.includes(newText)) return s;
  if (!s.includes(oldText)) throw new Error(`${label}: expected old text missing`);
  return s.replace(oldText, newText);
}
function mustInclude(s, text, label) {
  if (!s.includes(text)) throw new Error(`${label}: missing ${text}`);
}

const files = {
  root: "README.md",
  index: "doc/RESEARCH_INDEX.md",
  future: "doc/FUTURE_RESEARCH_AGENDA.md",
  rg3Readme: "doc/research-generation-3/README.md",
  rg3Status: "doc/research-generation-3/CURRENT_STATUS.md",
  overview: "doc/branch-expansion-compression-transition/STUDY_1_OVERVIEW.md",
  current: "doc/branch-expansion-compression-transition/CURRENT_STATUS.md",
  studyReadme: "doc/branch-expansion-compression-transition/README.md",
  final: "doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md",
  decision: "doc/branch-expansion-compression-transition/DECISION_REGISTER.md",
  repro: "doc/branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md",
  plan: "doc/research-generation-3/PROGRAM_PLAN.md",
  result: "doc/branch-expansion-compression-transition/results/stage-1/scientific-result.json",
  telemetry: "doc/branch-expansion-compression-transition/results/stage-1/telemetry.json",
  summary: "doc/branch-expansion-compression-transition/results/stage-1/execution-summary.json",
  checkpoint: "doc/branch-expansion-compression-transition/checkpoints/2026-09-02-final-document-consistency-pass.md"
};

let s = read(files.index);
s = mustReplace(
  s,
  "**Research Generation 3 state:** G3-01 remains `TECHNICAL-INVALID`; LGTGMIV remains `FORMAL-ELIGIBLE-ALL`; G3-02 `EBRWS-STUDY1` and G3-03 `TCTGD-STUDY1` remain `CLOSED / TECHNICAL-INVALID`. G3-04 `SFCDF-STUDY1` is now `CLOSED / FORMAL-COMPLETE`: C1 unit-width occupancy is `CONFIRMED / MTAJI-GREATER` and C6 cumulative tree/RAW ratio is `CONFIRMED / NAMUA-GREATER` on the frozen Stage 2 holdout. G3-05 is not automatically authorized; the next program-safe action is a separate post-G3-04 current-state authorization review. Protected depth-10 holdout remains sealed.",
  "**Research Generation 3 state:** G3-01 / G3-02 / G3-03 / G3-05 are `CLOSED / TECHNICAL-INVALID`; LGTGMIV remains `FORMAL-ELIGIBLE-ALL`; G3-04 `SFCDF-STUDY1` remains `CLOSED / FORMAL-COMPLETE` with C1 `CONFIRMED / MTAJI-GREATER` and C6 `CONFIRMED / NAMUA-GREATER`. G3-05 `BECT-STUDY1` has formal promoted candidate set `[]` and Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`. G3-06 is `NOT AUTHORIZED`; the next program-safe scientific action is a separate post-G3-05 current-state authorization review. Protected depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.",
  "RESEARCH_INDEX RG3 current state"
);
write(files.index, s);

s = read(files.overview);
s = mustReplace(s, "状態: **PROSPECTIVE / STAGE 0 TECHNICAL PREPARATION**", "状態: **CLOSED / TECHNICAL-INVALID**", "overview status");
s = mustReplace(
  s,
  "```text\nBECT-S0-TECHNICAL-2026-09-02-v1\nBECT-S1-DEVELOPMENT-2026-09-02-v1\nBECT-S2-FORMAL-2026-09-02-v1\n```",
  "```text\nBECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID\nBECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS\nBECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID\nBECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED\n```",
  "overview stage structure"
);
s = mustReplace(
  s,
  "`31510001..31510240` / target 10 trajectories / **NOT AUTHORIZED**",
  "`31510001..31510240` / target 10 trajectories / **CONSUMED / CLOSED TO SAME-EVIDENCE REUSE**",
  "overview Stage 1 seed"
);
s = mustReplace(
  s,
  "`31520001..31520384` / target 16 trajectories / **NOT AUTHORIZED**",
  "`31520001..31520384` / target 16 trajectories / **NOT CONSUMED / NOT AUTHORIZED**",
  "overview Stage 2 seed"
);
if (!s.includes("## Formal closure")) {
  const anchor = "## Protected evidence\n";
  if (!s.includes(anchor)) throw new Error("overview protected evidence heading missing");
  const block = "## Formal closure\n\nStage 0 v2でlongitudinal reconstructionのtechnical gateをPASSした後、fresh Stage 1をexactly one authorized executionで開始しました。しかしbounded RAW enumeration中に`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529`が発生し、10 trajectories全体のvalid development summaryへ到達しませんでした。\n\nFresh access後であるためsame-evidence repair/rerunは行わず、formal closureは **`CLOSED / TECHNICAL-INVALID`** としました。formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`です。保存されたpartial telemetryはdiagnostic-onlyで、branch expansion/compression transitionの存在・不在を示すscientific evidenceへ格上げしません。\n\n";
  s = s.replace(anchor, block + anchor);
}
write(files.overview, s);

s = read(files.current);
s = mustReplace(
  s,
  "BECT-STUDY1は **`CLOSED / TECHNICAL-INVALID`** として閉じます。Stage 2はauthorizeしません。次に必要なのはfinal report / reproducibility / research-program index類をこのimmutable closureへ同期することです。",
  "BECT-STUDY1は **`CLOSED / TECHNICAL-INVALID`** としてclosure済みで、final report / reproducibility / central research-program documentsの同期も完了しています。Study内の追加scientific executionはありません。次のprogram-level scientific actionはseparate post-G3-05 current-state G3-06 authorization reviewであり、G3-06は現時点で`NOT AUTHORIZED`です。`main`統合は明示的なユーザー指示があるまで実施しません。",
  "CURRENT_STATUS next action"
);
write(files.current, s);

// Current-facing consistency guards.
const root = read(files.root);
mustInclude(root, "G3-05は`CLOSED / TECHNICAL-INVALID`", "root README G3-05 closure");
mustInclude(root, "G3-06は未承認", "root README G3-06 boundary");
const future = read(files.future);
mustInclude(future, "G3-05 `BECT-STUDY1` closed `TECHNICAL-INVALID`", "future agenda current status");
mustInclude(future, "G3-06 separate authorization review required and NOT AUTHORIZED", "future agenda G3-06 boundary");
mustInclude(future, "**P1 / CLOSED / TECHNICAL-INVALID**", "future agenda G3-05 row");
const rg3r = read(files.rg3Readme);
mustInclude(rg3r, "G3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID", "RG3 README G3-05 closure");
mustInclude(rg3r, "G3-06 = NOT AUTHORIZED", "RG3 README G3-06 boundary");
if (rg3r.includes("G3-05はまだauthorizeされていない")) throw new Error("RG3 README stale G3-05 authorization text");
const rg3s = read(files.rg3Status);
mustInclude(rg3s, "G3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID", "RG3 status G3-05 closure");
mustInclude(rg3s, "Next scientific action = separate post-G3-05 current-state authorization review for G3-06", "RG3 status next action");
if (rg3s.includes("post-G3-04 current-state G3-05 authorization review")) throw new Error("RG3 status stale post-G3-04 next action");
const studyReadme = read(files.studyReadme);
mustInclude(studyReadme, "Study status = CLOSED / TECHNICAL-INVALID", "study README closure");
mustInclude(studyReadme, "main integration = NOT PERFORMED", "study README integration boundary");
const final = read(files.final);
mustInclude(final, "BECT-STUDY1 = CLOSED / TECHNICAL-INVALID", "final report closure");
mustInclude(final, "formal promoted candidate set = []", "final report promoted set");
const decision = read(files.decision);
mustInclude(decision, "| BECT-D053 | Study closure | `CLOSED / TECHNICAL-INVALID`", "decision register closure");
const repro = read(files.repro);
mustInclude(repro, "Stage 1 = 31510001..31510240 / CONSUMED / CLOSED TO SAME-EVIDENCE REUSE", "repro Stage 1 namespace");
mustInclude(repro, "BECT-STUDY1 = CLOSED / TECHNICAL-INVALID", "repro closure");

// Scientific result boundary guard.
const result = JSON.parse(read(files.result));
if (result.stageDisposition !== "TECHNICAL-INVALID") throw new Error("scientific result disposition drift");
if (result.authorizedScientificExecutions !== 1 || result.actualScientificExecutions !== 1) throw new Error("scientific execution count drift");
if (result.seedBlockConsumed !== true || result.noRescueBoundaryCrossed !== true) throw new Error("no-rescue drift");
if (result.technicalError?.message !== "relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529") throw new Error("technical-error drift");

const runId = process.env.GITHUB_RUN_ID || "local";
const head = process.env.GITHUB_SHA || "unknown";
const checkpoint = `# BECT-STUDY1 — Final document consistency checkpoint\n\nDate: 2026-09-02  \nStatus: **FINAL-DOCUMENT-CONSISTENCY-PASS**\n\n## Audited state\n\n\`\`\`text\nStudy = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID\nStage 1 = TECHNICAL-INVALID / 1 authorized / 1 actual\nStage 1 seed = 31510001..31510240 / CONSUMED\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seed = 31520001..31520384 / NOT CONSUMED\nG3-06 = NOT AUTHORIZED / separate post-G3-05 review required\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ\nmain integration = NOT PERFORMED\n\`\`\`\n\n## Scope\n\nRoot \`README.md\`, \`doc/RESEARCH_INDEX.md\`, \`doc/FUTURE_RESEARCH_AGENDA.md\`, Research Generation 3 current-facing documents, and BECT study-local README / overview / current status / final report / decision register / reproducibility index were cross-checked. Historical \`PROGRAM_PLAN.md\`, frozen protocol/preregistration, and scientific result bytes are not altered by this documentation audit.\n\nAudit workflow run: \`${runId}\`  \nAudit trigger HEAD: \`${head}\`\n`;
write(files.checkpoint, checkpoint);

console.log(JSON.stringify({
  disposition: "BECT-G3-05-FINAL-DOCUMENT-CONSISTENCY-PASS",
  study: "CLOSED / TECHNICAL-INVALID",
  promotedCandidates: [],
  stage2: "NOT-AUTHORIZED-NOT-EXECUTED",
  g306Authorized: false,
  protectedDepth10: "SEALED / NOT GENERATED / NOT READ",
  mainIntegrationPerformed: false
}));
