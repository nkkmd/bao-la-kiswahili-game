# Stage 1 Exploratory Temporal Pilot Protocol

Date: 2026-08-11  
Status: **FROZEN FOR EXPLORATORY GENERATION / NOT PREREGISTRATION**  
Study: `namua-mtaji-temporal-transition`

## 1. Purpose

Stage 1 is a fresh, consumed exploratory corpus used only to make the later formal design technically and statistically defensible.

It is allowed to answer feasibility questions about:

- Category-A candidate incidence;
- frozen `capture-branch-expansion` incidence;
- comparator availability;
- reserve/progression support;
- candidate multiplicity and episode overlap;
- target-event / terminal / administrative-truncation frequencies;
- first-Mtaji frozen morphology classifiability;
- support across search/depth conditions.

It is **not** allowed to provide a confirmatory claim.

The complete Stage 1 corpus becomes permanently exploratory as soon as generation begins. It may not later be promoted to the held-out formal corpus.

## 2. Inherited definitions

Stage 1 does not change any closed-study definition.

### 2.1 Category-A candidacy

Reproduce the fixed Study 1 pipeline exactly:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
non-forcing groups = reserve / mobility / capture / front
minimum active non-forcing groups = 2
cluster max gap = 1 ply
Category A = survives forcing-excluded candidacy and is not forcing-coincident
```

The implementation must reuse the historical feature/candidacy functions rather than recreate approximately equivalent formulas.

### 2.2 Frozen strategic-transition phenotype

Apply only to Category-A representative candidates, using unchanged settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier order remains:

1. `namua-to-mtaji-precursor`
2. `forcing-release-precursor`
3. `capture-branch-expansion`
4. `temporary-spike`
5. `capture-branch-convergence`
6. fallback `temporary-spike`

Do not apply the phenotype classifier indiscriminately to every ply; its inherited semantic domain is the Category-A candidate context.

### 2.3 Frozen Mtaji morphology

Use only candidate definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

No refit, restandardization, or relabeling is permitted.

## 3. Fresh pilot corpus identity

### 3.1 Size

Use:

```text
opening replicates = 32
conditions = 6
total games = 192
```

This is a feasibility pilot size, not a power calculation and not the later formal sample size.

### 3.2 Exploratory seed block

Use fresh opening seeds:

```text
base opening seed = 20271001
replicate seeds   = 20271001..20271032
```

Each opening seed is used once in each of the six conditions so that condition coverage begins from paired random-opening streams.

The paired structure is exploratory design support only; the later formal design may adopt or reject pairing before preregistration.

No seed in this Stage 1 range may later be used in the formal held-out corpus.

### 3.3 Opening and game limit

```text
opening policy = seeded-uniform-legal
opening plies  = 8
max ply        = 100
```

No runtime time limit is used for AI search.

## 4. Condition coverage

The exploratory pilot uses:

| ID | level | evaluator | search | maxDepth | role |
|---|---|---|---|---:|---|
| `P2-D1` | hard | bao | phase2 | 1 | shallow depth support |
| `P2-D2` | hard | bao | phase2 | 2 | core phase2 D2 |
| `P2-D3` | hard | bao | phase2 | 3 | deeper phase2 support |
| `LG-D2` | hard | bao | legacy | 2 | search-profile comparison support |
| `LG-D3` | hard | bao | legacy | 3 | search/depth support |
| `V2-D2` | hard | bao-v2 | phase2 | 2 | bounded evaluator robustness support |

Each condition receives 32 games.

These conditions are exploratory coverage. They do not freeze the later formal condition set or a directional search/depth hypothesis.

## 5. Raw artifacts

Store under:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/
```

Required raw artifacts:

```text
manifest.json
games/game-*.json
games-summary.json
legacy-observations.jsonl
```

Each game retains:

- full position-typology observations;
- exact moves;
- before/after rule-state identities;
- trajectory hashes;
- condition and paired-opening metadata;
- temporal outcome summary.

`legacy-observations.jsonl` is an adapter view used only to reproduce the inherited Category-A pipeline.

## 6. Integrity gates before exploratory inspection

Before candidate/event inspection:

1. source tree must be clean for instrumented files;
2. all source hashes must be recorded;
3. deterministic replay must pass;
4. stored observation recomputation must pass;
5. legacy phase-transition compatibility must pass;
6. move legality and before/after identity must pass;
7. phase monotonicity and phase-event linkage must pass;
8. first-Mtaji reserve exhaustion must pass;
9. temporal outcome recomputation must pass;
10. trajectory and summary hashes must pass.

