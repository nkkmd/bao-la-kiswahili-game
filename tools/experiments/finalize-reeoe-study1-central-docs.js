"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}
function write(relative, content) {
  fs.writeFileSync(path.join(ROOT, relative), content);
}
function requireOnce(text, needle, label) {
  const count = text.split(needle).length - 1;
  if (count !== 1) throw new Error(`${label}: expected anchor exactly once, observed ${count}`);
}

function updateReadme() {
  const relative = "README.md";
  let text = read(relative);
  if (text.includes("doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md")) return;
  const anchor = "- [`doc/state-transformation-semantics-canonicalization-validation/STUDY_1_OVERVIEW.md`](doc/state-transformation-semantics-canonicalization-validation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-03` / `STSCV-STUDY1`。Fresh Stage 2 production measurementはNamua/Mtaji/Mtaji-houseless各32 rootsでT01/T02/T03すべてproduction mismatch 0だったが、mandatory independent verifierがformal-result assemblyでtechnical failureしcanonical verification artifactをmaterializeできなかった。frozen global-failure ruleによりStudyは`INCONCLUSIVE`、3 candidatesすべて`NON-ESTIMABLE`。canonicalization / symmetry-reduced countingは未承認\n";
  requireOnce(text, anchor, "README G2-03 anchor");
  const addition = "- [`doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md`](doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-04` / `REEOE-STUDY1`。Stage 0 technical controlはPASS。Fresh Stage 1 v2は8 rootsを独立再構築したがcomplete closureは0/8（STATE-LIMIT 4 / ADMIN-CUTOFF 3 / MOVE-NONTERMINATION 1）でfrozen feasibility gateを満たさず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。formal decisionは`INCONCLUSIVE`、fresh exact oracleは未生成\n";
  text = text.replace(anchor, anchor + addition);
  write(relative, text);
}

function updateIndex() {
  const relative = "doc/RESEARCH_INDEX.md";
  let text = read(relative);
  if (text.includes("### 20. Restricted Endgame Exact Oracle Expansion — Study 1")) return;
  const anchor = "\n---\n\n## 将来研究\n";
  requireOnce(text, anchor, "RESEARCH_INDEX future-research anchor");
  const section = `\n---\n\n### 20. Restricted Endgame Exact Oracle Expansion — Study 1\n\n**研究題目:** Baoにおける限定終盤exact oracleの拡張 — prospectively selected RAW-state domains に対する complete forward closure, exact retrograde analysis, cycle structure, distance, and optimal-move multiplicity の厳密解析  \n**Program:** \`G2-04\` / **Study ID:** \`REEOE-STUDY1\` / **Research Generation 2**  \n**状態:** **Study complete / formal decision \`INCONCLUSIVE\` / Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`**\n\nこのprospective independent RAW-only studyは、複数のrestricted endgame domainsをoutcome-blindに選び、complete forward closureを証明できたdomainだけをexact retrograde analysisへ進める設計を検証した。Stage 0ではREWR 8-state / 7-edge oracleをtechnical fixtureとしてproduction / independent双方で再構築し、4 negative controlsを検出した。\n\nStage 1 v1はproduction development後にindependent verifierのstartup path defectが判明したためsame-evidence rerunをせずtechnical-invalidとして閉じた。Fresh Stage 1 v2は同じstructural/resource/acceptance designのままseeds \`24041001..24041512\`を用い、production / independentがfull 512-trajectory scan、eligible set、first-eight selected roots、closure classificationsを一致させた。\n\n\`\`\`text\nunique witness roots = 7055\neligible roots = 141\nselected roots = 8\ncomplete closures = 0\nSTATE-LIMIT = 4\nADMIN-CUTOFF = 3\nMOVE-NONTERMINATION = 1\n\`\`\`\n\nFrozen feasibility ruleはindependently verified complete closures \`>=3\`を要求していたため、Stage 1 v2は\`STAGE1-DEVELOPMENT-BLOCKED\`。cap増加、domain shrinkage、root replacement、seed extension、partial-closure promotion、symmetry/canonicalizationによる救済を行わず、Stage 2を未承認・未実行で閉じた。\n\n**最初に読む:**\n\n- [\`restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md\`](restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md)\n\n**詳細・正本:**\n\n- [\`restricted-endgame-exact-oracle-expansion/STUDY_1_FINAL_REPORT.md\`](restricted-endgame-exact-oracle-expansion/STUDY_1_FINAL_REPORT.md)\n- [\`restricted-endgame-exact-oracle-expansion/results/STUDY_1_FINAL_RESULT.json\`](restricted-endgame-exact-oracle-expansion/results/STUDY_1_FINAL_RESULT.json)\n- [\`restricted-endgame-exact-oracle-expansion/REPRODUCIBILITY_INDEX.md\`](restricted-endgame-exact-oracle-expansion/REPRODUCIBILITY_INDEX.md)\n- [\`restricted-endgame-exact-oracle-expansion/CURRENT_STATUS.md\`](restricted-endgame-exact-oracle-expansion/CURRENT_STATUS.md)\n- [\`restricted-endgame-exact-oracle-expansion/DECISION_REGISTER.md\`](restricted-endgame-exact-oracle-expansion/DECISION_REGISTER.md)\n\n**Boundary:** fresh G2-04 exact oracleは生成されていない。\`STATE-LIMIT\` / \`ADMIN-CUTOFF\`はgame outcomeではなく、\`MOVE-NONTERMINATION\`もgame-level \`RECURRENT\` / \`DRAW\`へ読み替えない。将来別のstructural/resource contractでexact expansionを試す場合はnew prospective Study/versionとfresh evidenceを必要とする。\n`;
  text = text.replace(anchor, section + anchor);
  write(relative, text);
}

