#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "../..");
const p = rel => path.join(ROOT, rel);
const files = {
  root: p("README.md"),
  index: p("doc/RESEARCH_INDEX.md"),
  future: p("doc/FUTURE_RESEARCH_AGENDA.md"),
  rg3Status: p("doc/research-generation-3/CURRENT_STATUS.md"),
  rg3Readme: p("doc/research-generation-3/README.md"),
  g303Status: p("doc/transposition-concentration-tree-graph-divergence/CURRENT_STATUS.md"),
  g303Repro: p("doc/transposition-concentration-tree-graph-divergence/REPRODUCIBILITY_INDEX.md"),
  g304Status: p("doc/structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md"),
  programPlan: p("doc/research-generation-3/PROGRAM_PLAN.md")
};
function read(f){ return fs.readFileSync(f,"utf8"); }
function write(f,s){ fs.writeFileSync(f,s); }
function mustReplace(s, oldText, newText, label){
  if (s.includes(newText)) return s;
  if (!s.includes(oldText)) throw new Error(`${label}: expected text missing`);
  return s.replace(oldText,newText);
}
function mustInclude(s, text, label){ if(!s.includes(text)) throw new Error(`${label}: missing ${text}`); }

const planBefore = read(files.programPlan);

let s = read(files.root);
s = mustReplace(
  s,
  "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01は`TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-02は`CLOSED / TECHNICAL-INVALID`で不変。G3-03 / `TCTGD-STUDY1`もsingle authorized Stage 1でprototype-sensitive verification defectにより`CLOSED / TECHNICAL-INVALID`、formal promoted candidate set `[]`、Stage 2未実行。depth-10 holdoutはsealedのままで、次のStudyにはpost-G3-03 program reviewが必要。",
  "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01は`TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-02とG3-03は`CLOSED / TECHNICAL-INVALID`で不変。G3-04 / `SFCDF-STUDY1`は`CLOSED / FORMAL-COMPLETE`で、C1は`CONFIRMED / MTAJI-GREATER`、C6は`CONFIRMED / NAMUA-GREATER`。depth-10 holdoutはsealedのまま。G3-05は未承認で、次はseparate post-G3-04 authorization reviewが必要。",
  "root RG3 status"
);
s = s.replace("[`doc/transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`](doc/transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md)", "[`doc/transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`](doc/transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md)");
s = s.replace("[`doc/structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`](doc/structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md)", "[`doc/structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`](doc/structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md)");
write(files.root,s);

s = read(files.index);
s = mustReplace(
  s,
  "**Boundary:** canonical value equalityをpost hoc rescueとして用いず、同じStage 1 seedをprototype修正後に再実行しない。次のStudyにはseparate post-G3-03 program reviewが必要。",
  "**Boundary:** canonical value equalityをpost hoc rescueとして用いず、同じStage 1 seedをprototype修正後に再実行しない。post-G3-03 program reviewはその後別途完了し、G3-04が独立Studyとして実施・closureされたが、これはTCTGD-STUDY1を救済・再分類するものではない。",
  "RESEARCH_INDEX G3-03 boundary"
);
if (!s.includes("transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md")) {
  const needle = "- [`transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`](transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md)";
  mustInclude(s, needle, "RESEARCH_INDEX G3-03 final link");
  s = s.replace(needle, "- [`transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`](transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md)\n" + needle);
}
const g304Final = "- [`structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`](structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md)";
const g304Overview = "- [`structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`](structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md)";
if (s.indexOf(g304Final) < s.indexOf(g304Overview)) {
  s = s.replace(`${g304Final}\n${g304Overview}`, `${g304Overview}\n${g304Final}`);
}
write(files.index,s);

s = read(files.future);
s = mustReplace(
  s,
  "**P0 / CLOSED / TECHNICAL-INVALID / NEXT PROGRAM REVIEW REQUIRED**",
  "**P0 / CLOSED / TECHNICAL-INVALID**",
  "FUTURE G3-02 stale next-review token"
);
write(files.future,s);

s = read(files.rg3Status);
s = mustReplace(
  s,
  "Neither G3-02 nor G3-03 generated/read/peeked at it. G2-12 is not used as depth-10 truth.",
  "G3-02 / G3-03 / G3-04はいずれもこのholdoutを生成・read・peekしていない。G2-12はdepth-10 truthの代替として使用しない。",
  "RG3 CURRENT_STATUS protected evidence"
);
if (!s.includes("G3-04のformal positive claimはC1/C6")) {
  const anchor = "## Next program boundary";
  mustInclude(s, anchor, "RG3 CURRENT_STATUS next boundary");
  const block = "G3-04のformal positive claimはC1/C6のfrozen candidate-level phase differenceだけに限定する。C1/C6をgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、position value / win probability、causal phase effect、relative depth 5を超える一般化へ拡張しない。\n\n";
  s = s.replace(anchor, block + anchor);
}
const oldClosureRecords = "Canonical closure records:\n\n- `../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`";
const newClosureRecords = "Canonical closure records:\n\n- `../transposition-concentration-tree-graph-divergence/README.md`\n- `../transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`\n- `../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`";
s = mustReplace(s, oldClosureRecords, newClosureRecords, "RG3 CURRENT_STATUS G3-03 closure records");
write(files.rg3Status,s);

