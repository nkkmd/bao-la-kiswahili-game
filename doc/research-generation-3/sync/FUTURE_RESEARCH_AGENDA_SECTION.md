## 10. 第三世代研究アジェンダ

### 10.1 位置づけ

Research Generation 3の作業英語名は次とする。

**Bao Third-Generation Research Program — Local Game-Tree Geometry, Effective Branching, Search Mechanisms, and Multiscale Structural Dynamics**

日本語作業名:

**Bao第三世代研究計画 — 局所ゲーム木幾何、実効分岐構造、探索機構、多尺度構造ダイナミクス**

第三世代は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、各RAW局面の周囲に存在するbounded local game tree / reachable RAW graphそのものを研究対象とする。

第二世代の主要boundaryは次のとおりであり、第三世代で変更・救済しない。

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

詳細なprogram正本は[`research-generation-3/PROGRAM_PLAN.md`](research-generation-3/PROGRAM_PLAN.md)、現在状態は[`research-generation-3/CURRENT_STATUS.md`](research-generation-3/CURRENT_STATUS.md)、program-level decisionは[`research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`](research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md)を参照する。

`G3-01`〜`G3-12`および`G3-H01`はAgenda上の順序ラベルであり、正式Study IDではない。正式題目、Study ID、Stage ID、seed、population、endpoint、threshold、resource ceiling、estimability gate、停止条件は各Study開始時にoutcome生成前freezeする。

### 10.2 中心科学課題

> Baoの局所ゲーム木には、branch expansion、branch compression、reply narrowing、reconvergence、transposition concentration、tree/graph divergence等の再現可能な構造幾何が存在するか。また、それらはphase、root family、Bao固有ルールイベント、時間方向、search conditionを横断してどの範囲まで一般化可能か。

ここでいうgeometryは盤面上の空間幾何ではなく、合法手branch、reply width、subtree growth、RAW-state reconvergence、duplicate encounter、multi-parent state、tree occurrenceとunique RAW graphの乖離等を記述するbounded computational structureである。

### 10.3 共通科学contract

1. Research Generation 1 / 2のformal decisionを変更・救済しない。
2. authoritative state identityは独立formal authorizationが成立するまでRAW identityとする。
3. validated transform set `[]`のままsymmetry / canonicalizationをdeduplicationへ使用しない。
4. tree occurrenceとunique RAW graph stateを別constructとして保持する。
5. legal branching、effective branching、reply compression、transposition、search instability、evaluation、empirical outcome、game-theoretic value、human difficultyを分離する。
6. structural forcingをgame-theoretic optimal forcingへ読み替えない。
7. machine branching / reply pressureをhuman difficultyへ読み替えない。
8. remote `main` HEAD、engine、rule semantics、serialization、RAW identity、move identityをStudy開始時にfreezeする。
9. source population、seed、source policy、root selection ruleをoutcome前にfreezeし、seed blockはconsume-onceとする。
10. development / formal evidence間にtrajectory・opening-prefix・RAW-root firewallを設ける。
11. productionとindependent reconstructionを別実装とする。
12. scientific primitiveは可能な限りinteger countまたはexact rational pairとする。
13. float derived metricは一次artifact、deterministic arithmetic、rounding / toleranceを事前固定する。
14. large artifact uploadだけを唯一のverification経路としない。
15. gate failure後のthreshold relaxation、seed extension、root replacement、favorable subgroupによる救済を行わない。
16. partial computation、resource cutoff、timeoutをcomplete exact resultまたはscientific nullへ読み替えない。
17. public AI strength、deployment、UX、latencyをscientific endpointへ混入させない。

### 10.4 Evidence classとprotected holdout

```text
TECHNICAL-FIXTURE
HISTORICAL-EXACT-REFERENCE
FRESH-DEVELOPMENT
FRESH-FORMAL-HELDOUT
FRESH-DEEPER-EXACT-HOLDOUT
DIAGNOSTIC-ONLY
HUMAN-EVIDENCE
```

G2-05 depth 0..9は`HISTORICAL-EXACT-REFERENCE`としてmetric design、fixture、resource planningに利用できるが、新しいformal held-out confirmationへ無条件に混合しない。

standard initial RAW rootのdepth 10 exact layerは`G3-11`用`FRESH-DEEPER-EXACT-HOLDOUT`としてsealedに保護する。G3-01〜G3-10ではdepth-10 scientific counts / geometry outcomeを生成・readせず、G2-12のproduction-only estimator proposalも持ち込まない。

### 10.5 Wave A — Local Geometry Foundations

- **G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1**: branching、reply width、transposition、reconvergence、tree/graph divergenceの再現可能なmeasurement foundationを構築する。**P0 / first recommended Study**
- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: 数plyにわたるeffective branching / reply-width profileが再現可能な局面特性として存在するかを検証する。**P0**
- **G3-03 — Transposition Concentration / Tree-to-Graph Divergence Study 1**: tree occurrenceとunique RAW graphの乖離、multi-parent、reconvergenceをexactに測定する。symmetry quotientは使用しない。**P0**
- **G3-04 — Structural Forcing-Corridor / Decision-Funnel Study 1**: reply narrowingが持続するcorridorと、多数branchが少数RAW stateへ収束するfunnelを検証する。`forcing`はstructural forcingのみを意味する。**P0**

