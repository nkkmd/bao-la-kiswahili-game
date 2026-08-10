# 局面類型と棋風研究

このディレクトリは、Bao la Kiswahili に反復して現れる局面構造と、対局trajectoryに現れる戦略傾向を分類・検証する研究を管理します。

Status: **position typology formal confirmation complete / playing-style formal result = not-confirmed / cross-study relation next**  
Branch: `research/position-typology-and-playing-style`

## 研究題目

> **Baoにおける局面類型と棋風の発見・検証**

本研究は [`doc/FUTURE_RESEARCH_AGENDA.md`](../FUTURE_RESEARCH_AGENDA.md) の「局面類型と棋風」を起点として開始しました。

## まず読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在地、formal decisions、固定境界、次工程
2. [`STAGE_5_PLAYING_STYLE_CONFIRMATION_RESULT.md`](STAGE_5_PLAYING_STYLE_CONFIRMATION_RESULT.md) — playing-style independent confirmationのformal result
3. [`STAGE_2_MTAJI_CONFIRMATION_RESULT.md`](STAGE_2_MTAJI_CONFIRMATION_RESULT.md) — confirmed Mtaji position morphologyのformal result
4. [`MTAJI_CONFIRMED_ONTOLOGY.md`](MTAJI_CONFIRMED_ONTOLOGY.md) — confirmed Mtaji position-type vocabulary
5. [`STAGE_3_NAMUA_GRADIENT_RESULT.md`](STAGE_3_NAMUA_GRADIENT_RESULT.md) — Namua continuous-coordinate result
6. [`STAGE_4_PLAYING_STYLE_RESULT.md`](STAGE_4_PLAYING_STYLE_RESULT.md) — exploratory playing-style trajectory geometry
7. [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) — 研究開始時の目的、RQ、段階計画
8. [`../phase-transition/STUDY_1_FINAL_REPORT.md`](../phase-transition/STUDY_1_FINAL_REPORT.md) — closed phase-transition Study 1の科学的正本

## 現在の主要結果

### Mtaji position morphology

独立held-out confirmationにより、固定representation / preregistered population内で次の二つのstate-level morphologyがformalにconfirmedです。

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

これはuniversal/final Bao ontologyではなく、bounded empirical claimです。

### Namua

Namuaでは探索corpus上でstable discrete typeを採用していません。

```text
N-PROG = deterministic progress context
N-ACT  = continuous capture-activity coordinate
N-CON  = continuous structural-contrast coordinate
```

N-ACT / N-CONはexploratory continuous representationです。

### Playing style

Stage 4では、predeclared k=2..6にcoherent discrete style setは得られず、continuous multi-axis trajectory geometryを探索的に採用しました。

Discovery-derived coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

しかし独立Stage 5 confirmationでは、behavioral anchors / signaturesは再現した一方、exact 4D PCA subspaceのheld-out alignmentとtrajectory-resampling stabilityが事前登録基準を満たしませんでした。

```text
Stage 5 formal decision = not-confirmed
```

したがってSTYLE-C1..C4はconfirmed style ontologyではなく、**discovery-derived exploratory trajectory descriptors**として保持します。

## Study 1との関係

局面相転移点Study 1はclosedです。本研究はそのformal decisionやclassifierを拡張・修正しません。

Study 1の `capture-branch-expansion`、forced-capture lifecycle、`sustained-forcing window`、depth2/depth3 search-profile findingsは、独立に得たposition/style vocabularyとの関係を後段で検討できる既存知見です。

次工程はこのcross-study relationです。ただしこれはsecondary / hypothesis-generation analysisであり、Study 1のformal resultもStage 5のnegative resultも救済・変更しません。

## 重要な概念分離

本研究では次を同一視しません。

- **局面類型 (position type)**: ある時点の盤面・合法手・構造を表すstate-level object
- **棋風 (playing style)**: 多数の局面・着手・遷移にわたるtrajectory / policy-level pattern
- **AI実装名 / search profile**: `phase2`, `legacy` 等の実装条件
- **強さ / 勝率**: 類型や棋風とは別の性能指標

特定search profileをそのまま棋風とは命名しません。

## 研究運用

- exploratory discoveryとconfirmatory validationを分離する。
- formal thresholdを結果後に緩和しない。
- negative / inconclusive resultを保持する。
- trajectory / repeated statesの依存構造を無視しない。
- formal claimは新規preregistration、未使用seed block、固定判定基準の下でのみ行う。
- Study 1 formal decisionsを変更しない。
- GitHub Actionsでformal corpusを生成しない。
- failed confirmationを同じheld-out data上の新しいfeature/k/thresholdで救済しない。

最新の研究状態は常に [`CURRENT_STATUS.md`](CURRENT_STATUS.md) を正本として参照してください。
