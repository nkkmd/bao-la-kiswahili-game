# MDFT-STUDY1 — 再現性索引

更新日: 2026-08-29  
状態: **INITIATED / NO SCIENTIFIC SEED CONSUMPTION**

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

## Initial canonical documents

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
checkpoints/2026-08-29-study-initiation.md
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

No authorization artifact exists at initiation.

## Hash / source policy

Stage 0 tooling、Stage 1 spec、source freeze、production/independent implementation、artifact shard contractが作成された時点で、blob/source/hashを本索引へ追記する。

Scientific seed consumption前に、少なくとも次を固定する。

```text
Stage-specific spec SHA-256
source-freeze commit
production source hashes
independent source hashes
serialization/hash schema identity
artifact shard ceiling
workflow timeout ceiling
resource preflight result
explicit authorization identity
```

## Independent verification requirement

production G2-08 helperと独立実装を分離する。exact comparisonの対象は、source/selection/RAW keys/moves/search tables/class labels/promotion/final decision inputを含む。

## Artifact preservation requirement

Stage-specific preflightでfull artifact expected size、compression、serialization、upload feasibilityを実測する。scientific executionではrunner-local full comparisonをuploadより前に行い、その結果とfull production/independent shardsの双方をmandatory preservation対象として扱う設計を原則とする。