If an integrity gate fails, scientific inspection stops until the technical defect is repaired. A repaired corpus receives a new instrumentation/config identity; no failed partial result is interpreted.

## 7. Candidate extraction audit

After integrity verification, reproduce inherited Category-A candidacy using the historical analysis functions.

Required outputs:

```text
candidate-audit-table.csv
candidate-pipeline-audit.json
```

The audit must record at least:

- Category A/B/C counts;
- Category-A count by condition;
- candidate point and cluster counts;
- representative game/ply;
- phase at candidate;
- peak score;
- active non-forcing signals;
- persistence values;
- forcing coincidence distance.

Only Category A representatives proceed to frozen phenotype classification.

## 8. Frozen phenotype event audit

For each Category-A representative:

- recompute the frozen candidate metrics from the full game trajectory;
- record the resulting inherited class;
- record candidate phase and forced-capture-regime context;
- record `candidatePly`;
- record `candidatePly + 8` as the nominal ascertainment landmark;
- record whether the full look-ahead was actually observed;
- record first Mtaji / terminal / max observed ply;
- record raw candidate-to-first-Mtaji distance where defined;
- record post-ascertainment time where defined;
- record reserve state at candidate and landmark;
- retain structural primitives needed for RQ2 feasibility.

Do not calculate confirmatory p-values or select a favorable comparator in this stage.

## 9. Required exploratory summaries

### 9.1 Event availability

By condition and overall:

```text
Category-A
capture-branch-expansion
temporary-spike
capture-branch-convergence
namua-to-mtaji-precursor
forcing-release-precursor
```

Also report Namua/Mtaji phase counts for each inherited class.

### 9.2 Temporal support

By inherited class:

- candidate ply distribution;
- first-Mtaji reach count;
- raw candidate-to-Mtaji distance distribution;
- ascertainment-complete count;
- post-ascertainment time distribution;
- terminal-before-Mtaji count;
- administrative truncation count.

No class is dropped merely because it failed to reach Mtaji.

### 9.3 Reserve/progression support

At candidate origin and, where observable, `candidatePly + 8`:

- actor reserve;
- opponent reserve;
- total reserve;
- condition-specific support ranges;
- overlap of observed support across candidate classes.

The purpose is to decide later whether reserve belongs in matching, stratification, adjustment, or mechanistic description.

No policy is selected until the pilot is inspected.

### 9.4 Multiple-event structure

Report:

- Category-A events per game;
- events per unique historical trajectory;
- same-class repetitions;
- mixed inherited classes within one trajectory;
- overlapping 8-ply ascertainment windows;
- repeated `trajectoryHash + candidatePly` units;
- duplicate trajectory groups.

These outputs determine whether the formal unit should be an index event, all events with clustered inference, or another trajectory-aware construction.

### 9.5 First Mtaji morphology feasibility

Using the frozen classifier, report:

- games reaching first Mtaji;
- first Mtaji states eligible under the frozen population boundary;
- technical classification successes/failures;
- exploratory M1/M2 counts overall and by condition.

M1/M2 counts remain exploratory and cannot define the later effect direction.

## 10. Explicitly prohibited Stage 1 operations

Do not:

- alter Category-A thresholds;
- alter CBE thresholds or classifier order;
- refit the Mtaji classifier;
- inspect multiple candidate windows and choose the one with the strongest result;
- merge/split comparator classes based on significance;
- choose candidate-ply versus landmark origin from significance;
- choose a survival/competing-risk model by the smallest p-value;
- reuse Stage 1 seeds formally;
- reinterpret E-010/E-011/E-017/E-019 or the bounded E-018/E-020 decisions.

## 11. Stage 1 decision outputs

Stage 1 may support a **design decision**, not a formal scientific conclusion.

After inspection, Stage 2 must freeze before held-out generation:

- target population;
- exact time origin;
- comparator;
- statistical unit;
- repeated-event handling;
- censoring/competing-event policy;
- reserve policy;
- RQ2 functional representation;
- first-Mtaji morphology endpoint rule;
- formal condition set;
- sample size and disjoint formal seeds;
- inferential model and decision rule.

## 12. Exit criterion

Stage 1 is complete when:

1. fresh 192-game corpus passes integrity verification;
2. inherited Category-A pipeline is reproduced without modification;
3. all Category-A representatives receive frozen phenotype metrics or a documented technical reason why not;
4. event support, temporal support, reserve support, multiplicity, censoring and first-Mtaji morphology feasibility are audited;
5. the pilot is explicitly marked consumed/exploratory;
6. a Stage 2 design-freeze proposal can be written without looking at any future formal corpus.
