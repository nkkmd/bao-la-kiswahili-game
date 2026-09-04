# LGTGGC-STUDY1 — Prospective Scientific Protocol

更新日: 2026-09-04  
Program position: Research Generation 3 / G3-12

## 1. Formal Study identity

```text
Study ID = LGTGGC-STUDY1
Program agenda = G3-12
Authorization = G3-12-AUTHORIZED
Source main HEAD = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
Research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
Fresh scientific evidence generated at protocol freeze = none
```

正式日本語題目:

**Bao局所ゲーム木幾何の一般化可能範囲と反例領域のprospective検証 — formal-eligible upstream claimをphase、reachable-root family、source-policy、rule context横断のfresh evidenceで再検証し、bounded geometry claim boundaryを確立する**

Formal English title:

**Local Game-Tree Geometry Generalization / Counterexample Study 1 — Prospective fresh validation of generalization and counterexample boundaries for formally eligible bounded RAW local-game-tree geometry claims across phase, reachable-root family, source policy, and Bao rule context**

Canonical machine-readable preregistration:

`prereg/STUDY_1_SPEC.json`

本protocolとJSONが食い違う場合は、scientific outcome生成前の整合性監査でfail closedし、どちらかを結果後に都合よく選ばない。

---

## 2. Research question

中心問いは次である。

> G3-04、G3-07、G3-10でformal confirmationを得たbounded local-game-tree geometry claimは、新しいsource policyとreachable-root familyへ移したとき、どのdomainで同じ方向に再現し、どのdomainで再現せず、どこで反対方向のcounterexampleが成立するか。

G3-12はpositive resultを増やすためのStudyではない。`GENERALIZATION-CONFIRMED`、`COUNTEREXAMPLE-CONFIRMED`、`NOT-GENERALIZED`、`NON-ESTIMABLE`を対称に受け入れる。

---

## 3. Upstream claim firewall

Formal generalization targetは次の9 claim identitiesだけである。

### 3.1 G3-04 / SFCDF

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION` — `MTAJI-GREATER`
2. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO` — `NAMUA-GREATER`

C2..C5はpositive targetではない。

### 3.2 G3-07 / SILGM

1. `SC1 DEPTH × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH` — `HIGHER-IN-HIGH`
2. `SC2 NODE-BUDGET × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH` — `HIGHER-IN-HIGH`
3. `SC3 QUIESCENCE × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH` — `HIGHER-IN-HIGH`

G3-07の4 `NOT-CONFIRMED` candidatesと1 `NON-ESTIMABLE` candidateはpositive targetではない。

### 3.3 G3-10 / GCLD

1. C1 directionality / path efficiency — `ACTUAL-GREATER`
2. C2 persistence / lag-distance gradient — `ACTUAL-GREATER`
3. C3 return fraction — `ACTUAL-LESS`
4. C5 first-order directional path dependence — `ACTUAL-GREATER`

C4 chronology-conditioned circulationは`NOT-CONFIRMED`のままであり、G3-12でrescueしない。

### 3.4 Positive targetを供給しないStudy

次はpositive scientific inputにしない。

```text
G3-02 EBRWS-STUDY1 = TECHNICAL-INVALID
G3-03 TCTGD-STUDY1 = TECHNICAL-INVALID
G3-05 BECT-STUDY1 = TECHNICAL-INVALID
G3-06 BRMGI-STUDY1 = TECHNICAL-INVALID
G3-08 LGPML-STUDY1 = TECHNICAL-INVALID
G3-09 CLGR-STUDY1 = TECHNICAL-INVALID
RRCLGR-STUDY1 = TECHNICAL-INVALID
```

Failure diagnosticsはtechnical defensive controlの着想には使えるが、scientific direction / threshold / candidate evidenceへ昇格させない。

---

## 4. G3-11 boundary

G3-11 `FDEGHV-STUDY1`は:

```text
CLOSED / FORMAL-COMPLETE
EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1..H4 = DEEPER-CONFIRMED
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

G3-12での役割は:

```text
formal generalization target = NO
validation anchor = YES
boundary reference = YES
historical exact comparator = YES
```

Published exact resultはread-only historical evidenceとして参照できる。depth-10を再enumerateせず、depth 11へ進まない。

---

## 5. Engine / rules / serializer identity

Source binding:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
crclgr-production.js = f9d90792d729a42f738e7cd1c3b045bdd758ffa5
crclgr-independent.js = 77d3a91b2165019e4b50c195a1bb14147c35e6d2
```

Authoritative RAW state identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded:

```text
turn,reason
```

Move identity:

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

Validated transform set is exactly `[]`。reflection、seat swap、symmetry quotient、canonicalization collapseを使用しない。

---

## 6. Instruments

### 6.1 RAW local geometry

`LGTGMIV-CANONICAL-v1`のformal-eligible F1..F5をrelative depth 5で使用する。

```text
F1 TREE-OCCURRENCE
F2 RAW-GRAPH
F3 TRANSPOSITION-RECONVERGENCE
F4 TREE-GRAPH-RELATION
F5 REPLY-GEOMETRY
```

### 6.2 G3-10 trajectory representation

GCLD transferだけに:

```text
CRCLGR-R1-EXACT-SQUASHED-L1
six exact axes
q -> q/(1+q)
equal-weight exact L1
relative depth = 5
```

を使用する。

---

## 7. Generalization axes

### 7.1 Formal source-policy axis

2 familyだけを固定する。

#### P1 — `LGTGGC-P1-UNIFORM-LEGAL`

- PRNG = Mulberry32
- legal moves = canonical move identity ascending
- every ply: `floor(u * legalMoveCount)`

#### P2 — `LGTGGC-P2-CAPTURE-FIRST`

- same PRNG / canonical order
- capture moveが1件以上あればcapture poolだけからuniform selection
- captureがなければall legal movesからuniform selection

Policyはtrajectory開始から終了まで固定し、結果を見て切替えない。

### 7.2 Formal reachable-root-family axis

#### RF1 — `LGTGGC-RF1-EARLY-ANCHOR`

```text
Namua = exact ply 24 / nonterminal / phase=namua
Mtaji = first nonterminal phase=mtaji state at ply >=44
```

#### RF2 — `LGTGGC-RF2-LATE-ANCHOR`

```text
Namua = exact ply 32 / nonterminal / phase=namua
Mtaji = exact ply 56 / nonterminal / phase=mtaji
```

SFCDFでは同一source trajectoryのNamua/Mtajiをpairとして扱う。どちらかが欠ければpair全体をrejectする。

SILGMではone-root-per-trajectoryを維持し、phaseとroot familyをstage-specific hashでprospectively割り当てる。

### 7.3 Phase

- SFCDF: paired `Mtaji - Namua` contrastの一部
- SILGM: phase-stratified conditional associationの一部
- GCLD: trajectory全体がunitであり、post-hoc phase splitを行わない

### 7.4 Rule-context descriptors

次を全rootでprospectively保存する。

```text
phase
selectedPly
rootLegalWidth
captureAvailable
actorReserve / opponentReserve
actorHouseOwned / opponentHouseOwned
actorPending / opponentPending
```

`captureAvailable = any canonical legal move has type=capture`。

これらはprimary testを救済するためのsubgroup searchには使わない。特にreserveはphaseと構造的に連動するため、独立causal factorとして扱わない。root legal widthはSILGMのpredictorそのものであり、同claimの独立transfer axisとして二重使用しない。

---

## 8. Stage structure

### Stage 0 — `LGTGGC-S0-TECHNICAL-2026-09-04-v1`

Evidence = `TECHNICAL-FIXTURE`。

Stage 0はfresh G3-12 scientific seedをreadしない。

Mandatory technical controls:

