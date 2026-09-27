# 2026-09-27 — post-G4-08 current-state G4-09 認可レビュー

Review ID: `G4-09-AUTHORIZATION-REVIEW-2026-09-27-V1`  
Agenda: `Research Generation 4 / G4-09`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `fc0f345034639c03dc10b0537c331ae44ee47b3b`  
判定: **`G4-09-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
fresh scientific seed access: **0 / NOT AUTHORIZED YET**  
formal scientific outcome: **NOT GENERATED**  
G4-10 depth 11 access: **NOT AUTHORIZED / NOT ACCESSED**  
public AI change: **NOT AUTHORIZED**

## 1. 審査対象

G4-09はResearch Generation 4 Wave Cのsearch reliability agendaである。

Program Planで固定された日本語作業名は次である。

**Bao局所ゲーム木幾何によるsearch reliability境界のprospective検証 — 一般domainの出力安定性とexact microdomainのvalue agreementを分離した解析**

中心課題は次の2 moduleを混同せずに検証することである。

1. 一般domainで、局所geometryがfresh search configuration間のranking / PV / TopSet安定性とどのように関係するか。
2. G4-05でexact oracleが確立した固定microdomainで、search outputがexact value-preserving move setとどの条件で一致するか。

一般domainではhigher-resource searchをtruthとみなさない。exact correctnessを扱うのはG4-05 exact domainに限定する。本レビューは科学結果を生成せず、依存関係、historical Studyとの非再実行境界、module分離、freshness、exact oracle再利用境界、Stage分離、実行経路をfresh scientific evidence access前に審査する。

## 2. current-state prerequisite

```text
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-08 = CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / MAIN INTEGRATED
G4-09 = NEXT AUTHORIZATION-REVIEW CANDIDATE / NOT-AUTHORIZED before this review
G4-10 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
public AI change authorized by RG4 = false
```

Program PlanはG4-09を、G4-05 exact oracle foundationと、G4-02..G4-04のeligible closure群の後続に置いている。ただし、これはG4-02〜G4-04の全結果をpositive scientific evidenceとして使用することを意味しない。

## 3. G4-02 dependencyの明示的判定

G4-02は`CLOSED / NO SCIENTIFIC DECISION`である。fresh-domain corridor / tree-graph transferについてpositive、negative、counterexample、non-estimableのいずれの科学判定も割り当てられていない。

G4-09では次を固定する。

```text
G4-02 administrative/program closure = SATISFIED
G4-02 positive scientific evidence contribution = NONE
G4-02 negative scientific evidence contribution = NONE
G4-02 C1/C6 transfer assumption = PROHIBITED
G4-02 scientific seed/evidence replay = PROHIBITED
```

G4-09はG4-02をrepair、reopen、補完するStudyではない。corridor / tree-graph transferを成立済みと仮定してsearch reliability endpointを選ばない。

## 4. G4-03をgeneral-domain moduleの直接的上流とする

G4-03 `LWSRT-STUDY1`はroot legal widthとsearch-ranking changeのfresh transferを検証し、固定12 testについて次で閉じた。

```text
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

G4-09の一般domain moduleは、この結果を「widthがsearch errorを起こす」という因果主張や、best-move correctnessの証拠へ読み替えない。

利用可能なのは次に限定する。

- search-condition perturbationをprospectively定義する方法論
- ranking change / width associationをsearch-output constructとして扱う境界
- source policy、RAW identity、freshness firewall、one-shot executionの運用先例
- G4-03で確認されたassociationをG4-09 hypothesis設計の上流根拠として参照すること

禁止するもの:

- G4-03 seed / trajectory / opening prefix / selected RAW rootのscientific reuse
- G4-03 endpoint値、p-value、favorable subgroupをG4-09のselection inputに使用すること
- 9/12 confirmationを全domainの普遍則へ拡張すること

## 5. G4-04の位置づけ

G4-04はfresh P1/P2 trajectory domainでchronology-dependent geometry constructのtransferを8/8で確認した。

G4-09ではG4-04をsearch correctnessのtruth sourceにしない。一方で、fresh source-policy運用、RAW-only local geometry measurement、trajectory / checkpoint identityの扱い、production / independent exactnessの方法論的先例として参照できる。

G4-04 scientific identitiesは、G4-09 general-domain source generationで重複可能性がある場合、freshness firewallに含める。

## 6. G4-05 exact oracle prerequisiteの判定