### 10.6 Wave B — Geometry Dynamics and Mechanisms

- **G3-05 — Branch Expansion / Compression Transition Study 1**: trajectory上のbranch explosion、reply compression、branch reopening等のgeometry transitionを検証する。Research Generation 1 phase-transition resultとは別construct。**P1**
- **G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1**: capture、reserve、nyumba、Namua→Mtaji等のrule-semantic eventとbounded local geometryの関係をmove-conditionedに検証する。**P1**
- **G3-07 — Search Instability / Local Geometry Mechanism Study 1**: branching、reconvergence等とbest-move agreement、ranking churn、PV stabilityの関係をfresh evidenceで検証する。`G2-02 = INCONCLUSIVE`を変更しない。**P1**
- **G3-08 — Local Geometry Persistence / Memory-Length Study 1**: local geometryがtrajectory上で何ply持続し、いつ消失・反転・returnするかを検証する。**P1**

### 10.7 Wave C — Representation and Longitudinal Theory

- **G3-09 — Continuous Local-Geometry Representation Study 1**: discrete clusterを成功条件にせず、eligible geometry measuresをcontinuous representationとして統合できるかを検証する。G2-10 / PSRREの再実行ではない。**P2**
- **G3-10 — Geometry-Conditioned Longitudinal Dynamics Study 1**: local-geometry coordinatesのdirectionality、persistence、return、hysteresis、path dependenceを検証する。G2-11のstrategic-regime transition Studyを再実行しない。**P2**

### 10.8 Wave D — Reserved Exact Holdout and Generalization

- **G3-11 — Fresh Depth-10 Exact Geometry Holdout Validation Study 1**: standard initial RAW rootのdepth 10をsealed deeper exact holdoutとして独立検証する。RAW-only、no symmetry reduction、no G2-12 estimator input、complete layer、independent full enumerationを必須とする。depth 11を同Study内で追加救済しない。**P2 / protected holdout**
- **G3-12 — Local Game-Tree Geometry Generalization / Counterexample Study 1**: formalにeligibleとなったgeometry claimだけを対象にphase、root family、source policy、reserve / nyumba context等を横断したgeneralization / counterexample boundaryを確定する。**P2 / capstone**

### 10.9 Human Track — independent / non-blocking

- **G3-H01 — Human Perception of Local Branching / Decision Pressure Study 1**: human-perceived branching、forcing、criticality、reply-width expectation、decision confidence等を扱う。qualified Bao participant accessがない場合は`DEFERRED / INDEPENDENT / NON-BLOCKING`のままとし、N=0をnegative evidenceへ読み替えない。

### 10.10 Dependencyと推奨順序

```text
G3-01 Measurement Foundation
        ↓
G3-02 Effective Branching
G3-03 Transposition / Tree-Graph Divergence
G3-04 Corridor / Funnel
        ↓
G3-05 Geometry Transition
        ├─ G3-06 Rule Mechanism
        ├─ G3-07 Search Mechanism
        └─ G3-08 Persistence / Memory
        ↓
G3-09 Continuous Geometry Representation
        ↓
G3-10 Longitudinal Geometry Dynamics

G2-05 immutable depth 0..9 reference
        +
G3 geometry definitions frozen
        ↓
G3-11 Fresh Depth-10 Exact Holdout

G3-02..G3-11 formal closures
        ↓
G3-12 Generalization / Counterexamples
        ↓
Research Generation 3 Final Synthesis

G3-H01 = independent / non-blocking
```

### 10.11 第三世代プログラムの完了条件

Research Generation 3はpositive resultの数で完了判定しない。

1. G3-01〜G3-12がprospective stop ruleに従ってformal closureしている。
2. Research Generation 1 / 2のformal decisionsを変更・救済していない。
3. RAW identityとvalidated transform set `[]`のboundaryを独立authorizationなしに変更していない。
4. local geometry measurementについてformal instrument eligibilityまたは明確なnon-estimable / technical-invalid decisionがある。
5. effective branching、transposition、tree/graph divergence、corridor/funnelについてformal closureがある。
6. geometry transitionとBao rule mechanismについてformal closureがある。
7. local geometryとsearch instabilityの関係についてformal dispositionがある。
8. geometry persistence / memoryについてformal closureがある。
9. continuous local-geometry representationとlongitudinal dynamicsについてformal dispositionがある。
10. protected depth-10 exact holdoutがformalに検証されるか明確なformal closureを持つ。
11. geometry claimのgeneralization / counterexample boundaryがformal closureしている。
12. tree、graph、search、evaluation、game-theoretic value、human constructを分離している。
13. public AI engineeringをscientific successへ読み替えていない。
14. Research Generation 3全体のfinal synthesisが作成されている。

### 10.12 現在の開始状態

2026-08-31時点ではprogram planningのみ完了しており、scientific Studyは開始していない。

```text
Research Generation 3 = PROSPECTIVE PLAN / NOT YET STARTED
G3-01 formal Study ID = NOT ASSIGNED
scientific seed consumption = NONE
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

最初の推奨Studyは`G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1`である。開始時にremote `main`を再監査し、正式Study ID、Stage ID、technical fixture、fresh seed blocks、local horizon、population、metric schema、independent verifier boundary、formal decision taxonomyをoutcome生成前にprospectively固定する。
