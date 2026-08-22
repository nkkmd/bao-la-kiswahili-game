# CURRENT_STATUS — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

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
candidate freeze ID = BMP-S2-CANDIDATES-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
technical validation result commit = 3d5a1a33f673c9c98ba6a5ed2862b25c8d76e777
execution source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
```

## Current scientific state

```text
Stage 0 technical / construct audit = COMPLETE
Stage 1 fresh exploratory discovery = COMPLETE
Stage 1 promoted candidates = 4
Stage 1 integrated to main = COMPLETE

Stage 2 candidate definition freeze = COMPLETE
Stage 2 formal protocol/spec = FROZEN
Stage 2 runner/verifiers/evaluator = MATERIALIZED
Stage 2 local technical validation = PASS
Stage 2 exact scientific source-file SHA-256 freeze = COMPLETE
Stage 2 generation authorization = COMPLETE
Stage 2 scientific generation = AUTHORIZED
Stage 2 generated games = 0 / 4096
Stage 2 corpus verification = PENDING
Stage 2 selection = PENDING
Stage 2 formal measurement = PENDING
Stage 2 independent measurement verification = PENDING
Stage 2 formal result = NONE
Study 1 formal result = NONE
```

## Formal candidate mapping

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share exactly one frozen Namua support group/root denominator and deterministic candidate move; only failure token differs. C04 uses the frozen Mtaji support group.

## Fixed Stage 2 population

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
opening = first 8 plies seeded-uniform exact E.moveVariants
```

Generation strata:

```text
B-D1 = 683
B-D2 = 683
B-D3 = 683
LS-D2 = 683
V2-D2 = 682
LE-D2 = 682
```

No early stopping, replacement, or seed extension is authorized.

## Stage 1 leakage firewall

Final Stage 2 formal evidence must have zero Stage 1 overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Trajectory/opening overlap removes the Stage 2 trajectory before candidate-root selection. Rule-state overlap is checked after outcome-blind root selection; the selected root/trajectory is removed with no alternate root and no replacement.

## Formal measurement / endpoints

```text
evaluation = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary depth = D3
quiescence depth = 1
perspective = root actor
```

Per candidate estimability:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Co-primary tests:

```text
failure-signature recurrence: H0 p <= 0.50; observed floor >= 0.65
D3-inferior recurrence:       H0 p <= 0.50; observed floor >= 0.70
4 candidates x 2 endpoints = 8 planned tests
FWER alpha = 0.05
Holm-Bonferroni
```

Additional confirmation gates:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Formal labels are `CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE`, or `TECHNICAL-INCONCLUSIVE`. Zero confirmed candidates is valid.

## Authorization correction audit

The first authorization commit `a0e7d9ee619d081749039271f039b32267699d4b` had one clerical source-hash transcription error. It was detected immediately and never used for scientific generation. The final corrected authorization is `a9eee06c6a1ad36f9e65948f5d78eff58a91d561` and matches the frozen source map.

## Mandatory execution order

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal measure
-> independent formal measurement verification
-> formal evaluate
```

No later phase may be run before the preceding gate is accepted.

## Interpretation boundary

Even a Stage 2 `CONFIRMED` result means only machine-reproducible recurrence under the frozen Bao engine/search/population. It does not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity.

## Immediate next gate

Pull the authorized branch. First inspect `--phase status`, then run the non-generating `C.loadAuthorization(...)` acceptance check from `STAGE_2_EXECUTION_RUNBOOK.md`. Only if that exact source-bound authorization check succeeds should the fixed 4096-game Stage 2 generation start. After generation, independent full replay/search verification is mandatory before any selection.
