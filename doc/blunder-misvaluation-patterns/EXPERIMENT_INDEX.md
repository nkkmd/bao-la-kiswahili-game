# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic D3+Q1 workload benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory candidate discovery | 2048 verified games; 1200 selected roots; 5295 measured moves | **COMPLETE / 4 EXPLORATORY CANDIDATES PROMOTED** |
| `BMP-S2-FORMAL-2026-08-22-v1` | Fresh prospective formal confirmation of exact Stage 1 candidates | none yet | **SPEC/SOURCE FROZEN / TECHNICAL VALIDATION PASS / GENERATION AUTHORIZED** |

## Stage 1 frozen result

```text
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
seeds = 22400001..22402048
unique historical trajectories = 1884
selected roots = 1200
Namua / Mtaji = 600 / 600
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
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
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
technical validation result commit = 3d5a1a33f673c9c98ba6a5ed2862b25c8d76e777
source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
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

## Stage 2 estimability and formal endpoints

Per candidate:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Two co-primary endpoints per candidate:

```text
failure-signature recurrence: exact one-sided binomial H0 p<=0.50; observed floor >=0.65
D3-inferior recurrence:       exact one-sided binomial H0 p<=0.50; observed floor >=0.70
```

Eight planned tests use Holm-Bonferroni FWER 0.05. Additional gates are D3 TopSet rate <=0.20 and median normalized rank loss >=0.50.

## Verification chain

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal D3 measurement
-> independent formal measurement verification
-> formal evaluation
```

## Current gate

```text
technical validation = PASS
exact source-file SHA freeze = COMPLETE
generation authorization = COMPLETE
scientific generation = AUTHORIZED
generated games = 0 / 4096
formal result = NONE
```

The next action is the fixed 4096-game Stage 2 generation. After generation, independent full replay/search verification is mandatory before selection.