G4-05 `RLEMOF-STUDY1`は次の正式状態で閉じている。

```text
formal exact decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
formal complete domains = 8
production / independent exact agreement = true
```

したがって、Program PlanがG4-09 exact moduleへ要求したexact oracle prerequisiteは**満たされている**。

ただしG4-09はG4-05を再実行・再選択しない。

```text
G4-05 candidate rescan = PROHIBITED
G4-05 STATE-LIMIT candidate rescue = PROHIBITED
G4-05 seed extension = PROHIBITED
G4-05 domain replacement = PROHIBITED
G4-05 formal decision reevaluation = false
```

G4-09 exact moduleでは、固定8 microdomainをimmutable upstream oracleとしてのみ参照する。各rootを固定 `(seed, ply, rootStateKey)` tupleから再物質化し、保存されたstate-set、transition-set、solution digest、root exact value、DTF、optimal move keysと完全一致した場合だけ、新規G4-09 search-output measurementへ進む設計を第一候補とする。

## 7. G4-06の位置づけ

G4-06 `LGTGECB-STUDY1`は、G4-05固定8 microdomainを再物質化し、保存されたexact resultと完全一致することを確認した上でgeometryとexact consequenceを接続した。

このためG4-09 exact moduleでは、G4-06の次の方法論を参照できる。

- frozen exact-domain rematerialization
- state-set / transition-set / solution-digest integrity binding
- exact `optimalMoveKeys` / value-preserving move countの整合確認
- production / independent separation

G4-06の12 relation resultそのものを、search agreementの方向やthreshold選択に使用しない。

## 8. G4-07 / G4-08との分離

G4-07のmemory / reversal結果、G4-08の24/24 `NON-ESTIMABLE`結果はG4-09のsearch truth sourceではない。

特にG4-08の`NON-ESTIMABLE`を、geometryがsearch reliabilityに影響しないことの証拠へ読み替えない。

G4-07 / G4-08はfresh source-policy、identity firewall、exact serialization、GitHub Actions one-shot execution等の方法論的先例として参照できる。source overlapが可能なscientific identitiesはG4-09 freshness firewallへ含める。

## 9. G2-02 historical search-reliability Studyとの非再実行境界

G2-02 `SRDR-STUDY1`はsearch reliability / decision robustnessを扱ったhistorical Studyであるが、formal decisionは`INCONCLUSIVE`である。

したがってG4-09では次を固定する。

```text
G2-02 formal result reuse = NONE
G2-02 primary criterion rescue = PROHIBITED
G2-02 Stage 1/2 seed reuse = PROHIBITED
G2-02 selected-state scientific reuse = PROHIBITED
G2-02 search grid = HISTORICAL DESIGN REFERENCE ONLY
G2-02 methodology / technical lessons = ALLOWED
```

G2-02で使用したdepth / node-budget / quiescence gridと同型のconfigurationをG4-09で採用する場合も、新しい科学的理由、new Study identity、fresh population、fresh seed namespace、new preregistrationを結果を見る前に固定する。

higher-resource configurationをtruthとみなさないというG2-02の境界は維持する。

## 10. provisional Study identity

preregistrationで次を正式freezeする候補とする。

```text
Study ID = GCSREA-STUDY1
English title = Geometry-Conditioned Search Reliability and Exact Agreement Study 1
Japanese title = Bao局所ゲーム木幾何によるsearch reliability境界のprospective検証 — 一般domainの出力安定性とexact microdomainのvalue agreementを分離した解析
research branch = research/g4-09-search-reliability-exact-agreement
authoritative state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
```

`GCSREA-STUDY1`はG2-02のversion incrementではなく、新規独立Studyである。

## 11. two-module separation

G4-09は少なくとも次の2 moduleを明確に分離する。

### Module A — GENERAL-SEARCH-STABILITY

対象はfresh general-domain RAW states。

扱うconstructはsearch-output stabilityであり、truth / correctnessではない。

候補endpoint family:

- ranking / preorder stability
- canonical-best agreement
- exact TopSet equality / intersection / overlap
- PV identityまたは事前固定したPV-prefix agreement
- search-condition changeに対するoutput transition class

higher-resource searchをreferenceとして置く場合も、truth labelとして使用しない。

### Module B — EXACT-MICRODOMAIN-AGREEMENT

対象はG4-05でformal completeとなった固定8 exact microdomain root。

