# PEOCR-STUDY1 — 再現性索引

更新日: 2026-08-27

## Study anchor （基準点）

```text
Study ID = PEOCR-STUDY1
Program label = G2-01
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## 初期固定spec

```text
Stage 0 = 39f886334a4b7515053f35bc606928c2ebe9d7baa2c2d216a44b0b42be8209c7
Stage 1 = 3b5262105de7a804cbbbb67e9ad111212bef6f4859f722fcaea42e5504e8eb99
Stage 2 = 6ef20e20f639797c3d98673980e6e4b2c4c63a522e0c052ce523f6132a94ea60
```

## Stage 0 canonical evidence （証拠と成果物）

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-26-stage0-technical-pass.md`
- execution commit: `a3d8af5bbec005c61571d2533800775d87840283`
- workflow run: `32969621181`
- workflow artifact ID: `9607059405`
- artifact ZIP SHA-256: `645cd4925bc98c51ffead686a6a436a18c85771f11a3ceff999fdcc4153bcc6a`
- `production.json` SHA-256: `d0a72cad4e1c4612d30674bc3bc700a768b1ef5a3402f82343ec7b2fe58ca698`

### Stage 0 source hash （Stageの記録）

```text
public/engine.js = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js = 7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
tools/benchmark.js = 2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808
tools/experiments/lib/ssgtc-representation-production.js = eb9a25ff8026eee6efa1c4a1fe0b71e6b1bcd7701a1eb84bb46df679e5db913c
tools/experiments/run-g2-01-calibration-stage0-technical.js = 121c2155ba285f3e8db458035c1d4e2c2b7d6f6d383c53b43935ac72214c3106
tools/experiments/verify-g2-01-calibration-stage0-independent.js = 03b8bb04af2fd1ef35972b18ac9b02cd6b9639274a6e14b45a46047b3cae8b8f
```

## freeze前に監査したupstream record

- `doc/FUTURE_RESEARCH_AGENDA.md` Version 2.0.0, Section 9
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json`

## Stage 1 authorization前要件 — historical / satisfied

Stage 1 scientific generation前に、generation、selection、measurement、model fit、result writer、validator、independent verifierを含むcomplete Stage 1 scientific code pathのexact SHA-256を固定しました。

Stage 1 authorizationはfresh outcome生成前に、それらのhashとimmutable Stage 1 specへbindingしました。

## Stage 2 authorization前要件 — historical / satisfied

Stage 2 scientific generation前に、verified Stage 1 result、exact calibration mapping artifact、Stage 2 production / evaluation code、independent verifier、Stage 2 spec、exact source hashを固定しました。

Productionとindependent verification logicは、unverified shared scientific decision logicから分離しました。source-bound authorizationは以下に記録しています。

## Stage 1 canonical evidence （証拠と成果物）

- successful recovery workflow run: `33017663172`
- successful workflow artifact ID: `9632042234`
- workflow artifact ZIP SHA-256: `1c5f4c3440abda834b442ad9bb5ce811d777ed0750e8e3fdaeda0ab9c32a4e30`
- `results/STAGE_1_GENERATION_MANIFEST.json`: `97b996f96ee236d3ea0a049a2980a27655696119e776bcd6f42905fa205c4ef9`
- `results/STAGE_1_SELECTION_MEASUREMENT_SUMMARY.json`: `6ef950393ba290a7df6af7228539903f9cc23bcfe01bdc8c0c791c24bb0ebd01`
- `results/STAGE_1_VERIFICATION.json`: `792cb9bcf88402d785bc9ba581fba0f62c75f7e0d6ac49f6f99884c2a45173b5`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`: `93c449b5d28d5fe2a51375d867f27b47880b54bc13c0ec45c6206226edd47b75`
- `results/STAGE_1_FROZEN_MAPPING.json`: `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`
- selection hash: `4c46baef47f52ecff47d042fb7983a806c55d891717cb8f9d0afa2b483bd3b87`
- measurement hash: `a521051db2f9197094ff6b48c141b8b65378d4dac17c16fca6f38af939356b0b`

canonical mappingはsuccessful Stage 1 runのexact artifact bytesです。canonicalization時にrefitしていません。

## Stage 2 technical smoke evidence （証拠と成果物）

- workflow run: `33037897038`
- workflow artifact ID: `9632722463`
- artifact ZIP SHA-256: `e42e3ee6228363282bfb4abd3c55ea55fb51cc808ab34cb18ff1ed92c5da834a`
- `results/STAGE_2_TECHNICAL_SMOKE_RESULT.json`: `f2cf9b0bc0b091611e88871d8399a340e579c84f4b4143feaf85e266c0bc491e`
- `results/STAGE_2_TECHNICAL_SMOKE_VERIFICATION.json`: `1d5d9cba6869939d35156fa03069e9cf4490de8f291421d797d1545be82a5d6b`
- Stage 1 reference universe SHA-256: `5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063`
- frozen Stage 1 mapping SHA-256: `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`

## Stage 2 formal evidence / closure （最終状態）

- formal authorization commit: `5d1b4a40ef95ac639787aa0abf040a455c3c2995`
- formal workflow run: `33038132423`
- final formal artifact ID: `9636207301`
- final artifact ZIP SHA-256: `056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0`
- `results/STAGE_2_GENERATION_MANIFEST.json`: `1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411`
- `results/STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json`: `3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45`
- `results/STAGE_2_VERIFICATION.json`: `48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da`
- `results/STAGE_2_FORMAL_RESULT.json`: `42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c`
- selection hash: `eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea`
- measurement hash: `e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294`
- formal decision: `INCONCLUSIVE`
- scientific closure commit: `b651b98b6267ddfb6f7ac11814f3e23870c83404`

Fixed shard artifact:

```text
shard 0: ID 9636140572 / ebcfdea36bfe44b170b4fe6c46854738fc18208c686a06fd31de950826a7d49c
shard 1: ID 9636038055 / cdcf43299defed7043396608d49ba59455c6aa5bc3f8dfcb0f26f06e13a07792
shard 2: ID 9635952267 / 1bc3a847017c3107a6a4d0be385ad79fc2e69e86902f54b307ae4db6a8c97737
shard 3: ID 9636024667 / 9a525b98de3a7c151d7bbc5e59732d84d74c7141b43096c7d070936651e2d5b4
shard 4: ID 9636070999 / 727b499b15867d544c1377a9edfa92316b7b35686fee4117ab8424ec16e78118
shard 5: ID 9636162351 / a8452c5c0c363e957cda949b2357c54d45fe607f9915f5c1edbdec167269085a
shard 6: ID 9636005623 / 4612ac3ab7b3ae5e157f7c46c0e1c9b573f62efcc33ca297ccf3e9a8b53241d3
shard 7: ID 9635949547 / 139219e0d8b483b0f68bc9ca169d07ed17719e21e4e5699e336e39d808a71d6b
```

## repository integration （リポジトリ状態）

- integration PR: `#67`
- expected research head: `6e64cd5bb252eab40c2608fc88562ba7371b2602`
- integration merge commit: `12ce1f5f212349cc827147adcb5de8e7eadb98f3`
- integrated branch: `main`
- integration date: `2026-08-27`

Repository integrationは、final G2-01、second-generation agenda、SSGTC、PCEM、Phase Transition auditがすべてgreenになった後に実施しました。integrationによってcanonical scientific evidenceや`INCONCLUSIVE` decisionは変更していません。
