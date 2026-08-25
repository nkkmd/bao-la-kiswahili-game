# PCEM-STUDY1 — Stage 1 Exploratory Design Skeleton

Status: **NOT AUTHORIZED / NUMERICAL DESIGN NOT YET FROZEN**

This file is a prospective skeleton only. Stage 1 scientific generation may not begin until all `TO-FREEZE` fields below are replaced by exact values/rules after Stage 0 technical-only validation.

## Scientific role

```text
stageLabel = EXPLORATORY-ONLY
scientificInferenceAuthorized = exploratory-only
confirmatoryReuseAllowed = false
```

## Fresh source population

TO-FREEZE before Stage 1:

```text
seedStart
seedEnd
gameCount
generation strata
opening policy
maximum game ply
historical trajectory identity
opening-prefix identity
phase quotas
root sampling rule
```

Stage 1 seed block must not overlap any reserved Stage 2 block.

## Root eligibility

Mandatory base conditions:

```text
RAW representation valid
pending present before engine entry
seed invariant = 64
nonterminal
>= 2 exact legal root moves
Namua / Mtaji assigned from raw state
```

The disadvantaged-root rule must be frozen before outcomes and must not use the Calibration Study isotonic mapping.

Preferred family to resolve after Stage 0 technical audit:

```text
outcome-blind reference-search disadvantage
+ phase-specific selection/quota
```

Exact score/rank/quantile threshold is TO-FREEZE.

## Reference comparator

TO-FREEZE exactly:

```text
reference search profile
reference evaluation profile
reference fixed depth
quiescence settings
time-limit behavior
all-legal-move score/rank procedure
tie handling
```

For each root move, record at least:

```text
referenceScore
referenceRank
referenceBestIndicator
moveOptimalityGap
```

## Primary imperfect opponent policy

TO-FREEZE exactly before Stage 1:

```text
policy implementation
strength/configuration
RNG algorithm/binding
root-actor continuation policy
opponent continuation policy
first-reply policy semantics
```

A separate reference-opponent condition should be retained as a robustness comparator if technically feasible.

If additional opponent-strength conditions are included, their roles (primary / secondary / co-primary) and multiplicity handling must be frozen before outcomes.

## Comeback endpoint

Preferred primary family:

```text
bounded-horizon root-actor terminal win indicator
```

TO-FREEZE:

```text
post-root horizon H
replicates per exact root move
terminal/draw/cutoff accounting
technical-invalid handling
```

The endpoint is policy-conditioned and bounded-horizon; it is not “true Bao winning probability.”

## First-reply measurements

For every exact root move where technically valid, enumerate all exact legal opponent first replies and record:

```text
legalReplyCount
referenceBestReplyCount
successfulDefenseReplyCount
punishingReplyCount
uniqueLegalReply
uniqueReferenceBestReply
uniqueSuccessfulDefense
noSuccessfulDefense
defensiveReplyFraction
machineReplyDifficultyIndex if prospectively frozen
```

The exact `successfulDefense` and `punishingReply` definitions are TO-FREEZE and may not be derived from post-hoc favorable outcomes.

## Opponent-error dependence

At minimum record per root move:

```text
observed first-reply selections across replicates
firstReplyErrorIndicator under frozen successful-defense rule
firstReplyErrorRate
comeback frequency conditional on error
comeback frequency conditional on successful defense
```

If a reference-opponent continuation condition is included, record the paired imperfect-vs-reference comeback-frequency difference.

## Root-paired comparison

For each root, all measured legal moves remain clustered within that root. Candidate discovery should prioritize root-paired contrasts such as:

```text
DeltaComeback(candidate, reference-best)
DeltaReference(candidate, reference-best)
DeltaReplyNarrowness(candidate, reference-best)
DeltaErrorRate(candidate, reference-best)
```

Continuation replicates are not independent roots.

## Candidate representation universe

Before Stage 1 outcome inspection, freeze a bounded feature universe drawn only from prospectively listed families such as:

```text
phase
root morphology
root move type
capture structure
reply-set structure
forcedness
branching
reserve structure
nyumba/house status
front/back row structure
reusable pit count
capture source/target morphology
prospectively defined continuation-response concentration
```

TO-FREEZE:

```text
exact feature list
exact discretization/binning
maximum interaction order
candidate equivalence/deduplication rule
```

This is a new PCEM representation; it is not an expansion or rescue of the CPOB frozen 1–2 token grammar.

## Promotion rule

TO-FREEZE before Stage 1 outcomes:

```text
minimum unique-root support
minimum unique historical trajectories
minimum opening-family diversity
minimum phase support or phase-specific rule
maximum dependence on one source stratum
minimum practical-vs-reference comeback difference
minimum opponent-error dependence
maximum/minimum allowed optimality gap
reply-narrowness/reply-difficulty condition
promotion multiplicity/equivalence rule
```

`zeroPromotedCandidatesAllowed = true`.

Manual promotion is forbidden.

## Stage 1 result vocabulary

Stage 1 may produce only exploratory labels and promotion decisions. A candidate is not `CONFIRMED` in Stage 1.

If zero candidates pass the frozen promotion rule:

```text
Stage 1 = EXPLORATORY-ONLY
promotedCandidateCount = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```
