# REEOE-STUDY1 — 判断台帳

更新日: 2026-08-28

以下の判断は、後のclosure recordとして明示されているものを除き、結果を見る前に固定したものです。Study開始時の判断は、関連するscientific outcomeを確認した後に変更しません。

## D-001 — Study identity

`G2-04`をResearch Generation 2の新しい独立Studyとして開始しました。

```text
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Study ID = REEOE-STUDY1
Agenda label = G2-04
```

`G2-04`はAgenda上の順序labelであり、正式なStudy IDではありません。

## D-002 — Study開始時baseline

```text
expected prior main = aba61596e6440e9d54be6f1e9520f65e983000b3
observed remote main = aba61596e6440e9d54be6f1e9520f65e983000b3
match = true
open PRs = 0
competing active Generation 2 research = false
```

残存G2 branchは`main`よりahead commitが0であり、未統合のactive Studyではありませんでした。

## D-003 — pure-science boundary

REEOE-STUDY1はpure Research Generation 2 scienceです。Public Bao AIのstrength、deployment、latency、product quality、AI-GEN promotionはscientific endpointではありません。

## D-004 — G2-01 closureは変更しない

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

exact-oracle evidenceを用いてこのclosureを変更・救済することはできません。

## D-005 — G2-02 closureは変更しない

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

10-trajectory shortfallをG2-04のgenerationやidentity ruleで修復することはできません。

## D-006 — G2-03 closureは変更しない

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
validated transform set = []
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
```

Production-only zero-mismatch diagnosticはvalidated transformではありません。

## D-007 — authoritative RAW state identity

Formal state identityはexactに次です。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外します。`pending`欠落時はfail closedとします。

## D-008 — symmetry / canonicalizationを使用しない

REEOE-STUDY1では次を禁止します。

```text
symmetry reduction
canonicalized identity
player-swap equivalence
left-right equivalence
quotient graph
orbit deduplication
symmetry-reduced state counting
```

すべてのexact node countとidentityはRAW-onlyです。

## D-009 — exact move identity

Exact move identityには次を含めます。

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

Namua variantをpermissive legality helperによってcollapseしてはいけません。

## D-010 — REWR formal decisionは変更しない

```text
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
frozen exact domain = 8 states / 7 edges
```

8-state resultはtechnical regression fixtureとして利用できますが、fresh G2-04 evidenceではなく、新しいdomainへ一般化しません。

## D-011 — 歴史的423,733-state candidateを再開しない

歴史的REWR one-shot candidateは次で停止しました。

```text
states = 423,733
edges = 426,938
stop = ADMIN-CUTOFF
```

REEOE-STUDY1では、単にcapを増やして同じcandidateの続きを実行しません。新しいformal domainには、新しいprospective domain-selection / resource contractが必要です。

## D-012 — ORISC closureは変更しない

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transformation set = []
```

REEOE-STUDY1はhistorical repository-facing oracle rowを書き換えません。

## D-013 — SSGTC closureは変更しない

```text
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

そのstandard-start bounded graphをendgame oracle populationへ暗黙に変換しません。

## D-014 — Stage identity

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
REEOE-S1-DEVELOPMENT-2026-08-28-v1
REEOE-S2-FORMAL-2026-08-28-v1
```

Stage 0はtechnical only、Stage 1はdevelopment only、Stage 2だけがformal exact-analysis decision stageです。

## D-015 — Stage 1 / Stage 2を自動承認しない

Study-start documentが承認するのはtechnical Stage 0 workだけです。Stage 1とStage 2は、それぞれscientific generation前に別のprospective specとexplicit authorizationを必要とします。

## D-016 — domain selectionはoutcome-blind

Formal domain selectionは、関連するexact outcomeを見る前に固定したstructural / reachability / resource ruleによって決定します。

WIN / LOSS / RECURRENT比率、cycle、DTF、optimal move、tactical interest、favorable winnerをselectionへ使用してはいけません。

