# PCRPR-STUDY1 — Feature Dictionary

Updated: 2026-08-29  
Schema: `PCRPR_FEATURES_STAGE0_V1`  
Stage 0 decision: `STAGE0-TECHNICAL-PASS`

This dictionary records the 80 scalar features technically validated by `PCRPR-S0-TECHNICAL-2026-08-29-v1`. All features are machine-operational and outcome-independent. They are not human-difficulty measures.

## Global contracts

```text
unit = historical RAW root occurrence × exact root-move variant
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
root/reply ordering = ascending lexical exact move identity
search = pcrpr-exact-full-window/bao/q0/v1
reply quality perspective = replying player
D2 gap = D2 best reply score - reply D2 score
exact scalar encoding = IEEE-754 binary64 big-endian lowercase hex
exact feature equality = required
```

Leakage classes:

```text
A = PRE_ROOT_OBSERVABLE
B = ROOT_OR_REPLY_DERIVED_OUTCOME_INDEPENDENT
C = SEARCH_OR_POLICY_DISTRIBUTION_DERIVED_OUTCOME_INDEPENDENT
D = CONTINUATION_OR_FUTURE_OUTCOME_DERIVED / predictor prohibited
```

For a root move that immediately terminates the game, reply-dependent scalars are zero and `immediateTerminalAfterRootMove` / `rootMoveTerminal` carry applicability explicitly.

## 1. `REPLY_SET_WIDTH` — class B

| Feature | Definition |
| --- | --- |
| `legalReplyCount` | exact legal opponent replies after root move |
| `log1pLegalReplyCount` | `log(1 + legalReplyCount)` |
| `replyCaptureCount` | capture replies |
| `replyPassCount` | pass replies |
| `replyTakataCount` | takata replies |

## 2. `DEFENSE_MAINTAINING_REPLY_FRACTION` — class C

A defense-maintaining reply is exactly a top-set reply under the frozen full-window search at the stated depth.

| Feature | Definition |
| --- | --- |
| `d1TopSetCount` | number of D1 top-set replies |
| `d1TopSetFraction` | D1 top-set count / legal replies |
| `d2TopSetCount` | number of D2 top-set replies |
| `d2TopSetFraction` | D2 top-set count / legal replies |

## 3. `REPLY_QUALITY_DISTRIBUTION` — class C

All gap quantities use non-negative D2 best-minus-reply gaps.

```text
d2GapMin
d2GapMax
d2GapMean
d2GapStd
d2GapQ25
d2GapQ50
d2GapQ75
distinctD2ScoreCount
```

Standard deviation is population SD. Quantiles use linear interpolation at `h=(n-1)p`.

## 4. `PUNISHMENT_CONCENTRATION` — class C

Only strictly positive D2 gaps contribute to punishment mass.

```text
positiveGapCount
positiveGapFraction
positiveGapTotal
positiveGapTop1Share
positiveGapTop2Share
positiveGapHhi
```

If positive-gap total is zero, all shares/concentration values are zero.

## 5. `BEST_REPLY_GAP_VECTOR` — class C

```text
d1BestToSecondGap
d2BestToSecondGap
d2BestToMedianGap
d2BestToWorstGap
```

A missing second reply gives a best-to-second gap of zero.

## 6. `FORCING_REPLY_STRUCTURE` — class B/C

```text
uniqueLegalReply
uniqueD2BestReply
allRepliesCapture
anyReplyCapture
d2TopSetCount
immediateTerminalAfterRootMove
```

`allRepliesCapture` is zero for a zero-reply terminal successor rather than vacuously true.

## 7. `REPLY_BRANCH_ASYMMETRY` — class B

For each exact opponent reply, count exact root-actor legal moves at the resulting two-ply state; terminal successors contribute zero.

```text
replySuccessorLegalCountMean
replySuccessorLegalCountStd
replySuccessorLegalCountMin
replySuccessorLegalCountMax
replySuccessorLegalCountRange
forcedRootActorReplyFraction
terminalReplySuccessorFraction
```

## 8. `REPLY_SEARCH_STABILITY` — class C

D1 and D2 reply tables are compared by exact reply identity.

```text
d1D2CanonicalBestMatch
d1D2TopSetJaccard
d1D2TopSetIntersectionCount
d1D2MeanAbsoluteRankDifference
```

Ranks are tie-aware; canonical best uses lexical move identity within the top set.

## 9. `OPPONENT_POLICY_SENSITIVITY` — class C

Frozen predictor-side reply distributions:

```text
strong = uniform over D2 top-set replies
medium = uniform over first min(3,N) D1-ranked replies
weak = uniform over all exact replies
```

Features:

```text
expectedGapStrong
expectedGapMedium
expectedGapWeak
mediumMinusStrongExpectedGap
weakMinusStrongExpectedGap
expectedGapPolicySpan
tvStrongMedium
tvStrongWeak
tvMediumWeak
```

These are distributional descriptors only. No sampled continuation outcome enters the family.

## 10. `ROOT_MOVE_REFERENCE_CONTEXT` — class C

D2 root search is from the root actor's perspective.

```text
rootLegalMoveCount
rootMoveTieAwareRank
rootMoveScoreMinusBest
rootMoveInD2TopSet
rootD2BestToSecondGap
```

`rootMoveScoreMinusBest <= 0` by definition.

## 11. `LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE` — class A/B

```text
actorReserve
opponentReserve
reserveDiffActorMinusOpponent
actorHouse
opponentHouse
phaseNamua
phaseMtaji
rootMoveIsCapture
rootMoveCapturedSeeds
rootMoveTerminal
successorActorFrontOccupied
successorOpponentFrontOccupied
successorActorReusablePits
successorOpponentReusablePits
```

`reusablePits` counts pits containing at least two seeds.

## 12. `LOCAL_TEMPORAL_CONTEXT` — class A

Uses only the final up-to-four exact moves strictly before the root occurrence.

```text
historyLength
priorCaptureCount
priorTakataCount
priorPassCount
priorDirectionLeftCount
priorDirectionRightCount
priorPhaseChangeCount
immediatelyPriorCapture
```

The root move and any future move/state are forbidden. If no prior history is available, all values are zero.

## Stage 0 technical disposition

All 12 families and all 80 scalar features passed independent exact recomputation on the canonical technical fixture set. This is a **technical eligibility** statement only. Scientific predictive value has not been evaluated.