search outputを、G4-05のimmutable exact oracleが保持するvalue-preserving / optimal move informationと比較する。

候補exact agreement construct:

- search TopSetとexact value-preserving move setの完全一致
- search TopSetがexact setの部分集合 / 上位集合となる関係
- canonical-bestがexact value-preserving setへ含まれるか
- ranking上位kのexact-set coverage
- PV first moveのexact agreement

正式なexact agreement contractはStage 0前にfreezeする。N=8 fixed-domain censusをwhole-Bao correctness rateや確率推定へ拡張しない。

## 12. geometry familyの入口

G4-09で使用するgeometry predictor familyはfresh scientific outcomeを見る前に固定する。

第一候補は既存formal-eligible RAW local-game-tree instrumentの範囲から選び、relative depth、representation、undefined ruleを変更しない。

候補には次を含め得る。

- root legal width
- unit-width / corridor occupancy
- tree occurrence / RAW graph inflation
- transposition / reconvergence component
- immediate reply width
- G4-01 compatibility確認済みmeasurement family

G4-03のconfirmed subgroupだけを選ぶ、またはG4-06でvariationがあったscalarだけをpost-hocに残すことは禁止する。formal primary familyとsecondary descriptive familyをpreregistrationで分離する。

## 13. search configuration familyの入口

Stage 0前に、search configuration gridをoutcome-blindに固定する。

historical referenceとしてG2-02にはdepth、node budget、quiescence perturbationがあり、G4-03には`SC1=DEPTH`、`SC2=NODE-BUDGET`、`SC3=QUIESCENCE`のfresh transfer resultがある。

G4-09では少なくとも次を事前固定する。

- configuration IDs
- depth / node-budget / quiescence semantics
- candidate ordering control
- incomplete node-budget iteration handling
- score tie / TopSet semantics
- canonical-best definition
- ranking tie handling
- PV reconstruction semantics
- deterministic serialization
- resource ceiling

configuration数やbudgetをresult確認後に増やさない。

## 14. fresh namespace readiness

repository default branchの事前検索では次のcandidate startに予約衝突を認めなかった。

```text
Stage 1 candidate block start = 40913001
Stage 2 candidate block start = 40923001
```

これはgeneral-domain fresh source用の予約候補であり、本レビューはseed生成・readを認可しない。正式なend、count、policy assignment、reserve ruleはpreregistration / Stage authorizationでfreezeする。

G4-05固定8 exact microdomainはupstream exact oracleであり、新しいseed namespaceとして扱わない。

## 15. freshness firewall

G4-09 general-domain Stage 1 fresh access前に、少なくとも次のidentity-only exclusionを検討し、実際に重複可能なsource familyをpreregistrationで固定する。

- G2-02 Stage 1/2 scientific seeds、trajectories、opening prefixes、selected RAW states
- G4-01 compatibility scientific/reserve identities relevant to source generation
- G4-03 Stage 1/2 seeds、trajectories、opening prefixes、selected RAW roots
- G4-04 Stage 1/2 seeds、trajectories、opening prefixes、checkpoint RAW roots
- G4-07 Stage 1/2 seeds、trajectories、opening prefixes、checkpoint roots
- G4-08 Stage 1/2 scientific identities where source-policy overlap is possible
- G4-09 Stage 2ではさらにG4-09 Stage 1の全general-domain scientific identity

prior endpoint、effect direction、p-value、game outcome、search agreementをfresh source selectionに使用しない。

G4-05 exact-domain oracleはfreshness firewallで除外する対象ではなく、downstream exact comparison用にprospectively指定されたimmutable upstream referenceとして扱う。ただしcandidate rescan / replacementは行わない。

## 16. Stage構成

### Stage 0 — technical-only

本レビューで準備・実行を認可する。

fresh G4-09 scientific seedを生成・readせず、technical/synthetic fixturesと既存immutable upstream referenceだけを使用する。

最低限検証する項目:

1. Study/source binding
2. RAW state identity serialization
3. geometry extractor binding
4. search configuration semantics
5. ranking tie / TopSet / canonical-best semantics
6. PV reconstruction semantics
7. node-budget incomplete-iteration handling
8. Module A output-stability metric semantics
9. G4-05 exact-domain rematerialization integrity
10. exact value-preserving / optimal move-set binding
11. Module B exact-agreement classification semantics
12. production / structurally independent measurement exact agreement
13. identity firewall serialization / matching
14. canonical JSON / digest agreement
15. resource measurement
16. `scientificExecution = false`
17. fresh scientific seed reads = 0
18. G4-10 depth-11 access = 0