## D-017 — historical domainとsynthetic domainは別evidence class

Synthetic fixtureはtechnical instrumentとして有効です。

synthetic-valid scientific domainを使用する場合は結果を見る前にsyntheticと明示し、historically reachable evidenceとして報告してはいけません。

## D-018 — complete forward closureは必須

exact-eligibleなすべてのnonterminal stateについて、complete exact legal-move setと全successor RAW stateを表現しなければなりません。

root filterによってlegal successorを落としてはいけません。

## D-019 — incomplete closureはexactではない

本Studyでは少なくとも次を区別します。

```text
CLOSED
OPEN / ESCAPING
INCOMPLETE-DOMAIN
RESOURCE-CUTOFF
TECHNICAL-INVALID
NON-ESTIMABLE
```

Near-completeは決してexactではありません。

## D-020 — resource / administrative cutoffはgame resultではない

resource exhaustion、workflow timeout、administrative cutoff、artifact truncation、implementation safety cutoffをWIN、LOSS、DRAW、RECURRENTへ読み替えてはいけません。

## D-021 — terminal semanticsではabsolute winnerを使用する

Terminal base caseではexact terminal semanticsとabsolute winnerを使用します。post-terminal `state.player`だけではterminal WIN / LOSSを定義しません。

## D-022 — DRAW labelを自動付与しない

Study開始時のexact fixed-point vocabularyは`TERMINAL`、`WIN`、`LOSS`、`RECURRENT`です。

現在のfrozen rule semanticsでは、別途prospectiveに確立したdraw ruleなしにcycleやunresolved recurrent regionをformal `DRAW`へ変換することを承認しません。

## D-023 — DTF metric

Default exact distanceはlegal-move / ply distance-to-forced-terminalです。

```text
TERMINAL = 0
WIN = 1 + min DTF(winning successors)
LOSS = 1 + max DTF(all opponent-winning successors)
RECURRENT = null
```

outcome確認後のdistance redefinitionは承認しません。

## D-024 — すべてのoptimal moveを保持する

resolved stateでは、代表best moveを1つだけ残すのではなく、full optimal / max-resistance move setとmultiplicityを保持しなければなりません。

## D-025 — SCC structureは独立graph endpoint

Strongly connected componentはretrograde labelとは独立してexact graphから計算します。

cyclic SCCの存在とunresolved recurrent classificationは別の事実です。

## D-026 — positive technical control

`REEOE-C00-REWR-8STATE-REGRESSION`は既存exact fixtureを再構築し、node / edge identity、predecessor relation、value、DTF、すべてのoptimal / max-resistance move setを再現しなければなりません。

これはinstrument evidenceのみです。

## D-027 — negative technical control

Independent verifierは次を検出しなければなりません。

```text
REEOE-C01-MISSING-SUCCESSOR
REEOE-C02-INCORRECT-TERMINAL
REEOE-C03-INCOMPLETE-EDGE-SET
REEOE-C04-CORRUPTED-PREDECESSOR
```

false passはinstrument failureです。

## D-028 — independent verifierは必須

Productionとindependent verificationは、可能な範囲でRAW serialization、state validity、legal move、successor、terminal / winner semantics、node / edge set、predecessor、closure、SCC、retrograde value、DTF、optimal move、decision inputを別々に再構築しなければなりません。

## D-029 — algorithmic diversityを優先する

Productionとindependent retrograde / graph verificationは異なるalgorithmic pathを使うことを優先します。

避けられないshared rule dependencyはStage 1 / 2 scientific authorization前に開示します。

## D-030 — Stage 2前にresource contractを固定する

Stage 2ではoutcome生成前に、state、edge、可能な場合のdeterministic work unit、RSS、artifact、sharding、checkpoint、restart semantics、administrative cutoff、resource-cutoff classificationの上限・規則を固定する必要があります。

## D-031 — hash / provenance最低要件

