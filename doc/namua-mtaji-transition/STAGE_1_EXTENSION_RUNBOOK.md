# Stage 1 Exposure-Support Extension — Local Runbook

Date: 2026-08-11  
Status: operational instructions for the frozen exploratory extension

## 1. Boundary

This runbook generates the fixed extension described in:

```text
doc/namua-mtaji-transition/STAGE_1_EXPOSURE_EXTENSION_PROTOCOL.md
```

The extension is exploratory-only and cannot be reused as formal held-out evidence.

Do not alter conditions, seed range, thresholds, or replicate count.

## 2. Update the branch

From repository root:

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short
```

The working tree should be clean before generation.

## 3. Dependency check

Node 24 is recommended.

The inherited Category-A extraction requires Python with NumPy and pandas:

```bash
node --version
python3 --version
python3 -c 'import numpy, pandas; print("numpy", numpy.__version__, "pandas", pandas.__version__)'
```

If the final Python command fails, activate the same local research venv previously used for the phase-transition/position-typology analyses. Do not change analysis code to avoid the dependency.

## 4. Static checks

```bash
node --check tools/experiments/run-namua-mtaji-stage1-extension.js
node --check tools/experiments/verify-namua-mtaji-stage1-extension.js
node --check tools/experiments/analyze-namua-mtaji-stage1-events.js
node --check tools/experiments/audit-namua-mtaji-stage1-clock.js
node --check tools/experiments/audit-namua-mtaji-stage1-extension-support.js

python3 -m py_compile tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py
```

Stop on any error.

## 5. Regression tests

```bash
node test/namua-mtaji-transition-features.test.js
node test/namua-mtaji-transition-engine.test.js
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

Stop on any error.

## 6. Generate the fixed extension corpus

```bash
node tools/experiments/run-namua-mtaji-stage1-extension.js
```

Fixed identity:

```text
384 paired openings
P2-D2 + V2-D2
768 games
seeds 20272001..20272384
opening plies 8
max ply 100
```

The runner is resumable. If execution is interrupted, inspect:

```bash
node tools/experiments/run-namua-mtaji-stage1-extension.js --status
```

Then rerun the same generation command.

Do not use `--force` unless the current extension artifacts are known to be invalid and regeneration has been explicitly documented.

## 7. Deterministic replay/provenance verification

```bash
node tools/experiments/verify-namua-mtaji-stage1-extension.js
```

Expected output:

```text
artifacts/local/namua-mtaji-transition/stage1-extension-v1/verification.json
```

Proceed only if `passed: true`.

## 8. Deterministic Namua clock audit

```bash
node tools/experiments/audit-namua-mtaji-stage1-clock.js \
  --input artifacts/local/namua-mtaji-transition/stage1-extension-v1
```

Proceed only if:

```text
passed = true
violations = []
```

## 9. Inherited Category-A extraction

```bash
python3 tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py
```

This reuses the historical signal/persistence/clustering/forcing-ablation functions without threshold modification.

## 10. Frozen phenotype event support audit

```bash
node tools/experiments/analyze-namua-mtaji-stage1-events.js \
  --input artifacts/local/namua-mtaji-transition/stage1-extension-v1 \
  --candidates artifacts/local/namua-mtaji-transition/stage1-extension-v1/category-a-candidates.csv \
  --output artifacts/local/namua-mtaji-transition/stage1-extension-v1
```

This output contains no M1/M2 exposure contrast.

## 11. Combined exposure-support gate

After the extension event table exists:

```bash
node tools/experiments/audit-namua-mtaji-stage1-extension-support.js
```

This combines only exposure-support information from:

```text
stage1-pilot-v1
stage1-extension-v1
```

and deduplicates by:

```text
historicalTrajectoryHash + candidatePly
```

Stage 2 design-readiness minimum:

```text
unique CBE trajectory-ply units >= 10
unique CBE historical trajectories >= 8
```

This is a feasibility gate, not a confirmatory significance rule.

## 12. Do not inspect morphology effects yet

Before Stage 2 comparator/design freeze, do not compute or inspect:

- CBE versus control MTAJI-M1/M2 proportions;
- odds ratios/risk ratios;
- morphology effect sizes;
- p-values;
- comparator rankings based on morphology contrast.

The frozen Mtaji classifier has already passed technical feasibility in Stage 0/primary Stage 1.

## 13. Files to return

After a successful run, return:

```text
artifacts/local/namua-mtaji-transition/stage1-extension-v1/manifest.json
artifacts/local/namua-mtaji-transition/stage1-extension-v1/verification.json
artifacts/local/namua-mtaji-transition/stage1-extension-v1/clock-audit.json
artifacts/local/namua-mtaji-transition/stage1-extension-v1/candidate-pipeline-audit.json
artifacts/local/namua-mtaji-transition/stage1-extension-v1/stage1-event-audit.json
artifacts/local/namua-mtaji-transition/stage1-extension-v1/stage1-event-table.csv
artifacts/local/namua-mtaji-transition/stage1-extension-v1/stage1-extension-support-audit.json
```

If any command fails, stop at that command and return the full error output.
