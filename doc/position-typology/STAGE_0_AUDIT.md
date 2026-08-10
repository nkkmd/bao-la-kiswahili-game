# Stage 0 Audit — Instrumentation and Corpus Design

更新日: 2026-08-09  
Status: **exploratory Stage 0 audit / not preregistered / no formal experiment authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. この文書の位置づけ

本書は `RESEARCH_PLAN.md` の Stage 0 — Instrumentation and corpus audit を実装・データ面から具体化する監査記録である。

これはpreregistrationではない。以下はまだ固定しない。

- formal hypothesis
- cluster数
- position-type名称
- playing-style名称
- final feature set
- preprocessing
- formal seed block
- confirmation threshold
- statistical test
- formal execution policy

Stage 0の目的は、結果を見る前に固定すべき事項を識別し、探索段階で比較してよい事項と分離することにある。

---

## 2. Study 1との境界

局面相転移点Study 1はclosedであり、以下を変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only fixed `hard / bao / depth3`
- `capture-branch-expansion` classifier / vocabulary
- forced-capture regime definition
- `sustained-forcing window` のStage B retrospective interpretation boundary
- trajectory-ply sensitivityの位置づけ

Study 1のformal corpusは、本研究のposition-type discovery corpusには使用しない。後半のcross-study analysisで、独立に得られた局面類型との関係を調べるためにのみ参照する。

これにより、Study 1の結果に合うようにposition typeを形成するリークを避ける。

---

## 3. 現在の研究基盤

### 3.1 Engine

`public/engine.js` は研究用の到達可能局面生成に十分な状態と遷移APIを持つ。

主な状態:

- `pits`: 2 players × front/back × 8 pits
- `reserve`
- `houseOwned`
- `player`
- `phase`: `namua` / `mtaji`
- `winner`
- `reason`
- `turn`
- `pending`

主なAPI:

- `initialState()`
- `legalMoves()`
- `moveVariants()`
- `applyMove()`

`applyMove()` は sow / capture / relay / phase / turn 等のeventsを生成するため、relay・capture morphologyの追加計測もengine内部情報ではなくルール状態から導出できる。

### 3.2 AI

`public/ai.js` には少なくとも次がある。

- evaluator: `legacy`, `bao`, `bao-v2`
- search profile: `legacy`, enhanced/`phase2`, `mcts`
- depth-limited search
- search stats: nodes, quiescence nodes, cutoffs, cache stats, completedDepth, rootScore, timeout等
- `playerMetrics()` によるboard/legal-state由来の派生量

`playerMetrics()` には次が含まれる。

- board/front seeds
- front occupancy
- front connections
- reusable pits
- mobility
- capture move count
- maximum captured seeds over legal capture moves
- relay-related composite
- nyumba / reserve関連の評価用派生量

ただし、これらの一部は評価関数向けcompositeである。本研究ではAI評価設計を局面類型へ持ち込まないため、必要なprimitiveだけを専用feature extractorへ移植・再定義する。

### 3.3 Experiment tooling

既存toolingから再利用できる主要機能:

- seeded deterministic generation
- random opening generation
- source commit / source-file SHA-256 provenance
- config hash
- atomic partial/write and resume patterns
- replay verification
- state / move hashing
- trajectory hashing
- opening uniqueness audit
- symmetry transform and symmetry audit
- phase-transition observation extraction
- forced-capture regime extraction
- candidate/control trajectory-ply dedup analysis

重いformal corpusをGitHub Actionsで生成しない運用は継承する。

### 3.4 Existing artifacts

Repositoryに保存されているjoseki / first-player / symmetry artifactsは、feature extractor、state replay、symmetry、provenanceのQA用には再利用できる。

ただし、次の理由からposition typology discoveryの主corpusにはしない。

- joseki artifactsは標準初期局面近傍へ強く集中する。
- first-player artifactsは各研究目的に合わせたopening / condition分布を持つ。
- Study 1 formal archivesはcross-study independenceを守るためdiscoveryから隔離する。

したがって、本研究には新しい**exploratory corpus**が必要である。

---

## 4. 現在取得可能なposition-level featureの棚卸し

### 4.1 既存observation schemaで直接取得済み

`schemas/phase-transition-observation.schema.json` / `phase-transition-features.js` から直接取得できる。

