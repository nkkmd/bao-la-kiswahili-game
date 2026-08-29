# RCPR-STUDY1 — 研究ログ

## 2026-08-28 — startup audit / prospective freeze

- remote `main`が`37480777246aa306c6ca3d0679d936b5e0107071`であることを確認
- verified baselineから`research/g2-06-rich-critical-position-representation`を作成
- `RCPR-STUDY1`、Stage ID、RAW identity、no-canonicalization boundary、leakage class、8 representation family、no-rescue behavior、independent-verification requirementをprospectiveに固定
- historical Research Generation 1 Critical Positions evidenceをG2-06のtraining / tuning / validation / formal evidenceから除外

Scientific outcome generated: **none**。

## 2026-08-28 — Stage 0 source audit / technical acceptance

- dedicated RAW-only production / independent representation pathを実装
- Stage 0 source commit: `dca7a70e75fb1014b752f4549bd6d1164b1feecb`
- workflow `33179301221`が成功。artifact `9688987798`、ZIP SHA256 `442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269`
- 6 fixtureでNamua / Mtaji、8 familyすべて、310 scalar featuresをcover
- production / independent representationとRAW identityがexact一致。positive / negative controlもPASS
- feature schema SHA256を`1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b`として固定
- Stage 0 result core SHA256 `d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac`
- Decision: `STAGE0-TECHNICAL-PASS`

Scientific outcome generated: **none**。

## 2026-08-28 — Stage 1 development design freeze

- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`を固定
- fresh source games: 3072。scientific seed block `28610001..28613072`、`CONSUME-ONCE-DEVELOPMENT-ONLY`
- 6 generation strata、outcome-blind selection、300/300 phase quota、310-feature representation、continuation instrument、`D_range >= 0.30`、candidate family set、deterministic five-fold development procedure、operating-threshold rule、readiness gateを固定
- independent full-corpus replay、root reselection、feature recomputation、continuation remeasurement、model-development recomputation、fail-closed technical decisionを固定
- spec単体ではStage 1未承認

Scientific outcome generated: **none**。

## 2026-08-29 — implementation validation / execution-contract freeze

- final implementation smoke: workflow `33195723195`, job `98932225577`, success
- smoke artifact `9695647002`, ZIP SHA256 `9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11`
- resource preflight: workflow `33195349152`, job `98930953453`, success
- resource artifact `9695494212`, ZIP SHA256 `aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1`
- separate 360-minute production / independent job、Node 6144 MB old-space、deterministic encoding、consume-once failure semanticsを固定
- scientific implementation / source contractを`a69ffce86cb278680ee676a2a9469aeb1d9ab1d4`で固定
- Stage 1 spec SHA256 `813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb`
- execution addendum SHA256 `e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64`

Scientific outcome generated: **none**。Fresh block consumed: **no**。

## 2026-08-29 — exact source-freeze audit

- source-freeze audit workflow `33196797865`, job `98935883477`, success
- artifact `9696075216`, ZIP SHA256 `fabb644c69d0f5efac48f3275a1e28a008a84832c7a7c4fd99a5f199038dbd7c`
- audit envelope SHA256 `03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d`
- baseline main、audit時点でauthorizationが存在しないこと、scientific-source ancestry、spec / addendum hash、17 frozen source blobすべてを検証
- source-freeze checkpointを`4366e439c2838dd7f2f388e834ecc93aed7efcb6`でclose

Scientific outcome generated: **none**。Fresh block consumed: **no**。

## 2026-08-29 — Stage 1 explicit authorization / execution start

- authorization `RCPR-S1-EXECUTE-2026-08-29-v1`をcommit `a0d630df2ee5fbd943d306ab959ce509cbcc2330`で作成
- authorizationは`scientificInferenceAuthorized=false`、`confirmatoryReuseAllowed=false`、`stage2Authorized=false`を維持
- pushによりworkflow run `33196954082`をtrigger
- production job `98936414477`がexecution-start boundaryを通過
- prospectively frozen contractによりblock `28610001..28613072`は永久にconsumed

```text
consumption state = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
```

## 2026-08-29 — Stage 1 production completion

Production job `98936414477`は`success`で完了しました。

Production output:

```text
status = PASS-AWAITING-INDEPENDENT-VERIFICATION
generatedGames = 3072
selectedRoots = 600
primaryEstimable = 599
highDivergence = 134
lowDivergence = 465
selectedFamilySetId = RICH_ALL
overallAuc = 0.7093403948001926
phaseAuc.namua = 0.7356189599631845
phaseAuc.mtaji = 0.6657646992502396
balancedAccuracy = 0.6684641309581127
productionResultSha256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
```

production readiness gateはすべてtrueでした。

Artifact:

```text
ID = 9704250489
name = rcpr-stage1-development-production-v1
size = 3168004 bytes
ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
```

この時点のinterpretationは引き続き**production-only / awaiting independent verification**です。

## 2026-08-29 — independent verification failure

Independent job `99007180273`は`Independent full-corpus replay and recomputation`で`failure`となりましたが、verification artifactはuploadされました。

Verifier result:

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
verificationSha256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
```

Verification artifact:

```text
ID = 9708956844
name = rcpr-stage1-development-verified-v1
size = 3191366 bytes
ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
```

artifactには`execution-start.json`、`production-result.json`、`independent-verification.json`が含まれます。`execution-start.json`はscientific Stage 1 seed blockがconsumedであることを明示しています。

600 rows中exactに4 rowsで`featureVectorMatch`がFAILしました。600 rowsすべて存在し、RAW state key、continuation measurement、`D_range`、high-divergence labelは一致しました。

## 2026-08-29 — technical postmortem

read-only artifact / source analysisにより、4件すべての差を`MOVE_SET_ENTROPY.indexEntropy`へ局在させました。

Cause:

- production `rcpr-production.js::entropy(values)`は`Map`を使用しinsertion orderを保持
- independent `rcpr-independent.js::shannon(values)`はplain objectを使用
- JavaScriptはinteger-like object keyをencounter orderではなくnumeric orderで列挙
- 同じentropy termが異なる順序で加算される
- IEEE-754 non-associativityによりexact差`2.220446049250313e-16`〜`4.440892098500626e-16`が生じる

continuation remeasurement、`D_range`、high-divergence classification、model-development recomputation、readiness recomputationには差がありませんでした。

しかし、このtechnical explanationはStage 1を救済しません。prospectively frozen verifierはexact feature-vector equalityを要求しています。

## 2026-08-29 — Stage 1 fail-closed closure

Final decision:

**`STAGE1-TECHNICAL-INVALID`**

Governance consequence:

```text
Stage 1 seed block = CONSUMED
same-block repair/rerun = PROHIBITED
post-hoc tolerance/rounding rescue = PROHIBITED
production-only result promotion = PROHIBITED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Permanent record:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

このresearch lineを継続する場合は、scientific authorization前にdeterministic entropy-order / numeric-hash semanticsをhardenし、adversarial technical fixture、新しいstudy / spec / source freeze、fresh scientific seed block、新しいexplicit authorizationを備えたprospective successorが必要です。

`RCPR-STUDY1` rowはsuccessor formal evidenceとして使用しません。
