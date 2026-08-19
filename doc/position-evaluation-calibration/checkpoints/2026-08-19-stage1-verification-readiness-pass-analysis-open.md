# Checkpoint — Stage 1 verification/readiness PASS; exploratory analysis open

Date: 2026-08-19
Study: Position Evaluation / Win-Rate Calibration Study 1
Stage: `PEC-S1-EXPLORATORY-2026-08-18-v1`

## Returned artifacts

The fixed Stage 1 corpus, selection/measurement summary, and independent verification artifacts were returned and audited.

```text
generation manifest SHA-256 = 0a1ad53c2ac5dff272b771d6b9c48ca26b349aad650029a5d13464c0aa990813
selection/measurement summary SHA-256 = 1e843c9fbc3f286f2e6bc17a99e6590b51f636d09b051ff73fa96228fb756d73
verification SHA-256 = 6b4e08a11b1145337410036a697e81f7c7f2408378f4584bc1a2b27cef76ff21
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
```

Generation used exactly 1024 games and seeds `22200001..22201024` from clean source commit `c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4`. Frozen source-file hashes match the authorization set.

## Independent verification

```text
passed = true
gamesVerified = 1024
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
sourceTreeDirty = false
```

The earlier interrupted verifier run produced no `verification.json`; rerunning the verifier over the same already-generated corpus was a verification repeat only, not scientific regeneration or seed extension.

## Readiness gates

All preregistered Stage 1 readiness gates passed.

| Gate | Observed | Requirement | Result |
| --- | ---: | ---: | --- |
| unique historical trajectories | 872 | >= 800 | PASS |
| selected unique rule states | 830 | >= 750 | PASS |
| Namua selected states | 430 | >= 330 | PASS |
| Mtaji selected states | 400 | >= 330 | PASS |
| distinct opening prefixes | 830 | >= 200 | PASS |
| distinct static evaluations, Namua | 327 | >= 50 | PASS |
| distinct static evaluations, Mtaji | 363 | >= 50 | PASS |
| actor wins, Namua | 190 | >= 75 | PASS |
| actor losses, Namua | 240 | >= 75 | PASS |
| actor wins, Mtaji | 200 | >= 75 | PASS |
| actor losses, Mtaji | 200 | >= 75 | PASS |
| administrative truncation rate | 0 | <= 0.01 | PASS |

Selection accounting:

```text
unique historical trajectories = 872
provisional selected states = 832
unavailable assigned phase = 40
duplicate selected rule states collapsed = 2
final selected unique rule states = 830
```

No replacement or seed extension is authorized or needed.

## Analysis-method freeze

Before opening individual score–outcome pairs for model fitting, residual implementation mechanics were frozen in:

```text
doc/position-evaluation-calibration/preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json
```

This preserves the already frozen candidate set and selection rule while specifying exact Newton/IRLS initialization/convergence, full-digest SHA-256 fold modulo, isotonic equal-score/PAVA handling, support-floor step prediction, endpoint clamping, and candidate failure behavior.

The two candidates remain exactly:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

No new model family, alternate optimizer, alternate fold rule, rescue smoothing, or outcome-dependent threshold change is authorized.

## Current scientific state

```text
Stage 1 generation = COMPLETE
Stage 1 independent verification = PASS
Stage 1 readiness = PASS
Stage 1 exploratory calibration model fitting = OPEN
Stage 1 confirmatory reuse = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

Stage 1 may now select and freeze a calibration mapping for a future fresh Stage 2. Stage 1 itself cannot confirm calibration.
