# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics and compute feasibility | none | **TOOLING COMMITTED / EXECUTION RESULT PENDING** |
| `BMP-S1-EXPLORATORY-*` | Fresh bad-move candidate discovery | future fresh corpus | **NOT SPECIFIED / NOT AUTHORIZED** |
| `BMP-S2-FORMAL-*` | Fresh candidate confirmation | future fresh corpus | **BLOCKED** |

## Stage 0 technical materialization

```text
tooling commit = dff7d11874c92d585f50f57b3077204271ab682b
wrapper = tools/experiments/lib/blunder-misvaluation-patterns.js
test = test/blunder-misvaluation-stage0.test.js
workflow = .github/workflows/blunder-misvaluation-stage0.yml
```

No technical PASS is claimed until an execution result is observed and archived.

## Current stage gate

The next executable work is Stage 0 technical validation only.

Stage 1 remains blocked until:

```text
technical smoke passes
Stage 1 exact population/seed count is frozen
candidate grammar/promotion gates are machine-frozen
Stage 1 spec is validated
source-bound explicit authorization exists
```

Stage 2 remains blocked until Stage 1 is completed and formal candidate handling is frozen before any Stage 2 data exist.
