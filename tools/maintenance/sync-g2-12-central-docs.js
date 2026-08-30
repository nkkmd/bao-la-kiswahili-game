#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const childProcess = require("node:child_process");

const BRANCH = "research/g2-12-state-space-game-tree-growth-estimation";
const AUTH = "doc/state-space-game-tree-growth-estimation/authorizations/CENTRAL_DOC_SYNC_EXECUTE.json";

function git(args) {
  return childProcess.execFileSync("git", args, { encoding: "utf8" }).trim();
}

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function write(path, text) {
  fs.writeFileSync(path, text, "utf8");
}

function replaceOnce(path, from, to) {
  const text = read(path);
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${path}: expected exactly one anchor, found ${count}`);
  write(path, text.replace(from, to));
}

function insertBeforeOnce(path, marker, block) {
  const text = read(path);
  const count = text.split(marker).length - 1;
  if (count !== 1) throw new Error(`${path}: expected exactly one insertion marker, found ${count}`);
  write(path, text.replace(marker, `${block}${marker}`));
}

function main() {
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch !== BRANCH) throw new Error(`refuse central-doc sync outside ${BRANCH}: ${branch}`);

  const auth = JSON.parse(read(AUTH));
  const parent = git(["rev-parse", "HEAD^"]);
  if (auth.studyId !== "SSGTGE-STUDY1" || auth.authorizationRole !== "CENTRAL-DOC-SYNC-EXECUTE") {
    throw new Error("central-doc sync authorization identity mismatch");
  }
  if (auth.executionAuthorized !== true || auth.mainIntegrationAuthorized !== false) {
    throw new Error("central-doc sync authorization boundary mismatch");
  }
  if (auth.expectedParentSha !== parent) {
    throw new Error(`authorization parent mismatch: expected ${auth.expectedParentSha}, got ${parent}`);
  }

  const readmePath = "README.md";
  const psrreLine = '- [`doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md`](doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md): Pre-G2-11 prerequisite / `PSRRE-STUDY1`。Stage 0 technical PASS後、fresh Stage 1 4,096 games / 512 rootsをproduction / independent full-exactで完遂したが、prospectively fixed nonzero-MAD feature readinessが`15 < 20`で未達となりformal decision `NON-ESTIMABLE`。representationはfreezeされず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、G2-11は`NOT-AUTHORIZED`。\n';
  const g212Line = '- [`doc/state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md`](doc/state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-12` / `SSGTGE-STUDY1`。G2-05 depth 0..9をdevelopment evidenceとするprospective growth-estimator Study。Stage 0 v2は`STAGE0-TECHNICAL-PASS`だったが、Stage 1 production-onlyでE2を提案した後、mandatory independent verifierが凍結済み`1e-12` cross-implementation toleranceを超えるprediction mismatchを検出したため`STAGE1-TECHNICAL-INVALID`、Study formal decision `TECHNICAL-INVALID`。canonical estimatorは`null`、fresh depth 10/11は未生成・未読、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。\n';
  if (read(readmePath).includes("doc/state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md")) {
    throw new Error("README already contains G2-12 central entry");
  }
  replaceOnce(readmePath, psrreLine, psrreLine + g212Line);

  const indexPath = "doc/RESEARCH_INDEX.md";
  if (read(indexPath).includes("### 28. State-Space / Game-Tree Growth Estimation — Study 1")) {
    throw new Error("RESEARCH_INDEX already contains G2-12 section");
  }
  const indexBlock = `\n\n### 28. State-Space / Game-Tree Growth Estimation — Study 1\n\n**研究題目:** Baoにおける状態空間・ゲーム木成長の推定 — bounded exact enumerationからのprospective growth estimator構築とfresh deeper exact holdoutによる検証\n**Program:** \`G2-12\` / **Study ID:** \`SSGTGE-STUDY1\` / **Research Generation 2**\n**状態:** **Study complete / formal decision \`TECHNICAL-INVALID\` / Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`**\n\nG2-05 \`DRSSE-STUDY1\`のimmutable depth 0..9 exact summariesだけをdevelopment evidenceとして用い、E1/E2/E3の有限estimator family、rolling-origin backtest、promotion threshold、uncertainty rule、fresh depth-10 primary holdoutをoutcome生成前に固定した。Stage 0 v1はsource-binding defectでtechnical-invalidとなったが、科学output前のfailureだったためtechnical mechanicsだけをversioned v2としてrefreezeし、v2はproduction / independent depth-2 fixtureとsynthetic estimator controlsを通過して\`STAGE0-TECHNICAL-PASS\`となった。\n\nStage 1は別source freeze・別authorizationでG2-05 depth 0..9のreal development competitionを一度だけ実行した。Production-onlyではE2 \`E2-LOG-QUADRATIC-D2PLUS\`がproposalされたが、mandatory independent verifierがE2 / \`newRawStateCount\` / depth 7で凍結済みcross-implementation relative tolerance \`1e-12\`を超えるprediction mismatchを検出した。Stage 1 authorizationはsame-evidence rerunを禁止していたため、tolerance緩和やverifier修正による救済を行わず\`STAGE1-TECHNICAL-INVALID\`で閉じた。\n\nしたがってcanonical \`selectedEstimator = null\`であり、production-only E2 proposalはdiagnostic provenanceに限定する。Fresh depth 10/11は生成もreadもしておらず、formal holdout validationは実施していない。G2-05の\`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN\`とG2-11の\`NOT-AUTHORIZED\`は不変である。\n\n**最初に読む:**\n\n- [\`state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md\`](state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md)\n\n**詳細・正本:**\n\n- [\`state-space-game-tree-growth-estimation/STUDY_1_FINAL_REPORT.md\`](state-space-game-tree-growth-estimation/STUDY_1_FINAL_REPORT.md)\n- [\`state-space-game-tree-growth-estimation/results/STUDY_1_FINAL_RESULT.json\`](state-space-game-tree-growth-estimation/results/STUDY_1_FINAL_RESULT.json)\n- [\`state-space-game-tree-growth-estimation/results/STAGE_1_TECHNICAL_INVALID_RESULT.json\`](state-space-game-tree-growth-estimation/results/STAGE_1_TECHNICAL_INVALID_RESULT.json)\n- [\`state-space-game-tree-growth-estimation/REPRODUCIBILITY_INDEX.md\`](state-space-game-tree-growth-estimation/REPRODUCIBILITY_INDEX.md)\n- [\`state-space-game-tree-growth-estimation/CURRENT_STATUS.md\`](state-space-game-tree-growth-estimation/CURRENT_STATUS.md)\n\n**Boundary:** 本StudyはE2をvalidated estimatorとして承認せず、depth 10の状態数・game-tree node数、full Bao state-space / game-tree sizeを推定結果として主張しない。再検証はnew prospective Studyまたはexplicit new versionを必要とする。\n`;
  insertBeforeOnce(indexPath, "\n\n## 将来研究\n", indexBlock);

  const agendaPath = "doc/FUTURE_RESEARCH_AGENDA.md";
  replaceOnce(agendaPath, "更新日: 2026-08-30", "更新日: 2026-08-31");
  replaceOnce(
    agendaPath,
    "**状態:** planned / exact-enumerationとは別Study",
    "**状態:** completed / `SSGTGE-STUDY1` formal decision `TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`",
  );
  const agendaAnchor = "推定が不安定またはnon-estimableなら、その結果を正式closureとし、Bao全体のstate-space sizeを点推定として強制的に報告しない。";
  const agendaClosure = `${agendaAnchor}\n\n2026-08-31に\`SSGTGE-STUDY1\`として実施・closureした。Stage 0 v2はtechnical PASS、Stage 1 production-onlyではE2をproposalしたが、mandatory independent verifierが凍結済み\`1e-12\` cross-implementation toleranceを超えるprediction mismatchを検出したためStage 1は\`STAGE1-TECHNICAL-INVALID\`、Study formal decisionは\`TECHNICAL-INVALID\`となった。same-evidence rerunやtolerance緩和による救済は行っていない。Canonical estimatorはfreezeされず\`selectedEstimator = null\`、fresh depth 10/11は未生成・未読、Stage 2は未承認・未実行である。`;
  replaceOnce(agendaPath, agendaAnchor, agendaClosure);
  replaceOnce(
    agendaPath,
    "P2: G2-11 (blocked / `NOT-AUTHORIZED`), G2-12",
    "P2: G2-11 (blocked / `NOT-AUTHORIZED`), G2-12 (completed / `TECHNICAL-INVALID`)",
  );

  const programPath = "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md";
  let program = read(programPath);
  const marker = "## 2026-08-31 — G2-12 State-Space / Game-Tree Growth Estimation Study 1 closure";
  if (program.includes(marker)) throw new Error("program decision already contains G2-12 closure");
  const programBlock = `\n\n${marker}\n\nAgenda label \`G2-12\` was instantiated as \`SSGTGE-STUDY1\` — **State-Space / Game-Tree Growth Estimation Study 1** — under a fresh prospective RAW-only growth-estimation contract.\n\n\`G2-05 / DRSSE-STUDY1\` depth 0..9 exact summaries were development evidence only. The estimator family, rolling-origin cells, eligibility threshold, winner rule, uncertainty rule, fresh depth-10 primary holdout, depth-11 secondary stress test, resource ceilings, and no-rescue rule were frozen before any fresh depth-10/11 outcome existed.\n\nStage 0 v1 failed before technical output at a source-binding gate and remains permanently \`STAGE0-TECHNICAL-INVALID\`. Because that failure occurred before scientific output, a separately versioned technical-entry v2 corrected only source-binding/orchestration mechanics. v2 passed production and independent depth-2 technical reconstruction and synthetic estimator controls.\n\nStage 1 was then source-frozen and separately authorized once using only immutable G2-05 depth 0..9 summaries. Production completed and proposed \`E2-LOG-QUADRATIC-D2PLUS\`, but the mandatory independent verifier detected a prediction mismatch at \`E2 / newRawStateCount / depth 7\` beyond the prospectively fixed cross-implementation relative tolerance \`1e-12\`. The Stage 1 authorization fixed \`sameStage1EvidenceRerunAuthorized=false\`; therefore no tolerance relaxation, verifier repair, special-case candidate handling, or same-evidence rerun was used.\n\n\`\`\`text\nStage 0 v1 = STAGE0-TECHNICAL-INVALID\nStage 0 v2 = STAGE0-TECHNICAL-PASS\nStage 1 = STAGE1-TECHNICAL-INVALID\ncanonical selectedEstimator = null\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nfresh depth 10/11 = NOT GENERATED / NOT READ\nStudy formal decision = TECHNICAL-INVALID\n\`\`\`\n\nThe production-only E2 proposal is retained as diagnostic provenance only and is not an accepted Stage 2 input or a validated growth estimator. \`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN\` remains unchanged. G2-11 remains \`NOT-AUTHORIZED\` because its strategic-representation dependency is still unresolved; G2-12 does not alter that dependency. A corrected growth-estimator attempt requires a new prospective Study or explicit new version.\n`;
  program += programBlock;
  write(programPath, program);

  for (const path of [readmePath, indexPath, agendaPath, programPath]) {
    const text = read(path);
    if (!text.endsWith("\n")) throw new Error(`${path}: missing final newline`);
  }

  console.log("G2-12 central documentation synchronization prepared successfully.");
}

main();
