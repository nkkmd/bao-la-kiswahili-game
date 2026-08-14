# Tactical Motifs / Tesuji Study 1

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 現在の状態

- baseline `main`: `08c70ba6ac980884d51562c207410db3521b8ae4`
- branch: `research/tactical-motif-discovery`
- Stage 0: **COMPLETE / VALIDATED**
- Stage 1 v1 contract/tooling: **FROZEN / VALIDATED**
- Stage 1 scientific generation: **AUTHORIZED / NOT GENERATED**
- Stage 2: **NOT AUTHORIZED**
- `confirmed tesuji` claim: **NOT AUTHORIZED**

Stage 1 ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

Frozen spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Stage 1 population is fixed at 768 games with fresh seeds `21900001–21900768`, six trajectory-generation strata, no extension, and no replacement sampling.

The study measures all legal exact moveVariants at outcome-independently selected roots and separates recurrence, search value, forcing, structural consequence, and transferability. Opening-prefix concentration is audited so opening/joseki repetition cannot by itself establish a position-transferrable tesuji.

## Boundaries

Prior Bao studies remain immutable. `capture-branch-expansion`, MTAJI morphology, N-ACT/N-CON, Position Complexity metrics, or joseki moves are not automatically tesuji labels.

Stage 1 is exploratory only. A Stage 1 candidate can at most be promoted for future Stage 2 planning. Formal confirmation requires a new candidate-specific preregistration and fresh non-overlapping corpus.

## Key documents

- `CURRENT_STATUS.md`
- `RESEARCH_PLAN.md`
- `HYPOTHESES.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`
- `STAGE_0_TECHNICAL_AUDIT.md`
- `STAGE_1_EXPLORATORY_PROTOCOL.md`
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`

## Execution

Authorized order:

`generate → independent full replay/search verify → select → measure → discover`

Large scientific artifacts remain only under `artifacts/local/tactical-motifs/stage1-exploratory-v1/` and are not committed or generated in GitHub Actions.

At the current checkpoint, no Stage 1 scientific corpus has been generated.
