# PBAI-P1 Candidate Register

Status: **PBAI-C002-v1 HOLD / PBAI-C004-v1 HOLD / no candidate currently authorized for development**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
C002 contract = candidates/PBAI-C002-v1.json
C002 result = candidates/PBAI-C002-v1-development-result.json
C004 support spec = candidates/PBAI-C004-v1-predevelopment-support-spec.json
C004 support result = candidates/PBAI-C004-v1-predevelopment-support-result.json
C004 contract = candidates/PBAI-C004-v1.json
C004 result = candidates/PBAI-C004-v1-development-result.json
```

Candidate status vocabulary:

```text
PROPOSED
EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT
DEVELOPMENT-ONLY
VALIDATION-READY
RELEASE-CANDIDATE
ADOPTED
REJECTED
HOLD
WITHDRAWN
```

## Current candidate states

| ID | Candidate family | Research Generation 1 basis | Current status | Key boundary |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | bounded phase/search dependence; confirmed `MTAJI-M1/MTAJI-M2` morphology | `EVIDENCE-AUDIT-READY` | a future exact engineering mechanism must be prospectively frozen before development |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | v1 target support 5 < frozen minimum 48; PR #55 closed without merge; no same-version rescue |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; strict RAW key including `pending`; zero false hits and fallback required |
| `PBAI-C004` | Search-instability-aware root ordering | reproducible exact D2/D3 search measurement; Position Complexity Study formal `INCONCLUSIVE` | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | v1 passed support/safety but failed frozen median-node benefit gate; PR #58 closed without merge; no same-version rescue |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; score is not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping; decision behavior changes require separate prospective authorization |

## PBAI-C002-v1 closure

```text
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible C002 targets = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
```

This engineering result does not change `TM-S2-C03 = CONFIRMED` and does not establish that C03 is ineffective.

## PBAI-C004-v1 predevelopment support

Before implementation, the development source block and support rule were frozen. Baseline-only measurement produced:

```text
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
population = 128 Namua + 128 Mtaji = 256
exact D2/D3 TopSet-disjoint primary roots = 54
minimum estimable = 48
boundary overlap-but-canonical-best-changed = 5
stable-best negative-control support = 197
candidate code used = false
candidate benefit metrics observed = false
```

Support therefore passed. This did not change Position Complexity / Difficulty Study 1 from formal `INCONCLUSIVE`.

Canonical predevelopment provenance:

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
artifact ZIP SHA-256 = 5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e
```

## PBAI-C004-v1 mechanism tested

```text
feature flag = pbaiC004D23RootTtFirst
public default = false
public source surface = public/ai.js only
mechanism = enhanced-alpha-beta root TT-best-first ordering after completed D2→D3 selected-best change
internal nodes = baseline ordering
extra depth/time = prohibited
evaluator/quiescence changes = prohibited
persistent table/cache = prohibited
forced move = prohibited
```

The implementation was isolated on PR #58 and never merged to main.

## PBAI-C004-v1 development result

Premetric safety passed before D4 benefit measurement:

```text
54 primary trigger coverage = PASS
32 selected stable-best negative-control trigger=0 = PASS
D3 feature-on/off exactness = PASS
existing regressions / engine hash / source-surface / cost / holdout firewall = PASS
```

Frozen D4 primary benefit result:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
median gate = FAIL

fraction candidate nodes <= baseline = 46/54 = 0.8518518519
required >= 0.55
fraction gate = PASS
```

Safety/boundary/control results:

```text
root-score mismatches = 0
selected move outside frozen D4 TopSet = 0
catastrophic new losses = 0
primary trigger failures = 0
boundary aggregate node ratio = 1.000 <= 1.10
negative-control trigger failures = 0
negative-control exactness failures = 0
```

Descriptive pooled primary node ratio was `39869/41304 = 0.9652576`; it was not the frozen primary acceptance endpoint and cannot rescue the median-gate failure.

Canonical development provenance:

```text
run = 32918902388
job = 98028290217
artifact = 9589217604
artifact ZIP SHA-256 = f5552a1b8386cf58a585ea92cd5443f9d306d70630e1ef4afa78fd96404f4e8f
candidate branch head = 992130acdd4f58180045291bb6bc540f9bc3c0ba
PR #58 = CLOSED WITHOUT MERGE
```

Frozen decision:

```text
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
validation = NOT EXECUTED
release holdout = NOT EXECUTED
public adoption = NOT AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

This is a candidate-specific engineering result, not a revision of the underlying scientific study. It also does not establish that all search-instability-aware mechanisms are ineffective.

## No-rescue / holdout firewall

For both closed v1 candidates, same-version rescue is prohibited where the frozen contract so specified. In particular for C004-v1:

```text
mechanism/trigger/order retuning = prohibited
target/boundary redefinition = prohibited
benefit-threshold retuning = prohibited
post-outcome source-block replacement = prohibited
validation execution = not authorized
release holdout execution = not authorized
```

A materially different C004 mechanism requires a new prospective candidate/version before implementation or outcome inspection.

## Current authorization state

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
active candidate implementation = 0
isolated development implementation attempts = 2
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

The next permitted work is a fresh evidence audit and prospective exact contract for a different `EVIDENCE-AUDIT-READY` candidate. `KEEP-AI-GEN2` remains a valid program outcome.
