#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const ROOT=path.resolve(__dirname,"../..");
function read(p){return fs.readFileSync(path.join(ROOT,p),"utf8");}
function write(p,s){fs.writeFileSync(path.join(ROOT,p),s);}
function regexOnce(s,re,repl,label){
  const flags=re.flags.includes("g")?re.flags:re.flags+"g";
  const all=[...s.matchAll(new RegExp(re.source,flags))];
  assert.equal(all.length,1,`${label}: expected exactly one match, got ${all.length}`);
  return s.replace(re,repl);
}

// Root README: current-facing RG3 line and G3-02 study line only.
{
  const p="README.md";let s=read(p);
  const rg3='- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`のままclosed、post-G3-01 prerequisite `LGTGMIV-STUDY1`は`FORMAL-ELIGIBLE-ALL`でclosed。G3-02 / `EBRWS-STUDY1`はfresh Stage 1を一度だけ実行したがcanonical result artifactのrepository materialization failureによりfail-closedで`CLOSED / TECHNICAL-INVALID`。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、formal promoted candidate setは`[]`、depth 10はG3-11用holdoutとしてsealed。';
  s=regexOnce(s,/^- \[`doc\/research-generation-3\/CURRENT_STATUS\.md`\]\(doc\/research-generation-3\/CURRENT_STATUS\.md\):[^\n]*$/m,rg3,"root README RG3 current status");
  const ebrws='- [`doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-02` / `EBRWS-STUDY1`。RAW-only depth 5、primary `TREE-WIDTH-SHAPE` / `REPLY-WIDTH-SHAPE`をprospectively freezeしてfresh Stage 1をone-shot実行。runner-localではproduction / independent exact agreementとreply-width compression-dominant Namua 12/12・Mtaji 9/12を観測したが、canonical Stage 1 artifactのpush競合・回収不能によりformal decisionは`TECHNICAL-INVALID`。diagnostic patternはformal promotionせず、Stage 2未実行。';
  s=regexOnce(s,/^- \[`doc\/effective-branching-reply-width-structure\/(?:README|STUDY_1_OVERVIEW)\.md`\]\(doc\/effective-branching-reply-width-structure\/(?:README|STUDY_1_OVERVIEW)\.md\):[^\n]*$/m,ebrws,"root README EBRWS entry");
  write(p,s);
}

