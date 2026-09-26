# LGTGECB-STUDY1 — 最終報告

更新日: 2026-09-26  
Agenda: `Research Generation 4 / G4-06`  
Study ID: `LGTGECB-STUDY1`  
Formal Stage: `LGTGECB-S1-FORMAL-2026-09-26-v1`  
正式状態: **`COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED`**

## 1. 結論

G4-06は、G4-05で完全解析された固定8 microdomainについて、relative depth 5のbounded RAW local game-tree geometryとexact game-theoretic consequenceをprospectiveに接続し、production / independentの二経路で同一結果を得た。

formal study-level decisionは次である。

```text
FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
```

これは「固定8 microdomainについて、事前登録した4 geometry scalar × 3 exact consequence = 12 relationを、固定規則どおり測定・分類できた」という意味である。positive associationやwhole-Bao generalizationを意味しない。

## 2. Canonical execution

```text
run = 36214800357 / attempt 1
execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
workflow conclusion = success
artifact ID = 10897225431
artifact SHA-256 = 1a087b4bccfb0c941e9895d2bf35cce41fcbee5f0194de1c43f2293ea593c688
production result SHA-256 = a8acb2e81c69616c29e4ccfcab7e5e20ca0b23294af7d99b8c6085bfc4cc2863
independent verification SHA-256 = eb2eb5987e47e8712a1bf542acaff6601c4a9be1002c8484df9c3c29b22ba79c
production core SHA-256 = 1d8736dcd0dcbb016833a8e21c27afa5ad616fa2ee9ef2fb5c36c7d7041ee26b
independent agreement = true
formal domains = 8 / 8
relations emitted = 12 / 12
G4-05 candidate rescan = 0
G4-10 depth-11 access = 0
```

## 3. 対象population

対象はG4-05 canonical Stage 2でformal completeとなった8 rootのみである。

```text
N = 8
WIN = 2
LOSS = 6
experimental unit = formal-domain root
```

state、edge、moveを独立標本として水増ししていない。candidate rescan、seed extension、domain replacement、`STATE-LIMIT` candidate rescueも行っていない。

各rootは固定 `(seed, ply, rootStateKey)` tupleから再物質化し、G4-05で保存されたstate-set、transition-set、solution digest、root value、DTF、optimal move keysと一致した場合だけgeometry測定へ進んだ。

## 4. 測定したgeometry

relative depth 5 / RAW-onlyで次の4 scalarを使用した。

1. `GEO-CORRIDOR`: unit-width occupancy fraction
2. `GEO-TREE-RAW`: cumulative tree / RAW inflation ratio
3. `GEO-TRANSPOSITION`: reconvergent-state occupancy fraction
4. `GEO-REPLY`: mean immediate reply width

exact consequenceは次の3種である。

1. `EXACT-VALUE`: root `WIN` / `LOSS`
2. `EXACT-DTF`: exact distance-to-finish
3. `EXACT-VPMC`: value-preserving root move count

DTF-optimal move setは補助integrity constructとしてexact solver `optimalMoveKeys`との完全一致を要求した。

## 5. root-level observations

| Domain | Value | DTF | VPMC | Corridor | Tree/RAW | Transposition | Reply width |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | LOSS | 2 | 2 | 0 | 1 | 0 | 5 |
| 2 | LOSS | 2 | 2 | 1/3 | 1 | 0 | 2 |
| 3 | LOSS | 4 | 2 | 1/9 | 1 | 0 | 3/2 |
| 4 | WIN | 3 | 2 | 0 | 1 | 0 | 2 |
| 5 | LOSS | 2 | 2 | 0 | 1 | 0 | 7/2 |
| 6 | WIN | 3 | 1 | 1/2 | 1 | 0 | 2 |
| 7 | LOSS | 2 | 2 | 1/3 | 1 | 0 | 2 |
| 8 | LOSS | 6 | 1 | 4/11 | 1 | 0 | 1 |

