# PBAI-P1 Candidate Register

Status: **PBAI-C001-v1 HOLD / PBAI-C002-v1 HOLD / PBAI-C003-v1 HOLD / PBAI-C004-v1 HOLD / no candidate authorized**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
C001 support spec/result/contract/result = candidates/PBAI-C001-v1*
C002 contract/result = candidates/PBAI-C002-v1*
C003 support spec = candidates/PBAI-C003-v1-predevelopment-support-spec.json
C003 support result = candidates/PBAI-C003-v1-predevelopment-support-result.json
C004 support spec/result/contract/result = candidates/PBAI-C004-v1*
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
| `PBAI-C001` | Phase/search-aware root search routing | Phase Transition Study 1 E-020/H18 | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | support + premetric PASS; three frozen decision-quality benefit gates failed; PR #61 closed without merge; no same-version rescue |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | target support 5 < frozen minimum 48; PR #55 closed without merge; no same-version rescue |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | REWR exact 8-state domain + ORISC RAW-binding constraints | **`HOLD / NON-ESTIMABLE-PRACTICAL-REACHABILITY`** | strict RAW identity binding failed before reachability measurement; hit count unmeasured; PR #63 closed without merge; no same-version identity rescue |
| `PBAI-C004` | Search-instability-aware root ordering | reproducible D2/D3 search measurement; Position Complexity Study formal `INCONCLUSIVE` | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | support/safety passed, frozen median-node benefit gate failed; PR #58 closed without merge; no same-version rescue |
| `PBAI-C005` | Evaluation semantics sanitation | Position Evaluation / Win-Rate Calibration Study 1 `INCONCLUSIVE` | `EVIDENCE-AUDIT-READY` | no engine-score→validated-win-probability semantics; production-surface audit required before any contract or implementation |

## Closed candidate — PBAI-C001-v1

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

## Closed candidate — PBAI-C002-v1

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

## Closed candidate — PBAI-C004-v1

Predevelopment support passed with 54 exact D2/D3 TopSet-disjoint roots. Isolated implementation and premetric safety passed, but:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL
```

All measured semantic/boundary/control safety gates passed. PR #58 closed without merge. Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

## Closed candidate — PBAI-C003-v1

C003-v1 intentionally inserted a baseline-only practical-support firewall before any tablebase/lookup implementation.

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

The identity precondition failed before any trajectory scan:

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

This exactly matches the already-completed ORISC-STUDY1 representation-integrity boundary. It is not a new scientific result and does not revise REWR-STUDY1.

Binding engineering interpretation:

```text
reachability measurement executed = false
trajectoriesWithNonterminalOracleHit = null / unmeasured
uniqueNonterminalOracleStatesHit = null / unmeasured
zero-hit conclusion = NOT AUTHORIZED
candidate implementation = 0
candidate benefit metrics = NOT EXECUTED
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
```

No same-version seed expansion, identity relaxation, stored-key replacement or synthetic-fixture substitution may rescue C003-v1. A materially different approach requires a new prospective candidate/version.

## Remaining candidate — PBAI-C005

C005 has **not** been authorized or implemented.

Scientific boundary:

```text
Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
engine score -> validated Bao win probability = NOT ESTABLISHED
production win-probability mapping = NOT AUTHORIZED
```

The next permitted work is read-only: inspect the current public product/code surface and determine whether any score/probability wording or semantics actually requires sanitation. If no current production problem exists, C005 may be closed without candidate implementation. If a concrete problem exists, freeze an exact prospective C005 contract before changing code.

## No-rescue / holdout firewall

```text
C001 same-version rescue = prohibited
C002 same-version rescue = prohibited
C003 same-version seed/identity/stored-key/synthetic rescue = prohibited
C004 same-version rescue = prohibited
C005 implementation = NOT AUTHORIZED
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
public adoption = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

## Current authorization state

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
active candidate implementation = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

`KEEP-AI-GEN2` remains a valid program outcome. For continuation, read `RESUME_HERE.md` after verifying remote `main`.
