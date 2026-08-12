# Research Plan — Namua→Mtaji Strategic Temporal Transition

Date: 2026-08-10  
Status: **initial prospective plan / pre-preregistration / Stage 0**  
Branch: `research/namua-mtaji-temporal-transition`  
Base: `main@c7d06d485789e1ea96d6603802423951a88c1f87`

## 1. Research title

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

## 2. Study identity and independence

This is a new prospective independent study.

It is motivated by a gap left by two closed studies:

1. phase-transition Study 1;
2. position-typology / playing-style Study 1.

It is not a continuation experiment that can alter their formal decisions, thresholds, negative/null/inconclusive results, vocabulary status, or interpretation boundaries.

Existing formal archives may be used read-only for schema/provenance/replay QA and for understanding already-published boundaries. They are not a new formal hypothesis-testing corpus for this study.

## 3. Scientific inheritance — frozen boundaries

### 3.1 capture-branch-expansion

Use the existing Study 1 definition unchanged.

Current fixed machine defaults include:

```text
before = 3 ply
after = 8 ply
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8 ply
```

Classifier order is material:

1. `namua-to-mtaji-precursor`
2. `forcing-release-precursor`
3. `capture-branch-expansion`
4. `temporary-spike`
5. `capture-branch-convergence`
6. fallback `temporary-spike`

The new study does not change these rules while retaining the Study 1 phenotype name.

### 3.2 phase-transition formal decisions

Preserve:

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only at fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only at fixed hard / bao / depth3, legacy > phase2
```

The D2/D3 reversal does not establish a general search-profile × depth interaction.

### 3.3 sustained-forcing window

Status:

```text
retrospective Stage B interpretation
not a fitted classifier
not a new-study threshold
```

No numeric window is inferred from the old result and inserted into this study.

### 3.4 confirmed Mtaji morphology

Use only the frozen Stage 2 classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit, held-out restandardization, relabeling, representation change, or semantic redefinition is allowed if these IDs are used.

The classifier remains bounded to its confirmed population and representation. It is not a universal Bao ontology.

### 3.5 Namua vocabulary

No discrete Namua type is promoted.

```text
N-PROG = progression context only
N-ACT  = exploratory continuous coordinate
N-CON  = exploratory continuous coordinate
```

N-ACT overlaps mechanically with capture activity and must not be used as an independent structural validation of `capture-branch-expansion`.

Raw rule-state primitives may be used independently of the exploratory coordinate names.

### 3.6 playing style

```text
discrete playing-style cluster set = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

This study does not rescue or confirm them.

## 4. Motivation from the fixed cross-study bridge

Stage 6 reported, under its frozen secondary scope:

```text
capture-branch-expansion unique trajectory-ply units = 59
Namua = 59
Mtaji = 0
```

Therefore same-ply association between expansion and `MTAJI-M1/M2` was not estimable.

This study changes the estimand rather than the old result:

```text
same-time relation
        ↓
prospective temporal connection
```

The target is the path from a fixed Namua phenotype toward the first later formal Mtaji state.

## 5. Central research question

> Is `capture-branch-expansion` merely a phenotype that occurs somewhere in Namua, or is it positioned within a reproducible temporal approach to the formal Namua→Mtaji transition?

A second linked question is:

> Which frozen Mtaji morphology is first reached after trajectories containing the phenotype?

## 6. Research questions

### RQ1 — Temporal distance to first Mtaji

Does the time from a prespecified event origin associated with `capture-branch-expansion` to first later Mtaji differ from a prespecified comparator?

Candidate endpoint family:

```text
time-to-first-Mtaji
```

The exact origin is **not yet frozen** because phenotype classification uses future observations through `candidatePly + 8`.

### RQ2 — Structural trajectory toward Mtaji

How do the following quantities evolve between the Namua event and formal Mtaji conversion?

- player-specific reserve and total reserve;
- house ownership and nyumba seeds;
- legal move count;
- capture move count;
- forced-capture state and regime lifecycle;
- front-row seeds / occupancy / connections;
- back-row structure where relevant;
- reusable pits;
- maximum / mean capturable seeds;
- capture-event / relay / chain primitives;
- raw pit-state summaries.

