# G4-04 / GTTD-STUDY1 — Study Protocol

更新日: 2026-09-25  
Program: `Research Generation 4 / G4-04`  
Study ID: `GTTD-STUDY1`  
Research branch: `research/g4-04-geometry-trajectory-transfer`

## 1. 問い

G3-10 `GCLD-STUDY1`でformal confirmationされたC1・C2・C3・C5のchronology-dependent trajectory structureが、G4-01でGCLD compatibilityを確認済みのfresh source policy P1/P2へ移送できるかをprospectiveに検証する。

```text
C1 directionality / path efficiency = ACTUAL-GREATER
C2 persistence / lag-distance gradient = ACTUAL-GREATER
C3 return fraction = ACTUAL-LESS
C5 first-order directional path dependence = ACTUAL-GREATER
```

C4 circulationはG3-10で`NOT-CONFIRMED`のためpositive transfer targetに含めない。

## 2. representation

```text
CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
axes = CRCLGR-A1..A6
coordinate arithmetic = exact reduced rational
distance = equal-weight exact L1
validated transform set = []
```

representationの変更は本Study内で認めない。

## 3. longitudinal contract

inferential unitは独立seedによるsource trajectory 1本。

checkpoint:

`16,20,24,28,32,36,40,44,48,52,56,60,64,68,72`

各trajectoryはG3-10と同じ32個のendpoint-preserving order-destroyed controlと比較する。checkpoint 0/14を固定し、内部13 checkpointを`SHA-256(stageId|sourceSeed|permutationIndex|checkpointPly)`で並べ替える。control referenceは32値のexact median、trajectory contrastはactual minus control medianとする。

## 4. fresh source policy

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

policyはfixed seed slot parityでoutcome-blindに割り当てる。

RF1/RF2は本Study 1ではtechnical/support descriptorに限定し、formal scientific domainにはしない。root-family別formal transferは本Studyの結果からpost-hocに作らない。

## 5. Stage 0

`GTTD-S0-TECHNICAL-2026-09-25-v1`

run `36082558032` / attempt 1で`STAGE0-PASS`。

- P1/P2ともcomplete technical trajectory 2件
- 2/2ずつ全15 checkpoint depth-5 preflight eligible
- C1/C2/C3/C5 production/independent exact
- RF1/RF2 classification exact
- scientific endpoint values retained = false
- formal inference = false
- Stage 1/2 fresh access = false

Stage 0はStage 1を自動認可しない。

## 6. Stage 1 development

`GTTD-S1-DEVELOPMENT-2026-09-25-v1`

seed block:

`40413001..40413512` / 512 slots / 256 each policy

candidate target = 16 complete firewall-clean trajectories per policy。

全candidate manifestをgeometry measurement前にfreezeし、15 checkpointのproduction/independent preflightを完了する。各policyで>=12 fully eligibleを要求し、frozen orderのfirst 8 eligibleをdevelopment measurementする。

Stage 1で許されるのはsupport、definedness、exactness、resource readiness、identity-only outputsだけである。endpoint値・contrast sign・effect direction・p-valueは保存しない。

## 7. Stage 2 formal holdout

`GTTD-S2-FORMAL-2026-09-25-v1`

seed block:

`40423001..40424024` / 1024 slots / 512 each policy

candidate target = 48 per policy、minimum fully eligible = 40 per policy、formal measured population = first 32 eligible per policy。

formal family = `2 policies × 4 endpoints = 8 tests`。

各testはtrajectory contrastのexact two-sided binomial sign test。nonzero minimum=20。8 test全体へexact Holm-Bonferroni、family alpha=`1/20`。

```text
significant + upstream same direction -> GENERALIZATION-CONFIRMED
significant + upstream opposite direction -> COUNTEREXAMPLE-CONFIRMED
estimable but nonsignificant -> NOT-GENERALIZED
support insufficient without technical error -> NON-ESTIMABLE
mandatory integrity/implementation failure -> TECHNICAL-INVALID
```

Stage 2はStage 1完了後の別authorizationが必要。

## 8. identity firewall

正本: `prereg/UPSTREAM_IDENTITY_FIREWALL.json`

- G3-10 Stage 1/2はseed、trajectory、opening-prefix、checkpoint-rootを監査・除外
- G4-01 Stage 1R GCLDはseed、trajectory、checkpoint-rootを監査・除外
- G4-01 Stage 1R opening-prefixはcanonical source bundleに存在しないため非重複を主張しない
- G4-01 interrupted / reserve namespaceはseed range全体を除外
- historical seed replayによる欠損identity救済は行わない

Stage 2はさらにStage 1のseed、trajectory、opening-prefix、全checkpoint-rootを除外する。

## 9. no-rescue

最初のStage 1 fresh seed read後、同Study/version内で次を行わない。

- seed extension
- policy replacement
- trajectory replacement after manifest
- checkpoint / representation / endpoint変更
- resource ceiling relaxation
- estimability threshold relaxation
- multiplicity変更
- favorable root-family subgroup rescue
- same-evidence repair rerun

## 10. 解釈境界

本Studyはtrajectory geometryの移送可能性のみを検証する。best move correctness、game-theoretic value、AI棋力、人間のdifficulty、causal mechanism、whole-Bao universal lawを検証しない。public AI変更を認可しない。
