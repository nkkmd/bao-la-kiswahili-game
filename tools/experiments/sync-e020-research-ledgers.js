#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const INDEX_PATH = path.join(ROOT, "doc/phase-transition/EXPERIMENT_INDEX.md");
const LOG_PATH = path.join(ROOT, "doc/phase-transition/RESEARCH_LOG.md");

function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error(`${label}: insertion anchor not found`);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error(`${label}: insertion anchor is not unique`);
  return `${text.slice(0, first)}${replacement}${text.slice(first + needle.length)}`;
}

function syncExperimentIndex(text) {
  let next = text;
  const tableRow = "| E-020 | D3逆転独立確認 | P2/LG各4500局、新規seed 20275001–20279500 | `run-phase-transition-d3-reversal-replication-formal.js` | paired game-level exact McNemar、構造・機構bridge副次 | **preregistered / infrastructure-validated / formal未承認** |";
  if (!next.includes("| E-020 | D3逆転独立確認 |")) {
    const e019Row = "| E-019 | search profile一般化 | D1 6500 pairs / D3 4500 pairs / V2 2000 pairs | `run-phase-transition-search-profile-generalization-formal.js` | stratum別McNemar、global IUT、Holm、構造副次比較 | **完了・formal `not-confirmed`** |";
    next = replaceOnce(next, e019Row, `${e019Row}\n${tableRow}`, "EXPERIMENT_INDEX E-020 table row");
  }

  const detailedMarker = "## E-020 D3逆転独立確認";
  if (!next.includes(detailedMarker)) {
    const anchor = "## 共通データ識別情報";
    const section = `## E-020 D3逆転独立確認\n\n- hypothesis: H18\n- analysisVersion: \`18-d3-reversal-replication\`\n- status: **preregistered / infrastructure-validated / formal未承認 / formal corpus未生成**\n- preregistration: \`config/experiments/phase-transition-d3-reversal-replication-v1.json\`\n- execution policy: \`config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json\`\n- design checkpoint: \`doc/phase-transition/checkpoints/2026-08-05-stage-a-d3-independent-replication-design.md\`\n- preregistration checkpoint: \`doc/phase-transition/checkpoints/2026-08-05-e020-d3-reversal-preregistration.md\`\n- infrastructure checkpoint: \`doc/phase-transition/checkpoints/2026-08-05-e020-formal-infrastructure.md\`\n- validated infrastructure head: \`124ca132900487c66b44c37df3de99b59849ad0c\`\n- workflow: \`Phase Transition D3 Reversal Replication\`\n- Actions run: \`30972650445\`\n- fixture artifact: \`8917220737\`\n- artifact digest: \`sha256:332e093b061fd2c065e21a09d6263c992dc3352ef65d5157acf97be672d3a617\`\n- condition: \`hard / bao / depth 3\`\n- P2 search: \`phase2\`\n- LG search: \`legacy\`\n- pairs: 4500\n- games: 4500 / condition, 9000 total\n- formal seed: \`20275001–20279500\`\n- primary population: \`pliesRemaining >= 9\`\n- primary unit: paired shared-seed game\n- endpoint: eligible A \`capture-branch-expansion\` candidateが1件以上あるか\n- test: two-sided exact McNemar\n- alpha: 0.05\n- minimum discordant pairs: 20\n- prospective direction: **LG-only > P2-only**\n- GitHub Actions formal run: prohibited\n- \`formalExecutionAllowed: false\`\n- formal authorization: not granted\n\nDecision contract:\n\n- \`confirmed\`: formal integrity / exact pairing pass、exact 4500 pairs、discordants >=20、p<=0.05、LG-only > P2-only\n- \`not-confirmed\`: evaluableだがsignificanceまたはprospective directionが不通過\n- \`inconclusive\`: integrity/pairing/output/exact pair count不成立、またはdiscordants <20\n\nStructural secondaryとmechanism-bridge secondaryはprimary decisionを置換・救済・反転しない。P2 > LGへ結果が戻ってもH18のprospective directionを結果後に反転しない。\n\nInfrastructure validationはformal seedと分離した2-pair fixture（seed \`90902001–90902002\`）で全step success。formal seedは未使用。\n\n${anchor}`;
    next = replaceOnce(next, anchor, section, "EXPERIMENT_INDEX E-020 detailed section");
  }

  const commonMarker = "### E-020 D3逆転独立確認群";
  if (!next.includes(commonMarker)) {
    const suffix = `\n### E-020 D3逆転独立確認群\n\n- studyVersion: \`0.4.1\`\n- planned games: 9000 total\n- planned paired comparisons: 4500\n- seed range: \`20275001–20279500\`\n- formal integrity: not yet available\n- formal decision: not yet available\n- formal execution authorization: not granted\n`;
    next = `${next.trimEnd()}${suffix}`;
  }
  return `${next.trimEnd()}\n`;
}