No arbitrary pre-transition window is selected after seeing results.

### RQ3 — First Mtaji morphology

Among trajectories reaching an eligible non-terminal first Mtaji observation, how is first Mtaji state distributed over frozen `MTAJI-M1 / MTAJI-M2`?

The first Mtaji state must satisfy the classifier's frozen population boundary before the morphology endpoint is considered valid.

### RQ4 — Search profile / depth relation to temporal endpoint

Does the new temporal endpoint vary by search profile or depth?

If formalized, this becomes a new preregistered hypothesis. It is not defined as a replay of E-018/E-020 ordering.

## 7. Working hypotheses — not yet preregistered

These are design hypotheses only. They are not formal until Stage 3 preregistration.

### WH1

After applying a fair, prespecified event origin and comparator, trajectories associated with `capture-branch-expansion` may occupy a different temporal distribution to first Mtaji than comparator trajectories/events.

### WH2

The transition path may show structured changes in reserve, nyumba, mobility, front-row and forced-capture lifecycle that are not reducible to instantaneous `captureMoveCount` alone.

### WH3

The first eligible Mtaji morphology after the Namua event may have a non-random or comparator-different M1/M2 distribution within the study population.

### WH4

Search-profile/depth metadata may modify the temporal endpoint, but any such test must be newly preregistered and bounded.

No direction is fixed at this stage.

## 8. Critical design issue — look-ahead / landmark origin

The frozen Study 1 phenotype is not contemporaneously observable from the candidate state alone.

For a candidate at ply `t`, classification uses:

- pre observations `[t-3, t-1]`;
- post observations `[t+1, t+8]`;
- future phase transition within 8 ply;
- future forcing release within 8 ply.

Therefore exposure/group assignment is ascertained using future information.

Additionally, a Namua candidate with first future Mtaji within 8 ply is classified as `namua-to-mtaji-precursor`, not `capture-branch-expansion`.

Consequences:

1. `capture-branch-expansion` cannot have first later Mtaji at distance `<= 8` under the frozen classifier.
2. A naive survival clock beginning at `candidatePly` contains an ascertainment interval during which group identity is not yet known.
3. The primary formal clock may need a landmark at `candidatePly + 8` or an equivalent prespecified transformation.

Stage 0 and Stage 1 must establish the technically valid time origin before preregistration. The held-out formal corpus must not be used to choose it.

Raw candidate-to-Mtaji distance may still be retained as an explicitly descriptive quantity.

## 9. Formal Mtaji transition semantics

In the current engine, during `finishTurn()`:

```text
if phase == namua
and reserve[0] == 0
and reserve[1] == 0
then phase = mtaji
```

The first observation after this phase change is the first formal Mtaji state.

Implications:

- reserve is a rule-derived progression variable, not merely an optional covariate;
- time-to-Mtaji is mechanically linked to reserve depletion;
- progression and strategic structure must be distinguished;
- raw reserve may be used as a design/matching/stratification variable without treating exploratory N-PROG as confirmed.

Whether reserve should be a matching variable, stratification variable, model covariate, or descriptive mechanistic context is **not yet frozen**. This decision requires fresh pilot overlap diagnostics and an explicit estimand statement.

## 10. Event and censoring framework

Potential endpoint states:

```text
A. first formal Mtaji observation
B. natural terminal game state before Mtaji
C. administrative max-ply truncation before Mtaji
```

Initial statistical interpretation:

- A = target event;
- B = plausible competing event because Mtaji can no longer occur in that trajectory;
- C = administrative right censoring candidate.

A simple complete-case analysis that drops B/C is not acceptable for formal inference.

The exact survival / competing-risk model is not frozen until Stage 1 measures event/censoring frequency and support.

## 11. Comparator design

The Stage 6 comparator was:

```text
temporary-spike
capture-branch-convergence
```

This is a **candidate comparator family**, not the new study's formal comparator by inheritance.

