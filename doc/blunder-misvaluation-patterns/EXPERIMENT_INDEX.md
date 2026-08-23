# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic D3+Q1 workload benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory candidate discovery | 2048 verified games; 1200 selected roots; 5295 measured moves | **COMPLETE / 4 EXPLORATORY CANDIDATES PROMOTED** |
| `BMP-S2-FORMAL-2026-08-22-v1` | Fresh prospective formal confirmation of exact Stage 1 candidates | 4096 generated + independently verified games; G01 1868 selected states; G02 810 selected states | **SELECTION PASS / FORMAL MEASUREMENT OPEN** |

## Stage 2 frozen identity

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
scientific source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
```

## Stage 2 corpus / verification

```text
games = 4096 / 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
fullSearchRecomputation = true
verification passed = true
```

Condition counts are B-D1/B-D2/B-D3/LS-D2 = 683 each and V2-D2/LE-D2 = 682 each.

## Stage 2 outcome-blind selection

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
```

Pre-selection Stage 1 firewall:

```text
historicalTrajectoryHash overlaps dropped = 299
openingPrefixHash overlaps dropped = 633
```

G01 Namua (`BMP-S2-C01/C02/C03`):

```text
eligible historical trajectories = 1890
Stage 1 rule-state overlap dropped = 0
duplicate selected rule states collapsed = 22
selected unique rule states = 1868
distinct opening prefixes = 1695
generation strata = 6
maximum opening-prefix share = 0.0021413276231263384
maximum stratum share = 0.20717344753747324
estimablePreview = true
```

G02 Mtaji (`BMP-S2-C04`):

```text
eligible historical trajectories = 823
Stage 1 rule-state overlap dropped = 1
duplicate selected rule states collapsed = 12
selected unique rule states = 810
distinct opening prefixes = 763
generation strata = 6
maximum opening-prefix share = 0.0049382716049382715
maximum stratum share = 0.18888888888888888
estimablePreview = true
```

Final identity firewall:

```text
historicalTrajectoryHash overlap = 0
openingPrefixHash overlap = 0
ruleStateKey overlap = 0
stage1IdentityFirewallPassed = true
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
selectionIntegrityPassed = true
```

## Formal Stage 2 inputs / endpoints

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share one Namua support group; C04 uses one Mtaji support group.

Per-candidate estimability requires >=96 unique trajectories and rule states, >=48 opening prefixes, <=0.10 maximum opening-prefix share, >=4 strata, and <=0.50 maximum stratum share.

Two co-primary endpoints per candidate use exact one-sided binomial tests against `p=0.50`, with observed floors `0.65` for failure recurrence and `0.70` for D3-inferior recurrence. Eight planned tests use Holm-Bonferroni FWER 0.05. Additional gates are D3 TopSet rate <=0.20 and median normalized rank loss >=0.50.

## Current gate

```text
generation = COMPLETE
independent corpus verification = PASS
support-group selection = PASS
formal D3 measurement = OPEN
independent measurement verification = PENDING
formal evaluation = BLOCKED
formal result = NONE
```
