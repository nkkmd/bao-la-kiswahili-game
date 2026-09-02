#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ROOT = path.resolve(__dirname, "../..");
const p = rel => path.join(ROOT, rel);

const files = {
  root: p("README.md"),
  index: p("doc/RESEARCH_INDEX.md"),
  future: p("doc/FUTURE_RESEARCH_AGENDA.md"),
  rg3Status: p("doc/research-generation-3/CURRENT_STATUS.md"),
  rg3Readme: p("doc/research-generation-3/README.md"),
  studyReadme: p("doc/branch-expansion-compression-transition/README.md"),
  repro: p("doc/branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md"),
  programPlan: p("doc/research-generation-3/PROGRAM_PLAN.md")
};

function read(f){ return fs.readFileSync(f,"utf8"); }
function write(f,s){ fs.writeFileSync(f,s); }
function sha256(s){ return crypto.createHash("sha256").update(s,"utf8").digest("hex"); }
function need(x,m){ if(!x) throw new Error(m); }
function replaceOnce(s, oldText, newText, label){
  if (s.includes(newText)) return s;
  need(s.includes(oldText), `${label}: expected text missing`);
  return s.replace(oldText,newText);
}
function replaceLine(s, prefix, replacement, label){
  const lines=s.split("\n");
  const idx=lines.findIndex(x=>x.startsWith(prefix));
  need(idx>=0, `${label}: line prefix missing: ${prefix}`);
  if(lines[idx]===replacement)return s;
  lines[idx]=replacement;
  return lines.join("\n");
}
function insertAfter(s, anchor, block, marker, label){
  if(s.includes(marker))return s;
  need(s.includes(anchor), `${label}: anchor missing`);
  return s.replace(anchor, anchor + block);
}
function insertBefore(s, anchor, block, marker, label){
  if(s.includes(marker))return s;
  need(s.includes(anchor), `${label}: anchor missing`);
  return s.replace(anchor, block + anchor);
}
function appendOnce(s, block, marker){ return s.includes(marker)?s:s.replace(/\s*$/,"\n")+block; }

const planBefore = read(files.programPlan);
const planShaBefore = sha256(planBefore);

// Study-local README: current-facing lifecycle only; frozen protocol/prereg remain untouched.
let s=read(files.studyReadme);
const statusStart="## Current status\n\n```text\n";
const start=s.indexOf(statusStart);
need(start>=0,"study README status start missing");
const end=s.indexOf("```", start+statusStart.length);
need(end>=0,"study README status end missing");
const newStatus=`## Current status\n\n\`\`\`text\nStudy = BECT-STUDY1\nProgram position = G3-05\nStudy status = CLOSED / TECHNICAL-INVALID\nprogram review = G3-05-AUTHORIZED\nprospective preregistration = FROZEN / IMMUTABLE\nStage 0 v1 = BECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID\nStage 0 v2 = BECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS\nStage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID / executions 1 authorized / 1 actual\nStage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED\nStage 1 seed = 31510001..31510240 / CONSUMED\nStage 2 seed = 31520001..31520384 / NOT CONSUMED\nformal promoted candidate set = []\nno-rescue boundary = CROSSED / ACTIVE\nprotected depth-10 holdout = SEALED / NOT GENERATED / NOT READ\nmain integration = NOT PERFORMED\n\`\`\``;
s=s.slice(0,start)+newStatus+s.slice(end+3);
if(!s.includes("`STUDY_1_FINAL_REPORT.md` — formal closure")){
  s=replaceOnce(s,
    "- `STUDY_1_OVERVIEW.md` — 研究目的と現時点の境界",
    "- `STUDY_1_OVERVIEW.md` — 研究目的とprospective boundary\n- `STUDY_1_FINAL_REPORT.md` — formal closure / technical-invalid result / interpretation boundary",
    "study README final report link");
}
write(files.studyReadme,s);

// Reproducibility index: retain historical preauthorization sections, update namespace current status and append immutable closure provenance.
s=read(files.repro);
s=replaceOnce(s,
  "Stage 1 = 31510001..31510240 / NOT CONSUMED / NOT AUTHORIZED\nStage 2 = 31520001..31520384 / NOT CONSUMED / NOT AUTHORIZED",
  "Stage 1 = 31510001..31510240 / CONSUMED / CLOSED TO SAME-EVIDENCE REUSE\nStage 2 = 31520001..31520384 / NOT CONSUMED / NOT AUTHORIZED",
  "repro reserved namespaces");
