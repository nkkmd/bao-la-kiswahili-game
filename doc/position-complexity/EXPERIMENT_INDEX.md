# Position Complexity / Difficulty Study — Experiment Index

更新日: 2026-08-12  
Status: **ACTIVE INDEX**

This index distinguishes technical validation, exploratory design development, and future formal confirmation. An entry here does not by itself authorize scientific inference.

## PCX-S0-T001 — Exact root/depth diagnostic technical validation

```text
stage = Stage 0
class = technical / measurement validation
scientific inference = none
status = COMPLETE / PASS
```

Purpose:

- validate exhaustive exact root-candidate searched values;
- validate tie-aware TopSet and depth trace;
- validate mate-domain handling;
- validate non-mutation, determinism, replay and existing-search consistency.

Key tooling:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/run-position-complexity-stage0-smoke.js
test/position-complexity-search-diagnostic.test.js
```

Result:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
workflow run = 31589325398
validated branch head = 7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
result = PASS / technical only
```

## PCX-S1-E001 — Multi-layer complexity exploratory design corpus

```text
stage = Stage 1
class = exploratory / design development
scientific inference = exploratory only
status = GENERATED / FULLY VERIFIED / EXPLORATORY-CONSUMED / SELECT+MEASURE PENDING
```

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
```

Frozen spec:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
```

Protocol/runbook:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-complexity/STAGE_1_RUNBOOK.md
```

Frozen population:

```text
768 games
seeds 20400001..20400768
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / depth2
max ply 100
```

Generation verification record:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
```

Verified corpus identity:

```text
gamesVerified = 768
observationsVerified = 43110
movesVerified = 42342
searchMovesRecomputed = 36211
fullSearchRecomputation = true
uniqueHistoricalTrajectories = 685
duplicateHistoricalTrajectoryGroups = 61
largestHistoricalTrajectoryGroup = 6
reachedMtajiGames = 732
verifiedIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
verification = PASS
```

The 768-game corpus and seed block are now permanently consumed exploratory material. No seed extension, selective regeneration, favorable reseeding or duplicate-trajectory replacement is allowed within v1.

Frozen next phases:

```text
select -> measure -> analyze
```

Primary design-development targets:

- selected-state / phase coverage after trajectory and rule-state deduplication;
- legalMoveCount distribution;
- D1→D2 / D2→D3 / D3→D4 TopSet instability prevalence;
- D2 best-second exact margin and tie prevalence;
- mate-domain prevalence;
- nodes/cutoffs/evaluation distributions;
- Stage 2 estimability gates.

Tooling:

```text
tools/experiments/run-position-complexity-stage1-exploratory.js
tools/experiments/verify-position-complexity-stage1-exploratory.js
tools/experiments/analyze-position-complexity-stage1-exploratory.py
test/position-complexity-stage1-runner.test.js
```

Artifact root:

```text
artifacts/local/position-complexity/stage1-exploratory-v1/
```

Formal reuse:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

## Future Stage 2

```text
experiment ID = NOT ASSIGNED
formal preregistration = NOT CREATED
formal corpus = NOT AUTHORIZED / NOT GENERATED
```

Stage 2 may only be designed after PCX-S1-E001 state selection, D1-D4 measurement, exploratory analysis and readiness-gate audit are completed and recorded. A fresh formal seed block and separate frozen preregistration are mandatory.
