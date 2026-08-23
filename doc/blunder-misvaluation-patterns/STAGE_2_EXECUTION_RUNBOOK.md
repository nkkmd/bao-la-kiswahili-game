# Blunder / Misvaluation Patterns Study 1 — Stage 2 Execution Runbook

Updated: 2026-08-23  
Status: **HISTORICAL EXECUTION RUNBOOK — STAGE 2 COMPLETE**

> This file records the frozen execution order and the completed execution audit. It is no longer an instruction to generate another Stage 2 corpus. Final scientific results are canonical in [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) and [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json).

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
research branch = research/blunder-misvaluation-patterns-stage2-formal
baseline integrated main = 52f5635be7064b5016baf7cde82faebe60609d9e
```

## 1. Frozen mandatory execution order

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal D3 measurement
-> independent formal measurement verification
-> formal evaluation
```

This order was executed without skipping a gate.

## 2. Completed execution record

### Authorization acceptance

The source-bound authorization was accepted against the exact candidate/spec hashes and ordered scientific source-file SHA-256 map before scientific generation.

### Corpus generation

```text
games = 4096 / 4096
seeds = 22500001..22504096
maxPly = 100
unique historical trajectories = 3559
distinct opening prefixes = 2827
```

Raw artifact root:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/
```

### Independent corpus verification

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 4096
```

### Outcome-blind support-group selection

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 Namua selected unique states = 1868
G02 Mtaji selected unique states = 810
final Stage 1 overlap = 0 / 0 / 0
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
```

### Formal D3 measurement

```text
G01 measurements = 1868
G02 measurements = 810
total measurements = 2678
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurementIntegrityPassed = true
```

### Independent measurement verification

```text
verifiedMeasurementRows = 2678
measurementHashMatches = true
stage1IdentityFirewallPassed = true
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
passed = true
```

### Formal evaluation

The formal result file is:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/stage2-formal-result.json
```

Final decision:

```text
formal candidates = 4
estimable = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
```

## 3. Formal-evaluation provenance note

The wrapper command `run-blunder-misvaluation-stage2-formal.js --phase evaluate` correctly blocked evaluation unless independent measurement verification had passed, but the wrapper did not pass the verification object into `evaluateFromRows()`. Its first result therefore had the provenance field `independentMeasurementVerificationHash = null` even though the verification gate had been enforced.

No scientific endpoint, threshold, candidate, support set, or input data were changed. The already-frozen direct evaluator was then executed against the same verified measurement artifacts. It produced the same endpoint decisions and bound the existing independent verification correctly:

```text
independentMeasurementVerificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
```

The direct-evaluator output is the canonical raw formal result. This was a provenance-binding correction, not a scientific reanalysis or rescue.

## 4. Authorization correction audit

The first authorization commit `a0e7d9ee619d081749039271f039b32267699d4b` contained one clerical source-hash transcription error and was never used. Final valid authorization is:

```text
a9eee06c6a1ad36f9e65948f5d78eff58a91d561
```

The correction occurred before scientific generation and did not alter scientific semantics.

## 5. No-rescue boundary

No seed extension, replacement sampling, alternate root after identity overlap, candidate edit/merge/split/rename, matcher/failure substitution, phase reassignment, endpoint/null/floor retuning, alpha/multiplicity change, favorable subgroup promotion, primary depth/evaluator switch, or manual override was performed.

The completed Stage 2 cannot be rerun with changed rules to rescue a result. A materially different question requires a new prospective version and a newly audited fresh seed block.

## 6. Interpretation boundary

The four exact frozen machine patterns were `NOT-CONFIRMED`. This does not establish that the moves are game-theoretically non-blunders, nor does it establish human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity.