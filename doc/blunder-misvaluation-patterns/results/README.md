# Results

No Stage 2 formal scientific result exists yet.

Current state:

```text
Stage 1 exploratory discovery = COMPLETE
Stage 1 exploratory candidates promoted = 4
Stage 2 candidate/spec design = FROZEN
Stage 2 technical validation = PASS
Stage 2 execution source SHA freeze = COMPLETE
Stage 2 scientific generation = AUTHORIZED
Stage 2 generated games = 0
Stage 2 formal result = none
```

Compact machine-readable records stored here:

- `STAGE_0_FEASIBILITY_RESULT.json` — technical-only D3+Q1 workload benchmark; no scientific corpus.
- `STAGE_1_CONTRACT_VALIDATION_RESULT.json` — canonical frozen Stage 1 spec/contract validation PASS.
- `STAGE_1_TOOLING_VALIDATION_RESULT.json` — Stage 1 execution tooling validation PASS before scientific generation.
- `STAGE_1_GENERATION_RESULT.json` — authorized 2048-game Stage 1 corpus generation provenance/summary.
- `STAGE_1_VERIFICATION_RESULT.json` — independent 2048-game full replay/search verification PASS.
- `STAGE_1_SELECTION_RESULT.json` — outcome-blind Stage 1 selection/readiness PASS.
- `STAGE_1_MEASUREMENT_RESULT.json` — Stage 1 measurement readiness PASS; 1200 roots / 5295 move records.
- `STAGE_1_DISCOVERY_RESULT.json` — Stage 1 automatic exploratory discovery closure; 4 candidates promoted, no manual override.
- `STAGE_2_TECHNICAL_VALIDATION_RESULT.json` — Stage 2 pre-authorization validator/contract/tooling/syntax/status audit PASS with the exact scientific source-file SHA map.

Stage 2 frozen identities:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
technical validation result commit = 3d5a1a33f673c9c98ba6a5ed2862b25c8d76e777
source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
```

The initial authorization commit `a0e7d9ee619d081749039271f039b32267699d4b` contained one clerical source-hash transcription error and was never used. It was corrected before any scientific generation.

Large Stage 1/Stage 2 corpora and per-root measurements remain local under:

```text
artifacts/local/blunder-misvaluation-patterns/
```

The raw Stage 1 discovery artifact remains hash-bound but uncommitted:

```text
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

Interpretation remains machine-operational only. Authorization does not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity.
