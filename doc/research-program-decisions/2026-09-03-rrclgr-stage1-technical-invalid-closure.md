# RRCLGR-STUDY1 Stage 1 Technical-Invalid Closure

Updated: 2026-09-03

## Decision

**`RRCLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

`RRCLGR-S1-DEVELOPMENT-2026-09-03-v1` was authorized exactly once and executed exactly once from trigger commit `00cbdb11c3310ea7a529c320ee03273c80dc8c7f` in GitHub Actions run `33759611989`.

The workflow completed successfully as an execution container, including source-binding verification, durable pre-computation lease creation, scientific runner execution and canonical artifact upload. The scientific runner itself fail-closed before candidate-manifest completion with:

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
freshScientificSeedAccess = true
candidateManifestComplete = false
scientificSummaryAuthorized = false
stage2Eligible = false
sameEvidenceRerunAuthorized = false
protectedDepth10Access = false
```

Canonical technical error:

```text
The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Array
```

## Causal technical defect

The frozen Stage 1 candidate-selection implementation computed `candidateCoreSha256` by calling the inherited LGTGMIV `digest` function directly on an array of identity rows. The inherited `digest` is the low-level SHA-256 string function and does not canonicalize arbitrary objects before calling `crypto.update`. Passing the array therefore caused the recorded type error.

The defect occurred after first fresh Stage 1 seed access. Replacing the call with canonical serialization, repairing the implementation and rerunning the same Stage 1 seed block would be same-evidence rescue and is prohibited.

## Scientific interpretation

No candidate manifest was completed and no representation coordinate, distance, neighborhood or scientific eligibility summary was authorized from this run. The technical-invalid artifact is not positive, negative, null or non-estimable scientific evidence about the representation family.

Formal continuous-representation eligibility remains **NOT ESTABLISHED**.

## Downstream authorization

```text
RRCLGR Stage 2 = NOT-AUTHORIZED / NOT-EXECUTED
RRCLGR Stage 2 seed block = NOT CONSUMED
G3-10 = NOT AUTHORIZED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

G3-10 still requires an independently validated local-geometry coordinate representation. Any further attempt must be a new prospective independent prerequisite Study/version with a fresh scientific seed namespace and a newly frozen contract. RRCLGR Stage 1 scientific evidence, including any partially traversed fresh seeds, may not be reused as scientific evidence in that new Study. The observed type defect may be used only as technical design information.

## Canonical artifact provenance

GitHub Actions run: `33759611989`

Result artifact: `rrclgr-stage1-result-33759611989`

Artifact ZIP SHA-256: `7b8a44a9e4873731d813e68b51755be39495980588564da8d4a504afad3c9b78`

`STAGE_1_DEVELOPMENT_RESULT.json`:

- bytes: `523`
- SHA-256: `c9d3d3d3f987a88a90a27f6c0c118e15e584e778ad3234eafb5ab36130dcebd0`
- repository Git blob: `5a1c7949578dae70e1299b849ec4957030c0a85f`

The repository mirror was created from the downloaded artifact bytes without scientific recomputation.
