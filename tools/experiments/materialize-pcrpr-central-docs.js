#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

function fail(msg) {
  throw new Error(msg);
}

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function write(path, text) {
  fs.writeFileSync(path, text, "utf8");
}

function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) fail(`${label}: anchor not found`);
  if (text.indexOf(needle, first + needle.length) >= 0) fail(`${label}: anchor not unique`);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}

function updateRootReadme() {
  const path = "README.md";
  let text = read(path);
  const g207Path = "doc/practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md";
  if (text.includes(g207Path)) return;
  const anchor = /^- \[`doc\/rich-critical-position-representation\/STUDY_1_OVERVIEW\.md`\].*$/m;
  const match = text.match(anchor);
  if (!match) fail("README: G2-06 anchor not found");
  const line = `- [\`${g207Path}\`](${g207Path}): Research Generation 2 \`G2-07\` / \`PCRPR-STUDY1\`。Stage 0は\`STAGE0-TECHNICAL-PASS\`。Fresh Stage 1は3,072 games / 400 roots / 1,429 root-move rowsまでproductionとindependent replayが完走し、development core hashも一致したが、independent full artifactのGitHub Actions uploadがtimeoutして必須full final exact verificationをmaterializeできなかった。frozen fail-closed ruleによりStage 1は\`STAGE1-TECHNICAL-INVALID\`、seed blockは消費済み、same-block rerun禁止、Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\``;
  text = text.replace(anchor, `${match[0]}\n${line}`);
  write(path, text);
}

function updateResearchIndex() {
  const path = "doc/RESEARCH_INDEX.md";
  let text = read(path);

  const oldBoundary = "**Boundary:** Stage 1 seed block `28610001..28613072`は消費済みでsame-block repair/rerun、replacement、extensionは未承認。Stage 1 rowsはStage 2 formal evidenceへ再利用しない。G2-06を結果後に修正して再判定せず、次のindependent agenda itemはG2-07として別prospective contractで扱う。";
  const newBoundary = "**Boundary:** Stage 1 seed block `28610001..28613072`は消費済みでsame-block repair/rerun、replacement、extensionは未承認。Stage 1 rowsはStage 2 formal evidenceへ再利用しない。G2-06を結果後に修正して再判定しない。G2-07は別prospective contractとして完了し、次の未着手機械研究はG2-08である。";
  if (text.includes(oldBoundary)) text = replaceOnce(text, oldBoundary, newBoundary, "RESEARCH_INDEX G2-06 boundary");

  if (!text.includes("### 23. Practical Comeback / Reply-Pressure Representation — Study 1")) {
    const section = `### 23. Practical Comeback / Reply-Pressure Representation — Study 1\n\n**研究題目:** Baoにおける実戦的逆転可能性とreply pressureの豊かな機械表現の構築・prospective検証 — reply-set width, defense-maintaining reply fraction, reply-quality distribution, punishment concentration, and opponent-policy sensitivity によるpractical comeback structureの再現可能な記述\n**Program:** \`G2-07\` / **Study ID:** \`PCRPR-STUDY1\` / **Research Generation 2**\n**状態:** **Study closed / Stage 1 \`STAGE1-TECHNICAL-INVALID\` / Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`**\n\nG2-07は、閉鎖済み\`PCEM-STUDY1\`の55 candidate audits / promoted 0を救済せず、reply-centeredな80-scalar representationでmachine-operational practical comeback structureをfresh evidence上に記述できるかを検討した。Stage 0ではcanonical exact-move/reply ordering、deterministic binary64 arithmetic、exact cross-implementation feature equalityをtechnical validationした。\n\nFresh Stage 1では3,072 gamesから400 disadvantaged roots（Namua/Mtaji 200/200）、1,429 exact root-move rowsを構築した。Productionとstructurally independent replayは双方で\`F05_ALL\` / ridge \`lambda=100\`を選択し、\`developmentCoreSha256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2\`まで一致した。しかしindependent full result artifactのGitHub Actions \`CreateArtifact\`が5回timeoutし、prospectively必須だったfull final exact comparerを実行できなかった。したがってfrozen fail-closed ruleに従いStage 1は\`STAGE1-TECHNICAL-INVALID\`で閉じた。\n\nProduction-only performanceはunverified provenanceとして保存するが、accepted Stage 1 evidence、validated representation、formal target、Stage 2 evidenceへ昇格しない。Stage 1 seed block \`28710001..28713072\`は消費済みで、same-block rerun / repair / replacement / extensionは未承認。Stage 2 seeds \`28810001..28816144\`は未消費のまま\`NOT-AUTHORIZED-NOT-EXECUTED\`である。Machine reply pressureはhuman difficulty、deception、error probability、psychological pressureを意味しない。\n\n**最初に読む:**\n\n- [\`practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md\`](practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md)\n\n**詳細・正本:**\n\n- [\`practical-comeback-reply-pressure-representation/STUDY_1_FINAL_REPORT.md\`](practical-comeback-reply-pressure-representation/STUDY_1_FINAL_REPORT.md)\n- [\`practical-comeback-reply-pressure-representation/results/STAGE_1_DEVELOPMENT_RESULT.json\`](practical-comeback-reply-pressure-representation/results/STAGE_1_DEVELOPMENT_RESULT.json)\n- [\`practical-comeback-reply-pressure-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json\`](practical-comeback-reply-pressure-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json)\n- [\`practical-comeback-reply-pressure-representation/CURRENT_STATUS.md\`](practical-comeback-reply-pressure-representation/CURRENT_STATUS.md)\n- [\`practical-comeback-reply-pressure-representation/DECISION_REGISTER.md\`](practical-comeback-reply-pressure-representation/DECISION_REGISTER.md)\n- [\`practical-comeback-reply-pressure-representation/REPRODUCIBILITY_INDEX.md\`](practical-comeback-reply-pressure-representation/REPRODUCIBILITY_INDEX.md)\n\n**Boundary:** G2-07のStage 1 blockは消費済みで、artifact-transfer failureを理由としたsame-block rerunや、development-core一致のみを根拠とするpost-hoc verification条件緩和は行わない。Stage 2は未承認のまま閉鎖し、次のindependent agenda itemはG2-08として新規prospective contractで扱う。\n\n---\n\n`;
    text = replaceOnce(text, "## 将来研究\n", section + "## 将来研究\n", "RESEARCH_INDEX future heading");
  }
  write(path, text);
}

