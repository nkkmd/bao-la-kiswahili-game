# SILGM-STUDY1 — Current Status

更新日: 2026-09-03

```text
Program position = Research Generation 3 / G3-07
Program review = G3-07-AUTHORIZED
Study = SILGM-STUDY1
Study status = PROSPECTIVE-FROZEN / STAGE 0 PASS / FRESH STAGE 1 NOT YET AUTHORIZED
review baseline remote main = 9e6ca03bbb36919b2fbf32d61639779c17b04932
Study baseline remote main = ba48c5c3643649655137d5d3c07988fdc84bee9d
research branch = research/g3-07-search-instability-local-geometry-mechanism
Stage 0 v1 = SILGM-S0-TECHNICAL-2026-09-03-v1 / TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = SILGM-S0-TECHNICAL-2026-09-03-v2 / TECHNICAL-INVALID / NO RERUN
Stage 0 v3 = SILGM-S0-TECHNICAL-2026-09-03-v3 / PRECOMPUTATION-TECHNICAL-INVALID / NO SAME-TRIGGER REUSE
Stage 0 v4 = SILGM-S0-TECHNICAL-2026-09-03-v4 / STAGE0-PASS
Stage 1 = SILGM-S1-DEVELOPMENT-2026-09-03-v1 / NOT YET AUTHORIZED / NOT EXECUTED
Stage 2 = SILGM-S2-FORMAL-2026-09-03-v1 / NOT AUTHORIZED / NOT EXECUTED
technical seeds = 31709001..31709008 / scientific use prohibited
Stage 1 seeds = 31710001..31710256 / RESERVED / NOT CONSUMED
Stage 2 seeds = 31720001..31720384 / RESERVED / NOT CONSUMED
fresh G3-07 scientific evidence = NOT GENERATED / NOT READ
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
main integration = NOT REQUESTED / NOT PERFORMED
```

## Formal titles

English:

**Search Instability / Local Geometry Mechanism Study 1 — Prospective exact association analysis of bounded RAW local game-tree geometry with best-move, TopSet, ranking, score-gap, and principal-variation changes under deterministic search-condition perturbations in Bao**

日本語:

**Baoにおける探索不安定性と局所ゲーム木幾何のprospective exact関連解析 — bounded RAW branching・reconvergence・reply compressionとbest-move・TopSet・ranking・score-gap・PV変動の決定論的search-condition間集中関係の検証**

## Stage 0 technical closure

Stage 0 v1はsynthetic G5 hand-derived expectationの誤記で`TECHNICAL-INVALID`、v2は固定technical Mtaji seedがfixture targetを供給せず`TECHNICAL-INVALID`、v3はverifier self-referenceによりcomputation前に`PRECOMPUTATION-TECHNICAL-INVALID`となった。いずれも同一versionをrerunしていない。

Fresh-freeにversioned correctionを行ったv4はexactly one authorized technical computationでPASSした。

```text
trigger commit = 422acd162877daceacac4189e0edcef266480c2d
workflow run = 33709314157
job = 100505215270
lease artifact = 9876354259
lease ZIP SHA-256 = 2a06fcfdcb56f92e84538dc27815e5cfe39a3f0f2ad8bc67532ee888c040ccbb
result artifact = 9876361267
result ZIP SHA-256 = 2da957aa86e149a55783246280adccbe4e3e5b458db6cec4eeda63f589326975
canonical result SHA-256 = c33f3979f068879913123447c66ae2d81146724d87db2b5f72f021bbe36348c8
deterministic technical core = fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076
technical roots = Namua 31709001/ply24; Mtaji 31709003/ply44
elapsedMs = 20603
peakRssBytes = 132632576
Stage 0 v4 = STAGE0-PASS
```

Stage 0はgeometry/search/endpoint/exact-test/independent-verificationの技術的実現可能性を検証しただけであり、G3-07 scientific associationについてpositive/negative/null evidenceを生成していない。

## Current scientific boundary

- geometry = LGTGMIV F1-F5 / RAW-only / relative depth 5 only
- search contrasts = depth / node-budget / quiescence, all peer contrasts
- deeper or larger-budget search = NOT TRUTH
- G2-02 scientific rows = NOT REUSED
- G3-02/G3-03/G3-05/G3-06 technical-invalid diagnostics = NOT SCIENTIFIC INPUT
- G3-04 C1/C6 = context only
- causal mechanism / objective move correctness / game-theoretic difficulty / human difficulty = NOT AUTHORIZED

## Next action

Stage 0 PASSはStage 1を自動authorizeしない。次の安全な工程は、fresh Stage 1 seedへ触れずに以下を完了することである。

1. Stage 1 population-selection salt / parity / ordering / firewall detailsをprospectively明文化する。
2. upstream identity-only firewallをmaterializeする。G3-06のselection mismatch diagnosticsやpartial scientific fieldsは保持しない。
3. production / independent Stage 1 selector・measurement・development-summary implementationを別実装する。
4. fresh-free static preauthorization auditでsource binding、independence、resource ceiling、one-shot execution pathを確認する。
5. そのauditがPASSした場合にのみ、別artifactでStage 1をexactly once authorizeする。

Fresh Stage 1 generation/read remains prohibited until an explicit Stage 1 authorization record is committed.
