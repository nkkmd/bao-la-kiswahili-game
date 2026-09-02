# SFCDF-STUDY1 — Stage 1 development PASS

Date: 2026-09-02

## Formal Stage 1 disposition

**`STAGE1-PASS`**

Exactly one authorized scientific execution was performed.

```text
run = 33621863279
trigger SHA = 75f2691c19533ce9300abfda88987ad3436d381e
lease commit = 923f890302e50a1ae19d184eb9120105559f8381
scientific job = success
mirror commit = b7b2abfa
artifact ID = 9843276993
artifact name = sfcdf-stage1-development-result-33621863279
artifact size = 11025 bytes
artifact ZIP SHA-256 = b3aeea3c1058d98b8b59fe0eaa69edc734f60e2ccb04223a464d842a78e33a56
```

The artifact was durably uploaded before repository mirroring. The mirror copied exact artifact bytes without recomputation.

## Integrity / estimability

```text
selected paired trajectories = 12
selected roots = 24
population complete = true
root resource pass = true
stage resource pass = true
source identity exact = true
static implementation independence = true
all root exact = true
pair comparison exact = true
development summary exact = true
stage scientific exact = true
production stage scientific core SHA-256 = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
independent stage scientific core SHA-256 = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
```

Stage 1 seed `31410001..31410192` is consumed. The no-rescue boundary is crossed and active.

## Frozen promoted candidate set

Exactly two candidates passed the prospectively frozen Stage 1 promotion gates:

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` — frozen direction **`MTAJI-GREATER`**
2. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` — frozen direction **`NAMUA-GREATER`**

Formal promoted candidate set:

```json
[
  {"candidateId":"SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION","direction":"MTAJI-GREATER"},
  {"candidateId":"SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO","direction":"NAMUA-GREATER"}
]
```

Non-promoted candidates remain non-promoted and cannot be revived in Stage 2:

- C2 width-compression fraction: 6 positive / 6 negative; dominance failed.
- C3 longest unit-width run: 4 positive / 3 negative / 5 zero; non-zero and dominance gates failed.
- C4 reconvergent-state occupancy: 0 positive / 3 negative / 9 zero; non-zero gate failed.
- C5 root-branch overlap: only 8/12 comparable and 1 non-zero; coverage and non-zero gates failed.

Stage 1 descriptive promotion counts for the promoted candidates:

```text
C1: comparable 12 / Mtaji>Namua 11 / Namua>Mtaji 1 / zero 0
C6: comparable 12 / Mtaji>Namua 0 / Namua>Mtaji 10 / zero 2
```

These are development evidence, not formal confirmation.

## Stage 2 boundary

Stage 1 result reports `stage2AuthorizationEligible=true`, but Stage 2 remains **`NOT-AUTHORIZED-NOT-EXECUTED`** until a separate Stage 2 authorization review and pre-execution tooling/source freeze are completed.

Stage 2 seed `31420001..31420288` remains **NOT CONSUMED**.

Protected depth-10 holdout remains **SEALED / NOT GENERATED / NOT READ**.