- RAW / move canonical identity exactness
- P1 / P2 source-policy deterministic replay on synthetic/legal-move fixtures
- RF1 / RF2 selection fixture exactness
- SFCDF C1/C6 exact rational arithmetic
- SILGM inherited thresholds 4/1 Namua, 3/1 Mtaji boundary cases
- all three search-condition endpoint exactness
- two-sided hypergeometric convolution exact arithmetic
- CRCLGR six-axis / exact-L1 reproduction
- GCLD C1/C2/C3/C5 and 32 temporal-control construction
- exact two-sided sign test
- Holm exact rational implementation
- production / independent canonical-content agreement
- order invariance
- forced fail-closed controls
- G3-11 depth-10 access = false
- depth-11 access = false

Stage 0 PASSだけではStage 1 fresh accessをauthorizeしない。別pre-fresh authorizationを必要とする。

### Stage 1 — `LGTGGC-S1-DEVELOPMENT-2026-09-04-v1`

Evidence = `FRESH-DEVELOPMENT`。

Stage 1はprotocol freeze時点では`NOT AUTHORIZED`。

Stage 1はeffect discovery / candidate promotion Stageではない。次だけを確認する。

- frozen cell population support
- endpoint definedness
- production / independent exactness
- resource readiness
- selection / firewall exactness

禁止:

- p-value calculation
- observed directionによるclaim selection
- effect magnitudeによるaxis変更
- threshold relearning
- formal claimのdrop / substitution

### Stage 2 — `LGTGGC-S2-FORMAL-2026-09-04-v1`

Evidence = `FRESH-FORMAL-HELDOUT`。

Stage 2はprotocol freeze時点では`NOT AUTHORIZED`。Stage 1 closure後のseparate authorizationを必要とする。

---

## 9. Fresh seed blocks

### Stage 1

```text
SFCDF = 32311001..32311384
SILGM = 32312001..32312768
GCLD  = 32313001..32313384
```

### Stage 2

```text
SFCDF = 32321001..32321768
SILGM = 32322001..32323536
GCLD  = 32324001..32324768
```

Seed extension = **NOT AUTHORIZED**。

Module間もdevelopment/formal間もseed namespaceを分離する。

---

## 10. Freshness firewall

Stage 2 selectionはStage 1の以下をidentity-only exclusionとして除外する。

- source seed
- complete trajectory SHA-256
- first-16-move opening-prefix SHA-256
- selected RAW-root SHA-256
- GCLD 15 checkpoint RAW-root SHA-256

Stage 1 scientific value、effect direction、p-value、secondary context directionはStage 2 selection inputにしない。

Upstream population identityも可能な範囲でidentity-only exclusionするが、upstream scientific measurement valuesをselectionへloadしない。

---

## 11. SFCDF transfer module

### 11.1 Population

Formal domains:

```text
P1 x RF1
P1 x RF2
P2 x RF1
P2 x RF2
```

Stage 1 target = 10 eligible pairs / cell。  
Stage 2 target = 18 eligible pairs / cell。

Source policyはseed parityで固定し、root-family assignmentはstage-specific SHA-256 parityで固定する。cell内はstage-specific SHA-256 rankで選択する。geometry、C1/C6、game outcomeはselectionへ使わない。

### 11.2 C1

`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`

```text
numerator = sum unitWidthStateCount over depth 0..5
denominator = sum depth-labelled unique RAW-state presence with reply width >0 over depth 0..5
terminal width 0 excluded
```

Upstream direction = `MTAJI-GREATER`。

### 11.3 C6

