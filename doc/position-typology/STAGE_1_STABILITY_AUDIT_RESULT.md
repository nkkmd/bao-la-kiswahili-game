# Stage 1 Candidate Stability / Representation Audit Result

更新日: 2026-08-10  
Status: **exploratory result / not preregistered / no final cluster count / no position-type naming**

## 目的

First clustering diagnosticで残した候補について、同一pilot内で次を監査した。

- full vs game-phase-capped
- standard vs log1p-standard
- S-pruned vs C-level-contrast vs P-raw-pits
- mtaji rare `houseOwned` sensitivity
- trajectory/game単位80% resampling × 40 repetitions
- representative positions / boundary positions
- K-means standardized profile effects

このauditはsame-pilot robustness inspectionであり、held-out confirmationではない。

Artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1/candidate-stability.json
```

Audit hash:

`7ed8bad7137cee50fa7f55d80f27d27ea90f4be9756de023acc020f25f0df1ae`

Boundary:

- `formalExperiment: false`
- `exploratory: true`
- `finalClusterCountSelected: false`
- `positionTypesNamed: false`

## Mtaji k=2

### 1. Same-representation agreement

Game-phase-capped + log1p-standard:

- K-means silhouette: 0.2328
- GMM silhouette: 0.2321
- Ward silhouette: 0.2084
- K-means vs GMM ARI: 0.9041
- K-means vs Ward ARI: 0.6883
- GMM vs Ward ARI: 0.6775
- cluster sizes are approximately balanced
- condition NMI is approximately 0

First diagnosticのcoarse k=2 signalは再現した。

### 2. Full vs capped

log1p-standard:

- K-means ARI: 0.9515
- GMM ARI: 0.8459
- Ward ARI: 0.5541

standard:

- K-means ARI: 0.9935
- GMM ARI: 0.9643
- Ward ARI: 0.6747

K-means / GMMではtrajectory-frequency capに対して高い安定性がある。

### 3. Preprocessing sensitivity

Full:

- K-means ARI: 0.8756
- GMM ARI: 0.8311
- Ward ARI: 0.4354

Capped:

- K-means ARI: 0.9073
- GMM ARI: 0.8131
- Ward ARI: 0.5763

K-means / GMMではstandard vs log1pの差に対して比較的robust。

### 4. Representation sensitivity

Capped + log1p:

S-pruned vs C-level-contrast:

- K-means: 0.7466
- GMM: 0.8489
- Ward: 0.6143

S-pruned vs P-raw-pits:

- K-means: 0.9515
- GMM: 0.8671
- Ward: 0.4970

特にK-meansではraw 32-pit representationを加えてもほぼ同じ2分割が残る。

### 5. Trajectory resampling

80% of games, 40 repetitions, capped S-pruned + log1p-standard:

K-means:

- minimum ARI: 0.9356
- p10: 0.9451
- median: 0.9707
- p90: 0.9902

GMM:

- minimum: 0.7723
- p10: 0.8369
- median: 0.9387
- p90: 0.9782

K-means k=2はtrajectory compositionに対して非常に高いsame-pilot stabilityを示す。

### 6. Rare-house sensitivity

Mtaji baselineから外していたrare `houseOwned`を戻したとき:

- K-means ARI: 1.0000
- Ward ARI: 1.0000
- GMM ARI: 0.2125

したがってk=2 signal自体はK-means / Wardで完全に維持される。一方、GMMはrare binary featureに強く敏感であり、現段階でGMMのmixture componentをposition typeとして解釈しない。

### 7. Board-level profile

Capped + log1p K-means k=2の2群は、主要profile effectがほぼ符号反転している。

一方は:

- actor front seeds / occupancy / reusable pits / front connectionsが高い
- opponent側の同系統featureが低い

他方はその逆。

Median plyは52 vs 51でほぼ同じであり、単純なmtaji時間進行の前半/後半分割とは見えない。

これは重要な結果だが、同時に注意点でもある。

> k=2が二つの独立したboard morphologyではなく、actor優勢 ↔ opponent優勢という一つのrelational polarity axisを中央で二分している可能性がある。

したがって、**mtaji k=2を robust relational-polarity candidate へ昇格するが、まだ二つのposition typeとは命名しない。**

## Mtaji k=6

Fine-structure probeは一定のrobustnessを維持した。

Capped + log1p method agreement:

- K-means vs GMM: 0.7864
- K-means vs Ward: 0.6897
- GMM vs Ward: 0.7042

Trajectory resampling:

K-means median ARI: 0.9469  
GMM median ARI: 0.9290

Representation sensitivityも中程度以上だが、preprocessing sensitivityはk=2より大きい。

Capped standard vs log1p:

- K-means: 0.5483
- GMM: 0.8282
- Ward: 0.4183

またsilhouetteはk=2より低い。

したがってk=6は **stable fine-structure probe** として残すが、position-type setへ昇格しない。

## Namua k=2

Trajectory resamplingだけを見ると同一algorithm内では安定している。

- K-means median ARI: 0.9579
- GMM: 1.0000

しかしこれはcross-method robustnessを意味しない。

Capped + log1p method agreement:

- K-means vs GMM: 0.0486
- K-means vs Ward: 0.3598
- GMM vs Ward: -0.0450

GMM k=2は約9.5% / 90.5%という極端にimbalancedな分割で、K-meansは約52.7% / 47.3%。同じk=2でも異なる構造を切っている。

さらにpreprocessing / representation sensitivityも大きい。

したがって **namua k=2をdiscrete type candidateへ昇格しない。**

K-means profileではmedian plyが30 vs 19.5と離れ、capture/mobility intensityにも差がある。Namua内部の進行gradientを切っている可能性を残す。

## Namua k=4

Capped + log1p method agreement:

- K-means vs GMM: 0.3765
- K-means vs Ward: 0.4823
- GMM vs Ward: 0.3942

Silhouetteは0.113–0.137程度。

Trajectory resampling:

- K-means median ARI: 0.9402
- GMM median ARI: 0.3744

GMM resamplingは二峰的に不安定で、preprocessing / representation sensitivityも大きい。

したがって **namua k=4もprovisional type setへ昇格しない。**

## Current interpretation

### Mtaji

```text
k=2 : robust relational-polarity candidate
k=6 : secondary stable fine-structure probe
```

重要: k=2はまだ「2種類の局面」とは断定しない。

次に必要なのは:

1. actor/opponent role swapでclusterがほぼ反転するか
2. centroid axis projectionが本当に二峰性を持つか、それとも連続gradientか
3. actor/opponent方向を消したswap-invariant morphologyでもcluster structureが残るか
4. consecutive trajectoryでlabelがside-to-move交代とともに機械的に反転していないか

### Namua

```text
no discrete cluster count promoted
k=2 / k=4 remain diagnostic only
```

Namuaは進行度・capture activity等のcontinuous gradientとして扱う可能性を優先して残す。

## Formal boundary

この結果から変更しないもの:

- final kは未選択
- position type名は未固定
- feature/preprocessingはformal freezeしていない
- held-out confirmatory seed blockには触れない
- playing style分析へまだ進まない
- Study 1 formal decisionsを変更しない
