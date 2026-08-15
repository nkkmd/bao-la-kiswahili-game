# EXPERIMENT_INDEX — Tactical Motifs / Tesuji Study 1

## Stage 0 — Technical / representation audit

### TM-S0-A01 — Existing identity and representation audit

- Status: **COMPLETE / VALIDATED**
- Scientific inference: not authorized
- Output: `STAGE_0_TECHNICAL_AUDIT.md`

### TM-S0-A02 — Move-transition feature instrumentation

- Status: **COMPLETE / VALIDATED**
- Tool: `tools/experiments/lib/tactical-motif-features.js`
- Test: `test/tactical-motif-stage0.test.js`
- Validation: Actions run `31768708597` = `success`

### TM-S0-A03 — Exact search instrumentation reuse audit

- Status: **COMPLETE / VALIDATED**
- Reused tool: `tools/experiments/lib/position-complexity-search-diagnostic.js`
- Supported: exact root candidate tables, D1/D2/D3, tie-aware top sets
- Unsupported: search-consistent PV reconstruction

## Stage 1 — Prospective exploratory discovery

### TM-S1-A00 — Scientific contract freeze

- Status: **FROZEN / VALIDATED**
- Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`
- Spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- Freeze commit: `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba`
- Validation run: `31770343371` = `success`

### TM-S1-A01 — Representation / candidate grammar

- Status: **COMPLETE / VALIDATED**
- Feature helper: `tools/experiments/lib/tactical-motif-features.js`
- Candidate grammar: `tools/experiments/lib/tactical-motif-discovery.js`

### TM-S1-A02 — Scientific corpus runner / independent verifier

- Status: **COMPLETE / VALIDATED**
- Runner: `tools/experiments/run-tactical-motif-stage1-exploratory.js`
- Verifier: `tools/experiments/verify-tactical-motif-stage1-exploratory.js`
- Implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Validation run: `31770629848` = `success`

### TM-S1-A03 — Stage 1 generation authorization

- Status: **COMPLETE**
- Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`
- Authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`

### TM-S1-E01 — Exploratory discovery corpus

- Status: **GENERATED / FULLY VERIFIED**
- Population: 768 games
- Seeds: `21900001–21900768`
- Generation strata: 6 × 128
- Unique historical trajectories: 741
- Distinct opening prefixes: 681
- Manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`
- Verification: `passed=true`
- Full search recomputation: `true`
- Games verified: 768
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`

### TM-S1-E02 — Deterministic selection / readiness

- Status: **COMPLETE / READINESS PASSED**
- Selected unique rule states: 715
- Namua / Mtaji: 370 / 345
- Distinct selected opening prefixes: 659
- Replacement performed: false
- Selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`

### TM-S1-E03 — All-move exact measurement

- Status: **COMPLETE / READINESS PASSED**
- Roots: 715
- Exact measured move records: 3,148
- Measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`

### TM-S1-E04 — Exploratory candidate discovery

- Status: **COMPLETE**
- Discovery-result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- Raw pattern instances: 3,116,520
- Unique pattern keys: 323,676
- Detailed candidates: 105,501
- Passing all frozen promotion gates: 948
- Frozen ranking/cap independently reproduced exactly
- Promoted definitions: 8

### TM-S1-E05 — Candidate freeze / support-equivalence audit

- Status: **COMPLETE**
- Candidate-freeze SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`
- Frozen definitions: 8
- Exact support-equivalent pairs: ranks 1–2, 3–4, 5–6, 7–8
- Boundary: Stage 1 remains eight immutable exploratory definitions

## Stage 2 — Fresh prospective formal confirmation

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

### TM-S2-A00 — Canonical formal candidate freeze

- Status: **COMPLETE / FROZEN / VALIDATED**
- Formal primary candidates: 4
- Canonical Stage 1 ranks: `1, 3, 5, 7`
- Paired diagnostic-only ranks: `2, 4, 6, 8`
- Candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- Post-fresh-data substitution/merge/split: forbidden

### TM-S2-A01 — Formal scientific contract freeze

- Status: **COMPLETE / FROZEN / VALIDATED**
- Spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- Fresh population: 3,072 games / seeds `22000001–22003072`
- Six generation strata × 512
- Co-primary endpoints: frozen structural consequence + exact D3 top-set membership
- Planned confirmatory tests: 8
- Multiplicity: Holm-Bonferroni / FWER 0.05
- Per-candidate estimability/transferability gates: frozen
- Design validation run `31784338545` = `success`

