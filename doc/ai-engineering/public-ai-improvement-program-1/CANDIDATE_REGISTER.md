# PBAI-P1 Candidate Register

Status: **PBAI-C002-v1 HOLD / PBAI-C004-v1 EXACT CONTRACT FROZEN / DEVELOPMENT AUTHORIZED AFTER MERGE**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
C002 contract = candidates/PBAI-C002-v1.json
C002 result = candidates/PBAI-C002-v1-development-result.json
C004 support spec = candidates/PBAI-C004-v1-predevelopment-support-spec.json
C004 support result = candidates/PBAI-C004-v1-predevelopment-support-result.json
C004 contract = candidates/PBAI-C004-v1.json
```

## Current candidate states

| ID | Candidate family | Research Generation 1 basis | Current status | Key boundary |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | bounded phase/search dependence; confirmed `MTAJI-M1/MTAJI-M2` morphology | `EVIDENCE-AUDIT-READY` | later mechanism requires a new exact prospective contract |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | v1 support 5 < frozen minimum 48; PR #55 closed without merge; no same-version rescue |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; strict RAW key including `pending`; zero false hits and fallback required |
| `PBAI-C004` | Search-instability-aware root ordering | reproducible exact D2/D3 search measurement; Position Complexity Study formal `INCONCLUSIVE` | **`AUTHORIZED-FOR-DEVELOPMENT` after C004 contract merge** | new engineering hypothesis only; no scientific/human difficulty classifier; feature default off |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; score is not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping |

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

Before candidate implementation, the support rule and development source block were frozen. Baseline-only exact D2/D3 measurement then produced:

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
artifact ZIP SHA-256 = 5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
population = 128 Namua + 128 Mtaji = 256
exact D2/D3 TopSet-disjoint roots = 54
minimum estimable = 48
Namua primary support = 42
Mtaji primary support = 12
candidate code used = false
candidate benefit metrics observed = false
validation/holdout seeds accessed = false
```

Therefore the prospectively frozen support gate passed. The result is engineering estimability evidence only; Position Complexity / Difficulty Study 1 remains formally `INCONCLUSIVE`.

The probe also prospectively exposed the runtime-signal boundary:

```text
TopSets overlap but deterministic canonical best changes = 5
TopSets overlap and deterministic canonical best stays unchanged = 197
```

The first 5 are a separate boundary-trigger audit stratum, not part of primary benefit inference. Stable-best roots are negative controls.

## PBAI-C004-v1 exact mechanism

```text
feature flag = pbaiC004D23RootTtFirst
public default = false
public source surface = public/ai.js only
mechanism = enhanced-alpha-beta root move ordering only
```

Activation requires completed D2 and D3 in the same `analyzeMove` call and a change in deterministic selected root move. At depths >=4, only the root TT preferred move receives TT-first priority. Internal-node ordering remains baseline.

Explicitly prohibited:

```text
runtime exact TopSet computation
scientific difficulty/complexity classifier use
extra depth or time budget
evaluation or quiescence changes
persistent table/cache
forced move
engine/config/worker/UI changes
```

### Primary benefit gate

Primary target = exact D2/D3 TopSet-disjoint roots. Fixed-depth D4 feature-on/off comparison requires:

```text
development/validation median nodes(on/off) <= 0.95
development/validation fraction roots candidate nodes <= baseline >= 0.55
release holdout median <= 0.97 and fraction >= 0.52
root-score mismatches = 0
selected move outside frozen D4 top set = 0
catastrophic new loss = 0
feature-on trigger >= 1 per primary target
```

Boundary-trigger roots retain exact semantic safety and additionally require aggregate node ratio <= 1.10; no benefit claim is made from that stratum.

Negative controls require zero trigger and exact feature-on/off equality for selected move, root score and frozen search counters.

## No-rescue / holdout firewall

```text
PBAI-C004-v1 mechanism versions = 1
post-outcome trigger/order/target/boundary/threshold retuning = prohibited
validation cannot tune implementation
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

## Current authorization state

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = true after exact-contract merge
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 1 after merge
active candidate implementation = 0
isolated development implementation attempts = 1
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

After contract merge, the only permitted next implementation is an isolated `PBAI-C004-v1` branch from the resulting `main`. `KEEP-AI-GEN2` remains a valid program outcome.
