# Position Complexity / Difficulty Study — Current Status

更新日: 2026-08-12  
Status: **ACTIVE / STAGE 0 COMPLETE / STAGE 1 FROZEN AND READY FOR LOCAL EXECUTION / STAGE 2 LOCKED**

## Research identity

```text
research title = Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離
branch = research/position-complexity-difficulty
base main head = d681b4593242973fcb33805edca12eb3e8633653
draft PR = #29
current phase = Stage 1 exploratory execution readiness
Stage 1 corpus = NOT GENERATED YET
Stage 2 formal corpus = NOT GENERATED / NOT AUTHORIZED
```

Current `main` was checked at study initiation and exactly matched the expected closure head `d681b4593242973fcb33805edca12eb3e8633653`.

## Canonical inherited boundaries

### Phase-transition Study 1

Immutable:

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

`capture-branch-expansion` remains a bounded historical phenotype. No threshold/classifier rescue is permitted.

### Position-typology / playing-style Study 1

Immutable:

```text
MTAJI-M1 / MTAJI-M2 = bounded formally confirmed Mtaji morphology
Namua discrete type = not promoted
N-ACT / N-CON = exploratory only
discrete playing-style clusters = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

### Namua→Mtaji Study 1

Immutable:

```text
FORMAL DECISION = NOT-CONFIRMED
initial reserve total = 44
Namua reserve total at ply t = 44 - t
first Mtaji observation = ply 44
```

No first-Mtaji timing/survival/hazard/acceleration/delay endpoint is authorized.

## Stage 0 — COMPLETE

Read-only audit:

```text
doc/position-complexity/STAGE_0_TECHNICAL_AUDIT.md
```

Technical validation result:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
Status = PASS / technical only
```

Validated diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

It provides:

- exhaustive exact root-candidate values;
- root-player score perspective;
- exact tied-best `TopSet`;
- best/second-best gap;
- explicit mate-domain classification;
- D1/D2/D3/D4 compatible depth trace;
- adjacent-depth TopSet disjointness and score changes.

The research diagnostic is separate from normal `public/ai.js` move selection.

### Stage 0 validation gates

Successful CI run:

```text
workflow = Position Complexity Stage 0 CI
run id = 31589325398
validated branch head = 7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
Node = v24.18.0
```

Passed:

```text
G0-1 state immutability
G0-2 legal-root exhaustiveness
G0-3 common root-player score perspective
G0-4 fixed-depth consistency with existing phase2 search
G0-5 determinism
G0-6 depth-trace consistency
G0-7 replay validity
G0-8 identity availability
G0-9 existing search behavior protection
```

The first CI attempt failed only because a borrowed fixture had `legalMoves=1` but `moveVariants=2`. The measurement definition was not changed; the fixture was replaced with a true one-variant state, after which validation passed.

## Study 1 measurement layers now available

### Structural

Existing position-typology primitives remain reusable:

```text
legalMoveCount
captureMoveCount
forcedCapture
reserve / house / nyumba
front occupancy / connections
reusable pits
capturable seeds
capture / relay / chain event summaries
pit variance / seed concentration
historicalStateHash / ruleStateKey / seatCanonicalKey
```

`legalMoveCount` means `E.moveVariants(state).length` in this study.

### Search workload

Existing engine counters:

```text
nodes
quiescenceNodes
cutoffs
evaluationRequests
evaluations
completedDepth
```

`elapsedMs` remains QA/descriptive only.

### Decision ambiguity

Now technically measurable:

```text
exact best-second gap
exact TopSet size / tie status
full root score table / score dispersion
```

### Prediction instability

Now technically measurable:

```text
D1->D2 TopSet disjointness
D2->D3 TopSet disjointness
D3->D4 TopSet disjointness
canonical-best change
best-score sign / magnitude change
```

PV instability remains optional and is not required for the primary Study 1 design.

## Frozen primary-population boundary

For primary decision-instability analyses:

```text
legalMoveCount >= 2
```

True single-choice roots are excluded because their stability is mechanically guaranteed by the absence of alternatives.

## Stage 1 — FROZEN / NOT YET GENERATED

Protocol:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
```

Machine spec:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
Stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
```

Runbook:

```text
doc/position-complexity/STAGE_1_RUNBOOK.md
```

Frozen Stage 1 corpus:

```text
768 games
seeds 20400001..20400768
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / depth2
max ply = 100
timeLimitMs = Infinity
```

No early stopping, favorable reseeding, automatic replacement or outcome-dependent extension is authorized in Stage 1 v1.

### Stage 1 unit structure

```text
generated games
-> collapse duplicate historicalTrajectoryHash
-> hash-parity assign one phase per unique trajectory
-> choose one eligible state by frozen SHA-256 rank
-> require moveVariants legalMoveCount >= 2
-> no replacement if assigned phase unavailable
-> collapse exact duplicate selected ruleStateKey
```

This keeps at most one selected state per unique historical trajectory before exact-state collapse.

### Frozen phase assignment

```text
sha256("PCX-S1-PHASE-v1|" + historicalTrajectoryHash)
even -> Namua
odd  -> Mtaji
```

### Fixed measurement

On each selected state:

```text
D1 / D2 / D3 / D4
phase2 / bao
quiescenceDepth = 1
timeLimitMs = Infinity
adaptive = false
```

Exact diagnostic and normal engine search are cross-checked at every depth.

## Stage 1 tooling — TECHNICALLY VALIDATED

Runner:

```text
tools/experiments/run-position-complexity-stage1-exploratory.js
```

Verifier:

```text
tools/experiments/verify-position-complexity-stage1-exploratory.js
```

Exploratory analyzer:

```text
tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

Technical test:

```text
test/position-complexity-stage1-runner.test.js
```

`Position Complexity Research CI` run `31589875147` passed the Stage 1 runner/verifier technical unit test in addition to all Stage 0 regression checks. The analyzer is included in CI syntax validation.

## Stage 1 readiness gates

A later Stage 2 design may be frozen only if Stage 1 v1 provides:

```text
selected unique rule states >= 300
Namua selected states >= 120
Mtaji selected states >= 120
D2->D3 instability events >= 30
D2->D3 stable events >= 30
ordinary-domain D2 margins >= 200
```

These are design-estimability gates, not scientific confirmation criteria.

If any gate fails, Stage 1 v1 closes as insufficient for the current Stage 2 design. Do not append seeds or relax thresholds inside v1.

## Current hypothesis state

Still provisional for Stage 2:

```text
H1 candidate:
  structural branching (legalMoveCount)
  is associated with tie-aware D2->D3 root-optimum instability

H2 candidate:
  exact D2 decision ambiguity adds information beyond structural branching
```

Stage 1 may reject or refine these candidates only within the predeclared metric families and before any Stage 2 corpus exists. The smallest exploratory p-value is not a metric-selection rule.

## Next authorized work

The next scientific action is **local Stage 1 exploratory execution**, in this exact order:

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase generate
node tools/experiments/verify-position-complexity-stage1-exploratory.js
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase select
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase measure
python3 tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

Large Stage 1 corpus generation must be local. The GitHub Actions workflow is technical validation only.

## Stage 2 remains locked

Not authorized:

- Stage 2 formal corpus generation;
- formal hypothesis testing;
- use of Stage 1 observations as confirmation;
- prior formal archive reuse as current formal evidence;
- result-dependent metric/threshold/depth/population rescue.

A separate frozen Stage 2 preregistration with fresh seeds is mandatory after Stage 1 is complete and consumed.
