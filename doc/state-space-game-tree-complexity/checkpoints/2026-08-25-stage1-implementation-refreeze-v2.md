# SSGTC-STUDY1 — Stage 1 Implementation Re-freeze v2

Date: 2026-08-25
Status: frozen before inspection of any corrected Stage 1 outcome

This re-freeze follows the outcome-blind technical invalidity recorded for workflow run `32805036665`. No scientific-pattern output from that run was inspected or used.

Corrected implementation commit before this checkpoint:

```text
49963a8d3055541ea0be7a5a0ec100c3fe2890d0
```

Frozen identities:

```text
public/engine.js
  git blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c

tools/experiments/lib/ssgtc-representation-production.js
  git blob = 1fe04755aca49e355f3947dec8b3d1e131118327

tools/experiments/lib/ssgtc-representation-independent.js
  git blob = f4a770bc18c8da049102b981324e0361f2e924db

tools/experiments/run-ssgtc-stage1-exploratory.js
  git blob = b055e9d409f69c1370a760044274fd74284b9ec2

tools/experiments/verify-ssgtc-stage1-independent.js
  git blob = c3005ebc19ae3cd40060e1a12d5b7b505cd3b0a2

.github/workflows/ssgtc-stage1-exploratory.yml
  git blob = 310587a7b6e0f67b535fb0f5daab1cc95cadd9d5
```

The workflow creates an execution copy of the frozen production runner and performs exactly one textual replacement: the defective whole-source `S1-G9` regex check is replaced by a check limited to actual `require(...)` lines. The workflow asserts that the replacement occurs exactly once. No expansion, identity, resource, stopping, branching, duplicate, tree, artifact, or promotion logic is modified.

The numeric caps and Stage 2 feasibility rule remain exactly those frozen before the failed run.

Canonical corrected evidence may come only from a workflow run whose PR merge ref contains this re-freeze checkpoint (or a documentation-only descendant that leaves all executable identities above unchanged). Runs triggered before this checkpoint are non-canonical.