const reproBlock=`\n## Stage 1 authorization and exactly-one execution\n\nAuthorization baseline and control plane:\n\n\`\`\`text\nauthorized scientific content HEAD = 5ba3706193a06902650b82f1232d19bb2cee2c1e\nauthorization commit = 5cceaeeece7c6d7949815a47b7ef918bbae72e59\nauthorization nonce = BECT-S1-AUTH-2026-09-02-V1-01\nmaxScientificExecutions = 1\ntrigger commit = 75b29fd33215bd98652613975c5b0c900f065b9d\nworkflow run = 33636606641\nlease job = 100268940443 / success\nscientific job = 100268996072 / exit 2 after canonical TECHNICAL-INVALID result\nlease commit = bf1f8a5940bfb87f8c92d482728aa89ce398b749\nauthorized scientific executions = 1\nactual scientific executions = 1\nfresh access started = true\nStage 1 seed consumed = true\nno-rescue boundary = CROSSED / ACTIVE\n\`\`\`\n\nCanonical technical error:\n\n\`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529\`\n\nNo Stage 1 rerun was performed or authorized.\n\n## Stage 1 durable artifact and exact-byte mirror\n\n\`\`\`text\nartifact ID = 9849245665\nartifact name = bect-stage1-development-result-33636606641\nartifact size = 4081 bytes\nartifact ZIP SHA-256 = 0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc\nscientific-result.json SHA-256 = a21ad5449dfa090e4ff2ed87ebc64a48b5fb0755eabd0dcfe375358bde7d0b96\ntelemetry.json SHA-256 = 0608c9f035a19c4908ba02d0b462e2e0f4ca08226df3ec1062d2086dbca7f2b4\nexecution-summary.json SHA-256 = b54f441cadac0252dc15deac07c90974bc28e18d26d2dd3934b3fb6707fb352f\nmirror workflow run = 33637372364\nmirror commit = ac2bd2ca101a9002c69131c2c39ebbfbb98368a1\nscientific recomputation for recovery = false\n\`\`\`\n\nRepository blobs after exact-byte mirror:\n\n\`\`\`text\nresults/stage-1/scientific-result.json = c7daf6f7d2f4ea96fa0b752ff90216daff800482\nresults/stage-1/telemetry.json = 378bab53d13b6bd27c961dffda1a2ec797a94009\nresults/stage-1/execution-summary.json = 58281cb78e364947a32e0a8fbec05581a32ce11a\n\`\`\`\n\nPartial telemetry contains 25 roots from the first selected trajectory (plies 16..40). Those rows are diagnostic provenance only; they do not constitute a valid Stage 1 development dataset and cannot be used for formal promotion.\n\n## Formal closure\n\nCanonical records:\n\n- \`STUDY_1_FINAL_REPORT.md\`\n- \`CURRENT_STATUS.md\`\n- \`DECISION_REGISTER.md\`\n- \`checkpoints/2026-09-02-stage-1-technical-invalid-study-closure.md\`\n- \`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md\`\n- \`../research-generation-3/checkpoints/2026-09-02-g3-05-technical-invalid-closure.md\`\n\n\`\`\`text\nBECT-STUDY1 = CLOSED / TECHNICAL-INVALID\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seed = NOT CONSUMED\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ\nmain integration = NOT PERFORMED\n\`\`\`\n\nThis closure is a technical validity result, not a negative/null scientific result for Bao geometry transitions. Same-evidence rescue is prohibited.\n`;
s=appendOnce(s,reproBlock,"## Stage 1 authorization and exactly-one execution");
write(files.repro,s);

