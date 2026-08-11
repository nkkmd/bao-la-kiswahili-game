# Checkpoint — Stage 1 Extension Complete / Readiness Not Met / Extension Risk-Set Scope Frozen

Date: 2026-08-11

## Completed

The fixed 384-paired-opening Stage 1 exposure-support extension has completed.

Technical verification and deterministic-clock audit passed.

The inherited Category-A pipeline and frozen CBE classifier were applied without definition changes.

## Extension identity

```text
source commit = 19dde6fded74283942519e7a7cceabfc8f9786c1
games = 768
observations = 42980
conditions = P2-D2 + V2-D2
paired opening replicates = 384
```

## Exposure result

Extension:

```text
raw Namua CBE rows = 6
unique CBE trajectory-ply units = 4
unique CBE trajectories = 4
candidate plies = 24, 26, 26, 27
```

Combined with the primary pilot:

```text
raw CBE condition rows = 8
unique CBE trajectory-ply units = 5
unique CBE trajectories = 5
```

Frozen Stage 2 readiness minimum:

```text
>= 10 unique units
>= 8 unique trajectories
```

Result:

```text
NOT MET
```

The threshold is not waived.

## Unchanged interpretation boundaries

- first-Mtaji timing remains deterministic at ply 44 for surviving standard trajectories;
- survival/hazard interpretations remain unauthorized;
- duplicate condition rows are not independent replication;
- morphology effects remain uninspected for comparator/design selection;
- the extension is permanently consumed exploratory data.

## New prerequisite before further generation

The primary-pilot exact-ply R0–R3 audit covered only the CBE unit at ply 33.

The extension adds CBE support at plies 24, 26, and 27.

Therefore the unchanged R0–R3 support rules are now frozen for application to every fully ascertained extension CBE unit before any additional games are generated.

Canonical amendment:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_3.md
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RISKSET_RUNBOOK.md
```

## Pause point

> **Stage 1 exposure extension is complete and technically valid, but the preregistered 10-unit / 8-trajectory Stage 2 readiness minimum is not met. Combined independent CBE support is 5 units / 5 trajectories. No additional corpus generation is authorized until the unchanged exact-ply R0–R3 risk-set audit is applied to all extension CBE units at the newly observed clock locations.**
