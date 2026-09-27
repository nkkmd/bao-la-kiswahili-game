# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **STAGE 0 v2 PASS / STAGE 1 v1・v2 TECHNICAL-INVALID・NO-RERUN / STAGE 1 v3 PREPARATION REQUIRED**

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
Stage 0 v1 = TECHNICAL-INVALID / NO-RERUN
Stage 0 v2 = STAGE0-PASS / COMPLETE
Stage 1 v1 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v1 block = 40813001..40813512 / QUARANTINED / NO REUSE
Stage 1 v2 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v2 block = 40814001..40814512 / 512 READ / CONSUMED / NO REUSE
Stage 1 v3 = NOT YET PREREGISTERED / NOT AUTHORIZED
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED / NOT ACCESSED
public AI change = NONE / NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

## Stage 0 v2 canonical result

`BRSGT-S0-TECHNICAL-2026-09-27-v2` is `STAGE0-PASS`.

```text
workflow run = 36295553800
fixture count = 4
all represented seed totals = 64
E1-E4 = covered
production / independent exact agreement = true
fresh scientific seed reads = 0
Stage 2 reads = 0
G4-10 depth-11 access = 0
```

Canonical record:
`results/stage-0-v2/STAGE_0_V2_CANONICAL_RECORD.json`

## Stage 1 v1 closure

```text
stage = BRSGT-S1-DEVELOPMENT-2026-09-27-v1
run = 36298620437
binding = PASS
stage disposition = STAGE1-TECHNICAL-INVALID
terminal error = ReferenceError: freshScientificSeedReads is not defined
exact fresh read count = unknown
seed block = 40813001..40813512 / conservatively consumed
scientific outcome = NONE
```

Source audit found the undefined shorthand on three normal-result paths and the catch path. The initiating exception therefore cannot be reconstructed reliably. v1 is closed and must not be rerun.

Canonical record:
`results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json`

Checkpoint:
`checkpoints/2026-09-27-stage-1-v1-technical-invalid.md`

## Stage 1 v2 pre-fresh verification

Stage ID:
`BRSGT-S1-DEVELOPMENT-2026-09-27-v2`

Static audit:

```text
workflow run = 36299573408
job = 108564609695
audit HEAD = d5cc6be4a8bc883841484d74b4e861751548e04c
disposition = STAGE1-V2-PRE-FRESH-STATIC-AUDIT-PASS
catch self-test = PASS
catch self-test fresh reads = 0
generated runner SHA-256 = 06b787a2f9b9da26f701a575cead722efab16450bbf33c1ecfd66f46afb874f0
v1 block quarantined = true
scientific auth present at audit = false
scientific trigger present at audit = false
fresh reads at audit = 0
Stage 2 reads = 0
G4-10 depth-11 access = 0
```

The v2 authorization and trigger were the only two changes after the audited HEAD.

## Stage 1 v2 execution

```text
workflow run = 36299638508 / attempt 1
job = 108564791144
execution HEAD = 9c2bf9c9b66622e0830d351fe32db97151d5a5af
binding = STAGE1-V2-BINDING-PASS
stage disposition = STAGE1-TECHNICAL-INVALID
technical error = missing limit distinctRawStates
fresh scientific seed reads = 512
first seed = 40814001
last seed = 40814512
no-rescue boundary crossed = true
formal inference = false
effect values retained = false
effect signs retained = false
Stage 2 reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Artifact:

```text
artifact ID = 10924877658
artifact ZIP SHA-256 = 66b4c37e6d623af645944745da7a0c99698053a3b2a8e5e95076cbf20dc04976
STAGE_1_EXECUTION_CONTEXT SHA-256 = 09931005ab97429801e592b4170d9fdf486bfc399829f80cf8148e523563884c
STAGE_1_FAILURE SHA-256 = 29e51970c6358d89087602aa390261451568c47becb6572ba4a80db3cd9855fe
```

The v2 catch path worked correctly and preserved the exact failure and read accounting.

## Stage 1 v2 root cause

The failure is a **preflight limit-interface schema mismatch**, not a scientific outcome.

`CRCLGR boundedPreflight()` requires:

```text
distinctRawStates
uniqueTransitions
parentExpansions
legalMoveEvaluations
treeNodeOccurrences
```

BRSGT v2 supplied:

```text
globalDistinctRawStates
uniqueCanonicalTransitions
parentExpansions
legalMoveVariantsEnumerated
treeNodeOccurrences
```

Wrong key mappings:

```text
globalDistinctRawStates       -> distinctRawStates
uniqueCanonicalTransitions    -> uniqueTransitions
legalMoveVariantsEnumerated   -> legalMoveEvaluations
```

The existing G4-04 technical runner uses the required compatibility names, giving an independent in-repository reference for the correction.

Because all 512 fresh v2 slots were read, `40814001..40814512` is permanently `CONSUMED-NO-REUSE`. v2 must not be rerun.

Canonical record:
`results/stage-1-v2/STAGE_1_V2_CANONICAL_FAILURE_RECORD.json`

Checkpoint:
`checkpoints/2026-09-27-stage-1-v2-technical-invalid.md`

## Scientific interpretation

```text
Stage 1 v1 scientific outcome = NONE / TECHNICAL-INVALID
Stage 1 v2 scientific outcome = NONE / TECHNICAL-INVALID
formal inference performed = false
effect values/signs retained as evidence = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Neither v1 nor v2 may be interpreted as positive or negative evidence for the G4-08 scientific claims.

## Protected boundaries

- G3-06 repair / reopen / rerun禁止
- Stage 0 v1 rerun禁止
- Stage 1 v1 rerun禁止
- Stage 1 v1 block `40813001..40813512` reuse禁止
- Stage 1 v2 rerun禁止
- Stage 1 v2 block `40814001..40814512` reuse禁止
- Stage 2 seed access禁止
- G4-10 depth-11 access禁止
- public AI変更禁止
- main integration禁止

## Next gate — Stage 1 v3

A v3 may be prepared because the v2 failure was an identified interface-contract defect and no scientific effect result was retained. v3 must not reuse v1/v2 evidence and must preserve the scientific design.

Required before any v3 fresh access:

1. new stage identity, e.g. `BRSGT-S1-DEVELOPMENT-2026-09-27-v3`;
2. new non-overlapping fresh block;
3. v1 + v2 blocks explicitly quarantined in the v3 firewall;
4. exactly the three incorrect preflight limit-key mappings corrected;
5. existing catch-path self-test retained;
6. new pre-fresh **preflight-contract self-test** that calls the same compatibility `preflightContinuous()` interface with the exact generated limit object and a seed-free technical fixture;
7. generated runner hash frozen;
8. new static audit with fresh reads 0;
9. separate one-shot authorization + trigger after audit;
10. Stage 2 / G4-10 / public AI / main remain closed.
