# RESEARCH_LOG — Blunder / Misvaluation Patterns Study 1

## 2026-08-20 — Study initiation

- Confirmed baseline `main` at `b1cc7047504b73c5a848e866f795c26a64250d13`.
- Created `research/blunder-misvaluation-patterns` from that exact baseline.
- Restored closed-study interpretation boundaries: Calibration Study 1 remains `INCONCLUSIVE`; PCX confirmatory limits remain unchanged; Tactical Motif C03 remains machine-bounded; human expert evidence remains `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`.
- Fixed D3+Q1 as the primary machine reference before present-Study scientific data.
- Reserved Stage 1 seeds `22400001..22402048` and future Stage 2 capacity `22500001..22504096`.

Initial design commit:

```text
0c0b88649cd77043bfadc2a2d48c7f27b611dc2d
```

## 2026-08-20 — Stage 0 validation and feasibility PASS

```text
Stage 0 tooling commit = dff7d11874c92d585f50f57b3077204271ab682b
feasibility execution HEAD = 45ce006eb63d5555a030d50fe7aa4e97637db327
coveragePassed = true
technical roots = Namua 4 / Mtaji 4
overall mean total measurement = 214.412715875 ms/root
overall median total measurement = 139.4082525 ms/root
projected serial hours / 2000 roots = 0.11911817548611109
scientific seed namespace used = false
```

Decision: D3+Q1 retained.

## 2026-08-20 — Stage 1 exploratory design freeze

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
games = 2048
seeds = 22400001..22402048
maxPly = 100
selected-root target = 1200
Namua / Mtaji quota = 600 / 600
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
```

No outcome-dependent extension, replacement, phase reassignment, threshold retuning or manual promotion was permitted.

## 2026-08-20/21 — Contract/tooling/source freeze and authorization

```text
contract validation execution HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation HEAD = 8df328ca238611919ac58c262b92058712ee1049
tooling validation result commit = cd26cb3280fde00663618162f7c1e2d306470032
source freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
Stage 1 generation authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

Validator, contract and tooling checks passed. Authorization remained Stage 1 exploratory only; confirmatory inference and Stage 2 generation remained unauthorized.

## 2026-08-22 — Authorized corpus generation COMPLETE

```text
sourceCommit = a8fd9ac0361d276e0f4a05e7df7d7a0c0ecd6ad2
sourceTreeDirty = false
games = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
```

Frozen stratum counts:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

Generation result commit:

```text
bb6375ff1ce3afab00d588b4b6e017b6aaf24541
```

## 2026-08-22 — Independent full replay/search verification PASS

```text
verification execution HEAD = 897dcd2cb8775f8c129dbbde01167eef1f973089
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
sourceTreeDirty = false
verification result commit = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
```

Condition counts and source-file SHA-256 map matched generation/authorization exactly.

## 2026-08-22 — Outcome-blind state-selection readiness PASS

```text
selection execution HEAD = 2f6567bab0590ca7741fd8ad9907118544f6331d
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
selection result commit = d6a8617a517140e34e9af3a5f2b0793884fb1345
```

Selected stratum counts:

```text
B-D1 = 191
B-D2 = 185
B-D3 = 218
LS-D2 = 203
V2-D2 = 187
LE-D2 = 216
```

All selection gates passed without rescue.

## 2026-08-22 — Measurement readiness PASS

```text
measurement execution HEAD = 1c7fc1f8d979d6952433406e7ab5d0a515a633fb
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
completedMeasurements = 1200
measuredMoveRecords = 5295
minimumMeasuredMoveRecords = 3600
allSelectedRootsFiniteD3CandidateTables = true
measurementReadinessPassed = true
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
sourceTreeDirty = false
measurement result commit = 5e916c6676022a50d551310f21cf1d3414b6c27c
```

All measurement gates passed; discovery gate opened.

## 2026-08-22 — Stage 1 automatic exploratory discovery COMPLETE

Discovery ran at exact HEAD:

```text
14c0d29683611ecd76771a213ce2380cb71fa18d
```

