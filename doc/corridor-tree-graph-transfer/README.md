# CTGTS-STUDY1 — G4-02 corridor / tree-graph transfer

更新日: 2026-09-18  
Program position: `Research Generation 4 / G4-02`  
状態: **`AUTHORIZED / PROSPECTIVE CONTRACT FROZEN / SCIENTIFIC SEED NOT ACCESSED`**

## 研究の目的

G3-04 `SFCDF-STUDY1`で限定的に確認された2つのformal claimを、freshなphase anchor、root family、source policyへ移したときに、同方向で再現する範囲と反例境界をclaim別に検証する。

対象は次の2件だけである。

- C1 `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
  - historical direction: `MTAJI-GREATER`
- C6 `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
  - historical direction: `NAMUA-GREATER`

G3-04のformal decisionを変更・repair・rerunしない。

## frozen transfer domain

4つのtransfer cellを結果を見る前に固定した。

| Cell | Source policy | Root family |
| --- | --- | --- |
| `CTGTS-CELL-P1-RF1` | uniform legal | ply 20 Namua / first Mtaji >=40 |
| `CTGTS-CELL-P1-RF2` | uniform legal | ply 28 Namua / exact ply 52 Mtaji |
| `CTGTS-CELL-P2-RF1` | min immediate capture | ply 20 Namua / first Mtaji >=40 |
| `CTGTS-CELL-P2-RF2` | min immediate capture | ply 28 Namua / exact ply 52 Mtaji |

各source trajectoryはseed mod 4により**1 cellだけ**へ割り当てる。同じtrajectoryを複数cellへ使わない。

## formal population

```text
fresh seed block = 42021001..42021768
reserved count = 768
target = 24 paired trajectories per cell
total formal population = 96 paired trajectories / 192 roots
scientific seed access at freeze = 0
```

全768 seedをsource acquisitionで一度だけ扱い、endpointを見ずにfreshness・pair completeness・resource preflightを通過したcandidateをselection hash順に24 pair/cell選ぶ。

## freshness firewall

G3-04 scientific evidenceには従来どおり

- seed
- full source trajectory
- opening prefix
- RAW root

の4-way exact exclusionを適用する。

G4-01 compatibility evidenceについては、frozen artifactにopening-prefix identityが存在しないため、G4-02限定methodology amendmentにより

- seed
- full source trajectory
- RAW root
- scientific outcome reuse禁止

をmandatoryとする。trajectory/rootはfalse negativeを許さないBloom exclusion filterで照合し、positiveはfalse positiveであっても保守的に除外する。

詳細:

- [freshness methodology review](../research-program-decisions/2026-09-18-g4-02-freshness-methodology-prerequisite-review.md)
- [freshness firewall manifest](../research-generation-4/g4-02-prerequisites/FRESHNESS_FIREWALL_MANIFEST.json)

## Stage

```text
Stage 0 = CTGTS-S0-TECHNICAL-2026-09-18-v1
Stage 1 = CTGTS-S1-FORMAL-SOURCE-2026-09-18-v1
Stage 2 = CTGTS-S2-FORMAL-MEASUREMENT-2026-09-18-v1
```

Stage 0はtechnical fixtureのみでfresh scientific seedを読まない。

Stage 1はfresh source acquisitionとendpoint-blindなformal population selectionを行う。C1/C6のscientific endpointは計算しない。

Stage 2はsealed Stage 1 populationだけを入力にし、fresh seedを再読せずC1/C6をproduction / independent実装で測定する。

## formal inference

各claimを独立に扱う。

- paired difference = Mtaji - Namua
- 24/24 coverageを要求
- nonzero gate = nonzero >= 16/24
- exact two-sided sign test
- total FWER = 0.05
- C1 family alpha = 0.025
- C6 family alpha = 0.025
- 各claim内4 cellをHolm-Bonferroni

claim別formal label:

- `GENERALIZES-WITHIN-FROZEN-DOMAIN`
- `COUNTEREXAMPLE-BOUNDARY-DETECTED`
- `NOT-CONFIRMED`
- `NON-ESTIMABLE`
- `TECHNICAL-INVALID`

C1とC6を一つのomnibus labelへ統合しない。

## 重要な境界

本Studyからwhole-Bao law、game-theoretic forcing、best-move clarity、search ease、人間の難しさ、公開AI改善の妥当性を直接主張しない。

authoritative scientific state identityはRAWであり、validated transform setは`[]`である。

## 最初に読む文書

1. [STUDY_1_PROTOCOL.md](STUDY_1_PROTOCOL.md)
2. [prereg/STUDY_1_SPEC.json](prereg/STUDY_1_SPEC.json)
3. [CURRENT_STATUS.md](CURRENT_STATUS.md)
4. [DECISION_REGISTER.md](DECISION_REGISTER.md)
