# Symmetry / Isomorphic Positions Study 1 — Final Report

Updated: 2026-08-24  
Study ID: `SIP-STUDY1`  
Formal stage: `SIP-S1-FORMAL-2026-08-24-v1`  
Status: **COMPLETED**

## 1. Final decision

本Studyのformal resultは、5つのpreregistered scientific outcomeすべてについて

> **`NON-ESTIMABLE`**

である。

```text
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED                  = 0
NON-ESTIMABLE                  = 5
```

これはcandidate transformationにexact transition mismatchが確認されたためではない。fresh historically reachable bounded-local graphsでは、productionとindependent verifierの双方で全scientific candidateがzero mismatchだった。

formal validationを止めたのは、prospectively mandatoryとしたRestricted Endgame 8-state exact-oracle anchorのstate-row identity integrityと、それに起因するproduction / independent equality gate `G12` のfailureである。

## 2. Prospective framework

candidate transformationはformal outcome生成前に、

```text
T      : state -> state
π      : player -> player
Φ_s    : legalMove(s) -> legalMove(T(s))
```

としてfreezeした。

Formal gates:

```text
G1  transform totality
G2  transformed-state validity / applicability
G3  inverse / bijection
G4  exact legal-move-set bijection
G5  exact transition commutation
G6  terminal equivalence
G7  winner equivariance
G8  transformed witness replay / predeclared N/A
G9  exact-oracle graph/value/SCC preservation
G10 exact-oracle DTF preservation
G11 exact-oracle optimal-move-set preservation
G12 production / independent equality
```

0.998等の近似率はvalidationに使用せず、applicable exact gateは0 mismatchを必要条件とした。

## 3. Candidate definitions

### T01 — `SIP-T01-SEAT-SWAP-LOCAL`

player-indexed state componentsをswapする。

```text
pits[0] <-> pits[1]
reserve[0] <-> reserve[1]
houseOwned[0] <-> houseOwned[1]
pending[0] <-> pending[1]
player 0 <-> 1
winner 0 <-> 1
```

engine coordinateがplayer-localであるため、row、pit index、side、directionは保持する。

### T02 — `SIP-T02-LR-MTAJI-HOUSELESS`

prospectively `phase=mtaji`, `reserve=[0,0]`, `houseOwned=[false,false]` に限定し、

```text
pit index i -> 7-i
direction left <-> right
side left <-> right
```

を適用する。

### T03 — `SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

T01とT02のcompositionとしてfreezeした。

全Baoのplain LR reflectionは`HOUSE=4`をindex 3へ写すため、outcomeを見る前にscientific candidateから除外した。

## 4. Frozen formal population

Stage 0ではsymmetry success/failureを一切計算せず、graph size・runtime・guard hit・phase coverageだけを使ってformal populationを決めた。

```text
formal seed block      = 22910001..22910064
maximum trajectory ply = 120
roots per stratum      = 8
local expansion depth  = 3
```

strata:

```text
namua
mtaji
mtaji-houseless
```

Stage 1 domain materializationはcandidate transformを呼ばず、initial stateからのdeterministic witnessをreplayし、shortage 0 / replay failure 0 / trajectory runtime guard hit 0でfreezeされた。

## 5. Fresh bounded-local results

### 5.1 T01 / Namua

```text
roots         = 8
states        = 697
edges         = 707
tested states = 167
mismatches    = 0
G1-G8         = PASS
```

transformed historical witness replayも8/8 PASS。

### 5.2 T01 / Mtaji

```text
roots         = 8
states        = 530
edges         = 527
tested states = 162
mismatches    = 0
G1-G8         = PASS
```

### 5.3 T01 / Namua + Mtaji pooled scope

```text
roots         = 16
states        = 1227
edges         = 1234
tested states = 329
mismatches    = 0
G1-G8         = PASS
```

### 5.4 T02 / Mtaji-houseless

```text
roots         = 8
states        = 532
edges         = 529
tested states = 160
mismatches    = 0
G1-G7         = PASS
G8            = N/A prospectively
```

T02はstandard-initial Namua witness全体にapplicableでないため、G8は結果後除外ではなくpreregistered N/Aである。

### 5.5 T03 / Mtaji-houseless

```text
roots         = 8
states        = 532
edges         = 529
tested states = 160
mismatches    = 0
G1-G7         = PASS
G8            = N/A prospectively
```

### 5.6 Controls

IDENTITY positive controlはfresh Namua+Mtaji bounded graphsで0 mismatch。

意図的にdirection flipを欠いた`SIP-C01-LR-NO-DIRECTION-FLIP`はindependent fresh validationで638 mismatchesを生成し、negative controlとして期待通りFAILした。

これによりfresh-domain transformation/move/transition machineryは、少なくともpositive/negative controlを識別できている。

## 6. Exact-oracle anchor failure

Stage 1はRestricted Endgame Study 1の8-state raw oracleをread-only anchorとして必須化していた。

しかし、IDENTITY transformさえoracle anchor上でformal PASSしなかった。

Production oracle integration:

```text
IDENTITY mismatch count = 19
```

Independent oracle integration:

```text
IDENTITY mismatch count = 10
```