The pre-discovery status showed:

```text
generatedGames = 2048
hasManifest = true
hasVerification = true
hasSelectionAudit = true
measurementFiles = 1200
hasDiscoveryResult = false
```

The authorization-bound source-file SHA-256 map remained unchanged.

The raw discovery artifact is large and remains local:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

It was processed mechanically by streaming extraction rather than full in-memory expansion. The original artifact was not modified. The compact extraction identity is:

```text
bytes = 10034
sha256 = 0df0438105c7d7b248e014ffc30087b96dceb97bb4aeb716456b504cddc32db0
```

Returned discovery summary:

```text
schemaVersion = 1
exploratory = true
confirmatoryReuseAllowed = false
matcherCount = 16421
lowSupportMatcherCount = 9553
lowSupportMatcherKeyHash = 46909b7f207af4f714f0d7845e5ebe8f080d1c68d43f51c520296933d6d31b60
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
promotedCandidateCount = 4
manualOverridePerformed = false
generatedAt = 2026-08-22T04:11:03.583Z
```

Support-equivalence removed none of the 11 gate-passing candidates. Frozen deterministic ranking and caps (`6 total / 3 per phase / 2 per failure family`) produced the final four promoted candidates.

### BMP-S1-C01

```text
phase = Namua
preconditions = frontOccupiedBins:6-8 + houseOwned:false
move = indexed capture / row0 / index4 / side right / direction left
failure = worstReplyActorFrontConnectionsDeltaNegative
family = response-envelope
opportunity trajectories = 26
failure-positive trajectories = 26
opening prefixes = 26
generation strata = 6
failureSignatureRate = 1.000000
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
promotionPassed = true
```

### BMP-S1-C02

```text
phase = Namua
same matcher/support as C01
failure = actorCaptureMoveDeltaNegative
family = immediate-structural
opportunity trajectories = 26
failure-positive trajectories = 22
opening prefixes = 26
generation strata = 6
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
promotionPassed = true
```

### BMP-S1-C03

```text
phase = Namua
same matcher/support as C01
failure = actorLegalMoveDeltaNegative
family = immediate-structural
opportunity trajectories = 26
failure-positive trajectories = 22
opening prefixes = 26
generation strata = 6
failureSignatureRate = 0.846154
d3InferiorRate = 0.730769
d3TopSetRate = 0.076923
medianNormalizedRankLoss = 0.732143
promotionPassed = true
```

### BMP-S1-C04

```text
phase = Mtaji
preconditions = frontOccupiedBins:3-5 + legalMoveCountBins:5+
move = coarse-no-index capture / row1 / direction right
failure = allRepliesActorCaptureMoveDeltaNegative
family = response-envelope
opportunity trajectories = 27
failure-positive trajectories = 18
opening prefixes = 27
generation strata = 6
failureSignatureRate = 0.666667
d3InferiorRate = 0.703704
d3TopSetRate = 0.148148
medianNormalizedRankLoss = 0.600000
promotionPassed = true
```

All four satisfy every frozen promotion gate. Candidate IDs `BMP-S1-C01` through `BMP-S1-C04` are assigned in exact deterministic promoted order. C01-C03 share the same opportunity support but have distinct failure tokens, so they remain distinct under the frozen support-equivalence definition.

Machine-readable discovery result:

```text
results/STAGE_1_DISCOVERY_RESULT.json
discovery result commit = ffb9184d84c775e94f52b91f0c1621ea46061a93
```

Decision:

```text
Stage 1 exploratory discovery = COMPLETE
exploratory candidates promoted = 4
candidate confirmation = NOT PERFORMED
confirmatory reuse of Stage 1 data = FORBIDDEN
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
```

No threshold retuning, favorable subset selection, phase relabeling, failed-candidate renaming, manual promotion or outcome-dependent extension occurred.

Interpretation remains machine-bounded: the four promoted candidates are not established game-theoretic blunders, human misconception patterns, expert/traditional Bao knowledge, pedagogical principles or population-general claims.
