# MDFT-STUDY1 — 再現性索引

更新日: 2026-08-30
状態: **STUDY CLOSED / NON-ESTIMABLE**

## Studyの基準anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = cb660e166460e0f19d4ba16d5283fa880d55757f
branch = research/g2-08-machine-decision-failure-taxonomy
Program = G2-08
Study ID = MDFT-STUDY1
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

## 正式文書

```text
README.md
STUDY_1_OVERVIEW.md
STUDY_1_PROTOCOL.md
FAILURE_MODE_DICTIONARY.md
CURRENT_STATUS.md
DECISION_REGISTER.md
RESEARCH_LOG.md
RESUME_HERE.md
preregistration/STAGE_0_TECHNICAL_SPEC.json
preregistration/STAGE_1_SEED_RESERVATION.json
preregistration/STAGE_2_SEED_RESERVATION.json
results/STAGE_0_TECHNICAL_RESULT.json
checkpoints/2026-08-29-study-initiation.md
checkpoints/2026-08-29-stage0-f09-static-audit.md
checkpoints/2026-08-29-stage0-technical-pass.md
```

## RAW identity （識別情報）

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
```

## Seed予約

```text
Stage 1 = 28910001..28914096 / 4096 / CONSUMED
Stage 2 = 29010001..29018192 / 8192 / RESERVED / UNCONSUMED
```

Stage 0 closure時点では、Stage 1/2のscientific authorizationは存在していなかった。

## Stage 0 — production / independent source （Stageの記録）

```text
tools/experiments/lib/mdft-stage0-production.js
blob = 191ca3901e24a791651b2fa333c472e46b35b713

tools/experiments/lib/mdft-stage0-independent.js
blob = 5f33ba2614ee6b0ef2ce65f6e24f227123b5e3ce

tools/experiments/run-mdft-stage0-technical.js
workflow = .github/workflows/mdft-stage0-technical.yml

tools/experiments/run-mdft-stage0-f10-preflight.js
workflow = .github/workflows/mdft-stage0-f10-preflight.yml
```

Productionとindependent implementationはauthoritative engine/AI semanticsを共有するが、G2-08専用のsearch/result-assembly helperは共有しない。

## Stage 0 正式core

```text
GitHub Actions run = 33256737040
head = ad2a47401f38c58228d45270c94389d16c21dda9
artifact id = 9716030172
artifact digest = sha256:23f08a39891ba64015870ddf616e8d258619172b690aac88e9165ab864b62206
core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
ESSENTIAL_CORE SHA-256 = 857dcdce7ce9abff86c8060809f66ece7f54b3a13d575cc598097fcd699cf2bb
FULL_TECHNICAL_CORE SHA-256 = 77f7fee6db8eb0ace645b42115182c9192c0ee68c50a7fd75df7bfead8e5e0f0
FINAL_EXACT_COMPARISON SHA-256 = 77f23ef20f91d345b8d5c7811f63b92483dd674aa9a9d4baea142cf4c92c4c2f
```

技術fixture:

```text
4 total
2 Namua
2 Mtaji
production/independent exact equality = PASS
B1024 depth-3 completion = 4/4
```

Resource観測値:

```text
wall clock = 6232.648148 ms
max RSS = 94476 KB
canonical bytes = 71530
gzip bytes = 4166
technical compressed-part ceiling = 131072 bytes
```

## Stage 0 — determinism再現確認

```text
GitHub Actions run = 33256767045
head = 3fabb8ff33988cbdf2f050b0560aa914db087aaf
artifact id = 9716038368
artifact digest = sha256:0c845ccf69860b3a8108466f66c039d1056439d422b7d8430e83bb5b7977298b
core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
canonical core hash match = true
```

## F09 — static監査

Historically frozen Mtaji classifierのcandidate-definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

complete scaler/centroid artifactは現在のrepositoryに保存されていない。そのため:

```text
MDFT-F09 = TECHNICALLY-INELIGIBLE
replacement/refit = NOT AUTHORIZED
```

詳細は`checkpoints/2026-08-29-stage0-f09-static-audit.md`を参照する。

## F10 — preflight （日本語の要点）

```text
GitHub Actions run = 33256932295
head = 04ffda12149ab73b4d4a2729eefbdc5ff4f4f225
artifact id = 9716090090
artifact digest = sha256:8acf94307a0f12d42ef53580c1178249822f394a0e617f4f62dba33326a4e179
F10_PREFLIGHT_RESULT SHA-256 = 59c22500c3748d85a131fc6e7340d59062ae3d56996714655bd9b207784a0f4d
F10_FULL_TRACE SHA-256 = 0e65c8ad18345723fc92cde4f445ff19f7e240a4cccc2d2a88d3a0cc1eea6f80
F10_FULL_TRACE.json.gz SHA-256 = a0ee4067dfba768b9165d5147bded1f4fc3c83b58e824e427e7d1ad43e83c600
continuation = 6 plies
fixture count = 4
trace count = 8
wall clock = 25279.321986000003 ms
max RSS = 97296 KB
gzip bytes = 2570
all predeclared gates = PASS
```

## Stage 0 — 正式disposition

```text
STAGE0-TECHNICAL-PASS
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
scientific inference = NONE
```

## Stage 1 seed消費前の要件

scientific seed consumption前に、少なくとも次を固定する。

```text
Stage 1 exact machine-readable spec SHA-256
source-freeze commit
production source hashes
independent source hashes
serialization/hash schema identity
scientific artifact shard ceiling
workflow timeout ceiling
resource preflight result
artifact-transfer failure mapping
explicit authorization identity
```

## 独立検証要件

production G2-08 helperと独立実装を分離する。exact comparisonの対象は、source/selection/RAW keys/moves/search tables/class labels/promotion/final decision inputを含む。

## Artifact保存要件

Scientific executionではrunner-local full comparisonをuploadより前に行い、その結果とfull production/independent shardsの双方をmandatory preservation対象とする。Stage 0でartifact transferが成功したことを、Stage 1/2 mandatory artifact requirementの緩和理由には使用しない。

## Stage 1 正式closure

```text
spec SHA-256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
technical preflight run = 33258188633 / PASS
runner readiness run = 33277031634 / PASS
scientific run = 33277102013 / success
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
actions artifact id = 9722157483
artifact ZIP SHA-256 = bb34d16874175dcb581ad8725983a3ed4778687c0f3a2965ae929daaffbfe921
```

Exact development core:

```text
production = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
match = true
```

Full shard:

```text
production/full-shard-0001.json.gz = 665093 bytes / 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
independent/full-shard-0001.json.gz = 665093 bytes / 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Repository上の正式output:

```text
results/STAGE_1_DEVELOPMENT_RESULT.json
results/STAGE_1_FINAL_EXACT_COMPARISON.json
results/STAGE_1_ARTIFACT_MANIFEST.json
checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md
STUDY_1_FINAL_REPORT.md
```

科学的closure:

```text
unique trajectories = 4068
distinct opening prefixes = 2836 / required >= 3000 / FAIL
selected roots = 512
LOW_CAPTURE selected = 170/512 = 0.33203125 / required <= 0.32 / FAIL
reference consensus = 473
reference disagreement events = 110
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```