// RG3 current-facing README.
s=read(files.rg3Readme);
s=replaceLine(s,"Status = ","Status = ACTIVE / G3-05 BECT-STUDY1 CLOSED TECHNICAL-INVALID / POST-G3-05 G3-06 REVIEW REQUIRED / G3-06 NOT AUTHORIZED","RG3 README status");
const g304SeedAnchor="G3-04 Stage 2 seed = CONSUMED\n";
const g305StatusBlock=`G3-05 program review = G3-05-AUTHORIZED\nG3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID\nG3-05 Stage 0 v2 = STAGE0-PASS\nG3-05 Stage 1 = TECHNICAL-INVALID / executions 1 authorized / 1 actual\nG3-05 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nG3-05 formal promoted candidate set = []\nG3-05 Stage 1 seed = 31510001..31510240 / CONSUMED\nG3-05 Stage 2 seed = 31520001..31520384 / NOT CONSUMED\nG3-05 no-rescue boundary = CROSSED / ACTIVE\nG3-06 = NOT AUTHORIZED / separate post-G3-05 review required\n`;
s=insertAfter(s,g304SeedAnchor,g305StatusBlock,"G3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID","RG3 README G3-05 status");
const firstReadAnchor="- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state\n";
const firstReadBlock="- [`../branch-expansion-compression-transition/STUDY_1_OVERVIEW.md`](../branch-expansion-compression-transition/STUDY_1_OVERVIEW.md) — G3-05 prospective scope and frozen boundary\n- [`../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`](../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md) — G3-05 technical-invalid closure and no-rescue boundary\n- [`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md) — G3-05 program closure / G3-06 not authorized\n";
s=insertAfter(s,firstReadAnchor,firstReadBlock,"../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md","RG3 README first-read links");
write(files.rg3Readme,s);

// RG3 current status: update top current-facing lines and add closure section without rewriting historical G3-01..G3-04 chronology.
s=read(files.rg3Status);
s=replaceLine(s,"Program status = ","Program status = ACTIVE / G3-05 CLOSED TECHNICAL-INVALID / POST-G3-05 G3-06 REVIEW REQUIRED / G3-06 NOT AUTHORIZED","RG3 CURRENT_STATUS program status");
const g304NoRescueAnchor="G3-04 no-rescue boundary = CROSSED / ACTIVE\n";
const g305CurrentBlock=`G3-05 program review = G3-05-AUTHORIZED\nG3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID\nG3-05 Stage 0 v2 = STAGE0-PASS\nG3-05 Stage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID\nG3-05 Stage 1 authorized scientific executions = 1\nG3-05 Stage 1 actual scientific executions = 1\nG3-05 Stage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED\nG3-05 formal promoted candidate set = []\nG3-05 Stage 1 seed = 31510001..31510240 / CONSUMED\nG3-05 Stage 2 seed = 31520001..31520384 / NOT CONSUMED\nG3-05 no-rescue boundary = CROSSED / ACTIVE\nG3-06 = NOT AUTHORIZED\n`;
s=insertAfter(s,g304NoRescueAnchor,g305CurrentBlock,"G3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID","RG3 CURRENT_STATUS G3-05 status");
s=replaceLine(s,"Active scientific research branch = ","Active scientific research branch = none / G3-05 CLOSED on research/g3-05-branch-expansion-compression-transition","RG3 CURRENT_STATUS active branch");
s=replaceLine(s,"Next scientific action = ","Next scientific action = separate post-G3-05 current-state authorization review for G3-06; G3-06 is NOT AUTHORIZED","RG3 CURRENT_STATUS next action");
const rg3ClosureBlock=`## G3-05 formal closure\n\nG3-05 was prospectively frozen as \`BECT-STUDY1\` — Branch Expansion and Compression Transition Study 1. Stage 0 v2 passed the longitudinal technical contract. Stage 1 was then authorized and executed exactly once on fresh seed namespace \`31510001..31510240\`.\n\nThe execution entered fresh bounded RAW measurement and failed closed with \`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529\`. The canonical result is \`TECHNICAL-INVALID\`; Stage 1 seed is consumed and the no-rescue boundary is active. Partial telemetry is diagnostic-only and yields no formal promoted candidates.\n\n\`\`\`text\nG3-05 = CLOSED / TECHNICAL-INVALID\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seed = NOT CONSUMED\n\`\`\`\n\nDurable artifact \`9849245665\` (ZIP SHA-256 \`0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc\`) was mirrored exactly without scientific recomputation by run \`33637372364\`, commit \`ac2bd2ca101a9002c69131c2c39ebbfbb98368a1\`.\n\nG3-06 is not automatically authorized. The only next scientific program action is a separate post-G3-05 current-state authorization review; that review may not use G3-05 partial telemetry as validated transition evidence.\n\nCanonical closure records:\n\n- \`../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md\`\n- \`../branch-expansion-compression-transition/CURRENT_STATUS.md\`\n- \`../branch-expansion-compression-transition/DECISION_REGISTER.md\`\n- \`../branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md\`\n- \`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md\`\n- \`checkpoints/2026-09-02-g3-05-technical-invalid-closure.md\`\n\n`;
s=insertBefore(s,"## Protected evidence",rg3ClosureBlock,"## G3-05 formal closure","RG3 CURRENT_STATUS closure section");
write(files.rg3Status,s);

