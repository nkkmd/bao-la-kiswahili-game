# BECT-STUDY1 — Current Status

更新日: 2026-09-02

```text
Study = BECT-STUDY1
Program position = Research Generation 3 / G3-05
Study status = CLOSED / TECHNICAL-INVALID
program authorization = G3-05-AUTHORIZED
baseline remote main = 127a9653933c623307c8423fddaf42166090f11b
research branch = research/g3-05-branch-expansion-compression-transition
prospective Study/prereg freeze = COMPLETE
Stage 0 v1 = BECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID
Stage 0 v2 = BECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS
Stage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31510001..31510240 / CONSUMED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
formal promoted candidate set = []
fresh scientific evidence generated = true
fresh scientific evidence read = true
no-rescue boundary = CROSSED / ACTIVE
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
main integration = NOT PERFORMED
```

## Formal scope

BECT-STUDY1は同一trajectory上のbounded RAW local geometryを時間方向に測定し、branch expansion / compression / persistence / reversal等のtransition structureをprospectively検証する独立研究です。static phase differenceとtemporal transitionを分離し、geometry transitionをrule/search/value/tactical/strategic transitionと同一視しません。

## Frozen measurement contract

```text
representation = RAW-ONLY
relative horizon = 5
validated transforms = []
eligible upstream = LGTGMIV F1,F2,F3,F4,F5
primary experimental unit = source trajectory
analysis root plies = 16..63 inclusive
Stage 1 target = 10 trajectories / 48 roots each
```

Frozen level endpointsはM1-M8。adjacent deltaはexact rational。event grammarはmagnitude thresholdを持たず、符号によるonset / persistence / reversal / stallを用います。

M5 denominator、Stage 1 coverage、longitudinal identity rulesはすべてfresh Stage 1 evidence前にprospectively一意化済みです。

## Stage 0 technical history

### v1 — TECHNICAL-INVALID

```text
workflow run = 33631597307
authorized executions = 1
actual executions = 1
fresh scientific seed access = false
```

Technical seed `31500001`が固定fixture pair 24->25より前に終局したためtechnical-invalid。v1はrerunしていません。

### v2 — STAGE0-PASS

```text
workflow run = 33632094597
artifact ID = 9847240252
artifact ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
technical root pair = 22 -> 23
deterministic technical core = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
result = STAGE0-PASS
```

Stage 0 v2でtrajectory replay、adjacent successor binding、overlapping-window semantics、time-index semantics、production/independent reconstruction・family・BECT level equality等をPASSしました。

## Stage 1 preauthorization preparation

Fresh-free preparationはすべてStage 1 seed access前に完了しました。

```text
identity firewall materialization = 33634116550 / PASS
identity firewall exact mirror = 33634259594 / PASS
identity core SHA-256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
static audit = 33635090198 / PASS
tooling smoke v2 = 33635443176 / PASS
source validation = 33635524477 / PASS
durable lease-path smoke = 33635710262 / PASS
scientific workflow executions before authorization = 0
```

G3-03 diagnostic scientific fieldsおよびG3-04 scientific outcome fieldsはidentity firewallに保持していません。

## Stage 1 authorization and execution

Authorization baseline:

```text
authorized scientific content HEAD = 5ba3706193a06902650b82f1232d19bb2cee2c1e
authorization commit = 5cceaeeece7c6d7949815a47b7ef918bbae72e59
authorization nonce = BECT-S1-AUTH-2026-09-02-V1-01
max scientific executions = 1
trigger commit = 75b29fd33215bd98652613975c5b0c900f065b9d
```

Single authorized execution:

```text
workflow run = 33636606641
lease commit = bf1f8a5940bfb87f8c92d482728aa89ce398b749
authorized scientific executions = 1
actual scientific executions = 1
fresh access started = true
seed block consumed = true
no-rescue boundary crossed = true
```

## Stage 1 formal disposition

**`TECHNICAL-INVALID`**

Runnerはfirst selected trajectoryのanalysis rootsを順次測定し、artifact telemetryにはply 16..40の25 rootsが保存されています。この25 rootsではproduction / independent scientific equalityとfrozen resource gateはいずれもPASSしました。

その後のbounded enumerationで次のtechnical errorが発生しました。

```text
relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529
```

Stage 1 runnerはprospectively fail-closedし、canonical resultを`TECHNICAL-INVALID`として書き出して終了しました。Stage 1 development summaryおよびformal promotion判定は成立していません。

## Durable Stage 1 artifact

```text
artifact ID = 9849245665
artifact name = bect-stage1-development-result-33636606641
artifact size = 4081 bytes
artifact ZIP SHA-256 = 0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc
scientific-result.json SHA-256 = a21ad5449dfa090e4ff2ed87ebc64a48b5fb0755eabd0dcfe375358bde7d0b96
telemetry.json SHA-256 = 0608c9f035a19c4908ba02d0b462e2e0f4ca08226df3ec1062d2086dbca7f2b4
execution-summary.json SHA-256 = b54f441cadac0252dc15deac07c90974bc28e18d26d2dd3934b3fb6707fb352f
```

Exact-byte mirror:

```text
mirror run = 33637372364
mirror commit = ac2bd2ca101a9002c69131c2c39ebbfbb98368a1
scientific recomputation = false
```

## No-rescue closure

Fresh Stage 1 generation/read後にtechnical errorが発生したため、同一Stage 1 evidenceをimplementation修正後に再実行することはprospective no-rescue ruleに反します。

したがって以下を禁止します。

- Stage 1 seed `31510001..31510240`のsame-evidence rerun
- relay-limit handlingを変更して同一Stage 1を救済すること
- seed extension / root replacement / favorable subset selection
- endpoint / event grammar / horizon / representation / resource ceiling / promotion gateの事後変更
- partial telemetryからformal candidateをpromotionすること
- Stage 2を実行すること

Formal promoted candidate setは **`[]`** です。

## Stage 2 and protected evidence

Stage 2 authorization prerequisiteであるvalid Stage 1 completion + nonempty frozen promoted candidate setを満たしません。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed 31520001..31520384 = NOT CONSUMED
```

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## Interpretation boundary

今回formalに主張できるのは、BECT Stage 1がfrozen bounded enumeration contractの下でrelay-limit technical errorにより完遂できず、formal transition candidatesを評価・promotionできなかったことです。

Partial telemetryに含まれる局所値や途中root系列を、branch expansion/compression transitionの存在、phase差、search difficulty、戦略的意味、人間難度などのformal evidenceとして再利用しません。

## Next action

BECT-STUDY1は **`CLOSED / TECHNICAL-INVALID`** として閉じます。Stage 2はauthorizeしません。次に必要なのはfinal report / reproducibility / research-program index類をこのimmutable closureへ同期することです。
