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

## D22 — Current authorization state

```text
scientificOutcomeGenerated = false
Stage 0 technical work = permitted after study-start freeze
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

Status: **CURRENT**.
