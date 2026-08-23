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

Numeric criticality floor and completion gate remain provisional until Stage 0 technical close and must be frozen before any Stage 1 scientific outcome exists.

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

Status: **PROVISIONAL / MUST FREEZE BEFORE STAGE 1**

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

Status: **FROZEN PRINCIPLE / NUMBERS PENDING STAGE 0**

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

No Stage 1 or Stage 2 scientific corpus or continuation measurement is authorized by this initiation commit.

Status: **LOCKED**
