# Position Complexity / Difficulty Study — Experiment Index

更新日: 2026-08-12  
Status: **ACTIVE INDEX**

This index distinguishes technical validation, exploratory design development, and future formal confirmation. An entry in this file does not by itself authorize scientific inference.

## PCX-S0-T001 — Exact root/depth diagnostic technical validation

```text
stage = Stage 0
class = technical / measurement validation
scientific inference = none
status = COMPLETE / PASS
```

Purpose:

- validate exact exhaustive root-candidate searched values;
- validate tie-aware TopSet and depth trace;
- validate mate-domain handling;
- validate non-mutation, determinism, replay and existing-search consistency.

Key tooling:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/run-position-complexity-stage0-smoke.js
test/position-complexity-search-diagnostic.test.js
```

Result record:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
```

Validated branch head:

```text
7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
```

Successful CI identity:

```text
workflow run = 31589325398
job = 94090388506
result = success
```

Interpretation:

```text
technical PASS only
not scientific confirmation
```

## PCX-S1-E001 — Multi-layer complexity exploratory design corpus

```text
stage = Stage 1
class = exploratory / design development
scientific inference = exploratory only
status = FROZEN / READY FOR LOCAL EXECUTION / NOT YET GENERATED
```

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
```

Frozen spec:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
```

Protocol/runbook:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-complexity/STAGE_1_RUNBOOK.md
```

Population:

```text
768 games
seeds 20400001..20400768
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / depth2
max ply 100
```

Primary design-development targets:

- legalMoveCount distribution and phase coverage;
- D1→D2 / D2→D3 / D3→D4 TopSet instability prevalence;
- D2 best-second exact margin and tie prevalence;
- mate-domain prevalence;
- nodes/cutoffs/evaluation distributions;
- unique historical trajectory / unique rule-state availability;
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
confirmatoryReuseAllowed = false
```

No seed extension or outcome-dependent replacement is authorized inside v1.

## Future Stage 2

```text
experiment ID = NOT ASSIGNED
formal preregistration = NOT CREATED
formal corpus = NOT AUTHORIZED / NOT GENERATED
```

A Stage 2 experiment ID is created only after PCX-S1-E001 is complete, consumed, independently reviewed, and the formal metric/population/test/sample-size/seed block are frozen prospectively.
