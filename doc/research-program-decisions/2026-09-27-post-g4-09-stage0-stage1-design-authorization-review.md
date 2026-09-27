# 2026-09-27 — G4-09 post-Stage0 / pre-Stage1 設計認可レビュー

Review ID: `GCSREA-STUDY1-STAGE1-DESIGN-AUTH-2026-09-27-V1`  
Agenda: `Research Generation 4 / G4-09`  
Study: `GCSREA-STUDY1`  
Stage 0: **`COMPLETE / STAGE0-PASS`**  
判定: **`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / FRESH EXECUTION NOT YET AUTHORIZED`**

## 1. 審査対象

Stage 0で、fixed search configuration semantics、ranking / TopSet / canonical-best / PV comparison、RAW depth-5 geometry、synthetic exact-set agreement classification、production / independent exact agreementがtechnical fixture上で成立した。

本レビューはfresh Stage 1 developmentについて、科学seedを読む前にsource population、root selection、geometry family、search stability family、exact-module boundary、freshness firewall、resource ceiling、no-rescue boundaryを固定できるかを審査する。

本レビューは**fresh Stage 1 executionをまだ認可しない**。spec、identity firewall、dual implementation、workflow、source binding、pre-fresh static auditを完成させた後、別のexactly-once execution authorization reviewを必要とする。

## 2. Stage 0 prerequisite

Canonical Stage 0:

```text
run = 36322244107 / attempt 1 / success
job = 108628190493
execution SHA = 47d5d0849fcc288ae58415a0d5dceef98bad17a8
audited source SHA = 0d47638f187c19e4f1d4d199394e44f380747ac0
artifact ID = 10932344799
artifact ZIP SHA-256 = d702890ce8697fde6d52f763f4e1fdcbcebdcd6b02900ea87e1daec8f41865ae
result core SHA-256 = 40dc758faeb66bc1c3b2e2e17a3278f77732663a4913846e96be439f4b16fa7d
disposition = STAGE0-PASS
fresh scientific seed reads = 0
G4-05 exact-domain new measurements = 0
G4-10 depth-11 access = 0
public AI change = false
```

Stage 0のtechnical contrast値は科学的effectとして使用しない。

## 3. Stage 1の目的

Stage 1は`FRESH-DEVELOPMENT`であり、formal scientific inferenceを行わない。

目的は次の2点に限定する。

### Module A — GENERAL-SEARCH-STABILITY

fresh general-domain RAW rootsについて、後続formal holdoutに必要な:

- source / root support
- geometry definedness / variation
- frozen search configuration estimability
- search-stability endpoint definedness
- production / independent exact agreement
- resource readiness
- Stage 2用identity exclusion material

を確認する。

### Module B — EXACT-MICRODOMAIN-AGREEMENT

G4-05 fixed 8 exact microdomainについて、Stage 1では**oracle integrity / rematerialization readinessだけ**を確認する。

Stage 1でactual search-vs-exact agreement値を生成しない。固定8 domainはreplacement不能な有限populationであるため、最初のactual agreement measurementをformal/heldout側へ温存する。

## 4. Fresh source population — Module A

Stage identity candidate:

`GCSREA-S1-DEVELOPMENT-2026-09-27-v1`

Reserved seed block:

```text
40913001..40913768 / 768 slots
seed extension = prohibited
replacement block = prohibited
```

source policies:

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

root families:

```text
RF1-MID-ANCHOR:
  Namua = exact ply 20 / nonterminal / phase=namua
  Mtaji = first nonterminal phase=mtaji state at ply >= 40

RF2-OFFSET-ANCHOR:
  Namua = exact ply 28 / nonterminal / phase=namua
  Mtaji = exact ply 52 / nonterminal / phase=mtaji
```

source horizon:

```text
max source ply = 80
```

Each source slotはfresh generation前にSHA-256で`policy × root-family × phase`へ固定assignmentする。geometry、search output、engine evaluation、winner、prior effectをassignmentやroot selection inputへ使用しない。

## 5. Outcome-blind root selection

各fresh trajectoryからassigned root-family / phase anchorを最大1 rootだけ取得する。

firewall cleanかつeligibleなrootを各cell:

```text
policy × root-family × phase = 2 × 2 × 2 = 8 cells
```

ごとに、`sourceSeed / fullTrajectorySha256 / rootRawSha256`からなるfixed SHA-256 rankで並べ、先頭16 rootまでをStage 1 development populationとする。

```text
target per cell = 16
maximum selected roots = 128
one selected root per source trajectory = true
```

RAW root duplicateはselection rank最小だけを残し、replacementによるtarget rescueをしない。

geometry値またはsearch-stability値を見てrootを選ばない。

