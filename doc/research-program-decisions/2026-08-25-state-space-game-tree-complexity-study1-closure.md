# Research Program Decision — State Space / Game Tree Complexity Study 1 Closure

Date: 2026-08-25  
Study: `SSGTC-STUDY1`  
Status: COMPLETED

## Decision

State Space / Game Tree Complexity Study 1 completed as a new prospective independent RAW-ONLY study.

```text
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

The formal Stage 2 target was the standard engine initial state, complete raw-state reachability through depth 8 with parent depths 0..7 fully expanded, and a separate non-deduplicated game tree through depth 8.

```text
reachable raw states through depth 8 = 24,848
graph transition occurrences parent depth 0..7 = 25,648
game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940
```

Production and independent full-domain re-enumeration agreed exactly.

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

## Representation contract preserved

Authoritative downstream identity remains:

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
pendingRequired = true
sum(pits)+sum(reserve)+sum(pending) = 64
```

No symmetry reduction or canonicalization was used. The validated symmetry transformation set remains `[]`.

## Program boundary

This closure does **not** authorize the statement `Bao state space = 24,848`. The exact claim is restricted to the frozen standard-root depth-8 RAW-ONLY domain.

The following remain unresolved:

- exact full-game reachable raw-state count;
- exact full-game game-tree count;
- validated full-game growth law or estimator;
- symmetry-reduced state counting;
- validated canonicalization/symmetry quotient.

A deeper exact enumeration, full-game estimate, or symmetry-reduced count must be a new prospective study or explicitly versioned new protocol. Stage 1 partial depth-9 observations from SSGTC-STUDY1 may not be relabeled as a full-game estimate or reused as new formal evidence.

## Upstream decisions unchanged

This closure does not alter:

- Restricted Endgame / Winning Regions Study 1 — `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state / 7-edge domain;
- Symmetry / Isomorphic Positions Study 1 — 0 validated / 0 rejected / 5 `NON-ESTIMABLE`;
- ORISC-STUDY1 Axis A — `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`;
- ORISC-STUDY1 Axis B — `NOT-AUTHORIZED-NOT-EXECUTED`.

The historical 2026-08-24 decision that required ORISC before SSGTC remains an immutable record of the program sequence and is not rewritten by this closure document.