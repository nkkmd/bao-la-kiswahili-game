# Stage 1 Runbook — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-19
Status: **STAGE 1 GENERATED / VERIFIED / READINESS PASS / EXPLORATORY MODEL FITTING OPEN**

## A. Completed scientific generation and verification

The fixed Stage 1 corpus has already been generated using exactly:

```text
Stage 1 spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
games = 1024
seeds = 22200001..22201024
generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
```

Independent replay and measurement verification passed:

```text
gamesVerified = 1024
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
```

All preregistered readiness gates passed. Do **not** regenerate, extend, replace, or modify the Stage 1 corpus now that outcomes exist.

## B. Frozen analysis mechanics

Before individual score–outcome model fitting, exact residual mechanics were frozen in:

```text
doc/position-evaluation-calibration/preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json
```

The candidate set remains exactly:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

The primary selection metric remains five-fold out-of-fold Brier score. Isotonic displaces logistic only if its Brier is at least 0.002 lower. No alternative family, optimizer, fold assignment, smoother, or rescue rule is authorized.

## C. Prepare the existing verified checkout

From the repository root:

```bash
git fetch origin
git checkout research/position-evaluation-winrate-calibration
git pull --ff-only origin research/position-evaluation-winrate-calibration

git status --short
git rev-parse HEAD
node --version
```

The local `artifacts/local/position-evaluation-calibration/stage1-exploratory-v1/` directory must still contain the previously generated games, measurements, generation manifest, selection/measurement summary, and passing `verification.json`.

Do not delete or regenerate these scientific artifacts merely because documentation/analysis-code commits were pulled.

## D. Validate analysis mechanics

Run the synthetic contract test:

```bash
node test/position-evaluation-calibration-stage1-analysis.test.js
```

A failure here is a technical analysis-code issue. Do not modify model families or scientific thresholds in response to a failure.

## E. Run Stage 1 exploratory calibration development

Run exactly:

```bash
node tools/experiments/analyze-position-evaluation-calibration-stage1.js \
  --output artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

Before fitting, the analyzer independently checks:

- Stage/spec identity;
- exact 1024-game seed manifest;
- passing independent verification;
- all readiness gates;
- measurement-file count;
- recomputed measurement hash against both summary and verifier.

Only then does it perform the frozen five-fold comparison and full-data refit of the selected family.

Expected new artifact:

```text
artifacts/local/position-evaluation-calibration/stage1-exploratory-v1/stage1-exploratory-calibration-result.json
```

Return that JSON for research audit before any Stage 2 spec, decision threshold, authorization, or generation is created.

## F. Interpretation firewall

Even after successful Stage 1 model selection:

```text
Stage 1 = exploratory development only
confirmatory reuse = forbidden
Stage 2 generation = not authorized
formal inference = not authorized
```

A selected mapping is a prospective object to freeze for a **fresh** Stage 2. Stage 1 itself cannot establish formal calibration.

## G. No-rescue

Do not alter game count, seeds, max ply, phase assignment, state selection, duplicate handling, continuation policy, candidate families, readiness thresholds, truncation handling, CV assignment, logistic convergence rule, isotonic prediction rule, or the 0.002 selection margin after inspecting Stage 1 score–outcome results.

If both candidates are ineligible, or the selected family cannot be validly frozen, Stage 1 is inconclusive and Stage 2 is not generated unless a genuinely new prospective study is designed.
