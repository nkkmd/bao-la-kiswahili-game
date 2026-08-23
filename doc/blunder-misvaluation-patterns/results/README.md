# Results

No Stage 2 formal endpoint result exists yet.

Current state:

```text
Stage 1 exploratory discovery = COMPLETE
Stage 1 exploratory candidates promoted = 4
Stage 2 candidate/spec/source freeze = COMPLETE
Stage 2 technical validation = PASS
Stage 2 scientific generation = COMPLETE (4096 / 4096)
Stage 2 independent full replay/search verification = PASS
Stage 2 support-group selection = PASS
Stage 2 formal measurement = OPEN
Stage 2 independent measurement verification = PENDING
Stage 2 formal result = none
```

Compact machine-readable records stored here:

- `STAGE_0_FEASIBILITY_RESULT.json`
- `STAGE_1_CONTRACT_VALIDATION_RESULT.json`
- `STAGE_1_TOOLING_VALIDATION_RESULT.json`
- `STAGE_1_GENERATION_RESULT.json`
- `STAGE_1_VERIFICATION_RESULT.json`
- `STAGE_1_SELECTION_RESULT.json`
- `STAGE_1_MEASUREMENT_RESULT.json`
- `STAGE_1_DISCOVERY_RESULT.json`
- `STAGE_2_TECHNICAL_VALIDATION_RESULT.json`
- `STAGE_2_GENERATION_RESULT.json` — authorized fixed 4096-game formal corpus generation summary/provenance.
- `STAGE_2_VERIFICATION_RESULT.json` — independent full replay + generation-search verification PASS.
- `STAGE_2_SELECTION_RESULT.json` — outcome-blind support-group selection PASS with Stage 1 identity firewall `0 / 0 / 0` and prospective estimability PASS for both support groups.

Stage 2 corpus summary:

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
fullSearchRecomputation = true
verification passed = true
```

Stage 2 selection summary:

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 Namua selected unique rule states = 1868
G02 Mtaji selected unique rule states = 810
G01 / G02 estimablePreview = true / true
final Stage 1 overlap = 0 / 0 / 0
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
selectionIntegrityPassed = true
```

Frozen Stage 2 identities:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
scientific source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
```

Large Stage 1/Stage 2 corpora and per-root measurements remain local under `artifacts/local/blunder-misvaluation-patterns/`.

No candidate has yet been confirmed or rejected. The next permissible action is frozen formal D3 measurement. Formal endpoint evaluation remains blocked until independent measurement verification passes.

Interpretation remains machine-operational only; no game-theoretic, human-misconception, expert/traditional, pedagogical, causal or external-validity claim is authorized.
