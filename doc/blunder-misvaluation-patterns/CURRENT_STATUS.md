# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

## Research identity

```text
studyId = BMP-STUDY1
research branch = research/blunder-misvaluation-patterns
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
Stage 1 contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
Stage 1 contract validation execution HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation commit = 8df328ca238611919ac58c262b92058712ee1049
tooling validation result commit = cd26cb3280fde00663618162f7c1e2d306470032
execution source freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
Stage 1 generation authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
Stage 1 generation result commit = bb6375ff1ce3afab00d588b4b6e017b6aaf24541
Stage 1 verification result commit = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
Stage 1 selection execution HEAD = 2f6567bab0590ca7741fd8ad9907118544f6331d
Stage 1 selection result commit = d6a8617a517140e34e9af3a5f2b0793884fb1345
Stage 1 measurement execution HEAD = 1c7fc1f8d979d6952433406e7ab5d0a515a633fb
Stage 1 measurement result commit = 5e916c6676022a50d551310f21cf1d3414b6c27c
Stage 1 discovery execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
Stage 1 discovery result commit = ffb9184d84c775e94f52b91f0c1621ea46061a93
```

## Current scientific state

```text
Stage 0 design restoration/audit = COMPLETE
Stage 0 executable technical semantics validation = PASS
Stage 0 D3+Q1 compute feasibility = PASS
Stage 1 exploratory spec = FROZEN
Stage 1 canonical contract validation = PASS
Stage 1 execution tooling validation = PASS
Stage 1 exact source-file SHA-256 map = FROZEN
Stage 1 scientific generation = COMPLETE (2048 / 2048)
Stage 1 independent full replay/search verification = PASS
Stage 1 outcome-blind state selection = COMPLETE
Stage 1 selection readiness = PASS
Stage 1 measurement = COMPLETE (1200 / 1200 roots)
Stage 1 measurement readiness = PASS
Stage 1 candidate discovery = COMPLETE
Stage 1 exploratory candidates promoted = 4
Stage 1 candidate confirmation = NOT PERFORMED
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
formal scientific result = NONE
```

## Frozen Stage 1 identity

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
games = 2048
seeds = 22400001..22402048
selected roots = 1200
Namua / Mtaji = 600 / 600
primary reference = D3 + Q1 / bao / root actor
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
```

No seed extension, replacement sampling, phase reassignment, threshold retuning or manual candidate promotion was used or is authorized.

## Readiness chain

```text
generated games = 2048
unique historical trajectories = 1884
distinct generation opening prefixes = 1621
full replay/search verification = PASS
selected unique rule states = 1200
selected Namua / Mtaji = 600 / 600
distinct selected opening prefixes = 1067
minimum selected generation-stratum count = 185
completed measurements = 1200
measured move records = 5295
all selected roots finite D3 candidate tables = true
measurement readiness = PASS
```

## Stage 1 discovery result

The frozen automatic candidate discovery procedure was executed at:

```text
discovery execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
generatedAt = 2026-08-22T04:11:03.583Z
```

Enumeration:

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

Frozen candidate cap:

```text
maximum total = 6
maximum per phase = 3
maximum per failure family = 2
```

The 268,693,257-byte raw discovery artifact is retained locally and hash-bound:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

It was processed by streaming extraction for repository-scale result recording; the original artifact was not modified.

## Promoted exploratory candidates

Candidate IDs are assigned in exact deterministic promoted order and do not change matcher/failure definitions.

### BMP-S1-C01

```text
phase = Namua
preconditions = frontOccupiedBins:6-8 + houseOwned:false
move abstraction = indexed capture / row 0 / index 4 / side right / direction left
failure = worstReplyActorFrontConnectionsDeltaNegative
failure family = response-envelope
opportunity trajectories = 26
failure-positive trajectories = 26
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
failure family = immediate-structural
opportunity trajectories = 26
failure-positive trajectories = 22
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
failure family = immediate-structural
opportunity trajectories = 26
failure-positive trajectories = 22
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
move abstraction = coarse-no-index capture / row 1 / direction right
failure = allRepliesActorCaptureMoveDeltaNegative
failure family = response-envelope
opportunity trajectories = 27
failure-positive trajectories = 18
failureSignatureRate = 0.666667
d3InferiorRate = 0.703704
d3TopSetRate = 0.148148
medianNormalizedRankLoss = 0.600000
promotionPassed = true
```

All four satisfy every frozen promotion gate. The three Namua candidates share the same opportunity support but have distinct failure tokens; support-equivalence is defined by opportunity identity plus failure token, so they remain distinct candidates.

Machine-readable record:

`results/STAGE_1_DISCOVERY_RESULT.json`

## Interpretation boundary

```text
Stage 1 = exploratory candidate discovery only
candidate confirmation = NOT PERFORMED
confirmatory reuse of Stage 1 data = FORBIDDEN
game-theoretic blunder claim = NOT AUTHORIZED
human misconception claim = NOT AUTHORIZED
expert/traditional claim = NOT AUTHORIZED
pedagogical claim = NOT AUTHORIZED
generalization beyond frozen Stage 1 population = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

No closed-study decision is reopened.

## Immediate next gate

Stage 1 exploratory discovery is closed. The next scientifically permissible step is prospective Stage 2 formal-confirmation design for `BMP-S1-C01` through `BMP-S1-C04`, using fresh data only.

Stage 2 generation must remain blocked until a separate formal spec, contract/tooling validation, source freeze and explicit source-bound authorization are completed.
