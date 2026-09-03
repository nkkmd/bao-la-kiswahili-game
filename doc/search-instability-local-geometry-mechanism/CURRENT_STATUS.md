# SILGM-STUDY1 — Current Status

更新日: 2026-09-03

```text
Program position = Research Generation 3 / G3-07
Program review = G3-07-AUTHORIZED
Study = SILGM-STUDY1
Study status = STAGE 0 PASS / STAGE 1 PASS / STAGE 2 AUTHORIZATION REVIEW PENDING
review baseline remote main = 9e6ca03bbb36919b2fbf32d61639779c17b04932
Study baseline remote main = ba48c5c3643649655137d5d3c07988fdc84bee9d
research branch = research/g3-07-search-instability-local-geometry-mechanism
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = TECHNICAL-INVALID / NO RERUN
Stage 0 v3 = PRECOMPUTATION-TECHNICAL-INVALID / NO SAME-TRIGGER REUSE
Stage 0 v4 = STAGE0-PASS
Stage 1 = SILGM-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-PASS / CLOSED / NO RERUN
Stage 2 = SILGM-S2-FORMAL-2026-09-03-v1 / NOT AUTHORIZED / NOT EXECUTED
technical seeds = 31709001..31709008 / scientific use prohibited
Stage 1 seeds = 31710001..31710256 / CONSUMED
Stage 2 seeds = 31720001..31720384 / RESERVED / NOT CONSUMED
fresh G3-07 scientific evidence = Stage 1 generated/read under exactly-one authorization
no-rescue boundary = CROSSED at Stage 1
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT REQUESTED / NOT PERFORMED
```

## Formal titles

English:

**Search Instability / Local Geometry Mechanism Study 1 — Prospective exact association analysis of bounded RAW local game-tree geometry with best-move, TopSet, ranking, score-gap, and principal-variation changes under deterministic search-condition perturbations in Bao**

日本語:

**Baoにおける探索不安定性と局所ゲーム木幾何のprospective exact関連解析 — bounded RAW branching・reconvergence・reply compressionとbest-move・TopSet・ranking・score-gap・PV変動の決定論的search-condition間集中関係の検証**

## Stage 0 technical closure

Stage 0 v4はexactly-one technical executionで`STAGE0-PASS`。canonical result SHA-256は`c33f3979f068879913123447c66ae2d81146724d87db2b5f72f021bbe36348c8`、deterministic coreは`fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076`。

## Stage 1 development closure

Stage 1はfresh-free preauthorization audit PASS後に別途`STAGE1-AUTHORIZED`とし、exactly one fresh executionを行った。

```text
trigger commit = 487a8a760f47862a24d2dd22abc1c20276221a6e
authorization commit = bb6e1ebe7cd3b1ff4c0b391c0a716617a0d9faa2
tooling commit = 11d7b29234f5eddfd30fa85821efaf4ac1e4ce15
workflow run = 33714665861
job = 100521197935
lease artifact = 9878071217
lease ZIP SHA-256 = 1266666a9c3583a38def48d5df8734e0dcc8a1cf0a0e7e53435d75e850db7888
result artifact = 9878178694
result ZIP SHA-256 = e6908832c5617cc3a015996d2ea59cee1ba247a6078b64cd408d85697d1fdc03
scientific-result canonical SHA-256 = 20209db1b87bdf3e87f48f1968014154d6f2862820eabea40be645cd1f924470
Stage 1 = STAGE1-PASS
selected roots = Namua 24 + Mtaji 24 = 48
selection production/independent exact = true
selection core = 06a230341ea10fd20b60739061067240dd5696f155b2a25e3004619ffb27903c
measurement core = 713c11f110f04f8bb82fd8dbde0873c4114728615383dcd701f0d10be7b60288
development core = 3017dbf4cf10736a8c9a5b923e0422a3e46867f06dd7a74c4545f684166567b7
scientific core = e347099b3506f323351066ccc589942101fa48b1d8e0293dbf8a614f0063f74a
promoted candidates = 8
```

The 8 promoted candidates are **development-selected formal hypotheses only**. They are not confirmations and cannot be replaced by non-promoted alternatives.

## Current scientific boundary

- geometry = LGTGMIV F1-F5 / RAW-only / relative depth 5 only
- search contrasts = depth / node-budget / quiescence, all peer contrasts
- deeper or larger-budget search = NOT TRUTH
- G2-02 scientific rows = NOT REUSED
- G3-02/G3-03/G3-05/G3-06 technical-invalid diagnostics = NOT SCIENTIFIC INPUT
- G3-04 C1/C6 = context only
- causal mechanism / objective move correctness / game-theoretic difficulty / human difficulty = NOT AUTHORIZED
- Stage 1 no-rescue boundary has crossed; Stage 1 cannot be repaired or rerun.

## Next action

Stage 2 is not automatically authorized. The next safe sequence is:

1. materialize a Stage-2 input containing only the 8 promoted identities plus Stage-1 identity exclusions;
2. freeze Stage-2-specific population salts, 36+36 population rule, resource ceilings and formal execution contract without Stage-2 seed access;
3. implement separate production/independent Stage-2 selector, measurement and exact formal-test paths;
4. run a fresh-free Stage-2 preauthorization static audit;
5. conduct a separate Stage-2 authorization review;
6. only if explicitly `STAGE2-AUTHORIZED`, execute `31720001..31720384` exactly once.

Stage 2 seed access remains prohibited until that chain is complete.
