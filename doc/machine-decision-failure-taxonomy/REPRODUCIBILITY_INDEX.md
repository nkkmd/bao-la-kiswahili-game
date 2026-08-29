# MDFT-STUDY1 — 再現性索引

更新日: 2026-08-29  
状態: **STAGE 0 TECHNICAL PASS / STAGE 1 RESERVED UNCONSUMED**

## Study anchor

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

## Canonical documents

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

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
```

## Seed reservations

```text
Stage 1 = 28910001..28914096 / 4096 / RESERVED / UNCONSUMED
Stage 2 = 29010001..29018192 / 8192 / RESERVED / UNCONSUMED
```

No Stage 1/2 scientific authorization exists at Stage 0 closure.

## Stage 0 production / independent sources

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

Production and independent implementations share authoritative engine/AI semantics but do not share the G2-08 search/result-assembly helper.

## Stage 0 canonical core

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

Technical fixtures:

```text
4 total
2 Namua
2 Mtaji
production/independent exact equality = PASS
B1024 depth-3 completion = 4/4
```

Resource observation:

```text
wall clock = 6232.648148 ms
max RSS = 94476 KB
canonical bytes = 71530
gzip bytes = 4166
technical compressed-part ceiling = 131072 bytes
```

## Stage 0 determinism replay

```text
GitHub Actions run = 33256767045
head = 3fabb8ff33988cbdf2f050b0560aa914db087aaf
artifact id = 9716038368
artifact digest = sha256:0c845ccf69860b3a8108466f66c039d1056439d422b7d8430e83bb5b7977298b
core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
canonical core hash match = true
```

## F09 static audit

Historical frozen Mtaji classifier candidate-definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

The complete scaler/centroid artifact is not preserved in the current repository. Therefore:

```text
MDFT-F09 = TECHNICALLY-INELIGIBLE
replacement/refit = NOT AUTHORIZED
```

See `checkpoints/2026-08-29-stage0-f09-static-audit.md`.

## F10 preflight

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

## Stage 0 disposition

```text
STAGE0-TECHNICAL-PASS
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
scientific inference = NONE
```

## Stage 1 pre-consumption requirements

Scientific seed consumption前に、少なくとも次を固定する。

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

## Independent verification requirement

production G2-08 helperと独立実装を分離する。exact comparisonの対象は、source/selection/RAW keys/moves/search tables/class labels/promotion/final decision inputを含む。

## Artifact preservation requirement

Scientific executionではrunner-local full comparisonをuploadより前に行い、その結果とfull production/independent shardsの双方をmandatory preservation対象とする。Stage 0でartifact transferが成功したことを、Stage 1/2 mandatory artifact requirementの緩和理由には使用しない。
