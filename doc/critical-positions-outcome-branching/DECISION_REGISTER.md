# DECISION_REGISTER — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23

Decision status vocabulary:

```text
FROZEN = may not be silently changed within the current scientific version
PROVISIONAL = may be changed only before scientific generation, with explicit logged rationale independent of scientific outcomes
REJECTED = explicitly not adopted
LOCKED = stage execution not authorized
```

## CPOB-D001 — New prospective independent study

**Decision:** Completed Bao studies are immutable historical records. This study does not rescue, relabel or replace their formal decisions.

Status: **FROZEN**

## CPOB-D002 — Repository baseline

```text
verified main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
branch = research/critical-positions-outcome-branching
```

The previously reported `2c452186...` HEAD was explicitly rechecked and was no longer current.

Status: **FROZEN**

## CPOB-D003 — Primary construct

**Decision:** Primary construct is fixed-policy empirical continuation divergence across exact legal root moves.

Status: **FROZEN**

## CPOB-D004 — Construct separation

**Decision:** Keep separate empirical continuation divergence, search-value separation, ranking instability, structural branch divergence, game-theoretic criticality and human-perceived criticality.

Status: **FROZEN**

## CPOB-D005 — Calibration boundary

**Decision:** Position Evaluation / Win-Rate Calibration Study 1 remains `INCONCLUSIVE`. Its exploratory isotonic mapping is not a formally validated win-probability converter and is excluded from formal primary measurement.

Status: **FROZEN**

## CPOB-D006 — BMP boundary

**Decision:** BMP Study 1 remains 0 `CONFIRMED` / 4 `NOT-CONFIRMED`. C01-C03 structural failure recurrence may motivate hypotheses only; no BMP candidate is a validated critical-position marker.

Status: **FROZEN**

## CPOB-D007 — Position Complexity boundary

**Decision:** Reuse exact-root D2/D3 instrumentation only as technical infrastructure. PCX-H1 remains `INCONCLUSIVE`; PCX-H2 remains `NOT-CONFIRMATORILY-EVALUATED`.

Status: **FROZEN**

## CPOB-D008 — Tactical Motif / human boundary

**Decision:** TM-S2-C03 remains a machine-confirmed tactical motif only. C01/C02/C04 remain `NOT-CONFIRMED`. Human/expert evidence remains `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`.

Status: **FROZEN**

## CPOB-D009 — Deterministic first-Mtaji clock

**Decision:** Do not use first-Mtaji timing, hazard, survival, acceleration or delay as a strategic endpoint in the current engine.

Status: **FROZEN**

## CPOB-D010 — Root actor perspective

```text
actor = state.player at selected root
continuation win = terminal winner == root actor
```

Status: **FROZEN**

## CPOB-D011 — Exact legal move identity

**Decision:** Enumerate every `E.moveVariants(root)` and preserve `AI.moveKey`. Distinct Namua house-choice variants remain distinct interventions.

Status: **FROZEN**

## CPOB-D012 — Primary statistical unit

**Decision:** Primary support/inference unit is a selected root from a unique historical trajectory. Move records and continuation replicates are nested measurements, not independent roots.

Status: **FROZEN**

## CPOB-D013 — Paired continuation RNG

**Decision:** Within each root and replicate index, initialize the same derived RNG stream independently for every root move. This common-random-number pairing is a variance-control device only; replicate count does not enlarge root N.

Status: **FROZEN PRINCIPLE**

## CPOB-D014 — Primary root statistic

**Decision:** Planned primary continuous statistic is the range of move-specific root-actor empirical continuation win rates.

```text
D_range = max(p_hat_m) - min(p_hat_m)
```

Status: **FROZEN CONSTRUCT**

Numeric criticality floor and completion gate were frozen at Stage 0 technical closure in CPOB-D032/D033.

## CPOB-D015 — Administrative truncation

**Decision:** Max-continuation termination is `ADMINISTRATIVE_UNFINISHED`, not a draw/win/loss. No silent 0.5 coding.

Status: **FROZEN**

## CPOB-D016 — Continuation policy candidate menu

Prospective technical candidates:

