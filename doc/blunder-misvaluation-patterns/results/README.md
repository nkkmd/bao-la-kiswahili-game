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
Stage 2 formal measurement = COMPLETE (2678 rows)
Stage 2 independent formal measurement verification = PASS
Stage 2 formal evaluation = OPEN / NOT YET PERFORMED
Stage 2 formal result = none
```

Compact machine-readable records stored here include:

- `STAGE_2_TECHNICAL_VALIDATION_RESULT.json`
- `STAGE_2_GENERATION_RESULT.json`
- `STAGE_2_VERIFICATION_RESULT.json`
- `STAGE_2_SELECTION_RESULT.json`
- `STAGE_2_MEASUREMENT_RESULT.json` — 2678 formal D3 measurements; finite candidate tables and measurement integrity PASS.
- `STAGE_2_MEASUREMENT_VERIFICATION_RESULT.json` — independent recomputation of D3 candidate tables and candidate matcher/failure classification; exact measurement hash reproduced; Stage 1 firewall PASS.

Stage 2 formal chain:

```text
games = 4096
unique historical trajectories = 3559
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 measurements = 1868
G02 measurements = 810
total measurements = 2678
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
measurementHashMatches = true
final Stage 1 overlap = 0 / 0 / 0
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
measurement verification passed = true
```

Frozen Stage 2 identities:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
measurement source commit = 06ce63155c5b060a9ea3f80ba5a2dc48216e848b
```

Large corpus and per-root measurement files remain under `artifacts/local/blunder-misvaluation-patterns/` and are not committed.

No candidate has yet been confirmed or rejected. The next permissible action is frozen formal evaluation only.

Interpretation remains machine-operational only; no game-theoretic, human-misconception, expert/traditional, pedagogical, causal or external-validity claim is authorized.
