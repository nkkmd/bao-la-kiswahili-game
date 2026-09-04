# LGTGGC-STUDY1 — Decision Register

更新日: 2026-09-04

## LGTGGC-D001 — Program authorization

**Decision:** `G3-12-AUTHORIZED`。

**Basis:** post-G3-11 current-state review found sufficient formal positive claim supply from G3-04/G3-07/G3-10, eligible measurement instruments, fresh evidence feasibility without protected depth-10 rerun/depth-11 access, scientific identifiability under a bounded claim-specific matrix, and feasible resource scope.

## LGTGGC-D002 — Formal Study identity

**Decision:** `LGTGGC-STUDY1`。

Study IDはrepository naming convention確認後、scientific outcome生成前に固定した。

## LGTGGC-D003 — Stage identities

```text
LGTGGC-S0-TECHNICAL-2026-09-04-v1
LGTGGC-S1-DEVELOPMENT-2026-09-04-v1
LGTGGC-S2-FORMAL-2026-09-04-v1
```

Stage 1/2 fresh scientific executionはprotocol freezeだけではauthorizeしない。

## LGTGGC-D004 — Eligible upstream claims

Formal targetsを次の9 claim identitiesに限定する。

- G3-04 C1 / C6
- G3-07 SC1×E3×G1 / SC2×E3×G1 / SC3×E3×G1
- G3-10 C1 / C2 / C3 / C5

## LGTGGC-D005 — Ineligible upstream claims

Technical-invalid upstream Studies、G3-07 not-confirmed/non-estimable candidates、G3-10 C4をpositive targetにしない。

G3-11 H1..H4はgeneralization targetにせず、historical exact anchor / boundary reference / comparatorに限定する。

## LGTGGC-D006 — Source policies

Formal source-policy familyを2つに固定する。

```text
LGTGGC-P1-UNIFORM-LEGAL
LGTGGC-P2-CAPTURE-FIRST
```

どちらもMulberry32 + canonical legal ordering。P2はcapture available時にcapture poolを使用する。

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
