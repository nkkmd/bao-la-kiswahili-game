# Stage 6 Cross-Study Association Analysis Runbook

Date: 2026-08-10  
Status: **secondary / hypothesis-generation analysis authorized after replay integrity pass**

## Purpose

Run the already frozen Stage 6 bridge protocol on replay-verified Study 1 candidate positions.

This is not a formal experiment and does not generate new games.

Frozen protocol:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Replay prerequisite:

```text
replayAuditHash = 3cdacb0aacd1fcecb53b72833cfffd8c02576ae882956f780c0c465bfdf8acf5
replayedCandidateStateDatasetHash = 798dd665dd60e76c4860f95c0e1714b5bcb2aa9c968cabd715789aff23dfe3dc
allReplayChecksPassed = true
```

## Analyzer

```text
tools/experiments/analyze-position-typology-stage6-cross-study-association.py
```

The analyzer verifies:

1. frozen protocol canonical hash;
2. replay-audit canonical hash;
3. replayed candidate-state dataset hash;
4. all six replay conditions passed;
5. exact Mtaji candidate-definition hash;
6. exact Namua style-ingredient-definition hash;
7. exact Stage 6 scope;
8. no prior association-analysis flag in replay inputs.

## Fixed analysis unit

```text
experiment + condition + trajectoryHash + candidatePly
```

Duplicate rows with the same key are collapsed only if their classification, phase, category, state hash, terminal distance and rule-state identity agree. Any conflict is an integrity error.

No cross-condition or cross-experiment deduplication is performed.

## Fixed candidate groups

Positive:

```text
capture-branch-expansion
```

Non-precursor comparator:

```text
temporary-spike
capture-branch-convergence
```

Excluded from the structural comparator:

```text
namua-to-mtaji-precursor
forcing-release-precursor
```

The precursor classes remain in phase-overlap reporting only.

## Phase-specific analysis

### Mtaji

Only candidate states whose actual phase is `mtaji` are passed through the frozen confirmed classifier:

```text
MTAJI-M1
MTAJI-M2
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Report by experiment and condition:

- M1/M2 counts and fractions for expansion;
- M1/M2 counts and fractions for comparator;
- expansion-minus-comparator M1-fraction difference.

No classifier/scaler refit is allowed.

### Namua

Only candidate states whose actual phase is `namua` use the frozen discovery-side coordinates:

```text
N-ACT
N-CON
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

Report by experiment and condition:

- distribution summaries for expansion and comparator;
- median difference expansion minus comparator;
- Cliff's delta expansion versus comparator.

No scaler refit and no confirmatory p-value are allowed.

## Explicit non-analysis

The analyzer does not compute or use:

- STYLE-C1..C4;
- a new cluster solution;
- a new position-type count;
- winner/outcome as a definition;
- AI condition label as a feature;
- a new sustained-forcing-window threshold;
- causal mediation;
- pooled formal D2/D3 inference;
- confirmatory p-values.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile \
  tools/experiments/analyze-position-typology-stage6-cross-study-association.py

python tools/experiments/analyze-position-typology-stage6-cross-study-association.py
```

Expected output:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/association/cross-study-association-result.json
```

Share only this JSON.

## Interpretation boundary

The output may support only:

> secondary / hypothesis-generation evidence describing where the fixed Study 1 transition phenotype lies in the independently defined position representation.

It cannot change Study 1 formal decisions, cannot confirm a universal Bao phase transition, and cannot rescue Stage 5.
