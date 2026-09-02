# SFCDF-STUDY1 — Current Status

Updated: 2026-09-02

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Status = ACTIVE / STAGE0-PASS / STAGE1-NOT-AUTHORIZED
Research branch = research/g3-04-structural-forcing-corridor-decision-funnel
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
program review = G3-04-AUTHORIZED
Stage 0 = SFCDF-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS via authorized v2 technical execution
Stage 0 v1 run = PRE-FIXTURE-TECHNICAL-ABORT
Stage 1 = SFCDF-S1-DEVELOPMENT-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = SFCDF-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31410001..31410192 / NOT CONSUMED
Stage 2 seed = 31420001..31420288 / NOT CONSUMED
fresh G3-04 scientific evidence = NOT GENERATED / NOT READ
no-rescue boundary = NOT CROSSED
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

Mandatory scientific equalityはcanonical sorted-key JSON scientific contentのUTF-8 bytes / SHA-256 exact equalityである。

JavaScript object prototypeの違いはscientific identityではない。prototype-sensitive `util.isDeepStrictEqual`はmandatory gateとして使用しない。

Stage 0 synthetic fixtureは、productionのordinary objectとindependentのnull-prototype endpoint mapについて`util.isDeepStrictEqual=false`を意図的に成立させたうえで、canonical scientific content exact agreementをPASSさせた。

## Stage 0 provenance

v1 technical run:

```text
run = 33616688284
disposition = PRE-FIXTURE-TECHNICAL-ABORT
cause = prereg JSON syntax defect
synthetic fixture execution = false
fresh scientific seed access = false
```

syntax-only correction後のv2 technical run:

```text
run = 33620251552
conclusion = success
artifact = 9842597981
artifact ZIP SHA-256 = 028ad7e5034cc4954003b081ca6f0c7ac2bc44a97db0f397fe78ea65f21b7021
deterministic technical core = 14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295
Stage disposition = STAGE0-PASS
fresh scientific seed access = false
protected depth-10 access = false
```

## Next safe action

Stage 1はまだauthorizeされていない。

次は、Stage 1/2 seedを一切読まないnon-scientific control-plane smokeで、実際に予定するscientific trigger、exactly-one execution lease、remote-advancement fail-close、canonical result durability、canonical-content equality pathを検証する。

そのsmokeがPASSした後にのみ、separate Stage 1 authorization reviewを行う。Stage 1 fresh evidence generation/readはそのauthorization前は禁止する。
