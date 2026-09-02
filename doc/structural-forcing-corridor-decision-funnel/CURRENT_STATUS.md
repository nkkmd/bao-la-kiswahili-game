# SFCDF-STUDY1 — Current Status

Updated: 2026-09-02

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Status = ACTIVE / STAGE0-PASS / STAGE1-PREAUTH-READY
Research branch = research/g3-04-structural-forcing-corridor-decision-funnel
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
program review = G3-04-AUTHORIZED
Stage 0 = SFCDF-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS via authorized v2 technical execution
Stage 1 = SFCDF-S1-DEVELOPMENT-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = SFCDF-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31410001..31410192 / NOT CONSUMED
Stage 2 seed = 31420001..31420288 / NOT CONSUMED
fresh G3-04 scientific evidence = NOT GENERATED / NOT READ
no-rescue boundary = NOT CROSSED
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
Stage 1 scientific workflow runs = 0
Stage 1 tooling smoke = PASS
Stage 1 source validation = PASS
next safe action = separate Stage 1 authorization review
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

Stage 0およびStage 1 tooling smokeは、production側ordinary objectとindependent側null-prototype objectのprototype-sensitive inequalityを保ったままcanonical content equalityをPASSさせた。

## Stage 0 provenance

v1 technical run `33616688284`はprereg JSON parse時にsynthetic fixture前でabortした。fresh seed accessは0。

syntax-only correction後のauthorized v2:

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

## Identity-only upstream firewall

Canonical G3-04 firewall:

```text
path = prereg/UPSTREAM_IDENTITY_FIREWALL.json
blob = 9bc9debfa8df428eece243ca2ce49baf5707b9bf
identity core = 0196f255aa152f343cb428ee048ab1570ccdf4661c5adba5a47f4356a974b086
LGTGMIV upstream identity records = 80
G3-03 source pairs / root identities = 12 / 24
scientific outcome fields retained = false
```

G3-04 Stage 1 selectorはこのmanifestだけを過去identity exclusion inputとして使用する。

## Stage 1 pre-authorization tooling

Control-plane smoke:

```text
run = 33621353261 / success
trigger-SHA workflow count = 1
scientific workflow count = 0
lease commit = 7a58189f8d5c776a7c249af0dc2a6b6e75d63212
artifact = 9843024068
artifact ZIP SHA-256 = 2a09ac45fef612dbc85c3bbeb5ea05fd57dfa04334d24b8840e22baaa4505d7b
mirror commit = 4ffe10db
fresh scientific evidence = false
Stage 1/2 seed access = false/false
protected depth-10 access = false
```

Source validation:

```text
run = 33621535038 / success
fresh scientific evidence = false
Stage 1/2 seed access = false/false
```

Frozen Stage 1 sources:

```text
production selector = 1cfbc58b2d670fa2bee0254c4ab8bb09c67d5a48
independent selector = 9d39e13c7dd4d0d2d9dcb99500dfb07c92e48215
runner = a4162e2dba356b2b4a2639ef320e87b7b567bb83
scientific workflow = a0454e894c0d5e1709d7c79a3140aed58be95eaf
```

## Current authorization boundary

Stage 1は**まだauthorizeされていない**。

次はread-only Stage 1 authorization reviewを行う。Stage 0 PASS、identity-only firewall、tooling smoke PASS、source validation PASS、scientific run count 0、seed unconsumed、no-rescue未cross、depth-10 sealed、source blob freezeを再確認した場合にのみ、exactly one scientific executionを別artifactでauthorizeできる。
