# G2-06 第1研究 最終報告 — 重要局面の豊かな構造表現

更新日: 2026-08-29

## 1. 研究識別子

```text
Program label = G2-06
Study ID = RCPR-STUDY1
Research Generation = Research Generation 2
Formal title = Rich Critical-Position Representation Study 1
Baseline main = 37480777246aa306c6ca3d0679d936b5e0107071
Research branch = research/g2-06-rich-critical-position-representation
Scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

日本語題目:

**Baoにおける重要局面の豊かな構造表現の構築と事前規定による検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別**

## 2. 最終判断

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement / extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

本StudyはStage 1で終了しました。理由は、結果を見る前に必須と固定したindependent verifierが、600個すべてのpre-root feature vectorをexact equalityで再現できなかったためです。

このtechnical failureはrich representation hypothesisのscientific rejectionではありません。また、production-only readiness resultをaccepted scientific resultへ昇格していません。

## 3. 研究上の問い

root時点またはそれ以前に利用可能な情報だけから固定した、より豊かなrepresentationによって、machine-defined fixed-policy continuation-divergence constructをfresh populationでも再現可能に識別できるかを問いました。

動機は完了済みResearch Generation 1 Critical Positions / Outcome Branching Study 1にあります。同Studyでは600 selected roots中139 high-divergence rootsを観測しましたが、frozen simple structural grammarからpromoted candidateは0でした。

G2-06はそのStudyを再開せず、near missをpromoteせず、thresholdを緩和せず、測定済みroot / outcomeをdevelopmentまたはformal evidenceとして再利用していません。

## 4. scientific identityとno-rescue boundary

Authoritative state identityはRAW-onlyを維持しました。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外しました。validated transform setは空のままです。

```text
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Research Generation 1およびG2-01..G2-05の判断はすべてimmutableです。

Historical Critical Positionsのsource seed、selected root、high-divergence root、candidate audit、reserved Stage 2 evidenceはG2-06 scientific development / formal evidenceから除外しました。

## 5. representation contract （表現）

結果を見る前に次の8 feature familyを宣言しました。

```text
LOCAL_PIT_TOPOLOGY
CAPTURE_GRAPH
LEGAL_MOVE_GEOMETRY
REPLY_GRAPH
RESERVE_HOUSE_RELATION
MOVE_SET_ENTROPY
SEARCH_GAP_VECTOR
LOCAL_TEMPORAL_CONTEXT
```

predictorとして利用できるのはroot時点またはそれ以前に利用可能な情報だけです。

continuation outcome、future winner、`D_range`、post-root rollout state、その他のfuture-outcome-derived quantityをpredictor representationへ使用することは禁止しました。

Stage 0で310-scalar feature schemaを固定しました。

```text
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
```

## 6. Stage 0 — technical representation validation （表現）

Stage 0はtechnical-onlyでscientific outcomeを生成していません。

Canonical execution:

```text
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
job = 98876051308
artifact = 9688987798
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

6 technical fixturesでNamuaとMtajiをcoveredしました。Productionとstructurally independent implementationはfull representationとRAW identityでexactに一致し、mandatory positive / negative controlもPASSしました。

Decision:

```text
STAGE0-TECHNICAL-PASS
```

## 7. Stage 1 — prospective development freeze （固定した条件）

Stage 1 scientific outcome生成前に次を固定しました。

```text
source games = 3072
fresh seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
selected-root target = 600
Namua quota = 300
Mtaji quota = 300
representation width = 310 scalar features
replicates per exact root move = 64
maximum post-root continuation plies = 200
primary divergence endpoint = D_range
high-divergence boundary = D_range >= 0.30
model development = deterministic diagonal LDA
cross-validation = 5-fold by historicalTrajectoryHash
Stage 1 rows reusable as Stage 2 formal evidence = false
```

source populationでは6つのprospectively fixed generation stratumを使用しました。root selectionはoutcome-blindで、RAW duplicate handlingも固定し、quota不足時のphase replacement / reassignmentは禁止しました。

Stage 1 scientific design SHA256:

```text
STAGE_1_DEVELOPMENT_SPEC.json = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
STAGE_1_EXECUTION_ADDENDUM.json = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
```

## 8. implementation / resource / source-freeze validation （固定した条件）

scientific authorization前のnon-scientific validationで、frozen pipelineが実行可能であることと、exact scientific source setがbindingされていることを確認しました。

```text
implementation smoke run = 33195723195 / success
implementation smoke artifact = 9695647002
resource preflight run = 33195349152 / success
resource preflight artifact = 9695494212
source-freeze audit run = 33196797865 / success
source-freeze audit artifact = 9696075216
source-freeze audit envelope SHA256 = 03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d
```

scientific sourceは次で固定しました。

```text
a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

source-freeze auditはexplicit authorization前にscientific runで必要となるexact Git blobを確認しました。

## 9. explicit Stage 1 authorizationとconsumption

Explicit authorization:

