# GCLD-STUDY1 — 再現性索引

更新日: 2026-09-04

## 1. 正本となる情報

```text
Study = GCLD-STUDY1
Research branch = research/g3-10-geometry-conditioned-longitudinal-dynamics
Reviewed main anchor = 0bcd1695b6dbd044acf2eed91740d282c63dbb07
Representation = CRCLGR-R1-EXACT-SQUASHED-L1
Protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

protocol / preregistration:

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `prereg/STAGE_2_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_IMPLEMENTATION_CONTRACT.json`
- `prereg/STAGE_2_TECHNICAL_EXECUTION_V2_CONTRACT.json`

## 2. Stage 0のtechnical validation

```text
Stage ID = GCLD-S0-TECHNICAL-2026-09-03-v1
trigger commit = b2164fb21bac643944e43bbf55df68a2adfd557d
Actions run = 33766979732
lease artifact ID = 9897926772
lease ZIP SHA-256 = 0f650df65e024c040191a5a3a4b87350387d5512ea99d9f3fd069badde4d06f9
result artifact ID = 9898031889
result ZIP SHA-256 = 9cde41d5ff549fb9aa82be3c0e5772b28c2f37a603bc2a83e49f3d769e2abeb4
repository result Git blob = 650dd95dba0d246c28de2970c09cc1fe3b843f0d
Stage disposition = STAGE0-PASS
fresh scientific access = false
```

deterministic technical coreのSHA-256:

`f5dfb2b8aa01929c99b1e8bfc39abf6e9ecbd41945314284654b181267ea3254`

## 3. Stage 1 developmentの記録

```text
Stage ID = GCLD-S1-DEVELOPMENT-2026-09-03-v1
seed block = 32210001..32210256
trigger commit = e15bad0065f88a197672f25d870db17724330099
Actions run = 33767857909
lease artifact ID = 9898283234
lease ZIP SHA-256 = adaf8f0742b438fe86c5bb87225785dfe716fd40fa9a797fcc6cf7c0e80c7d23
result artifact ID = 9899355887
result ZIP SHA-256 = 12a498f8da08adedb8dd8ab758790e3395927dd2580c9d9e8f45e89ac0270ed2
candidate trajectories = 24
resource eligible = 24
measured = 16
Stage disposition = STAGE1-PASS
formal inference = false
```

canonical Stage 1 scientific-resultのSHA-256:

`c2cd89d70f288b5d9abadf611edf494d784b025b3e4483e8d6794918cc4dac1d`

Stage 1 artifactのSHA-256:

```text
STAGE_1_CANDIDATE_MANIFEST.json = c8496407f38ee2dbbf198bd40c0e74170d9a66dac370b2237d587bc8fdf0a798
STAGE_1_PREFLIGHT_ELIGIBILITY.json = 752e91cf541cd9dca4fb0adb13a412cbdc31154359c1e91ab02c9de6b605a8e1
STAGE_1_MEASURED_POPULATION.json = e7ec602efc061376056b86982f2f72c396bbef0248f55feb282fe262e2210a5c
STAGE_1_TRAJECTORY_MEASUREMENTS_PRODUCTION.json = 6a13940638c9fc92b29dff46f1f9b9c3a564e332a42d3d2f653ecd1a8485e80c
STAGE_1_TRAJECTORY_MEASUREMENTS_INDEPENDENT.json = 6a13940638c9fc92b29dff46f1f9b9c3a564e332a42d3d2f653ecd1a8485e80c
STAGE_1_LONGITUDINAL_SUMMARIES.json = 492a11263c51a5f33941b2aa09c9108b3fa11a18014beb0e470820292950cdbd
STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json = 9d869d2f1b967d9a34e7e9ef20e780f149d3a90d3dc430805e43f5f0a73e8d0f
```

## 4. Stage 2のfresh evidence前technical abort

最初のwrapper run:

```text
Actions run = 33809894513
lease artifact ID = 9914370441
lease ZIP SHA-256 = 2362aefa5d091c0f77c269fa74178b89e5c6b7a84a84ca7043ff9e65d0e5c9b3
failure = G3-09 firewall not identity-only
failure location = before Stage 2 candidate/seed selection
fresh Stage 2 seed reads = 0
scientific result artifacts = 0
classification = PRE-FRESH-ACCESS-TECHNICAL-ABORT / SCIENTIFIC-EXECUTION-NOT-CONSUMED
rerun of this workflow = NOT PERFORMED
```

technical V2が導入したのは、historical G3-09 Stage 2 selection artifactに対するidentity projectionだけである。projectionするfieldは`rootRawSha256`、`sourceTrajectorySha256`、`openingPrefixSha256`の3件に限り、scientific coordinate / measurement payloadはloadしない。

## 5. Stage 2のformal execution

```text
Stage ID = GCLD-S2-FORMAL-2026-09-03-v1
technical execution version = GCLD-S2-EXEC-V2-2026-09-04
seed block = 32220001..32220384
machine authorization commit = d78c54db3a2fef3be68c6e09f7a334e21653428f
trigger commit = 0793503e19dbacc86432e495636876668657f806
Actions run = 33810395545
run number = 1
lease artifact ID = 9914556437
lease ZIP SHA-256 = dab85fe1c24a604f638c8a5ea70f9947470c935367cc7a01e719e78d2b69cd8d
result artifact ID = 9916587217
result ZIP SHA-256 = 63e55a9a8f5d6c3752c15cee06a01c327fd717606bf7086b3d1242f780126a4f
candidate trajectories = 48
resource eligible = 47
formal measured trajectories = 32
Stage disposition = FORMAL-COMPLETE
production / independent exact = true
same-evidence rerun = false
```

canonical scientific-resultのSHA-256:

`c5ec84cecb4e540ce7ad9f52548dac14deecde3423b2f4d10e1c39e1000ae09f`

canonical `STAGE_2_FORMAL_RESULT.json`のSHA-256:

`08f31652fb599cf9db9b839cbc07f8aabe06aed69215208ec0556e6ec3a5bf7a`

Stage 2のexact artifact file:

| file | SHA-256 | repository Git blob |
| --- | --- | --- |
| `STAGE_2_CANDIDATE_MANIFEST.json` | `b46288a8c25c3d00d0cb84500bda8af9adea943cc372cfbde467e05f59a0fb97` | `988b2268850459bdfa9c3538bab430bb2e18106c` |
| `STAGE_2_FORMAL_INFERENCE.json` | `21e287425efd7c58526e51dab8b9fe1867c8de86d6e4d32f8c3444f1a6aa2b76` | `f145872e92c4de3de2a7fc3708a0da48348dd6bf` |
| `STAGE_2_FORMAL_RESULT.json` | `08f31652fb599cf9db9b839cbc07f8aabe06aed69215208ec0556e6ec3a5bf7a` | `ae28d66afc61836053b4142f8aee454e0ca353b6` |
| `STAGE_2_LONGITUDINAL_SUMMARIES.json` | `3be240bfdcaadca6bb20d3bd68be7d331402b038982ab45ddc790f3070400d3c` | `d45a99bade90dcc1e185de12b55fc10ad56d31bc` |
| `STAGE_2_MEASURED_POPULATION.json` | `0f61c17635eadc69c02d55b5222b44e9b6fe60c7764c329b961752eecdd07296` | `5650765bd84920ebe74a48156b643202fca83647` |
| `STAGE_2_PREFLIGHT_ELIGIBILITY.json` | `55323993beefc0854875a9392d19c5043e2b26a246ca78bdc072ede5b8f874e8` | `e2da5c8d282492a1612a5bce7c26dc30f2f9f29a` |
| `STAGE_2_TRAJECTORY_MEASUREMENTS_INDEPENDENT.json` | `2adcfe49dcc6b9c9cddd178a28455414e8464c53af59364d2d670cf8f7232e08` | `f0a8a05bda16f5586abe77ff2beb6f1f969bd85f` |
| `STAGE_2_TRAJECTORY_MEASUREMENTS_PRODUCTION.json` | `2adcfe49dcc6b9c9cddd178a28455414e8464c53af59364d2d670cf8f7232e08` | `f0a8a05bda16f5586abe77ff2beb6f1f969bd85f` |

repositoryに保存したexact-byte mirror:

```text
mirror workflow run = 33816914860
mirror commit = 622dae1ede85b3e8856a86a3b647a056f7ac08db
scientific recomputation during mirror = false
```

## 6. formal decision（正式判断）

```text
C1 = CONFIRMED / ACTUAL-GREATER
C2 = CONFIRMED / ACTUAL-GREATER
C3 = CONFIRMED / ACTUAL-LESS
C4 = NOT-CONFIRMED
C5 = CONFIRMED / ACTUAL-GREATER
```

formal inference artifactの`results/stage-2/STAGE_2_FORMAL_INFERENCE.json`はcompactなexact test recordである。`results/stage-2/STAGE_2_FORMAL_RESULT.json`はcanonical Stage-level resultである。

## 7. 再現に関する境界

reproductionではcode pathの再構築とexact artifactの検証を行える。ただし、消費済みのStage 1 / Stage 2 seed blockを、このStudy / versionにおける新しいprospective confirmationとして再利用してはならない。protected complete exact depth-10 dataはsealedのままである。`main` integrationはrepository operationであり、scientific reproductionの一部ではない。
