# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 1 first clustering diagnostic complete / mtaji coarse candidate identified / namua unresolved / stability audit tooling ready / no final cluster decision / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)
- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RESULT.md`](STAGE_1_FEATURE_AUDIT_RESULT.md)
- [`STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md`](STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md)
- [`STAGE_1_STABILITY_AUDIT_RUNBOOK.md`](STAGE_1_STABILITY_AUDIT_RUNBOOK.md)

## 現在地

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

完了済み:

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory pilot
3. full replay / provenance / eligible-population audit
4. Python feature-table generation
5. redundancy / distribution audit
6. S-pruned first clustering diagnostic, k=2..10
7. first diagnostic result interpretation
8. candidate stability / representation audit tooling

現在の停止点は **candidate stability / representation auditのローカル実行前**。

まだ実施していない:

- candidate stability audit実行
- board-level representative inspection
- provisional position-type命名
- final cluster数選択
- playing-style分析
- Study 1 cross-study analysis
- formal confirmation

Stage 1はexploratoryでありpreregistrationではない。

## Study 1との固定境界

局面相転移点Study 1はclosed。過去のformal decisions、classifier / vocabulary、forced-capture regime、`sustained-forcing window`解釈境界、trajectory-ply sensitivityの位置づけを変更しない。

Study 1 formal corpusはinitial typology discoveryへ入れない。

## Primary Stage 1 population

```text
terminal == false
ply >= 8
```

- eligible unique rule states: 4,834
- namua: 3,339
- mtaji: 1,495
- seat-canonical collapse: 0
- states shared across trajectories: 0

## Feature policy

Baseline S-prunedはdeterministic redundancyを除いたactor / opponent structural primitives。

Namua reserve pairは:

```text
reserveTotal
reserveDifference
```

へ置換。

Mtaji reserveはconstant 0のため除外。Rare `houseOwned`もbaselineから除外しsensitivityへ回した。

Binaryは0/1のまま、continuousはstandard / log1p-standardを比較した。

## First clustering diagnostic

Artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/clustering-diagnostic-v1/clustering-diagnostic.json
```

Diagnostic hash:

`dc57cd1b5da3d1ff67c5a59bccef0f4bf9463bcc57296aaf48acec19b47243cf`

Boundary:

- `formalExperiment: false`
- `exploratory: true`
- `finalClusterCountSelected: false`
- `positionTypesNamed: false`

Environment:

- Python 3.12.3
- numpy 2.5.1
- pandas 3.0.5
- scikit-learn 1.9.0
- scipy 1.18.0

## Mtaji result

### Coarse k=2 candidate

k=2は4 view/preprocessing conditionsで一貫して最上位silhouette。

Game-phase-capped + log1p-standard:

- K-means silhouette: 0.2328
- GMM silhouette: 0.2321
- Ward silhouette: 0.2084
- mean method ARI: 0.7566
- minimum pairwise ARI: 0.6775
- K-means vs GMM ARI: 0.9041
- condition NMI: approximately 0

Cluster sizeもほぼbalanced。

このため **mtaji k=2をcoarse candidateとしてshortlist** する。

ただしboard interpretation未実施のため、まだposition typeとは呼ばない。

### Fine structure probe

Capped + log1p:

- k=5 mean method ARI: 0.6972, min 0.6461
- k=6 mean method ARI: 0.7284, min 0.6994

k=6をk=5–6 familyのfine-structure probeとして次auditへ残す。

これはfinal kの選択ではない。

## Namua result

### k=2

Silhouette単独では比較的高いがmethod agreementが弱い。

Capped + log1p:

- K-means silhouette: 0.1732
- GMM silhouette: 0.2363
- Ward silhouette: 0.1357
- mean method ARI: 0.1211
- minimum ARI: -0.0450

したがってk=2をprovisional candidateへ昇格しない。

### k=4 probe

Capped + log1p:

- K-means silhouette: 0.1368
- GMM silhouette: 0.1258
- Ward silhouette: 0.1126
- mean method ARI: 0.4177
- minimum ARI: 0.3760

Method agreementは改善するがseparationは弱い。

**Namuaにはまだprovisional cluster countを与えない。**

k=2とk=4をrepresentation sensitivity probeとしてのみ残す。

## Condition dependence

First diagnostic全体のcondition NMIは低い。

- mtaji: approximately 0.00004–0.036
- namua: approximately 0.010–0.049

したがってclustersがgeneration condition labelそのものを再現している証拠は弱い。

## PCA

Game-phase-capped + log1p-standard:

### Mtaji

- PC1 ≈ 34.8%
- PC1–2 ≈ 53.0%
- PC1–5 ≈ 72.0%

### Namua

- PC1 ≈ 32.1%
- PC1–2 ≈ 44.5%
- PC1–5 ≈ 69.0%

PCAはdiagnosticのみでtype definitionには使わない。

## Current exploratory candidate set

### Mtaji

```text
k=2 : coarse candidate
k=6 : fine-structure probe representing k=5–6 family
```

### Namua

```text
no provisional cluster count
k=2 : compactness probe only
k=4 : method-agreement probe only
```

## Stability audit tooling

実装済み:

```text
tools/experiments/analyze-position-typology-stage1-stability.py
```

Runbook:

```text
doc/position-typology/STAGE_1_STABILITY_AUDIT_RUNBOOK.md
```

次auditは:

- full vs capped label ARI
- standard vs log1p label ARI
- S-pruned vs C-level-contrast
- S-pruned vs P-raw-pits
- mtaji rare-house sensitivity
- 80% trajectory resampling × 40 repetitions
- K-means representative positions
- boundary positions
- standardized profile effects

を出力する。

## 次のローカル作業

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage1-stability.py
python tools/experiments/analyze-position-typology-stage1-stability.py
```

共有対象:

```text
artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1/candidate-stability.json
```

`candidate-assignments.csv`はローカル保持。

## 次のdecision point

Candidate stability結果から:

### Mtaji

- k=2をboard-level provisional candidateへ昇格できるか
- k=6がstable finer subdivisionとして残るか

### Namua

- representation changeでstructureが安定化するか
- k=2 / k=4のどちらかを残せるか
- またはcontinuous gradientとして扱うべきか

を判断する。

まだtype名は付けず、Stage 2へも進まない。

## 重要原則

- position typeとplaying styleを分離する
- AI implementation conditionをtype / style名にしない
- raw plyを独立標本とみなさない
- condition occupancyを無批判にdistance weightへしない
- same-pilot robustnessをformal replicationと呼ばない
- Study 1 formal decisionsを変更しない
- future held-out seedsへ触れない
