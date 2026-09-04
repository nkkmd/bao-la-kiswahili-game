# G3-04 / SFCDF-STUDY1 — 最終報告

更新日: 2026-09-02

## 1. formal status（正式状態）

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Study status = CLOSED / FORMAL-COMPLETE
Stage 0 = SFCDF-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
Stage 1 = SFCDF-S1-DEVELOPMENT-2026-09-02-v1 / STAGE1-PASS
Stage 2 = SFCDF-S2-FORMAL-2026-09-02-v1 / STAGE2-PASS
Stage 1 seed = 31410001..31410192 / CONSUMED
Stage 2 seed = 31420001..31420288 / CONSUMED
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

`CLOSED / FORMAL-COMPLETE`はrepository lifecycle statusであり、新しいscientific omnibus labelではない。本Studyでprospectively定義されたformal inferenceはcandidate-levelの`CONFIRMED` / `NOT-CONFIRMED`である。

Formal candidate results:

```text
SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION = CONFIRMED / MTAJI-GREATER
SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO = CONFIRMED / NAMUA-GREATER
```

## 2. 研究題目

**Structural Forcing-Corridor and Decision-Funnel Study 1 — Prospective exact validation of sustained reply narrowing and branch-to-RAW convergence in bounded Bao local geometry**

日本語正式題目:

**Baoにおけるstructural forcing corridorとdecision funnelのprospective exact検証 — sustained reply narrowingとbranch-to-RAW convergenceによるbounded局所経路構造の再現可能なphase差の検証**

## 3. 科学的scope

本Studyは、Baoのbounded RAW local geometryにおいて、次の2種類の構造を分離して検証した。

- **corridor**: reply widthが狭く、特にlegal replyが1つだけのdepth-labelled RAW stateがどの程度持続・占有するか
- **funnel**: tree occurrenceがRAW graphへどの程度圧縮されるか、またbranch reconvergenceがどの程度生じるか

Representation contract:

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
```

Principal measurement families:

- `LGTGMIV-F5-REPLY-GEOMETRY`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary:

- `LGTGMIV-F1-TREE-OCCURRENCE`

## 4. 結果を見る前に固定したcandidate family

Corridor candidates:

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
2. `SFCDF-C2-WIDTH-COMPRESSION-FRACTION`
3. `SFCDF-C3-LONGEST-UNIT-WIDTH-RUN`

Funnel candidates:

4. `SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION`
5. `SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION`
6. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

corridorとfunnelを一つのbinary classには統合していない。

## 5. Stage 0のtechnical validation

Stage 0 v1はprereg JSON syntax defectによりsynthetic fixture前に停止した。fresh seed accessは0であった。

syntax-only correction後、別authorizationのv2 technical executionを行った。

```text
run = 33620251552
artifact ID = 9842597981
artifact ZIP SHA-256 = 028ad7e5034cc4954003b081ca6f0c7ac2bc44a97db0f397fe78ea65f21b7021
deterministic technical core = 14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295
Stage disposition = STAGE0-PASS
```

ここでは、ordinary-object / null-prototype representation差があってもcanonical scientific contentがexact一致すること、corridor/funnel semantic separation、exact rational arithmetic、undefined denominator、promotion/formal boundary、implementation independenceを確認した。

## 6. Stage 1 developmentの結果

Frozen population:

```text
seed block = 31410001..31410192
target = 12 paired trajectories / 24 roots
Namua root = exact ply 24
Mtaji root = first nonterminal Mtaji at ply >=44
selection = seed ascending / geometry-blind / endpoint-blind / outcome-blind
```

authorizeされたexecutionは次の1回だけである。

```text
workflow run = 33621863279
lease commit = 923f890302e50a1ae19d184eb9120105559f8381
artifact ID = 9843276993
artifact ZIP SHA-256 = b3aeea3c1058d98b8b59fe0eaa69edc734f60e2ccb04223a464d842a78e33a56
Stage disposition = STAGE1-PASS
```

production / independent Stage scientific core:

```text
production = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
independent = fb8929e2a27802e46431deb79fcfafe78d9598301f6252f3ad6ffea485216cca
```

### Stage 1でのpromotion

| Candidate | Comparable | Positive (Mtaji>Namua) | Negative | Zero | Promotion |
|---|---:|---:|---:|---:|---|
| C1 unit-width occupancy | 12 | 11 | 1 | 0 | **PROMOTED / MTAJI-GREATER** |
| C2 width compression | 12 | 6 | 6 | 0 | not promoted |
| C3 longest unit-width run | 12 | 4 | 3 | 5 | not promoted |
| C4 reconvergent occupancy | 12 | 0 | 3 | 9 | not promoted |
| C5 root-branch overlap | 8 | 0 | 1 | 7 | not promoted |
| C6 cumulative tree/RAW ratio | 12 | 0 | 10 | 2 | **PROMOTED / NAMUA-GREATER** |

したがってStage 2へ進んだのはC1/C6だけである。C2–C5を事後的に復活させていない。

## 7. Stage 2 firewallとformal input

Stage 2はStage 1 result全体をselection inputとして再利用せず、次だけをminimal formal inputへmaterializeした。

- C1/C6のpromoted identityとfrozen direction
- Stage 1 RAW-root identity 24件
- Stage 1 source-trajectory identity 24件
- Stage 1 first-16-prefix identity 12件

```text
prereg/STAGE_2_FORMAL_INPUT.json
blob = 88563b39f2e9fec2bdf0e00eb40ec9debbba9ff0
Stage 1 identity core = eca6d00a88def284644bdf59bc599e8faae7d09f3aaa2656fafd046c35fd4c0d
```

C2–C5を含むStage 1 scientific outcomesはformal inputから除外した。

## 8. Stage 2のformal execution

Frozen population:

```text
seed block = 31420001..31420288
target = 18 paired trajectories / 36 roots
Stage 1 RAW-root / trajectory / first-16-prefix identities excluded
```

Pre-authorization source validation:

```text
run = 33624044515
result = STAGE2-SOURCE-VALIDATION-PASS
Stage 2 seed access = false
protected depth-10 access = false
```

formal scientific executionは次の1回だけ行った。

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
Stage disposition = STAGE2-PASS
```