s = read(files.rg3Readme);
if (!s.includes("../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md")) {
  const needle = "- [`../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`](../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md) — completed G3-04 formal result and interpretation boundary";
  mustInclude(s, needle, "RG3 README G3-04 final link");
  s = s.replace(needle, "- [`../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`](../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md) — G3-04初見向けformal overview\n" + needle);
}
s = mustReplace(
  s,
  "G3-03で将来観測されるtransposition/reconvergenceやtree/graph divergenceも、strategic simplicity、tactical simplicity、search ease、best-move clarity、game-theoretic forcing、value、win probability、human difficulty、causal strategic effectへ自動的に読み替えない。",
  "G3-03のtechnical-invalid runに残るdiagnostic transposition/reconvergenceやtree/graph divergence方向を、strategic simplicity、tactical simplicity、search ease、best-move clarity、game-theoretic forcing、value、win probability、human difficulty、causal strategic effectへ読み替えない。G3-04のformal C1/C6も同様に、frozen bounded phase-difference claimを超えて解釈しない。",
  "RG3 README interpretation boundary"
);
if (!s.includes("../transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md")) {
  const anchor = "## Canonical records\n\n";
  mustInclude(s, anchor, "RG3 README canonical heading");
  const block = "- `../transposition-concentration-tree-graph-divergence/README.md`\n- `../transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`\n- `../transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md`\n- `../structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`\n- `../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md`\n- `../structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md`\n- `../structural-forcing-corridor-decision-funnel/DECISION_REGISTER.md`\n- `../structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md`\n- `../research-program-decisions/2026-09-02-post-g3-03-g3-04-authorization-review.md`\n";
  s = s.replace(anchor, anchor + block);
}
write(files.rg3Readme,s);

s = read(files.g303Status);
s = mustReplace(
  s,
  "program review = G3-03-AUTHORIZED",
  "program review = G3-03-AUTHORIZED\npost-G3-03 program review = COMPLETED / G3-04-AUTHORIZED / separate downstream Study; no G3-03 rescue",
  "G3-03 CURRENT_STATUS program review"
);
s = mustReplace(
  s,
  "next scientific action = separate post-G3-03 current-state program review before any G3-04 or later Study authorization",
  "next scientific action = none within TCTGD-STUDY1; Study remains closed. The separate post-G3-03 review later authorized G3-04, which subsequently closed independently.",
  "G3-03 CURRENT_STATUS next action"
);
write(files.g303Status,s);

s = read(files.g303Repro);
if (!s.includes("- `README.md`\n- `STUDY_1_OVERVIEW.md`")) {
  const anchor = "## Closure records\n\n- `STUDY_1_FINAL_REPORT.md`";
  const repl = "## Closure records\n\n- `README.md`\n- `STUDY_1_OVERVIEW.md`\n- `STUDY_1_FINAL_REPORT.md`";
  s = mustReplace(s, anchor, repl, "G3-03 REPRO closure records");
}
write(files.g303Repro,s);

s = read(files.g304Status);
s = mustReplace(
  s,
  "Scientific executionは完了した。次の作業はclosure文書の整合性確認、Research Generation 3 current-facing documentsへの反映、通常PRによる`main`統合である。",
  "Scientific executionとclosure/current-facing文書の整合性反映は完了した。`main`統合は未実施であり、明示的な統合指示があるまで行わない。program上の次科学作業はseparate post-G3-04 G3-05 authorization reviewであり、G3-05はまだauthorizeされていない。",
  "G3-04 CURRENT_STATUS repository lifecycle"
);
write(files.g304Status,s);

const planAfter = read(files.programPlan);
if (planAfter !== planBefore) throw new Error("historical PROGRAM_PLAN changed unexpectedly");

for (const rel of [
  "doc/transposition-concentration-tree-graph-divergence/README.md",
  "doc/transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md",
  "doc/structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md"
]) {
  if (!fs.existsSync(p(rel))) throw new Error(`required doc missing: ${rel}`);
}
console.log(JSON.stringify({
  disposition:"G3-03-G3-04-DOC-CONSISTENCY-FINALIZED",
  historicalProgramPlanModified:false,
  mainIntegrationPerformed:false,
  g303:"CLOSED / TECHNICAL-INVALID",
  g304:"CLOSED / FORMAL-COMPLETE",
  g305Authorized:false,
  protectedDepth10:"SEALED / NOT GENERATED / NOT READ"
}));
