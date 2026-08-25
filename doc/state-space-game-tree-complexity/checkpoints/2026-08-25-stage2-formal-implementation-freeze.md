# SSGTC-STUDY1 — Stage 2 Formal Implementation Freeze

Date: 2026-08-25
Status: frozen before inspection of any canonical Stage 2 formal outcome

## Frozen formal specification

```text
stageId = SSGTC-S2-FORMAL-2026-08-25-v1
STAGE_2_FORMAL_SPEC.json git blob = 4fc8108c994899b8bbd001619abdee4f31483789
```

The formal target is the RAW-ONLY reachable graph through minimum BFS depth 8, obtained by complete expansion of parent depths 0 through 7 from a freshly regenerated standard initial state, plus the non-deduplicated game tree through path depth 8.

## Frozen executable identities

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
ssgtc-representation-production.js = 1fe04755aca49e355f3947dec8b3d1e131118327
ssgtc-representation-independent.js = f4a770bc18c8da049102b981324e0361f2e924db
run-ssgtc-stage2-formal.js = 67cbd36b2c2f44ff83d27a20e7b56aea131e90d3
verify-ssgtc-stage2-independent.js = 9901f0678d27cdf43b6dfe0ed726411c4339b3eb
ssgtc-stage2-formal.yml = 978142deb45c771f13f300eee5a1f5ed1ffff109
```

Code-bearing commit before this checkpoint:

```text
cd89134c98832d45f3f37c79fa4c2178918f6ea0
```

## Formal evidence firewall

- Stage 0 rows are not reusable.
- Stage 1 rows/artifacts are not reusable and are not read by the formal runner.
- The logical initial Bao state is freshly regenerated from `engine.initialState()` in the Stage 2 namespace.
- No symmetry/canonicalization is authorized.
- No estimator is authorized.
- Resource-censored enumeration may not be relabeled as an estimate.
- Upstream study decisions remain immutable.

Only a workflow run whose PR merge ref contains this checkpoint (or an outcome-blind documentation-only descendant that leaves every executable/spec identity above unchanged) may be accepted as canonical Stage 2 formal evidence. Any run triggered before this checkpoint is non-canonical regardless of outcome.