// Future agenda: update only current-facing status and G3-05/G3-06 execution labels. Historical plan remains separate and immutable.
s=read(files.future);
s=replaceLine(s,"Research Generation 3:","Research Generation 3: **Active / G3-05 `BECT-STUDY1` closed `TECHNICAL-INVALID` / formal promoted candidate set `[]` / Stage 2 not authorized / G3-06 separate authorization review required and NOT AUTHORIZED (2026-09-02)**","FUTURE RG3 status");
s=replaceOnce(s,"**P1 / NEXT PROGRAM AUTHORIZATION REVIEW REQUIRED / NOT AUTHORIZED**","**P1 / CLOSED / TECHNICAL-INVALID**","FUTURE G3-05 status token");
const g306Old="- **G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1**: capture、reserve、nyumba、Namua→Mtaji等のrule-semantic eventとbounded local geometryの関係をmove-conditionedに検証する。**P1**";
const g306New="- **G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1**: capture、reserve、nyumba、Namua→Mtaji等のrule-semantic eventとbounded local geometryの関係をmove-conditionedに検証する。G3-05 partial telemetry / transition directionをvalidated inputとして継承しない。**P1 / NEXT PROGRAM AUTHORIZATION REVIEW REQUIRED / NOT AUTHORIZED**";
s=replaceOnce(s,g306Old,g306New,"FUTURE G3-06 status");
const updateHeading="### 2026-09-02 Research Generation 3 current update\n\n";
const updateBlock="<!-- BECT-G3-05-CLOSURE:FUTURE -->\nG3-05 `BECT-STUDY1`はStage 0 v2を`STAGE0-PASS`として完了後、fresh Stage 1をexactly one authorized executionで開始したが、bounded RAW enumeration中の`relay-limit` technical errorにより`TECHNICAL-INVALID`でfail-closedした。Stage 1 seed `31510001..31510240`はconsume済み、no-rescue boundaryはactive、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。partial telemetryはdiagnostic-onlyで、branch expansion/compression transitionのpositive/negative scientific evidenceへ格上げしない。G3-06は自動authorizeせず、次はseparate post-G3-05 current-state authorization reviewを行う。\n\n";
s=insertAfter(s,updateHeading,updateBlock,"<!-- BECT-G3-05-CLOSURE:FUTURE -->","FUTURE current update");
write(files.future,s);

