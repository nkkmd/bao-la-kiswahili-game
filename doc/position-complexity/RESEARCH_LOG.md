# Position Complexity / Difficulty Study — Research Log

Status: **append-only research chronology**

Do not rewrite prior entries to make later outcomes appear more expected. Corrections should be appended with explicit reference to the corrected entry.

---

## 2026-08-12 — Study initiation and canonical-state recovery

### Repository baseline

Current GitHub `main` was checked before study initiation.

```text
main HEAD = d681b4593242973fcb33805edca12eb3e8633653
expected prior closure HEAD = d681b4593242973fcb33805edca12eb3e8633653
match = true
```

No newer commit required a delta audit.

New branch created:

```text
research/position-complexity-difficulty
```

### Closed studies restored from GitHub

Read and treated as immutable historical records:

- phase-transition Study 1;
- position-typology / playing-style Study 1;
- Namua→Mtaji Strategic Temporal Transition Study 1.

Important inherited outcomes retained unchanged:

```text
phase-transition:
  E-010 not-confirmed
  E-011 inconclusive
  E-017 not-confirmed
  E-018/H16 confirmed only fixed D2 phase2 > legacy
  E-019/H17 global not-confirmed
  E-020/H18 confirmed only fixed D3 legacy > phase2

position typology:
  MTAJI-M1/M2 bounded confirmed morphology
  no discrete Namua type
  N-ACT/N-CON exploratory only
  no discrete style typology
  STYLE-C1..C4 exact geometry formal not-confirmed

Namua->Mtaji:
  formal decision NOT-CONFIRMED
  first Mtaji clock deterministic at ply 44 in the frozen engine
```

No rescue interpretation was adopted.

### Documentation anomaly

The requested:

```text
doc/phase-transition/REPRODUCIBILITY_INDEX.md
```

was not present on `main`.

The audit used the existing phase-transition Final Report, Current Status and `FORMAL_EXPORT_INDEX.md` instead. No replacement document was inferred to exist.

### Read-only technical audit

Inspected current engine/search/feature tooling.

Main findings:

1. Structural state variables are already broadly available through the position-typology feature extractor.
2. Search workload counters already include nodes, quiescence nodes, cutoffs, evaluations, cache statistics, completed depth and root score.
3. Current iterative deepening exposes only aggregate root-best-change counts, not the full depth-by-depth sequence.
4. Alpha-beta search does not expose an exhaustive exact root candidate score table, so searched best-second gap and related ambiguity metrics are not yet valid.
5. Generic PV instability is not currently instrumented; joseki-specific line reconstruction is not adopted as a general metric.
6. `public/ai-config.js::complexityScore()` is an adaptive budget heuristic, not a validated scientific complexity score, and creates circularity if adaptive search is used in this study.
7. Wall-clock time is hardware-dependent; deterministic search counters are preferred for initial inference.

### Initial design direction

Study 1 will separate:

```text
structural complexity
search workload
decision ambiguity
prediction instability
```

No global composite difficulty score is authorized.

Primary candidate relation:

```text
legalMoveCount
  -> tie-aware D2-to-D3 root-optimum instability
```

Key secondary candidate:

```text
exact D2 best-vs-second searched score gap
  as incremental ambiguity information beyond structural branching
```

These are not yet Stage 2 frozen metrics.

### Stage state

```text
Stage 0 read-only audit = complete
Stage 0 instrumentation implementation = pending
Stage 1 exploratory corpus = not generated
Stage 2 formal preregistration = not created
Stage 2 formal corpus = not authorized / not generated
```

Next authorized work is Stage 0 diagnostic instrumentation and technical-only validation.

---

## 2026-08-12 — Stage 0 exact-root instrumentation implemented

