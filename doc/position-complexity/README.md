# Bao Position Complexity / Difficulty Study

更新日: 2026-08-14  
Status: **STUDY 1 CLOSED / FORMAL INCONCLUSIVE / REPOSITORY CLOSURE COMPLETE**

## 研究題目

> **Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離**

本研究は、完了済みの以下3研究を踏まえて開始した新規・prospectiveな独立研究である。

1. 局面相転移点 Study 1
2. 局面類型と棋風 Study 1
3. Namua→Mtaji Strategic Temporal Transition Study 1

既存Studyのformal decision、negative/null/inconclusive result、classifier、threshold、event definitionは変更していない。

## 最終状態

```text
research branch = research/position-complexity-difficulty
base main at study initiation = d681b4593242973fcb33805edca12eb3e8633653
PR #29 = MERGED
merge commit = 7ef83fcb95621aedd1f4b22ec6f213f976576a6c
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY / READINESS PASS / CONSUMED
Stage 2 = COMPLETE / FORMAL
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
repository closure = COMPLETE
```

## 最初に読む

初見向け:

```text
doc/position-complexity/STUDY_1_OVERVIEW.md
```

科学的な最終統合:

```text
doc/position-complexity/STUDY_1_FINAL_REPORT.md
```

Stage 2 canonical formal result:

```text
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
```

再現性/hashes/tooling:

```text
doc/position-complexity/REPRODUCIBILITY_INDEX.md
```

## 研究の中心問い

Baoの「難しい局面」を単一difficulty scoreへ圧縮せず、少なくとも以下を分離して機械再現可能に測定する。

```text
structural complexity
search workload
decision ambiguity
prediction instability
```

Human difficultyはStudy 1のprimary対象外であり、将来の独立studyとする。

## 重要な用語境界

- `legalMoveCount = E.moveVariants(state).length`
- true single-choice roots (`legalMoveCount = 1`) はprimary decision-instability populationから除外
- `search workload`は固定searchのnodes/cutoffs/evaluations等であり、structural complexityと同一ではない
- `decision ambiguity`はexact searched root candidate valuesの近接性
- `prediction instability`はdepth変更に伴うexact best-setの変化
- adaptive budget用`complexityScore()`はscientific complexity metricではない
- Study 1では総合difficulty scoreを作らない

## Stage 0 — exact measurement validation

Research-specific diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

Exact root candidate table、tie-aware TopSet、best-second gap、depth transitionsを測定できるようにし、technical gatesをPASSした。

## Stage 1 — exploratory design development

```text
Stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
768 games
seeds 20400001..20400768
selected unique rule states = 666
Namua = 341
Mtaji = 325
D23 instability = 162
D23 stable = 504
ordinary-domain D2 margins = 510
all readiness gates = PASS
```

Stage 1は探索専用で、Stage 2 confirmationには再利用していない。

## Stage 2 — formal result

```text
Stage ID = PCX-S2-FORMAL-2026-08-13-v1
1024 games
seeds 20410001..20411024
gamesVerified = 1024
fullSearchRecomputation = true
selected unique rule states = 862
Namua = 424
Mtaji = 438
D23 instability = 203
D23 stable = 659
ordinary-domain D2 margins = 630
```

Count/coverage gatesはすべてPASSした。

Primary PCX-H1は:

```text
D23Instability ~ phase + log1pLegalMoveCount
vs phase-only reduced model
```

のlogistic likelihood-ratio testだった。

しかしfull modelのBFGS optimizerがprecision lossで`converged=false`となり、事前固定したfinite+converged gateを満たさなかった。

したがって:

```text
PCX-H1 = INCONCLUSIVE
```

である。

H2はH1 confirmation後だけconfirmatory labelを持つhierarchical designであり、H1がinconclusiveかつH2 reduced modelも非収束だったため:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

である。

## 重要な解釈境界

この結果は:

- structural branchingとD23 instabilityの関連がないと確認したものではない
- 関連があると確認したものでもない
- H2の小さい計算上のp値をconfirmationへ昇格させるものではない
- human difficultyを説明するものではない

同じformal dataを別optimizer/toleranceで再解析してformal labelを救済してはならない。

数値収束問題を再検証する場合は、fresh corpusを用いた新しいprospective independent replicationとする。

## Canonical documents

```text
doc/position-complexity/README.md
doc/position-complexity/STUDY_1_OVERVIEW.md
doc/position-complexity/STUDY_1_FINAL_REPORT.md
doc/position-complexity/CURRENT_STATUS.md
doc/position-complexity/RESEARCH_PLAN.md
doc/position-complexity/HYPOTHESES.md
doc/position-complexity/DECISION_REGISTER.md
doc/position-complexity/EXPERIMENT_INDEX.md
doc/position-complexity/REPRODUCIBILITY_INDEX.md
doc/position-complexity/STAGE_0_TECHNICAL_AUDIT.md
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/STAGE_2_FORMAL_RUNBOOK.md
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
doc/position-complexity/RESEARCH_LOG.md
```

## Research tooling

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/run-position-complexity-stage0-smoke.js
tools/experiments/run-position-complexity-stage1-exploratory.js
tools/experiments/verify-position-complexity-stage1-exploratory.js
tools/experiments/analyze-position-complexity-stage1-exploratory.py
tools/experiments/run-position-complexity-stage2-formal.js
tools/experiments/verify-position-complexity-stage2-formal.js
tools/experiments/analyze-position-complexity-stage2-formal.py
tools/experiments/check-position-complexity-stage2-authorization.js
```

GitHub Actionsはtechnical validation専用で、Stage 1/2 scientific corpusはローカル生成のみ。

## Restart / audit procedure

新しいチャットからこのclosed studyを復元するときは:

1. `STUDY_1_OVERVIEW.md` を読む
2. `STUDY_1_FINAL_REPORT.md` を読む
3. `STAGE_2_FORMAL_RESULT.md` をformal decisionの正本として確認
4. `REPRODUCIBILITY_INDEX.md` でhash/provenanceを確認
5. `CURRENT_STATUS.md` と `DECISION_REGISTER.md` でimmutable boundariesを確認

Current Stage 2 dataはconsumed evidenceであり、future confirmationに再利用しない。
