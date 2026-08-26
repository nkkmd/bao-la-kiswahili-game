# PBAI-P1 Candidate Register

Status: **PBAI-C001-v1 HOLD / PBAI-C002-v1 HOLD / PBAI-C004-v1 HOLD / no candidate authorized**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
C001 support spec = candidates/PBAI-C001-v1-predevelopment-support-spec.json
C001 support result = candidates/PBAI-C001-v1-predevelopment-support-result.json
C001 contract = candidates/PBAI-C001-v1.json
C001 result = candidates/PBAI-C001-v1-development-result.json
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
| `PBAI-C001` | Phase/search-aware root search routing | bounded phase/search dependence; E-020/H18 fixed-condition search-profile result | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | premetric PASS and strong work reduction, but 3 frozen decision-quality benefit gates failed; PR #61 closed without merge; no same-version rescue |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | v1 target support 5 < frozen minimum 48; PR #55 closed without merge; no same-version rescue |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; strict RAW key including `pending`; zero false hits and fallback required |
| `PBAI-C004` | Search-instability-aware root ordering | reproducible exact D2/D3 search measurement; Position Complexity Study formal `INCONCLUSIVE` | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | v1 passed support/safety but failed frozen median-node benefit gate; PR #58 closed without merge; no same-version rescue |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; score is not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping; decision behavior changes require separate prospective authorization |

## Closed candidate — PBAI-C001-v1

### Prospective contract

```text
feature = pbaiC001NamuaForcedCaptureLegacy
public default = off
levels = hard / expert
target = nonterminal Namua; >=2 legal variants; all variants capture
candidate action = route eligible enhanced-family root through existing legacy search branch
public candidate surface = public/ai.js only
candidate/baseline = hard / bao / D3 / Infinity
reference = independent exact-full-window D4 bao
```

Baseline-only development support passed before implementation/outcome inspection:

```text
source = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible = 108
selected target = 64
minimum estimable = 32
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
selected target refs SHA-256 = aeaccee4052ba12c86d129b53775e3589479ffeac71edf8f0ad39fac81d4d323
```

Premetric safety passed before D4 benefit inspection. Canonical premetric run `32957250041`, job `98141544109`, artifact `9602505672`, artifact digest `861735a270202e4488283dad3470ccc61ff060f4877402086b6c4b9771a8346d`.

### Binding benefit result

```text
TopSet agreement delta = +0.015625; required >= +0.05 => FAIL
mean normalized rank-loss delta = -0.011718750000000028; required <= -0.02 => FAIL
severe-loss-rate excess = +0.015625; required <= 0 => FAIL
catastrophic new loss count = 0; required 0 => PASS
median search-work ratio = 0.2772631454984396; required <= 1.50 => PASS
fraction search-work ratio >2 = 0; required <= 0.10 => PASS
```

Canonical development provenance:

```text
run = 32957738413
job = 98143061656
artifact = 9602744693
artifact ZIP SHA-256 = 82fdffb39c967e8bf02abf3080ab1651fcfa1c88f881d0028ce5af3493d45762
candidate branch head = f9767c575e512c1e0d41c2ad4dd1a7a9c302e29f
candidate public/ai.js SHA-256 = 108a57d17d0d0bf2f63e3794f386ee480116791181793ff6cde7366f7bd0a439
PR #61 = CLOSED WITHOUT MERGE
```

The efficiency improvement cannot rescue failed quality gates. The contract is conjunctive.

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
same-version mechanism/trigger/population/threshold retuning = prohibited
validation = NOT EXECUTED / NOT AUTHORIZED
release holdout = NOT EXECUTED / NOT AUTHORIZED
public adoption = NOT AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
main/public candidate implementation = 0
```

This engineering result does not alter Phase Transition Study 1 E-020/H18 (`CONFIRMED`) and does not establish a universal preference for or against legacy search.

## Closed candidate — PBAI-C002-v1

```text
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible targets = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
```

This result does not alter `TM-S2-C03 = CONFIRMED` and does not establish that C03 is ineffective.

## Closed candidate — PBAI-C004-v1

Predevelopment support passed with 54 exact D2/D3 TopSet-disjoint roots. Isolated implementation and premetric safety passed, but the prospectively frozen median-node benefit gate failed:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL
fraction candidate nodes <= baseline = 46/54 = 0.8518518519
required >= 0.55
=> PASS
```

All measured semantic/boundary/control safety gates passed. Canonical run `32918902388`, job `98028290217`, artifact `9589217604`; PR #58 closed without merge. Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

## No-rescue / holdout firewall

```text
C001 same-version mechanism/trigger/population/threshold rescue = prohibited
C002 same-version rescue = prohibited
C004 same-version mechanism/trigger/order/target/boundary/threshold rescue = prohibited
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
public adoption = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

## Current authorization state

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
active candidate implementation = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

`KEEP-AI-GEN2` remains a valid program outcome. Any materially different mechanism requires a new prospective candidate/version and a new pre-outcome contract.
