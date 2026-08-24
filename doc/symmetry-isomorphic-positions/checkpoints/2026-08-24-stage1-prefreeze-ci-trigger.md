# Stage 1 prefreeze CI verification trigger

Date: 2026-08-24  
Study: `SIP-STUDY1`  
Classification: **prefreeze technical-only / no scientific candidate outcome**

This temporary checkpoint exists only to trigger the PR-scoped Stage 1 prefreeze workflow.

Authorized operations:

- engine regression;
- Stage 0 synthetic/control regression;
- Stage 1 tooling syntax validation;
- fresh-seed root/witness materialization without applying any candidate transformation;
- source SHA-256 audit for the frozen domain, candidate contract, transform implementation, production runner, independent verifier, engine, and immutable exact oracle.

Forbidden in this PR:

- formal candidate pass/fail generation;
- fresh-corpus transition-commutation outcome inspection;
- exact-oracle symmetry outcome generation;
- canonicalization or group claims.

## Rerun note

This trigger was updated after a pre-outcome artifact-handling check. The candidate set, seed block, root selection rule, root count, graph depth, and all scientific semantics are unchanged. The rerun verifies the restored full domain/witness artifact representation that the frozen production runner and independent verifier consume.
