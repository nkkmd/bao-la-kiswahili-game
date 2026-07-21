# 局面相転移点研究

このディレクトリは、`doc/PHASE_TRANSITION_RESEARCH_PLAN.md` に基づく研究記録を保存する。

## 現在の段階

10局diversity smokeが多様性ゲートを通過したため、同じ条件を固定した100局パイロットへ進む。

- 固定seed
- C0相当の固定条件
- 標準初期局面の決定論的基準対局
- seed付き合法開局による局面分散
- 1局単位の原子的保存
- 完了済み局の再利用
- 設定変更時の再開拒否
- JSONL、ゲーム要約、manifestの生成
- 成果物SHA-256検証
- 軌跡hashと重複率の監査

## 既存の決定論的smoke run

旧smoke runは、標準初期局面からC0同士を10局実行した結果、全局が同一の48 ply軌跡へ収束した。

この成果物は削除せず、標準初期局面の決定論的基準線として保持する。

```text
artifacts/phase-transition/smoke/
```

## 10局diversity smoke run

リポジトリのルートで実行する。

```bash
node tools/experiments/run-phase-transition-research.js
```

既定条件:

```text
profile: diversity-smoke
games: 10
base seed: 20260721
max ply: 180
baseline games: 1
seeded opening plies: 6
condition: C0
level: hard
evaluator: bao
search: phase2
max depth: 2
time limit: fixed time limitなし
```

1局目は標準初期局面からC0のみで進める基準対局とする。2局目以降は、最初の6 plyを固定seed付きで合法手から選び、その後をC0へ接続する。

出力:

```text
artifacts/phase-transition/diversity-smoke/
├── games/
│   ├── game-0000.json
│   └── ...
├── observations.jsonl
├── games.json
└── manifest.json
```

## 100局パイロット

パイロットは明示的に`pilot`プロファイルを選択して実行する。

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot
```

既定条件はdiversity smokeと同じで、対局数と出力先だけをパイロット用に変更する。

```text
profile: pilot
games: 100
base seed: 20260721
max ply: 180
baseline games: 1
seeded opening plies: 6
condition: C0
level: hard
evaluator: bao
search: phase2
max depth: 2
time limit: fixed time limitなし
```

出力:

```text
artifacts/phase-transition/pilot/
├── games/
│   ├── game-0000.json
│   └── ...
├── observations.jsonl
├── games.json
└── manifest.json
```

ゲームIDは`pt-pilot-0000`形式となる。対局数や出力先を試験目的で変更する場合は、プロファイル指定後に引数で上書きできる。

```bash
node tools/experiments/run-phase-transition-research.js \
  --profile pilot \
  --games 5 \
  --output artifacts/phase-transition/pilot-test
```

各ゲーム要約には次を記録する。

- `baseline`
- `openingPliesApplied`
- `openingStateHash`
- `trajectoryHash`
- `winner`
- `plies`

manifestの`diversity`には次を記録する。

- `uniqueTrajectoryCount`
- `uniqueFinalStateCount`
- `uniquePlyCount`
- `duplicateTrajectoryCount`
- `largestTrajectoryGroup`
- `dominantTrajectoryRate`
- `winnerCounts`
- `plyDistribution`
- `passesPilotGate`

## 多様性ゲート

smoke runから100局パイロットへ進む最低条件は次とする。

- 固有軌跡が2種類以上ある。
- 最大の同一軌跡群が全体の50%以下である。
- 対局長または最終局面のどちらかが2種類以上ある。

これは統計的十分性を意味せず、同一対局の単純複製を防ぐための最低条件である。

## 進捗確認

実行中のプロファイルと同じ引数を指定する。

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot --status
```

## 中断後の再開

同じコマンドを再実行する。完了済みのゲームファイルは検証後にスキップされる。

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot
```

profile、source、条件、seed、対局数、最大ply、開局ply数などから作られる設定hashが異なる場合、既存成果物からの再開を拒否する。

## 最初から再実行

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot --force
```

`--force`は指定した出力ディレクトリを削除して再生成するため、必要な成果物を退避してから使用する。

## 成果物検証

```bash
node tools/experiments/verify-phase-transition-artifacts.js \
  --input artifacts/phase-transition/pilot
```

検証器は次を確認する。

- 必須ファイル
- JSONL構文
- 観測件数
- ゲーム件数
- ファイルSHA-256
- `gameId + ply`の重複
- plyの連続性
- `previousStateHash`の連鎖
- 最終state hash
- trajectory hash
- 開局メタデータ
- manifestの多様性集計
- 特徴量の基本整合性

## Colab監査

検証済みの`observations.jsonl`をGoogle Colabへアップロードし、次を実行する。

```text
notebooks/phase-transition/01-data-audit.ipynb
```

Notebookの既定入力先:

```text
/content/observations.jsonl
```

100局パイロットでは統計的な最終結論を出さず、相転移候補の可視化方法、局面特徴量の分布、namuaからmtajiへの遷移、対局長、勝者分布、重複軌跡率を確認し、正式実験の条件と分析手順を固定する。
