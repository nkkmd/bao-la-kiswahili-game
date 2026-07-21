# Bao la Kiswahili 局面相転移点研究計画

Version: 0.1.0  
Status: Draft  
作成日: 2026-07-21

## 0. 概要

本研究では、Bao la Kiswahili の対局中に局面の価値基準、優先戦略、候補手構造が持続的に変化する地点を「局面の相転移点」として抽出・分類する。

研究環境は次のように分担する。

- **ローカル環境**: 正式コーパス生成、長時間探索、基準計測、最終追試
- **Google Colab**: 探索的解析、変化点検出、統計解析、可視化、仮説形成
- **GitHub Actions**: テスト、固定 fixture、Schema・hash・成果物検証

Colab 上だけで得られた結果は正式結論とせず、固定ローカル環境で再現する。

## 1. 研究目的

1. 対局中に繰り返し現れる相転移候補を抽出する。
2. ルール上の形式的転移と、戦略上の転移を区別する。
3. reserve、nyumba、前列、捕獲可能性、可動性、強制性、候補手安定性の変化を測定する。
4. 一時的変動と持続的転換を区別する。
5. AI 条件、探索深度、seed が変わっても再現する転移を特定する。
6. 検出結果を人間と機械が共有できる Bao 固有語彙へ変換する。

## 2. 研究上の問い

- **RQ1:** namua から mtaji への形式的移行前後で、局面特徴と候補手構造はどう変化するか。
- **RQ2:** 形式的 phase 移行の前後に、独立した戦略的転移が存在するか。
- **RQ3:** reserve に戦略転換と対応する共通閾値があるか。
- **RQ4:** nyumba 消失の効果は局面条件によって変化するか。
- **RQ5:** 前列支配の崩壊・固定化を特徴量から検出できるか。
- **RQ6:** 捕獲重視から可動性重視への転換を識別できるか。
- **RQ7:** 強制系列から自由選択への移行を合法手構造から識別できるか。
- **RQ8:** 転移候補は探索条件を変えても再現するか。
- **RQ9:** 一対局に複数種類の相転移が存在するか。
- **RQ10:** 相転移を手数ではなく局面状態で分類できるか。

## 3. 操作的定義

### 3.1 相転移候補

次のいずれかが観測された ply または局面区間を候補とする。

- phase、nyumba、reserve などの明示状態が変化した。
- 一つ以上の主要特徴量が急変した。
- 上位候補手の戦略分類が変化した。
- 強制手中心から自由選択中心へ移行した。
- 変化後の状態が一定 ply 以上持続した。

### 3.2 形式的相転移

ルール状態から直接識別できる変化。

- `namua → mtaji`
- nyumba の有効状態変化
- reserve 枯渇
- 合法手生成規則の変化

### 3.3 戦略的相転移

ルール状態の変更とは独立して、優先戦略が持続的に変わる地点。

- 捕獲優先から可動性優先
- nyumba 維持から解放・放棄
- 前列占有から再配置
- 強制系列から自由選択
- reserve 温存から投入促進

## 4. 仮説

- **H1:** 戦略的転移は namua から mtaji への形式的移行より数 ply 前に発生する場合がある。
- **H2:** reserve が特定範囲を下回ると、即時捕獲より可動性を重視する候補手が増える。
- **H3:** nyumba 消失の効果は前列構造、reserve 差、捕獲可能性との組合せに依存する。
- **H4:** 強制系列と自由選択系列の境界には再現可能な転移がある。
- **H5:** 評価値単独では転移を安定識別できない。
- **H6:** 一対局には複数の相転移がある。
- **H7:** 主要転移は複数探索条件で近接した ply に検出される。
- **H8:** 局面特徴による分類は手数分類より安定する。

## 5. 実験環境

### 5.1 ローカル

正式データ生成と追試に使用する。OS、CPU、メモリ、Node.js、commit SHA、ルール・AI・特徴量抽出器・コーパスの hash を記録する。時間制限型比較は同一ローカル環境だけで行う。

### 5.2 Google Colab

