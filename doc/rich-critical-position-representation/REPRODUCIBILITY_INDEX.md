# RCPR-STUDY1 — 再現性索引

更新日: 2026-08-29  
状態: **CLOSED AT STAGE 1 / STAGE0-TECHNICAL-PASS / STAGE1-TECHNICAL-INVALID / STAGE2-NOT-AUTHORIZED-NOT-EXECUTED**

## Study anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
branch = research/g2-06-rich-critical-position-representation
Program = G2-06
Study ID = RCPR-STUDY1
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
```

## frozen representation / design

```text
RAW identity include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
symmetry reduction = false
canonicalization = false
candidate feature families = 8
scalar feature width = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
execution addendum SHA256 = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
source games = 3072
seed block = 28610001..28613072 / CONSUMED
root target = 600 / Namua 300 / Mtaji 300
replicates per exact root move = 64
continuation horizon = 200
high-divergence boundary = D_range >= 0.30
CV = 5-fold by historicalTrajectoryHash
```

## Stage 0 provenance

```text
decision = STAGE0-TECHNICAL-PASS
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
job = 98876051308
artifact = 9688987798
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

## Stage 1 pre-execution validation

```text
implementation smoke run = 33195723195 / success
implementation smoke job = 98932225577
implementation smoke artifact = 9695647002
implementation smoke ZIP SHA256 = 9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11

resource preflight run = 33195349152 / success
resource preflight job = 98930953453
resource preflight artifact = 9695494212
resource preflight ZIP SHA256 = aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1

source-freeze audit run = 33196797865 / success
source-freeze audit job = 98935883477
source-freeze artifact = 9696075216
source-freeze ZIP SHA256 = fabb644c69d0f5efac48f3275a1e28a008a84832c7a7c4fd99a5f199038dbd7c
source-freeze envelope SHA256 = 03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d
```

## Stage 1 terminal execution provenance

```text
workflow run = 33196954082 / completed / failure
production job = 98936414477 / completed / success
independent verification job = 99007180273 / completed / failure
failed verification step = Independent full-corpus replay and recomputation
```

archived `execution-start.json`にはStage 1 seed blockがconsumedであることを記録しています。

### Production artifact

```text
artifact ID = 9704250489
name = rcpr-stage1-development-production-v1
size = 3168004 bytes
ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
production result SHA256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
production development core SHA256 = 245c7e04421b1ef534edcb23d3048df1e2f1d556f9223f1eee84f054973f66b8
model development SHA256 = cf64b152e17c1c358b2b39e0fb7782bde69ef6aef542f6afd7fd6d17d41109b9
```

Production-only output:

```text
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
```

frozen production readiness gateはすべてtrueでした。ただし、これらの値はunverified production provenanceのみです。

### Independent verification artifact

```text
artifact ID = 9708956844
name = rcpr-stage1-development-verified-v1
size = 3191366 bytes
ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
verification SHA256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
independent development core SHA256 = 5b2251ef1ac34295cd1d67412c9d7f09adbe55b5af81a8752d3cb639b036e22a
```

Verification check:

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

600 rows中exactに4 rowsでfeature-vector hash equalityがFAILしました。すべてのRAW keyとcontinuation-derived quantityは一致しました。

## technical root cause

4件のfeature mismatchはすべて`MOVE_SET_ENTROPY.indexEntropy`へ局在します。

Productionは`Map`のinsertion orderでentropyを累積し、independent implementationはplain objectのvalueを使用します。integer-like keyはnumeric orderで列挙されるため、floating-point addition orderが異なります。

その結果、exact差として`2.220446049250313e-16`〜`4.440892098500626e-16`が生じました。

frozen verifierはexact equalityを要求するため、continuation remeasurement、model development、readiness recomputationが一致していてもtechnical integrity failureです。

Authoritative machine-readable record:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

## final disposition

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

production resultを昇格してはいけません。post-hoc tolerance / rounding changeでStage 1を救済することもできません。

研究lineを継続する場合は、technical hardening、新しいscientific source freeze、fresh seed block、新しいexplicit authorizationを備えたprospective successorが必要です。
