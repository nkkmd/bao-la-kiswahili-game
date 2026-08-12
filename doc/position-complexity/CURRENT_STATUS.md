# Position Complexity / Difficulty Study — Current Status

更新日: 2026-08-12  
Status: **ACTIVE / STUDY 1 DESIGN / STAGE 0 READ-ONLY AUDIT COMPLETE / FORMAL CORPUS NOT AUTHORIZED**

## Research identity

```text
research title = Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離
branch = research/position-complexity-difficulty
base main head = d681b4593242973fcb33805edca12eb3e8633653
current phase = Stage 0 technical / measurement audit
formal corpus = NOT GENERATED / NOT AUTHORIZED
```

Current `main` was checked at study initiation and exactly matched the expected closure head `d681b4593242973fcb33805edca12eb3e8633653`.

## Canonical scientific state inherited from closed studies

### Phase-transition Study 1

Immutable formal decisions:

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

`capture-branch-expansion` remains a bounded strategic-transition phenotype. Its existing thresholds/classifier are not refit for this study. Prior D2/D3 search-profile findings may motivate instrumentation but are not formal evidence for the present study.

The requested path `doc/phase-transition/REPRODUCIBILITY_INDEX.md` does not exist on the base `main`; use the existing Final Report, Current Status and `FORMAL_EXPORT_INDEX.md` rather than inventing a replacement.

### Position-typology / playing-style Study 1

Immutable boundaries:

```text
MTAJI-M1 / MTAJI-M2 = formally confirmed only within frozen bounded scope
Namua discrete position type = not promoted
N-ACT / N-CON = exploratory continuous coordinates only
discrete playing-style clustering = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

No relabeling, restandardization, reclustering, alternative-k rescue or reuse of the Stage 5 held-out corpus as confirmation is permitted.

### Namua→Mtaji Strategic Temporal Transition Study 1

Immutable formal decision:

```text
NOT-CONFIRMED
```

Permanent deterministic-clock boundary:

```text
initial total reserve = 44
Namua total reserve at ply t = 44 - t
first Mtaji observation = ply 44
```

Do not use as strategic endpoints:

```text
time-to-first-Mtaji
first-Mtaji survival
first-Mtaji hazard
CBE-driven Mtaji acceleration / delay
```

The small positive descriptive Stage 2 risk difference is not a trend to be rescued.

## Current Stage 0 technical findings

### Structural layer — largely measurable now

Existing `tools/experiments/lib/position-typology-features.js` already exposes, among others:

- `legalMoveCount`
- `captureMoveCount`
- `forcedCapture`
- reserve / house ownership / nyumba seeds
- front/back seed and occupancy structure
- reusable pits / front connections
- max/mean capturable seeds
- max/mean capture events
- max/mean relay events
- max/mean chain events
- pit variance / seed concentration
- `historicalStateHash`, `ruleStateKey`, `seatCanonicalKey`

These are candidate raw structural variables, not a pre-existing scientific difficulty score.

### Search workload layer — partially measurable now

`public/ai.js` already records:

```text
nodes
quiescenceNodes
cutoffs
cacheHits / cacheStores
evaluationRequests / evaluations
completedDepth
rootScore
elapsedMs
timedOut
rootBestChanges
stableIterations
```

For fixed-depth research, `nodes` and related deterministic counters are preferable to wall-clock time as inferential quantities. `elapsedMs` is hardware/runtime dependent and is currently designated descriptive/QA only.

### Decision ambiguity — insufficient instrumentation

The current alpha-beta interface returns only the selected root move and final `rootScore`. It does not expose an exact exhaustive root candidate score table. Therefore the following cannot yet be validly frozen as formal measures:

- best-vs-second-best searched score gap
- top-k searched score dispersion
- exact tied-best set
- near-equivalent move count
- rank entropy based on searched root values

A research diagnostic must compute exact per-root-candidate values under one frozen evaluator/search configuration before these metrics are used.

### Prediction instability — partially measurable but insufficient

Current iterative deepening records aggregate `rootBestChanges` and `stableIterations`, but does not return the per-depth best-move sequence or candidate rankings. A generic joseki-specific PV reconstruction exists elsewhere in the repository, but it is not a general native PV trace and is not adopted as the present formal definition.

Needed:

- per-depth root best move / tied-best set
- per-depth root score
- per-depth node/cutoff/evaluation deltas
- exact root candidate ranking per selected depths
- optional validated PV trace if feasible

## Key design state

Current recommendation, not yet Stage 2 preregistration:

```text
primary scientific relation:
  structural branching -> D2-to-D3 prediction instability

primary structural variable candidate:
  legalMoveCount (raw state-level branching; no composite score)

primary prediction-instability candidate:
  tie-aware D2-to-D3 root-optimum instability

key secondary layer:
  decision ambiguity from exact root candidate score gap
```

The exact formal metric, population, model, availability gates, sample size and seed block are deliberately not frozen until Stage 0 instrumentation validation and Stage 1 exploratory metric audit are complete.

## Stage separation

```text
Stage 0 = technical / measurement feasibility only
Stage 1 = exploratory metric and design development; permanently consumed
Stage 2 = fresh held-out formal confirmation; not yet authorized
```

No Stage 0 or Stage 1 position may later serve as an independent Stage 2 confirmation unit.

## Pseudo-replication policy under development

The formal design will not treat all plies as independent samples.

Preferred direction:

1. preserve `historicalTrajectoryHash` and `ruleStateKey` for every candidate state;
2. collapse duplicate historical trajectories before formal sampling/inference;
3. avoid repeated-ply inflation by selecting a deterministic bounded number of states per trajectory, preferably one formal state per unique trajectory if coverage is adequate;
4. prevent exact duplicate `ruleStateKey` states from being counted as independent computational outcomes;
5. freeze the final sampling/deduplication rule before Stage 2 generation.

Stage 1 may be used to determine whether the one-state-per-trajectory design provides adequate Namua/Mtaji and instability-event coverage. It may not be used to choose favorable formal outcomes.

## Next authorized work

Stage 0 only:

1. implement research-specific exact root-candidate diagnostic instrumentation;
2. implement per-depth trace / counter deltas;
3. validate state non-mutation, determinism, score perspective, legal-move exhaustiveness and equivalence with existing root choice;
4. audit structural feature definitions, especially relay-related quantities;
5. run only tiny technical/smoke states sufficient for instrumentation validation;
6. freeze a Stage 1 exploratory protocol and non-overlapping seed block.

Not authorized yet:

- Stage 2 formal corpus generation;
- formal hypothesis testing;
- result-dependent metric selection from a held-out corpus;
- use of prior formal archives as present-study confirmation evidence.