JSONL/Parquet の監査、時系列可視化、変化点検出、統計解析、仮説形成に使用する。固定 depth、固定 node、固定 MCTS iteration を優先し、Colab の実行速度を正式比較に使わない。

### 5.3 GitHub Actions

短時間の品質保証だけに使用する。

- feature extractor の回帰テスト
- 固定 fixture 生成
- JSONL・manifest・hash 検証
- Schema と Notebook の JSON 構文確認
- fixture artifact の保存

大規模自己対局、速度測定、正式統計実験は実行しない。

## 6. Phase 0: 研究基盤

### 実装物

```text
doc/PHASE_TRANSITION_RESEARCH_PLAN.md
schemas/phase-transition-observation.schema.json
tools/experiments/lib/phase-transition-features.js
tools/experiments/generate-phase-transition-fixture.js
tools/experiments/verify-phase-transition-artifacts.js
test/phase-transition-features.test.js
test/phase-transition-fixture.test.js
notebooks/phase-transition/01-data-audit.ipynb
.github/workflows/phase-transition-research-ci.yml
```

### fixture 出力

```text
artifacts/phase-transition/fixture/
├── observations.jsonl
├── games.json
└── manifest.json
```

`observations.jsonl` を一次正本とし、分析用形式は再生成可能な派生物とする。

### 完了条件

- 固定入力から同じ成果物を再生成できる。
- 元 state を変更せず特徴量を抽出できる。
- `gameId + ply` が一意である。
- ply が連続し、`previousStateHash` が直前行と一致する。
- manifest の件数と SHA-256 が実ファイルと一致する。
- Colab で JSONL を読込み、欠損・重複・phase・reserve・合法手数を確認できる。

## 7. Phase 1: パイロット

Phase 0 完了後、C0 条件を中心に 10 局の smoke run、続いて 100 局を実行する。

- 固定 seed
- 最大 180 ply
- 10 局単位の原子的保存
- 中断・再開対応
- 主生成はローカル
- 解析は Colab

パイロットでは検出法と閾値を確定せず、欠測、容量、計算時間、変化点候補数を評価する。

## 8. 主要特徴量

- phase、手番、winner、終局理由
- reserve、houseOwned、pending
- 合法手数、捕獲手数、非捕獲手数、強制捕獲
- 盤上石数、非空穴数
- 前列占有穴数、占有率、石数
- 将来追加: 最大捕獲量、relay 長、評価値、候補手順位、最善手安定性

## 9. 認定基準

正式な相転移認定では、少なくとも次を要求する。

1. 異なる対局で再発する。
2. 二つ以上の独立特徴群に変化がある。
3. 変化が事前指定期間持続する。
4. 新規 seed で再現する。
5. 局面構造として説明できる。
6. 反例と適用範囲を記録できる。

## 10. 成功・否定・停止条件

### 成功

- 再現可能な ply 観測データを生成できる。
- 形式的転移を機械的に検出できる。
- 戦略的転移候補を複数抽出できる。
- 少なくとも一種類が新規 seed で再現する。
- 代表局面と反例を保存できる。
- 機械定義と人間向け語彙を対応付けられる。

### 否定

- 特定 AI 条件だけに現れる。
- 新規 seed で再現しない。
- 一時的評価変動だけで持続しない。
- 手数だけで同程度に説明できる。
- 実装不具合で説明される。

### 即時停止

- 違法手
- state hash 不一致
- 特徴量再計算不一致
- source 条件の混在
- partial と complete の区別不能

## 11. 再現性原則

各正式成果物には study/schema version、commit SHA、ルール・AI・特徴量抽出器・コーパス hash、runtime、seed、開始・終了 state hash、実行環境を記録する。

source、rules、engine、feature extractor、condition、corpus、schema のいずれかが異なる場合は partial からの再開を拒否する。

## 12. 次段階

Phase 0 の CI と Colab 監査が完了した後、`run-phase-transition-research.js` を追加し、10 局 smoke run と 100 局パイロットへ進む。

本研究の中心方針は次のとおりである。

> Bao の局面に現れる持続的な戦略変化を測定し、再現可能な相転移として分類し、人間と機械が共有できる Bao 固有の語彙へ変換する。
