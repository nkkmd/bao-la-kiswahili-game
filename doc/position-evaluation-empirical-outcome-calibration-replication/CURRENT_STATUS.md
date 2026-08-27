# PEOCR-STUDY1 — Current Status

更新日: 2026-08-27

## Status

**STUDY ACTIVE / STAGE 0 TECHNICAL PASS / STAGE 1 MODEL-FROZEN-DEVELOPMENT / STAGE 2 NOT AUTHORIZED**

## Identity

```text
Program = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## Completed

- Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable.
- Stage 0 technical validation: `STAGE0-TECHNICAL-PASS`.
- Stage 1 source hashes and authorization were frozen before scientific generation.
- First authorized Stage 1 run stopped administratively at 1536/2048 because of the 120-minute workflow ceiling; that partial artifact is provenance-only.
- Recovery run `33017663172` reran the same complete fixed population from the beginning under unchanged scientific hashes and completed successfully.
- 2,048/2,048 fresh Stage 1 games generated.
- Independent full replay verified all 2,048 games with zero game/measurement mismatches.
- All prospectively frozen Stage 1 readiness gates passed.
- Stage 1 decision: `MODEL-FROZEN-DEVELOPMENT`.
- Exact phase-stratified isotonic PAVA mapping frozen: `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`.

## Stage 1 key counts

```text
unique historical trajectories = 1602
selected unique RAW states = 1547
Namua = 806
Mtaji = 741
administrative truncation rate = 0
selection hash = 4c46baef47f52ecff47d042fb7983a806c55d891717cb8f9d0afa2b483bd3b87
measurement hash = a521051db2f9197094ff6b48c141b8b65378d4dac17c16fca6f38af939356b0b
```

## Authorization state

```text
Stage 0 technical execution = COMPLETE / PASS
Stage 1 scientific generation = COMPLETE
Stage 1 formal calibration inference = NOT AUTHORIZED (development stage only)
Stage 2 scientific generation = NOT AUTHORIZED
```

## Next action

Implement and execute non-scientific Stage 2 technical smoke; freeze the exact Stage 1 reference universe, frozen mapping, Stage 2 source hashes and independent verification path; then create an explicit Stage 2 authorization before any seed in `24020001..24028192` is generated.
