# TCTGD-STUDY1 — Study 1 Protocol

## 1. Formal identity

- Study ID: `TCTGD-STUDY1`
- Research Generation 3 position: `G3-03`
- English title: **Transposition Concentration and Tree-to-Graph Divergence Study 1 — Prospective exact validation of branch reconvergence, multi-parent RAW states, duplicate occurrences, and bounded local tree-to-RAW-graph divergence in Bao**
- 日本語題目: **Baoにおけるtransposition集中とtree/graph乖離のprospective exact検証 — bounded RAW局所構造におけるbranch reconvergence、multi-parent state、duplicate occurrence、tree occurrence / RAW graph divergenceの再現可能なphase差の検証**
- Research branch: `research/g3-03-transposition-tree-graph-divergence`
- Baseline remote `main`: `6b1457294666267c5a75c8516001acd1ef7d2fcd`
- Program authorization: `doc/research-program-decisions/2026-09-02-post-g3-02-g3-03-authorization-review.md` = `G3-03-AUTHORIZED`

本StudyはG3-01またはG3-02のrepair、rerun、rescueではない。G3-02 `EBRWS-STUDY1`は`CLOSED / TECHNICAL-INVALID`、formal promoted candidate set `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`のまま変更しない。

G3-02 runner-localのreply-width compression summary、unintended duplicate execution、その一致したscientific core、failed canonical artifactは本Studyのcandidate-selection evidence、positive prior、confirmation evidenceとして使用しない。

## 2. Scientific question

Primary question:

> 見かけ上大きいbounded local game treeは、RAW graphとしてどの程度再収束するのか。また、そのtransposition / reconvergence concentrationとtree-to-RAW-graph divergenceは、同一fresh trajectoryから対にしたNamua / Mtaji root間で、held-out evidence上も再現可能な局所構造差として成立するか。

本Studyはeffective branching / reply-width classを再検証しない。search difficulty、best move、position value、human difficulty、game-theoretic forcingをendpointに含めない。

## 3. Authorized scientific foundation

Principal upstream measurement families:

1. `LGTGMIV-F2-RAW-GRAPH`
2. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
3. `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary denominator primitiveとして必要な範囲だけ:

4. `LGTGMIV-F1-TREE-OCCURRENCE`

を使用する。F5 reply geometryは本Studyのprincipal measurementへ使用しない。

`LGTGMIV-STUDY1`のformal eligibility boundaryを越えない。relative local horizonは5、authoritative identityはRAW-only、validated transform setは空集合である。

## 4. Immutable representation, move identity, and rule binding

Scientific RAW state identity:

`pits,reserve,houseOwned,player,phase,winner,pending`

Move identity:

`type,phase,row,index,direction,side,houseChoice,houseTwo`

Validated transform set:

`[]`

symmetry quotient、reflection、rotation、player swap、canonical orbit、heuristic state equivalenceは導入しない。

Authoritative rule engine:

- path: `public/engine.js`
- baseline Git blob: `2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c`
- baseline commit: `6b1457294666267c5a75c8516001acd1ef7d2fcd`

Canonical serializationは`LGTGMIV-CANONICAL-v1`を継承する。scientific arithmeticにfloating pointを用いず、ratioは既約exact rational objectとして保存する。runtime、timestamp、RSS、CPU、workflow ID、runner identity、filesystem path等はscientific identity hashへ入れない。

## 5. Reconvergence vocabulary

本Studyでは次を同義語として扱わない。

### 5.1 Duplicate encounter

F3 `duplicateEncounterCount[d]`は、同一parent-depth layerで同じchild RAW stateへ入るdistinct transitionの2本目以降を数える。transition identityにはRAW parent、move identity、RAW childを含む。

したがって、**同じRAW parentから異なるmove identityで同じRAW childへ到達する場合もduplicate encounterへ寄与し得る**。

### 5.2 Multi-parent RAW state

F3 `multiParentRawStateCount[d]`は、そのchild RAW stateへ入るdistinct parent RAW stateが2以上の場合だけを数える。同一parentから別moveで同一childへ到達するだけではmulti-parentではない。

本Studyはarrival multiplicity histogramとparent multiplicity histogramを別々に保存する。LGTGMIVでformal eligibilityを得ていないjoint state-level分類を後付けで作らない。

### 5.3 Reconvergent RAW state

F3 `reconvergentRawStateCount[d]`は、同じdepth-labelled RAW stateが2以上のdistinct root-move branch labelを持つ場合を数える。これはroot branch間のdescendant reconvergenceであり、単なるduplicate encounter一般とは異なる。

### 5.4 Cross-depth RAW-state revisit presence

F2からcontextual exact primitiveとして

`sum(uniqueRawStateCount[d], d=0..5) - global distinctRawStates`

を計算し、`crossDepthRawStateRevisitPresenceExcess`とする。同じRAW identityが複数depth layerへ現れることで生じるdepth-labelled state-presence excessである。

これだけからdirected cycle、recurrence、game-theoretic repetitionを証明したとは解釈しない。cycle claimには別のprospective path-binding instrumentが必要である。

### 5.5 First reconvergence

`firstReconvergenceDepth`は、F3 root-branch semanticsでreconvergent RAW stateが最初に出現するrelative depthである。depth 5まで存在しない場合はraw primitiveとして`null`を保存する。

## 6. Prospectively fixed endpoint family

全candidate endpointはLGTGMIV eligible exact primitiveからのみdeterministicに構成する。

### C1 — `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO`

```text
numerator   = Σ treeNodeOccurrences[d], d=0..5
denominator = global distinctRawStates over depth 0..5
```

rootはnumerator / denominator双方へ含む。denominator 0は`undefined`だがvalid rootでは想定しない。

値が大きいほど、同じbounded local objectでtree occurrenceがglobal unique RAW graph state数に対して多いことを表す。

### C2 — `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION`

```text
numerator   = Σ duplicateEncounterCount[d], d=0..4
denominator = Σ uniqueTransitionCount[d], d=0..4
```

parent depth labelを保持する。異なるdepthで同じglobal transition identityが現れても、depth-labelled transition occurrenceとして各layerで1回ずつdenominatorへ入る。denominator 0は`undefined`。

これはduplicate-arrival concentrationであり、multi-parent fractionではない。

### C3 — `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION`

```text
numerator   = Σ multiParentRawStateCount[d], parent d=0..4
denominator = Σ uniqueRawStateCount[d], child depth d=1..5
```

rootはdenominatorへ含めない。cross-depth同一RAW identityは各depth-labelled presenceとして数える。denominator 0は`undefined`。

### C4 — `TCTGD-C4-RECONVERGENCE-ONSET-SCORE`

```text
firstReconvergenceDepth exists -> that integer
none through depth 5             -> 6
```

exact integerをdenominator 1のrationalとして保存する。小さい値はより早いroot-branch reconvergence、6はbounded horizon内で未観測を意味する。

### C5 — `TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION`

```text
numerator   = unordered root-move pairs with positive descendant RAW-state overlap
              at any relative depth 1..5
