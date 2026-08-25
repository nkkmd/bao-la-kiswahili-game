#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function replaceOnce(text, oldText, newText, label) {
  const count = text.split(oldText).length - 1;
  ensure(count === 1, `${label}: expected exactly one match, got ${count}`);
  return text.replace(oldText, newText);
}

function replaceRegexOnce(text, regex, replacement, label) {
  const matches = text.match(regex);
  ensure(matches && matches.length === 1, `${label}: expected exactly one match`);
  return text.replace(regex, replacement);
}

const indexPath = "doc/RESEARCH_INDEX.md";
let index = fs.readFileSync(indexPath, "utf8");
const indexMarker = "\n---\n\n## 将来研究\n";
const indexSection = `
---

### 15. State Space / Game Tree Complexity — Study 1

**研究題目:** Baoにおける状態空間とゲーム木複雑度の定量化 — authoritative raw-state identity に基づく reachable-state growth, transposition structure, branching complexity, and bounded game-tree expansion  
**状態:** **COMPLETED / formal decision \`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN\`**  
**作業branch:** \`research/state-space-game-tree-complexity\`

このprospective independent machine-only studyは、ORISC-STUDY1のdownstream contractに従い、未検証symmetry reduction / canonicalizationを一切使用せず、authoritative raw-state identityだけでreachable-state graphとgame-tree occurrenceを定量化した。

Formal Stage 2ではstandard initial stateからraw-state depth 8まで、parent depth 0..7をcomplete expansionするbounded graphと、depth 8までのnon-deduplicated game treeをoutcome前にfreezeし、fresh evidenceで全域を列挙した。Productionとseparate-process independent verifierは全frozen domainを別々に再列挙して完全一致した。

\`\`\`text
reachable raw states through depth 8 = 24,848
graph transition occurrences (parent depths 0..7) = 25,648
duplicate encounters = 801
multi-parent states = 763

game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940
raw-state / tree-node ratio = 0.803076823632074
\`\`\`

Canonical identities:

\`\`\`text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
\`\`\`

**最初に読む:**

- [\`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md\`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [\`state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md\`](state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [\`state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json\`](state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json) — canonical formal result
- [\`state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md\`](state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md) — workflow / artifact / hash / verifier索引
- [\`state-space-game-tree-complexity/CURRENT_STATUS.md\`](state-space-game-tree-complexity/CURRENT_STATUS.md) — closure状態とclaim boundary
- [\`state-space-game-tree-complexity/DECISION_REGISTER.md\`](state-space-game-tree-complexity/DECISION_REGISTER.md) — prospective decisions / no-rescue / closure

**Boundary:** exact claimはstandard-rootのfrozen depth-8 RAW-ONLY domainだけに限定される。\`Bao state space = 24,848\`、full game-tree exact count、depth-8 growthのfull-game extrapolation、global transposition ratio、symmetry-reduced count、validated canonicalization、full-game estimatorは主張しない。より深い列挙・推定・symmetry reductionは新しいprospective study/versioned protocolを必要とする。
`;

if (!index.includes("### 15. State Space / Game Tree Complexity — Study 1")) {
  index = replaceOnce(index, indexMarker, `${indexSection}${indexMarker}`, "RESEARCH_INDEX insertion");
}
fs.writeFileSync(indexPath, index, "utf8");

const agendaPath = "doc/FUTURE_RESEARCH_AGENDA.md";
let agenda = fs.readFileSync(agendaPath, "utf8");
agenda = replaceOnce(agenda, "Version: 1.13.0", "Version: 1.14.0", "agenda version");

const oldProgramParagraph = /2026-08-25時点で、Baoに精通したhuman\/expert participantへの現実的アクセスを確保できないため、[\s\S]*?SIPまたはORISCの未検証transformをreductionへ使用してはならない。/;
const newProgramParagraph = `2026-08-25時点で、Baoに精通したhuman/expert participantへの現実的アクセスを確保できないため、「人間とAIの判断差」は当面保留とする。human claimをmachine-only evidenceで代替しない。machine-only sequenceでは限定終盤、Symmetry Study 1、ORISC-STUDY1に続き、State Space / Game Tree Complexity Study 1も完了した。

State Space / Game Tree Complexity Study 1は、ORISCのRAW-ONLY downstream contractを維持してstandard initial stateからdepth 8までのbounded reachable raw-state graphとgame treeをprospectively freezeし、production / independent双方の全域再列挙一致により\`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN\`で閉じた。exact resultは24,848 raw states / 25,648 graph transition occurrences / 30,941 game-tree node occurrences / 30,940 tree edgesである。ただしこれはfrozen depth-8 domainだけのexact claimであり、Bao全体のstate-space sizeやfull game-tree complexityを解いたことを意味しない。canonicalization / symmetry-reduced state countingは引き続き未承認で、より深い列挙・full-game estimation・symmetry reductionは新しいprospective study/versioned protocolとして扱う。`;
agenda = replaceRegexOnce(agenda, oldProgramParagraph, newProgramParagraph, "agenda top program state");

