# Blunder / Misvaluation Patterns Study 1 — Stage 1 Exploratory Report

更新日: 2026-08-22  
Status: **STAGE 1 EXPLORATORY CLOSED / 4 CANDIDATES PROMOTED / STUDY 1 FORMAL RESULT NONE**

## Executive summary

This report closes only the exploratory Stage 1 of Blunder / Misvaluation Patterns Study 1. The overall Study remains active because prospective Stage 2 formal confirmation has not yet been designed or executed.

Stage 1 used a fresh 2,048-game corpus and a frozen machine operationalization to discover recurrent position → move → search-loss → structural/response-failure patterns without defining a blunder by game outcome, static evaluation, or an AI policy's selected move.

All generated games were independently replayed and search-recomputed. An outcome-blind, trajectory-aware selection produced 1,200 unique rule states (Namua 600 / Mtaji 600), and all 5,295 exact legal moves at those roots were measured. All frozen readiness gates passed without seed extension, replacement, phase reassignment, or threshold relaxation.

The frozen discovery grammar enumerated 16,421 matchers and 123,624 detailed candidates. Eleven passed the promotion gate before and after support-equivalence collapse. Deterministic ranking and caps produced four promoted exploratory candidates.

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

These are candidates for fresh-data Stage 2 confirmation only. They are not confirmed Bao blunders, game-theoretic errors, or human misconception patterns.

---

## 1. Scientific boundaries

The study kept distinct:

```text
search-based decision loss
structural consequence
response-envelope / forcing failure
horizon / static misvaluation
empirical continuation outcome
game-theoretic value
human misconception
```

Position Evaluation / Win-Rate Calibration Study 1 remains `INCONCLUSIVE`; its exploratory isotonic mapping was not used as a validated win-probability severity scale.

Human / Expert Validation Study 1 remains `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` on the human axis. This Stage collected no human evidence and therefore makes no human misconception claim.

---

## 2. Frozen machine reference

```text
evaluation profile = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary reference depth = D3
quiescence depth = 1
perspective = root actor
root move set = exact E.moveVariants(state)
```

Ordinary evaluator-domain loss, mate-distance loss, and cross-domain categorical loss remained distinct.

---

## 3. Stage identity and authorization

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
validated implementation commit = 8df328ca238611919ac58c262b92058712ee1049
source freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
generation authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

Stage 1 generation was exploratory only; confirmatory reuse was forbidden.

---

## 4. Generation and verification

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
```

Independent verification:

```text
execution HEAD = 897dcd2cb8775f8c129dbbde01167eef1f973089
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
sourceTreeDirty = false
```

Frozen stratum counts matched exactly in generation and verification.

---

## 5. Outcome-blind selection

Frozen selection used historical trajectory as the primary support unit, deterministic phase assignment, one eligible root per trajectory in the assigned phase, duplicate rule-state collapse, and deterministic phase quotas. D1/D2/D3 score, regret, failure signature, game outcome, and manual replacement were excluded.

Result:

```text
uniqueHistoricalTrajectories = 1884
unavailableAssignedPhase = 70
selectedBeforeRuleStateCollapse = 1814
duplicateSelectedRuleStatesCollapsed = 1
phasePoolAfterRuleStateCollapse = Namua 961 / Mtaji 852
selectedUniqueRuleStates = 1200
selectedPhaseCounts = Namua 600 / Mtaji 600
distinctOpeningPrefixes = 1067
replacementPerformed = false
phaseReassignmentPerformed = false
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
passed = true
```

Selected generation-stratum counts:

```text
B-D1 = 191
B-D2 = 185
B-D3 = 218
LS-D2 = 203
V2-D2 = 187
LE-D2 = 216
```

All selection readiness gates passed.

---

## 6. Exact move measurement

```text
completedMeasurements = 1200
measuredMoveRecords = 5295
minimumMeasuredMoveRecords = 3600
allSelectedRootsFiniteD3CandidateTables = true
measurementReadinessPassed = true
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
sourceTreeDirty = false
```

Every exact legal move was measured for D1/D2/D3 search, D3 inferior/rank-loss quantities, static post-move evaluation, structural transition, response envelope, and frozen failure flags.

---

## 7. Discovery grammar

Matcher:

```text
phase
+ 1 or 2 structural precondition tokens
+ move abstraction
```

Failure token was excluded from the matcher and evaluated over all matcher opportunities.

Precondition families:

```text
captureRegime
legalMoveCountBins
captureMoveCountBins
reserveBins
houseOwned
nyumbaSeedsBins
frontOccupiedBins
frontConnectionsBins
reusablePitsBins
```

Both coarse-no-index and indexed move abstractions were available.

Within matcher × historical trajectory, the lexicographically smallest exact moveKey represented that trajectory, preventing failure-positive moves from selecting their own denominator.

Support-equivalence:

```text
opportunityIdentityHash + failureToken
```

---

## 8. Frozen promotion gate

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
distinct opening prefixes >= 6
maximum one opening prefix share <= 0.40
generation strata >= 3
maximum one generation stratum share <= 0.60
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Caps:

```text
maximum total = 6
maximum per phase = 3
maximum per failure family = 2
manual override = forbidden
```

---

## 9. Discovery result

```text
execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
generatedAt = 2026-08-22T04:11:03.583Z
matcherCount = 16421
lowSupportMatcherCount = 9553
lowSupportMatcherKeyHash = 46909b7f207af4f714f0d7845e5ebe8f080d1c68d43f51c520296933d6d31b60
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
promotedCandidateCount = 4
manualOverridePerformed = false
```

Raw local result:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

The raw artifact was processed by streaming extraction without modification. The compact extraction SHA-256 was:

```text
0df0438105c7d7b248e014ffc30087b96dceb97bb4aeb716456b504cddc32db0
```

---

## 10. Promoted candidates

### BMP-S1-C01

```text
phase = Namua
preconditions = frontOccupiedBins:6-8 + houseOwned:false
move = indexed capture / row0 / index4 / side right / direction left
failure = worstReplyActorFrontConnectionsDeltaNegative
failure family = response-envelope
support = 26 trajectories / 26 rule states
failure-positive trajectories = 26
failureSignatureRate = 1.000000
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
```

### BMP-S1-C02

```text
phase = Namua
matcher/support = same as C01
failure = actorCaptureMoveDeltaNegative
failure family = immediate-structural
failure-positive trajectories = 22
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
```

### BMP-S1-C03

```text
phase = Namua
matcher/support = same as C01
failure = actorLegalMoveDeltaNegative
failure family = immediate-structural
failure-positive trajectories = 22
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
```

### BMP-S1-C04

```text
phase = Mtaji
preconditions = frontOccupiedBins:3-5 + legalMoveCountBins:5+
move = coarse-no-index capture / row1 / direction right
failure = allRepliesActorCaptureMoveDeltaNegative
failure family = response-envelope
support = 27 trajectories / 27 rule states
failure-positive trajectories = 18
failureSignatureRate = 0.666667
d3InferiorRate = 0.703704
d3TopSetRate = 0.148148
medianNormalizedRankLoss = 0.600000
```

All four passed every frozen promotion gate. C01–C03 remain distinct because support-equivalence includes the failure token.

---

## 11. Stage 1 decision

```text
Stage 1 exploratory discovery = COMPLETE
promoted exploratory candidates = 4
Stage 1 candidate confirmation = NOT PERFORMED
Study 1 formal decision = NONE
```

The four candidates are machine-reproducible exploratory patterns eligible for prospective fresh-data confirmation.

Not authorized:

```text
confirmed Bao blunder claim
game-theoretic blunder claim
human misconception claim
expert/traditional recognition claim
pedagogical importance claim
generalization beyond frozen Stage 1 population/source
```

---

## 12. Next gate

Study 1 remains active. The next stage is prospective Stage 2 formal-confirmation design for the exact frozen candidate definitions `BMP-S1-C01..C04`.

Stage 2 must use fresh data. Stage 1 support cannot count as confirmation evidence.

Stage 2 scientific generation remains blocked until:

```text
formal Stage 2 spec
canonical contract validation
execution tooling validation
exact source-file hash freeze
explicit source-bound authorization
```

Reserved Stage 2 capacity `22500001..22504096` is not generation authorization.

## Canonical records

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)
