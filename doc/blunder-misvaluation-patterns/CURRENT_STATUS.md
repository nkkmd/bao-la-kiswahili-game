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
Stage 1 measurement gate = OPEN
Stage 1 measurement readiness = PENDING
Stage 1 discovery = BLOCKED PENDING MEASUREMENT READINESS
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

Selection was executed only after full verification PASS. The frozen selection firewall was applied without score/regret/failure inspection:

```text
collapse duplicate historicalTrajectoryHash
→ hash-assign each unique trajectory to Namua or Mtaji
→ choose one eligible root in the assigned phase by frozen SHA rank
→ no unavailable-phase reassignment
→ collapse duplicate selected ruleStateKey
→ rank within each phase by frozen quota SHA
→ select exactly 600 Namua + 600 Mtaji if support is sufficient
```

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

All frozen selection/readiness gates passed:

```text
unique historical trajectories >= 1600                  PASS (1884)
selected unique rule states = 1200                       PASS (1200)
Namua selected = 600                                     PASS (600)
Mtaji selected = 600                                     PASS (600)
distinct selected opening prefixes >= 128                PASS (1067)
selected roots per generation stratum >= 100             PASS (minimum 185)
```

The 70 unavailable assigned-phase trajectories remain unavailable. They were not replaced or reassigned.

Machine-readable record:

`results/STAGE_1_SELECTION_RESULT.json`

## Measurement gate

The next permitted operation is the frozen measurement phase over all 1200 selected roots. For every exact legal move it records the frozen D1/D2/D3 search quantities, D3 domain-aware decision loss / normalized rank loss, static post-move evaluation, structural transition and reply envelope.

Measurement is fail-closed unless the stored selection audit has `passed = true` and the selected-state artifact matches the exact selection hash.

After all selected roots are processed, measurement readiness requires:

```text
measured move records >= 3600
complete finite D3 candidate tables for all 1200 selected roots
```

Discovery remains blocked until both measurement gates pass.

## Frozen candidate promotion gate

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

Automatic cap: 6 total / 3 per phase / 2 per failure family. Manual override is forbidden.

## Interpretation boundary

```text
Stage 1 = exploratory only
confirmatory inference = NOT AUTHORIZED
game-theoretic blunder claim = NOT AUTHORIZED
human misconception claim = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

No closed-study decision is reopened.

## Immediate next gate

Run only:

```text
node tools/experiments/run-blunder-misvaluation-stage1-exploratory.js --phase measure
```

Do not run discovery until the measurement manifest has been reviewed and measurement readiness is explicitly recorded as PASS.
