# Tactical Motifs / Tesuji Study 1

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 状態

- Study: **active / prospective independent study**
- Baseline `main`: `08c70ba6ac980884d51562c207410db3521b8ae4`
- Branch: `research/tactical-motif-discovery`
- Current stage: **Stage 0 technical / representation audit**
- Scientific corpus: **not generated**
- Formal confirmation: **not authorized**

## 中心課題

特定のopening sequenceに依存せず、異なるhistorical trajectories / rule statesで繰り返し成立する

> structural condition → move / move family → reply structure → reproducible downstream consequence

を、再利用可能な手筋候補として機械的に定義・発見・fresh confirmationできるかを調べる。

本研究は「AIが高評価した手」を収集する研究ではない。frequency、search value、forcing structure、structural consequence、transferabilityを別概念として扱う。

## Study separation

既存の以下の研究のformal decision、threshold、classifier、endpoint、population、interpretation boundaryはimmutableである。

- 局面相転移点 Study 1
- 局面類型と棋風 Study 1
- Namua→Mtaji Strategic Temporal Transition Study 1
- Position Complexity / Difficulty Study 1
- 第一次定石研究

特に `capture-branch-expansion`、`MTAJI-M1/MTAJI-M2`、N-ACT/N-CON、Position Complexityのsearch metricsを、自動的に手筋ラベルへ変換しない。

## Josekiとの境界

- **joseki**: standard opening / opening-sequence level knowledge
- **tesuji / tactical motif**: opening identityを必要条件とせず、異なる局面へ転移可能なstructural move principle

opening sequenceそのものをmatching ruleに必要とするpatternは、本Studyではtesuji confirmation対象にしない。

## Stage architecture

1. **Stage 0** — technical / representation audit
2. **Stage 1** — prospective exploratory discovery
3. **Stage 2** — fresh prospective formal confirmation

Stage 1 candidate definitionはStage 2 corpus生成前にfreezeする。Stage 2はfresh non-overlapping seeds / trajectories / statesのみを用いる。

## 文書

- `CURRENT_STATUS.md` — 現在地
- `RESEARCH_PLAN.md` — 全体設計
- `HYPOTHESES.md` — 仮説・candidate familyの扱い
- `DECISION_REGISTER.md` — 研究判断
- `EXPERIMENT_INDEX.md` — Stage / experiment index
- `RESEARCH_LOG.md` — chronological log
- `STAGE_0_TECHNICAL_AUDIT.md` — engine / AI / tooling audit

## Technical instrumentation

Stage 0では既存の

- `tools/experiments/lib/position-typology-features.js`
- `tools/experiments/lib/position-complexity-search-diagnostic.js`
- `tools/symmetry/transform-candidates.js`

を再利用し、新規に

- `tools/experiments/lib/tactical-motif-features.js`
- `test/tactical-motif-stage0.test.js`

を追加する。

大規模scientific corpusは `artifacts/local/` にのみ生成し、GitHubにはcommitしない。Stage 0ではscientific corpusを生成しない。
