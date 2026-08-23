# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23

## Research identity

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 research branch = research/blunder-misvaluation-patterns-stage2-formal
Stage 2 pre-merge branch HEAD = 1451181211d98e7db48f8817472d3f4338acb5ab
Stage 2 integration PR = #34
Stage 2 integration merge commit = da2f5a1a18debe8bf09cd0bcaab8ef64ddf5d7d7
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
Stage 0 technical / construct audit = COMPLETE
Stage 1 exploratory discovery = COMPLETE / 4 CANDIDATES PROMOTED
Stage 1 integrated to main = COMPLETE
Stage 2 candidate/spec/source freeze = COMPLETE
Stage 2 technical validation = PASS
Stage 2 scientific generation = COMPLETE (4096 / 4096)
Stage 2 independent full replay/search verification = PASS
Stage 2 outcome-blind support-group selection = PASS
Stage 2 formal measurement = COMPLETE (2678 rows)
Stage 2 independent formal measurement verification = PASS
Stage 2 formal evaluation = COMPLETE
Stage 2 formal candidates = 4 ESTIMABLE / 0 CONFIRMED / 4 NOT-CONFIRMED
Study 1 formal result = COMPLETE / ZERO CONFIRMED
Study 1 = CLOSED
Stage 2 integrated to main = COMPLETE
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

## Formal result

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
confirmedCount = 0
```

Key recurrence rates:

| Candidate | Failure signature | D3-inferior | D3 TopSet | Median normalized rank loss |
| --- | ---: | ---: | ---: | ---: |
| C01 | 0.923983 | 0.464668 | 0.152034 | 0.500000 |
| C02 | 0.797645 | 0.464668 | 0.152034 | 0.500000 |
| C03 | 0.794968 | 0.464668 | 0.152034 | 0.500000 |
| C04 | 0.627160 | 0.507407 | 0.193827 | 0.500000 |

C01-C03 reproduce their structural failure signatures but fail the preregistered D3-inferior co-primary endpoint. C04 fails the absolute failure-signature floor as well as the D3-inferior endpoint.

Canonical identities:

```text
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw stage2-formal-result.json SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

The earlier wrapper-generated local result with `independentMeasurementVerificationHash = null` is superseded. The canonical result binds `e2a57675...7382`; endpoint values and decisions are unchanged.

## Interpretation boundary

`NOT-CONFIRMED` is a machine-operational formal decision under the frozen Stage 2 definition. It is not evidence that a move is game-theoretically sound or harmless to humans.

No game-theoretic blunder, human misconception, expert/traditional recognition, pedagogical, causal-mechanism or external-validity claim is authorized. D3 remains a frozen machine reference, not ground truth.

## No-rescue closure

No seed extension, replacement, alternate-root rescue, candidate edit/merge/split, matcher/failure substitution, phase reassignment, endpoint/null/floor retuning, multiplicity/alpha change, favorable subgroup promotion, alternate primary depth/evaluator or manual override was used.

## Repository closure state

The final cross-document audit updated only documentation and compact result/provenance records after the frozen scientific execution chain. No engine, AI, Stage 2 scientific tooling, candidate/spec, source-freeze or authorization artifact was modified after scientific execution.

```text
pre-Stage-2-integration main = 52f5635be7064b5016baf7cde82faebe60609d9e
pre-merge research branch HEAD = 1451181211d98e7db48f8817472d3f4338acb5ab
integration PR = #34
merge commit = da2f5a1a18debe8bf09cd0bcaab8ef64ddf5d7d7
main integration of Stage 2 = COMPLETE
final cross-document audit = PASS
post-merge status synchronization = COMPLETE
```

Historical protocol/checkpoint status lines that describe their original freeze-time gate are intentionally preserved and are not current-status claims.

## Final state

Study 1 is scientifically and repository-wise closed on `main`. Any future investigation of these structural failure signatures, alternate search depths/evaluators, human judgement or game-theoretic status must be a new prospective study.

See:

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
