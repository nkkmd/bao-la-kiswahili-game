# Stage 1 Runbook — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **STAGE 1 SCIENTIFIC GENERATION AUTHORIZED / FORMAL INFERENCE NOT AUTHORIZED**

## A. Authorization basis

Stage 0 technical validation passed and the repository now contains the separate source-bound artifact:

```text
doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
```

Authorization is bound to:

```text
Stage 1 spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
Stage 0 smoke = PEC-S0-SMOKE-2026-08-18-v1 PASS
```

The smoke is technical only and is not calibration evidence.

## B. Prepare a clean checkout

```bash
git fetch origin
git checkout research/position-evaluation-winrate-calibration
git pull --ff-only origin research/position-evaluation-winrate-calibration

git status --short
git rev-parse HEAD
node --version
```

`git status --short` must be empty before scientific generation.

Re-run the contract checks after pulling the authorization/documentation commits:

```bash
node test/position-evaluation-calibration-stage0.test.js
node tools/experiments/validate-position-evaluation-calibration-stage1-spec.js
```

Do not edit any frozen source file if these checks fail.

## C. Stage 1 fixed scientific generation

Run exactly:

```bash
node tools/experiments/run-position-evaluation-calibration-stage1.js --phase generate
```

This generates exactly the frozen 1024-game corpus using seeds `22200001..22201024`. Do not add games, extend seeds, alter max ply, or rerun with a modified source/configuration after outcome inspection.

## D. Outcome-blind selection and measurement

After generation completes:

```bash
node tools/experiments/run-position-evaluation-calibration-stage1.js --phase select-measure
```

Selection uses the preregistered trajectory deduplication, SHA phase assignment, within-phase SHA ranking, duplicate-rule-state collapse, and no-replacement rules.

## E. Independent verification before exploratory analysis

Run:

```bash
node tools/experiments/verify-position-evaluation-calibration-stage1.js \
  artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

Return the verifier output/artifacts for audit before any Stage 1 model fitting or calibration interpretation.

The Stage 1 output directory is local by default. Large scientific corpus files should not be committed merely to move computation into GitHub Actions.

## F. Interpretation firewall

Even after Stage 1 verification PASS:

```text
Stage 1 = exploratory development only
confirmatory reuse = forbidden
Stage 2 generation = not authorized
formal inference = not authorized
```

Stage 1 may select/freeze the prospective calibration mapping for a future fresh Stage 2, but it cannot itself confirm calibration.

## G. No-rescue

Do not alter game count, seeds, max ply, phase assignment, state selection, duplicate handling, continuation policy, model candidate families, readiness thresholds, or truncation handling after observing Stage 1 outcomes.

A readiness-gate failure, technical failure, or inconclusive Stage 1 result does not authorize outcome-dependent extension or replacement.
