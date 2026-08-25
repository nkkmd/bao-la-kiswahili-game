# SSGTC-STUDY1 — Stage 1 Run 8 Technical Invalidity

Date: 2026-08-25

```text
workflowRunId = 32805259739
jobId = 97674026961
head = 54fcc723b3599791df97dc1690c1237a3cc979f8
productionExpansion = PASS
independentVerification = FAIL
classification = TECHNICALLY-INVALID / NON-CANONICAL
scientificInterpretationAuthorized = false
artifactId = 9547913909
artifactZipSha256 = 0fbe8e424fb269c6a74f00b8c51bc53380819127a29e94118199fc88011c84bd
```

## Outcome-blind failure localization

The failed artifact was inspected only through a blinded structural checker that emitted check names/pass-fail status and did not expose or summarize Stage 1 scientific-pattern values.

The following structural/integrity classes passed:

- production file hashes;
- state row hashes and independent raw-state keys;
- explicit `pending` and 64-seed conservation;
- transition row hashes, move binding, parent/child depth occurrence binding;
- unique materialized state rows;
- single root and complete reachability of materialized rows;
- minimum BFS depth reconstruction;
- duplicate-count reconstruction;
- phase / terminal / winner aggregate reconstruction;
- multi-parent / maximum in-degree / non-increasing-depth-edge reconstruction;
- full graph state-set and transition-set hashes;
- completed-domain state-set and transition-set hashes;
- repository-facing graph/tree/computation projection equality.

The only mismatching aggregate family was:

```text
fullyExpandedNonterminalStates
fullyExpandedTerminalStates
arithmeticMeanBranchingNonterminal
geometricMeanBranchingNonterminal
forcedSingleMoveProportion
captureForcedStateProportion
nonCaptureChoiceStateProportion
```

## Technical cause

The frozen protocol states that partial layers are censored and only fully completed verified depths/layers support bounded-exact layer claims and associated complete-layer summaries.

The production runner, however, accumulated branching/expanded-state counters immediately after each individual parent was successfully expanded. If a resource cap stopped expansion partway through depth `d`, those individually processed parents at the censored partial depth were included in the production branching aggregates, while the independent verifier recomputed these aggregates only from states at depths `<= lastFullyExpandedDepth`.

This is an implementation/accounting mismatch against the preregistered complete-layer interpretation, not a scientific negative/null result.

## Scientific firewall

No actual Stage 1 growth, branching, transposition, tree, phase, terminal, or complexity values from run 8 are accepted, reported, or reused. The artifact remains provenance-only.

No resource cap, depth, raw identity, duplicate definition, estimator rule, symmetry prohibition, endpoint, or Stage 2 promotion threshold is changed.

## Authorized correction

An outcome-blind correction is authorized that leaves raw graph/tree expansion and all frozen caps unchanged, but recomputes branching and expanded-state aggregate counters after expansion using only materialized parent states whose `minDepth <= lastFullyExpandedDepth` and their complete materialized outgoing transitions.

This makes production reporting conform to the already-frozen complete-layer rule and permits independent recomputation from the raw artifact.

Implementation must be re-frozen before any corrected Stage 1 outcome is inspected.
