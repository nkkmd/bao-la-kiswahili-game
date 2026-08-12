# Bao Position Complexity / Difficulty Study

更新日: 2026-08-12  
Status: **ACTIVE / STUDY 1 DESIGN / FORMAL CORPUS NOT AUTHORIZED**

## 研究題目

> **Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離**

本研究は、完了済みの以下3研究を踏まえて開始する、新規・prospectiveな独立研究である。

1. 局面相転移点 Study 1
2. 局面類型と棋風 Study 1
3. Namua→Mtaji Strategic Temporal Transition Study 1

既存Studyのformal decision、negative/null/inconclusive result、classifier、threshold、event definitionを救済・変更することを目的としない。

## 研究identity

```text
branch = research/position-complexity-difficulty
base main = d681b4593242973fcb33805edca12eb3e8633653
study = position-complexity Study 1
current stage = Stage 0 technical / measurement audit
formal corpus generation = NOT AUTHORIZED
```

## 中心問い

Baoで「難しい」と見える局面を、最初から単一のdifficulty scoreへ圧縮せず、少なくとも次の層へ分離して測定できるかを検討する。

```text
structural complexity
search complexity / workload
 decision ambiguity
prediction instability
```

Human difficultyはStudy 1のprimary対象にしない。まずmachine-reproducibleな測定構造を確立し、人間の誤答率・判断時間・説明・候補手数との対応は独立したfuture studyとする。

## 重要な用語境界

- `structural complexity` は盤面・合法手・捕獲・relay・front-row・reserve・nyumba等のstate-level構造を指す。
- `search complexity / workload` は固定search implementationが費やすnodes、cutoffs、evaluation count等を指し、構造的複雑度と同一視しない。
- `decision ambiguity` は同一深度・同一evaluator下のroot candidate valuesの近接性を指す。
- `prediction instability` はdepth等を変えたときのbest-move / ranking / evaluationの変化を指す。
- `public/ai-config.js`の既存`complexityScore()`はadaptive search budget用の手作業heuristicであり、本研究のscientific complexity metricではない。
- Study 1では総合difficulty scoreをprimary outcomeとして作らない。

## Canonical documents

```text
doc/position-complexity/README.md
doc/position-complexity/CURRENT_STATUS.md
doc/position-complexity/RESEARCH_PLAN.md
doc/position-complexity/HYPOTHESES.md
doc/position-complexity/DECISION_REGISTER.md
doc/position-complexity/STAGE_0_TECHNICAL_AUDIT.md
doc/position-complexity/RESEARCH_LOG.md
```

`EXPERIMENT_INDEX.md`、formal preregistration、formal runbookは、実際にexperiment identityを凍結する段階まで作らない。

## Inherited sources of truth

最初に次を読む。

```text
doc/FUTURE_RESEARCH_AGENDA.md
doc/RESEARCH_INDEX.md
README.md

doc/phase-transition/STUDY_1_OVERVIEW.md
doc/phase-transition/STUDY_1_FINAL_REPORT.md
doc/phase-transition/CURRENT_STATUS.md
doc/phase-transition/FORMAL_EXPORT_INDEX.md

doc/position-typology/STUDY_1_OVERVIEW.md
doc/position-typology/STUDY_1_FINAL_REPORT.md
doc/position-typology/STUDY_1_VOCABULARY.md
doc/position-typology/CURRENT_STATUS.md
doc/position-typology/REPRODUCIBILITY_INDEX.md

doc/namua-mtaji-transition/STUDY_1_OVERVIEW.md
doc/namua-mtaji-transition/STUDY_1_FINAL_REPORT.md
doc/namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md
doc/namua-mtaji-transition/CURRENT_STATUS.md
doc/namua-mtaji-transition/REPRODUCIBILITY_INDEX.md
```

注: 新研究開始時に指定されていた`doc/phase-transition/REPRODUCIBILITY_INDEX.md`はbase mainには存在しない。phase-transition側のarchive/reproducibility参照には現存する`FORMAL_EXPORT_INDEX.md`とFinal Report / Current Statusを使用する。この欠落を推測で補完しない。

## Restart procedure

新しいチャットや切断済みruntimeから再開するときは:

1. GitHubの現在の`main` HEADを確認する。
2. このbranchのbase/HEADと`main`との差分を確認する。
3. 本README、`CURRENT_STATUS.md`、`DECISION_REGISTER.md`、`RESEARCH_PLAN.md`、`HYPOTHESES.md`、`STAGE_0_TECHNICAL_AUDIT.md`、`RESEARCH_LOG.md`を読む。
4. inherited closed-study documentsを必要な範囲で再確認する。
5. `CURRENT_STATUS.md`に明示された次の未完了工程から再開する。
6. formal corpusは、別途frozen preregistrationと明示的なformal authorizationが揃うまで生成しない。

## Artifact policy

大規模・生成系artifactは既存repository policyに従って`artifacts/local/`へ置き、gitにはcommitしない。protocol、hash、tooling、decision、再現手順だけをrepository側へ残す。