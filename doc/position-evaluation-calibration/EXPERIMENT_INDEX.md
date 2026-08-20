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
| PEC-S2-FORMAL-2026-08-20-v1 | Stage 2 | fresh held-out formal calibration evaluation, 2048 games | GENERATION AUTHORIZED / NOT YET GENERATED | formal only after independent verification and estimability/identity gates |

Stage 1 corpus generation used exactly `22200001..22201024`; independent replay/measurement verification passed with zero mismatches and all readiness gates passed. Stage 1 data are permanently exploratory and may not be reused as formal confirmation evidence.

Stage 1 selected model:

```text
phase-aware logistic = ineligible under frozen 100-iteration / 1e-10 gradient gate
phase-stratified isotonic = eligible
pooled CV Brier = 0.1532240986334561
selected family = phase-stratified-isotonic
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
```

Stage 2 preflight passed on fixture seeds `990101..990108`, with deterministic replay, Stage 1 result/measurement binding, finite frozen-model predictions, clean source, and no scientific reuse. The passing smoke is bound to Stage 2 spec SHA-256 `92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38`.

A separate `STAGE_2_FORMAL_AUTHORIZATION.json` now authorizes exactly the frozen 2048-game Stage 2 generation on seeds `22300001..22302048`. It does not authorize Stage 1 refitting, outcome-dependent extension, seed extension, overlap replacement, or bypass of independent verification before formal evaluation.
