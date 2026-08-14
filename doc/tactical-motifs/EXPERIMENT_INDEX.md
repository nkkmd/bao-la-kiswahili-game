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
- Spec: `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- Spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- Freeze commit: `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba`
- Validation run: `31770343371` = `success`

### TM-S1-A01 — Representation / candidate grammar

- Status: **COMPLETE / VALIDATED**
- Feature helper: `tools/experiments/lib/tactical-motif-features.js`
- Candidate grammar: `tools/experiments/lib/tactical-motif-discovery.js`
- Spec validator: `tools/experiments/validate-tactical-motif-stage1-spec.js`

### TM-S1-A02 — Scientific corpus runner / independent verifier

- Status: **COMPLETE / VALIDATED**
- Corpus helper: `tools/experiments/lib/tactical-motif-stage1-corpus.js`
- Runner: `tools/experiments/run-tactical-motif-stage1-exploratory.js`
- Independent verifier: `tools/experiments/verify-tactical-motif-stage1-exploratory.js`
- Implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Validation run: `31770629848` = `success`

### TM-S1-A03 — Stage 1 generation authorization

- Status: **COMPLETE**
- Authorization: `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`
- Confirmatory inference: not authorized
- Stage 2 generation: not authorized

### TM-S1-E01 — Exploratory discovery corpus

- Status: **GENERATED / FULLY VERIFIED**
- Population: 768 games
- Seeds: `21900001–21900768`
- Generation strata: 6 × 128 games
- Unique historical trajectories: 741
- Distinct opening prefixes: 681
- Manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`
- Verification: `passed=true`
- Full search recomputation: `true`
- Games verified: 768
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`

### TM-S1-E02 — Deterministic state selection / readiness audit

- Status: **COMPLETE / READINESS PASSED**
- Unique historical trajectories: 741
- Unavailable assigned phase: 25, no replacement
- Selected before rule-state collapse: 716
- Duplicate selected rule states collapsed: 1
- Selected unique rule states: 715
- Namua / Mtaji: 370 / 345
- Distinct selected opening prefixes: 659
- Selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- Frozen readiness gates: all passed

### TM-S1-E03 — All-move exact measurement

- Status: **COMPLETE / READINESS PASSED**
- Roots: 715
- Exact measured move records: 3148
- Frozen minimum for discovery: 1800
- Measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`
- `measurementReadinessPassed=true`

### TM-S1-E04 — Exploratory candidate discovery

- Status: **COMPLETE**
- Local discovery result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- Raw pattern instances: 3,116,520
- Unique pattern keys: 323,676
- Detailed candidates: 105,501
- Low-support patterns: 218,175
- Detailed candidates passing all frozen promotion gates: 948
  - Mtaji 921 / Namua 27
  - coarse-no-index 833 / indexed 115
- Frozen ranking/cap independently reapplied: exact promoted-key match
- Promoted definitions: 8
- Post-cap ranks derive from pre-cap eligible positions `1,2,22,23,40,41,645,646`
- Candidate freeze: `STAGE_1_CANDIDATE_FREEZE.json`
- Human-readable result: `STAGE_1_EXPLORATORY_RESULT.md`
- Stage 2 generation: **NOT AUTHORIZED**

### TM-S1-E05 — Stage 1 candidate freeze / support-equivalence audit

- Status: **COMPLETE**
- Frozen candidate definitions: 8
- Phase cap outcome: 4 Mtaji / 4 Namua
- Move-abstraction cap outcome: 2 definitions for each of 4 exact move-abstraction tokens
- Support-equivalent pairs by identical `supportIdentityHash`: ranks 1–2, 3–4, 5–6, 7–8
- Boundary: support equivalence is an audit observation, not a manual merge
- Any Stage 2 grouping must be prospective and frozen before fresh data

## Stage 2 — Fresh prospective formal confirmation

### TM-S2-A00 — Candidate/family formalization

- Status: **NEXT / NOT YET FROZEN**
- Must decide prospectively whether the eight Stage 1 definitions are tested individually, as four support-equivalent families, or hierarchically
- Must freeze exact formal candidate matching before any Stage 2 corpus generation

### TM-S2-F01+ — Candidate-specific/family-specific confirmation

- Status: **NOT AUTHORIZED / NOT DESIGNED YET**
- Fresh non-overlapping corpus required
- Separate formal preregistration required
- Explicit generation authorization required

## Naming rule

Stage 1 candidate labels remain exploratory until a prospective Stage 2 decision is complete. The term `confirmed tesuji` is reserved for a candidate that passes a separately frozen Stage 2 rule.
