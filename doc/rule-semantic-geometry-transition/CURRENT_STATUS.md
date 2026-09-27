# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **STAGE 0 v2 PASS / STAGE 1 v1 TECHNICAL-INVALID / NO-RERUN / STAGE 1 v2 PREPARATION REQUIRED**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
Authorization review = G4-08-AUTHORIZATION-REVIEW-2026-09-27-V1
```

## Current boundary

```text
preregistration = AUTHORIZED
Stage 0 v1 = TECHNICAL-INVALID / NO-RERUN
Stage 0 v2 = STAGE0-PASS / COMPLETE
Stage 1 v1 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v1 seed block = 40813001..40813512 / CONSERVATIVELY CONSUMED / NO REUSE
Stage 1 v2 = NOT YET PREREGISTERED / NOT AUTHORIZED
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED / NOT ACCESSED
public AI change = NOT AUTHORIZED / NONE
main integration = NOT AUTHORIZED
```

## Stage 0 v2 canonical result

```text
Stage ID = BRSGT-S0-TECHNICAL-2026-09-27-v2
workflow run = 36295553800 / attempt 1
job = 108553613736
source SHA = dbd15518791515a08570f9e7065c1b02cb7ec254
audited source SHA = e0c7a359af5d37875cb914eae19a142d4c86f427
artifact ID = 10923364588
artifact ZIP SHA-256 = fb19763c2f2bcd29ddf2d84a776ad28cf787e8727ee1857e9a0e44f680535177
stage disposition = STAGE0-PASS
fixture count = 4
all represented seed totals = 64
geometry measurements = 7
fresh scientific seed reads = 0
Stage 2 candidate namespace reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Coverage:

```text
E1 CAPTURE = covered
E2 NYUMBA USE-vs-STOP = covered
E3 RESERVE-DECREMENT-NONTRANSITION = covered
E4 NAMUA-TO-MTAJI = covered
production / independent unit selection exact = true
production / independent geometry endpoint exact = true
exact arithmetic agreement = true
```

正本: [`results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json`](results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json)

## Stage 1 v1 frozen design

Stage ID:

`BRSGT-S1-DEVELOPMENT-2026-09-27-v1`

```text
evidence class = FRESH-DEVELOPMENT
seed block = 40813001..40813512 / 512 slots
source policies = 2
source max ply = 72
event families = E1..E4
metrics = M1..M6
relative depth = 5
representation = RAW-ONLY
formal inference = false
effect values retained = false
effect signs retained = false
Stage 2 seed access = false
G4-10 depth-11 access = false
public AI change = false
```

## Stage 1 pre-fresh audits

Hardened audit:

```text
workflow run = 36298236747 / success
audit head = bc39087699d20761dfa58ce904e6b9534d2fbcd2
disposition = STAGE1-PRE-FRESH-STATIC-AUDIT-PASS
audit scope version = 2
fresh scientific seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

Documentation同期後のfinal-freeze audit:

```text
workflow run = 36298395328 / success
audit head = 4f307a5502abc1b5748c4080cdcbe7ef7d53dc71
disposition = STAGE1-PRE-FRESH-STATIC-AUDIT-PASS
scientific authorization present at audit = false
scientific trigger present at audit = false
fresh scientific seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

このHEADをStage 1 v1 one-shot authorizationのsource bindingとした。

## Stage 1 v1 authorization and execution

Authorization:

```text
decision = AUTHORIZED
authorization type = FRESH-DEVELOPMENT-ONE-SHOT
max scientific executions = 1
audited source SHA = 4f307a5502abc1b5748c4080cdcbe7ef7d53dc71
allowed post-audit changes = STAGE_1_AUTHORIZATION.json + STAGE_1_TRIGGER.json only
formal inference = false
effect value/sign retention = false
Stage 2 seed access = false
G4-10 depth-11 access = false
public AI change = false
main integration = false
```

Execution:

```text
workflow run = 36298620437 / attempt 1
job = 108561989069
execution HEAD = eb8220af5e1c17bb89f4bde28b6025e7b10803d1
binding = STAGE1-BINDING-PASS
stage disposition = STAGE1-TECHNICAL-INVALID
same-version rerun = FORBIDDEN
artifact ID = 10924827904
artifact ZIP SHA-256 = f95452e80b6e70bb6801c59c9767dc0231ae1522415dd12e9f9259e1c31b121d
```

## Stage 1 v1 technical failure

Actions logで保存されたterminal error:

```text
ReferenceError: freshScientificSeedReads is not defined
at tools/experiments/run-brsgt-stage1-development.js:486
```

runnerのcatch blockは、本来の技術例外を`STAGE_1_FAILURE.json`へ保存する処理で、存在しない`freshScientificSeedReads`を参照した。実際のcounter変数は`freshSeedReads`である。

このため:

1. catch handler自身が失敗した。
2. 先行して発生した本来のtechnical errorはmaskされ、保存されなかった。
3. `STAGE_1_FAILURE.json`は生成されなかった。
4. exact fresh seed read countは復元不能。
5. artifactに残ったのは`STAGE_1_EXECUTION_CONTEXT.json`と`SHA256SUMS.txt`のみ。
6. Stage 1 scientific resultは存在しない。

実行前contextではfresh readは0だったが、scientific runnerはその後実行された。exact read countが不明である以上、安全側に倒し、**v1 block `40813001..40813512` 全体をconsumed扱いとして永久に再利用しない。**

正本:

- [`results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json`](results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json)
- [`checkpoints/2026-09-27-stage-1-v1-technical-invalid.md`](checkpoints/2026-09-27-stage-1-v1-technical-invalid.md)

## Scientific interpretation

```text
Stage 1 v1 scientific outcome = NONE / TECHNICAL-INVALID
formal inference performed = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
main integration authorized = false
```

v1 failureをpositive/negative evidenceとして解釈しない。

## Protected boundaries

- G3-06 repair / reopen / rerun禁止
- G3-06 scientific namespace再利用禁止
- Stage 0 v1 rerun禁止
- Stage 1 v1 rerun禁止
- Stage 1 v1 seed block `40813001..40813512`再利用禁止
- G4-02 no-decisionのpositive / negative evidence化禁止
- G4-07 reversalのcausal mechanism化禁止
- Stage 2 seed access禁止
- G4-10 depth-11 access禁止
- public AI変更禁止
- main integration禁止

## Stage 1 v2 requirements

v2を開始する場合は、v1のrepair/rerunではなく新versionとして扱う。

必須条件:

1. `BRSGT-S1-DEVELOPMENT-2026-09-27-v2`等の新stage identity。
2. v1と重ならない新しいfresh seed block。
3. failure handlerを`freshSeedReads`へ修正。
4. fresh access前にcatch/failure-artifact pathの明示self-testを実行。
5. v2専用spec / runner / binding / workflowを用意し、v1 artifactを上書きしない。
6. new pre-fresh static auditをPASS。
7. audit HEADへnew source binding。
8. new one-shot authorization + trigger。
9. Stage 2 / G4-10 / public AI / mainは引き続き閉じる。

候補seed block `40814001..40814512` はdefault branch code searchで衝突が見つかっていないが、**まだv2 scientific accessとして認可していない**。

## Next gate

Stage 1 v2のpreregistration/technical preparationを行う。まずv1 failure-handler defectをversion-isolatedに修正し、catch-path self-testを含むpre-fresh static auditを設計する。fresh v2 seedへのアクセスは、そのauditと別authorizationが完了するまで行わない。
