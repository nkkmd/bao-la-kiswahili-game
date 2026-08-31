# LGTGMF-STUDY1 — Scientific Protocol

更新日: 2026-08-31  
Program: Research Generation 3 `G3-01`  
Study ID: `LGTGMF-STUDY1`  
Formal title: **Local Game-Tree Geometry Measurement Foundation Study 1**  
日本語題目: **Baoにおける局所ゲーム木幾何の再現可能な測定基盤構築 — bounded RAW tree/graph の exact reconstruction による branching、reply width、transposition、reconvergence、tree/graph divergence のprospective定義・検証**

## 1. 研究目的

本Studyの目的は、同一のauthoritative RAW rootと同一のbounded local horizonから生成されるlegal game treeとreachable RAW graphについて、production implementationとstructurally independent implementationが同じexact primitiveを再構築できるmeasurement instrumentを確立することである。

本Studyはstrategic clustering、whole-Bao state-space / game-tree estimation、search evaluation、game-theoretic solving、human difficulty推定を行わない。狭いbranch、reply width 1、corridor-like structure等はstructural constructとしてのみ扱い、それ自体を「強制手」「最善手」「必勝手」と解釈しない。

## 2. Baseline / branch / upstream boundary

```text
remote main at Study start = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
research branch = research/g3-01-local-game-tree-geometry-measurement-foundation
Research Generation 2 = CLOSED
Research Generation 3 before this Study = PROSPECTIVE PLAN INTEGRATED TO MAIN / NOT YET STARTED
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator = null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
```

G2-05、G2-11、G2-12を含むclosed Research Generation 1 / 2 resultを、本Studyの結果によって変更・救済・再定義しない。

## 3. Stage identity

```text
Stage 0 = LGTGMF-S0-TECHNICAL-2026-08-31-v1
Stage 1 = LGTGMF-S1-DEVELOPMENT-2026-08-31-v1
Stage 2 = LGTGMF-S2-FORMAL-2026-08-31-v1
```

Stage 0はtechnical-onlyでありBaoのscientific findingを生成しない。Stage 1はfresh development、Stage 2はfresh formal held-out instrument validationである。

## 4. Authoritative RAW identity

