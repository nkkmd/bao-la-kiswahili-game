# BECT-STUDY1 — Current Status

更新日: 2026-09-02

```text
Study = BECT-STUDY1
Program position = Research Generation 3 / G3-05
program authorization = G3-05-AUTHORIZED
baseline remote main = 127a9653933c623307c8423fddaf42166090f11b
research branch = research/g3-05-branch-expansion-compression-transition
prospective Study/prereg freeze = COMPLETE
Stage 0 v1 = BECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID
Stage 0 v2 = BECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS
Stage 1 preparation = BECT-STAGE1-AUTHORIZATION-ELIGIBLE
Stage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / NOT-YET-AUTHORIZED / NOT-EXECUTED
Stage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31510001..31510240 / NOT CONSUMED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
fresh scientific evidence generated = false
fresh scientific evidence read = false
no-rescue boundary = NOT CROSSED
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
main integration = NOT PERFORMED
```

## Formal scope

BECT-STUDY1は同一trajectory上のbounded local geometryを時間方向に測定するprospective independent Studyです。static phase differenceとtemporal transitionを分離し、geometry transitionをrule/search/value/tactical/strategic transitionと同一視しません。

## Frozen measurement contract

```text
representation = RAW-ONLY
relative horizon = 5
validated transforms = []
eligible upstream = LGTGMIV F1,F2,F3,F4,F5
primary experimental unit = source trajectory
analysis root plies = 16..63 inclusive
```

Frozen level endpointsはM1-M8。adjacent deltaはexact rational。Stage 1 event grammarはmagnitude thresholdを持たず、符号によるonset / persistence / reversal / stallを用います。

M5 denominatorはfresh/fixture evidence前のprospective clarificationにより、`sum uniqueTransitionCount[d], d=0..4`へ一意化済みです。

Stage 1 coverageとlongitudinal identityは`prereg/STUDY_1_SPEC_CLARIFICATION_2.json`でfresh evidence前に一意化済みです。candidate coverageは10 trajectoryすべての48 analysis rootで当該metricがdefinedであることを要求します。

## Stage 0 technical history

### v1 — TECHNICAL-INVALID

```text
Stage ID = BECT-S0-TECHNICAL-2026-09-02-v1
workflow run = 33631597307
authorized executions = 1
actual executions = 1
result = TECHNICAL-INVALID
fresh scientific seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

原因はtechnical seed `31500001` がply 26前に終局し、v1 runnerが固定 technical root pair `24 -> 25` の存在を仮定していたことです。v1はrerunしていません。

### v2 — STAGE0-PASS

```text
Stage ID = BECT-S0-TECHNICAL-2026-09-02-v2
workflow run = 33632094597
workflow head = 9a2c4549f748085ec11b8f30263e97459b3caff4
authorized executions = 1
actual executions = 1
artifact ID = 9847240252
artifact ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
technical trajectory observed length = 24
technical measured root plies = 22 -> 23
deterministic technical core = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
result = STAGE0-PASS
```

Stage 0 v2で、trajectory replay、adjacent successor binding、overlapping-window semantics、repeated RAW identityのtime-index semantics、production/independent reconstruction・family・BECT level equality等をPASSしました。

## Stage 1 preauthorization preparation

Post-Stage-0 review decision:

**`BECT-STAGE1-PREPARATION-AUTHORIZED / SCIENTIFIC-EXECUTION-NOT-YET-AUTHORIZED`**

Identity-only firewall:

```text
materialization run = 33634116550
mirror run = 33634259594
identity core SHA-256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
RAW root identities = 124
trajectory identities = 124
opening-prefix identities = 67
scientific outcome fields retained = false
```

Frozen Stage 1 implementation blobs:

```text
production = 32995ed7e666b7cff7a6bb43946a30cdc86a7668
independent = fcc150bdfcfbb1727ea6e0fdd4f336d1ae36e1e6
runner = 127cb10ea23d18f0a32c2adc2d8c499de4c19b04
scientific workflow = dcb39d07420ad81db9e10d0ba08a10a9a3cb7cb7
```

Fresh-free validation:

```text
static audit = 33635090198 / PASS
tooling smoke v1 = 33635334088 / static-assertion failure after fail-closed gate PASS / no seed access
tooling smoke v2 = 33635443176 / PASS
source validation = 33635524477 / PASS
durable lease-path smoke = 33635710262 / PASS
lease-path technical marker commit = a588dbbaf01d1c5a5d5191ef3f34b9e054ab8037
BECT Stage 1 Development scientific workflow executions before authorization = 0
```

Unarmed scientific runnerはauthorization artifact欠如でfresh access前にfail-closedすることを確認済みです。actual contents-write / branch-push経路もtechnical lease markerで検証しました。

## Upstream boundary

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID / promoted=[]
SFCDF-STUDY1 = CLOSED / FORMAL-COMPLETE
SFCDF C1 = CONFIRMED / MTAJI-GREATER
SFCDF C6 = CONFIRMED / NAMUA-GREATER
```

G3-03 diagnosticはscientific input禁止。G3-04 C1/C6はcontext-onlyです。

## Evidence firewall

Stage 1 authorization eligibility到達時点でも、BECT fresh scientific evidenceは未生成・未readです。Stage 1/2 seed blockは未消費で、standard initial RAW-root complete exact depth-10 holdoutも`SEALED / NOT GENERATED / NOT READ`を維持しています。

## Next action

Preauthorization tooling checkpointは`BECT-STAGE1-AUTHORIZATION-ELIGIBLE`です。次の唯一のscientific transitionは、exact preauthorization branch HEADとsource blobsをbindingした明示的な`STAGE1-AUTHORIZED / EXACTLY ONE EXECUTION` artifactの作成です。その後にのみ、単一triggerによるStage 1 fresh scientific executionが可能です。
