# EBRWS-STUDY1 — Stage 0 technical PASS

Date: 2026-09-01

Stage:

`EBRWS-S0-TECHNICAL-2026-09-01-v1`

Formal disposition:

`STAGE0-PASS`

## Evidence class

`TECHNICAL-NON-SCIENTIFIC`

Stage 0 used synthetic primitive fixtures only. No G3-02 fresh trajectory or RAW root was generated or read.

## Mandatory results

All prospectively required Stage 0 assertions passed:

- canonical serialization determinism
- exact-rational arithmetic
- denominator-zero handling
- tree width-shape boundary cases
- reply width-shape boundary cases
- exact 2/3 promotion boundary
- production / independent candidate-set exact agreement
- production / independent stage scientific-core exact agreement
- root-order invariance
- telemetry/scientific-core separation
- static implementation independence audit

Canonical stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Production and independent values are exactly identical.

Synthetic candidate-set digest:

`022c993b1c7174c8628cc7269a737e9672728b25106dc41a8dc345de51fc5a18`

The synthetic candidates are technical fixtures only and have no Bao scientific interpretation.

## Firewall state

```text
Stage 1 seed consumed = false
Stage 2 seed consumed = false
Fresh scientific root generated = false
Fresh scientific evidence read = false
Protected depth-10 access = false
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## Next gate

Stage 0 PASS does not automatically execute Stage 1. Stage 1 requires an explicit dated authorization after current-facing documentation synchronization and confirmation that the frozen protocol/spec remain unchanged.
