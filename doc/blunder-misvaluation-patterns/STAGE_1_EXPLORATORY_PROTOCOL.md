# STAGE_1_EXPLORATORY_PROTOCOL — Blunder / Misvaluation Patterns Study 1

Date frozen: 2026-08-20

Stage ID: `BMP-S1-EXPLORATORY-2026-08-20-v1`

Machine-readable spec:

`doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json`

Frozen spec SHA-256:

`f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd`

Status: **PROSPECTIVE EXPLORATORY SPEC FROZEN / CONTRACT VALIDATION PENDING / SCIENTIFIC GENERATION NOT AUTHORIZED**

## 1. Purpose

Stage 1 is a fresh exploratory discovery stage for machine-reproducible bad-move / misvaluation pattern candidates.

It cannot:

- confirm a blunder family;
- claim game-theoretic optimality;
- claim validated win-probability loss;
- make human misconception / beginner / expert / pedagogical claims;
- rescue or change any completed Bao study;
- authorize Stage 2.

Zero promotable candidates is a valid outcome.

## 2. Technical-feasibility basis

Before freezing the scientific population, Stage 0 measured D1/D2/D3+Q1 plus all-legal-move structural/reply workload on deterministic no-RNG fixture walks at source commit:

`45ce006eb63d5555a030d50fe7aa4e97637db327`

The returned benchmark had:

- Namua technical roots: 4/4 requested;
- Mtaji technical roots: 4/4 requested;
- coverage: PASS;
- overall mean total measurement: about 214.4 ms/root;
- overall median total measurement: about 139.4 ms/root;
- projected serial workload for 2,000 measured roots: about 0.119 h (~7.15 min).

The benchmark emitted no scientific score, regret, candidate, or game-outcome evidence.

Decision: retain the already frozen D3+Q1 primary reference. Use the full previously reserved Stage 1 seed capacity as an exact, non-extendable scientific population.

## 3. Population and fresh seed block

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
opening randomized plies = 8
```

All 2,048 reserved Stage 1 seeds are consumed by the fixed design. There is no unused within-study extension capacity.

The first 8 plies of every trajectory use seeded uniform sampling from exact `E.moveVariants(state)`.

No scientific-outcome early stopping, replacement, or seed extension is allowed.

## 4. Trajectory-generation strata

Assignment is exact `gameIndex mod 6` with 0-based game indices.

| remainder | stratum | expected games | evaluator | search | depth |
|---:|---|---:|---|---|---:|
| 0 | `B-D1` | 342 | `bao` | `phase2` | 1 |
| 1 | `B-D2` | 342 | `bao` | `phase2` | 2 |
| 2 | `B-D3` | 341 | `bao` | `phase2` | 3 |
| 3 | `LS-D2` | 341 | `bao` | `legacy` | 2 |
| 4 | `V2-D2` | 341 | `bao-v2` | `phase2` | 2 |
| 5 | `LE-D2` | 341 | `legacy` | `phase2` | 2 |

These are trajectory-generation diversity strata only. They are not comparative scientific endpoints.

All AI strata are fixed-depth, infinite-time-limit, non-adaptive and non-aspiration-window generation.

## 5. Identity and root selection

Primary support identity remains `historicalTrajectoryHash`.

Selection order is frozen:

1. generate exactly 2,048 trajectories;
2. collapse identical `historicalTrajectoryHash`, retaining minimum seed then `gameId`;
3. hash-assign each unique trajectory to Namua or Mtaji using `BMP-S1-PHASE-v1` parity;
4. within the assigned phase, choose one eligible root by minimum SHA-256 rank using `BMP-S1-STATE-v1`;
5. root eligibility requires ply >= 8, nonterminal state and at least 2 exact `E.moveVariants`;
6. unavailable assigned phase means no replacement and no phase reassignment;
7. collapse duplicate selected `ruleStateKey` roots, retaining lowest historical-trajectory hash then seed;
8. within each phase, hash-rank survivors with `BMP-S1-QUOTA-v1`;
9. select exactly 600 Namua and 600 Mtaji roots if both pools are sufficient.

If either phase cannot provide its frozen quota after these outcome/value-independent steps, readiness fails. Do not extend the corpus or reassign trajectories.

Thus the Stage 1 measurement target is exactly 1,200 unique rule-state roots when readiness passes, with at most one root per unique historical trajectory.

## 6. Measurement surface

Every selected root measures **all exact legal `E.moveVariants(state)`**.

Frozen root search:

```text
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
depths = D1, D2, D3
primary = D3
quiescenceDepth = 1
evaluationProfile = bao
perspective = original root actor
```

Per move, record:

- exact `AI.moveKey`;
- coarse-no-index and indexed move abstractions;
- immediate transition/events;
- actor/opponent structural deltas;
- all-immediate-reply response envelope;
- D1/D2/D3 score/rank/TopSet;
- D3 state-median relation;
- domain-aware decision loss;
- normalized D3 rank loss;
- static post-move `bao` score/rank from the original root actor perspective.

D4 is not measured in Stage 1.

Fresh deterministic continuation / game-outcome branches are not measured in Stage 1.

Search-consistent PV is not required and must not be fabricated.

## 7. Primary exploratory decision-loss event

The primary recurrence descriptor for candidate promotion is:

```text
d3-inferior-v1 =
  candidate is NOT in D3 TopSet
  AND
  (
    candidate is strictly below the same-root D3 state median
    OR
    candidate occupies a worse score domain than the best D3 move
  )