function updateAgenda() {
  const path = "doc/FUTURE_RESEARCH_AGENDA.md";
  let text = read(path);
  const heading = "#### G2-07 — Practical Comeback / Reply-Pressure Representation Study 1";
  if (!text.includes(heading)) fail("AGENDA: G2-07 heading not found");

  const oldStatus = `${heading}\n\n**状態:** planned / new prospective independent study`;
  const newStatus = `${heading}\n\n**状態:** completed / \`PCRPR-STUDY1\` closed / Stage 1 \`STAGE1-TECHNICAL-INVALID\` / Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`\n\n**結果要約:** Stage 0 technical validationはPASS。Fresh Stage 1は3,072 games / 400 roots / 1,429 exact root-move rowsをproductionとstructurally independent replayで完走し、selected family \`F05_ALL\`、ridge \`lambda=100\`、development core hashまで一致した。一方、independent full artifactのGitHub Actions uploadが\`CreateArtifact\` timeoutで失敗し、prospectively必須だったfull final exact verificationをmaterializeできなかったため、frozen fail-closed ruleに従い\`STAGE1-TECHNICAL-INVALID\`で閉じた。Stage 1 blockは消費済みでsame-block rerun/repair/replacement/extensionは未承認。Stage 2は未承認・未実行でreserved seedsは未消費。Production-only性能値はunverified provenanceに限定する。`;
  if (text.includes(oldStatus)) text = replaceOnce(text, oldStatus, newStatus, "AGENDA G2-07 status");

  text = text.replace("P1: G2-07, G2-08, G2-09, G2-10", "P1: G2-07 (completed), G2-08, G2-09, G2-10");

  const oldSummary = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`、`G2-05`は`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`として、それぞれprospective ruleに従い完了した。`G2-06`も`RCPR-STUDY1`として実行され、mandatory independent representation equality failureによりStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。G2-03のvalidated transform setは空のままで、G2-04/G2-06の未実行Stage 2を後続Studyで救済しない。P0 sequence G2-01..G2-06はclosure済みであり、次の未着手machine-only agenda itemは`G2-07 — Practical Comeback / Reply-Pressure Representation Study 1`である。";
  const newSummary = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`、`G2-05`は`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`として、それぞれprospective ruleに従い完了した。`G2-06`は`RCPR-STUDY1`としてStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。`G2-07`も`PCRPR-STUDY1`として実行され、mandatory full independent final verificationをartifact-transfer failureによりmaterializeできなかったためStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。G2-03のvalidated transform setは空のままで、G2-04/G2-06/G2-07の未実行Stage 2を後続Studyで救済しない。G2-01..G2-07はclosure済みであり、次の未着手machine-only agenda itemは`G2-08 — Machine Decision-Failure Taxonomy Study 1`である。";
  if (text.includes(oldSummary)) text = replaceOnce(text, oldSummary, newSummary, "AGENDA sequence summary");
  else if (!text.includes("G2-01..G2-07はclosure済み")) fail("AGENDA: sequence summary anchor not found");

  write(path, text);
}

updateRootReadme();
updateResearchIndex();
updateAgenda();
console.log("PCRPR central docs materialized successfully");