### TM-S2-A02 — Formal runner / independent verifier / evaluator

- Status: **COMPLETE / VALIDATED**
- Formal helper: `tools/experiments/lib/tactical-motif-stage2-formal.js`
- Corpus helper: `tools/experiments/lib/tactical-motif-stage2-corpus.js`
- Runner: `tools/experiments/run-tactical-motif-stage2-formal.js`
- Independent verifier: `tools/experiments/verify-tactical-motif-stage2-formal.js`
- Evaluator: `tools/experiments/evaluate-tactical-motif-stage2-formal.js`
- Mandatory order: `generate → verify → select → measure → evaluate`

### TM-S2-A03 — Pre-generation numerical hardening

- Status: **COMPLETE / VALIDATED BEFORE SCIENTIFIC GENERATION**
- Exact-binomial upper-tail implementation hardened with log-space/log-sum-exp accumulation before formal generation
- Candidate definitions, population, endpoints, thresholds, multiplicity, and decision rules unchanged
- Hardened validation run `31785214590`, job `94719501008` = `success`
- Tests: 9 passed
- Scientific games during validation: 0

### TM-S2-A04 — Hardened source-hash authorization

- Status: **COMPLETE / ACTIVE / VALIDATED**
- Authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- Active authorization-binding run `31785382236`, job `94720016585` = `success`

### TM-S2-F01 — Fresh formal corpus generation / full verification

- Status: **COMPLETE / FULLY VERIFIED / PASS**
- Generated games: `3072`
- Seeds: `22000001–22003072`
- Condition counts: all six strata exactly `512`
- Unique historical trajectories: `2736`
- Distinct opening prefixes: `2220`
- Manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`
- Verification: `passed=true`
- Full search recomputation: `true`
- Games verified: `3072`
- Verification identity hash: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`
- Checkpoint: `checkpoints/2026-08-15-stage2-corpus-full-verification.md`

### TM-S2-F02 — Candidate-specific selection

- Status: **COMPLETE / SELECTION INTEGRITY PASSED / ALL ESTIMABILITY PREVIEWS PASS**
- Selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- C01: 1597 unique states / 1373 opening prefixes / 6 strata
- C02: 2705 unique states / 2192 opening prefixes / 6 strata
- C03: 1272 unique states / 1121 opening prefixes / 6 strata
- C04: 1031 unique states / 891 opening prefixes / 6 strata
- Replacement performed: all `false`
- Checkpoint: `checkpoints/2026-08-15-stage2-selection-estimability-pass.md`

### TM-S2-F03 — Formal measurement

- Status: **COMPLETE / MEASUREMENT INTEGRITY PASSED**
- Completed measurements: C01 `1597`, C02 `2705`, C03 `1272`, C04 `1031`
- Total measurements: `6605`
- Counts exactly match frozen selected unique states
- Candidate measurement hashes:
  - C01 `3e66255a70116f37c75f6b299fd29faa7051595356e84ae9b94ca99ee63eb033`
  - C02 `07ed4a22a9617658a973549088c729017ddb6541e4b8b8f2c40628ab423ab3c9`
  - C03 `f9053e48840f3b6b72393f7fd560009b3d5f06c376319083786779ad3e63b1ba`
  - C04 `01928aee253c664add28a40a11cbb15ca4d57ea74452ccc68a7a20a1d4820caf`
- Overall measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- `measurementIntegrityPassed=true`
- Source tree dirty: `false`
- Checkpoint: `checkpoints/2026-08-15-stage2-measurement-integrity-pass.md`

### TM-S2-F04 — Formal evaluation

- Status: **AUTHORIZED / NOT YET ACCEPTED**
- Four candidate-specific decisions
- Eight planned co-primary tests with Holm adjustment
- Frozen observed-rate and D3 consistency gates apply
- Zero confirmed candidates remains valid
- Next compact artifact: `stage2-formal-result.json`

## Naming rule

Stage 1 labels remain exploratory. A Stage 2 `CONFIRMED` candidate authorizes only a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**. Traditional/expert/human/pedagogical tesuji claims require separate validation.
