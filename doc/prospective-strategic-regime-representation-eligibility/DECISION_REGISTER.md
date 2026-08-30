# PSRRE-STUDY1 — 判断登録簿

更新日: 2026-08-30

## D-001 — Study identity

**状態:** FIXED / CLOSED

`PSRRE-STUDY1`はG2-10とG2-11の間に置くdependency-resolution prerequisite Studyであり、新しい`G2-xx` labelを追加しない。

```text
Stage 0 = PSRRE-S0-TECHNICAL-2026-08-30-v1
Stage 1 = PSRRE-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = PSRRE-S2-FORMAL-2026-08-30-v1
```

## D-002 — G2-10 closure / no rescue

**状態:** FIXED

G2-10のStage 1=`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`、`selectedRepresentation=null`、Study/Stage 2=`NOT-AUTHORIZED-NOT-EXECUTED`を変更しない。threshold、K、40-feature dictionary、consumed/reserved seedも変更・流用しない。

## D-003 — RAW identity

**状態:** FIXED

```text
included = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## D-004 — representation family shortlist

**状態:** FIXED

```text
RF-A-ROBUST-PCA-WARD
RF-B-ROBUST-PCA-PAM
RF-C-DIRECT-ROBUST-PAM
```

3 familyはいずれもStage 0 technical exact PASSした。Stage 0 technical PASSはscientific優劣を意味しない。

## D-005 — Stage 1 prospective scientific contract

**状態:** FIXED BEFORE SCIENTIFIC SEED USE

28-feature dictionary、median/MAD、PCA/Ward/PAM semantics、`K=2..8`、candidate eligibility、winner rule、readiness gate、Stage 2 held-out contract、resource ceiling、consume-once ruleをscientific run前に固定した。

重要なreadiness floor:

```text
minimum nonzero-MAD features = 20
minimum active feature families = 5
```

## D-006 — development / held-out firewall

**状態:** FIXED

Stage 1とStage 2はseed、trajectory、opening-prefix、selected RAW stateで分離する。Stage 1 populationをStage 2 evidenceへ再利用しない。

## D-007 — G2-11 outcome firewall

**状態:** FIXED / PRESERVED

transition matrix、long-horizon persistence、recurrence、bottleneck/transient structure、trajectory prevalence、transition asymmetry、survival/hazard、time-to-first-Mtaji、acceleration/delayをrepresentation selectionに使わない。

## D-008 — Stage 0 disposition

**状態:** FIXED

```text
Stage 0 = STAGE0-TECHNICAL-PASS
mandatory gate failures = 0
missing mandatory gates = 0
```

## D-009 — Stage 1 tooling smoke

**状態:** FIXED / PASS

64 technical gamesのみを用い、production/independentのsource generation、root selection、28 features、median/MAD、PCA8、Ward、PAM、assignment、serializationをexact確認した。scientific seeds used=`[]`。

## D-010 — packaging preflight invalid attempts

**状態:** HISTORICAL TECHNICAL INVALID ATTEMPTS RETAINED

run `33307852222`および`33307879877`はartifact-size projection implementationの過大推定によりFAILした。scientific seedは使用していない。contract、threshold、feature、K、resource ceilingを変更せずprojection estimatorのみ修正した。

## D-011 — packaging preflight PASS

**状態:** FIXED / PASS

修正後preflightは全check PASS。最終source boundaryは`41124069f89f0706cf943e18688c96a8c2db35d7`。

## D-012 — Stage 1 scientific authorization

**状態:** FIXED / EXECUTED

```text
source freeze = 41124069f89f0706cf943e18688c96a8c2db35d7
authorization = 085c5df24baff44bb644c00eda91d6212caf5708
seed block = 29510001..29514096
consume once = true
same-block rerun = false
```

## D-013 — Stage 1 technical validity

**状態:** FIXED

Production / independentはsource、selection、features、scaler、candidate evaluation、frozen-representation decisionでfull exact。resource ceilingもPASSした。

## D-014 — Stage 1 readiness decision

**状態:** FIXED

```text
observed nonzero-MAD features = 15
required minimum = 20
active feature families = 5 / required 5
```

このためprospectively fixed decision mappingにより:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

とする。

## D-015 — Stage 2 authorization

**状態:** NOT-AUTHORIZED-NOT-EXECUTED

Stage 2 entry conditionは`STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`である。Stage 1がnon-estimableでrepresentationをfreezeしなかったためStage 2は実行しない。seeds `29610001..29618192`は`RESERVED_UNCONSUMED`。

## D-016 — Study formal decision

**状態:** FINAL

```text
PSRRE-STUDY1 = NON-ESTIMABLE
validated strategic representation = false
frozen representation artifact = none
G2-11 candidate input authorized = false
G2-11 scientific authorization = false
```

## D-017 — no-rescue closure

**状態:** FINAL

同Study内でthreshold relaxation、feature replacement、family/K expansion、favorable subgroup、same seed rerun/replacement/extension、candidate near-miss promotionを行わない。将来の再検討は新しいprospective Studyとfresh seed blockを必要とする。
