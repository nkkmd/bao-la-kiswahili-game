# SSGTGE-STUDY1 — Protocol

## 1. Study identity

```text
Program = G2-12
Study ID = SSGTGE-STUDY1
Research Generation = Research Generation 2
Formal title = State-Space / Game-Tree Growth Estimation Study 1
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Branch = research/g2-12-state-space-game-tree-growth-estimation
```

The prospective authority is `preregistration/STUDY_START_FREEZE.md` together with `preregistration/STUDY_START_SPEC.json`.

## 2. Scientific target

The Study tests whether a prospectively fixed bounded-growth estimator developed from exact standard-root layers through depth 9 predicts a fresh exact deeper holdout without post-hoc refitting.

The Study does not treat a successful bounded prediction as proof of the total Bao state-space or full game-tree size.

## 3. RAW identity

Authoritative identity fields:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded:

```text
turn,reason
```

`pending` is required and seed conservation must equal 64. No validated transformation exists; canonicalization and symmetry reduction remain prohibited.

## 4. Graph and tree quantities

Graph and tree quantities are never merged.

Required exact layer outputs include:

- per-depth `uniqueRawStateCount`;
- per-depth `newRawStateCount`;
- cumulative RAW-state union count;
- per-parent-layer legal transition occurrences;
- cumulative graph transition occurrences;
- duplicate arrivals;
- states with multiple predecessor RAW states;
- per-depth tree node occurrences;
- cumulative tree node occurrences;
- tree edge occurrences;
- tree/RAW occurrence ratios;
- effective legal branching summaries.

A partial child layer is never exact evidence.

## 5. Stage 0 — `SSGTGE-S0-TECHNICAL-2026-08-30-v1`

Stage 0 is technical-only. It validates:

- deterministic RAW serialization and keys;
- exact layer enumeration plumbing;
- successor binding;
- graph deduplication;
- tree multiplicity accounting;
- per-depth aggregation;
- deterministic estimator implementations;
- synthetic estimator fixtures;
- metric computation;
- uncertainty-envelope computation;
- resource counters and stop mapping;
- packaging and independent-process verification.

Stage 0 must not generate or inspect any fresh depth 10/11 scientific count.

## 6. Stage 1 — `SSGTGE-S1-DEVELOPMENT-2026-08-30-v1`

Stage 1 uses immutable G2-05 exact summaries from depths 0..9 only.

The candidate set is finite and frozen at Study start:

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

Primary modeled series:

```text
newRawStateCount[d]
treeNodeOccurrences[d]
```

Rolling-origin cells are fixed at `5->6`, `6->7`, `7->8`, `8->9` for both series.

Each candidate must have finite positive predictions, predict a nondecreasing next layer, and achieve maximum absolute log error `<= 0.15` across all eight cells. Winner selection is lexicographic: minimum maximum absolute log error, then minimum mean absolute log error, then fixed candidate order E1/E2/E3.

Stage 1 either materializes one complete frozen estimator specification or closes `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`.

The frozen estimator artifact must include exact fitted parameters, development predictions, errors, selected candidate, `q`, depth 10 and depth 11 point predictions, uncertainty envelopes, source hashes, and implementation hashes.

## 7. Uncertainty method

Let `q` be the selected estimator's maximum absolute log error across the eight rolling-origin development cells.

```text
R1 = max(0.15, 2*q)
R2 = 2*R1
```

For point prediction `p`, the deterministic envelope is `[p*exp(-R), p*exp(R)]`.

This envelope is an operational calibration band only. It is not assigned nominal frequentist or Bayesian coverage probability.

## 8. Stage 2 — `SSGTGE-S2-FORMAL-2026-08-30-v1`

Stage 2 is fresh exact holdout validation.

Mandatory holdout:

```text
standard initial RAW root
fresh exact depth 10 layer
```

Secondary stress-test:

```text
same root
fresh exact depth 11 layer if complete under unchanged ceilings
```

Stage 2 must start from a fresh reconstruction of the standard root and enumerate from depth 0. It must not read G2-05 materialized state/edge rows as enumeration input. It may compare regenerated depth 0..9 aggregate/hash values only as integrity checks.

## 9. Formal primary endpoint

Formal validation is joint across the two primary depth-10 series.

All must hold:

1. depth 10 is fully complete;
2. production and independent implementations agree with exact zero mismatch;
3. maximum absolute natural-log prediction error across `newRawStateCount[10]` and `treeNodeOccurrences[10]` is `<= 0.20`;
4. both exact values are contained in their frozen `R1` envelopes;
5. estimator, parameters, envelopes, thresholds, and decision mapping match the pre-holdout source freeze.

If exact depth 10 is available and verification passes but any performance criterion fails, formal decision is `NOT-VALIDATED`.

## 10. Depth 11 stress-test

Depth 11 is evaluated only with the already frozen estimator and `R2` envelope.

It cannot rescue depth 10 failure and cannot overturn a valid depth 10 decision. If complete, it is reported as a secondary bounded generalization stress-test. If resource-censored, only depth 11 is marked censored; a completed depth 10 decision remains intact.

## 11. Resource ceilings

```text
maximum target depth attempted = 11
mandatory complete depth = 10
maximum cumulative distinct RAW states = 2000000
maximum cumulative depth-labelled legal edges = 12000000
maximum unique parent-state expansions = 600000
maximum legal move evaluations = 12000000
maximum cumulative tree-node occurrences = 50000000
maximum RSS = 6442450944 bytes
maximum wall clock = 1200 seconds
maximum uncompressed scientific artifact bytes = 1073741824
```

Depth 10 partial output is not accepted as validation evidence. Resource/admin stop before complete depth 10 maps to `RESOURCE-CENSORED` after integrity checks.

## 12. Production / independent verification

The independent verifier must not import the production enumeration or estimator scientific-logic module.

It independently reconstructs or recomputes:

- RAW serialization/key;
- legal move normalization/key;
- successor generation;
- exact-depth layer sets;
- graph edge sets;
- tree occurrence propagation;
- per-depth summaries;
- estimator application from the frozen estimator artifact;
- log-error metrics;
- uncertainty coverage checks;
- final decision mapping.

Any exact mismatch fails closed; it is not relaxed to tolerance after outcome.

## 13. Decision taxonomy

Study-level formal decisions:

```text
VALIDATED-WITHIN-FRESH-DEPTH-10-HOLDOUT
NOT-VALIDATED
NON-ESTIMABLE
RESOURCE-CENSORED
TECHNICAL-INVALID
INCONCLUSIVE
```

Technical classifications remain separate and include resource caps, `ADMIN-CUTOFF`, `VERIFICATION-FAILED`, and `NOT-AUTHORIZED-NOT-EXECUTED`.

## 14. G2-11 boundary

G2-10 and PSRRE-STUDY1 remain closed without an eligible frozen strategic representation, and G2-11 remains `NOT-AUTHORIZED`.

Nothing in SSGTGE-STUDY1 may be interpreted as strategic-regime, regime-persistence, bottleneck, recurrence, strategic-state representation, or long-horizon transition evidence.

## 15. No-rescue rule

After fresh depth 10 outcome generation, no estimator-family addition, refit, parameter optimization, fitting-window change, uncertainty recalibration, threshold relaxation, favorable-depth selection, representation reduction, or resource-cap increase is allowed within this Study.
