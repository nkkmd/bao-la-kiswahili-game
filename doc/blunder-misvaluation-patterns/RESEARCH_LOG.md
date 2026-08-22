# RESEARCH_LOG — Blunder / Misvaluation Patterns Study 1

## 2026-08-20 — Study initiation

- Confirmed current `main` at `b1cc7047504b73c5a848e866f795c26a64250d13`.
- Confirmed no later unknown commit needed reconciliation before study initiation.
- Restored central research agenda and closed-study boundaries.
- Confirmed Bad-Move / Misconception Patterns is the next recommended Stage 2 research topic after Calibration Study 1.
- Confirmed Calibration Study 1 formal decision remains `INCONCLUSIVE`; exploratory isotonic mapping is not a validated win-probability instrument.
- Confirmed PCX exact-search tooling can be reused only as instrumentation.
- Confirmed Tactical Motif C03 remains machine-bounded and immutable.
- Confirmed human expert evidence remains `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`.
- Created research branch `research/blunder-misvaluation-patterns` from the exact baseline main HEAD.
- Fixed initial construct separation and D3+Q1 primary machine reference before any present-Study scientific data.
- Reserved fresh seed capacities `22400001..22402048` and `22500001..22504096`; no scientific generation authorized.

Initial design commit:

```text
0c0b88649cd77043bfadc2a2d48c7f27b611dc2d
```

## 2026-08-20 — Stage 0 tooling materialized

Added a thin, non-engine-modifying technical layer:

```text
tools/experiments/lib/blunder-misvaluation-patterns.js
test/blunder-misvaluation-stage0.test.js
.github/workflows/blunder-misvaluation-stage0.yml
doc/blunder-misvaluation-patterns/STAGE_0_TECHNICAL_PROTOCOL.md
```

Tooling commit:

```text
dff7d11874c92d585f50f57b3077204271ab682b
```

The wrapper adds domain-aware regret classification, same-root median/rank diagnostics, root-actor static post-move evaluation and existing tactical transition/reply summaries. It does not change engine, evaluator or exact-search implementation.

## 2026-08-20 — Stage 0 executable semantics validation PASS

The investigator returned successful local execution for the three required tests:

```text
Position-complexity search diagnostic tests passed
Tactical motif Stage 0 feature tests passed
Blunder / misvaluation Stage 0 technical tests passed
```

Decision:

```text
Stage 0 executable semantics validation = PASS
scientific inference authorized = false
Stage 1 generation authorized = false
Stage 2 generation authorized = false
```

The exact local HEAD was not included in the transcript. Before any Stage 1 authorization, source commit and source-file hashes were required to be independently bound and checked.

## 2026-08-20 — Stage 0 compute feasibility PASS

The investigator returned exact HEAD `45ce006eb63d5555a030d50fe7aa4e97637db327` and executed the deterministic technical-only benchmark.

Returned result:

```text
coveragePassed = true
selected technical roots = Namua 4 / Mtaji 4
overall mean total measurement = 214.412715875 ms/root
overall median total measurement = 139.4082525 ms/root
projected serial hours / 2000 roots = 0.11911817548611109
scientific seed namespace used = false
scientific corpus generated = false
```

Decision:

```text
Stage 0 compute feasibility = PASS
D3+Q1 primary reference = RETAIN
```

## 2026-08-20 — Stage 1 exploratory design freeze

Before any present-Study scientific generation, froze:

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
games = 2048
seeds = 22400001..22402048
maxPly = 100
selected-root target = 1200
Namua / Mtaji root quota = 600 / 600
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
```

The full reserved Stage 1 block is used; no within-version outcome-dependent extension is possible. Candidate design separates the outcome-blind matcher from the failure signature.

## 2026-08-20 — Stage 1 canonical contract validation PASS

The investigator returned exact local HEAD `b3ff83a4b94b5e60e98ef48b6b2666a20a26334a`.

```text
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
validator = PASS
contract test = PASS
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
generationAuthorizedBySpecAlone = false
```

The PASS is archived in `results/STAGE_1_CONTRACT_VALIDATION_RESULT.json`.

## 2026-08-20 — Stage 1 execution tooling materialized

Materialized without changing the frozen spec:

```text
tools/experiments/lib/blunder-misvaluation-stage1-corpus.js
tools/experiments/lib/blunder-misvaluation-stage1-discovery.js
tools/experiments/run-blunder-misvaluation-stage1-exploratory.js
tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js
test/blunder-misvaluation-stage1-tooling.test.js
.github/workflows/blunder-misvaluation-stage1-tooling.yml
doc/blunder-misvaluation-patterns/STAGE_1_EXECUTION_RUNBOOK.md
```

The implementation is fail-closed and requires a separate source-bound authorization before scientific generation.

## 2026-08-21 — Stage 1 execution tooling validation PASS

The investigator returned exact local HEAD:

```text
8df328ca238611919ac58c262b92058712ee1049
```

All required checks passed:

```text
canonical spec validator = PASS
contract test = PASS
tooling test = PASS
runner status surface = PASS
authorizationFilePresent = false
generatedGames = 0
hasManifest = false
hasVerification = false
hasSelectionAudit = false
measurementFiles = 0
hasDiscoveryResult = false
```

The complete returned source-file SHA-256 map was archived in `results/STAGE_1_TOOLING_VALIDATION_RESULT.json` at commit:

```text
cd26cb3280fde00663618162f7c1e2d306470032
```

Decision:

```text
Stage 1 execution tooling validation = PASS
scientific corpus generated = 0
```

## 2026-08-21 — Stage 1 execution source freeze

The exact scientific source-file SHA-256 map validated at implementation commit `8df328ca238611919ac58c262b92058712ee1049` was frozen before authorization in:

```text
preregistration/STAGE_1_EXECUTION_SOURCE_FREEZE.json
freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
```

This freeze itself did not authorize generation.

## 2026-08-21 — Stage 1 exploratory scientific generation authorized

After explicit investigator approval, created the separate source-bound authorization:

```text
preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

