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

Decision at this Stage 1 closure point:

```text
Stage 1 exploratory discovery = COMPLETE
exploratory candidates promoted = 4
candidate confirmation = NOT PERFORMED
confirmatory reuse of Stage 1 data = FORBIDDEN
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
```

The statements immediately above are preserved as the historical Stage 1 closure state, not the final Study 1 state.

No threshold retuning, favorable subset selection, phase relabeling, failed-candidate renaming, manual promotion or outcome-dependent extension occurred.

Interpretation remained machine-bounded: the four promoted candidates were not established game-theoretic blunders, human misconception patterns, expert/traditional Bao knowledge, pedagogical principles or population-general claims.

## 2026-08-22 — Stage 1 integrated; prospective Stage 2 design frozen

Stage 1 was integrated to `main` at:

```text
52f5635be7064b5016baf7cde82faebe60609d9e
```

A new branch was created for fresh Stage 2 formal confirmation:

```text
research/blunder-misvaluation-patterns-stage2-formal
```

Stage 2 one-to-one candidate freeze and formal specification:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
```

The originally transcribed expected spec hash was corrected before authorization; the spec semantics were not changed by that correction.

## 2026-08-22 — Stage 2 technical validation, source freeze and authorization

```text
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
validator = PASS
contract test = PASS
tooling test = PASS
syntax checks = PASS
source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
```

The first authorization commit contained one clerical source-hash transcription error and was never used. It was corrected before scientific generation.

## 2026-08-22 — Stage 2 fresh generation and independent corpus verification PASS

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
fullSearchRecomputation = true
corpus verification = PASS
```

No seed extension or replacement sampling was performed.

## 2026-08-23 — Outcome-blind Stage 2 selection PASS

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 Namua selected unique states = 1868
G02 Mtaji selected unique states = 810
G01 / G02 estimability preview = PASS / PASS
final Stage 1 overlap = 0 / 0 / 0
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
```

G02 encountered one Stage 1 rule-state overlap after its frozen outcome-blind root selection; that selected root was dropped with no alternate root and no replacement, exactly as preregistered.

## 2026-08-23 — Formal D3 measurement and independent verification PASS

```text
G01 measurements = 1868
G02 measurements = 810
total measurements = 2678
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
allFormalD3CandidateTablesFinite = true
measurementIntegrityPassed = true
```

Independent verification:

```text
verifiedMeasurementRows = 2678
measurementHashMatches = true
stage1IdentityFirewallPassed = true
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
passed = true
```

## 2026-08-23 — Formal evaluation provenance-binding correction

The wrapper evaluation path enforced the independent measurement-verification gate, but did not pass the verification object into the evaluator result constructor. The first raw result therefore had:

```text
independentMeasurementVerificationHash = null
```

No endpoint, candidate, support set, threshold, input data or scientific source was changed. The already-frozen direct evaluator was executed against the same verified artifacts and produced the same formal endpoint values/decisions with the existing verification correctly bound:

```text
independentMeasurementVerificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
```

The direct-evaluator output is the canonical raw result. This was a provenance-binding correction only, not a rescue or scientific reanalysis.

## 2026-08-23 — Stage 2 formal evaluation COMPLETE / Study 1 CLOSED

All four candidates were estimable. Frozen 8-test Holm-Bonferroni evaluation produced:

```text
BMP-S2-C01
  failure recurrence = 1726/1868 = 0.9239828694
  D3-inferior recurrence = 868/1868 = 0.4646680942
  decision = NOT-CONFIRMED

BMP-S2-C02
  failure recurrence = 1490/1868 = 0.7976445396
  D3-inferior recurrence = 868/1868 = 0.4646680942
  decision = NOT-CONFIRMED

BMP-S2-C03
  failure recurrence = 1485/1868 = 0.7949678801
  D3-inferior recurrence = 868/1868 = 0.4646680942
  decision = NOT-CONFIRMED

BMP-S2-C04
  failure recurrence = 508/810 = 0.6271604938
  D3-inferior recurrence = 411/810 = 0.5074074074
  decision = NOT-CONFIRMED
```

Final count:

```text
formal candidates = 4
estimable = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

C01-C03 reproduced their structural/reply failure signatures strongly but did not reproduce the frozen D3-inferior co-primary criterion. C04 failed the absolute failure-recurrence floor and D3-inferior criterion. No post-outcome retuning, seed extension, favorable subgroup, alternate primary depth/evaluator or manual override was used.

Canonical compact result:

```text
results/STAGE_2_FORMAL_RESULT.json
```

Scientific interpretation:

```text
STUDY_1_FINAL_REPORT.md
```

`NOT-CONFIRMED` is not a proof that the moves are game-theoretically non-blunders and does not establish human misconception, expert/traditional recognition, pedagogical importance, causal mechanism or external validity.