Stage 1 must audit at least:

- sample availability by condition;
- candidate ascertainment compatibility;
- phase support;
- reserve overlap at event origin;
- distance-to-Mtaji support;
- forced-capture-regime context;
- event multiplicity per trajectory;
- whether comparator classes have materially different censoring/terminal behavior;
- whether merging spike and convergence is scientifically coherent for the new estimand.

Potential design families to compare on the exploratory pilot only:

1. frozen Stage 6 non-precursor comparator;
2. separate temporary-spike and convergence comparators;
3. prespecified risk-set comparator among eligible Category-A non-precursor events with progression balance;
4. one-index-event-per-trajectory variant.

One formal comparator rule must be frozen before held-out generation/inspection.

No post-hoc comparator switching is allowed.

## 12. Statistical unit and dependence

Raw ply is not an independent sample.

The data hierarchy can include:

```text
condition
  -> game / deterministic trajectory
      -> candidate event
          -> post-event survival episode
              -> repeated state observations
```

The formal primary unit is not yet frozen.

Stage 1 must report:

- candidate events per game;
- candidate events per unique trajectory;
- same-class multiple events;
- mixed-class events within one trajectory;
- interval overlap between event-centered episodes;
- duplicate trajectory groups;
- first-event versus later-event coverage;
- event occurrence relative to reserve progression.

Candidate primary-unit strategies:

- first/index eligible event per trajectory;
- one prespecified class-specific index event per trajectory;
- all eligible events with trajectory-clustered/frailty inference;
- risk-set matched episodes with trajectory-aware resampling.

The choice must be frozen before formal data inspection.

## 13. RQ2 trajectory representation without post-hoc windows

Preferred principles:

1. use the full eligible interval rather than selecting a favorable last-N-ply window;
2. consider rule-derived progress such as remaining reserve as an intrinsic coordinate;
3. if continuous event-time modeling is used, prespecify the functional form / smoothing policy before formal analysis;
4. report trajectory/game dependence explicitly;
5. keep variables that are components of the phenotype definition separate from genuinely independent structural features.

In particular:

- `captureMoveCount` and N-ACT cannot serve as independent confirmation of a capture-based phenotype;
- reserve, nyumba, front-row structure, board occupancy, and other rule-state primitives may provide more independent structural information, subject to a frozen analysis plan.

## 14. RQ3 first-Mtaji morphology rules

The first later state with:

```text
phase == mtaji
terminal == false
```

is a candidate first-Mtaji morphology endpoint.

Before classifying it:

1. verify replay/state identity;
2. verify the frozen MTAJI candidate-definition artifact hash;
3. verify that all required 40 features can be reconstructed exactly;
4. apply the discovery-fitted scaler;
5. apply the discovery centroids;
6. retain canonical `MTAJI-M1 / MTAJI-M2` mapping;
7. do not refit/restandardize/relabel.

If the first Mtaji state does not satisfy the frozen classifier population boundary, the endpoint must follow a preregistered policy rather than silently moving to a later more convenient Mtaji state.

Stage 0 must establish whether such cases can occur and how they should be represented.

## 15. Corpus policy

### Existing formal archives

Read-only.

Allowed before new formal preregistration:

- source schema audit;
- archive inventory/checksum validation;
- replay feasibility validation;
- implementation compatibility checks;
- reconstruction of already-published quantities for technical QA only.

Not allowed as the new formal claim corpus:

- endpoint fitting;
- comparator selection based on new association values;
- threshold optimization;
- model selection intended to maximize a new scientific result.

### Fresh Stage 1 pilot

Must use a new exploratory seed block reserved only for this study.

Its purpose is to determine feasibility and freeze the formal design. It is consumed after inspection and may not later be relabeled as held-out confirmation.

### Fresh formal corpus

Must use a disjoint seed block frozen in preregistration.

Do not inspect scientifically before preregistration identity, code/provenance hash, population, endpoint, comparator, statistical unit, censoring policy, and decision rule are frozen.

## 16. Search-condition sampling

Search condition labels are metadata.

