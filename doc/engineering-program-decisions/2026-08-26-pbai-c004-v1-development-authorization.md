# PBAI-C004-v1 Development Authorization

Date: 2026-08-26  
Program: `PBAI-P1`

## Decision

```text
PBAI-C004-v1 exact contract = FROZEN
DEVELOPMENT AUTHORIZATION = AUTHORIZE AFTER THIS CONTRACT-FREEZE CHANGE IS MERGED
validation = NOT YET AUTHORIZED
release holdout = NOT AUTHORIZED
public adoption = NOT AUTHORIZED
AI-GEN3 = RESERVED / NOT AUTHORIZED
```

## Basis

The prior candidate `PBAI-C002-v1` remains `NON-ESTIMABLE / HOLD`; its isolated implementation PR #55 was closed without merge. No C002 rescue or reinterpretation is performed.

Before any C004 implementation, a baseline-only support probe was frozen and executed on the already frozen PBAI-C decision-quality development block:

```text
seeds = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
exact D2/D3 TopSet-disjoint roots = 54
minimum estimable = 48
support gate = PASS
candidate code used = false
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
```

Canonical probe provenance:

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
artifact ZIP SHA-256 = 5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
```

## Exact authorized mechanism

```text
candidate = PBAI-C004-v1
feature flag = pbaiC004D23RootTtFirst
public default = false
public source surface = public/ai.js only
```

Within enhanced alpha-beta iterative deepening, after both D2 and D3 complete without timeout in one `analyzeMove` call, the candidate activates iff the deterministic selected root move key differs between D2 and D3. For subsequent depths >=4 in that same call only, the current root TT preferred move receives TT-first priority. Internal nodes remain baseline.

Not authorized:

```text
runtime exact TopSet computation
scientific difficulty/complexity classifier use
extra search depth
extra time budget
evaluation changes
quiescence changes
persistent cache/table
forced move
engine/config/worker/UI changes
```

This is a new engineering hypothesis inspired by a reproducible search measurement. Position Complexity / Difficulty Study 1 remains formally `INCONCLUSIVE`; engineering success cannot change that scientific decision.

## Prospective development gates

Primary target roots are exact D2/D3 TopSet-disjoint roots. The development population already contains 54 such roots.

Fixed-depth D4 feature-on/off must satisfy:

```text
median nodes(on/off) <= 0.95
fraction roots candidate nodes <= baseline nodes >= 0.55
feature-on trigger >= 1 on every primary target
root-score mismatches = 0
candidate selected move outside frozen D4 top set = 0
catastrophic new losses = 0
```

The runtime signal is broader than exact TopSet-disjointness. The development probe observed 5 roots where exact TopSets overlap but deterministic canonical best changes. These are a prospectively separate boundary-trigger stratum; they are not added to the primary benefit inference. On this stratum:

```text
semantic safety gates remain exact
aggregate node ratio candidate/baseline <= 1.10
no benefit claim is made
```

Negative controls are roots whose deterministic canonical best is unchanged from exact D2 to D3. Feature-on must not trigger and must be exactly feature-off equivalent on the frozen counters.

## No-rescue / firewall

```text
mechanism versions under PBAI-C004-v1 = 1
post-outcome trigger retuning = prohibited
post-outcome ordering retuning = prohibited
post-outcome target/boundary redefinition = prohibited
post-outcome benefit-threshold retuning = prohibited
validation may not tune implementation
release holdout execution = NOT AUTHORIZED
```

If development benefit or semantic safety fails, the valid result is `HOLD/REJECT` and the public AI remains `AI-GEN2`.
