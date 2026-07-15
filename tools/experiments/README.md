# Local first-player research

重いAI対戦実験はGitHub Actionsではなく、ローカル環境で実行します。GitHub Actionsは通常のlint・test・buildなど、短時間で終わるCIだけに使用します。

## 実行環境

- Node.js 24推奨
- リポジトリのルートディレクトリで実行
- 長時間実験ではスリープを無効化

## 共有開局によるペア追試

`PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md`の追試は、開局生成、継続対局、集計を分離して実行します。主コーパスは結果を見る前のコミットで固定してください。

```bash
node tools/experiments/generate-opening-corpus.js \
  --count 200 \
  --plies 8 \
  --policy uniform \
  --unique \
  --stratify first-move \
  --seed 20260716 \
  --output artifacts/paired-first-player/2026-07/corpus/uniform-8ply-unique-v1.jsonl
```

生成器は200件の非終局・ユニーク開局を作り、4初手を各50件に層化します。同じディレクトリへ`manifest.json`と`rejected.jsonl`も保存し、コーパス本体のSHA-256、採否件数、主要ソースのSHA-256をmanifestへ記録します。

Phase 0の12開局fixture、Phase 1の40開局、Phase 2の200開局は次のプロファイルで実行します。

```bash
node tools/experiments/run-paired-first-player-research.js \
  --profile fixture \
  --corpus artifacts/paired-first-player/2026-07/corpus/uniform-8ply-unique-v1.jsonl

node tools/experiments/run-paired-first-player-research.js \
  --profile screening \
  --corpus artifacts/paired-first-player/2026-07/corpus/uniform-8ply-unique-v1.jsonl

node tools/experiments/run-paired-first-player-research.js \
  --profile confirmatory \
  --corpus artifacts/paired-first-player/2026-07/corpus/uniform-8ply-unique-v1.jsonl
```

各開局では`C0`、`D1`、`D3`、`D4`、`EL`、`EV2`、`SM`を決定的にシャッフルした順で実行します。1条件終了ごとに`partials/`を原子的に更新し、7条件が揃うと`blocks/`の完全ブロックへ昇格します。同じコマンドで再開でき、ソース、Node.js、コーパス、条件設定のいずれかが変わっていれば再開を拒否します。

進捗確認と診断用の単一条件実行:

```bash
node tools/experiments/run-paired-first-player-research.js \
  --profile screening --status

node tools/experiments/run-paired-first-player-research.js \
  --profile screening --only-condition SM
```

`--only-condition`の結果はpartialに留まり、7条件の完全ブロックが揃うまでは完了数に含めません。

完全ブロックだけを検証・集計します。

```bash
node tools/experiments/aggregate-paired-first-player-research.js \
  --input artifacts/paired-first-player/2026-07/confirmatory \
  --output artifacts/paired-first-player/2026-07/summary.json
```

集計器は欠損、重複、partial残存、開局hash、条件hash、source hash、ブロック内再集計を検証します。条件別勝率とWilson区間に加え、C0との差、開局単位paired bootstrap、勝者反転、exact McNemar検定、4主比較のHolm補正を保存します。

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

## 1〜3時間スクリーニング

実験1〜5の短時間実行は、既定で`screening-2026-07`プロファイルを使用します。

```bash
node tools/experiments/run-first-player-research.js --study suite
```

条件は次のとおりです。

- 11条件、合計440局
- 1条件40局（10局×4バッチ）
- MCTS iterations: 12
- MCTSプレイアウト上限: 16手
- 最大対局長: 120手
- 標準初期局面から一様ランダム8手
- 実測に基づく想定時間: 約80〜150分

これは条件間の大きな差と実行上の問題を探すスクリーニングであり、従来計画の200局・MCTS 400 iterationsと同じ探索強度や統計精度ではありません。有望な条件だけを200局以上へ拡張します。

2026-07-15の初回実行は約55分で完了し、44バッチ、440局、鏡像監査、`summary.json`を`artifacts/first-player-suite/screening-2026-07/`へ保存しました。結果と解釈は`doc/FIRST_PLAYER_ADVANTAGE_RESEARCH.md`を参照してください。

MCTS条件だけを先に実行する場合:

```bash
node tools/experiments/run-first-player-research.js \
  --study suite --only eval-mcts
```

従来の完全条件は明示した場合だけ使用できます。約50〜120時間を要する可能性があるため、通常は実行しません。

```bash
node tools/experiments/run-first-player-research.js \
  --study suite --suite-profile full
```

## 進捗・チェックポイント

- 1局終了ごとにコンソールへ完了数、経過時間、同一バッチ内のETAを表示する。
- 1局終了ごとに`*.partial.json`を原子的に更新する。
- 中断後は同じコマンドで、未完了バッチの次の局から再開する。
- 10局のバッチ完了時に正式なバッチJSONを保存し、対応するpartialを削除する。
- `progress.json`に現在の条件、完了バッチ、完了局数、バッチ別結果を記録する。
- 全44バッチ完了後に鏡像監査と`summary.json`の集計を自動実行する。

別ターミナルから現在の状態を確認できます。

```bash
node tools/experiments/run-first-player-research.js \
  --study suite --status
```

## 集計

全研究結果を集計します。

```bash
node tools/experiments/aggregate-first-player-research.js all
```

個別集計も可能です。

```bash
node tools/experiments/aggregate-first-player-research.js random-openings
node tools/experiments/aggregate-first-player-research.js game-start
node tools/experiments/aggregate-first-player-research.js suite --profile screening-2026-07
```

集計処理は必要なバッチ数と総対局数を検証し、不足がある場合は失敗します。

## 出力先

今後のローカル実行では次の構成を使用します。`first-player-study`直下の既存集計は、過去のGitHub Actions実験を保存した履歴成果物です。

```text
artifacts/
├── first-player-study/
│   ├── diagnostics.json
│   ├── summary.json
│   └── random-opening-summary.json
├── first-player-random-openings/
│   ├── *.json
│   └── summary.json
├── game-start-first-player/
│   ├── *.json
│   └── summary.json
└── first-player-suite/
    ├── screening-2026-07/
    │   ├── *-batch-*.json
    │   ├── *.partial.json
    │   ├── progress.json
    │   ├── symmetry.json
    │   └── summary.json
    ├── full-2026-07/
    └── mcts-full/
```

`summary.json`と`random-opening-summary.json`は既存研究の保存集計です。新しい`random-openings`追試は`first-player-random-openings/`へ、ゲーム開始時の追試は`game-start-first-player/`へ保存します。`screening-2026-07/summary.json`は11条件完了後に作成済みです。

`game-start-first-player/`の各局にはランダム開局着手列と、開局着手列・開局局面・全着手系列・終局局面のSHA-256を保存する。各バッチにはソースコミット、Node.jsバージョン、主要ソースファイルのSHA-256も記録し、集計時に20バッチの条件、seed、局数、ハッシュ、勝敗集計を検証する。

## 運用方針

- 大量対局、深い探索、MCTS、パラメータ比較はローカルで実施する。
- 各実験はバッチ分割し、完了済みJSONを残す。
- 条件、シード、出力形式はこのディレクトリのスクリプトで固定する。
- GitHub Actionsには大量対局を登録しない。
- 通常CIでAIを確認する場合は、数局のスモークテストに限定する。
