# Stage 1 First Clustering Diagnostic Runbook

更新日: 2026-08-09  
Status: **exploratory clustering diagnostic / no final cluster count / no position-type naming / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 目的

`STAGE_1_FEATURE_AUDIT_RESULT.md` で確定したS-pruned representationを使い、first clustering diagnosticを行う。

これはposition typeのformal discovery完了ではない。

このrunでは:

- final cluster数を選ばない
- position type名を付けない
- playing styleを分析しない
- Matrix C / Pをまだprimaryへ入れない
- Study 1 data / classifierをcluster形成へ使わない
- pilot dataをconfirmatory evidenceとして扱わない

## 2. Environment

既存venvを使用する。

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

Feature audit時点では:

- numpy `2.5.1`
- pandas `3.0.5`
- scikit-learn: not installed
- scipy: not installed
- matplotlib: not installed

だった。

First diagnosticに必要なのはscikit-learnである。

```bash
python -m pip install scikit-learn
```

scikit-learnの依存として必要なscientific packagesもpipが解決する。

この段階ではmatplotlibは不要。

確認:

```bash
python - <<'PY'
import numpy, pandas, sklearn, scipy
print("numpy", numpy.__version__)
print("pandas", pandas.__version__)
print("sklearn", sklearn.__version__)
print("scipy", scipy.__version__)
PY
```

実際のversionはclustering artifactへ記録される。Stage 2 replication前にenvironmentをfreezeする。

## 3. Repository preflight

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only
git status --short
```

Feature-audit local artifactが残っていることを確認する。

```bash
test -f artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/feature-audit.json
test -f artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/eligible-primary-rule-state.csv
```

## 4. Syntax check

```bash
python -m py_compile tools/experiments/analyze-position-typology-stage1-clusters.py
```

失敗した場合は実行しない。

## 5. Baseline representation

First diagnosticは **S-pruned** のみ。

### Namua

Actor / opponent structural primitivesを使う。

Reserveはhigh-correlation pairをそのまま2列で入れず:

```text
reserveTotal = actor.reserve + opponent.reserve
reserveDifference = actor.reserve - opponent.reserve
```

へ置換する。

Binary:

- actor.forcedCapture
- opponent.forcedCapture
- actor.houseOwned
- opponent.houseOwned

Binaryは0/1のままscaleしない。

### Mtaji

- actor/opponent reserveを除外
- actor/opponent houseOwnedをbaselineから除外
- forcedCaptureは0/1で保持

Mtaji houseOwnedは約1%のrare eventなので、後のrare-house sensitivityで扱う。

## 6. Preprocessing

2系統を比較する。

### `standard`

Continuous columnsのみStandardScaler。

### `log1p-standard`

次のtail-prone fieldsへ`log1p`後、continuous columnsをStandardScaler。

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

Binaryはどちらでも0/1のまま。

## 7. Population views

### `full-unweighted`

phase別eligible unique rule-state positionsをすべて使用。

### `game-phase-capped`

各game × phaseについて最大20 positionsを使用する。

Selectionはfeature値やcluster結果ではなく、`ruleStateKey`のSHA-256 lexical orderで決定する。

したがってdeterministicで、cluster結果から独立したtrajectory-balance sensitivityである。

## 8. Methods / k

Methods:

- K-means
- Gaussian mixture model, diagonal covariance
- Ward agglomerative clustering

GMMをdiagonal covarianceにする理由:

- pilot sampleに対してfull covariance × k=10はparameter数が大きい
- first diagnosticでは過剰parameterizationよりmethod family差を確認することを優先する

Diagnostic range:

```text
k = 2..10
```

これはposition-type数のformal hypothesisではない。

## 9. Metrics

各solution:

- silhouette score
- Calinski–Harabasz
- Davies–Bouldin
- cluster count / fraction
- minimum / maximum cluster fraction
- condition NMI
- condition composition
- K-means inertia
- GMM AIC / BIC

同一phase / view / preprocessing / kで:

- K-means vs GMM ARI
- K-means vs Ward ARI
- GMM vs Ward ARI

を計算する。

PCAはfirst 10 componentsまでexplained-variance diagnosticのみ記録する。PCA componentをposition type定義には使わない。

Silhouetteは最大600 deterministic sampleで計算し、計算量を抑えつつsolution比較を行う。

## 10. Execution

```bash
python tools/experiments/analyze-position-typology-stage1-clusters.py
```

Output:

```text
artifacts/local/position-typology/stage1-pilot-v1/clustering-diagnostic-v1/clustering-diagnostic.json
```

Local exploratory artifactなのでGitへcommitしない。

## 11. 実行後に共有するもの

次の1ファイルをチャットへアップロードする。

```text
artifacts/local/position-typology/stage1-pilot-v1/clustering-diagnostic-v1/clustering-diagnostic.json
```

## 12. 次のinspection

JSONを確認して:

- phaseごとのk landscape
- method間ARI
- preprocessing sensitivity
- balanced-view sensitivity
- GMM BIC / AIC
- condition NMI
- tiny cluster発生
- PCA dimensionality

を総合する。

単一metric最大のsolutionを自動採用しない。

## 13. 次工程候補

First diagnostic後、必要に応じて:

- provisional S-pruned solution shortlist
- mtaji rare-house sensitivity
- Matrix C sensitivity
- Matrix P sensitivity
- selected solutionのrepresentative / boundary positions
- trajectory bootstrap stability

へ進む。

まだStage 2 confirmationへは進まない。
