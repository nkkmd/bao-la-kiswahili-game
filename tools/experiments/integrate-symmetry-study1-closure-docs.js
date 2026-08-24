#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

function read(path) { return fs.readFileSync(path, "utf8"); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, oldText, newText, label) {
  if (text.includes(newText)) return text;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one old block, found ${count}`);
  return text.replace(oldText, newText);
}

// FUTURE_RESEARCH_AGENDA.md
{
  const path = "doc/FUTURE_RESEARCH_AGENDA.md";
  let text = read(path);
  text = replaceOnce(text, "Version: 1.11.0", "Version: 1.12.0", "agenda version");

  const rewrParagraph = "Restricted Endgame / Winning Regions Study 1も完了した。outcome-blindなStage 0 technical selectionと独立graph reconstructionを経て、standard initial stateから到達証明を持つ1つのMtaji rootのcomplete forward closure（8 states / 7 legal edges）をprospectively freezeした。Stage 1ではproduction solverと別実装のindependent verifierが全state rows、state/edge hashes、value、DTF、optimal movesを完全一致させ、formal decisionは`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`となった。frozen rootはPlayer 0の`WIN`, DTF=3で、unique optimal moveは`capture:mtaji:1:4:left:::false`である。このexact claimは8-state bounded domainだけに限定される。";
  const symmetryParagraph = "Symmetry / Isomorphic Positions Study 1も完了した。fresh formal seed block `22910001..22910064`からoutcome-blindにfreezeしたNamua / Mtaji / Mtaji-houselessのdepth-3 bounded-local graphsでは、3 scientific candidates・5 formal outcomesすべてでproduction / independent双方がexact mismatch 0を再現した。一方、preregistered mandatory anchorであるRestricted Endgame Study 1のimmutable 8-state result artifactをrule-semantic transform検証へ接続した際、IDENTITY positive controlを含むoracle layerでproduction / independent equality `G12`を満たせなかった。post-outcome read-only diagnosticでは8 stateRows中3 terminal rowsにstored `stateKey`とstored `ruleState`のre-hash不一致が確認されたため、formal resultは0 validated / 0 rejected / 5 `NON-ESTIMABLE`で閉じた。この診断はRestricted Endgame Study 1のformal decisionを変更しない。";
  if (!text.includes(symmetryParagraph)) text = replaceOnce(text, rewrParagraph, `${rewrParagraph}\n\n${symmetryParagraph}`, "insert symmetry completion paragraph");

  const oldSequence = "2026-08-24の研究運用上、Baoに精通したhuman/expert participantへの現実的アクセスを確保できないため、「人間とAIの判断差」は当面保留とする。human claimをmachine-only evidenceで代替しない。machine-only sequenceの第1項だった**限定終盤と必勝圏 Study 1は完了**したため、次は **対称性と同型局面 → 状態空間とゲーム木複雑度** の順で進む。この順序決定は既存Studyのscientific resultを変更するものではなく、各新規Studyのdomain・endpoint・decision ruleは開始時にprospectively freezeする。";
  const newSequence = "2026-08-24の研究運用上、Baoに精通したhuman/expert participantへの現実的アクセスを確保できないため、「人間とAIの判断差」は当面保留とする。human claimをmachine-only evidenceで代替しない。machine-only sequenceでは限定終盤と必勝圏 Study 1に続き、**対称性と同型局面 Study 1も完了したがformal resultは5/5 `NON-ESTIMABLE`**であり、validated transformation setは空である。したがってState Space / Game Tree Complexity Studyは**raw state identityなら進行可能**だが、本Study 1のT01/T02/T03をsymmetry reductionへ使用してはならない。symmetry-reduced countを扱いたい場合は、Restricted Endgame Study 1をretrofitせず、oracle terminal-state representation / captured-seed accounting / raw-state identity contractを独立監査する新しいprospective Studyを先行させる。";
  text = replaceOnce(text, oldSequence, newSequence, "agenda sequence");

  const rewrBullet = "- Restricted Endgame / Winning Regions Study 1 — [`restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md)（Study 1 complete / `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` / 8 states / 7 edges）";
  const symmetryBullet = "- Symmetry / Isomorphic Positions Study 1 — [`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md)（Study 1 complete / 0 validated / 0 rejected / 5 `NON-ESTIMABLE`; fresh bounded-local mismatch 0, mandatory oracle-anchor G12 failed）";
  if (!text.includes(symmetryBullet)) text = replaceOnce(text, rewrBullet, `${rewrBullet}\n${symmetryBullet}`, "agenda research bullet");

  const old411 = `### 4.11 対称性と同型局面

#### 現在の実行状態

**次に着手するmachine-only研究。** Restricted Endgame / Winning Regions Study 1で得られたraw 8-state exact oracleをground truthとして利用し、候補変換が合法手グラフ、game-theoretic value、optimal move set、DTFを保存するかをprospectively検証する。

#### 中心課題

盤面表示が異なっていても、合法手、局面遷移、勝敗が本質的に同じ局面を体系化する。

#### 研究対象

- 左右反転
- プレイヤー交換
- 穴番号の正規化
- namuaとmtajiで成立する変換の違い
- 合法手グラフの同型
- canonical formの構築

#### 期待成果

重複局面削減、研究データ圧縮、Transposition Table効率化、対称性を利用したテスト生成。`;
  const new411 = `### 4.11 対称性と同型局面

#### 現在の実行状態

**Study 1完了 / formal result 0 validated / 0 rejected / 5 \`NON-ESTIMABLE\`.**

- 初見向け概要: [\`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md\`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md)
- 科学的正本: [\`symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md\`](symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md)

Fresh historically reachable bounded-local graphsではT01 seat swap、T02 houseless-Mtaji LR、T03 compositionの5 formal scopesすべてでexact mismatch 0だった。しかしmandatory exact-oracle anchorのIDENTITY positive controlとproduction / independent equality G12を満たせず、formal validationは成立しなかった。validated transformは0件で、canonicalization / symmetry group / symmetry-reduced state countingは未承認である。

Post-outcome read-only diagnosticで確認したterminal state-row identity limitationは、完了済みRestricted Endgame Study 1を変更・救済する根拠として使わない。

#### 今後の独立研究候補

**Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation**（作業名）として、terminal-state representation、captured-seed accounting、raw-rule-state identity、state-key serializationを新規prospective contractで独立監査する。必要ならその後にfresh symmetry confirmationを行う。既存SIP-STUDY1の5 \`NON-ESTIMABLE\` decisionは変更しない。

#### Downstream boundary

State Space / Game Tree Complexity Studyはraw state identityで進行できる。本Study 1のT01/T02/T03をstate reductionに使用してはならない。`;
  text = replaceOnce(text, old411, new411, "agenda 4.11");

  const old412State = "**対称性と同型局面 Study 1の後に着手予定。** raw state countと、独立検証されたsymmetry-reduced canonical state countを区別できる基盤を先に確立する。";
  const new412State = "**machine-only次研究候補。** raw state identityによる状態空間・ゲーム木複雑度研究は着手可能。一方、symmetry-reduced canonical state countはSymmetry Study 1で未承認のため、T01/T02/T03によるreductionを使用しない。symmetry-reduced countをformal targetに含める場合は、別prospective studyでanchor integrityとtransform validationを先に確立する。";
  text = replaceOnce(text, old412State, new412State, "agenda 4.12 status");

  const oldStage3 = `### 第3段階: 理論および完全解析への展開

1. **[完了] 限定終盤と必勝圏 — Study 1 (\`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN\`)**
2. **[次に着手] 対称性と同型局面**
3. **[その後] 状態空間とゲーム木複雑度**
4. **[後続候補] 逆転可能性と勝負手**

限定終盤と必勝圏 Study 1でsymmetry reductionに依存しないbounded exact solutionを確立した。次はそのraw exact oracleを後続のsymmetry/isomorphism validationへ利用し、canonical representationを独立検証したうえで、raw state spaceとsymmetry-reduced state spaceを区別する状態空間研究へ進む。`;
  const newStage3 = `### 第3段階: 理論および完全解析への展開

1. **[完了] 限定終盤と必勝圏 — Study 1 (\`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN\`)**
2. **[完了] 対称性と同型局面 — Study 1（5/5 \`NON-ESTIMABLE\`）**
3. **[推奨先行候補] Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation — new prospective Study**
4. **[raw identityなら着手可] 状態空間とゲーム木複雑度**
5. **[後続候補] 逆転可能性と勝負手**

限定終盤と必勝圏 Study 1のbounded exact solutionはそのformal boundaryのまま保持する。Symmetry Study 1ではfresh bounded-local zero-mismatch evidenceを得た一方、mandatory oracle-anchor integrity / G12を完了できずformal transform validationは0件だった。したがってcanonical representationやsymmetry reductionをState Space研究の前提にしない。raw-state State Space研究は進行可能であり、symmetry-reduced countが必要な場合のみ、上流Studyを変更しない新規oracle-integrity / symmetry-confirmation研究を先行させる。`;
  text = replaceOnce(text, oldStage3, newStage3, "agenda stage3");

  write(path, text);
}

