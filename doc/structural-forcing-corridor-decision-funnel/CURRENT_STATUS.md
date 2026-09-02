# SFCDF-STUDY1 — Current Status

Updated: 2026-09-02

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Status = AUTHORIZED / PROTOCOL-FROZEN / PRE-FRESH
Research branch = research/g3-04-structural-forcing-corridor-decision-funnel
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
program review = G3-04-AUTHORIZED
Stage 0 = SFCDF-S0-TECHNICAL-2026-09-02-v1 / NOT-YET-AUTHORIZED
Stage 1 = SFCDF-S1-DEVELOPMENT-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = SFCDF-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31410001..31410192 / NOT CONSUMED
Stage 2 seed = 31420001..31420288 / NOT CONSUMED
fresh G3-04 scientific evidence = NOT GENERATED / NOT READ
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen scientific boundary

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
principal families = LGTGMIV F5,F2,F3,F4
auxiliary family = LGTGMIV F1
```

Candidate endpoints:

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
2. `SFCDF-C2-WIDTH-COMPRESSION-FRACTION`
3. `SFCDF-C3-LONGEST-UNIT-WIDTH-RUN`
4. `SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION`
5. `SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION`
6. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

C1–C3はcorridor、C4–C6はfunnel descriptorであり、combined corridor/funnel classは定義しない。

## Cross-implementation equality

Mandatory scientific equalityはcanonical JSON scientific contentのSHA-256 exact equalityである。

JavaScript object prototypeの違いはscientific identityではない。prototype-sensitive `util.isDeepStrictEqual`はmandatory gateとして使用しない。

## Next safe action

Stage 0 technical-only authorizationを別artifactとして記録し、synthetic fixtureだけを実行する。

Stage 0でfresh seed accessは禁止する。Stage 0 PASS後もStage 1へ自動進行せず、non-scientific execution-control smokeと別Stage 1 authorizationを必要とする。
