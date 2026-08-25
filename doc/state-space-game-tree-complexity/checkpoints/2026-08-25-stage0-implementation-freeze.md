# SSGTC-STUDY1 — Stage 0 Implementation Freeze

Date: 2026-08-25  
Frozen before any accepted Stage 0 diagnostic outcome.

## Code-bearing commit

```text
stage0ImplementationCommit = c83a7244925480d58b6e032edb7bc373d89bb26f
baselineMain = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
maxDepth = 2
scientificInference = false
symmetryReduction = false
```

## Frozen Git blob identities

```text
tools/experiments/lib/ssgtc-representation-production.js
  blob = 1fe04755aca49e355f3947dec8b3d1e131118327

tools/experiments/lib/ssgtc-representation-independent.js
  blob = f4a770bc18c8da049102b981324e0361f2e924db

tools/experiments/run-ssgtc-stage0-technical.js
  blob = 34aafde8e2b9ef1b3e2ed3f08d85c65894545254

tools/experiments/verify-ssgtc-stage0-independent.js
  blob = 59182d8f49f3869939855ccb6e6c3940e7f750c6

.github/workflows/ssgtc-stage0-technical.yml
  blob = cd828b711365dedc3614f31be2f147dd13945a03
```

The authoritative engine baseline remains `public/engine.js` blob:

```text
2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
```

## Freeze rule

Any change to a frozen Stage 0 production serializer, independent serializer, runner, separate-process verifier, workflow, max depth, raw identity contract, missing-`pending` handling, or seed-conservation rule invalidates this implementation freeze and requires a new versioned pre-outcome checkpoint before execution.

No Stage 0 result generated under a different implementation identity may be presented as the result of this frozen protocol.