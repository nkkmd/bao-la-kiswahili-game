# 2026-09-26 — post-G4-06 current-state G4-07 認可レビュー

Review ID: `G4-07-AUTHORIZATION-REVIEW-2026-09-26-V1`  
Agenda: `Research Generation 4 / G4-07`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `8edf791aa789d77ba27d3d7704ab02acd6e35eac`  
判定: **`G4-07-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
fresh scientific seed access: **0 / NOT AUTHORIZED YET**  
formal scientific outcome: **NOT GENERATED**  
G4-10 depth 11 access: **NOT AUTHORIZED / NOT ACCESSED**  
public AI change: **NOT AUTHORIZED**

## 1. 審査対象

G4-07はResearch Generation 4 Wave Cの最初のcore candidateであり、局所ゲーム木幾何の各axisが複数の時間lagでどの程度持続し、どのrule eventまたはphase crossingで消失・反転・回帰するかを、fresh trajectory上でprospectiveに検証するStudy候補である。

Program Planで固定された日本語作業名は次である。

**Bao局所ゲーム木幾何の多時間尺度memory、消失、反転、回帰のprospective検証 — trajectory単位の連続表現解析**

本レビューは科学結果を生成しない。G4-02〜G4-04の上流状態、G3-08との非再実行境界、G3-10/G4-04のtrajectory construct、continuous representation、freshness、Stage分離、長時間実行の安全な経路を結果生成前に審査する。

## 2. current-state prerequisite

```text
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED
G4-07 = NEXT AUTHORIZATION-REVIEW CANDIDATE / NOT-AUTHORIZED before this review
G4-10 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
public AI change authorized by RG4 = false
```

Program PlanはG4-07をG4-02..G4-04 eligible closuresの後続へ置いている。ただし、これはG4-02〜G4-04をすべてpositive scientific evidenceとみなすことを意味しない。

## 3. G4-02 dependencyの明示的判定

G4-02は`CLOSED / NO SCIENTIFIC DECISION`である。最終formal Stage 2はtechnical-invalidであり、G3-04 C1/C6についてfresh-domain generalization、counterexample、not-confirmed、non-estimableのいずれの科学判定も割り当てられていない。

したがってG4-07では次を固定する。

```text
G4-02 administrative/program closure = SATISFIED
G4-02 positive scientific evidence contribution = NONE
G4-02 negative scientific evidence contribution = NONE
G4-02 C1/C6 transfer assumption = PROHIBITED
G4-02 scientific seed/evidence replay = PROHIBITED
```

G4-07はG4-02の未取得scientific decisionを補完・repair・reopenするStudyではない。corridor / tree-graph transferを「成立済み」と仮定してendpointを選ばない。

G4-07の直接的なscientific foundationをG4-04でfresh transfer確認済みのcontinuous trajectory constructへ限定することで、G4-02のno-decisionをpositive evidenceへ読み替えずに独立したG4-07を設計できる。

## 4. G4-03の位置づけ

G4-03 `LWSRT-STUDY1`は12 formal test中、`GENERALIZATION-CONFIRMED=9`、`NOT-GENERALIZED=1`、`NON-ESTIMABLE=2`、`COUNTEREXAMPLE-CONFIRMED=0`で閉じた。

G4-07ではG4-03を主たるmemory/return hypothesisの根拠にしない。search-ranking constructとtrajectory-memory constructを分離する。G4-03はfresh source-policy運用、identity firewall、one-shot Actions execution等の方法論的先例として参照できるが、ranking changeをgeometry memory、game-theoretic error、AI strengthへ読み替えない。

## 5. G4-04を直接的な上流scientific foundationとする理由

G4-04 `GTTD-STUDY1`は、G3-10でformal confirmationされたchronology-dependent trajectory claim C1/C2/C3/C5をfresh P1/P2 source-policy domainsへprospectiveに移送し、固定8 testすべてで`GENERALIZATION-CONFIRMED`となった。

```text
C1 directionality / path efficiency = ACTUAL-GREATER
C2 persistence / lag-distance gradient = ACTUAL-GREATER
C3 return fraction = ACTUAL-LESS
C5 first-order directional path dependence = ACTUAL-GREATER
G4-04 transfer result = 8 / 8 GENERALIZATION-CONFIRMED
```

この結果により、G4-07はG3-10のhistorical resultだけに依存せず、fresh domainで再確認されたtrajectory chronology structureを仮説生成の上流根拠として使用できる。

ただしG4-07はG4-04のsame-evidence再実行ではない。G4-04のseed、trajectory、opening prefix、checkpoint RAW rootをfreshness firewallで除外し、G4-04のformal endpoint値やp-valueをG4-07のselection inputに使用しない。

## 6. G3-08との非再実行境界

G3-08 `LGPML-STUDY1`は`CLOSED / TECHNICAL-INVALID`である。fresh Stage 1でrequired bounded RAW reconstructionがrelay-limit technical errorへ到達し、planned complete development populationを生成できなかった。partial trajectoriesはtechnical provenanceであり、formal persistence/memory evidenceではない。Stage 2は未認可・未実行である。

G4-07では次を固定する。

```text
G3-08 scientific result reuse = NONE
G3-08 partial trajectory scientific reuse = PROHIBITED
G3-08 Stage 1 seed reuse = PROHIBITED
G3-08 Stage 2 protected seed reuse = PROHIBITED
G3-08 repair/reopen/rerun = PROHIBITED
G3-08 methodology = HISTORICAL TECHNICAL REFERENCE ONLY
```

G3-08で使用予定だったlagやendpointと同型のconstructを採用する場合も、G4-07で独立した科学的理由、fresh population、new Study identity、new seed namespace、new preregistrationを結果を見る前に固定する。

## 7. representation boundary

G4-07はG4-04と同じformal-eligible continuous representationの範囲内だけで進める。

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
axes = CRCLGR-A1..A6
coordinate arithmetic = exact reduced rational
trajectory distance = equal-weight exact L1
validated transform set = []
authoritative state identity = pits,reserve,houseOwned,player,phase,winner,pending
```

