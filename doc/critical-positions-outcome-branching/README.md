# Critical Positions / Outcome Branching Study 1

## 研究題目

**Baoにおける重要局面と勝敗分岐点の同定 — move-sensitive continuation divergence と decision-critical position structure の抽出・検証**

Working English title: **Critical Positions / Outcome Branching Study 1**

```text
studyId = CPOB-STUDY1
status = CLOSED AFTER STAGE 1 NEGATIVE EXPLORATORY RESULT
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
branch = research/critical-positions-outcome-branching
Stage 1 source games = 3072 / verified
selected roots = 600 / all primary-estimable
high-divergence roots = 139 / 600 exploratory
promoted structural candidates = 0
Stage 2 = NOT EXECUTED
```

## 結論

本Studyでは、同一root stateの全exact legal moveを別々にinterveneし、その後をprospectively frozenしたcontinuation policyで進めたときのroot-actor empirical continuation outcome divergenceを測定した。

Primary construct:

```text
fixed-policy empirical continuation divergence
```

600 selected roots中、`D_range >= 0.30`のhigh-divergence rootは139件観測された。

```text
Namua = 52 / 300
Mtaji = 87 / 300
overall = 139 / 600
```

一方、freeze済みの「phase + 1–2 pre-root structural tokens」grammarで1183 candidate patternsを監査した結果、全promotion gatesを通過したcandidateは0件だった。

```text
candidate audits = 1183
promoted candidates = 0
manual override = false
```

したがって、**大きなfixed-policy continuation divergenceを持つ局面は存在したが、今回の単純なstructural matcher grammarでは再現性の高い重要局面classをpromotionできなかった**、がbounded conclusionである。

## Study architecture

```text
Stage 0 — construct / technical / feasibility audit      COMPLETE / PASS
Stage 1 — fresh exploratory discovery                    COMPLETE
Stage 2 — fresh prospective formal confirmation          NOT EXECUTED
Study 1                                                   CLOSED
```

Stage 2はexact Stage 1 promoted candidate mappingを必要としたが、promotion結果が0件だった。threshold relaxation、near-miss selection、grammar expansion等でStage 2対象を作ることはno-rescue違反となるため実施しなかった。

## 重要な分離

本Studyの結果は次を混同しない。

```text
fixed-policy empirical continuation divergence
search-value separation
move-ranking instability
structural branch divergence
game-theoretic criticality
human-perceived criticality
```

特に、engine evaluation差をvalidated win-probability差へ変換しない。Position Evaluation / Win-Rate Calibration Study 1はformal `INCONCLUSIVE`のままである。

## 最初に読む文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure state
- [`results/STAGE_1_EXPLORATORY_SUMMARY.json`](results/STAGE_1_EXPLORATORY_SUMMARY.json) — compact machine-readable result
- [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) — prospective architecture
- [`HYPOTHESES.md`](HYPOTHESES.md) — hypothesis hierarchy
- [`VOCABULARY.md`](VOCABULARY.md) — criticality語彙と禁止された同一視
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — source / artifact / hash索引
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronology

## Artifact policy

Large scientific artifacts remain local:

```text
artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1/
```

Gitにはpreregistration、authorization、compact results、checkpoints、status、reproducibility records、final synthesisを保存する。

## Interpretation boundary

Study 1はmachine-onlyで完結した。本結果から次は主張しない。

- true/game-theoretic winning probability;
- theoretically winning/losing states;
- unique game-theoretic turning points;
- human/expert-perceived importance;
- traditional Bao strategic importance;
- validated score-to-win-probability conversion;
- 3特徴以上・nonlinear・representation-learning型classifierでも重要局面構造が存在しないこと;
- completed Bao studiesのformal decisionの救済・変更。

将来、より表現力の高い重要局面classifierを研究する場合は、本Studyのthresholdを緩和せず、新しいprospective independent studyとしてfresh evidenceを使用する。