```text
P1 = seeded normal / bao / existing top-3 immediate-score pool
P2 = seeded exact D2-ranked top-3 / bao / phase2 / Q1 research wrapper
P3 = seeded uniform exact legal technical comparator/fallback
```

Policy choice may use only Stage 0 technical criteria such as exact replay, RNG control, terminal completion, runtime and artifact feasibility. Scientific divergence/outcome magnitude is forbidden from policy selection.

Final Stage 0 selection is recorded in CPOB-D030.

Status: **FROZEN MENU / SELECTION COMPLETE**

## CPOB-D017 — Search diagnostic boundary

**Decision:** D3+Q1 exact-root candidate values may be recorded as a secondary machine axis under `exact-full-window-root-candidates/phase2-value-semantics/v1`. D3 is not ground truth.

Status: **FROZEN**

## CPOB-D018 — Stage separation

```text
Stage 0 technical only
→ Stage 1 fresh exploratory discovery
→ Stage 2 fresh formal confirmation
```

Stage 1 cannot confirm itself; Stage 2 cannot reuse Stage 1 support as confirmation evidence.

Status: **FROZEN**

## CPOB-D019 — Seed reservation

```text
Stage 0 scientific block = NONE
Stage 1 = 22600001..22603072
Stage 2 = 22700001..22706144
```

Reservation is not authorization.

Status: **FROZEN RESERVATION**

## CPOB-D020 — Stage 2 attrition allowance

**Decision:** Reserve Stage 2 at twice Stage 1 source-game capacity to anticipate identity-firewall and candidate-support attrition observed in Calibration Study 1. No result-triggered extension is allowed.

Status: **FROZEN RESERVATION PRINCIPLE**

## CPOB-D021 — Cross-stage identity firewall

Final Stage 2 formal roots must have zero Stage 1 overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

No overlap replacement.

Status: **FROZEN PRINCIPLE**

## CPOB-D022 — Candidate matcher/outcome separation

**Decision:** Candidate matchers use only frozen pre-root structural tokens. Continuation divergence is the target, not a matcher precondition.

Status: **FROZEN PRINCIPLE**

## CPOB-D023 — Candidate grammar discipline

**Decision:** Freeze feature grammar, bins, minimum support, opening/stratum diversity, deterministic ranking, support-equivalence handling and maximum candidate caps before Stage 1 generation. Manual promotion is forbidden.

Exact Stage 1 grammar is frozen in the Stage 1 exploratory spec described by CPOB-D035.

Status: **FROZEN**

## CPOB-D024 — No fabricated PV

**Decision:** Existing exact-root instrumentation does not expose a search-consistent principal variation. Use exact root tables and all-reply response envelopes unless a separate tracer is prospectively validated before scientific use.

Status: **FROZEN**

## CPOB-D025 — Authorization firewall

**Decision:** A preregistration/spec alone never authorizes scientific generation. A separate authorization bound to exact spec and source-file hashes is required.

Status: **FROZEN**

## CPOB-D026 — No-rescue

After a scientific stage starts, the following are forbidden within that version:

```text
seed extension
replacement sampling
identity-overlap replacement
replicate-count extension triggered by results
candidate matcher broadening/narrowing
threshold relaxation
endpoint substitution
continuation policy substitution
primary evaluator/depth substitution
phase reassignment
favorable subgroup promotion
multiplicity-family change
alpha change
human interpretation retrofit
manual candidate override
```

Status: **FROZEN**

## CPOB-D027 — Negative/non-estimable outcomes are valid

**Decision:** Zero candidates, zero confirmed candidates, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE` and `TECHNICAL-INCONCLUSIVE` are valid Study outcomes.

Status: **FROZEN**

## CPOB-D028 — Scientific generation remains locked

No Stage 1 or Stage 2 scientific corpus or continuation measurement is authorized by the initiation or Stage 0 closure records alone.

Status: **LOCKED**

## CPOB-D029 — Stage 0 technical validation passed

**Decision:** Accept the technical-only Stage 0 tooling after exact root-variant, house-choice, RNG, continuation replay, terminal, phase-change, structural/reply-envelope and D2/D3 diagnostic validation passed in GitHub Actions run `32624898086`, job `97158580192`.

Deterministic core identities:

```text
CPOB-S0-TECHNICAL-2026-08-23-v1
core hash = 75aaa30a9f8154873bf9391c27b4720886fce17ec7402b68800c03b2cbe276cd

