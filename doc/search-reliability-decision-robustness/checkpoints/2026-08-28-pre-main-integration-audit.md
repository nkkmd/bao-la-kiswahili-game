# SRDR-STUDY1 — Pre-main Integration Audit

Date: 2026-08-28

## Scope

This checkpoint records the repository consistency audit after scientific closure and before merging PR #68 to `main`. It changes no scientific outcome, seed, population, search grid, endpoint, threshold, gate, or interpretation boundary.

## Immutable scientific closure

```text
Program = G2-02
Study ID = SRDR-STUDY1
Formal decision = INCONCLUSIVE
primaryFormalCriterion = null
sole failed preregistered gate = uniqueHistoricalTrajectoriesAfterStage1Firewall
observed / required = 1040 / 1050
Stage 2 workflow = 33124538584
Stage 2 artifact ID = 9672561139
Stage 2 artifact ZIP SHA-256 = c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

No seed extension, replacement, threshold relaxation, alternate primary, favorable subgroup, or near-miss exception is authorized or performed.

## Repository audit

Closure snapshot commit before this checkpoint:

```text
f7fe5f61445d8ea8620e792145e6471cab1cfd21
```

Current remote `main` re-fetched immediately before this checkpoint:

```text
db6980bffb7e6853751914da628db8936c76d81e
```

The research branch was audited as ahead of that `main` and not behind it. The only open pull request was PR #68; no competing open PR was present.

The following publication-facing and provenance documents were checked for consistency with the canonical Stage 2 result:

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/search-reliability-decision-robustness/README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `REPRODUCIBILITY_INDEX.md`
- Stage 0 / Stage 1 / Stage 2 preregistration and authorization records
- canonical Stage 0 / Stage 1 / Stage 2 result files

The central documents agree that `SRDR-STUDY1 = INCONCLUSIVE`, that `primaryFormalCriterion = null`, and that the reason is the preregistered 1040 < 1050 unique-trajectory estimability gate.

## Artifact/materialization audit

The deterministic closure finalizer validated the immutable Stage 2 artifact and materialized repository-facing compact canonical records. The finalizer workflow run `33141117445` passed.

Large per-game, selected-state, and full-measurement Stage 2 artifacts are not committed to the repository. Their SHA-256 references are preserved in the reproducibility index and final report.

## Integration authorization boundary

This checkpoint authorizes no new science. Its only purpose is to provide a human-authored audit commit for normal PR CI and to establish that the branch is ready for integration if those checks pass and `main` remains compatible.
