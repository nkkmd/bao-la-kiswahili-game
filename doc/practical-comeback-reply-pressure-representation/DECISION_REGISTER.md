# PCRPR-STUDY1 — Decision Register

Updated: 2026-08-29

Entries below are prospective study-start decisions unless later superseded by an explicitly prospective pre-outcome amendment. No entry authorizes scientific execution by itself.

## D01 — Study identity

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Branch = research/g2-07-practical-comeback-reply-pressure-representation
```

Status: **FROZEN PROSPECTIVELY**.

## D02 — Stage architecture

```text
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

Stage 0 is technical-only; Stage 1 is development-only; Stage 2 is fresh formal validation only and requires a separate explicit authorization.

Status: **FROZEN PROSPECTIVELY**.

## D03 — Immutable upstream / no-rescue

G2-01..G2-06 and all Research Generation 1 decisions remain immutable. In particular:

```text
PCEM-STUDY1 candidate audits = 55
PCEM-STUDY1 promoted candidates = 0
PCEM Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
RCPR Stage 1 = STAGE1-TECHNICAL-INVALID
RCPR Stage 1 seeds 28610001..28613072 = CONSUMED
RCPR same-block rerun/replacement/extension = NOT AUTHORIZED
RCPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

PCEM grammar expansion, near-miss promotion, threshold relaxation, opponent-policy substitution and use of historical rows as PCRPR scientific evidence are prohibited.

Status: **FROZEN**.

## D04 — RAW-only scientific identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Status: **FROZEN**.

## D05 — Primary representation unit

```text
historical RAW root occurrence × exact root-move variant
```

Occurrence/history provenance is additional metadata; RAW identity remains authoritative for state identity and overlap firewalls.

Status: **FROZEN**.

## D06 — Construct separation

The Study shall not collapse the following into one quantity:

```text
baseline reference position value
root-move-conditioned reference value
reply-conditioned reference value
machine policy-conditioned continuation value
reply-pressure structural representation
```

Status: **FROZEN**.

## D07 — Human-claim firewall

Machine reply pressure and machine opponent-policy sensitivity do not establish human difficulty, deception, human error probability, psychological pressure or expert-perceived complexity.

Status: **FROZEN**.

## D08 — Leakage taxonomy

```text
A PRE_ROOT_OBSERVABLE
B ROOT_OR_REPLY_DERIVED_OUTCOME_INDEPENDENT
C SEARCH_OR_POLICY_DISTRIBUTION_DERIVED_OUTCOME_INDEPENDENT
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

Only A-C are predictor-eligible. D is target/outcome-only.

Status: **FROZEN**.

## D09 — Prospectively declared representation families

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

No new family may be added after Stage 1 scientific outcomes are observed.

Status: **FROZEN SEARCH-SPACE BOUNDARY**.

## D10 — Opponent-policy-sensitivity predictor boundary

Predictor-side `OPPONENT_POLICY_SENSITIVITY` may use only outcome-independent reply-selection distributions or deterministic policy scores over the exact reply set. Empirical terminal outcomes under a policy are forbidden from predictor features.

Status: **FROZEN**.

## D11 — G2-06 numeric hardening applicability

PCRPR prospectively requires canonical reply/category ordering, deterministic accumulation order, explicit binary64 serialization/hash semantics, integer-like-key adversarial fixtures, reply-order permutation tests and independent exact feature recomputation before Stage 1 authorization.

No RCPR outcome is rescued and no post-hoc tolerance is inherited.

Status: **FROZEN TECHNICAL REQUIREMENT**.

## D12 — Fresh Stage 1 block reservation

```text
source games = 3072
seeds = 28710001..28713072
use = CONSUME-ONCE-DEVELOPMENT-ONLY
status at study start = RESERVED / UNCONSUMED
```

Status: **FROZEN RESERVATION**.

## D13 — Fresh Stage 2 block reservation

```text
seeds = 28810001..28816144
count = 6144
use = FORMAL-ONLY
status at study start = RESERVED / UNCONSUMED
```

Stage 2 reservation does not constitute Stage 2 authorization.

Status: **FROZEN RESERVATION**.

## D14 — Study-start source population baseline

```text
opening plies = 8
opening = seeded uniform over lexically sorted exact move variants
max observed ply = 100
strata assignment = deterministic game-index modulo 6
strata = B-D1, B-D2, B-D3, LS-D2, V2-D2, LE-D2
root target = 400 / Namua 200 / Mtaji 200
```

Exact source hashes are not yet frozen. Stage 0 resource evidence may justify an explicit pre-scientific-outcome amendment only while zero Stage 1 scientific seeds have been consumed.

Status: **PROSPECTIVE BASELINE / AMENDABLE ONLY PRE-OUTCOME**.

## D15 — Root selection no-replacement rule

