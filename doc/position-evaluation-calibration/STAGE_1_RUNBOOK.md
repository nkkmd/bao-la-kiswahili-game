# Stage 1 Runbook — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **DO NOT RUN SCIENTIFIC GENERATION YET**

## A. Stage 0 local validation — authorized now

From a clean checkout of `research/position-evaluation-winrate-calibration`:

```bash
git fetch origin
git checkout research/position-evaluation-winrate-calibration
git pull --ff-only origin research/position-evaluation-winrate-calibration

git status --short
git rev-parse HEAD
node --version

node test/position-evaluation-calibration-stage0.test.js
node tools/experiments/validate-position-evaluation-calibration-stage1-spec.js
mkdir -p artifacts/local/position-evaluation-calibration/stage0
node tools/experiments/run-position-evaluation-calibration-stage0-smoke.js \
  --output artifacts/local/position-evaluation-calibration/stage0/smoke.json
```

Return `smoke.json` to the research audit before proceeding.

The smoke is technical only and uses non-scientific fixture seeds. It must not be interpreted as calibration evidence.

## B. Stage 1 generation — currently blocked

The production runner intentionally requires:

```text
doc/position-evaluation-calibration/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
```

That file does not yet exist. Therefore the following command is expected to fail until the returned Stage 0 smoke is audited and a source-bound authorization artifact is committed:

```bash
node tools/experiments/run-position-evaluation-calibration-stage1.js --phase all
```

Do not manually bypass this guard.

## C. Commands after future authorization

Only after the repository contains the valid authorization artifact:

```bash
node tools/experiments/run-position-evaluation-calibration-stage1.js --phase generate
node tools/experiments/run-position-evaluation-calibration-stage1.js --phase select-measure
node tools/experiments/verify-position-evaluation-calibration-stage1.js \
  artifacts/local/position-evaluation-calibration/stage1-exploratory-v1
```

The Stage 1 output directory is local by default. Large scientific corpus files should not be committed merely to move computation into GitHub Actions.

## D. No-rescue

Do not alter game count, seeds, max ply, phase assignment, state selection, duplicate handling, continuation policy, model candidate families, or readiness thresholds after observing Stage 1 outcomes. Any required pre-generation technical correction must be versioned and revalidated before scientific generation begins.
