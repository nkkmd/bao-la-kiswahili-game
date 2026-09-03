# CLGR-STUDY1 — Reproducibility Index

Updated: 2026-09-03

## Repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
review baseline remote main = 6c218b9cc3f492fb96d051768702682fef9bb66a
research branch = research/g3-09-continuous-local-geometry-representation
Study ID = CLGR-STUDY1
current status = PROSPECTIVE-FROZEN / STAGE-0-ONLY
```

## Program authorization

- `../research-program-decisions/2026-09-03-post-g3-08-g3-09-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-03-post-g3-08-g3-09-authorization-review.md`

Decision: `G3-09-AUTHORIZED` for Study freeze and technical-only Stage 0; fresh Stage 1 remains not authorized.

## Frozen contracts

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`

## Measurement dependency

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative depth = 5
validated transforms = []
```

Authoritative upstream scientific report:

`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`

## Frozen representation

```text
representation = CLGR-R1-EXACT-SQUASHED-L1
axes = CLGR-A1..A6
transform = q=n/d -> n/(n+d), exact reduced rational
weights = all 1
metric = exact L1
neighborhood = k=3 tie-inclusive
phase scaling = none
data-dependent fitting = none
PCA/clustering = none
```

## Stage namespaces

```text
technical = 31909001..31909008 / scientific use prohibited
Stage 1 = 31910001..31910256 / NOT CONSUMED / NOT AUTHORIZED
Stage 2 = 31920001..31920384 / NOT CONSUMED / NOT AUTHORIZED
```

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout:

`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`.

## Source bindings

The Study protocol and preregistration are frozen. Exact Git blob/source bindings for CLGR production, independent, runner, verifier and workflow tooling must be appended here before Stage 0 execution and re-bound in every later authorization artifact.

No scientific Stage 1 source binding exists yet because Stage 1 is not authorized.

## G3-08 firewall

G3-08 partial Stage 1 scientific measurements are not reusable. Identity-only exclusion is allowed. `relay-limit enumeration` is retained as technical provenance only.

## Main integration

Main integration is not authorized. Explicit user instruction is required after Study closure and final repository/document consistency audit.
