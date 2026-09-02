# EBRWS-STUDY1 — Stage 0 Technical Authorization

Date: 2026-09-01

## Authorization

`EBRWS-S0-TECHNICAL-2026-09-01-v1` is:

`AUTHORIZED`

This authorization is limited to technical-only validation of the prospectively frozen G3-02 derived-endpoint and independent-verification logic.

## Preconditions confirmed

- post-LGTGMIV G3-02 authorization review = `AUTHORIZED`
- `EBRWS-STUDY1` protocol = frozen
- machine-readable preregistration = frozen
- G3-02 fresh scientific evidence generated = false
- G3-02 fresh scientific evidence read = false
- Stage 1 seed `31210001..31210192` consumed = false
- Stage 2 seed `31220001..31220288` consumed = false
- protected depth-10 exact holdout = `SEALED / NOT GENERATED / NOT READ`

## Permitted Stage 0 inputs

Only synthetic / hand-constructed primitive fixtures and non-scientific technical fixtures may be used.

Stage 0 may test:

- exact-rational arithmetic and canonical serialization
- denominator-zero behavior
- tree width-shape class boundaries
- reply width-shape class boundaries
- exact 2/3 promotion boundary
- deterministic ordering and hashing
- production / independent derived-endpoint exact agreement
- production / independent candidate-set exact agreement
- static independence
- telemetry/scientific-core separation

## Prohibited during Stage 0

- generating or reading any Stage 1 / Stage 2 source trajectory
- generating or reading any G3-02 fresh RAW root
- using LGTGMIV Stage 1/2 scientific outcomes as G3-02 fresh evidence
- generating or reading the protected standard-root depth-10 exact holdout
- changing RAW identity or validated transform set
- modifying the frozen scientific endpoint to accommodate a fixture result

## Promotion boundary

Stage 0 PASS does not automatically start Stage 1.

After Stage 0, a dated checkpoint must record all mandatory technical assertions. Stage 1 requires a separate explicit authorization and must not consume seed `31210001..31210192` before that authorization.
