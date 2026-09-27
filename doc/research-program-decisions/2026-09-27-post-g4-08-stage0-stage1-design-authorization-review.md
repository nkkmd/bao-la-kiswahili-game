# 2026-09-27 — post-G4-08 Stage 0 / pre-Stage 1 設計認可レビュー

Review ID: `BRSGT-STUDY1-STAGE1-DESIGN-AUTH-2026-09-27-V1`  
Agenda: `Research Generation 4 / G4-08`  
Study: `BRSGT-STUDY1`  
Stage 0 v1: **`TECHNICAL-INVALID / NO-RERUN`**  
Stage 0 v2: **`COMPLETE / STAGE0-PASS`**  
判定: **`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / EXECUTION-NOT-YET-AUTHORIZED`**

## 1. 審査対象

Stage 0 v2で、64-seed RAW identity、capture / nyumba / reserve decrement / Namua→Mtajiのevent semantics、compound label vector、production / independent unit selection、depth-5 M1..M6、exact arithmeticがtechnical fixture上で一致することを確認した。

本レビューは、fresh Stage 1 developmentについて、**fresh scientific seedを読む前にsource population、event-unit selection、support family、freshness firewall、resource ceiling、no-rescue boundaryを固定できるか**を審査する。

本レビューはStage 1 scientific executionをまだ認可しない。implementation、firewall materialization logic、workflow、source bindingを完成させた後、別のexactly-once execution authorization reviewを必要とする。

## 2. Stage 0 prerequisite

Canonical Stage 0 v2:

```text
run = 36295553800 / attempt 1 / success
job = 108553613736
head = dbd15518791515a08570f9e7065c1b02cb7ec254
audited source = e0c7a359af5d37875cb914eae19a142d4c86f427
artifact ID = 10923364588
artifact ZIP SHA-256 = fb19763c2f2bcd29ddf2d84a776ad28cf787e8727ee1857e9a0e44f680535177
technical result SHA-256 = 3474e55298a41f76f54184027352c5d1bcbb06cbabad5241020a926d077cb1aa
deterministic core SHA-256 = 915d6146e92c8f7006f093512891911315943328e25e683fd66b4cd2bd4073f5
phase fixture source ply = 43
transition rows = 10
nyumba pair rows = 1
geometry roots = 7
mandatory gates = all PASS
fresh scientific seed reads = 0
G4-10 depth-11 access = 0
```

Stage 0 v1は別versionのtechnical-invalidであり、v2はv1をrerun/reclassifyしていない。

## 3. Stage 1 purpose

Stage 1は`FRESH-DEVELOPMENT`であり、formal effect inferenceを行わない。

目的は、fresh reachable P1/P2 trajectoriesの中で、各event family × geometry metricが後続formal holdoutに必要なsupport、definedness、resource feasibility、production/independent exactnessを持つかを判定することである。

Stage 1はcapture等のgeometry changeをconfirmしない。effect direction、contrast sign、p-valueをpromotionに使用しない。

## 4. Fresh source population

Stage identity:

`BRSGT-S1-DEVELOPMENT-2026-09-27-v1`

Reserved seed block:

```text
40813001..40813512 / 512 slots
P1/P2 = 256 slots each by fixed parity
seed extension = prohibited
replacement block = prohibited
```

Policy assignment:

