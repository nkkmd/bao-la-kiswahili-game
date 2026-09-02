# BECT-STUDY1 — Reproducibility Index

更新日: 2026-09-02

## Baseline

```text
repository = nkkmd/bao-la-kiswahili-game
program review baseline main = 99eb6f571dbd1e1a41f12c65c2efb7c62930de45
post-decision branch baseline main = 127a9653933c623307c8423fddaf42166090f11b
research branch = research/g3-05-branch-expansion-compression-transition
Study ID = BECT-STUDY1
```

## Program authorization

- `../research-program-decisions/2026-09-02-post-g3-04-g3-05-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-02-post-g3-04-g3-05-authorization-review.md`
- decision: `G3-05-AUTHORIZED`

## Prospective contract

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `prereg/STUDY_1_SPEC.json`

Initial prospective freeze commits:

```text
machine prereg initial commit = c20fca50881c2f385cdf9f0e5065258fdbf66310
protocol initial commit = 2bfc9174c4630a3d0c4194704bdf5df81c2af536
README initial commit = 0781a4e64adfefdbb256e794d557ef5e06ed0248
overview initial commit = 62c847ccf51a3d833c0cb0e32f1fcd589c45d3b2
current-status initial commit = 33faf7c40dcf7aa71e4185fca25715f1c5b977a3
decision-register initial commit = 16ee2127d6b09128fc4b335dfb309d2383e6e0d1
```

## Frozen upstream source bindings

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
tools/experiments/lib/lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
tools/experiments/lib/lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
```

## Representation and equality

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transforms = []
relative horizon = 5
cross-implementation scientific equality = canonical sorted-key JSON -> UTF-8 -> SHA-256 exact equality
prototype-sensitive runtime equality = NOT A SCIENTIFIC GATE
```

## Reserved fresh namespaces

```text
Stage 1 = 31510001..31510240 / NOT CONSUMED / NOT AUTHORIZED
Stage 2 = 31520001..31520384 / NOT CONSUMED / NOT AUTHORIZED
```

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

No BECT action may use this holdout for generation, partial generation, read, peek, trial enumeration or resource estimation.

## Stage 0

Stage ID:

`BECT-S0-TECHNICAL-2026-09-02-v1`

Stage 0 implementation/run/artifact provenance will be appended after the separately authorized technical execution. Stage 0 must consume no Stage 1/2 scientific seed and no protected depth-10 evidence.
