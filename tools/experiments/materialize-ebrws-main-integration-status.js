#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "../..");
const PR = "#92";
const MERGE = "b41c7eda74dd1002e98e4d82714fadb987d1f1e1";
const BRANCH = "research/g3-02-effective-branching-reply-width-structure";

function p(rel){ return path.join(ROOT, rel); }
function read(rel){ return fs.readFileSync(p(rel), "utf8"); }
function write(rel, text){ fs.writeFileSync(p(rel), text); }
function replaceOnce(rel, from, to){
  const src = read(rel);
  const i = src.indexOf(from);
  assert(i >= 0, `${rel}: expected text not found`);
  assert(src.indexOf(from, i + from.length) < 0, `${rel}: expected text not unique`);
  write(rel, src.slice(0, i) + to + src.slice(i + from.length));
}
function appendOnce(rel, marker, text){
  const src = read(rel);
  assert(!src.includes(marker), `${rel}: marker already present`);
  write(rel, src.replace(/\s*$/, "\n\n") + text.trim() + "\n");
}
function insertAfterOnce(rel, marker, text, guard){
  const src = read(rel);
  if (guard && src.includes(guard)) return;
  const i = src.indexOf(marker);
  assert(i >= 0, `${rel}: marker not found`);
  assert(src.indexOf(marker, i + marker.length) < 0, `${rel}: marker not unique`);
  const at = i + marker.length;
  write(rel, src.slice(0, at) + text + src.slice(at));
}

replaceOnce(
  "README.md",
  "research branch上のG3-02 closure作業は完了しており、`main`統合は明示的指示待ち。",
  `G3-02 closure作業は完了し、${PR} を通常mergeして \`main\` へ統合済み（merge commit \`${MERGE}\`）。`
);

replaceOnce(
  "doc/RESEARCH_INDEX.md",
  "Repository state: **G3-02 research workflow complete on research branch / `main` integration not performed / pending explicit user instruction**",
  `Repository state: **G3-02 research workflow complete / \`main\` integration complete via PR ${PR} / merge commit \`${MERGE}\`**`
);

replaceOnce(
  "doc/FUTURE_RESEARCH_AGENDA.md",
  "G3-02 research workflow = COMPLETE ON RESEARCH BRANCH\nG3-02 main integration = NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION",
  `G3-02 research workflow = COMPLETE / MAIN INTEGRATED\nG3-02 main integration = COMPLETE / PR ${PR} / merge ${MERGE}`
);

replaceOnce(
  "doc/research-generation-3/CURRENT_STATUS.md",
  "Program status = ACTIVE / G3-02 CLOSED TECHNICAL-INVALID / G3-02 RESEARCH COMPLETE ON BRANCH / NEXT PROGRAM REVIEW REQUIRED",
  "Program status = ACTIVE / G3-02 CLOSED TECHNICAL-INVALID / G3-02 MAIN INTEGRATION COMPLETE / NEXT PROGRAM REVIEW REQUIRED"
);
replaceOnce(
  "doc/research-generation-3/CURRENT_STATUS.md",
  "G3-02 research workflow = COMPLETE ON RESEARCH BRANCH\nG3-02 main integration = NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION",
  `G3-02 research workflow = COMPLETE / MAIN INTEGRATED\nG3-02 main integration = COMPLETE / PR ${PR} / merge ${MERGE}`
);
replaceOnce(
  "doc/research-generation-3/CURRENT_STATUS.md",
  "Active scientific research branch = none; closed G3-02 branch awaits explicit integration instruction",
  "Active scientific research branch = none; closed G3-02 record is integrated to main"
);
replaceOnce(
  "doc/research-generation-3/CURRENT_STATUS.md",
  `G3-02 research work is complete on \`${BRANCH}\`.\n\n\`main\` integration has **not** been performed and remains pending explicit user instruction. No merge, fast-forward, or pull-request integration action is authorized by this completion state.`,
  `G3-02 research work is complete and has been integrated to \`main\` through PR ${PR} using a normal merge commit so the prospective research history is preserved.\n\nMerge commit: \`${MERGE}\`. This repository integration does not change the Study's \`CLOSED / TECHNICAL-INVALID\` decision and does not authorize G3-03 or later scientific work.`
);

insertAfterOnce(
  "doc/research-generation-3/README.md",
  "G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED\n",
  `G3-02 main integration = COMPLETE / PR ${PR} / merge ${MERGE}\n`,
  "G3-02 main integration = COMPLETE"
);
appendOnce(
  "doc/research-generation-3/README.md",
  "## G3-02 main integration",
  `## G3-02 main integration\n\n2026-09-02、completed G3-02 branch \`${BRANCH}\`をPR ${PR}の通常mergeで\`main\`へ統合した。merge commitは\`${MERGE}\`。このrepository integrationは\`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID\`、formal promoted candidate set \`[]\`、Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`、protected depth-10 holdout sealedというscientific stateを変更せず、G3-03以降を自動authorizeしない。`
);

replaceOnce(
  "doc/effective-branching-reply-width-structure/CURRENT_STATUS.md",
  "Research workflow = COMPLETE ON RESEARCH BRANCH\nMain integration = NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION",
  `Research workflow = COMPLETE / MAIN INTEGRATED\nMain integration = COMPLETE / PR ${PR} / merge ${MERGE}`
);
replaceOnce(
  "doc/effective-branching-reply-width-structure/CURRENT_STATUS.md",
  `research workflow = COMPLETE\nresearch branch = ${BRANCH}\nmain integration = NOT PERFORMED\nmain integration authorization = PENDING EXPLICIT USER INSTRUCTION`,
  `research workflow = COMPLETE\nresearch branch = ${BRANCH}\nmain integration = COMPLETE\nintegration PR = ${PR}\nmerge commit = ${MERGE}`
);
replaceOnce(
  "doc/effective-branching-reply-width-structure/CURRENT_STATUS.md",
  "`main`への統合は明示的な指示があるまで行わない。",
  `明示的な統合指示に基づき、PR ${PR}を通常mergeして\`main\`統合を完了した。scientific closureとnext-program authorization boundaryは変更しない。`
);

