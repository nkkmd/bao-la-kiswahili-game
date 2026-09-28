# G4-10 / FDERT-STUDY1 — Stage 1 pre-access audit PASS

Date: 2026-09-28  
Stage: `FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1`  
Actions run: `36368568435 / attempt 1`  
Artifact ID: `10948935347`  
Artifact digest: `sha256:f2aa43e9e4b45e408ef5fd0685ca8d57a0391622ba5b209cdab24a51f0ead30e`  
Canonical audit result SHA-256: `1816bd171c65102b096de0305d928983bec5d06961fa41ee7d448eb55c2efefe`  
Decision: **`PASS / PROTECTED DEPTH-11 STILL SEALED`**

## Gates passed

```text
Stage 0 v2 technical = PASS
Stage 0 v3 bounded-memory hardening = PASS
current engine standard-root identity = PASS
historical G3-11 prefix-reference blob integrity = PASS
production / independent source separation = PASS
Stage 1 resource ceiling freeze = PASS
T1..T4 synthetic target logic = PASS
JavaScript syntax checks = PASS
```

## Protected evidence state

```text
protected depth-11 access = 0
scientific inference = false
Stage 1 scientific execution = NOT YET AUTHORIZED
depth 12 = NOT AUTHORIZED
same-evidence rerun = NOT AUTHORIZED
```

## Next gate

The next permissible action is a final source-binding audit and creation of exactly one `RELEASE-TO-PROTECTED-DEPTH11-EVIDENCE` authorization artifact.

That release must bind the exact Stage 1 spec, workflow, production runner, independent verifier, technical libraries, current engine, Stage 0 v3 result, pre-access result, and historical G3-11 canonical prefix reference. The workflow must acquire and durably record a one-shot lease before any depth-11 scientific computation starts.
