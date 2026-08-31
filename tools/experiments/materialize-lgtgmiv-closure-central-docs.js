#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const ROOT=path.resolve(__dirname,"../..");
function read(p){return fs.readFileSync(path.join(ROOT,p),"utf8")}
function write(p,s){fs.writeFileSync(path.join(ROOT,p),s)}
function once(s,old,repl,label){const n=s.split(old).length-1;assert.equal(n,1,`${label}: expected one literal anchor, got ${n}`);return s.replace(old,repl)}
function regexOnce(s,re,repl,label){const m=s.match(re);assert(m,`${label}: regex anchor missing`);const all=s.match(new RegExp(re.source,re.flags.includes("g")?re.flags:re.flags+"g"));assert.equal(all.length,1,`${label}: expected one regex anchor, got ${all.length}`);return s.replace(re,repl)}

// Root README: update only the RG3 current-status entry and add the completed prerequisite entry next to G3-01.
{
 const p="README.md";let s=read(p);
 const oldStatus='- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`でclosed。次のscientific directionとして新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisiteを選択済みだが、正式Study ID・scientific execution・seed consumptionは未開始。G3-02〜G3-08はblocked、depth 10はG3-11用holdoutとしてsealed。';
 const newStatus='- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`のままclosed。post-G3-01 prerequisite `LGTGMIV-STUDY1`は`FORMAL-ELIGIBLE-ALL`でclosedし、RAW-only depth-5 local geometryの5 measurement familiesがformal eligible。G3-02は自動開始せず別authorization review待ち、depth 10はG3-11用holdoutとしてsealed。';
 s=once(s,oldStatus,newStatus,"README RG3 current status");
 const g301='- [`doc/local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`](doc/local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-01` / `LGTGMF-STUDY1`。Fresh Stage 1では全12 rootsでproduction / independentのroot-level coreとF1〜F5 family digestがexact一致したが、runtime-dependent resource observationsを含むstage-level hash実装欠陥によりformal decisionは`TECHNICAL-INVALID`。eligible familiesは`[]`、Stage 2未実行。';
 const lgt='- [`doc/local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md`](doc/local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md): Research Generation 3 post-G3-01 / pre-G3-02 prerequisite `LGTGMIV-STUDY1`。Stage 1 fresh 16 rootsとStage 2 fresh holdout 24 rootsをRAW-only depth 5までproduction / independent別実装でexact reconstructionし、5 frozen measurement familiesすべてがformal gateをPASS。formal decisionは`FORMAL-ELIGIBLE-ALL`。G3-01は救済せず、G3-02自動開始も未承認。';
 assert(!s.includes(lgt),"README LGTGMIV entry already exists unexpectedly");
 s=once(s,g301,g301+"\n"+lgt,"README G3-01 anchor");write(p,s);
}

