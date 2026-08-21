# Blunder / Misvaluation Patterns Study 1 — Stage 1 Generation Authorization

Date: 2026-08-21  
Status: **STAGE 1 EXPLORATORY GENERATION AUTHORIZED / SCIENTIFIC CORPUS NOT YET GENERATED**

## Identity

```text
studyId = BMP-STUDY1
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
contract validation execution HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation commit = 8df328ca238611919ac58c262b92058712ee1049
tooling validation result commit = cd26cb3280fde00663618162f7c1e2d306470032
execution source freeze commit = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
generation authorization commit = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

## Pre-authorization technical evidence

The investigator returned exact local HEAD `8df328ca238611919ac58c262b92058712ee1049` and all required technical checks passed:

```text
canonical Stage 1 spec validator = PASS
Stage 1 contract test = PASS
Stage 1 tooling test = PASS
runner status surface = PASS
authorization file present before authorization = false
generated games before authorization = 0
manifest before authorization = absent
verification before authorization = absent
selection audit before authorization = absent
measurement files before authorization = 0
discovery result before authorization = absent
```

The returned source-file SHA-256 map was frozen in `STAGE_1_EXECUTION_SOURCE_FREEZE.json` before authorization.

## Authorized population

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
selected roots if readiness passes = 1200
Namua quota = 600
Mtaji quota = 600
output root = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1
```

## Authorized execution order

```text
generate
→ independent full replay/search verify
→ select
→ inspect selection readiness
→ measure
→ inspect measurement readiness
→ discover
```

Selection remains blocked unless independent full replay/search verification passes. Measurement remains blocked unless selection readiness passes. Discovery remains blocked unless measurement readiness passes.

## No-rescue boundary

```text
seed extension = forbidden
replacement sampling = forbidden
phase reassignment = forbidden
threshold retuning = forbidden
favorable subset selection = forbidden
depth selection after outcome inspection = forbidden
failed candidate renaming = forbidden
manual candidate promotion = forbidden
```

## Interpretation boundary

This authorization permits only Stage 1 exploratory generation and analysis under the frozen machine operationalization. It does not authorize:

- confirmatory inference;
- Stage 2 generation;
- game-theoretic blunder claims;
- human misconception claims;
- expert/traditional Bao claims.

## State at authorization

```text
Stage 1 generation authorized = true
Stage 1 scientific games generated = 0
Stage 2 generation authorized = false
formal scientific result = none
```