次を禁止する。

- outcome確認後のaxis追加・削除
- distance metric変更
- relative depth変更
- symmetry / canonicalization導入
- floating toleranceによるexact sign/ordering置換
- engine score、win probability、game-theoretic valueへの読み替え

representation変更が必要な場合はG4-07内部の救済として行わず、別prerequisiteとしてauthorizationから開始する。

## 8. prospective G4-07 construct family

preregistrationでは、少なくとも次を結果生成前に固定する。

1. fresh source policyとtrajectory eligibility
2. longitudinal checkpoint grid
3. multiscale lag family
4. axis-levelまたはrepresentation-levelのmemory/persistence summary
5. disappearance / zero-or-neutral transitionの定義
6. reversalの定義
7. returnの定義とreturn horizon
8. rule event / phase crossing前後のeligibilityとcensor rule
9. terminal / relay-limit / missing checkpoint handling
10. trajectory-level support / estimability gate
11. primary / secondary endpoint separation
12. multiplicity family
13. exact decision mapping

`half-life`という語を使用する場合は、有限lag集合内のbounded operational summaryとしてのみ定義し、指数減衰や物理的decay lawを仮定しない。

raw lag-pair、checkpoint、axis-pairを独立sampleとして水増ししない。primary experimental unitはfresh source trajectoryとする。

## 9. fresh source / checkpoint設計の入口

G4-04でfresh transfer検証に成功したsource policiesをG4-07の第一候補とする。

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

G4-04のlongitudinal checkpoint gridは次である。

```text
16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
```

G4-07では、この4-ply gridをそのまま採用するか、memory/return endpointに必要な別gridへ変更するかをfresh scientific access前にpreregistrationで固定する。G4-04 resultを見た後に有利なcheckpointだけを選ばない。

## 10. fresh seed namespace readiness

repository default branchの事前検索で、次のcandidate startに予約衝突を認めなかった。

```text
Stage 1 candidate block start = 40713001
Stage 2 candidate block start = 40723001
```

正式なend、count、policy assignment、reserve ruleはpreregistrationで固定する。このreview時点ではG4-07 scientific seedを生成・readしていない。

## 11. freshness firewall

G4-07 Stage 1 fresh access前に、少なくとも次のidentity-only exclusionをmaterializeする。

- G3-10 Stage 1/2 scientific seeds、full trajectories、auditable opening prefixes、checkpoint roots
- G3-08 Stage 1 scientific seed namespaceと生成済みtrajectory/root identity
- G3-08 Stage 2 protected seed namespace全体
- G4-01 GCLD compatibility scientific/reserve namespaces
- G4-04 Stage 1/2 seeds、full trajectories、opening prefixes、checkpoint roots
- G4-07 Stage 2ではさらにG4-07 Stage 1の全scientific identity

prior scientific endpoint、effect direction、p-value、game outcomeはfresh selectionに使用しない。

## 12. Stage構成

### Stage 0 — technical-only

Stage 0ではfresh G4-07 scientific seedを読まず、technical/synthetic fixturesだけを使用する。

少なくとも次を検証する。

1. frozen representation binding
2. exact reduced-rational axis extraction
3. longitudinal checkpoint construction
4. lag eligibility
5. persistence / disappearance / reversal / return semantics
6. phase crossing / rule-event censor semantics
7. terminal / missingness semantics
8. trajectory-level aggregation
9. production / independent exact agreement
10. identity firewall serialization / matching
11. canonical JSON / digest agreement
12. resource measurement
13. scientific execution flag = false
14. G4-10 depth-11 access = false

Stage 0 PASSはfresh Stage 1を自動認可しない。

### Stage 1 — development

**NOT AUTHORIZED by this review**。

別authorization前に次をfreezeする。