denominator = choose(rootLegalMoveCount, 2)
```

1つのpairは複数depthでoverlapしてもnumeratorへ1回だけ入る。root legal movesが2未満なら`undefined`。

## 7. Raw primitives retained separately

Derived ratioだけを保存せず、少なくとも次をroot-level scientific coreへ保持する。

- `treeNodeOccurrencesByDepth`
- `uniqueRawStateCountByDepth`
- global distinct RAW states
- depth-labelled unique RAW-state presence count
- cross-depth RAW-state revisit presence excess
- `duplicateEncounterCountByParentDepth`
- `multiParentRawStateCountByParentDepth`
- `arrivalMultiplicityHistogramByParentDepth`
- `parentMultiplicityHistogramByParentDepth`
- `reconvergentRawStateCountByDepth`
- `firstReconvergenceDepth`
- root branch pair overlap by depth

production / independentはroot-level reconstruction hash、layer primitive、derived endpoint、pair comparison、stage scientific coreまでexact一致しなければならない。toleranceは0。

## 8. Fresh source population

### 8.1 Paired trajectory design

comparison unitは**1 fresh source seedから得たNamua / Mtaji root pair**である。

trajectory generation:

- engine: frozen `public/engine.js`
- PRNG: Mulberry32
- legal moves: canonical move identity key ascending
- move choice: `floor(u * legalMoveCount)`
- max source ply: 240

Namua root:

`exact ply 24 / nonterminal / phase = namua`

Mtaji root:

`first nonterminal phase = mtaji at ply >= 44`

両rootが存在し、全identity/firewall gateを通過したseedだけをeligible pairとする。どちらか一方が不成立ならseed全体をrejectする。

seed ascendingのfirst-N eligible pairを採用する。geometry、endpoint、勝敗、G3-02 diagnostic resultはselectionに使用しない。

### 8.2 Stage 1 fresh development

- seed block: `31310001..31310192`
- target: 12 pairs = Namua 12 + Mtaji 12
- evidence class: `FRESH-DEVELOPMENT`

### 8.3 Stage 2 fresh formal heldout

- seed block: `31320001..31320288`
- target: 18 pairs = Namua 18 + Mtaji 18
- evidence class: `FRESH-FORMAL-HELDOUT`

seed extension / replacementは禁止。fixed block内でtargetを形成できなければ`NON-ESTIMABLE`である。

Morphology stratumは使用しない。本Studyに新しいstrategic/morphology representation dependencyを持ち込まない。

## 9. Firewalls

使用禁止seed namespace:

- G3-01 `31010001..31010096`
- LGTGMIV Stage 1 `31110001..31110128`
- LGTGMIV Stage 2 `31120001..31120192`
- G3-02 Stage 1 `31210001..31210192`
- G3-02 Stage 2 `31220001..31220288`

canonicalに利用可能なG3-01 / LGTGMIV identity recordについては、RAW-root、source trajectory、first-16-move prefixを**exclusion-only**に使用できる。upstream geometry outcomeをselectionへ使わない。

G3-02 Stage 1 selected-root canonical registryはmaterialization failureにより存在しない。本Studyはそれを再生成・再構築しない。これはG3-02のno-rescue boundaryを守るためである。代わりにG3-02 Stage 1/2 seed namespaceを全て禁止し、G3-02 outcomeを一切selectionへ使用しない。

G3-03内では、Stage 2はStage 1の次と完全非衝突でなければならない。

- RAW-root identity
- source trajectory identity
- first-16-move prefix identity

各Stage内でもRAW rootはglobal deduplicationする。

## 10. Stage 1 promotion rule

12 paired comparisonsについて各candidateの`Mtaji - Namua` exact differenceを計算する。

C1-C4:

- comparable defined pairs = 12/12必須

C5:

- comparable defined pairs >= 10/12必須

全candidate共通:

```text
nonzero gate:
3 * nonZeroPairCount >= 2 * comparablePairCount

