# SFCDFT-STUDY1 — Stage 1 GitHub Actions pre-execution ready

更新日: 2026-09-18

## 正式状態

`STAGE1-PRE-EXECUTION-READY / FRESH-SCIENTIFIC-SEED-ACCESS=0`

Stage 1はChatGPTの一時実行環境へ依存させず、GitHub Actions上のimmutable artifact pipelineで実行する設計へ固定した。

## Preflight結果

```text
workflow = SFCDFT Stage 1 pre-execution preflight
run ID = 35311556162
head = 0dac0a579c81338d237bfc6447e38aeb86b1464b
conclusion = success
artifact ID = 10533875253
artifact digest = sha256:35c226a7910a66b6f5ccd4b716595d7b96c8962a39cbbf29c246ac7a3436b05d
artifact retention = 30 days
```

次をすべてPASSした。

- final scientific authorizationがまだ存在しないこと
- Stage 1 source / bundler / measurement / aggregate / authorization gateのsyntax
- frozen Git blob binding
- 384 primary slot / 96 quartet matrix
- 8 seed-free measurement task matrix
- technical fixture source smoke
- 384-source artifact classifier completeness smoke
- durable START markerがseed readより先に保存される設計
- workflow rerun禁止
- manual workflow dispatch禁止
- source acquisitionとmeasurementの分離
- Stage 1 compatibility-only output boundary

## 実行経路

```text
one-shot final authorization creation
  -> authorization / parent-HEAD gate
  -> 384 primary source slots
  -> safe pre-read retry only when START marker absent
  -> paired reserve only for started-but-uncommitted primary
  -> final immutable source classification
  -> G3/G4 identity firewall
  -> frozen-order resource preflight until 8 pairs/domain
  -> sealed selected-source bundle
  -> 8 seed-free measurement tasks
  -> seed-free aggregate
```

fresh source full-workflow rerun、run attempt 2以降、seed extension、reserve-of-reserveは許可しない。

## 保護境界

Preflight完了時点でも次は未アクセスである。

```text
Stage 1 primary 40311001..40311384 = RESERVED / NOT ACCESSED
Stage 1 reserve 41311001..41311384 = RESERVED / NOT ACCESSED
Stage 2 primary/reserve = RESERVED / NOT ACCESSED
G3-11 depth 10 rerun = false
G3-12 Stage 2 access = false
G4-01 seed replay = false
G4-10 depth 11 access = false
public AI change = false
main integration = false
```

## 次のgate

このcheckpoint以後、final execution authorizationを一度だけ新規作成し、その作成pushをStage 1 fresh executionの唯一のtriggerとする。
