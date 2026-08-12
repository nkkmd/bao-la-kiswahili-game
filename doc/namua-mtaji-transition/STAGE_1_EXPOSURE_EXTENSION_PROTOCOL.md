# Stage 1 Exposure-Support Extension Protocol

Date: 2026-08-11  
Status: **FROZEN BEFORE EXTENSION GENERATION**  
Study: Namua→Mtaji Strategic Temporal Transition

## 1. Purpose

The primary Stage 1 pilot established comparator feasibility but yielded only one unique Namua `capture-branch-expansion` (CBE) trajectory-ply unit.

This extension exists only to obtain enough **exploratory exposure support** to design Stage 2 prospectively.

It is not a formal experiment and is permanently consumed after inspection.

## 2. Scientific boundaries

```text
formalExperiment = false
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
candidateDefinitionModificationAuthorized = false
morphologyEffectInspectionAuthorized = false
```

The extension must not:

- modify Category-A candidacy;
- modify the frozen CBE classifier or precedence;
- tune thresholds to increase CBE count;
- choose seeds after inspecting individual trajectories;
- inspect CBE-vs-control MTAJI-M1/M2 contrast;
- estimate a confirmatory effect;
- become part of the later held-out formal corpus.

## 3. Why an extension is required

Primary Stage 1 support:

```text
192 games
169 unique historical trajectories
Category-A rows = 9
Namua Category-A rows = 4
raw Namua CBE rows = 2
unique CBE trajectory-ply units = 1
```

The two CBE rows are the same historical trajectory at ply 33 under P2-D2 and V2-D2.

Exact-ply R3 risk-set controls are abundant (31 per observed condition row), so comparator feasibility is not the limiting factor.

## 4. Condition selection

Extension conditions are fixed as:

```text
P2-D2 = hard / bao / phase2 / depth2
V2-D2 = hard / bao-v2 / phase2 / depth2
```

Rationale:

1. these are the only fresh Stage 1 conditions in which Namua CBE was observed;
2. selection uses exposure availability only, not morphology outcome;
3. both have strong exact-ply R3 control support;
4. paired generation permits measurement of duplicate-trajectory frequency between the two evaluators.

This condition restriction is exploratory-enrichment policy only. It does not freeze the later formal condition set.

## 5. Fixed extension corpus

```text
paired opening replicates = 384
conditions                = 2
total games               = 768
opening seed range        = 20272001..20272384
opening plies             = 8
max ply                   = 100
```

Opening policy:

```text
seeded-uniform-legal
paired across P2-D2 and V2-D2
```

The seed range is disjoint from the primary Stage 1 pilot (`20271001..20271032`) and is permanently exploratory.

No early stopping is permitted based on observed CBE count or morphology. All 384 paired replicates are generated unless there is a technical failure.

## 6. Why 384 paired replicates

This is a feasibility-sampling choice, not a power calculation.

In the primary pilot, P2-D2/V2-D2 together produced approximately 49 unique historical trajectories from 32 paired openings after cross-condition trajectory deduplication, with one unique CBE trajectory-ply unit.

If that exposure frequency and duplicate rate were approximately stable, 384 paired openings would yield on the order of several hundred unique trajectories and roughly low-double-digit CBE units.

That estimate is used only to choose a practical exploratory extension size. No confirmatory sample-size claim follows from it.

## 7. Inherited candidate definition

Category A remains exactly:

```text
signalThreshold       = 2.0
persistenceThreshold  = 0.75
clusterMaxGap         = 1
non-forcing groups    = reserve / mobility / capture / front
minimum active groups = 2
Category A            = survives forcing-excluded candidacy and is not forcing-coincident
```

Historical functions from:

```text
tools/experiments/analyze-phase-transition-pilot.py
tools/experiments/analyze-phase-transition-forcing-ablation.py
```

must be reused rather than reimplemented.

## 8. Frozen phenotype definition

CBE remains:

```text
before              = 3
after               = 8
expansionDelta      = 3
convergenceDelta    = -2
persistenceFraction = 0.5
eventWindow         = 8
```

Classifier precedence remains unchanged.

In particular, `namua-to-mtaji-precursor` retains precedence over CBE.

## 9. Deterministic clock boundary

For surviving standard trajectories:

```text
first Mtaji ply = 44
total reserve at ply t = 44 - t
```

The extension must rerun the deterministic-clock audit.

No survival/hazard interpretation is authorized.

## 10. Exposure counting

Raw condition rows are not the design-support unit.

Primary exposure-support key:

```text
historicalTrajectoryHash + candidatePly
```

Report at least:

- raw CBE rows;
- unique CBE trajectory-ply units;
- unique historical trajectories containing Namua CBE;
- duplicate condition rows per unique exposure;
- candidate-ply distribution;
- condition membership of each unique exposure;
- multiple CBE events within one trajectory;
- overlapping 8-ply ascertainment windows.

## 11. Stage 2 readiness target

This is a design-feasibility threshold, not a statistical significance threshold.

Stage 2 may be considered only if the combined exploratory evidence contains at least:

```text
10 unique Namua CBE trajectory-ply units
and
8 unique historical trajectories containing Namua CBE
```

The primary pilot and extension may be combined **only for feasibility counts/design diagnostics**, because both are consumed exploratory corpora.

If this minimum is not reached, Stage 2 remains blocked and the study must reassess prevalence/scope before any formal corpus is generated.

Meeting the minimum does not automatically authorize a particular effect model.

## 12. Comparator feasibility after extension

After exposure support is known, rerun an outcome-blind exact-ply risk-set support audit for each unique exposure.

Preferred feasibility family remains the strict R3 concept:

```text
same condition
+ exact candidate ply
+ not Category-A at index
+ forcedCapture status matched
+ no Namua CBE elsewhere in control trajectory
```

This is still a candidate comparator, not yet a formal freeze.

Do not require matching on capture/front-row quantities that may constitute or mediate the phenotype itself.

## 13. Morphology boundary

Frozen first-Mtaji morphology may be applied only as a technical classifiability audit during this extension.

Allowed before Stage 2:

- overall first-Mtaji eligible count;
- overall M1/M2 counts as feasibility context;
- classifier failures/ineligibility.

Not allowed before comparator/design freeze:

- CBE-vs-control M1/M2 rate difference;
- odds ratio/risk ratio/effect size by exposure;
- p-values;
- selecting a comparator family because it gives a stronger morphology contrast.

## 14. Required outputs

```text
manifest.json
verification.json
clock-audit.json
candidate-pipeline-audit.json
stage1-event-audit.json
stage1-event-table.csv
```

A later exposure-support summary may be generated from these files without morphology contrasts.

## 15. Decision after extension

Possible outcomes:

### A. Readiness minimum met

Proceed to Stage 2 design freeze work:

- decide formal target population;
- decide exposure/statistical unit;
- freeze duplicate handling;
- freeze risk-set comparator construction;
- choose post-ascertainment structural and/or first-Mtaji morphology primary endpoint;
- plan formal sample size and disjoint seed block;
- preregister before formal generation.

### B. Readiness minimum not met

Do not lower CBE thresholds or broaden the phenotype post hoc.

Instead reassess whether the prospective question is feasible at acceptable computational scale or should be narrowed/reframed.

## 16. Frozen conclusion

> **The Stage 1 extension is a fixed 384-paired-opening, P2-D2/V2-D2 exploratory exposure-support corpus using seeds 20272001..20272384. It exists solely to determine whether the inherited CBE phenotype is sufficiently prevalent for prospective Stage 2 design. No morphology effect contrast may be inspected before that design is frozen.**
