# Stage 1 Mtaji Invariant Morphology Audit Runbook

更新日: 2026-08-10  
Status: **exploratory / invariant morphology candidate audit / no final cluster decision / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**

## 1. 目的

Polarity auditにより、reference mtaji S-pruned k=2は:

```text
continuous relational polarity axis with a stable sign-oriented partition
```

と解釈し、two discrete position typesとしては採用しない。

一方、actor/opponent orientationを消した:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

representationではk=2に強いmethod agreementが残った。

本runbookでは、この **swap-invariant morphology k=2** がstate-intrinsicなposition-type candidateとして残るかを監査する。

## 2. Boundary

このauditはStage 1 exploratory pilotの追加inspectionである。

- final kを選択しない
- type名を付けない
- future held-out seedsを使わない
- playing styleをまだ分析しない
- Study 1 formal corpusを使わない

## 3. Environment

既存venv:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

追加package installは不要。

必要:

- numpy
- pandas
- scipy
- scikit-learn

## 4. Repository preflight

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only
git status --short
python --version
```

必要local artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/feature-audit.json
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/eligible-primary-rule-state.csv
artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json
```

## 5. Syntax check

```bash
python -m py_compile tools/experiments/analyze-position-typology-stage1-invariant-morphology.py
```

## 6. 実行

```bash
python tools/experiments/analyze-position-typology-stage1-invariant-morphology.py
```

Output:

```text
artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json
```

## 7. 監査内容

### 7.1 Method agreement

Capped invariant k=2について:

- K-means
- diagonal GMM
- Ward

のARIを再計算する。

### 7.2 Full vs capped

Full mtaji populationとgame-phase-capped populationで independently fitし、capped rows上のlabel ARIを比較する。

### 7.3 Trajectory resampling

Capped populationで80% gamesをsampleし:

- K-means
- GMM

を40 repetitions refitする。

Unitはgame / trajectory。

### 7.4 Role-swap invariance

Invariant feature matrixがactor/opponent swapで数値的に完全一致することを確認する。

### 7.5 Consecutive trajectory persistence

Capped-fit K-meansをfull mtajiへassignし、consecutive plyで:

- same-cluster rate
- flip rate
- transition count
- run-length distribution

を出す。

Reference relational-polarity k=2ではplayer交代ごとに約90% label flipしたため、invariant candidateではより高いpersistenceが期待される。

ただしこれはformal thresholdではない。

### 7.6 Scalar explanation

Invariant k=2が単純な1 scalarで説明されないかを調べる。

候補:

- standardized absolute actor/opponent differenceのRMS = `imbalanceMagnitude`
- capture / relay / chain totalsのRMS = `activityMagnitude`

各scalar単独の1D k=2とinvariant k=2のARIを比較する。

### 7.7 Relation to relational polarity

同じcapped rows上でreference S-pruned relational-polarity k=2を再構築し:

- ARI
- NMI

を算出する。

低ければpolarityとは別のstructural axisである可能性が高い。

### 7.8 Axis discreteness

Invariant K-means centroid axisについて:

- projection quantiles
- 1/2/3-component GMM AIC/BIC
- KDE peak count
- top-2 peak valley density ratio

を出す。

Strong stable clusteringであってもdeep density gapが無い場合はcontinuous morphology gradientの可能性を維持する。

### 7.9 Interpretability

各K-means clusterについて:

- top standardized profile effects
- ply distribution
- condition counts
- centroid-nearest representative positions
- centroid-boundary positions

を保存する。

## 8. Decision rule — exploratory interpretation only

本auditではformal success thresholdを事後設定しない。

### Discrete intrinsic type candidateとして強まる条件

複数の証拠が同時に支持する場合:

- high method agreement
- high trajectory resampling stability
- high full/capped stability
- trajectory上でreference polarityより明確にpersistent
- representative boardsに共通のstate-intrinsic morphology
- polarityと低いagreement
- single scalar magnitudeだけでは説明しきれない
- density separationが少なくとも一定程度見える

### Continuous morphology axisへ降格する条件

- deep density gapがない
- clusterがsingle scalar magnitudeとほぼ同一
- boundary positionsが連続的
- trajectory上で頻繁に往復する

場合は、typeではなくcontinuous state coordinateとして扱う。

## 9. 実行後共有

次の1ファイルのみアップロードする。

```text
artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json
```

この結果を見るまでtype名は付けない。
