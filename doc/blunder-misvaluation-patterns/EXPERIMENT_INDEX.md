# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic workload/timing benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory bad-move / misvaluation candidate discovery | 2048 verified games; 1200 selected roots; 5295 measured moves | **MEASUREMENT READINESS PASS / DISCOVERY NEXT** |
| `BMP-S2-FORMAL-*` | Fresh candidate confirmation | none | **BLOCKED / NOT AUTHORIZED** |

## Stage 1 frozen identity

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
games = 2048
seeds = 22400001..22402048
selected roots = 1200
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

## Generation + independent verification

```text
generation result commit = bb6375ff1ce3afab00d588b4b6e017b6aaf24541
games = 2048
unique historical trajectories = 1884
distinct opening prefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
verification result commit = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
fullSearchRecomputation = true
gamesVerified = 2048
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
```

## Stage 1 selection result

```text
selection execution HEAD = 2f6567bab0590ca7741fd8ad9907118544f6331d
selection result commit = d6a8617a517140e34e9af3a5f2b0793884fb1345
unavailable assigned phase = 70
phase pool after collapse = Namua 961 / Mtaji 852
selected unique rule states = 1200
selected phase counts = Namua 600 / Mtaji 600
distinct selected opening prefixes = 1067
replacementPerformed = false
phaseReassignmentPerformed = false
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
selection readiness = PASS
```

Selected generation-stratum counts:

```text
B-D1 = 191
B-D2 = 185
B-D3 = 218
LS-D2 = 203
V2-D2 = 187
LE-D2 = 216
```

## Stage 1 measurement result

```text
measurement execution HEAD = 1c7fc1f8d979d6952433406e7ab5d0a515a633fb
measurement result commit = 5e916c6676022a50d551310f21cf1d3414b6c27c
completed measurements = 1200
measured move records = 5295
minimum measured move records = 3600
all selected roots finite D3 candidate tables = true
measurement readiness = PASS
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
sourceTreeDirty = false
```

All measurement readiness gates passed. The discovery gate is therefore open.

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
outcome-blind state selection                   COMPLETE
selection readiness                             PASS
measurement                                     COMPLETE (1200/1200)
measurement readiness                           PASS
candidate discovery                             NEXT
Stage 2                                          BLOCKED / NOT AUTHORIZED
```

Stage 1 discovery remains exploratory. A zero-candidate result is admissible and does not permit post-hoc rescue or threshold retuning.
