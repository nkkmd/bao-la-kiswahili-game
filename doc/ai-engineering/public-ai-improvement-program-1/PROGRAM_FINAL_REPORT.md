# PBAI-P1 — Program Final Report

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
Scientific evidence cutoff: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
Frozen baseline: `AI-GEN2-BASELINE-2026-08-26-v1`  
Frozen global gates: `PBAI-C-GLOBAL-GATES-2026-08-26-v1`  
Final status: **PROGRAM COMPLETE / KEEP-AI-GEN2**

## 1. Final engineering outcome

PBAI-P1 evaluated the original candidate inventory without changing the completed Research Generation 1 scientific decisions and without importing Research Generation 2 outcomes.

No candidate reached public adoption.

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
PBAI-P1 public releases = 0
public AI code changed by PBAI-P1 = false
```

`KEEP-AI-GEN2` is the prospectively permitted and correct engineering result when no candidate satisfies the required evidence and release sequence.

## 2. Candidate dispositions

### PBAI-C001-v1

```text
family = phase/search-aware root search routing
result = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #61 = CLOSED WITHOUT MERGE
```

Support and premetric safety passed, but the frozen decision-quality benefit conjunction failed. Large search-work reduction did not rescue the failed quality gates.

### PBAI-C002-v1

```text
family = TM-S2-C03-aware move ordering
result = NON-ESTIMABLE / HOLD
eligible targets = 5
minimum estimable = 48
PR #55 = CLOSED WITHOUT MERGE
```

Candidate benefit metrics were not executed. `TM-S2-C03 = CONFIRMED` remains unchanged.

### PBAI-C003-v1

```text
family = restricted exact-oracle lookup plumbing
result = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
failure stage = STRICT-RAW-IDENTITY-BINDING
reachability measurement = NOT EXECUTED
PR #63 = CLOSED WITHOUT MERGE
```

The strict RAW identity precondition failed on the already-known ORISC `pending` binding mismatch. C003 did not produce a zero-hit result and did not revise the restricted-endgame or ORISC scientific decisions.

### PBAI-C004-v1

```text
family = search-instability-aware root ordering
result = DEVELOPMENT-BENEFIT-FAIL / HOLD
median nodes(candidate/baseline) = 1.000
required <= 0.950
PR #58 = CLOSED WITHOUT MERGE
```

Support and safety passed; the frozen intended-benefit endpoint failed. Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

### PBAI-C005

```text
family = evaluation semantics sanitation
result = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
implementation = NOT CREATED
```

A read-only production-surface audit found no current public UI/code/diagnostic surface that represents engine evaluation as validated win probability, win rate, winning chance or confidence probability. Therefore no corrective implementation was justified.

Canonical audit:

- `C005_PRODUCTION_SURFACE_AUDIT.md`
- `candidates/PBAI-C005-production-surface-audit-result.json`

## 3. Final inventory

```text
original candidate inventory = 5
candidate dispositions complete = 5
original candidate inventory remaining = 0
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation executions = 0
release holdout executions = 0
public adoption decisions = 0
PBAI-P1 releases = 0
```

The isolated development attempts for C001, C002 and C004, plus C003 predevelopment support work, never produced a merged public candidate implementation.

## 4. Scientific boundaries preserved

PBAI-P1 does not revise any completed scientific formal decision. In particular:

```text
Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
engine score -> validated Bao win probability = NOT AUTHORIZED

Position Complexity / Difficulty Study 1 = INCONCLUSIVE
machine search complexity -> human difficulty = NOT AUTHORIZED

Tactical Motif Human / Expert Validation Study 1
= INCONCLUSIVE-NOT-ESTIMABLE / N=0
machine motif evidence -> human recognition/difficulty = NOT AUTHORIZED

REWR-STUDY1
= EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
exactness beyond frozen 8-state domain = NOT AUTHORIZED

ORISC-STUDY1
= ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
unvalidated symmetry/canonicalization = NOT AUTHORIZED
```

Research Generation 2 remains a separate pure-research track and was not incrementally incorporated into this Program.

## 5. Baseline retained

The retained public comparator is:

```text
AI-GEN2-BASELINE-2026-08-26-v1
```

Frozen public source identities remain:

```text
public/engine.js
SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c

public/ai.js
SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

No PBAI-P1 candidate code is adopted into the public default.

## 6. Release and generation decision

The release sequence was never entered because no candidate reached validation-ready/release-candidate status.

Therefore:

```text
release holdout execution = NOT REQUIRED / NOT EXECUTED
public deployment caused by PBAI-P1 = NONE
formal ADOPT = NONE
actual public-default deployment = NONE
AI-GEN3 = NOT PROMOTED
```

The reserved name `AI-GEN3` remains available only for a future engineering program/candidate that obtains both formal `ADOPT` and actual public-default deployment under an appropriate prospective release contract.

## 7. Future work boundary

PBAI-P1 is closed. Future AI work must not silently reopen or rescue its candidate versions.

A future materially different engineering mechanism must:

1. receive a new candidate/program identity;
2. state its evidence cutoff prospectively;
3. preserve completed research decisions;
4. freeze exact mechanism and acceptance contract before outcome inspection;
5. protect validation and release holdouts;
6. retain the `AI-GEN3` naming rule.

Research Generation 2 can inform a later engineering program only if that later program explicitly establishes a new evidence cutoff. It does not retroactively enter PBAI-P1.

## 8. Canonical final state

```text
PBAI-P1 = COMPLETE
PBAI-P1 final outcome = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
original candidate inventory remaining = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
```