function updateAgenda() {
  const relative = "doc/FUTURE_RESEARCH_AGENDA.md";
  let text = read(relative);
  const heading = "#### G2-04 — Restricted Endgame Exact Oracle Expansion Study 1";
  const nextHeading = "#### G2-05 — Deep RAW State-Space Enumeration Study 1";
  const start = text.indexOf(heading);
  const end = text.indexOf(nextHeading);
  if (start < 0 || end < 0 || end <= start) throw new Error("FUTURE_RESEARCH_AGENDA G2-04 block anchors missing");
  const currentBlock = text.slice(start, end);
  if (!currentBlock.includes("**状態:** **完了 / `REEOE-STUDY1` / formal decision `INCONCLUSIVE`**")) {
    const replacement = `#### G2-04 — Restricted Endgame Exact Oracle Expansion Study 1\n\n**状態:** **完了 / \`REEOE-STUDY1\` / formal decision \`INCONCLUSIVE\` / Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`**\n\n中心課題:\n\n> prospectively selectedした複数のrestricted raw-state domainsについて、complete forward closureとexact retrograde analysisによりgame-theoretic value、cycle structure、distance、optimal-move multiplicityを完全解析できるか。\n\n第一世代8-state exact domainのformal decisionを拡張解釈せず、423,733-state historical candidateへ単純cap追加して再開しない新しいprospective RAW-only Studyとして実施した。\n\nStage 0 technical controlはREWR 8-state / 7-edge graph、solution、predecessor relationを独立再構築してPASS。Stage 1 v1はproduction development後のindependent-verifier startup defectによりsame-evidence rerunをせずtechnical-invalidとして閉じた。Fresh Stage 1 v2はseeds \`24041001..24041512\`、同一のstructural/resource/acceptance designで再実施した。\n\n\`\`\`text\nunique witness roots = 7055\neligible roots = 141\nselected roots = 8\ncomplete closures = 0\nSTATE-LIMIT = 4\nADMIN-CUTOFF = 3\nMOVE-NONTERMINATION = 1\n\`\`\`\n\nProduction / independentはfull scan、eligible set、selected roots、closure classificationを一致させたが、frozen feasibility rule \`complete closures >= 3\`を満たさなかった。そのためStage 1 v2は\`STAGE1-DEVELOPMENT-BLOCKED\`、Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\`となり、fresh G2-04 exact oracleは生成されなかった。\n\n**G2-04はG2-03の成功を前提としない。** 実際にvalidated transform set \`[]\`のままRAW-onlyで実施し、symmetry reduction / canonicalizationを使用しなかった。cap増加、domain shrinkage、root/seed replacement、partial-closure promotionによるsame-study rescueも行っていない。\n\nこの\`INCONCLUSIVE\` closureは「Bao endgameのexact expansionが不可能」を意味しない。異なるstructural/resource contractを試す場合はnew prospective independent Study/versioned protocolとfresh evidenceを必要とする。\n\n**Priority:** P0 / completed\n\n`;
    text = text.slice(0, start) + replacement + text.slice(end);
  }
  const oldTail = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`として、それぞれprospective stop/global-failure ruleに従い完了した。G2-03はproduction-only zero-mismatch diagnosticsを持つがmandatory independent-verification gateをcanonicalに完遂できず、candidateをvalidationへ昇格させていない。次の未着手P0候補はdependencyを確認したうえで`G2-04` Restricted Endgame Exact Oracle Expansion、`G2-05` Deep RAW State-Space Enumeration、`G2-06` Rich Critical-Position Representationから選択する。";
  const newTail = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`として、それぞれprospective stop/global-failure/feasibility ruleに従い完了した。G2-03のvalidated transform setは空のままで、G2-04はRAW-only development feasibilityを満たせずStage 2未実行で閉じた。次の未着手P0候補はdependencyを確認したうえで`G2-05` Deep RAW State-Space Enumerationまたは`G2-06` Rich Critical-Position Representationから選択する。";
  if (text.includes(oldTail)) text = text.replace(oldTail, newTail);
  else if (!text.includes(newTail)) throw new Error("FUTURE_RESEARCH_AGENDA dependency-tail anchor missing");
  write(relative, text);
}

updateReadme();
updateIndex();
updateAgenda();
console.log("REEOE Study 1 central documentation finalization: PASS");