Scientific Stageでは少なくともspec、source、authorization、domain-definition、root / population、RAW-identity、node-set、edge-set、closure、retrograde-result、verification、canonical-result、artifact-ZIP hashを追跡します。

## D-032 — large raw graphを自動commitしない

repository storageが必要でない限りlarge graphはimmutable workflow artifactへ保存します。Repository-facing recordはcompactかつhash-boundに保ちます。

## D-033 — candidate formal decision taxonomyはStage 2 freezeまでprovisional

Candidate domain-level labelは次です。

```text
EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
NOT-EXACTLY-SOLVED
NON-ESTIMABLE
```

Stage 2ではscientific labelとtechnical / reproducibility failureの対応をoutcome生成前にfinalizeする必要があります。

## D-034 — technical failureとscientific domain propertyを分離する

solver / verifier disagreement、source / hash drift、incomplete closure、resource cutoffは自動的にscientific `NOT-EXACTLY-SOLVED`を意味しません。

frozen Stage 2 failure ruleが判断を支配し、条件未成立時にはfail closedとします。

## D-035 — no rescue

関連outcome確認後に、domain shrinkage、root / state replacement、cycle exclusion、seed extension、cap increase、edge omission、closure-definition change、DRAW / RECURRENT redefinition、DTF change、favorable subset、alternate solver substitution、threshold relaxation、near-complete relabeling、subgroup rescue、symmetry / canonicalization introductionを行うことは承認しません。

## D-036 — technical correction boundary

scientific outcome生成前に見つかったgenuine implementation defectは、明示的なrevoke / refreeze / reauthorize provenanceを伴ってprospectiveに修正できます。

scientific outcome生成後に見つかったdefectはfrozen failure ruleの下で分類し、同じevidenceのfavorable rerunが当然に許可されるとはみなしません。

## D-037 — Stage 0の最初のtask

最初のtechnical taskは、現在のRAW serialization、move identity、guard-free endgame transition、complete closure traversal、retrograde implementation、independent verifierをauditし、positive fixtureを再現して4種類のcorruption controlをすべて検出できることを示すことです。

## D-038 — Stage 0はtechnical PASSとしてのみ受理

Stage 0 workflow run `33150063023`はすべてのfrozen technical gateをPASSし、immutable REWR 8-state / 7-edge graph、predecessor relation、exact solution、DTF、すべてのoptimal / max-resistance moveを独立再現しました。

4種類のfrozen corruption controlもすべて検出しました。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
scientificEvidence = false
artifactId = 9677327024
artifactZipSha256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
```

この結果はtechnical instrumentだけをvalidateし、fresh exact-oracle evidenceを追加しません。

## D-039 — missing `pending` compatibility fallbackはG2-04 authorityではない

Legacy REWR helperはfield欠落時に`pending=[0,0]`を合成できます。

そのためG2-04ではscientific identity使用前にmissing `pending`をrejectするstrict production / independent validationを追加しました。

Historical REWR helperは書き換えず、再構築terminal rowではcurrent raw `pending` semanticsを維持しました。

## D-040 — Stage 1 v1はdevelopment-onlyとしてprospectiveに承認

Stage 1 v1ではfresh seed `24040001..24040512`、structural envelope `nonEmptyPitCount<=18`、`exactLegalMoveCount<=2`、maximum 8 roots、rootごとのceiling 100,000 states / 500,000 edges / 1,000,000 move microstatesを固定しました。

selectionのためのretrograde outcome inspectionは禁止しました。

## D-041 — Stage 1 v1はtechnical-invalidでevidenceは消費済み

workflow run `33150429724`ではproduction developmentが完了した後、incorrect module pathによりindependent verifierが起動できませんでした。

production outputがすでに生成されていたため、同じevidenceを修復して再実行していません。

```text
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
sameEvidenceRerunAuthorized = false
v1ProductionOutputsEligibleForV2OrStage2Design = false
v1SeedAndRawIdentitiesConsumed = true
```

## D-042 — Stage 1 v2で変更したのはfresh identityとverifier hardeningのみ

新version `REEOE-S1-DEVELOPMENT-2026-08-28-v2`を実行前に固定しました。

structural envelope、resource ceiling、selection order、maximum selected roots、acceptance ruleはv1から変更していません。fresh blockは`24041001..24041512`です。

Independent verifierはcomplete 512-trajectory scan、eligible set、first-eight selection、rootごとのclosureを再生成するよう強化しました。

これはv1のoutcome-driven rescueではありません。v1 production-only outputはdesign inputとして使用禁止です。

## D-043 — Stage 1 v2 source freezeとauthorization

Production runner、independent verifier、spec、Stage 0 result、rule engine、benchmark、exact-transition dependencyをGit blob identityで固定した後にのみStage 1 v2 executionを承認しました。

Stage 2は明示的にunauthorizedのままです。

## D-044 — Stage 1 v2はfrozen acceptance gateを正規にFAIL

workflow run `33151053940`では、7,055 unique witnessed roots / 141 eligible rootsから8 rootsを選択しました。

Productionとindependent verificationはfull scan、eligible-set reconstruction、selected-root identity / order、closure classificationまで一致しました。

frozen acceptance ruleは少なくとも3 independently verified complete closuresを要求しましたが、observed complete countは0でした。

```text
Stage 1 v2 = STAGE1-DEVELOPMENT-BLOCKED
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

