# Stage 1 Candidate Stability / Representation Audit Runbook

更新日: 2026-08-10  
Status: **exploratory robustness audit / no final cluster count / position types not named / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 目的

First clustering diagnosticはphaseごとに異なる結果を示した。

### Mtaji

- k=2に強いcoarse structure
- game-phase-capped + log1p-standardでk=2 method mean ARI ≈ 0.757
- k=5–6帯にもfiner structureの兆候
- k=6ではmethod mean ARI ≈ 0.728、minimum ≈ 0.699

### Namua

- k=2はsilhouetteが相対的に高いがmethod agreementが弱い
- capped + log1p k=4はmethod agreementが比較的高いがseparationは弱い
- まだprovisional cluster countを与えない

本runでは候補を増やさず、既存候補が次の変更に対して残るかを監査する。

- full vs game-phase-capped
- standard vs log1p-standard
- S-pruned vs C-level-contrast
- S-pruned vs P-raw-pits
- trajectory/game resampling
- mtaji rare-house inclusion

またK-means anchor solutionについて代表局面・境界局面・cluster profileを出力する。

## 2. Candidate probes

### Mtaji

```text
k = 2  coarse candidate
k = 6  fine-structure probe representing k=5–6 family
```

### Namua

```text
k = 2  compactness probe only
k = 4  method-agreement probe only
```

これはfinal cluster数ではない。

## 3. Representation sensitivity

### S-pruned

First diagnosticと同じphase-specific baseline。

### C-level-contrast

Actor / opponent pairを:

```text
total = actor + opponent
difference = actor - opponent
```

へ変換する。

Skew対象featureではactor/opponentそれぞれへ`log1p`してからtotal/differenceを作る。

目的は、absolute actor/opponent coordinate systemへの依存を調べることである。

### P-raw-pits

S-prunedへactor-oriented raw 32-pit vectorを追加する。

Pit vector:

```text
actor front 0..7
actor back 0..7
opponent front 0..7
opponent back 0..7
```

log1p-standard sensitivityではpit countsも`log1p`後にstandardizeする。

Raw pit representationがS-pruned summary geometryを壊すか、それとも同じpartitionを保持するかを見る。

## 4. Cross-view stability

Full-unweightedで得たlabelsをgame-phase-capped subsetへ制限し、capped-only solutionとARI比較する。

これはgame length / occupancy frequencyへの依存を直接監査する。

## 5. Cross-preprocessing stability

同一view / method / kで:

- standard
- log1p-standard

のlabel ARIを比較する。

## 6. Mtaji rare-house sensitivity

Mtaji baselineではrare `houseOwned`を除外した。

本runでは:

- baseline S-pruned
- actor/opponent `houseOwned`を追加したS-house

を同じcapped + log1p settingで比較する。

Rare binaryを加えただけでclusterが大きく変わる場合、house featureの扱いを再検討する。

## 7. Trajectory resampling

Sampling unitはpositionではなくgame / trajectory。

各candidateについて:

- view: game-phase-capped
- representation: S-pruned
- preprocessing: log1p-standard
- methods: K-means / diagonal GMM
- 40 repetitions
- each repetition: unique gamesの80%をwithout replacementで選択
- subsetでtransform / modelをfit
- full capped rowsへpredict
- full-data reference assignmentとのARI

を記録する。

出力:

- min
- p10
- median
- p90
- max

Wardはout-of-sample predictがないため、このtrajectory resamplingには使用しない。Wardはmethod agreement / cross-view sensitivityで引き続き監査する。

これはheld-out replicationではなくsame pilot内のexploratory stabilityである。

## 8. Interpretability output

Capped + S-pruned + log1p-standard + K-meansについて各candidateごとに:

- cluster size
- cluster fraction
- top standardized profile effects
- condition composition
- median ply（descriptive only; featureではない）
- centroid-nearest representative positions
- centroid boundary positions

を出力する。

Representative / boundary positionにはactor-oriented pit arraysを保存する。

これを使って、clusterが実際にboard-level commonalityを持つかを次に人間がinspectionする。

## 9. Local execution

既存venvを使用する。

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

Repository:

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version
```

Syntax check:

```bash
python -m py_compile tools/experiments/analyze-position-typology-stage1-stability.py
```

Audit:

```bash
python tools/experiments/analyze-position-typology-stage1-stability.py
```

## 10. Outputs

```text
artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1/
├── candidate-stability.json
└── candidate-assignments.csv
```

Gitへcommitしない。

## 11. 共有対象

実行後、次だけチャットへアップロードする。

```text
artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1/candidate-stability.json
```

`candidate-assignments.csv`は現段階ではローカル保持でよい。

## 12. 次のdecision point

`candidate-stability.json`をinspectionして:

### Mtaji

- k=2をboard-level provisional candidateへ昇格できるか
- k=6がstable finer subdivisionとして残るか
- k=6がk=2の内部細分として解釈可能か

### Namua

- C/P representationでstabilityが改善するか
- k=2 / k=4のどちらかに再現可能なstructureがあるか
- それともcontinuous gradientとして扱うべきか

を判断する。

その後にのみrepresentative board inspectionと暫定語彙化へ進む。

## 13. 維持するboundary

- no final k
- no type names
- no playing-style names
- no Study 1 corpus
- no confirmatory reuse of Stage 1 pilot
- no post-hoc formal threshold
- no Stage 2 held-out data access
