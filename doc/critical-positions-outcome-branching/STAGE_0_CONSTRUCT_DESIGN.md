# STAGE_0_CONSTRUCT_DESIGN — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23  
Stage ID: `CPOB-S0-DESIGN-2026-08-23-v1`  
Scientific inference: **NOT AUTHORIZED**

## 1. Construct comparison

### A. Empirical continuation outcome divergence

Definition: same root, alternative exact legal root moves, one fixed post-root policy, replicated continuation outcomes.

**Role:** PRIMARY.

Strengths:

- directly measures move-sensitive policy-conditioned outcome separation;
- does not require converting engine scores to probabilities;
- can be paired within root;
- naturally distinguishes a critical root from a move-specific blunder label.

Limitations:

- policy-dependent;
- Monte Carlo uncertainty from finite replicates;
- potentially sensitive to administrative truncation and legal-move multiplicity.

### B. Search-value separation

Definition: spread of exact legal move values under one fixed search/evaluator configuration.

**Role:** SECONDARY machine-search axis.

Do not convert to probability using the exploratory Calibration Study mapping.

### C. Move-ranking instability

Definition: tie-aware TopSet/rank changes across prespecified depth/profile conditions.

**Role:** SECONDARY machine-search axis.

Position Complexity Study 1 remains `INCONCLUSIVE`; this study cannot rescue it.

### D. Structural branch divergence

Definition: between-move differences in immediate post-move board/legal/forcing/response structure.

**Role:** SECONDARY explanatory axis.

### E. Game-theoretic criticality

Requires proof/tablebase/complete solution.

**Role:** OUT OF SCOPE for ordinary Stage 1/2 engine experiments.

### F. Human-perceived criticality

Requires human/expert evidence.

**Role:** OUT OF SCOPE for machine-only Study 1.

## 2. Primary construct decision

Freeze:

```text
primaryConstruct = fixed-policy empirical continuation divergence
rootActor = root.player
rootMoves = all exact E.moveVariants(root)
exactMoveIdentity = AI.moveKey
```

## 3. Root-level primary statistic

For root `s`, move `m`, continuation policy `Pi`, and replicate index `r`:

```text
Y(s,m,r) ∈ {WIN, LOSS, ADMINISTRATIVE_UNFINISHED}
```

For an estimable move:

```text
p_hat(s,m) = root-actor wins / eligible terminal replicates
```

Primary continuous root summary:

```text
D_range(s) = max_m p_hat(s,m) - min_m p_hat(s,m)
```

The labels `highest` and `lowest` are empirical under the frozen policy. They do not mean true/game-theoretic best and worst.

Current planned materiality target:

```text
D_range >= 0.30
```

This is a provisional Stage 0 design target, not a result-derived threshold. Any change must occur before Stage 1 scientific generation, be justified by analytic precision/technical feasibility rather than observed scientific divergence, and be recorded as a new prospective design decision.

## 4. Continuation policy comparison

### P1 — seeded normal / bao

Existing implementation semantics:

```text
level = normal
evaluationProfile = bao
root choice at each continuation ply = seeded uniform among top min(3,n) immediateScore-ranked exact legal moves
completedDepth diagnostic = 1
searchProfile = not applicable to normal path
```

Pros:

- already implemented;
- supplied RNG is injectable;
- stochastic and exactly replayable with `seededRandom`;
- relatively inexpensive.

Cons:

- one-ply immediate heuristic rather than D2/D3 tree search;
- outcome estimand is explicitly a normal-policy continuation, not strong-play probability.

### P2 — seeded D2-ranked top-3 / bao / phase2 / Q1

Proposed research-only wrapper:

```text
exact root candidate table = D2
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
evaluation = bao
quiescenceDepth = 1
pool = first min(3,n) candidates after score-descending / moveKey tie ordering
choice = seeded uniform
```

Pros:

- explicit fixed search depth/evaluator semantics;
- stronger decision filter than immediate scoring;
- retains stochastic support for replicate distributions.

Cons:

- much greater runtime because exact root candidate search is repeated at every continuation ply;
- requires new wrapper and verifier;
- technical feasibility unknown.

### P3 — seeded uniform exact legal

```text
choice = seeded uniform from E.moveVariants(state)
```

Pros: minimal, exact, fast, highly stochastic.  
Cons: weak strategic policy and therefore less attractive as the primary scientific estimand.

### Policy selection rule

Stage 0 may select the primary policy only from this pre-enumerated menu and only using technical criteria:

- supplied-seed deterministic replay;
- no hidden/uncontrolled RNG;
- all chosen moves legal exact variants;
- terminal/unfinished behavior auditable;
- no time-dependent search cutoffs in the frozen configuration;
- projected runtime/artifact feasibility;
- independent verifier can recompute decisions.

Observed criticality/divergence, win rates, favorable phase results or candidate prevalence are forbidden selection inputs.

Preferred order if technically feasible:

```text
P2 > P1 > P3
```

This preference must not be changed after scientific outcome inspection.

## 5. Replication design

Use paired/common-random-number continuation replicates within each root:

```text
for replicate r:
  derive one root-level replicate seed
  for every legal root move m:
    initialize a fresh RNG from that same seed
    apply m
    run frozen policy to terminal/cap
```

This preserves a paired replicate index across moves without sharing mutable RNG state between move interventions.

Candidate replicate counts for Stage 0 feasibility:

```text
R = 32, 48, 64 technical benchmark grid
preferred scientific target = 64 per exact legal root move
```

Final `R` must be frozen before Stage 1 generation. There is no sequential extension based on observed divergence.

Worst-case binomial standard error at `p=0.5`:

```text
R=32: 0.0884 per move
R=48: 0.0722 per move
R=64: 0.0625 per move
```

These analytic quantities, not scientific outcomes, may inform the freeze.

## 6. Completion / unfinished handling

Current engine exposes terminal winner via `state.winner`; administrative max-ply stopping is external to engine terminal semantics.

Freeze principle:

- native terminal winner 0/1 → root actor WIN/LOSS;
- max continuation length → ADMINISTRATIVE_UNFINISHED;
- never encode administrative unfinished as draw/0.5/loss;
- root/move primary eligibility requires a completion gate frozen before Stage 1.

Maximum continuation length and allowed unfinished fraction are Stage 0 technical decisions, not post-outcome rescue controls.

## 7. Structural branch axis

For every root move, Stage 0 should validate extraction of:

- legalMoveCount;
- captureMoveCount;
- forced-capture/free-choice status;
- actor/opponent front occupancy;
- actor/opponent front connections;
- reusable pits;
- reserve;
- house ownership / nyumba seeds;
- phase;
- all immediate opponent exact replies;
- response-envelope summaries.

These quantities are explanatory/secondary unless separately preregistered.

## 8. Search axis

Reuse the exact-root diagnostic only as instrumentation:

```text
D2 and D3 candidate tables
D3+Q1 primary search reference candidate
TopSet
best-second gap
score class
D2→D3 TopSet overlap
```

Search-value separation remains uncalibrated machine value separation.

## 9. Candidate discovery design target

Before Stage 1 scientific generation freeze:

- matcher grammar = phase + 1–2 pre-root structural tokens;
- outcome divergence excluded from matcher;
- fixed bins;
- unique-trajectory and unique-rule-state support;
- opening-prefix diversity;
- generation-stratum diversity;
- high-divergence recurrence gate;
- deterministic ranking;
- support-equivalence handling;
- maximum promoted candidates;
- no manual override.

The exact numeric promotion gates remain Stage 0 work and must be committed before Stage 1 authorization.
