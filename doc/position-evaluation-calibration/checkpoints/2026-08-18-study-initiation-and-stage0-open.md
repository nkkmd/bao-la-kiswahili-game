# Checkpoint — Study initiation and Stage 0 open

Date: 2026-08-18
Study: Position Evaluation / Win-Rate Calibration Study 1

## Repository

```text
baseline main = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
branch = research/position-evaluation-winrate-calibration
```

The user-reported previous main SHA was one merge behind. The intervening merge changed only `doc/FUTURE_RESEARCH_AGENDA.md` to place this calibration study before bad-move/misconception research.

## Scientific boundary checkpoint

Historical formal decisions are imported read-only and remain unchanged.

The present study is independent and prospective. It does not rescue Position Complexity Study 1, does not reassess Tactical Motif C03, and does not reinterpret TMHV `N=0`.

## Technical checkpoint

Evaluation/search semantics have been audited sufficiently to open Stage 0.

Working measurement contract:

```text
primary = static default bao evaluation, selected-actor perspective
key secondary = exact D2 search bestScore under validated diagnostic semantics
outcome = frozen deterministic continuation result, actor-relative
```

Empirical probability is defined over the sampled state population, not as an intrinsic stochastic property of a fixed deterministic state.

## Firewalls

```text
historical seed audit closed = false
new study seeds frozen = false
scientific generation authorized = false
formal inference authorized = false
```

Next Stage 0 action is to close the seed/source/identity/continuation-policy audit and validate technical tooling before any scientific corpus generation.
