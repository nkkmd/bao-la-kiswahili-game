# SILGM-STUDY1 — Current Status

更新日: 2026-09-03

```text
Program position = Research Generation 3 / G3-07
Program review = G3-07-AUTHORIZED
Study = SILGM-STUDY1
Study status = CLOSED / FORMAL-COMPLETE
review baseline remote main = 9e6ca03bbb36919b2fbf32d61639779c17b04932
Study baseline remote main = ba48c5c3643649655137d5d3c07988fdc84bee9d
research branch = research/g3-07-search-instability-local-geometry-mechanism
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = TECHNICAL-INVALID / NO RERUN
Stage 0 v3 = PRECOMPUTATION-TECHNICAL-INVALID / NO SAME-TRIGGER REUSE
Stage 0 v4 = STAGE0-PASS
Stage 1 = SILGM-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-PASS / CLOSED / NO RERUN
Stage 2 = SILGM-S2-FORMAL-2026-09-03-v1 / STAGE2-PASS / CLOSED / NO RERUN
technical seeds = 31709001..31709008 / scientific use prohibited
Stage 1 seeds = 31710001..31710256 / CONSUMED
Stage 2 seeds = 31720001..31720384 / CONSUMED
fresh G3-07 scientific evidence = Stage 1 + Stage 2 generated/read under separate exactly-one authorizations
no-rescue boundary = CROSSED / CLOSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = COMPLETE / FAST-FORWARD / source branch tip 7f14538aa0ec3edd2045649025715219ffea17ec
```

## Formal titles

English:

**Search Instability / Local Geometry Mechanism Study 1 — Prospective exact association analysis of bounded RAW local game-tree geometry with best-move, TopSet, ranking, score-gap, and principal-variation changes under deterministic search-condition perturbations in Bao**

日本語:

**Baoにおける探索不安定性と局所ゲーム木幾何のprospective exact関連解析 — bounded RAW branching・reconvergence・reply compressionとbest-move・TopSet・ranking・score-gap・PV変動の決定論的search-condition間集中関係の検証**

## Stage 0 technical closure

Stage 0 v4はexactly-one technical executionで`STAGE0-PASS`。canonical result SHA-256は`c33f3979f068879913123447c66ae2d81146724d87db2b5f72f021bbe36348c8`、deterministic coreは`fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076`。

## Stage 1 development closure

```text
workflow run = 33714665861
job = 100521197935
lease artifact = 9878071217
result artifact = 9878178694
canonical scientific-result SHA-256 = 20209db1b87bdf3e87f48f1968014154d6f2862820eabea40be645cd1f924470
selected roots = Namua 24 + Mtaji 24 = 48
selection exact = true
Stage 1 = STAGE1-PASS
promoted candidates = 8
```

The 8 promoted candidates were development-selected formal hypotheses only and were frozen before Stage 2 evidence.

## Stage 2 formal closure

Stage 2 formal input retained only the 8 promoted candidate identities and Stage-1 identity exclusions. Stage-1 measurement rows and non-promoted candidate details were not formal selection inputs.

```text
formal input core = 6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0
preauthorization run = 33716437350
preauthorization = STAGE2-PREAUTH-STATIC-AUDIT-PASS
authorization review commit = 49a5bf7aa33e69c20ed79cf64a0d18eca628426a
scientific tooling commit = ba35c4ad817795158424f577c51c1e689b1d29d8
machine authorization commit = db439ed6ba74184b5f522c32116259ecbf76a005
execution trigger commit = 872da6b0507b91845516ca54da0da8058844d893
workflow run = 33716884975
job = 100527827048
lease artifact = 9878826404
lease ZIP SHA-256 = 28a365ea1736d4924131f51b507547ffeea25c1396c35031cffaae145fea578c
result artifact = 9879091983
result ZIP SHA-256 = 5ada1dcb0ceab7d89ea0bfc78410a14c3875ba03a01e31a243950706349de70a
canonical scientific-result SHA-256 = 05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9
selected roots = Namua 36 + Mtaji 36 = 72
selection production/independent exact = true
measurement core = 525efb5fff335bf22b0cf1a6f52e2944958055449bc80457af03c0e385c7ead5
formal core = 91d02434fbe6ba19784e4ef0d0c4099d54821a969b8ada8ac23d883d6712deda
scientific core = 2355969853b4e4d7faea063cee828f9713f94c38d8e0fed68386638717184849
Stage 2 = STAGE2-PASS
```

