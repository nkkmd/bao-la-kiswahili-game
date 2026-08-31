# Third-Generation Local Game-Tree Geometry Research Agenda — Program Decision

Date: 2026-08-31  
Status: **PROSPECTIVE PROGRAM DECISION / INTEGRATED TO MAIN / NOT YET STARTED**  
Scope: Bao research program governance

## Decision

Research Generation 3を、Baoの**local game-tree geometry / effective branching structure**を中心とする新しいprospective pure-research programとして設計する。

英語作業名:

**Bao Third-Generation Research Program — Local Game-Tree Geometry, Effective Branching, Search Mechanisms, and Multiscale Structural Dynamics**

日本語作業名:

**Bao第三世代研究計画 — 局所ゲーム木幾何、実効分岐構造、探索機構、多尺度構造ダイナミクス**

Canonical detailed planは`doc/research-generation-3/PROGRAM_PLAN.md`とする。

## Why this direction

Research Generation 2では、RAW-only bounded exact enumerationが最も強いformal resultとして成立した一方、validated symmetry transform、validated strategic-regime representation、long-horizon strategic transition Study、whole-Bao growth estimatorは成立しなかった。

```text
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
```

第三世代はこれらのclosed resultを救済せず、RAW局面周辺のbounded tree / graph structureを直接測定することで、新しい独立scientific questionへ進む。

## Core program shape

```text
Research Generation 3 core = G3-01 .. G3-12
Human track = G3-H01 / independent / non-blocking
AI improvement = separate engineering program
```

`G3-01..G3-12`と`G3-H01`はAgenda上の順序ラベルでありformal Study IDではない。formal Study ID、Stage ID、seed、population、endpoint、threshold、resource ceiling、stopping ruleは各Study開始時にoutcome前freezeする。

## Fixed program boundaries

1. Research Generation 1 / 2のformal decisionとinterpretation boundaryを変更・救済しない。
2. authoritative scientific state identityは、別のvalid formal transformation authorizationが成立するまでRAW identityとする。
3. validated transform set `[]`を維持し、symmetry / canonicalizationをstate reductionへ用いない。
4. G2-12のproduction-only estimator proposalをvalidated estimatorとして使用しない。
5. whole-Bao state-space / game-tree sizeを第三世代local geometry resultから直接外挿しない。
6. tree occurrenceとunique RAW graph stateを別constructとして保持する。
7. structural forcingとgame-theoretic forcingを分離する。
8. machine branching / reply pressureとhuman difficultyを分離する。
9. higher-resource searchをground truthとみなさない。
10. technical/resource failureをscientific nullへ読み替えない。
11. negative / null / non-estimable / technical-invalid / not-authorizedを正常なclosure outcomeとして保存する。
12. public AI strength、deployment、UXをscientific endpointに含めない。

## Measurement principle

第三世代では可能な限りinteger countまたはexact rational pairをscientific primitiveとし、floating-point derived metricsを用いる場合は一次整数artifact、deterministic arithmetic rule、rounding / toleranceをoutcome前に固定する。

この原則は、第二世代でfloating-point summation orderやcross-implementation toleranceがtechnical gateへ影響した経験を、新しいStudy設計上のfailure-mode informationとして利用するものであり、closed Studyの再判定ではない。

## Protected deeper exact holdout

standard initial RAW rootのdepth 10 exact layerを`G3-11`のprotected holdoutとして保護する。

```text
G3-01..G3-10 depth-10 scientific outcome access = PROHIBITED
G3-11 depth-10 role = FRESH-DEEPER-EXACT-HOLDOUT
G2-12 estimator input to G3-11 = PROHIBITED
symmetry reduction = PROHIBITED unless independently authorized before G3-11 freeze
```

G3-11 outcome後に同Study内でdepth 11を追加して救済しない。

## Waves

### Wave A — Local Geometry Foundations

