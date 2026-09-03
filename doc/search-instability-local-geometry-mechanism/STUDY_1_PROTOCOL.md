# SILGM-STUDY1 — Study 1 Protocol

Freeze date: 2026-09-03  
Program: Research Generation 3 / G3-07  
Program authorization: **`G3-07-AUTHORIZED`**  
Study baseline remote `main`: `ba48c5c3643649655137d5d3c07988fdc84bee9d`  
Research branch: `research/g3-07-search-instability-local-geometry-mechanism`

## 1. Formal identity

**Study ID:** `SILGM-STUDY1`

**English title:**

**Search Instability / Local Geometry Mechanism Study 1 — Prospective exact association analysis of bounded RAW local game-tree geometry with best-move, TopSet, ranking, score-gap, and principal-variation changes under deterministic search-condition perturbations in Bao**

**正式日本語題目:**

**Baoにおける探索不安定性と局所ゲーム木幾何のprospective exact関連解析 — bounded RAW branching・reconvergence・reply compressionとbest-move・TopSet・ranking・score-gap・PV変動の決定論的search-condition間集中関係の検証**

Historical agendaの`Mechanism`はcausal mechanism claimをauthorizeしない。本Studyで許可するclaim classは、frozen population / relative-depth-5 RAW geometry / frozen search-condition family内の`association`、`concentration`、`bounded structural relation`に限定する。

## 2. Primary question

> prospectively固定したBaoのRAW局面集団において、決定論的search conditionを変更したときに生じるdecision-output changeは局面全体へ均等に分布するのか、それともformal-eligibleなbounded local game-tree geometryの特定領域へ集中・関連するのか。

本StudyはG2-02を救済・再判定しない。G3-02 / G3-03 / G3-05 / G3-06のtechnical-invalid evidenceをpositive/negative prerequisiteとして用いない。G3-04 C1/C6も再検証対象ではなくcontext onlyである。

## 3. Construct boundary

以下を別constructとして維持する。

- legal branching
- bounded local RAW tree/graph geometry
- transposition / reconvergence
- reply compression
- search instability
- best-move identity
- move ranking
- evaluation score
- principal variation
- game-theoretic value
- empirical outcome / win probability
- human difficulty

高depth、高node budget、長いPVを`truth`、`correct move`、`optimal move`とみなさない。search-output changeは「どちらかが誤り」という意味ではない。

## 4. Representation / rule binding

Scientific state identityはRAW-only:

`pits,reserve,houseOwned,player,phase,winner,pending`

Move identity:

`type,phase,row,index,direction,side,houseChoice,houseTwo`

Validated transform setは`[]`。symmetry、reflection、player swap、canonical orbit、symmetry quotientは使用しない。

Relative local horizonは`5`で固定する。

Authoritative rule runtimeは`public/engine.js`。human-readable baselineは`doc/RULES_BASELINE.md`。`relay-limit`はengine safety sentinelでありgame resultとして解釈しない。

Freeze時source binding:

```text
public/engine.js = blob 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = blob 8d472be415fac17e47a8e5e667cea9672e7a9ef5
LGTGMIV production reference = a4664f01535d6abbf6f83821befbb2fafd55cde6
LGTGMIV independent reference = 0c7239ac7acf146e9aee63dae66194681b8631d6
G2-02 controlled-search technical reference = f3a6951fe711db62e164910cfb248a9cbc2cac1a
G2-02 independent-verifier technical reference = 18b756f019902b80da2383ced1d148f4fe5d0760
```

G2-02のscientific rows / direction / formal resultはG3-07 evidenceではない。

## 5. Eligible geometry contract

使用可能なのはLGTGMIVのformal eligible F1-F5と、そのexact primitiveからprospectively定義した次の5 metricだけである。

1. `SILGM-G1-ROOT-LEGAL-WIDTH` — root legal move count
2. `SILGM-G2-CUMULATIVE-TREE-OCCURRENCE` — depth 0..5 tree occurrence sum
3. `SILGM-G3-DUPLICATE-TRANSITION-FRACTION` — exact duplicate-transition fraction
4. `SILGM-G4-CUMULATIVE-TREE-RAW-RATIO` — exact cumulative tree / distinct RAW ratio
5. `SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION` — exact depth-labelled unit-width occupancy fraction

G3-02 / G3-03 / G3-05 / G3-06のcandidate direction、threshold、diagnostic telemetryは継承しない。G3-04 C1/C6の既知方向をthresholdやcandidate選択に使用しない。

## 6. Search-condition family

