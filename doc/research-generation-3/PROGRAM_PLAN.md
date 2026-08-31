# Research Generation 3 — Program Plan

作成日: 2026-08-31  
状態: **PROSPECTIVE PROGRAM PLAN / NOT YET STARTED**  
対象: Bao Third-Generation Research Program  
Core agenda: `G3-01..G3-12`  
Human track: `G3-H01` / independent / non-blocking

英語作業名:

**Bao Third-Generation Research Program — Local Game-Tree Geometry, Effective Branching, Search Mechanisms, and Multiscale Structural Dynamics**

日本語作業名:

**Bao第三世代研究計画 — 局所ゲーム木幾何、実効分岐構造、探索機構、多尺度構造ダイナミクス**

本計画における`G3-01`〜`G3-12`および`G3-H01`はAgenda上の順序ラベルであり、正式Study IDではない。正式な研究題目、Study ID、Stage構成・Stage ID、seed range、population、endpoint、threshold、estimability gate、resource ceiling、停止条件は、各Study開始時にその時点のrepository naming ruleと研究運用規則を確認したうえで、scientific outcome生成前にprospectively固定する。

---

## 1. 第三世代研究の位置づけ

Research Generation 1では、Baoの局面相転移、局面類型、戦術motif、重要局面、限定終盤等について、機械的に観測・検証可能な研究語彙を構築した。

Research Generation 2では、それらをより厳格なprospective contract、fresh evidence、identity firewall、independent verification、fail-closed ruleの下で再構成し、どこまで再現可能な科学的主張として成立するかを検証した。

第二世代で特に重要だった境界は次である。

```text
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator = null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
```

したがって第三世代は、第二世代で成立しなかったstrategic clustering、canonicalization、whole-game growth estimator等をそのまま再試行する世代とはしない。

第三世代では、第二世代で最も強く成立した**RAW-only bounded exact analysis**を基盤とし、個々のBao局面の周囲に存在する局所ゲーム木・局所到達グラフが、どのような形を持ち、その形が時間・ルール構造・探索挙動とどのように関係するかを中心課題とする。

---

## 2. 第三世代の中心科学課題

第三世代の中心問いを次のように定める。

> Baoの局所ゲーム木には、branch expansion、branch compression、reply narrowing、reconvergence、transposition concentration、tree/graph divergence等の再現可能な幾何学的構造が存在するか。また、それらは局面・phase・ルールイベント・時間方向・探索不安定性を横断して、どの範囲まで一般化可能か。

ここでいう「geometry」は盤面の空間幾何ではなく、

- rootから何本のbranchが伸びるか
- 各branchが何手後に広がるか／狭まるか
- 別々のbranchが同じRAW stateへ再収束するか
- treeとして数えた場合とRAW graphとして数えた場合の差
- reply widthがどのように変化するか
- 強く狭い局所経路がどれだけ継続するか

といった、**bounded local game tree / reachable graphの構造幾何**を意味する。

---

## 3. Research Generation 1 / 2から引き継ぐ固定境界

1. Research Generation 1およびResearch Generation 2のformal decision、threshold、population、endpoint、interpretation boundaryを変更・救済しない。
2. G2-05のdepth 0..9 exact enumerationはimmutable bounded exact resultとして利用できるが、第三世代のfresh formal confirmation evidenceと無条件に混合しない。
3. G2-12のproduction-only estimator proposalをvalidated estimatorとして使用しない。第三世代はG2-12を救済・追認する目的を持たない。
4. authoritative scientific state identityは引き続き`pits,reserve,houseOwned,player,phase,winner,pending`から成るRAW identityとする。`turn`と`reason`はidentityへ含めない。
5. validated transform setは`[]`であり、reflection、seat swap、symmetry quotient、canonicalizationをdeduplicationへ使用しない。
6. tree occurrenceとunique RAW graph stateを明確に別constructとして保持する。
7. legal branching、effective branching、reply compression、transposition、search instability、engine evaluation、empirical outcome、game-theoretic value、human difficultyを相互に同一視しない。
8. 「branchが狭い」ことを、そのまま「強制手」「勝ち筋」「最善手」と呼ばない。game-theoretic forcingを主張する場合はexact valueまたは別の適格な証拠を必要とする。
9. resource cutoff、timeout、artifact upload failure、administrative cutoffをscientific nullまたはgame resultへ読み替えない。
10. public Bao AIの棋力向上、勝率、latency、UX、deployment結果を第三世代Studyのscientific endpointとしない。
11. Human claimはhuman evidenceを必要とし、machine-only proxyで代替しない。
12. closed Studyのfailure原因から新しい設計を作ることは認めるが、closed Studyそのものを修正・再解析・再判定しない。

