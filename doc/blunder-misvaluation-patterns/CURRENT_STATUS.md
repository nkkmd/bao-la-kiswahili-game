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
Stage 1 candidate discovery gate = OPEN
Stage 1 candidate discovery result = PENDING
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
maxPly = 100
selected roots = 1200
Namua quota = 600
Mtaji quota = 600
primary reference = D3 + Q1 / bao / root actor
```

No seed extension, replacement sampling, phase reassignment, threshold retuning or manual candidate promotion is authorized.

## Generation and verification

```text
generated games = 2048
unique historical trajectories = 1884
distinct opening prefixes = 1621
generation summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
verification passed = true
fullSearchRecomputation = true
gamesVerified = 2048
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
```

Generation and verification stratum counts matched exactly:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

## Outcome-blind state selection

Returned selection audit:

```text
uniqueHistoricalTrajectories = 1884
unavailableAssignedPhase = 70
selectedBeforeRuleStateCollapse = 1814
duplicateSelectedRuleStatesCollapsed = 1
phasePoolAfterRuleStateCollapse.namua = 961
phasePoolAfterRuleStateCollapse.mtaji = 852
droppedByPhaseQuota.namua = 361
droppedByPhaseQuota.mtaji = 252
selectedUniqueRuleStates = 1200
selectedPhaseCounts.namua = 600
selectedPhaseCounts.mtaji = 600
distinctOpeningPrefixes = 1067
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
replacementPerformed = false
phaseReassignmentPerformed = false
passed = true
```

Selected roots per generation stratum:

```text
B-D1 = 191
B-D2 = 185
B-D3 = 218
LS-D2 = 203
V2-D2 = 187
LE-D2 = 216
```

All frozen selection/readiness gates passed. The 70 unavailable assigned-phase trajectories were neither replaced nor reassigned.

Machine-readable record:

`results/STAGE_1_SELECTION_RESULT.json`

## Measurement result

The frozen measurement phase completed all 1200 selected roots. The selection identity remained bound to:

```text
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
```

Returned measurement manifest:

```text
completedMeasurements = 1200
measuredMoveRecords = 5295
minimumMeasuredMoveRecords = 3600
allSelectedRootsFiniteD3CandidateTables = true
measurementReadinessPassed = true
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
sourceTreeDirty = false
```

All frozen measurement/readiness gates passed:

```text
completed measurements = 1200                         PASS
measured move records >= 3600                         PASS (5295)
finite D3 candidate tables for every selected root    PASS
```

The returned source-file SHA-256 map remained identical to the authorization-bound map.

Machine-readable record:

`results/STAGE_1_MEASUREMENT_RESULT.json`

## Candidate discovery gate

The next permitted operation is the frozen automatic Stage 1 candidate discovery procedure. It uses the preregistered matcher/failure grammar and evaluates promotion over all outcome-blind matcher opportunities.

Frozen promotion requirements:

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
opening prefixes >= 6
max one opening prefix <= 0.40
generation strata >= 3
max one stratum <= 0.60
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Automatic cap:

```text
total <= 6
per phase <= 3
per failure family <= 2
manual override = false
```

No threshold retuning, favorable subset selection, phase relabeling, failed-candidate renaming, manual promotion or outcome-dependent extension is permitted.

## Interpretation boundary

```text
Stage 1 = exploratory only
candidate confirmation = NOT AUTHORIZED
confirmatory inference = NOT AUTHORIZED
game-theoretic blunder claim = NOT AUTHORIZED
human misconception claim = NOT AUTHORIZED
expert/traditional claim = NOT AUTHORIZED
pedagogical claim = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

No closed-study decision is reopened.

## Immediate next gate

Run only:

```text
node tools/experiments/run-blunder-misvaluation-stage1-exploratory.js --phase discover
```

The discovery result must be reviewed as frozen Stage 1 exploratory output before any Stage 2 design or authorization is considered. Zero promoted candidates is an admissible closed Stage 1 outcome and does not authorize rescue.
