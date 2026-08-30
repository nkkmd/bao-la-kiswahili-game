# SSGTGE-STUDY1 — Resume Here

Resume order:

1. `CURRENT_STATUS.md`
2. `preregistration/STUDY_START_FREEZE.md`
3. `preregistration/STUDY_START_SPEC.json`
4. `STUDY_1_PROTOCOL.md`
5. `DECISION_REGISTER.md`
6. `REPRODUCIBILITY_INDEX.md`
7. `RESEARCH_LOG.md`

Current safe state:

```text
baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
branch = research/g2-12-state-space-game-tree-growth-estimation
fresh depth 10/11 scientific outcome = none
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / no rerun
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = not yet authorized / not executed
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal study decision = not established
G2-11 = NOT-AUTHORIZED / unchanged
```

Accepted Stage 0 v2 provenance:

```text
implementation/source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
```

Next safe action is to prepare and freeze Stage 1 development tooling/specification using only immutable G2-05 depth 0..9 summaries. Stage 1 requires a separate authorization commit after that freeze.

Do not generate depth 10/11 exact scientific outcomes until Stage 1 has frozen one estimator and a separate Stage 2 source freeze/authorization has been committed.

Do not merge to `main` without explicit user instruction.
