# STAGE_0_FEASIBILITY_RUNBOOK — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20  
Status: **TECHNICAL-ONLY / NO SCIENTIFIC CORPUS**

## Purpose

Measure the practical cost of the frozen D3+Q1 reference and the planned D1/D2/D3 plus all-legal-move structural measurement surface before Stage 1 population size is frozen.

This benchmark is not a pilot scientific corpus and must not be mined for bad-move candidates.

## Preconditions

Run on:

```text
branch = research/blunder-misvaluation-patterns
```

Recommended identity check:

```bash
git status --short --branch
git rev-parse HEAD
```

The working tree should be clean for a canonical timing record.

## Execute

Default benchmark: four deterministic technical roots per phase.

```bash
node tools/experiments/benchmark-blunder-misvaluation-stage0.js
```

Optional larger technical sample, for example eight roots per phase:

```bash
node tools/experiments/benchmark-blunder-misvaluation-stage0.js 8
```

Do not use the reserved Stage 1 or Stage 2 seed namespaces for this benchmark.

## Output

The command prints one JSON object to stdout containing:

- technical phase coverage;
- legal-move counts;
- D1/D2/D3 exact-search timing;
- D3 and total node counts;
- all-legal-move transition/reply measurement timing;
- serial projection per 1,000 and 2,000 measured roots.

It intentionally does **not** emit:

```text
search scores
regret values
candidate pattern identities
candidate effect estimates
game outcomes
win probabilities
```

## Interpretation

Use the timing/workload result only to choose a feasible Stage 1 scientific measurement budget before Stage 1 generation.

A timing result may justify a smaller or larger prospectively frozen Stage 1 game/root count within the already reserved capacity. It may not justify changing the D3 primary reference because of favorable or unfavorable scientific outcomes; no such outcomes are produced here.

## Return record

For archival, retain:

```text
git rev-parse HEAD
full benchmark JSON stdout
```

These will be recorded before the Stage 1 exploratory spec is frozen.
