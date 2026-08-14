# Tactical Motifs / Tesuji Study 1

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 現在の状態

- baseline `main`: `08c70ba6ac980884d51562c207410db3521b8ae4`
- branch: `research/tactical-motif-discovery`
- Stage 0: **COMPLETE / VALIDATED**
- Stage 1 v1 contract/tooling: **FROZEN / VALIDATED**
- Stage 1 scientific corpus: **GENERATED / FULLY VERIFIED**
- Stage 1 deterministic selection: **COMPLETE / READINESS PASSED**
- Stage 1 all-move measurement: **COMPLETE / READINESS PASSED**
- Stage 1 exploratory discovery: **COMPLETE**
- Stage 1 promoted candidate definitions: **8, frozen for Stage 2 planning only**
- Stage 2: **NOT AUTHORIZED / NOT YET PREREGISTERED**
- `confirmed tesuji` claim: **NOT AUTHORIZED**

Stage 1 ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

Frozen spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Stage 1 population was fixed at 768 games with fresh seeds `21900001–21900768`, six trajectory-generation strata, no extension, and no replacement sampling.

The completed exploratory pipeline measured all legal exact moveVariants at 715 outcome-independently selected unique rule states, yielding 3,148 exact move records. It then enumerated 3,116,520 raw pattern instances and 323,676 unique pattern keys. Of 105,501 detailed candidates, 948 passed all frozen promotion gates; deterministic ranking and caps selected eight definitions for Stage 2 planning.

The eight promoted definitions form four exact support-identity pairs. This is recorded as an audit observation, not a post-hoc merge. Stage 2 must prospectively decide whether to test the eight definitions separately, group the four support-equivalent pairs, or use a hierarchical formulation before any fresh confirmatory corpus is generated.

## Boundaries

Prior Bao studies remain immutable. `capture-branch-expansion`, MTAJI morphology, N-ACT/N-CON, Position Complexity metrics, or joseki moves are not automatically tesuji labels.

Stage 1 is exploratory only. A Stage 1 candidate can at most be used to design Stage 2. Formal confirmation requires a new candidate-specific/family-specific preregistration and a fresh non-overlapping corpus.

The terms `confirmed tesuji`, traditional/expert tesuji, human-important, beginner-important, and pedagogically important remain unauthorized.

## Key documents

- `CURRENT_STATUS.md`
- `RESEARCH_PLAN.md`
- `HYPOTHESES.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`
- `STAGE_0_TECHNICAL_AUDIT.md`
- `STAGE_1_EXPLORATORY_PROTOCOL.md`
- `STAGE_1_EXECUTION_RUNBOOK.md`
- `STAGE_1_EXPLORATORY_RESULT.md`
- `STAGE_1_CANDIDATE_FREEZE.json`
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`

## Stage 1 artifact policy

Large scientific artifacts remain only under:

`artifacts/local/tactical-motifs/stage1-exploratory-v1/`

and are not generated in GitHub Actions or committed to Git.

The local `discovery-result.json` is approximately 324 MB. Its SHA-256 is:

`aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

The compact promoted result is frozen in `STAGE_1_CANDIDATE_FREEZE.json`.

## Next boundary

The next work is **Stage 2 prospective formal design**, not data generation. Stage 2 generation remains blocked until candidate/family handling, exact matching, population, fresh seeds, comparator, outcome, estimability, multiplicity, decision/failure rules, and no-rescue rules are frozen and separately authorized.