Authorized scope:

```text
Stage 1 exploratory generation = true
exact games = 2048
exact seeds = 22400001..22402048
confirmatory inference = false
Stage 2 generation = false
game-theoretic blunder claim = false
human misconception claim = false
```

The authorized execution order is:

```text
generate
→ independent full replay/search verify
→ select
→ inspect selection readiness
→ measure
→ inspect measurement readiness
→ discover
```

No-rescue rules remain frozen: no seed extension, replacement sampling, phase reassignment, threshold retuning, favorable subset selection, post-outcome depth selection, failed-candidate renaming, or manual promotion.

State at authorization:

```text
Stage 1 scientific games generated = 0
Stage 2 generation authorized = false
formal scientific result = none
```

## 2026-08-22 — Stage 1 authorized corpus generation COMPLETE

The investigator returned the final generation manifest produced under the source-bound authorization.

Identity/provenance:

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
authorizationSha256 = 469d1614a8e6609b05cca6047c364dab35754a41ede825f54de492d47d8c8e75
sourceCommit = a8fd9ac0361d276e0f4a05e7df7d7a0c0ecd6ad2
sourceTreeDirty = false
generatedAt = 2026-08-21T15:30:48.459Z
```

Exact population:

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
```

Generation summary:

```text
uniqueHistoricalTrajectories = 1884
duplicateHistoricalTrajectoryGroups = 121
largestHistoricalTrajectoryGroup = 7
distinctOpeningPrefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
```

Frozen condition assignment was realized exactly:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

The manifest-reported scientific source-file SHA-256 map matched the frozen authorization map. The compact generation record was archived in:

```text
results/STAGE_1_GENERATION_RESULT.json
generation result commit = bb6375ff1ce3afab00d588b4b6e017b6aaf24541
```

Generation-level counts numerically exceed the frozen future minima for unique historical trajectories (1884 >= 1600) and opening-prefix diversity (1621 >= 128). This is not a complete readiness decision.

At this point independent verification remained mandatory before selection.

## 2026-08-22 — Stage 1 independent full replay/search verification PASS

The investigator returned exact local HEAD before verification:

```text
897dcd2cb8775f8c129dbbde01167eef1f973089
```

The independent verifier replayed all generated games from initial state and seed and recomputed trajectory AI search.

Returned result:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
verifiedAt = 2026-08-22T03:07:13.071Z
sourceCommit = 897dcd2cb8775f8c129dbbde01167eef1f973089
sourceTreeDirty = false
```

Condition counts matched the generation manifest exactly:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

The returned source-file SHA-256 map matched the authorization-bound map.

Machine-readable verification record:

```text
results/STAGE_1_VERIFICATION_RESULT.json
verification result commit = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
```

Decision:

```text
Stage 1 independent full replay/search verification = PASS
state selection gate = OPEN
selection readiness = PENDING
measurement = BLOCKED
discovery = BLOCKED
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

The next permitted operation is frozen outcome-blind state selection only. If selection readiness fails, no seed extension, replacement sampling, phase reassignment or threshold relaxation is authorized.

## 2026-08-22 — Stage 1 outcome-blind selection readiness PASS

The investigator returned exact local HEAD before selection:

```text
2f6567bab0590ca7741fd8ad9907118544f6331d
```

The pre-selection status showed the complete generated and verified corpus, no prior selection audit, zero measurement files, and no discovery result. The source-file SHA-256 map remained identical to the authorization-bound map.

The frozen outcome-blind selection procedure returned:

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

All frozen selection/readiness gates passed. The minimum selected stratum count was 185, above the required 100. The 70 trajectories without an eligible root in their assigned phase remained unavailable; they were not replaced or reassigned. Both post-collapse phase pools were already above 600 before deterministic quota ranking.

Machine-readable selection record:

```text
results/STAGE_1_SELECTION_RESULT.json
selection result commit = d6a8617a517140e34e9af3a5f2b0793884fb1345
```

Decision:

```text
Stage 1 selection readiness = PASS
measurement gate = OPEN
measurement readiness = PENDING
discovery = BLOCKED
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

The next permitted operation is the frozen measurement phase over all 1200 selected roots. Discovery remains blocked until measured move records are at least 3600 and every selected root has a complete finite D3 candidate table.
