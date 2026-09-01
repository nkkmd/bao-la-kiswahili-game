# EBRWS-STUDY1 — Study 1 Protocol

## 1. Formal identity

- Study ID: `EBRWS-STUDY1`
- Program position: Research Generation 3 `G3-02`
- English title: **Effective Branching and Reply-Width Structure Study 1 — Prospective validation of reproducible multi-ply branching and reply-width profiles as bounded RAW local game-tree position characteristics in Bao**
- 日本語題目: **Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**
- Research branch: `research/g3-02-effective-branching-reply-width-structure`
- Source-of-truth baseline remote `main`: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- Authorization review: `doc/research-program-decisions/2026-09-01-post-lgtgmiv-g3-02-authorization-review.md` = `AUTHORIZED`

本StudyはG3-01 `LGTGMF-STUDY1`のrepair、corrected rerun、rescueではない。また`LGTGMIV-STUDY1`の再実行・再判定でもない。G3-01は永久に`CLOSED / TECHNICAL-INVALID`、formal eligible measurement families `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`である。

## 2. Scientific question

Primary question:

> 単純なroot legal-move countだけでは表現できない数plyのeffective branching / reply-width profileが、LGTGMIVでformal eligibilityを得たbounded RAW-only depth-5 geometry instrumentの範囲内で、prospectively定義した再現可能な局面特性として成立するか。

本Studyの「局面特性」は、prospectively fixedなroot-level profile classがfresh developmentで所定のphase prevalence gateを満たし、その同一class / phase claimがfresh formal holdoutで同じgateを再度満たすことを意味する。

## 3. Immutable representation and move identity

Authoritative scientific state identityはRAW-onlyであり、次の7 fieldのみを順序付きcontractとして使用する。

`pits,reserve,houseOwned,player,phase,winner,pending`

Validated transform set:

`[]`

symmetry、reflection、rotation、player swap、canonical orbit、heuristic equivalence、symmetry quotientをidentityまたはdeduplicationへ導入しない。

Move identity field contractはLGTGMIVで凍結した次の8 fieldを継承する。

`type,phase,row,index,direction,side,houseChoice,houseTwo`

未定義optional fieldはcanonical move objectから省略し、`houseTwo`はbooleanとしてmaterializeする。

## 4. Authorized measurement dependency

G3-02で使用可能なformal eligible familyは次の5つだけである。

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

Primary dependencyはF1 + F5。F2-F4はgraph-adjusted / reconvergence-aware secondary characterizationに限定する。

`effective branching`を新しいvalidated measurement instrumentとは扱わない。以下で定義するderived constructはformal eligible integer / exact-rational primitiveからのdeterministic derivationであり、新しいstate representationやheuristic semanticsを導入しない。

## 5. Prospectively fixed derived constructs

すべてのratioはfloating pointへ変換せず、canonical exact rational pair

`{numerator:<decimal integer>, denominator:<decimal integer>, defined:<boolean>}`

として保存する。ratio比較はBigInt cross multiplicationで行い、toleranceは0とする。

### 5.1 Tree effective branching profile

relative parent depth `d = 0..4`について、F1 primitiveから

- `T_d = treeNodeOccurrences[d]`
- `Z_d = terminalOccurrenceCount[d]`
- `T_{d+1} = treeNodeOccurrences[d+1]`

を取り、

`EB_tree(d) = T_{d+1} / (T_d - Z_d)`

と定義する。denominatorが0なら`defined=false`とする。

rootはnonterminalなので通常`EB_tree(0)`はroot legal branchingと一致する。`EB_tree(1..4)`はtree occurrenceで重み付けされた後続plyの平均legal branchingを表す。これをbest move、search difficulty、forcing、valueとは解釈しない。

### 5.2 Tree width-shape code and class

`EB_tree(0)..EB_tree(4)`が全てdefinedの場合、隣接ratioの4比較をexactに行い、各比較を`E` (later > earlier)、`C` (later < earlier)、`S` (equal)とする。

