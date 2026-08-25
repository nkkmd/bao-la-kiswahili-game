# SSGTC-STUDY1 — Results Directory

This directory contains compact repository-facing result records for State Space / Game Tree Complexity Study 1. Repository-facing records are verified projections and provenance indexes; they are not substitutes for authoritative raw engine state identity.

## Result records

### `STAGE_0_TECHNICAL_RESULT.json`

Technical-only representation/enumeration validation.

```text
decision = SSGTC-STAGE0-PASS
scientificInferenceAuthorized = false
maxDepth = 2
uniqueRawStates = 19
transitionOccurrences = 18
```

These counts are diagnostic only and are not scientific evidence about Bao-wide complexity.

### `STAGE_1_EXPLORATORY_RESULT.json`

Accepted exploratory-only characterization.

```text
resultClass = EXPLORATORY-ONLY
technicalAcceptance = PASS
scientificInferenceAuthorized = false
formalReuseInStage2 = false
graph stopReason = FRONTIER_CAP
lastFullyExpandedDepth = 7
lastFullyDiscoveredDepth = 8
```

Partial depth-9 rows are censored/observed only. The completed verified depth-8 graph/tree domain supported only the preregistered Stage 2 feasibility decision; Stage 1 rows were not reused as formal evidence.

### `STAGE_2_FORMAL_RESULT.json`

Canonical formal result.

```text
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
reachableRawStatesThroughDepth8 = 24848
graphTransitionOccurrencesParentDepth0Through7 = 25648
gameTreeNodeOccurrencesThroughDepth8 = 30941
gameTreeEdgeOccurrencesThroughDepth8 = 30940
independentVerification = PASS
```

Canonical set hashes:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

## Claim classes

Committed results explicitly distinguish:

- technical diagnostic only;
- exploratory observed/censored quantities;
- exact within a frozen bounded domain;
- estimated quantities under a separately frozen estimator protocol;
- non-estimable or technically invalid outcomes.

No estimator was authorized or used in Study 1.

The Stage 2 exact result applies only to the prospectively frozen standard-root depth-8 RAW-ONLY domain. It does not authorize a full Bao state-space count, full game-tree count, symmetry-reduced count, or canonicalization claim.