Evaluation profileは`bao`。root legal moveはcanonical move identity ascending。score tie toleranceは0。TopSetはexact maximum scoreの全move。canonical bestはTopSet内canonical-lowest moveであり、客観的な唯一best moveを意味しない。

6 conditionsを3つのpeer contrastとして固定する。

```text
SC1 depth:       D2_Q1              vs D3_Q1
SC2 node budget: B256_Q1_MAXD3      vs B1024_Q1_MAXD3
SC3 quiescence:  D2_Q0              vs D2_Q2
```

Node-budget semanticsは`last completely evaluated all-root-candidates iterative-deepening depth; partial depth discarded`。

いずれのcontrastでもcondition A/Bをtruth/reference correct conditionとは扱わない。wall-clock timeはscientific conditionに含めない。

## 7. Search-instability endpoints

各contrastで次の5 endpointを別々に測る。

1. `SILGM-E1-CANONICAL-BEST-CHANGE` — canonical-best identity change
2. `SILGM-E2-TOPSET-CHANGE` — exact TopSet set change
3. `SILGM-E3-RANKING-PREORDER-CHANGE` — legal-move pairwise score preorder `<,=,>`のいずれかが変化
4. `SILGM-E4-BEST-SECOND-GAP-CHANGE` — exact best-second score gap change
5. `SILGM-E5-PV-PREFIX2-CHANGE` — canonical nominal PVの先頭2 ply signature change

すべてprimary candidate constructionではbinary `0/1`。E4は2手以上かつfinite safe-integer score domainを要求する。E5は短いPVにtermination markerを用い、prefix長差を曖昧にしない。

Stage 0でsafe-integer score domainまたはPV semanticsをexact再現できなければfail closedする。結果後にtoleranceを導入しない。

## 8. Stage structure

### Stage 0

`SILGM-S0-TECHNICAL-2026-09-03-v1`

TECHNICAL-FIXTURE only。fresh Stage 1/2 seed accessは禁止。synthetic geometry fixturesと、scientific namespaceから永久除外したtechnical-only fixturesだけでgeometry/search/association machineryを検証する。

### Stage 1

`SILGM-S1-DEVELOPMENT-2026-09-03-v1`

Fresh development。現時点では**NOT AUTHORIZED**。Stage 0 PASS後もseparate Stage 1 authorizationが必要。

### Stage 2

`SILGM-S2-FORMAL-2026-09-03-v1`

Fresh formal held-out。valid Stage 1 completion + nonempty promoted set + separate Stage 2 authorizationが必要。

## 9. Seed namespaces

```text
technical-only = 31709001..31709008 / scientific use prohibited
Stage 1 = 31710001..31710256 / RESERVED / NOT CONSUMED
Stage 2 = 31720001..31720384 / RESERVED / NOT CONSUMED
```

`31700001..31700512`は独立AI-engineering validationで既使用のためG3-07では使用しない。

## 10. Source population

Mulberry32。各plyでengine legal movesをcanonical identity ascendingへ並べ、そのindexをseeded-uniformで選ぶ。max source ply=80、minimum selectable ply=16。

1 historical trajectoryから最大1 root。各stage固有saltでfull trajectory identityのSHA-256 parityからNamua/Mtajiをassignし、assigned phase内のeligible stateから`trajectory identity + RAW identity + ply`のminimum SHA-256 rankを選ぶ。

Eligibility:

- nonterminal
- ply >= 16
- assigned phase一致
- legal moves >= 2
- source trajectoryにselection以前のrelay-limitなし

同一RAW rootが複数trajectoryから候補になった場合はminimum selection rankだけ残し、replacementしない。

Stage 1 targetはNamua 24 + Mtaji 24 = 48 roots。Stage 2 targetはNamua 36 + Mtaji 36 = 72 roots。seed extensionなし。

## 11. Development → formal promotion

Formal candidate slotは`3 contrasts × 5 endpoints = 15`。各slotでG1..G5を競合metricとする。

Stage 1各phase・各geometry metricについて、ordered geometry values中央2値のexact rational midpointをthresholdとする。`value > threshold = HIGH`、`value < threshold = LOW`、exact equalはそのmetricのHIGH/LOW比較から除外する。

Promotion eligibility per phase:

```text
HIGH >= 8
LOW >= 8
endpoint changed >= 4
endpoint unchanged >= 4
```

各metricについてphase別`risk(HIGH)-risk(LOW)`をexact rationalで求める。Namua/Mtaji双方がnonzeroかつ同符号の場合のみeligible。eligible metricが複数なら、2 phaseのabsolute risk-difference sum最大を採用し、exact tieはmetricId lexical ascending。

