# Blunder / Misvaluation Patterns Study 1 — Stage 0 Tooling Materialized

Date: 2026-08-20  
Status: **TOOLING MATERIALIZED / EXECUTION RESULT PENDING / SCIENTIFIC GENERATION BLOCKED**

## Identity

```text
studyId = BMP-STUDY1
baseline main = b1cc7047504b73c5a848e866f795c26a64250d13
design commit = 0c0b88649cd77043bfadc2a2d48c7f27b611dc2d
tooling commit = dff7d11874c92d585f50f57b3077204271ab682b
```

## Materialized technical surface

```text
tools/experiments/lib/blunder-misvaluation-patterns.js
test/blunder-misvaluation-stage0.test.js
.github/workflows/blunder-misvaluation-stage0.yml
```

The new library wraps existing instrumentation only. No modification was made to:

```text
public/engine.js
public/ai.js
public/ai-weights.js
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/lib/tactical-motif-features.js
```

## Intended test coverage

The Stage 0 test checks:

- D3+Q1 design constants;
- ordinary/mate/cross-domain regret encoding;
- tie/regret/rank consistency;
- exact house-choice move-key distinction;
- exhaustive root-candidate accounting on a fixture state;
- D3 determinism;
- root-actor static post-move perspective;
- transition/reply summary non-mutation;
- D1/D2/D3 Q1 trace.

## Execution state

No successful Stage 0 execution is claimed in this checkpoint. The workflow is push-triggered, but the currently available connector path does not expose a confirmed push-run result for the tooling commit.

Therefore:

```text
Stage 0 technical PASS = NOT YET RECORDED
Stage 1 generation authorized = false
Stage 2 generation authorized = false
scientific corpus generated = 0
```

## Decision

Keep the Stage 1 firewall closed until technical execution is independently confirmed and a PASS/failure artifact is recorded.