workflowのnonzero conclusionはpreregistered acceptance failureを反映したものであり、independent-verifier disagreementではありません。

## D-045 — development stop labelはgame classificationではない

`STATE-LIMIT`と`ADMIN-CUTOFF`はresource / administrative conditionです。

`MOVE-NONTERMINATION`はguard-free transition instrumentの下でdeterministic intra-move microstate recurrenceを検出した記録です。

いずれも自動的にgame-level `WIN`、`LOSS`、`RECURRENT`、`DRAW`を意味しません。

## D-046 — Stage 2は未承認

valid Stage 1 v2 resultはfrozen development feasibility ruleをPASSしませんでした。

したがってREEOE-STUDY1内ではStage 2 formal-domain definition、source freeze、authorization、production run、independent verification、domain-level exact decisionを作成しません。

```text
REEOE-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
formal domains evaluated = 0
fresh G2-04 exact oracle produced = false
```

## D-047 — 同一Study内でfeasibilityを救済しない

Stage 1 v2 outcome確認後、REEOE-STUDY1ではstate / edge / microstate cap増加、domain shrinkage、root replacement、seed extension、nontermination無視、partial closure昇格、solver置換、symmetry / canonicalization導入を行いません。

実質的に異なるexact-oracle expansion designには、新しいprospective independent Study / versioned protocolとfresh evidenceが必要です。

## D-048 — Formal Study decisionは`INCONCLUSIVE`

Study closure:

> **`INCONCLUSIVE`**

technical instrumentはPASSしましたが、frozen fresh development designではStage 2承認に必要なcomplete-closure feasibilityを確立できませんでした。

Stage 2は承認も実行もされていないため、formal domain-level exact-oracle decisionは存在しません。

これは正規のfail-closed Research Generation 2 closureであり、Bao endgameや将来のrestricted domainが本質的にunsolvableだという意味ではありません。

## D-049 — upstream decisionは変更しない

G2-01、G2-02、G2-03、REWR、ORISC、SSGTC、AI Engineeringの判断を一切変更しません。

REWRはimmutable 8-state / 7-edge domainの内部だけでexactであり、G2-03 validated transformation setは空のままです。

## D-050 — post-closure scientific workflow lock

invalidated Stage 1 v1 workflowはarchival stubです。

canonical closure record完了後、Stage 1 v2とStage 0 execution workflowもarchival stubへ変更し、PR synchronizationや後日のdocumentation changeによってduplicate scientific / technical evidenceが生成されないようにします。

Historical executable sourceはGit historyに保持し、recorded run / head / source identityへbindingした状態を維持します。
