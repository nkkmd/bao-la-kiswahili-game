# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23

## Research identity

```text
studyId = BMP-STUDY1
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 research branch = research/blunder-misvaluation-patterns-stage2-formal
```

Stage 1 immutable identities:

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
raw discovery SHA-256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
promoted exploratory candidates = 4
```

Stage 2 frozen/authorized identities:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
technical validation result commit = 3d5a1a33f673c9c98ba6a5ed2862b25c8d76e777
execution source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
```

## Current scientific state

```text
Stage 0 technical / construct audit = COMPLETE
Stage 1 fresh exploratory discovery = COMPLETE
Stage 1 promoted candidates = 4
Stage 1 integrated to main = COMPLETE

Stage 2 candidate definition freeze = COMPLETE
Stage 2 formal protocol/spec = FROZEN
Stage 2 technical validation = PASS
Stage 2 exact source-file SHA-256 freeze = COMPLETE
Stage 2 generation authorization = COMPLETE
Stage 2 scientific generation = COMPLETE (4096 / 4096)
Stage 2 independent full replay/search verification = PASS
Stage 2 outcome-blind support-group selection = PASS
Stage 2 formal measurement = OPEN
Stage 2 independent measurement verification = PENDING
Stage 2 formal result = NONE
Study 1 formal result = NONE
```

## Stage 2 corpus / verification

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
fullSearchRecomputation = true
verification passed = true
scientific source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
```

Condition counts are fixed at B-D1/B-D2/B-D3/LS-D2 = 683 each and V2-D2/LE-D2 = 682 each.

## Stage 2 outcome-blind selection result

Overall selection identity:

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
selectionIntegrityPassed = true
```

Pre-selection Stage 1 leakage firewall:

```text
representative historical trajectories = 3559
historicalTrajectoryHash overlap dropped = 299
openingPrefixHash overlap dropped = 633
```

G01 Namua, shared by C01/C02/C03:

```text
eligible trajectories = 1890
Stage 1 rule-state overlap dropped = 0
duplicate selected rule states collapsed = 22
selected unique rule states = 1868
distinct opening prefixes = 1695
generation strata = 6
maximum opening-prefix share = 0.0021413276231263384
maximum stratum share = 0.20717344753747324
estimablePreview = true
```

G02 Mtaji, used by C04:

```text
eligible trajectories = 823
Stage 1 rule-state overlap dropped = 1
duplicate selected rule states collapsed = 12
selected unique rule states = 810
distinct opening prefixes = 763
generation strata = 6
maximum opening-prefix share = 0.0049382716049382715
maximum stratum share = 0.18888888888888888
estimablePreview = true
```

Final Stage 1 overlap in selected formal evidence:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
stage1IdentityFirewallPassed = true
```

No rescue occurred:

```text
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
```

## Formal candidate mapping

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share exactly one frozen Namua support group/root denominator and deterministic candidate move; only failure token differs. C04 uses the frozen Mtaji support group.

## Formal measurement / decision boundary

Formal measurement is standardized to:

```text
evaluation = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary depth = D3
quiescence depth = 1
perspective = root actor
```

Per-candidate estimability gates remain:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Co-primary tests remain:

```text
failure-signature recurrence: H0 p <= 0.50; observed floor >= 0.65
D3-inferior recurrence:       H0 p <= 0.50; observed floor >= 0.70
4 candidates x 2 endpoints = 8 planned tests
FWER alpha = 0.05
Holm-Bonferroni
```

Additional confirmation gates are D3 TopSet rate <= 0.20 and median normalized rank loss >= 0.50.

Formal labels are `CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE`, or `TECHNICAL-INCONCLUSIVE`. Zero confirmed candidates is valid.

## Mandatory execution order

```text
generate                                                  COMPLETE
-> independent full replay + generation-search verify    PASS
-> support-group select                                   PASS
-> formal measure                                         OPEN
-> independent formal measurement verification           PENDING
-> formal evaluate                                        BLOCKED
```

No seed extension, replacement, alternate root after overlap, candidate edit, matcher/failure substitution, phase reassignment, endpoint/null/floor retuning, multiplicity change, favorable subgroup promotion, alternate primary depth/evaluator or manual override is authorized.

## Interpretation boundary

No candidate has yet been confirmed or rejected. Even a future Stage 2 `CONFIRMED` result means only machine-reproducible recurrence under the frozen Bao engine/search/population. It does not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity.

## Immediate next gate

Run the frozen formal D3 measurement only. Do not evaluate. After measurement, archive `measurement-manifest.json` and run the independent formal measurement verifier before any formal endpoint decision is allowed.
