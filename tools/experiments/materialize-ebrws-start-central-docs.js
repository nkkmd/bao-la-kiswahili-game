#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const ROOT=path.resolve(__dirname,"../..");
function read(p){return fs.readFileSync(path.join(ROOT,p),"utf8")}
function write(p,s){fs.writeFileSync(path.join(ROOT,p),s)}
function once(s,old,repl,label){const n=s.split(old).length-1;assert.equal(n,1,`${label}: expected one literal anchor, got ${n}`);return s.replace(old,repl)}
function regexOnce(s,re,repl,label){const m=s.match(re);assert(m,`${label}: regex anchor missing`);const flags=re.flags.includes("g")?re.flags:re.flags+"g";const all=s.match(new RegExp(re.source,flags));assert.equal(all.length,1,`${label}: expected one regex anchor, got ${all.length}`);return s.replace(re,repl)}

// Root README: current-facing RG3 status plus a G3-02 entry. Historical study entries remain untouched.
{
 const p="README.md";let s=read(p);
 const oldStatus='- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`のままclosed。post-G3-01 prerequisite `LGTGMIV-STUDY1`は`FORMAL-ELIGIBLE-ALL`でclosedし、RAW-only depth-5 local geometryの5 measurement familiesがformal eligible。G3-02は自動開始せず別authorization review待ち、depth 10はG3-11用holdoutとしてsealed。';
 const newStatus='- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`のままclosed、post-G3-01 prerequisite `LGTGMIV-STUDY1`は`FORMAL-ELIGIBLE-ALL`でclosed。G3-02は`EBRWS-STUDY1`として別authorization reviewを`AUTHORIZED`で通過し、protocol/preregistrationをprospectively freeze、technical-only Stage 0は`STAGE0-PASS`。Stage 1 fresh developmentは別authorization待ちで未実行、depth 10はG3-11用holdoutとしてsealed。';
 s=once(s,oldStatus,newStatus,"README RG3 current status");
 const lgt='- [`doc/local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md`](doc/local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md): Research Generation 3 post-G3-01 / pre-G3-02 prerequisite `LGTGMIV-STUDY1`。Stage 1 fresh 16 rootsとStage 2 fresh holdout 24 rootsをRAW-only depth 5までproduction / independent別実装でexact reconstructionし、5 frozen measurement familiesすべてがformal gateをPASS。formal decisionは`FORMAL-ELIGIBLE-ALL`。G3-01は救済せず、G3-02自動開始も未承認。';
 const ebrws='- [`doc/effective-branching-reply-width-structure/README.md`](doc/effective-branching-reply-width-structure/README.md): Research Generation 3 `G3-02` / `EBRWS-STUDY1`。post-LGTGMIV authorization reviewは`AUTHORIZED`。RAW-only depth 5、fresh Stage 1 seed `31210001..31210192`、Stage 2 seed `31220001..31220288`、primary constructs `TREE-WIDTH-SHAPE` / `REPLY-WIDTH-SHAPE`、exact 2/3 promotion gateをscientific outcome前にfreeze。technical-only Stage 0は`STAGE0-PASS`、Stage 1は別authorization待ちで未実行。';
 assert(!s.includes(ebrws),"README EBRWS entry already exists unexpectedly");
 s=once(s,lgt,lgt+"\n"+ebrws,"README LGTGMIV anchor");
 write(p,s);
}

