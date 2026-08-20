# Blunder / Misvaluation Patterns Study 1 — Stage 1 Contract Validation PASS and Execution Tooling Materialization

Date: 2026-08-20  
Status: **CONTRACT VALIDATION PASS / TOOLING MATERIALIZED / TOOLING VALIDATION PENDING / SCIENTIFIC GENERATION BLOCKED**

## Canonical returned validation

The investigator returned the exact local repository identity:

```text
HEAD = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
branch = research/blunder-misvaluation-patterns
```

The frozen validator returned:

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
passed = true
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
generationAuthorizedBySpecAlone = false
exactGames = 2048
exactSeedStart = 22400001
exactSeedEnd = 22402048
exactSelectedRootsIfReadinessPasses = 1200
```

The contract test returned:

```text
Blunder / misvaluation Stage 1 contract tests passed
```

Decision:

```text
Stage 1 canonical contract validation = PASS
```

This validates the previously frozen contract; it does not change the frozen spec SHA.

## Execution tooling materialized after contract validation

Added:

```text
tools/experiments/lib/blunder-misvaluation-stage1-corpus.js
tools/experiments/lib/blunder-misvaluation-stage1-discovery.js
tools/experiments/run-blunder-misvaluation-stage1-exploratory.js
tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js
test/blunder-misvaluation-stage1-tooling.test.js
.github/workflows/blunder-misvaluation-stage1-tooling.yml
doc/blunder-misvaluation-patterns/STAGE_1_EXECUTION_RUNBOOK.md
```

## Scientific-contract invariants implemented

The tooling enforces:

- exact 2,048-game seed mapping;
- deterministic six-stratum generation assignment;
- full-search replay verification before selection;
- historical-trajectory collapse;
- outcome/value-blind phase assignment and root selection;
- no unavailable-phase reassignment;
- duplicate rule-state collapse before quota;
- exact 600/600 phase quota if readiness is estimable;
- all-legal-move D1/D2/D3+Q1 measurement;
- matcher/failure separation;
- one opportunity vote per trajectory/matcher;
- support-equivalence collapse;
- frozen deterministic promotion/cap;
- no manual override.

## Technical validation design

The tooling test intentionally does not generate Stage 1 scientific data. It uses a short fixture namespace beginning at `99000001` and checks:

- frozen spec identity;
- exact 2048-game stratum distribution;
- fail-closed missing-authorization behavior;
- source-file contract list presence;
- precondition and failure-token implementation;
- deterministic 600/600 quota handling;
- readiness logic;
- short technical generation + independent full-search replay;
- one-root D1/D2/D3 measurement and failure-token materialization.

## Authorization remains absent

```text
Stage 1 generation authorized = false
Stage 1 scientific corpus generated = 0
Stage 2 generation authorized = false
```

A separate authorization may be considered only after the new tooling test passes and the exact source-file SHA-256 mapping is frozen.
