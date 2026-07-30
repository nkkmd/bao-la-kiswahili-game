# 局面相転移点研究

このディレクトリは、`doc/PHASE_TRANSITION_RESEARCH_PLAN.md`に基づく研究記録を保存する。

## 現在の段階

Phase 0の研究基盤、10局diversity smoke、100局pilot-v1、開局妥当性を補正した100局pilot-v2まで完了している。

正式な分析入力は次の成果物とする。

```text
artifacts/phase-transition/pilot-v2/
```

- study version: `0.4.1`
- 完了ゲーム数: 100
- 観測数: 5,650
- 固有軌跡数: 90
- 固有最終局面数: 89
- 開局棄却数: 1
- 開局直後の7 ply早期終局: 2
- diversity pilot gate: 通過

詳細は`doc/phase-transition/PILOT_V2.md`を参照する。

## 成果物の区分

```text
artifacts/phase-transition/
├── smoke/
├── diversity-smoke/
├── pilot/
├── pilot-v2/
└── archive/
    └── pilot-v2-seed-shifted/
```

- `smoke/`
  - 標準初期局面からの決定論的基準線
  - 全10局が同一48 ply軌跡へ収束した旧smoke
- `diversity-smoke/`
  - seed付き合法開局を用いた10局の多様性確認
- `pilot/`
  - pilot-v1
  - 開局妥当性フィルター導入前の監査記録
- `pilot-v2/`
  - study version `0.4.1`
  - 正式な開局検証済み分析データ
- `archive/pilot-v2-seed-shifted/`
  - study version `0.4.0`
  - attempt 1から派生seedを使っていた旧実験
  - 正式分析には使わず、seed不具合の監査記録として保持

これらの大規模成果物は`.gitignore`で除外し、manifest、研究文書、再生成コードによって追跡する。

## データ生成

pilot-v2を再生成する場合は、リポジトリのルートで実行する。

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot-v2
```

進捗確認:

```bash
node tools/experiments/run-phase-transition-research.js \
  --profile pilot-v2 \
  --status
```

同じ設定で通常コマンドを再実行すると、検証済みの完了局を再利用して再開する。設定hashが異なる場合は再開を拒否する。

最初から再実行する場合:

```bash
node tools/experiments/run-phase-transition-research.js \
  --profile pilot-v2 \
  --force
```

`--force`は出力ディレクトリを削除するため、必要な成果物を先に退避する。

## 成果物検証

```bash
node tools/experiments/verify-phase-transition-artifacts.js \
  --input artifacts/phase-transition/pilot-v2
```

検証器は次を確認する。

- 必須ファイル
- JSONL構文
- 観測件数とゲーム件数
- SHA-256
- `gameId + ply`の一意性
- plyの連続性
- `previousStateHash`の連鎖
- 最終state hashとtrajectory hash
- 開局メタデータ
- diversity集計
- 特徴量の基本整合性

## Notebook

### 01-data-audit.ipynb

```text
notebooks/phase-transition/01-data-audit.ipynb
```

JSONLの構造監査と基本記述統計を行う。相転移候補の検出は行わない。

### 02-transition-candidate-analysis.ipynb

```text
notebooks/phase-transition/02-transition-candidate-analysis.ipynb
```

pilot-v2の相転移候補分析をColabから実行する入口である。分析ロジックの正本は次のPythonスクリプトとする。

```text
tools/experiments/analyze-phase-transition-pilot.py
```

Notebookでは`/content/pilot-v2/`へ次の3ファイルを配置する。

```text
/content/pilot-v2/
├── observations.jsonl
├── games.json
└── manifest.json
```

pilot-v1との比較も行う場合は、次も配置する。

```text
/content/pilot/games.json
```

## 相転移候補分析

ローカルでも同じ分析を実行できる。

```bash
python tools/experiments/analyze-phase-transition-pilot.py \
  --input artifacts/phase-transition/pilot-v2 \
  --output artifacts/local/phase-transition-analysis
```

出力:

```text
artifacts/local/phase-transition-analysis/
├── analysis-summary.json
└── transition-candidates.csv
```

分析内容:

1. study version、件数、SHA-256の再監査
2. reserve、可動性、捕獲構造、前列、強制性の特徴群作成
3. `namua → mtaji`、reserve枯渇、nyumba状態、強制捕獲状態の形式的イベント抽出
4. 二つ以上の独立特徴群が変化した地点の候補化
5. 3 plyと5 plyの持続性評価
6. 最寄り形式的転移との距離計測
7. 全100局と7 ply早期終局2局を除外した98局の感度比較

現在の探索閾値は次のとおり。

```text
signal threshold: 1.5
minimum active feature groups: 2
persistence threshold: 0.5
primary persistence window: 3 ply
secondary persistence window: 5 ply
early terminal boundary: 7 ply
```

これらはpilot-v2の探索用設定であり、正式認定基準ではない。

## 比較方針

- pilot-v1は無検証開局の比較基準として保持する。
- pilot-v2は正式な開局検証済みデータとして扱う。
- 同一軌跡を維持した局と、開局棄却によって置換された局を分離する。
- 7 ply早期終局2局を含む100局分析と、除外した98局感度分析を併記する。
- 候補スコアや形式的転移への近接だけで相転移を正式認定しない。

## 次段階

pilot-v2で候補数、特徴群寄与、形式的転移との距離、早期終局感度を確認した後、次を固定する。

1. 候補スコアの閾値
2. 持続期間
3. 代表局面の選定規則
4. 反例の記録方法
5. 新規seedによる再現実験条件
6. 別探索深度・別AI条件による頑健性確認

100局パイロットでは統計的な最終結論を出さず、正式実験の分析手順と事前指定条件を確定する。