この固定populationでは `GEO-TREE-RAW = 1`、`GEO-TRANSPOSITION = 0` が全8 rootで同一だった。このため、この2 scalarについてexact consequenceとのordering relationを評価するためのgeometry variationが存在しない。

## 6. 12 relationのformal結果

| Relation | Classification | Informative pairs |
|---|---|---:|
| VALUE × CORRIDOR | `MIXED-ORDER` | 10 / 12 |
| VALUE × TREE-RAW | `NON-ESTIMABLE-NO-INFORMATIVE-CROSS-CLASS-PAIRS` | 0 / 12 |
| VALUE × TRANSPOSITION | `NON-ESTIMABLE-NO-INFORMATIVE-CROSS-CLASS-PAIRS` | 0 / 12 |
| VALUE × REPLY | `MIXED-ORDER` | 8 / 12 |
| DTF × CORRIDOR | `MIXED-ORDER` | 19 / 28 |
| DTF × TREE-RAW | `NON-ESTIMABLE-NO-GEOMETRY-VARIATION` | 0 / 28 |
| DTF × TRANSPOSITION | `NON-ESTIMABLE-NO-GEOMETRY-VARIATION` | 0 / 28 |
| DTF × REPLY | `MONOTONE-DECREASING-ORDER-CONSISTENT` | 17 / 28 |
| VPMC × CORRIDOR | `MONOTONE-DECREASING-ORDER-CONSISTENT` | 12 / 28 |
| VPMC × TREE-RAW | `NON-ESTIMABLE-NO-GEOMETRY-VARIATION` | 0 / 28 |
| VPMC × TRANSPOSITION | `NON-ESTIMABLE-NO-GEOMETRY-VARIATION` | 0 / 28 |
| VPMC × REPLY | `MIXED-ORDER` | 9 / 28 |

### 6.1 Exact value

WIN / LOSSとcorridorおよびreply widthの関係はどちらも`MIXED-ORDER`だった。したがって、この8 rootでは、これらのbounded geometry scalarだけでroot exact valueを一方向に順序づける結果は得られていない。

Tree/RAWとtranspositionは全root同値だったため、WIN / LOSSとの比較は`NON-ESTIMABLE`である。

### 6.2 DTF

`DTF × REPLY`は17 informative pairsすべてがdecreasing directionに揃い、`MONOTONE-DECREASING-ORDER-CONSISTENT`となった。この固定populationでは、immediate reply widthが大きいrootほどDTFが小さい方向のpair orderingが観測された。

ただしN=8の限定されたlate-game exact microdomainにおけるfinite ordering summaryであり、whole Baoにおける普遍的関係、因果関係、探索難易度の一般則として扱わない。

`DTF × CORRIDOR`はmixedであり、Tree/RAW・transpositionはvariation不足でnon-estimableだった。

### 6.3 Value-preserving move count

`VPMC × CORRIDOR`は12 informative pairsすべてがdecreasing directionに揃い、`MONOTONE-DECREASING-ORDER-CONSISTENT`となった。この固定populationではcorridor occupancyが大きいrootほどvalue-preserving root move countが小さい方向のorderingが観測された。

`VPMC × REPLY`は8 concordant / 1 discordantのinformative pairを含むが、事前登録規則では両方向が存在するため`MIXED-ORDER`である。post-hocにthresholdを緩和してpositive relationへ昇格させない。

Tree/RAW・transpositionはvariation不足でnon-estimableだった。

## 7. 研究上の意味

G4-06で得られた最も重要な点は、局所geometryとexact consequenceを同一の固定exact microdomain上で、upstream exact resultを変更せずprospectiveに接続できることを実証した点にある。

科学的には、今回のpopulationで次が分離された。

- **情報を持たなかった軸**: Tree/RAW inflation、transposition。少なくともこの8 late-game domainでは全root同値で、exact consequenceを区別できなかった。
- **variationはあるが単純なvalue discriminatorではなかった軸**: corridor、reply width。
- **限定population内で一方向orderingを示した組合せ**: `DTF × REPLY`、`VPMC × CORRIDOR`。

