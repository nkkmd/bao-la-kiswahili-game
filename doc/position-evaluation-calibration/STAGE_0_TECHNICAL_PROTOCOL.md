# Stage 0 Technical Protocol — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **FROZEN FOR TECHNICAL VALIDATION / NO SCIENTIFIC GENERATION**

## Purpose

Stage 0 validates that the proposed calibration construct can be generated, selected, measured, and independently replayed without changing any closed-study decision.

## Frozen construct

```text
primary score = AI.evaluate(state, state.player)
profile = bao
key secondary = exact D2 root bestScore
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
outcome = selected actor wins under frozen continuation policy
```

The score is not a probability, game-theoretic value, human advantage judgment, or causal exposure.

## Frozen Stage 1 population design

```text
games = 1024
seeds = 22200001..22201024
opening = first 8 plies seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity time limit
max ply = 160
```

Continuation after the opening is deterministic under the frozen hard/minimax configuration. No artificial within-state rollout replication is introduced.

## State sampling

1. generate all fixed games;
2. collapse exact duplicate `historicalTrajectoryHash` groups, retaining minimum seed then gameId;
3. assign each unique trajectory prospectively to Namua or Mtaji by frozen SHA-256 parity;
4. among nonterminal observations at ply >= 8 in the assigned phase, choose minimum frozen SHA-256 rank;
5. if assigned phase is absent, do not replace;
6. collapse exact duplicate selected `ruleStateKey`, retaining lowest historical trajectory hash then seed;
7. do not replace collapsed duplicates.

Maximum selected states per historical trajectory = 1.

## Outcome handling

A selected state inherits the terminal winner of its frozen continuation trajectory.

```text
actorWin = 1 if final winner == state.player
actorWin = 0 if final winner == 1-state.player
```

If no winner exists at max ply 160, the record is `administrativeTruncation=true`; this is not a draw and receives no binary outcome. Selection is performed without using truncation/outcome status. Stage 1 readiness fails without extension if selected-state truncation exceeds 1%.

## Technical smoke requirements

The Stage 0 smoke must establish:

- spec validator PASS;
- generator deterministic replay PASS;
- static evaluation actor/opponent antisymmetry on audited states;
- selected-state identity availability;
- finite static evaluation;
- finite exact D2 root bestScore;
- actor-relative outcome consistency;
- source SHA-256 manifest materialization;
- production authorization remains absent.

Smoke seeds are non-scientific fixtures and are not Stage 1 evidence.

## Authorization firewall

The Stage 1 spec does not authorize generation. After a successful local smoke, the returned artifact must be audited and a separate authorization JSON committed with exact spec SHA-256 and exact source SHA-256 mapping. Until that commit exists, the production runner must refuse Stage 1 generation.
