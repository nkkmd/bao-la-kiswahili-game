# PEOCR-STUDY1 — Stage 2 Execution Sharding Freeze

Date: 2026-08-27
Status: **EXECUTION PLAN FROZEN / STAGE 2 SCIENTIFIC GENERATION NOT AUTHORIZED**

## Purpose

The frozen Stage 2 scientific population contains 8,192 games and is computationally larger than a single reliable GitHub Actions job. This checkpoint fixes execution sharding before any Stage 2 scientific seed is generated.

This is execution infrastructure only. It does not alter the Stage 2 population, seeds, evaluator, continuation policy, state selection, RAW identity, identity firewall, endpoints, estimability gates, bootstrap, criteria, or interpretation boundary.

## Fixed scientific population

```text
Stage ID = PEOCR-S2-FORMAL-2026-08-26-v1
games = 8192
seeds = 24020001..24028192
```

## Fixed execution partition

The population is partitioned by global game index into eight contiguous non-overlapping shards:

```text
shard 0: indices 0..1023    seeds 24020001..24021024
shard 1: indices 1024..2047 seeds 24021025..24022048
shard 2: indices 2048..3071 seeds 24022049..24023072
shard 3: indices 3072..4095 seeds 24023073..24024096
shard 4: indices 4096..5119 seeds 24024097..24025120
shard 5: indices 5120..6143 seeds 24025121..24026144
shard 6: indices 6144..7167 seeds 24026145..24027168
shard 7: indices 7168..8191 seeds 24027169..24028192
```

Each shard contains exactly 1,024 prospectively fixed games. The union is exactly the preregistered 8,192-game population.

## Verification and merge rule

For every shard:

1. generate only its fixed global indices under the exact authorized scientific source hashes;
2. independently replay every generated game under the same frozen engine/evaluator/search contract;
3. require zero replay mismatches;
4. archive the shard with its global-index manifest and verification record.

Only after all eight fixed shards exist and pass independent replay verification may they be merged by global index. The merge must contain exactly one game for every index `0..8191` and no extra game.

Outcome-blind cross-stage firewall, state selection and measurement occur only after the complete merged population is present. Formal evaluation occurs only after independent selection/measurement verification and all frozen identity/estimability gates are evaluated.

## Retry boundary

Infrastructure retry is allowed only for an incomplete/failed execution of the exact same fixed shard and exact same authorized source hashes/global indices. A retry may not:

- add a seed;
- replace a game because of its state, trajectory, outcome, runtime behavior, or firewall status;
- move a game between shards;
- change the shard size or partition after any Stage 2 outcome is available;
- retain two alternative realizations of the same global index and choose between them based on outcome.

Because generation is deterministic, an exact-instrument retry must reproduce the same game identity and is verified independently.

## Authorization boundary

This checkpoint does **not** authorize Stage 2 generation. Scientific seeds `24020001..24028192` remain blocked until:

- Stage 2 technical smoke passes;
- independent smoke verification passes;
- Stage 1 mapping/reference universe dependencies are hash-verified;
- the complete Stage 2 scientific source path is hash-frozen;
- an explicit Stage 2 authorization commit is created.
