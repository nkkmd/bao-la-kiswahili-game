# PBAI-P1 Candidate Register

Status: **PBAI-C002-v1 = NON-ESTIMABLE / HOLD / CLOSED WITHOUT MERGE**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
C002 contract = candidates/PBAI-C002-v1.json
C002 result = candidates/PBAI-C002-v1-development-result.json
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

| ID | Candidate family | Research Generation 1 evidence basis | Current status | Key boundary |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | bounded phase/search dependence; confirmed `MTAJI-M1/MTAJI-M2` morphology | `EVIDENCE-AUDIT-READY` | a future exact engineering mechanism must be prospectively frozen before development |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | v1 target support was 5 < frozen minimum 48; no same-version population/trigger/threshold rescue |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | frozen exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; strict RAW key including `pending`; zero false hits; fallback required |
| `PBAI-C004` | Search-instability-aware selective deepening | reproducible adjacent-depth instability / reply-pressure evidence | `EVIDENCE-AUDIT-READY` | production trigger must be a new engineering construct, not a scientific difficulty classifier |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; score is not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping; decision behavior must remain unchanged unless separately authorized |

## PBAI-C002-v1 closure

Research source remains unchanged:

```text
Tactical Motifs / Tesuji Study 1
TM-S2-C03 = CONFIRMED
canonical candidate key = 7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba
```

The isolated v1 implementation used the frozen move-ordering-only contract and passed its pre-metric safety checks:

```text
feature default/off equivalence = PASS
root-only trigger boundary = PASS
Namua negative-control exactness = PASS
Mtaji reusablePits>=3 negative-control exactness = PASS
engine/AI/evaluation/search/config/worker/tactical regression = PASS
public surface isolation = PASS
engine hash = PASS
holdout firewall = PASS
public/ai.js size delta = +1325 bytes <= 4096
```

No candidate benefit metric was inspected before population estimability was determined.

### Frozen development population result

```text
source block = 31300001..31300512
population digest = e016daa0f4669ac7730d34725de16d8c1ff10c398ca07867f47e81df0b399ea7
population = 128 Namua + 128 Mtaji = 256
historical trajectory candidates = 432
eligible C002 target roots = 5
required minimum estimable target roots = 48
Namua controls = 32 / 32
Mtaji reusablePits>=3 controls = 32 / 32
candidate metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
```

Canonical workflow:

```text
run = 32914807381
job = 98016194190
artifact = 9587768831
artifact ZIP SHA-256 = bbf591baa19bdc33eb2a747e11e8fd390fd0fb33c84efd215cadbd19942d6d16
```

### Frozen decision applied

The v1 contract prospectively required at least 48 eligible development target roots. It also prohibited changing the source block or selector after support was observed. Therefore:

```text
PBAI-C002-v1 development estimability = FAIL
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit evaluation = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
main/public implementation = unchanged
```

This is an engineering non-estimability result. It does not alter `TM-S2-C03 = CONFIRMED` in the research track and does not provide evidence that C03 is ineffective. It means only that this prospectively frozen public-AI engineering population/endpoint cannot estimate `PBAI-C002-v1`.

A materially different C002 population, trigger or mechanism would require a new candidate version and a new pre-outcome contract. `PBAI-C002-v1` itself may not be rescued or retuned.

## Cross-candidate constraints

- all candidates compare against `AI-GEN2-BASELINE-2026-08-26-v1`;
- all candidates remain subject to `PBAI-C-GLOBAL-GATES-2026-08-26-v1`;
- Research Generation 2 outcomes are excluded from PBAI-P1;
- authoritative research-derived RAW identity includes `pending` and cannot be replaced by current `AI.stateKey`;
- unvalidated symmetry/canonicalization is prohibited;
- machine motif/search findings may not be represented as human difficulty, human error, traditional tesuji recognition, forced win or validated win probability;
- combined candidate mechanisms require a new candidate ID after component ablation.

## Current authorization state

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
active candidate implementation = 0
isolated development implementation attempts = 1
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

Next permitted work is selection and prospective contract freeze for a different `EVIDENCE-AUDIT-READY` candidate. `KEEP-AI-GEN2` remains an acceptable final program outcome.
