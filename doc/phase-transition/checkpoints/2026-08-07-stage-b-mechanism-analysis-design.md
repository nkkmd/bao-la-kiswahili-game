# Stage B depth/search-profile mechanism analysis design

Date: 2026-08-07
Status: active / non-formal mechanism analysis design
Branch: `research/forced-capture-regime-analysis`

## Purpose

Study 1 Stage A ended with E-020/H18 formal `confirmed` under fixed `hard / bao / depth3`.
Stage B investigates why the observed search-profile ordering is:

- E-018 `hard / bao / depth2`: phase2 > legacy
- E-019/E-020 `hard / bao / depth3`: legacy > phase2

This checkpoint defines a secondary mechanism-analysis workflow. It does not create a new formal hypothesis, experiment ID, seed block, preregistration, execution authorization, or execution lock. It does not alter E-018/H16, E-019/H17, or E-020/H18.

## Fixed interpretation boundaries

- E-018/H16 remains `confirmed` only for `hard / bao / depth2`.
- E-019/H17 remains globally `not-confirmed`.
- E-020/H18 remains `confirmed` only for `hard / bao / depth3`.
- E-020 does not by itself confirm general depth non-monotonicity, a general search-profile × depth interaction, or generalization to other evaluators.
- Structural and mechanism secondary analyses cannot replace, rescue, reverse, or override a formal primary decision.
- Existing formal corpora are read-only and must not be regenerated or overwritten.
- PR #26 remains open / draft / unmerged until explicit instruction.

## Existing data inventory

The existing analysis pipeline already emits the main variables required for the first mechanism decomposition.

### Game level

Formal game files and paired endpoint builders contain:

- `seed`
- `gameIndex`
- `gameId`
- eligible candidate count
- expansion candidate count
- binary any-expansion endpoint

The E-020 paired builder is:

- `tools/experiments/build-phase-transition-d3-reversal-replication-pairs.js`

### Candidate / trajectory-ply level

`candidate-control-metrics.csv` contains candidate-level metrics produced from the locked corpus. Existing trajectory duplication analysis supports trajectory-ply deduplication.

Relevant code:

- `tools/experiments/analyze-confirmation-trajectory-duplication.js`
- `tools/experiments/summarize-phase-transition-search-profile-structure.js`
- `tools/experiments/summarize-phase-transition-search-profile-generalization-structure.js`
- `tools/experiments/summarize-phase-transition-d3-reversal-replication-structure.js`

### Forced-capture regime level

`tools/experiments/lib/forced-capture-regimes.js` already defines:

- `regimeId`
- `regimeStartPly`
- `regimeEndPly`
- `regimeLength`
- `positionInRegime`
- `normalizedPositionInRegime`
- `candidateCaptureMoveCount`
- `preCaptureMean`
- `postCaptureMean`
- `postCaptureMax`
- `captureDelta`
- `postPersistenceFraction`
- `distanceToForcingRelease`
- `distanceToTerminal`
- manifestation `classification`

The normalized position definition is already fixed by implementation:

`(candidatePly - regimeStartPly) / (regimeLength - 1)` for `regimeLength > 1`, and `0` for a one-ply regime.

Therefore Stage B must reuse this definition rather than introduce a result-dependent alternative.

## Initial empirical constraint from E-020

The existing E-020 trajectory-ply deduplicated secondary result is:

| condition | expansions | candidates | manifestation rate |
|---|---:|---:|---:|
| P2 | 5 | 42 | 11.90% |
| LG | 13 | 35 | 37.14% |

This rules out the simplest explanation that the E-020 legacy advantage arose merely because legacy produced more eligible candidate rows. Candidate availability and candidate-to-expansion manifestation must be analyzed separately.

This observation is secondary and does not establish a unique mechanism.

## Analysis hierarchy

The dependency hierarchy is:

`paired seed -> game -> forced-capture regime -> trajectory/ply -> candidate row`

Candidate rows must not be treated as independent games. Primary descriptive rates are reported at game level where possible. Candidate/regime summaries are secondary structural descriptions. If interval estimation is later added, resampling must cluster at paired seed or game level rather than use naive row-level binomial assumptions.

## Stage B analysis modules

### B0 — archive and schema inventory

For E-018, E-019, and E-020:

1. verify archive checksum without modifying the archive;
2. list members and identify exact paths for games, observations, candidate metrics, control metrics, paired endpoints, structural summaries, and integrity reports;
3. record whether each required field is stored directly, deterministically reconstructable from the locked corpus, or unavailable without new game execution;
4. extract analysis inputs to a new non-formal working directory outside all formal archive directories.

No formal archive member may be modified.

### B1 — candidate availability

For E-018 D2, E-019 D3, and E-020 D3, separately for P2 and LG, calculate:

- games with at least one eligible category-A candidate;
- candidate-game rate;
- trajectory-ply deduplicated candidate count;
- candidates per game;
- candidate count distribution per game;
- where available, candidate density per eligible ply.

This module asks whether the profile ordering is explained by access to candidate positions.

### B2 — candidate to manifestation conversion

Calculate with identical definitions across corpora:

