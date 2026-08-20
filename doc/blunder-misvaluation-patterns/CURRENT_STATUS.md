# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20

## Research identity

```text
studyId = BMP-STUDY1
research branch = research/blunder-misvaluation-patterns
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
```

## Current scientific state

```text
Stage 0 design restoration/audit = COMPLETE
Stage 0 executable technical smoke = PENDING
Stage 1 exploratory spec = NOT YET FROZEN
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
scientific corpus generated in this Study = 0
formal scientific result = NONE
```

## Frozen inherited boundaries

```text
Position Evaluation / Win-Rate Calibration Study 1
  formal decision = INCONCLUSIVE
  isotonic mapping = exploratory-only

Position Complexity / Difficulty Study 1
  PCX-H1 = INCONCLUSIVE
  PCX-H2 = NOT-CONFIRMATORILY-EVALUATED

Tactical Motifs / Tesuji Study 1
  C01 = NOT-CONFIRMED
  C02 = NOT-CONFIRMED
  C03 = CONFIRMED
  C04 = NOT-CONFIRMED

Tactical Motif Human / Expert Validation Study 1
  machineEvidence = CONFIRMED
  humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
  humanExpertN = 0
```

No closed-study formal decision is reopened.

## Current primary design choice

```text
primary reference search = D3 + quiescenceDepth 1
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
evaluation profile = bao
perspective = root actor
```

D2 is the shallow comparator. D4 is not primary and may only be used under a prospectively frozen technical/robustness role.

## Current seed state

```text
Stage 1 reservation = 22400001..22402048
Stage 2 reservation = 22500001..22504096
generation authorization = false / false
```

## Immediate next gate

Before Stage 1 design can be finalized:

1. implement a small research-specific technical wrapper/test surface around existing exact-search and tactical transition instrumentation;
2. fixture-test domain-aware regret, actor perspective, tie handling and exact move identity;
3. benchmark D3+Q1 feasibility without generating a scientific corpus;
4. determine Stage 1 exact game count and promotion-support gates prospectively;
5. freeze Stage 1 exploratory spec;
6. independently validate scientific-contract/tooling source hashes;
7. only then consider Stage 1 generation authorization.
