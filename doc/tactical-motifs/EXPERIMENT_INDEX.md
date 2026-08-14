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

### TM-S1-A01 — Stage 1 representation / candidate grammar

- Status: **COMPLETE / VALIDATED**
- Feature helper: `tools/experiments/lib/tactical-motif-features.js`
- Candidate grammar: `tools/experiments/lib/tactical-motif-discovery.js`
- Spec validator: `tools/experiments/validate-tactical-motif-stage1-spec.js`
- Test: `test/tactical-motif-stage1-tooling.test.js`

### TM-S1-A02 — Scientific corpus runner / independent verifier

- Status: **COMPLETE / VALIDATED**
- Corpus helper: `tools/experiments/lib/tactical-motif-stage1-corpus.js`
- Runner: `tools/experiments/run-tactical-motif-stage1-exploratory.js`
- Independent verifier: `tools/experiments/verify-tactical-motif-stage1-exploratory.js`
- Implementation commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Validation run: `31770629848` = `success`
- Validation job: `94675639391` = `success`
- CI scientific games generated: 0

### TM-S1-A03 — Stage 1 generation authorization

- Status: **COMPLETE**
- Authorization: `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`
- Binds: spec SHA-256 + implementation commit + exact scientific source-file SHA-256 mapping
- Confirmatory inference: not authorized
- Stage 2 generation: not authorized

### TM-S1-E01 — Exploratory discovery corpus

- Status: **AUTHORIZED / NOT GENERATED**
- Population: 768 games
- Seeds: `21900001–21900768`
- Generation strata: 6 × 128 games
- Execution order: `generate → verify → select → measure → discover`
- Output root: `artifacts/local/tactical-motifs/stage1-exploratory-v1/`
- Confirmatory reuse: forbidden
- Candidate output, if any: Stage 2 planning only

## Stage 2 — Fresh prospective formal confirmation

### TM-S2-F01+ — Candidate-specific/family-specific confirmation

- Status: **NOT AUTHORIZED / NOT DESIGNED YET**
- Prerequisite: Stage 1 candidate freeze plus candidate-specific formal preregistration and explicit generation authorization
- Fresh non-overlapping corpus required

## Naming rule

Stage 1 candidate labels remain exploratory until a prospective Stage 2 decision is complete. The term `confirmed tesuji` is reserved for a candidate that passes a separately frozen Stage 2 rule.
