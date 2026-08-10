# Stage 1 First Clustering Diagnostic Result

更新日: 2026-08-10  
Status: **first diagnostic complete / exploratory only / no final cluster count / position types not named / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 位置づけ

本書は、96-game Stage 1 exploratory pilotのprimary eligible populationに対して実施した最初のclustering diagnosticの結果記録である。

この段階では:

- final cluster数を選ばない
- clusterをposition typeと同一視しない
- position type名を付けない
- playing styleを定義しない
- same pilot上の探索結果をconfirmationと呼ばない

Diagnostic artifact自身も:

- `formalExperiment: false`
- `exploratory: true`
- `finalClusterCountSelected: false`
- `positionTypesNamed: false`

を維持している。

Diagnostic hash:

`dc57cd1b5da3d1ff67c5a59bccef0f4bf9463bcc57296aaf48acec19b47243cf`

Source feature-audit hash:

`3a98b99dd5fbe1cf94a61124ad4687348cc2ce8ed49db450540ae6d236391129`

Environment:

- Python 3.12.3
- numpy 2.5.1
- pandas 3.0.5
- scikit-learn 1.9.0
- scipy 1.18.0

## 2. Diagnostic design

Representation:

- S-pruned only

Phase:

- namua / mtaji separate

Preprocessing:

- standard
- log1p-standard

Population view:

- full-unweighted
- game-phase-capped, max 20 positions / game × phase

Methods:

- K-means
- diagonal-covariance GMM
- Ward agglomerative

Diagnostic k:

- 2..10

Diagnostics:

- silhouette
- Calinski–Harabasz
- Davies–Bouldin
- cluster-size balance
- condition NMI
- GMM AIC / BIC
- method-pair ARI
- PCA explained variance

## 3. Mtaji — strong coarse two-way structure

Mtajiではk=2が4つのview/preprocessing条件すべてで最も高いsilhouetteを示した。

### Full-unweighted / log1p-standard

- K-means silhouette: 0.2201
- GMM silhouette: 0.2155
- Ward silhouette: 0.1961
- method-pair mean ARI: 0.6306
- minimum pairwise ARI: 0.5303

### Full-unweighted / standard

- K-means silhouette: 0.2134
- GMM silhouette: 0.2073
- Ward silhouette: 0.1948
- method-pair mean ARI: 0.6954
- minimum pairwise ARI: 0.6196

### Game-phase-capped / log1p-standard

- K-means silhouette: **0.2328**
- GMM silhouette: **0.2321**
- Ward silhouette: **0.2084**
- method-pair mean ARI: **0.7566**
- minimum pairwise ARI: **0.6775**
- K-means vs GMM ARI: 0.9041

Cluster fractionsもほぼbalancedであり、K-meansでは約49.2% / 50.8%。

Condition NMIは極小で、3手法とも約0.00004–0.00034の範囲である。

したがって、このk=2分割は少なくともgeneration condition labelの単純な再現ではない。

### Game-phase-capped / standard

- K-means silhouette: 0.2214
- GMM silhouette: 0.2163
- Ward silhouette: 0.1955
- mean ARI: 0.6702
- minimum ARI: 0.5914

以上から、**mtajiの粗い2-way partitionはfirst diagnosticで最も一貫したstructure**である。

ただし、盤面上の意味・代表局面・trajectory stabilityをまだ確認していないため、これを「2つのmtaji position types」とはまだ呼ばない。

## 4. Mtaji — finer structureの候補

k=5–8にも、特にgame-phase-capped / log1p-standardでmethod agreementが比較的高い領域がある。

### k=5

- mean method ARI: 0.6972
- minimum ARI: 0.6461
- K-means silhouette: 0.1738
- GMM silhouette: 0.1043
- Ward silhouette: 0.1491

### k=6

- mean method ARI: **0.7284**
- minimum ARI: **0.6994**
- K-means silhouette: 0.1578
- GMM silhouette: 0.1162
- Ward silhouette: 0.1249

### k=8

- mean method ARI: 0.6869
- minimum ARI: 0.6485

このため、mtajiでは:

1. coarse k=2 candidate
2. finer k=5–6 candidate family

の両方を次のstability / interpretability auditで見る価値がある。

First follow-upではk=6をfine-grained probeとして採用する。これはfinal cluster数の選択ではなく、k=5–6帯のうちmethod agreementが最も高かった代表probeである。