function syncResearchLog(text) {
  const marker = "## 2026-08-05 — E-020 H18 D3逆転独立確認の事前登録・infrastructure validation";
  if (text.includes(marker)) return text;
  const entry = `\n\n${marker}\n\n### Stage A設計選定\n\nE-019 D3の\`legacy > phase2\`逆転を独立確認するStage Aについて、最初からdepth全体のinteractionをformal検定するのではなく、固定\`hard / bao / depth3\`の逆転そのものを新規seedで直接replicateする設計を選択した。\n\nこれはE-019/H17の方向条件を結果後に変更するものではない。E-019 D3は引き続きH17 component \`fail\`、E-019 global \`not-confirmed\`のまま維持する。\n\nDesign checkpoint:\n\n- \`doc/phase-transition/checkpoints/2026-08-05-stage-a-d3-independent-replication-design.md\`\n\n### E-020 / H18 preregistration\n\n新規hypothesis H18 / experiment E-020をdata generation前に登録した。\n\nH18:\n\n> 固定 \`hard / bao / depth 3\` において、eligible category-A \`capture-branch-expansion\` のゲーム単位manifestationはphase2 searchよりlegacy searchで高い。\n\n固定条件:\n\n- 4500 paired seeds / 9000 games\n- formal seed \`20275001–20279500\`\n- P2=\`phase2\`, LG=\`legacy\`\n- same seed / same random-opening paired design\n- primary population \`pliesRemaining >= 9\`\n- primary unit paired shared-seed game\n- two-sided exact McNemar\n- alpha 0.05\n- minimum discordants 20\n- prospective direction **LG-only > P2-only**\n\nDecision contractはexact N、availability、p値、prospective directionをdata generation前に固定した。P2 > LGへ戻った場合も結果後に方向を反転しない。\n\nPreregistration:\n\n- \`config/experiments/phase-transition-d3-reversal-replication-v1.json\`\n- \`config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json\`\n- \`doc/phase-transition/checkpoints/2026-08-05-e020-d3-reversal-preregistration.md\`\n\n### Infrastructure validation\n\nE-020専用runner、verifier、paired endpoint builder、reversed-direction evaluator、structural/mechanism-bridge secondary、guarded formal runner、execution-lock preparer、tests、GitHub Actions fixtureを実装した。\n\nGitHub Actionsではformal seedを使わず、fixture seed \`90902001–90902002\`、P2/LG各2局のみを生成した。\n\n- validated infrastructure head: \`124ca132900487c66b44c37df3de99b59849ad0c\`\n- workflow: \`Phase Transition D3 Reversal Replication\`\n- Actions run: \`30972650445\`\n- result: \`success\`\n- artifact: \`phase-transition-d3-reversal-replication-fixture\`\n- artifact ID: \`8917220737\`\n- artifact digest: \`sha256:332e093b061fd2c065e21a09d6263c992dc3352ef65d5157acf97be672d3a617\`\n\n成功した監査:\n\n- preregistration / direction contract / formal guard tests\n- P2/LG paired fixture generation\n- paired seed/opening/source/condition integrity\n- candidate/control construction\n- paired game endpoint construction\n- primary decision contract exercise\n- structural secondary construction\n- artifact upload\n\n2-pair fixtureはformal N/minimum discordantsを満たさないため\`inconclusive\`になることを明示確認した。fixture結果をH18の科学結果として使用しない。\n\nInfrastructure checkpoint:\n\n- \`doc/phase-transition/checkpoints/2026-08-05-e020-formal-infrastructure.md\`\n\n### 現在のformal gate\n\nExecution policyは\`infrastructure-validated-awaiting-formal-authorization\`へ遷移したが、次は維持している。\n\n- \`formalExecutionAllowed: false\`\n- formal authorization: \`granted: false\`\n- formal corpus generated: false\n- GitHub Actions formal execution: prohibited\n\n一般的な研究続行指示をE-020固有formal開始承認とは扱わない。E-020 formal開始には、別途E-020固有の明示承認と新規fixed-local execution lockを要求する。\n\n既存formal decisionsは変更しない。\n\n- E-010: \`not-confirmed\`\n- E-011: \`inconclusive\`\n- E-017: \`not-confirmed\`\n- E-018: \`confirmed\`\n- E-019: \`not-confirmed\`\n\nPR #26はopen / draftを維持する。\n`;
  return `${text.trimEnd()}${entry}`;
}

function writeIfChanged(filePath, before, after) {
  if (before === after) return false;
  fs.writeFileSync(filePath, after, "utf8");
  return true;
}

function main() {
  const indexBefore = fs.readFileSync(INDEX_PATH, "utf8");
  const logBefore = fs.readFileSync(LOG_PATH, "utf8");
  const indexAfter = syncExperimentIndex(indexBefore);
  const logAfter = syncResearchLog(logBefore);
  const changed = {
    experimentIndex: writeIfChanged(INDEX_PATH, indexBefore, indexAfter),
    researchLog: writeIfChanged(LOG_PATH, logBefore, logAfter),
  };
  console.log(JSON.stringify({ changed, indexPath: INDEX_PATH, logPath: LOG_PATH }, null, 2));
}

if (require.main === module) {
  try { main(); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = { syncExperimentIndex, syncResearchLog };
