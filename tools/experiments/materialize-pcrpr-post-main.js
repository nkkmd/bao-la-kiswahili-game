#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

const MERGE_SHA = "57f7cf2d58f0543082434cb4c3259e26e90fe02e";
const MERGE_PR = "#77";

function fail(msg){ throw new Error(msg); }
function read(path){ return fs.readFileSync(path,"utf8"); }
function write(path,text){ fs.writeFileSync(path,text,"utf8"); }
function replaceRequired(text, needle, replacement, label){
  if(!text.includes(needle)) fail(`${label}: anchor not found`);
  return text.replace(needle,replacement);
}

function updateCurrentStatus(){
  const path="doc/practical-comeback-reply-pressure-representation/CURRENT_STATUS.md";
  let text=read(path);
  text=replaceRequired(text,
    "**STUDY CLOSED ON RESEARCH BRANCH / STAGE 1 TECHNICAL INVALID / STAGE 2 NOT AUTHORIZED / MAIN NOT INTEGRATED**",
    "**STUDY CLOSED / STAGE 1 TECHNICAL INVALID / STAGE 2 NOT AUTHORIZED / MAIN INTEGRATED**",
    "CURRENT_STATUS headline");
  text=replaceRequired(text,"main integration = NOT PERFORMED",`main integration = COMPLETE / PR ${MERGE_PR} / ${MERGE_SHA}`,"CURRENT_STATUS integration field");
  text=replaceRequired(text,
    "研究branch上でclosure文書・workflow archival・関連indexの整合性を確認した後、main統合は**別途明示的な指示があるまで行わない**。",
    `研究branchのclosure、中央index同期、pre-main auditを完了後、PR ${MERGE_PR}でmainへ統合した。merge commitは\`${MERGE_SHA}\`。`,
    "CURRENT_STATUS next-action text");
  write(path,text);
}

function updateResume(){
  const path="doc/practical-comeback-reply-pressure-representation/RESUME_HERE.md";
  let text=read(path);
  text=replaceRequired(text,"Study = CLOSED ON RESEARCH BRANCH","Study = CLOSED / MAIN INTEGRATED","RESUME study field");
  text=replaceRequired(text,"main integration = NOT PERFORMED",`main integration = COMPLETE / PR ${MERGE_PR} / ${MERGE_SHA}`,"RESUME integration field");
  text=replaceRequired(text,
    "現在のG2-07 closureはresearch branch上のみ。mainへの統合は明示的な指示があるまで行わない。",
    `G2-07 closureはPR ${MERGE_PR}でmainへ統合済み。merge commitは\`${MERGE_SHA}\`。PCRPR-STUDY1を再開せず、次の研究はfresh main auditから開始する。`,
    "RESUME integration boundary");
  write(path,text);
}

function updateFinalReport(){
  const path="doc/practical-comeback-reply-pressure-representation/STUDY_1_FINAL_REPORT.md";
  let text=read(path);
  const old=`本報告作成時点では、G2-07 closureはresearch branch上にのみ存在する。\n\n\`\`\`text\nmain integration = NOT PERFORMED\n\`\`\`\n\nmainへの統合は別途明示的な判断を待つ。`;
  const neu=`G2-07 closureは最終整合性監査後、PR ${MERGE_PR}でmainへ統合された。\n\n\`\`\`text\nmain integration = COMPLETE\nmerge PR = ${MERGE_PR}\nmerge commit = ${MERGE_SHA}\n\`\`\`\n\nこのpost-merge記録はintegration provenanceのみを更新し、Stage 1 / Stage 2のscientific decisionを変更しない。`;
  text=replaceRequired(text,old,neu,"FINAL_REPORT main integration section");
  write(path,text);
}

function updateRepro(){
  const path="doc/practical-comeback-reply-pressure-representation/REPRODUCIBILITY_INDEX.md";
  let text=read(path);
  text=replaceRequired(text,"main integration = NOT PERFORMED",`main integration = COMPLETE\nmerge PR = ${MERGE_PR}\nmerge commit = ${MERGE_SHA}`,"REPRO integration");
  write(path,text);
}

