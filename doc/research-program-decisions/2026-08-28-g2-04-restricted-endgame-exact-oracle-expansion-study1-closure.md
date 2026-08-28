# G2-04 / REEOE-STUDY1 Closure — Research Generation 2 Program Decision

Date: 2026-08-28  
Status: **CLOSED / `INCONCLUSIVE`**

## Decision

Agenda item `G2-04` was instantiated as the prospective independent Study:

```text
Study ID = REEOE-STUDY1
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
```

The Study is closed with formal decision:

> **`INCONCLUSIVE`**

## Basis

Stage 0 technical validation passed and reproduced the immutable REWR 8-state / 7-edge exact fixture with independent graph/retrograde agreement and four corruption controls.

Stage 1 v1 was fail-closed as `TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED` after production development had run but the independent verifier failed at startup. The same evidence was not repaired/reused.

Fresh Stage 1 v2 preserved the v1 structural/resource/acceptance design and used fresh seeds `24041001..24041512`. Production and independent verification agreed on the full 512-trajectory scan, eligible population, first-eight selected roots, and closure classifications.

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

The prospectively frozen feasibility rule required at least three independently verified complete closures. Since `0 < 3`, Stage 1 v2 closed as `STAGE1-DEVELOPMENT-BLOCKED`.

## Stage 2 consequence

```text
REEOE-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
formal domains evaluated = 0
fresh G2-04 exact oracle produced = false
```

No Stage 2 formal-domain contract, source freeze, authorization, exact retrograde run, or domain-level decision was created.

## No rescue

The Study did not increase resource caps, shrink the structural domain after outcome, replace roots, extend seeds, ignore nontermination, promote partial closures, switch solver, or introduce symmetry/canonicalization.

A future exact-oracle expansion under a materially different structural restriction or resource contract requires a new prospective independent Study/versioned protocol and fresh evidence.

## Immutable boundaries

This closure changes none of the formal decisions of G2-01, G2-02, G2-03 or Research Generation 1. `REWR-STUDY1` remains exact only for its frozen 8-state / 7-edge domain. The validated transformation set remains empty and RAW identity remains authoritative.

## Program progression

`G2-04` counts as a completed Research Generation 2 agenda item because its prospectively specified failure/authorization rules produced a reproducible fail-closed decision. The next independent P0 machine-only agenda item may proceed as `G2-05 — Deep RAW State-Space Enumeration Study 1`, subject to a new prospective contract and repository-state audit.