root-level `treeWidthShapeClass`:

- `EXPANSION-DOMINANT`: 4比較中`E`が3以上
- `COMPRESSION-DOMINANT`: 4比較中`C`が3以上
- `FLAT-DOMINANT`: 4比較中`S`が3以上
- `MIXED`: 上記以外
- `TERMINAL-TRUNCATED`: `EB_tree(0..4)`のいずれかがdenominator 0でundefined

### 5.3 Reply-width direction profile and class

F5のparent-depth primitive `widthExpansionCount[d]`、`widthCompressionCount[d]` (`d=0..4`)をexact integerとして使用する。

各depthの`replyDirection[d]`:

- `E`: expansion count > compression count
- `C`: compression count > expansion count
- `S`: equal

root-level `replyWidthShapeClass`:

- `EXPANSION-DOMINANT`: 5 depth中`E`が3以上
- `COMPRESSION-DOMINANT`: 5 depth中`C`が3以上
- `BALANCED-MIXED`: 上記以外

`widthStableCount`、`branchReopeningCount`、`branchExtinctionCount`はsecondary descriptionとして保存するが、このprimary class gateを変更しない。

### 5.4 Immediate reply-width summary

F5 `immediateReplyWidth`をroot move key順に保持し、次をdeterministically導出する。

- minimum immediate reply width
- maximum immediate reply width
- exact rational mean = sum(width) / rootLegalMoveCount
- exact histogram

これはsecondary endpointでありprimary positive decisionを単独では成立させない。

### 5.5 Graph-adjusted secondary profile

F4 `graphTransitionBranching[d]`、`treeToUniqueRawRatio[d]`、`duplicateEncounterFraction[d]`をそのままexact-rational secondary profileとして使用する。F2/F3のunique RAW state、transposition、reconvergence primitiveはcontextual secondary endpointである。

F2-F4結果から新しいcanonical state quotientやsymmetry-reduced branchingを作らない。

## 6. Primary endpoint and candidate promotion rule

Primary construct systemsは次の2つだけである。

1. `TREE-WIDTH-SHAPE` = §5.2
2. `REPLY-WIDTH-SHAPE` = §5.3

phaseは`namua`と`mtaji`の2層のみ。Stage 1後に新しいphase subsetやroot subgroupを追加しない。

各construct × phaseについて、あるroot-level classがそのphaseのeligible rootsの少なくとも2/3を占める場合のみ、phase-level dominant-profile candidateとしてpromoteする。

Gateはfloating pointを使わず、

`3 * classCount >= 2 * eligibleRootCount`

で判定する。2/3未満のclassはcandidateにしない。2/3は過半数を超えるため同一construct × phaseで複数classが同時promoteすることはない。

Stage 2では、Stage 1でpromoteされた**同一construct / phase / class**だけを確認し、同じ2/3 gateを満たした場合にformal confirmationとする。

### 6.1 Primary positive decision

少なくとも1つのpromoted primary candidateがStage 2で同一gateを再度満たした場合のみ、Study primary resultを

`CONFIRMED-BOUNDED-PROFILE-STRUCTURE`

とする。

### 6.2 Primary negative disposition