Promotion identity:

`contrastId + endpointId + selected metricId + phase-specific Stage1 thresholds + direction`

Magnitude thresholdは設けない。最大15 candidates。0 candidatesならStage 2はauthorizeしない。

## 12. Stage 2 formal test

Stage 1でfreezeしたphase-specific thresholdとdirectionだけを使用する。

Estimability per phase:

```text
HIGH >= 10
LOW >= 10
changed >= 6
unchanged >= 6
```

Within phaseで`N=HIGH+LOW`, `K=changed total`, `n=HIGH`, `X=changed in HIGH`とする。null conditional distributionは`X ~ Hypergeometric(N,K,n)`。Namua/Mtajiのexact rational PMFをconvolutionして`T = X_Namua + X_Mtaji`を作る。Stage 1 directionに対応するone-sided exact tailを使う。

Multiple testingは全estimable promoted candidatesにHolm-Bonferroni、FWER `1/20`。

Candidate label:

- `CONFIRMED`
- `NOT-CONFIRMED`
- `NON-ESTIMABLE`

confirmationしても意味はfrozen scope内のgeometry/search-output associationだけである。

## 13. Exact arithmetic

Geometryはintegerまたはpositive denominatorのreduced rational。binary endpointは0/1。risk differenceとmedian midpointはreduced rational。formal probabilityはBigInt combinatorics + exact rational。

Float tolerance、scientific rounding、post-result epsilonは使用しない。

## 14. Independent verification

Production / independentは少なくとも次を別実装する。

- source replay / root selection
- RAW / move canonical identity
- geometry reconstruction / metric derivation
- deterministic search conditions
- TopSet / ranking preorder / gap / PV endpoint
- development candidate construction
- formal exact-test arithmetic

Independent search verifierはproduction G3-07 search/aggregation moduleをimportしてはならない。public engine/evaluatorは共通authoritative runtimeとしてbind可能。

Scientific equalityはcanonical sorted JSON -> UTF-8 -> SHA-256 exact。prototype-sensitive object equalityはscientific gateとしない。

## 15. Freshness firewall

Stage 1前にupstream identity-only manifestをmaterializeし、少なくともLGTGMIV、G3-02、G3-03、G3-04、G3-05、G3-06のprior scientific population identityを除外する。scientific outcome fieldはretainしない。

特にG3-06からretain禁止:

- selector mismatch diagnostics
- event direction
- unmaterialized candidate information
- partial/failed selection provenance
- hypothetical mechanism interpretation

G2-02 scientific rowsもretainしない。

Stage 2はStage 1のsource seed、full trajectory、opening prefix、selected RAW root、source ply/root-window identityを除外する。

## 16. Resource / failure contract

GeometryはLGTGMIVのbounded per-root ceilingsを上限基準として維持する。Stage 0自体はelapsed 600,000 ms、RSS 2 GiB、result artifact 64 MiBを上限とする。

Fresh Stage 1/2のcombined geometry+search ceilingsは、Stage 0のtechnical-only測定からstage authorization前にmaterializeする。fresh populationをresource probeにしない。

Required unitでrelay-limit、search exception、nonfinite score、mandatory production/independent mismatchが発生した場合はfail closed。root replacement、seed extension、ceiling relaxation、same-evidence repair/rerunを行わない。

## 17. Execution integrity

Fresh scientific Stageは原則:

```text
max authorized scientific executions = 1
authorization != arming != computation
durable pre-computation lease required
source blob binding required
single trigger path
concurrency guard
artifact-before-mirror
exact-byte recovery only
execution-count audit required
```

## 18. No-rescue

G3-07 fresh seed/evidenceへの最初のgeneration/readでboundaryをcrossする。その後、seed extension、root replacement、favorable subgroup、threshold relaxation、endpoint substitution、candidate redesign、search-condition redesign、geometry substitution、verification relaxation、resource ceiling relaxation、repair-and-rerun、partial-result promotionは禁止。

## 19. Protected evidence

Standard initial RAW-root complete exact depth-10 holdout:

**`SEALED / NOT GENERATED / NOT READ`**

本Studyのauthorization review、freeze、Stage 0、Stage 1、Stage 2のいずれでもgeneration / partial generation / read / peek / trial enumeration / resource estimationを行わない。

## 20. Main integration

Study closure後もresearch branchを自動で`main`へ統合しない。final report / current status / decision register / reproducibility index / central current-facing documents / final consistency auditをbranch上で完了し、ユーザーから明示的なmain統合指示があった場合のみintegration reviewへ進む。
