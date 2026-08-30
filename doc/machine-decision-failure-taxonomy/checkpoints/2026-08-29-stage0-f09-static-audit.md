# MDFT-STUDY1 — Stage 0 F09 Static Historical-Classifier Audit

Date: 2026-08-29

## Scope

This is a technical-only eligibility audit for `MDFT-F09 — MORPHOLOGY_CONTEXT_MISMATCH`. It does not inspect G2-08 Stage 1/2 scientific evidence and does not modify the formal result of Position Typology / Playing Style Study 1.

## Historical source boundary

The closed Position Typology study records a frozen Mtaji classifier definition with:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

The accepted candidate-definition document states that the complete deterministic classifier specification is contained in the local artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

and that this artifact contains the exact 40-feature order, log1p field set, fitted StandardScaler parameters, two 40-dimensional centroids and raw-label-to-canonical-label mapping.

The Stage 2 confirmation analyzer likewise reads those scaler and centroid values from that external candidate artifact; it does not embed them as an alternative authoritative copy.

## Repository audit

At G2-08 initiation/source branch:

```text
branch = research/g2-08-machine-decision-failure-taxonomy
candidate artifact in repository = ABSENT
exact candidate hash embedded in code-search source = NOT FOUND
exact scaler/centroid authoritative repository copy = NOT FOUND
```

The current repository therefore does not contain enough information to reconstruct the complete frozen classifier exactly without importing an unpreserved local artifact, refitting, estimating or inventing parameters.

## Prospective disposition

Per MDFT D18 / `FAILURE_MODE_DICTIONARY.md`, no refit or replacement classifier is permitted.

```text
MDFT-F09 = TECHNICALLY-INELIGIBLE
reason = FROZEN_HISTORICAL_CLASSIFIER_NOT_EXACTLY_RECONSTRUCTIBLE_FROM_CURRENT_PRESERVED_REPOSITORY_SOURCES
replacement leaf = NOT AUTHORIZED
refit = NOT AUTHORIZED
scientific inference = NONE
```

This is a technical eligibility disposition for G2-08 only. It does **not** change:

```text
Position Typology Study 1 Mtaji formal confirmation
MTAJI-M1 / MTAJI-M2 historical ontology
any prior formal decision
```

## Binding rule

F09 must be excluded before Stage 1 scientific execution. Its absence cannot be repaired after Stage 1 outcome inspection by a new morphology classifier, recovered-but-unfrozen representation, threshold change or favorable subgroup.