function updateStudyClosure(){
  const path="doc/practical-comeback-reply-pressure-representation/checkpoints/2026-08-29-study-closure.md";
  let text=read(path);
  text=replaceRequired(text,"Study = CLOSED ON RESEARCH BRANCH","Study = CLOSED / MAIN INTEGRATED","study closure field");
  text=replaceRequired(text,"main integration = PENDING FINAL PR MERGE",`main integration = COMPLETE / PR ${MERGE_PR} / ${MERGE_SHA}`,"study closure integration");
  write(path,text);
}

function updateClosureAudit(){
  const path="doc/practical-comeback-reply-pressure-representation/checkpoints/2026-08-29-closure-audit.md";
  let text=read(path);
  text=replaceRequired(text,"main integration = PENDING PR MERGE",`main integration = COMPLETE / PR ${MERGE_PR} / ${MERGE_SHA}`,"closure audit remote state");
  text=replaceRequired(text,"main integration = READY AFTER TEMPORARY MATERIALIZER CLEANUP AND PR AUDIT","main integration = COMPLETE","closure audit conclusion");
  write(path,text);
}

function updateResearchLog(){
  const path="doc/practical-comeback-reply-pressure-representation/RESEARCH_LOG.md";
  let text=read(path);
  if(!text.includes("## 2026-08-29 — Main integration closure")){
    text += `\n## 2026-08-29 — Main integration closure\n\n- Final pre-main audit found three shared-document omissions and corrected root README, RESEARCH_INDEX, and FUTURE_RESEARCH_AGENDA with an anchor-validated one-shot materializer.\n- Temporary materialization tooling was removed before merge.\n- PR ${MERGE_PR} merged the closed PCRPR-STUDY1 branch into main.\n- Merge commit: \`${MERGE_SHA}\`.\n- Post-merge updates are documentation/provenance only; Stage 1 remains \`STAGE1-TECHNICAL-INVALID\`, Stage 1 seeds remain consumed, Stage 2 remains \`NOT-AUTHORIZED-NOT-EXECUTED\`, and no scientific decision was changed.\n`;
  }
  write(path,text);
}

function writeMainCheckpoint(){
  const path="doc/practical-comeback-reply-pressure-representation/checkpoints/2026-08-29-main-integration.md";
  const text=`# PCRPR-STUDY1 — Main Integration Checkpoint\n\nDate: 2026-08-29\n\n## Integration\n\n\`\`\`text\nPR = ${MERGE_PR}\nresearch branch = research/g2-07-practical-comeback-reply-pressure-representation\nmerge commit = ${MERGE_SHA}\nmain integration = COMPLETE\n\`\`\`\n\n## Scientific state preserved\n\n\`\`\`text\nStage 0 = STAGE0-TECHNICAL-PASS\nStage 1 = STAGE1-TECHNICAL-INVALID\nStage 1 seeds 28710001..28713072 = CONSUMED\nsame-block rerun/repair/replacement/extension = NOT AUTHORIZED\nscientificInferenceAuthorized = false\nconfirmatoryReuseAllowed = false\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED\nStudy = CLOSED\n\`\`\`\n\n## Central documents\n\nBefore merge, root \`README.md\`, \`doc/RESEARCH_INDEX.md\`, and \`doc/FUTURE_RESEARCH_AGENDA.md\` were synchronized to include G2-07 closure and identify G2-08 as the next unstarted machine-only agenda item.\n\n## Boundary\n\nThis checkpoint records repository integration only. It does not rescue the missing mandatory full independent final verification, does not validate production-only model/performance observations, does not authorize Stage 2, and does not alter PCEM-STUDY1 or RCPR-STUDY1.\n`;
  write(path,text);
}

updateCurrentStatus();
updateResume();
updateFinalReport();
updateRepro();
updateStudyClosure();
updateClosureAudit();
updateResearchLog();
writeMainCheckpoint();
console.log("PCRPR post-main integration records materialized");