| Feature | 現状 | Stage 0評価 |
|---|---|---|
| phase (`namua` / `mtaji`) | 取得済み | primary structural candidate |
| reserve[2] | 取得済み | primary structural candidate |
| houseOwned[2] | 取得済み | primary structural candidate |
| legalMoveCount | 取得済み | primary legal-state candidate |
| captureMoveCount | 取得済み | primary legal-state candidate |
| nonCaptureMoveCount | 取得済み | legal/captureから導出可能、冗長性監査対象 |
| forcedCapture | 取得済み | primary legal-state candidate |
| boardSeedCount | 取得済み | global summaryのみ |
| nonEmptyPitCount | 取得済み | global summaryのみ |
| front-row occupied pits | 取得済み | primary structural candidate |
| front-row occupancy rate | 取得済み | occupied pitsと決定論的重複 |
| front-row seed count | 取得済み | primary structural candidate |
| player-to-move | 取得済み | identity / actor perspective用 |
| ply / seed / gameId / conditionId | 取得済み | provenance/context、cluster inputには原則入れない |
| stateHash / previousStateHash | 取得済み | exact historical identity / replay QA |

### 4.2 Engine stateからすぐ追加できるprimitive

既存phase-transition observationには保存されないが、generation時またはmove replayで取得可能。

| Feature | 現状 | 方針 |
|---|---|---|
| full 32-pit seed vector | engine stateに存在 | 新typology schemaへ保存する |
| front/back row seed counts per player | 算出可能 | primary candidate |
| front/back occupied pits per player | 算出可能 | primary candidate |
| nyumba pit seed count per player | 既存joseki toolingで算出済み | primary candidate |
| reusable pit count (`>=2`) | AI toolingで算出可能 | primitiveとして再定義 |
| front adjacency / connections | AI toolingで算出可能 | structural candidate |
| legal moves per player | joseki toolingで算出済み | actor/opponent表現を検討 |
| capture moves per player | joseki toolingで算出済み | actor/opponent表現を検討 |
| maximum capturable seeds | AI `playerMetrics()`で算出可能 | 専用primitiveとして実装 |
| max / mean relay count over legal moves | `applyMove().events`から算出可能 | 新規primitive extractorが必要 |
| max / mean sow-chain event length | `applyMove().events`から算出可能 | 定義整理が必要 |
| pit-distribution summaries | raw pitsから算出可能 | entropy/Gini等を含め探索比較候補 |

### 4.3 定義整理が必要なもの

#### mobility

現AI実装の`mobility`は「passを除く合法手数」であり、多くの局面で`legalMoveCount`とほぼ同義になる。独立featureとして使う前に、単純な合法手数と区別できる定義が必要。

#### relay / sowing-chain

現AIの`relayShape`は純粋なrelay長ではなく、relay長とreusable-pit数を合成した評価用compositeである。typologyにはそのまま使用せず、engine eventsからprimitiveを定義する。

#### seed distribution

raw pit vectorと、そのsummary（occupied count, max pit, variance, concentration, front/back balance, adjacency等）を区別する。raw vectorはprovenance / representative-position reconstructionのため保存するが、全32次元をそのままclusteringへ入れるかはStage 1で比較する。

#### forced-capture regime関連

`forcedCapture`はstate-level featureである。

一方、次はtrajectory-context featureであり、position typeの初期定義と分離する。

- regime id / length
- position in regime
- normalized position in regime
- forcing streak
- distance to forcing release
- recent persistence

これらを初期clusteringへ入れると、state-level position typeとtrajectory morphologyが混ざるため、secondary interpretation / transition analysis側へ置く。

---

## 5. AI内部情報との分離

### Tier A — Primary board/legal-state candidates

初期typology discoveryで使用可能性を比較する対象。

- phase
- reserve / reserve difference
- house ownership / nyumba seeds
- raw pit distribution and board summaries
- front/back occupancy and seed counts
- legal move count
- capture move count
- forced capture
- maximum capturable seeds
- primitive relay / sow-chain measures
- reusable pits / adjacency等の明示的board primitives

### Tier B — Trajectory/context features

position typeの発見には原則入れず、transition・playing-style分析で使う。

- ply / turn
- opening id / opening depth
- trajectory id
- forced-capture regime lifecycle
- recent persistence / dwell history
- transition timing

### Tier C — Secondary AI/search features

初期position clusteringには使用しない。

- evaluation value / rootScore
- evaluation category
- search depth reached
- node count
- quiescence nodes
- cutoff count
- cache stats
- PV
- horizon diagnostics

現AIは多くのsearch statsを内部計測できるが、既存phase-transition game artifactは主に`completedDepth`, `nodes`, `timedOut`だけをmove-levelに保存している。

PVおよび明示的horizon diagnosticは現行archiveにない。必要なら将来別instrumentationとする。

---

## 6. Position identity — 「同じ局面」の層を分ける

本研究では、単一のhashをすべての意味で「同じ局面」としない。

### 6.1 Historical exact state hash