`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

```text
numerator = total tree node occurrences over depth 0..5
denominator = global distinct RAW states over depth 0..5
```

Upstream direction = `NAMUA-GREATER`。

### 11.4 Formal inference

Per endpoint × policy × root-family = 8 fixed tests。

- pair contrast = exact rational `Mtaji - Namua`
- zeros removed from sign-test denominator and reported
- minimum nonzero = 12/18
- exact two-sided binomial sign test
- Holm across 8 tests at family alpha `1/20`

Significant same upstream direction = `GENERALIZATION-CONFIRMED`。  
Significant opposite direction = `COUNTEREXAMPLE-CONFIRMED`。  
Estimable nonsignificant = `NOT-GENERALIZED`。

---

## 12. SILGM transfer module

### 12.1 Fixed predictor thresholds

G3-07 formal candidate identityに含まれていたthresholdを変更せず継承する。

```text
Namua threshold = 4/1
Mtaji threshold = 3/1
HIGH = rootLegalWidth > threshold
LOW = rootLegalWidth < threshold
EQUAL = excluded from HIGH/LOW association sample
```

G3-12 development dataからthresholdを再学習しない。

### 12.2 Root population

Policy × root-family × phase × width-classをprospectively stratifyする。width classはpredictorだけであり、search endpointはselectionへ使用しない。

Stage 1 target = 8 HIGH + 8 LOW / policy × root-family × phase。  
Stage 2 target = 12 HIGH + 12 LOW / policy × root-family × phase。

Stage 2 total target = 192 roots。

### 12.3 Search contrasts

Frozen peer contrasts:

```text
SC1 DEPTH: D2_Q1 vs D3_Q1
SC2 NODE-BUDGET: B256_Q1_MAXD3 vs B1024_Q1_MAXD3
SC3 QUIESCENCE: D2_Q0 vs D2_Q2
```

No side is truth/reference。

Endpointは3 contrastすべて`RANKING-PREORDER-CHANGE`。

### 12.4 Formal test

Policy × root-family = 4 domains。各domainでNamua/Mtajiをstrataとしてconvolveする。

Per phase:

```text
N = HIGH + LOW = 24
n = HIGH = 12
K = changed total
X = changed in HIGH
X ~ Hypergeometric(N,K,n)
minimum changed = 6
minimum unchanged = 6
```

Namua/Mtaji exact PMFをconvolutionして`T = X_Namua + X_Mtaji`。

Counterexampleを同じ基準で検出するため、G3-12ではprospectively:

```text
p2 = min(1, 2 * min(P[T <= observed], P[T >= observed]))
```

をexact rationalで計算する。

Direction:

```text
2*T > K_total -> HIGHER-IN-HIGH
2*T < K_total -> LOWER-IN-HIGH
2*T = K_total -> ZERO-DIRECTION
```

3 contrasts × 4 domains = 12 fixed tests。Holm family alpha = `1/20`。

Significant `HIGHER-IN-HIGH` = `GENERALIZATION-CONFIRMED`。  
Significant `LOWER-IN-HIGH` = `COUNTEREXAMPLE-CONFIRMED`。  
Otherwise estimable = `NOT-GENERALIZED`。

---

## 13. GCLD transfer module

### 13.1 Experimental unit

1 independent source seed trajectory = 1 inferential unit。

Frozen checkpoints after ply:

```text
16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
```

Trajectoryはply72までnonterminal、source relay-limitなし、15 checkpointすべてCRCLGR depth-5 resource eligibility PASSを必要とする。

Stage 1 measured target = 16 trajectories / policy。  
Stage 2 measured target = 32 trajectories / policy。

### 13.2 Controls

各trajectoryにつき32 endpoint-preserving order-destroyed controls。

- checkpoint 0/14 fixed
- internal 13 checkpointを`SHA-256(stageId|sourceSeed|permutationIndex|checkpointPly)`でsort
- control reference = exact median
- trajectory contrast = actual - control median

### 13.3 Primary endpoints

C1:

```text
net = d(z0,z14)
path = sum d(zt,z[t+1])
C1 = net/path
```

C2:

```text
meanLag1 = mean d(zt,z[t+1])
meanLag4 = mean d(zt,z[t+4])
C2 = meanLag4 - meanLag1
```

C3:

Immediate departureがnonzeroのanchor tについて、later checkpointがimmediate departure distanceよりanchorへ近づけばreturn。`return count / eligible anchor count`。

C5:

```text
C5 = (same-sign adjacent informative axis-step count - opposite-sign count)/(same+opposite)
```

C4は対象外。

### 13.4 Formal inference

Endpoint × policy = 8 fixed tests。

- exact two-sided binomial sign test on trajectory contrasts
- zero contrastはnから除外し報告
- minimum nonzero trajectory count = 20
- Holm across 8 tests at family alpha `1/20`

Upstream directionと同じ有意差 = `GENERALIZATION-CONFIRMED`。  
反対方向の有意差 = `COUNTEREXAMPLE-CONFIRMED`。  
Estimable nonsignificant = `NOT-GENERALIZED`。

---

## 14. Formal decision labels

Endpoint-domain level:

```text
GENERALIZATION-CONFIRMED
COUNTEREXAMPLE-CONFIRMED
NOT-GENERALIZED
NON-ESTIMABLE
TECHNICAL-INVALID
```

`NOT-GENERALIZED`はopposite effectの証明ではない。`COUNTEREXAMPLE-CONFIRMED`はprospectively fixed two-sided testがmultiplicity correction後に有意で、方向がupstream claimと反対の場合だけ用いる。

Study synthesisはmixed resultを許す。single universal positive labelを強制しない。

---

## 15. Resource ceilings

Per depth-5 root:

```text
distinct RAW states <= 100000
unique transitions <= 750000
parent expansions <= 100000
legal move evaluations <= 750000
tree node occurrences <= 1000000000
elapsed <= 180000 ms
peak RSS <= 4 GiB
root artifact <= 64 MiB
```

Stage/module ceilingは`prereg/STUDY_1_SPEC.json`をauthoritativeとする。post-fresh ceiling increaseは禁止。

Resource eligibility不足でintegrity mismatchがない場合はprospectively許された`NON-ESTIMABLE`へ進む。timeoutやresource cutoffをscientific nullへ読み替えない。

---

## 16. Independent verification

Production / independentは別実装で:

- source policy replay
- root selection
- RAW/move identity
- local depth-5 reconstruction
- SFCDF endpoint
- SILGM search endpoint
- CRCLGR coordinates / L1
- GCLD temporal control / endpoints
- exact probability arithmetic
- Holm decisions

を再構築する。

Independent verifierはproduction scientific aggregation helperをimportしてはならない。

Scientific equality:

```text
canonical sorted scientific JSON content -> UTF-8 -> SHA-256
```

Tolerance = 0。

---

## 17. Execution integrity

Fresh scientific Stage versionごとに:

```text
max authorized executions = 1
authorization != arming != computation
durable pre-computation lease required
source/blob binding required
single trigger path
concurrency guard
artifact before mirror
exact-byte recovery only
same-evidence repair rerun = NOT AUTHORIZED
```

Stage 1/2 authorizationは本protocol freezeとは別decisionである。

---

## 18. No-rescue

Fresh evidenceへ最初にaccessした後、次は禁止する。

- seed extension
- root replacement
- favorable subgroup rescue
- threshold relaxation / relearning
- endpoint substitution
- claim replacement
- source-policy replacement
- root-family replacement
- formal-axis変更
- resource ceiling increase
- verification relaxation
- symmetry / canonicalization導入
- G3-10 C4 revival
- technical-invalid upstream diagnostic promotion
- G3-11 depth-10 rerun
- depth 11 access
- G2-12 estimator input

---

## 19. Interpretation boundary

G3-12が確立できるのは、prospectively frozen matrix内の**bounded local geometry claim boundary**だけである。

次は導かない。

- game-theoretic optimality / forced win
- human difficulty / perception
- public Bao AI strength
- win rate
- strategic regime
- whole-Bao state-space size
- whole-Bao game-tree size
- causal mechanism
- universal Bao law

Human Track `G3-H01`はnon-blockingであり、本Studyのmachine resultをhuman evidenceへ読み替えない。

---

## 20. Repository boundary

Study completion時もresearch branch上で:

1. scientific closure
2. result materialization
3. independent verification
4. final report
5. decision register
6. reproducibility index
7. current-facing documentation sync
8. root README consistency
9. final consistency audit

まで完了させる。

`main` integrationはexplicit user instructionなしに行わない。
