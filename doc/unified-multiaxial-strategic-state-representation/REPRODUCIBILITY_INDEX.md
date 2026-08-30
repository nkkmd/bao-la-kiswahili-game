# UMSSR-STUDY1 — 再現性索引

更新日: 2026-08-30

## 1. repository anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
research branch = research/g2-10-unified-multiaxial-strategic-state-representation
initial freeze commit = d5e5237a6678442cb5f0e72b3430b93e4526c1d4
pre-scientific tightening commit = 54cc0661d283f3740b9fd8f665730ed84eb01bcb
initial consistency audit commit = e3ff29277460d4d7e8529cef565448a6dfa3378d
Stage 0 source/spec freeze commit = 78de03fde8e286f65d1544ad585e9337dad240a0
Stage 1 pre-scientific freeze commit = fbfa65e774fa6bd6a509fb0b3ee903a463a86f17
Stage 1 repaired scientific source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
Stage 1 accepted authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
```

## 2. Study / Stage IDs

```text
Study = UMSSR-STUDY1
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
```

formal closure:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

## 3. 正本文書

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `STUDY_1_FINAL_REPORT.md`
- `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `UPSTREAM_STUDY_AUDIT.md`
- `CANDIDATE_AXIS_INVENTORY.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`
- `prereg/STUDY_1_INITIAL_CONTRACT.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_FEATURE_DICTIONARY.json`
- `prereg/STAGE_1_EXECUTION_CONTRACT.json`
- `prereg/STAGE_2_VALIDATION_CONTRACT.json`
- `authorizations/STAGE_1_EXECUTION_AUTHORIZATION.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_CONSUMPTION_RECORD.json`
- `results/STAGE_1_FINAL_EXACT_COMPARISON.json`
- `results/STAGE_1_HASH_MANIFEST.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `checkpoints/2026-08-30-stage1-scientific-no-representation-closure.md`

## 4. RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## 5. seed ledger

```text
29300001..29300064 = Stage 0 technical-only / NON-SCIENTIFIC
29310001..29314096 = Stage 1 scientific / CONSUMED
29410001..29418192 = Stage 2 scientific / RESERVED-UNCONSUMED
```

Stage 1 seed blockはaccepted run `33297178656`でconsume-onceとして消費された。同じblockのrerun、replacement、extensionは未承認である。

## 6. Stage 0

```text
workflow run = 33295423785
job = 99214144073
artifact id = 9727254008
artifact ZIP SHA-256 = d63883eb0ec188b23c673809d182bc5585459992a30f29892c6a1a86400b6309
Stage 0 disposition = STAGE0-TECHNICAL-PASS
mandatory gates = 14 / 14 PASS
scientific seed use = 0
```

## 7. Stage 1 frozen scientific contract

```text
Stage 1 spec SHA-256 = 0cc1debb44767357c7a26b14e8d48fa843fb197ec55e1dd36838a2a572b80b8d
feature dictionary SHA-256 = f23428d9f5c1d02e1176d773bc02e098b002cbfeb5e2652ecf0e107d62e2d61f
Stage 2 validation contract SHA-256 = 3f76a4ea54dabe5ac1a020fd7fc7b5a637d611f341c47a25fe73c6199aad3658
execution contract SHA-256 = 415463f304c9943a68e6dbaab7fdd5b5f79833f13b317d9e3c1c72a53e371531
```

representation selection:

```text
feature width = 40
dimensionality reduction = NONE-IN-STUDY1
candidate K = 2,3,4,5,6
minimum cluster support fraction = 0.10
minimum mean silhouette = 0.05
minimum five-fold assignment stability = 0.80
```

## 8. pre-consumption technical history

Stage 1 tooling smokeの初回attemptはimplementation defectで失敗したがscientific seedを使用していない。修正後tooling smokeはPASSした。

accepted tooling smoke:

```text
run = 33296341604
artifact id = 9727521248
artifact ZIP SHA-256 = 39120244bb238aee19e5181104c33d7551c5b4b6eb0b11156011efe6085febef
disposition = STAGE1-TOOLING-SMOKE-PASS
```

最初のscientific authorization attempt `33296879050`はauthorization hash binding mismatch、次のattempt `33296962144`はrunnerの`bindings`未定義参照により、どちらもconsume gate前に停止した。

```text
scientific seeds consumed in rejected attempts = false
scientific data generated in rejected attempts = false
```

runnerのpre-consumption参照だけを修正したsource commit `10801fbc1529902bf3f4c0aa6e464c1dc39f1267`についてtechnical-only packaging preflightを再実行し、PASS後にfinal authorizationを発行した。

```text
packaging preflight run = 33297055834
job = 99218441038
artifact id = 9727743959
artifact ZIP SHA-256 = cf9591b02dee0d1cb1ce2e6aeb674522259be7d6266d1ee30dd586b23febb3ed
preflight result file SHA-256 = 7652628d0e6befc4e0d6a400c8b7d0e6b68cd70324cd8dbf575d12b63177f98f
```

## 9. accepted Stage 1 scientific execution

```text
workflow = UMSSR Stage 1 Scientific Development
run = 33297178656
job = 99218754656
source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
workflow conclusion = success
artifact id = 9727918107
artifact ZIP SHA-256 = 8f2f92d88ccb040f53bae28acb7124f230d51b00ff4466835adfda6260934e86
```

artifact内部の正本hash:

```text
CONSUMPTION_RECORD.json = c6f95fd2bab4c21fd4b99ee6a69590861a907a001e87e0d63e3af72a7661f522
STAGE_1_DEVELOPMENT_RESULT.json = 21fb4cd60dbaa6761b177ad54cda5dd33c942ba3994a953ce5486917f0e440fd
FINAL_EXACT_COMPARISON.json = 6746eb5d5213d278a7991b6613a0ebf95ed621cc1759d1128f164337583785fb
HASH_MANIFEST.json = 9010f53c676b5e588e8e4553acd6ec680bd6ca366f31a68a6f53dbe8de90c823
production/full-shard-0001.json.gz = 66bf5fbeda877235d76628b108398a0c88741d677f8079951668b62ee3366595
independent/full-shard-0001.json.gz = 66bf5fbeda877235d76628b108398a0c88741d677f8079951668b62ee3366595
runner internal result SHA-256 = 985235180827db9d314b610baeb37cd2aec9427633ac518c270c938230060b9a
```

repositoryにはcompact canonical recordを保持し、full compressed shardはGitHub Actions artifactを正本transportとして保持する。

## 10. population / readiness

```text
generated games = 4096
unique trajectories = 4068
distinct opening prefixes = 3711
selected roots = 512
selected distinct opening prefixes = 504
maximum single selected opening-prefix share = 0.005859375
active features = 40 / 40
scientific readiness = PASS
resource gate = PASS
```

8 strataはすべて64 rootsである。

## 11. production / independent exact verification

```text
recordsExact = true
selectionExact = true
analysisRowsExact = true
scalerExact = true
candidateKExact = true
representationExact = true
readinessObjectExact = true
fullExact = true
```

## 12. candidate K result

```text
K=2: support=0.142578125 silhouette=0.17337024701327378 stability=0.740234375 eligible=false
K=3: support=0.009765625 silhouette=0.18121647379388248 stability=0.744140625 eligible=false
K=4: support=0.0078125 silhouette=0.20576375120521176 stability=0.916015625 eligible=false
K=5: support=0.0078125 silhouette=0.18309611515099047 stability=0.822265625 eligible=false
K=6: support=0.001953125 silhouette=0.184310677873519 stability=0.69921875 eligible=false
```

eligible candidateは0であり、`selectedRepresentation = null`である。

## 13. Stage 2 / G2-11 boundary

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds = RESERVED-UNCONSUMED
G2-11 candidate input from UMSSR-STUDY1 = NOT AUTHORIZED
```

Stage 2でrefit / reclustering / threshold relaxationを行わない。別representationを将来検討する場合は新しいprospective Studyまたはversioned protocolを必要とする。

## 14. documentation quality

human-readable Markdownは日本語主体とし、canonical token、Study/Stage ID、field名、hash、pathは原表記を維持する。closure commit後に`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`を再適用する。
