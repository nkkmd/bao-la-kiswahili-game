# Checkpoint — Stage 6 replay integrity accepted / association analysis authorized

Date: 2026-08-10  
Branch: `research/position-typology-and-playing-style`

## State entering checkpoint

The Stage 6 cross-study bridge protocol was frozen before any position-type / coordinate association value was computed.

```text
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

The local deterministic replay audit has now been received and accepted.

## Replay identity

```text
replayedCandidateStateDatasetHash = 798dd665dd60e76c4860f95c0e1714b5bcb2aa9c968cabd715789aff23dfe3dc
auditHash = 3cdacb0aacd1fcecb53b72833cfffd8c02576ae882956f780c0c465bfdf8acf5
allReplayChecksPassed = true
```

Independent canonical recomputation of `auditHash` matched exactly.

All six fixed conditions passed:

```text
E-018 D2-LG
E-018 D2-P2
E-019 D3-LG
E-019 D3-P2
E-020 D3-LG
E-020 D3-P2
```

## Boundary preservation at replay completion

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

Therefore no scientific relation value was used to change the bridge protocol.

## Association analysis authorization

The next authorized operation is the frozen secondary association analysis only:

```text
tools/experiments/analyze-position-typology-stage6-cross-study-association.py
```

It must retain without modification:

- unique experiment/condition/trajectory-ply unit;
- fixed positive phenotype;
- fixed non-precursor comparator;
- precursor exclusion;
- phase-first representation;
- frozen MTAJI-M1/M2 classifier;
- frozen N-ACT/N-CON state transform;
- no p-values;
- no refit;
- no cluster rescue;
- no STYLE-C1..C4 use;
- no pooled confirmatory D2/D3 inference.

## Unchanged formal decisions

Study 1 remains:

```text
E-010 not-confirmed
E-011 inconclusive
E-017 not-confirmed
E-018/H16 confirmed only hard/bao/depth2 phase2 > legacy
E-019/H17 global not-confirmed
E-020/H18 confirmed only hard/bao/depth3 legacy > phase2
```

Current study remains:

```text
Stage 2 Mtaji = confirmed
Stage 5 exact 4D playing-style geometry = not-confirmed
```

No Stage 6 secondary result may alter either decision set.
