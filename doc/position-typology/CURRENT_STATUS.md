# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 1 candidate stability audit complete / mtaji k=2 robust relational-polarity candidate / namua no discrete candidate / mtaji polarity-discreteness audit tooling ready / no final cluster decision / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)
- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RESULT.md`](STAGE_1_FEATURE_AUDIT_RESULT.md)
- [`STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md`](STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md)
- [`STAGE_1_STABILITY_AUDIT_RESULT.md`](STAGE_1_STABILITY_AUDIT_RESULT.md)
- [`STAGE_1_POLARITY_AUDIT_RUNBOOK.md`](STAGE_1_POLARITY_AUDIT_RUNBOOK.md)

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
8. candidate stability / representation audit
9. representative / boundary position extraction
10. mtaji k=2 polarity-vs-discreteness audit design + tooling

現在の停止点は **mtaji polarity / discreteness auditのローカル実行前**。

まだ実施していない:

- mtaji polarity / discreteness audit実行
- final cluster数選択
- provisional position-type命名
- namua gradient-specific follow-up
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

## Candidate stability artifact

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

## Mtaji k=2 — current strongest structure

Reference:

```text
S-pruned
phase = mtaji
game-phase-capped
log1p-standard
k = 2
```

### Same-representation

- K-means silhouette: 0.2328
- GMM silhouette: 0.2321
- Ward silhouette: 0.2084
- K-means vs GMM ARI: 0.9041
- K-means vs Ward ARI: 0.6883
- GMM vs Ward ARI: 0.6775
- condition NMI ≈ 0
- K-means cluster fractions ≈ 49.2% / 50.8%

### Cross-view

log1p-standard full vs capped:

- K-means: 0.9515
- GMM: 0.8459
- Ward: 0.5541

### Cross-preprocessing

capped standard vs log1p:

- K-means: 0.9073
- GMM: 0.8131
- Ward: 0.5763

### Cross-representation

S-pruned vs P-raw-pits:

- K-means: 0.9515
- GMM: 0.8671
- Ward: 0.4970

S-pruned vs C-level-contrast:

- K-means: 0.7466
- GMM: 0.8489
- Ward: 0.6143

### Trajectory resampling

80% games × 40 repetitions:

K-means:

- min 0.9356
- p10 0.9451
- median 0.9707
- p90 0.9902

GMM:

- min 0.7723
- p10 0.8369
- median 0.9387
- p90 0.9782

### Rare house

Rare mtaji `houseOwned`を戻すと:

- K-means ARI: 1.0000
- Ward ARI: 1.0000
- GMM ARI: 0.2125

したがってk=2 signalはK-means / Wardでは維持されるが、GMM component interpretationはrare featureに敏感。

## Mtaji k=2 interpretation boundary

Representative profileでは2群の主要effectがほぼ符号反転する。

一方:

- actor front seeds / front occupancy / reusable pits / connectionsが高い
- opponent側が低い

他方はその逆。

Median plyは52 vs 51でほぼ同じ。

したがって、単純なmtaji進行stageではない一方、

> **actor優勢 ↔ opponent優勢という単一relational polarity axisを2分割しただけ**

という可能性が残る。

現在の表現は:

```text
mtaji k=2 = robust relational-polarity candidate
```

であり、まだ:

```text
2 position types
```

とは呼ばない。

## Mtaji k=6

Fine-structure probeとして残る。

Capped + log1p method agreement:

- K-means vs GMM: 0.7864
- K-means vs Ward: 0.6897
- GMM vs Ward: 0.7042

Trajectory resampling median:

- K-means: 0.9469
- GMM: 0.9290

ただしpreprocessing sensitivityがk=2より大きく、silhouetteも低い。

Status:

```text
secondary stable fine-structure probe only
```

## Namua

### k=2

同一algorithm内trajectory resamplingは安定するが、cross-method agreementが弱い。

Capped + log1p:

- K-means vs GMM: 0.0486
- K-means vs Ward: 0.3598
- GMM vs Ward: -0.0450

GMMは約9.5% / 90.5%、K-meansは約52.7% / 47.3%を切り、同じk=2でも同じ構造ではない。

K-means median plyも30 vs 19.5で離れる。

### k=4

Capped + log1p:

- method ARI ≈ 0.377–0.482
- silhouette ≈ 0.113–0.137

Trajectory resampling:

- K-means median: 0.9402
- GMM median: 0.3744

したがって:

```text
namua = no discrete cluster count promoted
```

進行度 / capture activity等のcontinuous gradientとして扱う可能性を優先して残す。

## 次audit — mtaji polarity / discreteness

実装:

```text
tools/experiments/analyze-position-typology-stage1-polarity.py
```

Runbook:

```text
doc/position-typology/STAGE_1_POLARITY_AUDIT_RUNBOOK.md
```

次に検査する:

1. actor/opponent role swapでk=2 labelが反転するか
2. centroid-axis projectionが二峰性かcontinuousか
3. 1D GMM / KDE / marginでdensity separationを記述
4. actor/opponent directionを消したtotal + absolute-difference representation上で構造が残るか
5. consecutive mtaji plyでclusterがplayer-to-move交代と機械的にflipするか

## 次のローカル作業

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage1-polarity.py
python tools/experiments/analyze-position-typology-stage1-polarity.py
```

追加package installは不要。

共有対象:

```text
artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json
```

## 次のdecision point

### Polarity-axis interpretation

role swapでほぼ完全反転し、projectionが連続的で、swap-invariant representationで強いk=2が消えるなら:

> k=2は二つのposition typeではなく一つのrelational polarity axisとして扱う。

### Discrete morphology remains plausible

role swapだけでは説明できず、density gapとswap-invariant cluster structureが残るなら:

> mtaji k=2をboard-level provisional type setへ昇格する余地がある。

### Mixed

両方ならpolarity coordinateとintrinsic morphologyを二層化する。

## 重要原則

- position typeとplaying styleを分離する
- AI implementation conditionをtype / style名にしない
- raw plyを独立標本とみなさない
- same-pilot robustnessをformal replicationと呼ばない
- GMM rare-feature sensitivityを無視しない
- final k / type名をpilot上でformal freezeしない
- Study 1 formal decisionsを変更しない
- future held-out seed blockには触れない
