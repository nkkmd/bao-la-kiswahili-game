# G2-12 Stage 1 development implementation/source freeze

Date: 2026-08-31  
Study: `SSGTGE-STUDY1`  
Stage: `SSGTGE-S1-DEVELOPMENT-2026-08-30-v1`  
Status: **PROSPECTIVELY FROZEN / NOT YET AUTHORIZED**

## Prerequisite

The accepted technical prerequisite is:

```text
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 0 acceptance commit = e452aaaa10666369daa065d06a6d14abe53ddd6e
fresh depth 10/11 generated/read = false
```

Stage 0 v1 remains `STAGE0-TECHNICAL-INVALID` and is not rewritten by this freeze.

## Development evidence boundary

Stage 1 may consume only the immutable G2-05 formal result through exact depth 9:

```text
upstream Study = DRSSE-STUDY1
upstream decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
source Git blob = b25c9f51bdecf95d249df65ddd9b27cd1268d573
maximum depth read = 9
development source summary SHA256 = 04debfa47516d0288d9baf5cf1ff0d761c83c27ada16d9ea43c02be66887659a
```

Fresh depth 10 and 11 generation/read is prohibited.

## Frozen estimator competition

Exactly three candidates remain eligible for evaluation:

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

Primary series:

```text
newRawStateCount
treeNodeOccurrences
```

Rolling origins:

```text
5 -> 6
6 -> 7
7 -> 8
8 -> 9
```

Across the eight candidate×series backtest cells, eligibility requires finite positive predictions, no decrease versus the immediately prior observed layer, and maximum absolute natural-log error `<= 0.15`.

Winner rule remains prospectively fixed: minimum maximum absolute log error, then minimum mean absolute log error, then fixed E1/E2/E3 order.

## Frozen post-selection calculation

If one or more candidates are eligible, exactly one winner is frozen. Stage 1 then computes from development data only:

```text
q = selected maximum absolute log error
R1 = max(0.15, 2*q)
R2 = 2*R1
```

Depth 10 is a one-step point forecast. Depth 11 is recursively predicted after appending the depth-10 **prediction**, never an observed holdout value. Envelopes are `point * exp(±R)`.

No eligible candidate closes Stage 1 as `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`.

## Frozen source identities

```text
tools/experiments/lib/ssgtge-production.js = 71bc8a45d45df171edfde5d4882529c4a7e057fd
tools/experiments/lib/ssgtge-independent.js = cf462806552e038e4c23d0eb1cdf0cb211187472
tools/experiments/run-ssgtge-stage1-development.js = ad2c60428bb098d0a7328ed99dfb61a5c730e732
tools/experiments/verify-ssgtge-stage1-independent.js = eed18650da2b6eb652cba97f7a714d7d6968d485
.github/workflows/ssgtge-stage1-development.yml = 45c50148e998011e876ec80830638e55e49c8c15
preregistration/STAGE_1_DEVELOPMENT_SPEC.json = f79d38637fd22e99419da26f4044783d471ef79f
results/STAGE_0_V2_TECHNICAL_RESULT.json = 85cec4cc7454eac4f1e1bce1cbc179f27e460f94
G2-05 STAGE_2_FORMAL_RESULT.json = b25c9f51bdecf95d249df65ddd9b27cd1268d573
```

Machine-readable source binding is stored in `results/STAGE_1_SOURCE_HASHES.json`.

## Authorization rule

This freeze does **not** execute Stage 1. A subsequent authorization-only commit must have this source-freeze commit as its immediate parent and must bind the frozen Git blob identities.

Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`. G2-11 remains `NOT-AUTHORIZED` and unchanged.
