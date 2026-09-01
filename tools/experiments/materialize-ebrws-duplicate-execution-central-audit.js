#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const ROOT=path.resolve(__dirname,"../..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const write=(p,s)=>fs.writeFileSync(path.join(ROOT,p),s);
const block=xs=>xs.join("\n")+"\n";
function once(s,re,repl,label){const flags=re.flags.includes("g")?re.flags:re.flags+"g",all=[...s.matchAll(new RegExp(re.source,flags))];assert.equal(all.length,1,`${label}: ${all.length}`);return s.replace(re,repl);}

{
 const p="README.md";let s=read(p);
 s=once(s,/^- \[`doc\/research-generation-3\/CURRENT_STATUS\.md`\]\(doc\/research-generation-3\/CURRENT_STATUS\.md\):[^\n]*$/m,'- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01は`TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`で不変。G3-02 / `EBRWS-STUDY1`はcanonical Stage 1 artifact materialization failureに加え、final Actions auditでauthorized 1回に対してactual 2回のscientific executionが判明したため`CLOSED / TECHNICAL-INVALID`。2回目は`INVALID-DO-NOT-USE`、formal promoted candidate set `[]`、Stage 2未実行、depth 10はG3-11用holdoutとしてsealed。',"README RG3");
 s=once(s,/^- \[`doc\/effective-branching-reply-width-structure\/(?:README|STUDY_1_OVERVIEW)\.md`\]\(doc\/effective-branching-reply-width-structure\/(?:README|STUDY_1_OVERVIEW)\.md\):[^\n]*$/m,'- [`doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-02` / `EBRWS-STUDY1`。RAW-only depth 5でfresh Stage 1を実行したが、canonical result push失敗・回収不能に加え、workflow armingにより意図せず2回目のStage 1が実行されexactly-one-execution contractも違反。formal decisionは`CLOSED / TECHNICAL-INVALID`、2回目はscientific inferenceから除外、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。',"README EBRWS");
 write(p,s);
}

