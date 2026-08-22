# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic D3+Q1 workload benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory candidate discovery | 2048 verified games; 1200 selected roots; 5295 measured moves | **COMPLETE / 4 EXPLORATORY CANDIDATES PROMOTED** |
| `BMP-S2-FORMAL-2026-08-22-v1` | Fresh prospective formal confirmation of exact Stage 1 candidates | 4096 generated and independently verified games | **GENERATION COMPLETE / FULL VERIFICATION PASS / SELECTION OPEN** |

## Stage 2 frozen identity

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
scientific source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
```

## Stage 2 corpus result

```text
games = 4096 / 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
```

Condition counts:

```text
B-D1 = 683
B-D2 = 683
B-D3 = 683
LS-D2 = 683
V2-D2 = 682
LE-D2 = 682
```

## Independent corpus verification

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 4096
unique historical trajectories = 3559
distinct opening prefixes = 2827
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
```

Generation and verification are source/hash/count consistent. Selection is therefore open under the frozen execution order.

## Formal Stage 2 inputs

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share one Namua support group; C04 uses one Mtaji support group.

## Stage 1 identity firewall

Formal evidence requires zero final overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

No replacement, alternate root after rule-state overlap, or seed extension is allowed.

## Estimability / formal endpoints

Per candidate:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Two co-primary endpoints per candidate use exact one-sided binomial tests against `p=0.50`, with observed floors `0.65` for failure recurrence and `0.70` for D3-inferior recurrence. Eight planned tests use Holm-Bonferroni FWER 0.05. Additional gates are D3 TopSet rate <=0.20 and median normalized rank loss >=0.50.

## Current gate

```text
generation = COMPLETE
independent corpus verification = PASS
support-group selection = OPEN / PENDING
formal measurement = BLOCKED PENDING SELECTION REVIEW
independent measurement verification = PENDING
formal evaluation = PENDING
formal result = NONE
```