// RESEARCH_INDEX.md — append one completed-study section without renumbering prior sections.
{
  const path = "doc/RESEARCH_INDEX.md";
  let text = read(path);
  if (!text.includes("### 13. Symmetry / Isomorphic Positions — Study 1")) {
    text = text.trimEnd() + `\n\n---\n\n### 13. Symmetry / Isomorphic Positions — Study 1\n\n**研究題目:** Baoにおける対称性と同型局面の厳密検証 — rule-semantic state transformations, move-equivariant graph isomorphism, and validated canonicalization  \n**状態:** **Study 1 closed / formal result 0 validated / 0 rejected / 5 \`NON-ESTIMABLE\`**  \n**作業branch:** \`research/symmetry-isomorphic-positions\`\n\nこのprospective independent machine-only studyは、visual symmetryではなく、state transformation・player permutation・exact move bijectionが合法手集合、transition、terminal/winner semanticsを保存するかを検証した。candidate semantics、fresh seed block、root selection、depth、exact gatesをformal outcome前にfreezeした。\n\nFresh formal domainはseeds \`22910001..22910064\`、Namua / Mtaji / Mtaji-houseless各8 roots、depth 3である。3 candidates / 5 scientific outcomesはいずれもproduction / independent双方でfresh bounded-local mismatch 0だった。negative controlは638 fresh mismatches、IDENTITYはfresh mismatch 0で、fresh machineryはpositive/negative controlを識別した。\n\nしかしmandatoryとしたRestricted Endgame Study 1のimmutable 8-state exact-oracle anchorではIDENTITY positive control自身がPASSせず、production oracle mismatch count 19とindependent count 10が一致しなかった。G12がFAILしたため、5 outcomesすべて最終 \`NON-ESTIMABLE\` とした。post-outcome read-only diagnosticでは3 terminal stateRowsについてstored \`stateKey\`とstored \`ruleState\`のcanonical re-hash不一致を確認したが、これは上流Restricted Endgame Study 1のformal decisionを変更しない。\n\n**最初に読む:**\n\n- [\`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md\`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md) — 初見向け成果概要\n\n**詳細・正本:**\n\n- [\`symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md\`](symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合\n- [\`symmetry-isomorphic-positions/results/STAGE_1_FORMAL_RESULT.json\`](symmetry-isomorphic-positions/results/STAGE_1_FORMAL_RESULT.json) — canonical compact formal result\n- [\`symmetry-isomorphic-positions/REPRODUCIBILITY_INDEX.md\`](symmetry-isomorphic-positions/REPRODUCIBILITY_INDEX.md) — hash / workflow / artifact provenance\n- [\`symmetry-isomorphic-positions/CURRENT_STATUS.md\`](symmetry-isomorphic-positions/CURRENT_STATUS.md) — closure状態とdownstream boundary\n- [\`symmetry-isomorphic-positions/DECISION_REGISTER.md\`](symmetry-isomorphic-positions/DECISION_REGISTER.md) — prospective decisions / no-rescue / closure\n\n**Boundary:** formalにvalidatedされたtransformは0件。Study 1からcanonicalization、symmetry-group claim、symmetry-reduced state countingは承認しない。State Space / Game Tree Complexity Studyはraw state identityで進行できる。symmetry reductionが必要なら、上流Studyをretrofitしないnew prospective oracle-representation-integrity / symmetry-confirmation Studyを先行させる。\n`;
  }
  write(path, text);
}

// Root README.md — add one research entry after the Restricted Endgame entry.
{
  const path = "README.md";
  let text = read(path);
  const marker = "- [`doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md): Restricted Endgame / Winning Regions Study 1「限定終盤と必勝圏の完全解析」の初見向け成果概要（formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`、8 states / 7 edges、frozen rootはPlayer 0 `WIN`, DTF=3）";
  const add = "- [`doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md): Symmetry / Isomorphic Positions Study 1「対称性と同型局面の厳密検証」の初見向け成果概要（Study 1 closed、0 validated / 0 rejected / 5 `NON-ESTIMABLE`; fresh bounded-local mismatch 0、mandatory oracle-anchor G12 failed）";
  if (!text.includes(add)) text = replaceOnce(text, marker, `${marker}\n${add}`, "README research entry");
  write(path, text);
}

console.log("Symmetry Study 1 central document integration complete");
