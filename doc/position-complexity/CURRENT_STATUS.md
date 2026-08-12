# Position Complexity / Difficulty Study — Current Status

更新日: 2026-08-12  
Status: **ACTIVE / STAGE 0 COMPLETE / STAGE 1 GENERATION VERIFIED AND CONSUMED / SELECT+MEASURE NEXT / STAGE 2 LOCKED**

## Research identity

```text
research title = Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離
branch = research/position-complexity-difficulty
base main head = d681b4593242973fcb33805edca12eb3e8633653
draft PR = #29
Stage 1 ID = PCX-S1-EXPLORATORY-2026-08-12-v1
current phase = Stage 1 exploratory state selection / measurement
Stage 1 generated corpus = COMPLETE / VERIFIED / EXPLORATORY-CONSUMED
Stage 2 formal corpus = NOT GENERATED / NOT AUTHORIZED
```

The study remains prospective and independent. Closed Study formal decisions are immutable and are not rescued or reinterpreted here.

## Immutable inherited boundaries

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

`capture-branch-expansion` remains a bounded historical phenotype. Its classifier/thresholds are not refit.

### Position-typology / playing-style Study 1

```text
MTAJI-M1 / MTAJI-M2 = bounded formally confirmed Mtaji morphology
Namua discrete type = not promoted
N-ACT / N-CON = exploratory only
discrete playing-style clusters = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

### Namua→Mtaji Study 1

```text
FORMAL DECISION = NOT-CONFIRMED
initial reserve total = 44
Namua reserve total at ply t = 44 - t
first Mtaji observation = ply 44
```

No first-Mtaji timing/survival/hazard/acceleration/delay endpoint is authorized.

## Stage 0 — COMPLETE / TECHNICAL PASS

Canonical records:

```text
doc/position-complexity/STAGE_0_TECHNICAL_AUDIT.md
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
```

Validated diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

It provides exhaustive exact root-candidate scores, exact tied-best `TopSet`, best-second gap, mate-domain classification and D1-D4 depth traces while remaining separate from normal `public/ai.js` move selection.

Successful Stage 0 CI:

```text
workflow run = 31589325398
validated branch head = 7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
G0-1..G0-9 = PASS
```

## Frozen measurement boundaries

### Structural primary candidate

```text
legalMoveCount = E.moveVariants(state).length
```

The primary decision-instability population requires:

```text
legalMoveCount >= 2
```

True single-choice roots remain descriptive only for decision-instability purposes.

### Search workload

Prefer deterministic fixed-search counters:

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

Technically measurable from exact root values:

```text
bestSecondGap
TopSet size / exact tie
full root-score dispersion
```

### Prediction instability

Technically measurable:

```text
D1->D2 TopSet disjointness
D2->D3 TopSet disjointness
D3->D4 TopSet disjointness
canonical-best change
best-score sign / magnitude change
```

PV instability is not required for Study 1 primary inference.

## Stage 1 v1 — FROZEN EXPLORATORY CORPUS

Frozen specification:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
```

Protocol/runbook:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-complexity/STAGE_1_RUNBOOK.md
```

Frozen corpus definition:

```text
games = 768
seeds = 20400001..20400768
opening = seeded-uniform E.moveVariants, 8 plies
trajectory generator = hard / bao / phase2 / depth2
quiescenceDepth = 1
timeLimitMs = Infinity
adaptive = false
max ply = 100
```

No early stopping, favorable reseeding, within-v1 seed extension, duplicate replacement or outcome-dependent replacement is permitted.

## Stage 1 generation and full verification — PASS

Canonical record:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
```

Verification output:

```text
passed = true
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
gamesVerified = 768
observationsVerified = 43110
movesVerified = 42342
searchMovesRecomputed = 36211
fullSearchRecomputation = true
uniqueHistoricalTrajectories = 685
duplicateHistoricalTrajectoryGroups = 61
largestHistoricalTrajectoryGroup = 6
reachedMtajiGames = 732
verifiedIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
```

Interpretation:

- all 768 frozen games were verified;
- every post-opening depth-2 search covered by the verifier was recomputed;
- the fixed Stage 1 corpus is now permanently exploratory-consumed;
- duplicate trajectories are handled by the already frozen collapse rule rather than replacement;
- `reachedMtajiGames = 732` is an availability description only and is not yet a readiness-gate result.

The generation phase must not be selectively rerun to obtain a more favorable corpus.

## Frozen Stage 1 state-selection scheme

```text
768 generated games
-> collapse duplicate historicalTrajectoryHash
-> representative = minimum seed then gameId
-> phase assignment by frozen SHA-256 parity
-> one eligible state by frozen SHA-256 state rank
-> require legalMoveCount >= 2
-> no replacement if assigned phase unavailable
-> collapse duplicate selected ruleStateKey
```

Phase assignment:

```text
sha256("PCX-S1-PHASE-v1|" + historicalTrajectoryHash)
even -> Namua
odd  -> Mtaji
```

Within assigned phase:

```text
minimum SHA-256 rank using salt PCX-S1-STATE-v1
fields = historicalTrajectoryHash, ruleStateKey, ply
```

Search outcome, ambiguity, instability, CBE, morphology and game winner are not used for state selection.

## Stage 1 measurement

Each selected state is measured at:

```text
D1 / D2 / D3 / D4
phase2 / bao
quiescenceDepth = 1
timeLimitMs = Infinity
adaptive = false
```

Exact diagnostic and normal fixed-depth engine search are cross-checked by the runner.

Tooling:

```text
tools/experiments/run-position-complexity-stage1-exploratory.js
tools/experiments/verify-position-complexity-stage1-exploratory.js
tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

## Stage 1 readiness gates — NOT YET EVALUATED

A Stage 2 design may proceed only if the completed Stage 1 measurement satisfies all frozen design-estimability gates:

```text
selected unique rule states >= 300
Namua selected states >= 120
Mtaji selected states >= 120
D2->D3 instability events >= 30
D2->D3 stable events >= 30
ordinary-domain D2 margins >= 200
```

These are not scientific confirmation criteria.

If a gate fails, do not append seeds or relax a threshold inside Stage 1 v1. The result must be recorded as insufficient for the current Stage 2 design and a new prospective design considered separately.

## Current hypothesis state

Still provisional for future Stage 2:

```text
H1 candidate:
  legalMoveCount is associated with tie-aware D2->D3 root-optimum instability

H2 candidate:
  exact D2 decision ambiguity adds information beyond structural branching
```

Stage 1 is allowed to assess whether these metrics are estimable and scientifically usable. It is not confirmation, and smallest exploratory p-value selection is prohibited.

## Next authorized work

Generation and full verification are complete. Continue on the same local artifact root without regenerating the 768 games:

```bash
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase select
node tools/experiments/run-position-complexity-stage1-exploratory.js --phase measure
python3 tools/experiments/analyze-position-complexity-stage1-exploratory.py
```

After `analyze`, preserve the complete analyzer output and record all readiness gates before designing Stage 2.

## Stage 2 remains locked

Not authorized:

- Stage 2 formal corpus generation;
- formal hypothesis testing;
- Stage 1 observation reuse as confirmation;
- prior formal archive reuse as present confirmation;
- result-dependent metric/depth/population rescue;
- favorable reseeding or extension of Stage 1 v1.

A separate frozen Stage 2 preregistration and fresh seed block are mandatory after Stage 1 is completed and consumed.
