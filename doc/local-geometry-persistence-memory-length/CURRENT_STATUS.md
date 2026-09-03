# LGPML-STUDY1 — Current Status

更新日: 2026-09-03

```text
Program position = Research Generation 3 / G3-08
Program review = G3-08-AUTHORIZED
Study = LGPML-STUDY1
Study status = CLOSED / TECHNICAL-INVALID
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
Stage 1 = LGPML-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-TECHNICAL-INVALID / 1 authorized / 1 actual
Stage 1 authorization commit = a7904798de848fe8af3bd7e66b1b81741590ba95
Stage 1 trigger commit = bfd0f7b0f754b4ffc14faae018a2ceb52647677f
Stage 1 run = 33731577464 / job 100572486927 / attempt 1 / workflow conclusion failure after canonical technical-invalid result
Stage 1 lease artifact = 9884042604 / ZIP SHA-256 61a50d3e5657dd8a84dc4e63780e9a715829db2daa8285e78d88dc3af22eda28
Stage 1 result artifact = 9886738874 / ZIP SHA-256 ef2ed1d6c28b30461d03f3a294cb3cb3d11d9f951fa24b6e6f2a94f546d6f53c
Stage 1 scientific-result.json SHA-256 = e8bb384dd8ba526029ee62753836847f25b45546e013fb4b224f5ab02c68a46c
Stage 1 result mirror commit = 79fb4c51940d255e05c8e1c5469f1f759b81bf26
Stage 1 technical error = relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e
Stage 1 seeds = 31810001..31810256 / CONSUMED
formal promoted candidate set = []
no-rescue boundary = CROSSED / ACTIVE
same-evidence Stage 1 rerun = PROHIBITED
Stage 2 = LGPML-S2-FORMAL-2026-09-03-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 pretooling audit v2 = PASS / run 33732602250 / job 100575749583 / synthetic-only
Stage 2 seeds = 31820001..31820384 / NOT CONSUMED
technical seeds = 31809001..31809008 / scientific use prohibited
technical seed actually used = 31809002
lag set = 1,2,4,8
geometry panel = G1..G6 / LGTGMIV F1-F5 / RAW-only / relative depth 5
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = COMPLETE / FAST-FORWARD / source tip 72bd208267359f461e9dbbde938bb952eb01b91c / force=false
```

LGPML-STUDY1はfresh Stage 1のexactly-one authorized execution中にrequired bounded RAW reconstructionで`relay-limit` technical errorへ到達し、complete 10-trajectory development populationを生成できなかったため、`CLOSED / TECHNICAL-INVALID`で閉鎖する。partial 9 trajectoriesはtechnical provenanceであり、formal persistence candidateやmemory-length claimへ使用しない。Stage 2はauthorizeせず、Stage 2 seed blockとprotected depth-10 holdoutは未アクセスのまま保持する。mainへの統合は2026-09-03の明示的ユーザー指示を受け、research branch tipからfast-forward / force=falseで完了した。
