# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Final status

```text
PROGRAM = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = COMPLETE
PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN
AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #61 CLOSED WITHOUT MERGE
PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD / PR #63 CLOSED WITHOUT MERGE
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE
PBAI-C005 = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD / CLOSED WITHOUT IMPLEMENTATION
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by PBAI-P1 = false
original candidate inventory remaining = 0
Research Generation 2 evidence included = false
```

## Source-of-truth progression

```text
PBAI-A work-start main
= f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8

PBAI-B baseline public-source anchor
= f4ae3b11901180cbe417b3e643e2b357d8045d2d

PBAI-C work-start main
= 0887551fd2e67c6e90c5171465b3354f9042adc4

PBAI-D C002 contract-freeze work-start main
= 1cc5377178047e03f9225634c63eae9025480de7

PBAI-C002 isolated development base main
= 381d5fc0e60a5ea76dbd9336ab1b541467fe2869

PBAI-C002 closure / C004 contract work-start main
= 04f5ddd2c97f3452bd7081fbcc3df24b70a89df9

PBAI-C004 isolated development base main
= ea86fcbd797c1c3d0f0549fd159cc643c228b34d

PBAI-C001 contract-freeze work-start main
= 06ef21c5ca3ef1bca90aa37a5ca5d4b2cf262bde

PBAI-C001 isolated development base main
= 65a335b455bfb288931487747d633315f71d1d17

PBAI-C003 predevelopment support freeze source main
= 5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06

PBAI-C005 read-only production-surface audit source main
= 7f3ea339f7eec0668c641774eb6c2dcd37040a38

PBAI-P1 scientific evidence cutoff
= 2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

The scientific evidence cutoff is unchanged. Research Generation 2 remains excluded.

## Frozen baseline and global gates

```text
exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
frozen public engine SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
frozen public AI SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

The current `main` public engine and AI blobs matched the frozen baseline source blobs at C005 audit start. No PBAI candidate implementation was present on public/main.

## Candidate dispositions

### PBAI-C001-v1

Support and premetric safety passed, but the prospectively frozen decision-quality benefit conjunction failed:

```text
TopSet agreement delta = +0.015625; required >= +0.05 => FAIL
mean normalized rank-loss delta = -0.011718750000000028; required <= -0.02 => FAIL
severe-loss-rate excess = +0.015625; required <= 0 => FAIL
catastrophic new loss count = 0 => PASS
median search-work ratio = 0.2772631454984396 => PASS
```

Disposition: `DEVELOPMENT-BENEFIT-FAIL / HOLD`; PR #61 closed without merge; no same-version rescue.

### PBAI-C002-v1

```text
eligible target roots = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
```

Disposition: `NON-ESTIMABLE / HOLD`; PR #55 closed without merge. `TM-S2-C03 = CONFIRMED` remains unchanged.

### PBAI-C003-v1

Strict RAW identity binding failed before practical reachability was measured:

```text
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
identity difference = pending
reachability measurement executed = false
trajectoriesWithNonterminalOracleHit = null / unmeasured
uniqueNonterminalOracleStatesHit = null / unmeasured
zero-hit conclusion = NOT AUTHORIZED
```

Disposition: `NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD`; PR #63 closed without merge. REWR-STUDY1 and ORISC-STUDY1 formal decisions remain unchanged.

### PBAI-C004-v1

Support and premetric safety passed, but the frozen intended-benefit gate failed:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL
```

Disposition: `DEVELOPMENT-BENEFIT-FAIL / HOLD`; PR #58 closed without merge. Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

### PBAI-C005

A read-only audit inspected the current public UI, AI code, diagnostics and calibration semantics documents. The current public product does not display or expose engine evaluation as validated Bao win probability, winning chance, win rate or confidence probability.

```text
actionable current production semantics defect = false
implementation required = false
implementation created = false
```

Disposition:

```text
PBAI-C005
= NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
= CLOSED WITHOUT IMPLEMENTATION
```

Canonical records:

- `C005_PRODUCTION_SURFACE_AUDIT.md`
- `candidates/PBAI-C005-production-surface-audit-result.json`

## Final authorization and release state

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false / HOLD
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
public adoption = NONE
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

No release holdout is consumed because no candidate reached release-candidate status.

## Scientific boundaries retained

- Position Evaluation / Win-Rate Calibration Study 1 = `INCONCLUSIVE`; no engine score -> validated Bao win probability.
- Position Complexity / Difficulty Study 1 = `INCONCLUSIVE`; machine search complexity is not human difficulty.
- Tactical Motif Human / Expert Validation Study 1 = `INCONCLUSIVE-NOT-ESTIMABLE`, N=0.
- Restricted Endgame Study 1 exactness remains limited to its frozen 8-state domain.
- ORISC-STUDY1 representation integrity remains `NOT-CONFIRMED`; no unvalidated symmetry/canonicalization is authorized.
- Research Generation 2 is separate and was not incrementally fed into PBAI-P1.

Authoritative Research Generation 1 RAW identity remains:

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
```

Current `AI.stateKey` omits `pending`; it remains unsuitable as a research-derived exact-tablebase key.

## Program closure

All five candidates in the original PBAI-P1 inventory now have explicit dispositions. None passed through validation, release holdout and public adoption.

Therefore:

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public AI lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
```

Canonical final report: `PROGRAM_FINAL_REPORT.md`.