Stage 0 PASSはfresh Stage 1を自動認可しない。

### Stage 1 — development / compatibility

**NOT AUTHORIZED by this review**。

別authorization前に少なくとも次をfreezeする。

- Study ID / Stage ID
- Module A source policies / fresh seed block
- state eligibility / target population
- geometry primary / secondary family
- search configuration grid
- output-stability endpoint family
- Module B fixed exact-domain manifest
- exact-agreement endpoint family
- support / estimability gates
- identity firewall manifest
- production / independent implementations
- resource ceiling
- no-rescue rule

Stage 1はsupport、definedness、exactness、resource readiness、identity-only outputを中心とし、formal heldout scientific decisionを生成しない設計を第一候補とする。

### Stage 2 — formal heldout

**NOT AUTHORIZED by this review**。

Stage 1完了後に別authorization reviewを必要とする。

Module Aについてはfresh heldout general-domain population、formal geometry × search-stability family、direction / nondirectional test、multiplicity、decision labelsをStage 2 seed access前に固定する。

Module Bについては固定8 exact microdomainをfinite-domain exact comparisonとして扱うか、別のprospectively authorized exact populationが必要かをStage 1終了前後のreviewで明示する。G4-05 candidate rescanやdomain replacementによるsample拡張は行わない。

## 17. execution context

Stage 0、および将来認可されるStage 1/2で長時間実行が生じる場合は、現行RG4運用に合わせGitHub Actionsを第一候補とする。

fresh scientific Stageでは最低限次を保存する。

```text
source commit SHA
workflow run ID / attempt
execution lease / exactly-once state
artifact ID
artifact SHA-256
canonical result SHA-256
fresh seed reads
protected-evidence access count
G4-05 candidate rescan count
G4-10 depth-11 access count
```

Actions制約に合わせてscientific endpoint、sample target、configuration gridを変更しない。resource ceiling到達時はpreregistered fail-closed ruleを適用する。

## 18. no-rescue / interpretation boundary

最初のfresh Stage 1 seed read後、同Study/version内で次を行わない。

- seed extension / replacement
- source-policy replacement
- geometry family追加・削除
- search configuration追加・削除・budget relaxation
- TopSet / tie / PV semantics変更
- support / estimability gate relaxation
- favorable subgroup rescue
- multiplicity / threshold変更
- resource ceiling relaxation
- G4-05 candidate rescan / exact-domain replacement
- same-evidence repair rerun

technical defectが判明した場合は、frozen ruleに従いfail-closedし、必要なら新しいStudy/versionとしてauthorizationから開始する。

解釈上、次を禁止する。

- higher-resource search = truth
- stable ranking = correct move
- unstable ranking = error
- exact 8-domain agreement = whole-Bao correctness rate
- geometry association = causal mechanism
- machine search reliability = human difficulty
- scientific result = public AI adoption decision

## 19. protected boundary

本レビューによって次は認可されない。

- fresh Stage 1 / Stage 2 scientific seed access
- G2-02 / G4-02 closed Studyのrepair、reopen、rerun
- G4-03〜G4-08 closed formal evidenceのscientific replay
- G4-05 candidate rescan / domain rescue
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AI変更

## 20. review decision

依存関係を現行`main`で確認した結果、G4-09は独立prospective Studyとして設計可能である。

特に、

- G4-03によりgeneral-domain search-ranking associationのfresh transfer evidenceがある
- G4-05によりexact module prerequisiteが成立している
- G4-06により固定exact microdomainの再物質化・integrity bindingの実績がある
- G4-02のno-decisionをpositive evidenceへ読み替えずに分離できる
- G2-02をhistorical methodology referenceへ限定できる
- G4-10 protected boundaryを維持できる

ため、次を正式判定とする。

```text
G4-09 = AUTHORIZED FOR PREREGISTRATION AND STAGE 0 ONLY
fresh Stage 1 scientific access = NOT AUTHORIZED
fresh Stage 2 scientific access = NOT AUTHORIZED
G4-10 depth 11 access = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

次に許可される工程は、`research/g4-09-search-reliability-exact-agreement`上でのStudy scaffold、preregistration、Stage 0 technical spec / fixtures / independent verifier / workflowの作成、およびfresh scientific seedを読まないStage 0実行である。
