# SFCDF-STUDY1 — Stage 2 formal authorization

Date: 2026-09-02

## Decision

**`STAGE2-AUTHORIZED`**

Exactly one fresh formal Stage 2 scientific execution is authorized.

## Authorization baseline

```text
authorized scientific-content HEAD = 1d6ba1982855cc3ddf3abf9ebd9c9b8daa5c21c4
authorization nonce = SFCDF-S2-AUTH-2026-09-02-V1-01
max scientific executions = 1
Stage 2 seed block = 31420001..31420288
Stage 2 target pairs = 18
```

## Pre-authorization state

```text
Stage 1 = STAGE1-PASS
Stage 1 scientific executions = 1 authorized / 1 actual
Stage 1 promoted set = C1 MTAJI-GREATER; C6 NAMUA-GREATER
Stage 2 preparation eligibility = PASS
Stage 2 formal-input materialization = PASS / run 33623755813
Stage 2 source validation = PASS / run 33624044515
Stage 2 scientific workflow executions before authorization = 0
Stage 2 seed = NOT CONSUMED
fresh Stage 2 scientific evidence = NOT GENERATED / NOT READ
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen formal candidates

Only:

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` / `MTAJI-GREATER`
2. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` / `NAMUA-GREATER`

C2–C5 remain excluded.

## Execution integrity

The machine authorization binds exact engine, prereg, firewall, formal-input, Stage 1 result, source-validation result, LGTGMIV implementations, G3-04 production/independent endpoint layers, Stage 1 selectors, Stage 2 selectors, formal runner, and Stage 2 scientific workflow by Git blob SHA.

The next and only permitted advancement before fresh computation is the dedicated `STAGE2_EXECUTION_TRIGGER`.

The workflow must first durably push `executions/stage-2-execution-started.json`. Fresh computation may begin only from that lease commit. Canonical Stage 2 result bytes must be uploaded as a GitHub Actions artifact before repository mirror.

Once fresh Stage 2 access begins:

- seed block is consumed,
- no-rescue remains active,
- this run cannot be rerun,
- implementation/statistical/endpoint/seed changes cannot rescue the same evidence.
