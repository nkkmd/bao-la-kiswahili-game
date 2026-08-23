# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23

## Research identity

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 research branch = research/blunder-misvaluation-patterns-stage2-formal
```

Frozen Stage 2 identity:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
scientific generation source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
scientific measurement source commit = 06ce63155c5b060a9ea3f80ba5a2dc48216e848b
```

## Current scientific state

```text
Stage 1 exploratory discovery = COMPLETE / 4 CANDIDATES PROMOTED
Stage 1 integrated to main = COMPLETE

Stage 2 candidate/spec/source freeze = COMPLETE
Stage 2 technical validation = PASS
Stage 2 generation authorization = COMPLETE
Stage 2 scientific generation = COMPLETE (4096 / 4096)
Stage 2 independent full replay/search verification = PASS
Stage 2 outcome-blind support-group selection = PASS
Stage 2 formal measurement = COMPLETE (2678 rows)
Stage 2 independent formal measurement verification = PASS
Stage 2 formal evaluation = OPEN / NOT YET PERFORMED
Stage 2 formal result = NONE
Study 1 formal result = NONE
```

## Corpus and verification

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
fullSearchRecomputation = true
```

## Outcome-blind selection

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 Namua selected unique states = 1868
G02 Mtaji selected unique states = 810
G01 / G02 estimablePreview = true / true
final Stage 1 overlap = 0 / 0 / 0
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
selectionIntegrityPassed = true
```

## Formal measurement and independent verification

```text
BMP-S2-G01-NAMUA measurements = 1868
BMP-S2-G02-MTAJI measurements = 810
total formal measurements = 2678
allFormalD3CandidateTablesFinite = true
measurementIntegrityPassed = true
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
```

Independent verification:

```text
verifiedMeasurementRows = 2678
measurementHashMatches = true
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
final Stage 1 overlap = 0 / 0 / 0
stage1IdentityFirewallPassed = true
verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
passed = true
```

## Frozen formal decision boundary

Per candidate estimability:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Co-primary endpoints:

```text
failure-signature recurrence: H0 p <= 0.50; observed floor >= 0.65
D3-inferior recurrence:       H0 p <= 0.50; observed floor >= 0.70
4 candidates x 2 endpoints = 8 tests
FWER alpha = 0.05
Holm-Bonferroni
```

Additional gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Formal labels are `CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE`, or `TECHNICAL-INCONCLUSIVE`. Zero confirmed candidates is valid.

## Mandatory execution order

```text
generate                                                COMPLETE
-> independent corpus verification                     PASS
-> support-group select                                 PASS
-> formal measure                                       COMPLETE
-> independent formal measurement verification         PASS
-> formal evaluate                                      OPEN
```

No seed extension, replacement, alternate root after overlap, candidate edit, matcher/failure substitution, phase reassignment, endpoint/null/floor retuning, multiplicity change, favorable subgroup promotion, alternate primary depth/evaluator or manual override is authorized.

## Interpretation boundary

No candidate has yet been confirmed or rejected. A future `CONFIRMED` result would mean only machine-reproducible recurrence under the frozen Bao engine/search/population. It would not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity.

## Immediate next gate

Run the frozen formal evaluator only. Archive and review `formal-result.json` before any study-level closure or `main` integration.