---

## 4. 第三世代で新たに導入する測定原理

第三世代では、可能な限り**integer countまたはexact rational pairを一次measurementとする**。

これは、第二世代で浮動小数点加算順やcross-implementation toleranceがtechnical gateへ影響した経験を踏まえ、scientific primitive自体を可能な限りnumerically exactにするためである。

root stateを`s`、bounded horizonを`h`としたとき、少なくとも次のprimitiveを候補とする。

### 4.1 Tree側

- depth別tree node occurrence数
- depth別tree edge occurrence数
- root legal-move count
- childごとのreply count
- root moveごとのsubtree occurrence数
- terminal occurrence数
- branch survival length

### 4.2 RAW graph側

- depth別unique RAW state数
- cumulative unique RAW state数
- unique transition数
- duplicate encounter数
- multi-parent state数
- parent multiplicity
- child-subgraph間のRAW-state overlap
- first reconvergence depth

### 4.3 Tree / graph関係

- tree-node / unique-RAW-state ratio
- tree-edge / unique-transition ratio
- duplicate encounter fraction
- transposition-adjusted branching
- subtree overlap numerator / denominator

### 4.4 Reply geometry

- move別immediate reply width
- depth別reply-width profile
- width compression / expansion
- narrow-path length
- branch reopening
- branch extinction

これらから導出するfloating-point metricをformal endpointに用いる場合は、一次integer/rational artifactを必ず保存し、summation rule、rounding、toleranceをoutcome前に固定する。

---

## 5. Evidence class

第三世代では証拠を少なくとも次に分ける。

```text
TECHNICAL-FIXTURE
HISTORICAL-EXACT-REFERENCE
FRESH-DEVELOPMENT
FRESH-FORMAL-HELDOUT
FRESH-DEEPER-EXACT-HOLDOUT
DIAGNOSTIC-ONLY
HUMAN-EVIDENCE
```

### 5.1 HISTORICAL-EXACT-REFERENCE

G2-05 depth 0..9等を含む。metric design、resource planning、fixture constructionには利用できるが、新しいthird-generation formal claimのheld-out confirmationへ無条件に再利用しない。

### 5.2 FRESH-DEVELOPMENT

第三世代内で新規生成するdevelopment population。candidate metric、event grammar、threshold、representation等の選択に使用可能とする。

### 5.3 FRESH-FORMAL-HELDOUT

development populationからtrajectory、opening prefix、RAW root等をfirewallした新しいevidence。formal scientific decisionの中心とする。

### 5.4 FRESH-DEEPER-EXACT-HOLDOUT

第三世代で特に保護するevidence classとする。

**standard initial RAW rootのdepth 10 exact layerを原則としてG3-11まで生成・readしない。**

G3-01〜G3-10でdepth-10 outcomeをdevelopment evidenceとして先に観測しない。

---

## 6. 第三世代共通scientific contract

各core Studyは原則として次を満たす。

