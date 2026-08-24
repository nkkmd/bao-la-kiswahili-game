# Stage 0 CI verification trigger

Date: 2026-08-24  
Study: `SIP-STUDY1`  
Classification: **technical-only / no scientific candidate outcome**

This checkpoint exists only to trigger the PR-scoped Stage 0 verification workflow after candidate semantics were already frozen.

The workflow is authorized to run:

- engine regression tests;
- synthetic identity/inverse/control fixtures;
- outcome-blind technical graph-size benchmarking using the Stage 0 technical seed block;
- the v2 technical extension that adds the already prospectively declared `mtaji-houseless` structural stratum.

It is **not** authorized to compute or inspect fresh formal reachable-corpus candidate symmetry pass/fail outcomes, exact-oracle symmetry outcomes, Stage 1 decisions, or canonicalization results.

The v2 execution is a technical sizing extension only; no candidate mapping, applicability predicate, formal seed, or scientific endpoint was changed.
