# SSGTC-STUDY1 — Stage 1 Implementation Re-freeze v3

Date: 2026-08-25
Status: frozen before inspection of any v3 Stage 1 outcome

This re-freeze follows two outcome-blind technical-invalid runs caused solely by G9 self-inspection. No scientific-pattern output from either run was inspected or reused.

Corrected implementation commit before this checkpoint:

```text
17712a466b9d1a122ea0f01c0ff7cd87fa46b641
```

Frozen executable identities:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
ssgtc-representation-production.js = 1fe04755aca49e355f3947dec8b3d1e131118327
ssgtc-representation-independent.js = f4a770bc18c8da049102b981324e0361f2e924db
run-ssgtc-stage1-exploratory.js = b055e9d409f69c1370a760044274fd74284b9ec2
verify-ssgtc-stage1-independent.js = c3005ebc19ae3cd40060e1a12d5b7b505cd3b0a2
ssgtc-stage1-exploratory.yml = 30cf8516b95c0c77081b8e60976c13f5fee2439e
```

The only v3 correction remains the G9 execution-copy line: source inspection is restricted to lines syntactically matching top-level CommonJS import declarations (`const ... = require(...)`). This prevents the G9 check from admitting its own source line.

No resource cap, graph/tree expansion algorithm, state identity field, seed invariant, duplicate definition, artifact contract, endpoint, interpretation boundary, or Stage 2 promotion threshold changed.

Only a workflow run whose PR merge ref contains this checkpoint (or a documentation-only descendant with all executable identities unchanged) may be accepted as canonical v3 Stage 1 exploratory evidence.
