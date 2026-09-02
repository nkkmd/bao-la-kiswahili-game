# SFCDF-STUDY1 — Reproducibility Index

Updated: 2026-09-02

## Baseline

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
research branch = research/g3-04-structural-forcing-corridor-decision-funnel
Study ID = SFCDF-STUDY1
```

## Canonical preregistration

- `prereg/STUDY_1_SPEC.json`
- `STUDY_1_PROTOCOL.md`

## Rule / upstream source bindings

```text
public/engine.js
blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c

tools/experiments/lib/lgtgmiv-stage1-production.js
blob = a4664f01535d6abbf6f83821befbb2fafd55cde6

tools/experiments/lib/lgtgmiv-stage1-independent.js
blob = 0c7239ac7acf146e9aee63dae66194681b8631d6
```

## G3-04 source bindings

```text
tools/experiments/lib/sfcdf-production.js
blob = b6fca5d533ff4fdf906e64509185b480c6dc5818

tools/experiments/lib/sfcdf-independent.js
blob = 3bbc16d41c56f2eb00d7169ace2359f0fa9b9b53

tools/experiments/run-sfcdf-stage0-technical.js
blob = d36b5a28ee55321faaa177a2a9e2c03a5f1724fd
```

## Scientific representation

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transforms = []
relative horizon = 5
```

## Canonical equality

G3-04 cross-implementation scientific equality:

```text
canonical sorted-key JSON scientific content
→ UTF-8 bytes
→ SHA-256
→ exact digest equality
```

JavaScript object prototypeはscientific identityへ含めない。prototype-sensitive deep object equalityはformal gateに使用しない。

## Frozen fresh namespaces

```text
Stage 1 = 31410001..31410192 / NOT CONSUMED
Stage 2 = 31420001..31420288 / NOT CONSUMED
```

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

## Stage 0

Stage ID:

`SFCDF-S0-TECHNICAL-2026-09-02-v1`

Current state: **NOT YET AUTHORIZED / NOT EXECUTED**

Expected runner:

`tools/experiments/run-sfcdf-stage0-technical.js`

Stage 0 must not access Stage 1/2 seed blocks.

## Stage 1 / Stage 2

Stage 1 and Stage 2 scientific runner/workflow hashes are intentionally not yet frozen. They must be implemented, non-scientifically smoked and separately frozen before Stage 1 authorization. Their implementation must not change the already frozen scientific endpoints, population, seed blocks or formal gates.
