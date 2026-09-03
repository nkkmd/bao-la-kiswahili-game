# CLGR-STUDY1 — Reproducibility Index

Updated: 2026-09-03

## Repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
review baseline remote main = 6c218b9cc3f492fb96d051768702682fef9bb66a
research branch = research/g3-09-continuous-local-geometry-representation
Study ID = CLGR-STUDY1
current status = CLOSED / TECHNICAL-INVALID
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Program decisions

- `../research-program-decisions/2026-09-03-post-g3-08-g3-09-authorization-review.md`
- `../research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-03-post-g3-08-g3-09-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-03-g3-09-technical-invalid-closure.md`

Final program decision:

**`G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

## Frozen contracts

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `prereg/STAGE_2_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_INPUT.json`

## Measurement dependency

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative depth = 5
validated transforms = []
```

Authoritative upstream report:

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

## Stage namespaces at closure

```text
technical = 31909001..31909008 / scientific use prohibited
Stage 1 = 31910001..31910256 / CONSUMED
Stage 2 = 31920001..31920384 / CONSUMED
same-evidence rerun = PROHIBITED
```

## Stage 0 provenance

Stage 0 v1 was technical-invalid before scientific access and was not rerun.

Stage 0 v2:

```text
workflow run = 33748876201
result artifact = 9890713293
artifact ZIP SHA-256 = 4f5b63b30146aa97b30f5adfa2b615eb360cba77236d6288042b2c320c72041b
result JSON SHA-256 = 5723938b5afc3e6b9f2d2fcad6c4f618a97e4b3e47e50d0e0d4204edbe207dee
stage disposition = STAGE0-PASS
```

## Stage 1 preauthorization provenance

Preauthorization v1 stopped at syntax check before audit execution and before fresh access. It was not rerun.

Preauthorization v2:

```text
workflow run = 33750207236
audit artifact = 9891210816
artifact ZIP SHA-256 = b29ff0d5d8e17fd3bd3f8e12dc08867da84049c4ab6ee7df06a82ecac66ab87a
audit exact JSON SHA-256 = 14f4b8d68f727fd81d8f608817ef0c0838aa4d332a36039d2cc300a413c266ef
audit disposition = STAGE1-PREAUTH-STATIC-AUDIT-PASS
fresh Stage 1 seed access = false
```

Authoritative mirror:

`results/stage-1-preauthorization-v1/PREAUTH_AUDIT_RESULT.json`

## Stage 1 scientific provenance

Exactly-one authorized fresh execution:

```text
workflow run = 33750400172
result artifact = 9891394814
lease artifact = 9891283252
artifact ZIP SHA-256 = 6a8ebc0d242027ad6a634555a290df1284626839e4397e87b06551e2fc726fc9
population = 24 Namua + 24 Mtaji = 48
stage disposition = STAGE1-PASS
canonical scientific result SHA-256 = 1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529
```

The immutable artifact was exact-byte mirrored by workflow run `33750898317`.

Authoritative Stage 1 mirrors:

- `results/stage-1/STAGE_1_SELECTION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-1/STAGE_1_COORDINATES.json`
- `results/stage-1/STAGE_1_DISTANCE_ROWS.json`
- `results/stage-1/STAGE_1_NEIGHBORHOODS.json`
- `results/stage-1/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json`
- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1 is development evidence. Its PASS does not constitute formal representation eligibility.

## Stage 2 preauthorization provenance

```text
workflow run = 33751580785
audit artifact = 9891748675
artifact ZIP SHA-256 = 895735e484662aab11b62b67dc0b00700b40952a5aee04999e9684cadfb8008f
audit disposition = STAGE2-PREAUTH-STATIC-AUDIT-PASS
fresh Stage 2 seed access = false
protected depth-10 access = false
```

Authoritative mirror:

`results/stage-2-preauthorization-v1/PREAUTH_AUDIT_RESULT.json`

## Stage 2 formal provenance

Exactly-one authorized fresh formal execution:

```text
workflow run = 33751818456
result artifact = 9892142995
lease artifact = 9891829617
artifact ZIP SHA-256 = 7fbb28407a1233911b581875c76bef44287cd5f21cc63ab7405f3ec621c94e26
selection core SHA-256 = e9c6f436bf2abd86d6c3a7b46d5b05e043c478f794db49c76c4d3c87b15a0617
selected population = 36 Namua + 36 Mtaji = 72
partial completed measurements = 61
formal decision = TECHNICAL-INVALID
formal-result JSON SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
scientific summary authorized = false
same-evidence rerun authorized = false
```

Failure identity:

```text
root index = 61
phase = mtaji
source seed = 31920066
root RAW SHA-256 = e2260d76b2f40fa24ebe2183ca0cc865f48dc7c951737414ef8c498143b8087c
error = relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b
```

The immutable Stage 2 artifact was exact-byte verified and mirrored by workflow run `33752894852`.

Authoritative Stage 2 mirrors:

- `results/stage-2/STAGE_2_SELECTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-2/STAGE_2_FORMAL_RESULT.json`

The repository blob SHA for `STAGE_2_FORMAL_RESULT.json` after exact mirror is `d0d577ede4bfe3c726500c9c521228576fdf8186`.

## Source binding and implementation separation

Fresh-free Stage 1 and Stage 2 preauthorization audits bound the engine, LGTGMIV production/independent implementations, CLGR production/independent implementations, stage selectors/runners/verifiers, frozen preregistration files and scientific workflows by Git blob SHA before fresh execution.

Production and independent CLGR paths did not import each other. Scientific equality was defined over canonical exact primitives rather than runtime object prototypes or floating tolerances.

## G3-08 and upstream firewall

G3-08 partial Stage 1 measurements were not used as G3-09 scientific evidence. `doc/local-geometry-persistence-memory-length/prereg/UPSTREAM_IDENTITY_FIREWALL.json` supplied identity-only exclusions and retained no G3-07 scientific outcome fields.

G3-08 relay-limit information was used only to motivate fail-closed technical controls and prospectively frozen resource ceilings.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

No partial generation, resource probe, state-count peek or scientific read occurred in G3-09.

## No-rescue and downstream boundary

Because Stage 2 fresh evidence was accessed and the formal seed block was consumed, `CLGR-STUDY1` cannot be rerun or repaired on the same evidence. The 61 partial Stage 2 measurements are technical provenance only.

G3-10 remains not authorized and requires a separate post-G3-09 current-state review.

## Main integration

Main integration is **not authorized** and has **not been performed**. Explicit user instruction is required after final repository/document consistency audit.