この分離は、今後の研究で「どのgeometry signalがどのexact consequenceに対して情報を持ち得るか」を絞り込む材料になる。ただしG4-06単独では公開AIへのfeature採用、評価関数変更、探索順序変更を正当化しない。

## 8. Negative / non-estimable resultの保持

本Studyでは12 relationすべてを事前登録どおり保存した。favorable relationだけを選択していない。

特にTree/RAWとtranspositionについては、variation不足を失敗として隠さず`NON-ESTIMABLE`として保持した。これは「関係がない」と断定するものではなく、**今回の固定populationでは識別できない**という限定された結論である。

## 9. Reproducibility / independence

formal runではproductionとindependentがそれぞれ8 rootを再物質化し、exact closureとgeometry、exact consequence、12 relationを独立経路で再計算した。

```text
allProductionIndependentAgreement = true
allRootScientificComparablesMatch = true
relationMatrixAgreement = true
```

source-freeze authorizationにより、spec、manifest、workflow、engine、RNG、exact solver、LGTGMIV、SFCDF、G4-06 bridge実装のblob SHAを実行時に検証した。

## 10. 適用範囲

本結果が直接支持する範囲は次に限定される。

- G4-05でcomplete closureとなった固定8 microdomain
- RAW identity
- relative depth 5
- 事前登録した4 geometry scalar
- exact value / DTF / VPMC
- finite root-level ordering summary

次は支持しない。

- whole-Bao optimality
- 全局面における一般的geometry則
- causal mechanism
- 人間にとっての難易度
- 公開AIの棋力改善
- AI featureの正式採用

## 11. 研究終了（closure）

G4-06のformal scientific objectiveは達成され、main統合前監査も`PASS`したため、`COMPLETE`として閉じる。

```text
G4-06 = COMPLETE / MAIN INTEGRATED
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
pre-main audit = PASS
main integration = COMPLETE / FAST-FORWARD
integrated research HEAD = 889b3d16f09517e5b8aa6621cfd347d4b8902891
public AI change = false
next program item = G4-07 authorization review
```

research branchは統合直前に`main`へ対して`ahead 43 / behind 0`で、merge baseは`6a005d9f84d222126dc41abfe17ad5baa4c96629`だったため、履歴を保持したfast-forwardで統合した。この統合はformal result、解釈境界、same-evidence rerun禁止、G4-10保護境界、public AI非変更を変更しない。

G4-07は次のauthorization-review candidateにすぎず、executionは未認可である。

## 12. 正本

`STUDY_1_PROTOCOL.md`、preregistration、authorizationは各時点のprospective / historical recordを保持する。後続の実行・closure・main統合状態は、本最終報告、`CURRENT_STATUS.md`、canonical receipt、checkpointを優先する。

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`preregistration/STAGE_1_FORMAL_SPEC.json`](preregistration/STAGE_1_FORMAL_SPEC.json)
- [`preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json`](preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json)
- [`authorizations/STAGE_1_AUTHORIZATION.json`](authorizations/STAGE_1_AUTHORIZATION.json)
- [`results/stage-1/STAGE_1_FORMAL_RECEIPT.json`](results/stage-1/STAGE_1_FORMAL_RECEIPT.json)
- [`checkpoints/2026-09-26-stage-1-formal-complete.md`](checkpoints/2026-09-26-stage-1-formal-complete.md)
- [`../research-generation-4/checkpoints/2026-09-26-g4-06-pre-main-audit.md`](../research-generation-4/checkpoints/2026-09-26-g4-06-pre-main-audit.md)
- [`../research-generation-4/checkpoints/2026-09-26-g4-06-main-integration.md`](../research-generation-4/checkpoints/2026-09-26-g4-06-main-integration.md)