// Central research index: append a self-contained G3-05 entry; do not renumber historical sections.
s=read(files.index);
const indexBlock=`\n---\n\n<!-- BECT-G3-05-CLOSURE:RESEARCH-INDEX -->\n### Research Generation 3 / G3-05 — Branch Expansion and Compression Transition Study 1\n\n**Study ID:** \`BECT-STUDY1\`  \n**状態:** \`CLOSED / TECHNICAL-INVALID\`  \n**formal promoted candidate set:** \`[]\`  \n**Stage 2:** \`NOT-AUTHORIZED-NOT-EXECUTED\`\n\n同一trajectory上のRAW-only relative depth-5 local geometryをply-to-plyで測定し、branch expansion / compression、persistence、reversal、reopening等のtransition structureをprospectively検証する独立Study。Stage 0 v2はtechnical validationをPASSした。Stage 1はfresh seed block \`31510001..31510240\`をexactly one authorized executionで開始したが、bounded enumeration中の\`relay-limit\` technical errorでfail-closedし、valid 10-trajectory development summaryには到達しなかった。\n\nこれはbranch expansion/compression transitionのnegative/null scientific findingではない。partial telemetry 25 rootsはdiagnostic provenanceに限定し、formal candidate promotionやsubstantive claimへ使用しない。同一seed/evidenceの修正再実行はno-rescue ruleにより禁止。Stage 2 seed \`31520001..31520384\`は未消費で、protected depth-10 holdoutも\`SEALED / NOT GENERATED / NOT READ\`。\n\n**最初に読む:**\n\n- [\`branch-expansion-compression-transition/STUDY_1_OVERVIEW.md\`](branch-expansion-compression-transition/STUDY_1_OVERVIEW.md)\n- [\`branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md\`](branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md)\n\n**詳細・provenance:**\n\n- [\`branch-expansion-compression-transition/CURRENT_STATUS.md\`](branch-expansion-compression-transition/CURRENT_STATUS.md)\n- [\`branch-expansion-compression-transition/DECISION_REGISTER.md\`](branch-expansion-compression-transition/DECISION_REGISTER.md)\n- [\`branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md\`](branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md)\n- [\`research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md\`](research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md)\n- [\`research-generation-3/checkpoints/2026-09-02-g3-05-technical-invalid-closure.md\`](research-generation-3/checkpoints/2026-09-02-g3-05-technical-invalid-closure.md)\n\n**Program boundary:** G3-06は\`NOT AUTHORIZED\`。開始前にseparate post-G3-05 current-state authorization reviewが必要であり、G3-05 partial telemetryをvalidated mechanism/transition inputとして継承しない。\n`;
s=appendOnce(s,indexBlock,"<!-- BECT-G3-05-CLOSURE:RESEARCH-INDEX -->");
write(files.index,s);

// Root README: update RG3 central-entry description and add G3-05 reader links next to it.
s=read(files.root);
const rootLines=s.split("\n");
const rg3Idx=rootLines.findIndex(x=>x.startsWith("- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md):"));
need(rg3Idx>=0,"root README RG3 central line missing");
rootLines[rg3Idx]="- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05は`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04は`CLOSED / FORMAL-COMPLETE`。G3-05 formal promoted candidate setは`[]`、Stage 2未実行。depth-10 holdoutはsealedのまま。G3-06は未承認で、次はseparate post-G3-05 authorization reviewが必要。";
s=rootLines.join("\n");
const rootAnchor=rootLines[rg3Idx]+"\n";
const rootBlock="- [`doc/branch-expansion-compression-transition/STUDY_1_OVERVIEW.md`](doc/branch-expansion-compression-transition/STUDY_1_OVERVIEW.md): G3-05 / `BECT-STUDY1` のprospective scopeとmeasurement boundary\n- [`doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`](doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md): G3-05の`CLOSED / TECHNICAL-INVALID` closure、relay-limit technical failure、no-rescue / Stage 2 non-authorization boundary\n";
s=insertAfter(s,rootAnchor,rootBlock,"doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md","root README G3-05 links");
write(files.root,s);

// Guard historical program plan and scientific result bytes.
const planAfter=read(files.programPlan);
need(planAfter===planBefore,"historical PROGRAM_PLAN changed unexpectedly");
need(sha256(planAfter)===planShaBefore,"historical PROGRAM_PLAN hash changed unexpectedly");
const result=read(p("doc/branch-expansion-compression-transition/results/stage-1/scientific-result.json"));
const parsed=JSON.parse(result);
need(parsed.stageDisposition==="TECHNICAL-INVALID","canonical Stage 1 disposition changed unexpectedly");
need(parsed.actualScientificExecutions===1,"canonical execution count changed unexpectedly");
need(parsed.seedBlockConsumed===true&&parsed.noRescueBoundaryCrossed===true,"canonical no-rescue/seed state changed unexpectedly");
need(parsed.technicalError&&parsed.technicalError.message==="relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529","canonical technical error changed unexpectedly");

console.log(JSON.stringify({
  disposition:"BECT-G3-05-DOC-CONSISTENCY-FINALIZED",
  study:"CLOSED / TECHNICAL-INVALID",
  promotedCandidates:[],
  stage2:"NOT-AUTHORIZED-NOT-EXECUTED",
  g306Authorized:false,
  historicalProgramPlanModified:false,
  scientificResultModified:false,
  mainIntegrationPerformed:false,
  protectedDepth10:"SEALED / NOT GENERATED / NOT READ"
}));
