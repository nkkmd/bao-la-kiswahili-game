# Position Complexity Study 1 — Stage 0 Technical / Measurement Audit

更新日: 2026-08-12  
Status: **READ-ONLY AUDIT COMPLETE / INSTRUMENTATION IMPLEMENTATION PENDING**

## 1. Audit scope

This audit inspected the current `main` source at:

```text
d681b4593242973fcb33805edca12eb3e8633653
```

No formal corpus was generated. No prior closed-study formal artifact was reanalyzed for present-study inference.

Primary source files inspected:

```text
public/ai.js
public/ai-config.js
tools/experiments/lib/phase-transition-features.js
tools/experiments/lib/position-typology-features.js
tools/experiments/run-position-typology-stage1-pilot.js
test/search.test.js
tools/experiments/verify-joseki-p002-depth8-win.js
```

Closed-study scientific documents were read first to preserve historical boundaries.

## 2. Repository/document anomaly found

The requested path:

```text
doc/phase-transition/REPRODUCIBILITY_INDEX.md
```

does not exist on current `main`.

The phase-transition directory contains, among others:

```text
CURRENT_STATUS.md
STUDY_1_FINAL_REPORT.md
FORMAL_EXPORT_INDEX.md
FORMAL_EXPORT_STORAGE.md
EXPERIMENT_INDEX.md
DECISION_REGISTER.md
HYPOTHESES.md
```

For this audit, no missing document was synthesized. Reproducibility/archive facts were recovered from the existing Final Report, Current Status and Formal Export Index.

## 3. Structural complexity measurement audit

### Already available

`position-typology-features.js` provides reusable state identity and raw structural measurements.

Identity:

```text
historicalStateHash
ruleStateKey
seatCanonicalKey
```

Actor/opponent structural fields include:

```text
reserve
houseOwned
nyumbaSeeds
boardSeeds
frontSeeds
backSeeds
occupiedPits
frontOccupied
backOccupied
reusablePits
frontConnections
legalMoveCount
captureMoveCount
forcedCapture
maxPitSeeds
pitSeedVariance
seedConcentration
maxCapturableSeeds
meanCapturableSeeds
maxCaptureEvents
meanCaptureEvents
maxRelayEvents
meanRelayEvents
maxChainEvents
meanChainEvents
```

Assessment:

```text
structural layer measurability = HIGH
```

### Important interpretation boundary

`captureMoveCount` is a legal capture-option count / branching proxy. It is not the number of search-tree nodes or complete search-tree branching.

`maxRelayEvents` / `meanRelayEvents` count relay events in the result of legal root move application. They are not currently a distinct measure of recursive search-tree relay branching.

Therefore a new field called `relayBranching` must not be introduced without an explicit engine-level definition.

## 4. Search workload measurement audit

`public/ai.js::emptyStats()` already records:

```text
elapsedMs
nodes
quiescenceNodes
cutoffs
cacheHits
cacheStores
historyUpdates
aspirationResearches
evaluationRequests
evaluations
evaluationCacheHits
evaluationCacheStores
evaluationCachePeak
evaluationCacheEvictions
completedDepth
rootScore
timedOut
earlyStopped
stableIterations
rootBestChanges
allocatedTimeMs
baseTimeLimitMs
adaptiveComplexity
```

Assessment:

```text
aggregate fixed-search workload measurability = HIGH
per-depth workload measurability = PARTIAL
```

Current gap:

The stats object does not retain a per-iteration trace such as:

```text
depth
best move
root score
delta nodes
delta quiescence nodes
delta cutoffs
delta evaluations
```

Without that trace, `rootBestChanges` says how many changes occurred during iterative deepening, but not at which depth or between which moves.

### Wall-clock boundary

`elapsedMs` changes with hardware/runtime conditions. It should not initially control a formal success decision. Deterministic counters under fixed source and search options are more reproducible.

## 5. Existing adaptive complexity heuristic

`public/ai-config.js` currently implements:

```text
positionMetrics(state)
complexityScore(metrics)
adaptiveSearchOptions(...)
```

The heuristic combines legal moves, capture moves, max capture, front occupancy, phase, board seeds and reserve to adjust search time/depth.

Assessment:

```text
valid implementation heuristic = yes
validated scientific complexity metric = no
```

Critical circularity risk:

If adaptive search is enabled while studying whether structural features predict search workload, those same structural features directly change the search budget. Therefore adaptive search must be disabled in the primary measurement protocol.

## 6. Decision ambiguity audit

Current alpha-beta `AI.analyzeMove()` returns:

```text
selected move
final rootScore
aggregate stats
```

It does **not** return exhaustive searched values for every legal root candidate.

Consequences:

The following are not yet measurement-valid:

```text
best-second searched gap
tied best set
top-k searched dispersion
near-equivalent searched move count
searched candidate entropy
full root ranking
```

Assessment:

```text
decision ambiguity measurability = INSUFFICIENT WITHOUT NEW INSTRUMENTATION
```

## 7. Prediction instability audit

### Already available

Iterative deepening internally compares each completed depth's best move and records:

```text
rootBestChanges
stableIterations
completedDepth
```

### Missing

No generic public trace currently records:

```text
bestMove_D1
bestMove_D2
bestMove_D3
...
TopSet_Dd
candidateRanks_Dd
rootScore_Dd
```

Therefore exact D1→D2 / D2→D3 / rank-reversal measures require new diagnostic instrumentation.

Assessment:

```text
aggregate instability signal = AVAILABLE
formal depth-to-depth instability = INSUFFICIENT WITHOUT TRACE
```

## 8. Principal variation audit

A joseki-specific verifier reconstructs a line by repeatedly calling `AI.analyzeMove()` at decreasing depths and reapplying the selected move. This is useful technical precedent for replaying a search line.

However:

- it is tied to a specific joseki verification use case;
- it is not a generic native PV trace exposed by the search engine;
- repeated fresh searches are not automatically identical to one internally retained PV;
- quiescence continuation requires separate semantics.

Decision:

```text
PV instability = optional secondary candidate only after new validation
not required for primary Study 1
```

## 9. Existing experiment infrastructure that can be reused

`run-position-typology-stage1-pilot.js` already demonstrates useful patterns:

- clean-source provenance;
- source-file SHA-256 recording;
- fixed conditions;
- local artifact output;
- per-game JSON;
- state/trajectory identity;
- `historicalTrajectoryHash` / `ruleTrajectoryHash` / `seatCanonicalTrajectoryHash`;
- duplicate trajectory summaries;
- search metadata kept separate from structural feature vectors;
- `timeLimitMs: Infinity` for fixed-depth exploratory runs.

These engineering patterns may be reused. Its old exploratory corpus is not present-study confirmation evidence.

## 10. Required new Stage 0 instrumentation

### A. Exact root-candidate analyzer

Implement a generic research diagnostic that, for one state and one fixed search configuration, returns for **every legal root move**:

```text
moveKey
searched score
search depth
terminal/mate flag or score-class information
nodes / quiescence nodes / cutoffs / evaluations used by the candidate evaluation
```

Candidate values must be calculated with a documented exact/full-window semantics from the root player's perspective.

Do not derive ambiguity from alpha-beta lower/upper bounds accidentally captured during ordinary PVS traversal.

### B. Per-depth trace

Return a deterministic trace for selected depths, minimally:

```text
depth
root top set
canonical best move
root score
aggregate/delta search counters
```

### C. Tie policy

Define:

- exact score equality semantics;
- deterministic canonical move ordering for display/replay;
- top-set representation independent of arbitrary ordering.

### D. Mate / terminal score policy

Because engine terminal scores use the `WIN = 1,000,000` scale and ply adjustment, Stage 0 must mark terminal/mate-domain scores explicitly. Raw best-second gaps must not mix ordinary evaluator margins with mate-distance semantics without a frozen rule.

### E. Structural feature wrapper

Reuse existing primitives where possible instead of duplicating definitions. Add only clearly defined study fields and a schema version.

## 11. Stage 0 validation gates

Before Stage 1 exploratory generation, the following should pass on a small technical-only test set.

### G0-1 State immutability

Diagnostic extraction/search does not mutate the source position.

### G0-2 Legal root exhaustiveness

Candidate table contains every and only legal root move exactly once.

### G0-3 Score perspective

All candidate scores are comparable from the same root-player perspective.

### G0-4 Fixed-depth consistency

For non-timeout technical positions, the maximum exact candidate score/top set is consistent with the fixed-depth engine root decision under the same evaluator/search semantics, with any tie-order distinction explicitly explained.

### G0-5 Determinism

Repeated identical runs with `timeLimitMs = Infinity`, adaptive disabled and fixed source/options produce identical:

```text
candidate scores
candidate ranking/top sets
root choice
node/cutoff/evaluation counters expected to be deterministic
```

Wall-clock elapsed time is exempt from identity equality.

### G0-6 Depth trace consistency

Per-depth trace matches direct single-depth diagnostic evaluation for the same state/configuration.

### G0-7 Replay validity

Every recorded moveKey resolves to a legal engine move when replayed from its recorded state.

### G0-8 Identity availability

Every exploratory/formal state retains enough identity to audit:

```text
historical trajectory
rule state
selected ply/phase
source seed/config
```

### G0-9 Existing search behavior protection

Research instrumentation must not silently change normal game AI behavior when diagnostics are not requested. Existing search tests continue to pass.

## 12. Stage 0 stopping rule

Stage 0 ends when:

- all required diagnostics exist;
- validation gates pass;
- structural/ambiguity/instability definitions are technically computable;
- a Stage 1 exploratory protocol can be frozen.

Stage 0 does **not** end because an appealing scientific correlation is observed.

## 13. Current conclusion

The repository is already strong enough to begin this research without redesigning the Bao rules engine.

Current capability by layer:

| Layer | Current status | Main missing item |
| --- | --- | --- |
| Structural complexity | largely ready | exact study schema / relay semantics |
| Search workload | largely ready | per-depth counter trace |
| Decision ambiguity | not yet ready | exact exhaustive root candidate values |
| Prediction instability | partially ready | per-depth top-set/ranking trace |
| PV instability | optional / not ready | generic validated PV definition |
| Human difficulty | out of scope | separate human validation infrastructure |

Therefore the next engineering step is targeted diagnostic instrumentation, not formal corpus generation.