# SSGTC-STUDY1 — Stage 1 Implementation Re-freeze v4

Date: 2026-08-25
Status: frozen before inspection of any v4 Stage 1 outcome

This re-freeze follows run 8 technical invalidity. No scientific-pattern values from run 8 were accepted, reported, or reused.

Corrected implementation commit before this checkpoint:

```text
c69e73839492d0e26b7a3d5e1ab01753b7cd8767
```

Frozen executable identities:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
ssgtc-representation-production.js = 1fe04755aca49e355f3947dec8b3d1e131118327
ssgtc-representation-independent.js = f4a770bc18c8da049102b981324e0361f2e924db
run-ssgtc-stage1-exploratory.js = b055e9d409f69c1370a760044274fd74284b9ec2
verify-ssgtc-stage1-independent.js = c3005ebc19ae3cd40060e1a12d5b7b505cd3b0a2
ssgtc-stage1-exploratory.yml = 09889f14b56cc3e59196a56033928333895d2fcc
```

The workflow creates an execution copy from the frozen production runner and applies exactly two outcome-blind technical corrections:

1. G9 source inspection is restricted to syntactic top-level CommonJS import declarations so the gate cannot inspect its own regex source.
2. After raw graph expansion stops, branching/expanded-state aggregate counters are reset and recomputed from materialized states/transitions restricted to parent depths `<= lastFullyExpandedDepth`. This excludes any individually processed parents in a censored partial depth and implements the already-frozen complete-layer rule.

The second correction changes reporting aggregation only. It does not change which raw states or transitions are generated, the BFS order, tree expansion, any resource cap, stopping rule, state identity, duplicate definition, artifact row, estimator rule, symmetry prohibition, or Stage 2 promotion threshold.

Only a workflow run whose PR merge ref contains this v4 checkpoint (or a documentation-only descendant with all executable identities unchanged) may be accepted as canonical Stage 1 exploratory evidence. Runs triggered before this checkpoint are non-canonical.
