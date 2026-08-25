# SSGTC-STUDY1 — Stage 0 Technical Acceptance

Date: 2026-08-25

## Decision

```text
Stage 0 decision = SSGTC-STAGE0-PASS
scientificInferenceAuthorized = false
formalScientificDecision = NOT-YET-AVAILABLE
```

All frozen mandatory gates `S0-G1` through `S0-G12` passed in GitHub Actions run `32803985808`, job `97670340045`, against PR-head code-bearing commit `819589b27c9df613cfd22b3717305f7c984cd9f0` and the frozen implementation checkpoint whose code-bearing commit is `c83a7244925480d58b6e032edb7bc373d89bb26f`.

The Actions checkout was the PR merge ref combining study branch head `819589b27c9df613cfd22b3717305f7c984cd9f0` with the unchanged study-start main baseline `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`.

## Diagnostic-only bounded graph

```text
maxDepth = 2
uniqueRawStates = 19
generatedSuccessorOccurrences = 18
duplicateEncounters = 0
multiParentStates = 0
stateSetSha256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
transitionSetSha256 = be534cbc3e99808a668483c21fca1720dc5ea5a7ac442075294f21a8542baea1
```

These values are a technical diagnostic only. They are not a Bao-wide state-space estimate, growth law, branching result, or formal scientific endpoint.

## Independent verification

The separate-process verifier passed and independently reconstructed from the materialized raw artifact:

```text
rawStateRows = 19
transitionRows = 18
reachableRows = 19
independentlyDerivedDuplicateEncounters = 0
multiParentStates = 0
maxDepth = 2
importsProductionSerializer = false
importsProductionExpander = false
reconstructsFromMaterializedRawArtifact = true
```

The independent state-set and transition-set hashes exactly matched production.

## Artifact chain

```text
Actions run = 32803985808
Actions artifact ID = 9547486255
artifact ZIP SHA-256 = d6b0970958b12dcc4f12bcacf3f38b9dc38d0af45795d19faa840597a944c00a
scientific-raw.json SHA-256 = ffb10de0dac4bb05971aa4504839b9aeedc7d7250d88f12af72c37eb175a2a17
repository-facing-reporting.json SHA-256 = 2679f28223c4b6a1e5e10e55313bfc713d3eec1060e3239b00da154b9ba67123
verification.json SHA-256 = 1184ca0d6aed12d434769581b2f6cf23b47c9d8d2a915299e70b9f33b5220631
independent-verification.json SHA-256 = 7724d84bba8f938327fe2b1d180516251e2f78f6e150cd4756d5f66760ecc091
```

The downloaded ZIP was independently SHA-256 checked after download and matched the GitHub artifact digest. The scientific raw and reporting files were re-opened and their file hashes matched the provenance values. Every raw state retained explicit `pending`, and every represented state satisfied `sum(pits)+sum(reserve)+sum(pending)=64`.

## Promotion

Stage 0 technical acceptance satisfies the first prerequisite for Stage 1. Stage 1 is not executed by this checkpoint itself. Numeric resource/stopping caps must be separately frozen before any Stage 1 exploratory outcome generation.

No symmetry or canonicalization is authorized.
