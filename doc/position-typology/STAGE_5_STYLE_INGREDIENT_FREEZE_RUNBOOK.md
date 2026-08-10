# Stage 5 Playing-Style Ingredient Freeze — Runbook

Date: 2026-08-10  
Status: **required before Stage 5 formal held-out generation**

## Why this extra freeze is required

The accepted Stage 4 style-coordinate definition already freezes:

- the 10 game-level trajectory descriptors,
- the discovery 10D StandardScaler,
- the canonical STYLE-C1..C4 component matrix,
- the coordinate orientation anchors.

However, six of the ten game-level descriptors depend on the Stage 3 state-level Namua coordinates `N-ACT` and `N-CON`.

Stage 3 recorded their conceptual construction but did not serialize the exact discovery-side 44D StandardScaler arrays. Re-fitting that scaler on Stage 5 held-out data would violate the intended frozen-transfer design.

Therefore the exact state-level ingredient transform is now frozen separately **before any Stage 5 held-out corpus is generated or inspected**.

## What is frozen

The exporter records:

- Stage 3 role-invariant 44D field order,
- Stage 3 log1p field set,
- exact discovery capped-Namua StandardScaler mean / scale / variance,
- exact `N-ACT` component fields,
- exact `N-CON` component fields,
- fixed Mtaji candidate-definition hash.

No new coordinate is created and no held-out data is used.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/export-position-typology-stage5-style-ingredient-definition.py
python tools/experiments/export-position-typology-stage5-style-ingredient-definition.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

Share only that JSON.

## Do not run Stage 5 yet

Until the artifact above is inspected and its hash is inserted into the machine preregistration spec, do **not** execute:

```text
tools/experiments/run-position-typology-stage5-style-confirmation.js
```

The machine spec currently has:

```text
status = draft-pending-style-ingredient-freeze
formalExperiment = false
formalRunAuthorized = false
```

The runner is intentionally expected to reject that draft state.

## After artifact acceptance

After the ingredient artifact is accepted:

1. insert its exact hash into `STAGE_5_PLAYING_STYLE_CONFIRMATION_SPEC.json`,
2. change the spec to final preregistered formal state,
3. implement/finalize the Stage 5 analyzer against the frozen ingredient hash,
4. add narrative preregistration and formal checkpoint,
5. only then generate seeds `20350001..20350192` locally,
6. full replay verify,
7. run G1–G5 formal analysis.

No thresholds, descriptor choices, or seed choices may be changed after held-out generation begins.
