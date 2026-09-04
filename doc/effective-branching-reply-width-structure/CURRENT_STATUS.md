# EBRWS-STUDY1 — 現在の状態

Updated: 2026-09-02

```text
Program = Research Generation 3
Agenda position = G3-02
Study ID = EBRWS-STUDY1
Study status = CLOSED / TECHNICAL-INVALID
Research workflow = COMPLETE / MAIN INTEGRATED
Main integration = COMPLETE / PR #92 / merge b41c7eda74dd1002e98e4d82714fadb987d1f1e1
Authorization review = AUTHORIZED
Study protocol = FROZEN / unchanged after fresh evidence
Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
Stage 1 = EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / TECHNICAL-INVALID
Stage 1 authorized execution count = 1
Stage 1 actual scientific execution count = 2 / execution-count contract violated
Stage 2 = EBRWS-S2-FORMAL-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Formal promoted candidate set = []
Stage 1 seed consumed = 31210001..31210192
Stage 2 seed consumed = false
No-rescue boundary = CROSSED / ACTIVE
Stage 1 execution workflow = CLOSED / DISABLED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Authoritative identity = RAW-only
Validated transform set = []
Research branch = research/g3-02-effective-branching-reply-width-structure
Study baseline remote main = ca6a1e4a9b41d79d873fa71385972e402ffa5197
```

## upstreamのimmutable state

- Research Generation 2 = CLOSED
- G3-01 `LGTGMF-STUDY1` = `CLOSED / TECHNICAL-INVALID`
- G3-01 formal eligible familyは`[]`である
- G3-01 Stage 2 = `NOT-AUTHORIZED-NOT-EXECUTED`
- `LGTGMIV-STUDY1` = `CLOSED / FORMAL-ELIGIBLE-ALL`
- LGTGMIV eligible familyはexactにF1〜F5である

G3-02はG3-01を変更またはrescueせず、LGTGMIVを再実行または再判定しない。

## Stage 0の結果

Formal disposition:

`STAGE0-PASS`

production / independent実装によるStage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Stage 0はsynthetic primitive fixtureだけを使用し、fresh scientific seedを消費していない。

## Stage 1の固定済みauthorization

Authorized fresh block:

```text
seed = 31210001..31210192
target = 12 Namua + 12 Mtaji
relative depth = 5
evidence class = FRESH-DEVELOPMENT
authorized scientific executions = exactly 1
```

## authorizeされたexecution — run 33569323221

GitHub Actions run `33569323221`、job `100059596453`は固定済みscientific runnerを完了した。runner-local computationは次を報告した。

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
production / independent stage scientific core =
4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 =
4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
```

Runner-local diagnostic candidates:

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12

これらは**diagnostic provenanceに限られ**、formal promoted candidateではない。

scientific file生成後、`scientific-result.json`、`telemetry.json`、`execution-summary.json`を含むlocal commit `709bc393`を作成した。execution中にremote branchが進んだため、pushはnon-fast-forwardとしてrejectされた。runner teardown後、このephemeral commitをGitHubから復元することはできない。

Logged commitments:

```text
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

固定済みprotocolはStage 2 authorization前にimmutable promoted-candidate artifactとtechnical-integrity violationがないことを要求するため、このcanonical materialization failureだけでfail-closed handlingが必要となる。

## 意図しないduplicate execution — run 33569382663

final Actions-history auditで2回目のStage 1 scientific executionを発見した。

- run `33569382663`
- job `100060967285`
- formal status `UNAUTHORIZED-DUPLICATE-INVALID`

最初のauthorized runが進行中、monitoringに最初のtrigger runがまだ表示されなかったため、technical workflow-arming commitがStage 1 workflow自身のfile pathをpush triggerへ追加した。これにより最初のscientific outcome判明前にrun #2がqueueへ入った。workflowがnon-cancelling concurrency groupを使用していたため、実際のcomputationはrun #1がscientific stepを完了し、no-rescue boundaryを越えた後に開始された。

したがってrun #2は、固定済みexactly-one-execution authorizationに違反した。有効なreplication、repair、confirmation、rescueではなく、scientific inferenceから除外する。

run #2はlocalでは同じscientific-result commitmentを再現した。

```text
stage scientific core = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = 6f9c5323ff5cf95b9261a8b90dcfb2385702ca53329739cb87267a71e92f9da4
```

local result commit `24c57398`もnon-fast-forwardとしてrejectされ、GitHubから復元できない。

duplicate outputのformal useは`INVALID-DO-NOT-USE`である。

## formal technical-invalid closure （最終状態）

最初のfresh evidence generation / readでno-rescue boundaryを越えた。authorizeされた、または意図的なsame-evidence repair rerunは許可も実施もしていない。

上記の意図しないduplicate execution自体が追加のtechnical-integrity violationであり、有効なrepair pathではない。

formal Stage 1 / Study dispositionは次のとおりである。

`TECHNICAL-INVALID`

Reasons include both:

1. authorized executionで発生したcanonical Stage 1 result materialization failure
2. 意図しないduplicate runによるexactly-one-execution contract違反

formal promoted candidate setは次のとおりである。

`[]`

Stage 1 execution workflowはdisabledである。3回目のexecutionはauthorizeされていない。

## Stage 2の状態

このStudy closureではStage 2を恒久的に未実行とする。

`NOT-AUTHORIZED-NOT-EXECUTED`

いずれのrunner-local candidate summaryもStage 2をauthorizeしない。Stage 2 seed `31220001..31220288`は未消費のままである。

## protected evidence （証拠の状態）

standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

`SEALED / NOT GENERATED / NOT READ`

どちらのStage 1 executionもgenerateまたはinspectしておらず、G2-12をdepth-10 truthとして使用していない。

## canonical closure記録

- `STUDY_1_PROTOCOL.md` — immutable prospective protocol
- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json` — authoritative machine-readable disposition and execution audit
- `checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md` — first incident / fail-closed rationale
- `checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md` — execution-count violation
- `DECISION_REGISTER.md` — formal decisions
- `STUDY_1_FINAL_REPORT.md` — integrated scientific/technical closure

same-evidence repair、追加rerun、threshold change、endpoint change、seed extension、favorable subgroup rescueはauthorizeされていない。

## 研究完了とintegrationの状態

G3-02の研究作業はresearch branch上で完了している。

```text
research workflow = COMPLETE
research branch = research/g3-02-effective-branching-reply-width-structure
main integration = COMPLETE
integration PR = #92
merge commit = b41c7eda74dd1002e98e4d82714fadb987d1f1e1
```

明示的な統合指示に基づき、PR #92を通常mergeして`main`統合を完了した。scientific closureとnext-program authorization boundaryは変更しない。
