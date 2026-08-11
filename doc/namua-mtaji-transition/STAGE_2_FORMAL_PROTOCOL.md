# Namua→Mtaji Strategic Temporal Transition — Stage 2 Formal Protocol

更新日: 2026-08-11  
Status: **FROZEN BEFORE FORMAL GENERATION**

## 1. Research question

Stage 2 tests the bounded prospective question:

> Among `hard / bao / phase2 / depth2` trajectories that reach Mtaji, is first-Mtaji frozen morphology associated with a previously ascertained Namua `capture-branch-expansion` (CBE), relative to exact-ply forced-capture-matched trajectories with no Namua CBE?

The study tests a structural association. It does **not** identify a causal effect.

## 2. Immutable inherited definitions

No prior closed-study decision is reopened.

Frozen CBE settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Frozen classifier precedence is unchanged.

Inherited Category-A definition:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

Frozen Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit, restandardization, relabeling, feature change, threshold tuning, or alternative-k rescue is authorized.

## 3. Deterministic progression boundary

For a standard trajectory surviving Namua:

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

Therefore first-Mtaji timing is not an inferential endpoint.

Unauthorized claims include:

- CBE accelerates Mtaji;
- CBE delays Mtaji;
- CBE changes first-Mtaji hazard;
- candidate-to-Mtaji distance is a survival outcome.

Exact candidate ply is the progression anchor.

## 4. Formal condition

Primary and only Stage 2 formal condition:

```text
conditionId = P2-D2
level = hard
evaluator = bao
search = phase2
maxDepth = 2
```

Rationale is outcome-independent: this exact fixed condition is the bounded context in which closed phase-transition Study 1 E-018/H16 confirmed CBE support. Restricting Stage 2 to P2-D2 also removes cross-condition duplicate-trajectory dependence observed during Stage 1.

`V2-D2` is not part of the Stage 2 formal corpus.

## 5. Formal corpus

Fixed before generation:

```text
games = 4096
opening seeds = 20280001..20284096
opening policy = seeded-uniform-legal
opening plies = 8
max ply = 100
```

The seed block is disjoint from every Stage 1 exploratory block.

No early stopping is allowed for:

- CBE count;
- MTAJI-M1/MTAJI-M2 count;
- interim effect direction;
- p-value;
- terminal count.

No additional games may be appended after the 4096-game corpus because a count or result is unfavorable.

## 6. Sample-size rationale

Sample size is an exposure-accrual planning decision, not an outcome-powered optimization.

Across consumed Stage 1 data, 9 unique CBE exposure trajectories had P2-D2 support across 1184 P2-D2 opening replicates. The crude planning rate is therefore approximately:

```text
9 / 1184 ≈ 0.0076 unique CBE trajectories per P2-D2 game
```

A 4096-game fixed corpus corresponds to roughly 31 expected unique exposures under a naive independent-rate approximation. This approximation is used only to choose a fixed corpus large enough to make the preregistered estimability gate plausible. It is not a prevalence estimate, a power claim, or a formal model assumption.

## 7. Formal exposure unit

The analysis unit is a unique complete historical trajectory.

For each `historicalTrajectoryHash`:

1. identify inherited Category-A representatives;
2. apply the frozen phenotype classifier;
3. retain fully ascertained Namua CBE events;
4. if more than one exists on the same trajectory, select the **earliest candidate ply only**;
5. duplicate games with the same complete `historicalTrajectoryHash` are one trajectory unit.

Thus each trajectory contributes at most one exposed unit.

Formal exposure key:

```text
historicalTrajectoryHash + earliestFullyAscertainedCbeCandidatePly
```

No morphology information is used to identify the CBE event.

## 8. Primary target population

The primary morphology estimand is explicitly conditional on transition to Mtaji.

An exposed trajectory enters the primary morphology analysis only if:

```text
firstMtajiMorphologyEligible == true
```

For the frozen engine this means a nonterminal first eligible Mtaji observation exists; the deterministic clock is expected to place it at ply 44.

CBE trajectories that terminate before Mtaji are not assigned an M1/M2 value and are excluded from the primary morphology estimand. Their count is reported separately.

This conditioning means the primary result is **not** an unconditional effect of CBE on all trajectories.

## 9. Formal comparator — R3-M

For each primary exposed trajectory at candidate ply `t`, a control trajectory is eligible only if all conditions below hold:

1. same formal condition P2-D2;
2. different `historicalTrajectoryHash` from every exposed trajectory;
3. observation exists at exact ply `t`;
4. index observation is nonterminal Namua;
5. observation exists at `t + 8`;
6. it is not an inherited Category-A representative at exact index `t`;
7. actor forced-capture status at `t` equals the exposed CBE status;
8. the control historical trajectory contains **no Namua CBE anywhere**;
9. `firstMtajiMorphologyEligible == true`;
10. the control historical trajectory has not already been allocated to another matched set.

This is named **R3-M**: the prospectively supported R3 structural comparator restricted to the morphology-eligible target population.

The morphology restriction is a target-population rule. M1/M2 labels themselves are not used for matching.

No matching is allowed on capture/front-row quantities that may constitute or mediate CBE.

## 10. Deterministic control allocation

Each exposed trajectory receives exactly:

```text
20 unique R3-M controls
```

Controls are selected without replacement globally across all matched sets.

Exposure processing order is the lexicographic order of:

```text
SHA256("nmt-stage2-exposure-order-v1|" + exposureKey)
```

Within an exposure, eligible unused controls are ranked by:

