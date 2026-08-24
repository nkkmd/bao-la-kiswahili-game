# EXPERIMENT_INDEX — Symmetry / Isomorphic Positions Study 1

| ID | Stage | Purpose | Scientific outcome? | Status |
| --- | --- | --- | --- | --- |
| SIP-E000 | Audit | main / rules / oracle / historical-context recovery | No | complete |
| SIP-E001 | Stage 0 | synthetic transform + positive/negative control tests | No | complete / PASS |
| SIP-E002 | Stage 0 | fresh outcome-blind technical graph-size benchmark | No | complete / v2 frozen |
| SIP-E003 | Stage 0→1 | candidate/domain/source-hash freeze and authorization | No | complete |
| SIP-E101 | Stage 1 | immutable prior exact-oracle transformed-graph validation | Yes | complete / anchor not estimable |
| SIP-E102 | Stage 1 | fresh Namua bounded-local graph validation | Yes | complete / 0 mismatches |
| SIP-E103 | Stage 1 | fresh Mtaji / Mtaji-houseless bounded-local graph validation | Yes | complete / 0 mismatches |
| SIP-E104 | Stage 1 | independent full verification / G12 | Yes | complete / FAIL; 5 `NON-ESTIMABLE` |
| SIP-E106 | Diagnostic | post-outcome read-only oracle state-row identity audit | No; cannot change decision | complete |
| SIP-E105 | Conditional | composition/group and canonicalization contract | Derived only | not authorized; 0 formally validated transforms |
| SIP-E199 | Closeout | immutable result archival and study integration | No new outcome | complete |

## Formal Stage 1 summary

```text
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED                  = 0
NON-ESTIMABLE                  = 5
```

All five fresh scientific scopes had zero exact mismatches. They were not promoted because the mandatory immutable 8-state oracle anchor failed the identity positive control and production/independent oracle accounting failed G12 equality.

## Closure provenance clarification

The executed v1 candidate-decision path is recorded in `results/STAGE_1_V1_INVALIDATION.json` as `TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION`. Fresh zero-mismatch and control counts from v1 are diagnostic only. A corrected v2 runner draft existed, but no v2 formal spec, authorization, independent verifier, or result was created; v2 was not authorized or executed. The Study-level final state remains 0 validated / 0 rejected / 5 `NON-ESTIMABLE`.
