# EXPERIMENT_INDEX — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23

## Study state

```text
Stage 0 design = ACTIVE
Stage 0 technical execution = NOT STARTED
Stage 1 exploratory = LOCKED
Stage 2 formal = LOCKED
```

## Stage 0 planned technical experiments

### CPOB-S0-T01 — exact root intervention audit

Verify exhaustive `E.moveVariants`, exact `AI.moveKey`, replay and root-actor perspective on deterministic fixtures.

Scientific inference: **NOT AUTHORIZED**

### CPOB-S0-T02 — continuation RNG determinism audit

For each policy candidate, verify identical `(fixture, rootMove, replicateSeed)` produces exact move sequence/outcome replay and distinct replicate seeds can alter stochastic decisions where policy has a choice.

Scientific inference: **NOT AUTHORIZED**

### CPOB-S0-T03 — policy semantics audit

Audit candidate policies:

- existing seeded `normal / bao`;
- proposed seeded D2-ranked top-3 wrapper;
- seeded uniform exact-legal comparator.

Selection must be technical/outcome-blind.

### CPOB-S0-T04 — terminal / administrative unfinished audit

Verify terminal winner/reason semantics, max continuation stop, and no draw recoding.

### CPOB-S0-T05 — paired replicate audit

Verify common replicate seed derivation across every legal root move and independence of RNG instances between interventions.

### CPOB-S0-T06 — structural feature / response envelope audit

Verify actor-relative immediate post-move structural features and exhaustive opponent response envelope without fabricated PV.

### CPOB-S0-T07 — exact search diagnostic audit

Cross-check D2/D3 exact-root candidate tables under the previously validated search diagnostic without re-testing Position Complexity Study 1.

### CPOB-S0-T08 — runtime / artifact-size benchmark

Benchmark only frozen technical fixtures. No scientific candidate prevalence or outcome divergence is reported from this benchmark.

### CPOB-S0-T09 — independent verifier audit

Primary measurement implementation and verifier must independently replay root interventions and continuations and recompute primary quantities.

## Stage 1 planned execution

```text
stageId = TBD after Stage 0 close
seed reservation = 22600001..22603072
scientific generation = NOT AUTHORIZED
```

Planned order:

```text
generate → verify → select → measure → verify measurement → discover
```

## Stage 2 planned execution

```text
stageId = TBD after Stage 1 candidate freeze
seed reservation = 22700001..22706144
scientific generation = NOT AUTHORIZED
```

Planned order:

```text
generate → verify → candidate-specific select → measure → independent measurement verify → evaluate
```
