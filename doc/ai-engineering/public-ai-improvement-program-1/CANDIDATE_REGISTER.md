# PBAI-P1 Candidate Register

Status: **ALL ORIGINAL CANDIDATES DISPOSED / PBAI-P1 COMPLETE / KEEP-AI-GEN2**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
scientific evidence cutoff = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
Research Generation 2 evidence included = false
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

## Final candidate states

| ID | Candidate family | Research Generation 1 basis | Final status | Binding boundary |
| --- | --- | --- | --- | --- |
| `PBAI-C001-v1` | Phase/search-aware root search routing | Phase Transition Study 1 E-020/H18 | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | support + premetric PASS; three frozen decision-quality benefit gates failed; PR #61 closed without merge; no same-version rescue |
| `PBAI-C002-v1` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | target support 5 < frozen minimum 48; PR #55 closed without merge; no same-version rescue |
| `PBAI-C003-v1` | Restricted exact-oracle lookup plumbing | REWR exact 8-state domain + ORISC RAW-binding constraints | **`HOLD / NON-ESTIMABLE-PRACTICAL-REACHABILITY`** | strict RAW identity binding failed before reachability measurement; hit count unmeasured; PR #63 closed without merge; no same-version identity rescue |
| `PBAI-C004-v1` | Search-instability-aware root ordering | reproducible D2/D3 search measurement; Position Complexity Study formal `INCONCLUSIVE` | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | support/safety passed; frozen median-node intended-benefit gate failed; PR #58 closed without merge; no same-version rescue |
| `PBAI-C005` | Evaluation semantics sanitation | Position Evaluation / Win-Rate Calibration Study 1 `INCONCLUSIVE` | **`HOLD / NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT`** | read-only current production audit found no score→validated-probability defect; closed without implementation |

## PBAI-C001-v1

Prospective mechanism:

```text
feature = pbaiC001NamuaForcedCaptureLegacy
public default = off
levels = hard / expert
target = nonterminal Namua; >=2 legal variants; all variants capture
mechanism = route eligible enhanced-family root through existing legacy search branch
public candidate surface = public/ai.js only
candidate/baseline = hard / bao / D3 / Infinity
reference = independent exact-full-window D4 bao
```

Baseline-only support passed: `108 >= 32`, with 64 frozen targets. Premetric safety passed before benefit inspection.

Binding result:

```text
TopSet agreement delta = +0.015625; required >= +0.05 => FAIL
mean normalized rank-loss delta = -0.011718750000000028; required <= -0.02 => FAIL
severe-loss-rate excess = +0.015625; required <= 0 => FAIL
catastrophic new loss count = 0 => PASS
median search-work ratio = 0.2772631454984396 => PASS
fraction search-work ratio >2 = 0 => PASS
```

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #61 = CLOSED WITHOUT MERGE
validation / release holdout = NOT EXECUTED
main/public candidate implementation = 0
```

The efficiency improvement cannot rescue failed quality gates. Phase Transition Study 1 E-020/H18 remains unchanged.

## PBAI-C002-v1

```text
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible targets = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
PR #55 = CLOSED WITHOUT MERGE
validation / release holdout = NOT EXECUTED
```

This result does not alter `TM-S2-C03 = CONFIRMED` and does not establish that C03 is ineffective.

## PBAI-C003-v1

C003-v1 inserted a baseline-only practical-support firewall before any tablebase/lookup implementation.

Frozen support contract:

```text
source main = 5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06
development seeds = 31300001..31300512
trajectories = 512
maximum plies = 160
support target = natural visit to >=1 nonterminal state in frozen REWR 8-state domain
identity = pits,reserve,houseOwned,player,phase,winner,pending
AI.stateKey = prohibited
symmetry / seat / reflection canonicalization = prohibited
missing pending coercion = prohibited
stored oracle keys must rehash under strict RAW identity before reachability is measured
```

The identity precondition failed before trajectory scanning:

```text
workflow run = 32960056255
job = 98150197902
support branch head = 3a91ba211263de37115e0e22ad857df3f2e6b142
PR #63 = CLOSED WITHOUT MERGE
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
first stored key = 469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
strict RAW recomputed = 7849cf1069ca9c966d111bb83a1fb36915abedb4a8533083778fb67f71a39a70
known affected repository rows = 3
identity field difference = pending
```

Binding interpretation:

```text
reachability measurement executed = false
trajectoriesWithNonterminalOracleHit = null / unmeasured
uniqueNonterminalOracleStatesHit = null / unmeasured
zero-hit conclusion = NOT AUTHORIZED
candidate implementation = 0
candidate benefit metrics = NOT EXECUTED
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
```

No same-version seed expansion, identity relaxation, stored-key replacement or synthetic-fixture substitution may rescue C003-v1. REWR-STUDY1 and ORISC-STUDY1 remain unchanged.

## PBAI-C004-v1

Predevelopment support passed with 54 exact D2/D3 TopSet-disjoint roots. Isolated implementation and premetric safety passed, but:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL
```

All measured semantic/boundary/control safety gates passed. PR #58 closed without merge. Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

## PBAI-C005

C005 began and ended as a read-only production-surface audit. No code implementation was authorized before the audit.

Scientific boundary:

```text
Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
engine score -> validated Bao win probability = NOT ESTABLISHED
production win-probability mapping = NOT AUTHORIZED
```

Audit source:

```text
main = 7f3ea339f7eec0668c641774eb6c2dcd37040a38
```

Inspected current public UI/code/diagnostics and the calibration semantics records. The current public product does not display or expose the engine evaluation as a win percentage, winning chance, calibrated probability or confidence probability. Broad `score` variables were reviewed and found to be internal heuristic/search/diagnostic quantities, not probability semantics.

Binding result:

```text
actionable current production semantics defect = false
exact correction contract required = false
implementation authorized = false
implementation created = false
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PBAI-C005 = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
CLOSED WITHOUT IMPLEMENTATION
```

Canonical:

- `C005_PRODUCTION_SURFACE_AUDIT.md`
- `candidates/PBAI-C005-production-surface-audit-result.json`

The no-score→validated-win-probability prohibition remains in force for future work.

## Final no-rescue / holdout firewall

```text
C001 same-version rescue = prohibited
C002 same-version rescue = prohibited
C003 same-version seed/identity/stored-key/synthetic rescue = prohibited
C004 same-version rescue = prohibited
C005 defect manufacture / unnecessary implementation = prohibited
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
public adoption = NONE
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

## Final authorization state

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false / HOLD
AUTHORIZED-FOR-DEVELOPMENT count = 0
active candidate implementation = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
original candidate inventory remaining = 0
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

## Program outcome

All original candidate families now have final dispositions. None reached validation or public adoption.

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
```

Canonical final report: `PROGRAM_FINAL_REPORT.md`.