- games with any eligible candidate;
- games with any eligible `capture-branch-expansion`;
- `P(any expansion | game has any candidate)`;
- trajectory-ply deduplicated candidate-to-expansion rate;
- expansion count distribution among candidate-bearing games.

Game-level and candidate-level quantities must remain explicitly separated.

### B3 — forced-capture regime morphology

For eligible candidates, summarize by condition:

- regime length;
- absolute position in regime;
- normalized position in regime;
- distance to forcing release;
- candidate capture move count;
- pre-candidate capture mean;
- capture delta;
- post-candidate persistence fraction;
- distance to terminal.

Report all eligible candidates and expansion candidates separately.

### B4 — trajectory and branching morphology

Using existing fields and deterministic board replay where already available:

- trajectory-ply duplication group size;
- legal capture branch count proxy (`captureMoveCount`);
- maximum capture branch count within the containing regime;
- candidate capture delta and persistence;
- candidate archetype composition.

`captureMoveCount` is a legal capture-move branching proxy. It must not be renamed as a complete search-tree branching factor.

Maximum capturable seed quantity and internal search-tree diagnostics are not assumed available until their presence in the archived schema is confirmed.

### B5 — candidate-pool composition

Use coarse, predeclared descriptive strata only, avoiding sparse result-driven slicing:

- regime length: one-ply, short, longer;
- normalized position: early, middle, late;
- capture branch proxy: low versus higher, with cut points reported before outcome comparison;
- distance to terminal bands consistent with existing eligibility thresholds.

The first objective is to determine whether P2/LG manifestation differences shrink after comparing candidates with similar observed structure. This is descriptive mechanism decomposition, not formal mediation proof.

### B6 — D3 mechanism consistency

Apply identical calculations to:

- E-019 D3 discovery corpus;
- E-020 D3 independent replication corpus.

Assess whether candidate availability, manifestation conversion, regime morphology, and trajectory duplication show the same qualitative ordering in both D3 corpora.

Consistency here is secondary replication of morphology, not a new formal confirmation.

### B7 — D2 versus D3 synthesis

Compare E-018 D2 against E-019/E-020 D3 using the same variables and definitions.

Because the depth corpora use different seed blocks, this is a cross-corpus descriptive comparison, not a paired depth effect. A direct same-opening depth2/depth3 test would require new game generation and a separate design.

## Question classification

### Answerable from existing recorded results

- D2 shows P2 > LG under E-018 fixed conditions.
- D3 shows LG > P2 in E-019 and prospective independent E-020 replication.
- E-020 candidate quantity alone does not explain the LG advantage.
- E-020 shows a candidate-to-manifestation difference and forced-capture regime differences as secondary evidence.

### Requires existing-corpus reanalysis

- candidate-game availability;
- candidates per game;
- game-level conditional manifestation;
- common trajectory-ply deduplicated conversion across E-018/E-019/E-020;
- regime length and position distributions;
- candidate-pool composition;
- E-019/E-020 D3 morphology consistency.

### May require deterministic reconstruction from existing locked corpus

- candidate density per eligible ply;
- board-state branch summaries not present in candidate metrics;
- regime-level maximum legal capture branch count;
- candidate board-pattern composition.

Reconstruction is allowed only from the existing locked corpus and existing locked-source-compatible code. It must write to a new non-formal output directory.

### Requires new game generation

- internal search-tree node expansions;
- principal variation and cutoff diagnostics;
- leaf evaluation and horizon-boundary diagnostics;
- direct same-seed depth2 versus depth3 comparison if no common corpus exists;
- any variable absent from the archived observations and not reconstructable by replay.

No such generation is authorized by this checkpoint.

### May require a new formal hypothesis later

- general search-profile × depth interaction;
- general depth non-monotonicity;
- causal mediation by regime length or candidate position;
- horizon-driven candidate-pool selection as a confirmatory claim;
- generalization beyond `bao` or beyond the tested depths.

Any such step requires a new hypothesis, experiment ID, seed block, preregistration, execution policy, explicit formal-start authorization, and dedicated execution lock.

## Execution order

The analysis order is fixed as:

1. E-020 D3 — establish and validate the reusable Stage B extraction and summary procedure;
2. E-019 D3 — apply the identical procedure to the discovery corpus;
3. E-018 D2 — apply the identical procedure to the opposite-direction depth2 corpus;
4. synthesize D2/D3 morphology without converting the comparison into an unregistered formal interaction test.

## First local requirement

The formal archives are stored outside the repository and are not accessible through GitHub. The next operation therefore requires local read-only access to:

- `/home/oruorane/bao-e018-exports/e018-final-formal-evaluation.tar.gz`
- `/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz`
- `/home/oruorane/bao-e020-exports/e020-final-formal-evaluation.tar.gz`

The first local action is archive inventory only. It must not rerun games or formal analysis and must not extract over an existing formal directory.

## Current decision

Proceed with B0 archive inventory and E-020-first non-formal reanalysis. Do not start a new formal experiment. Do not reuse E-020 authorization, seed, or lock. Keep PR #26 open / draft / unmerged.
