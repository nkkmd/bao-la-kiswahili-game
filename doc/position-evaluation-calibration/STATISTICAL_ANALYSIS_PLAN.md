# Statistical Analysis Plan — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **STAGE 0 DRAFT — NOT A STAGE 2 AUTHORIZATION**

## 1. Statistical unit

Preferred primary unit: one prospectively selected state per unique historical trajectory after exact duplicate controls.

A selected root contributes:

```text
actor
phase
staticEvaluation
exact D2 search value (secondary)
terminal continuation outcome or administrative-truncation flag
identity keys
prespecified structural covariates
```

Repeated nearby plies from one game are not treated as independent state-level observations.

## 2. Actor normalization

```text
actor = selectedState.player
score = AI.evaluate(selectedState, actor)
y = 1 if frozen continuation winner == actor
    0 if frozen continuation winner == 1-actor
```

No seat-dependent sign convention is allowed after measurement.

## 3. Development / confirmation separation

### Stage 1

Fresh exploratory development data only. Allowed purposes:

- inspect score support and phase coverage;
- estimate base rates;
- assess feasibility and numerical stability;
- compare prospectively enumerated calibration families;
- freeze transformation/fitting details and Stage 2 decision criteria.

### Stage 2

Fresh formal holdout only. No refitting of the probability mapping on Stage 2 is permitted before evaluating the frozen predictions.

## 4. Candidate mapping families for Stage 1

Initial restricted candidate set:

1. phase-aware logistic calibration;
2. phase-stratified isotonic calibration.

A pooled logistic reference model may be retained to quantify phase dependence. Additional splines/families are not authorized merely because Stage 1 or Stage 2 fits poorly; adding a family requires a prospective Stage 0 amendment before Stage 1 outcome inspection.

The exact score scaling, phase interaction form, grouped cross-validation rule, extrapolation rule and deterministic tie-break among candidate families must be machine-frozen before Stage 1 outcome analysis.

## 5. Metrics

Working hierarchy to be finalized before Stage 2:

### Primary candidate

- Brier score of frozen predicted probabilities on fresh Stage 2 outcomes.

### Key secondary

- log loss;
- calibration intercept;
- calibration slope;
- monotonicity statistic / slope direction;
- discrimination (AUC), explicitly not a calibration metric;
- phase-specific calibration performance.

### Descriptive

- reliability curve;
- ECE only with Stage 1-frozen bin edges/count convention;
- score distribution and outcome rate by phase;
- prespecified structural heterogeneity displays.

AUC cannot rescue poor calibration. ECE cannot become primary after Stage 2 inspection.

## 6. Uncertainty and dependence

The outcome is Bernoulli at the selected-state level under deterministic continuation. There is no assumed within-state binomial replication.

Uncertainty procedures must respect trajectory-level sampling. If bootstrap is used, the resampling unit is the eligible historical trajectory/selected root, not individual plies.

If multiple generation strata are used, stratified resampling/aggregation rules must be frozen before formal generation.

## 7. Administrative truncation

An unresolved continuation at the frozen maximum ply/turn is not a draw. The final protocol must preregister:

- continuation maximum;
- `administrativeTruncation` recording;
- maximum tolerable truncation rate / estimability gate;
- whether a binary calibration analysis is suppressed when that gate fails.

No outcome-dependent extension of truncated games is permitted after formal outcome inspection unless the extension rule itself was frozen prospectively and applies to all qualifying games.

## 8. Identity firewall

No Stage 2 state may overlap Stage 1 on any frozen forbidden identity, including at minimum:

```text
historicalTrajectoryHash
ruleStateKey
openingPrefixHash
```

The precise opening-prefix definition and collision handling must be frozen before Stage 1.

## 9. Formal decision rule

Not yet frozen at Stage 0 initiation.

Before Stage 2 generation, the repository must contain a machine-readable Stage 2 spec that fixes:

- selected mapping family and all parameters/transform rules;
- primary metric and threshold/equivalence criterion;
- key-secondary hierarchy;
- uncertainty method;
- phase rule;
- truncation gate;
- population/count gates;
- no-rescue rule;
- seed block;
- source hashes;
- separate generation authorization.

Until then, no Stage 2 scientific generation is authorized.
