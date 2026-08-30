# SSGTGE-STUDY1 — Resume Here

Resume order:

1. `CURRENT_STATUS.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `results/STUDY_1_FINAL_RESULT.json`
4. `results/STAGE_1_TECHNICAL_INVALID_RESULT.json`
5. `DECISION_REGISTER.md`
6. `REPRODUCIBILITY_INDEX.md`
7. `RESEARCH_LOG.md`
8. `STUDY_1_PROTOCOL.md`

Current safe state:

```text
baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
branch = research/g2-12-state-space-game-tree-growth-estimation
Study status = COMPLETE
formal decision = TECHNICAL-INVALID
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / no rerun
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / no same-evidence rerun
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
canonical selectedEstimator = null
fresh depth 10/11 = not generated / not read
G2-11 = NOT-AUTHORIZED / unchanged
```

Stage 1 production proposed E2, but mandatory independent verification failed under the frozen `1e-12` tolerance. The proposal is diagnostic-only and may not be passed to Stage 2.

Do not repair the Stage 1 verifier/tolerance and rerun the same development evidence within this Study. A corrected attempt requires a new prospective Study or explicit new version.

Before any future main integration, synchronize and audit root `README.md`, `doc/RESEARCH_INDEX.md`, `doc/FUTURE_RESEARCH_AGENDA.md`, and Research Generation 2 program decision documents on this research branch.

Do not merge to `main` without explicit user instruction.
