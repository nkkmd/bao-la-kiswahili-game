# LGTGMIV-STUDY1 — Study 1 Protocol

## 1. Formal identity

- Study ID: `LGTGMIV-STUDY1`
- English title: **Local Game-Tree Geometry Measurement Instrument Verification Study 1**
- 日本語題目: **Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**
- Program position: Research Generation 3 の post-G3-01 / pre-G3-02 measurement-instrument prerequisite Study
- Research branch: `research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`
- Source-of-truth baseline at Study start: `a53aabd26f78ac408445aff2d18ace3b21b827d7`

本StudyはG3-01 (`LGTGMF-STUDY1`) のStudy 2、corrected rerun、repair、rescue、same-evidence replicationではない。G3-01は永久に `CLOSED / TECHNICAL-INVALID`、formal eligible measurement families `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED` とする。

## 2. Immutable representation boundary

Authoritative scientific state identityはRAW-onlyであり、次の7 fieldのみを順序付きcontractとして用いる。

`pits,reserve,houseOwned,player,phase,winner,pending`

Validated transform setは `[]`。symmetry、reflection、player swap、canonical orbit、deduplication等をstate identityへ導入しない。

Move identity field contractは次の8 fieldである。

`type,phase,row,index,direction,side,houseChoice,houseTwo`

未定義optional fieldはcanonical move objectから省略し、`houseTwo`は常にbooleanとしてmaterializeする。

## 3. Stage structure

1. `LGTGMIV-S0-TECHNICAL-2026-08-31-v1` — technical instrument validation。scientific evidenceではない。
2. `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1` — fresh development / family eligibility establishment。
3. `LGTGMIV-S2-FORMAL-2026-08-31-v1` — fresh formal holdout verification。Stage 1 gate通過後のみ別authorizationで実行可能。

Stage 0終了前にStage 1 seedを生成・readしてはならない。Stage 2はStage 1でpromoteされたfamilyだけを対象とし、結果後にfamilyを追加しない。

## 4. Stage 0 — technical controls

Stage 0はsynthetic transition fixturesとnon-scientific technical controlsのみを使い、次を全て検証する。

- canonical RAW-state serialization determinism
- canonical move serialization determinism
- traversal-order invariance (`ascending`, `descending`, deterministic permutation)
- legal-move iteration-order invariance
- root-order invariance
- repeat-run determinism
- production / independent exact agreement of legal move sets, successor identities, tree occurrences, RAW graph nodes, RAW edges, transposition/reconvergence primitives, reply geometry, each family digest, root reconstruction core and stage scientific core
- telemetry mutation invariance: elapsed time、RSS、CPU、runner、PID、path、job ID等を変えてもscientific core digestが変わらないこと
- static independence audit: productionとindependent implementationが互いをimportせず、新規shared LGTGMIV serialization / metric / canonical-hash helperを共有しないこと
- protected standard-root depth-10 evidenceへアクセスしないこと
- fresh Stage 1 / Stage 2 seedを消費しないこと

Stage 0 PASSには全mandatory assertionのexact passが必要である。toleranceは存在しない。

## 5. Fresh population contract

### 5.1 Deterministic source trajectory generator

Source trajectoryはauthoritative `public/engine.js` から初期RAW stateを開始し、seeded Mulberry32で生成する。各plyでlegal moveをcanonical move identity keyで昇順sortし、PRNG値 `u` に対して `floor(u * legalMoveCount)` 番目を選ぶ。relay-limit、nonterminal zero-legal-move等のrule-semantic anomalyはtechnical-invalid triggerとする。

Root selectionはgeometry metricを一切参照しない。

- Namua candidate: exactly ply 24、nonterminal、phase=`namua`
- Mtaji candidate: 各trajectoryで最初の ply >= 44 の nonterminal phase=`mtaji` state
- candidateはRAW root identityで重複排除
- phase内ではsource seed昇順でfirst-Nを採用
- final canonical root order: phase order `namua` then `mtaji`、sourceSeed ascending、selectedPly ascending、rootRawSha256 ascending
- max source ply: 240

