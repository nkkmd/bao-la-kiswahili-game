# Bao la Kiswahili 局面相転移点研究計画

Version: 0.1.0  
Status: Draft  
作成日: 2026-07-21

## 0. 概要

本研究では、Bao la Kiswahili の対局中に局面の価値基準、優先戦略、候補手構造が持続的に変化する地点を「局面の相転移点」として抽出・分類する。

単なる評価値の一時的な上下ではなく、phase、reserve、nyumba、前列支配、捕獲可能性、可動性、強制性、候補手順位の複数指標に現れる再現可能な変化を対象とする。

実験環境は次のように使い分ける。

- **ローカル**: 正式コーパス生成、長時間探索、基準計測、最終追試
- **Google Colab**: 探索的解析、変化点検出、統計解析、可視化、仮説形成
- **GitHub Actions**: unit test、fixture、Schema、hash、成果物完全性の検証

Colab だけで得られた結果は正式結論とせず、固定したローカル環境で再現できることを正式認定の条件とする。

## 1. 研究目的

1. namua から mtaji への移行前後の局面構造を定量化する。
2. nyumba の消失または機能変化に伴う戦略転換を識別する。
3. reserve の臨界域と候補手の変化を調べる。
4. 前列支配の崩壊・固定化を検出する。
5. 捕獲重視から可動性重視への転換を識別する。
6. 強制系列中心から自由選択中心への転換を識別する。
7. 手数に依存しない Bao 固有の phase 語彙を構築する。

## 2. 研究上の問い

- **RQ1:** 形式的な namua → mtaji 移行より前または後に戦略的転移が発生するか。
- **RQ2:** reserve に共通の戦略転換閾値が存在するか。
- **RQ3:** nyumba 消失の影響は前列構造や reserve 差によって変化するか。
- **RQ4:** 強制系列から自由選択への境界を合法手構造から検出できるか。
- **RQ5:** 評価値単独より複合特徴量の方が相転移を安定して識別できるか。
- **RQ6:** 相転移候補は探索深度、評価関数、探索方式、seed を変えても再現するか。
- **RQ7:** 一つの対局に異なる種類の相転移が複数存在するか。

## 3. 操作的定義

### 3.1 形式的転移

ルールエンジンの状態から直接識別できる変化。

- `phase: namua -> mtaji`
- nyumba 所有状態の変化
- reserve の枯渇
- 合法手生成規則の変化

### 3.2 戦略的転移

ルール上の phase 変化とは独立して、候補手の戦略分類または局面価値基準が持続的に変わる地点。

### 3.3 相転移候補

次のうち複数を満たす ply または短い区間。

- 主要特徴量の急変
- 最善手または上位候補手の戦略分類変化
- 強制性または選択自由度の持続的変化
- 複数探索条件で近接した変化点が検出される
- 変化後の状態が原則 4 ply 以上継続する

### 3.4 正式認定

少なくとも次を満たす候補を正式な相転移語彙候補とする。

1. 異なる複数対局で再発する。
2. 二つ以上の独立した特徴群が変化する。
3. 変化が事前指定期間持続する。
4. 新規 seed の確認研究で再現する。
5. 代表局面と反例を保存できる。
6. 盤面構造と着手原理で説明できる。

## 4. 事前仮説

- **H1:** 戦略的 mtaji 化は形式的移行より数 ply 前に起こる場合がある。
- **H2:** reserve が臨界域へ入ると、即時捕獲より可動性を重視する候補手が増える。
- **H3:** nyumba 消失は単独ではなく、前列構造や reserve 差との組合せで転移を起こす。
- **H4:** 強制系列の終了と自由選択の回復には再現可能な境界がある。
- **H5:** 評価値だけでは相転移を十分に識別できない。
- **H6:** 発生 ply より局面特徴の方が安定した分類基準になる。

## 5. 収集する特徴量

### 5.1 識別・再現性

- studyVersion、schemaVersion
- gameId、conditionId、seed、ply
- sourceCommit、rulesHash、engineHash、featureExtractorHash
- stateHash、previousStateHash

### 5.2 局面状態

- player、phase、winner、reason
- reserve、houseOwned、pending
- 各穴の石数
- 盤上総石数、前列・後列石数
- 前列占有穴数・占有率
- 非空穴数

### 5.3 合法手構造

- legalMoveCount
- captureMoveCount、nonCaptureMoveCount
- forcedCapture
- 最大・平均即時捕獲量（実装可能後に追加）
- relay 長（実装可能後に追加）

### 5.4 探索・安定性

後続 Phase で次を追加する。

- 評価値、候補手別評価値
- 最善手と次善手の評価差
- principal variation
- node 数、pruning 数
- MCTS visit 数、平均報酬
- 深度・seed・評価関数間の最善手一致率

## 6. データ形式

一次成果物は JSONL とし、1 行を 1 ply の観測値とする。分析用 Parquet は JSONL から再生成可能な派生物とする。

保存先:

```text
artifacts/phase-transition/
├── corpus/
├── pilot/
├── screening/
├── confirmatory/
├── derived/
├── figures/
├── manifests/
└── verified/
```

