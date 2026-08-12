# Position Complexity Study 1 — Stage 1 Exploratory Protocol

更新日: 2026-08-12  
Status: **FROZEN EXPLORATORY PROTOCOL / NOT CONFIRMATORY**

Machine-readable spec:

```text
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
```

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
```

## 1. Purpose

Stage 1 is a fresh exploratory metric/design-development stage.

Its purpose is to establish whether the technically validated measurements are sufficiently available, non-degenerate, interpretable and estimable to freeze a later Stage 2 confirmatory design.

Stage 1 does **not** produce confirmed/not-confirmed scientific claims.

All Stage 1 positions and seeds are permanently consumed after inspection and may not be reused as independent Stage 2 confirmation evidence.

## 2. Fixed exploratory corpus

```text
games = 768
seed range = 20400001..20400768
opening = seeded-uniform legal moveVariants, 8 plies
max ply = 100
```

Search used to generate the trajectory after the opening:

```text
level = hard
evaluationProfile = bao
searchProfile = phase2
maxDepth = 2
timeLimitMs = Infinity
quiescenceDepth = 1
adaptive search = disabled
stableBestDepths = 0
aspirationWindow = 0
```

The seed range was checked against the repository and had no existing match at freeze time.

No favorable reseeding, early stopping, automatic replacement or outcome-dependent extension is authorized in this Stage 1 v1.

If availability is inadequate, v1 closes as insufficient for design freeze; a separately documented future exploratory stage is required rather than extending this corpus after inspection.

## 3. Statistical/computational unit discipline

Raw games are not automatically independent units because multiple seeds can converge to identical historical trajectories.

Stage 1 therefore performs:

```text
raw generated games
-> historicalTrajectoryHash
-> collapse identical historical trajectories
-> at most one selected state per unique historical trajectory
-> collapse duplicate selected ruleStateKey states
```

No all-ply independent-sample analysis is authorized.

### Duplicate historical trajectory representative

For an identical `historicalTrajectoryHash`, retain the game with the lowest seed; use `gameId` as deterministic tie-breaker.

## 4. Prospective phase assignment

One state per unique historical trajectory is preferred to avoid repeated-state pseudo-replication.

To preserve both Namua and Mtaji coverage without selecting phase after looking at difficulty outcomes, each unique trajectory is assigned prospectively to one phase using:

```text
sha256("PCX-S1-PHASE-v1|" + historicalTrajectoryHash)
```

Parity rule:

```text
even -> Namua
odd  -> Mtaji
```

The phase assignment is independent of search-instability/ambiguity results.

A trajectory that does not contain an eligible state in its assigned phase receives no replacement state.

## 5. Eligible state definition

Within the assigned phase, a state is eligible when:

```text
terminal = false
ply >= 8
phase = assigned phase
E.moveVariants(state).length >= 2
```

The `legalMoveCount >= 2` rule preserves the already frozen boundary that true single-choice roots are not part of primary decision-instability inference.

Single-choice states may still be described separately in structural/search-workload summaries but are not candidates for this selected-state Stage 1 primary design audit.

## 6. Deterministic within-trajectory state selection

For every eligible state in the assigned phase, compute a SHA-256 rank using:

```text
salt = PCX-S1-STATE-v1
fields = historicalTrajectoryHash | ruleStateKey | ply
```

Select the lexicographically smallest hash.

This rule does not use:

- root search score;
- D2->D3 instability;
- decision margin;
- node count;
- CBE status;
- MTAJI-M1/M2;
- outcome/winner.

If two trajectories select exactly the same `ruleStateKey`, retain only the selected state from the lexicographically smallest `historicalTrajectoryHash` for the unique-state analysis.

## 7. Fixed measurement configuration

On each selected state, measure depths:

```text
D1
D2
D3
D4
```

Exact root-candidate diagnostic:

```text
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
evaluationProfile = bao
quiescenceDepth = 1
orderQuiescenceCaptures = false
```

Search-workload comparison uses normal engine `AI.analyzeMove()` under:

```text
level = hard
searchProfile = phase2
evaluationProfile = bao
timeLimitMs = Infinity
adaptive = disabled
stableBestDepths = 0
aspirationWindow = 0
```

Wall-clock elapsed time is recorded only for QA/descriptive use and cannot determine metric promotion or readiness.

## 8. Candidate metric families

Stage 1 is explicitly allowed to compare candidate metrics within the following predeclared families.

### Structural

Examples include:

```text
legalMoveCount
captureMoveCount
forcedCapture
max/mean capturable seeds
max/mean capture events
max/mean relay events
max/mean chain events
front occupancy/connections
reusable pits
reserve / nyumba state
pit variance / seed concentration
```

The primary Stage 2 structural variable candidate entering Stage 1 remains `legalMoveCount`; Stage 1 may reject it for degeneracy/measurement reasons, but not merely because another variable has a smaller p-value.

### Search workload

```text
nodes
quiescenceNodes
cutoffs
evaluationRequests
evaluations
completedDepth
```

### Decision ambiguity

```text
bestSecondGap
topSetSize
exactTieStatus
full root score dispersion
```

No arbitrary near-equivalence threshold or entropy temperature is authorized unless Stage 1 explicitly develops and freezes it before any Stage 2 corpus exists.

### Prediction instability

```text
D1->D2 TopSet disjointness
D2->D3 TopSet disjointness
D3->D4 TopSet disjointness
canonical-best change
best-score sign reversal
best-score magnitude change
```

The current primary Stage 2 candidate is tie-aware D2->D3 TopSet disjointness.

## 9. Mate/terminal score handling during Stage 1

The validated diagnostic explicitly marks:

```text
ordinary-evaluation-domain
root-win-mate-domain
root-loss-mate-domain
```

Stage 1 must report the frequency of each score domain by depth.

Raw best-second gaps that cross or occupy mate-domain scores must not automatically be pooled with ordinary evaluator margins. Stage 1 determines the final Stage 2 handling rule before formal generation.

## 10. Readiness gates for Stage 2 design freeze

Stage 1 v1 is adequate to freeze a Stage 2 design only if all non-outcome availability gates pass:

```text
selected unique rule states >= 300
Namua selected states >= 120
Mtaji selected states >= 120
D2->D3 instability events >= 30
D2->D3 stable events >= 30
ordinary-domain D2 margins >= 200
```

These gates do not constitute confirmation of H1/H2. They only establish design estimability.

If any gate fails, Stage 2 generation is not authorized from this protocol.

## 11. Allowed Stage 1 analysis

Allowed:

- distributions and missingness;
- exact tie prevalence;
- D1/D2/D3/D4 instability prevalence;
- mate-domain prevalence;
- pairwise correlation and descriptive effect sizes;
- candidate metric collinearity/degeneracy;
- Namua/Mtaji coverage;
- node/cutoff/evaluation distributions;
- sensitivity among the predeclared adjacent-depth comparisons;
- model feasibility diagnostics;
- sample-size planning for Stage 2.

Stage 1 may use exploratory models and plots, but no p-value from Stage 1 becomes a confirmed scientific result.

## 12. Prohibited Stage 1 behavior

Do not:

- describe Stage 1 as confirmation;
- select a primary metric solely from the smallest p-value;
- extend seeds after seeing favorable/unfavorable associations;
- replace assigned-phase failures with outcome-favorable states;
- change `legalMoveCount` definition from `E.moveVariants()` to `E.legalMoves()` after inspection;
- use prior closed-study formal archives as additional Stage 1 observations;
- reinterpret CBE, MTAJI-M1/M2, N-ACT/N-CON or STYLE-C1..C4 to improve the new result;
- authorize Stage 2 using this document alone.

## 13. Stage 1 stopping point

After exactly 768 games are generated and the fixed state-selection/measurement pipeline completes:

1. verify provenance and all generated trajectories;
2. freeze the resulting exploratory corpus identity/hash;
3. run the predefined exploratory audit;
4. mark every Stage 1 seed/state permanently consumed;
5. decide whether readiness gates pass;
6. if ready, freeze a **separate Stage 2 preregistration with fresh seeds**;
7. if not ready, do not reinterpret the Stage 1 result as formal evidence.

## 14. Execution policy

Large/generated Stage 1 artifacts belong under:

```text
artifacts/local/position-complexity/stage1-exploratory-v1/
```

They remain gitignored under repository policy.

Stage 1 corpus generation is local execution. The small Stage 0 GitHub Actions workflow must not be repurposed to generate this 768-game exploratory corpus.
