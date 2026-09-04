# EBRWS-STUDY1 — 再現性索引

## Study identity（研究識別情報）

- Study ID: `EBRWS-STUDY1`
- agenda: Research Generation 3 `G3-02`
- final disposition: `CLOSED / TECHNICAL-INVALID`
- baseline remote main: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- research branch: `research/g3-02-effective-branching-reply-width-structure`
- authoritative state identityはRAW-onlyである
- validated transform set: `[]`
- relative local horizonはdepth 5である

## canonical protocol記録

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `DECISION_REGISTER.md`
- `CURRENT_STATUS.md`

scientific evidence前に固定したprotocol blobは`cc367fe5315d1553f75cf3b95e629184070f05ac`である。
scientific evidence前に固定したpreregistration blobは`bdf7d35bcf8554e5a29bd5f2e92b27bb7edc8498`である。

## upstream instrument dependency （概要）

formal eligible familyは次に限る。

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

primary endpointはF1 + F5を使用する。F2〜F4はsecondary contextに限る。

## Stage 0の記録

- ID: `EBRWS-S0-TECHNICAL-2026-09-01-v1`
- evidenceはtechnical fixtureに限る
- disposition: `STAGE0-PASS`
- production / independent実装によるscientific core: `ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`
- fresh seedを消費していない
- protected depth-10へアクセスしていない

Records:

- `results/stage-0/technical-validation.json`
- `checkpoints/2026-09-01-stage-0-technical-pass.md`

## Stage 1のpre-execution

- ID: `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`
- seed block: `31210001..31210192`
- target rootは12 Namua + 12 Mtajiである
- evidence class: `FRESH-DEVELOPMENT`
- authorization: `authorizations/2026-09-01-stage-1-development-authorization.md`
- tooling smoke run: `33525232642 / success`
- tooling job: `99914259137`
- pre-execution checkpoint: `checkpoints/2026-09-02-stage-1-tooling-smoke-pass-and-preexecution.md`

tooling smokeはfresh scientific seed / root accessおよびprotected depth-10 accessがないことを報告した。

## authorizeされたStage 1 one-shot execution

GitHub Actions:

- run: `33569323221`
- job: `100059596453`
- execution step: success
- repository materialization stepはfailureだった

固定済みrunnerはmaterialization failure前に次を報告した。

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
productionStageScientificCoreSha256 = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
independentStageScientificCoreSha256 = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

runner内だけに残った診断用candidateの要約:

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` 9/12

これらはformal promoted candidateではない。

## Stage 1 materialization incident （Stageの記録）

runnerは3件のcanonical fileを生成し、short SHA `709bc393`としてlocal commitしたが、execution中にremote branchが進んだためpushはnon-fast-forwardとしてrejectされた。ephemeral local commitをGitHubから復元することはできない。

no-rescue boundary後に2回目のStage 1 executionはauthorizeされていなかった。しかし後のfinal Actions-history auditで、意図しないunauthorized duplicate executionを発見した。これは`INVALID-DO-NOT-USE`であり、欠落したcanonical Stage 1 evidenceをregenerate、replace、repairできない。したがってfull canonical Stage 1 result / telemetry fileをvalid evidenceとして再生成しない。

Authoritative closure records:

- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md`

Formal Stage 1 dispositionは`TECHNICAL-INVALID`である。
formal promoted candidate setは`[]`である。

## Stage 2の状態

- ID: `EBRWS-S2-FORMAL-2026-09-01-v1`
- seed block: `31220001..31220288`
- target rootは18 Namua + 18 Mtajiである
- evidence class: `FRESH-FORMAL-HELDOUT`
- disposition: `NOT-AUTHORIZED-NOT-EXECUTED`
- seed consumed: false

prerequisiteとなるimmutable Stage 1 canonical artifactをdurable materializeできなかったため、Stage 2はrunner-local diagnostic candidateを使用できない。

## root policy （概要）

- deterministic Mulberry32 source trajectoryを用いる
- canonical legal-move ordering
- Namua rootはexact ply 24とする
- Mtaji rootはply 44以降で最初のnonterminal mtaji stateとする
- 固定済みidentity firewall exclusion後、phaseごとにsource seed順のfirst-Nを選ぶ
- max source ply 240
- RAW-root deduplication

## firewall identity （証拠分離規則）

exact collision exclusionは次を対象に定義した。

- G3-01のroot / trajectory / first-16 prefix
- LGTGMIV Stage 1のroot / trajectory / first-16 prefix
- LGTGMIV Stage 2のroot / trajectory / first-16 prefix

overlap exclusionにはidentity情報だけを用い、upstream geometry outcomeをG3-02 fresh evidenceとして再利用していない。

## primary derived endpointのreproducibility

production / independent implementationは次を別々に導出する。

- `EB_tree(0..4)` exact rationals
- `treeWidthShapeClass`
- `replyDirection(0..4)`
- `replyWidthShapeClass`
- phase-level class counts
- candidate set

共有のG3-02 derived-metric、class、promotion、canonical-hash helperは認めなかった。

## protected evidence （証拠の状態）

standard initial RAW-root complete exact depth-10 holdoutの状態:

`SEALED / NOT GENERATED / NOT READ`

## 最終Actions-history audit — duplicate execution

Final workflow audit:

```text
authorized executions = 1
actual scientific executions = 2
run 33569323221 = authorized / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
```

run #2はlocalで同じscientific core `4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e`、candidate set hash `4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6`、scientific-result file hash `1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a`を生成した。これらのduplicate outputはscientific inferenceから除外する。

Audit records:

- `checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md`
- `../research-generation-3/checkpoints/2026-09-02-g3-02-unintended-duplicate-execution-audit.md`
- `../research-program-decisions/2026-09-02-g3-02-unintended-duplicate-execution-audit.md`

closure後、Stage 1 execution workflowはdisabledである。3回目のrunはauthorizeされていない。2件のinvalid / local run間のclassical telemetry variationはscientific coreに含まれない。protected depth-10 accessはfalseのままである。

## repositoryの`main` integration

- integration PR: #92
- merge methodはnormal merge commitである
- pre-merge research HEAD: `0c0fc7a28f5ffc65853265d58a041863f520cdb8`
- pre-merge main: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- merge commit: `b41c7eda74dd1002e98e4d82714fadb987d1f1e1`
- integration後のscientific dispositionは`CLOSED / TECHNICAL-INVALID`である
- Stage 2 after integration: `NOT-AUTHORIZED-NOT-EXECUTED`
- protected depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`
