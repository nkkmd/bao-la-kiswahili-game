# SSGTC-STUDY1 — Stage 1 Exploratory Design

Status: design frozen at study start; execution requires Stage 0 PASS and a separate pre-execution resource-profile checkpoint.

```text
scientificInference = NOT-AUTHORIZED
formalReuseInStage2 = PROHIBITED
symmetryReduction = PROHIBITED
```

## Purpose

Characterize technical/scientific feasibility and exploratory structure of raw-state growth, branching, transpositions, terminal behavior, and computational scaling without making a formal confirmatory claim.

## Freshness

Stage 1 must use a fresh study-owned root/seed/domain namespace distinct from Stage 0 and any future Stage 2. Stage 0 diagnostic rows may not be incorporated as Stage 1 observations.

## Expansion modes

### A. Deduplicated raw-state graph expansion

Breadth-first expansion keyed only by authoritative raw identity. Each unique raw state is expanded at most once. Record generated successor occurrences separately from unique child states.

### B. Bounded game-tree expansion

Path occurrences are retained without raw-state deduplication for a separately frozen shallow depth/resource profile. This mode estimates/describes tree growth only within its executed bounded design and must not be confused with unique-state growth.

## Exploratory measurements

At minimum, where technically well-defined:

- unique raw states by ply/minimum BFS depth and cumulative growth;
- Namua / Mtaji and phase-specific counts;
- terminal/nonterminal structure and reached-Mtaji proportion;
- duplicate/revisit encounters;
- legal-move count distribution;
- arithmetic mean branching among expanded nonterminal states;
- geometric branching summary only under an explicitly documented zero/terminal convention;
- forced single-move proportion;
- capture-forced versus free-choice states using current engine legality semantics;
- generated successor occurrences versus unique raw states;
- duplicate encounter rate and unique/generated ratio;
- raw-state in-degree / multi-parent structure;
- trajectory/game length and terminal ply in any trajectory-sampling component;
- phase-transition timing;
- recurrent/cycling structure if actually observed and mechanically validated;
- node expansions, frontier size, memory, CPU/wall time, output bytes/disk, and scaling by completed depth.

No single measurement is a formal primary endpoint at Stage 1.

## Resource and stopping rule

Before Stage 1 outcome generation, a checkpoint MUST freeze numeric caps for graph depth, tree depth, unique states, generated nodes/edges, frontier size, wall time, memory, and output bytes/disk as applicable.

Expansion stops at the first reached cap. The run must record:

- cap reached;
- last fully completed depth/layer;
- whether the next layer is partial;
- counts for completed versus partial layers separately.

Only fully completed verified layers may be described as bounded-exact for that frozen layer/domain. Partial layers are censored/observed only.

Caps cannot be increased after inspecting Stage 1 scientific patterns.

## Stage 2 promotion firewall

Stage 2 may be designed/executed only if:

1. Stage 0 is `SSGTC-STAGE0-PASS`;
2. Stage 1 completes its frozen design without unresolved representation, replay, duplicate, materialization, or independent-verification failure;
3. the Stage 2 target/domain/resource choice follows a predeclared feasibility rule rather than a favorable Stage 1 scientific direction;
4. Stage 2 uses fresh evidence and a separately frozen formal specification;
5. no Stage 1 row is reused as formal evidence.

If resource feasibility cannot support a defensible prospective formal target, Stage 2 may remain not authorized/non-estimable rather than being rescued.