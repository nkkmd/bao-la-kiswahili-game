# Local first-player research

重いAI対戦実験はGitHub Actionsではなく、ローカル環境で実行します。GitHub Actionsは通常のlint・test・buildなど、短時間で終わるCIだけに使用します。

## 実行環境

- Node.js 24推奨
- リポジトリのルートディレクトリで実行
- 長時間実験ではスリープを無効化

## ローカル実験ランナー

```bash
node tools/experiments/run-first-player-research.js --study <name>
```

`<name>`には次を指定できます。

- `diagnostics`
- `random-openings`
- `game-start`
- `suite`
- `all`

出力済みのJSONは自動的にスキップされるため、中断後に同じコマンドで再開できます。最初から再実行する場合は`--force`を付けます。実行予定の確認だけを行う場合は`--dry-run`を付けます。

## MCTS完全条件だけを実行

```bash
node tools/experiments/run-first-player-research.js \
  --study suite \
  --only eval-mcts
```

条件は次のとおりです。

- 200局（50局×4バッチ）
- MCTS iterations: 400
- プレイアウト上限: 80手
- 最大対局長: 300手
- 標準初期局面から一様ランダム8手
- 評価プロファイル: `bao`

## 集計

全研究結果を集計します。

```bash
node tools/experiments/aggregate-first-player-research.js all
```

個別集計も可能です。

```bash
node tools/experiments/aggregate-first-player-research.js random-openings
node tools/experiments/aggregate-first-player-research.js game-start
node tools/experiments/aggregate-first-player-research.js suite
```

集計処理は必要なバッチ数と総対局数を検証し、不足がある場合は失敗します。

## 出力先

```text
artifacts/
├── first-player-study/
│   └── diagnostics.json
├── first-player-random-openings/
│   ├── *.json
│   └── summary.json
├── game-start-first-player/
│   ├── *.json
│   └── summary.json
└── first-player-suite/
    ├── *.json
    ├── symmetry.json
    └── summary.json
```

## 運用方針

- 大量対局、深い探索、MCTS、パラメータ比較はローカルで実施する。
- 各実験はバッチ分割し、完了済みJSONを残す。
- 条件、シード、出力形式はこのディレクトリのスクリプトで固定する。
- GitHub Actionsには大量対局を登録しない。
- 通常CIでAIを確認する場合は、数局のスモークテストに限定する。
