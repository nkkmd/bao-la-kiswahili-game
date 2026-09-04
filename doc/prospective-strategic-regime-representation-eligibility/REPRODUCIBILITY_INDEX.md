# PSRRE-STUDY1 — 再現性索引

## 1. baseline （日本語の要点）

```text
Repository = nkkmd/bao-la-kiswahili-game
Baseline remote main = 3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
Research branch = research/pre-g2-11-strategic-regime-representation-eligibility
Study ID = PSRRE-STUDY1
```

## 2. prospective contracts （固定した条件）

- `STUDY_1_PROTOCOL.md`
- `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `prereg/STUDY_1_INITIAL_CONTRACT.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_FEATURE_DICTIONARY.json`
- `prereg/STAGE_2_VALIDATION_CONTRACT.json`
- `prereg/STAGE_1_EXECUTION_CONTRACT.json`

## 3. Stage 0 （Stageの記録）

```text
source freeze = 724e05ef6a730593aab2f9165a0d02216e372c6d
authorization = 2c1dea4f7f5c98497333d9ec325931e9091ba0df
workflow run = 33304155488
job = 99237601518
artifact = 9729904359
disposition = STAGE0-TECHNICAL-PASS
```

## 4. Stage 1 tooling / preflight （Stageの記録）

```text
tooling smoke run = 33307611100
tooling smoke disposition = TOOLING-SMOKE-PASS
invalid packaging preflight runs = 33307852222, 33307879877
repair PASS run = 33308028155
final binding-manifest preflight run = 33308152033
final source freeze = 41124069f89f0706cf943e18688c96a8c2db35d7
```

Invalid preflight attemptsはscientific seedを使用していない。修正はartifact projection estimatorのみで、scientific contract、threshold、feature、K、resource ceilingは変更していない。

## 5. Stage 1 scientific execution （実行記録）

```text
authorization commit = 085c5df24baff44bb644c00eda91d6212caf5708
workflow run = 33308337738
job = 99248759871
artifact id = 9731444105
artifact size = 5399830 bytes
artifact ZIP SHA-256 = c418bca917723eb9c07035c323431972ac541b4b58e286820657b0d1c7e40d7a
```

Artifact internal hashes:

```text
CONSUMPTION_RECORD.json = da80527be93597ee765a67e9b50bf7c8e2f7f170fda3243e342dcc618d20be44
FINAL_EXACT_COMPARISON.json = f5e89ee04550f2f83a1c1848910aca8502cf5d3c53ba6b3d9906e1b7495382ae
STAGE_1_DEVELOPMENT_RESULT.json = 1a198843dfe57b6b378e8e9aec3f1f60e5cf5424b4e76028894485863914539e
ESSENTIAL_CORE.json = 1a198843dfe57b6b378e8e9aec3f1f60e5cf5424b4e76028894485863914539e
HASH_MANIFEST.json = 3d6fd84963d4d89b8963ad5e657f7525c6f6891cee237faea5bb173576a33078
production/full-shard-0001.json.gz = 1f00bf677de11899c38179c7a383676be753c1184c0010bd84d3b1fb26af6cd1
independent/full-shard-0001.json.gz = 1f00bf677de11899c38179c7a383676be753c1184c0010bd84d3b1fb26af6cd1
runner internal result = 42bbb556b96e35bef24044c9112d47508b5f6759718c582f278dd64cbd7db9a8
```

production / independent実装が生成したfull shardはbyte-identicalである。

## 6. seed registry （seedの記録）

```text
29500001..29500064 = technical-only
29510001..29514096 = Stage 1 CONSUMED / same-block rerun prohibited
29610001..29618192 = Stage 2 RESERVED_UNCONSUMED / NOT AUTHORIZED
```

## 7. formal scientific closure （最終状態）

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NON-ESTIMABLE
selected representation = null
G2-11 candidate input authorized = false
```

Blocking gate:

```text
nonzero-MAD features observed = 15
minimum required = 20
```

## 8. repo-facing closure artifacts （最終状態）

- `STUDY_1_FINAL_REPORT.md`
- `results/STUDY_1_FINAL_RESULT.json`
- `checkpoints/2026-08-30-stage1-development-non-estimable-closure.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`

Stage 1がreadiness gateを通過しなかったため、固定済みrepresentation artifactは存在しない。
