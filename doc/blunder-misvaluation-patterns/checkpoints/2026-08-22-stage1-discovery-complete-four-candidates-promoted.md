# Stage 1 discovery complete — four exploratory candidates promoted

Date: 2026-08-22

## Execution identity

```text
studyId = BMP-STUDY1
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
discovery execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
generatedAt = 2026-08-22T04:11:03.583Z
```

The pre-discovery status showed 2048 generated games, full verification present, selection audit present, 1200 measurement files, and no prior discovery result. The authorization-bound scientific source SHA-256 map was unchanged.

## Large-artifact handling

The raw local discovery artifact was retained unmodified:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

Because the raw artifact contains the complete failed-candidate table and is very large, it was processed by streaming extraction rather than full in-memory expansion. The compact extraction preserved the top-level identity/counts, all promoted candidates and no-rescue flags:

```text
compact bytes = 10034
compact sha256 = 0df0438105c7d7b248e014ffc30087b96dceb97bb4aeb716456b504cddc32db0
```

The raw artifact remains the audit source for the complete failed-candidate set.

## Discovery enumeration

```text
matcherCount = 16421
lowSupportMatcherCount = 9553
lowSupportMatcherKeyHash = 46909b7f207af4f714f0d7845e5ebe8f080d1c68d43f51c520296933d6d31b60
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
promotedCandidateCount = 4
manualOverridePerformed = false
```

Support-equivalence therefore removed none of the 11 gate-passing candidates. Frozen deterministic ranking/caps then selected four candidates under:

```text
maximum total = 6
maximum per phase = 3
maximum per failure family = 2
```

## Promoted exploratory candidates

### BMP-S1-C01 — Namua / response-envelope

```text
preconditions = frontOccupiedBins:6-8 + houseOwned:false
move = indexed capture, row 0, index 4, side right, direction left
failureToken = worstReplyActorFrontConnectionsDeltaNegative
opportunity trajectories = 26
failure-positive trajectories = 26
failureSignatureRate = 1.000000
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
promotionPassed = true
```

### BMP-S1-C02 — Namua / immediate-structural

```text
same matcher/support as C01
failureToken = actorCaptureMoveDeltaNegative
opportunity trajectories = 26
failure-positive trajectories = 22
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
promotionPassed = true
```

### BMP-S1-C03 — Namua / immediate-structural

```text
same matcher/support as C01
failureToken = actorLegalMoveDeltaNegative
opportunity trajectories = 26
failure-positive trajectories = 22
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
promotionPassed = true
```

### BMP-S1-C04 — Mtaji / response-envelope

```text
preconditions = frontOccupiedBins:3-5 + legalMoveCountBins:5+
move = coarse-no-index capture, row 1, direction right
failureToken = allRepliesActorCaptureMoveDeltaNegative
opportunity trajectories = 27
failure-positive trajectories = 18
failureSignatureRate = 0.666667
d3InferiorRate = 0.703704
d3TopSetRate = 0.148148
medianNormalizedRankLoss = 0.600000
promotionPassed = true
```

All four promoted candidates satisfy every frozen promotion gate. Candidate IDs `BMP-S1-C01` through `BMP-S1-C04` are assigned in exact deterministic promoted order; this labeling does not alter any matcher, failure token or rank.

## Decision

```text
Stage 1 exploratory discovery = COMPLETE
exploratory candidates promoted = 4
candidate confirmation = NOT PERFORMED
confirmatory reuse of Stage 1 data = FORBIDDEN
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
```

The four candidates are eligible only for prospective fresh-data confirmation. They are not established game-theoretic blunders, human misconception patterns, expert/traditional Bao knowledge or pedagogical principles.

No threshold retuning, favorable subset selection, phase relabeling, failed-candidate renaming, manual promotion or outcome-dependent extension occurred.
