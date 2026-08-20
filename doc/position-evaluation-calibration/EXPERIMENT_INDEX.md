# Experiment Index — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20

| ID | Stage | Purpose | Status | Scientific inference |
| --- | --- | --- | --- | --- |
| PEC-S0-AUDIT-2026-08-18-v1 | Stage 0 | repository / construct / evaluation semantics audit | COMPLETE | technical only |
| PEC-S0-SEED-AUDIT-2026-08-18-v1 | Stage 0 | seed namespace audit | COMPLETE | technical only |
| PEC-S0-SMOKE-2026-08-18-v1 | Stage 0 | generator / evaluator / source-hash smoke | PASS | technical only |
| PEC-S1-EXPLORATORY-2026-08-18-v1 | Stage 1 | fresh calibration development, 1024 games | COMPLETE / VERIFIED / READINESS PASS | exploratory only |
| PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1 | Stage 1 | frozen five-fold model selection and full fit | COMPLETE — PHASE-STRATIFIED ISOTONIC SELECTED | exploratory only |
| PEC-S2-SMOKE-2026-08-20-v1 | Stage 2 preflight | source/model/generator smoke | PASS | technical only |
| PEC-S2-FORMAL-2026-08-20-v1 | Stage 2 | fresh held-out formal evaluation, 2048 games | COMPLETE / VERIFIED / ESTIMABILITY FAIL | **FORMAL INCONCLUSIVE** |

## Final Stage 1 development state

```text
phase-aware logistic = ineligible under frozen convergence rule
phase-stratified isotonic = eligible / selected
pooled CV Brier = 0.1532240986334561
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
```

## Final Stage 2 state

```text
games = 2048
seeds = 22300001..22302048
verification replay mismatches = 0
measurement mismatches = 0
final Stage 1 overlap = 0 on trajectory/opening/rule-state identities
```

Failed estimability gates:

```text
1383 < 1600 unique trajectories after Stage 1 firewall
1290 < 1500 selected unique rule states
627  < 650 Mtaji selected states
```

Frozen formal decision:

```text
INCONCLUSIVE
```

Canonical formal result SHA-256:

```text
94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
```

Descriptive Brier values and other secondary metrics cannot rescue the failed estimability branch.
