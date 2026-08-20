# Stage 2 Runbook — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20
Status: **STAGE 2 SCIENTIFIC GENERATION AUTHORIZED / FORMAL EVALUATION REQUIRES INDEPENDENT VERIFICATION**

## A. Preserve Stage 1 local artifacts

Do not delete or regenerate the verified Stage 1 output directory:

```text
artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

Stage 2 tooling requires the exact Stage 1 calibration-result SHA-256 and measurement hash frozen in the Stage 2 spec.

## B. Pull the current research branch

```bash
git fetch origin
git checkout research/position-evaluation-winrate-calibration
git pull --ff-only origin research/position-evaluation-winrate-calibration

git status --short
git rev-parse HEAD
node --version
```

`git status --short` must be empty before scientific generation.

## C. Authorization basis

Stage 2 technical validation passed:

```text
smokeId = PEC-S2-SMOKE-2026-08-20-v1
smoke seeds = 990101..990108
passed = true
scientificGeneration = false
formalInferencePerformed = false
deterministicReplay = true
stage1ResultHashVerified = true
stage1MeasurementHashVerified = true
finiteFrozenModelPredictions = true
sourceTreeDirty = false
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
```

The repository now contains the separate source-bound authorization:

```text
doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
```

The authorization is bound to the exact frozen source SHA-256 mapping returned by the passing smoke. It does not authorize Stage 1 refitting, seed extension, outcome-dependent extension, or replacement for identity overlap.

Re-run the contract/spec checks after pulling the authorization/documentation commits:

```bash
node test/position-evaluation-calibration-stage2.test.js
node tools/experiments/validate-position-evaluation-calibration-stage2-spec.js
```

## D. Stage 2 fixed scientific generation

Run exactly:

```bash
node tools/experiments/run-position-evaluation-calibration-stage2.js \
  --phase generate \
  --stage1-output artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

This generates exactly 2048 games on frozen seeds `22300001..22302048` using the preregistered opening, continuation, evaluator and max-ply policy.

Do not add games, extend seeds, change source/configuration, or regenerate after outcome inspection.

## E. Outcome-blind selection and measurement

After generation completes:

```bash
node tools/experiments/run-position-evaluation-calibration-stage2.js \
  --phase select-measure \
  --stage1-output artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

The Stage 1 cross-stage identity firewall is applied before final Stage 2 selection. Overlap exclusions, unavailable assigned phase, within-Stage-2 trajectory duplicates and duplicate selected rule states receive no replacement.

## F. Independent verification before formal evaluation

Run:

```bash
node tools/experiments/verify-position-evaluation-calibration-stage2.js \
  artifacts/local/position-evaluation-calibration/stage2-formal-v1 \
  artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

Return the following for audit **before running the formal evaluator**:

```text
artifacts/local/position-evaluation-calibration/stage2-formal-v1/generation-manifest.json
artifacts/local/position-evaluation-calibration/stage2-formal-v1/stage2-selection-measurement-summary.json
artifacts/local/position-evaluation-calibration/stage2-formal-v1/verification.json
```

The audit must establish independent verification PASS, source/measurement integrity, zero forbidden cross-stage identity overlap, and all preregistered estimability/readiness gates.

## G. Formal evaluation — do not run before audit

Only after the returned Stage 2 artifacts are independently audited and all gates pass may the frozen evaluator run:

```bash
node tools/experiments/evaluate-position-evaluation-calibration-stage2.js \
  artifacts/local/position-evaluation-calibration/stage2-formal-v1
```

The evaluator applies the already-frozen Stage 1 isotonic mapping and Stage 2 decision rule. No refit or threshold change is permitted.

## H. No-rescue

Do not change after Stage 2 generation begins:

- game count or seeds;
- evaluator or continuation;
- max ply;
- Stage 1 mapping or endpoint behavior;
- Stage 1 overlap universe;
- state-selection salts or rules;
- readiness gates;
- primary Brier thresholds;
- bootstrap mechanics;
- formal decision rule.

A failed estimability gate produces `INCONCLUSIVE`; a failed estimable primary criterion produces `NOT-CONFIRMED`. Neither authorizes extra data or a new mapping within Study 1.
