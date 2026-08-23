# Critical Positions / Outcome Branching Study 1 — Overview

Updated: 2026-08-23  
Status: **ACTIVE / STAGE 0 DESIGN ONLY**

## 研究目的

この研究は、「対局後に勝敗が分かれた地点」を重要局面と呼ぶのではなく、同一root stateで合法手だけを変え、その後を同じprospectively frozen continuation policyで進めたときに、outcomeが再現可能にどの程度分岐するかを調べる。

中心constructは:

```text
fixed-policy empirical continuation divergence
```

である。

## 重要な分離

```text
A. empirical continuation outcome divergence  ← primary
B. search-value separation                    ← secondary machine axis
C. move-ranking instability                   ← secondary machine axis
D. structural branch divergence               ← secondary structural axis
E. game-theoretic criticality                 ← not inferred here
F. human-perceived criticality                ← no human evidence in Study 1
```

Engine score difference is not converted into a validated win-probability difference.

## Root intervention design

For root state `s` and root actor `a = s.player`:

1. enumerate all exact legal `E.moveVariants(s)`;
2. preserve exact move identity with `AI.moveKey`;
3. apply each root move as an intervention;
4. start a fresh seeded continuation RNG for each move using the same root-level replicate index;
5. continue under one frozen policy until terminal or the frozen administrative maximum;
6. encode terminal winner from the original root actor perspective;
7. compare move-specific empirical continuation outcome distributions within the root.

Replicates are nested inside `root × move` and do not become independent root samples.

## Planned root-level primary measurement

For move `m`, let `p_hat(s,m)` be the empirical root-actor continuation win rate among prospectively eligible terminal replicates.

Planned primary summary:

```text
D_range(s) = max_m p_hat(s,m) - min_m p_hat(s,m)
```

`D_range` is policy-conditioned. It is not the game-theoretic value range of the moves.

A numeric decision-critical threshold will be frozen before Stage 1 generation. The current design target is an absolute range floor around 0.30; it remains provisional during Stage 0 and cannot be tuned after scientific outcomes exist.

## Continuation policy candidates

Stage 0 compares policy candidates using technical criteria only:

1. **seeded normal / bao** — existing implementation; top up to three immediate-score-ranked exact moves, then seeded uniform choice;
2. **seeded D2-ranked top-3 / bao / phase2 / Q1** — proposed research wrapper; exact D2 root table then seeded choice among deterministic top three;
3. **seeded uniform exact legal** — simple technical comparator/fallback.

No policy is chosen because it produces larger or more favorable divergence. Exact policy selection and source hash must be frozen before Stage 1 scientific generation.

## Study stages

```text
Stage 0
  technical / construct / feasibility only
  no scientific corpus

Stage 1
  fresh exploratory corpus
  discover structural candidate classes predicting large D_range
  output is exploratory and consumed

Stage 2
  fresh non-overlapping formal corpus
  exact Stage 1 candidate matchers only
  prospective formal confirmation
```

Zero candidates, zero confirmations, non-estimability and technical inconclusive are valid outcomes.

## Identity / dependence

Minimum cross-stage identities:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Stage 1/2 selection is trajectory-aware, exact duplicate rule states collapse, and root-level inference is not inflated by multiple plies or continuation replicates from one trajectory.

## Human and game-theoretic boundary

Study 1 can establish only machine-defined policy-conditioned criticality under frozen conditions. It cannot establish that experts consider the position important, that a move is theoretically winning, or that the state is a unique true turning point.
