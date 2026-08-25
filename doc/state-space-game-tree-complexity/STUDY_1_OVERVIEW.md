# State Space / Game Tree Complexity Study 1 — Overview

**Study ID:** `SSGTC-STUDY1`  
**State:** prospective / in progress  
**Formal result:** none yet

## Research question

Can Bao reachable-state space and game-tree complexity be quantified reproducibly using authoritative raw rule-state identity, without unvalidated symmetry reduction, while keeping exact bounded enumeration distinct from observed counts, game-tree path occurrences, trajectories, and any future estimates?

## Scope boundary

This study does **not** attempt to repair or re-decide Restricted Endgame Study 1, Symmetry Study 1, or ORISC-STUDY1. The ORISC downstream contract is binding: raw identity is authoritative and the validated symmetry transformation set is empty.

## Raw identity

```text
include: pits, reserve, houseOwned, player, phase, winner, pending
exclude: turn, reason
seed invariant: sum(pits)+sum(reserve)+sum(pending)=64
```

Missing `pending` is invalid and cannot be silently repaired.

## Measurement families

The design distinguishes at least:

- bounded reachable raw-state growth by depth/phase;
- generated game-tree nodes versus unique raw states;
- legal branching structure and forced-move structure;
- duplicate encounters, transpositions, and multi-parent convergence;
- trajectory/terminal/phase-transition structure;
- computational expansion cost and feasibility boundary.

These are not all formal endpoints. Stage 1 is exploratory; any Stage 2 endpoint must be prospectively frozen.

## Staged design

### Stage 0

Technical-only depth-2 exact diagnostic graph from the standard engine root. Validates identity, seed conservation, replay, production/independent serializer agreement, duplicate detection, shallow graph reconstruction, and materialization integrity. No scientific conclusion.

### Stage 1

Fresh exploratory corpus/design. Characterizes state growth, branching, transposition, terminal, and resource scaling under pre-frozen caps. Scientific inference remains unauthorized.

### Stage 2

Not authorized. If promoted, it must use fresh evidence and a separately committed formal specification. A bounded formal target is preferred over an unsupported global Bao state-count claim.

## Current result

No scientific result exists. Study-start and Stage 0 protocol documents were frozen before Stage 0 outcome generation.