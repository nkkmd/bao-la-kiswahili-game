# G3-01 / LGTGMF-STUDY1 — 研究概要

更新日: 2026-08-31  
状態: **PROSPECTIVE CONTRACT FROZEN / SCIENTIFIC OUTCOME NOT YET GENERATED**

## 何を調べる研究か

Baoでは、一つの局面から複数の合法手が分かれ、その先でもbranchが広がったり狭まったりする。一方、異なる手順が同じauthoritative RAW stateへ到達するtranspositionや、別branchが後に同じstateへ戻るreconvergenceも起こり得る。そのため、単純な「合法手の数」だけでは局所的なgame-tree structureを十分に記述できない。

`LGTGMF-STUDY1`は、rootから限られた手数だけ先をcompleteに列挙するbounded local domainで、treeとしてのpath occurrenceとRAW graphとしてのdistinct stateを分離し、両者を同じ定義で繰り返し測れるinstrumentを構築する研究である。

## なぜ最初に測定基盤を作るのか

Research Generation 3では、branch expansion、reply compression、transposition concentration、structural corridor等を後続Studyで検討する。ただし、measurementそのものがimplementation依存なら、その先のpatternも信頼できない。

そこでG3-01では、興味深いpatternを探す前に、production implementationとstructurally independent implementationが、同一root・同一horizonから同じexact counts、sets、rational pairs、hashesを再構築できるかを検証する。

## 測定する主なもの

Study開始時に5 familyを固定する。

1. `F1-TREE-OCCURRENCE`: depth別tree occurrence、root move別subtree occurrence、terminal occurrence等。
2. `F2-RAW-GRAPH`: depth別distinct RAW states、cumulative union、exact transition sets等。
3. `F3-TRANSPOSITION-RECONVERGENCE`: duplicate arrival、parent multiplicity、root branch間reconvergence等。
4. `F4-TREE-GRAPH-RELATION`: tree occurrenceとunique RAW stateの差、exact ratio、duplicate fraction等。
5. `F5-REPLY-GEOMETRY`: immediate reply width、depth別width distribution、expansion / compression、unit-width persistence等。

一次measurementはinteger、canonical set / tuple、numerator / denominator、SHA-256 hashを優先する。

## 研究デザイン

### Stage 0 — Technical entry

synthetic fixtureとG2-05 depth 0..2のhistorical exact referenceを用い、RAW serialization、move identity、successor binding、tree/graph count、transposition、reconvergence、reply width、traversal-order invarianceをtechnical-onlyで検証する。科学的seedは消費しない。

### Stage 1 — Fresh development

fresh seed block `31010001..31010096`からgeometry-blindにNamua 6 roots / Mtaji 6 rootsを選び、各rootをlocal depth 5までcomplete reconstructionする。ここでは新しいmetric familyを発明するのではなく、開始時に固定した5 familyのうち、exact reproducibilityとresource feasibilityを満たすfamilyをStage 2へ渡せるか確認する。

### Stage 2 — Fresh formal held-out validation

別seed block `31020001..31020096`からNamua 8 / Mtaji 8 rootsを選ぶ。Stage 1とはRAW root、full trajectory、first-16-move opening prefixでfirewallする。全16 rootsがproduction / independent双方でdepth 5までcompleteであることをglobal gateとし、その後にfamily単位のexact zero-mismatchを判定する。

## 何を意味しないか

G3-01が測るのはbounded local structural geometryである。

- reply width 1は、そのまま「強制手」ではない。
- branchが狭いことは、そのまま「簡単な局面」ではない。
- transpositionが多いことは、そのまま「探索が安定する」ことを意味しない。
- local depth 5での測定は、Bao全体のstate-space / game-tree sizeを意味しない。

これらをgame-theoretic value、search behavior、human difficultyへ結び付けるには、それぞれ別の適格なStudyが必要である。

## protected depth-10 holdout

standard initial RAW rootのcomplete exact depth-10 layerはG3-11用にsealedされている。G3-01ではそのcomplete layer、scientific counts、geometry outcomeを生成・readしない。G2-12でproduction-onlyに提案されたestimatorもdepth-10 truth/inputとして使用しない。

## 成功条件

本Studyの成功は、positiveなgeometry patternが見つかることではない。downstream Research Generation 3が安全に再利用できるmeasurement familyがどこまでformal eligibilityを得たか、その境界をfail-closedで確定することである。
