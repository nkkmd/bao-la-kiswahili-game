# EXPERIMENT_INDEX — Tactical Motifs / Tesuji Study 1

## Stage 0 — Technical / representation audit

### TM-S0-A01 — Existing identity and representation audit

- Status: COMPLETE BY CODE/DOCUMENT INSPECTION
- Inputs: engine, position-typology features, symmetry transforms
- Scientific inference: not authorized
- Output: `STAGE_0_TECHNICAL_AUDIT.md`

### TM-S0-A02 — Move-transition feature instrumentation

- Status: IMPLEMENTED; technical validation required on branch CI
- Tool: `tools/experiments/lib/tactical-motif-features.js`
- Test: `test/tactical-motif-stage0.test.js`
- Purpose: actor-relative move/event/structural deltas and reply-set measurement
- Scientific corpus: none

### TM-S0-A03 — Exact search instrumentation reuse audit

- Status: COMPLETE BY CODE/TEST INSPECTION
- Reused tool: `tools/experiments/lib/position-complexity-search-diagnostic.js`
- Supported: exact root candidate tables, D1/D2/D3, tie-aware top sets, depth trace
- Unsupported: search-consistent PV reconstruction

## Stage 1 — Prospective exploratory discovery

### TM-S1-E01 — Exploratory discovery corpus

- Status: NOT AUTHORIZED / NOT GENERATED
- Prerequisite: machine-readable Stage 1 spec committed and technically validated
- Required outputs when authorized: local manifest, verification/audit, selected-state inventory, motif-candidate inventory
- Confirmatory reuse: forbidden

## Stage 2 — Fresh prospective formal confirmation

### TM-S2-F01+ — Candidate-specific/family-specific confirmation

- Status: NOT AUTHORIZED / NOT DESIGNED YET
- Prerequisite: Stage 1 candidate freeze plus candidate-specific formal preregistration and explicit generation authorization
- Fresh non-overlapping corpus required

## Naming rule

Stage 0 identifiers are technical only. Stage 1 candidate labels must remain exploratory (for example `TM-CAND-*`) until a prospective Stage 2 decision is complete. The term `confirmed tesuji` is reserved for a candidate that passes its frozen Stage 2 rule.
