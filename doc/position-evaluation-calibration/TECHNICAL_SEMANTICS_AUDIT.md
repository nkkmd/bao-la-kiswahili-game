# Technical Semantics Audit — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Baseline: `8672ba4fafb896124df0c4728d41f7c3a6ed5056`

## Audited sources

- `public/engine.js`
- `public/ai.js`
- `public/ai-weights.js`
- `tools/benchmark.js`
- `test/ai.test.js`
- `tools/experiments/lib/position-complexity-search-diagnostic.js`
- prior phase-transition / position-typology / position-complexity research records

## 1. Static evaluation perspective

`AI.evaluate(state, player)` is exported and evaluates from the supplied `player` perspective.

For nonterminal states the default `bao` evaluator is:

```text
legacyEvaluate(state, player)
+ weighted player-relative feature differences
```

Feature differences are own minus opponent. The sign therefore has a clear actor-relative meaning only after fixing `player`.

Study normalization:

```text
actor = state.player at selected root
evaluation = AI.evaluate(state, actor)
outcomeWin = 1 iff final winner == actor
```

## 2. Terminal semantics and scale

Static terminal evaluation uses:

```text
WIN = 1,000,000
actor win  -> +1,000,000
actor loss -> -1,000,000
```

There is no built-in probability transform, clipping or logistic mapping for ordinary evaluation scores. A score such as `+100` has no predefined win-probability meaning.

Enhanced search uses mate-distance-adjusted terminal scores of the form `WIN - ply` / `-WIN + ply`; therefore search values and static values are distinct constructs even when they share the same ordinary leaf evaluator.

## 3. Default bao weights

`public/ai-weights.js` defines phase-specific weights. Namua and Mtaji weights differ for board/front structure, mobility, capture structure, reusable pits, front safety, house value, reserve efficiency, transition shape and tempo.

The evaluator also contains a legacy base term using board-seed difference, front occupancy, front-seed difference and house ownership.

`bao-v2` is a distinct experimental profile with category-dependent adjustments and is not silently interchangeable with `bao`.

## 4. Phase semantics

The authoritative engine state contains one global `state.phase`.

Initial phase is `namua`. `finishTurn` changes to `mtaji` only when both reserves are zero:

```text
state.reserve[0] === 0 && state.reserve[1] === 0
```

The calibration study therefore uses authoritative `state.phase`; it does not invent a separate actor-specific phase label.

## 5. Forced capture semantics

The engine enforces capture priority.

- In Namua, if legal captures exist, non-captures are not legal.
- In Mtaji, if a capture is available among candidate sowing moves, legal moves are capture moves only.

`E.moveVariants` additionally expands distinct Namua nyumba stop/use variants when they lead to different resulting states.

Forced-capture state must therefore be measured from authoritative legal moves, not inferred from a heuristic.

## 6. Search return value

`AI.analyzeMove(..., "hard", ...)` performs iterative search and reports `stats.rootScore` for the last completed depth. Enhanced search uses alpha-beta, transposition support and optional capture quiescence. Default wall-clock limits can cause timeout, so raw UI/runtime `rootScore` is not automatically an exact fixed-depth instrument.

For research-grade fixed-depth measurement, the already validated Position Complexity diagnostic is preferable:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

It evaluates every legal root variant independently with a full window, deterministic move-key tie handling, mate-distance terminal scores and frozen quiescence semantics.

## 7. Randomness / tie-breaking

`AI.chooseMove` accepts an RNG callback.

- `easy` uses RNG over legal moves.
- `normal` uses RNG over the top three immediate-score moves.
- MCTS uses RNG for expansion/playout and is seedable through the callback.
- hard/expert minimax/alpha-beta paths do not use the RNG for ordinary move choice.

Therefore a fixed hard/phase2/fixed-depth/infinite-time continuation is deterministic for a fixed rule state and source version. Repeating the same state under the same deterministic policy does not create independent Bernoulli replicates.

## 8. Outcome / draw semantics

The engine records a winner for rule termination (`front-empty`, `no-move`, or relay-limit conditions). It has no intrinsic draw state.

Benchmark/research drivers may stop at a fixed maximum turn/ply and label unresolved games as draws. Such cases are administrative truncations, not game-theoretic draws.

The calibration protocol must freeze an explicit administrative-truncation rule and estimability gate before scientific generation.

## 9. Opening/history dependence

Standard hard search does not use an opening-history variable in its value function. Optional search history heuristics are internal move-ordering aids and must be frozen off/on explicitly. Historical trajectory identity remains necessary for dependence control even when rule-state continuation is deterministic.

## 10. Construct conclusion

The technically clean initial construct is:

```text
primary = static bao evaluation from current actor perspective
secondary = exact D2 search bestScore under validated diagnostic semantics
outcome = realized terminal win/loss under one frozen deterministic continuation policy
estimand = population-level P(win | score, phase, frozen sampling/policy)
```

This is not a theoretical Bao winning probability and not human advantage perception.
