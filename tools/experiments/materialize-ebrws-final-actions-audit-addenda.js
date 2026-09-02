#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const ROOT=path.resolve(__dirname,"../..");
function appendOnce(p,marker,text){
  const f=path.join(ROOT,p),s=fs.readFileSync(f,"utf8");
  assert(!s.includes(marker),`${p}: audit addendum already present`);
  fs.writeFileSync(f,s.replace(/\s*$/,"\n\n")+text.trim()+"\n");
}

appendOnce(
  "doc/effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md",
  "## 15. Final Actions-history audit — unintended duplicate execution",
  `## 15. Final Actions-history audit — unintended duplicate execution

Closure後のGitHub Actions履歴監査で、Stage 1 scientific runnerが合計2回実行されていたことを確認した。prospective authorizationはexactly one executionだったため、これは追加のtechnical-integrity violationである。

- authorized run: \`33569323221\` / job \`100059596453\`
- unintended duplicate run: \`33569382663\` / job \`100060967285\`

run #2をtriggerしたworkflow-arming commitはrun #1のscientific outcomeが判明する前に投入されていたため、結果を見て意図的にpositive resultを救済した操作ではない。一方、non-cancelling concurrencyによってrun #2の実計算はrun #1のscientific step完了後、すなわちno-rescue boundary成立後に開始された。そのためrun #2はfrozen exactly-one-execution authorizationに違反し、\`INVALID-DO-NOT-USE\`とする。

run #2はrunner-localでrun #1と同一のscientific core / candidate-set / scientific-result file hashを生成したが、この一致をformal replication、confirmation、repair、rescueへ用いない。run #2のlocal result commit \`24c57398\`もpush failure後に回収不能である。

このfinal auditによってformal dispositionは変更しない。むしろtechnical-invalid根拠を追加する。

\`\`\`text
EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID
authorized Stage 1 executions = 1
actual Stage 1 scientific executions = 2
execution-count contract = violated
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
\`\`\`

Stage 1 execution workflowはclosure後にdisabledとし、第三の実行は許可しない。protected depth-10 holdoutは両runとも生成・readしておらず、\`SEALED / NOT GENERATED / NOT READ\`のままである。`
);

appendOnce(
  "doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md",
  "## 最終Actions履歴監査",
  `## 最終Actions履歴監査

最終監査で、workflow armingによりStage 1が意図せず2回目も実行されていたことを確認した。authorizationはexactly one executionであったため、2回目（run \`33569382663\`）は\`INVALID-DO-NOT-USE\`であり、scientific replicationやpositive resultの補強には使用しない。

この追加事実はformal decisionを変更しない。\`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID\`、formal promoted candidate set \`[]\`、Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`のままである。`
);

appendOnce(
  "doc/effective-branching-reply-width-structure/README.md",
  "## Final Actions-history audit",
  `## Final Actions-history audit

最終Actions監査でStage 1 scientific executionがauthorized 1回に対してactual 2回だったことを確認した。2回目のrun \`33569382663\`はworkflow armingにより意図せずqueueされ、\`UNAUTHORIZED-DUPLICATE-INVALID\`として全scientific inferenceから除外する。

この事実はStudyの\`CLOSED / TECHNICAL-INVALID\` closureを変更せず、technical-invalid根拠を追加する。Stage 1 execution workflowはdisabled、Stage 2は未実行、depth-10 holdoutはsealedのままである。`
);

appendOnce(
  "doc/effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md",
  "## Final Actions-history audit — duplicate execution",
  `## Final Actions-history audit — duplicate execution

Final workflow audit:

\`\`\`text
authorized executions = 1
actual scientific executions = 2
run 33569323221 = authorized / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
\`\`\`

run #2 locally produced the same scientific core \`4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e\`, candidate set hash \`4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6\`, and scientific-result file hash \`1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a\`. These duplicate outputs are excluded from scientific inference.

Audit records:

- \`checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md\`
- \`../research-generation-3/checkpoints/2026-09-02-g3-02-unintended-duplicate-execution-audit.md\`
- \`../research-program-decisions/2026-09-02-g3-02-unintended-duplicate-execution-audit.md\`

Stage 1 execution workflow is disabled after closure. No third run is authorized. Classical telemetry variation between the two invalid/local runs is not part of the scientific core. Protected depth-10 access remained false. `
);

appendOnce(
  "doc/research-generation-3/README.md",
  "## G3-02 final Actions-history audit",
  `## G3-02 final Actions-history audit

Final Actions-history audit found that G3-02 Stage 1 was scientifically executed twice despite an exactly-one-execution authorization. The second run \`33569382663\` was unintentionally queued by workflow arming before the first outcome was known, but executed after the no-rescue boundary and is therefore \`INVALID-DO-NOT-USE\`.

This does not change G3-02's existing \`CLOSED / TECHNICAL-INVALID\` decision; it adds a second technical-integrity failure. Formal promoted candidate set remains \`[]\`, Stage 2 remains unexecuted, and the protected depth-10 holdout remains sealed. `
);

appendOnce(
  "doc/research-generation-3/CURRENT_STATUS.md",
  "## Final Actions-history audit — G3-02 execution count",
  `## Final Actions-history audit — G3-02 execution count

Final audit established:

\`\`\`text
G3-02 Stage 1 authorized scientific executions = 1
G3-02 Stage 1 actual scientific executions = 2
run 33569323221 = authorized one-shot / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
execution-count contract = violated
Stage 1 execution workflow = CLOSED / DISABLED
\`\`\`

The duplicate run is excluded from scientific inference and cannot be used as replication or rescue. G3-02 remains \`CLOSED / TECHNICAL-INVALID\`, formal promoted candidate set \`[]\`, Stage 2 \`NOT-AUTHORIZED-NOT-EXECUTED\`. `
);

console.log("EBRWS_FINAL_ACTIONS_AUDIT_ADDENDA_MATERIALIZED");
