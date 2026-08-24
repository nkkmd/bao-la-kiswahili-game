# CPOB Study 1 — Stage 1 discovery complete / zero promoted candidates / study closure

Date: 2026-08-24  
Study: `CPOB-STUDY1`  
Stage: `CPOB-S1-EXPLORATORY-2026-08-23-v1`

## Preconditions already passed

Before discovery, all frozen upstream firewalls had passed:

```text
source generation = COMPLETE / 3072 of 3072
independent full corpus replay = PASS
outcome-blind root selection = PASS / 600 = 300 Namua + 300 Mtaji
measurement readiness = PASS
independent root reselection = 600
full continuation remeasurement = true
full secondary recomputation = true
full structural recomputation = true
primary estimable roots = 600 / 600
```

No root replacement, phase reassignment, seed extension, replicate extension, continuation-policy substitution or threshold retuning was performed.

## Discovery artifact identity

User-supplied local discovery artifact:

```text
file = discovery-result.json (uploaded copy named discovery-result(2).json)
raw file SHA-256 = e1931c0f84b294bf8201e7732756bf156d688e4a38d55587e61b7303848d5024
embedded resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
```

Large candidate-level discovery output remains local. A compact repository synthesis is stored at:

```text
doc/critical-positions-outcome-branching/results/STAGE_1_EXPLORATORY_SUMMARY.json
```

## Frozen discovery result

```text
selectedRoots = 600
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
zeroPromotedCandidatesAllowed = true
manualOverridePerformed = false
```

Therefore the deterministic Stage 1 discovery result is a valid **zero-promoted-candidate negative exploratory result**.

## High-divergence root existence observation

The frozen candidate audit includes disjoint single-token `legalMoveCount` bins (`2`, `3-4`, `5+`) that partition all selected roots within each phase. Summing those bins gives:

```text
Namua: 52 / 300 high-divergence roots = 0.1733333333
Mtaji: 87 / 300 high-divergence roots = 0.29
overall: 139 / 600 = 0.2316666667
```

Thus materially divergent fixed-policy continuation outcomes do occur in the selected Stage 1 population. This is an exploratory machine/policy-conditioned observation, not a game-theoretic winning-probability claim.

## Structural recurrence result

No candidate in the frozen pre-root structural grammar passed all promotion gates. The frozen promotion requirements included:

```text
opportunity unique historical trajectories >= 24
opportunity unique rule states >= 24
high-divergence unique historical trajectories >= 16
distinct opening prefixes >= 6
maximum single opening-prefix share <= 0.40
generation strata >= 3
maximum single generation-stratum share <= 0.60
high-divergence rate >= 0.65
median D_range >= 0.35
```

Across the 1183 audits, individual gate pass counts were:

```text
opportunityUniqueHistoricalTrajectories = 748
opportunityUniqueRuleStates = 748
highDivergenceUniqueHistoricalTrajectories = 244
distinctOpeningPrefixes = 1045
maximumSingleOpeningPrefixShare = 1105
generationStrata = 1086
maximumSingleGenerationStratumShare = 1111
highDivergenceRate = 52
medianDRange = 54
```

These counts are descriptive audit decomposition only. They do not authorize threshold relaxation or near-miss promotion.

## Stage 2 decision

Stage 2 required a separate freeze of exact Stage 1 promoted candidate mappings before any Stage 2 data generation. Because:

```text
promotedCandidateCount = 0
```

there is no candidate mapping to carry prospectively into Stage 2 under the current study definition.

Starting Stage 2 by lowering thresholds, redefining matchers, selecting near misses, changing the grammar, or manually promoting a candidate would violate the frozen no-rescue rule. Therefore:

```text
Stage 2 generation = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 22700001..22706144 = RESERVED / UNCONSUMED
Study 1 = CLOSED AFTER STAGE 1 NEGATIVE EXPLORATORY RESULT
```

This is not a `NOT-CONFIRMED` formal candidate result: no candidate entered formal confirmation.

## Interpretation boundary

The closure supports only the following bounded statements:

1. Under the frozen `P1_NORMAL_TOP3` continuation policy and selected Stage 1 population, high-divergence roots existed.
2. The prospectively frozen one-to-two-token structural matcher grammar did not yield any candidate satisfying all promotion gates.
3. No Stage 2 formal confirmation was run because no Stage 1 candidate was eligible for prospective candidate freeze.

It does **not** establish:

```text
absence of true/game-theoretic turning points
absence of other predictive structural representations
absence of useful multi-feature/nonlinear classifiers
absence of human-recognizable critical positions
absence of expert/traditional turning-point concepts
validated engine-score-to-win-probability conversion
```

Any broader classifier, alternate grammar, lower threshold, different continuation policy or human/expert study must be a new prospective independent study with fresh evidence.
