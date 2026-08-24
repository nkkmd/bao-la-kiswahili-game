# RESEARCH_PLAN — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24  
Status: PROSPECTIVE / STAGE 0 ONLY

## 1. Research question

Can a prospectively frozen, finite, transition-closed restricted Bao endgame domain be exhaustively enumerated and solved by exact deterministic retrograde analysis, yielding bounded game-theoretic WIN/LOSS/RECURRENT classification, optimal move sets, and a frozen distance metric without using engine evaluation, empirical continuation probabilities, search values, symmetry assumptions, or administrative cutoffs as ground truth?

## 2. Non-goals and immutable boundaries

This Study does not reopen or rescue any completed Bao Study. In particular it does not alter formal decisions from phase-transition, position-typology, Namua→Mtaji, position-complexity, tactical motifs, human validation, position evaluation calibration, blunder/misvaluation, critical positions, joseki, or first-player research.

The following remain distinct:

```text
engine evaluation != empirical continuation outcome != search value != exact game-theoretic value
winning probability != deterministic WIN/LOSS classification
administrative cutoff != game-theoretic draw/cycle
constructible != rule-valid != historically reachable != in-domain
bounded exact solution != full-Bao solution
```

Human/expert comparison is out of scope.

## 3. Primary Study 1 population concept

Primary exact population will be a **witness-reachable forward-closed Mtaji domain**.

A candidate root is eligible only if:

- it is reproduced from the standard initial state by a stored legal witness path;
- `phase = mtaji`;
- `reserve = [0,0]`;
- it is nonterminal under normative semantics;
- primary preference: `houseOwned = [false,false]`;
- all legal moves are exactly enumerable;
- every legal move has guard-free terminating semantics;
- complete forward closure is technically feasible under frozen resource gates.

For a frozen root set `R`, the domain is not defined by a truncating feature cap. It is the full legal forward closure `D(R)` through normative terminal successors.

## 4. Stage 0 — construct/rule/feasibility only

Authorized outputs:

- engine/rule source hashes;
- state and move serialization audits;
- validity/invariant checks;
- witness-path replay checks;
- candidate root counts under predeclared technical filters;
- complete closure state/edge counts;
- branching distributions;
- guard-free relay termination statistics;
- SCC counts of synthetic fixtures or unsolved graph topology only when not exposing scientific outcome labels;
- runtime/memory estimates;
- deterministic state/edge hashes;
- independent reconstruction equality.

Forbidden before Stage 1 domain freeze:

- candidate-domain WIN/LOSS/RECURRENT proportions;
- winning-region size comparisons;
- optimal move frequencies;
- DTF/DTW/DTM distributions;
- choosing caps or roots because their exact solution looks interesting or positive.

If solver mechanics require Stage 0 testing, use synthetic graphs or explicitly technical tiny fixtures that cannot become the scientific Study 1 population.

## 5. Stage 0 candidate-root benchmark grid

The benchmark grid is outcome-blind. It is a root-filter grid, not a domain boundary.

Initial structural filters to benchmark on witness-reachable Mtaji states with both houses inactive:

```text
nonEmptyPitCount <= 8, 10, 12, 14
legalMoveCount <= 2, 4, 6
```

Candidate roots within each cell are ordered by direct rule-state hash, not by game outcome/evaluation/search score. Stage 0 may benchmark prefixes of 1, 2, 4 roots per cell. If a cell has no eligible witness roots, it is recorded as empty; thresholds are not retuned after seeing scientific solution outcomes.

The final Study 1 root set may be selected using only closure size, edge count, move-termination proof status, deterministic verification, runtime, and memory.

## 6. State validity axes

Every enumerated state receives separate flags where applicable:

```text
syntacticallyRepresentable
invariantValid
ruleCanonical
historicallyReachable
studyDomainEligible
terminal
```

Primary closure states are historically reachable by construction: root witness path + legal successor path.

For nonterminal Mtaji states, expected invariants include nonnegative integer pits, reserve `[0,0]`, pending `[0,0]`, conserved 64 kete, both front rows occupied, no winner, and at least one legal move for the current player. Exact invariant rules will be frozen only after Stage 0 audit.

## 7. Terminal and move semantics

Normative base cases may use `front-empty` and `no-move` only after Stage 0 verifies their canonical interpretation for arbitrary enumerated states.

`relay-limit` is an implementation guard and is forbidden as an exact terminal result.

A research-owned exact transition adapter must either:

1. reproduce a normally terminating move without the 512-relay game-result shortcut; or
2. detect an exact repeated move-internal microstate and classify the move as semantic nontermination.

Any scientific candidate domain containing a legal move whose normative result cannot be determined is ineligible.

## 8. Retrograde semantics

The solver works with absolute player identities to avoid depending on how `engine.js` leaves `state.player` in terminal states.

Terminal nodes have an absolute winner. For a nonterminal state `s` with actor `p`:

```text
WIN(s)  if at least one legal successor is solved with absolute winner p
LOSS(s) if every legal successor is solved with absolute winner 1-p
```

After fixed-point completion, unresolved states are not called formal draws. They are analyzed as recurrent/cycle regions with SCC decomposition.

## 9. Distance metric

Provisional Stage 1 metric: `DTF` (distance-to-forced-terminal), in legal moves.

```text
DTF(terminal) = 0
DTF(WIN)  = 1 + min DTF(successor with same absolute winner)
DTF(LOSS) = 1 + max DTF(successor, all of which have opponent as absolute winner)
DTF(RECURRENT) = null
```

This means the eventual winner minimizes terminal time while the losing side maximizes resistance. The recurrence and tie treatment must be frozen before scientific generation.

## 10. Optimal move set

For resolved WIN states: all legal moves achieving the minimum winning DTF.  
For resolved LOSS states: all legal moves achieving the maximum resistance DTF.  
For RECURRENT states: no WIN/LOSS optimal-move claim is made unless a separate cycle preference rule is prospectively defined; default is `null` plus recurrence-preserving move metadata.

## 11. Independent verification

Required before exact scientific claim:

- independent witness replay;
- independent state serialization;
- independent legality recomputation;
- independent full graph reconstruction;
- full state-count and edge-count equality;
- state-set and transition-set hash equality;
- terminal/winner equality;
- independent retrograde recomputation;
- full value equality;
- optimal-move-set equality;
- DTF equality;
- no symmetry canonicalization in either path.

## 12. Failure / stopping rules

Study 1 may stop as `TECHNICALLY INFEASIBLE`, `NOT-ESTIMABLE`, or `INCONCLUSIVE` if:

- no nontrivial closed witness-reachable domain passes semantics;
- guard-free move semantics expose unresolved normative nontermination;
- closure exceeds frozen resource limits;
- independent full reconstruction cannot be completed;
- state/edge/value hashes disagree.

No post-outcome cap retuning or smaller-domain rescue is allowed within the same frozen Stage 1.

## 13. Claim boundary

Successful claims are limited to:

> exact solution within the frozen restricted endgame domain under the frozen repository/rule semantics.

No automatic claim is made for all Mtaji, all Bao endgames, full Bao, engine calibration, human best play, or other rule implementations.
