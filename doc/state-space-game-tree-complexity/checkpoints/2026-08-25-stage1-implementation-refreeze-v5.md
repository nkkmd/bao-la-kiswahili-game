# SSGTC-STUDY1 — Stage 1 Implementation Re-freeze v5

Date: 2026-08-25
Status: frozen before inspection of any v5 Stage 1 outcome

The v4 workflow file was syntactically invalid YAML because the multiline Python replacement text was not indented inside the YAML block scalar. Consequently no Stage 1 execution was generated from the v4 checkpoint; there is no v4 scientific outcome to inspect or preserve.

Corrected implementation commit before this checkpoint:

```text
89dd70035ad581bb94dd14d3af3f6e4228a965df
```

Frozen executable identities:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
ssgtc-representation-production.js = 1fe04755aca49e355f3947dec8b3d1e131118327
ssgtc-representation-independent.js = f4a770bc18c8da049102b981324e0361f2e924db
run-ssgtc-stage1-exploratory.js = b055e9d409f69c1370a760044274fd74284b9ec2
verify-ssgtc-stage1-independent.js = c3005ebc19ae3cd40060e1a12d5b7b505cd3b0a2
ssgtc-stage1-exploratory.yml = d3d0e969688c28f1598303e6e0c23e7d0cba40d7
```

The workflow still applies only the two previously authorized outcome-blind execution-copy corrections: G9 import-line self-check hardening and completed-layer-only branching aggregation. The v5 change only repairs YAML/block-scalar construction of that already-authorized patch.

No resource cap, raw expansion, tree expansion, identity field, duplicate rule, scientific endpoint, estimator rule, interpretation boundary, or Stage 2 promotion threshold changed.

Only a workflow run whose PR merge ref contains this v5 checkpoint (or a documentation-only descendant with all executable identities unchanged) may be accepted as canonical Stage 1 exploratory evidence.