既存 `phase-transition-features.js` の `stateHash` は次を含む。

- pits
- reserve
- houseOwned
- player
- phase
- winner / reason
- turn
- pending

これはhistorical replay identityとして有用だが、`turn`やterminal metadataまで含むため、そのままposition typology上の構造同値とはみなさない。

### 6.2 Rule-state identity

Stage 0で新しい`ruleStateKey`を定義する。

非終局局面では少なくとも:

- pits
- reserve
- houseOwned
- player to move
- phase

を含む。

`turn`, `seed`, `gameId`, AI condition, evaluation, search statsは含めない。

terminal局面をdiscovery populationへ含めるかは別decisionとし、含める場合はwinner / terminal statusの扱いを明示する。

### 6.3 Seat-canonical identity

既存symmetry研究では、South/North seat exchangeの正しい変換は「player-indexed stateの交換のみ」であり、column / direction反転を行わないcandidate Dとして確認されている。

この既存transformを利用し、

`min(hash(ruleState), hash(seatSwap(ruleState)))`

型のseat-canonical keyを候補とする。

ただしtypology用keyとして採用する前に、新exploratory reachable-state sample上で以下を再検証する。

- involution
- legal-move equivalence
- transformed move application equivalence
- phase別一致

### 6.4 左右反転は自動canonicalizationしない

既存symmetry研究では、ローカル穴番号をさらに左右反転するとnyumba位置を含む意味が変わり得ることが確認されている。

したがって、単純なcolumn reversal / direction reversalはposition dedupに使用しない。

追加の同型関係を導入する場合は、独立したsymmetry proof / exhaustive or large reachable-state auditを要求する。

### 6.5 Trajectory identity

既存Study 1の`trajectoryHash`は、記録された`stateHash`列のSHA-256である。決定論的trajectory repetition検出には引き続き有用。

新研究ではさらに、必要に応じて`ruleStateKey`列に基づくstructural trajectory hashをsecondaryに計算できる。

trajectory equalityとposition equalityを混同しない。

---

## 7. Sampling / weighting / duplication policy

多数のplyを独立標本として数えない。

Stage 0から次を必須監査する。

1. raw game count
2. unique trajectory count
3. largest trajectory repetition group
4. raw position count
5. exact `ruleStateKey` unique count
6. seat-canonical unique position count
7. within-trajectory repeated-position count
8. opening sequence concentration
9. phase distribution
10. generation-condition distribution

### Exploratory clusteringでの基本原則

- exact / seat-equivalent duplicate positionをそのまま頻度水増ししない。
- stability assessmentのresampling unitはpositionではなくtrajectory / gameを基本とする。
- algorithmがsample weightを扱える場合はtrajectory-balanced weightを優先検討する。
- weight非対応methodでは、trajectory-phase単位の決定論的balanced subsamplingを比較候補とする。
- raw frequencyを戦略上の「よく現れる局面」として分析する場合は、type discoveryとは別endpointとして扱う。

---

## 8. Exploratory corpus方針

### 8.1 新規corpusが必要

position typology discovery用にfresh exploratory corpusを生成する。

理由:

- current committed artifactsはopening / prior-study目的に偏る。
- Study 1 formal corpusをdiscoveryへ使うとcross-study independenceが弱くなる。
- full pit stateと新primitive featuresをgeneration時に保存した方が再現性が高い。

### 8.2 Generation policy

単一AI条件だけから局面語彙を発見しない。

exploratory corpusでは、複数のgeneration conditionを**sampling strata**として使用できる。ただしcondition labelはclustering inputに使用しない。

比較候補:

- evaluator family
- search profile
- shallow / moderate depth
- seeded-random opening diversification
- standard-start trajectories

条件数、深度、opening plies、games数、seed値はまだ固定しない。instrumentation smoke後に多様性と計算量を見てexploratory designとして決める。

### 8.3 Confirmatory corpusの保護

future confirmatory seed blockは現段階では割り当てない。

- exploratory seed namespace / manifestを記録する。
- confirmatory seedはpreregistration時に新規固定する。
- exploratoryで使用したseed / opening / trajectoryをconfirmationへ再利用しない。
- Study 1 formal seed/corpusはcross-study secondary用として隔離する。

---

## 9. Data quality gates

### 9.1 Hard integrity gates — 生成物を分析へ入れる前に必ずpass

- schema validation: 100%
- game replay: 100%
- every recorded move legal on replay: 100%
- replayed state key / stored state key agreement: 100%
- final-state agreement: 100%
- provenance present: source commit, source-file hashes, config hash, seed
- duplicate game / duplicate position key accounting completed
- no silent partial files in completed corpus
- deterministic rerun spot-check agrees for fixed seed/config