// Future agenda: update only current-facing top status and section 10.12. Historical agenda sections remain untouched.
{
  const p="doc/FUTURE_RESEARCH_AGENDA.md";let s=read(p);
  s=regexOnce(s,/^Research Generation 3: \*\*[^\n]*\*\*$/m,'Research Generation 3: **Active / G3-02 `EBRWS-STUDY1` closed `TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED` / next program review required (2026-09-02)**',"FUTURE RG3 top status");
  const section=`### 10.12 現在状態

2026-09-02、Research Generation 3のG3-02 \`EBRWS-STUDY1\`は、prospective contractに従って**\`CLOSED / TECHNICAL-INVALID\`**で閉じた。G3-01 \`LGTGMF-STUDY1\`の\`TECHNICAL-INVALID\` closure・formal eligible families \`[]\`は変更せず、独立prerequisite \`LGTGMIV-STUDY1\`も\`CLOSED / FORMAL-ELIGIBLE-ALL\`のまま再実行・再判定しない。

G3-02はpost-LGTGMIV authorization reviewを\`AUTHORIZED\`で通過後、RAW-only identity、validated transform set \`[]\`、relative depth 5、primary \`TREE-WIDTH-SHAPE\` / \`REPLY-WIDTH-SHAPE\`、exact 2/3 gate、fresh population、resource ceiling、production / independent verification、no-rescue ruleをscientific outcome前にfreezeした。

Stage 0はsynthetic fixturesだけで\`STAGE0-PASS\`。Stage 1はfresh \`31210001..31210192\`からNamua 12 + Mtaji 12を一度だけ実行した。frozen runner内部ではglobal gate PASSとproduction / independent stage scientific core exact一致を得て、diagnostic summaryとして\`REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT\`がNamua 12/12、Mtaji 9/12と記録された。

ただし、生成済みcanonical Stage 1 result filesをrepositoryへ保存するpushがnon-fast-forwardでrejectされ、ephemeral runner終了後にfull canonical artifactを回収できなかった。fresh evidence生成後のsame-evidence rerunはno-rescue ruleに反するため実施していない。runner-local positive summaryをformal resultへ救済せず、technical-integrity / immutable candidate-artifact prerequisiteを満たさないものとしてfail-closedで閉じた。

\`\`\`text
Research Generation 3 = ACTIVE / G3-02 CLOSED TECHNICAL-INVALID / NEXT PROGRAM REVIEW REQUIRED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID / eligible families []
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL / F1..F5 eligible
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-02 Stage 0 = STAGE0-PASS
G3-02 Stage 1 = TECHNICAL-INVALID
G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 formal promoted candidate set = []
G3-02 Stage 1 seed = 31210001..31210192 / consumed
G3-02 Stage 2 seed = 31220001..31220288 / not consumed
Protected standard-root depth-10 holdout = SEALED / NOT GENERATED / NOT READ
\`\`\`

runner-local Namua 12/12・Mtaji 9/12のcompression-dominant patternはdiagnostic provenanceであり、formal confirmation、Bao一般の構造則、best move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。

G3-02 closureはG3-03以降を自動authorizeしない。次のscientific actionは、G3-02のimmutable \`TECHNICAL-INVALID\` closure、LGTGMIV family boundary、RAW-only identity、protected depth-10 firewallを維持した別のpost-G3-02 program reviewである。

Research Generation 3開始前にfreezeした\`research-generation-3/PROGRAM_PLAN.md\`はhistorical prospective planとして変更しない。
`;
  s=regexOnce(s,/### 10\.12 現在状態[\s\S]*$/,section,"FUTURE section 10.12");
  write(p,s);
}

// Research index: replace only RG3 item 30 and the one-line future-state summary.
{
  const p="doc/RESEARCH_INDEX.md";let s=read(p);
  const sec=`### 30. Research Generation 3 — G3-01 / LGTGMIV / G3-02 closure

**Program:** Bao Third-Generation Research Program / **Core:** \`G3-01..G3-12\`  
**状態:** **ACTIVE / G3-01 \`TECHNICAL-INVALID\` / LGTGMIV \`FORMAL-ELIGIBLE-ALL\` / G3-02 \`EBRWS-STUDY1 = TECHNICAL-INVALID\` / Stage 2 not executed**

G3-01 \`LGTGMF-STUDY1\`は\`TECHNICAL-INVALID\`、formal eligible families \`[]\`、Stage 2未実行のままimmutable closureとする。その後の独立prerequisite \`LGTGMIV-STUDY1\`は\`CLOSED / FORMAL-ELIGIBLE-ALL\`で、RAW-only depth-5 local geometryの5 frozen measurement familiesをformal eligibleとした。

G3-02は別authorization reviewを\`AUTHORIZED\`で通過し、\`EBRWS-STUDY1\`としてprospectively開始した。Stage 0は\`STAGE0-PASS\`。Stage 1はfresh \`31210001..31210192\`から12 Namua + 12 Mtajiを一度だけ測定し、runner-localではproduction / independent stage core exact一致とglobal gate PASSを得た。

runner-local diagnostic summaryでは\`REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT\`がNamua 12/12、Mtaji 9/12だった。しかしcanonical Stage 1 filesのrepository pushがnon-fast-forwardで失敗し、ephemeral runner終了後にfull canonical artifactを回収不能となった。fresh evidence生成後のsame-evidence rerunを行わず、runner-local positive summaryをformal promotionへ救済しない。

Formal decision:

**\`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID\`**

```text
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = consumed
Stage 2 seed = not consumed
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

**最初に読む:**

- [\`effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md\`](effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md)
- [\`research-generation-3/CURRENT_STATUS.md\`](research-generation-3/CURRENT_STATUS.md)

**詳細・正本:**

- [\`effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md\`](effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md)
- [\`effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md\`](effective-branching-reply-width-structure/STUDY_1_PROTOCOL.md)
- [\`effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json\`](effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json)
- [\`effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md\`](effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md)
- [\`research-program-decisions/2026-09-02-g3-02-technical-invalid-closure.md\`](research-program-decisions/2026-09-02-g3-02-technical-invalid-closure.md)

**Boundary:** runner-local compression patternはdiagnostic provenanceのみでformal positive claimではない。G3-02をsame-evidence rerun/rescueしない。G3-03以降は別reviewまで自動開始しない。standard-root depth 10はG3-11用にsealed。`;
  s=regexOnce(s,/### 30\. Research Generation 3[\s\S]*?\n---\n\n## 将来研究/,sec+"\n\n---\n\n## 将来研究","RESEARCH_INDEX item 30");
  const future='**Research Generation 3 state:** G3-01 `LGTGMF-STUDY1` remains closed `TECHNICAL-INVALID` with eligible families `[]`; `LGTGMIV-STUDY1` remains closed `FORMAL-ELIGIBLE-ALL`. G3-02 `EBRWS-STUDY1` is closed `TECHNICAL-INVALID` after a one-shot Stage 1 canonical-artifact materialization failure; formal promoted candidate set `[]`, Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`, and standard-root depth 10 remains sealed for G3-11. Next scientific action requires a separate post-G3-02 program review.';
  s=regexOnce(s,/^\*\*Research Generation 3 state:\*\*[^\n]*$/m,future,"RESEARCH_INDEX future RG3 state");
  write(p,s);
}

console.log("EBRWS_TECHNICAL_INVALID_CENTRAL_DOCS_MATERIALIZED=README.md,doc/FUTURE_RESEARCH_AGENDA.md,doc/RESEARCH_INDEX.md");
