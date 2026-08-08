# Research Plan — Baoにおける局面類型と棋風の発見・検証

Status: **kickoff design / not preregistered**

## 1. 目的

Bao la Kiswahili の多数の対局から、特定の手順やAI実装名に依存しない反復可能な**局面類型 (position types)** を発見し、それらの局面をどのように選び、維持し、遷移するかという**棋風 (playing styles)** を記述可能な形へ整理する。

長期的には、Baoの局面を「序盤・中盤・終盤」や単一評価値だけでなく、盤面構造と選択傾向から説明できる共通語彙を構築する。

## 2. 中心Research Questions

### RQ1 — 局面類型

盤面・合法手・捕獲構造・reserve・nyumba・前列・強制性・mobility等の観測特徴から、異なる対局・trajectoryに繰り返し現れる局面構造を抽出できるか。

### RQ2 — 類型の安定性

得られた類型は、seed、trajectory、phase、探索深度、評価関数、search profileを変えても、同じ構造的意味を保つか。

### RQ3 — 類型の遷移

局面類型間には反復可能な遷移パターンが存在するか。特に、ある類型から別類型への移行が戦略的に解釈可能か。

### RQ4 — 棋風

一局または多数局における類型占有率、滞在時間、遷移頻度、reserve消費、捕獲選択、強制系列利用などから、AI・方策ごとの安定した戦略傾向を記述できるか。

### RQ5 — search conditionとの関係

`phase2`, `legacy`、探索深度等の実装条件は、どの局面類型・遷移・棋風を選好するか。ただし実装条件自体を棋風の定義には使用しない。

### RQ6 — Study 1との接続

独立に得られた局面類型・遷移と、Study 1の `capture-branch-expansion` がどのように対応するか。これを用いて将来の相転移研究で「何から何へ変化したか」を記述できるか。

RQ6は本研究後半のcross-study analysisであり、類型発見の入力定義には使わない。

## 3. 研究上の重要な分離

### 3.1 Position type と playing style

- position typeは**state-level**の概念。
- playing styleは**trajectory / policy-level**の概念。

一つの局面を見ただけで棋風を判定しない。棋風は多数の局面・着手・遷移にわたる傾向として定義する。

### 3.2 構造と強さ

勝率、評価値、探索深度は重要な補助変数だが、「強い局面類型」「弱い棋風」を最初から定義しない。まず構造を記述し、性能との関係は後段で検証する。

### 3.3 人間語彙と機械クラスタ

クラスタ番号をそのままBao語彙とみなさない。再現性、代表局面、特徴差、遷移構造を確認した後に、人間が理解可能な名前を付与する。

## 4. 候補特徴群

開始時点では次を候補とする。実装監査後に利用可能性・リーク・冗長性を評価して確定する。

### Board / phase structure

- `namua` / `mtaji`
- reserve量・reserve差
- nyumba状態
- front-row occupancy / asymmetry
- pit occupancy / seed distribution summaries

### Legal-action structure

- legal move count
- legal capture move count
- forced-capture state
- maximum capturable seeds
- capture-option asymmetry
- mobility proxies

### Sequence / morphology

- relay length or related sowing-chain measures
- forcing streak / forced-capture regime position
- recent structural persistence

### Secondary-only candidates

- AI evaluation value
- search depth reached
- node count
- PV / cutoff / horizon diagnostics if later instrumented

Secondary-only variablesは、局面類型の独立性を保つため、初期クラスタ形成から除外する可能性を優先検討する。

## 5. データ独立性と分析単位

基本階層を次として扱う。

```text
seed / opening
  -> game
    -> trajectory
      -> ply / position
        -> feature vector
```

多数のplyを単純な独立標本とはみなさない。

少なくとも次を監査する。

- identical trajectory repetition
- identical / equivalent position repetition
- opening concentration
- deterministic continuation
- player-side symmetry / asymmetry
- phase imbalance

必要に応じてtrajectory-level weighting、position deduplication、canonicalization、held-out seed blocksを導入する。

## 6. 研究段階

### Stage 0 — Instrumentation and corpus audit

- 現在保存している特徴量の棚卸し
- 不足特徴量の追加設計
- position identity / trajectory identityの確認
- 多様な局面を得られる生成条件の比較
- exploratory corpusとfuture confirmation corpusの分離設計

成果: data schema / audit report / exploratory protocol

### Stage 1 — Exploratory position typology discovery

- feature scaling / transformationの設計
- phase分離の要否確認
- clustering / dimensionality reductionを複数方法で比較
- cluster数を単一指標だけで固定しない
- 代表局面・反例を抽出

成果: provisional position types

### Stage 2 — Stability and replication

- held-out seeds
- trajectory deduplication
- evaluator / depth / search-profile sensitivity
- cluster assignment stability
- representative feature consistency

成果: reproducible position-type candidates

### Stage 3 — Semantic interpretation and vocabulary

- 類型ごとの特徴量差
- 代表局面の盤面確認
- transition context
- Bao上の人間可読名称
- applicability boundary / counterexample

成果: bounded Bao position-type vocabulary

### Stage 4 — Playing-style analysis

- position-type occupancy
- transition matrix
- dwell time
- reserve / capture / mobility usage
- phase timing
- policy / search-condition comparison

成果: playing-style profiles

### Stage 5 — Cross-study relation

Study 1を変更せず、独立に得た類型と以下の関係をsecondaryに検討する。

- `capture-branch-expansion`
- forced-capture lifecycle
- `sustained-forcing window`
- depth2 / depth3 search-profile ordering

成果: future phase-transition Study 2へのhypothesis-generation evidence

### Stage 6 — Final integration

- Overview
- Final Report
- Vocabulary
- negative results
- reproducibility index
- Future Work

## 7. Exploratory / confirmatory boundary

本研究開始時点ではexploratoryです。

confirmatory claimへ進む前に、少なくとも次を事前固定する。

- 対象とするposition population
- feature set
- preprocessing
- clustering / classifier definition
- unit of analysis
- deduplication rule
- seed block
- stability / replication criterion
- minimum sample / cluster availability
- primary endpoints
- statistical tests if applicable
- success / failure / inconclusive rule
- stopping condition

結果を見てから閾値や類型定義を変更し、そのまま同じデータでconfirmationとは呼ばない。

## 8. Study 1から継承する研究規律

- negative / inconclusive resultを保持する。
- formal thresholdを結果後に緩和しない。
- secondary analysisでprimary decisionを救済しない。
- repeated deterministic trajectoriesを独立例として水増ししない。
- empirical scopeとclassifier definitionを区別する。
- claimの適用範囲を実験条件より広げない。

## 9. 予定成果物

```text
doc/position-typology/
├── README.md
├── RESEARCH_PLAN.md
├── CURRENT_STATUS.md
├── HYPOTHESES.md              # 必要になった段階で作成
├── EXPERIMENT_INDEX.md        # 実験開始時に作成
├── DECISION_REGISTER.md       # formal decision発生前に作成
├── STUDY_1_OVERVIEW.md        # 完了時の初見向け概要
├── STUDY_1_FINAL_REPORT.md    # 完了時の科学的正本
└── STUDY_1_VOCABULARY.md      # 安定した類型・棋風語彙が得られた場合
```

研究用tooling / artifactsは既存のrepository規約に合わせ、実装開始時に配置を固定する。

## 10. 現在の停止点

この文書は研究開始用の**設計骨格**であり、preregistrationではない。

次のチャットでは、まずrepository実装と既存成果物を監査し、Stage 0の具体的protocolを確定する。十分な監査なしにクラスタ数、棋風名、formal hypothesis、seed blockを固定しない。
