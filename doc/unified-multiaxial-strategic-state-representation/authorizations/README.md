# UMSSR-STUDY1 — authorization管理

## 現在のauthorization状態

2026-08-30のinitial prospective freeze時点では、G2-10のscientific executionはまだ承認していない。

```text
Stage 0 = technical-only / scientific inference not authorized
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
```

Stage 0はscientific evidenceを生成しないtechnical / eligibility / feasibility段階である。initial freezeの整合性監査完了後、technical-only fixture / smoke / validatorを実行できる。

## Stage 1 authorizationの必要条件

Stage 1 scientific seed `29310001..29314096`を消費する前に、少なくとも次を結果を見る前に固定し、明示的authorization artifactへbindingする。

- Stage 0の`STAGE0-TECHNICAL-PASS`
- scientific source commit / source hashes
- engine / evaluator / search semantics
- source generation / root selection contract
- candidate axis set
- feature dictionary
- scaling / quantization / serialization
- dimensionality reduction / clustering候補とselection rule
- Stage 1 readiness gate
- representation promotion rule
- Stage 2 endpoint / threshold / decision mappingの事前定義
- independent implementation / comparer
- resource ceiling / artifact completeness policy

これらが満たされる前にStage 1をauthorizeしない。

## Stage 2 authorizationの必要条件

Stage 2 scientific seed `29410001..29418192`は、Stage 1が事前固定したglobal readiness / representation promotion gateをすべて満たし、representationが`STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`として固定された場合にのみ、別の明示的authorizationで消費できる。

Stage 1がtechnical-invalid、non-estimable、resource-censored、またはno-representationで閉じた場合、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`のままとする。

## 禁止

- authorization前のscientific seed消費
- technical smokeへのscientific seed流用
- outcome確認後のauthorization prerequisite緩和
- G2-09の未消費seed blockの再利用
- not-authorized Stageを実行済みとみなすこと