人間向け成果物:

```text
doc/phase-transition/
├── README.md
├── PILOT_RESULTS.md
├── TRANSITION_CANDIDATES.md
├── CONFIRMATORY_PROTOCOL.md
├── CONFIRMATORY_RESULTS.md
├── PHASE_VOCABULARY.md
├── HUMAN_REVIEW.md
└── FINAL_CONCLUSION.md
```

## 7. 実験環境の役割分担

### 7.1 ローカル

- 正式コーパス生成
- 長時間自己対局と高深度探索
- node/sec、時間、メモリ等の基準計測
- Colab で得た仮説の追試
- 主要集計値の独立再計算

固定する情報:

- OS、CPU、メモリ
- Node.js バージョン
- Git commit SHA
- ルール、AI条件、特徴量抽出器、コーパスの hash

### 7.2 Google Colab

- JSONL/Parquet の監査と整形
- 特徴量の時系列可視化
- PELT、Binary Segmentation、CUSUM 等の変化点検出
- bootstrap、クラスタリング、代表局面抽出
- 研究 Notebook の共有

制約:

- Colab の CPU 時間を正式な速度比較に使わない。
- 固定時間ではなく固定 depth、node、iteration、seed を使う。
- 小バッチ単位で永続保存する。
- Colab だけで正式認定しない。

### 7.3 GitHub Actions

- lint、unit test、integration test
- 2〜5局程度の固定 fixture
- JSON Schema 検証
- state hash、manifest、partial、重複、欠損検証
- Notebook の静的確認

大規模自己対局、長時間探索、速度ベンチマークは実行しない。

## 8. 実験フェーズ

### Phase 0: 基盤整備

- 本計画書
- ply 観測 Schema
- 既存エンジンを読み取る特徴量抽出器
- 固定 fixture と回帰テスト
- 最小 Colab Notebook

完了条件:

- 初期局面と固定局面から同じ特徴量・hash が再生成される。
- エンジン状態を変更せず抽出できる。
- JSON 出力が Schema に対応する。
- 全テストが短時間で完了する。

### Phase 1: パイロット

- 100局程度
- C0 中心
- 10局単位のバッチ
- 最大 180 ply
- 主生成はローカル、解析は Colab

完了条件:

- 95%以上の対局で必須特徴量が欠損しない。
- 1局当たりの実行時間とデータ量を測定できる。
- 形式的転移を可視化できる。
- 2種類以上の変化点検出法を比較できる。

### Phase 2: スクリーニング

- 300〜500局を目安
- 複数 depth、評価関数、MCTS 条件
- 同一または対応する seed 集合
- 10〜20局単位の shard

同一対局内の ply は独立標本として扱わず、対局または seed 単位で相関を処理する。

### Phase 3: 事前登録

探索結果を見た後、確認研究前に次を固定する。

- 対象転移、主要特徴量、検出法、閾値
- 持続性条件、許容 ply 幅
- AI条件、seed生成法、対局数
- 除外・成功・否定・停止基準
- 多重比較補正

### Phase 4: 確認研究

- 新規 seed を使用
- 正式データ生成はローカル
- 統計解析は Colab
- 主要集計はローカルで独立再計算
- GitHub Actions は形式検証のみ

### Phase 5: 人間レビューと語彙化

代表局面、前後の着手、特徴量、principal variation、反例を確認し、次の形式で語彙化する。

```text
名称:
機械識別子:
定義:
発生条件:
主要特徴量:
典型的な前状態:
典型的な後状態:
戦略上の意味:
形式的転移との関係:
代表局面:
既知の反例:
適用範囲:
確信度:
```

## 9. 停止条件

次の場合は実験を停止し、成果物を正式集計へ進めない。

- 違法手または state hash 不一致
- 同一条件で意図しない非決定性
- 特徴量再計算の不一致
- source、rules、condition、corpus、schema の異なる成果物の混在
- partial と complete の区別不能
- 必須特徴量欠損率が 5% を超える
- 変化点を元局面へ逆参照できない

重大な実装変更後は studyVersion を更新し、変更前後の成果物を混在させない。

## 10. 成功基準

1. 再現可能な ply 単位データを生成できる。
2. 形式的転移を正しく抽出できる。
3. 戦略的転移候補を複数抽出できる。
4. 少なくとも一種類が新規 seed で再現する。
5. 手数分類より局面特徴分類が有用であることを示せる。
6. 代表局面、反例、適用範囲を保存できる。
7. Colab 解析をローカル成果物から再実行できる。
8. 機械的定義と人間向け説明を対応付けられる。

仮説が支持されない場合も、再現可能な否定的結果として正式成果に含める。

## 11. 初回 PR の範囲

初回 PR は Phase 0 の最小基盤に限定する。

1. 本研究計画書
2. `schemas/phase-transition-observation.schema.json`
3. `tools/experiments/lib/phase-transition-features.js`
4. 固定局面を使う回帰テスト
5. `notebooks/phase-transition/01-data-audit.ipynb`

大規模自己対局、探索評価、変化点認定、語彙確定は後続 PR に分離する。