## 6. Geometry family

Stage 1で測定するRAW relative-depth-5 geometry familyを次で固定する。

### Formal-primary candidate family

後続Stage 2 formal familyの第一候補として、理論的に異なる3軸を固定する。

```text
G1 = ROOT-LEGAL-WIDTH
G4 = CUMULATIVE-TREE-RAW-RATIO
G5 = UNIT-WIDTH-OCCUPANCY-FRACTION
```

選択理由:

- G1: immediate local branching
- G4: tree occurrenceとRAW graphのdivergence
- G5: corridor / narrow-branch occupancy

G4-03の有意subgroupやG4-06のvariation有無を見て選んだものではない。

### Secondary descriptive family

```text
G2 = CUMULATIVE-TREE-OCCURRENCE
G3 = DUPLICATE-TRANSITION-FRACTION
```

Stage 1 outcomeを見てprimary / secondaryを入れ替えない。

## 7. Search configuration family

Stage 0で検証した6 configurationを変更しない。

```text
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

fixed perturbation contrasts:

```text
SC1-DEPTH       = D2_Q1 vs D3_Q1
SC2-NODE-BUDGET = B256_Q1_MAXD3 vs B1024_Q1_MAXD3
SC3-QUIESCENCE  = D2_Q0 vs D2_Q2
```

higher-resource memberをtruth labelとしない。

## 8. Search-stability endpoint family

### Primary endpoint

各contrastについて:

`RANKING-PREORDER-CHANGE`

だけをStage 2 formal-primary endpoint候補とする。

これはG4-03とのcontinuityを持つが、G4-03 threshold、seed、selected root、effect size、p-valueは再利用しない。

### Secondary descriptive endpoints

```text
CANONICAL-BEST-CHANGE
TOPSET-CHANGE / TOPSET-RELATION
PV-PREFIX2-CHANGE
```

secondary endpointを使ってprimary formal resultを救済しない。

## 9. Stage 1 threshold freeze rule

Stage 2でprimary geometryをHIGH / LOWへ分ける必要がある場合、Stage 1 development rootsの**geometry値だけ**からphase別thresholdを固定する。

第一候補:

- exact rational median
- even Nでは中央2値のexact midpoint
- threshold equalはformal HIGH/LOWから除外

threshold freezeにsearch-output endpoint、winner、game result、G4-03 effect、G4-06 relationを使用しない。

Stage 1でgeometry variationがないprimary metricはStage 2 formal familyへ自動追加しない。その場合は`NOT-SUPPORTED-FOR-FORMAL-HOLDOUT`として保持し、別metricで救済しない。

## 10. Stage 1 development output boundary

保存してよいもの:

- seed read accounting
- firewall rejection counts
- cell-level eligible / selected counts
- selected identity rows
- geometry metric definedness / variation counts
- geometry-only phase threshold candidates
- search-condition estimability counts
- contrast endpoint definedness counts
- production / independent agreement booleans and hashes
- resource accounting
- identity manifest for Stage 2 firewall

保存しないもの:

- geometry HIGH/LOW × search-change risk difference
- effect direction
- association p-value
- formal confirmation / counterexample label
- favorable subgroup ranking
- winner / game outcome subgroup summary

Stage 1 raw artifactにもformal association statisticを生成・保持しない設計を第一候補とする。

## 11. Stage 1 support gate

Module Aについて、Stage 2候補となる各`primary geometry × search contrast` slotはStage 1で次を満たす必要がある。

```text
selected roots total target = 128
all 8 source cells represented = required
production / independent exact agreement = required
geometry definedness >= 120 / 128
search contrast endpoint definedness >= 120 / 128
both Namua and Mtaji geometry variation = required
geometry-only threshold produces at least 20 HIGH and 20 LOW roots overall = required
```

Stage 1はeffect directionを見ない。

PASS slot:

`SUPPORTED-FOR-FORMAL-HOLDOUT`

FAIL slot:

`NOT-SUPPORTED-FOR-FORMAL-HOLDOUT`

後者はnegative scientific relationではない。

## 12. Module B exact oracle integrity gate

fresh Stage 1 seed read前のpreflightとしてG4-05 canonical fixed 8-domain sourceを再取得し、各rootについてupstream保存値とのintegrity agreementだけを確認する。

最低限:

```text
fixed domain count = 8
(seed, ply, rootStateKey) identity = exact match
state-set digest = exact match
transition-set digest = exact match
solution digest = exact match
root exact value = exact match
DTF = exact match
optimalMoveKeys = exact match
```

このpreflightではG4-09 search configurationをfixed 8 rootsへ実行しない。

```text
actual search-vs-exact agreement measurements = 0
G4-05 candidate rescan = 0
G4-05 replacement = 0
```

integrity gateがFAILした場合はfresh Stage 1 seed read前にfail closedする。

## 13. Freshness firewall

Stage 1 fresh access前にidentity-only firewallをfreezeする。

seed namespace quarantineには最低限次を含める。

```text
G2-02 Stage 1 = 25011001..25012280
G2-02 Stage 2 = 25021001..25022536
G3-06 Stage 1 = 31610001..31610256
G3-06 Stage 2 = 31620001..31620384
G3-08 Stage 1 = 31810001..31810256
G3-08 Stage 2 = 31820001..31820384
G3-10 Stage 1 = 32210001..32210256
G3-10 Stage 2 = 32220001..32220384
G4-01 interrupted relevant namespaces = quarantined
G4-01 Stage 1R relevant primary/reserve namespaces = quarantined
G4-03 Stage 1 = 40312001..40312768
G4-03 Stage 2 = 40322001..40323536
G4-04 Stage 1 = 40413001..40413512
G4-04 Stage 2 = 40423001..40424024
G4-07 Stage 1 = 40713001..40713512
G4-07 Stage 2 = 40723001..40724024
G4-08 Stage 1 v1 = 40813001..40813512
G4-08 Stage 1 v2 = 40814001..40814512
G4-08 Stage 1 v3 = 40815001..40815512
G4-08 Stage 2 = 40823001..40824024
```

監査可能なsourceについてfull trajectory、opening prefix、reachable/selected RAW root identityもmaterializeしてruntime rejectする。

監査不能なidentity classは非重複を推測せず、namespace全体quarantineと明示的limitationを保持する。

firewall artifact / digest mismatchは最初のfresh Stage 1 seed read前にfail closedする。

## 14. Stage 1 resource ceiling

```text
source slots = exactly 768
max source ply = 80
selected roots <= 128
geometry root measurements <= 128
search root × configuration measurements <= 768
per depth-5 geometry root distinct RAW states <= 100000
per depth-5 geometry root unique transitions <= 750000
per depth-5 geometry root tree occurrence <= 1000000000
per root geometry elapsed <= 180000 ms
Stage 1 total elapsed <= 10800000 ms
Stage peak RSS <= 4294967296 bytes
Stage artifact <= 134217728 bytes
```

resource ceilingをfresh access後に緩和しない。

## 15. No-rescue boundary

no-rescue boundaryは最初のStage 1 scientific seed generation/readの早い方。

その後、同Stage/versionで次を変更しない。

- seed block / count
- source-policy semantics
- source assignment
- root-family / phase contract
- root selection rank
- selected-root target
- geometry family
- search configuration / contrast family
- primary / secondary endpoint split
- threshold freeze rule
- support gate
- firewall contract
- resource ceiling
- exact-domain manifest / fixed 8 membership
- same-evidence repair rerun

technical defectがfresh read後に判明した場合は`TECHNICAL-INVALID`として閉じる。

## 16. Interpretation boundary

Stage 1から次を主張しない。

- geometryがsearch instabilityをcauseする
- higher-resource searchがcorrectである
- ranking stabilityがbest-move correctnessを意味する
- exact 8-domain agreement rateがwhole Baoへ一般化する
- machine search reliabilityがhuman difficultyを意味する
- public AI strength / win rateが改善する
- public AI変更が認可された

## 17. Execution path

GitHub Actionsを第一候補とする。

fresh execution前に:

```text
source commit SHA
runner/helper blob SHA
workflow blob SHA
firewall manifest SHA / canonical digest
G4-05 fixed-domain manifest / artifact digest
Stage 1 authorization JSON
single trigger path
run attempt = 1 only
concurrency guard
artifact name/path
```

を固定し、pre-fresh auditで検証する。

## 18. 本レビューで認可する次工程

認可:

- Stage 1 development spec freeze
- upstream identity firewall design/materialization
- G4-05 exact-oracle integrity preflight implementation
- production / independent Stage 1 implementation
- Stage 1 Actions workflow
- static/source-separation audit
- final exactly-once execution authorizationの準備

未認可:

- `40913001..40913768` のfresh scientific read
- Stage 1 candidate generation / geometry / search measurement
- actual G4-05 search-vs-exact agreement measurement
- Stage 2 seed access
- G4-10 depth-11 access
- public AI変更
- main統合

## 19. 判定

**`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / FRESH EXECUTION NOT YET AUTHORIZED`**

Stage 0 prerequisiteは満たされた。次はStage 1 spec、identity-only firewall、exact-oracle integrity preflight、dual implementation、workflowを実装し、fresh seed access前のstatic auditを通した後にexactly-once execution authorizationを行う。
