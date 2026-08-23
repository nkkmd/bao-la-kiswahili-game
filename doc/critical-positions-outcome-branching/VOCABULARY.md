# VOCABULARY — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23

## `root actor`

`state.player` at the selected root. All continuation outcomes and root-move comparisons are encoded from this player's perspective unless explicitly labeled otherwise.

## `exact legal moveVariant`

An element of `E.moveVariants(state)`, identified by `AI.moveKey`. Distinct Namua house-choice variants are not silently collapsed.

## `root move intervention`

Applying one exact legal root move by design and holding the post-root continuation policy fixed across alternative root moves.

## `fixed-policy continuation outcome`

The terminal or administratively unfinished result generated after a root intervention under a prospectively frozen post-root policy, RNG semantics and continuation cap.

## `empirical continuation win rate`

The observed root-actor win proportion for one root move under the frozen continuation replicate design. It is conditional on policy, source, state population and completion rules.

It is **not** game-theoretic winning probability.

## `policy-conditioned outcome divergence`

Difference or dispersion among move-specific empirical continuation outcomes within one root.

Primary candidate:

```text
D_range = max move-specific empirical win rate
          - min move-specific empirical win rate
```

## `decision-critical position`

A machine-operational root state whose legal move choice produces a materially large policy-conditioned continuation divergence under the frozen Study definition.

This does not imply a human turning point or theoretical win/loss boundary.

## `search-value separation`

Difference among exact legal move values produced by one fixed search/evaluator configuration. It is a machine-search construct and remains separate from empirical continuation divergence.

## `move-ranking instability`

Change in exact TopSet/ranking across prospectively fixed search conditions, e.g. D2→D3. Tie-aware TopSet overlap is preferred over arbitrary canonical tie-break changes.

## `structural branch divergence`

Between-root-move difference in board/legal/response structure after intervention, such as legal/capture move counts, forcing status, front structure, reusable pits, reserve/nyumba state and response envelope.

## `response envelope`

The set and structural summary of all immediate opponent exact legal replies after a root intervention. It is not a principal variation.

## `game-theoretic criticality`

A proved winning/losing boundary or equivalent exact value change under full solution/proof. Not inferred by ordinary engine continuation experiments.

## `human-perceived criticality`

Human/expert judgment that a position is a key turning point. Not inferred without new human evidence.

## `administrative unfinished`

A continuation that reaches the prospectively frozen maximum continuation length without an engine terminal winner. It is not a draw, 0.5 outcome or loss unless a future preregistration explicitly defines a different construct before data.

## Forbidden equivalences

```text
engine evaluation difference != win-probability difference
search best move != game-theoretic best move
empirical continuation win rate != true win probability
high D_range != human importance
critical position != blunder
machine-confirmed tactical motif != automatically critical position
N=0 human evidence != negative human evidence
```
