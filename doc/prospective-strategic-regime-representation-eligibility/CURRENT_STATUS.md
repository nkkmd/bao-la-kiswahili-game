# PSRRE-STUDY1 — 現在の状態

更新日: 2026-08-30

## 1. 正式状態

```text
Study ID = PSRRE-STUDY1
Formal title = Prospective Strategic-Regime Representation Eligibility Study 1
Baseline remote main = 3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
Research branch = research/pre-g2-11-strategic-regime-representation-eligibility
Agenda label = none
```

remote `main` HEADはStudy開始時reference SHAと完全一致した。

## 2. Stage状態

```text
PSRRE-S0-TECHNICAL-2026-08-30-v1 = CONTRACT-FROZEN / NOT-EXECUTED
PSRRE-S1-DEVELOPMENT-2026-08-30-v1 = NOT-AUTHORIZED-NOT-EXECUTED
PSRRE-S2-FORMAL-2026-08-30-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 0はtechnical-onlyであり、scientific inferenceを生成しない。Stage 0 technical execution自体も、Study-start commit時点ではまだauthorizeしない。

## 3. seed状態

```text
29500001..29500064 = Stage 0 technical-only reservation
29510001..29514096 = Stage 1 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
29610001..29618192 = Stage 2 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
```

G2-10 Stage 1 seeds `29310001..29314096`はCONSUMEDであり再利用しない。G2-10 Stage 2 seeds `29410001..29418192`はRESERVED_UNCONSUMEDだが、本Studyでは使用しない。

## 4. G2-10 closure binding

次をimmutable historical resultとして保持する。

```text
UMSSR-STUDY1 Stage 0 = STAGE0-TECHNICAL-PASS
UMSSR-STUDY1 Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
formal decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 candidate input authorized = false
```

本StudyはG2-10の救済ではない。

## 5. upstream eligibilityの重要点

- G2-01: calibration mappingはvalidated axisとして使用しない
- G2-02: formal search-reliability classifierとして使わない。raw observable conceptだけfresh candidate化可能
- G2-03: validated transform set=`[]`; canonicalization / symmetry reductionは禁止
- G2-04: fresh exact oracleなし。technical referenceのみ
- G2-05: depth 0..9 bounded exact domainだけ限定利用可能
- G2-06: rich classifier / modelは`INELIGIBLE`
- G2-07: `F05_ALL`, `lambda=100`, modelは`INELIGIBLE`
- G2-08: taxonomy / promoted leavesは`INELIGIBLE`
- G2-09: generalization / counterexample boundaryは`INELIGIBLE`
- G2-10: 40-feature / deterministic K-means contractは本Studyのfrozen representationとして再利用しない

## 6. RAW identity / transform authorization

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded metadata = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## 7. 次に許可される工程

1. Study-start commitのsource/hash audit
2. Stage 0 runner / production implementation / independent verifierのmaterialization
3. Stage 0 technical-only authorization artifactの作成
4. Stage 0 technical execution
5. Stage 0 PASSの場合のみ、Stage 1 prefreezeを別commitで作成
6. Stage 1 observable dictionary、family hyperparameter space、selection rule、eligibility threshold、resource ceilingを固定
7. その後にのみStage 1 scientific authorizationを検討

## 8. 現在禁止されている工程

- Stage 1 / Stage 2 scientific seed消費
- fresh scientific population generation
- scientific support / silhouette / stability inspection
- representation familyのscientific fitによる選別
- G2-11 outcome inspection
- G2-11 authorization
- mainへのmerge
