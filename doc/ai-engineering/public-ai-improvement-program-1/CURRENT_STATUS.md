# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Status

```text
PROGRAM = ESTABLISHED
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = COMPLETE
PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN
AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #61 CLOSED WITHOUT MERGE
PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD / PR #63 CLOSED WITHOUT MERGE
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE
PBAI-C005 = EVIDENCE-AUDIT-READY / NOT AUTHORIZED
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by PBAI-P1 = false
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

Global strength, decision-quality, operational, correctness, split/holdout and PWA release-safety gates remain unchanged.

## Closed candidate — PBAI-C001-v1

Primary engineering input was Phase Transition Study 1 E-020/H18. That scientific result remains `CONFIRMED` only within its original fixed-condition scope and is not a proof that legacy search is stronger or chooses better moves.

Prospective support passed with `108 >= 32` eligible roots and 64 frozen targets. Premetric safety passed before benefit inspection. Binding development result:

```text
TopSet agreement delta = +0.015625; required >= +0.05 => FAIL
mean normalized rank-loss delta = -0.011718750000000028; required <= -0.02 => FAIL
severe-loss-rate excess = +0.015625; required <= 0 => FAIL
catastrophic new loss count = 0 => PASS
median search-work ratio = 0.2772631454984396 => PASS
fraction search-work ratio >2 = 0 => PASS
```

The efficiency gain cannot compensate for failed quality gates because the acceptance rule is conjunctive.

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #61 = CLOSED WITHOUT MERGE
same-version rescue = prohibited
validation / release holdout = NOT EXECUTED / NOT AUTHORIZED
main/public candidate implementation = 0
```

Canonical result: `candidates/PBAI-C001-v1-development-result.json`.

## Closed candidate — PBAI-C002-v1

`TM-S2-C03 = CONFIRMED` remains unchanged. The engineering target population was non-estimable under the frozen v1 selector:

```text
eligible target roots = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
PR #55 = CLOSED WITHOUT MERGE
validation / release holdout = NOT EXECUTED
main/public candidate implementation = 0
```

No same-version population/trigger/threshold rescue is allowed.

## Closed candidate — PBAI-C004-v1

Position Complexity / Difficulty Study 1 remains formal `INCONCLUSIVE`. C004 support passed (`54 >= 48`) and isolated premetric safety passed, but the prospectively frozen practical-benefit gate failed:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL
```

All measured semantic/boundary/control safety gates passed. PR #58 was closed without merge; same-version rescue is prohibited.

## Closed candidate — PBAI-C003-v1

### Scientific boundary

C003 used only the completed restricted-endgame and ORISC results as engineering input:

```text
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
frozen domain = 8 states / 7 edges
ORISC-STUDY1 = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC known repository stored-row rehash mismatch count = 3
ORISC known RAW binding mismatch field = pending
```

Neither scientific formal decision is changed by PBAI-C003-v1.

### Prospectively frozen support question

Before any C003 lookup implementation or candidate-benefit measurement, the following was frozen on source main `5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06`:

```text
development seeds = 31300001..31300512
trajectories = 512
maximum plies = 160
target = naturally visited nonterminal state in the frozen 8-state oracle domain
minimum practical support = >=1 hit trajectory AND >=1 unique nonterminal oracle state
identity = pits,reserve,houseOwned,player,phase,winner,pending
AI.stateKey = prohibited
symmetry / seat / reflection canonicalization = prohibited
missing pending coercion = prohibited
oracle stored keys must rehash under strict RAW identity before reachability measurement
```

### Binding predevelopment result

Canonical workflow:

```text
run = 32960056255
job = 98150197902
support branch head = 3a91ba211263de37115e0e22ad857df3f2e6b142
PR #63 = CLOSED WITHOUT MERGE
```

The strict identity precondition failed before any trajectory reachability count was computed:

```text
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
first stored key = 469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
strict RAW recomputed = 7849cf1069ca9c966d111bb83a1fb36915abedb4a8533083778fb67f71a39a70
known affected repository rows = 3
identity difference = pending
```

This is consistent with the already-completed ORISC-STUDY1 representation-integrity result. It is **not** a new scientific finding.

Crucially:

```text
reachability measurement executed = false
trajectoriesWithNonterminalOracleHit = unmeasured / null
uniqueNonterminalOracleStatesHit = unmeasured / null
zero-hit conclusion = NOT AUTHORIZED
candidate implementation = 0
candidate benefit metrics = NOT EXECUTED
validation / release holdout = NOT EXECUTED / NOT AUTHORIZED
```

Binding engineering disposition:

```text
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
same-version seed expansion = prohibited
same-version identity relaxation = prohibited
same-version stored-key replacement for support = prohibited
same-version synthetic-fixture substitution = prohibited
```

Canonical files:

- `candidates/PBAI-C003-v1-predevelopment-support-spec.json`
- `candidates/PBAI-C003-v1-predevelopment-support-result.json`

## Remaining candidate inventory

```text
PBAI-C005 = EVIDENCE-AUDIT-READY / NOT AUTHORIZED
family = evaluation semantics sanitation
scientific input = Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
hard prohibition = no engine-score -> validated win-probability semantics
```

No C005 implementation, contract or outcome has been created. The next work should begin with a **read-only production-surface audit** to determine whether there is an actual current public semantics problem worth engineering. Do not authorize or implement C005 before that audit and a prospective exact contract.

## Current authorization boundary

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
public/main candidate implementations = 0
AI-GEN3 promotion = NOT-AUTHORIZED
```

The current public implementation remains frozen `AI-GEN2`. `KEEP-AI-GEN2` remains a valid final program outcome.

For a clean restart, read `RESUME_HERE.md` first after verifying the current remote `main` HEAD.
