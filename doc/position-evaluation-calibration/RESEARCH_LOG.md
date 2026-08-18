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
- enhanced search value differs from static evaluation and includes fixed-depth lookahead, mate-distance scoring and capture quiescence;
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

### Authorization state

```text
Stage 0 = OPEN
Stage 1 generation = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

## 2026-08-18 — Stage 0 design freeze

### Seed firewall closure

Canonical prior-study seed blocks, frozen configs, first-player generator formulas, benchmark defaults and symbolic joseki/MCTS seeds were audited. The declared new scientific corpus namespace was checked against the tracked repository index.

Frozen new allocation:

```text
Stage 1 = 22200001..22201024 (1024 games)
Stage 2 reserved = 22300001..22302048 (2048 games)
```

Searches for the new numeric prefixes/Stage 1 start found no prior tracked references on baseline main. Stage 2 reservation is not generation authorization.

### Stage 1 population freeze

```text
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
trajectory unit = unique historicalTrajectoryHash
selected states per trajectory <= 1
phase assignment = frozen SHA-256 parity
within-phase state = frozen minimum SHA-256 rank
unavailable phase = no replacement
duplicate selected ruleStateKey = collapse, no replacement
```

Administrative max-ply truncation is recorded separately from draw and receives no binary outcome. Selection is outcome-blind. Truncation >1% fails Stage 1 readiness without extension.

### Model-development freeze

Stage 1 candidate families are exactly:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

Five deterministic trajectory-level folds are used. Primary selection metric is out-of-fold Brier score. Isotonic must improve Brier by at least 0.002 to displace logistic; otherwise logistic is preferred. Both-candidate technical failure closes Stage 1 inconclusive without Stage 2.

### Tooling materialized

Prepared:

- frozen Stage 1 machine-readable spec;
- spec validator;
- shared source-hash/provenance and generation library;
- guarded Stage 1 production runner;
- replay/measurement verifier;
- non-scientific Stage 0 smoke;
- Stage 0 contract test;
- Stage 0/Stage 1 protocols and runbook.

The production runner requires an authorization JSON that is intentionally absent.

### Current authorization state

```text
Stage 0 design = FROZEN
local Stage 0 smoke = PENDING
Stage 1 generation = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```