- Stage 1でprimary candidateが0件ならStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`とし、Studyは`NOT-CONFIRMED`で閉じる。
- Stage 2が実行され、promoted candidateが1件もformal confirmationを得なければ`NOT-CONFIRMED`とする。

Stage 2で新たに見えた未promote patternはdiagnostic-onlyでありformal positive claimへ昇格させない。

## 7. Secondary endpoints

以下はprospectively declared secondary endpointであり、primary decisionを救済しない。

- Namua / Mtaji間でdominant classが異なるか
- `EB_tree(0..4)` exact profile distributions
- immediate reply-width min / max / exact mean / histogram
- F5 width expansion/compression/stable, reopening, extinction profile
- branch survival profile (F1)
- graphTransitionBranching / tree-to-RAW divergence (F4)
- unique RAW-state growth (F2)
- transposition / reconvergence context (F3)
- root legal branchingとlater `EB_tree`の一致・不一致のdescriptive pairwise ordering

secondary endpointにpost-hoc significance thresholdを追加しない。

## 8. Stage structure

1. `EBRWS-S0-TECHNICAL-2026-09-01-v1` — derived-endpoint / independent-verifier technical validation。scientific evidenceではない。
2. `EBRWS-S1-DEVELOPMENT-2026-09-01-v1` — fresh development / primary candidate generation。
3. `EBRWS-S2-FORMAL-2026-09-01-v1` — fresh formal holdout confirmation。Stage 1 promotion gate通過後の別authorizationを必要とする。

Stage 0 PASS前にStage 1 seedを生成・readしない。Stage 2 seedはStage 2 authorization前に生成・readしない。

## 9. Stage 0 technical controls

Stage 0はsynthetic primitive fixtureのみを使用し、G3-02 fresh trajectory / rootを生成しない。

Mandatory controls:

- exact-rational reduction / serialization determinism
- BigInt cross-multiplication comparison correctness
- `EB_tree` denominator-zero handling
- all treeWidthShapeClass boundary cases
- all replyWidthShapeClass boundary cases
- exact 2/3 promotion boundary cases
- root-order invariance
- fixture-order invariance
- production / independent endpoint object exact agreement
- production / independent candidate-set exact agreement
- independent code static import audit
- telemetry mutation does not alter scientific core
- protected depth-10 holdout access = false
- Stage 1 / 2 seed consumption = false

全mandatory assertionのexact PASSが必要。toleranceは0。

## 10. Fresh population contract

### 10.1 Source trajectory policy

Source trajectoryはauthoritative `public/engine.js` のstandard initial RAW stateから開始し、seeded Mulberry32を用いる。各plyでlegal moveをcanonical move identity key昇順にsortし、PRNG値`u`に対する`floor(u * legalMoveCount)`番目を選ぶ。

- max source ply = 240
- relay-limit anomaly = technical-invalid trigger
- nonterminal zero-legal-move anomaly = technical-invalid trigger

root selectionはgeometry、branching、reply width、search evaluation、game outcomeを一切参照しない。

### 10.2 Root selection

- Namua candidate: exactly ply 24、nonterminal、phase=`namua`
- Mtaji candidate: 各trajectoryで最初のply >= 44のnonterminal phase=`mtaji` state
- candidateはRAW root identityでdeduplicate
- phase内でsource seed昇順first-Nを採用
- canonical root order: phase `namua` then `mtaji`、sourceSeed ascending、selectedPly ascending、rootRawSha256 ascending

### 10.3 Stage 1 fresh development

- seed block: `31210001..31210192`
- target roots: Namua 12 + Mtaji 12 = 24
- relative local horizon: depth 5
- evidence class: `FRESH-DEVELOPMENT`
- per-phase dominant-profile gate: 8/12以上

### 10.4 Stage 2 fresh formal holdout

- seed block: `31220001..31220288`
- target roots: Namua 18 + Mtaji 18 = 36
- relative local horizon: depth 5
- evidence class: `FRESH-FORMAL-HELDOUT`
- per-phase formal confirmation gate: 12/18以上

## 11. Fresh-evidence firewall

G3-02 scientific evidenceとして次を再利用しない。

- G3-01 seed `31010001..31010096`
- LGTGMIV Stage 1 seed `31110001..31110128`
- LGTGMIV Stage 2 seed `31120001..31120192`
- upstream scientific metric / family outcome

upstream artifactsから参照可能なのは、overlap exclusionに必要な次のidentityだけである。

- RAW root identity
- full source trajectory identity
- first-16-move opening-prefix identity

Stage 1 candidateはG3-01 / LGTGMIV Stage 1 / LGTGMIV Stage 2の上記identityとcollisionした場合rejectする。Stage 2はさらにG3-02 Stage 1のroot / trajectory / first-16-prefix identityとcollisionしたcandidateをrejectする。

collision rejection後も固定seed block内のsource seed昇順first-Nだけで補充する。seed block外へextensionしない。target populationを取得できなければ`NON-ESTIMABLE`とする。

## 12. Protected evidence firewall

standard initial RAW rootのcomplete exact depth-10 holdoutはStudy全期間を通じて

`SEALED / NOT GENERATED / NOT READ`

とする。

G3-02 Stage 0/1/2のいずれもcomplete depth-10 enumeration、depth-10 scientific count、depth-10 geometry outcomeを生成・readしない。G2-12 estimatorをdepth-10 truthとして利用しない。

## 13. Implementation independence

productionとindependent implementationはauthoritative Bao rule engine contractを共有してよいが、G3-02 derived endpoint / class / candidate logicを共有してはならない。

各実装は独立に次を行う。

1. same selected RAW rootについてeligible bounded depth-5 primitiveを取得または再構築する。
2. `EB_tree` exact rationalを独立計算する。
3. tree/reply shape classを独立計算する。
4. phase-level candidate setを独立生成する。
5. canonical endpoint object / digestを独立生成する。

禁止する共有:

- G3-02 exact-rational helper
- G3-02 class assignment helper
- G3-02 candidate promotion helper
- G3-02 canonical endpoint hash assembly helper

runnerは両outputを比較するだけで、一方のhelperを使って他方を再計算しない。

## 14. Canonical scientific core

SHA-256 lowercase hexadecimal。UTF-8 canonical JSON bytes、hash inputにtrailing newlineなし。

Scientific coreには最低限次を含む。

- Study / Stage ID
- selected root identity and phase
- eligible primitive family IDs used
- root-level exact derived endpoint object
- root-level class assignments
- ordered phase-level class counts
- Stage 1 promoted candidate setまたはStage 2 tested/promoted candidate set
- independent/production exact-agreement assertions

Runtime、elapsed、RSS、PID、runner、job ID、filesystem path等はscientific core digestから除外する。

## 15. Resource ceilings

Per-root ceilingはLGTGMIV depth-5 validated resource envelopeを超えて拡張しない。

Per root:

- unique RAW states <= 100,000
- unique transitions <= 750,000
- parent expansions <= 100,000
- legal-move evaluations <= 750,000
- tree node occurrences summed across layers <= 1,000,000,000
- elapsed <= 180,000 ms
- peak RSS <= 4,294,967,296 bytes
- root artifact bytes <= 67,108,864

Stage 0:

- total elapsed <= 120,000 ms
- peak RSS <= 1,073,741,824 bytes
- result artifact <= 33,554,432 bytes

Stage 1 (24 roots):

- total elapsed <= 7,200,000 ms
- total artifact bytes <= 1,073,741,824

Stage 2 (36 roots):

- total elapsed <= 10,800,000 ms
- total artifact bytes <= 1,610,612,736

resource telemetry欠損でceiling判定不能、またはceiling超過でcomplete exact reconstructionが成立しない場合は`NON-ESTIMABLE`。resource cutoffをscientific nullへ読み替えない。

## 16. Stage 1 mandatory gates

Stage 1開始にはStage 0 PASSと別authorization artifactが必要。

全て必須:

1. 24/24 target roots取得
2. phase counts 12 Namua + 12 Mtaji
3. every root complete depth-5 bounded reconstruction
4. production / independent selected-root identity exact agreement
5. production / independent eligible primitive exact agreement required by endpoint
6. production / independent root derived endpoint object exact agreement
7. root class exact agreement
8. phase class-count exact agreement
9. promoted candidate set exact agreement
10. resource gates PASS
11. overlap firewall PASS
12. protected depth-10 holdout remains sealed
13. no technical-integrity violation

Global gate failure時はfavorable subgroupで続行しない。

Stage 1終了時にpromoted primary candidate setをimmutable artifactとしてfreezeする。

## 17. Stage 2 authorization and formal gates

Stage 2 authorizationには以下が必要。

- Stage 1 global mandatory gates all PASS
- promoted primary candidate set non-empty
- Stage 1 candidate-set freeze committed
- Stage 2 seed未消費
- protected holdout sealed

Stage 2はpromoted primary candidateだけをformal testする。

Mandatory formal gates:

1. 36/36 target roots取得
2. phase counts 18 Namua + 18 Mtaji
3. complete depth-5 reconstruction every root
4. production / independent endpoint exact agreement every root
5. phase-level class-count exact agreement
6. same construct / phase / class candidate identity as Stage 1 freeze
7. exact 2/3 confirmation rule only
8. resource / firewall / protected-evidence gates PASS

## 18. Formal decision taxonomy

Study closureは次のいずれか一つ。

- `CONFIRMED-BOUNDED-PROFILE-STRUCTURE`
- `NOT-CONFIRMED`
- `NON-ESTIMABLE`
- `INCONCLUSIVE`
- `TECHNICAL-INVALID`

Stage-level non-execution:

- `NOT-AUTHORIZED-NOT-EXECUTED`

`TECHNICAL-INVALID`はidentity、canonical contract、independence、endpoint logic、firewall、protected evidence、exact reconstruction integrityの破損時にfail-closedで適用する。

## 19. Claim boundary

本Studyがformal positiveでも主張可能なのは、fresh bounded RAW roots、relative depth 5、frozen phase/source policy、formal eligible LGTGMIV instrumentの範囲で、prospectively defined multi-ply branching / reply-width profile classが再現されたことだけである。

次を主張しない。

- whole-Bao state-space / game-tree size
- depth 5超への自動一般化
- symmetry-reduced structure
- strategic regime
- best move
- search difficulty
- game-theoretic forcing
- win probability / game value
- causal strategic effect
- human difficulty

「branchingが狭い」「reply widthが小さい」を「強制手」「簡単」「最善手が明確」と言い換えない。

## 20. No-rescue rule

Stage 1 fresh scientific evidenceの**生成またはreadの早い方**以後、同一Study内で次を禁止する。

- threshold変更
- endpoint追加・削除・意味変更
- family usage変更
- phase subset変更
- root-selection rule変更
- unfavorable root除外 / favorable replacement
- seed extension / replacement
- horizon変更
- profile class rule変更
- 2/3 gate変更
- resource ceilingの結果依存緩和
- Stage 2で新しく見えたpatternのformal promotion
- near-miss rescue

Stage 0でのみ、fresh Stage 1/2 seedを未生成・未readかつprotected holdout未開封で、pure implementation defectが見つかった場合に限り、別dated decisionを伴うcorrective refreezeを許す。scientific constructを結果依存で変えるcorrective refreezeは許さない。

## 21. Stopping rules

- technical-integrity violation -> immediate fail-closed `TECHNICAL-INVALID`
- fixed populationがseed block内で取得不能 -> `NON-ESTIMABLE`
- resource ceiling超過 -> `NON-ESTIMABLE` unless technical integrity has already failed
- Stage 1 primary candidate 0 -> Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`, Study `NOT-CONFIRMED`
- Stage 1 candidate non-empty -> candidate set freeze後に別Stage 2 authorization review
- Stage 2 completion -> formal decisionを固定し、same evidence rescueを行わない

## 22. Historical-document boundary

`doc/research-generation-3/PROGRAM_PLAN.md`はResearch Generation 3開始前にfreezeしたhistorical prospective planであり、本Study開始に合わせてretrospective rewriteしない。
