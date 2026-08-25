# PBAI-P1 Candidate Register

Status: **PBAI-A COMPLETE / NO CANDIDATE AUTHORIZED FOR IMPLEMENTATION**

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

`EVIDENCE-AUDIT-READY` means only that PBAI-A has identified the completed Research Generation 1 evidence basis, scientific boundary, prohibited inference and required engineering safeguards. It does **not** authorize code changes.

## Candidates after PBAI-A

| ID | Candidate family | Research Generation 1 evidence basis | Current status | Key constraint / risk |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase / morphology-aware search or evaluation | bounded phase/search dependence; confirmed `MTAJI-M1/MTAJI-M2` morphology | `EVIDENCE-AUDIT-READY` | morphology can stratify tests, but a bonus/search rule is a new engineering hypothesis; no timing heuristic or universal phase law |
| `PBAI-C002` | `TM-S2-C03`-aware tactical selective extension / move ordering | `TM-S2-C03` machine-confirmed motif | `EVIDENCE-AUDIT-READY` | exact trigger + matched controls required; no forced-win/traditional/human claim; extension cost and non-C03 regression must be measured |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | frozen exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; dedicated RAW key including `pending`; verified engineering artifact; safe fallback; zero false hits |
| `PBAI-C004` | Search-instability-aware selective deepening | reproducible adjacent-depth instability, high continuation divergence, reply-pressure/opponent-policy sensitivity | `EVIDENCE-AUDIT-READY` | define a new engineering-only trigger; do not reuse scientific difficulty/criticality/PCEM classifiers as production truth |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; engine score explicitly not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping; semantics-only changes should preserve move decisions unless a separate decision-logic mechanism is prospectively authorized |

## PBAI-A evidence trace

Canonical audit: `GENERATION_1_EVIDENCE_AUDIT.md`.

Important cross-candidate constraints:

- authoritative research-derived RAW identity includes `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending` and excludes `turn`, `reason`;
- unvalidated symmetry, reflection, seat-swap or quotient canonicalization is prohibited;
- current `AI.stateKey` is not interchangeable with the Research Generation 1 RAW identity contract because it omits `pending`;
- `bao-v2` is an experimental evaluation profile, not `AI-GEN2`;
- machine search/reply phenomena must not be described as human difficulty/error/deception;
- Research Generation 2 outcomes are outside PBAI-P1 evidence.

## Authorization requirements

A candidate may move to `AUTHORIZED-FOR-DEVELOPMENT` only after PBAI-B exact baseline and PBAI-C numeric gates are frozen and the candidate entry records at minimum:

- exact source Study / document / evidence tier;
- engineering mechanism and exact trigger semantics;
- affected code surface;
- expected benefit;
- expected runtime/memory cost;
- known prohibited inference;
- development benchmark endpoints and seed block;
- validation benchmark endpoints and fresh seed block;
- release-holdout block and no-tuning rule;
- candidate-specific acceptance/rejection thresholds fixed before results;
- hard rule-correctness/tactical/operational rejection gates;
- rollback method.

Current authorization state:

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
```

## Required benchmark direction by candidate

- `PBAI-C001`: morphology/phase strata, paired strength, decision loss, local non-inferiority, runtime.
- `PBAI-C002`: exact C03 + matched controls, existing tactical suite, paired strength, node/time overhead, severe-loss frequency.
- `PBAI-C003`: exact 8-state correctness, zero false hits, RAW-key/seed-conservation binding, fallback equivalence, lookup overhead.
- `PBAI-C004`: trigger precision/coverage, fixed-depth decision loss, time-limited depth/timeout/latency, phase/opening robustness, paired strength.
- `PBAI-C005`: semantics/API/UI regression, absence of probability claims, move-decision equivalence where decision logic is not intentionally changed.

Numeric acceptance thresholds remain PBAI-C work and must be frozen before candidate outcomes.

## Combination rule

`PBAI-C001 + PBAI-C004`のような複合変更は既存IDへ黙って追加しない。単独ablationを先に取得し、必要な場合は新しいcombined candidate IDを発行する。

No candidate may be called `AI-GEN3`, `AI-GEN3 candidate`, or `AI-GEN3 release`. Before formal public adoption, candidate identity remains `PBAI-Cxxx`; an assembly/release candidate uses `PBAI-P1-RCxx` if needed.