### 5.2 Stage 1 development

- seed block: `31110001..31110128`
- target roots: Namua 8 + Mtaji 8 = 16
- relative local horizon: depth 5
- evidence class: `FRESH-DEVELOPMENT`

### 5.3 Stage 2 formal holdout

- seed block: `31120001..31120192`
- target roots: Namua 12 + Mtaji 12 = 24
- relative local horizon: depth 5
- evidence class: `FRESH-FORMAL-HOLDOUT`

### 5.4 Firewall

G3-01 consumed block `31010001..31010096`は使用禁止。G3-01 Stage 1 selected roots/outputはformal populationとして使用しない。G3-01のroot RAW identity、full source trajectory identity、first-16-move prefix identityはoverlap exclusion identityとしてだけ参照可能であり、metric/outcomeはroot selectionに参照しない。

Stage 2はさらにStage 1のroot RAW identity、full source trajectory identity、first-16-move prefix identityとのcollisionを全てrejectする。

## 6. Protected evidence firewall

Protected standard-root depth-10 exact holdoutはStudy全期間を通して:

`SEALED / NOT GENERATED / NOT READ`

とする。本StudyのStage 0/1/2はいずれもdepth-10 standard-root complete exact layerを生成・readしない。repositoryで他にreserved/protectedと明示されたfuture evidenceも同様に対象外とする。

## 7. Canonical scientific serialization contract

Hash algorithmはSHA-256、lowercase hexadecimal。入力はUTF-8 canonical JSON bytesで、hash input自体にはtrailing newlineを含めない。

Canonical JSON rules:

- object keys: Unicode code-point compatible lexical ascending order
- arrays:各schemaで定義されたsemantic orderを使用
- integer: JSON safe integerまたはdecimal integer string。BigInt countはdecimal string
- ratio: `{numerator:<decimal string>,denominator:<decimal string>,defined:<boolean>}`
- NaN / Infinity / implementation-specific floating pointは禁止
- absent optional move fieldは省略、`null`と混同しない

Ordering:

- roots: §5.1のcanonical root order
- depths: 0..5 ascending
- state sets: RAW SHA-256 ascending before set digest assembly
- edges: `depth,fromRawSha256,canonicalMoveKey,toRawSha256` ascending
- metric families:下記family ID order
- histogram keys: numeric valueをdecimal canonical formにしてnumeric ascendingでserialization

Scientific digests:

- `rootReconstructionCoreSha256`: root identity、legal/successor structure、depth-labelled tree/RAW graph primitive、reply primitiveのdeterministic core
- `rootFamilyCoreSha256[familyId]`: prospectively fixed family viewだけ
- `stageReconstructionCoreSha256`: Study/stage/contract identity + ordered root identities + ordered `rootReconstructionCoreSha256`
- `stageFamilyCoreSha256[familyId]`: ordered root family digests
- `stageScientificCoreSha256`: deterministic stage identity、`stageReconstructionCoreSha256`、ordered family stage digestsだけ

`implementationId`はscientific core外である。productionとindependentは同じscientific objectに対して同じdigestを作らなければならない。

## 8. Runtime/resource telemetry separation

次はscientific/root/stage canonical digest inputから明示的に除外する。

- elapsed / wall-clock time
- RSS / peak RSS
- CPU timing
- runner identity / implementation identity
- PID / job ID / workflow run ID
- temporary or absolute filesystem path
- artifact upload/download timing
- host name、OS scheduling、process metadata
- その他execution-dependent telemetry

これらは別の`telemetry` artifactに記録し、resource gateのみに用いる。telemetry mutationはscientific digestを変えてはならない。

## 9. Measurement family contract

G3-01 family eligibilityは継承しない。以下は本Studyで新規にfreezeしたcandidate familyである。

