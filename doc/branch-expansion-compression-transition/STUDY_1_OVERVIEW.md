# G3-05 / BECT-STUDY1 — 研究概要

更新日: 2026-09-02  
状態: **CLOSED / TECHNICAL-INVALID**

## 研究題目

**Branch Expansion and Compression Transition Study 1 — Prospective exact analysis of longitudinal bounded local game-tree geometry change, transition onset, persistence, reopening, and reversal along Bao trajectories**

日本語正式題目:

**Baoにおけるbranch expansion / compression転移のprospective exact解析 — 対局trajectory上のbounded局所ゲーム木幾何の変化、転移開始、持続、再開放、反転の再現可能な検証**

## 中心問い

同一対局trajectory上で、relative depth 5のbounded local game-tree / RAW-graph geometryは滑らかなlevel変化だけを示すのか、それともbranch expansion、compression、reopening、extinction、持続、反転として再現可能に定義できる時間方向のtransitionを持つのかを検証します。

## 既存研究との分離

本Studyは以下を再検定・救済しません。

- Research Generation 1の「局面相転移点」
- G3-03 `TCTGD-STUDY1`のtechnical-invalid diagnostic
- G3-04 `SFCDF-STUDY1`のC1/C6 formal result

G3-04 C1/C6は「局所geometryにstatic phase differenceが存在し得る」という背景動機に限って参照可能です。それらの方向・値はG3-05のevent selection、threshold、formal outcomeには使いません。

## 測定基盤

独立prerequisite `LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`のF1-F5だけを使用します。

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
relative horizon = 5
validated transforms = []
```

## Longitudinal construct

8つのexact level endpoint `L_m(t)`をprospectively固定しました。

- root legal width
- cumulative tree occurrence
- global distinct RAW states
- cumulative tree/RAW ratio
- duplicate-transition fraction
- unit-width occupancy fraction
- branch-reopening fraction
- branch-extinction fraction

隣接ply差 `D_m(t)=L_m(t+1)-L_m(t)`をexact rationalで保持し、`UP / DOWN / ZERO / UNDEFINED`に分類します。Stage 1ではmagnitude thresholdを導入せず、符号だけでonset / persistence / reversal / stallを定義します。

## Longitudinal dependence

Primary experimental unitは**source trajectory**です。

隣接rootのdepth-5 local windowsは強く重複し得るため、root pairやevent windowを独立sampleとは扱いません。candidateごとのeventをtrajectory内で集約し、formal inferenceではtrajectoryごとの`persistence count - reversal count`の符号へ縮約します。

## Rule phaseとの境界

geometry eventをNamua→Mtaji等のrule-semantic phase boundaryから独立に定義します。primary transition inferenceではevent windowが複数rule phaseを跨ぐ場合は除外します。phaseとの関係はevent構築後のsecondary descriptive contextに限定します。

## Stage structure

```text
BECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID
BECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS
BECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 0はtechnical fixtureのみ。Stage 1/2はそれぞれ別authorizationが必要です。

Stage 1 reserved fresh block:

`31510001..31510240` / target 10 trajectories / **CONSUMED / CLOSED TO SAME-EVIDENCE REUSE**

Stage 2 reserved fresh block:

`31520001..31520384` / target 16 trajectories / **NOT CONSUMED / NOT AUTHORIZED**

## Formal closure

Stage 0 v2でlongitudinal reconstructionのtechnical gateをPASSした後、fresh Stage 1をexactly one authorized executionで開始しました。しかしbounded RAW enumeration中に`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529`が発生し、10 trajectories全体のvalid development summaryへ到達しませんでした。

Fresh access後であるためsame-evidence repair/rerunは行わず、formal closureは **`CLOSED / TECHNICAL-INVALID`** としました。formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`です。保存されたpartial telemetryはdiagnostic-onlyで、branch expansion/compression transitionの存在・不在を示すscientific evidenceへ格上げしません。

## Protected evidence

standard initial RAW-root complete exact depth-10 holdoutは引き続き:

**`SEALED / NOT GENERATED / NOT READ`**

です。本Studyはこれを生成・read・peek・部分列挙・resource estimateしません。

詳細な正本は`STUDY_1_PROTOCOL.md`と`prereg/STUDY_1_SPEC.json`です。
