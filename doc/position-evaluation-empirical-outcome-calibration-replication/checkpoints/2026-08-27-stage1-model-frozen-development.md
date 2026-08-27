# PEOCR-STUDY1 — Stage 1 Model Frozen Development

Date: 2026-08-27

## Decision

```text
Stage 1 decision = MODEL-FROZEN-DEVELOPMENT
Stage 2 generation authorized = false
formal calibration claim authorized = false
```

Recovery workflow run `33017663172` completed successfully after the administrative timeout ceiling was increased from 120 to 360 minutes. The scientific contract, authorized source hashes, population, seed range, selection rules, RAW identity, readiness gates, model family and interpretation boundary were unchanged.

## Complete Stage 1 population

```text
games = 2048 / 2048
seeds = 24011001..24013048
unique historical trajectories = 1602
selected unique RAW states = 1547
Namua selected = 806
Mtaji selected = 741
administrative truncation rate = 0
```

## Independent verification

```text
games verified = 2048
game replay mismatches = 0
measurement mismatches = 0
selection hash match = true
measurement hash match = true
```

```text
selectionHash = 4c46baef47f52ecff47d042fb7983a806c55d891717cb8f9d0afa2b483bd3b87
measurementHash = a521051db2f9197094ff6b48c141b8b65378d4dac17c16fca6f38af939356b0b
```

## Readiness

All prospectively frozen Stage 1 readiness gates passed. No gate was relaxed and no seed was added or replaced.

## Frozen model

```text
family = phase-stratified-isotonic-PAVA
candidate family selection = none
prediction clipping for Stage 2 formal metrics = [0.01,0.99]
model artifact SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
```

The Stage 1 development metrics are descriptive model-development diagnostics only and do not constitute the held-out formal calibration claim.

## Canonical evidence hashes

```text
STAGE_1_GENERATION_MANIFEST.json = 97b996f96ee236d3ea0a049a2980a27655696119e776bcd6f42905fa205c4ef9
STAGE_1_SELECTION_MEASUREMENT_SUMMARY.json = 6ef950393ba290a7df6af7228539903f9cc23bcfe01bdc8c0c791c24bb0ebd01
STAGE_1_VERIFICATION.json = 792cb9bcf88402d785bc9ba581fba0f62c75f7e0d6ac49f6f99884c2a45173b5
STAGE_1_DEVELOPMENT_RESULT.json = 93c449b5d28d5fe2a51375d867f27b47880b54bc13c0ec45c6206226edd47b75
STAGE_1_FROZEN_MAPPING.json = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
workflow artifact ZIP = 1c5f4c3440abda834b442ad9bb5ce811d777ed0750e8e3fdaeda0ab9c32a4e30
workflow artifact ID = 9632042234
```

## Next-stage boundary

Stage 2 is not authorized by this result alone. Before any Stage 2 scientific seed is generated, a non-scientific Stage 2 technical smoke, exact Stage 1 reference-universe/model/source hash freeze, independent verification path and explicit Stage 2 authorization are required.
