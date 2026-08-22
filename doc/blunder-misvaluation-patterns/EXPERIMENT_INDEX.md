# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic workload/timing benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory bad-move / misvaluation candidate discovery | 2048 generated + verified games | **GENERATION COMPLETE / FULL VERIFICATION PASS / SELECTION NEXT** |
| `BMP-S2-FORMAL-*` | Fresh candidate confirmation | none | **BLOCKED / NOT AUTHORIZED** |

## Stage 1 frozen identity

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
games = 2048
seeds = 22400001..22402048
root target = 1200 if readiness passes
Namua / Mtaji = 600 / 600
```

## Pre-generation chain

```text
contract freeze = 94b565468a9222dcaee0576529147ef032a284e6
contract validation = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation = 8df328ca238611919ac58c262b92058712ee1049
tooling validation PASS = cd26cb3280fde00663618162f7c1e2d306470032
source SHA freeze = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
generation authorization = 1af3828c1c25789d6f4af590ee973cffd34bca46
```

## Generation result

```text
generation result commit = bb6375ff1ce3afab00d588b4b6e017b6aaf24541
games = 2048
unique historical trajectories = 1884
distinct opening prefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
sourceTreeDirty = false
```

## Independent verification result

```text
verification execution HEAD = 897dcd2cb8775f8c129dbbde01167eef1f973089
verification result commit = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
unique historical trajectories = 1884
distinct opening prefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
sourceTreeDirty = false
```

Generation and verification stratum counts agree exactly: 342 / 342 / 341 / 341 / 341 / 341 for `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, `LE-D2`.

## Stage 1 selection/readiness gate

The next operation is frozen outcome-blind state selection. After selection, all of the following must pass:

```text
unique historical trajectories >= 1600
selected unique rule states = 1200
Namua selected = 600
Mtaji selected = 600
distinct selected opening prefixes >= 128
selected roots per generation stratum >= 100
```

Measurement remains blocked until selection readiness passes. Later measurement-level gates are:

```text
measured move records >= 3600
complete finite D3 tables for all selected roots
```

Failure blocks downstream discovery and does not authorize replacement or extension.

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

## Current stage gate

```text
Stage 0 semantics PASS                         DONE
Stage 0 compute feasibility PASS               DONE
Stage 1 spec/contract                          FROZEN + PASS
runner/verifier technical validation           PASS
exact scientific source SHA map                FROZEN
source-bound Stage 1 authorization              AUTHORIZED
scientific corpus generation                    COMPLETE (2048/2048)
independent full replay/search verification     PASS
state selection                                 NEXT / NOT YET EVALUATED
selection readiness                             PENDING
measurement                                     BLOCKED
discovery                                       BLOCKED
Stage 2                                          BLOCKED
```
