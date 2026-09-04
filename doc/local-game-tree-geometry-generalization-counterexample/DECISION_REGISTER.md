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

## LGTGGC-D022 — Stage 1 authorization

**Decision:** `LGTGGC-STAGE1-AUTHORIZED` for exactly one fresh-development execution.

```text
authorization commit = 0522dfd245b9702fa9e0229af95caccf9a50e680
execution token commit = 9cd7e40421d6a6e19518c67770393a7832b6f569
formal inference = false
p-values = false
Stage 2 seed access = false
same-evidence rerun = false
```

## LGTGGC-D023 — Stage 1 exactly-once execution

**Decision:** the first-fresh Stage 1 execution at Actions run `33848876682` consumed the one authorized scientific execution.

```text
trigger commit = 013f3fd2f859ef1758674b6a53ac5a05cd14efc8
lease artifact = 9927555827
result artifact = 9927866205
same-evidence rerun = NOT AUTHORIZED
```

## LGTGGC-D024 — SFCDF development disposition

**Decision:** `SFCDF-TRANSFER = STAGE1-PASS` as development readiness evidence only.

```text
scientific seeds read = 384
selected pairs = 40
selected roots = 80
defined roots = 80
production/independent exact = true
selection core SHA-256 = a49491bd973ba2ef8807b09e88b17ba929cd97869add1c8f49dc1521d017eff5
measurement core SHA-256 = 59667e24c250e74dc94746311ba23a448b0947fc40b3fe53e424cdf0054f3f3f
```

No effect direction or p-value was produced; this does not establish G3-04 generalization.

## LGTGGC-D025 — SILGM development disposition

**Decision:** `SILGM-TRANSFER = STAGE1-TECHNICAL-INVALID`。

Runtime failure: `complete root ranking required` in `silgm-production.js / conditionResult` after fresh Stage 1 access.

Static audit confirms a compatibility gap: frozen LOW strata permit root legal width 1, while inherited production and independent SILGM helpers hard-require at least two ranked root candidates after an estimable search result. The runner could handle an ordinary `estimable:false` return, but not this hard assertion exception.

The specific failing scientific root is not replayed or localized. No helper correction, eligibility change, seed extension, root replacement, or same-evidence rerun is authorized.

## LGTGGC-D026 — GCLD development disposition

**Decision:** `GCLD-TRANSFER = NOT EXECUTED / UNREAD`。

SILGM failure stopped the exactly-once workflow before the GCLD step. Stage 1 GCLD seed range `32313001..32313384` remains unread.

## LGTGGC-D027 — Stage 2 authorization

**Decision:** `LGTGGC-STAGE2-NOT-AUTHORIZED`。

Reasons:

- Stage 1 SILGM is TECHNICAL-INVALID;
- GCLD Stage 1 readiness is unestablished;
- SILGM exception artifact did not materialize the selected identity manifest required for a complete Stage 2 identity-only exclusion firewall;
- obtaining it by seed replay would violate same-evidence no-rerun;
- dropping SILGM/GCLD or proceeding with SFCDF alone would alter the frozen formal module/claim set after fresh evidence.

Stage 2 seed blocks remain unread.

## LGTGGC-D028 — Study closure

**Decision:** `LGTGGC-STUDY1 = CLOSED / TECHNICAL-INVALID`。

The Study did not reach formal Stage 2 and therefore established no formal generalization/counterexample endpoint-domain decision. Partial Stage 1 development data are not promoted to formal evidence.

Upstream G3-04/G3-07/G3-10 decisions remain unchanged. G3-10 C4 remains NOT-CONFIRMED. G3-11 remains bounded to its frozen single-root depth-10 exact domain.

A future attempt requires a new prospective independent Study/version and separate authorization; it may not be described as repair or completion of `LGTGGC-STUDY1`.

## LGTGGC-D029 — Final integration boundary

Research closure may be completed on the research branch, including current-facing documentation and final consistency audit. `main` integration remains `NOT AUTHORIZED / NOT PERFORMED` until explicit user instruction.
