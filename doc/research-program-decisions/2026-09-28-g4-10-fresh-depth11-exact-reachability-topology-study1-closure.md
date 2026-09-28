# 2026-09-28 — G4-10 / FDERT-STUDY1 closure

## Decision

**`CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP`**

Research Generation 4 `G4-10` / `FDERT-STUDY1` is formally closed.

## Scientific execution

```text
Stage = FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1
Actions run = 36368880428 / attempt 1
trigger SHA = 787105a3016bac1172e669faf400fcc7cdd70dd5
scientific executions authorized = 1
scientific executions actual = 1
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
stop reason = UNIQUE_STATE_CAP
```

The one-shot authorization was durably leased and consumed before protected computation. No scientific rerun remains authorized.

## Formal result

The production enumerator reconstructed a complete depth-0..10 prefix, then reached the prospectively frozen cumulative RAW-state ceiling while building depth 11.

```text
frozen max cumulative distinct RAW states = 2000000
formal decision = NON-ESTIMABLE
T1 = NON-ESTIMABLE
T2 = NON-ESTIMABLE
T3 = NON-ESTIMABLE
T4 = NON-ESTIMABLE
```

No partial depth-11 topology is promoted to a formal result.

## Integrity

The complete G4-10 depth-0..10 prefix exactly matched the historical G3-11 canonical exact prefix under the preregistered projection.

```text
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
production materialized-file verification = PASS
independent complete-prefix verification = PASS
integrityPassed = true
```

Complete prefix values:

```text
cumulative RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
tree-edge occurrences through parent depth 9 = 631100
```

These values are integrity confirmation of the already-known complete depth-10 prefix, not new depth-11 scientific claims.

## Canonical provenance

```text
formal-result file SHA-256 = 7be828231d25ad0e9ee0a698992c3ccb726768b6329a6ad935548d4a46c72e1d
scientific-result core SHA-256 = a9649b654ae315fe7d234ccc5511252db6154e84d146bd9444185e9441f52484
production-result core SHA-256 = 81915a36f5350ae5559f5e82dbde8248776e628a5e54862b4accfe21054341b5
independent core SHA-256 = 2e913c8458037db33de0083981bf4442316bb28d7bf7dc4d05419b8e4a0057d5
lease artifact = 10948226759
production artifact = 10949100069
compact artifact = 10948857115
```

Repository canonical summary:

- `doc/fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json`

## No-rescue closure

After this closure, the same Study/version may not be repaired or rescued by:

- increasing any resource ceiling;
- extending wall-clock time;
- moving to a larger runner/local machine;
- reusing the same protected evidence;
- changing the endpoint family;
- adding depth 12;
- using symmetry/canonicalization to reduce states;
- promoting partial depth-11 data;
- introducing the G2-12 estimator.

Any future attempt to study complete depth 11 under a different resource envelope requires a new Study identity and fresh prospective authorization. It must not rewrite `FDERT-STUDY1`.

## Program interpretation

The result does not establish a depth-11 state count, topology, counterexample, whole-Bao size estimate, asymptotic growth law, game-theoretic value, search strength, human difficulty, or public-AI improvement.

`NON-ESTIMABLE` is a valid Research Generation 4 closure because the Program Plan explicitly permits a preregistered resource closure for authorized depth-11 work.

## Next program action

G4-01 through G4-10 now have formal closures on the research branch. The next work is Research Generation 4 final synthesis, current-facing document synchronization, Japanese documentation quality audit, and pre-main consistency audit.

This closure does **not** authorize `main` integration or public AI changes.
