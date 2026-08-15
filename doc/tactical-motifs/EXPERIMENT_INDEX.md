# EXPERIMENT_INDEX — Tactical Motifs / Tesuji Study 1

Study status: **CLOSED / COMPLETE**

## Stage 0 — Technical / representation audit

### TM-S0-A01 — Existing identity and representation audit

- Status: **COMPLETE / VALIDATED**
- Scientific inference: not authorized
- Output: `STAGE_0_TECHNICAL_AUDIT.md`

### TM-S0-A02 — Move-transition feature instrumentation

- Status: **COMPLETE / VALIDATED**
- Tool: `tools/experiments/lib/tactical-motif-features.js`
- Validation run: `31768708597` = `success`

### TM-S0-A03 — Exact search instrumentation reuse audit

- Status: **COMPLETE / VALIDATED**
- Reused tool: `tools/experiments/lib/position-complexity-search-diagnostic.js`
- Exact D1/D2/D3 root candidate tables and tie-aware top sets supported
- Search-consistent PV reconstruction unsupported / not claimed

## Stage 1 — Prospective exploratory discovery

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

### TM-S1-A00 — Scientific contract freeze

- Status: **FROZEN / VALIDATED**
- Spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- Validation run: `31770343371` = `success`

### TM-S1-A01 — Representation / candidate grammar

- Status: **COMPLETE / VALIDATED**

### TM-S1-A02 — Corpus runner / independent verifier

- Status: **COMPLETE / VALIDATED**
- Implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Validation run: `31770629848` = `success`

### TM-S1-A03 — Generation authorization

- Status: **COMPLETE**
- Authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`

### TM-S1-E01 — Exploratory corpus / full verification

- Status: **COMPLETE / FULLY VERIFIED**
- Games: `768`
- Seeds: `21900001–21900768`
- Unique historical trajectories: `741`
- Distinct opening prefixes: `681`
- Verification: `passed=true`
- Full search recomputation: `true`
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`

### TM-S1-E02 — Deterministic selection / readiness

- Status: **COMPLETE / PASS**
- Selected unique rule states: `715`
- Namua / Mtaji: `370 / 345`
- Selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`

### TM-S1-E03 — All-move exact measurement

- Status: **COMPLETE / PASS**
- Exact move records: `3148`
- Measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`

### TM-S1-E04 — Exploratory discovery

- Status: **COMPLETE**
- Raw pattern instances: `3,116,520`
- Unique pattern keys: `323,676`
- Detailed candidates: `105,501`
- Passing all frozen promotion gates: `948`
- Promoted definitions: `8`
- Discovery-result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

### TM-S1-E05 — Candidate freeze / support-equivalence audit

- Status: **COMPLETE**
- Candidate-freeze SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`
- Exact support-equivalent pairs: ranks `1–2`, `3–4`, `5–6`, `7–8`
- Stage 1 remains eight immutable exploratory definitions

## Stage 2 — Fresh prospective formal confirmation

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

### TM-S2-A00 — Canonical formal candidate freeze

- Status: **COMPLETE / FROZEN / VALIDATED**
- Formal candidates: `4`
- Canonical Stage 1 ranks: `1,3,5,7`
- Paired diagnostic-only ranks: `2,4,6,8`
- Candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

### TM-S2-A01 — Formal scientific contract freeze

- Status: **COMPLETE / FROZEN / VALIDATED**
- Spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- Fresh population: `3072` games / seeds `22000001–22003072`
- Planned co-primary tests: `8`
- Multiplicity: Holm-Bonferroni / FWER `0.05`
- Design validation run: `31784338545` = `success`

### TM-S2-A02 — Runner / verifier / evaluator

- Status: **COMPLETE / VALIDATED**
- Mandatory order: `generate → verify → select → measure → evaluate`

### TM-S2-A03 — Pre-generation numerical hardening

- Status: **COMPLETE / VALIDATED BEFORE SCIENTIFIC GENERATION**
- Exact-binomial implementation hardened in log space
- Scientific design unchanged
- Validation run `31785214590`, job `94719501008` = `success`

### TM-S2-A04 — Hardened source-hash authorization

- Status: **COMPLETE / VALIDATED**
- Authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- Binding run `31785382236`, job `94720016585` = `success`

### TM-S2-F01 — Fresh formal corpus / full verification

- Status: **COMPLETE / FULLY VERIFIED / PASS**
- Games: `3072`
- Unique historical trajectories: `2736`
- Distinct opening prefixes: `2220`
- Manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`
- `passed=true`
- `fullSearchRecomputation=true`
- `gamesVerified=3072`
- Verification identity hash: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`

### TM-S2-F02 — Candidate-specific selection

- Status: **COMPLETE / PASS**
- Selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- C01: `1597` unique states / `1373` opening prefixes / `6` strata
- C02: `2705` / `2192` / `6`
- C03: `1272` / `1121` / `6`
- C04: `1031` / `891` / `6`
- All six estimability preview gates pass for all four candidates
- Replacement: none

### TM-S2-F03 — Formal measurement

- Status: **COMPLETE / INTEGRITY PASSED**
- Completed measurements: C01 `1597`, C02 `2705`, C03 `1272`, C04 `1031`
- Total: `6605`
- Measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- `measurementIntegrityPassed=true`

### TM-S2-F04 — Formal evaluation

- Status: **COMPLETE / ACCEPTED**
- Result-core hash: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`
- Eight planned co-primary tests retained in Holm family
- All four candidates estimable
- Final decisions:
  - `TM-S2-C01` = **NOT-CONFIRMED**
  - `TM-S2-C02` = **NOT-CONFIRMED**
  - `TM-S2-C03` = **CONFIRMED**
  - `TM-S2-C04` = **NOT-CONFIRMED**
- Confirmed count: `1 / 4`
- Formal result: `STAGE_2_FORMAL_RESULT.md`
- Completion checkpoint: `checkpoints/2026-08-15-stage2-formal-completion.md`

## Study closure

Tactical Motifs / Tesuji Study 1 is **CLOSED / COMPLETE**.

C03 supports only a machine-reproducible transferable tactical-motif claim under the frozen Bao engine/search operationalization. Human/expert/traditional/pedagogical tesuji claims require a separate prospective study.
