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

- Status: **GENERATED / FULLY VERIFIED**
- Population: 768 games
- Seeds: `21900001–21900768`
- Generation strata: 6 × 128 games
- Source commit used for generation: `6694714194eee2f536e90b4411566d9126e162ae`
- Unique historical trajectories: 741
- Duplicate historical-trajectory groups: 27
- Largest duplicate group: 2
- Distinct opening prefixes: 681
- Manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`
- Verification: `passed=true`
- Full search recomputation: `true`
- Games verified: 768
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`
- Source tree dirty: false
- Scientific source hash mapping: manifest/verifier exact match to frozen authorization binding
- Output root: `artifacts/local/tactical-motifs/stage1-exploratory-v1/`
- Confirmatory reuse: forbidden

### TM-S1-E02 — Deterministic state selection / readiness audit

- Status: **COMPLETE / READINESS PASSED**
- Input requirement: `verification.json` with `passed=true` and `fullSearchRecomputation=true` — satisfied before execution
- Unique historical trajectories: 741
- Unavailable assigned phase: 25, no replacement
- Selected before rule-state collapse: 716
- Duplicate selected rule states collapsed: 1
- Selected unique rule states: 715
- Selected phases: Namua 370 / Mtaji 345
- Distinct selected opening prefixes: 659
- Selected strata: `B-D1=114`, `B-D2=115`, `B-D3=122`, `LS-D2=122`, `V2-D2=121`, `LE-D2=121`
- Selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- Replacement performed: false
- Frozen readiness gates: all six passed
- Measurement authorization: **YES, by preregistered gate**

### TM-S1-E03 — All-move exact measurement

- Status: **AUTHORIZED / NOT YET EXECUTED**
- Roots: 715 frozen selected unique rule states
- Measurement unit: every exact legal `E.moveVariants` move at each selected root
- Frozen instrumentation: move transition, all-immediate-reply response envelope, exact D1/D2/D3 root values, D1 reply search
- Discovery readiness gate: at least 1800 measured exact move records
- Discovery remains blocked until `measurement-manifest.json` reports `measurementReadinessPassed=true`

### TM-S1-E04 — Exploratory candidate discovery

- Status: **BLOCKED PENDING TM-S1-E03 READINESS**
- Candidate grammar/promotion thresholds: already frozen before corpus generation
- Any promoted candidate is for Stage 2 planning only

## Stage 2 — Fresh prospective formal confirmation

### TM-S2-F01+ — Candidate-specific/family-specific confirmation

- Status: **NOT AUTHORIZED / NOT DESIGNED YET**
- Prerequisite: Stage 1 candidate freeze plus candidate-specific formal preregistration and explicit generation authorization
- Fresh non-overlapping corpus required

## Naming rule

Stage 1 candidate labels remain exploratory until a prospective Stage 2 decision is complete. The term `confirmed tesuji` is reserved for a candidate that passes a separately frozen Stage 2 rule.
