# Stage 1 Mtaji Polarity / Discreteness Audit Result

更新日: 2026-08-10  
Status: **reference mtaji k=2 rejected as two discrete position types / continuous relational polarity interpretation retained / swap-invariant morphology k=2 promoted to new candidate / exploratory only**

研究: **Baoにおける局面類型と棋風の発見・検証**

## 1. Boundary

本auditはStage 1 exploratory pilot上のrobustness / interpretation auditである。

- formal experimentではない
- final cluster countを選択しない
- position type名を確定しない
- future held-out seedsへ触れない
- Study 1 formal decisionsを変更しない

Artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json
```

Audit hash:

`3ac4b402c122702682ccbca7fea4488694a6d89544f1632e951d23aa1613733d`

## 2. Reference mtaji k=2

Reference:

```text
S-pruned
phase = mtaji
game-phase-capped
log1p-standard
K-means k=2
```

Rows: 1,222

Cluster fractions:

- 0: 49.18%
- 1: 50.82%

Silhouette: 0.2328

このsplitは前auditで高いtrajectory / representation stabilityを示していた。

## 3. Role-swap result

Actor / opponent fieldsを交換した場合:

- cluster flip rate: 0.8175
- same-cluster rate: 0.1825
- original projection vs negative swapped projection correlation: 0.9063

したがってreference splitは強くactor/opponent orientationへ依存する。

完全な反転率1.0ではないため純粋な符号だけではないが、中心的signalはrelational polarityである。

## 4. Consecutive trajectory result

Full mtaji trajectory上のconsecutive eligible pairs:

- pair count: 1,406
- player flip rate: 1.0000
- cluster flip rate: 0.9011
- cluster flip given player flip: 0.9011

つまり手番playerが交代するたびにreference k=2 labelも約90%反転する。

これはstate-intrinsicな局面類型として望ましいpersistenceではなく、actor-to-moveから見た優劣orientationを表すsplitという解釈を強く支持する。

## 5. Axis discreteness

Centroid間axis projection:

- median: 0.0752
- p25: -2.9997
- p75: 3.0820
- standardized median: 0.0065

PlyとのSpearman correlation:

- rho = -0.0334
- p = 0.2437

したがって単純なgame-progress axisではない。

### 1D GMM

BIC:

- 1 component: 6643.23
- 2 components: 6510.18
- 3 components: 6491.15

2 componentsは1 componentより良いが、3 componentsがさらに良い。

### KDE

Detected peaks: 3

主要2 peak間のvalley-to-lower-peak density ratio:

`0.9699`

Valley densityがpeak densityの約97%残るため、二群間にdeep density gapは存在しない。

したがってreference k=2を**two discrete intrinsic position types**と解釈する根拠は不十分。

## 6. Reference k=2 decision

Stage 1 exploratory decision:

```text
reference mtaji k=2 != two discrete position types
```

より適切な現在の表現:

```text
continuous relational polarity axis with a stable sign-oriented partition
```

このaxis自体は有用なstate descriptorとなり得るが、type countには数えない。

## 7. Actor/opponent-invariant morphology

Actor/opponent orientationを消し、各primitiveを:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

へ変換した40-dimensional morphology representationで別途gridを実施した。

### k=2

Silhouette:

- K-means: 0.1962
- GMM: 0.1967
- Ward: 0.1963

Method agreement ARI:

- K-means vs GMM: 0.9197
- K-means vs Ward: 0.9134
- GMM vs Ward: 0.9935

Cluster fractionsは約57:43 / 59:41。

Condition NMIは約0.024–0.027で低い。

k=3以降ではmethod agreementが明確に低下する。

したがって、reference polarity splitとは別に、**swap-invariant morphology k=2** が新しいposition-type candidateとして現れた。

## 8. Important interpretation boundary

このinvariant k=2もまだposition typeとは確定しない。

次に確認すべきこと:

1. 80% trajectory resamplingで安定するか
2. full vs cappedで安定するか
3. representative boardsにstate-intrinsicな共通形があるか
4. consecutive trajectory上で一定のdwell / persistenceがあるか
5. 単なる`imbalance magnitude`のlow/high splitではないか
6. 単なるactivity intensityのlow/high splitではないか
7. reference polarity axisと独立したstructureか
8. invariant k=2 axis自体にもdeep density gapがあるか、それともcontinuous morphology gradientか

## 9. Namua

本auditはmtaji専用。

Namuaは引き続き:

```text
no discrete candidate
```

とし、後段でgradient-specific analysisを行う。

## 10. Current exploratory state

```text
mtaji reference k=2:
  robust relational polarity descriptor
  NOT counted as two position types

mtaji invariant morphology k=2:
  new provisional structural candidate
  not yet named / not yet frozen

namua:
  no discrete position-type candidate yet
```

次工程はmtaji invariant morphology k=2のstability / persistence / interpretability auditである。