const section2Marker = "\n\n今後の研究では、単純な勝率比較から対象を広げ、次の問いを中心に置く。";
if (!agenda.includes("- State Space / Game Tree Complexity Study 1 — [`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`]")) {
  const bullet = "\n- State Space / Game Tree Complexity Study 1 — [`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md)（Study complete / `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN` / standard-root depth 8で24,848 raw states / 30,941 game-tree node occurrences / RAW-ONLY）";
  agenda = replaceOnce(agenda, section2Marker, `${bullet}${section2Marker}`, "agenda section 2 list");
}

const section412 = `### 4.12 状態空間とゲーム木複雑度 — Study 1完了

#### 現在の状態

**State Space / Game Tree Complexity Study 1 complete / formal decision \`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN\`.**

- 初見向け概要: [\`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md\`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md)
- 科学的正本: [\`state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md\`](state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md)
- Formal result: [\`state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json\`](state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json)
- Reproducibility: [\`state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md\`](state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md)

Study 1はORISC-STUDY1のdownstream representation firewallを維持し、\`pits,reserve,houseOwned,player,phase,winner,pending\`のraw identityのみを使用した。\`turn/reason\`はidentityから除外し、missing \`pending\`はengine entry前にhard reject、全accepted stateで64-seed conservationを要求した。SIP/ORISC transform、seat swap、reflection、canonicalization、symmetry quotientは使用していない。

Formal Stage 2はfresh evidenceでstandard rootからparent depth 0..7を完全展開し、raw-state depth 8までとnon-deduplicated tree depth 8までをexact enumerationした。

\`\`\`text
reachable raw states through depth 8 = 24,848
graph transition occurrences parent depth 0..7 = 25,648
duplicate encounters = 801
multi-parent states = 763

game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940
raw-state / tree-node ratio = 0.803076823632074
\`\`\`

Independent verifierはproduction serializer/formal runner/Stage 1 artifact codeをimportせず、frozen graph/tree全域を再列挙し、countとset hashを完全一致させた。

\`\`\`text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
\`\`\`

#### Boundary / future use

このexact resultはfrozen standard-root depth-8 RAW-ONLY domainだけに限定する。\`Bao state space = 24,848\`とは主張しない。full Bao state-space / full game-tree exact count、global growth law、global transposition ratio、full-game estimator、symmetry-reduced count、validated canonicalizationは未解決である。

Stage 1のpartial depth-9 rowsをestimateへ読み替えたり、結果後にcapを上げたりしない。より深いRAW-only exact enumeration、full-game estimation、またはsymmetry-reduced countingを検討する場合は、現Studyを延長・救済せず、新しいprospective study/versioned protocolとしてresource rule・estimatorまたはtransform authorizationを事前固定する。
`;
agenda = replaceRegexOnce(
  agenda,
  /### 4\.12 状態空間とゲーム木複雑度[\s\S]*?\n## 5\. 推奨する研究プログラム/,
  `${section412}\n## 5. 推奨する研究プログラム`,
  "agenda section 4.12"
);

agenda = replaceOnce(
  agenda,
  "4. **[次研究候補 / RAW-ONLY] 状態空間とゲーム木複雑度**",
  "4. **[完了] 状態空間とゲーム木複雑度 — Study 1 (`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`)**",
  "agenda stage 3 list"
);

agenda = replaceOnce(
  agenda,
  "**現在のmachine-only programmatic next stepはraw-state State Space / Game Tree Complexity Studyである。**",
  "State Space / Game Tree Complexity Study 1もRAW-ONLYで完了し、frozen depth-8 domainのbounded exact countを確立した。次のmachine-only研究は、この結果をfull-game claimへ救済せず、より深いRAW-only enumeration、prospectively specified estimation、または独立にvalidationされた将来transformを用いる新研究のいずれかとして設計する。",
  "agenda stage 3 summary"
);

fs.writeFileSync(agendaPath, agenda, "utf8");

process.stdout.write(JSON.stringify({
  updated: [indexPath, agendaPath],
  researchIndexHasStudy15: index.includes("### 15. State Space / Game Tree Complexity — Study 1"),
  agendaVersion: "1.14.0",
  agendaHasCompleted412: agenda.includes("### 4.12 状態空間とゲーム木複雑度 — Study 1完了"),
  formalDecisionPresent: agenda.includes("SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN"),
}, null, 2) + "\n");