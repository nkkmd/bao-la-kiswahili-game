# STAGE_0_TECHNICAL_PROTOCOL — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20  
Status: **SEMANTICS TEST PASS / COMPUTE FEASIBILITY PENDING / NO SCIENTIFIC GENERATION**

## Purpose

Validate the present Study's thin decision-loss interpretation layer without modifying the Bao engine, AI evaluator, or existing exact-search semantics.

Stage 0 must not generate a fresh research corpus or inspect candidate-discovery outcomes.

## Implementation boundary

New wrapper:

```text
tools/experiments/lib/blunder-misvaluation-patterns.js
```

It may only:

- consume existing exact root candidate tables;
- calculate same-root regret/rank/median diagnostics;
- classify ordinary/mate/cross-domain losses;
- calculate static post-move score from the root actor perspective;
- attach existing tactical transition and reply-envelope summaries;
- expose D1/D2/D3 trace through existing instrumentation.

It must not alter:

```text
public/engine.js
public/ai.js
public/ai-weights.js
position-complexity-search-diagnostic.js
tactical-motif-features.js
```

## Required semantics validation

Stage 0 semantics PASS requires:

1. prerequisite exact-search diagnostic test PASS;
2. prerequisite tactical transition/reply test PASS;
3. new domain-aware regret unit tests PASS;
4. D3+Q1 initial-state exact search deterministic across repeated calls;
5. tied best moves receive regret 0 / rank 1;
6. normalized rank loss stays within [0,1];
7. synthetic ordinary/mate/cross-domain encodings follow the frozen ordering;
8. static post-move evaluation uses the original root actor;
9. candidate summary does not mutate root state;
10. D1/D2/D3 trace remains Q1 under the wrapper.

## Semantics execution result

The investigator returned:

```text
node test/position-complexity-search-diagnostic.test.js
Position-complexity search diagnostic tests passed

node test/tactical-motif-stage0.test.js
Tactical motif Stage 0 feature tests passed

node test/blunder-misvaluation-stage0.test.js
Blunder / misvaluation Stage 0 technical tests passed
```

Therefore:

```text
Stage 0 executable semantics validation = PASS
```

The exact local HEAD was not included in the transcript. This is retained as a provenance caveat; a fresh source-file SHA audit is mandatory before any scientific authorization.

## Compute-feasibility substage

Before freezing the Stage 1 scientific population size, run:

```text
tools/experiments/benchmark-blunder-misvaluation-stage0.js
```

The benchmark is technical-only. It:

- uses deterministic no-RNG fixture walks;
- does not use Stage 1/Stage 2 reserved scientific seeds;
- samples nonterminal roots only for workload measurement;
- reports timing, node counts, legal-move counts and phase coverage;
- suppresses search scores, regrets, candidate-pattern summaries and game outcomes;
- writes no scientific artifact.

The runtime result may inform a prospective Stage 1 measurement budget before scientific generation. It may not be used to tune a scientific effect threshold.

## CI scope

Workflow:

```text
.github/workflows/blunder-misvaluation-stage0.yml
```

GitHub Actions may execute these technical tests. It must not generate Stage 1/2 scientific artifacts.

## Scientific firewall

Even after Stage 0 semantics PASS and compute-feasibility completion:

```text
Stage 1 scientific generation authorized = false
Stage 2 scientific generation authorized = false
```

The next scientific gate is a separately frozen Stage 1 exploratory spec plus source-bound explicit authorization.