Root selection is PCRPR-target-outcome-blind. One occurrence is hash-selected within an assigned phase before the reference-disadvantage screen. Failure of that screen does not permit within-trajectory replacement. Duplicate selected RAW states are deterministically collapsed before quota.

Status: **FROZEN PRINCIPLE**.

## D16 — Study-start disadvantage criterion

Default criterion:

```text
newly frozen PCRPR D3 exact-root bestScore < 0
```

This is an operational sign screen on fresh PCRPR rows only. It does not reuse or re-adjudicate PCEM candidate outcomes.

Exact search identity/tie-breaking must pass Stage 0 and be frozen before Stage 1 scientific generation.

Status: **FROZEN DEFAULT / INSTRUMENT HASH PENDING**.

## D17 — Continuation target family

Primary target family:

```text
medium-vs-strong bounded practical-comeback lift
```

Secondary target families:

```text
weak-vs-strong lift
full opponent-policy outcome span
```

Exact policy identities, actor policy, horizon, replicate count, CRN/RNG binding, administrative cutoff handling and formula must be frozen before Stage 1 scientific generation.

Status: **FROZEN TARGET FAMILY / NUMERIC CONTRACT PENDING**.

## D18 — Consume-once boundary

A scientific block becomes consumed only after explicit authorization and source/spec/hash validation, when the runner writes the execution-start record immediately before first scientific game generation.

After that boundary, same-block rerun, repair, replacement, extension, favorable root replacement, post-hoc tolerance, threshold or model substitution are prohibited.

Status: **FROZEN**.

## D19 — Stage 2 automatic authorization prohibited

Stage 1 success does not automatically authorize Stage 2. Stage 2 requires a separately committed formal transition/spec, fresh population/firewall, exact source hashes, independent verifier and explicit authorization.

Status: **FROZEN**.

## D20 — Independent verifier structure

Independent verification may share the authoritative Bao rule engine but may not import production PCRPR feature, serializer, aggregation, model or result-assembly helpers. It must independently reconstruct the scientific decision core as far as technically feasible.

Status: **FROZEN**.

## D21 — Formal vocabulary constraint

PCRPR must distinguish scientific, estimability, resource, technical and authorization dispositions. Exact conjunctions will be frozen before corresponding outcomes, using current Research Generation 2 vocabulary including `CONFIRMED-WITHIN-FROZEN-REPRESENTATION-AND-POPULATION`, `NOT-CONFIRMED`, `INCONCLUSIVE`, `NON-ESTIMABLE`, `STAGE1-DEVELOPMENT-BLOCKED`, `STAGE1-TECHNICAL-INVALID`, `TECHNICAL-INVALID`, `RESOURCE-CENSORED`, and `NOT-AUTHORIZED-NOT-EXECUTED`.

Status: **FROZEN TAXONOMY BOUNDARY**.

## D22 — Study-start authorization state

