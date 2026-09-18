# CTGTS-STUDY1 — Decision Register

更新日: 2026-09-18

## CTGTS-D001 — Program authorization

Decision: **`G4-02-AUTHORIZED`**

post-prerequisite authorization reviewにより、新しいG4-02 Studyのprospective freezeを許可した。

## CTGTS-D002 — Study identity

Decision: **FROZEN**

```text
Study ID = CTGTS-STUDY1
baseline main = c5689d70cd017171e7738140ba9186a117f732f1
branch = research/g4-02-corridor-tree-graph-transfer
```

## CTGTS-D003 — Claims

Decision: **FROZEN / SEPARATE**

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / historical MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / historical NAMUA-GREATER
```

combined latent constructは作らない。

## CTGTS-D004 — Representation

Decision: **FROZEN**

```text
RAW-only
relative depth = 5
validated transforms = []
```

## CTGTS-D005 — Transfer domain

Decision: **FROZEN**

2 source policy × 2 root family = 4 cell。

seed mod 4でcellを一意に割り当て、同じsource trajectoryを複数cellへ使わない。

## CTGTS-D006 — Fresh seed block

Decision: **FROZEN / RESERVED-NOT-ACCESSED**

```text
42021001..42021768
count = 768
target = 24 pairs per cell
extension = forbidden
replacement = forbidden
```

## CTGTS-D007 — Freshness firewall

Decision: **FROZEN**

G3-04はseed / trajectory / opening-prefix / RAW-rootの4-way exact exclusion。

G4-01 compatibilityはG4-02限定amendmentに基づきseed / trajectory / RAW-root + no-outcome-reuse。Bloom positiveは保守的に除外する。

## CTGTS-D008 — Selection

Decision: **FROZEN / ENDPOINT-BLIND**

全source acquisition完了後、freshness・pair completeness・resource preflightだけで候補を分類し、selection hash昇順から24 pair/cellを選ぶ。

## CTGTS-D009 — Inference

Decision: **FROZEN**

- exact two-sided sign test
- C1 family alpha = 1/40
- C6 family alpha = 1/40
- Holm within 4 cells
- nonzero >=16/24

## CTGTS-D010 — Formal labels

Decision: **FROZEN**

```text
GENERALIZES-WITHIN-FROZEN-DOMAIN
COUNTEREXAMPLE-BOUNDARY-DETECTED
NOT-CONFIRMED
NON-ESTIMABLE
TECHNICAL-INVALID
```

C1/C6別に判定する。

## CTGTS-D011 — Stage structure

Decision: **FROZEN**

```text
CTGTS-S0-TECHNICAL-2026-09-18-v1
CTGTS-S1-FORMAL-SOURCE-2026-09-18-v1
CTGTS-S2-FORMAL-MEASUREMENT-2026-09-18-v1
```

Stage 1 / 2は別authorizationを必要とする。

## CTGTS-D012 — No-rescue

Decision: **FROZEN / ACTIVE**

fresh access後のseed追加・置換、cell変更、target変更、endpoint/threshold/alpha/resourceの観測後変更を禁止する。

## CTGTS-D013 — main integration

Decision: **NOT AUTHORIZED**

ユーザーの明示指示までmainへ統合しない。
