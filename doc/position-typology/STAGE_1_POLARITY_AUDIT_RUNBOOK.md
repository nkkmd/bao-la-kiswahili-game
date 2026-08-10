# Stage 1 Mtaji Polarity / Discreteness Audit Runbook

更新日: 2026-08-10  
Status: **exploratory local audit / no final cluster selection / no position-type naming**

## 目的

Candidate stability auditでmtaji k=2は高いsame-pilot robustnessを示した。

ただし2群のprofile effectがほぼ符号反転しており、次の二つを区別する必要がある。

1. 二つの独立した局面形態（discrete morphology）
2. actor優勢 ↔ opponent優勢という単一のcontinuous polarity axisの向き違い

このrunはこの区別だけを行う。

新しいposition typeを命名しない。final kを決めない。held-out seedsには触れない。

## 前提

Repository rootで実行する。

Branch:

```text
research/position-typology-and-playing-style
```

既存venv:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

必要packageは既存の:

- numpy
- pandas
- scipy
- scikit-learn

のみ。

追加installは不要。

## 入力

Feature table:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/eligible-primary-rule-state.csv
```

Feature audit:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/feature-audit.json
```

Candidate stability:

```text
artifacts/local/position-typology/stage1-pilot-v1/stability-audit-v1/candidate-stability.json
```

## 実行

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage1-polarity.py
python tools/experiments/analyze-position-typology-stage1-polarity.py
```

## Reference solution

固定するのはexploratory referenceとしてのみ:

```text
phase              = mtaji
representation     = S-pruned
population         = game-phase-capped
preprocessing      = log1p-standard
method             = K-means
k                  = 2
cap/game/phase     = 20
```

これはformal freezeではない。

## Audit A — role-swap polarity

同じfeature rowについてactor/opponent columnsを交換し、reference K-meansへ再投入する。

出力:

- `clusterFlipRate`
- `sameClusterRate`
- original projection vs negative swapped projection correlation
- projection symmetry error

もしactor/opponent swapでほぼ必ずclusterが反転するなら、k=2は「二つのintrinsic morphology」というよりrelational orientation pairである可能性が高い。

## Audit B — centroid-axis discreteness

K-means k=2 centroid differenceを1D axisとして各positionを射影する。

出力:

- projection quantiles
- 1/2/3-component 1D GMM AIC/BIC
- KDE peak count
- major two peaksの間のvalley depth
- centroid-distance margin distribution
- plyとのSpearman相関（descriptive only）

単一metricで二峰性を判定しない。

特に:

- GMM BICだけでtypeを確定しない
- KDE bandwidth依存性を忘れない
- silhouetteがmoderateであることを維持して解釈する

## Audit C — actor/opponent-invariant morphology

actor/opponentの向きを消したrepresentationを作る。

各primitiveについて:

```text
total = actor + opponent
absDifference = abs(actor - opponent)
```

を用いる。

forcedCaptureもtotal / absDifferenceへ変換する。

これにより「どちら側が強いか」という符号を消し、「盤面全体の量」と「非対称性の大きさ」だけを残す。

このswap-invariant representation上で:

- K-means
- diagonal GMM
- Ward
- k=2..8
- silhouette
- method agreement ARI
- condition NMI

を探索diagnosticとして計算する。

ここで安定した構造が残れば、orientation polarityとは別のintrinsic morphology候補となる。

## Audit D — consecutive trajectory

Reference K-means modelをfull mtaji positionsへ適用し、同一gameの連続plyについて:

- cluster flip rate
- player-to-move flip rate
- player flip時のcluster flip rate

を記録する。

clusterがside-to-move交代とほぼ機械的に反転する場合、k=2を二つのstatic board typesとして解釈しない。

## 出力

```text
artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json
```

## 共有対象

実行後、次の1ファイルだけ共有する。

```text
artifacts/local/position-typology/stage1-pilot-v1/polarity-audit-v1/mtaji-polarity-audit.json
```

## Decision boundary

このaudit後に判断できるのは次のいずれか。

### A. polarity-axis interpretation

- role swapでほぼ完全反転
- projectionが連続的
- swap-invariant representationでは強いk=2が消える

なら:

> mtaji k=2は二つのposition typeではなく、一つのrelational polarity axisのorientationとして扱う。

### B. discrete morphology remains plausible

- role swapだけでは説明できない
- projectionに明確なdensity separationがある
- invariant representationにも対応するstable structureが残る

なら:

> mtaji k=2をboard-level provisional type setへ昇格する余地がある。

### C. mixed structure

orientation polarityとintrinsic morphologyが重なっている場合は、二層表現として設計し直す。

いずれの場合も、このpilot上ではformal confirmationとは呼ばない。