```text
scientificOutcomeGenerated = false
Stage 0 technical work = permitted after study-start freeze
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

Status at study start: **FROZEN**.

## D23 — Stage 0 formal technical semantics

Before execution, Stage 0 fixed:

```text
search = pcrpr-exact-full-window/bao/q0/v1
reply quality perspective = replying player
defense-maintaining reply = exact D2 top-set membership
strong predictor distribution = uniform D2 top set
medium predictor distribution = uniform first min(3,N) D1-ranked replies
weak predictor distribution = uniform exact replies
predictor policy sensitivity = expected D2 defense gap + total-variation distances only
```

Continuation outcomes are not predictor-side policy-sensitivity features.

Status: **FROZEN PRE-EXECUTION**.

## D24 — Stage 0 numeric/hash contract

```text
exact move/reply aggregation order = canonical lexical exact move identity
float arithmetic = deterministic left-to-right IEEE-754 binary64 under frozen semantic order
scalar hash encoding = big-endian binary64 lowercase hex
feature-vector equality = EXACT
tolerance = none
```

Integer-like key ordering and reply-list permutation are mandatory adversarial controls.

Status: **FROZEN PRE-EXECUTION**.

## D25 — Stage 0 canonical technical result

Canonical execution:

```text
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow run = 33238931893 / success
job = 99064778014 / success
artifact = 9710763348
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
production gates = 18 / 18 PASS
independent gates = 9 / 9 PASS
rows = 9 technical rows
feature width = 80 scalars
```

Decision: **`STAGE0-TECHNICAL-PASS`**.

The technical seed menu `28700001..28700032` is outside both scientific blocks. No scientific outcome was generated and neither Stage 1 nor Stage 2 was authorized by this result.

Status: **FROZEN TECHNICAL RESULT**.

## D26 — Stage 1 source/population contract

Before scientific generation, Stage 1 fixes:

```text
source games = 3072
seeds = 28710001..28713072
opening = 8-ply seeded uniform exact-move opening
max observed ply = 100
source strata = B-D1, B-D2, B-D3, LS-D2, V2-D2, LE-D2
phase assignment = SHA256 parity of seed under PCRPR-S1-PHASE-v1
occurrence selection = minimum hash rank inside assigned phase
reference disadvantage = exact D3 bestScore < 0 after occurrence selection
within-trajectory replacement after disadvantage failure = prohibited
root quota = Namua 200 / Mtaji 200
row unit = selected historical root occurrence × every exact legal root-move variant
```

Status: **FROZEN PROSPECTIVELY / NOT YET AUTHORIZED**.

## D27 — Stage 1 continuation and target contract

```text
root actor policy = canonical exact D2 best
strong opponent = canonical exact D2 best / deterministic 1 replicate
medium opponent = seeded uniform over first min(3,N) D1-ranked replies / 16 replicates
weak opponent = seeded uniform exact legal replies / 8 replicates
maximum post-root horizon = 96 plies
administrative exhaustion = recorded and boundedWin=0
primary target = medium bounded-win rate - strong bounded-win indicator
secondary = weak-minus-strong lift; full policy bounded-win span
```

All continuation targets are leakage class D and prohibited from predictor features.

Status: **FROZEN PROSPECTIVELY / NOT YET AUTHORIZED**.

## D28 — Stage 1 model-development contract

Stage 1 uses deterministic ridge linear regression only, with five prospectively declared family sets, lambdas `0.1, 1, 10, 100`, no outcome-driven individual scalar feature selection and no interactions.

Five-fold cross-validation is grouped by `historicalTrajectoryHash`. Primary model selection minimizes pooled OOF RMSE. Exact tie-breaking uses pooled OOF Spearman, active feature count, family-set ID and lambda in the frozen order.

Status: **FROZEN PROSPECTIVELY**.

## D29 — Pre-outcome Stage 1 family-set correction

Immediately after the first Stage 1 spec commit, self-audit found that `F03_REPLY_POLICY` accidentally duplicated `F04_ALL_NO_TEMPORAL`.

Before implementation validation, explicit authorization, scientific seed consumption or scientific outcome observation, `F03_REPLY_POLICY` was narrowed to its intended reply-quality/policy-distribution family set. The correction is recorded in the machine-readable Stage 1 spec.

```text
scientificSeedsConsumed = false
scientificOutcomeObserved = false
```

Status: **VALID PRE-OUTCOME SPECIFICATION CORRECTION**.

## D30 — Stage 1 deterministic computation contract

The separate computation contract fixes exact row/feature ordering, target arithmetic, fold assignment, training means/population SD, normal-equation accumulation, unpenalized intercept, ridge Cholesky loop order, forward/back substitution, prediction order, RMSE, exact-tie average-rank Spearman, top-quintile enrichment, candidate selection and binary64 model serialization.

Independent verification must reproduce OOF prediction and final-parameter/result hashes exactly. No numeric tolerance is authorized.

Status: **FROZEN BEFORE IMPLEMENTATION VALIDATION AND SCIENTIFIC OUTCOME**.

## D31 — Stage 1 readiness and disposition rules

The complete machine-readable readiness gates are frozen in `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`. They include source diversity, exact 400-root quota, row support, phase support, target variance/range/class support, administrative-horizon ceilings, OOF Spearman, relative RMSE improvement, top-quintile lift enrichment, and mandatory full independent recomputation.

Disposition mapping:

```text
all gates + independent verification PASS -> STAGE1-DEVELOPMENT-PASS-AND-FORMAL-TARGET-AVAILABLE
population/root/target support failure -> STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
model/enrichment failure -> STAGE1-DEVELOPMENT-BLOCKED-ZERO-PROMOTION
resource ceiling failure after consumption -> RESOURCE-CENSORED
technical/integrity/independent-verification failure -> STAGE1-TECHNICAL-INVALID
```

Stage 2 is never automatically authorized.

Status: **FROZEN PROSPECTIVELY**.

## D32 — Stage 1 authorization barrier remains closed

Stage 1 scientific generation requires all of the following before an authorization file may be committed:

1. canonical Stage 0 PASS materialized;
2. Stage 1 spec and computation contract frozen;
3. production implementation smoke PASS;
4. structurally separate independent verifier smoke PASS;
5. technical-only resource preflight PASS;
6. exact source/blob/hash envelope frozen and audited;
7. explicit `authorizations/STAGE_1_EXECUTE.json` commit.

At this decision entry, requirements 3-6 are not yet complete.

```text
Stage 1 seeds 28710001..28713072 = RESERVED / UNCONSUMED
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

Status: **CURRENT FAIL-CLOSED AUTHORIZATION BARRIER**.
