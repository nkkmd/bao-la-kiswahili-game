# G4-08 / BRSGT-STUDY1 — 現在の状態

更新日: 2026-09-27  
状態: **STAGE 0 v2 PASS / STAGE 1 v1・v2 TECHNICAL-INVALID・NO-RERUN / STAGE 1 v3 PREREGISTERED・PRE-FRESH STATIC AUDIT PENDING**

## Formal identity

```text
Agenda = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
Branch = research/g4-08-rule-semantic-geometry-transition
Reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
```

## Current boundary

```text
Stage 0 v1 = TECHNICAL-INVALID / NO-RERUN
Stage 0 v2 = STAGE0-PASS / COMPLETE
Stage 1 v1 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v1 block = 40813001..40813512 / QUARANTINED / NO REUSE
Stage 1 v2 = TECHNICAL-INVALID / NO-RERUN-SAME-VERSION
Stage 1 v2 block = 40814001..40814512 / 512 READ / CONSUMED / NO REUSE
Stage 1 v3 = PREREGISTERED / PRE-FRESH PREPARATION COMPLETE / SCIENTIFIC EXECUTION NOT AUTHORIZED
Stage 1 v3 block = 40815001..40815512 / RESERVED / NOT ACCESSED
Stage 1 v3 authorization file = ABSENT
Stage 1 v3 scientific trigger file = ABSENT
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED / NOT ACCESSED
public AI change = NONE / NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

## Stage 0 v2

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

The undefined shorthand existed on three normal-result paths and the catch path, so the initiating exception is not reconstructable with confidence. v1 is closed and may not be rerun.

Canonical record:
`results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json`

Checkpoint:
`checkpoints/2026-09-27-stage-1-v1-technical-invalid.md`

## Stage 1 v2 closure

Pre-fresh audit:

```text
run = 36299573408
job = 108564609695
audit HEAD = d5cc6be4a8bc883841484d74b4e861751548e04c
disposition = STAGE1-V2-PRE-FRESH-STATIC-AUDIT-PASS
catch self-test = PASS
fresh reads at audit = 0
generated runner SHA-256 = 06b787a2f9b9da26f701a575cead722efab16450bbf33c1ecfd66f46afb874f0
```

One-shot execution:

```text
run = 36299638508 / attempt 1
job = 108564791144
execution HEAD = 9c2bf9c9b66622e0830d351fe32db97151d5a5af
binding = STAGE1-V2-BINDING-PASS
stage disposition = STAGE1-TECHNICAL-INVALID
technical error = missing limit distinctRawStates
fresh scientific seed reads = 512
first seed = 40814001
last seed = 40814512
formal inference = false
effect values/signs retained = false
Stage 2 reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Root cause is a preflight limit-interface schema mismatch. `CRCLGR boundedPreflight()` requires:

```text
distinctRawStates
uniqueTransitions
parentExpansions
legalMoveEvaluations
treeNodeOccurrences
```

BRSGT v2 incorrectly supplied three names:

```text
globalDistinctRawStates       -> should be distinctRawStates
uniqueCanonicalTransitions    -> should be uniqueTransitions
legalMoveVariantsEnumerated   -> should be legalMoveEvaluations
```

The existing G4-04 technical runner uses the required names, confirming the interface contract. The v2 failure artifact worked correctly and preserved the exact read accounting. The full v2 block is therefore `CONSUMED-NO-REUSE` and v2 may not be rerun.

Canonical record:
`results/stage-1-v2/STAGE_1_V2_CANONICAL_FAILURE_RECORD.json`

Checkpoint:
`checkpoints/2026-09-27-stage-1-v2-technical-invalid.md`

## Stage 1 v3 frozen design

Stage ID:
`BRSGT-S1-DEVELOPMENT-2026-09-27-v3`

```text
evidence class = FRESH-DEVELOPMENT
seed block = 40815001..40815512 / 512 slots
v1 block reuse = false
v2 block reuse = false
source policies = same as v1/v2
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
main integration = false
scientific execution authorized = false
```

v3 does not change the scientific question, selection rules, horizon, metrics, thresholds, or resource ceilings. The only runtime contract correction is the three preflight limit-key names identified by v2.

## Stage 1 v3 technical hardening

Prepared files:

```text
prereg/STAGE_1_V3_DEVELOPMENT_SPEC.json
prereg/UPSTREAM_IDENTITY_FIREWALL_V3.json
tools/experiments/materialize-brsgt-stage1-v3-runner.js
tools/experiments/verify-brsgt-stage1-v3-binding.js
tools/experiments/audit-brsgt-stage1-v3-static.js
.github/workflows/brsgt-stage1-v3-development.yml
.github/workflows/brsgt-stage1-v3-preauth-static.yml
```

Safeguards:

1. v1 and v2 blocks are explicit firewall exclusions.
2. v3 uses new block `40815001..40815512`.
3. frozen v1 runner SHA-256 remains the pinned source for deterministic materialization.
4. four `freshScientificSeedReads` shorthand defects are corrected as in v2.
5. exactly three preflight limit-key mappings are corrected:
   - `distinctRawStates`
   - `uniqueTransitions`
   - `legalMoveEvaluations`
6. v2 catch-path self-test is retained.
7. a new preflight-contract self-test calls the same production/independent `preflightContinuous()` interface with the exact generated `rawLimits()` object, `E.initialState()`, and technical metadata seed `44015001`.
8. both self-tests must complete with fresh reads 0 and no-rescue boundary false.
9. later authorization must bind the static-audited HEAD, spec/firewall/materializer/generated-runner hashes.
10. after audit, only v3 authorization + v3 trigger may change before execution.

Preparation checkpoint:
`checkpoints/2026-09-27-stage-1-v3-preparation.md`

## Scientific interpretation to date

```text
Stage 1 v1 scientific outcome = NONE / TECHNICAL-INVALID
Stage 1 v2 scientific outcome = NONE / TECHNICAL-INVALID
formal inference performed = false
effect values/signs retained as evidence = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Neither technical failure is positive or negative evidence for the G4-08 scientific claims.

## Protected boundaries

- Stage 0 v1 rerun禁止
- Stage 1 v1 rerun禁止
- Stage 1 v1 block `40813001..40813512` reuse禁止
- Stage 1 v2 rerun禁止
- Stage 1 v2 block `40814001..40814512` reuse禁止
- Stage 1 v3 fresh accessはauthorization前禁止
- Stage 2 seed access禁止
- G4-10 depth-11 access禁止
- public AI変更禁止
- main integration禁止

## Next gate

Add only `STAGE_1_V3_STATIC_AUDIT_TRIGGER.json` and run the v3 pre-fresh static audit against the documentation-inclusive HEAD.

The audit must establish, before any fresh access:

- v3 scientific authorization/trigger absent;
- v1/v2 blocks quarantined;
- v3 reservation untouched;
- frozen source SHA binding;
- four counter fixes exact;
- three preflight limit-key fixes exact;
- catch-path self-test PASS;
- preflight-contract self-test PASS using the actual compatibility consumer;
- generated runner syntax/hash determinism;
- firewall materialization with fresh reads 0;
- Stage 2/G4-10/public AI protection.

Static-audit PASS does not itself authorize scientific execution. A separate source-bound one-shot authorization remains required.