```text
(seed - 40813001) even -> LGTTCI-P1-UNIFORM-LEGAL
(seed - 40813001) odd  -> LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

Source trajectory horizon:

```text
max source ply = 72
```

P1/P2 semanticsはG4-01/G4-04/G4-07で使用したfrozen semanticsを維持する。

- P1: canonical legal movesからseeded uniform selection
- P2: authoritative immediate capture-event seed countが最小のlegal move poolからseeded uniform selection

geometry、search output、engine evaluation、winner、historical scientific resultをmove selection inputへ加えない。

## 5. Stage 1 event-unit selection

各fresh source trajectoryについて、reachable pre-stateをply順に走査し、各event familyにつき最大1 unitだけをdevelopment candidateとする。

### E1 / E3 / E4

各reachable pre-stateで全canonical legal move variantsを列挙し、event predicateを満たすtransitionのうち:

1. earliest reachable ply
2. same plyではcanonical move key最小

をそのtrajectoryのfamily candidateとする。

actual source moveである必要はない。pre-stateがfresh source trajectory上でreachableであることを要求し、move-conditioned legal transitionとして扱う。

### E2 NYUMBA

reachable pre-stateでlegal stop/use pairが存在する場合:

1. earliest reachable ply
2. same plyではcanonical physical-move key最小

のsame-root pairをfamily candidateとする。

### Pseudoreplication boundary

1 source trajectoryは1 event familyにつき最大1 candidate。したがってsupport countの単位は**distinct fresh source trajectory**とする。

同一trajectoryが複数event familyをsupportすることは許容し、compound semanticsを隠さない。

## 6. Stage 1 scan rule

seed block `40813001..40813512` は固定順で全512 slotsをscanする。

早期にtargetを満たしてもscanを打ち切らず、event frequencyを見てseed read範囲を変えない。

各seedについてproduction / independent replay identityを一致させ、firewall collisionがあるtrajectoryは除外する。collision後のreplacement seed extensionは禁止する。

Stage 1が512 slotsをすべてreadすること自体はdevelopment population contractであり、formal evidenceではない。

## 7. Measurement selection

family × policyごとに、firewall通過・event-unit生成成功・depth-5 preflight適格なcandidateを:

`sourceSeed, eventPly, canonicalEventKey`

の昇順で並べ、先頭8 unitまで測定する。

```text
measurement target per family per policy = 8
maximum measured event units = 4 families × 2 policies × 8 = 64
```

不足時に別policy、別family、別seed blockから補充しない。

## 8. Stage 1 support family

promotion familyは事前固定した:

```text
4 event families × 6 geometry metrics = 24 slots
```

slot IDは`<eventFamily>/<metricId>`。

metric contrast:

- E1/E3/E4: `post - pre`
- E2: `use-post - stop-post`

Stage 1 runnerはcontrastのdefinednessを判定するためexact valueを内部計算してよいが、**promotion用resultにはcontrast valueまたはsignを保持しない**。

## 9. Support / estimability gate

各event family × metric slotについて:

```text
measurement target per policy = 8
minimum exact-defined measured trajectories per policy = 6
minimum exact-defined combined trajectories = 12
production/independent exact agreement = required
effect sign/value used for promotion = false
```

PASSしたslotだけを:

`SUPPORTED-FOR-FORMAL-HOLDOUT`

とする。

それ以外は:

`NOT-SUPPORTED-FOR-FORMAL-HOLDOUT`

であり、negative scientific effectではない。

Stage 2 formal familyは将来の別authorization reviewで、このsupport gateを満たしたslotだけから構成できる。Stage 1 effect directionでslotを選ばない。

## 10. Geometry measurement contract

Stage 0で検証したM1..M6を変更しない。

```text
representation = RAW-ONLY
relative depth = 5
measurement foundation = LGTGMIV-STUDY1 / FORMAL-ELIGIBLE-ALL
M1 root legal width
M2 cumulative tree occurrence
M3 global distinct RAW states
M4 duplicate-transition fraction
M5 cumulative tree/RAW ratio
M6 unit-width occupancy fraction
```

E1/E3/E4はpre/postの2 roots、E2はcommon pre + stop post + use postの3 rootsをbindingする。support contrastはE2ではuse-stopのみだがcommon pre rootもidentity/provenanceとして検証する。

## 11. Freshness firewall

fresh seed read前にidentity-only firewallをmaterializeする。

Seed namespace exclusionsには最低限次を含める。

```text
G3-06 Stage 1 = 31610001..31610256
G3-06 Stage 2 = 31620001..31620384
G3-08 Stage 1 = 31810001..31810256
G3-08 Stage 2 = 31820001..31820384
G3-10 Stage 1 = 32210001..32210256
G3-10 Stage 2 = 32220001..32220384
G4-01 interrupted GCLD = 40113001..40113384
G4-01 Stage 1R primary = 40213001..40213384
G4-01 Stage 1R reserve = 41213001..41213384
G4-03 Stage 1 = 40312001..40312768
G4-03 Stage 2 = 40322001..40323536
G4-04 Stage 1 = 40413001..40413512
G4-04 Stage 2 = 40423001..40424024
G4-07 Stage 1 = 40713001..40713512
G4-07 Stage 2 = 40723001..40724024
```

Auditable identity sourcesとしてG3-10 repository identity files、G4-01 recovery source artifact、G4-04 Stage 1/2 identity artifacts、G4-07 Stage 1/2 identity artifactsを使用する。

G3-06 technical-invalid partial identitiesやG4-03でcanonical identity artifactがないclassについて、非衝突を推測しない。seed namespaceは全体をexcludeし、未監査identity classは明示的limitationとして残す。

runtimeでは監査可能な範囲で:

- source seed collision
- full trajectory collision
- opening-prefix collision
- reachable RAW root collision

をrejectする。

firewall artifact/digest不一致は**最初のfresh seed read前にfail closed**する。

## 12. Stage 1 output boundary

Stage 1 canonical resultへ保存してよいもの:

- seed read accounting
- policy/family candidate counts
- rejection/support counts
- selected event-unit identities
- measured root identities/hashes
- per slot exact-defined counts
- production/independent agreement boolean
- support-only slot classification
- resource accounting
- firewall digest

保存しないもの:

- contrast exact values
- contrast signs
- majority direction
- p-values
- formal confirmation labels
- game outcomeを用いたsubgroup summary

raw artifactにもcontrast values/signsを保持しない設計を第一候補とする。

## 13. Resource ceiling

```text
source slots = exactly 512
source horizon = max 72 plies
measured event units <= 64
geometry roots <= 192
per depth-5 root distinct RAW states <= 100000
per depth-5 root unique transitions <= 750000
per depth-5 root parent expansions <= 100000
per depth-5 root legal move evaluations <= 750000
per depth-5 root tree occurrence <= 1000000000
per root elapsed <= 180000 ms
Stage 1 total elapsed <= 10800000 ms
Stage peak RSS <= 4294967296 bytes
Stage result artifact <= 134217728 bytes
```

resource ceiling超過時はfail closedする。fresh access後にceilingを緩和しない。

## 14. No-rescue boundary

no-rescue boundaryは最初のStage 1 fresh seed generation/readの早い方。

それ以降、同Stage/versionで次を変更しない。

- seed block / policy assignment
- source horizon
- event predicates
- earliest-ply / canonical-key candidate rule
- one-unit-per-trajectory-per-family rule
- measurement target
- support threshold
- metric family / relative depth
- firewall exclusion contract
- resource ceiling
- favorable policy/event subgroup rescue
- same-evidence repair rerun

technical defectがfresh read後に判明した場合は`TECHNICAL-INVALID`として閉じ、same evidenceをrepair rerunしない。

## 15. Interpretation boundary

Stage 1から次を主張しない。

- capture/nyumba/reserve/phase transitionのgeometry effect
- causal effect
- direction of change
- universal Bao rule law
- game-theoretic value / best move correctness
- search reliability
- AI strength / win rate
- human difficulty
- G4-07 reversal mechanism
- public AI change

## 16. Execution path

長時間処理・one-shot provenance確保のためGitHub Actionsを第一候補とする。

implementation完成後、fresh execution前に:

```text
source commit SHA
runner/helper blob SHA
workflow blob SHA
firewall manifest SHA/digest
Stage 1 authorization JSON
single trigger path
run attempt = 1 only
concurrency guard
artifact name/path
```

を固定する。

## 17. 本レビューで認可する次工程

認可:

- Stage 1 development spec freeze
- upstream identity firewall manifest freeze
- production / independent Stage 1 implementation
- Stage 1 workflow
- static/source separation audit
- final one-shot execution authorizationの準備

未認可:

- seed `40813001..40813512` のread
- Stage 1 scientific candidate scan
- Stage 1 geometry measurement
- support classification生成
- Stage 2 seed access
- G4-10 depth-11 access
- public AI変更
- main統合

## 18. 判定

**`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / EXECUTION-NOT-YET-AUTHORIZED`**

Stage 0 v2 prerequisiteは満たされた。次はStage 1 spec、identity-only firewall、dual implementation、workflowを実装し、fresh seed access前のstatic/source auditを通した後にexactly-once execution authorizationを行う。
