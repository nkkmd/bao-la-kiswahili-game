# SRDR-STUDY1 — Current Status

更新日: 2026-08-27

## Status

**STUDY ACTIVE / PRE-SCIENTIFIC-GENERATION / STAGE 0 SPEC FROZEN / STAGE 1 NOT AUTHORIZED / STAGE 2 NOT AUTHORIZED**

## Identity

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Research branch = research/g2-02-search-reliability-decision-robustness
```

## Repository-start audit

```text
remote main = db6980bffb7e6853751914da628db8936c76d81e
expected prior main = db6980bffb7e6853751914da628db8936c76d81e
match = true
open PRs at study start = 0
active competing Research Generation 2 PRs = 0
```

Residual G2-01 branches were audited and are behind `main` with `ahead_by = 0`; they contain no unintegrated active research work.

## Stage state

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
          SPEC FROZEN / execution pending
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
          NOT AUTHORIZED
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
          NOT AUTHORIZED
```

Stage 0 spec SHA-256:

```text
12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
```

## Technical audit finding

Current `public/ai.js::analyzeMove()` exposes fixed depth, time limit, quiescence depth, quiescence capture ordering, TT move-first, history heuristic, aspiration window and stable-best controls. Existing `tools/experiments/lib/position-complexity-search-diagnostic.js` exposes exhaustive exact root candidate scores, deterministic score ties, TopSet, ranking and depth transitions.

Current public API does not expose a dedicated node-budget cap or a principal-variation sequence as a first-class result. These are Stage 0 feasibility items. They must be technically validated before inclusion in the Stage 1 scientific grid; otherwise they will be excluded before scientific generation.

## Immutable boundaries

```text
PEOCR-STUDY1 = INCONCLUSIVE
Position Complexity / Difficulty Study 1 = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

No prior scientific row is authorized as G2-02 formal evidence. RAW state identity remains `pits,reserve,houseOwned,player,phase,winner,pending`. No symmetry/canonicalization is authorized.

## Next authorized work

Only Stage 0 technical implementation / verification, source-hash freeze, and technical checkpointing are authorized. Stage 1 scientific population, seed range and search-condition grid must be frozen and explicitly authorized before any fresh scientific outcome generation.
