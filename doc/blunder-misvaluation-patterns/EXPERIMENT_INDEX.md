# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic workload/timing benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory bad-move / misvaluation candidate discovery | future fresh corpus | **SPEC FROZEN / CONTRACT PASS / TOOLING VALIDATION PENDING / NOT AUTHORIZED** |
| `BMP-S2-FORMAL-*` | Fresh candidate confirmation | future fresh corpus | **BLOCKED** |

## Stage 0 closure

```text
semantics tests = PASS
feasibility coverage = PASS
feasibility source HEAD = 45ce006eb63d5555a030d50fe7aa4e97637db327
D3+Q1 primary reference = RETAIN
scientific corpus generated = 0
```

## Stage 1 frozen identity

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
contract validation execution HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
games = 2048
seeds = 22400001..22402048
root target = 1200 if readiness passes
Namua / Mtaji = 600 / 600
```

The full reserved Stage 1 seed block is the exact frozen population. No outcome-dependent extension is allowed.

## Stage 1 contract validation

```text
canonical validator = PASS
canonical contract test = PASS
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
generationAuthorizedBySpecAlone = false
```

Machine-readable record: `results/STAGE_1_CONTRACT_VALIDATION_RESULT.json`.

## Stage 1 readiness gate

```text
unique historical trajectories >= 1600
selected unique rule states = 1200
Namua selected = 600
Mtaji selected = 600
distinct opening prefixes >= 128
selected per generation stratum >= 100
measured move records >= 3600
complete finite D3 tables for all selected roots
```

Failure blocks discovery and does not authorize replacement or extension.

## Stage 1 promotion gate

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
opening prefixes >= 6
max one opening prefix <= 0.40
generation strata >= 3
max one stratum <= 0.60
failure rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Automatic cap: 6 total / 3 per phase / 2 per failure family. Manual override forbidden.

## Stage 1 execution tooling

Materialized:

```text
tools/experiments/lib/blunder-misvaluation-stage1-corpus.js
tools/experiments/lib/blunder-misvaluation-stage1-discovery.js
tools/experiments/run-blunder-misvaluation-stage1-exploratory.js
tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js
test/blunder-misvaluation-stage1-tooling.test.js
.github/workflows/blunder-misvaluation-stage1-tooling.yml
```

The technical tooling test uses only a non-scientific fixture seed namespace beginning at `99000001`.

## Current stage gate

```text
Stage 0 semantics PASS                         DONE
Stage 0 compute feasibility PASS               DONE
Stage 1 population/seed count frozen           DONE
candidate grammar/promotion gates frozen       DONE
Stage 1 spec frozen                            DONE
canonical Stage 1 contract validation          PASS
runner + independent verifier materialized     DONE
runner/verifier technical validation           PENDING
source-hash-bound explicit authorization       ABSENT / PENDING
```

Stage 2 remains blocked.
