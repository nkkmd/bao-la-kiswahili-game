# PCRPR-STUDY1 — Protocol

## 1. Study identity

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Research Generation = Research Generation 2
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Branch = research/g2-07-practical-comeback-reply-pressure-representation
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

The canonical study-start authority is `preregistration/STUDY_START_FREEZE.md`.

## 2. Research question

Can a prospectively defined, outcome-independent rich reply-pressure representation describe and predict fresh machine-operational practical-comeback structure across exact root moves, while separating reply-set structure, defense-maintaining fraction, reply-quality distribution, punishment concentration and machine opponent-policy sensitivity?

This Study does not rescue `PCEM-T1..T8`, PCEM near misses, RCPR production-only output, or any earlier Study decision.

## 3. Scientific unit

Primary representation unit:

```text
historically observed RAW root occurrence × exact root-move variant
```

A root-move row may have zero, one or many exact opponent replies. Missingness/applicability semantics must be frozen in Stage 0 rather than silently dropping such rows.

## 4. Authoritative RAW identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Historical occurrence identity and pre-root history hashes are provenance additions only and never replace RAW state identity.

## 5. Construct separation

PCRPR keeps separate:

```text
baseline reference position value
root-move-conditioned reference value
reply-conditioned reference value
opponent-policy-conditioned empirical continuation value
reply-pressure structural representation
```

Machine reply pressure is not a human-difficulty or human-error construct.

## 6. Leakage taxonomy

```text
A PRE_ROOT_OBSERVABLE
B ROOT_OR_REPLY_DERIVED_OUTCOME_INDEPENDENT
C SEARCH_OR_POLICY_DISTRIBUTION_DERIVED_OUTCOME_INDEPENDENT
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

Only A-C may enter predictors. Class D is target/outcome-only and forbidden from feature extraction.

## 7. Declared representation-family search space

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

No additional family may be introduced after Stage 1 scientific outcomes are observed.

## 8. Stage 0 — `PCRPR-S0-TECHNICAL-2026-08-29-v1`

Stage 0 is technical-only. It must establish:

1. exact root-move/reply serializers and canonical ordering;
2. per-family feature semantics, types, leakage class, phase applicability and missingness;
3. deterministic aggregation and IEEE-754/hash serialization contract;
4. production feature implementation;
5. structurally separate independent implementation;
6. adversarial fixtures including integer-like key enumeration order, reply-order permutation, tied reply quality, zero/one/many replies, terminal successors, corrupted RAW state, future-outcome leakage and config drift;
7. independent equality/verification semantics;
8. search/policy-distribution reproducibility for class-C families;
9. technical resource/throughput characterization;
10. Stage-0 eligibility disposition for each declared family.

Stage 0 cannot estimate practical-comeback effect or support any scientific confirmation claim.

## 9. Numeric integrity rule

Representation aggregations must not depend on implicit insertion/object enumeration order.

Exact features require exact independent equality under a frozen canonical byte/hash contract. Any non-exact comparison required later for model/statistical outputs must have its tolerance/comparison semantics prospectively justified and frozen before scientific outcomes exist.

No post-outcome tolerance or rounding rescue is authorized.

## 10. Stage 1 — `PCRPR-S1-DEVELOPMENT-2026-08-29-v1`

Stage 1 is fresh development-only evidence.

Study-start reserved baseline:

```text
source games = 3072
seed block = 28710001..28713072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
root target = 400 / Namua 200 / Mtaji 200
opening = 8-ply seeded uniform over lexically sorted exact move variants
max observed ply = 100
```

The baseline source-generation strata are `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, `LE-D2` with deterministic game-index modulo-6 assignment. Exact source hashes and any resource-driven pre-outcome amendment require a separate freeze before scientific generation.

Stage 1 selects root occurrences outcome-blind, then applies the prospectively frozen machine disadvantage criterion. No within-trajectory replacement after disadvantage failure is allowed.

All exact legal root moves at selected roots enter the row-construction audit. Stage 0 must define applicability semantics for terminal/zero-reply rows before Stage 1.

## 11. Continuation / policy target design

The scientific target family distinguishes strong, medium and weak machine opponent policies.

Primary target family:

```text
medium-vs-strong bounded practical-comeback lift
```

Secondary target families:

```text
weak-vs-strong lift
full opponent-policy outcome span
```

These target quantities are computed from fresh continuations and are class D. They cannot enter predictor features.

