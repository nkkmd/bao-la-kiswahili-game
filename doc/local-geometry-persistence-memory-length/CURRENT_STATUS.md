# LGPML-STUDY1 — Current Status

更新日: 2026-09-03

```text
Program position = Research Generation 3 / G3-08
Program review = G3-08-AUTHORIZED
Study = LGPML-STUDY1
Study status = PROSPECTIVE-FROZEN / STAGE0-PASS / STAGE1 EXECUTING ONCE / RESULT NOT YET AVAILABLE
review/main baseline = 9f6abd3c9b146bb88c11dd04963052300e4cdc3b
research branch = research/g3-08-local-geometry-persistence-memory-length
Study/tooling freeze commit = b293acc5943fab9100f512ed7008dd46583be763
Stage 0 = LGPML-S0-TECHNICAL-2026-09-03-v1 / STAGE0-PASS / CLOSED / NO RERUN
Stage 0 run = 33727822427 / job 100560742801
Stage 0 result artifact = 9882655923 / ZIP SHA-256 44be205b804a549dfcf9d73cb99bbc3532ec946c8529134edf13f26326184c03
Stage 0 deterministic core = 6e51e95ae7afa97fb8993e698dbe7f290454433f012bb24cbc17b6d1d1b8411d
upstream identity firewall = MATERIALIZED / OUTCOME-FREE / root 269 / trajectory 244 / prefix 187
upstream identity core = d123435bb93d5746e7a1fee8b9b35d166a5bff57ce681c8df01d987a64f6a7d3
Stage 1 preauthorization audit = PASS / run 33729048934 / job 100564565986
Stage 1 = LGPML-S1-DEVELOPMENT-2026-09-03-v1 / AUTHORIZED / EXACTLY-ONE EXECUTION STARTED / RESULT NOT YET AVAILABLE
Stage 1 authorization commit = a7904798de848fe8af3bd7e66b1b81741590ba95
Stage 1 trigger commit = bfd0f7b0f754b4ffc14faae018a2ceb52647677f
Stage 1 run = 33731577464 / job 100572486927 / attempt 1
Stage 1 lease artifact = 9884042604 / ZIP SHA-256 61a50d3e5657dd8a84dc4e63780e9a715829db2daa8285e78d88dc3af22eda28
Stage 1 seeds = 31810001..31810256 / FRESH ACCESS STARTED / SEED BLOCK CONSUMED BY EXACTLY-ONE AUTHORIZED EXECUTION
no-rescue boundary = CROSSED AT STAGE 1 FRESH ACCESS
same-evidence Stage 1 rerun = PROHIBITED
Stage 2 = LGPML-S2-FORMAL-2026-09-03-v1 / NOT AUTHORIZED / NOT EXECUTED
Stage 2 pretooling audit v2 = PASS / run 33732602250 / job 100575749583 / synthetic-only
Stage 2 seeds = 31820001..31820384 / NOT CONSUMED
technical seeds = 31809001..31809008 / scientific use prohibited
technical seed actually used = 31809002
lag set = 1,2,4,8
geometry panel = G1..G6 / LGTGMIV F1-F5 / RAW-only / relative depth 5
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED
```

現在はStage 1 exactly-one scientific run `33731577464` の完了待ちである。結果がdurable artifactとして生成された場合のみexact-byte recoveryを行い、再計算はしない。Stage 1 dispositionが`STAGE1-PASS`かつpromoted candidate >0の場合に限り、Stage 1 measurement rowsをselectionへ持ち込まないidentity-only / promoted-candidate-only Stage 2 inputsをmaterializeし、別のStage 2 authorization reviewへ進む。mainへの統合はユーザーの明示指示まで禁止する。
