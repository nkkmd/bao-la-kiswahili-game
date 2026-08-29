# RCPR-STUDY1

Research Generation 2 `G2-06` — **Rich Critical-Position Representation Study 1**.

日本語作業表記:

**Baoにおける重要局面の豊かな構造表現の構築とprospective検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別**

## Status

```text
Study = CLOSED AT STAGE 1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

Stage 0 independently validated the eight prospectively declared representation families and the 310-scalar schema. The fresh Stage 1 production run completed and passed the production-only readiness gates, but mandatory independent feature recomputation failed exact equality on 4 of 600 selected rows. The frozen fail-closed rule therefore closes Stage 1 as `STAGE1-TECHNICAL-INVALID`.

A read-only postmortem localized all four differences to floating-point accumulation order in `MOVE_SET_ENTROPY.indexEntropy`. This does not authorize post-hoc tolerance, rounding, repair, or rerun of the consumed Stage 1 block.

## Read first

1. `STUDY_1_OVERVIEW.md` — concise outcome and interpretation boundary
2. `STUDY_1_FINAL_REPORT.md` — integrated scientific/technical closure
3. `CURRENT_STATUS.md` — terminal state and execution anchors
4. `DECISION_REGISTER.md` — prospectively fixed and closure decisions
5. `REPRODUCIBILITY_INDEX.md` — hashes, runs, artifacts, and provenance
6. `RESEARCH_LOG.md` — chronological research record
7. `STUDY_1_PROTOCOL.md` — prospective scientific protocol
8. `RESUME_HERE.md` — restart/continuation boundary

## Canonical machine-readable records

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

Key closure checkpoints:

- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`
- `checkpoints/2026-08-29-post-closure-workflow-archive.md`

Program-level closure:

- `../research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`

## Frozen scientific boundary

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
feature families = 8
scalar features = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
high-divergence boundary = D_range >= 0.30
```

Research Generation 1 Critical Positions evidence and all G2-01..G2-05 formal decisions remain immutable. Historical CPOB roots/outcomes/audits were not reused as G2-06 training, threshold-selection, validation, or formal evidence.

## Stage 1 terminal provenance

```text
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
workflow run = 33196954082
production job = 98936414477 / success
independent verification job = 99007180273 / failure
```

Production-only descriptive output:

```text
selected roots = 600
primary estimable = 599
high divergence = 134
low divergence = 465
selected family set = RICH_ALL
overall OOF AUROC = 0.7093403948001926
```

These values are retained as unverified development provenance only and are not promoted to an accepted scientific result.

## Closure and future work

`RCPR-STUDY1` has no further scientific transition. The consumed seed block `28610001..28613072` must not be rerun, replaced, or extended, and Stage 2 must not be authorized inside this Study.

The immediate next Research Generation 2 machine-only agenda item is `G2-07 — Practical Comeback / Reply-Pressure Representation Study 1`, which requires its own prospective contract and fresh evidence. A future revisit of rich critical-position representation would also require a distinct independent Study identity and fresh prospective validation rather than reopening this closed Study as a generic “Study 2” rescue.