```text
SHA256(
  "nmt-stage2-control-rank-v1|" +
  exposureKey + "|" + controlHistoricalTrajectoryHash
)
```

The first 20 are selected.

This deterministic allocation must occur before reading M1/M2 labels.

## 11. Formal estimability gates

Primary confirmation is estimable only if both gates pass:

```text
G1: morphology-eligible unique exposed trajectories >= 20
G2: every primary exposed trajectory receives 20 unique R3-M controls
```

If G1 fails:

```text
decision = inconclusive-insufficient-exposure
```

If G2 fails:

```text
decision = inconclusive-comparator-shortage
```

No corpus extension, threshold relaxation, comparator relaxation, or outcome-guided rescue is allowed after either failure.

## 12. Primary outcome

For every unit in an estimable matched set, classify the first eligible Mtaji observation using the exact frozen classifier.

Binary coding:

```text
Y = 1 : MTAJI-M1
Y = 0 : MTAJI-M2
```

Expected candidate-definition hash must equal:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

The stored hash and recomputed canonical hash must both match before outcome analysis.

## 13. Primary statistic and exact conditional test

Each matched stratum contains:

```text
1 exposed trajectory + 20 controls
```

For stratum `i`:

```text
n_i = 21
m_i = total MTAJI-M1 units in the stratum
p_i = m_i / n_i
```

Observed statistic:

```text
T = number of exposed trajectories classified MTAJI-M1
```

Under the matched-set exchangeability null, the conditional probability that the exposed position carries M1 in stratum `i` is `p_i`.

The null distribution of `T` is the exact Poisson-binomial convolution of the stratum probabilities `{p_i}`.

Two-sided p-value:

```text
p_lower = P(T <= T_obs)
p_upper = P(T >= T_obs)
p_two_sided = min(1, 2 * min(p_lower, p_upper))
```

Primary alpha:

```text
0.05, two-sided
```

No directional alternative is preregistered.

## 14. Primary effect summaries

Report without changing the decision rule:

```text
exposed M1 proportion
pooled matched-control M1 proportion
mean within-stratum matched risk difference
Mantel-Haenszel common odds ratio
```

For stratum `i`, with 2x2 counts `a_i,b_i,c_i,d_i` for exposed/control × M1/M2:

```text
OR_MH = sum(a_i*d_i/n_i) / sum(b_i*c_i/n_i)
```

Zero or infinite values are reported as such; no continuity correction is used to rescue estimation.

The exact conditional p-value, not the descriptive effect summary, controls the formal decision.

## 15. Formal decision rule

After integrity, classifier, G1, and G2 pass:

```text
if p_two_sided < 0.05:
    confirmed-association
else:
    not-confirmed
```

If confirmed:

```text
matched risk difference > 0
  -> direction label: CBE-associated-with-MTAJI-M1

matched risk difference < 0
  -> direction label: CBE-associated-with-MTAJI-M2
```

If the matched risk difference is exactly zero, direction is `none` even if numerical edge behavior were to produce a nominal test result; such a state must be reported and not narratively rescued.

Allowed interpretation:

> Within the frozen P2-D2, Mtaji-reaching target population, prior fully ascertained Namua CBE is or is not associated with first-Mtaji frozen morphology relative to exact-ply R3-M controls.

Unauthorized interpretation:

- CBE causes M1 or M2;
- CBE changes Mtaji timing;
- result generalizes to all search/evaluator/depth configurations;
- M1/M2 are universal Bao strategic types;
- failure confirms absence of all temporal structure.

## 16. Multiplicity

There is one primary formal test.

```text
family-wise alpha = 0.05
multiplicity correction = none required
```

Any additional morphology-axis, structural-trajectory, alternative-comparator, V2-D2, or subgroup analysis is secondary/exploratory unless separately preregistered before inspecting Stage 2 outcomes.

## 17. Terminal-before-Mtaji reporting

Before morphology analysis, report for all unique earliest-CBE trajectories:

```text
CBE trajectories total
CBE trajectories reaching Mtaji
CBE trajectories terminal before Mtaji
administrative truncation
```

These are descriptive and do not alter the primary decision rule.

No terminal trajectory is imputed as M1 or M2.

## 18. Duplicate identity and independence rules

Complete historical trajectory identity dominates seed, gameId, or replicate identity.

- duplicate games sharing `historicalTrajectoryHash` collapse to one canonical trajectory;
- canonical representative is lexicographically smallest `gameId`;
- one exposed trajectory maximum per historical trajectory;
- control historical trajectories are globally non-reused;
- exposed trajectories can never be controls.

The formal analysis must report raw-game and unique-trajectory counts.

## 19. Outcome firewall and execution order

Required order:

1. generate complete fixed corpus;
2. verify replay/provenance/identity;
3. verify deterministic Namua clock;
4. run inherited Category-A pipeline;
5. classify frozen Namua events;
6. construct exposure units and R3-M matched sets **without reading M1/M2 labels**;
7. evaluate G1/G2;
8. audit frozen Mtaji artifact hash;
9. only if G1/G2 pass, classify first-Mtaji M1/M2 and run the formal test.

The analysis implementation must keep matched-set construction and morphology classification as distinct phases or functions so the firewall is auditable.

## 20. Formal data boundary

Stage 1 primary pilot, extension #1, and final extension are consumed and excluded from Stage 2 formal inference.

Stage 2 formal corpus is one-shot held-out evidence. It cannot be supplemented, rerun with alternative seeds, or selectively filtered after outcome inspection to improve the result.