state identityは次の7 fieldだけから構成する。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`はidentityに含めない。`pending`は必須であり、盤上・reserve・pendingのrepresented seed totalは64でなければならない。

RAW serializationは、上記7 fieldだけを含むJSON objectを再帰的key-sortしたUTF-8 JSON textとする。RAW keyはそのtextのSHA-256 lowercase hexとする。

次は禁止する。

```text
reflection
rotation
player swap
seat equivalence
symmetry quotient
canonicalization beyond deterministic RAW serialization
isomorphic deduplication
```

同一stateとしてdeduplicateできるのはRAW keyが同一の場合だけである。

## 5. Exact move identity / successor binding

formal move identity fieldsは次とする。

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

undefined / null fieldは空string、`houseTwo`はbooleanとしてcanonical move keyへserializeする。legal move variantsは`public/engine.js`の`moveVariants(state)`をauthoritative move-set sourceとし、successorは`applyMove(state, move).state`で得る。

formal edge bindingは:

```text
source RAW key -> exact move key -> successor RAW key
```

である。productionとindependent verifierはmove orderingに依存してはならず、出力集合・hashはcanonical sort後に作る。

`applyMove`がoperational safety guard `reason = relay-limit`を返した場合、そのedgeをBao terminal evidenceとして扱わない。該当root enumerationを`MOVE-NONTERMINATION`としてincomplete / censoredに停止する。

## 6. Local tree semantics

rootをrelative depth 0とし、各legal move variantを1 edgeとするpath-prefix treeを考える。

- `treeNodeOccurrences[d]`: rootからexactly `d` pliesのlegal path prefixの個数。RAW stateが同一でもpathが異なれば別occurrence。
- `treeEdgeOccurrences[d]`: relative depth `d`から`d+1`へ伸びるtree edge occurrence数。complete treeでは`treeEdgeOccurrences[d] = treeNodeOccurrences[d+1]`。
- `rootLegalMoveCount`: rootのexact legal move variant数。
- `rootMoveSubtreeOccurrences[m][d]`: root move `m`で始まるpathのうち、rootからrelative depth `d`にあるoccurrence数。`d>=1`。
- `terminalOccurrenceCount[d]`: `winner != null`のtree occurrence数。ただし`relay-limit`由来は除外し、root runをcensoredとする。
- `branchSurvivalLength[m]`: root move `m`のsubtreeに少なくとも1 occurrenceが存在する最大relative depth。horizonまで存続した場合はvalueとともに`rightCensored=true`を保存し、extinctionとは呼ばない。

primary primitiveはinteger / BigInt decimal stringで保存する。

## 7. RAW graph semantics

`U_d`を、rootからexactly `d` pliesで到達可能なdistinct authoritative RAW key集合とする。同じRAW keyは複数depthの`U_d`に存在してよい。

- `uniqueRawStateCount[d] = |U_d|`
- `cumulativeUniqueRawStateCount[d] = |U_0 union ... union U_d|`
- `uniqueTransitionSet[d]`: sourceが`U_d`にあるcanonical triple `(sourceRawKey, exactMoveKey, successorRawKey)`の集合
- `uniqueTransitionCount[d]`: 上記集合のcardinality
- `arrivalTransitionCount[d]`: `U_{d-1}`から`U_d`へ到着するunique transition数。`d>=1`
- `duplicateEncounterCount[d] = arrivalTransitionCount[d] - uniqueRawStateCount[d]`
- `arrivalMultiplicity(child,d)`: childへ入るdistinct exact transition数
- `parentMultiplicity(child,d)`: childへ入るdistinct source RAW key数
- `multiParentRawStateCount[d]`: `parentMultiplicity >= 2`のchild数

`duplicateEncounterCount`はtraversal時に「二回目以降に見た回数」を数える実装依存counterではなく、complete canonical arrival relationから計算する。

## 8. Reconvergence / subtree overlap semantics

各depthのRAW stateに、そのstateへ到達したroot exact moveのlabel setを付与する。

- `rootBranchLabelMultiplicity(state,d)`: distinct root-move label数。
- `reconvergentRawStateCount[d]`: label multiplicity >=2のRAW state数。
- `firstReconvergenceDepth`: reconvergent RAW stateが初めて存在するrelative depth。存在しなければ`null`。
- `rootBranchPairOverlap[a,b,d]`: root move pair `(a,b)`のdescendant RAW setのintersection / unionを、primaryにはexact pair `{numerator,denominator}`で保存する。union 0は当該cellを`NOT-DEFINED`とし0除算しない。

同一parentから異なるmoveで同じchildへ到着する場合はarrival multiplicityには反映するが、parent multiplicity 2とは数えない。root branch labelが異なる場合のみroot-branch reconvergenceへ入る。

## 9. Tree / graph relation

次をexact primitive / rational pairとして保存する。

- `treeNodeExcess[d] = treeNodeOccurrences[d] - uniqueRawStateCount[d]`
- `treeToUniqueRawRatio[d] = { numerator: treeNodeOccurrences[d], denominator: uniqueRawStateCount[d] }`
- `treeEdgeToUniqueTransitionRatio[d] = { numerator: treeEdgeOccurrences[d], denominator: uniqueTransitionCount[d] }`
- `duplicateEncounterFraction[d] = { numerator: duplicateEncounterCount[d], denominator: arrivalTransitionCount[d] }`
- `graphStateExpansion[d] = { numerator: uniqueRawStateCount[d+1], denominator: uniqueRawStateCount[d] }`
- `graphTransitionBranching[d] = { numerator: uniqueTransitionCount[d], denominator: uniqueRawStateCount[d] }`

`effective branching`という語はG3-01のformal primitive名に使用しない。上記exactly defined ratiosをdownstream Studyが別constructへ昇格させる場合は、そのStudyで新たにcontractを固定する。

## 10. Reply geometry

stateの`legalWidth`はexact legal move variant数とする。terminal stateは0。nonterminalで0 legal moveとなった場合はintegrity failureとして扱う。

- `immediateReplyWidth[m]`: root move `m`のsuccessor RAW stateのlegalWidth。
- `replyWidthHistogram[d]`: `U_d`のunique RAW statesを1回ずつ数えたlegalWidth histogram。
- `treeOccurrenceReplyWidthHistogram[d]`: tree occurrence multiplicityでweightedした別histogram。unique-state profileと混同しない。
- `widthDelta(edge) = childWidth - parentWidth`。terminal childは0。
- `widthExpansionCount[d]`: widthDelta > 0のunique transition数。
- `widthCompressionCount[d]`: widthDelta < 0のunique transition数。
- `widthStableCount[d]`: widthDelta = 0のunique transition数。
- `unitWidthStateCount[d]`: legalWidth = 1のunique RAW state数。
- `branchReopeningCount[d]`: parent legalWidth = 1かつchild legalWidth >= 2のunique transition数。
- `branchExtinctionCount[d]`: childがgenuine terminal (`winner != null`かつrelay-limitではない)となるunique transition数。

`narrowPathRun`はconsecutive unique-transition path上でlegalWidth=1のstateが続く長さとして記述する。bounded horizon端で継続中のrunは`rightCensored=true`とし、formal primary endpointにはrunのexact path records / histogramのみ用いる。human difficultyやgame-theoretic forcingへ読み替えない。

## 11. Candidate metric family partition

Study開始時に次の5 familyを固定する。

```text
F1-TREE-OCCURRENCE
F2-RAW-GRAPH
F3-TRANSPOSITION-RECONVERGENCE
F4-TREE-GRAPH-RELATION
F5-REPLY-GEOMETRY
```

Stage 1でfamilyを追加しない。Stage 1は、上記familyについてimplementation exactness、complete computability、artifact compactnessを確認し、formal Stage 2へ渡せるfamilyをfamily単位でfreezeする。failureしたfamilyを結果後に削除してStudy全体をpositiveへ見せ替えない。

## 12. Evidence class

```text
TECHNICAL-FIXTURE
HISTORICAL-EXACT-REFERENCE
FRESH-DEVELOPMENT
FRESH-FORMAL-HELDOUT
DIAGNOSTIC-ONLY
```

G2-05 depth 0..9は`HISTORICAL-EXACT-REFERENCE`としてtechnical fixture、definition inspection、resource planning、implementation validationにだけ利用する。G3-01 formal eligibilityはhistorical referenceだけでは成立しない。

## 13. Protected G3-11 depth-10 exact holdout

standard initial RAW rootのcomplete depth-10 exact layerは`G3-11`の`FRESH-DEEPER-EXACT-HOLDOUT`としてsealedする。

G3-01では:

```text
standard-root complete depth-10 enumeration = PROHIBITED
standard-root depth-10 scientific counts / geometry outcome generation = PROHIBITED
standard-root depth-10 scientific counts / geometry outcome read = PROHIBITED
G2-12 estimator output as depth-10 truth/input = PROHIBITED
```

fresh trajectory source generationが標準初期stateから個別のlegal pathを進むことは、complete depth-10 layerのenumeration / aggregate geometry generationではない。root selectionはrelative local geometryを観測せずに行い、G3-01 artifactsにはstandard-root depth-10 layer set、depth-10 aggregate count、depth-10 layer hashを生成しない。

## 14. Stage 0 — Technical entry

Stage 0はscientific seedを消費しない。

必須fixture:

```text
T00-RAW-SERIALIZATION
T01-IDENTITY-TRIVIAL
T02-NO-TRANSPOSITION-SYNTHETIC
T03-KNOWN-TRANSPOSITION-SYNTHETIC
T04-KNOWN-RECONVERGENCE-SYNTHETIC
T05-BRANCH-EXPANSION-SYNTHETIC
T06-BRANCH-COMPRESSION-SYNTHETIC
T07-TERMINAL-SYNTHETIC
T08-TRAVERSAL-ORDER-PERTURBATION
T09-G2-05-DEPTH2-HISTORICAL-REFERENCE
```

Stage 0 PASSには、production / independentの全exact primitive、canonical tuple、hashがzero mismatchで一致し、known synthetic expectationと一致し、T08で少なくともascending / descending / deterministic shuffled traversalの3 orderが同一canonical resultになることを要求する。

T09はstandard initial rootのdepth 0..2だけをfreshにtechnical reproductionしてG2-05 exact referenceと照合する。depth 10を生成しない。

## 15. Stage 1 — Fresh development

Stage 1は`FRESH-DEVELOPMENT`であり、formal scientific inferenceには使わない。

fresh seed block:

```text
31010001..31010096
```

source policyはseedごとに`tools/benchmark.js`の`seededRandom`を使い、各plyでcanonical exact move key昇順のlegal move listから一様indexを選ぶ。trajectoryの最大plyは240。

root selectionはgeometry-blind / outcome-blindとし、seed昇順で次を選ぶ。

```text
Namua: exactly ply 24でnonterminal Namuaである最初のdistinct 6 RAW roots
Mtaji: ply 44以降で最初に出現したnonterminal Mtaji stateの最初のdistinct 6 RAW roots
```

初期RAW key、duplicate RAW keyは除外する。seed block外のreplacement / extensionは禁止する。selection前にlocal geometry、search evaluation、game outcome、reply widthを測定して選別しない。

local target depthは全rootで5に固定する。Stage 1 outcome後にdepthを増減しない。

## 16. Stage 2 — Fresh formal held-out validation

Stage 2 seed block:

```text
31020001..31020096
```

source / root ruleはStage 1と同じだが、必要root数は:

```text
Namua = 8
Mtaji = 8
```

とする。

Stage 1とのfirewallとして、Stage 2 candidateは次のいずれかがStage 1 selected root populationと一致すればskipする。

```text
exact RAW root key
full source trajectory hash through selected root
opening-prefix hash over first 16 exact move keys
```

skipはfrozen Stage 2 seed block内でのみ行い、seed block外へreplacementしない。Stage 1 outcomeを見てroot条件を変更しない。

local target depthは5で固定し、全16 selected rootsのcomplete reconstructionをformal population gateとする。

## 17. Resource ceilings

Stage 1 / Stage 2の各rootに同じceilingを適用する。

```text
maximum local target depth = 5
maximum cumulative distinct RAW states per root = 100000
maximum depth-labelled unique transitions per root = 750000
maximum unique parent-state expansions per root = 100000
maximum legal move evaluations per root = 750000
maximum cumulative tree node occurrences per root = 1000000000
maximum RSS = 4294967296 bytes
maximum wall clock per implementation per root = 180 seconds
maximum compact scientific artifact bytes per root = 67108864
```

stage administrative ceiling:

```text
Stage 1 maximum wall clock per implementation = 3600 seconds
Stage 2 maximum wall clock per implementation = 4800 seconds
maximum compact artifacts per implementation per stage = 536870912 bytes
```

ceiling到達、Actions timeout、artifact transfer failure、administrative cutoffはterminal、geometry compression、negative scientific resultではない。rootは`RESOURCE-CENSORED`または`ADMIN-CUTOFF`としてincompleteに分類し、complete subsetだけでformal eligibilityを判定し直さない。

## 18. Production / independent boundary

両implementationが共有してよいもの:

- `public/engine.js`のauthoritative rule engine
- frozen field names / schema constants
- cryptographic primitive SHA-256

independent verifierがproductionからimportしてはならないもの:

- RAW serializer / state-key implementation
- move normalizer / move-key implementation
- tree traversal
- graph deduplication
- occurrence propagation
- transposition aggregation
- root-branch label propagation
- reconvergence detection
- reply-width aggregation
- metric/rational assembly
- result/hash assembly
- final decision mapping

independent verifierはproduction artifactを再集計するだけでなく、selected root RAW stateからlocal bounded tree / graphを独立にfull reconstructionする。

## 19. Canonical artifact design

large row dumpだけをverification pathにしない。各rootで最低限、次をcompact canonical summaryとして保存する。

- root identity / source identity
- completeness / stop classification
- per-depth integer primitive table
- canonical histograms
- rational `{numerator,denominator}` pairs
- root-move subtree primitives
- canonical state-set hash per depth
- canonical transition-set hash per depth
- root-branch membership digest
- metric-family digest
- root-level `measurementCoreSha256`

stage manifestはroot digestをcanonical orderで並べた`stageCoreSha256`を持つ。full row artifactがtransfer不能でも、compact summary、manifest、source freeze、independent reconstructionからformal comparison可能な設計とする。

## 20. Formal Stage 2 eligibility rule

family単位のeligible判定には、まずglobal population gateとして次をすべて要求する。

1. frozen root selectionが両phaseで必要数を満たす。
2. Stage 1との3 identity firewall mismatchが0。
3. 全16 Stage 2 rootsがproduction / independent双方でdepth 0..5 complete。
4. `MOVE-NONTERMINATION`、resource/admin cutoff、nonterminal zero-moveが0。
5. RAW root identityとsuccessor binding mismatchが0。
6. Stage 2 source / metric / horizon / resource contractがpre-outcome freezeと一致する。

global gate PASS後、各metric familyについて全required primitive、canonical tuple、rational pair、hashがproduction / independentでexact zero mismatchなら、そのfamilyを`ELIGIBLE`とする。float agreementをprimary gateにしない。

## 21. Study-level decision taxonomy

```text
VALIDATED-ELIGIBLE
PARTIALLY-ELIGIBLE
INCONCLUSIVE
NON-ESTIMABLE
TECHNICAL-INVALID
NOT-AUTHORIZED-NOT-EXECUTED
```

mapping:

- `VALIDATED-ELIGIBLE`: global population gate PASS、F1..F5すべてformal zero-mismatch PASS。
- `PARTIALLY-ELIGIBLE`: global population gate PASSで、prospectively partition済みF1..F5の一部のみzero-mismatch PASS。eligible familyとfailed familyを全て保存する。root subgroupによるpartial eligibilityは認めない。
- `INCONCLUSIVE`: integrityは保たれるが、行政・artifact delivery等の非科学的要因によりformal decisionを完成できない。
- `NON-ESTIMABLE`: frozen source block / resource ceilingの下でrequired formal populationまたはcomplete bounded reconstructionを得られずinstrument eligibilityを評価できない。
- `TECHNICAL-INVALID`: serialization、binding、implementation、verification、source freeze等のtechnical integrity defectでvalid decision mappingが成立しない。
- `NOT-AUTHORIZED-NOT-EXECUTED`: prerequisite gate failureによりscientific stageを開始しない。seed consumptionなし。

`PARTIALLY-ELIGIBLE`はglobal root gate PASS時のみ可能であり、resource-censored rootsを除外して作らない。

## 22. No-rescue / versioning

禁止:

- global gate failure後のfavorable subgroup
- consumed seed blockのsame-evidence rerun
- threshold / tolerance relaxation
- outcome後のhorizon変更
- root replacement / seed extension
- failed metricだけのpost-hoc削除
- successful familyだけを残すためのfamily再定義
- independent mismatch後のsame evidence再判定
- G2-12 estimator救済利用
- unvalidated symmetry / canonicalization導入
- standard-root depth-10 exact outcomeの先読み
- partial exact enumerationをcompleteと表現すること

technical defectが`FRESH-DEVELOPMENT`または`FRESH-FORMAL-HELDOUT`の生成・read前に発見された場合に限り、旧technical versionを`TECHNICAL-INVALID`として永久保存したうえで、科学contractを変更しないcorrective technical versionを新しいStage version IDでfreezeできる。

Stage 1 scientific seedを一度でもconsumeした後は、同Stage evidenceを使ったrepair/rerunでscientific dispositionを変更しない。Stage 2 evidence materialization後も同様である。必要ならStudyをfail-closedで閉じ、別の新規prospective Studyへ委ねる。

## 23. Interpretation boundary / downstream dependency

G3-01がformalにeligibleとしたfamilyだけをG3-02以降のdefault measurement inputとしてよい。

本Studyから次を主張しない。

```text
whole-Bao state-space size
whole-Bao game-tree size
asymptotic growth law
strategic regime
best move / winning move / forced win
search reliability
human difficulty
game-theoretic value
symmetry-reduced count
```

`TECHNICAL-INVALID`または`NON-ESTIMABLE`でeligible familyが0の場合、G3-02以降を同じinstrumentで自動開始しない。Research Generation 3 dependency graphを再評価し、新しいprospective prerequisiteまたはprogram-level closureが必要かを明示する。
