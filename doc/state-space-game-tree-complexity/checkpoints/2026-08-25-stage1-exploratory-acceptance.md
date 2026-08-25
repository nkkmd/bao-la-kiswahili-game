# SSGTC-STUDY1 — Stage 1 Exploratory Acceptance

Date: 2026-08-25

## Canonical run

```text
workflowRunId = 32805576462
jobId = 97674932536
head = 178c302b946543452316ec90f513a77f9ec8bc77
workflowConclusion = SUCCESS
productionExpansion = PASS
independentVerification = PASS
resultClass = EXPLORATORY-ONLY
scientificInferenceAuthorized = false
formalReuseInStage2 = false
```

The run contains the v5 implementation re-freeze and preserves all study-start RAW-ONLY / no-symmetry constraints.

## Resource/stopping outcome

The graph expansion reached the preregistered `FRONTIER_CAP` while processing depth 8. Therefore depth 8 is a censored partial **parent-expansion** layer and newly observed depth-9 rows are observed/censored only.

The graph fully expanded parent depths 0 through 7 and therefore fully discovered the reachable raw-state set through minimum BFS depth 8. The independent verifier reran exactly this completed domain from a freshly regenerated initial state and reproduced both completed-domain hashes.

The tree mode completed its frozen depth-8 target (`MAX_TREE_DEPTH`) without a partial layer.

## Completed verified bounded domain

```text
graph raw states through depth 8 = 24848
graph transition occurrences from parent depth 0..7 = 25648
completed graph stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
completed graph transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e

tree node occurrences through depth 8 = 30941
tree edge occurrences through depth 8 = 30940
```

These are exploratory bounded results, not a full-game Bao state-space count.

The broader materialized graph also contains censored partial-depth observations generated before the frontier cap. Those broader observed values are preserved in `results/STAGE_1_EXPLORATORY_RESULT.json` but cannot be described as a complete depth-9 reachable-state set.

## Integrity

Production gates `S1-G1` through `S1-G10` all passed after the outcome-blind, preregistration-conforming technical corrections documented in the invalidity/re-freeze checkpoints.

The separate verifier:

- did not import the production serializer or production runner;
- independently validated every materialized state key and 64-seed invariant;
- reconstructed duplicate/reachability/branching/transposition aggregates;
- independently reran the completed graph domain;
- independently reran the completed tree domain;
- matched completed-domain state and transition hashes;
- matched tree depth counts;
- confirmed repository-facing projection equality.

Artifact provenance:

```text
artifactId = 9548021440
artifactZipSha256 = d95f8be89984480031f6742d63d003f67c6cea8afe7b401d05adca28ee09846d
graphStatesFileSha256 = 3078a7de133ce30a36b4366151e8a22daa6b2aceda72f059c04e856038ad5626
graphTransitionsFileSha256 = 81aaeed5c049662d997ea85b53b513d69e6484c37a4596db7499a3cedb49f7a0
summaryFileSha256 = 9d8216a104a7e6a80fa2c34ffe9fc13bfb24cb9eec1afa1ed9c30913e418779d
repositoryFacingFileSha256 = 57db67af8d81b5fe1a61594878ccce5048073d3be8e50f9385d46280fa862ec5
productionVerificationFileSha256 = e39a111b75d94554de150214442b09c27f18fa78b93e68c904b6bdc0f5ebef63
independentVerificationFileSha256 = d603769a0bd07bbedfcb5ea6f8e35b90a809b53fdddb0c4696b71721a4d64a94
```

The downloaded ZIP was re-hashed after download and matched the GitHub artifact digest.

## Stage 2 promotion rule

The preregistered minimum required at least four fully expanded graph depths beyond root and at least four fully expanded tree depths beyond root with integrity passing.

Observed:

```text
graph lastFullyExpandedDepth = 7
tree lastFullyExpandedDepth = 7
all mandatory integrity verification = PASS
promotionFeasibilityMinimumMet = true
```

Therefore **Stage 2 design is permitted**. This does not itself authorize Stage 2 execution. A fresh formal specification, exact target domain, decision rule, resource caps, and independent verification contract must be frozen before formal evidence generation.
