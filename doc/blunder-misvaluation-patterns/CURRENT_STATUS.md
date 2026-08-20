# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20

## Research identity

```text
studyId = BMP-STUDY1
research branch = research/blunder-misvaluation-patterns
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
initial design commit = 0c0b88649cd77043bfadc2a2d48c7f27b611dc2d
Stage 0 tooling commit = dff7d11874c92d585f50f57b3077204271ab682b
```

## Current scientific state

```text
Stage 0 design restoration/audit = COMPLETE
Stage 0 tooling materialization = COMPLETE
Stage 0 executable technical semantics validation = PASS
Stage 0 D3+Q1 compute feasibility benchmark = PENDING
Stage 1 exploratory spec = NOT YET FROZEN
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
scientific corpus generated in this Study = 0
formal scientific result = NONE
```

## Stage 0 technical PASS evidence

The investigator returned successful local execution for all three required tests:

```text
node test/position-complexity-search-diagnostic.test.js
Position-complexity search diagnostic tests passed

node test/tactical-motif-stage0.test.js
Tactical motif Stage 0 feature tests passed

node test/blunder-misvaluation-stage0.test.js
Blunder / misvaluation Stage 0 technical tests passed
```

This satisfies the executable semantics-test gate defined in `STAGE_0_TECHNICAL_PROTOCOL.md`.

Provenance caveat: the exact local `git rev-parse HEAD` was not printed in the returned command transcript. The present-study test file necessarily requires the Stage 0 tooling materialization to be present, but Stage 1 authorization will still require a separate source-file SHA / source-commit audit before any scientific generation.

## Stage 0 tooling present

```text
tools/experiments/lib/blunder-misvaluation-patterns.js
test/blunder-misvaluation-stage0.test.js
.github/workflows/blunder-misvaluation-stage0.yml
STAGE_0_TECHNICAL_PROTOCOL.md
```

The wrapper is intentionally thin: it consumes existing exact-search and tactical-transition instrumentation and does not modify `public/engine.js`, `public/ai.js`, `public/ai-weights.js`, the Position Complexity search diagnostic, or Tactical Motif feature semantics.

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

A deterministic technical-only benchmark is prepared in:

```text
tools/experiments/benchmark-blunder-misvaluation-stage0.js
```

It does not use the reserved scientific seed namespaces and does not emit scientific scores, regret patterns, game outcomes, or candidate-discovery results. It measures workload/timing only.

Before Stage 1 design can be finalized:

1. execute the Stage 0 D3+Q1 feasibility benchmark;
2. record its technical workload/timing result;
3. choose Stage 1 exact game count and measurement budget prospectively from technical feasibility only;
4. freeze candidate grammar and promotion/support gates;
5. freeze and validate the Stage 1 exploratory spec;
6. independently audit source commit / source-file hashes;
7. only then consider a separate Stage 1 generation authorization.
