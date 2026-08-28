# SRDR-STUDY1 — Main Integration Checkpoint

Date: 2026-08-28

## Integration

```text
Program = G2-02
Study ID = SRDR-STUDY1
Integration PR = #68
Final research head = f6814e4e828ea07ec309f6f7352c825494d8ff20
Merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
Integrated branch = main
Formal decision = INCONCLUSIVE
primaryFormalCriterion = null
```

## Scientific closure remains unchanged

The sole failed preregistered Stage 2 gate remains:

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

The independent verifier passed 1536/1536 game replays with zero game, selected-state, and measurement mismatches and exact selection/measurement hash matches. Repository integration does not alter these facts or authorize evaluation of the skipped primary formal criterion.

## Canonical provenance

```text
Stage 2 workflow run = 33124538584
Stage 2 artifact ID = 9672561139
Stage 2 artifact ZIP SHA-256 = c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a
Canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
Selection hash = a929e00fcedfcd9e6f89780d5ca02f9a5f126250e569bd3840d4d79cfa2d6f46
Measurement hash = 13ca8825c250f038c510a2a7e7c0e8d1567f0d5027bd32ecb4dee0e34f64e2bd
```

## Pre-merge consistency and CI audit

Before merge:

- root `README.md`, `doc/RESEARCH_INDEX.md`, and `doc/FUTURE_RESEARCH_AGENDA.md` were synchronized to the canonical `INCONCLUSIVE` result;
- Study README, overview, final report, current status, decision register, research log, reproducibility index, preregistrations, authorizations, checkpoints, and compact canonical results were reviewed;
- no large raw Stage 2 measurement or selected-state artifact was committed;
- the final research branch was 66 commits ahead and 0 behind `main`;
- no competing open pull request and no unresolved PR review thread existed;
- the idempotent G2-02 closure-finalization workflow passed;
- all five normal PR workflows passed: G2-02 technical validation, Research Generation 2 agenda audit, SSGTC closure consistency audit, PCEM closure consistency audit, and Phase Transition Research CI;
- changed-file audit confirmed no modification to `public/engine.js`, `public/ai.js`, `public/ai-weights.js`, or other public AI runtime files.

## Post-merge documentation audit

After merge, `CURRENT_STATUS.md`, `REPRODUCIBILITY_INDEX.md`, `RESEARCH_LOG.md`, and `DECISION_REGISTER.md` were updated with integration provenance. A duplicate Decision Register numbering sequence introduced during closure materialization was normalized to unique sequential IDs without changing its scientific content.

## No-rescue boundary

No scientific seed extension, state replacement, threshold relaxation, alternate primary, favorable subgroup, or near-miss exception was performed during closure or integration. Any future formal re-test requires a new prospective Study/version and fresh evidence.