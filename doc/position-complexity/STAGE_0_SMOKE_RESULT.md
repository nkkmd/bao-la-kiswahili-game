# Position Complexity Study 1 — Stage 0 Technical Validation Result

更新日: 2026-08-12  
Status: **PASS / TECHNICAL ONLY / NO SCIENTIFIC INFERENCE**

## 1. Purpose

This record closes the implementation-validation portion of Stage 0 for:

> Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離

No exploratory or formal scientific corpus was generated. The validation used only three fixed technical fixtures and existing engine regression tests.

## 2. Validated source identity

Research branch:

```text
research/position-complexity-difficulty
```

Validated branch head:

```text
7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
```

Base main head:

```text
d681b4593242973fcb33805edca12eb3e8633653
```

Draft PR:

```text
#29
research/position-complexity-difficulty -> main
state = open / draft
```

Successful workflow:

```text
name = Position Complexity Stage 0 CI
run id = 31589325398
run number = 3
job id = 94090388506
conclusion = success
```

Runner:

```text
Ubuntu 24.04.4 LTS
Node v24.18.0
```

## 3. Instrumentation added

Exact research diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
```

Search semantics identifier:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

The diagnostic is separate from `public/ai.js`; normal game move selection is not modified.

It provides, for every legal root move:

```text
moveKey
exact searched score under documented root-player perspective
score-domain classification
candidate-local deterministic search counters
```

Root summary:

```text
bestScore
secondBestScore
bestSecondGap
topSetMoveKeys
topSetSize
canonicalBestMoveKey
```

Depth trace:

```text
per-depth exact root-candidate result
adjacent-depth TopSet overlap
tie-aware TopSet disjointness
canonical-best change
best-score delta
best-score sign reversal
```

Terminal/mate-domain scores are explicitly separated from ordinary evaluator-domain margins using the engine `WIN = 1,000,000` score domain.

## 4. Validation tooling

Unit test:

```text
test/position-complexity-search-diagnostic.test.js
```

Technical smoke runner:

```text
tools/experiments/run-position-complexity-stage0-smoke.js
```

CI workflow:

```text
.github/workflows/position-complexity-stage0-ci.yml
```

The workflow runs only small technical tests. It does not generate Stage 1 or Stage 2 corpora.

## 5. Successful gate result

CI summary:

```text
passed = true
fixtureCount = 3

G0_1_stateImmutability          = true
G0_2_legalRootExhaustiveness    = true
G0_3_commonRootPlayerPerspective = true
G0_4_fixedDepthConsistency      = true
G0_5_determinism                = true
G0_6_depthTraceConsistency      = true
G0_7_replayValidity             = true
G0_8_identityAvailability       = true
```

Existing engine regression:

```text
node test/search.test.js
-> Bao search tests passed
```

Therefore:

```text
G0_9_existingSearchBehaviorProtection = PASS
```

Diagnostic unit test:

```text
node test/position-complexity-search-diagnostic.test.js
-> Position-complexity search diagnostic tests passed
```

Smoke runner:

```text
node tools/experiments/run-position-complexity-stage0-smoke.js
-> PASS
```

## 6. Fixed technical fixtures

The smoke audit used only fixed technical states:

```text
1. initial Bao state, depths 1..3
2. synthetic Mtaji true single-variant root, depths 1..3
3. synthetic Mtaji forced-win state, depths 1..4
```

These are measurement-validation fixtures only and are permanently ineligible as Stage 1 discovery or Stage 2 confirmation evidence.

## 7. Initial failed run and correction

The first Stage 0 CI run did not pass:

```text
workflow run = 31589183147
job = 94089938197
failure step = Position-complexity diagnostic unit tests
```

Failure:

```text
AssertionError: fixture is a single-choice root
actual moveVariants = 2
expected = 1
```

Cause:

The borrowed historical test state had one `E.legalMoves()` move but two `E.moveVariants()` entries because the research structural `legalMoveCount` uses move variants, including distinct legal move choices exposed to the AI.

Correction:

- the scientific/measurement definition was **not** changed;
- the fixture was replaced with a synthetic Mtaji state having exactly one `E.moveVariants()` root choice;
- CI was rerun on the corrected branch head and passed.

This correction preserves the Stage 0 definition rather than fitting the definition to the test.

## 8. Measurement consequence

After validation, the following quantities are technically computable for Stage 1:

### Structural

```text
legalMoveCount
captureMoveCount
forcedCapture
existing position-typology raw structural features
```

### Search workload

```text
existing AI nodes / quiescenceNodes / cutoffs / evaluations
plus exact-diagnostic candidate-local counters
```

### Decision ambiguity

```text
exact tied-best TopSet
best-vs-second score gap
full root candidate ranking/score table
```

### Prediction instability

```text
D1->D2 / D2->D3 / other frozen adjacent-depth TopSet transitions
tie-aware TopSet disjointness
canonical-best change
score sign / magnitude changes
```

PV instability remains optional and is not required for the primary Study 1 design.

## 9. Stage 0 decision

```text
read-only measurement audit = PASS
required diagnostic implementation = PASS
technical validation gates G0-1..G0-9 = PASS
Stage 0 = COMPLETE
```

This is not a scientific positive result. It authorizes only the next stage:

> freeze and execute a fresh **Stage 1 exploratory metric/design corpus**.

Stage 2 formal corpus generation remains unauthorized until Stage 1 is consumed and a fresh formal preregistration is frozen.
