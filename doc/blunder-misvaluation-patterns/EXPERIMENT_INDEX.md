# EXPERIMENT_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23

| Stage / ID | Purpose | Scientific data | Status |
| --- | --- | --- | --- |
| `BMP-S0-DESIGN-2026-08-20-v1` | Restore boundaries, fix constructs/reference semantics, reserve seeds | none | **COMPLETE / DESIGN FROZEN** |
| `BMP-S0-TECHNICAL-SMOKE-2026-08-20-v1` | Fixture validation of regret/search/move/identity semantics | none | **PASS** |
| `BMP-S0-D3Q1-FEASIBILITY-2026-08-20-v1` | Deterministic D3+Q1 workload benchmark | none | **PASS** |
| `BMP-S1-EXPLORATORY-2026-08-20-v1` | Fresh exploratory candidate discovery | 2048 verified games; 1200 roots; 5295 moves | **COMPLETE / 4 EXPLORATORY CANDIDATES PROMOTED** |
| `BMP-S2-FORMAL-2026-08-22-v1` | Fresh prospective formal confirmation of exact Stage 1 candidates | 4096 verified games; 2678 formal measurements | **COMPLETE / 4 ESTIMABLE / 0 CONFIRMED / 4 NOT-CONFIRMED** |

## Frozen Stage 2 identity

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
```

## Verified Stage 2 chain

```text
games = 4096 / 4096
unique historical trajectories = 3559
distinct opening prefixes = 2827
fullSearchRecomputation = true
corpus verification passed = true
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 selected/measured states = 1868
G02 selected/measured states = 810
final Stage 1 overlap = 0 / 0 / 0
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
measurementHashMatches = true
independent D3 table recomputation = true
independent matcher/failure recomputation = true
measurement verification passed = true
```

## Formal result

All four candidates passed estimability and technical-integrity gates.

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
confirmedCount = 0
```

Formal embedded result hash:

```text
1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
```

Canonical compact record:

- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)

## Formal interpretation

C01-C03 strongly reproduce their frozen structural failure signatures but do not reproduce D3-inferior status at the preregistered confirmation rate. C04 falls below the failure-signature absolute floor and also fails the D3-inferior endpoint.

`NOT-CONFIRMED` is limited to the frozen machine-operational definition. It is not proof of game-theoretic soundness and does not authorize human, expert/traditional, pedagogical, causal, or external-validity claims.

## Study state

```text
Stage 0 = COMPLETE
Stage 1 = COMPLETE
Stage 2 = COMPLETE
Study 1 = CLOSED
```