// Future agenda: update only current-facing metadata and section 10.12. Historical PROGRAM_PLAN is a different file and is not touched.
{
 const p="doc/FUTURE_RESEARCH_AGENDA.md";let s=read(p);
 s=once(s,"Research Generation 3: **Active / LGTGMIV prerequisite closed `FORMAL-ELIGIBLE-ALL` / G3-02 authorization review required (2026-09-01)**","Research Generation 3: **Active / G3-02 `EBRWS-STUDY1` authorized and protocol-frozen / Stage 0 `STAGE0-PASS` / Stage 1 authorization pending (2026-09-01)**","FUTURE RG3 status");
 const section=`### 10.12 現在状態

2026-09-01、post-LGTGMIV G3-02 authorization reviewをcurrent repository stateに対して別decisionとして実施し、\`AUTHORIZED\`とした。これによりG3-02は正式Study \`EBRWS-STUDY1\`としてprospective Study-definition / preregistrationへ進んだ。G3-01 \`LGTGMF-STUDY1\`の\`TECHNICAL-INVALID\` closureとeligible families \`[]\`は変更せず、\`LGTGMIV-STUDY1\`も\`CLOSED / FORMAL-ELIGIBLE-ALL\`のまま再実行・再判定しない。

\`EBRWS-STUDY1\`の正式題目は「Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証」。authoritative identityはRAW-only、validated transform setは\`[]\`、relative horizonはdepth 5に固定した。

Primary dependencyはLGTGMIV F1 TREE-OCCURRENCE + F5 REPLY-GEOMETRY。F2 RAW-GRAPH、F3 TRANSPOSITION-RECONVERGENCE、F4 TREE-GRAPH-RELATIONはsecondary contextual characterizationだけに用いる。\`effective branching\`は新しいmeasurement instrumentではなく、eligible exact primitiveからprospectively fixed exact-rational quantityとして導出する。

Primary construct systemsは\`TREE-WIDTH-SHAPE\`と\`REPLY-WIDTH-SHAPE\`の2つだけで、phase-level candidate / formal confirmation gateはfloating pointを用いず\`3 * classCount >= 2 * eligibleRootCount\`のexact 2/3とした。

\`\`\`text
Research Generation 3 = ACTIVE / G3-02 EBRWS-STUDY1 ACTIVE
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID / eligible families []
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL / five eligible families
G3-02 authorization review = AUTHORIZED
G3-02 protocol / preregistration = FROZEN
G3-02 Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
G3-02 Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 Stage 1 seed = 31210001..31210192 / not consumed
G3-02 Stage 2 seed = 31220001..31220288 / not consumed
Protected standard-root depth-10 holdout = SEALED / NOT GENERATED / NOT READ
\`\`\`

Stage 0はsynthetic primitive fixturesだけを使ったtechnical-only validationで、production / independent stage scientific coreは\`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd\`にexact一致した。fresh scientific seed/root生成・readは行わず、protected depth-10 accessもfalseである。

次のscientific actionはStage 1の自動実行ではない。current-facing central documentation同期後に別のStage 1 authorizationを記録し、その後のみfresh \`31210001..31210192\`を使用できる。Stage 2はStage 1でprimary candidateがpromoteされた場合のみ別authorization対象となる。

standard initial RAW root complete exact depth-10 holdoutはG3-11向けに引き続きsealedとする。branching / reply widthをbest move、game-theoretic forcing、search difficulty、human difficultyへ読み替えない。
`;
 s=regexOnce(s,/### 10\.12 現在状態[\s\S]*$/,section,"FUTURE section 10.12");
 write(p,s);
}

// Research index: current RG3 item and future-state summary only.
{
 const p="doc/RESEARCH_INDEX.md";let s=read(p);
 const sec=`### 30. Research Generation 3 — G3-01 / LGTGMIV closure and G3-02 EBRWS start

**Program:** Bao Third-Generation Research Program / **Core:** \`G3-01..G3-12\`  
**状態:** **ACTIVE / G3-01 \`TECHNICAL-INVALID\` / LGTGMIV \`FORMAL-ELIGIBLE-ALL\` / G3-02 \`EBRWS-STUDY1\` protocol frozen / Stage 0 \`STAGE0-PASS\` / Stage 1 not yet authorized**

G3-01 \`LGTGMF-STUDY1\`は\`TECHNICAL-INVALID\`、formal eligible families \`[]\`、Stage 2未実行のままimmutable closureとする。post-G3-01 prerequisite \`LGTGMIV-STUDY1\`は別のfresh Studyとして\`CLOSED / FORMAL-ELIGIBLE-ALL\`で完了し、RAW-only depth-5 local geometryの5 frozen measurement familiesをformal eligibleとした。

その後、別のpost-LGTGMIV G3-02 authorization reviewを実施し\`AUTHORIZED\`とした。G3-02は正式Study \`EBRWS-STUDY1\`として開始し、scientific outcome前にStudy identity、depth 5、RAW identity、validated transform set \`[]\`、fresh populations、seed blocks、derived constructs、primary/secondary endpoints、resource ceilings、independent verification、no-rescue ruleをfreezeした。

Stage 1 developmentはseed \`31210001..31210192\`、12 Namua + 12 Mtaji。Stage 2 formal holdoutは\`31220001..31220288\`、18 + 18。いずれもこのcurrent stateでは未消費である。

Primary systemsは\`TREE-WIDTH-SHAPE\` / \`REPLY-WIDTH-SHAPE\`、phase-level promotion/confirmationはexact 2/3 gate。technical-only Stage 0 \`EBRWS-S0-TECHNICAL-2026-09-01-v1\`はsynthetic fixturesで全mandatory controlをPASSし、production / independent stage scientific coreは\`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd\`にexact一致した。

**最初に読む:**

- [\`effective-branching-reply-width-structure/README.md\`](effective-branching-reply-width-structure/README.md)
- [\`effective-branching-reply-width-structure/CURRENT_STATUS.md\`](effective-branching-reply-width-structure/CURRENT_STATUS.md)
- [\`research-generation-3/CURRENT_STATUS.md\`](research-generation-3/CURRENT_STATUS.md)

**詳細・正本:**

- [\`effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md\`](effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md)
- [\`effective-branching-reply-width-structure/prereg/STUDY_1_SPEC.json\`](effective-branching-reply-width-structure/prereg/STUDY_1_SPEC.json)
- [\`effective-branching-reply-width-structure/DECISION_REGISTER.md\`](effective-branching-reply-width-structure/DECISION_REGISTER.md)
- [\`effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md\`](effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md)
- [\`research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md\`](research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md)

**Boundary:** G3-02 claimはfresh bounded RAW local geometry / relative depth 5に限定する。Stage 1は別authorization前に実行しない。standard-root depth 10はsealed。branch width / reply widthをbest move、forcing、value、human difficultyへ読み替えない。`;
 s=regexOnce(s,/### 30\. Research Generation 3 — G3-01 closure \/ LGTGMIV prerequisite closure[\s\S]*?\n---\n\n## 将来研究/,sec+"\n\n---\n\n## 将来研究","RESEARCH_INDEX item 30");
 s=regexOnce(s,/\*\*Research Generation 3 state:\*\*[^\n]*/,"**Research Generation 3 state:** G3-01 `LGTGMF-STUDY1` remains closed `TECHNICAL-INVALID` with eligible families `[]`; `LGTGMIV-STUDY1` remains closed `FORMAL-ELIGIBLE-ALL`. G3-02 is now `EBRWS-STUDY1`: authorization review `AUTHORIZED`, protocol/preregistration frozen, technical Stage 0 `STAGE0-PASS`, Stage 1 not yet authorized. Standard-root depth 10 remains sealed for G3-11.","RESEARCH_INDEX future RG3 state");
 write(p,s);
}
console.log("EBRWS_CENTRAL_DOCS_MATERIALIZED=README.md,doc/FUTURE_RESEARCH_AGENDA.md,doc/RESEARCH_INDEX.md");
