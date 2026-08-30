# SSGTGE-STUDY1 — Reproducibility Index

## Canonical identity

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Branch = research/g2-12-state-space-game-tree-growth-estimation
```

## Prospective authorities

- `preregistration/STUDY_START_FREEZE.md` — human-readable scientific contract frozen before fresh holdout outcome generation.
- `preregistration/STUDY_START_SPEC.json` — machine-readable equivalent.
- `authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json` — technical-only authorization; explicitly excludes fresh depth 10/11 scientific generation.
- `checkpoints/2026-08-30-study-start-freeze.md` — startup checkpoint.

## Upstream immutable evidence

Primary development anchor:

- `../deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json`
- `../deep-raw-state-space-enumeration/STUDY_1_PROTOCOL.md`
- `../deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`

Expected immutable G2-05 values:

```text
formalDecision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
rootRawStateKey = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
lastCompleteDepth = 9
cumulativeRawStates = 102857
treeNodeOccurrencesThrough9 = 136645
```

G1 `SSGTC-STUDY1` may be used only as a consistency/reference fixture, not as independent formal validation evidence.

## Planned Stage 0 reproducibility

Stage 0 will record production and independent source hashes, synthetic technical fixtures, estimator deterministic fixtures, metric fixtures, corruption/negative controls, resource-counter fixtures, and packaging hashes.

## Planned Stage 1 reproducibility

Stage 1 will materialize:

- exact development input summary/hash;
- all candidate rolling-origin predictions;
- all 8-cell error vectors per candidate;
- eligibility flags;
- deterministic winner selection;
- selected estimator parameters;
- `q`, `R1`, `R2`;
- frozen depth 10/11 point predictions and envelopes;
- production and independent recomputation hashes.

## Planned Stage 2 reproducibility

Before formal authorization, Stage 2 must bind exact source/blob hashes and the complete Stage 1 frozen estimator artifact.

Formal execution must preserve:

- fresh enumeration layer summaries;
- materialized state/edge hashes or deterministic equivalent audit hashes;
- production result core;
- independent full recomputation core;
- resource usage and stop classification;
- frozen estimator application;
- formal endpoint metrics;
- final decision mapping;
- workflow/artifact provenance where applicable.

No formal scientific decision is valid without mandatory independent verification.