Research-specific diagnostic added:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
```

The implementation is separate from normal `public/ai.js` move selection.

Frozen semantic identifier:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

The diagnostic returns exhaustive legal root move values, exact tied-best TopSet, deterministic canonical-best key, best-second gap, score-domain classification and D1..Dn depth traces.

Unit and smoke tooling added:

```text
test/position-complexity-search-diagnostic.test.js
tools/experiments/run-position-complexity-stage0-smoke.js
```

A draft PR was opened to provide a stable review/CI surface:

```text
PR #29
research/position-complexity-difficulty -> main
state = open / draft
```

No merge was performed.

### Initial Stage 0 CI failure

First dedicated CI run:

```text
run = 31589183147
result = failure
```

Existing `test/search.test.js` passed. The new unit test failed on a fixture assertion:

```text
expected moveVariants = 1
actual moveVariants = 2
```

Cause:

The borrowed historical test position had one `E.legalMoves()` move but two `E.moveVariants()` choices. This study's structural `legalMoveCount` uses `moveVariants()`.

Correction:

- did not change the measurement definition;
- replaced the fixture with a true one-variant synthetic Mtaji position;
- reran validation.

This was a test-fixture correction, not outcome-dependent metric redefinition.

---

## 2026-08-12 — Stage 0 technical validation PASS

Successful dedicated CI:

```text
validated branch head = 7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
workflow run = 31589325398
job = 94090388506
Node = v24.18.0
result = success
```

Passed gates:

```text
G0-1 state immutability
G0-2 legal root exhaustiveness
G0-3 common root-player score perspective
G0-4 fixed-depth consistency
G0-5 determinism
G0-6 depth-trace consistency
G0-7 replay validity
G0-8 identity availability
G0-9 existing search behavior protection
```

Existing search regression also passed:

```text
Bao search tests passed
```

Stage 0 record created:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
```

Decision:

```text
Stage 0 = COMPLETE / TECHNICAL PASS
scientific inference = none
```

Decision ambiguity and exact adjacent-depth instability are now technically measurable.

---

## 2026-08-12 — Stage 1 exploratory protocol frozen before generation

Fresh exploratory Stage 1 v1 defined:

```text
Stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
games = 768
seeds = 20400001..20400768
opening = seeded-uniform E.moveVariants, 8 plies
trajectory generator = hard / bao / phase2 / depth2
max ply = 100
```

Seed `20400001` had no existing repository match when checked before freeze.

Protocol/spec:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
```

Stage 1 is explicitly exploratory and permanently consumed after inspection.

No:

- early stopping;
- favorable reseeding;
- within-v1 seed extension;
- automatic replacement of unavailable assigned-phase trajectories;
- Stage 1 reuse as Stage 2 confirmation.

### Frozen unit-selection scheme

```text
raw games
-> collapse duplicate historicalTrajectoryHash
-> hash-parity phase assignment per unique trajectory
-> one eligible state selected by frozen SHA-256 rank
-> legalMoveCount >= 2 using E.moveVariants
-> no replacement if assigned phase unavailable
-> collapse exact duplicate selected ruleStateKey
```

Phase salt:

```text
PCX-S1-PHASE-v1
```

State-selection salt:

```text
PCX-S1-STATE-v1
```

This design does not use search-instability, ambiguity, CBE, morphology or winner outcomes to select states.

### Stage 1 readiness gates frozen

```text
selected unique rule states >= 300
Namua selected states >= 120
Mtaji selected states >= 120
D2->D3 instability events >= 30
D2->D3 stable events >= 30
ordinary-domain D2 margins >= 200
```

These are estimability gates only.

---

## 2026-08-12 — Stage 1 runner/verifier/analyzer prepared

Local-only runner:

```text
tools/experiments/run-position-complexity-stage1-exploratory.js
```

Phases:

```text
generate
select
measure
status
all
```

Independent verifier:

```text
tools/experiments/verify-position-complexity-stage1-exploratory.js
```

Default scientific verification recomputes every post-opening depth-2 AI search in addition to replay/state/hash checks.

Exploratory analyzer:

```text
tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

The analyzer reports readiness gates, tie/mate-domain prevalence, adjacent-depth instability prevalence, structural/workload distributions and descriptive correlations without confirmatory p-values.

Runbook:

```text
doc/position-complexity/STAGE_1_RUNBOOK.md
```

Experiment index created:

```text
doc/position-complexity/EXPERIMENT_INDEX.md
```

Technical runner/verifier unit test:

```text
test/position-complexity-stage1-runner.test.js
```

`Position Complexity Research CI` run `31589875147` passed the runner/verifier technical test together with all existing Stage 0/search regression checks.

### Current stopping point

```text
Stage 0 = COMPLETE / PASS
Stage 1 protocol = FROZEN
Stage 1 tooling = READY
Stage 1 768-game corpus = NOT GENERATED
Stage 2 formal preregistration = NOT CREATED
Stage 2 formal corpus = NOT AUTHORIZED / NOT GENERATED
```

Next authorized action is local Stage 1 generation and full verification according to `STAGE_1_RUNBOOK.md`.
