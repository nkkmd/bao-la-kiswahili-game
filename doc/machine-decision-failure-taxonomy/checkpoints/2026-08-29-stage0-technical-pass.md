# MDFT-STUDY1 — Stage 0 Technical Pass

Date: 2026-08-29

## Canonical disposition

```text
Stage = MDFT-S0-TECHNICAL-2026-08-29-v1
Disposition = STAGE0-TECHNICAL-PASS
Scientific inference = NONE
Stage 1 scientific generation = NOT AUTHORIZED BY THIS CHECKPOINT
Stage 2 = NOT AUTHORIZED
```

Canonical machine-readable result:

```text
doc/machine-decision-failure-taxonomy/results/STAGE_0_TECHNICAL_RESULT.json
```

## Core technical validation

Canonical GitHub Actions run:

```text
run = 33256737040
head = ad2a47401f38c58228d45270c94389d16c21dda9
conclusion = success
artifact = 9716030172
artifact digest = sha256:23f08a39891ba64015870ddf616e8d258619172b690aac88e9165ab864b62206
core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
```

A second technical run (`33256767045`) reproduced the same core SHA-256 exactly.

Four technical-only fixtures were used: two Namua and two Mtaji. No Stage 1/2 scientific seed was used.

The following controls passed:

- positive / negative exact comparer controls
- deterministic replay
- authoritative RAW identity and reconstruction
- exact move identity and variant distinction
- canonical ordering / ordering permutation
- leakage sentinel
- JSON roundtrip / canonical serialization
- production / independent exact search equality
- B1024 complete-depth-3 feasibility on all four fixtures
- compressed sharding and GitHub Actions artifact transfer

Observed canonical core resource footprint:

```text
wall clock = 6232.648148 ms
max RSS = 94476 KB
canonical bytes = 71530
gzip bytes = 4166
technical shard ceiling = 131072 bytes
```

These values are technical feasibility observations, not estimates of a scientific target distribution.

## F05 technical eligibility

The search-consistent canonical line trace matched exactly between production and independent implementations on the Stage 0 fixtures.

```text
MDFT-F05 = TECHNICALLY-ELIGIBLE
```

## F09 technical exclusion

The closed Position Typology study's exact frozen morphology classifier depends on an unpreserved local candidate artifact containing the fitted scaler and centroids. The current repository does not contain an alternative exact authoritative copy.

Per the prospectively frozen rule, no refit, estimator or replacement morphology classifier is permitted.

```text
MDFT-F09 = TECHNICALLY-INELIGIBLE
reason = FROZEN_HISTORICAL_CLASSIFIER_NOT_EXACTLY_RECONSTRUCTIBLE_FROM_CURRENT_PRESERVED_REPOSITORY_SOURCES
```

This does not alter any historical MTAJI-M1/MTAJI-M2 result.

## F10 technical eligibility

Canonical F10 preflight:

```text
run = 33256932295
head = 04ffda12149ab73b4d4a2729eefbdc5ff4f4f225
conclusion = success
artifact = 9716090090
artifact digest = sha256:8acf94307a0f12d42ef53580c1178249822f394a0e617f4f62dba33326a4e179
bounded continuation = 6 plies
fixtures = 4
production/independent traces = exact
wall clock = 25279.321986000003 ms
max RSS = 97296 KB
gzip bytes = 2570
```

All prospectively declared F10 gates passed.

```text
MDFT-F10 = TECHNICALLY-ELIGIBLE
```

## Stage 1 binding

The Stage 1 technical-eligible search space is therefore frozen before scientific evidence inspection as:

```text
MDFT-F01
MDFT-F02
MDFT-F03
MDFT-F04
MDFT-F05
MDFT-F06
MDFT-F07
MDFT-F08
MDFT-F10
```

`MDFT-F09` is excluded before Stage 1 consumption and may not be replaced after outcome inspection.

## Next gate

Stage 1 remains `RESERVED / UNCONSUMED`. Before consuming seeds `28910001..28914096`, freeze:

1. exact Stage 1 machine-readable spec and SHA-256;
2. production and independent source hashes;
3. exact leaf assignment and promotion rules;
4. source generation / selection / dedup contracts;
5. resource and artifact ceilings;
6. artifact-transfer failure mapping;
7. source-freeze commit;
8. explicit Stage 1 authorization.