```

Tied D3 best moves have regret 0.

Ordinary evaluator regret, same-mate-domain distance regret and cross-domain drops remain separate. Raw mate-scale and ordinary-scale regrets are never pooled as one severity measure.

## 8. Candidate matcher and failure signature

A candidate is represented as:

```text
mandatory phase
+ 1–2 structural precondition tokens
+ exactly one move-abstraction token
+ exactly one failure-signature token
```

The **Stage 2-usable matcher excludes the failure token**.

Therefore:

```text
matcher opportunity =
  phase + preconditions + move abstraction
```

For each matcher and selected trajectory, if multiple exact legal moves match, the opportunity representative is the lexicographically smallest exact `AI.moveKey`.

This representative is chosen without reference to D3 loss, failure signature, static score or game outcome.

The failure-signature rate and D3-inferior rate are then computed over **all matcher opportunities**, not only over favorable/bad observed records.

This is the central anti-selection-bias rule of Stage 1.

## 9. Structural precondition grammar

Exactly 1 or 2 additional precondition tokens are allowed, excluding the mandatory phase token. At most one token from each family is allowed.

Frozen families/bins:

- capture regime: `none`, `forced`, `mixed`;
- legal move count: `2`, `3-4`, `5+`;
- capture move count: `0`, `1`, `2+`;
- reserve: `0`, `1-4`, `5-12`, `13+`;
- house owned: `false`, `true`;
- nyumba seeds: `0`, `1-4`, `5+`;
- front occupied: `0-2`, `3-5`, `6-8`;
- front connections: `0-1`, `2-4`, `5+`;
- reusable pits: `0-2`, `3-5`, `6+`.

Move abstractions are exactly:

- `coarse-no-index`;
- `indexed`.

## 10. Failure-signature grammar

Exactly one failure token is attached to each candidate definition.

Frozen families:

### Immediate structural

- actor legal-move delta negative;
- actor capture-move delta negative;
- actor front-connections delta negative;
- actor reusable-pits delta negative;
- actor nyumba-seeds delta negative;
- actor house ownership lost.

### Response envelope

- all replies reduce actor legal moves;
- all replies reduce actor capture moves;
- worst reply reduces actor front connections;
- worst reply reduces actor reusable pits;
- an immediate opponent winning reply exists.

### Forcing response

- exactly one reply and actor legal moves decline;
- exactly one reply and actor capture moves decline.

### Horizon misvaluation

- D1 TopSet but D3 non-TopSet;
- D2 TopSet but D3 non-TopSet;
- D2 at/above median but D3 below median.

### Static misvaluation

- static post-move TopSet but D3 non-TopSet;
- static post-move at/above median but D3 below median.

These are machine operationalizations only.

## 11. Readiness gates before discovery

After generation, independent verification and frozen root selection, all of the following must pass:

```text
unique historical trajectories >= 1600
selected unique rule states = 1200
Namua selected roots = 600
Mtaji selected roots = 600
distinct opening-prefix identities >= 128
selected roots per generation stratum >= 100
measured exact move records >= 3600
every selected root has a finite complete D3 candidate table
```

If a gate fails, Stage 1 is insufficiently estimable. No replacement, phase reassignment or seed extension is allowed.

## 12. Candidate detailed-audit threshold

A matcher must have at least 12 unique historical-trajectory opportunities before detailed candidate records are retained.

Below that threshold, preserve count/hash summary only. Do not silently discard the existence of low-support grammar keys.

## 13. Deterministic promotion gates

A candidate may be promoted to Stage 2 planning only if all gates pass over its outcome-blind matcher opportunities:

```text
unique opportunity trajectories >= 24
unique opportunity rule states >= 24
failure-positive unique trajectories >= 16
distinct opening prefixes >= 6
maximum one opening-prefix share <= 0.40
generation strata represented >= 3
maximum one generation-stratum share <= 0.60
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Passing is exploratory promotion only, not confirmation.

