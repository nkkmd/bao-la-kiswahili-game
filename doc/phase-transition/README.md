# 局面相転移点研究

このディレクトリは、`doc/PHASE_TRANSITION_RESEARCH_PLAN.md` に基づく研究記録を保存する。

## 現在の段階

Phase 1へ進む前のsmoke run基盤を整備している。

- 固定seed
- C0相当の固定条件
- 1局単位の原子的保存
- 完了済み局の再利用
- 設定変更時の再開拒否
- JSONL、ゲーム要約、manifestの生成
- 成果物SHA-256検証

## 10局smoke run

リポジトリのルートで実行する。

```bash
node tools/experiments/run-phase-transition-research.js
```

既定条件:

```text
profile: smoke
games: 10
base seed: 20260721
max ply: 180
condition: C0
level: hard
evaluator: bao
search: phase2
max depth: 2
time limit: fixed time limitなし
```

出力:

```text
artifacts/phase-transition/smoke/
├── games/
│   ├── game-0000.json
│   └── ...
├── observations.jsonl
├── games.json
└── manifest.json
```

## 進捗確認

```bash
node tools/experiments/run-phase-transition-research.js --status
```

## 中断後の再開

同じコマンドを再実行する。完了済みのゲームファイルは検証後にスキップされる。

```bash
node tools/experiments/run-phase-transition-research.js
```

source、条件、seed、対局数、最大plyなどから作られる設定hashが異なる場合、既存成果物からの再開を拒否する。

## 最初から再実行

```bash
node tools/experiments/run-phase-transition-research.js --force
```

`--force`は指定した出力ディレクトリを削除して再生成するため、必要な成果物を退避してから使用する。

## 成果物検証

```bash
node tools/experiments/verify-phase-transition-artifacts.js \
  --input artifacts/phase-transition/smoke
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

smoke runは統計的結論を得るための正式研究ではない。実行時間、欠損、終局率、namua/mtaji到達状況、データ量を確認し、100局パイロットの条件を固定するために使用する。
