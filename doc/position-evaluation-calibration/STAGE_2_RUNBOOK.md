# Stage 2 Runbook — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20
Status: **TECHNICAL VALIDATION ONLY / SCIENTIFIC GENERATION NOT AUTHORIZED**

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

`git status --short` must be empty before the technical smoke.

## C. Contract/spec validation — authorized now

```bash
node test/position-evaluation-calibration-stage2.test.js
node tools/experiments/validate-position-evaluation-calibration-stage2-spec.js
```

These commands perform no Stage 2 scientific generation.

## D. Non-scientific Stage 2 smoke — authorized now

```bash
mkdir -p artifacts/local/position-evaluation-calibration/stage2-preflight

node tools/experiments/run-position-evaluation-calibration-stage2-smoke.js \
  --stage1-output artifacts/local/position-evaluation-calibration/stage1-exploratory-v1 \
  --output artifacts/local/position-evaluation-calibration/stage2-preflight/smoke.json
```

The smoke uses only fixture seeds `990101..990108`. It is technical validation, must not be treated as scientific evidence, and may not be reused in Stage 2.

Return:

```text
artifacts/local/position-evaluation-calibration/stage2-preflight/smoke.json
```

for audit.

## E. Scientific generation remains blocked

The production runner requires:

```text
doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
```

That file is intentionally absent at this point. Do not bypass the guard.

The following command must not be run until a passing smoke is audited and a source-bound authorization artifact is committed:

```bash
node tools/experiments/run-position-evaluation-calibration-stage2.js --phase generate
```

## F. Commands after future Stage 2 authorization

Only after the valid authorization artifact exists:

```bash
node tools/experiments/run-position-evaluation-calibration-stage2.js \
  --phase generate \
  --stage1-output artifacts/local/position-evaluation-calibration/stage1-exploratory-v1

node tools/experiments/run-position-evaluation-calibration-stage2.js \
  --phase select-measure \
  --stage1-output artifacts/local/position-evaluation-calibration/stage1-exploratory-v1

node tools/experiments/verify-position-evaluation-calibration-stage2.js \
  artifacts/local/position-evaluation-calibration/stage2-formal-v1 \
  artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

Return the generation manifest, Stage 2 selection/measurement summary, and verification JSON for audit **before** running formal evaluation.

Only after independent verification/readiness/identity audit passes may the frozen evaluator run:

```bash
node tools/experiments/evaluate-position-evaluation-calibration-stage2.js \
  artifacts/local/position-evaluation-calibration/stage2-formal-v1
```

## G. No-rescue

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
