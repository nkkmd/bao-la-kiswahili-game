# TCTGD-STUDY1 — Reproducibility Index

Updated: 2026-09-02

## Program authorization

- `../research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md`
- formal decision: `G3-03-AUTHORIZED`
- authorization-review integration baseline: main `6b1457294666267c5a75c8516001acd1ef7d2fcd`

## Prospective freeze

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `checkpoints/2026-09-02-study-preregistration-freeze.md`

Frozen blobs at prereg freeze:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
LGTGMIV production = a4664f01535d6abbf6f83821befbb2fafd55cde6
LGTGMIV independent = 0c7239ac7acf146e9aee63dae66194681b8631d6
TCTGD production = 782ec5e7140d0b8e410d2156dc765c8b2f0c1a5d
TCTGD independent = 1435998dba938ecad15470370dd2ef096a046e83
Stage 0 runner = 8fe976990de7792926401334cfc0171599cd9059
Study protocol = 3f892949bc87f5963a77cb4604bacc7023faa3d9
Machine prereg = 3a651e3b34890c57a58065f091bcbcd062a68dda
```

Pre-checkpoint frozen-content HEAD:

`1ddf1f292ce48be2a0c866b0fa86ea060f2e613d`

Freeze checkpoint commit:

`9a9b5f834bdef216f370dbec56279ac3ed6e105e`

## Stage 0 authorization

- `authorizations/2026-09-02-stage-0-technical-authorization.md`
- authorization commit: `b725600730c4a876a6049a125ac3a07a1602b666`
- one-shot technical trigger commit: `0c0a707bfa0baa64815dac0b826d2720e247ff52`

Stage 0 uses only synthetic technical fixtures; no scientific seed is consumed.

## Stage 0 workflow

- workflow: `.github/workflows/tctgd-stage0-technical.yml`
- run: `33589334375`
- job: `100119933850`
- conclusion: `success`

Durable artifact:

```text
artifact ID = 9831182022
name = tctgd-stage0-technical-result
size = 762 bytes
ZIP SHA-256 = efa3669c06a20b793d3f8feff80f71535fb582c0d1165fed38cf4dc0c3f78924
```

## Stage 0 result

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-0/execution-summary.json`
- `checkpoints/2026-09-02-stage-0-technical-pass.md`

Deterministic Stage 0 core:

`e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5`

Sub-core hashes:

```text
fixtureProjectionSha256 = 9359c5bce1ab698e54fd70358bf7e980d503d8beba22cf2d50d465c41fb2138b
developmentBoundarySha256 = 013be87a703e0afe2ec0f856fdb15037ae74971be972c5813a64d30a3dba586c
formalBoundarySha256 = 18296a69371893a589b7819430960de01b78a44f15037e4f2b725b1d8a4dee8e
```

Stage 0 core explicitly records:

```text
freshScientificSeedAccess = false
protectedDepth10Access = false
```

## Fresh scientific stages

Stage 1:

```text
TCTGD-S1-DEVELOPMENT-2026-09-02-v1
seed = 31310001..31310192
status = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 2:

```text
TCTGD-S2-FORMAL-2026-09-02-v1
seed = 31320001..31320288
status = NOT-AUTHORIZED-NOT-EXECUTED
```

No G3-03 fresh scientific root, endpoint or candidate result exists at the current checkpoint.

## Protected holdout

Standard initial RAW-root complete exact depth-10 holdout:

`SEALED / NOT GENERATED / NOT READ`

It is not part of any TCTGD reproducibility command or resource-estimation path.
