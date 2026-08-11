# Stage 1 Final Exposure Extension — Local Runbook

更新日: 2026-08-11

This runbook executes the frozen final Stage 1 exposure-support extension.

Canonical protocol:

```text
doc/namua-mtaji-transition/STAGE_1_FINAL_EXPOSURE_EXTENSION_PROTOCOL.md
```

## 1. Update branch

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short
```

The instrumented source tree must be clean before generation.

## 2. Python dependency check

```bash
python3 -c 'import numpy, pandas; print("numpy", numpy.__version__, "pandas", pandas.__version__)'
```

Use an existing environment only if the imports are unavailable in the current Python environment.

## 3. Static checks

```bash
node --check tools/experiments/run-namua-mtaji-stage1-final-extension.js
node --check tools/experiments/verify-namua-mtaji-stage1-final-extension.js
node --check tools/experiments/analyze-namua-mtaji-stage1-events.js
node --check tools/experiments/audit-namua-mtaji-stage1-clock.js
node --check tools/experiments/audit-namua-mtaji-stage1-riskset.js
node --check tools/experiments/audit-namua-mtaji-stage1-final-support.js

python3 -m py_compile tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py
```

Stop if any static check fails.

## 4. Regression tests

```bash
node test/namua-mtaji-transition-features.test.js
node test/namua-mtaji-transition-engine.test.js
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

Stop on any failure.

## 5. Generate the complete fixed corpus

```bash
node tools/experiments/run-namua-mtaji-stage1-final-extension.js
```

Fixed corpus:

```text
paired openings = 768
games = 1536
conditions = P2-D2 + V2-D2
opening seeds = 20273001..20273768
output = artifacts/local/namua-mtaji-transition/stage1-final-extension-v1
```

Do not stop based on partial CBE counts.

### Resume/status

```bash
node tools/experiments/run-namua-mtaji-stage1-final-extension.js --status
```

Rerunning the normal command resumes compatible existing game files.

Do not use `--force` after scientific output has been inspected unless a technical invalidation/restart is formally documented.

## 6. Full replay/provenance verification

```bash
node tools/experiments/verify-namua-mtaji-stage1-final-extension.js
```

Do not continue if verification fails.

## 7. Deterministic clock audit

```bash
node tools/experiments/audit-namua-mtaji-stage1-clock.js \
  --input artifacts/local/namua-mtaji-transition/stage1-final-extension-v1
```

Required:

```text
passed = true
first Mtaji = ply 44 for every reached-Mtaji trajectory
progression violations = 0
```

## 8. Inherited Category-A extraction

```bash
python3 tools/experiments/extract-namua-mtaji-stage1-extension-candidates.py \
  --input artifacts/local/namua-mtaji-transition/stage1-final-extension-v1 \
  --output artifacts/local/namua-mtaji-transition/stage1-final-extension-v1
```

Historical thresholds/functions must remain unchanged.

## 9. Frozen event classification/support audit

```bash
node tools/experiments/analyze-namua-mtaji-stage1-events.js \
  --input artifacts/local/namua-mtaji-transition/stage1-final-extension-v1 \
  --candidates artifacts/local/namua-mtaji-transition/stage1-final-extension-v1/category-a-candidates.csv \
  --output artifacts/local/namua-mtaji-transition/stage1-final-extension-v1
```

Do not inspect CBE-vs-control morphology effects.

## 10. Final-extension exact-ply risk-set audit

```bash
node tools/experiments/audit-namua-mtaji-stage1-riskset.js \
  --input artifacts/local/namua-mtaji-transition/stage1-final-extension-v1 \
  --events artifacts/local/namua-mtaji-transition/stage1-final-extension-v1/stage1-event-table.csv \
  --output artifacts/local/namua-mtaji-transition/stage1-final-extension-v1
```

This must be inspected before Stage 2 freeze if the exposure-readiness gate passes, especially for any newly observed CBE candidate plies.

## 11. Final combined exposure-support gate

```bash
node tools/experiments/audit-namua-mtaji-stage1-final-support.js
```

This combines:

```text
stage1-pilot-v1
stage1-extension-v1
stage1-final-extension-v1
```

The frozen gate remains:

```text
unique CBE trajectory-ply units >= 10
unique CBE historical trajectories >= 8
```

No threshold relaxation is authorized.

## 12. Required return artifacts

Upload:

```text
stage1-final-extension-v1/manifest.json
stage1-final-extension-v1/verification.json
stage1-final-extension-v1/clock-audit.json
stage1-final-extension-v1/candidate-pipeline-audit.json
stage1-final-extension-v1/stage1-event-audit.json
stage1-final-extension-v1/stage1-event-table.csv
stage1-final-extension-v1/stage1-riskset-audit.json
stage1-final-extension-v1/stage1-riskset-controls.csv
stage1-final-extension-v1/stage1-final-support-audit.json
```

## 13. Terminal decision after inspection

If the final combined gate passes and comparator support remains adequate across final observed CBE plies:

> proceed to Stage 2 formal design freeze.

If the gate fails:

> do not generate another exposure-targeted Stage 1 block under the current frozen CBE definition and P2-D2/V2-D2 family. Record the prospective formal bridge as not design-ready and require a separately justified future redesign.

No CBE-vs-control M1/M2 effect inspection is authorized before that decision.