# Stage 1 Exploratory Temporal Pilot — Local Runbook

Date: 2026-08-11  
Study: `namua-mtaji-temporal-transition`  
Branch: `research/namua-mtaji-temporal-transition`

## 1. Boundary

This runbook generates and inspects the consumed Stage 1 exploratory pilot only.

It does not generate the later formal held-out corpus.

Do not change:

```text
replicates = 32
conditions = 6
total games = 192
opening seeds = 20271001..20271032
opening plies = 8
max ply = 100
```

Do not use `--force` after scientific inspection has begun unless a documented technical defect requires a complete restart under a new artifact identity.

## 2. Update and confirm source state

From repository root:

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short
node --version
python3 --version
```

`git status --short` must be empty before generation.

Node 24 is the expected environment family.

## 3. Python dependency check

Stage 1 Category-A extraction imports the historical analysis pipeline and therefore requires:

```text
numpy
pandas
```

Check first:

```bash
python3 -c 'import numpy, pandas; print("numpy", numpy.__version__, "pandas", pandas.__version__)'
```

If this fails, activate the previous research virtual environment if it already contains these packages. Any environment is acceptable for Stage 1 provided it runs the historical scripts unchanged; do not change analysis code merely to avoid the dependency.

If no suitable environment exists, a minimal local environment can be created:

```bash
python3 -m venv .venv-research
source .venv-research/bin/activate
python -m pip install --upgrade pip
python -m pip install numpy pandas
```

After activation, use `python` in place of `python3` below if appropriate.

## 4. Static and regression checks

Run:

```bash
node --check tools/experiments/run-namua-mtaji-stage1-pilot.js
node --check tools/experiments/verify-namua-mtaji-stage1-pilot.js
node --check tools/experiments/analyze-namua-mtaji-stage1-events.js
python3 -m py_compile tools/experiments/extract-namua-mtaji-stage1-candidates.py
python3 -m py_compile tools/experiments/audit-namua-mtaji-mtaji-artifact.py

node test/namua-mtaji-transition-features.test.js
node test/namua-mtaji-transition-engine.test.js
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

If any command fails, stop before generation and report the full error.

## 5. Generate Stage 1 fresh exploratory corpus

Run:

```bash
node tools/experiments/run-namua-mtaji-stage1-pilot.js
```

The output is:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/
```

The runner writes one game atomically and is resumable. If execution is interrupted, inspect status with:

```bash
node tools/experiments/run-namua-mtaji-stage1-pilot.js --status
```

Then resume with the same command:

```bash
node tools/experiments/run-namua-mtaji-stage1-pilot.js
```

Do not change seed/sample/condition parameters between resumes.

## 6. Verify corpus before exploratory analysis

Run:

```bash
node tools/experiments/verify-namua-mtaji-stage1-pilot.js
```

This must pass before candidate extraction.

The verifier checks deterministic replay, full observation recomputation, legacy phase-transition compatibility, move legality, state identities, phase semantics, first-Mtaji reserve exhaustion, paired opening identity, aggregate adapter artifacts, trajectory hashes, and source provenance.

## 7. Reproduce inherited Category-A candidacy

Run:

```bash
python3 tools/experiments/extract-namua-mtaji-stage1-candidates.py
```

If using an activated virtual environment whose executable is `python`, use:

```bash
python tools/experiments/extract-namua-mtaji-stage1-candidates.py
```

This creates:

```text
candidate-pipeline-audit.json
candidate-audit-table.csv
category-a-candidates.csv
```

The script imports the historical candidate pipeline; it does not refit thresholds.

## 8. Apply the frozen phenotype and audit temporal support

Run:

```bash
node tools/experiments/analyze-namua-mtaji-stage1-events.js
```

This creates:

```text
stage1-event-table.csv
stage1-event-audit.json
```

The event audit is descriptive feasibility analysis only. It computes no confirmatory p-values.

## 9. Apply the frozen first-Mtaji morphology classifier

Run:

```bash
python3 tools/experiments/audit-namua-mtaji-mtaji-artifact.py \
  --smoke artifacts/local/namua-mtaji-transition/stage1-pilot-v1 \
  --output artifacts/local/namua-mtaji-transition/stage1-pilot-v1/mtaji-artifact-audit.json
```

If using the virtual environment's `python`, substitute it for `python3`.

The expected candidate-definition hash remains:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Do not regenerate/refit the historical classifier if the artifact cannot be found.

## 10. Files to return for Stage 1 inspection

Upload:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/manifest.json
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/verification.json
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/candidate-pipeline-audit.json
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/stage1-event-audit.json
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/stage1-event-table.csv
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/mtaji-artifact-audit.json
```

The CSV event table is needed because Stage 2 design-freeze decisions require direct inspection of reserve/time/multiplicity support, not only aggregate counts.

## 11. Stop rules

Stop immediately and report the full error if:

- source tree is reported dirty at generation;
- verification fails;
- aggregate SHA verification fails;
- historical Category-A thresholds mismatch;
- frozen Mtaji artifact hash mismatches;
- a candidate cannot be reconstructed from its representative game/ply;
- a replay/state-identity mismatch occurs.

Do not work around these failures by loosening a check.
