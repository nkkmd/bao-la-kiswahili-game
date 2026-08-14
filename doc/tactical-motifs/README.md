# Tactical Motifs / Tesuji Study 1

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 状態

- Study: **active / prospective independent study**
- Baseline `main`: `08c70ba6ac980884d51562c207410db3521b8ae4`
- Branch: `research/tactical-motif-discovery`
- Stage 0: **complete / validated**
- Current stage: **Stage 1 v1 pre-generation specification freeze**
- Stage 1 scientific corpus: **not generated**
- Stage 1 generation: **not authorized; frozen spec/tooling CI pending; runner/verifier are next gate**
- Formal confirmation: **not authorized**

## 中心課題

特定のopening sequenceに依存せず、異なるhistorical trajectories / rule statesで繰り返し成立する

> structural condition → move / move family → reply structure → reproducible downstream consequence

を、再利用可能な手筋候補として機械的に定義・発見・fresh confirmationできるかを調べる。

本研究は「AIが高評価した手」を収集する研究ではない。frequency、search value、forcing
structure、structural consequence、transferabilityを別概念として扱う。

## Study separation

既存の以下の研究のformal decision、threshold、classifier、endpoint、population、
interpretation boundaryはimmutableである。

- 局面相転移点 Study 1
- 局面類型と棋風 Study 1
- Namua→Mtaji Strategic Temporal Transition Study 1
- Position Complexity / Difficulty Study 1
- 第一次定石研究

特に `capture-branch-expansion`、`MTAJI-M1/MTAJI-M2`、N-ACT/N-CON、
Position Complexityのsearch metricsを、自動的に手筋ラベルへ変換しない。

## Josekiとの境界

- **joseki**: standard opening / opening-sequence level knowledge
- **tesuji / tactical motif**: opening identityを必要条件とせず、異なる局面へ転移可能なstructural move principle

opening sequenceそのものをmatching ruleに必要とするpatternは、本Studyではtesuji
confirmation対象にしない。Stage 1ではopening-prefix concentrationを明示的に監査する。

## Stage architecture

1. **Stage 0** — technical / representation audit — **COMPLETE / VALIDATED**
2. **Stage 1** — prospective exploratory discovery — **v1 SPEC FROZEN / NOT YET GENERATED**
3. **Stage 2** — fresh prospective formal confirmation — **NOT AUTHORIZED**

Stage 1 positions/seeds are not reusable in Stage 2. Stage 2 requires a separately frozen
candidate-specific formal preregistration and fresh non-overlapping corpus.

## Stage 1 v1

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Frozen population:

- 768 games
- seeds `21900001–21900768`
- 6 trajectory-generation strata × 128 games
- 8 seeded-uniform exact-moveVariant opening plies
- max ply 100
- no extension / no replacement

Stage 1 uses one outcome-independently selected root per representative historical trajectory,
measures all legal moveVariants, and characterizes all immediate opponent replies through a
root-actor-relative response envelope.

The spec alone does not authorize generation. After this frozen contract passes dedicated CI, a corpus runner and independent verifier must be implemented and separately validated. Only then may a source-hash-bound authorization file be created.

## 文書

- `CURRENT_STATUS.md` — 現在地
- `RESEARCH_PLAN.md` — 全体設計
- `HYPOTHESES.md` — 仮説・candidate familyの扱い
- `DECISION_REGISTER.md` — 研究判断
- `EXPERIMENT_INDEX.md` — Stage / experiment index
- `RESEARCH_LOG.md` — chronological log
- `STAGE_0_TECHNICAL_AUDIT.md` — engine / AI / tooling audit
- `STAGE_1_EXPLORATORY_PROTOCOL.md` — frozen Stage 1 scientific protocol
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json` — machine-readable Stage 1 freeze

## Technical instrumentation

Reused:

- `tools/experiments/lib/position-typology-features.js`
- `tools/experiments/lib/position-complexity-search-diagnostic.js`
- `tools/symmetry/transform-candidates.js`

Study-specific:

- `tools/experiments/lib/tactical-motif-features.js`
- `tools/experiments/lib/tactical-motif-discovery.js`
- `tools/experiments/validate-tactical-motif-stage1-spec.js`
- `test/tactical-motif-stage0.test.js`
- `test/tactical-motif-stage1-tooling.test.js`

Large scientific corpus is generated only under `artifacts/local/` and is never committed.
GitHub Actions are limited to technical validation and smoke/unit tests.
