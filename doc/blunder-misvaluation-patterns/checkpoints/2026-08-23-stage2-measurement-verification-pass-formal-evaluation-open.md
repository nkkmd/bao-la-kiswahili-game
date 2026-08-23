# Stage 2 formal measurement complete; independent verification PASS; formal evaluation open

Date: 2026-08-23

Study:

```text
BMP-STUDY1
stageId = BMP-S2-FORMAL-2026-08-22-v1
```

Frozen identities:

```text
candidate definition SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
scientific measurement source commit = 06ce63155c5b060a9ea3f80ba5a2dc48216e848b
```

Formal measurement completed:

```text
BMP-S2-G01-NAMUA = 1868 rows
BMP-S2-G02-MTAJI = 810 rows
total = 2678 rows
allFormalD3CandidateTablesFinite = true
measurementIntegrityPassed = true
```

Mandatory independent measurement verification:

```text
measurementHashMatches = true
verifiedMeasurementRows = 2678
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
stage1IdentityFirewallPassed = true
passed = true
```

Final Stage 1 overlap remained:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

The measurement manifest and independent verifier agree on the exact stage/spec/candidate/selection/measurement identities and frozen source map. No scientific source change, seed extension, replacement, alternate root, candidate edit, endpoint retuning, or manual override occurred.

Decision:

```text
Stage 2 formal measurement = COMPLETE
independent formal measurement verification = PASS
formal evaluation gate = OPEN
formal candidate decisions = NOT YET COMPUTED
Study 1 formal result = NONE
```

The next permissible action is the frozen formal evaluator only. No endpoint, alpha, multiplicity, estimability or candidate definition may be changed before evaluation.
