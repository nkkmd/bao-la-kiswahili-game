# G4-10 / FDERT-STUDY1 — Stage 0 v3 hardening PASS

Date: 2026-09-28  
Stage: `FDERT-S0-HARDENING-2026-09-28-v3`  
Actions run: `36368115116 / attempt 1`  
Artifact ID: `10948735564`  
Artifact digest: `sha256:71fa8b49fa356c2ef9fcbe8e52a72d31b21bc7a90c5a1bd27ecf99e60163670a`  
Canonical result SHA-256: `bf2f6ddef1e478176b369e3ccf6ad8d52829e0923ef04d2e8a5ba1523e7166a9`  
Decision: **`STAGE0-HARDENING-PASS / NO PROTECTED DEPTH-11 EVIDENCE ACCESSED`**

## Exact shallow compatibility

The Stage 1 bounded-memory production enumerator was compared against the historical exact production enumerator at depth 2.

```text
legacy / hardened topology projection = EXACT
state JSONL bytes = EXACT
edge JSONL bytes = EXACT
hardened materialized independent verification = PASS
hardened full independent shallow recomputation = PASS
materialization mode = ROW-STREAMED-BOUNDED-MEMORY
```

The comparison used only depth-2 technical fixtures.

## Fail-closed controls

```text
UNIQUE_STATE_CAP = PASS
MOVE_EVALUATION_CAP = PASS
TREE_OCCURRENCE_CAP = PASS
ARTIFACT_BYTE_CAP = PASS
```

## Protected evidence status

```text
scientific inference = false
G4-10 depth-11 access = 0
Stage 1 execution = NOT AUTHORIZED
```

## Consequence

The bounded-memory enumerator is technically eligible for Stage 1 source freeze. This PASS does not authorize protected depth-11 execution.

Next permitted work is Stage 1 implementation, source binding, pre-access audit, and authorization review. The depth-11 holdout remains sealed until a separate one-shot authorization is durably frozen.
