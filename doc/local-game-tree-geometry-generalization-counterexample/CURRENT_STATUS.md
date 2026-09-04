# LGTGGC-STUDY1 — Current Status

更新日: 2026-09-04

```text
Program position = Research Generation 3 / G3-12
Program authorization = G3-12-AUTHORIZED
Study = LGTGGC-STUDY1
Lifecycle = STARTED / STAGE0-PASS / PRE-STAGE1-SCIENTIFIC-EXECUTION
Source main HEAD = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
Research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
Stage 0 v1 = PRE-EXECUTION-TECHNICAL-INVALID / NOT EXECUTED / P1-P2 non-identifiability
Stage 0 v2 = PRECOMPUTATION-TECHNICAL-INVALID / technical seed access 0 / NO RERUN
Stage 0 v3 = LGTGGC-S0-TECHNICAL-2026-09-04-v3 / STAGE0-PASS
Stage 0 v3 Actions run = 33843233392 / success
Stage 0 v3 artifact ID = 9925602227
Stage 0 v3 technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
Stage 1 = LGTGGC-S1-DEVELOPMENT-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
Stage 2 = LGTGGC-S2-FORMAL-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
Fresh G3-12 Stage 1/2 scientific seed access = 0
Fresh G3-12 scientific evidence generated/read/peeked = 0
Protected G3-11 depth-10 rerun = false / NOT AUTHORIZED
Depth-11 access = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT AUTHORIZED / NOT USED
Main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Active pre-fresh amendment

The base protocol/spec remains a historical prospective record. Before any Stage 0 execution, authoritative engine semantics showed that the original `P2-CAPTURE-FIRST` was observationally identical to `P1-UNIFORM-LEGAL` because capture priority is already enforced by legal-move generation.

The active pre-fresh amendment therefore replaces only P2:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

P2 uses the exact immediate authoritative capture-event seed count for every legal move, retains the legal moves at the maximum count, and uses the same Mulberry32 draw over that pool. It does not use geometry, search, outcome, or prior scientific measurements.

Stage 0 V3 established technical distinguishability:

```text
technical seeds = 32309001..32309064 / CONSUMED TECHNICAL-ONLY
different P1/P2 trajectories = 64 / 64
nonconstant immediate-capture-count choice points = 2882
production/independent replay = EXACT
```

This is technical evidence only and is not a G3-12 scientific effect.

## Frozen formal target set

```text
G3-04 C1 = eligible / MTAJI-GREATER
G3-04 C6 = eligible / NAMUA-GREATER
G3-07 SC1×E3×G1 = eligible / HIGHER-IN-HIGH
G3-07 SC2×E3×G1 = eligible / HIGHER-IN-HIGH
G3-07 SC3×E3×G1 = eligible / HIGHER-IN-HIGH
G3-10 C1 = eligible / ACTUAL-GREATER
G3-10 C2 = eligible / ACTUAL-GREATER
G3-10 C3 = eligible / ACTUAL-LESS
G3-10 C5 = eligible / ACTUAL-GREATER
```

Excluded positive targets remain excluded:

```text
G3-02 = TECHNICAL-INVALID
G3-03 = TECHNICAL-INVALID
G3-05 = TECHNICAL-INVALID
G3-06 = TECHNICAL-INVALID
G3-08 = TECHNICAL-INVALID
G3-09 = TECHNICAL-INVALID
G3-10 C4 = NOT-CONFIRMED
G3-07 non-confirmed/non-estimable candidates = excluded
```

G3-11 remains a historical exact anchor / boundary reference / comparator only.

## Active formal axes

```text
source policy = LGTGGC-P1-UNIFORM-LEGAL / LGTGGC-P2-MAX-CAPTURE
root family = LGTGGC-RF1-EARLY-ANCHOR / LGTGGC-RF2-LATE-ANCHOR
phase = intrinsic to SFCDF paired contrast and SILGM stratification
GCLD phase split = NOT AUTHORIZED
rule-context fields = pre-specified secondary localization only / NO RESCUE
```

## Frozen Stage 1 seeds — UNREAD

```text
SFCDF = 32311001..32311384
SILGM = 32312001..32312768
GCLD  = 32313001..32313384
```

## Frozen Stage 2 seeds — UNREAD

```text
SFCDF = 32321001..32321768
SILGM = 32322001..32323536
GCLD  = 32324001..32324768
```

Seed extension is not authorized.

## Next required action

A separate post-Stage0 pre-fresh Stage 1 authorization review is required before any Stage 1 scientific seed is generated/read. Stage 0 PASS alone does not authorize Stage 1.
