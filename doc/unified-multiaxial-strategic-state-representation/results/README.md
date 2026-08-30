# UMSSR-STUDY1 — results管理

## 現在の正式状態

G2-10 Study 1はStage 1 scientific developmentまで完了し、事前固定したpromotion ruleに従って`NO-REPRESENTATION`で閉じた。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study final decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 scientific evidence generated = true
Stage 2 scientific evidence generated = false
```

## canonical machine-readable result

Stage 1 accepted artifactから同一バイト列でmaterializeした正本:

- `STAGE_1_DEVELOPMENT_RESULT.json`
- `STAGE_1_CONSUMPTION_RECORD.json`
- `STAGE_1_FINAL_EXACT_COMPARISON.json`
- `STAGE_1_HASH_MANIFEST.json`

Study-level closure summary:

- `STUDY_1_FINAL_RESULT.json`

Stage 0正本:

- `STAGE_0_TECHNICAL_CLOSURE_RESULT.json`
- `STAGE_0_SOURCE_HASHES.json`

## accepted Stage 1 provenance

```text
source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
workflow run = 33297178656
job = 99218754656
artifact id = 9727918107
artifact ZIP SHA-256 = 8f2f92d88ccb040f53bae28acb7124f230d51b00ff4466835adfda6260934e86
```

artifact file hashes:

```text
CONSUMPTION_RECORD.json = c6f95fd2bab4c21fd4b99ee6a69590861a907a001e87e0d63e3af72a7661f522
STAGE_1_DEVELOPMENT_RESULT.json = 21fb4cd60dbaa6761b177ad54cda5dd33c942ba3994a953ce5486917f0e440fd
FINAL_EXACT_COMPARISON.json = 6746eb5d5213d278a7991b6613a0ebf95ed621cc1759d1128f164337583785fb
HASH_MANIFEST.json = 9010f53c676b5e588e8e4553acd6ec680bd6ca366f31a68a6f53dbe8de90c823
production full shard = 66bf5fbeda877235d76628b108398a0c88741d677f8079951668b62ee3366595
independent full shard = 66bf5fbeda877235d76628b108398a0c88741d677f8079951668b62ee3366595
```

full compressed shardはGitHub Actions artifactに保持し、repositoryにはcompact canonical recordsだけを保存する。

## scientific resultの意味

scientific readinessとresource gateはPASSし、production / independentは`fullExact = true`だった。一方、`K=2..6`の全候補が事前固定したminimum support / assignment stability criterionの少なくとも1つを満たさず、eligible candidateは0だった。

したがって:

```text
selectedRepresentation = null
FROZEN_REPRESENTATION.json = NOT PRODUCED
```

である。

これはBaoにstrategic regimeが存在しないという一般命題ではない。凍結したG2-10 Study 1のrepresentation contract内でStage 2へ昇格可能なrepresentationを得られなかった、という限定されたnegative resultである。

## Stage 2

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

Stage 2 result fileは存在せず、absenceを`0`や`NOT-VALIDATED`へ読み替えない。

## 禁止

- Stage 1 thresholdの結果後緩和
- K rangeの結果後変更
- Stage 1 seed blockのrerun / extension
- Stage 1 development populationのStage 2 evidenceへの再利用
- Stage 2でのrefit / reclustering / restandardization
- favorable subgroupによる救済
