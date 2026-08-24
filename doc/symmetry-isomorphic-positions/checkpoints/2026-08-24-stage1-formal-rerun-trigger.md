# Stage 1 formal deterministic rerun trigger

Date: 2026-08-24  
Study: `SIP-STUDY1`  
Stage: `SIP-S1-FORMAL-2026-08-24-v1`

This temporary PR trigger changes no scientific source bound by the frozen Stage 1 spec. It exists because concurrent technical Stage 0 automation advanced the research branch after authorization, making the original push-run materialization route unsuitable for deterministic artifact retrieval.

The existing authorization remains in force. This rerun must:

- re-materialize and hash-check the frozen domain before candidate outcome generation;
- require every source SHA-256 bound in the frozen formal spec;
- run the unchanged production candidate validator;
- run the unchanged independent verifier;
- upload the exact resulting artifacts for inspection.

No candidate, applicability predicate, seed, root selection, depth, gate, decision rule, or no-rescue boundary is changed.

## Diagnostic preservation rerun

The first traceable PR run showed zero fresh-domain mismatches but failure of the exact-oracle identity positive control and production/independent oracle-count disagreement. This rerun changes only workflow error handling so both unchanged frozen result JSON files are uploaded even when G12 fails. The scientific runner and verifier remain the exact SHA-256-bound versions in the frozen spec.
