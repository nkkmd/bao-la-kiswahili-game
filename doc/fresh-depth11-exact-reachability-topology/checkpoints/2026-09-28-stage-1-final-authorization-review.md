# G4-10 / FDERT-STUDY1 — Stage 1 final authorization review

Date: 2026-09-28  
Stage: `FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1`  
Decision: **`AUTHORIZED / EXACTLY ONE PROTECTED DEPTH-11 SCIENTIFIC EXECUTION`**

## 1. Pre-access state

```text
G4-09 = CLOSED / MAIN INTEGRATED
G4-10 authorization review = PASS
Stage 0 v2 = PASS
Stage 0 v3 bounded-memory hardening = PASS
Stage 1 pre-access audit = PASS
Stage 1 source freeze = PASS
protected depth-11 access before this release = 0
scientific inference before this release = 0
depth 12 access = NOT AUTHORIZED
same-evidence rerun = NOT AUTHORIZED
```

## 2. Protected domain released

The release is limited to one complete exact attempt from the standard initial RAW root through depth 11.

```text
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 11
complete layers required for exact = 0..11
complete parent expansion required for exact = 0..10
representation = RAW-ONLY
validated transform set = []
symmetry reduction = false
canonicalization collapse = false
```

## 3. Formal endpoint freeze

```text
E0 = complete exact RAW reachability domain through depth 11
T1 = newRawStateCount[11] == uniqueRawStateCount[11]
T2 = treeNodeOccurrences[11] > uniqueRawStateCount[11]
T3 = cumulative tree/RAW ratio through 11 > through 10, evaluated by exact cross-products
T4 = duplicateArrivalCount[11] > 0 AND statesWithMultiplePredecessors[11] > 0
```

If exact completion and independent agreement hold, each T1..T4 is independently classified as `DEEPER-CONFIRMED` or `COUNTEREXAMPLE-BOUNDARY`.

## 4. Historical prefix integrity

G3-11 canonical depth-10 result is used only as a historical integrity reference.

```text
canonical result Git blob = 59375ab4af1a0e29d167e07e507339bd903fb0ff
historical formal decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
G3-11 redecision = false
```

For an exact G4-10 classification, the freshly reconstructed G4-10 layers 0..10 and parent layers 0..9 must match the frozen historical exact prefix under the preregistered projection.

## 5. Resource ceiling

```text
max cumulative distinct RAW states = 2000000
max depth-labelled edges = 12000000
max parent expansions = 2000000
max move evaluations = 12000000
max cumulative tree-node occurrences = 50000000000
max resident set bytes = 12884901888
max wall-clock seconds per enumerator = 7200
max uncompressed production artifact bytes = 2147483648
max Node old-space MiB = 10240
```

The limits are administrative/engineering ceilings, not expected depth-11 values.

## 6. Source freeze

Source-freeze audit:

```text
Actions run = 36368720452 / attempt 1
artifact ID = 10947829797
artifact digest = sha256:08923d42d2213e2ff6095fb804cfba4f32d72a9a9c930c9abe5ca0c1825e4079
source-freeze artifact file SHA-256 = be946138e85d923cfb6fcbc348775a19ccb2916ec9ac53ddde82163eeeefbc16
observed Node = v22.23.2
runner = Linux / X64
```

The authorization artifact binds all executable scientific sources by Git blob SHA and the Stage 1 spec / Stage 0 result by SHA-256.

## 7. Durable lease requirement

The scientific workflow must, before any protected computation:

1. verify source binding;
2. verify this is run attempt 1;
3. verify no prior `STAGE_1_CONSUMED.json` exists;
4. materialize and upload the pre-computation lease;
5. commit `STAGE_1_CONSUMED.json` to the research branch;
6. only after the durable marker exists, enter the production job.

A failed scientific run does not restore authorization. There is no same-Study rerun.

## 8. Independent verification requirement

Exact classification requires materially separate full independent depth-11 re-enumeration.

The independent verifier does not import `fdert-production.js` or `drsse-production.js`. It shares only the frozen Bao rule engine and independently reconstructs RAW identity, transitions, state/edge summaries, tree propagation, arrival/predecessor topology, cumulative topology and T1..T4.

Production-only completion cannot become exact.

## 9. Decision rule

```text
complete production + final resource PASS
+ historical 0..10 prefix integrity PASS
+ production artifact file hash PASS
+ full independent depth-11 exact agreement PASS
+ independent resource PASS
    => EXACT-WITHIN-FROZEN-DEPTH-11-DOMAIN

frozen resource/admin ceiling prevents completion
+ independently verified claimed-complete prefix integrity
    => NON-ESTIMABLE

source/integrity/serialization/artifact/independent verification defect
    => TECHNICAL-INVALID
```

Partial results are diagnostic only.

## 10. No-rescue after release

After the authorization file is pushed and the one-shot lease is consumed, the same Study/version may not receive:

- resource increase;
- timeout extension;
- alternate runner rescue;
- target-depth change;
- depth-12 extension;
- endpoint change;
- favorable subset claim;
- symmetry/canonicalization rescue;
- production-only exact promotion;
- independent requirement relaxation;
- root replacement;
- same-evidence rerun/repair.

## 11. Authorization conclusion

All pre-access gates have passed without depth-11 evidence exposure. The protected evidence may now be released exactly once under the frozen contract.

**`FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1 = AUTHORIZED FOR ONE SCIENTIFIC EXECUTION`**

This authorization does not authorize `main` integration or any public AI change.
