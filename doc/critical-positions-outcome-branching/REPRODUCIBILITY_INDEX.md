# REPRODUCIBILITY_INDEX — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23  
Status: **INITIATION / STAGE 0 DESIGN ONLY**

## Repository baseline

```text
repository = nkkmd/bao-la-kiswahili-game
verified main baseline = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
baseline tree = 766eb3dea312669feec12f22ebe405b9d3bba78a
branch = research/critical-positions-outcome-branching
```

## Historical technical components to reuse only as instrumentation

```text
public/engine.js
public/ai.js
public/ai-weights.js
tools/benchmark.js
tools/experiments/lib/position-typology-features.js
tools/experiments/lib/position-complexity-search-diagnostic.js
```

Exact-root diagnostic semantics:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

Reusing these files does not reopen the studies that originally validated them.

## Identity model

Required source/root provenance:

```text
historicalStateHash / equivalent stored state identity
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
generationStratum
rootPly
rootActor
```

Exact move identity:

```text
AI.moveKey(E.moveVariants(root)[i])
```

Cross-stage mandatory firewall:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

## Seed model

```text
Stage 0 scientific source seeds = none
Stage 1 reserved source seeds = 22600001..22603072
Stage 2 reserved source seeds = 22700001..22706144
```

Continuation replicate RNG must use a documented stage-specific derivation from root identity + replicate index. Those derived RNG values are nested measurement seeds, not independent source-game seeds.

## Future source freeze

Before each scientific generation stage, record:

- exact Git commit;
- clean/dirty source state;
- exact source-file SHA-256 mapping;
- spec SHA-256;
- authorization SHA-256;
- Node/runtime metadata;
- generator conditions;
- seed range;
- artifact path.

## Future compact repository results

Expected structure after gates are reached:

```text
preregistration/
results/
checkpoints/
```

Large generated trajectories and continuation-level measurements remain under:

```text
artifacts/local/critical-positions-outcome-branching/
```

## Current reproducibility boundary

No scientific artifact, generation hash, selection hash, measurement hash or formal result exists yet. Any such field must remain absent/null until its corresponding execution actually occurs.