両者ともoracle anchorをPASSさせられず、さらにmismatch accountingがexact equalityを満たさなかったためG12はFAILした。

この時点でcandidateを変更したりoracle gateを除外したりすればpost-outcome rescueになるため、行っていない。

## 7. Read-only oracle integrity diagnostic

formal outcome確定後、原因切り分けだけを目的にread-only diagnosticを実施した。これはformal decisionを変更しない。

8 `stateRows`について、保存`ruleState`を現在のproduction direct serializerとindependent serializerの双方で再hashした。

結果:

```text
rows                                  = 8
stored stateKey mismatch rows         = 3
production/independent key disagreement = 0
observed seed totals                  = {63, 64}
recomputed legal transitions          = 7
successor escapes stored key set      = 0
```

stored stateKeyと保存ruleStateの再hashが一致しなかったterminal rows:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

これら3 rowsの保存ruleState seed totalは63だった。

一方、nonterminal statesからguard-free transitionを再計算した7 successorsはすべてstored state-key set内に入った。このため、少なくとも今回の利用形態では、stored terminal `stateKey` とその横に保存されたterminal `ruleState`のbindingに不整合があると判断した。

重要: この診断はRestricted Endgame Study 1のformal decision、8 raw statesというfrozen count、solution hash、WIN/LOSS/DTF resultを変更しない。本Studyのread-only anchor利用可能性に関する新しいlimitationとしてのみ扱う。

## 8. Independent verification and formal decision

Independent verifierは、

- fresh domain regeneration
- independent candidate state transform
- independent move transform
- independent raw serialization
- independent graph traversal
- independent Restricted Endgame move generator / guard-free transition
- independent retrograde implementation

を使用した。

Fresh validationではproductionと同じ0 mismatchを再現したが、oracle mismatch countがproductionと一致しなかった。

そのため全scientific outcomesで:

```text
G12 = FAIL
finalDecision = NON-ESTIMABLE
```

となった。

`NOT-VALIDATED`にしない理由は、candidate semantic mismatchそのものがfresh formal domainで観測されたのではなく、必須anchor/integrationをdeterministically完了・一致できなかったためである。

## 9. Canonicalization and group structure

formalにvalidatedされたscientific transformは0件である。

したがってStudy 1では、

```text
canonicalization contract  = NOT AUTHORIZED
raw -> canonical reduction = NOT AUTHORIZED
symmetry group claim       = NOT AUTHORIZED
composition table          = NOT RUN AS SCIENTIFIC RESULT
```

とした。

fresh zero-mismatch candidatesを使って事後的にcanonical keyを作ることは、preregistered G9-G12を回避するrescueになるため禁止した。

## 10. Reachability interpretation

T01のtransformed witnessは、`T(initialState)`を始点としてfresh rootsへ合法replayできた。これはtransformed-initial reachability evidenceである。

しかしrepositoryの固定raw initial stateそのものをT01が保存するわけではないため、

```text
rule-semantic transformation
historical reachability from transformed initial
historical reachability from fixed raw initial
```

を同一視しない。

T02/T03はstandard-initial witness全体にapplicableでないため、full witness preservation claimは行わない。

## 11. Implication for State Space / Game Tree Complexity Study

次Studyは本Studyのcandidateをsymmetry reductionに使用してはならない。

現時点で許可されるのは:

```text
raw state identity counting
no symmetry reduction
```

である。

State Space Studyでvalidated symmetry-reduced countも扱いたい場合は、Restricted Endgame Study 1をretrofitせず、oracle-anchor integrityとsymmetry confirmationを新しいprospective independent Studyとして先に解決する必要がある。

## 12. Reproducibility identities

```text
specSha256
ede4968d7702ffded73233cf05cbe10c94c4d3a1cb04ef850f85c727b56d2b0a

authorizationSha256
a539de44b26e513ab461a559e97ee4e7914900178a469389a5c996def3d7f5a4

domainSha256
fa40e1b7d2fc5e34291ec9537e8a5f19b280be8203d62ca8687090dc96ff9e22

productionResultSha256
fd1c509b40a3ea40675e738826db8cb4030378ed8955f122594a6f5e4756574a

independentVerificationSha256
8e7327b4192e2616716d34deae86b15a51f269201f591a843310d414541596f0

archival workflow run
32728925376

read-only diagnostic workflow run
32728619101
```

## 13. Final interpretation boundary

このStudyから言えること:

> Prospectiveにfreezeした3種類のcandidate transformationは、fresh historically reachable bounded-local graphsではproduction/independent双方でexact zero mismatchだった。しかしmandatoryなimmutable 8-state oracle anchorにstate-row identity integrity limitationが見つかり、production/independent G12 equalityを満たせなかったため、Study 1の5 formal outcomesはすべてNON-ESTIMABLEである。

このStudyから言えないこと:

- Bao全体でT01/T02/T03が対称性である
- all Namua / all Mtajiで成立する
- candidateが正式にvalidatedされた
- Bao symmetry groupが確立した
- symmetry-reduced state countが得られた
- Restricted Endgame Study 1が無効になった
- upstream 8-state exact decisionを変更すべきである

以上をもって`SIP-STUDY1`をcloseする。