- Study ID / Stage ID
- source policies / seed block
- trajectory eligibility / target
- checkpoint grid
- lag family
- primary endpoint family
- descriptive-only endpoint family
- support/estimability gate
- outcome-blind selection
- firewall manifest
- resource ceiling
- exact production / independent implementations
- no-rescue rule

Stage 1はsupport、definedness、exactness、resource readiness、identity-only outputに限定し、formal heldout decisionを生成しない設計を第一候補とする。

### Stage 2 — formal heldout

**NOT AUTHORIZED by this review**。

Stage 1終了後に別authorizationを必要とする。fresh heldout population、formal family、direction freezing、exact test、multiplicity、decision labelsをStage 2 seed access前に固定する。

## 13. execution context

technical Stage 0、および将来認可されるStage 1/2で長時間実行が生じる場合は、G4-03〜G4-06で確立した運用に合わせGitHub Actionsを第一候補とする。

fresh scientific Stageでは最低限、次を保存する。

```text
source commit SHA
workflow run ID / attempt
execution lease / exactly-once state
artifact ID
artifact SHA-256
canonical result SHA-256
fresh seed reads
protected-evidence access count
```

GitHub Actionsの制約自体がscientific endpointやsample targetを変更させない。必要ならresource ceiling内でfail-closedする。

## 14. no-rescue / interpretation boundary

最初のfresh Stage 1 seed read後、同Study/version内で次を行わない。

- seed extension
- lag追加・削除
- checkpoint変更
- axis/representation変更
- policy replacement
- support gate relaxation
- favorable phase/rule-event subgroup rescue
- threshold/multiplicity変更
- resource ceiling relaxation
- same-evidence repair rerun

G4-07から次を主張しない。

- whole-Bao universal memory law
- physical/statistical exponential half-life
- game-theoretic value / best-move correctness
- AI strength / win rate
- human memory / difficulty
- causal reset mechanism
- public AI採用

## 15. 認可gate

| Gate | 判定 | 根拠 |
|---|---|---|
| RG4 current-state | PASS | G4-06までclosed / integrated |
| G4-02 program closure | PASS | closed済み、ただしscientific contributionはNONE |
| G4-02 positive-evidence contamination | PASS | C1/C6 transfer assumptionを禁止 |
| G4-03 separation | PASS | search-ranking resultをmemory endpointへ流用しない |
| G4-04 direct scientific foundation | PASS | C1/C2/C3/C5 transfer 8/8 confirmed |
| G3-08 non-repair boundary | PASS | technical-invalid evidenceをscientific reuseしない |
| continuous representation | PASS | G4-04でfresh use済みのfixed CRCLGR representation |
| fresh source policies | PASS-AS-PREREQUISITE | P1/P2を候補としてprereg固定可能 |
| lag/checkpoint family | PASS-AS-PREREQUISITE | fresh access前に固定可能 |
| trajectory-level unit | PASS | pair/checkpoint水増しを禁止可能 |
| freshness firewall | PASS-AS-PREREQUISITE | upstream namespaces/identitiesをmaterialize可能 |
| production / independent path | PASS-AS-DESIGN | prior exact implementationsを基礎に独立実装可能 |
| fresh seed namespace | PASS-AS-DESIGN | 40713001 / 40723001 startに衝突なし |
| GitHub Actions execution path | PASS-AS-DESIGN | prior RG4 one-shot patternを再利用可能 |
| protected G4-10 boundary | PASS | depth 11不要 |
| public AI separation | PASS | scientific endpointとdeploymentを分離可能 |

## 16. 認可される次工程

本レビューにより次だけを認可する。

- formal Study ID / title / research branchの固定
- preregistration / protocolの作成とfreeze
- Stage 0 technical specのfreeze
- Stage 1 / Stage 2 fresh seed namespaceの**予約のみ**
- upstream identity firewall contractの作成
- technical-only production / independent verifierの実装
- technical/synthetic fixturesの作成
- GitHub Actions Stage 0 workflowの作成
- Stage 0 technical execution

本レビューでは次を認可しない。

- fresh Stage 1 scientific seed generation/read
- fresh Stage 2 formal seed generation/read
- G3-08 partial scientific evidenceの再利用
- G4-02 scientific decisionの代理生成
- G4-04 same-evidence rerun
- formal memory/return effect、p-value、confirmation decisionの生成
- G4-10 depth-11 access
- `main`統合
- public AI変更

## 17. 最終判定

**`G4-07-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

G4-07は、G4-02のno-decisionをpositive evidenceへ読み替えず、G4-04でfresh transfer確認済みのcontinuous trajectory constructを直接的な上流foundationとする独立fresh prospective Studyとして開始できる。

次工程ではformal Study identity、lag/checkpoint/endpoint family、freshness firewall、resource ceiling、no-rescue ruleを完全freezeし、technical-only Stage 0を実行する。Stage 0 PASS後もfresh Stage 1 accessには別authorization reviewを必要とする。
