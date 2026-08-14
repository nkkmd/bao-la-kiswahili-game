# EXPERIMENT_INDEX — Tactical Motifs / Tesuji Study 1

## Stage 0 — Technical / representation audit

### TM-S0-A01 — Existing identity and representation audit

- Status: **COMPLETE / VALIDATED**
- Inputs: engine, position-typology features, symmetry transforms
- Scientific inference: not authorized
- Output: `STAGE_0_TECHNICAL_AUDIT.md`

### TM-S0-A02 — Move-transition feature instrumentation

- Status: **COMPLETE / VALIDATED**
- Tool: `tools/experiments/lib/tactical-motif-features.js`
- Test: `test/tactical-motif-stage0.test.js`
- Validation: GitHub Actions run `31768708597` = `success`
- Purpose: actor-relative move/event/structural deltas and reply-set measurement
- Scientific corpus: none

### TM-S0-A03 — Exact search instrumentation reuse audit

- Status: **COMPLETE / VALIDATED**
- Reused tool: `tools/experiments/lib/position-complexity-search-diagnostic.js`
- Supported: exact root candidate tables, D1/D2/D3, tie-aware top sets, depth trace
- Unsupported: search-consistent PV reconstruction
- Prerequisite search-diagnostic test passed in Stage 0 CI run `31768708597`.

## Stage 1 — Prospective exploratory discovery

### TM-S1-A00 — Pre-generation design/specification freeze

- Status: **FROZEN / TECHNICAL VALIDATION PENDING**
- Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`
- Spec: `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- Protocol: `STAGE_1_EXPLORATORY_PROTOCOL.md`
- Scientific corpus: not generated
- Generation authorization: not yet granted
- Confirmatory reuse: forbidden

### TM-S1-A01 — Stage 1 representation / candidate-grammar tooling

- Status: **IMPLEMENTED / TECHNICAL VALIDATION PENDING**
- Feature helper: `tools/experiments/lib/tactical-motif-features.js`
- Candidate discovery grammar: `tools/experiments/lib/tactical-motif-discovery.js`
- Spec validator: `tools/experiments/validate-tactical-motif-stage1-spec.js`
- Test: `test/tactical-motif-stage1-tooling.test.js`
- CI: `.github/workflows/tactical-motif-stage1-spec.yml`
- Scientific corpus generation: impossible from this tooling alone

### TM-S1-A02 — Scientific corpus runner / independent verifier

- Status: **NOT YET IMPLEMENTED / NEXT GATE**
- Constraint: must implement the frozen v1 contract without changing population, selection, measurement, promotion, or no-rescue rules
- Authorization: forbidden until implementation receives separate technical validation

### TM-S1-E01 — Exploratory discovery corpus

- Status: **NOT AUTHORIZED / NOT GENERATED**
- Population: 768 games, seeds `21900001–21900768`
- Generation strata: 6 × 128 games
- Required execution order: generate → verify → select → measure → discover
- Required outputs:
  - `manifest.json`
  - `verification.json`
  - `selection-audit.json`
  - `selected-states.json`
  - `measurement-manifest.json`
  - `discovery-result.json`
- Confirmatory reuse: forbidden
- Candidate output, if any: Stage 2 planning only

## Stage 2 — Fresh prospective formal confirmation

### TM-S2-F01+ — Candidate-specific/family-specific confirmation

- Status: **NOT AUTHORIZED / NOT DESIGNED YET**
- Prerequisite: Stage 1 candidate freeze plus candidate-specific formal preregistration and explicit generation authorization
- Fresh non-overlapping corpus required

## Naming rule

Stage 0 identifiers are technical only. Stage 1 candidate labels must remain exploratory
(for example `TM-CAND-*`) until a prospective Stage 2 decision is complete.

The term `confirmed tesuji` is reserved for a candidate that passes its frozen Stage 2 rule.