### `LGTGMIV-F1-TREE-OCCURRENCE`

- rootLegalMoveCount
- depth layers: depth, treeNodeOccurrences, terminalOccurrenceCount
- branchSurvival: rootMoveKey, branchSurvivalLength, rightCensored
- rootMoveSubtreeOccurrences by rootMoveKey and depth

### `LGTGMIV-F2-RAW-GRAPH`

- depth layers: uniqueRawStateCount, cumulativeUniqueRawStateCount, stateSetSha256
- parent depth layers: uniqueTransitionCount, transitionSetSha256
- cumulative: distinctRawStates, uniqueGlobalTransitions, cumulativeRawStateSetSha256, cumulativeGlobalRawGraphEdgeSetSha256

### `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`

- depth layers: reconvergentRawStateCount
- parent depth layers: duplicateEncounterCount, multiParentRawStateCount, arrivalMultiplicityHistogram, parentMultiplicityHistogram
- firstReconvergenceDepth
- root branch geometry: rootMoveLabels, rootBranchLabelMultiplicityHistograms, rootBranchPairOverlapByDepth, rootBranchMembershipByDepth, rootBranchMembershipDigestSha256

### `LGTGMIV-F4-TREE-GRAPH-RELATION`

- depth layers: treeNodeExcess, treeToUniqueRawRatio
- parent depth layers: treeEdgeToUniqueTransitionRatio, duplicateEncounterFraction, graphStateExpansion, graphTransitionBranching
- 全ratioはexact rational pairで保存する

### `LGTGMIV-F5-REPLY-GEOMETRY`

- immediateReplyWidth keyed by root move
- depth layers: replyWidthHistogram, treeOccurrenceReplyWidthHistogram, unitWidthStateCount
- parent depth layers: widthExpansionCount, widthCompressionCount, widthStableCount, branchReopeningCount, branchExtinctionCount
- narrowPathGeometry: maximal unit-width runs、lengthHistogram、recordsDigestSha256

Family fieldの追加・削除・意味変更はfresh scientific evidence生成後は禁止。

## 10. Implementation independence

productionとindependent implementationはauthoritative engine APIをrule sourceとして共有してよいが、それ以外のLGTGMIV instrument implementationを共有してはならない。

禁止する共有:

- canonical RAW serializer
- canonical move serializer
- local tree/graph enumerator
- metric implementation
- family projection implementation
- root/stage canonical hash assembly
- set/edge digest helper

各implementationは上記を独立コードとして持つ。runnerは両者のoutputを比較するだけで、scientific coreを片方のhelperで再構成しない。static import auditをStage 0 gateとする。

## 11. Resource ceilings

Resource telemetryはscientific digest外だが、estimability gateとして固定する。

Per root、Stage 1/2共通:

- unique RAW states <= 100,000
- unique transitions <= 750,000
- parent expansions <= 100,000
- legal-move evaluations <= 750,000
- tree node occurrences summed across layers <= 1,000,000,000
- elapsed <= 180,000 ms
- peak RSS <= 4,294,967,296 bytes
- root artifact bytes <= 67,108,864

Stage 1:

- total elapsed <= 5,400,000 ms
- total artifact bytes <= 805,306,368

Stage 2:

- total elapsed <= 7,200,000 ms
- total artifact bytes <= 1,073,741,824

Stage 0:

- total elapsed <= 120,000 ms
- peak RSS <= 1,073,741,824 bytes
- result artifact <= 33,554,432 bytes

Resource ceiling超過は、scientific integrity mismatchが無い場合 `NON-ESTIMABLE` triggerとする。resource telemetry欠損でceiling判定不能な場合も `NON-ESTIMABLE` とする。

## 12. Stage 1 eligibility gates

Stage 1実行にはStage 0 PASSを記録した別authorization artifactが必要。

Global mandatory gates:

1. target population 16/16取得
2. depth-5 complete reconstruction for every root and both implementations
3. source/root/firewall identities exact agreement
4. `rootReconstructionCoreSha256` exact agreement all roots
5. `stageReconstructionCoreSha256` exact agreement
6. canonicalization/invariance assertions pass
7. resource ceilings pass
8. protected evidence remains sealed

Family promotion gate:各familyについて全16 rootsで`rootFamilyCoreSha256`と`stageFamilyCoreSha256`がproduction/independent exact一致し、required fieldsがcompleteならStage 2候補へpromoteする。

Stage 2 authorizationにはglobal gates全PASSかつpromoted family setがnon-emptyであることが必要。

## 13. Stage 2 formal gates

Stage 2はStage 1 promoted family setだけを評価する。Stage 1で落ちたfamilyを復活させない。

Formal family eligibilityには、全24 formal rootsでreconstruction global gatesがPASSし、そのfamilyのroot/stage family digestがproduction/independent exact一致することが必要。toleranceは0。

## 14. Formal decision taxonomy

Study closure decisionは次のいずれか一つ。

- `FORMAL-ELIGIBLE-ALL`: 5 familyすべてがStage 2 formal gate PASS
- `FORMAL-ELIGIBLE-PARTIAL`: non-empty proper subsetがPASS
- `NO-FORMAL-ELIGIBLE-FAMILY`: integrity/estimabilityは成立したがformal eligible familyが0
- `NON-ESTIMABLE`: fixed population/resource gateを満たせず、integrity violationより優先されない場合
- `INCONCLUSIVE`: integrityとestimabilityは成立したが、prospectively fixed decision rule上formal dispositionを確定できない矛盾が残る場合
- `TECHNICAL-INVALID`: scientific identity、canonical contract、independence、firewall、protected evidence、or exact reconstruction integrityが破れた場合
- `NOT-AUTHORIZED-NOT-EXECUTED`: downstream stageがgate不通過で実行されない場合のstage disposition

Technical integrity violationはfail-closedし、family単位のunfavorable outcomeとして矮小化しない。

## 15. No-rescue rule

Fresh Stage 1 scientific evidenceの生成またはreadの早い方以後、同一Study内で次を禁止する。

- same seed rerunをformal rescueとして扱うこと
- verifier/runner repair後に同じevidenceをformal eligibilityへ再投入すること
- tolerance relaxation
- canonical field inclusion/exclusion変更
- family追加・削除・field変更
- unfavorable root削除、favorable replacement
- seed extension / seed block replacement
- population/horizon/resource ceiling変更
- estimability/promotion gate変更
- decision taxonomy変更

Stage 0でfresh scientific evidence生成前に発見したpure implementation defectだけは、次の全条件を満たす場合に一度のcorrective refreezeを許す。

1. Stage 1/2 seedを一つも生成・readしていない
2. protected evidenceを開封していない
3. defectがimplementation-onlyで、scientific contract、family schema、population、seed、horizon、gate、taxonomyを変更しない
4.旧artifact/spec/versionを永久保存する
5.新しいStage 0 ID/versionを割り当て、新checkpointとauthorizationを作る

条件外ならStudyは `TECHNICAL-INVALID` でcloseする。

## 16. Progression authorization

- Study-start freeze後: Stage 0のみauthorized
- Stage 0 PASS後: separate Stage 1 authorization reviewが必要
- Stage 1 gates PASS + promoted family non-empty後: separate Stage 2 authorization reviewが必要
- Stage 2 closure後もG3-02は自動開始しない。RG3 current state/program decisionを更新した後、別authorization reviewを行う

## 17. Public reporting boundary

公開文書は日本語を主とし、Study identity、freshness、RAW-only boundary、exact agreement/nonagreement、eligible family set、technical/non-estimable outcome、protected holdout stateを明記する。whole-Bao state-space/game-tree estimate、symmetry reduction、strategic-regime interpretation、G3-02以降のclaimへ外挿しない。
