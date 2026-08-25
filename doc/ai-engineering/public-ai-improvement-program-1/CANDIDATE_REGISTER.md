# PBAI-P1 Candidate Register

Status: **PBAI-C GLOBAL GATES FROZEN / NO CANDIDATE AUTHORIZED FOR IMPLEMENTATION**

Global gate spec:

```text
PBAI-C-GLOBAL-GATES-2026-08-26-v1
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

`EVIDENCE-AUDIT-READY` means only that PBAI-A identified the completed Research Generation 1 evidence basis, scientific boundary, prohibited inference and required engineering safeguards. PBAI-C completion adds global numeric gates but still does **not** authorize code changes.

## Candidates after PBAI-C

| ID | Candidate family | Research Generation 1 evidence basis | Current status | Key constraint / risk |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | bounded phase/search dependence; confirmed `MTAJI-M1/MTAJI-M2` morphology | `EVIDENCE-AUDIT-READY` | morphology can stratify tests, but a bonus/search rule is a new engineering hypothesis; no timing heuristic or universal phase law |
| `PBAI-C002` | `TM-S2-C03`-aware tactical selective extension / move ordering | `TM-S2-C03` machine-confirmed motif | `EVIDENCE-AUDIT-READY` | exact trigger + matched controls required; no forced-win/traditional/human claim; extension cost and non-C03 regression must be measured |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | frozen exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; dedicated RAW key including `pending`; verified engineering artifact; safe fallback; zero false hits |
| `PBAI-C004` | Search-instability-aware selective deepening | reproducible adjacent-depth instability, high continuation divergence, reply-pressure/opponent-policy sensitivity | `EVIDENCE-AUDIT-READY` | define a new engineering-only trigger; do not reuse scientific difficulty/criticality/PCEM classifiers as production truth |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; engine score explicitly not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping; semantics-only changes should preserve move decisions unless a separate decision-logic mechanism is prospectively authorized |

## Cross-candidate evidence constraints

- authoritative research-derived RAW identity includes `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending` and excludes `turn`, `reason`;
- unvalidated symmetry, reflection, seat-swap or quotient canonicalization is prohibited;
- current `AI.stateKey` is not interchangeable with the Research Generation 1 RAW identity contract because it omits `pending`;
- `bao-v2` is an experimental evaluation profile, not `AI-GEN2`;
- machine search/reply phenomena must not be described as human difficulty/error/deception;
- Research Generation 2 outcomes are outside PBAI-P1 evidence;
- all candidates compare against `AI-GEN2-BASELINE-2026-08-26-v1`;
- all candidates must pass `PBAI-C-GLOBAL-GATES-2026-08-26-v1`; candidate-specific rules may add requirements but may not relax global gates.

## Frozen global PBAI-C floor

Every decision-changing candidate is subject to, at minimum:

```text
fixed-depth paired strength:
  validation pooled observed score >= 0.50
  validation one-sided 95% LCB >= 0.47
  release holdout pooled observed score >= 0.50
  release holdout one-sided 95% LCB >= 0.47
  locked validation+holdout observed score >= 0.50
  locked validation+holdout one-sided 95% LCB >= 0.48

decision quality:
  new catastrophic losses = 0
  validation/holdout severe-loss excess <= +0.01
  validation/holdout top-set delta >= -0.02
  validation/holdout normalized rank-loss delta <= +0.02

operational:
  crash / illegal move / invalid state = 0
  median elapsed ratio <= 1.05
  p95 elapsed ratio <= 1.10
  roots with completed-depth deficit >=2 <= 5%

correctness:
  frozen public/engine.js hash unchanged
  existing tactical failures = 0
  candidate-specific regression failures = 0
```

Phase/seat/challenge-stratum local floors and exact seed blocks are defined in the global gate spec and `BENCHMARK_PROTOCOL.md`.

## Authorization requirements

A candidate may move to `AUTHORIZED-FOR-DEVELOPMENT` only after all of the following are recorded **before candidate code exists**:

- exact source Study / document / evidence tier;
- exact engineering mechanism and feature flag semantics;
- affected code surface;
- prospective classification as normal improvement candidate or correctness/semantics-only maintenance candidate;
- primary intended-benefit endpoint;
- minimum practical benefit;
- target and matched/control strata where applicable;
- candidate-local development block;
- candidate-local fresh validation block;
- candidate-local reserved release-holdout block or fixture set;
- runtime/memory budget if the mechanism may add cost or persistent data;
- candidate-specific failure handling;
- rollback method;
- confirmation that global PBAI-C thresholds are unchanged.

Implementation isolation is mandatory:

```text
feature off = frozen baseline comparator
feature on  = exactly one PBAI candidate
public default before adoption = off
```

Feature-off behavior must reproduce mandatory frozen baseline fixtures.

Current authorization state:

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
candidate implementations = 0
```

## Required candidate-specific benchmark direction

### `PBAI-C001`

Must prospectively choose one exact phase/morphology mechanism rather than simultaneously changing evaluation and search. Required targeted morphology/phase endpoint and matched non-target control must be frozen before implementation. Global strength/decision/operational gates remain mandatory.

### `PBAI-C002`

Must freeze the exact `TM-S2-C03` engineering trigger independently of human/traditional labels, use C03-target and matched non-C03 controls, declare a minimum targeted decision-quality benefit, and pass existing tactical + global non-regression gates.

### `PBAI-C003`

Must use a strict dedicated RAW key including `pending`. Candidate contract must require exact lookup/value/optimal-move equality throughout the frozen eligible 8-state domain, zero false lookup hits outside membership, 100% fallback equivalence outside domain, and a prospective lookup overhead/memory budget. It may not infer a global Bao tablebase.

### `PBAI-C004`

Must define a new engineering-only trigger, prospective trigger coverage bounds, minimum triggered-root decision-quality benefit, and cost budget. Existing scientific difficulty/criticality/PCEM classifiers cannot be relabeled as the production trigger.

### `PBAI-C005`

Must be prospectively classified as semantics/correctness-only unless it explicitly proposes decision-logic changes under a new mechanism contract. The semantics-only route requires exact decision-equivalence on frozen candidate-specific validation/holdout roots, zero probability claim introduction, API/UI compatibility, and global non-regression.

## Release-holdout rule

The global release-holdout blocks are frozen but **NOT AUTHORIZED FOR EXECUTION** at PBAI-C.

Holdout authorization requires:

```text
candidate development complete
candidate source/config hash frozen
fresh validation PASS
explicit PBAI-F authorization
```

A candidate may not tune against holdout results. Failure after holdout inspection is not repaired by threshold relaxation or same-holdout retuning.

## Combination rule

`PBAI-C001 + PBAI-C004`のような複合変更は既存IDへ黙って追加しない。単独ablationを先に取得し、必要な場合は新しいcombined candidate IDを発行する。

No candidate may be called `AI-GEN3`, `AI-GEN3 candidate`, or `AI-GEN3 release`. Before formal public adoption, candidate identity remains `PBAI-Cxxx`; an assembly/release candidate uses `PBAI-P1-RCxx` if needed.