{
 const p="doc/FUTURE_RESEARCH_AGENDA.md";let s=read(p);
 const section=block([
 '### 10.12 現在状態','',
 '2026-09-02、G3-02 `EBRWS-STUDY1`は**`CLOSED / TECHNICAL-INVALID`**でformal closureした。G3-01 `LGTGMF-STUDY1`の`TECHNICAL-INVALID` closure・eligible families `[]`、および独立prerequisite `LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`は変更しない。','',
 'G3-02はRAW-only identity、validated transform set `[]`、relative depth 5、primary `TREE-WIDTH-SHAPE` / `REPLY-WIDTH-SHAPE`、exact 2/3 gate、fresh populations、resource ceilings、production / independent verification、no-rescue ruleをscientific outcome前にfreezeした。Stage 0は`STAGE0-PASS`。','',
 'Stage 1のauthorized one-shot run `33569323221`はfresh `31210001..31210192`からNamua 12 + Mtaji 12を計算し、runner-localではglobal gate PASS、production / independent exact stage-core agreement、reply-width `COMPRESSION-DOMINANT` Namua 12/12・Mtaji 9/12を記録した。しかしcanonical result filesのpushがnon-fast-forwardで失敗し、ephemeral runner終了後にfull canonical artifactを回収できなかったため、これらはformal promotionせずdiagnostic provenanceに限定した。','',
 'さらにfinal Actions-history auditで、workflow armingによりrun `33569382663`が意図せずqueueされ、同じStage 1 scientific computationが2回目も実行されていたことを確認した。authorizationはexactly one executionであるため、この2回目は`UNAUTHORIZED-DUPLICATE-INVALID` / `INVALID-DO-NOT-USE`とし、replication・confirmation・repair・rescueに使用しない。','',
 '```text',
 'Research Generation 3 = ACTIVE / G3-02 CLOSED TECHNICAL-INVALID / NEXT PROGRAM REVIEW REQUIRED',
 'G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID / eligible families []',
 'LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL / F1..F5 eligible',
 'G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID',
 'G3-02 Stage 0 = STAGE0-PASS',
 'G3-02 Stage 1 = TECHNICAL-INVALID',
 'G3-02 Stage 1 authorized executions = 1',
 'G3-02 Stage 1 actual scientific executions = 2 / contract violated',
 'G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED',
 'G3-02 formal promoted candidate set = []',
 'G3-02 Stage 1 seed = 31210001..31210192 / consumed',
 'G3-02 Stage 2 seed = 31220001..31220288 / not consumed',
 'Stage 1 execution workflow = CLOSED / DISABLED',
 'Protected standard-root depth-10 holdout = SEALED / NOT GENERATED / NOT READ',
 '```','',
 'runner-local compression patternもunauthorized duplicate runの一致もformal positive claimへ用いない。branching / reply widthをbest move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。','',
 'G3-02 closureはG3-03以降を自動authorizeしない。次のscientific actionは、G3-02のimmutable `TECHNICAL-INVALID` closure、LGTGMIV family boundary、RAW-only identity、protected depth-10 firewallを維持した別のpost-G3-02 program reviewである。','',
 'Research Generation 3開始前にfreezeした`research-generation-3/PROGRAM_PLAN.md`はhistorical prospective planとして変更しない。'
 ]);
 s=once(s,/### 10\.12 現在状態[\s\S]*$/,section,"FUTURE 10.12");write(p,s);
}

{
 const p="doc/RESEARCH_INDEX.md";let s=read(p);
 const sec=block([
 '### 30. Research Generation 3 — G3-01 / LGTGMIV / G3-02 closure','',
 '**Program:** Bao Third-Generation Research Program / **Core:** `G3-01..G3-12`  ',
 '**状態:** **ACTIVE / G3-01 `TECHNICAL-INVALID` / LGTGMIV `FORMAL-ELIGIBLE-ALL` / G3-02 `EBRWS-STUDY1 = TECHNICAL-INVALID` / Stage 2 not executed**','',
 'G3-01 `LGTGMF-STUDY1`は`TECHNICAL-INVALID`、formal eligible families `[]`のままimmutable closure。独立prerequisite `LGTGMIV-STUDY1`は`CLOSED / FORMAL-ELIGIBLE-ALL`で、RAW-only depth-5 local geometryの5 familiesをformal eligibleとした。','',
 'G3-02 `EBRWS-STUDY1`は別authorization review後にprospectively開始。Stage 0は`STAGE0-PASS`。authorized Stage 1 run `33569323221`のrunner-local computationはglobal gate PASSとproduction / independent exact agreementを記録したが、canonical result artifactのrepository pushが失敗し回収不能となったためformal promotionしなかった。','',
 'Final Actions-history auditでは、workflow armingによるrun `33569382663`が同じStage 1を2回目もscientifically executeしていたことが判明した。prospective authorizationはexactly one executionであり、2回目は`INVALID-DO-NOT-USE`。このexecution-count violationもtechnical-invalid根拠として保存する。','',
 'Formal decision: **`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`**','',
 '```text',
 'authorized Stage 1 executions = 1',
 'actual Stage 1 scientific executions = 2 / contract violated',
 'formal promoted candidate set = []',
 'Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED',
 'Stage 2 seed = not consumed',
 'protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ',
 '```','',
 '**最初に読む:**','',
 '- [`effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md)',
 '- [`research-generation-3/CURRENT_STATUS.md`](research-generation-3/CURRENT_STATUS.md)','',
 '**詳細・正本:**','',
 '- [`effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md`](effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md)',
 '- [`effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`](effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json)',
 '- [`effective-branching-reply-width-structure/checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md`](effective-branching-reply-width-structure/checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md)',
 '- [`research-program-decisions/2026-09-02-g3-02-unintended-duplicate-execution-audit.md`](research-program-decisions/2026-09-02-g3-02-unintended-duplicate-execution-audit.md)','',
 '**Boundary:** both runner-local candidate summaries and the duplicate-run equality are non-formal. No same-evidence repair/further rerun. G3-03以降は別reviewまで自動開始しない。standard-root depth 10はsealed。'
 ]).trimEnd();
 s=once(s,/### 30\. Research Generation 3[\s\S]*?\n---\n\n## 将来研究/,sec+"\n\n---\n\n## 将来研究","INDEX item30");
 s=once(s,/^\*\*Research Generation 3 state:\*\*[^\n]*$/m,'**Research Generation 3 state:** G3-01 remains `TECHNICAL-INVALID`; LGTGMIV remains `FORMAL-ELIGIBLE-ALL`. G3-02 `EBRWS-STUDY1` is `CLOSED / TECHNICAL-INVALID` after canonical Stage 1 materialization failure and an unintended duplicate scientific execution violating its exactly-one-run authorization. Formal promoted candidate set `[]`, Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`, depth 10 sealed. Next action requires a separate post-G3-02 program review.',"INDEX future state");
 write(p,s);
}
console.log("EBRWS_DUPLICATE_EXECUTION_CENTRAL_AUDIT_MATERIALIZED");
