# Authorizations

## Current authorization state

| Stage | Stage ID | Authorization |
|---|---|---|
| Stage 0 | `TMGC-S0-TECHNICAL-2026-08-30-v1` | `CLOSED-STAGE0-TECHNICAL-PASS` |
| Stage 1 | `TMGC-S1-DEVELOPMENT-2026-08-30-v1` | `NOT-AUTHORIZED-PENDING-TOOLING-SMOKE-AND-SOURCE-FREEZE` |
| Stage 2 | `TMGC-S2-FORMAL-2026-08-30-v1` | `NOT-AUTHORIZED` |

Stage 0 closureはStage 1を自動authorizeしない。

Stage 1 authorizationの発行には、少なくとも以下が必要である。

1. Stage 1 production source generator / measurement / boundary evaluation toolingのmaterialization
2. G2-09固有classification helperを共有しないindependent verification path
3. technical-only smokeでexact verification
4. `STAGE_1_2_BOUNDARY_CONTRACT.json`との一致
5. source file hash freeze
6. Stage 1 seed block `29110001..29114096`が未消費であることの再確認
7. resource/artifact/shard readinessの維持

これらを満たすまでStage 1 scientific seedを使用しない。