CPOB-S0-CAP-AUDIT-2026-08-23-v1
core hash = 0530faca878fa71b86f6b55b355cd0b70f67b5f8c32e287b82ce10dd8bb77678
```

No scientific seed or scientific root was consumed.

Status: **FROZEN / PASS**

## CPOB-D030 — Primary continuation policy = P1

**Decision:** Freeze `P1_NORMAL_TOP3` as the post-root scientific continuation policy.

Operational semantics:

```text
AI.analyzeMove(state, "normal", suppliedRng, { evaluationProfile: "bao" })
selection = seeded uniform among the existing normal-policy top min(3,n) immediate-score pool
one persistent RNG stream per (root, rootMove, replicate)
```

Technical rationale only:

- all P1 continuations replay exactly under supplied seed;
- P2 also replayed exactly but cost about 23× P1 per recorded continuation ply on the fixed smoke workload because exact D2 search is recomputed at every continuation ply;
- P3 was cheapest but is deliberately a weak uniform-legal policy;
- P1 preserves a bounded strategy-sensitive policy while allowing exhaustive all-root-move × replicate measurement and independent remeasurement at tractable cost.

No scientific `D_range`, candidate frequency, win rate or favorable outcome was inspected to make this choice.

P2 remains a secondary root search-value instrument only. P3 remains technical-only comparator/fallback and is not an alternate primary analysis.

Status: **FROZEN**

## CPOB-D031 — Scientific replicate count = 64

**Decision:** Freeze exactly `64` continuation replicates per exact legal root move.

Each replicate index is paired across every legal root move via the same derived seed material, but each intervention receives a separately initialized RNG instance.

No result-triggered increase beyond 64 is allowed.

Status: **FROZEN**

## CPOB-D032 — Scientific continuation cap and estimability

**Decision:** Freeze maximum post-root continuation length at `200` plies.

```text
terminal before/equal cap -> ROOT_ACTOR_WIN or ROOT_ACTOR_LOSS
nonterminal after 200 post-root plies -> ADMINISTRATIVE_UNFINISHED
```

A root is primary-estimable only if **every exact legal root move terminates in all 64 replicates**. Thus every move-specific primary win rate has denominator exactly 64. A root with any administrative unfinished replicate is retained for truncation audit but excluded from primary `D_range` candidate discovery, without replacement.

The fixed technical fixture reached 64/64 terminal outcomes by cap 120 and had maximum terminal continuation ply 104. Cap 200 was chosen prospectively as a conservative buffer; this fixture result is not a population-level completion claim.

Status: **FROZEN**

## CPOB-D033 — Stage 1 high-divergence threshold

For a primary-estimable root:

```text
p_hat_m = root-actor wins / 64 for exact legal move m
D_range = max_m(p_hat_m) - min_m(p_hat_m)
highDivergence = (D_range >= 0.30)
```

**Decision:** Freeze `0.30` as the Stage 1 exploratory material-divergence floor before scientific outcome generation.

This threshold defines a machine/policy-conditioned root property only. It is not a validated win-probability-loss threshold, game-theoretic threshold, or human-importance threshold.

Status: **FROZEN**

## CPOB-D034 — Runtime is QA only

**Decision:** Wall-clock benchmark quantities are hardware/environment-specific QA. They may justify pre-generation feasibility choices but may not enter candidate matching, criticality classification, scientific ranking or formal inference.

Technical result hashes exclude wall-clock timing so the deterministic scientific/technical core can reproduce across runners.

Status: **FROZEN**

## CPOB-D035 — Stage 1 design may be frozen, but generation remains unauthorized

**Decision:** After Stage 0 technical PASS, a Stage 1 exploratory spec may freeze the fresh source-game population, outcome-blind root selection, structural candidate grammar, all-move continuation measurement, readiness gates and deterministic promotion rule.

The Stage 1 spec itself is not authorization. Scientific generation remains blocked until contract validation, runner/verifier technical validation, exact source hash binding, and a separate explicit authorization commit all pass.

Status: **FROZEN GATE / GENERATION LOCKED**
