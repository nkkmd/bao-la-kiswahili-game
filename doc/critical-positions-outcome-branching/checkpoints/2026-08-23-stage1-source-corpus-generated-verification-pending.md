# Checkpoint — Stage 1 source corpus generated / verification pending

Date: 2026-08-23

Study: `CPOB-STUDY1`  
Stage: `CPOB-S1-EXPLORATORY-2026-08-23-v1`

## Scientific state

The frozen Stage 1 exploratory source corpus has now been generated under the previously issued source-bound authorization.

```text
Stage 1 source generation = COMPLETE
independent full corpus replay verification = PENDING
outcome-blind root selection = NOT STARTED
continuation measurement = NOT STARTED
scientific continuation outcomes inspected = false
Stage 2 generation = NOT AUTHORIZED
```

This checkpoint records generation completion only. It does not authorize skipping independent corpus verification or proceeding directly to selection.

## Manifest identity

User-supplied generated manifest reports:

```text
schemaVersion = 1
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
authorizationSha256 = 34ae3f2afb066521f2165f6e16d5edd720ab9587b71c64dce677696ad23cd941
generatedAt = 2026-08-23T11:15:15.447Z
sourceCommit = 157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
node = v24.6.0
platform = linux
arch = x64
```

The manifest's scientific source-file SHA-256 mapping matches the authorized source mapping in `STAGE_1_EXPLORATORY_AUTHORIZATION.json`.

## Frozen population realized

```text
games = 3072 / 3072
seedStart = 22600001
seedEnd = 22603072
maxPly = 100
opening = 8-ply seeded-uniform exact E.moveVariants
```

Generation-stratum counts exactly match the preregistered allocation:

```text
B-D1 = 512
B-D2 = 512
B-D3 = 512
LS-D2 = 512
V2-D2 = 512
LE-D2 = 512
```

No seed extension or replacement generation is indicated or permitted.

## Outcome-independent generation summary

```text
uniqueHistoricalTrajectories = 2726
duplicateHistoricalTrajectoryGroups = 232
largestHistoricalTrajectoryGroup = 7
distinctOpeningPrefixes = 2226
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
```

These quantities are identity/diversity diagnostics only and do not inspect continuation outcomes or `D_range`.

## Pre-selection generation-level readiness

The preregistered generation-level identity/diversity gates are satisfied descriptively:

```text
minimumUniqueHistoricalTrajectories = 2500
observed = 2726
status = PASS

minimumGeneratedDistinctOpeningPrefixes = 1800
observed = 2226
status = PASS
```

This is **not** selection-readiness PASS. The 600-root / 300+300 quotas, selected-rule-state uniqueness, selected opening diversity, and selected generation-stratum gates can only be evaluated after independent corpus verification and deterministic outcome-blind selection.

Duplicate historical trajectories are expected to be collapsed by the frozen selection procedure; they are not replaced.

## Required next gate

Run independent full corpus replay verification before any root selection:

```bash
node tools/experiments/verify-critical-positions-stage1-exploratory.js \
  --phase corpus \
  --output artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1
```

Required before selection:

```text
passed = true
fullCorpusReplay = true
gamesVerified = 3072
```

If verification fails, stop. Do not repair by selectively regenerating games, replacing seeds, or proceeding to selection.