## 14. Support-equivalent candidate collapse

Before final ranking/capping, compute each matcher opportunity identity as SHA-256 of sorted:

```text
historicalTrajectoryHash | ruleStateKey | moveKey
```

Two candidates are support-equivalent only when they have:

- the same opportunity identity hash; and
- the same failure token.

Retain the lower-complexity pattern, then lexicographically smaller candidate key.

Frozen complexity:

```text
number of precondition tokens
+ 1 if move abstraction is indexed
```

## 15. Promotion ranking and cap

Eligible non-equivalent candidates are ranked by:

1. `min(D3-inferior rate, failure-signature rate)` descending;
2. opportunity trajectory support descending;
3. D3-inferior rate descending;
4. failure-signature rate descending;
5. median normalized rank loss descending;
6. pattern complexity ascending;
7. candidate key ascending.

Automatic cap:

```text
maximum total = 6
maximum per phase = 3
maximum per failure family = 2
```

Manual promotion override is forbidden.

Failed and capped-out candidates remain auditable.

## 16. Opening-family transferability audit

Opening family is SHA-256 of the ordered exact first-8-ply `AI.moveKey` prefix with explicit prefix length.

Each promoted candidate requires:

- >= 6 distinct opening-prefix identities;
- no single prefix > 40% of opportunities.

This is intended to prevent one opening family from masquerading as a position-transferrable bad-move pattern.

## 17. Authorization firewall

This frozen spec does **not** authorize scientific generation.

Before generation:

1. the machine-readable spec validator must PASS;
2. the Stage 1 contract tests must PASS;
3. a scientific runner and independent replay/search verifier must be implemented without changing this contract;
4. that implementation must pass a separate technical validation;
5. exact spec SHA-256 and exact source-file SHA-256 mapping must be frozen;
6. a separate `STAGE_1_EXPLORATORY_AUTHORIZATION.json` must explicitly authorize the source-bound generation.

At this checkpoint no such authorization exists.

## 18. Scientific execution order after future authorization

Only after the separate authorization gate:

```text
generate
→ independent full replay/search verify
→ select
→ readiness audit
→ measure
→ measurement-readiness audit
→ discover
```

A failed gate blocks later scientific steps.

## 19. Stage 2 boundary

Stage 1 seeds, roots and support cannot confirm Stage 1 candidates.

Before Stage 2 data exist, promoted candidates must receive a separate formal freeze covering matcher, failure endpoint, decision-loss endpoint, estimability, multiplicity, alpha, decision labels and fresh Stage 2 seed usage.

## 20. Interpretation boundary

Stage 1 may support only:

> exploratory machine-reproducible candidate patterns under the frozen engine/search/evaluator operationalization.

It does not support:

- game-theoretic blunder claims;
- true/validated win-probability loss;
- human misconception claims;
- beginner/expert behavior;
- pedagogical importance;
- traditional Bao terminology recognition.
