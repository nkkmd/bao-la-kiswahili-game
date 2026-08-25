# Research-program decision — start State Space / Game Tree Complexity Study 1 RAW-ONLY

Date: 2026-08-25  
Study: `SSGTC-STUDY1`

## Decision

Start **State Space / Game Tree Complexity Study 1** as a new prospective independent Bao study on branch `research/state-space-game-tree-complexity`, using study-start remote `main` SHA `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`.

The study may quantify bounded raw reachable-state growth, branching, transpositions, trajectories, and computational expansion structure, but only under authoritative RAW-ONLY identity.

## Binding representation contract

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
pendingRequired = true
seedConservation = 64
validatedSymmetryTransformations = []
canonicalization = NOT-AUTHORIZED
symmetryReducedCounting = NOT-AUTHORIZED
```

Missing `pending` must fail before engine compatibility code can synthesize a default.

## Upstream preservation

This study does not change:

- Restricted Endgame / Winning Regions Study 1 `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` decision or its frozen 8-state / 7-edge scope;
- Symmetry / Isomorphic Positions Study 1 `NON-ESTIMABLE` result;
- ORISC-STUDY1 Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` or Axis B `NOT-AUTHORIZED-NOT-EXECUTED`.

The ORISC three terminal-row mismatches are not repaired/re-decided here.

## Stage state at start

```text
Stage 0 = AUTHORIZED-TECHNICAL-ONLY
Stage 1 scientific inference = NOT-AUTHORIZED
Stage 2 = NOT-AUTHORIZED
formalDecision = NOT-YET-AVAILABLE
```

Stage 0 uses a frozen shallow exact diagnostic graph solely to validate representation, replay, duplicate detection, independent reconstruction, and artifact materialization. Its counts are not scientific evidence.

## Integration boundary

A draft PR may carry prospective work, but no merge to `main` and no auto-merge are authorized until study completion, final documentation/reproducibility/CI audit, and explicit user instruction.