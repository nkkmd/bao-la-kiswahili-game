# Position Complexity / Difficulty Study 1 — Overview

更新日: 2026-08-14  
Status: **CLOSED / FORMAL INCONCLUSIVE**

## 研究題目

> **Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離**

## 何を調べたか

Baoの「難しい局面」を最初から1つのdifficulty scoreへまとめず、少なくとも次の機械再現可能な層へ分けて扱えるかを調べた。

```text
structural complexity
search workload
decision ambiguity
prediction instability
```

Study 1ではhuman difficultyは扱わない。人間の誤答率・思考時間・候補手生成との対応は将来の独立研究とした。

## 主要な測定

Structural branchingの中心変数は:

```text
legalMoveCount = E.moveVariants(state).length
```

Prediction instabilityの中心endpointは:

```text
D23Instability = 1
iff exact TopSet_D2 と exact TopSet_D3 が disjoint
```

Decision ambiguityの主要候補は、ordinary evaluation domainに限定したD2 best-vs-second searched score gapとした。

## Stage 0 — 測定系の確立

研究専用のexact root diagnosticを実装し、全root candidateのsearched value、tie-aware TopSet、best-second gap、D1-D4 depth traceを再現可能に測定できるようにした。

```text
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

既存AIのrootScoreとのcross-check、非破壊性、determinism、replay validityなどのtechnical gatesをPASSした。

## Stage 1 — exploratory design development

Fresh exploratory corpus:

```text
768 games
seeds 20400001..20400768
```

重複trajectoryをcollapseし、outcome-independent hashでNamua/Mtajiを割り当て、1 trajectoryにつき最大1 stateを選択した。

結果:

```text
unique historical trajectories = 685
selected unique rule states = 666
Namua = 341
Mtaji = 325
D2->D3 instability = 162
D2->D3 stable = 504
ordinary-domain D2 margins = 510
```

事前固定したStage 2 readiness gatesはすべてPASSした。

探索的には:

```text
legalMoveCount vs D23 instability: weak positive association
ordinary D2 gap vs D23 instability: negative association
legalMoveCount vs D3 nodes: moderately strong positive association
```

が観測されたが、Stage 1は探索専用でconfirmationには使用していない。

## Stage 2 — fresh formal confirmation

Fresh formal corpus:

```text
1024 games
seeds 20410001..20411024
```

全1024局を独立verifierで再生し、47,129のpost-opening searchを再計算してPASSした。

Formal selected population:

```text
selected unique rule states = 862
Namua = 424
Mtaji = 438
D23 instability = 203
D23 stable = 659
ordinary-domain D2 margins = 630
```

サンプル数・phase coverage・event countのformal gatesはすべて十分に満たした。

## Primary PCX-H1

Formal question:

> phaseを調整した上で、structural branching (`log1pLegalMoveCount`) はD2→D3 root-optimum instabilityと関連するか。

Preregistered test:

```text
reduced: D23Instability ~ phase
full:    D23Instability ~ phase + log1pLegalMoveCount
unpenalized binomial logistic likelihood-ratio test
alpha = 0.05
```

しかしfull modelのBFGS optimizerが:

```text
Desired error not necessarily achieved due to precision loss.
```

を返し、事前固定された`finite and converged` gateを満たさなかった。

したがってformal decisionは:

```text
PCX-H1 = INCONCLUSIVE
```

である。

計算上のLRTは `p = 0.0866762390` だったが、convergence gate failure後にこのp値だけを使って`not-confirmed`へ変更することはしない。

## Secondary PCX-H2

D2 ordinary-domain best-second gapについては計算上強いincremental signalが得られたが、H2はH1 confirmation後だけconfirmatory labelを持てるhierarchical designだった。

さらにH2 reduced modelもconvergence gateを満たさなかった。

したがって:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

であり、secondary confirmationは主張しない。

## 最終結論

このStudy 1で確立できたのは:

- structural complexity / search workload / ambiguity / instabilityを分離して再現可能に測定する技術基盤;
- trajectory/state pseudoreplicationを抑えたprospective sampling design;
- exploratory corpusとfresh formal corpusを分離する再現可能な研究pipeline;
- 十分なformal populationを確保できること。

一方、中心のconfirmatory questionは、凍結済み数値収束gateのため解決しなかった。

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

これは「関連がない」と確認されたことでも、「関連がある」と確認されたことでもない。

## 次に何をすべきか

同じStage 2 dataを別optimizer/toleranceで再解析してformal resultを救済してはならない。

数値収束問題を解消して科学的問いを再検証するなら、次は:

> **新しいprospective independent replicationとして、optimizer・convergence criterionを事前により堅牢に固定し、fresh seed blockで再確認する**

のが適切である。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
