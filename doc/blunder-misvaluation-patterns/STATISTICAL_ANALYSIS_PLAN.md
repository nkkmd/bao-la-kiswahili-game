# STATISTICAL_ANALYSIS_PLAN — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20  
Status: **STAGE 0 DESIGN — NOT A STAGE 1 OR STAGE 2 GENERATION AUTHORIZATION**

## 1. Statistical/support unit

Primary recurrence and formal inference should be trajectory-aware.

Preferred candidate-specific formal unit:

```text
one prospectively selected eligible root
per unique historicalTrajectoryHash
per candidate
```

Exact duplicate `ruleStateKey` roots collapse without favorable replacement. Repeated nearby plies from one game are not independent observations.

## 2. Actor normalization

```text
actor = selected root state.player
```

All candidate search values, static post-move evaluations and structural deltas used for the decision-loss construct are expressed from the root actor perspective.

No seat-dependent sign adjustment may be introduced after outcome inspection.

## 3. Search-based primary construct

Primary reference:

```text
D3 + quiescenceDepth 1
exact full-window root-candidate search
evaluationProfile = bao
```

For ordinary-domain candidate/root pairs:

```text
rawRegret = bestD3Score - candidateD3Score
```

For mate/cross-domain cases, use the frozen domain-aware representation defined after Stage 0 fixture validation. Cross-domain values are not pooled as ordinary numeric evaluator-point regret.

## 4. Rank construct

Secondary same-root rank variables may include:

```text
scoreRank
isTopSet
isBelowStateMedian
isUniqueWorst
normalizedRankLoss
```

State median must be computed deterministically from all exact legal D3 candidate scores.

## 5. Stage 1 exploratory analysis

Stage 1 is discovery-only.

Allowed:

- support/count/coverage audits;
- candidate grammar enumeration;
- D3 decision-loss/rank descriptive summaries;
- D1/D2→D3 disagreement summaries;
- static-vs-D3 descriptive disagreement;
- structural/reply failure summaries;
- opening/generation-stratum concentration audits;
- deterministic promotion under prospectively frozen rules;
- compute/readiness assessment for Stage 2.

Forbidden:

- treating Stage 1 p-values as formal confirmation;
- outcome-dependent seed extension;
- manual favorable candidate promotion;
- switching primary depth after observing Stage 1 results;
- using Calibration Study 1 isotonic mapping as validated win probability;
- reusing Stage 1 support as Stage 2 confirmation evidence.

## 6. Stage 2 formal architecture

Before any Stage 2 generation, freeze exact candidate set and formal rule.

Working candidate-level co-primary architecture:

### Endpoint A — decision-loss recurrence

A binary success indicating that the candidate satisfies the prospectively frozen D3 inferior-value criterion. Working design candidate:

```text
candidate D3 value strictly below same-root D3 median
OR a prospectively defined worse cross-domain transition
```

### Endpoint B — candidate-specific failure recurrence

A binary success indicating that the candidate's frozen structural/reply/misvaluation failure signature occurs.

Both co-primary endpoints must pass for a positive candidate decision.

Exact null benchmarks, minimum observed-rate gates, sample-size/estimability gates and test family are not Stage 2-frozen yet. They must be fixed before Stage 2 generation and cannot be relaxed after fresh outcomes.

## 7. Multiplicity

If multiple candidates/endpoints are tested, multiplicity must be controlled prospectively.

Preferred default, subject to final candidate count:

```text
Holm-Bonferroni FWER = 0.05
across all planned candidate × co-primary endpoint tests
```

Non-estimable planned endpoints should remain represented in the multiplicity family under a frozen conservative convention rather than being dropped favorably.

## 8. Phase role

Phase is part of candidate definition or a prospectively fixed stratification variable. Do not pool Namua/Mtaji for convenience after seeing results.

A candidate may be phase-bounded and still be transferable within that phase.

## 9. Fresh deterministic continuation

Continuation outcome is optional key-secondary evidence, not the default primary endpoint.

If authorized, candidate and reference branches must use the same frozen continuation policy and maximum ply. Administrative truncation is not a draw and requires a preregistered estimability rule.

The inferential statement is limited to:

```text
empirical branch outcome under the frozen continuation policy and sampled root population
```

It is not intrinsic win probability.

## 10. Identity firewall

Stage 2 must be fresh relative to Stage 1 on at least:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Candidate support identity hashes must also be carried so support-equivalent definitions can be detected before Stage 2 data exist.

## 11. Formal labels

Preferred candidate-specific formal labels:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

## 12. No-rescue rule

After a formal stage begins, do not alter its result through:

- seed/game extension;
- favorable replacement;
- candidate merge/split/substitution;
- threshold relaxation;
- primary depth change;
- endpoint substitution;
- dropping failed planned tests;
- calibration mapping promotion;
- descriptive outcome rescue;
- post-hoc phase pooling/splitting.

A scientifically justified redesign requires a new prospective version and fresh data.