- G3-01 Local Game-Tree Geometry Measurement Foundation Study 1
- G3-02 Effective Branching / Reply-Width Structure Study 1
- G3-03 Transposition Concentration / Tree-to-Graph Divergence Study 1
- G3-04 Structural Forcing-Corridor / Decision-Funnel Study 1

### Wave B — Geometry Dynamics and Mechanisms

- G3-05 Branch Expansion / Compression Transition Study 1
- G3-06 Bao Rule-Mechanism / Geometry Intervention Study 1
- G3-07 Search Instability / Local Geometry Mechanism Study 1
- G3-08 Local Geometry Persistence / Memory-Length Study 1

### Wave C — Representation and Longitudinal Theory

- G3-09 Continuous Local-Geometry Representation Study 1
- G3-10 Geometry-Conditioned Longitudinal Dynamics Study 1

### Wave D — Reserved Exact Holdout and Generalization

- G3-11 Fresh Depth-10 Exact Geometry Holdout Validation Study 1
- G3-12 Local Game-Tree Geometry Generalization / Counterexample Study 1

### Independent human track

- G3-H01 Human Perception of Local Branching / Decision Pressure Study 1

## Dependency principle

G3-01をmeasurement foundationとする。G3-02〜G3-08はG3-01でformal eligibilityを得たmetric familyだけをdownstream利用する。

G3-09はG3-02〜G3-08のeligible outputをcontinuous representationへ統合するStudyであり、G2-10 / PSRREのdiscrete strategic clusteringを再実行しない。

G3-10はvalidated local-geometry coordinatesのtrajectory dynamicsを扱い、G2-11のstrategic-regime transition Studyを再実行しない。

G3-11はprotected depth-10 exact holdout、G3-12はformalにeligibleとなったgeometry claimだけのgeneralization / counterexample boundaryを扱う。

## First recommended Study

第三世代最初のAgenda itemは、

**G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1**

とする。

日本語題目候補:

**Baoにおける局所ゲーム木幾何の再現可能な測定基盤構築 — bounded RAW tree/graphのexact reconstructionによるbranching、reply width、transposition、reconvergence、tree/graph divergenceのprospective定義・検証**

ただし、これはprogram-level題目候補であり、formal Study ID・正式題目・Stage IDはG3-01開始時に現在のrepository naming ruleを再確認してprospectively固定する。

## Program completion principle

Research Generation 3はpositive resultの数で完了判定しない。

G3-01〜G3-12がprospective stopping ruleに従ってclosureし、local geometry instrument、branching / transposition / corridor、geometry dynamics / mechanism、search relation、persistence、continuous representation、longitudinal dynamics、protected depth-10 holdout、generalization boundaryについて明確なformal dispositionを持ち、Research Generation 1 / 2のboundaryとresearch / engineering separationを保持したfinal synthesisが作成された時点をcore program closureとする。

## Main integration

2026-08-31、統合直前のremote `main`がplanning baseline `cd200b85c1eb24aa4419bd5a9573552f3682f00d`のままであることを確認した。

planning branch `research/g3-program-plan` HEAD `6b1e022b3b2392071b5fd91088a9d83d2f7b2ed8`は`main`に対して`ahead 17 / behind 0`、merge baseはbaseline mainそのものだったため、明示的なuser instructionに基づき`force = false`でfast-forward integrationを完了した。

この統合は第三世代program planning、中央文書、governance、provenanceだけを対象とし、Research Generation 1 / 2のscientific decision、Study result、scientific artifact、engine、experiment toolingを変更していない。

## Current authorization state

```text
Program planning = AUTHORIZED / RECORDED / INTEGRATED TO MAIN
Scientific Study execution = NOT STARTED
G3-01 formal Study ID = NOT ASSIGNED
G3-01 seed block = NOT ASSIGNED
Depth-10 holdout = SEALED / NOT GENERATED / NOT READ
Main integration = COMPLETE
```

このprogram decision自体はscientific outcomeを生成せず、Research Generation 3のprospective governance boundaryを固定するためのplanning recordである。
