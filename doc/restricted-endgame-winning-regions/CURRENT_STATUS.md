# CURRENT_STATUS — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24

## Repository identity

```text
studyId = REWR-STUDY1
baseline main HEAD = 626480507710e0095ef8aec6a53c3e4e0318fa4f
baseline engine.js blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
baseline RULES_BASELINE.md blob = 9a07ce6c2895cd4b4048af71a41fc5de02f87129
branch = research/restricted-endgame-winning-regions
directory = doc/restricted-endgame-winning-regions/
```

## Scientific state

```text
Prior-study audit = COMPLETE ENOUGH TO OPEN STAGE 0
Rule/engine semantic audit = INITIAL PASS
Stage 0 construct design = OPEN / PROSPECTIVE
Stage 0 technical fixture solver = AUTHORIZED
Stage 0 Bao-domain benchmark = NOT YET EXECUTED
Stage 1 exact-domain spec = NOT FROZEN
Stage 1 scientific tablebase generation = BLOCKED
Study 1 scientific result = NONE YET
```

## Recovered engine semantics

Authoritative runtime state includes `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `reason`, `turn`, `pending`.

For rule-state identity, existing direct `ruleStateKey` infrastructure serializes:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

It excludes history-only/administrative `turn` and textual `reason`. This Study will use a direct, non-symmetry rule-state serialization derived from those rule-relevant fields and will not use `seatCanonicalKey`.

Exact move identity must distinguish `houseChoice`; existing `AI.moveKey` includes:

```text
type, phase, row, index, direction, side, houseChoice, houseTwo
```

For Mtaji-only primary candidates, `houseChoice` is not expected to occur, but identity remains explicit.

## Terminal semantics audit

Observed engine terminal reasons:

```text
front-empty
no-move
relay-limit
```

`front-empty` and `no-move` are implemented as gameplay termination semantics. `relay-limit` is not accepted as a normative terminal: `RULES_BASELINE.md` explicitly describes the relay cap as a browser safety constraint, not a Bao rule.

The engine has no intrinsic formal draw/repetition state. Research-driver max-ply draws from prior studies are administrative truncations only.

## Stage 0 preliminary decisions A–H

### A. Is bounded exact retrograde possible in principle?

**YES, conditionally.** It is possible if the frozen domain is finite and legal-transition closed, all state/move identities are deterministic, normative terminal cases are separated from implementation guards, and every legal move in-domain has exact terminating semantics. Current `applyMove` cannot by itself certify the last condition because of `MAX_RELAY`.

### B. Should Study 1 start Mtaji-only?

**YES.** Mtaji-only removes reserve placement and Namua nyumba choice complexity. `phase=mtaji` with `reserve=[0,0]` is invariant under successors. A primary candidate should additionally prefer `houseOwned=[false,false]`, which is also forward-invariant in Mtaji.

### C. How to construct a nontrivial transition-closed domain?

Use a frozen set of historically reachable Mtaji witness roots `R`, then define:

```text
D(R) = every raw rule state reachable from R by zero or more legal moves,
       including normative terminal successors.
```

This is transition closed by construction if every legal move is expanded exactly. Root filters may use technical structural quantities, but those filters do not truncate the closure.

### D. Reachable-only or rule-valid closed primary population?

**Primary = witness-reachable closure.** Every root must have a legal path from the standard initial state; every successor then inherits reachability. Rule-valid-but-unproven states may be audited separately but will not be the primary exact population in Study 1.

### E. Draw / cycle / nontermination semantics

No formal repetition/draw rule is currently implemented. Fixed-point leftovers must therefore be reported as `RECURRENT` / `CYCLE-REGION`, not automatically `DRAW`. Intra-move nontermination is a separate semantic failure (`MOVE-NONTERMINATION`) and makes a candidate domain ineligible for exact Study 1 unless a normative rule is established prospectively.

### F. Distance metric

Provisional metric name: `DTF` = distance-to-forced-terminal, measured in legal moves. Terminal distance = 0. For resolved WIN states, the winner minimizes distance; for resolved LOSS states, the player-to-move maximizes resistance. Recurrent states have no finite DTF. The exact recurrence must be frozen in Stage 1 spec.

### G. Feasibility benchmark strategy

Benchmark only technical quantities before domain freeze: root count, closure state count, edge count, branching, maximum move-internal relay work, closure completeness, memory and runtime. Do not inspect WIN/LOSS proportions, winning-region size, optimal-move frequencies or DTF distribution when selecting the Study 1 domain.

### H. Smallest meaningful exact domain without symmetry

A single historically reachable Mtaji witness root plus its complete forward closure is the minimum scientifically meaningful unit, provided it is nonterminal, has more than one reachable state, passes guard-free move semantics, and is fully independently reconstructable. Stage 0 may prospectively select multiple roots if the complete closure remains feasible.

## Immediate next gate

Stage 0 must implement and test:

1. generic retrograde semantics on synthetic graphs;
2. guard-free Bao move executor/auditor or equivalent exact relay-termination proof mechanism;
3. witness-root generation and replay verification;
4. complete forward-closure enumeration;
5. independent closure/state/edge hashing.

No scientific outcome tablebase may be generated before these gates and a frozen Stage 1 spec.
