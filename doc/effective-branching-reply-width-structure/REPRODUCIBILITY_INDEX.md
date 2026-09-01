# EBRWS-STUDY1 — Reproducibility Index

## Study identity

- Study ID: `EBRWS-STUDY1`
- baseline remote main: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- research branch: `research/g3-02-effective-branching-reply-width-structure`
- authoritative state identity: RAW-only
- validated transform set: `[]`
- relative local horizon: depth 5

## Canonical protocol records

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `DECISION_REGISTER.md`
- `CURRENT_STATUS.md`

## Upstream instrument dependency

Formal eligible families only:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

Primary endpoint uses F1 + F5. F2-F4 are secondary context only.

## Stage identities

### Stage 0

- ID: `EBRWS-S0-TECHNICAL-2026-09-01-v1`
- evidence: technical fixture only
- fresh seed consumption: forbidden

### Stage 1

- ID: `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`
- seed block: `31210001..31210192`
- roots: 12 Namua + 12 Mtaji
- evidence class: `FRESH-DEVELOPMENT`
- current disposition: `NOT-AUTHORIZED-NOT-EXECUTED`

### Stage 2

- ID: `EBRWS-S2-FORMAL-2026-09-01-v1`
- seed block: `31220001..31220288`
- roots: 18 Namua + 18 Mtaji
- evidence class: `FRESH-FORMAL-HELDOUT`
- current disposition: `NOT-AUTHORIZED-NOT-EXECUTED`

## Root policy

- deterministic Mulberry32 source trajectory
- canonical legal-move ordering
- Namua root at exact ply 24
- Mtaji root = first nonterminal mtaji state at ply >= 44
- phase-wise first-N by source seed after fixed identity firewall exclusions
- max source ply 240
- RAW-root deduplication

## Firewall identities

Check exact collision against:

- G3-01 roots / trajectories / first-16 prefixes
- LGTGMIV Stage 1 roots / trajectories / first-16 prefixes
- LGTGMIV Stage 2 roots / trajectories / first-16 prefixes
- for Stage 2, G3-02 Stage 1 roots / trajectories / first-16 prefixes

Only identity information may be read from upstream for overlap exclusion. Upstream geometry outcomes are not G3-02 fresh evidence.

## Primary derived endpoint reproducibility

Production and independent implementations must separately derive:

- `EB_tree(0..4)` exact rationals
- `treeWidthShapeClass`
- `replyDirection(0..4)`
- `replyWidthShapeClass`
- phase-level class counts
- promoted candidate set / formal tested candidate set

No shared G3-02 derived-metric, class, promotion, or canonical-hash helper is allowed.

## Protected evidence

standard initial RAW-root complete exact depth-10 holdout:

`SEALED / NOT GENERATED / NOT READ`