production / independent formal Stage scientific core:

```text
production = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
independent = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
```

完全一致した。

## 9. formal result — C1の結果

`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`

Formal label: **`CONFIRMED`**  
Frozen direction: **`MTAJI-GREATER`**

```text
comparable = 18/18
Mtaji > Namua = 18
Namua > Mtaji = 0
zero = 0
nonzero = 18
coverage = PASS
nonzero gate = PASS
direction gate = PASS
exact two-sided sign-test p = 1/131072
Holm rank = 1
Holm threshold = 1/40
Holm = PASS
```

したがって、frozen Stage 2 populationでは、relative depth-5のdepth-labelled nonterminal unique RAW-state presenceのうちlegal replyがちょうど1つであるものの割合は、全18 pairでMtaji rootの方がNamua rootより高かった。

これはbounded local structural reply narrowingのphase差である。

## 10. formal result — C6の結果

`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

Formal label: **`CONFIRMED`**  
Frozen direction: **`NAMUA-GREATER`**

```text
comparable = 18/18
Mtaji > Namua = 0
Namua > Mtaji = 18
zero = 0
nonzero = 18
coverage = PASS
nonzero gate = PASS
direction gate = PASS
exact two-sided sign-test p = 1/131072
Holm rank = 2
Holm threshold = 1/20
Holm = PASS
```

したがって、frozen Stage 2 populationでは、relative depth-5のtree occurrence総数 / global distinct RAW-state数というbounded tree-to-graph inflation descriptorは、全18 pairでNamua rootの方がMtaji rootより高かった。

C6はtree/RAW compression descriptorであり、それ単独でtranspositionの存在や戦略的単純性を証明する指標ではない。

## 11. 全結果を合わせた解釈

C1とC6は逆方向に確認された。

- Mtaji側では、bounded local RAW statesのunit-width occupancyが一貫して高い。
- Namua側では、bounded tree occurrence / unique RAW graph size比が一貫して高い。

これは、少なくともfrozen depth-5 populationにおいて「reply narrowing」と「tree-to-RAW graph inflation」が同じ1軸の“forcing”量ではないことと整合的である。

しかし、本Studyはcombined corridor/funnel classを定義していないため、C1とC6を事後的に一つのlatent constructへ統合しない。

## 12. 解釈上の境界

本Studyからformalに主張できるのは、prospectively fixed paired populationとrelative depth 5のRAW local geometryにおけるC1/C6のphase差である。

以下はformal conclusionではない。

- Mtajiがgame-theoreticallyよりforcingである
- Namuaがtacticallyより複雑である
- unit-width occupancyが最善手の明確さを意味する
- C6がtransposition concentrationそのものを意味する
- reply narrowingがsearch stability / search easeを意味する
- funnel/compressionがstrategic simplicityを意味する
- C1/C6がhuman difficultyを予測する
- C1/C6がposition value / win probabilityを示す
- Namua→Mtaji phase transitionがこの差を因果的に生む
- depth 5のpatternがdeeper exact game treeでも維持される

## 13. protected deeper holdout （証拠の状態）

standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

**`SEALED / NOT GENERATED / NOT READ`**

本Studyはこのholdoutを生成・read・resource peekしていない。

## 14. no-rescue / execution integrity （実行記録）

```text
Stage 1 = 1 authorized / 1 actual scientific execution
Stage 2 = 1 authorized / 1 actual scientific execution
same-evidence scientific reruns after fresh access = 0
```

両scientific Stageは次を使用した。

1. separate Stage authorization,
2. durable pre-computation lease,
3. frozen source-blob binding,
4. canonical production / independent exact comparison
5. repository mirror前のdurable Actions artifact
6. 自動rerunは行わない。

## 15. closure（終了状態）

G3-04 / SFCDF-STUDY1はscientific executionを完了した。

最終的なrepository lifecycle status:

**`CLOSED / FORMAL-COMPLETE`**

Formal inferential record:

- **C1 = CONFIRMED / MTAJI-GREATER**
- **C6 = CONFIRMED / NAMUA-GREATER**
- C2〜C5はStage 1でpromoteせず、Stage 2 labelはない

今後このStudy自体のseed追加、rerun、endpoint救済、threshold変更は行わない。追加検証が必要な場合は、新しいprospective Study/versionとして独立にauthorizeする。
