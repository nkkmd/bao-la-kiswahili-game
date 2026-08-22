# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic workload/timing benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory bad-move / misvaluation candidate discovery | 2048 verified games; 1200 selected roots; 5295 measured moves | **COMPLETE / 4 EXPLORATORY CANDIDATES PROMOTED** |
| `BMP-S2-FORMAL-*` | Fresh prospective confirmation of Stage 1 candidates | none | **SPEC NOT CREATED / GENERATION NOT AUTHORIZED** |

## Stage 1 frozen identity

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
games = 2048
seeds = 22400001..22402048
selected roots = 1200
Namua / Mtaji = 600 / 600
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
```

## Stage 1 execution chain

```text
contract freeze = 94b565468a9222dcaee0576529147ef032a284e6
contract validation = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation = 8df328ca238611919ac58c262b92058712ee1049
tooling validation PASS = cd26cb3280fde00663618162f7c1e2d306470032
source SHA freeze = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
generation authorization = 1af3828c1c25789d6f4af590ee973cffd34bca46
generation result = bb6375ff1ce3afab00d588b4b6e017b6aaf24541
verification result = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
selection result = d6a8617a517140e34e9af3a5f2b0793884fb1345
measurement result = 5e916c6676022a50d551310f21cf1d3414b6c27c
discovery execution HEAD = 14c0d29683611ecd76771a213ce2380cb71fa18d
discovery result = ffb9184d84c775e94f52b91f0c1621ea46061a93
```

## Readiness results

```text
unique historical trajectories = 1884 >= 1600                 PASS
selected unique rule states = 1200                             PASS
Namua / Mtaji selected = 600 / 600                            PASS
distinct selected opening prefixes = 1067 >= 128              PASS
minimum selected generation-stratum count = 185 >= 100        PASS
measured move records = 5295 >= 3600                          PASS
all 1200 selected roots finite D3 candidate tables = true     PASS
```

No replacement, phase reassignment or readiness rescue occurred.

## Stage 1 discovery result

```text
matcherCount = 16421
lowSupportMatcherCount = 9553
detailedCandidateCount = 123624
promotion passing before support-equivalence = 11
promotion passing after support-equivalence = 11
promoted candidates after deterministic ranking/caps = 4
manual override = false
```

The raw discovery artifact remains local and hash-bound:

```text
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

## Stage 1 promoted candidate set

| Candidate | Phase | Matcher summary | Failure token | Family | Support | Failure rate | D3 inferior | D3 TopSet | Median rank loss |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| `BMP-S1-C01` | Namua | frontOccupied 6-8; no house; indexed row0/index4 right-side left capture | `worstReplyActorFrontConnectionsDeltaNegative` | response-envelope | 26 | 1.000000 | 0.730769 | 0.076923 | 0.732143 |
| `BMP-S1-C02` | Namua | same matcher/support as C01 | `actorCaptureMoveDeltaNegative` | immediate-structural | 26 | 0.846154 | 0.730769 | 0.076923 | 0.732143 |
| `BMP-S1-C03` | Namua | same matcher/support as C01 | `actorLegalMoveDeltaNegative` | immediate-structural | 26 | 0.846154 | 0.730769 | 0.076923 | 0.732143 |
| `BMP-S1-C04` | Mtaji | frontOccupied 3-5; legalMoves 5+; coarse row1 right capture | `allRepliesActorCaptureMoveDeltaNegative` | response-envelope | 27 | 0.666667 | 0.703704 | 0.148148 | 0.600000 |

All four satisfy every frozen promotion gate.

Candidate IDs follow exact deterministic promoted order. C01-C03 share the same opportunity support but remain distinct because support-equivalence includes the failure token.

## Interpretation and next stage

```text
Stage 1 candidate confirmation = NOT PERFORMED
confirmatory reuse of Stage 1 data = FORBIDDEN
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
```

The four promoted patterns are exploratory candidates only. They are not established game-theoretic blunders, human misconception patterns, expert/traditional knowledge or pedagogical principles.

The next permissible research step is a prospective Stage 2 formal-confirmation design on fresh data.
