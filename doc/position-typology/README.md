# 局面類型と棋風研究

このディレクトリは、Bao la Kiswahili に反復して現れる局面構造と、AI・対局者が示す戦略傾向を分類する研究を管理します。

Status: **selected next research / kickoff design**  
Branch: `research/position-typology-and-playing-style`

## 研究題目（作業名）

> **Baoにおける局面類型と棋風の発見・検証**

本研究は [`doc/FUTURE_RESEARCH_AGENDA.md`](../FUTURE_RESEARCH_AGENDA.md) の「4.2 局面類型と棋風」を次の優先研究課題として開始するものです。

## まず読む文書

1. [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) — 研究目的、中心RQ、設計原則、段階計画
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在地と開始時点の固定境界
3. [`../phase-transition/STUDY_1_OVERVIEW.md`](../phase-transition/STUDY_1_OVERVIEW.md) — 直前に完了した局面相転移点Study 1の初見向け概要
4. [`../phase-transition/STUDY_1_FINAL_REPORT.md`](../phase-transition/STUDY_1_FINAL_REPORT.md) — Study 1の科学的正本
5. [`../FUTURE_RESEARCH_AGENDA.md`](../FUTURE_RESEARCH_AGENDA.md) — リポジトリ全体の研究アジェンダ

## Study 1との関係

局面相転移点Study 1はすでにclosedです。本研究はそのformal decisionやclassifierを拡張・修正するものではありません。

Study 1で得た `capture-branch-expansion` や `sustained-forcing window` は、本研究で得られる局面類型との関係を後から検討できる既存知見ですが、**局面類型の定義やクラスタ形成へ結果変数として埋め込まない**ことを原則とします。

これにより、将来の相転移Study 2で「何から何へ変化したか」を、より独立した局面語彙で記述できる基盤を作ることを目指します。

## 重要な概念分離

本研究では次を同一視しません。

- **局面類型 (position type)**: ある時点の盤面・合法手・構造を表す状態分類
- **棋風 (playing style)**: 多数の局面・着手・遷移にわたる選択傾向や占有傾向
- **AI実装名 / search profile**: `phase2`, `legacy` 等の実装条件
- **強さ / 勝率**: 類型や棋風とは別の性能指標

特に、特定search profileをそのまま「棋風」と命名しません。まず盤面上の観測から局面類型と行動傾向を定義し、その後に各AI条件との対応を測定します。

## 研究運用

- exploratory discoveryとconfirmatory validationを分離する。
- 類型名を先に固定してデータを当てはめない。
- trajectory重複・決定論的反復を独立標本として扱わない。
- formal claimを行う段階では、新規preregistration、seed block、判定基準、停止条件を固定する。
- Study 1のformal corpus・formal decisionsは変更しない。
- GitHub Actionsでformal corpusを生成しない。

現在は**研究設計開始前のkickoff状態**であり、正式な仮説・クラスタ数・閾値・統計検定はまだ固定していません。