```text
authorization ID = RCPR-S1-EXECUTE-2026-08-29-v1
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
```

authorizationは次を維持しました。

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
stage2Authorized = false
```

fixed spec、execution addendum、exact source-blob map、fresh seed block、fail-closed consume-once failure semanticsへbindingしました。

scientific Stage 1 executionがexecution-start boundaryを越えた時点で、seed blockは`RCPR-STUDY1`に対して永久にconsumedとなりました。

## 10. Stage 1 execution （実行記録）

Canonical workflow:

```text
workflow run = 33196954082 / completed / failure
production job = 98936414477 / success
independent verification job = 99007180273 / failure
failed step = Independent full-corpus replay and recomputation
```

### Production-only development output （日本語の要点）

Productionはfrozen development pipelineを完了し、次を報告しました。

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

frozen production readiness checkはすべてtrueでした。

Production artifact provenance:

```text
artifact = 9704250489
artifact ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
production result SHA256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
production development core SHA256 = 245c7e04421b1ef534edcb23d3048df1e2f1d556f9223f1eee84f054973f66b8
```

これらは**production-only unverified development provenance**としてのみ保持します。accepted scientific Stage 1 resultではなく、Stage 2を承認しません。

## 11. mandatory independent verification （独立検証）

Independent verifierはproduction feature implementationやproduction Stage 1 classifier helperをimportせず、corpus、root selection、representation、continuation outcome、model development、readinessを再計算しました。

Verification outcome:

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

一方、RAW state key、continuation measurement、`D_range`、high-divergence label、model development、readinessは一致しました。

Verification artifact provenance:

```text
artifact = 9708956844
artifact ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
verification SHA256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
independent development core SHA256 = 5b2251ef1ac34295cd1d67412c9d7f09adbe55b5af81a8752d3cb639b036e22a
```

## 12. technical postmortem （技術検証）

read-only post-failure auditで4 mismatchすべてが次のfeatureへ局在することを確認しました。

```text
MOVE_SET_ENTROPY.indexEntropy
```

Productionでは`Map`のencounter / insertion orderでShannon entropy termを加算していました。Independent implementationはplain objectを使用し、JavaScript enumerationによりinteger-like keyがnumeric orderへ並び替えられました。

floating-point additionはexactにassociativeではないため、加算順序の違いによって次の程度の差が発生しました。

```text
2.220446049250313e-16 .. 4.440892098500626e-16
```

しかし、prospectively frozen verifierはexact equalityを要求しています。

したがって、この原因説明を根拠としてoutcome確認後にtoleranceへ置き換えること、vectorをroundすること、verifierを修復してconsumed blockを再実行すること、4 mismatchをimmaterialとしてdecisionから除外することは承認されません。

Canonical postmortem:

- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

## 13. fail-closed closure （最終状態）

frozen execution contractでは、post-consumption technical / independent-verification failureを次へmapします。

```text
STAGE1-TECHNICAL-INVALID
```

したがって最終状態は次です。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement / extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

post-hoc rescueは一切適用していません。

## 14. interpretation boundary （解釈上の境界）

このclosureは、rich pre-root representationがmachine-defined decision-critical structureを識別できないことを確立したものではありません。

同時に、`RICH_ALL`、production AUROC、production operating thresholdをreusable scientific classifierとしてvalidateしたものでもありません。

本Studyが確立したのは、**single fresh development blockをconsumeした後、prospectively frozen Stage 1 pipelineがmandatory exact independent representation-verification requirementを満たさなかった**ことだけです。

production observationはprovenanceとfuture hypothesis generationのために保存できますが、accepted Stage 1 evidence、Stage 2 formal evidence、validated critical-position classification claimへ昇格してはいけません。

## 15. workflow archive / repository closure （最終状態）

scientific closureとcentral-document synchronization後、すべてのRCPR technical / development / materialization workflowをread-only archival stubへ変換しました。

original executable blobはGit historyとsource-freeze recordに保持されています。

Canonical archive checkpoint:

- `checkpoints/2026-08-29-post-closure-workflow-archive.md`

今後`RCPR-STUDY1`のtechnical、development、scientific、automatic central-document executionを行うことは承認されていません。

## 16. Program continuation （次の研究）

G2-06はclosedであり、result-drivenな`RCPR-STUDY2` retryとして再開しません。

次の未完了machine-only Research Generation 2 agenda itemは次です。

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
```

G2-07はfresh repository-state audit、新しいprospective Study / Stage ID、独自のrepresentation / endpoint / source / seed contract、explicit authorizationを必要とします。RCPR Stage 1 rowをformal evidenceとして継承してはいけません。

将来rich critical-position representationを独立研究として再検討することは可能ですが、deterministic entropy / numeric-hash semantics、fresh technical validation、fresh scientific evidence、fresh authorizationを備えたdistinct prospective identityが必要です。

最終`RCPR-STUDY1` decisionを変更してはいけません。