1. Study開始時のremote `main` HEADを完全SHAで記録する。
2. research engine、rule semantics、serialization、RAW identity、move identityをfreezeする。
3. source population、seed block、source policy、root selection ruleをoutcome前にfreezeする。
4. seed blockはconsume-onceとする。
5. development / formal evidence間にtrajectory・opening-prefix・RAW-root firewallを設ける。
6. root selectionは可能な限りoutcome-blindとする。
7. production computationとindependent reconstructionを別実装とする。
8. independent verifierはproductionのgeometry aggregation logicをそのままimportしない。
9. exact primitiveはcanonical integer/rational formとhashを保存する。
10. large artifact uploadだけを唯一のscientific verification経路としない。
11. float metricを用いる場合はdeterministic arithmetic ruleとtoleranceを事前固定する。
12. global gate failure後にfavorable subgroup、threshold relaxation、seed extension、root replacementを行わない。
13. partial computationをcomplete exact resultへ読み替えない。
14. diagnostic observationをformal claimへ昇格させない。
15. scientific decisionとpublic AI engineering decisionを分離する。

---

# 7. Wave A — Local Geometry Foundations

## G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1

日本語作業名:

**Baoにおける局所ゲーム木幾何の測定基盤構築 — bounded RAW tree/graphのexact reconstruction、branching、reply width、transposition、reconvergence指標の再現可能な定義**

### 中心課題

> 同一RAW rootと同一bounded horizonから、productionとstructurally independent implementationが完全に一致するlocal tree / graph geometry measurementを構築できるか。

### 主要対象

- local tree occurrence
- local RAW graph
- branching profile
- reply width
- duplicate encounter
- transposition
- reconvergence
- tree/graph divergence

### Stage構想

**Stage 0 — Technical entry**

- synthetic graph fixtures
- known transposition fixture
- no-transposition controls
- G2-05 bounded exact artifactを用いたread-only technical fixture
- traversal-order invariance
- serializer / RAW binding verification

**Stage 1 — Fresh development**

fresh root population上でbounded local graphを生成し、metric schema、canonical integer/rational representation、resource profileを確立する。

**Stage 2 — Fresh held-out validation**

別seed block・別rootsでproduction / independent full reconstructionを行い、measurement instrumentとしてformal eligibilityを判定する。

### 得られる可能性のある結果

- reproducible local-geometry instrumentが成立する
- metricの一部だけがformal eligibilityを得る
- representation / numerical integrity failureによりtechnical-invalidとなる
- bounded horizonまたはfresh populationがresource上non-estimableとなる

第三世代の大部分はG3-01でformal eligibilityを得たmeasurement familyだけをdownstream利用する。

**Priority: P0**

---

## G3-02 — Effective Branching / Reply-Width Structure Study 1

日本語作業名:

**Baoにおける実効分岐構造とreply-width分布のprospective解析 — phase・root familyを横断したbranch expansion / compressionのbounded exact記述**

### 中心課題

> 単純なroot legal-move countでは捉えられない、数plyにわたるeffective branching structureは再現可能な局面特性として存在するか。

### 主要measurement候補

- immediate legal branching
- layer-wise tree branching
- transposition-adjusted branching
- root-move別reply width
- minimum / maximum reply width
- width compression ratio
- width expansion ratio
- branch survival profile

### 解釈境界

「effective branchingが小さい」ことを「最善手が明確」「人間に簡単」「game-theoretically forcing」とは解釈しない。

### 得られる可能性のある結果

- Namua / Mtaji等でbranch profileが系統的に異なる
- heavy-tailなbranch explosion domainが存在する
- root legal branchingだけでは将来branchingを説明できない
- local branchingは大部分が連続的で安定classを形成しない
- phase差を含めても再現可能差がない

**Priority: P0**

---

## G3-03 — Transposition Concentration / Tree-to-Graph Divergence Study 1

日本語作業名:

**Baoにおけるtransposition集中とtree/graph乖離の局所構造解析 — branch reconvergence、multi-parent state、duplicate occurrenceのexact測定**

### 中心課題

> 見かけ上大きなgame treeが、どの局面でRAW graphとして強く再収束するか。またその程度は局面間で安定した構造差を持つか。

### 主要measurement候補

- duplicate encounter count
- multi-parent state count
- parent multiplicity
- tree occurrence / RAW state ratio
- branch-pair descendant overlap
- first reconvergence depth
- reconvergence density

### 得られる可能性のある結果

- transposition-rich region
- tree-large / graph-small region
- transposition-poor branch-explosion region
- early reconvergenceとlate reconvergenceの分離
- transposition concentrationのphase依存
- meaningfulな局所差が存在しない

本Studyはsymmetry reductionを扱わない。同一RAW stateへの実到達のみをtranspositionとする。

**Priority: P0**

---

## G3-04 — Structural Forcing-Corridor / Decision-Funnel Study 1

日本語作業名:

**Baoにおける構造的forcing corridorとdecision funnelのprospective検証 — reply narrowing、branch persistence、reconvergenceによる局所経路構造の識別**

### 用語上の注意

ここでいう`forcing corridor`は**structural forcing**であり、game-theoretic optimal forcingを意味しない。

### 中心課題

> rootでは複数の合法手が存在しても、その後のreply widthが継続的に狭くなる局所経路や、多数のbranchが少数のRAW stateへ収束するdecision funnelは再現可能に存在するか。

### candidate構造

- width-1 corridor
- width-2 corridor
- width-3 corridor
- monotone reply compression
- branch reopening
- high-branch / high-reconvergence funnel
- low-branch / low-reconvergence corridor

thresholdはdevelopment outcomeを見て都合よく選ばず、candidate familyをStage 1前に固定するか、Stage 1 development→Stage 2 held-outの明示的selection contractを用いる。

### 得られる可能性のある結果

- 再現可能なcorridor / funnel family
- phase限定構造
- root branchingからは予測できないfunnel
- candidate family全て非成立
- bounded horizon内ではnon-estimable

**Priority: P0**

---

# 8. Wave B — Geometry Dynamics and Mechanisms

## G3-05 — Branch Expansion / Compression Transition Study 1

日本語作業名:

**Baoにおける局所ゲーム木のbranch expansion / compression転移 — trajectory上の幾何変化点と持続性のprospective解析**

### 中心課題

> 対局trajectory上でlocal geometryは滑らかに変化するのか、それともbranch explosion / reply compression等の明確な転換イベントを持つのか。

### 主な対象

- ply-to-ply branching change
- transposition change
- tree/graph ratio change
- reply-width collapse
- branch reopening
- local geometry change point

### 得られる可能性のある結果

- abrupt branch-expansion events
- compression→expansion sequence
- phase transition周辺へのgeometry transition集中
- geometry changeが主として連続的でchange pointを形成しない
- event familyがheld-outで再現しない

Research Generation 1の「局面相転移点」を救済・再定義せず、**game-tree geometryという別construct**として扱う。

**Priority: P1**

---

## G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1

日本語作業名:

**Bao固有ルールイベントが局所ゲーム木幾何へ与える構造効果 — capture、reserve、nyumba、Namua→Mtaji移行に対するmove-conditioned exact解析**

### 中心課題

> branch expansion / compressionやtransposition変化は、Baoのどのrule-semantic eventと結びついているか。

### candidate mechanism

- capture / non-capture
- reserve decrement
- nyumba availability / loss
- Namua→Mtaji transition
- front-row occupancy change
- immediate opponent legal-width change

可能な場合、同一rootの複数legal moveをintervention unitとして扱い、root-level confoundingを抑えた比較を行う。

### 解釈境界

これはbounded move-conditioned structural effectであり、長期勝敗への一般的causal effectではない。

### 得られる可能性のある結果

- captureがreply compressionと結びつく
- reserve / nyumba eventがbranch expansionを誘発する
- Namua→Mtaji transitionでgeometryが系統的に変化する
- rule eventよりpre-existing root structureの影響が大きい
- stable mechanismが得られない

**Priority: P1**

---

## G3-07 — Search Instability / Local Geometry Mechanism Study 1

日本語作業名:

**Baoにおける探索不安定性の局所ゲーム木機構 — branching、reconvergence、reply compressionとbest-move / ranking / PV変動のprospective関連解析**

### 中心課題

> search instabilityは局面全体に均等に発生するのか、それとも特定のlocal geometryに集中するのか。

### 測定候補

geometry側:

- branching profile
- branch expansion
- transposition concentration
- corridor length
- tree/graph divergence

search側:

- best-move agreement
- TopSet agreement
- ranking churn
- score-gap change
- PV prefix stability

### Research Generation 2との境界

`G2-02 = INCONCLUSIVE`は変更しない。G2-02のdescriptive observationsはhypothesis generationに利用可能だが、第三世代のformal search-mechanism evidenceとして再利用しない。higher-resource searchを「真値」とはしない。

### 得られる可能性のある結果

- instabilityがbranch explosion領域へ集中する
- transposition-rich局面ではsearchが比較的安定する
- narrow corridorでもhorizon crossingで不安定になる
- geometryとsearch instabilityの関係が弱い
- source-policy / phase限定でのみ成立する

**Priority: P1**

---

## G3-08 — Local Geometry Persistence / Memory-Length Study 1

日本語作業名:

**Bao局面における局所ゲーム木幾何の持続時間とmemory length — trajectory上の構造自己相関と消失・反転のprospective解析**

### 中心課題

> ある局面のlocal geometryは何ply先まで残るのか。またbranch-heavy / compressed / transposition-rich等の特徴には異なるmemory lengthがあるか。

### candidate endpoint

- lagged geometry agreement
- feature persistence
- sign reversal
- half-life-like bounded persistence
- first exit time
- return probability

### 得られる可能性のある結果

- branching structureは短寿命である
- transposition tendencyは比較的長寿命である
- Namua / Mtajiでmemory lengthが異なる
- 特定のrule event後にgeometryが急速にresetされる
- meaningful persistenceはほとんど存在しない

本Studyはstrategic regimeを前提としない。

**Priority: P1**

---

# 9. Wave C — Representation and Longitudinal Theory

## G3-09 — Continuous Local-Geometry Representation Study 1

日本語作業名:

**Bao局面の連続的local-geometry representation構築 — discrete strategic regimeを前提としない再現可能な幾何表現のprospective検証**

### 中心課題

> G3-01〜G3-08でformal eligibilityを得たgeometry measuresを、情報を過度に失わず連続的な局面表現として統合できるか。

Research Generation 2のG2-10 / PSRREの再試行ではない。

特に、

- K-meansによるstrategic regime選択を必須としない
- discrete cluster数をprogram success条件としない
- continuous axes
- neighborhood preservation
- local similarity
- trajectory smoothness

を中心に置く。

### possible representation family

Study開始時に限定familyをprospectively選択する。候補には、

- standardized continuous geometry vector
- graph-derived embedding
- spectral coordinate
- nearest-neighbor structural metric
- topology-preserving low-dimensional representation

等があり得る。

### 得られる可能性のある結果

- stable continuous geometry axes
- 局所的にだけ低次元表現可能
- discrete clusterはないがcontinuous structureは安定
- representationがhigh-dimensionalで圧縮不能
- developmentとheld-outでgeometry neighborhoodが再現しない

**Priority: P2**

---

## G3-10 — Geometry-Conditioned Longitudinal Dynamics Study 1

日本語作業名:

**Baoにおける局所ゲーム木幾何の長期trajectory構造 — discrete strategic regimeに依存しないpath dependence、directionality、persistenceのprospective検証**

### 中心課題

> long-horizon structureをstrategic regime transitionとしてではなく、validated local-geometry coordinatesの時間変化として記述できるか。

### G2-11との境界

これはG2-11の再実行ではない。G2-11が対象としたものはvalidated strategic-regime representation間のlong-horizon transitionであり、G3-10は別constructである**local game-tree geometry dynamics**を扱う。

### candidate question

- geometry pathにdirectionalityがあるか
- expansion後にcompressionへ戻るか
- hysteresisがあるか
- same local geometryへreturnするか
- phaseを跨いでもgeometry historyが残るか
- path dependenceがあるか

### 得られる可能性のある結果

- recurrent geometry trajectories
- irreversible geometry changes
- phase-specific directional dynamics
- short-memory Markov-like behavior
- strong path dependence
- long-horizon structureがnon-estimable

**Priority: P2**

---

# 10. Wave D — Reserved Exact Holdout and Generalization

## G3-11 — Fresh Depth-10 Exact Geometry Holdout Validation Study 1

日本語作業名:

**Bao standard root depth 10のfresh RAW exact enumerationによる局所ゲーム木幾何holdout検証 — 第三世代geometry lawの独立deeper exact test**

### 特別な役割

これは第三世代の**sealed deeper exact holdout**とする。

G3-01〜G3-10では、standard-root depth 10のscientific counts / geometry outcomeを生成・readしない。

### 中心課題

> depth 0..9およびfresh local-root evidenceから構築された第三世代geometry findingsが、未観測のstandard-root depth 10 exact layerでも成立するか。

### Formal target

原則としてdepth 10をprimary exact targetとする。

depth 11をG3-11 outcome後に追加して都合よく再検証しない。depth 11以降は別のfuture prospective Studyとする。

### 必須条件

- RAW-only
- no symmetry reduction
- no G2-12 estimator input
- complete depth-10 layer
- independent full enumeration
- exact set/count hashes
- resource ceilingを事前固定
- partial depth-10をformal complete resultへ昇格させない

### 得られる可能性のある結果

- `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`
- third-generation geometry patternのdeeper confirmation
- depth 10で初めて現れるcounterexample
- resource-limited non-estimability
- technical-invalid closure

本Studyはwhole-Bao state-space sizeを推定しない。

**Priority: P2 / protected holdout**

---

## G3-12 — Local Game-Tree Geometry Generalization / Counterexample Study 1

日本語作業名:

**Bao局所ゲーム木幾何の一般化可能範囲と反例領域のprospective検証 — phase、root family、source policy、rule contextを横断したgeometry claim boundaryの確立**

### 中心課題

> G3-02〜G3-10で成立したgeometry claimsは、どのdomainまで一般化し、どこで破れるか。

### candidate axes

- Namua / Mtaji
- ply range
- reserve structure
- nyumba context
- root legal-width strata
- source-policy family
- capture-available / unavailable
- standard-root exact vs historical reachable roots

### 重要原則

G3-12はupstream negative resultを救済するStudyではない。

formalにeligibleとなったupstream claimだけを対象とし、generalization boundaryとcounterexample boundaryをfresh evidenceで確定する。

### 得られる可能性のある結果

- Bao-wideに近いbounded geometry law
- phase-specific law
- structural-subdomain-specific law
- strong counterexample boundary
- apparent development patternがgeneralizeしない
- generalization自体がnon-estimable

G3-12完了後、Research Generation 3全体のfinal synthesisを別途作成する。

**Priority: P2 / capstone**

---

# 11. G3-H01 — Human Perception of Local Branching / Decision Pressure Study 1

第三世代Human Trackはcore machine programから独立し、non-blockingとする。

日本語作業名:

**Bao熟練者による局所分岐・reply pressure・decision difficulty認識の検証**

### 中心課題候補

- human-perceived branching
- human-perceived forcing
- human-perceived criticality
- candidate move count
- expected reply width
- decision confidence
- machine geometryとのagreement

### 重要境界

machine-measured branch widthをhuman difficultyと同一視しない。

qualified Bao participantへ適切にアクセスできない場合は、

```text
DEFERRED
INDEPENDENT
NON-BLOCKING
```

のままとする。

N=0をnegative human evidenceへ読み替えない。

---

# 12. Dependencyと推奨実施順

```text
Research Generation 3 Common Scientific Contract
        ↓
G3-01 Local Geometry Measurement Foundation
        │
        ├──────── G3-02 Effective Branching / Reply Width
        ├──────── G3-03 Transposition / Tree-Graph Divergence
        └──────── G3-04 Structural Corridor / Funnel
                       │
G3-02 + G3-03 + G3-04
        ↓
G3-05 Branch Expansion / Compression Transition
        │
        ├──────── G3-06 Rule-Mechanism / Geometry Intervention
        ├──────── G3-07 Search Instability / Geometry Mechanism
        └──────── G3-08 Geometry Persistence / Memory
                       │
G3-02..G3-08 eligible outputs
        ↓
G3-09 Continuous Local-Geometry Representation
        ↓
G3-10 Geometry-Conditioned Longitudinal Dynamics

G2-05 immutable depth 0..9 exact reference
        +
G3 geometry definitions frozen
        ↓
G3-11 Fresh Depth-10 Exact Holdout

G3-02..G3-11 formal closures
        ↓
G3-12 Generalization / Counterexample Boundary
        ↓
Research Generation 3 Final Synthesis

G3-H01 Human Track = independent / non-blocking
```

推奨優先度:

```text
P0: G3-01, G3-02, G3-03, G3-04
P1: G3-05, G3-06, G3-07, G3-08
P2: G3-09, G3-10, G3-11, G3-12
Separate / non-blocking: G3-H01
```

G3-11はP2であるが、program開始時点からsealed evidenceとして保護する。

---

# 13. 第三世代で明示的に避ける設計

第三世代では次を行わない。

- G2-12のestimatorを修正してdepth 10 predictionを再評価すること
- G2-10 / PSRREのcluster thresholdを変更してrepresentationを救済すること
- G2-02のhigher-resource searchをground truthとして使うこと
- G2-03のproduction-only zero mismatchをsymmetry authorizationへ昇格すること
- RAW stateを未validated transformでdeduplicateすること
- tree occurrenceとunique RAW stateを混同すること
- structural corridorをgame-theoretic forcingと呼ぶこと
- branch widthをhuman difficultyと呼ぶこと
- local geometryから直接whole-Bao state-space sizeを外挿すること
- developmentで見つかったgeometry classを同じevidenceでformal confirmationすること
- technical failure後にsame consumed evidenceをrepair/rerunしてformal resultを救済すること

---

# 14. 第三世代から得られる可能性のある主要成果

### 14.1 Baoの「計算上難しい局面」の構造的説明

単にlegal moveが多いからではなく、branch expansion、low reconvergence、wide reply set等の組合せによってlocal game treeが急膨張する、といった説明が可能になる。

### 14.2 forcing-like structureの機械的定義

「この局面は一本道に近い」を人間の直感ではなく、reply widthとbranch persistenceからbounded structural statementとして記述できる可能性がある。

### 14.3 transposition-rich / transposition-poor領域の発見

同じtree sizeでもRAW graph complexityが大きく異なる可能性を定量化できる。

### 14.4 search instabilityのmechanistic explanation

AIが不安定になる局面を単なるdepth不足ではなく、branch explosion、reconvergence loss、branch reopening、horizon crossing等のgeometry mechanismとして説明できる可能性がある。

### 14.5 Baoルールと計算複雑性の接続

capture、reserve、nyumba、Namua→Mtaji等のBao固有ルールがlocal game-tree geometryをどう変えるかを直接研究できる。

### 14.6 strategic regimeを必要としない長期構造

第二世代で成立しなかったdiscrete strategic-state representationを使わず、continuous local geometryのtrajectoryとして長期構造を研究できる。

### 14.7 deeper exact result

G3-11が成立すれば、standard initial RAW rootについてdepth 10までの新しいexact boundaryを確立できる。

---

# 15. Negative resultでも得られる重要知識

第三世代ではpositive geometry classが見つからなくても、次のような結果は重要なscientific closureとなる。

- effective branchingは局面間で安定した特性ではない
- transposition concentrationに再現可能なphase差がない
- corridor / funnel classはheld-outで成立しない
- geometryはsearch instabilityをほとんど説明しない
- geometry memoryは非常に短い
- low-dimensional continuous representationも成立しない
- depth 10でdepth 0..9由来のpatternが崩れる
- geometry lawは一部のstructural domainにしか一般化しない

これらはいずれも「研究失敗」ではなく、Baoを単純なlocal-tree taxonomyで説明できる範囲を明確にする結果である。

---

# 16. Research Generation 3 program completion conditions

Research Generation 3はpositive resultの数で完了判定しない。

次を満たした時点をcore program closureの条件とする。

1. G3-01〜G3-12が、それぞれprospectively specified stop ruleに従ってformal closureしている。
2. Research Generation 1 / 2のformal decisionsを変更・救済していない。
3. RAW identityとvalidated transform set `[]`の境界が、別の独立formal authorizationなしに変更されていない。
4. local game-tree geometry measurementについてformalなinstrument eligibilityまたは明確なnon-estimable / technical-invalid decisionがある。
5. effective branching、transposition、tree/graph divergence、corridor/funnelについてformal closureがある。
6. branch expansion / compression dynamicsとBao rule mechanismについてformal closureがある。
7. local geometryとsearch instabilityの関係についてformalな採否またはnon-estimable decisionがある。
8. geometry persistence / memoryについてformal closureがある。
9. continuous local-geometry representationとlongitudinal dynamicsについてformalな採否またはnon-estimable decisionがある。
10. protected depth-10 exact holdoutがformalに実行・検証されるか、resource / technical reasonを含む明確なformal closureを持つ。
11. local-geometry claimsのgeneralization / counterexample boundaryがformal closureしている。
12. tree、graph、search、evaluation、game-theoretic value、human constructが分離されている。
13. public AI engineeringをscientific successへ読み替えていない。
14. Research Generation 3全体を統合するfinal synthesisが作成されている。

第三世代の完了とは、**Baoの局所ゲーム木がどのような構造を持ち、その構造がどの程度再現可能・持続的・一般化可能であるかについて、positive・negative・non-estimableを含む明確なscientific boundaryを与えた状態**を意味する。

---

# 17. 最初に開始する研究

第三世代の最初のStudyは、

**G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1**

とすることを推奨する。

正式な日本語題目候補:

**Baoにおける局所ゲーム木幾何の再現可能な測定基盤構築 — bounded RAW tree/graphのexact reconstructionによるbranching、reply width、transposition、reconvergence、tree/graph divergenceのprospective定義・検証**

英語題目候補:

**Local Game-Tree Geometry Measurement Foundation Study 1 — Prospective construction and validation of reproducible bounded RAW tree/graph measures for branching, reply width, transposition, reconvergence, and tree/graph divergence in Bao**

G3-01開始時には、現行remote `main` HEAD、第三世代program decision、正式Study ID、Stage ID、technical fixture、fresh seed blocks、local horizon、root population、metric schema、independent verifier boundary、formal decision taxonomyをoutcome生成前に固定する。

G3-01がformalにeligibleなmeasurement instrumentを成立させた場合のみ、そのeligible metric familyをG3-02以降へ渡す。

G3-01がtechnical-invalidまたはnon-estimableで閉じた場合、後続Studyを同じinstrumentで無理に実施せず、dependency graphに従って第三世代programの再評価を行う。
