# Results

No formal or confirmatory scientific result exists yet.

Current state:

```text
Stage 1 scientific corpus generation = COMPLETE (2048 games)
independent full replay/search verification = PASS
outcome-blind state selection = COMPLETE
selection readiness = PASS
measurement = COMPLETE (1200 roots / 5295 legal-move records)
measurement readiness = PASS
candidate discovery = NEXT
discovery result = PENDING
formal result = none
```

Compact machine-readable records stored here:

- `STAGE_0_FEASIBILITY_RESULT.json` — technical-only D3+Q1 workload benchmark; no scientific corpus.
- `STAGE_1_CONTRACT_VALIDATION_RESULT.json` — canonical frozen Stage 1 spec/contract validation PASS.
- `STAGE_1_TOOLING_VALIDATION_RESULT.json` — execution tooling validation PASS before scientific generation.
- `STAGE_1_GENERATION_RESULT.json` — authorized 2048-game Stage 1 corpus generation provenance/summary.
- `STAGE_1_VERIFICATION_RESULT.json` — independent 2048-game full replay/search verification PASS.
- `STAGE_1_SELECTION_RESULT.json` — outcome-blind state selection/readiness PASS; 1200 unique rule states, Namua/Mtaji 600/600, no replacement or phase reassignment.
- `STAGE_1_MEASUREMENT_RESULT.json` — measurement readiness PASS; 1200 roots, 5295 move records, complete finite D3 candidate tables.

Large generated game/selection/measurement artifacts remain under `artifacts/local/blunder-misvaluation-patterns/` and are not committed here.

These records do not constitute candidate confirmation and do not authorize confirmatory, game-theoretic blunder, human-misconception, expert-traditional, or pedagogical claims.
