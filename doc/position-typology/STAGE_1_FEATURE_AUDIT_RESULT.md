# Stage 1 Python Feature Audit Result

更新日: 2026-08-09  
Status: **feature audit complete / clustering design ready / exploratory only / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 位置づけ

本書は96-game Stage 1 pilotから作成したprimary eligible feature tableのPython redundancy audit結果を記録する。

このauditではclustering、PCA、position type命名、playing-style分析を行っていない。

## 2. Environment

- Python: `3.12.3`
- implementation: CPython
- platform: WSL2 / Linux x86_64
- numpy: `2.5.1`
- pandas: `3.0.5`
- scikit-learn: not installed
- scipy: not installed
- matplotlib: not installed

Feature audit script自体はstandard libraryで完結しており正常終了した。

Clustering diagnosticにはscikit-learnを追加する。exploratory environmentではまず`python -m pip install scikit-learn`とし、実行時versionをartifactへ記録する。Stage 2前にreproducibility environmentをfreezeする。

## 3. Population consistency

Pilot auditと完全一致した。

- eligible raw: 4,834
- primary rule-state unique: 4,834
- seat-canonical unique: 4,834
- seat-canonical collapse: 0
- namua: 3,339
- mtaji: 1,495

Feature-table rebuildによるpopulation driftはない。

## 4. Deterministic redundancy

以下は両phaseで数値誤差0またはmachine epsilon水準で決定論的だった。

- `boardSeeds = frontSeeds + backSeeds`
- `occupiedPits = frontOccupied + backOccupied`
- `meanChainEvents = meanCaptureEvents + meanRelayEvents`
- `global.boardSeedCount = actor.boardSeeds + opponent.boardSeeds`
- `global.nonEmptyPitCount = actor.occupiedPits + opponent.occupiedPits`
- 全`difference.* = actor.* - opponent.*`

したがって、これらをabsolute primitiveと同時にbaseline feature matrixへ重複投入しない。

Matrix Cのdifference fieldsは独立な情報ではなく、**別representationとしてのみ比較**する。

## 5. Namua audit

Rows: 3,339  
Games represented: 95

### Constant / exact duplicate

- constant columns: none
- exact duplicate column groups: none

### High correlation

`|Pearson r| >= 0.98` は1組のみ。

- `actor.reserve` vs `opponent.reserve`: `r = 0.9953556712`

両reserveを別々にstandardizeすると、ほぼ同じgame-progress informationを2 dimensionsで数えることになる。

Baselineでは次へ置換する。

- `reserveTotal = actor.reserve + opponent.reserve`
- `reserveDifference = actor.reserve - opponent.reserve`

これによりabsolute reserve progressとactor/opponent asymmetryを分離する。

### Distribution notes

強い正歪みがある代表例:

- actor meanRelayEvents: skew ≈ 2.91
- actor maxRelayEvents: ≈ 2.57
- actor maxChainEvents: ≈ 2.09
- actor meanCapturableSeeds: ≈ 2.03
- opponent maxRelayEvents: ≈ 1.66
- opponent meanRelayEvents: ≈ 1.56

`forcedCapture`はbinaryでactor 92.4%、opponent 89.8%が1である。中心的なrule-state featureなのでbaselineからは除外しないが、continuous variableと同じz-score処理は行わない。

## 6. Mtaji audit

Rows: 1,495  
Games represented: 89

### Constant columns

- `actor.reserve = 0`
- `opponent.reserve = 0`
- `difference.reserve = 0`
- `global.boardSeedCount` constant

Mtajiではreserveはmechanics上消失しているためbaseline matrixから完全に外す。

`global.boardSeedCount`もfeatureとして使わない。既にprimitive sumsから導出可能であり、このpilot mtaji populationではさらにconstantである。

### Exact duplicate group

- actor.reserve
- opponent.reserve
- difference.reserve

すべてzero constant。

### High correlation

`|Pearson r| >= 0.98` の非定数pairはなし。

### Rare binary feature

`houseOwned`は極端に希少。

- actor.houseOwned = 1: 約1.27%
- opponent.houseOwned = 1: 約0.67%

このbinaryをStandardScalerすると希少1が約9–12標準偏差相当となり、Euclidean distanceを過剰に支配し得る。

そのためmtaji baselineでは`houseOwned`を外し、**rare-house sensitivity**として別途比較する。

### Distribution notes

強い正歪みがある代表例:

- actor maxRelayEvents: skew ≈ 3.02
- opponent seedConcentration: ≈ 2.62
- actor nyumbaSeeds: ≈ 2.44
- opponent nyumbaSeeds: ≈ 2.43
- actor meanRelayEvents: ≈ 2.40
- actor seedConcentration: ≈ 2.31
- actor / opponent pitSeedVariance: > 2.1

