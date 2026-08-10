# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 1 mtaji polarity audit complete / relational k=2 rejected as two discrete types / swap-invariant morphology k=2 candidate identified / invariant morphology audit tooling ready / no final cluster decision / no formal confirmation authorized**

Branch: `research/position-typology-and-playing-style`

主要文書:

- [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)
- [`STAGE_1_EXPLORATORY_PROTOCOL.md`](STAGE_1_EXPLORATORY_PROTOCOL.md)
- [`STAGE_1_PILOT_RESULT.md`](STAGE_1_PILOT_RESULT.md)
- [`STAGE_1_FEATURE_AUDIT_RESULT.md`](STAGE_1_FEATURE_AUDIT_RESULT.md)
- [`STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md`](STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md)
- [`STAGE_1_STABILITY_AUDIT_RESULT.md`](STAGE_1_STABILITY_AUDIT_RESULT.md)
- [`STAGE_1_POLARITY_AUDIT_RESULT.md`](STAGE_1_POLARITY_AUDIT_RESULT.md)
- [`STAGE_1_INVARIANT_MORPHOLOGY_RUNBOOK.md`](STAGE_1_INVARIANT_MORPHOLOGY_RUNBOOK.md)

## 現在地

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

完了済み:

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory pilot
3. full replay / provenance / eligible-population audit
4. Python feature-table generation
5. redundancy / distribution audit
6. S-pruned clustering diagnostic k=2..10
7. candidate stability / representation audit
8. representative / boundary position extraction
9. mtaji relational-polarity vs discreteness audit
10. actor/opponent-invariant morphology exploratory grid
11. mtaji invariant morphology follow-up tooling

現在の停止点は **mtaji invariant morphology k=2 auditのローカル実行前**。

まだ実施していない:

- invariant morphology stability / persistence audit実行
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

## Polarity audit artifact

```text
artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json
```

Audit hash:

`3ac4b402c122702682ccbca7fea4488694a6d89544f1632e951d23aa1613733d`

Boundary:

- `formalExperiment: false`
- `exploratory: true`
- `finalClusterCountSelected: false`
- `positionTypesNamed: false`
- future held-out seeds untouched

## Mtaji reference S-pruned k=2 — decision

Reference:

```text
S-pruned
mtaji
game-phase-capped
log1p-standard
K-means k=2
```

このsplitはstability上は非常に強かったが、polarity auditでstate-intrinsic discrete typesではない可能性が強まった。

### Role swap

- cluster flip rate: 0.8175
- same-cluster rate: 0.1825
- original projection vs negative swapped projection correlation: 0.9063

### Consecutive trajectory

- consecutive pairs: 1,406
- player flip rate: 1.0000
- cluster flip rate: 0.9011

したがってplayer-to-move交代とreference label反転が強く同期する。

### Axis density

1D centroid-axis GMM BIC:

- 1 component: 6643.23
- 2 components: 6510.18
- 3 components: 6491.15

KDE:

- peak count: 3
- major two-peak valley / lower-peak density ratio: 0.9699

二つのpeak間にdeep density valleyは存在しない。

PlyとのSpearman rhoは -0.0334で、単純なgame-progress axisでもない。

### Current interpretation

```text
reference mtaji k=2 = continuous relational polarity axis with stable sign-oriented partition
```

**two discrete position typesとしては採用しない。**

このaxis自体は後にplaying-style trajectory coordinateとして有用な可能性があるが、type countには数えない。

## Mtaji swap-invariant morphology k=2

Actor/opponent orientationを消したrepresentation:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

40 dimensions。

Capped population 1,222 rowsでk=2:

Silhouette:

- K-means: 0.1962
- GMM: 0.1967
- Ward: 0.1963

Method agreement ARI:

- K-means vs GMM: 0.9197
- K-means vs Ward: 0.9134
- GMM vs Ward: 0.9935

Cluster fractionsはおよそ57:43 / 59:41。

Condition NMIは約0.024–0.027。

k=3以降ではmethod agreementが低下する。

したがって現在の新しい候補は:

```text
mtaji invariant morphology k=2 = provisional structural candidate
```

ただしまだposition typeとは命名しない。

## 次audit — invariant morphology

実装:

```text
tools/experiments/analyze-position-typology-stage1-invariant-morphology.py
```

Runbook:

```text
doc/position-typology/STAGE_1_INVARIANT_MORPHOLOGY_RUNBOOK.md
```

検査内容:

1. K-means / GMM / Ward method agreement
2. full vs game-phase-capped stability
3. 80% trajectory resampling × 40
4. actor/opponent swap invariance numerical check
5. consecutive trajectory persistence / dwell runs
6. representative / boundary positions
7. `imbalanceMagnitude`単独で説明できるか
8. `activityMagnitude`単独で説明できるか
9. reference relational polarity k=2とのARI / NMI
10. invariant centroid-axisの1D GMM / KDE discreteness

## Namua

引き続き:

```text
no discrete position-type candidate
```

k=2 / k=4は同一method内で一部stableでもcross-method agreementが弱い。

後段でcontinuous gradient-specific analysisを行う。

## 次のローカル作業

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage1-invariant-morphology.py
python tools/experiments/analyze-position-typology-stage1-invariant-morphology.py
```

追加package installは不要。

共有対象:

```text
artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json
```

## 次のdecision point

### Intrinsic discrete morphology candidate

trajectory resampling / full-capped / persistence / representativesが強く、single scalar magnitudeでは説明できず、density separationも一定程度あるなら:

> mtaji invariant k=2をboard-level provisional type setへ昇格する余地がある。

### Continuous intrinsic morphology coordinate

clusterがstableでもdensity gapが浅く、imbalance/activity magnitudeでほぼ説明されるなら:

> discrete typeではなくcontinuous intrinsic morphology coordinateとして扱う。

### Negative result

representation / trajectory changesで崩れるなら:

> mtajiについてもStage 1 pilotから離散position typeは発見されなかった、と記録する。

## 重要原則

- position typeとplaying styleを分離する
- robust clusteringを自動的にdiscrete ontologyへ変換しない
- actor-to-move polarityをintrinsic board typeと混同しない
- raw plyを独立標本とみなさない
- same-pilot robustnessをformal replicationと呼ばない
- final k / type名をpilot上でformal freezeしない
- Study 1 formal decisionsを変更しない
- future held-out seed blockには触れない
