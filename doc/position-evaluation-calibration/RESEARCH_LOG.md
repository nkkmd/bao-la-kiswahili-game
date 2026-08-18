# Research Log — Position Evaluation / Win-Rate Calibration Study 1

## 2026-08-18 — Study initiation

### Repository restoration

- user-reported previous main: `1a5a591d526b2383ca3540827eff6f8f39c14861`
- current GitHub main: `8672ba4fafb896124df0c4728d41f7c3a6ed5056`
- compare result: current is one merge ahead;
- changed file: `doc/FUTURE_RESEARCH_AGENDA.md` only;
- change meaning: Position Evaluation / Win-Rate Calibration promoted ahead of bad-move/misconception research as a measurement foundation;
- no existing formal decision changed.

### Scientific state restoration

Reviewed central index/agenda and canonical records for Position Complexity, Tactical Motifs, TMHV, Phase Transition, Position Typology and first-player effects.

Immutable boundaries restored:

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
TMHV human axis = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
```

### Technical audit

Audited engine/evaluator/search semantics.

Key findings:

- static `AI.evaluate` is exported and player-relative;
- static terminal score is ±1,000,000;
- ordinary evaluation is not a probability and is not clipped to a probability-like range;
- bao weights are phase-specific;
- engine phase is global and transitions to Mtaji after both reserves reach zero;
- captures are compulsory when available under the legal-move generator;
- enhanced search value differs from static evaluation and includes fixed-depth lookahead, mate-distance scoring and optional capture quiescence;
- hard minimax/alpha-beta continuation is deterministic for fixed state/configuration;
- easy/normal/MCTS consume RNG;
- benchmark `draw` can mean unresolved administrative max-turn truncation, not an intrinsic engine draw.

### Initial design decision

Working primary measurement:

```text
AI.evaluate(state, state.player), profile=bao
```

Key secondary:

```text
exact D2 bestScore
exact-full-window-root-candidates/phase2-value-semantics/v1
```

Primary empirical estimand is population-level continuation outcome probability under a frozen sampled-state distribution and deterministic continuation policy.

### Seed audit

Known canonical blocks were recorded in `SEED_AUDIT.md`. The audit is intentionally not closed because older phase-transition, first-player, benchmark and joseki artifacts also use seeds. New Study 1 seed blocks remain unassigned until a repository-wide machine inventory is completed.

### Authorization state

```text
Stage 0 = OPEN
Stage 1 generation = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```
