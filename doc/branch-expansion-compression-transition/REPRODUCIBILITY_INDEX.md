# BECT-STUDY1 — Reproducibility Index

更新日: 2026-09-02

## Baseline

```text
repository = nkkmd/bao-la-kiswahili-game
program review baseline main = 99eb6f571dbd1e1a41f12c65c2efb7c62930de45
post-decision branch baseline main = 127a9653933c623307c8423fddaf42166090f11b
research branch = research/g3-05-branch-expansion-compression-transition
Study ID = BECT-STUDY1
```

## Program authorization

- `../research-program-decisions/2026-09-02-post-g3-04-g3-05-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-02-post-g3-04-g3-05-authorization-review.md`
- decision: `G3-05-AUTHORIZED`

## Prospective contract

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `prereg/STUDY_1_SPEC.json`

Initial prospective freeze commits:

```text
machine prereg initial commit = c20fca50881c2f385cdf9f0e5065258fdbf66310
protocol initial commit = 2bfc9174c4630a3d0c4194704bdf5df81c2af536
README initial commit = 0781a4e64adfefdbb256e794d557ef5e06ed0248
overview initial commit = 62c847ccf51a3d833c0cb0e32f1fcd589c45d3b2
current-status initial commit = 33faf7c40dcf7aa71e4185fca25715f1c5b977a3
decision-register initial commit = 16ee2127d6b09128fc4b335dfb309d2383e6e0d1
```

## Frozen upstream source bindings

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
tools/experiments/lib/lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
tools/experiments/lib/lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
tools/experiments/lib/bect-production.js = b8fa63e941b4da1fec0969155c09754eae151a56
tools/experiments/lib/bect-independent.js = bb085c648d2f4f3d7d44f206f04036e95f94980b
```

## Representation and equality

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transforms = []
relative horizon = 5
cross-implementation scientific equality = canonical sorted-key JSON -> UTF-8 -> SHA-256 exact equality
prototype-sensitive runtime equality = NOT A SCIENTIFIC GATE
```

## Prospective pre-Stage-0 clarification

`prereg/STUDY_1_SPEC_CLARIFICATION_1.json`

```text
blob = 90869977c1977bbc10f4834228ee69b9151ce250
M5 denominator = sum uniqueTransitionCount[d], d=0..4
fresh evidence before clarification = false
Stage 0 fixture before clarification = false
```

## Reserved fresh namespaces

```text
Stage 1 = 31510001..31510240 / NOT CONSUMED / NOT AUTHORIZED
Stage 2 = 31520001..31520384 / NOT CONSUMED / NOT AUTHORIZED
```

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

No BECT action may use this holdout for generation, partial generation, read, peek, trial enumeration or resource estimation.

## Pre-Stage-0 static audit v1

```text
workflow = .github/workflows/bect-stage0-static-audit.yml
run = 33631463838
result = success
fixture execution = false
technical seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

## Stage 0 v1 — TECHNICAL-INVALID

Stage ID:

`BECT-S0-TECHNICAL-2026-09-02-v1`

Authorization:

- `authorizations/2026-09-02-stage-0-technical-authorization.md`
- nonce `BECT-S0-AUTH-2026-09-02-V1-01`
- max formal executions = 1

Execution:

```text
workflow = .github/workflows/bect-stage0-technical.yml
run = 33631597307
job = 100252124483
head = 4e34e624740df600182206dbde54827d7b071ee8
actual formal executions = 1
result = TECHNICAL-INVALID
```

The branch-advancement allowlist and frozen source-binding gate passed. The fixture step failed before bounded measurement because technical seed `31500001` terminated before the runner's fixed root pair 24->25 existed.

No fresh scientific seed, Stage 1 seed, Stage 2 seed or protected depth-10 evidence was accessed. v1 was not rerun.

## Stage 0 v2 technical refreeze

After v1 failure, a new technical version was frozen:

- `prereg/STAGE_0_V2_TECHNICAL_REFREEZE.json`
- blob `e59e82c6e73ee241b48d6106377805857cb11588`
- Stage ID `BECT-S0-TECHNICAL-2026-09-02-v2`

The scientific Study contract did not change. The only technical change was:

```text
fixed root pair 24->25
=> latest consecutive nonterminal post-move root pair in the fixed technical replay
```

The same v1 execution was not retried.

## Pre-Stage-0 v2 static audit

```text
run = 33631962037
job = 100253335120
result = success
fixture execution = false
technical seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

The audit checked v2 syntax, refreeze identity, frozen Stage 1/2 seed blocks and the protected-evidence boundary without executing fixtures.

## Stage 0 v2 — STAGE0-PASS

Authorization:

- `authorizations/2026-09-02-stage-0-v2-technical-authorization.md`
- blob `2a6b036aba9453e50b3e5e9ea19922dffde964e7`
- nonce `BECT-S0-AUTH-2026-09-02-V2-01`
- max formal executions = 1

Implementation:

```text
tools/experiments/run-bect-stage0-technical-v2.js = 5d72e6187db911758f2e9822971a11055aea30bc
workflow = .github/workflows/bect-stage0-technical-v2.yml
```

Execution:

```text
run = 33632094597
job = 100253778721
head = 9a2c4549f748085ec11b8f30263e97459b3caff4
actual formal executions = 1
conclusion = success
stage disposition = STAGE0-PASS
```

Durable artifact:

```text
artifact ID = 9847240252
name = bect-stage0-technical-v2-33632094597
size = 1265 bytes
ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
expired = false
```

Artifact exact files:

```text
results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json
SHA-256 = 8e3cb7631fcbdc3acee486f5b1495987b81624cea65746879824eac7328d25fe

results/stage-0-v2/STAGE_0_TECHNICAL_PROVENANCE.txt
SHA-256 = 3f533544209763106d83548844505a482ee7dc9184813d79e1d88db195559453
```

Repository mirror was created from the downloaded artifact bytes; no technical result was recomputed for recovery.

Deterministic technical result:

```text
technical seed = 31500001 / permanently prohibited from scientific use
observed trajectory length = 24
measured root pair = 22 -> 23
root selection = latest consecutive nonterminal post-move root pair
trajectory replay exact = true
adjacent successor binding exact = true
overlapping-window semantics exact = true
repeated RAW identity time-index semantics exact = true
production/independent root reconstruction exact = true
production/independent family exact = true
production/independent BECT level exact = true
canonical prototype-insensitive equality = true
implementation separation = true
deterministic core SHA-256 = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
fresh scientific seed access = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

## Stage 0 execution-count audit

Branch Actions history after Stage 0 contains four BECT push runs:

1. static audit v1 `33631463838` — non-computational audit;
2. Stage 0 v1 `33631597307` — one authorized formal technical execution;
3. static audit v2 `33631962037` — non-computational audit;
4. Stage 0 v2 `33632094597` — one authorized formal technical execution.

Therefore:

```text
Stage 0 v1 = 1 authorized / 1 actual / no rerun
Stage 0 v2 = 1 authorized / 1 actual / no rerun
fresh Stage 1 executions = 0
fresh Stage 2 executions = 0
```

## Stage 0 closure boundary

`BECT-S0-TECHNICAL-2026-09-02-v2 = STAGE0-PASS` establishes technical eligibility for a separate Stage 1 authorization review. It does not itself authorize fresh Stage 1 seed access or execution.