Morphology / concentration系featureについてraw scalingだけでなく`log1p` sensitivityを比較する根拠がある。

## 7. Baseline representation decision

### S-pruned — primary first diagnostic

Actor / opponent structural primitivesを使用するが、deterministic / phase-inappropriate redundancyを除く。

共通continuous candidates:

- nyumbaSeeds
- frontSeeds / backSeeds
- frontOccupied / backOccupied
- reusablePits
- frontConnections
- legalMoveCount
- captureMoveCount
- maxPitSeeds
- pitSeedVariance
- seedConcentration
- maxCapturableSeeds / meanCapturableSeeds
- maxCaptureEvents / meanCaptureEvents
- maxRelayEvents / meanRelayEvents
- maxChainEvents

共通binary:

- forcedCapture

Namuaのみ:

- actor.houseOwned / opponent.houseOwned
- reserveTotal
- reserveDifference

Mtaji baseline:

- reserveを除外
- houseOwnedを除外

Mtaji `houseOwned`はrare-house sensitivityとして追加する。

### Matrix C

Difference-only / contrast representationはsecondary sensitivityとする。

理由:

- difference fieldsはabsolute featuresから完全に決定論的
- absolute board stage / mass informationを落とす
- baseline S-prunedと同時投入すると同じsignalを重複計数する

### Matrix P

Actor-oriented raw 32-pit vectorは保存済みだが、**first diagnostic gridにはまだ入れない**。

理由:

- 32 raw dimensionsがsummary blockより数でdistanceを支配し得る
- raw-pit geometryを採用する前に、より解釈可能なS-prunedで安定なstructureが存在するか確認する方が研究上明瞭

S-prunedに安定候補が見つかった後、Matrix Pをrepresentation sensitivityとして比較する。

## 8. Preprocessing decision for first diagnostic

Binary featureは0/1のまま保持する。

Continuous featureについて2 preprocessingsを比較する。

### `standard`

Continuous columnsをStandardScaler。

### `log1p-standard`

非負で強いtailを持つ以下のsemantically count/concentration morphology fieldsへ`log1p`を適用後、continuous columnsをStandardScaler。

- nyumbaSeeds
- maxPitSeeds
- pitSeedVariance
- seedConcentration
- maxCapturableSeeds
- meanCapturableSeeds
- maxCaptureEvents
- meanCaptureEvents
- maxRelayEvents
- meanRelayEvents
- maxChainEvents

front/back seed counts、occupancy、connections、legal/capture move counts、reserveTotal / reserveDifferenceはbaselineではlog transformしない。

これはexploratory preprocessing comparisonでありfinal preprocessingではない。

## 9. First clustering diagnostic design

Phase-separatedで実行する。

Methods:

- K-means
- Gaussian mixture model
- Ward agglomerative clustering

Diagnostic k range:

- `k = 2..10`

Preprocessing:

- `standard`
- `log1p-standard`

Population views:

1. full unique-position unweighted
2. deterministic game × phase balanced capped subsample

Balanced subsampleは各game × phaseでruleStateKeyのSHA-256順に最大20 positionsを採用する。Feature値やcluster結果に依存しないdeterministic selectionとする。

Seat-canonical sensitivityはこのpilotではsampleが完全同一なのでfirst gridで重複実行しない。

## 10. Diagnostics

各solutionで少なくとも:

- silhouette score（deterministic sample上で計算）
- Calinski–Harabasz
- Davies–Bouldin
- cluster size / minimum cluster fraction
- condition composition
- cluster vs condition normalized mutual information
- GMM AIC / BIC

を保存する。

同一phase / preprocessing / k / population viewでmethod間Adjusted Rand Indexも計算する。

Conditionはfeatureに入れず、clusterが特定AI conditionの代理になっていないかを監査するためだけに用いる。

## 11. 現時点で行わないこと

- metric最大のkを自動的にposition-type数へ昇格しない
- clusterへBao語彙を付けない
- PCA plotだけで類型を決めない
- Matrix Pを最初からprimaryにしない
- mtaji rare `houseOwned`をz-scoreしてbaselineへ混ぜない
- Study 1のcapture-branch-expansionをcluster形成へ使わない
- pilot resultをconfirmationと呼ばない

## 12. 次の停止点

First clustering diagnostic JSONを確認し、method / k / preprocessing / balance sensitivityを比較する。

その結果からprovisional cluster candidateを選ぶ場合も、まだStage 1 exploratory candidateでありformal confirmationではない。
