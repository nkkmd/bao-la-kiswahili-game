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
PBAI-C004-v1 = DEVELOPMENT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
isolated development implementation attempts = 2
public/main candidate implementations = 0
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

PBAI-P1 scientific evidence cutoff
= 2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

The scientific evidence cutoff remains unchanged. No Research Generation 2 outcome was imported.

## Frozen baseline and global gates

```text
exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
frozen public engine SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
frozen public AI SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

Global strength, decision-quality, operational, correctness, split/holdout and PWA release-safety gates remain unchanged.

## Closed candidate — PBAI-C002-v1

The scientific source remains `TM-S2-C03 = CONFIRMED`. The engineering candidate is closed because its prospectively frozen development population contained only 5 eligible target roots versus the minimum 48.

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
main/public candidate code = unchanged
```

This does not alter the research decision or establish C03 ineffectiveness. Same-version population/trigger/order/threshold rescue remains prohibited.

## Closed candidate — PBAI-C004-v1

### Research boundary

Primary Research Generation 1 input was Position Complexity / Difficulty Study 1. Its formal scientific decision remains:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

PBAI-C004-v1 used only a reproducible D2/D3 search-instability measurement as engineering input. It did not turn that result into a human-difficulty classifier, general-purpose complexity classifier, or validated scientific production trigger.

### Predevelopment support

Support was frozen and measured before candidate implementation:

```text
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
exact D2/D3 TopSet-disjoint primary support = 54
minimum estimable = 48
support gate = PASS
boundary overlap-but-canonical-best-changed = 5
stable-best negative-control support = 197
candidate code used = false
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
```

Canonical support provenance:

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
artifact ZIP SHA-256 = 5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e
```

### Frozen mechanism tested in isolation

```text
feature flag = pbaiC004D23RootTtFirst
public default = false
allowed public code surface = public/ai.js only
mechanism = enhanced-alpha-beta root TT-best-first ordering after completed D2→D3 selected-best change
activation earliest = D4
internal-node ordering = unchanged
extra time/depth budget = prohibited
evaluator/quiescence changes = prohibited
persistent cache/table = prohibited
forced move = prohibited
```

The isolated candidate lived only on `engineering/pbai-p1-c004-v1-development`; its `public/ai.js` SHA-256 was `b24f4afddd43f6acf7595079e041ad5a047a95d1eb7beb45a418c9a71f7830c1` and was never merged to main.

### Premetric safety result

Before any D4 benefit outcome was inspected, PR #58 passed:

```text
authorized public surface = PASS
frozen engine hash = PASS
candidate size budget = PASS
contract/global-gate validation = PASS
feature-off baseline equivalence = PASS
existing engine/AI/evaluation/search/config/worker/tactical regressions = PASS
validation/holdout firewall = PASS
54 primary runtime-trigger coverage = PASS
32 selected stable-best negative controls trigger=0 = PASS
D3 feature-on/off exactness = PASS
candidate benefit metrics observed before premetric PASS = false
```

### Frozen D4 development result

Canonical result:

```text
candidates/PBAI-C004-v1-development-result.json
```

Canonical workflow provenance:

```text
run = 32918902388
job = 98028290217
artifact = 9589217604
artifact ZIP SHA-256 = f5552a1b8386cf58a585ea92cd5443f9d306d70630e1ef4afa78fd96404f4e8f
```

Primary 54-root intended-benefit result:

```text
median nodes(candidate/baseline) = 1.000
frozen maximum = 0.950
median node-ratio gate = FAIL

fraction candidate nodes <= baseline = 46/54 = 0.8518518519
frozen minimum = 0.55
fraction non-worse gate = PASS

candidate nodes < baseline = 9 roots
candidate nodes = baseline = 37 roots
candidate nodes > baseline = 8 roots
```

All frozen measured safety, boundary and control gates passed:

```text
primary runtime-trigger failures = 0
root-score mismatches across primary+boundary = 0
candidate selected move outside frozen D4 TopSet = 0
catastrophic new losses = 0
boundary aggregate node ratio = 914/914 = 1.000 <= 1.10
negative-control trigger failures = 0
negative-control exactness failures = 0
```

Descriptively, pooled primary nodes were `39,869` candidate versus `41,304` baseline, ratio `0.9652576`. This is **not** the prospectively frozen primary acceptance endpoint and cannot rescue the failed median gate.

## Formal engineering decision for PBAI-C004-v1

The prospectively frozen candidate-specific intended-benefit conjunction was not satisfied because:

```text
required median nodes(candidate/baseline) <= 0.95
observed median nodes(candidate/baseline) = 1.00
```

Therefore:

```text
PBAI-C004-v1 = DEVELOPMENT-FAIL / HOLD
development authorization = ENDED
fresh validation = NOT EXECUTED
release holdout = NOT EXECUTED
public adoption = NOT AUTHORIZED
PR #58 = CLOSED WITHOUT MERGE
main/public candidate implementation = unchanged
AI-GEN3 promotion = NOT-AUTHORIZED
```

This is an engineering practical-benefit failure under the frozen v1 contract. It does not change Position Complexity / Difficulty Study 1 from `INCONCLUSIVE`, and it does not establish that all search-instability-aware mechanisms are ineffective.

No same-version rescue is allowed:

```text
mechanism retuning = prohibited
runtime-trigger retuning = prohibited
ordering-placement retuning = prohibited
target/boundary redefinition = prohibited
benefit-threshold retuning = prohibited
post-outcome source-block replacement = prohibited
```

A materially different search-instability engineering mechanism requires a new prospective candidate/version and a new pre-outcome contract.

## Current candidate state

```text
PBAI-C001 = EVIDENCE-AUDIT-READY
PBAI-C002 = HOLD / NON-ESTIMABLE
PBAI-C003 = EVIDENCE-AUDIT-READY
PBAI-C004 = HOLD / DEVELOPMENT-BENEFIT-FAIL
PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

## Next permitted work

A different `EVIDENCE-AUDIT-READY` candidate may be selected only after its Research Generation 1 evidence and production surface are re-audited and its exact mechanism, candidate-specific benefit gate, development population, rollback and no-rescue contract are prospectively frozen before implementation/outcome inspection.

`KEEP-AI-GEN2` remains an acceptable final program outcome.
