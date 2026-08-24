# VOCABULARY — Restricted Endgame / Winning Regions Study 1

## Exact constructs

### `rawRuleState`
Direct, non-symmetry serialization of rule-relevant state fields. Primary identity does not perform seat swap, left-right reflection, pit renumbering, or other isomorphism reduction.

### `witness-reachable root`
A root accompanied by a complete legal move sequence from `E.initialState()` that independently replays to the exact same raw rule state.

### `forward closure D(R)`
The set containing root set `R` and every state reached by recursively applying **every** exact legal move until normative terminal states. A scientific exact domain must have zero unexplained outgoing legal transitions.

### `transition closed`
For every nonterminal `s` in the domain and every exact legal move `m`, the exact successor is also in the domain. Normative terminal successors are included.

### `WIN`
Player-to-move can force an eventual normative terminal with that player as winner within the frozen domain.

### `LOSS`
Every legal strategy permits the opponent to force an eventual normative terminal win; equivalently all legal successors are solved for the opponent.

### `RECURRENT`
State not resolved to a forced terminal winner by the WIN/LOSS attractor fixed point. This is a graph-theoretic recurrent/unresolved class, **not automatically a formal draw**.

### `formal DRAW`
Reserved for a draw semantics explicitly established by the frozen normative rules. Current engine/rule audit has not established such a rule.

### `MOVE-NONTERMINATION`
A single legal move enters an exact repeating move-internal relay microstate under guard-free execution. This is distinct from a multi-turn game cycle and from `MAX_RELAY` administrative termination.

### `DTF`
Distance-to-forced-terminal, in legal moves, under frozen min/max recurrence. Finite only for resolved WIN/LOSS states.

### `optimalMoveSet`
For WIN: all moves attaining minimum winning DTF. For LOSS: all moves attaining maximum resistance DTF. RECURRENT states have no default WIN/LOSS optimal set.

## Validity axes

### `syntacticallyRepresentable`
Object shape and primitive field ranges can be serialized.

### `invariantValid`
Conservation and phase/state invariants hold.

### `ruleCanonical`
State corresponds to a canonical turn-boundary or terminal representation accepted by the Study contract; e.g. impossible pre-terminal no-move states are not silently treated as ordinary positions.

### `historicallyReachable`
A legal witness path from the standard initial state exists and is recorded or inherited by legal closure.

### `studyDomainEligible`
State belongs to the prospectively frozen exact domain.

## Forbidden equivalences

```text
engine evaluation != game-theoretic value
search score != game-theoretic value
empirical continuation win rate != deterministic WIN/LOSS
MAX_RELAY cutoff != normative LOSS
max-ply draw label != formal draw
seatCanonicalKey != primary raw state identity
bounded exact oracle != full-Bao solution
```
