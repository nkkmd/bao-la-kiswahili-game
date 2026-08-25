# SSGTC-STUDY1 — Stage 1 Implementation Freeze

Date: 2026-08-25
Status: frozen before inspection of any Stage 1 exploratory outcome

Canonical candidate implementation commit before this checkpoint:

```text
64c2e8b9fbea71d6b687b50393b9ab3ffab764ed
```

Frozen file identities:

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
  git blob = 9be7e4a183a72d234c21924bf7eb126c0ed37ebf
```

The numeric resource profile remains exactly the values frozen in `2026-08-25-stage1-resource-profile-freeze.md`; this checkpoint does not alter any cap, endpoint, promotion rule, identity field, duplicate definition, or interpretation boundary.

Only a workflow run whose PR merge ref contains this frozen implementation (or an outcome-blind documentation-only descendant that leaves every file identity above unchanged) may be accepted as the canonical Stage 1 exploratory run.

Any earlier run is non-canonical even if technically successful. Any later code change to the production runner, independent verifier, serializer, engine, or Stage 1 workflow requires a new explicitly documented technical-invalidity/re-freeze decision before another Stage 1 result may be accepted. Scientific-pattern-based code changes are prohibited.