### 9.2 Coverage diagnostics — thresholdはpilot後にexploratoryに設定

- unique trajectory rate
- dominant trajectory rate
- unique canonical-position rate
- phase coverage
- condition coverage
- opening concentration
- position count per trajectory / phase
- terminal-near concentration
- forced-capture share
- legal-move-count range
- reserve / nyumba / front-row support

これらは最初のsmokeで分布を確認してからexploratory corpus採用基準を定める。結果を見てconfirmatory thresholdを後付けすることとは区別する。

---

## 10. Stage 1 method comparisonの入口

Stage 0では以下を決め打ちしない。

- unsupervised clustering
- dimensionality reduction
- rule-based typology
- semi-supervised approach
- cluster数

Stage 1では少なくとも次を比較する。

### A. Unsupervised

- mixed continuous / binary featureを扱える方法
- trajectory-balanced weightingまたはbalanced sampleでのstability
- multiple cluster-resolution comparison

### B. Dimensionality reduction

可視化・feature redundancy把握に使う。2D embeddingだけでtype definitionを固定しない。

### C. Rule-based

データで反復構造が明瞭な場合に、cluster解釈後のhuman-readable classifier候補として検討する。

### D. Semi-supervised

exploratory cluster / representative positionsを人間が解釈した後に、bounded classifierへ変換する段階で検討する。

---

## 11. Phaseを分けるか

現時点では未固定。

ただしnamuaとmtajiは:

- legal move generation ruleが異なる
- reserveの意味が異なる
- phase遷移が明確なrule-state transitionである

ため、joint clusteringではphase自体が強い分離軸になる可能性が高い。

Stage 1では:

1. phase-separated feature spaces
2. phaseを明示したjoint feature space

を比較する。

人間語彙として同一構造をphase横断でまとめるのは、共通性がデータで確認された後に行う。

---

## 12. Playing styleへの接続

position typeを固定・replicateする前にplaying styleを命名しない。

将来のplaying-style profileはtrajectory / policy-levelで、例えば次から構成する。

- type occupancy
- dwell distribution
- transition matrix
- phase別type timing
- reserve consumption conditional on type
- capture-choice behavior conditional on type
- forced-capture utilization
- entry / exit patterns

AI condition (`phase2`, `legacy`, depth, evaluator)はstyle labelではなく、固定されたstyle descriptorとの対応を測るexplanatory / grouping variableとする。

---

## 13. Confirmatory validationへ進む前に固定すべきもの

exploratory discovery終了後、confirmation dataを見る前に新規preregistrationで固定する。

- target position population
- terminal-position policy
- phase handling
- exact feature set
- feature transformations / scaling
- missing-value policy
- rule-state / canonical-position definition
- deduplication rule
- weighting / sampling rule
- frozen position-type classifier or assignment procedure
- cluster/type availability requirement
- new seed block
- replication endpoint
- stability / agreement metric
- success / failure / inconclusive rule
- statistical test if used
- stopping condition
- formal execution policy and execution lock

---

## 14. 次の実装順序

formal experimentではなく、Stage 0 instrumentationとして次を行う。

1. `position-typology`専用state/feature extractorを追加する。
2. full pits + primitive structural featuresを保存する新schemaを追加する。
3. `ruleStateKey`とseat-canonical keyを実装する。
4. existing candidate-D seat symmetryをtypology key上でtestする。
5. replay / schema / dedup / provenance verifierを追加する。
6. exploratory generatorは既存seeded generation / atomic resume基盤を再利用する。
7. 小規模instrumentation smokeを生成し、coverage diagnosticsだけを確認する。
8. smoke結果からStage 1 exploratory corpus設計を確定する。
9. その後にのみexploratory typology discoveryへ進む。

この段階ではformal hypothesis、cluster数、類型名、棋風名、confirmation thresholdを固定しない。

---

## 15. Stage 0結論

現在のrepositoryは、Bao position typology研究を開始できる十分なengine / AI / experiment / provenance基盤を持つ。

ただし既存phase-transition observationは局面分類用としては情報が不足している。特にfull pit distributionとposition canonical identityを新研究用に明示する必要がある。

最優先の方法論的判断は次である。

> **「同じ局面」を、同一game/plyやhistorical state hashではなく、ルール上意味のあるstate identityと、検証済みseat symmetryによるcanonical identityとして定義する。**

また、forced-capture regime positionやAI search diagnosticsは有用だが、初期position-type discoveryには混ぜず、trajectory / interpretation / cross-study layerへ分離する。

したがって次工程は、大量自己対局やclusteringではなく、**typology専用instrumentation + identity QA + small exploratory smoke**である。
