# Stage 6 Cross-Study Bridge — Replay Integrity Result

Date: 2026-08-10  
Status: **accepted / all replay checks passed / association analysis not yet performed**

## Purpose

This document records acceptance of the read-only deterministic board replay that precedes the Stage 6 cross-study association analysis.

The frozen bridge protocol remains:

```text
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

No protocol field, comparator, phase rule, classifier, scaler, or interpretation boundary is changed by this result.

## Accepted replay audit

```text
status = stage6-cross-study-candidate-replay-audit-complete
replayedCandidateStateDatasetHash = 798dd665dd60e76c4860f95c0e1714b5bcb2aa9c968cabd715789aff23dfe3dc
auditHash = 3cdacb0aacd1fcecb53b72833cfffd8c02576ae882956f780c0c465bfdf8acf5
allReplayChecksPassed = true
```

The audit hash was independently recomputed from canonical JSON after removing `auditHash` and matched exactly.

## Per-condition integrity

| experiment | condition | candidate-bearing games | targets verified | observation hashes verified | move before/after hashes verified | replay |
|---|---|---:|---:|---:|---:|---|
| E-018 | D2-LG | 53 | 54 | 2961 | 2908 | pass |
| E-018 | D2-P2 | 104 | 107 | 5754 | 5650 | pass |
| E-019 | D3-LG | 194 | 194 | 10452 | 10258 | pass |
| E-019 | D3-P2 | 114 | 114 | 7029 | 6915 | pass |
| E-020 | D3-LG | 176 | 176 | 9643 | 9467 | pass |
| E-020 | D3-P2 | 112 | 112 | 6673 | 6561 | pass |

All six fixed bridge conditions passed deterministic replay.

## Preserved boundaries

At this checkpoint:

```text
formalExperiment = false
associationAnalysisPerformed = false
gamesExecuted = false
formalAnalysisRerun = false
archivesModified = false
scientificAssociationValuesComputed = false
study1FormalDecisionsModified = false
stage5DecisionModified = false
```

Therefore the replay stage establishes technical board-state recoverability only. It does not itself answer whether `capture-branch-expansion` is associated with MTAJI-M1/M2 or with N-ACT/N-CON.

## Consequence

The replay-verified candidate-state dataset may now be used as the sole board-state input to the frozen Stage 6 secondary association analysis.

The next analysis must retain:

- unique `experiment + condition + trajectoryHash + candidatePly` as the descriptive unit;
- `capture-branch-expansion` as the positive phenotype;
- `temporary-spike` + `capture-branch-convergence` as the non-precursor comparator;
- precursor exclusion from the structural comparator;
- phase-first application of Mtaji versus Namua representations;
- no confirmatory p-values;
- no pooled formal D2/D3 inference;
- no Stage 5 rescue.
