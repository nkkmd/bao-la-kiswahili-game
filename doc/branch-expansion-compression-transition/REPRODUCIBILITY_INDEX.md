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

## Stage 1 prospective clarification 2

`prereg/STUDY_1_SPEC_CLARIFICATION_2.json`

```text
blob = 87e78b008024301a26f78d1ac488d8489f9bd02b
fresh evidence before clarification = false
Stage 1 seed access before clarification = false
coverage rule = metric defined at all 48 analysis roots on all 10 selected trajectories
longitudinal identity rules = prospectively fixed before fresh evidence
```

This clarification resolves implementation ambiguity only. It does not change the endpoint universe, event grammar, population, seed block, horizon, representation, promotion gates, formal test or resource ceilings.

## Stage 1 identity-only firewall

Materialization:

```text
run = 33634116550
job = 100260542549
artifact = 9848023294
artifact ZIP SHA-256 = da16c9103f80de82051b229239491535604f20b903e427d5b4898c7126d1418b
identity file SHA-256 = 771297c0fa0f2c9de3f74f85ba1b52d58de9e4ab1ae19c7421643436c0156926
identity core SHA-256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
root identities = 124
trajectory identities = 124
opening-prefix identities = 67
scientific outcome fields retained = false
```

Exact-byte mirror:

```text
run = 33634259594
job = 100261031754
mirror commit = 229527b993012c8019ef782c62f4d2652ee0c7f9
UPSTREAM_IDENTITY_FIREWALL.json blob = 123430eb0cbe100bf50e068ee4c4ee7dc52c2ca8
```

G3-03 diagnostic scientific fields and G3-04 scientific outcome fields are not retained by the BECT identity firewall.

## Stage 1 frozen scientific implementation

```text
tools/experiments/lib/bect-stage1-production.js = 32995ed7e666b7cff7a6bb43946a30cdc86a7668
tools/experiments/lib/bect-stage1-independent.js = fcc150bdfcfbb1727ea6e0fdd4f336d1ae36e1e6
tools/experiments/run-bect-stage1-development.js = 127cb10ea23d18f0a32c2adc2d8c499de4c19b04
.github/workflows/bect-stage1-development.yml = dcb39d07420ad81db9e10d0ba08a10a9a3cb7cb7
```

Production and independent selectors/aggregators are implementation-separated. The scientific workflow uses a dedicated trigger path, `cancel-in-progress: false`, durable pre-computation lease, exact source bindings, branch-advancement allowlist and artifact-before-repository-mirror boundary.

## Stage 1 preauthorization validation

Static audit:

```text
run = 33635090198
job = 100263846393
result = PASS
scientific runner execution = false
Stage 1 seed access = false
```

Initial tooling smoke `33635334088` proved the unarmed runner fail-closed before fresh access; its final static trigger-string count assertion was defective and failed without any scientific consequence.

Corrected tooling smoke:

```text
run = 33635443176
job = 100265043171
result = PASS
unarmed runner fail-closed = PASS
single scientific trigger declaration = PASS
concurrency/lease/artifact path gates = PASS
Stage 1 seed access = false
```

Source validation:

```text
run = 33635524477
job = 100265316151
result = PASS
exact source bindings = PASS
scientific workflow execution = false
Stage 1 seed access = false
```

Durable lease-path smoke:

```text
run = 33635710262
job = 100265942917
result = PASS
technical trigger commit = bd7a7ef367b170e79d874d941bd0583513d02baa
durable technical marker commit = a588dbbaf01d1c5a5d5191ef3f34b9e054ab8037
scientific authorization = false
scientific computation = false
Stage 1 seed access = false
```

The lease smoke used the actual GitHub contents-write and branch-push path on a non-scientific marker and did not trigger the scientific workflow.

## Stage 1 preauthorization checkpoint

`checkpoints/2026-09-02-stage-1-preauthorization-tooling-pass.md`

```text
blob = 86df093e85d14fc1a9c931e818f4067cb8822949
decision = BECT-STAGE1-AUTHORIZATION-ELIGIBLE / SCIENTIFIC-EXECUTION-NOT-YET-AUTHORIZED
BECT Stage 1 Development workflow executions before authorization = 0
Stage 1 seed = NOT CONSUMED
Stage 2 seed = NOT CONSUMED
fresh BECT scientific evidence generated/read = false
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

A separate machine-readable authorization must bind the post-preparation branch HEAD and permit exactly one Stage 1 scientific execution. Only the authorization artifact and one dedicated execution trigger may advance the branch between that baseline and computation.
