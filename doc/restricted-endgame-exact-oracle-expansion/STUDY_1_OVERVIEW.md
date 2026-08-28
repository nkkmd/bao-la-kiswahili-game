# Restricted Endgame Exact Oracle Expansion Study 1 — Overview

Updated: 2026-08-28  
Status: **COMPLETED / `INCONCLUSIVE` / STAGE 2 NOT AUTHORIZED**

## Study identity

```text
Program label = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Research branch = research/g2-04-restricted-endgame-exact-oracle-expansion
PR = #70
```

日本語作業表記:

**Baoにおける限定終盤exact oracleの拡張 — prospectively selected RAW-state domains に対する complete forward closure, exact retrograde analysis, cycle structure, distance, and optimal-move multiplicity の厳密解析**

## Question

複数のrestricted Bao endgame domainをoutcome-blindにprospectively選択し、authoritative RAW identityの下でcomplete forward closureを証明したうえで、exact retrograde analysisに進めるかを検証した。

## Representation boundary

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
symmetry reduction / canonicalization / quotient graph = prohibited
```

## Stage outcome

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
  STAGE0-TECHNICAL-PASS

REEOE-S1-DEVELOPMENT-2026-08-28-v1
  TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED

REEOE-S1-DEVELOPMENT-2026-08-28-v2
  STAGE1-DEVELOPMENT-BLOCKED

REEOE-S2-FORMAL-2026-08-28-v1
  NOT-AUTHORIZED-NOT-EXECUTED
```

## Stage 0

The immutable REWR 8-state / 7-edge domain was reconstructed only as a technical regression fixture. Production and independent paths reproduced the graph, predecessor relation, exact solution, DTF and all optimal/max-resistance moves; all four corruption controls were detected.

```text
workflowRunId = 33150063023
artifactId = 9677327024
artifactZipSha256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
```

No fresh G2-04 scientific result was generated in Stage 0.

## Stage 1

Stage 1 v1 was fail-closed after production development had run but the independent verifier failed at startup. The same evidence was not repaired and rerun.

A fresh v2 preserved the structural/resource/acceptance design and used seeds `24041001..24041512`. Production and independent verification agreed on the full scan, eligible set, selected roots, and closure classifications.

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

The prospectively frozen acceptance required at least 3 independently verified complete closures. Therefore v2 closed as `STAGE1-DEVELOPMENT-BLOCKED`.

## Complete-closure boundary

No incomplete or resource-censored graph was promoted to exact. `ADMIN-CUTOFF` is not a game outcome. `MOVE-NONTERMINATION` is an intra-move transition-instrument classification and is not automatically a game-level `RECURRENT` or `DRAW` result.

## Stage 2 and formal decision

Because the Stage 1 v2 feasibility gate failed, no Stage 2 formal-domain contract or authorization was created.

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal domains evaluated = 0
fresh G2-04 exact oracle produced = false
formalDecision = INCONCLUSIVE
```

No cap increase, domain shrinkage, root replacement, seed extension, solver substitution, partial-closure promotion, symmetry reduction, or canonicalization rescue was used.

## Upstream boundary

G2-01, G2-02, G2-03, REWR, ORISC, SSGTC and AI-engineering results remain unchanged. In particular, REWR remains exact only within its frozen 8-state/7-edge domain and the validated transformation set remains empty.

## Canonical records

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`

A future exact-oracle expansion under a materially different structural/resource contract requires a new prospective independent Study/versioned protocol with fresh evidence.
