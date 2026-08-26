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
PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #61 CLOSED WITHOUT MERGE
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

## Closed candidate — PBAI-C002-v1

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
eligible target roots = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
main/public candidate code = unchanged
```

The scientific source remains `TM-S2-C03 = CONFIRMED`; the engineering non-estimability result does not change it or establish motif ineffectiveness.

## Closed candidate — PBAI-C004-v1

Predevelopment support passed (`54 >= 48`) and isolated implementation safety passed. The frozen primary median node-ratio benefit gate failed (`1.000 > 0.950`) even though the fraction-non-worse gate and all measured semantic/boundary/control gates passed. Canonical development run `32918902388`, job `98028290217`, artifact `9589217604`; PR #58 was closed without merge. Position Complexity / Difficulty Study 1 remains formal `INCONCLUSIVE` and same-version rescue is prohibited.

## Closed candidate — PBAI-C001-v1

### Scientific boundary

Primary Research Generation 1 input remains Phase Transition Study 1 E-020 / H18:

```text
formal decision = CONFIRMED
scope = hard / bao / depth3 only
scientific observation = legacy produced more capture-branch-expansion events than phase2
```

The engineering result does **not** establish that legacy search is globally stronger or weaker, that capture-branch-expansion improves winning, or that the scientific decision should change.

### Baseline-only support and exact contract

Before candidate implementation or benefit inspection, the following were prospectively frozen:

```text
development source = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible Namua forced-capture roots = 108
selected development targets = 64
minimum estimable = 32
feature = pbaiC001NamuaForcedCaptureLegacy
public default = off
levels = hard / expert
public candidate surface = public/ai.js only
candidate/baseline budget = hard / bao / D3 / Infinity
reference = independent exact-full-window D4 bao
```

Support provenance:

```text
run = 32952267253
job = 98126097111
artifact = 9600601764
artifact ZIP SHA-256 = b240f1d8ffd0e3e6022db2524d1bbc1204489098def079c7c96a20dcc41a99ce
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
```

### Premetric safety

The isolated candidate passed feature isolation, regression, trigger/control and baseline-equivalence checks before D4 benefit was observed:

```text
premetric run = 32957250041
job = 98141544109
artifact = 9602505672
artifact ZIP SHA-256 = 861735a270202e4488283dad3470ccc61ff060f4877402086b6c4b9771a8346d
64/64 target trigger coverage = PASS
32 Mtaji controls + 20 Namua non-forced controls = non-trigger / equivalent
feature-off frozen baseline equivalence = PASS
easy / normal / MCTS / explicit legacy invariance = PASS
candidate benefit observed before PASS = false
validation/holdout accessed = false
```

### Binding development result

Canonical benefit execution:

```text
run = 32957738413
job = 98143061656
artifact = 9602744693
artifact ZIP SHA-256 = 82fdffb39c967e8bf02abf3080ab1651fcfa1c88f881d0028ce5af3493d45762
candidate branch head = f9767c575e512c1e0d41c2ad4dd1a7a9c302e29f
candidate public/ai.js SHA-256 = 108a57d17d0d0bf2f63e3794f386ee480116791181793ff6cde7366f7bd0a439
```

Frozen 64-root gate results:

```text
TopSet agreement:
  baseline = 0.640625 (41/64)
  candidate = 0.65625 (42/64)
  delta = +0.015625
  required >= +0.05
  => FAIL

mean normalized rank loss:
  baseline = 0.1648623511904762
  candidate = 0.15314360119047618
  delta = -0.011718750000000028
  required <= -0.02
  => FAIL

severe loss:
  baseline = 2/64 = 0.03125
  candidate = 3/64 = 0.046875
  excess = +0.015625
  required <= 0
  => FAIL

catastrophic new losses = 0
required = 0
=> PASS

median search-work ratio candidate/baseline = 0.2772631454984396
required <= 1.50
=> PASS

fraction roots search-work ratio >2 = 0
required <= 0.10
=> PASS
```

The large search-work reduction cannot compensate for failed quality gates because the frozen acceptance rule is conjunctive.

Binding decision:

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
development authorization = ENDED
same-version rescue / retuning = PROHIBITED
validation = NOT EXECUTED / NOT AUTHORIZED
release holdout = NOT EXECUTED / NOT AUTHORIZED
public adoption = NOT AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
PR #61 = CLOSED WITHOUT MERGE
main/public candidate implementation = 0
main public result = KEEP-AI-GEN2
```

Canonical result: `candidates/PBAI-C001-v1-development-result.json`.

## Current authorization boundary

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
public/main candidate implementations = 0
AI-GEN3 promotion = NOT-AUTHORIZED
```

The current public implementation remains frozen `AI-GEN2`. `KEEP-AI-GEN2` remains a valid final program outcome. A materially different C001-family mechanism requires a new prospective candidate/version and a new pre-outcome contract.
