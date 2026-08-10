# Stage 1 mtaji candidate definition freeze runbook

更新日: 2026-08-10  
Status: **exploratory candidate-definition export only / no held-out execution**

## Purpose

The invariant-morphology audit promoted the mtaji swap-invariant k=2 structure to a **board-level provisional two-type set** on the Stage 1 discovery corpus.

Before any independent confirmation corpus is generated or inspected, export an exact machine-readable candidate definition that freezes the discovery-side transformation and centroids.

This step does **not** perform confirmation and does not touch future held-out seeds.

## Preconditions

Required local artifacts already exist:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/feature-audit.json
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/eligible-primary-rule-state.csv
artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json
```

Expected invariant audit hash:

`7a2cea55a48f8d5566f95ff5a08f8966a146e6add262d742724a3bcfd573d2c3`

## Environment

Use the existing research venv:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

No additional package installation should be necessary.

## Repository update

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version
```

Do not continue if unexpected source changes are present.

## Compile

```bash
python -m py_compile tools/experiments/export-position-typology-stage1-mtaji-candidate.py
```

## Execute

```bash
python tools/experiments/export-position-typology-stage1-mtaji-candidate.py
```

Expected output:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

## What is frozen in the artifact

The exported JSON records:

- discovery population definition,
- deterministic game×phase cap policy,
- exact 40-feature order,
- exact log1p field set,
- fitted StandardScaler mean / scale / variance,
- K-means settings,
- standardized k=2 centroids,
- arbitrary raw K-means label → canonical type-ID mapping,
- source artifact hashes,
- training rule-state-key hash,
- provisional descriptive aliases,
- discovery diagnostics and interpretation boundaries.

## Canonical provisional IDs

The discovery cluster with the larger transformed:

```text
total.meanCapturableSeeds
```

is deterministically mapped to:

```text
MTAJI-M1
capture-engaged / relatively balanced morphology
```

The other cluster is mapped to:

```text
MTAJI-M2
capture-sparse / relatively asymmetric morphology
```

These aliases remain **provisional and descriptive**. They are not formal ontology names until independent confirmation succeeds and the naming decision is separately frozen.

## Prohibited actions at this step

Do not:

- generate a new corpus,
- choose or inspect held-out seeds,
- refit the candidate on new data,
- alter feature definitions after seeing held-out data,
- call this formal confirmation,
- analyze playing style,
- use Study 1 formal corpus for this discovery freeze.

## Share back

Upload only:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Keep other local artifacts local unless requested.

## Next decision point

After the exported candidate definition and hash are inspected:

1. decide whether the candidate specification is sufficiently exact to freeze,
2. write a separate confirmation preregistration,
3. only then define the independent held-out seed block and execution policy,
4. execute confirmation without changing the frozen candidate definition.
