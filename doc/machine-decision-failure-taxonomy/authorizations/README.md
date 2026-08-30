# MDFT-STUDY1 Authorizations

更新日: 2026-08-30
状態: **Study closed / Stage 1 authorization consumed / Stage 2 not authorized**

## Current authorization state

```text
Stage 1 = AUTHORIZED ONCE / EXECUTED / SEEDS CONSUMED
Stage 1 authorization = STAGE_1_EXECUTION_AUTHORIZATION.json
Stage 1 run = 33277102013
Stage 1 seeds 28910001..28914096 = CONSUMED
same-block rerun / repair / replacement / extension = NOT AUTHORIZED

Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
```

研究開始時点ではStage 1 / Stage 2 scientific executionのauthorizationは存在しませんでした。Stage 1はtechnical preflight、source freeze、runner readinessを満たした後にexplicit authorizationを発行し、そのauthorizationで1回だけconsume-once executionを行いました。

Stage 1 formal dispositionは`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`、Study formal decisionは`NON-ESTIMABLE`です。Stage 2 authorizationは作成していません。

Seed reservation、protocol、technical tooling、Stage 0 technical executionだけではscientific generation authorizationを意味しません。また、Stage 1の過去authorizationはsame-block再実行を許可しません。