## 5. Mtaji — GMM information criteriaの注意

GMM AIC/BICは、多くのsettingでk範囲上限付近まで改善を続ける。

これを「10 typesが正しい」という証拠とは解釈しない。

Diagonal GMMは非Gaussian / continuous geometryをcomponent追加で近似し続けることがあるため、AIC/BIC単独でposition type数を決めないというprotocolを維持する。

## 6. Namua — k=2はcompactだがmethod-stableではない

Namuaでも各methodのsilhouette単独ではk=2が最も高いことが多い。

しかしmethod agreementが低い。

### Full-unweighted / log1p-standard, k=2

- K-means silhouette: 0.1879
- GMM silhouette: 0.2272
- Ward silhouette: 0.1520
- mean method ARI: 0.1930
- minimum ARI: 0.0626

### Game-phase-capped / log1p-standard, k=2

- K-means silhouette: 0.1732
- GMM silhouette: 0.2363
- Ward silhouette: 0.1357
- mean method ARI: 0.1211
- minimum ARI: -0.0450

つまり、異なるclustering objectiveが同じ2-way splitを再現していない。

このため、namua k=2をprovisional type candidateへ昇格しない。

## 7. Namua — k=4 diagnostic probe

Namuaで最も高いmethod agreementが得られたsettingの一つは:

- game-phase-capped
- log1p-standard
- k=4

である。

結果:

- mean method ARI: **0.4177**
- minimum pairwise ARI: **0.3760**
- K-means silhouette: 0.1368
- GMM silhouette: 0.1258
- Ward silhouette: 0.1126

k=2よりmethod agreementは高いが、separation自体は弱い。

したがってk=4は**namua structureのprobe**として残すが、provisional cluster countとはしない。

NamuaではS-pruned representationだけでfinal shortlistを作るより先にMatrix C / P sensitivityを行う。

## 8. Condition dependence

Diagnostic全体でcondition NMIは低い。

- mtaji: 約0.00004–0.036
- namua: 約0.010–0.049

したがってfirst diagnostic上、cluster assignmentが単純にB-D1 / B-D2 / B-D3 / LS-D2 / V2-D2 / LE-D2を再現している証拠は弱い。

ただし、condition occupancy差はtrajectory-level analysisでは意味を持つ可能性があるため、後のplaying-style研究とは分離して保持する。

## 9. PCA geometry

Log1p-standard, game-phase-cappedでは:

### Mtaji

- PC1: 約34.8%
- PC1–2 cumulative: 約53.0%
- PC1–5 cumulative: 約72.0%

### Namua

- PC1: 約32.1%
- PC1–2 cumulative: 約44.5%
- PC1–5 cumulative: 約69.0%

Mtajiの方が最初の2軸にgeometryが集中している。

これはmtajiのcoarse 2-way structureと整合的だが、PCA軸そのものをtype definitionにはしない。

## 10. 現時点のexploratory shortlist

### Mtaji

**Shortlist / not final:**

- k=2: coarse candidate
- k=6: fine-structure probe representing the k=5–6 family

### Namua

**No provisional cluster count yet.**

Diagnostic probes only:

- k=2: compactness probe
- k=4: best current method-agreement probe under capped + log1p

## 11. 次工程

次に同じpilot上で、confirmationではなくexploratory robustnessとして:

1. full vs game-phase-capped label stability
2. standard vs log1p label stability
3. Matrix S vs Matrix C level/contrast representation
4. Matrix S vs Matrix P raw-pit representation
5. trajectory-level resampling stability
6. cluster centroid/profile
7. representative positions
8. boundary positions
9. mtaji rare-house sensitivity

を監査する。

Mtaji k=2がこれらを通れば、初めてboard-level interpretationへ進める。

Namuaはrepresentation sensitivityでstructureが安定するかを先に確認する。

## 12. 維持するboundary

- mtaji k=2をまだposition typeとは呼ばない
- mtaji k=6をfinal cluster数とはしない
- namuaに無理にcluster数を与えない
- type名をまだ付けない
- condition名をtype名にしない
- cluster metric最大値だけでkを決めない
- same pilot上のstabilityをformal replicationとは呼ばない
- Stage 2 held-out confirmation seed blockは未使用のまま維持する
