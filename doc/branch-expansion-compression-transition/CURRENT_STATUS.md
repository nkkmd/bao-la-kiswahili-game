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
Stage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31510001..31510240 / NOT CONSUMED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
fresh scientific evidence generated = false
fresh scientific evidence read = false
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

v1 failure後、scientific contractを変更せず、technical fixture root selectionだけをversioned refreezeしました。v2は同じtechnical seedのreplayから、geometry/endpointを参照せず、最後の連続nonterminal post-move root pairを選びます。

```text
Stage ID = BECT-S0-TECHNICAL-2026-09-02-v2
workflow run = 33632094597
workflow head = 9a2c4549f748085ec11b8f30263e97459b3caff4
authorized executions = 1
actual executions = 1
artifact ID = 9847240252
artifact ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
result file SHA-256 = 8e3cb7631fcbdc3acee486f5b1495987b81624cea65746879824eac7328d25fe
provenance file SHA-256 = 3f533544209763106d83548844505a482ee7dc9184813d79e1d88db195559453
technical trajectory observed length = 24
technical measured root plies = 22 -> 23
deterministic technical core = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
result = STAGE0-PASS
```

Stage 0 v2で、synthetic level arithmetic、transition grammar、no-change / expansion / compression / persistence / reversal / stall / reopening / extinction controls、cross-phase exclusion、trajectory replay、adjacent successor binding、overlapping-window semantics、repeated RAW identityのtime-index semantics、production/independent reconstruction・family・BECT level equality、implementation separationをPASSしました。

scientific exactness gateはcanonical scientific contentのSHA-256 exact equalityです。prototype-sensitive runtime equalityはnegative controlに限定されています。

## Upstream boundary

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID / promoted=[]
SFCDF-STUDY1 = CLOSED / FORMAL-COMPLETE
SFCDF C1 = CONFIRMED / MTAJI-GREATER
SFCDF C6 = CONFIRMED / NAMUA-GREATER
```

G3-03 diagnosticはscientific input禁止。G3-04 C1/C6はcontext-onlyです。

## Evidence firewall

Stage 0完了時点でも、BECT fresh scientific evidenceは未生成・未readです。Stage 1/2 seed blockは未消費で、standard initial RAW-root complete exact depth-10 holdoutも`SEALED / NOT GENERATED / NOT READ`を維持しています。

## Next action

Stage 0 PASSはStage 1を自動authorizeしません。次はseparate post-Stage-0 Stage 1 authorization reviewと、fresh seedへ触れないStage 1 technical preparation / identity firewall / control-plane validationです。Stage 1 fresh seed consumptionとscientific executionは、その別reviewと明示的authorization artifactの成立後にのみ可能です。
