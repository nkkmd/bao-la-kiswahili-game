# 局面類型と棋風研究 — 現在地

更新日: 2026-08-09  
Status: **Stage 0 complete / Stage 1 pilot + feature audit complete / first clustering diagnostic tooling ready / no final cluster decision / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md)
- [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)
- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RESULT.md`](STAGE_1_FEATURE_AUDIT_RESULT.md)
- [`STAGE_1_CLUSTER_DIAGNOSTIC_RUNBOOK.md`](STAGE_1_CLUSTER_DIAGNOSTIC_RUNBOOK.md)

## 現在地

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

完了済み:

1. Stage 0 repository / instrumentation / corpus audit
2. position-typology専用instrumentation
3. Stage 0 smoke + full verification + seat-symmetry audit
4. Stage 1 exploratory protocol
5. 96-game Stage 1 pilot
6. full replay / provenance / eligible-population audit
7. Python feature-table generation
8. feature redundancy / distribution audit
9. S-pruned first clustering diagnostic design
10. clustering diagnostic tooling + runbook

現在の停止点は **first clustering diagnosticのローカル実行前**。

まだ実施していない:

- first clustering diagnostic実行
- final cluster数選択
- provisional position-type命名
- Matrix C / P sensitivity
- representative / boundary position inspection
- trajectory-bootstrap stability
- playing-style分析
- Study 1 cross-study analysis
- formal confirmation

Stage 1はexploratoryでありpreregistrationではない。

## Study 1との固定境界

局面相転移点Study 1はclosed。過去のformal decision、`capture-branch-expansion` classifier / vocabulary、forced-capture regime、`sustained-forcing window`解釈境界、trajectory-ply sensitivityの位置づけを変更しない。

Study 1 formal corpusはinitial typology discoveryへ入れず、後半のcross-study analysisでのみ使用する。

## Stage 1 pilot population

Primary definition:

```text
terminal == false
ply >= 8
```

- eligible positions: 4,834
- unique rule states: 4,834
- seat-canonical unique: 4,834
- namua: 3,339
- mtaji: 1,495
- primary duplicate positions: 0
- rule states shared across trajectories: 0

96 gamesは全trajectory / openingがunique。95 / 96 terminal、1 / 96 max-ply truncated。

## Feature audit result

Environment:

- Python `3.12.3`
- numpy `2.5.1`
- pandas `3.0.5`
- scikit-learn / scipy / matplotlib: feature-audit時点では未導入

### Deterministic redundancy

両phaseで:

- `boardSeeds = frontSeeds + backSeeds`
- `occupiedPits = frontOccupied + backOccupied`
- `meanChainEvents = meanCaptureEvents + meanRelayEvents`
- global totalsはactor/opponent absoluteから導出可能
- 全`difference.*`はactor − opponentから導出可能

これらをabsolute primitivesと同時にbaseline matrixへ重複投入しない。

### Namua

- constant columns: none
- exact duplicate columns: none
- high correlation `|r| >= 0.98`: actor.reserve vs opponent.reserve only
- `r = 0.9953556712`

First baselineではreserve pairを:

```text
reserveTotal
reserveDifference
```

へ置換する。

### Mtaji

Constant:

- actor.reserve = 0
- opponent.reserve = 0
- difference.reserve = 0
- global.boardSeedCount constant

Reserveはbaselineから除外。

`houseOwned`は非常にrare:

- actor true ≈ 1.27%
- opponent true ≈ 0.67%

Simple z-scoreでrare eventを過剰強調しないため、mtaji baselineから外しrare-house sensitivityへ回す。

### Skew

Relay / chain / capturable seeds / pit variance / concentration等に強いpositive skewがある。

そのためfirst diagnosticで:

- `standard`
- `log1p-standard`

を比較する。

Binaryは0/1のままscaleしない。

## First clustering diagnostic

Representation:

- **S-pruned only**
- Matrix C: deferred sensitivity
- Matrix P: deferred sensitivity

Phase:

- namua / mtaji separate

Population views:

1. full unique-position unweighted
2. deterministic game × phase capped subsample

Capped subsample:

- maximum 20 positions per game × phase
- selection by ruleStateKey SHA-256 lexical order
- feature / cluster result independent

Methods:

- K-means
- diagonal-covariance GMM
- Ward agglomerative

Diagnostic k:

```text
2..10
```

Preprocessing:

- standard
- log1p-standard

Diagnostics:

- silhouette
- Calinski–Harabasz
- Davies–Bouldin
- cluster size balance
- condition NMI / composition
- K-means inertia
- GMM AIC / BIC
- method-pair ARI
- PCA explained variance

単一metric最大のkを自動採用しない。

## 次のローカル作業

既存venv:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

Feature audit時点でscikit-learnがないため追加:

```bash
python -m pip install scikit-learn
```

Repository:

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only

python -m py_compile tools/experiments/analyze-position-typology-stage1-clusters.py
python tools/experiments/analyze-position-typology-stage1-clusters.py
```

共有対象:

```text
artifacts/local/position-typology/stage1-pilot-v1/clustering-diagnostic-v1/clustering-diagnostic.json
```

## 次のdecision point

First diagnosticをinspectionしてから:

- provisional S-pruned solution shortlist
- k landscape
- method agreement
- preprocessing / balance sensitivity
- mtaji rare-house sensitivity
- Matrix C sensitivity
- Matrix P sensitivity
- representative / boundary positions
- trajectory bootstrap stability

を判断する。

まだposition type名は付けず、Stage 2 confirmationへも進まない。

## 重要原則

- position typeとplaying styleを分離する
- AI実装条件をposition type / 棋風名にしない
- 勝率やAI評価値を類型定義にしない
- raw ply数を独立標本数とみなさない
- condition-specific occupancyをcluster geometryへ無批判に重み付けしない
- exploratory selectionを同じpilot上でconfirmationと呼ばない
- Study 1 formal decisionsを変更しない
- formal corpusをGitHub Actionsで生成しない