Formal result:

```text
promoted = 8
estimable = 7
CONFIRMED = 3
NOT-CONFIRMED = 4
NON-ESTIMABLE = 1
```

Confirmed candidate identities:

1. `SILGM-SC1-DEPTH|SILGM-E3-RANKING-PREORDER-CHANGE|SILGM-G1-ROOT-LEGAL-WIDTH|HIGHER-IN-HIGH`
2. `SILGM-SC2-NODE-BUDGET|SILGM-E3-RANKING-PREORDER-CHANGE|SILGM-G1-ROOT-LEGAL-WIDTH|HIGHER-IN-HIGH`
3. `SILGM-SC3-QUIESCENCE|SILGM-E3-RANKING-PREORDER-CHANGE|SILGM-G1-ROOT-LEGAL-WIDTH|HIGHER-IN-HIGH`

Thus, within the frozen Stage-2 population and search contract, high root legal width was formally associated with concentration of ranking-preorder change under each of the three peer search-condition perturbation families. This is a bounded non-causal association and does not identify an objectively correct search condition or game-theoretic difficulty.

## Scientific boundary

- geometry = LGTGMIV F1-F5 / RAW-only / relative depth 5 only
- search contrasts = depth / node-budget / quiescence, all peer contrasts
- deeper or larger-budget search = NOT TRUTH
- G2-02 scientific rows = NOT REUSED
- G3-02/G3-03/G3-05/G3-06 technical-invalid diagnostics = NOT SCIENTIFIC INPUT
- G3-04 C1/C6 = context only
- causal mechanism / objective move correctness / game-theoretic difficulty / human difficulty = NOT AUTHORIZED
- NOT-CONFIRMED does not mean universal absence of association
- NON-ESTIMABLE does not mean null
- Stage 1 and Stage 2 evidence cannot be repaired, extended or rerun within this Study
- protected depth-10 remains sealed

## Closure artifacts

- `STUDY_1_FINAL_REPORT.md`
- `REPRODUCIBILITY_INDEX.md`
- `DECISION_REGISTER.md`
- `results/stage-1/STAGE_1_RESULT_SUMMARY.json`
- `results/stage-2/STAGE_2_RESULT_SUMMARY.json`
- `checkpoints/2026-09-03-stage-2-formal-complete-study-closure.md`
- `checkpoints/2026-09-03-final-document-consistency-pass.md`
- `checkpoints/2026-09-03-final-document-consistency-followup-pass.md`
- `../research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md`

## Next action

G3-07 scientific execution and research-branch documentation consistency work are complete.

**Historical closure-time downstream boundary:** at G3-07 closure, the next program-level scientific action was a separate post-G3-07 current-state G3-08 authorization review, and G3-08 was not authorized automatically. That review was later completed. Current program state: G3-08 / `LGPML-STUDY1` is `CLOSED / TECHNICAL-INVALID`; G3-09 / `CLGR-STUDY1` has subsequently completed as `CLOSED / TECHNICAL-INVALID`, with formal continuous-representation eligibility not established; G3-10 remains `NOT AUTHORIZED` pending a separate post-G3-09 current-state authorization review.

Main integration is complete after explicit user instruction. The closed research branch is retained for provenance.

No further G3-07 merge action is required. Any new scientific work still requires a separate prospective authorization.
