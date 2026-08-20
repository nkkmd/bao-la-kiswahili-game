# Experiment Index — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20

| ID | Stage | Purpose | Status | Scientific inference |
| --- | --- | --- | --- | --- |
| PEC-S0-AUDIT-2026-08-18-v1 | Stage 0 | repository / construct / evaluation semantics audit | COMPLETE | not authorized |
| PEC-S0-SEED-AUDIT-2026-08-18-v1 | Stage 0 | historical declared corpus seed namespace inventory | COMPLETE | not authorized |
| PEC-S0-SMOKE-2026-08-18-v1 | Stage 0 | generator / evaluator / selection / source-hash smoke | PASS | not authorized; technical only |
| PEC-S1-EXPLORATORY-2026-08-18-v1 | Stage 1 | fresh calibration development, 1024 games | GENERATED / VERIFIED / READINESS PASS | exploratory only |
| PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1 | Stage 1 | frozen five-fold candidate comparison and final mapping fit | COMPLETE — PHASE-STRATIFIED ISOTONIC SELECTED | exploratory only; no formal claim |
| PEC-S2-SMOKE-2026-08-20-v1 | Stage 2 preflight | source/model/identity/generator technical smoke | PASS | none; fixture seeds only |
| PEC-S2-FORMAL-2026-08-20-v1 | Stage 2 | fresh held-out formal calibration evaluation, 2048 games | GENERATED / VERIFIED / ESTIMABILITY FAIL — INCONCLUSIVE | formal decision forced by frozen gate rule; performance criteria not decision-eligible |

Stage 1 corpus generation used exactly `22200001..22201024`; independent replay/measurement verification passed with zero mismatches and all readiness gates passed. Stage 1 data are permanently exploratory and may not be reused as formal confirmation evidence.

Stage 1 selected model:

```text
phase-aware logistic = ineligible under frozen 100-iteration / 1e-10 gradient gate
phase-stratified isotonic = eligible
pooled CV Brier = 0.1532240986334561
selected family = phase-stratified-isotonic
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
```

Stage 2 preflight passed on fixture seeds `990101..990108`, and a separate source-bound authorization allowed exactly the frozen 2048-game generation on seeds `22300001..22302048`.

Returned Stage 2 generation and independent verification were technically clean:

```text
games = 2048
replay mismatches = 0
measurement mismatches = 0
measurement hash match = true
final Stage 1 overlap = 0 on trajectory/opening/rule-state identities
```

However, three frozen estimability gates failed after the no-replacement Stage 1 firewall and state-selection rules were applied:

```text
unique historical trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

Therefore the preregistered formal decision is `INCONCLUSIVE`. No extra games, seed extension, identity-overlap replacement, threshold relaxation, or selected-map refit is authorized. The canonical formal evaluator may be run once to materialize `stage2-formal-result.json`; primary bootstrap/criteria are not decision-eligible because the estimability gate failed.
