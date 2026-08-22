# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic D3+Q1 workload benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory candidate discovery | 2048 verified games; 1200 selected roots; 5295 measured moves | **COMPLETE / 4 EXPLORATORY CANDIDATES PROMOTED** |
| `BMP-S2-FORMAL-2026-08-22-v1` | Fresh prospective formal confirmation of exact Stage 1 candidates | none | **DESIGN/SPEC FROZEN / TOOLING MATERIALIZED / LOCAL TECHNICAL VALIDATION PENDING / GENERATION NOT AUTHORIZED** |

## Stage 1 frozen result

```text
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
seeds = 22400001..22402048
unique historical trajectories = 1884
selected roots = 1200
Namua / Mtaji = 600 / 600
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measured moves = 5295
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
promoted candidates = 4
raw discovery SHA-256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

Formal Stage 2 inputs:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share one exact Namua support group; C04 uses one Mtaji support group.

## Stage 2 frozen identity

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
baseline integrated main = 52f5635be7064b5016baf7cde82faebe60609d9e
research branch = research/blunder-misvaluation-patterns-stage2-formal
candidate freeze ID = BMP-S2-CANDIDATES-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 097aa6450f270254ec6dee2a7fd7e74a2d8298cae36923a39e822b2137172730
```

## Stage 2 population

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening random plies = 8
```

Generation strata:

```text
B-D1 = 683
B-D2 = 683
B-D3 = 683
LS-D2 = 683
V2-D2 = 682
LE-D2 = 682
```

## Stage 2 identity firewall

Formal evidence requires final Stage 1 overlap:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

Trajectory/opening overlap is removed before root selection. Rule-state overlap is removed only after outcome-blind root selection, with no alternate root, replacement, or seed extension.

## Stage 2 estimability gates

Per candidate:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Failure -> `INCONCLUSIVE-NOT-ESTIMABLE` with no rescue.

## Stage 2 formal endpoints

Two co-primary endpoints per candidate:

```text
failure-signature recurrence: exact one-sided binomial H0 p<=0.50; observed floor >=0.65
D3-inferior recurrence:       exact one-sided binomial H0 p<=0.50; observed floor >=0.70
```

Eight planned tests use Holm-Bonferroni FWER 0.05. Additional confirmation consistency gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Candidate labels:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

## Stage 2 verification chain

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal D3 measurement
-> independent formal measurement verification
-> formal evaluation
```

Formal evaluation is blocked until independent measurement verification reproduces the exact measurement hash and Stage 1 identity firewall.

## Current gate

```text
Stage 2 contract validator = materialized
Stage 2 contract test = materialized
Stage 2 runner/verifiers/evaluator = materialized
Stage 2 tooling semantics test = materialized
Stage 2 CI workflows = materialized
local technical validation = PENDING
source-file SHA freeze = PENDING
generation authorization = NOT CREATED
scientific generation = NOT AUTHORIZED
formal result = NONE
```

The next action is pre-authorization technical validation only. No Stage 2 scientific corpus may be generated until the exact source map is frozen and a separate authorization is committed.