Stage 0/1 must determine whether the formal study should:

- focus on a single fixed condition for a clean primary claim;
- use multiple prespecified strata;
- reserve search-profile/depth analysis for secondary confirmatory hypotheses.

No condition ID is a position type or morphology label.

The prior D2/D3 reversal may motivate sampling coverage but does not dictate a new hypothesis direction.

## 17. Study stages

### Stage 0 — Schema / engine / artifact / replay feasibility audit

Goals:

- verify exact engine phase semantics;
- design temporal observation/game artifact schema;
- verify frozen classifier compatibility;
- verify MTAJI frozen artifact availability and hash;
- build/reuse deterministic replay and provenance checks;
- smoke-test extraction without scientific endpoint analysis;
- identify look-ahead, censoring, competing-event and multiplicity issues.

No formal endpoint/comparator/seed block is frozen unless required for technical smoke only.

### Stage 1 — Fresh exploratory temporal pilot

Goals:

- measure event incidence and comparator availability;
- audit transition/censoring frequencies;
- audit reserve overlap and progression support;
- audit multiple-event dependence;
- compare technically defensible time-origin/comparator/unit designs;
- inspect whether first Mtaji morphology is classifiable with the frozen artifact;
- choose a model family based on data structure, not effect favorability.

No formal claim.

### Stage 2 — Design freeze

Freeze:

- primary RQ/hypothesis;
- population;
- candidate event definition inheritance;
- time origin;
- primary endpoint;
- comparator;
- primary statistical unit;
- duplicate/multiple-event rule;
- censoring/competing-event rule;
- first-Mtaji morphology rule;
- statistical model and uncertainty method;
- search-condition scope;
- formal seed block and sample size;
- technical integrity gates;
- decision threshold / multiplicity policy.

### Stage 3 — Preregistration

Create human-readable protocol plus machine-readable spec/hash before formal corpus generation or inspection.

### Stage 4 — Fresh held-out formal generation

Local execution only.

Requirements:

- clean source state;
- preregistration/spec hash match;
- disjoint seed block;
- atomic per-game output/resume;
- source-file SHA-256 provenance;
- no GitHub Actions large generation.

### Stage 5 — Confirmatory analysis

Execute exactly the preregistered analysis.

Negative/null/inconclusive results are retained. No same-corpus rescue.

### Stage 6 — Secondary analysis / external validity

Only analyses explicitly declared secondary or separately preregistered.

Potential topics:

- search-profile/depth heterogeneity;
- condition-specific morphology endpoints;
- richer structural trajectories;
- sensitivity to index-event rule;
- external engine/search implementations.

### Stage 7 — Final integration

Create:

- Study overview;
- final scientific report;
- vocabulary;
- reproducibility index;
- final archive/checksum ledger;
- closure checkpoint.

## 18. Claims that remain out of scope

Do not infer from this study alone:

- universal Bao transition law;
- causal mediation of `capture-branch-expansion` through reserve/N-ACT/N-CON/Mtaji morphology;
- universal MTAJI ontology;
- confirmed Namua state coordinates without independent confirmation;
- confirmed playing-style ontology;
- global search-profile × depth interaction;
- invalidation or rescue of any closed Study 1 result.

## 19. Current decision state

Frozen now:

- study identity and independent scope;
- inherited Study 1 boundaries;
- use of the frozen `capture-branch-expansion` definition if that phenotype name is used;
- use of the frozen `MTAJI-M1/M2` classifier if morphology endpoint is used;
- no post-hoc window fitting;
- fresh prospective formal corpus requirement;
- held-out inspection prohibition before preregistration;
- local-only heavy formal generation;
- no raw-ply independence assumption.

Not frozen yet:

- exact formal hypothesis direction;
- exact time origin;
- primary comparator;
- primary statistical unit;
- formal search-condition scope;
- statistical model;
- censoring/competing-risk model;
- seed block;
- sample size;
- formal decision threshold;
- RQ2 functional representation.

These remain open deliberately until Stage 0/1 feasibility evidence is available.
