# SFCDF-STUDY1 — Current Status

更新日: 2026-09-02

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Study status = CLOSED / FORMAL-COMPLETE
Research branch = research/g3-04-structural-forcing-corridor-decision-funnel
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
program review = G3-04-AUTHORIZED
Stage 0 = SFCDF-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
Stage 1 = SFCDF-S1-DEVELOPMENT-2026-09-02-v1 / STAGE1-PASS
Stage 2 = SFCDF-S2-FORMAL-2026-09-02-v1 / STAGE2-PASS
Stage 1 seed = 31410001..31410192 / CONSUMED
Stage 2 seed = 31420001..31420288 / CONSUMED
fresh G3-04 scientific evidence = GENERATED / READ
no-rescue boundary = CROSSED / ACTIVE
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Formal candidate decisions

| Candidate | Construct | Frozen direction | Stage 2 result |
|---|---|---|---|
| `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` | corridor | `MTAJI-GREATER` | **CONFIRMED** |
| `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` | funnel/contextual compression | `NAMUA-GREATER` | **CONFIRMED** |

C2–C5はStage 1 promotion gateを満たさなかったため、Stage 2では検定していない。

### C1

```text
comparable = 18/18
Mtaji > Namua = 18
Namua > Mtaji = 0
ties = 0
exact two-sided sign-test p = 1/131072
Holm threshold = 1/40
Holm = PASS
formal label = CONFIRMED
```

### C6

```text
comparable = 18/18
Mtaji > Namua = 0
Namua > Mtaji = 18
ties = 0
exact two-sided sign-test p = 1/131072
Holm threshold = 1/20
Holm = PASS
formal label = CONFIRMED
```

## Stage 2 execution integrity

```text
workflow run = 33624399706
execution trigger commit = 40fd586e3bc3bf77fa2fc5303cc11fcf99655946
lease commit = 325366baedcd437f45991e2941bc38fc2e04bd1f
result mirror commit = e850dca8236745cb611cf2e0f60ed9113b6ed4a8
authorized scientific executions = 1
actual scientific executions = 1
artifact ID = 9844368476
artifact ZIP SHA-256 = c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f
scientific-result blob = 099c45134e2816aac7bafdd5aab5ade03903c64a
execution-summary blob = d2e4db04a5f2b35cc3da573fd9ab82ec6131f03a
```

Production / independent Stage scientific core:

```text
production = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
independent = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
```

完全一致している。

## Scientific boundary

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
principal families = LGTGMIV F5,F2,F3,F4
auxiliary family = LGTGMIV F1
```

C1–C3はcorridor descriptors、C4–C6はfunnel descriptorsとしてprospectively分離されており、combined corridor/funnel binary classは定義していない。

今回CONFIRMEDされたC1/C6から、次を主張してはならない。

- game-theoretic forcing / tactical inevitability
- optimal moveの一意性
- best-move clarity
- search stability / search ease
- strategic simplicity
- human difficulty / ease
- position value / win probability
- phaseの因果効果
- relative depth 5を超える一般化

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

G3-04のclosureによってこのholdoutの用途・封印状態は変更しない。

## Repository lifecycle

Scientific executionは完了した。次の作業はclosure文書の整合性確認、Research Generation 3 current-facing documentsへの反映、通常PRによる`main`統合である。

`CLOSED / FORMAL-COMPLETE`はrepository lifecycle statusであり、新しい科学的omnibus labelではない。formal inferential labelsはpreregistered candidate-level `CONFIRMED` / `NOT-CONFIRMED`のみを用いる。
