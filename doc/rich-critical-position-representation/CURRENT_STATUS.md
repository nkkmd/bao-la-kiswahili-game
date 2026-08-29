# RCPR-STUDY1 — 現在の状態

更新日: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## 状態

**STUDY CLOSED AT STAGE 1 / MAIN INTEGRATION COMPLETE / STAGE 0 TECHNICAL PASS / STAGE 1 TECHNICAL INVALID / FRESH STAGE 1 BLOCK CONSUMED / NO SAME-BLOCK RERUN / STAGE 2 NOT-AUTHORIZED-NOT-EXECUTED**

```text
RCPR-S0-TECHNICAL-2026-08-28-v1 = COMPLETE / STAGE0-TECHNICAL-PASS
RCPR-S1-DEVELOPMENT-2026-08-28-v1 = COMPLETE / STAGE1-TECHNICAL-INVALID / SEED-BLOCK-CONSUMED
RCPR-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

## repository / execution anchor

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082 / completed / failure
production job = 98936414477 / success
independent verification job = 99007180273 / failure
final research head = 374d25d2f09ba661aaa8ae8e2e0a06eb03536786
integration PR = #73 / merged
merge method = merge
main integration commit = 28f888f9819605d2b19707067afc48f2a6d3ed27
integrated branch = main
```

scientific execution中、original baseline `main`は変更されませんでした。PR #73はfinal documentation / source-scope audit、5件すべてのPR CI PASS、mergeable確認、unresolved review thread 0を確認した後にのみmergeしました。

Canonical final PR CI:

```text
Second-generation research agenda audit = success / run 33235980651
DRSSE Study 1 Closure CI = success / run 33235980612
PCEM closure consistency audit = success / run 33235980641
SSGTC closure consistency audit = success / run 33235980551
Phase Transition Research CI = success / run 33235980568
```

main-integration provenanceは`checkpoints/2026-08-29-main-integration.md`に保存しています。

## Stage 1 consume-once state

```text
source games = 3072
seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
consumption = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
```

archived `execution-start.json`には`scientificStage1SeedBlockConsumed = true`が記録されています。

このblockを`RCPR-STUDY1`内で再実行・修復することはできません。

## terminal artifact / hash

```text
production artifact = 9704250489
production artifact ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
production result SHA256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
production development core SHA256 = 245c7e04421b1ef534edcb23d3048df1e2f1d556f9223f1eee84f054973f66b8

verification artifact = 9708956844
verification artifact ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
verification SHA256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
independent development core SHA256 = 5b2251ef1ac34295cd1d67412c9d7f09adbe55b5af81a8752d3cb639b036e22a
```

## production-only development output

Productionは正常完了し、すべてのfrozen production readiness gateがPASSしました。

```text
generated games = 3072
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
Namua AUROC = 0.7356189599631845
Mtaji AUROC = 0.6657646992502396
balanced accuracy = 0.6684641309581127
```

これらは**production-only unverified development output**としてprovenanceのためだけに保持します。accepted Stage 1 scientific resultではなく、Stage 2を承認せず、confirmatory evidenceでもありません。

## independent verification failure

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
developmentCoreMatch = false
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
```

600 selected rows中exactに4 rowsでfeature-vector hash equalityがFAILしました。

全rowは存在し、RAW state identity、continuation measurement、`D_range`、high-divergence labelは一致しました。

## technical postmortem

root causeは`MOVE_SET_ENTROPY.indexEntropy`におけるdeterministic floating-point accumulation-order discrepancyです。

- productionはentropy term加算時に`Map` insertion orderを使用
- independent implementationはobject enumerationを使用し、integer-like move-index keyがnumeric orderへ並び替えられる
- 4 Mtaji rowsで約`2.22e-16`〜`4.44e-16`のIEEE-754差が生じる
- その結果exact hash equalityがFAILする

この原因特定によってfrozen decisionは変わりません。Stage 1は引き続き**`STAGE1-TECHNICAL-INVALID`**です。

Machine-readable closure / postmortem:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

Program-level closure record:

- `doc/research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`

## scientific boundary

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Research Generation 1およびG2-01..G2-05のformal decisionはすべてimmutableです。Historical Critical Positions evidenceはG2-06のtraining、tuning、threshold selection、validation、formal evidenceから引き続き除外します。

## post-closure workflow state

PR #73前に、すべてのRCPR technical / development / materialization workflowをclosed-study archival stubへ変換しました。

manual invocationが可能な場合もprovenance noticeを表示するだけで、scientific codeやmaterialization codeは実行しません。

- `checkpoints/2026-08-29-post-closure-workflow-archive.md`

## Program continuation

`RCPR-STUDY1`にはこれ以上のscientific stage transitionはありません。Stage 1を再実行・修復せず、Stage 2を承認しません。

active Research Generation 2 program sequencing rule上、次の独立agenda itemは次です。

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
priority = P1
```

G2-07はintegrated `main`からfresh repository-state auditを行い、独自のprospective Study ID、Stage ID、scientific contract、source freeze、seed allocation、explicit authorizationを必要とします。

`RCPR-STUDY1` rowをformal evidenceとして使用してはいけません。

将来、deterministic entropy / numeric-hash hardening後にrich critical-position representationを独立研究として再検討することは可能ですが、このclosed Studyをgenericな「Study 2」retryとして再開せず、distinct independent title / identityを必要とします。
