# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic technical workload/timing benchmark for D1/D2/D3+Q1 plus structural measurement | none | **TOOLING READY / EXECUTION PENDING** |
| `BMP-S1-EXPLORATORY-*` | Fresh bad-move candidate discovery | future fresh corpus | **NOT SPECIFIED / NOT AUTHORIZED** |
| `BMP-S2-FORMAL-*` | Fresh candidate confirmation | future fresh corpus | **BLOCKED** |

## Stage 0 technical validation

Tooling commit:

```text
dff7d11874c92d585f50f57b3077204271ab682b
```

Required local tests returned PASS:

```text
Position-complexity search diagnostic tests passed
Tactical motif Stage 0 feature tests passed
Blunder / misvaluation Stage 0 technical tests passed
```

The exact local HEAD was not included in the returned transcript. This does not reopen the technical result, but a separate source-hash-bound audit remains mandatory before scientific generation authorization.

## Stage 0 feasibility benchmark

```text
script = tools/experiments/benchmark-blunder-misvaluation-stage0.js
benchmarkId = BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1
state source = deterministic / no RNG / technical fixture walks
scientific seed namespace used = false
scientific inference authorized = false
```

## Current stage gate

Stage 1 remains blocked until:

```text
technical semantics PASS                         DONE
D3+Q1 compute feasibility measured              PENDING
Stage 1 exact population/seed count frozen      PENDING
candidate grammar/promotion gates frozen        PENDING
Stage 1 spec validated                          PENDING
source-bound explicit authorization             PENDING
```

Stage 2 remains blocked until Stage 1 is completed and formal candidate handling is frozen before any Stage 2 data exist.
