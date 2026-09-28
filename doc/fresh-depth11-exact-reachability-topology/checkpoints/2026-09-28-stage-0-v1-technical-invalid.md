# G4-10 / FDERT-STUDY1 — Stage 0 v1 technical-invalid closure

Date: 2026-09-28  
Stage: `FDERT-S0-TECHNICAL-2026-09-28-v1`  
Actions run: `36367142313 / attempt 1`  
Artifact ID: `10947534159`  
Artifact digest: `sha256:ca99758aa62a2959ecb872d7a92432be1874a786c58de326d8167eff51b16aba`  
Result SHA-256: `050c683e149b88dfca867e4998b88255d1c33d9685463e8e15c42777ebcc4634`  
Decision: **`STAGE0-TECHNICAL-INVALID / NO PROTECTED EVIDENCE CONSUMED`**

## Outcome

Stage 0 v1 technical runner produced a fail-closed result and the workflow correctly returned failure after preserving the artifact.

Canonical result:

```text
stageDisposition = STAGE0-TECHNICAL-INVALID
scientificInferencePerformed = false
protectedDepth11Access = false
stage1ExecutionAuthorized = false
message = Stage 0 runner contains forbidden depth-11 real computation
```

## Root cause

The failure is a technical self-check false positive, not a scientific or engine result.

The runner checked its own source with logic equivalent to:

```text
runnerSource.includes("targetDepth: 11")
```

The literal search string itself appears in that self-check statement, so the runner necessarily matched its own guard text and rejected the run.

This does not indicate that a depth-11 computation occurred. The executed real fixture was limited to depth 2, and the preserved result explicitly records:

```text
protectedDepth11Access = false
scientificInferencePerformed = false
```

## Protected-evidence disposition

```text
complete depth-11 enumeration = 0
depth-11 partial enumeration = 0
depth-11 count probe = 0
depth-11 RSS probe = 0
Stage 1 scientific execution = 0
```

Stage 0 v1 consumed no protected G4-10 scientific evidence.

## No rerun of v1

The frozen v1 rerun rule is honored. `FDERT-S0-TECHNICAL-2026-09-28-v1` will not be rerun.

A correction requires a new versioned technical stage with a new spec, runner identity, source binding, pre-execution audit, and one-shot authorization.

## Corrective direction

Stage 0 v2 should remove the self-referential source-string scan and replace it with a structurally safe boundary check. The strongest practical boundary remains:

- only explicit real calls to `enumerateExactDepth` with `targetDepth: 2`;
- spec and authorization both freeze maximum real fixture depth at 2;
- no Stage 1 runner or depth-11 authorization exists in the Stage 0 execution path;
- result must continue to record `protectedDepth11Access=false`.

Stage 1 remains not authorized.