replaceOnce(
  "doc/effective-branching-reply-width-structure/README.md",
  "Research workflow: `COMPLETE ON RESEARCH BRANCH`\nMain integration: `NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION`",
  `Research workflow: \`COMPLETE / MAIN INTEGRATED\`\nMain integration: \`COMPLETE / PR ${PR} / merge ${MERGE}\``
);
insertAfterOnce(
  "doc/effective-branching-reply-width-structure/README.md",
  "- `checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md` — execution-count violation checkpoint\n",
  "- `checkpoints/2026-09-02-main-integration-complete.md` — repository main integration completion checkpoint\n",
  "checkpoints/2026-09-02-main-integration-complete.md"
);

appendOnce(
  "doc/effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md",
  "## 17. Main integration completion",
  `## 17. Main integration completion\n\n2026-09-02、final consistency audit済みresearch branch \`${BRANCH}\`をPR ${PR}で\`main\`へ通常mergeした。merge commitは\`${MERGE}\`。squash / rebaseは使用せず、prospective audit historyを保持した。\n\nこのrepository-level integrationはscientific decisionを変更しない。\n\n\`\`\`text\nEBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nprotected depth-10 holdout = SEALED / NOT GENERATED / NOT READ\nG3-03 automatic authorization = false\n\`\`\``
);

appendOnce(
  "doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md",
  "## Main統合",
  `## Main統合\n\n2026-09-02、G3-02のclosed research branchはPR ${PR}を通常mergeして\`main\`へ統合した（merge commit \`${MERGE}\`）。統合はrepository stateの更新であり、formal decision \`CLOSED / TECHNICAL-INVALID\`、formal promoted candidate set \`[]\`、Stage 2未実行という科学的結論を変更しない。`
);

appendOnce(
  "doc/effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md",
  "## Repository main integration",
  `## Repository main integration\n\n- integration PR: ${PR}\n- merge method: normal merge commit\n- pre-merge research HEAD: \`0c0fc7a28f5ffc65853265d58a041863f520cdb8\`\n- pre-merge main: \`ca6a1e4a9b41d79d873fa71385972e402ffa5197\`\n- merge commit: \`${MERGE}\`\n- scientific disposition after integration: \`CLOSED / TECHNICAL-INVALID\`\n- Stage 2 after integration: \`NOT-AUTHORIZED-NOT-EXECUTED\`\n- protected depth-10 holdout: \`SEALED / NOT GENERATED / NOT READ\``
);

const studyCheckpoint = `# G3-02 / EBRWS-STUDY1 — Main integration complete\n\nDate: 2026-09-02\n\n\`\`\`text\nStudy = EBRWS-STUDY1\nformal disposition = CLOSED / TECHNICAL-INVALID\nresearch branch = ${BRANCH}\npre-merge research HEAD = 0c0fc7a28f5ffc65853265d58a041863f520cdb8\npre-merge main = ca6a1e4a9b41d79d873fa71385972e402ffa5197\nintegration PR = ${PR}\nmerge method = normal merge commit\nmerge commit = ${MERGE}\nmain integration = COMPLETE\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nprotected depth-10 holdout = SEALED / NOT GENERATED / NOT READ\nG3-03 automatic authorization = false\n\`\`\`\n\nThe merge preserves the full prospective research history. No scientific result, threshold, endpoint, seed boundary, authorization boundary, or protected-holdout state is changed by repository integration.\n`;
const rg3Checkpoint = `# Research Generation 3 — G3-02 main integration complete\n\nDate: 2026-09-02\n\nG3-02 / \`EBRWS-STUDY1\` has been integrated to \`main\` through PR ${PR}.\n\n\`\`\`text\npre-merge main = ca6a1e4a9b41d79d873fa71385972e402ffa5197\npre-merge G3-02 research HEAD = 0c0fc7a28f5ffc65853265d58a041863f520cdb8\nmerge commit = ${MERGE}\nG3-02 = CLOSED / TECHNICAL-INVALID\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nprotected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ\nnext scientific action = separate post-G3-02 program review\nG3-03 automatic authorization = false\n\`\`\`\n\nHistorical \`PROGRAM_PLAN.md\` remains unchanged.\n`;

const studyPath = "doc/effective-branching-reply-width-structure/checkpoints/2026-09-02-main-integration-complete.md";
const rg3Path = "doc/research-generation-3/checkpoints/2026-09-02-g3-02-main-integration-complete.md";
assert(!fs.existsSync(p(studyPath)), `${studyPath}: already exists`);
assert(!fs.existsSync(p(rg3Path)), `${rg3Path}: already exists`);
write(studyPath, studyCheckpoint);
write(rg3Path, rg3Checkpoint);

console.log("EBRWS_MAIN_INTEGRATION_STATUS_MATERIALIZED");