dominant-direction gate:
direction is not tied
and
3 * dominantSignCount >= 2 * nonZeroPairCount
```

positive differenceは`MTAJI-GREATER`、negative differenceは`NAMUA-GREATER`。

coverage + nonzero + dominant-directionの全gateを通ったcandidate ID / directionだけをStage 2候補としてimmutable artifactへpromoteする。

promoted candidateが0ならStudyは`NO-PROMOTED-CANDIDATE`で閉じ、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。thresholdを緩めない。

## 11. Stage 2 formal validation

Stage 2はStage 1でfreezeされたcandidate IDとdirectionだけを検証する。

Coverage:

- C1-C4: 18/18 comparable
- C5: >=15/18 comparable

Nonzero gate:

`3 * nonZeroPairCount >= 2 * comparablePairCount`

Formal statistical test:

- nonzero paired differencesのみ
- exact two-sided sign test
- zero differencesはtest nから除外
- promoted candidate family全体にHolm-Bonferroni
- family-wise alpha = exact `1/20`
- p-value decisionはinteger / exact rationalのみ
- floating point comparisonは禁止

candidate confirmationには、coverage、nonzero、Stage 1 direction再現、sequential Holm gateの全てが必要。

Stage 2がestimableかつintegrity-validで、confirmed candidateが1以上ならStudy decisionは`CONFIRMED-BOUNDED-PHASE-DIFFERENCE`。0なら`NOT-CONFIRMED`。

## 12. Resource and estimability ceilings

Per root:

- unique RAW states <= 100,000
- unique transitions <= 750,000
- parent expansions <= 100,000
- legal-move evaluations <= 750,000
- tree node occurrences summed across layers <= 1,000,000,000
- elapsed <= 180,000 ms
- peak RSS <= 4,294,967,296 bytes
- root artifact <= 67,108,864 bytes

Stage 0:

- elapsed <= 120,000 ms
- peak RSS <= 1,073,741,824 bytes
- result artifact <= 33,554,432 bytes

Stage 1:

- total elapsed <= 7,200,000 ms
- total artifact <= 1,073,741,824 bytes

Stage 2:

- total elapsed <= 10,800,000 ms
- total artifact <= 1,610,612,736 bytes

resource ceiling超過でscientific integrity mismatchが無ければ`NON-ESTIMABLE`。resource cutoffをscientific nullへ読み替えない。

## 13. Production / independent implementation contract

Production path:

- `tools/experiments/lib/lgtgmiv-stage1-production.js`
- `tools/experiments/lib/tctgd-production.js`

Independent path:

- `tools/experiments/lib/lgtgmiv-stage1-independent.js`
- `tools/experiments/lib/tctgd-independent.js`

G3-03 independent implementationはG3-03 production implementationをimportしてはならない。derived endpoint、paired difference、promotion rule、exact sign test、Holm logicを共有helperへ逃がさない。

Frozen source blob hashesはmachine-readable preregを正本とする。

## 14. Stage 0 technical validation

Stage 0はscientific fresh seedを使用しない。synthetic fixturesのみで少なくとも次を検証する。

- known no-transposition control
- same-parent / different-move duplicate control
- distinct-parent multi-parent control
- duplicateとmulti-parentのsemantic separation
- first reconvergence semantics
- root-branch overlap semantics
- traversal/order invariance
- production / independent exact agreement
- exact development promotion boundary
- exact sign-test boundary
- exact Holm boundary
- static implementation independence
- fresh scientific seed access false
- protected depth-10 access false

Stage 0 PASSはStage 1を自動authorizeしない。

## 15. Execution-integrity contract

G3-02で発生したcanonical artifact materialization failureとunintended duplicate executionはscientific evidenceとして使わないが、operational failure modeとして再発防止する。

### 15.1 Scientific trigger

Stage 1 / Stage 2 scientific workflowは**`workflow_dispatch` only**とする。`push` triggerでscientific computationを開始してはならない。

workflow arming commitとscientific computationを分離する。

### 15.2 Exactly-one execution

各fresh Stage authorizationは次をbindする。

- Stage ID
- frozen branch HEAD
- seed block
- max scientific execution count = 1

scientific computation前にremote branchへdurable execution-start markerをfast-forward commitする。このlease commitに失敗した場合、fresh seed/rootを生成する前にabortする。

stage-specific concurrency groupで直列化する。誤って2つ目がqueueされても、最初のrunが作ったremote execution markerを確認してscientific computation前にexitしなければならない。

### 15.3 Branch advancement

authorizationからexecution lease確立まで、research branchの予期しないadvancementは禁止。remote HEAD mismatchはpre-computation fail-closedである。

### 15.4 Durable result before repository mirror

scientific computation後、次のexact bytesとhashをまずGitHub Actions artifactとしてdurably uploadする。

- scientific result
- execution summary
- telemetry

その後repositoryへmirror commit/pushする。

repository push failureはscientific rerunをauthorizeしない。既にupload済みartifactのexact bytesだけをread-only copyし、事前記録hashを照合してrepositoryへmaterializeできる。engine import、root regeneration、scientific recomputationは禁止。

scientific computation後にdurable artifact upload自体が失敗し、exact canonical bytesを回収できない場合は`TECHNICAL-INVALID`。

### 15.5 Post-run audit

各fresh execution後にActions historyとexecution countをauditする。unauthorized duplicate scientific executionが1件でもあれば`TECHNICAL-INVALID`。

## 16. Formal failure taxonomy

- representation / serializer / rule binding mismatch -> `TECHNICAL-INVALID`
- production / independent mismatch -> `TECHNICAL-INVALID`
- firewall violation -> `TECHNICAL-INVALID`
- protected evidence access -> `TECHNICAL-INVALID`
- unauthorized duplicate scientific execution -> `TECHNICAL-INVALID`
- scientific result durable materialization failure -> `TECHNICAL-INVALID`
- fixed population incomplete -> `NON-ESTIMABLE`
- resource ceiling exceeded without integrity failure -> `NON-ESTIMABLE`
- Stage 1 valid but promoted set empty -> `NO-PROMOTED-CANDIDATE`
- Stage 2 valid/estimable and at least one candidate confirmed -> `CONFIRMED-BOUNDED-PHASE-DIFFERENCE`
- Stage 2 valid/estimable and zero candidate confirmed -> `NOT-CONFIRMED`
- downstream Stage not separately authorized -> `NOT-AUTHORIZED-NOT-EXECUTED`

## 17. No-rescue boundary

Stage 1 fresh scientific evidenceの**generationまたはreadの早い方**でno-rescue boundaryがactivateする。

その後、同一Study evidenceをformal positiveへ救済するための次を禁止する。

- threshold変更
- endpoint変更
- candidate追加/削除
- seed追加/置換
- root replacement
- favorable subgroup selection
- representation変更
- horizon変更
- metric semantic変更
- resource ceiling緩和
- formal test substitution
- same-evidence rerun

negative / null / non-estimable / technical-invalidもformal outcomeとして受け入れる。

## 18. Protected evidence

standard initial RAW root complete exact depth-10 holdoutは全期間:

**`SEALED / NOT GENERATED / NOT READ`**

G3-03ではgenerate、read、peek、partial resource-estimate generationを行わない。G2-12等の既存depth-10情報を代替truthとしない。

## 19. Interpretation boundary

transposition-rich、reconvergence-rich、tree/graph divergenceが大きい、またはphase差が確認されたことを、次へ自動的に読み替えない。

- strategically simple
- tactically simple
- best moveが明確
- human difficultyが低い
- searchが容易
- evaluationが安定
- game-theoretically forcing
- position value
- win probability
- causal strategic effect

本Studyはbounded RAW local tree/graph geometryのStudyである。

## 20. Progression authorization

- Study freezeだけではStage 0を自動authorizeしない
- Stage 0は別authorizationが必要
- Stage 0 PASSだけではStage 1を自動authorizeしない
- Stage 1は別authorizationが必要
- Stage 1 non-empty promoted setだけではStage 2を自動authorizeしない
- Stage 2は別authorizationが必要

各authorization前にprotected evidence、fresh-seed state、remote branch HEAD、execution historyを再確認する。