Before Stage 1 scientific generation, the exact policy identities, actor policy, continuation horizon, replicate count, RNG/CRN binding, terminal/admin-cutoff accounting, target formula, and source hashes must be frozen.

## 12. Stage 1 development/model rule

Before scientific generation, Stage 1 must freeze a deterministic development model/score search space, group-aware validation unit, family-selection rule, tie-break rule, preprocessing, support floors, phase requirements, target-variation floors, resource ceilings and decision taxonomy.

Stage 1 may use its own target outcomes for development only. It must emit exactly one Stage-2 candidate representation/scoring contract or close with Stage 2 not authorized.

No PCEM or RCPR scientific rows may be imported into development fitting, threshold selection or validation.

## 13. Stage 1 consume-once boundary

A Stage 1 block becomes consumed when an explicitly authorized runner validates the frozen source/spec/hash envelope, writes an execution-start record and crosses the boundary immediately before first scientific game generation.

After consumption, same-block repair/rerun, seed replacement/extension, favorable root replacement, post-hoc tolerance change, model substitution and threshold relaxation are prohibited.

## 14. Stage 1 -> Stage 2 transition freeze

If Stage 1 forms a formal target, one transition contract must freeze before any Stage 2 outcome:

- final feature list/order/family membership;
- missingness, scaling and transforms;
- fitted scoring/model contract;
- operating threshold if applicable;
- primary formal endpoint and acceptance thresholds;
- support/estimability/phase requirements;
- uncertainty/multiplicity rule;
- fresh Stage 2 population;
- complete Stage 1 overlap firewall;
- production/verifier source hashes;
- result-hash and numeric-comparison contract;
- fail-closed rule;
- explicit Stage 2 authorization requirement.

Stage 1 rows are never Stage 2 formal evidence.

## 15. Stage 2 — `PCRPR-S2-FORMAL-2026-08-29-v1`

Study-start reserved block:

```text
seeds = 28810001..28816144
count = 6144
status = RESERVED / UNCONSUMED
```

Stage 2 may run only after Stage 0 technical pass, Stage 1 development success, full transition/spec freeze, independent-verifier freeze, fresh-population freeze and separate explicit authorization.

Stage 2 authorization never occurs automatically.

## 16. Independent verification

Independent verification must not import production PCRPR feature/model helpers. It must independently reconstruct as much as technically feasible of:

- source generation;
- trajectory/opening identities;
- RAW state identity and root selection;
- exact root-move/reply sets;
- all feature values;
- policy-distribution descriptors;
- continuation target measurements;
- fitting/scoring;
- formal endpoint/decision;
- canonical row/set/result hashes.

A verifier that merely rereads production outputs is insufficient.

## 17. Decision taxonomy

The exact decision conjunction is frozen before the corresponding scientific outcome, but the Study must distinguish at minimum:

```text
CONFIRMED-WITHIN-FROZEN-REPRESENTATION-AND-POPULATION
NOT-CONFIRMED
INCONCLUSIVE
NON-ESTIMABLE
STAGE0-TECHNICAL-FAILED
STAGE1-DEVELOPMENT-BLOCKED
STAGE1-TECHNICAL-INVALID
TECHNICAL-INVALID
RESOURCE-CENSORED
NOT-AUTHORIZED-NOT-EXECUTED
```

Population/support/resource/verification failures are not scientific negative results unless the frozen rule explicitly makes the scientific endpoint estimable.

## 18. No-rescue rule

Prohibited include:

- changing `PCEM-T1..T8` or promoting PCEM near misses;
- importing PCEM Stage 1 rows as PCRPR scientific evidence;
- rerunning or repairing the consumed RCPR Stage 1 block;
- using RCPR production-only readiness as validated evidence;
- adding feature families after Stage 1 outcome inspection;
- favorable subgroup or phase-only rescue;
- model/threshold/primary-endpoint substitution after the relevant outcome;
- same-evidence defect repair after consume boundary;
- public AI strength/product outcomes as scientific endpoints;
- changing any prior Study decision.

## 19. Interpretation boundary

A positive PCRPR result is bounded to the frozen RAW population, search/policy semantics, representation, continuation instrument, model and endpoint. It is not game-theoretic proof, validated true win probability, human psychology/difficulty/error evidence, universal Bao taxonomy, causal proof, public-AI improvement evidence, or a full-game solution.
