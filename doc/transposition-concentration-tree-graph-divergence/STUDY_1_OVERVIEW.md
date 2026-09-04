# G3-03 / TCTGD-STUDY1 — 研究概要

更新日: 2026-09-02  
状態: **CLOSED / TECHNICAL-INVALID**

## 研究題目

**Transposition Concentration and Tree-to-Graph Divergence Study 1 — Prospective exact validation of branch reconvergence, multi-parent RAW states, duplicate occurrences, and bounded local tree-to-RAW-graph divergence in Bao**

日本語正式題目:

**Baoにおけるtransposition集中とtree/graph乖離のprospective exact検証 — bounded RAW局所構造におけるbranch reconvergence、multi-parent state、duplicate occurrence、tree occurrence / RAW graph divergenceの再現可能なphase差の検証**

## 何を調べたか

Baoのbounded local game treeをRAW graphとして再構築したとき、別branchがどの程度同じRAW stateへ戻るか、tree occurrenceとunique RAW graphの差がどの程度生じるかを、Namua / Mtajiのpaired fresh rootsで検証することを目的としました。

Principal measurement familiesはLGTGMIVのformal-eligible F2/F3/F4、F1は補助denominatorです。representationはRAW-only、relative horizonは5、validated transform setは`[]`です。

Frozen candidatesは次の5つでした。

1. cumulative tree / RAW ratio
2. duplicate / unique-transition fraction
3. layer-sum multi-parent fraction
4. reconvergence-onset score
5. root-branch overlap fraction

## Stage 0の役割

Synthetic fixturesだけを用いたtechnical stageは`STAGE0-PASS`でした。fresh scientific seedやprotected depth-10 holdoutには触れていません。

## Stage 1の結果

Fresh seed `31310001..31310192`から12 paired trajectories、計24 rootsをexactly one authorized scientific executionで測定しました。

次はPASSしました。

```text
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
```

Production / independent canonical Stage scientific core SHA-256も一致しました。

```text
d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f
```

## Technical-invalidの原因

Mandatory frozen integrity gateでは、root/stage endpoint objectの比較にNode.js `util.isDeepStrictEqual`を使用していました。

Productionは通常のJavaScript objectを用い、independent implementationは`Object.create(null)`でendpoint mapを構築していました。key/valueとcanonical scientific serializationが一致していてもprototypeが異なるため、prototype-sensitive in-memory equalityはfalseとなりました。

その結果:

```text
allRootExact = false
stageScientificExact = false
Stage 1 = TECHNICAL-INVALID
```

となりました。

この欠陥はfresh evidence生成後に判明しました。同じseedをprototype修正後に再実行すること、またはequality contractを事後的にcanonical equalityへ置き換えることはsame-evidence rescueになるため行っていません。

## formal decision（正式判断）

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = CONSUMED
Stage 2 seed = NOT CONSUMED
```

Runnerがdiagnostically記録したC1–C4の方向はformal promotionされません。

## 分かったこと／分からなかったこと

Formalに確定したのは、G3-03 Stage 1がfrozen cross-implementation integrity contractを満たさなかったことです。

一方、このStudyから次をpositive scientific findingとして主張することはできません。

- NamuaとMtajiでtransposition concentrationが異なる
- tree/graph divergenceにformalなphase差がある
- reconvergence onsetにformalなphase差がある
- transposition-richな局面がsearchしやすい／戦略的に単純である
- bounded depth-5 observationがdeeper game treeへ一般化する

## protected evidence （証拠の状態）

Standard initial RAW-root complete exact depth-10 holdoutは:

**`SEALED / NOT GENERATED / NOT READ`**

のままです。

## Program上の位置づけ

G3-03 closure後のseparate program reviewはその後完了し、G3-04が別のprospective independent Studyとして実施・closureされました。これはG3-03のformal decisionを変更・救済するものではありません。

詳細は`STUDY_1_FINAL_REPORT.md`を参照してください。
