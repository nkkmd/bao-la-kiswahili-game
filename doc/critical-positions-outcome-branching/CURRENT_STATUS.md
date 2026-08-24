# CURRENT_STATUS — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-24

## Repository identity

```text
studyId = CPOB-STUDY1
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
study branch = research/critical-positions-outcome-branching
draft tracking PR = #36
directory = doc/critical-positions-outcome-branching/
artifact root = artifacts/local/critical-positions-outcome-branching/
```

## Final scientific state

```text
Stage 0 construct / technical / feasibility = COMPLETE / PASS
Stage 1 prospective design = FROZEN / VALIDATED
Stage 1 source-bound authorization = ISSUED
Stage 1 source generation = COMPLETE / 3072 of 3072
Stage 1 source seeds 22600001..22603072 = CONSUMED
Stage 1 independent full corpus replay = PASS
Stage 1 outcome-blind root selection = PASS
Stage 1 selected roots = 600 = 300 Namua + 300 Mtaji
Stage 1 continuation / secondary / structural measurement = PASS
Stage 1 independent full measurement verification = PASS
Stage 1 deterministic exploratory discovery = COMPLETE
Stage 1 promoted candidates = 0
Stage 2 generation = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds 22700001..22706144 = RESERVED / UNCONSUMED
Study 1 = CLOSED AFTER STAGE 1 NEGATIVE EXPLORATORY RESULT
```

Stage 1 remained exploratory throughout:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

## Frozen Stage 1 identity

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
authorization SHA-256 = 34ae3f2afb066521f2165f6e16d5edd720ab9587b71c64dce677696ad23cd941
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
discovery resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
uploaded discovery artifact SHA-256 = e1931c0f84b294bf8201e7732756bf156d688e4a38d55587e61b7303848d5024
```

## Source corpus and selection

```text
source games = 3072
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
fullCorpusReplay = true
gamesVerified = 3072
```

Outcome-blind selection:

```text
selectedUniqueRuleStates = 600
Namua = 300
Mtaji = 300
selected distinct opening prefixes = 567
replacementPerformed = false
phaseReassignmentPerformed = false
selection readiness = PASS
```

Selection did not use winner, continuation outcome, `D_range`, D2/D3 score, candidate matcher or post-move consequence.

## Measurement and independent verification

Frozen primary measurement:

```text
policy = P1_NORMAL_TOP3
replicates per exact legal root move = 64
maximum post-root continuation plies = 200
primary statistic = D_range = max(move win rate) - min(move win rate)
highDivergence = D_range >= 0.30
```

Measurement readiness:

```text
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
finiteD2D3CandidateTables = PASS
```

Independent verification:

```text
passed = true
rootsReselectedIndependently = 600
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
```

## Stage 1 exploratory result

The 600 selected roots contained high-divergence roots under the frozen policy:

```text
Namua = 52 / 300
Mtaji = 87 / 300
overall = 139 / 600
```

These counts are obtained by summing the disjoint single-token `legalMoveCount` bins within each phase.

Candidate discovery:

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
zeroPromotedCandidatesAllowed = true
manualOverridePerformed = false
```

Therefore the bounded scientific conclusion is:

> High fixed-policy empirical continuation divergence occurs in fresh Stage 1 roots, but the prospectively frozen one-to-two-token pre-root structural grammar produced no candidate satisfying all support, diversity, recurrence and median-divergence promotion gates.

## Why Stage 2 was not executed

Stage 2 required an exact Stage 1 promoted-candidate mapping to be frozen before any Stage 2 data generation. Because `promotedCandidateCount = 0`, there is no eligible candidate mapping.

Selecting a near miss, lowering the 0.65 recurrence floor, lowering the 0.35 median `D_range` floor, broadening the grammar, extending seeds or manually promoting a pattern would be result-triggered rescue and is forbidden.

Therefore:

```text
Stage 2 formal candidate count = 0
Stage 2 generation = NOT AUTHORIZED / NOT EXECUTED
formal candidate labels = NOT APPLICABLE
```

This is not a `NOT-CONFIRMED` candidate result because no candidate entered formal confirmation.

## Interpretation boundary

This Study does **not** establish:

```text
absence of Bao turning points
true/game-theoretic winning probabilities
engine score difference = win-probability difference
absence of higher-dimensional or nonlinear structural representations
absence of human/expert-recognized important positions
traditional Bao strategic importance
```

Position Evaluation / Win-Rate Calibration Study 1 remains formal `INCONCLUSIVE`; its exploratory isotonic mapping was not used as a validated probability converter.

## No-rescue closure

```text
seed extension = false
replacement sampling = false
root replacement = false
phase reassignment = false
replicate extension = false
continuation policy substitution = false
D_range threshold retuning = false
candidate grammar edit = false
promotion threshold relaxation = false
near-miss promotion = false
manual override = false
```

## Seed state

```text
Stage 0 scientific seed block = NONE
Stage 1 = 22600001..22603072 -> CONSUMED
Stage 2 = 22700001..22706144 -> RESERVED / NEVER AUTHORIZED / UNCONSUMED
```

## Canonical closure documents

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — human-facing overview
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — scientific/technical final synthesis
- [`results/STAGE_1_EXPLORATORY_SUMMARY.json`](results/STAGE_1_EXPLORATORY_SUMMARY.json) — compact machine-readable summary
- [`checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md`](checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md) — closure checkpoint

Completed prior-study formal labels remain immutable and are not changed by this Study.