// Future agenda: preserve the historical agenda and replace only current-facing metadata/section 10.12.
{
 const p="doc/FUTURE_RESEARCH_AGENDA.md";let s=read(p);
 s=once(s,"更新日: 2026-08-31","更新日: 2026-09-01","FUTURE update date");
 s=once(s,"Research Generation 3: **Active / post-G3-01 measurement prerequisite selected / not started (2026-08-31)**","Research Generation 3: **Active / LGTGMIV prerequisite closed `FORMAL-ELIGIBLE-ALL` / G3-02 authorization review required (2026-09-01)**","FUTURE RG3 status");
 const section=`### 10.12 現在状態

2026-09-01、G3-01後の独立measurement-instrument prerequisite \`LGTGMIV-STUDY1\`は、prospectively frozen Stage 0/1/2を完遂し、\`CLOSED / FORMAL-ELIGIBLE-ALL\`で閉じた。G3-01 \`LGTGMF-STUDY1\`は従来どおり\`TECHNICAL-INVALID\`であり、この結果は変更しない。

\`LGTGMIV-STUDY1\`ではscientific canonical coreからruntime/resource telemetryを分離し、RAW-only state identity、validated transform set \`[]\`、production / structurally independent implementation、fresh-evidence no-rescue firewallを維持した。

Stage 1はfresh \`31110001..31110128\`からNamua 8 / Mtaji 8の16 rootsをdepth 5までexact reconstructionし、global gateをPASSして5 familyすべてをpromoteした。Stage 2はfresh formal holdout \`31120001..31120192\`からNamua 12 / Mtaji 12の24 rootsをdepth 5まで測定し、production / independent exact root reconstruction 24/24、各family exact roots 24/24、resource gate PASSを得た。

\`\`\`text
Research Generation 3 = ACTIVE / POST-LGTGMIV PREREQUISITE CLOSED / G3-02 AUTHORIZATION REVIEW REQUIRED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
post-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
LGTGMIV formal eligible families = F1 TREE-OCCURRENCE / F2 RAW-GRAPH / F3 TRANSPOSITION-RECONVERGENCE / F4 TREE-GRAPH-RELATION / F5 REPLY-GEOMETRY
LGTGMIV Stage 1 seed consumption = 31110001..31110128
LGTGMIV Stage 2 seed consumption = 31120001..31120192
G3-02 automatic start = BLOCKED
G3-02..G3-08 automatic start = BLOCKED
Protected standard-root depth-10 holdout = SEALED / NOT GENERATED / NOT READ
\`\`\`

LGTGMIVのpositive resultは、frozen RAW-only depth-5 local game-tree/graph geometry measurement instrumentのbounded formal eligibilityを意味する。whole-Bao state/game-tree size、depth 5超への自動一般化、symmetry reduction、strategic/game-theoretic value、human difficultyは主張しない。

次のscientific actionはG3-02の自動開始ではなく、current repository state、formal eligible family set、G3-02 fresh population/evidence firewall、protected evidence dependencyを確認する別のpost-closure authorization reviewである。review完了前にG3-02 scientific evidenceを生成しない。

standard initial RAW rootのcomplete exact depth-10 holdoutはG3-11向けに引き続きsealedとする。
`;
 s=regexOnce(s,/### 10\.12 現在状態[\s\S]*$/,section,"FUTURE section 10.12");write(p,s);
}

// Research index: replace only RG3 item 30 and its future-state summary.
{
 const p="doc/RESEARCH_INDEX.md";let s=read(p);
 const sec=`### 30. Research Generation 3 — G3-01 closure / LGTGMIV prerequisite closure

**Program:** Bao Third-Generation Research Program / **Core:** \`G3-01..G3-12\`  
**状態:** **ACTIVE / G3-01 \`TECHNICAL-INVALID\` / LGTGMIV \`FORMAL-ELIGIBLE-ALL\` / G3-02 authorization review required**

G3-01 \`LGTGMF-STUDY1\`は、Stage 1 fresh rootsのroot/family levelではproduction / independent exact一致を得たが、runtime telemetryをstage-level canonical digestへ含めた凍結済みinstrument defectにより\`TECHNICAL-INVALID\`で閉じた。eligible familiesは\`[]\`、Stage 2は未実行であり、このformal decisionは変更しない。

その後、G3-01とは別のnew prospective independent prerequisiteとして\`LGTGMIV-STUDY1\`を実施した。scientific canonical coreとtelemetryを分離し、RAW-only identity、validated transform set \`[]\`、production / independent implementation、fresh evidence firewallを固定した。

Stage 1はfresh \`31110001..31110128\`から16 roots（Namua/Mtaji 8/8）をdepth 5までcomplete reconstructionし、5 familiesすべてをpromote。Stage 2はfresh holdout \`31120001..31120192\`から24 roots（12/12）をdepth 5まで測定し、root reconstruction 24/24 exact一致、全5 familiesで24/24 root exact agreement、stage digest exact agreement、resource gate PASSを得た。

Formal decision:

**\`LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL\`**

formal eligible families:

- \`LGTGMIV-F1-TREE-OCCURRENCE\`
- \`LGTGMIV-F2-RAW-GRAPH\`
- \`LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE\`
- \`LGTGMIV-F4-TREE-GRAPH-RELATION\`
- \`LGTGMIV-F5-REPLY-GEOMETRY\`

**最初に読む:**

- [\`local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md\`](local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md)
- [\`research-generation-3/CURRENT_STATUS.md\`](research-generation-3/CURRENT_STATUS.md)

**詳細・正本:**

- [\`local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md\`](local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md)
- [\`local-game-tree-geometry-measurement-instrument-verification/STUDY_1_PROTOCOL.md\`](local-game-tree-geometry-measurement-instrument-verification/STUDY_1_PROTOCOL.md)
- [\`local-game-tree-geometry-measurement-instrument-verification/REPRODUCIBILITY_INDEX.md\`](local-game-tree-geometry-measurement-instrument-verification/REPRODUCIBILITY_INDEX.md)
- [\`local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md\`](local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md)

**Boundary:** eligibilityはfrozen RAW-only depth-5 local measurement instrumentに限定する。G3-01を救済しない。G3-02はautomatic startせず、別authorization reviewまでblocked。standard-root depth 10はsealed。`;
 s=regexOnce(s,/### 30\. Research Generation 3 — G3-01 closure \/ next measurement prerequisite selected[\s\S]*?\n---\n\n## 将来研究/,sec+"\n\n---\n\n## 将来研究","RESEARCH_INDEX item 30");
 s=regexOnce(s,/\*\*Research Generation 3 state:\*\*[^\n]*/,"**Research Generation 3 state:** G3-01 `LGTGMF-STUDY1` remains closed `TECHNICAL-INVALID` with eligible families `[]`. The independent post-G3-01 prerequisite `LGTGMIV-STUDY1` is closed `FORMAL-ELIGIBLE-ALL`; all five frozen RAW-only depth-5 local geometry measurement families are formally eligible. G3-02 automatic start remains blocked pending a separate post-closure authorization review, and standard-root depth 10 remains sealed for G3-11.","RESEARCH_INDEX future RG3 state");write(p,s);
}
console.log("LGTGMIV_CENTRAL_DOCS_MATERIALIZED=README.md,doc/FUTURE_RESEARCH_AGENDA.md,doc/RESEARCH_INDEX.md");
