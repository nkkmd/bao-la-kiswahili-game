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

## 2026-08-20 — Stage 0 technical validation and compute feasibility PASS

Stage 0 tooling commit:

```text
dff7d11874c92d585f50f57b3077204271ab682b
```

Executable semantics tests passed. A deterministic technical-only D3+Q1 feasibility run then completed at exact HEAD:

```text
45ce006eb63d5555a030d50fe7aa4e97637db327
```

Result:

```text
coveragePassed = true
technical roots = Namua 4 / Mtaji 4
overall mean total measurement = 214.412715875 ms/root
overall median total measurement = 139.4082525 ms/root
projected serial hours / 2000 roots = 0.11911817548611109
scientific seed namespace used = false
```

Decision: Stage 0 compute feasibility PASS; D3+Q1 retained.

## 2026-08-20 — Stage 1 exploratory design freeze

Before any present-Study scientific generation, froze:

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

The full reserved Stage 1 block is the exact population. No outcome-dependent extension, replacement, phase reassignment, threshold retuning or manual promotion is permitted.

## 2026-08-20 — Stage 1 canonical contract validation PASS

Exact validation execution HEAD:

```text
b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
```

Returned:

```text
validator = PASS
contract test = PASS
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
generationAuthorizedBySpecAlone = false
```

Machine-readable record: `results/STAGE_1_CONTRACT_VALIDATION_RESULT.json`.

## 2026-08-20/21 — Stage 1 execution tooling materialized and validated

The fail-closed runner/verifier/discovery tooling was materialized without changing the frozen spec. The technical validation was executed at:

```text
validated implementation HEAD = 8df328ca238611919ac58c262b92058712ee1049
```

Returned:

```text
canonical spec validator = PASS
contract test = PASS
tooling test = PASS
runner status surface = PASS
authorizationFilePresent = false
generatedGames = 0
```

Machine-readable tooling-validation record commit:

```text
cd26cb3280fde00663618162f7c1e2d306470032
```

## 2026-08-21 — Execution source freeze and Stage 1 authorization

The exact scientific source-file SHA-256 map was frozen at:

```text
0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
```

After explicit investigator approval, the separate source-bound Stage 1 exploratory generation authorization was created at:

```text
1af3828c1c25789d6f4af590ee973cffd34bca46
```

Authorized scope remained Stage 1 exploratory only. Confirmatory inference, Stage 2 generation, game-theoretic blunder claims and human misconception claims remained unauthorized.

## 2026-08-22 — Stage 1 authorized corpus generation COMPLETE

Generation ran under the source-bound authorization with:

```text
sourceCommit = a8fd9ac0361d276e0f4a05e7df7d7a0c0ecd6ad2
sourceTreeDirty = false
games = 2048
seeds = 22400001..22402048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
```

Condition counts matched the frozen modulo assignment exactly:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

Generation record commit:

```text
bb6375ff1ce3afab00d588b4b6e017b6aaf24541
```

## 2026-08-22 — Independent full replay/search verification PASS

Verification ran at exact HEAD:

```text
897dcd2cb8775f8c129dbbde01167eef1f973089
```

Returned:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
sourceTreeDirty = false
```

Condition counts and source-file SHA-256 map matched generation/authorization exactly.

Verification result commit:

```text
17995f04f3b9abbe0d73b2f035e8129ff07e191f
```

Decision: full verification PASS; outcome-blind state-selection gate opened.

## 2026-08-22 — Outcome-blind state-selection readiness PASS

Selection ran at exact HEAD:

```text
2f6567bab0590ca7741fd8ad9907118544f6331d
```

Returned:

```text
uniqueHistoricalTrajectories = 1884
unavailableAssignedPhase = 70
selectedBeforeRuleStateCollapse = 1814
duplicateSelectedRuleStatesCollapsed = 1
phasePoolAfterRuleStateCollapse.namua = 961
phasePoolAfterRuleStateCollapse.mtaji = 852
selectedUniqueRuleStates = 1200
selectedPhaseCounts.namua = 600
selectedPhaseCounts.mtaji = 600
distinctOpeningPrefixes = 1067
replacementPerformed = false
phaseReassignmentPerformed = false
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
passed = true
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

All selection/readiness gates passed without rescue. The 70 unavailable trajectories remained unavailable and were not reassigned or replaced.

Selection result commit:

```text
d6a8617a517140e34e9af3a5f2b0793884fb1345
```

Decision: selection readiness PASS; measurement gate opened.

## 2026-08-22 — Stage 1 measurement readiness PASS

Measurement ran at exact HEAD:

```text
1c7fc1f8d979d6952433406e7ab5d0a515a633fb
```

The pre-measurement status showed the generated/verified corpus and selection audit present, `measurementFiles = 0`, and no discovery result. The source-file SHA-256 map remained identical to the authorization-bound map.

The frozen measurement procedure processed every selected root and every exact legal move. Returned manifest:

```text
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
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

Machine-readable measurement record:

```text
results/STAGE_1_MEASUREMENT_RESULT.json
measurement result commit = 5e916c6676022a50d551310f21cf1d3414b6c27c
```

Decision:

```text
Stage 1 measurement readiness = PASS
candidate discovery gate = OPEN
candidate discovery result = PENDING
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

The next permitted operation is frozen automatic Stage 1 candidate discovery. Discovery must use the preregistered matcher/failure grammar, support-equivalence collapse, promotion gates and deterministic caps. Threshold retuning, favorable subset selection, phase relabeling, failed-candidate renaming, manual promotion and outcome-dependent extension remain forbidden. A zero-promoted-candidate result is admissible and must not trigger rescue.
