# LGTGGC-STUDY1 — Decision Register

更新日: 2026-09-04

## LGTGGC-D001 — Program authorization

**Decision:** `G3-12-AUTHORIZED`。

**Basis:** post-G3-11 current-state review found sufficient formal positive claim supply from G3-04/G3-07/G3-10, eligible measurement instruments, fresh evidence feasibility without protected depth-10 rerun/depth-11 access, scientific identifiability under a bounded claim-specific matrix, and feasible resource scope.

## LGTGGC-D002 — Formal Study identity

**Decision:** `LGTGGC-STUDY1`。

Study IDはrepository naming convention確認後、scientific outcome生成前に固定した。

## LGTGGC-D003 — Stage identities

Base prospective identities:

```text
LGTGGC-S0-TECHNICAL-2026-09-04-v1
LGTGGC-S1-DEVELOPMENT-2026-09-04-v1
LGTGGC-S2-FORMAL-2026-09-04-v1
```

Stage 0 technical executionはpre-fresh versioningによりv3がactive PASS versionとなった。Stage 1/2 scientific executionはStage 0 PASSだけではauthorizeしない。

## LGTGGC-D004 — Eligible upstream claims

Formal targetsを次の9 claim identitiesに限定する。

- G3-04 C1 / C6
- G3-07 SC1×E3×G1 / SC2×E3×G1 / SC3×E3×G1
- G3-10 C1 / C2 / C3 / C5

## LGTGGC-D005 — Ineligible upstream claims

Technical-invalid upstream Studies、G3-07 not-confirmed/non-estimable candidates、G3-10 C4をpositive targetにしない。

G3-11 H1..H4はgeneralization targetにせず、historical exact anchor / boundary reference / comparatorに限定する。

## LGTGGC-D006 — Active source policies

Original pre-Stage0 freeze had:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-CAPTURE-FIRST
```

Authoritative engine semantics enforce capture priority within legal-move generation in both phases, making original P2 observationally identical to P1. This was detected before Stage 0 execution and before any scientific seed access.

The active pre-fresh versioned correction is therefore:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

Both use Mulberry32 and canonical legal ordering. P2 evaluates the exact immediate authoritative capture-event seed count for all currently legal moves, keeps all moves at the exact maximum, then selects within that pool using the same PRNG rule. Geometry/search/outcome/prior scientific values are not used.

The original P2 remains historical provenance and is not silently rewritten.

## LGTGGC-D007 — Reachable-root families

Formal root familyを2つに固定する。

```text
RF1 EARLY-ANCHOR: Namua ply24 / first nonterminal Mtaji >=44
RF2 LATE-ANCHOR: Namua ply32 / Mtaji ply56
```

## LGTGGC-D008 — Rule-context boundary

Capture、reserve、houseOwned/nyumba、pending、root legal width、plyをpre-specified exact descriptorsとして保存する。

これらをprimary failure後のfavorable subgroup rescueに使用しない。Reserveはphase couplingのため独立causal/generalization axisへ無理に昇格させない。Root legal widthはSILGM predictorそのものなので同claimの独立axisとして二重使用しない。

## LGTGGC-D009 — SILGM thresholds

G3-07 confirmed candidate identityに含まれるthresholdをそのまま固定する。

```text
Namua = 4/1
Mtaji = 3/1
```

G3-12 development dataからrelearnしない。

## LGTGGC-D010 — Counterexample symmetry

G3-12 formal testはsame-direction generalizationだけでなくopposite-direction counterexampleもprospectively判定できるtwo-sided exact testとする。

Formal labels:

```text
GENERALIZATION-CONFIRMED
COUNTEREXAMPLE-CONFIRMED
NOT-GENERALIZED
NON-ESTIMABLE
TECHNICAL-INVALID
```

`NOT-GENERALIZED`をcounterexampleと同一視しない。

## LGTGGC-D011 — Development Stage cannot select claims

Stage 1はsupport / definedness / exact agreement / resource readinessのみを評価し、effect-based promotion、direction selection、p-value、threshold learningを行わない。

Formal claim setとformal axesはStage 1後も変更しない。

## LGTGGC-D012 — Fresh seed blocks

Frozen Stage 1:

```text
SFCDF 32311001..32311384
SILGM 32312001..32312768
GCLD  32313001..32313384
```

Frozen Stage 2:

```text
SFCDF 32321001..32321768
SILGM 32322001..32323536
GCLD  32324001..32324768
```

Seed extension = `NOT AUTHORIZED`。

## LGTGGC-D013 — Protected depth boundary

```text
G3-11 depth-10 = historical read-only published result
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

G3-12 technical/resource designのためのdepth-11 probeも行わない。

## LGTGGC-D014 — RAW identity / symmetry

```text
RAW = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
```

Reflection、seat swap、symmetry quotient、canonicalization collapseを導入しない。

## LGTGGC-D015 — G2-12 estimator

G2-12 estimator scientific input = `NOT AUTHORIZED`。

## LGTGGC-D016 — Multiplicity

Cross-module omnibus p-valueを作らない。Distinct upstream claim constructsを次の3 formal familiesでHolm controlする。

```text
SFCDF-TRANSFER = 8 fixed tests
SILGM-TRANSFER = 12 fixed tests
GCLD-TRANSFER = 8 fixed tests
family alpha = 1/20 each
```

## LGTGGC-D017 — Main integration

Research branch上でStudyを完結させる。明示的なuser instructionまで`main` integrationを行わない。

## LGTGGC-D018 — Stage 0 V1 disposition

**Decision:** `PRE-EXECUTION-TECHNICAL-INVALID / NOT EXECUTED`。

Reason: original P1/P2 source-policy non-identifiability under authoritative capture-priority legal semantics. Scientific seed access = 0. This is not a scientific negative result.

## LGTGGC-D019 — Stage 0 V2 disposition

**Decision:** `PRECOMPUTATION-TECHNICAL-INVALID / SCIENTIFIC-EXECUTION-NOT-CONSUMED`。

```text
Actions run = 33842965132
job = 100928827303
failure point = static node --check
technical seed access = 0
scientific seed access = 0
same V2 rerun = NOT AUTHORIZED
```

A missing closing parenthesis in the technical runner prevented authorization verification and all computation. V3 was a separately frozen syntax-only correction.

## LGTGGC-D020 — Stage 0 V3 technical PASS

**Decision:** `STAGE0-PASS`。

```text
Stage = LGTGGC-S0-TECHNICAL-2026-09-04-v3
Actions run = 33843233392
job = 100929620604
artifact ID = 9925602227
artifact ZIP digest = sha256:f3028a64a0eaaaa1060dfc2c7e20df190570aff9d559f068092cc4cbdd97f5c7
result.json SHA-256 = 90bd98fb4f820fe362b1a4e10c9b1f3b9aeaa202f44533fda6283a67c5629e7b
technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
```

All mandatory technical controls passed. The active P1/P2 policies produced different trajectories for all 64 technical seeds, with 2,882 observed choice points having nonconstant immediate capture counts. Production and independent replay were exact.

This PASS establishes technical readiness only. Stage 1 remains separately gated.

## LGTGGC-D021 — Post-Stage0 boundary

Stage 0 PASS does not authorize Stage 1. A separate pre-fresh Stage 1 authorization review must be recorded before any Stage 1 scientific seed is generated/read.
