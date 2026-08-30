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

本Studyは`G2-10`と`G2-11`の間に置かれたdependency-resolution prerequisite Studyであり、新しい`G2-xx` agenda labelではない。

## 2. Stage状態

```text
PSRRE-S0-TECHNICAL-2026-08-30-v1 = STAGE0-TECHNICAL-PASS
PSRRE-S1-DEVELOPMENT-2026-08-30-v1 = NOT-AUTHORIZED-NOT-EXECUTED
PSRRE-S2-FORMAL-2026-08-30-v1 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 = NOT-AUTHORIZED
```

Stage 0 workflow runは`33304155488`、jobは`99237601518`、artifactは`9729904359`である。18 mandatory gateはfailure 0 / missing 0で、3 representation familyはいずれもtechnical qualificationをPASSした。

これはscientific representation validationではない。Stage 0ではsupport、silhouette、assignment stability、long-horizon outcomeを用いたfamily選択を行っていない。

## 3. seed状態

```text
29500001..29500064 = Stage 0 technical-only reservation / scientific evidenceには未使用
29510001..29514096 = Stage 1 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
29610001..29618192 = Stage 2 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
```

G2-10 Stage 1 seeds `29310001..29314096`はCONSUMEDであり再利用しない。G2-10 Stage 2 seeds `29410001..29418192`も本Studyでは使用しない。

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

本StudyはG2-10 threshold、40-feature dictionary、deterministic K-means `K=2..6`、seed状態を変更しない。

## 5. RAW identity / transform authorization

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded metadata = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## 6. Stage 0 technical qualification

```text
RF-A-ROBUST-PCA-WARD = technical exact PASS
RF-B-ROBUST-PCA-PAM = technical exact PASS
RF-C-DIRECT-ROBUST-PAM = technical exact PASS
scientific performance inspected = false
scientific outcome generated = false
```

production / independentはRAW identity、technical observables、bounded search raw diagnostic、C03 original-scope technical reconstruction、robust scaling、PCA、Ward、PAM、assignment、serializationでpreregistered exact gateを満たした。

## 7. 次に許可される工程

Stage 1 scientific seedを使用する前に、次を新しいprospective prefreezeとして固定する。

1. fresh Stage 1 feature dictionaryとexact formula
2. zero-variance / missing / undefined handling
3. representation-family hyperparameter space
4. deterministic scaling / PCA / Ward / PAM semantics
5. model-selection hierarchy
6. support / separation / stability等のnumeric eligibility threshold
7. source-policy / phase coverageとroot-selection contract
8. Stage 1 → Stage 2 promotion rule
9. Stage 2 held-out primary eligibility contract
10. production / independent source binding、resource ceiling、consume-once rule

これらを固定し、tooling smokeがPASSするまではStage 1 scientific authorizationを作成しない。

## 8. 現在禁止されている工程

- Stage 1 / Stage 2 scientific seed消費
- fresh scientific outcome generation
- unfrozen feature / hyperparameterによる探索
- G2-10 same-Study rescue
- G2-11 outcome inspection
- G2-11 authorization
- mainへのmerge
