# PCRPR-STUDY1 — Current Status

Updated: 2026-08-29

## Study identity

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline remote main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Branch = research/g2-07-practical-comeback-reply-pressure-representation
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

## Current state

**STAGE 0 TECHNICAL PASS / STAGE 1 SCIENTIFIC SPEC FROZEN / STAGE 1 IMPLEMENTATION VALIDATION PENDING / STAGE 1 NOT AUTHORIZED / STAGE 2 NOT AUTHORIZED**

```text
scientificOutcomeGenerated = false
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 spec = PROSPECTIVE-FROZEN
Stage 1 scientific generation = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 28710001..28713072 = RESERVED / UNCONSUMED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0 canonical technical result

```text
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow run = 33238931893 / success
job = 99064778014 / success
artifact = 9710763348
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
production mandatory gates = 18 / 18 PASS
independent gates = 9 / 9 PASS
technical rows = 9
scalar features per row = 80
independent exact feature/vector equality = PASS
```

Stage 0 used technical fixture seeds `28700001..28700032`, which are outside both scientific blocks. It consumed no Stage 1 or Stage 2 scientific seed.

Canonical records:

- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `FEATURE_DICTIONARY.md`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-29-stage0-technical-pass.md`

## G2-06 technical lesson disposition

PCRPR freezes exact move/reply lexical ordering before aggregation, explicit deterministic binary64 arithmetic order, IEEE-754 big-endian scalar encoding, exact vector hashes, reply-permutation controls and adversarial integer-like keys. The canonical Stage 0 run reproduced all features exactly across production and independent implementations without a tolerance.

This does not alter or rescue `RCPR-STUDY1 = STAGE1-TECHNICAL-INVALID`.

## Stage 1 prospective specification

`preregistration/STAGE_1_DEVELOPMENT_SPEC.json` is now frozen before any Stage 1 scientific outcome.

Core design:

```text
source games = 3072
fresh seeds = 28710001..28713072
selected root target = 400 / Namua 200 / Mtaji 200
root occurrence selected before D3 disadvantage screen
D3 reference disadvantage = bestScore < 0
rows = all exact root moves from selected disadvantaged roots
actor continuation = canonical D2 best
strong opponent = canonical D2 best / 1 deterministic replicate
medium opponent = seeded D1 top3 / 16 replicates
weak opponent = seeded uniform exact reply / 8 replicates
maximum post-root horizon = 96 plies
primary development target = medium bounded-win rate - strong bounded-win indicator
development model = deterministic grouped ridge regression
CV = 5-fold by historicalTrajectoryHash
```

All continuation targets are class-D and prohibited from predictor features.

An immediate pre-outcome self-audit found that the first committed Stage 1 spec accidentally duplicated `F03_REPLY_POLICY` and `F04_ALL_NO_TEMPORAL`. Before any implementation validation, authorization, scientific seed consumption or scientific outcome, `F03_REPLY_POLICY` was narrowed to its intended reply-quality/policy family set and the correction was recorded in the spec. No outcome was available to guide the correction.

## Upstream immutable boundary

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
STSCV-STUDY1 = INCONCLUSIVE
REEOE-STUDY1 = INCONCLUSIVE
DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RCPR-STUDY1 Stage 1 = STAGE1-TECHNICAL-INVALID
RCPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
PCEM-STUDY1 promoted candidates = 0
PCEM Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No rescue or re-adjudication is authorized.

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded: `turn`, `reason`.

## Declared / technically eligible representation families

```text
REPLY_SET_WIDTH
DEFENSE_MAINTAINING_REPLY_FRACTION
REPLY_QUALITY_DISTRIBUTION
PUNISHMENT_CONCENTRATION
BEST_REPLY_GAP_VECTOR
FORCING_REPLY_STRUCTURE
REPLY_BRANCH_ASYMMETRY
REPLY_SEARCH_STABILITY
OPPONENT_POLICY_SENSITIVITY
ROOT_MOVE_REFERENCE_CONTEXT
LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE
LOCAL_TEMPORAL_CONTEXT
```

All 12 are technically eligible after Stage 0. Scientific usefulness has not been evaluated.

## Immediate next action

Implement Stage 1 production and structurally separate independent verifier, then run technical-only implementation smoke, resource preflight and source-freeze audit. Only after all required pre-authorization gates pass may an explicit `authorizations/STAGE_1_EXECUTE.json` be committed.

No Stage 1 scientific generation is authorized yet.
