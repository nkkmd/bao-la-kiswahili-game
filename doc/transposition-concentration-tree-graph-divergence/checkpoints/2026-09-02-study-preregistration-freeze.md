# TCTGD-STUDY1 — Prospective Study / preregistration freeze

Date: 2026-09-02

## Freeze state

Research Generation 3 `G3-03` has completed prospective Study-definition / preregistration freeze after the separate post-G3-02 program review returned `G3-03-AUTHORIZED`.

```text
Study ID = TCTGD-STUDY1
Program position = G3-03
Research branch = research/g3-03-transposition-tree-graph-divergence
baseline remote main = 6b1457294666267c5a75c8516001acd1ef7d2fcd
pre-checkpoint frozen-content HEAD = 1ddf1f292ce48be2a0c866b0fa86ea060f2e613d
fresh G3-03 scientific evidence generated = false
fresh G3-03 scientific evidence read = false
Stage 1 seed 31310001..31310192 = NOT CONSUMED
Stage 2 seed 31320001..31320288 = NOT CONSUMED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen formal identity

English title:

**Transposition Concentration and Tree-to-Graph Divergence Study 1 — Prospective exact validation of branch reconvergence, multi-parent RAW states, duplicate occurrences, and bounded local tree-to-RAW-graph divergence in Bao**

日本語題目:

**Baoにおけるtransposition集中とtree/graph乖離のprospective exact検証 — bounded RAW局所構造におけるbranch reconvergence、multi-parent state、duplicate occurrence、tree occurrence / RAW graph divergenceの再現可能なphase差の検証**

Stage IDs:

- `TCTGD-S0-TECHNICAL-2026-09-02-v1`
- `TCTGD-S1-DEVELOPMENT-2026-09-02-v1`
- `TCTGD-S2-FORMAL-2026-09-02-v1`

## Frozen representation / rule boundary

```text
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
representation = RAW-ONLY
validated transform set = []
relative exact horizon = 5
rule engine = public/engine.js
rule engine git blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
canonical serialization = LGTGMIV-CANONICAL-v1
floating-point scientific decision arithmetic = prohibited
```

## Frozen upstream measurement use

Principal:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary denominator only:

- `LGTGMIV-F1-TREE-OCCURRENCE`

F5 reply geometry is not part of the G3-03 principal measurement contract.

## Frozen candidate endpoints

1. `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO`
2. `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION`
3. `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION`
4. `TCTGD-C4-RECONVERGENCE-ONSET-SCORE`
5. `TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION`

Exact numerator/denominator/root-inclusion/undefined semantics are immutable in `STUDY_1_PROTOCOL.md` and `prereg/STUDY_1_SPEC.json`.

## Frozen fresh populations

Stage 1:

```text
seed = 31310001..31310192
target = 12 paired trajectories = 12 Namua + 12 Mtaji roots
```

Stage 2:

```text
seed = 31320001..31320288
target = 18 paired trajectories = 18 Namua + 18 Mtaji roots
```

Each pair comes from one source seed, with Namua root at exact ply 24 and Mtaji root at first nonterminal Mtaji state at ply >=44. First-N eligible pair selection is seed-ascending, outcome-blind and geometry-blind.

Morphology strata are not used.

## Frozen firewall

The following seed blocks are forbidden:

- `31010001..31010096`
- `31110001..31110128`
- `31120001..31120192`
- `31210001..31210192`
- `31220001..31220288`

G3-02 Stage 1 selected roots are neither reused nor reconstructed. Its missing canonical root registry is not repaired. G3-02 scientific outcomes are excluded from selection and inference.

Within G3-03, Stage 2 must have zero overlap with Stage 1 by RAW root, source trajectory, and first-16-move prefix identity.

## Frozen development / formal decision contract

Stage 1 promotion uses paired Mtaji-minus-Namua exact differences. C1-C4 require full 12/12 comparable coverage; C5 requires >=10/12. Nonzero differences must be at least 2/3 of comparable pairs, and one direction must contain at least 2/3 of nonzero differences.

Stage 2 tests only frozen Stage 1 candidate IDs and directions. C1-C4 require 18/18 coverage; C5 requires >=15/18. The formal test is exact two-sided sign test on nonzero paired differences, with exact Holm-Bonferroni family-wise alpha `1/20` across the frozen promoted set and zero floating-point decision arithmetic.

## Frozen implementation binding

```text
LGTGMIV production blob = a4664f01535d6abbf6f83821befbb2fafd55cde6
LGTGMIV independent blob = 0c7239ac7acf146e9aee63dae66194681b8631d6
G3-03 production blob = 782ec5e7140d0b8e410d2156dc765c8b2f0c1a5d
G3-03 independent blob = 1435998dba938ecad15470370dd2ef096a046e83
Stage 0 runner blob = 8fe976990de7792926401334cfc0171599cd9059
Study protocol blob = 3f892949bc87f5963a77cb4604bacc7023faa3d9
Machine prereg blob = 3a651e3b34890c57a58065f091bcbcd062a68dda
```

G3-03 independent code may not import G3-03 production code. Exact agreement tolerance is zero.

## Frozen execution-integrity contract

Fresh scientific Stage workflows must be `workflow_dispatch` only. Push-triggered scientific computation is prohibited.

Before any fresh seed/root generation, the authorized run must successfully fast-forward a durable remote execution-start marker. Existing marker, unexpected remote advancement or lease push failure aborts before scientific computation.

Each fresh Stage permits exactly one scientific execution. Stage-specific concurrency plus the durable execution marker must make any duplicate queued run exit before scientific computation.

After scientific computation, canonical result bytes and hashes must be uploaded as durable Actions artifact before repository mirror push. Repository push failure does not authorize recomputation; recovery may copy only the exact already-uploaded bytes and verify their pre-recorded hashes.

Actions-history and execution-count audits are mandatory.

## Formal decisions

Possible Study/stage dispositions are prospectively restricted to:

- `CONFIRMED-BOUNDED-PHASE-DIFFERENCE`
- `NOT-CONFIRMED`
- `NO-PROMOTED-CANDIDATE`
- `NON-ESTIMABLE`
- `TECHNICAL-INVALID`
- `NOT-AUTHORIZED-NOT-EXECUTED`

## Authorization boundary

This freeze does **not** authorize Stage 0, Stage 1, or Stage 2 automatically.

The next safe action is a separate Stage 0 technical authorization. Stage 0 may use synthetic fixtures only and must not consume or read any fresh scientific seed/root.

Stage 0 PASS will not automatically authorize Stage 1.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

No generation, read, peek or resource-estimation partial generation is permitted in this Study.
