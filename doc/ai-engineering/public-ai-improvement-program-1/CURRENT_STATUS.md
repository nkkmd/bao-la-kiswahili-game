# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Status

```text
PROGRAM = ESTABLISHED
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = COMPLETE
AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN
PBAI-C gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE
PBAI-C004-v1 predevelopment support = PASS (54 >= 48)
PBAI-C004-v1 exact contract = FROZEN ON CONTRACT BRANCH
PBAI-C004 development = AUTHORIZED AFTER CONTRACT MERGE
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 1 after contract merge
active candidate implementations = 0
isolated development implementation attempts = 1
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
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

PBAI-P1 scientific evidence cutoff
= 2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

The scientific cutoff is unchanged. No Research Generation 2 outcome is imported.

## Frozen baseline and global gates

```text
exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
public engine SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public AI SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

Global strength, decision-quality, operational, correctness, split/holdout and PWA release-safety gates remain unchanged.

## Closed candidate — PBAI-C002-v1

The C002 scientific source remains `TM-S2-C03 = CONFIRMED`. The engineering candidate itself is closed because the prospectively frozen development population contained only 5 eligible roots versus the minimum 48.

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
main/public candidate code = 0
```

No source-block, selector, trigger, ordering or threshold rescue is allowed under C002-v1. This does not alter the research result or establish C03 ineffectiveness.

## Selected next candidate — PBAI-C004-v1

Primary Research Generation 1 input is Position Complexity / Difficulty Study 1. Its formal decision remains:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

The engineering use is limited to a reproducible exact search measurement instrument:

```text
D23Instability = exact TopSet_D2 and exact TopSet_D3 are disjoint
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
D2/D3 / bao / quiescenceDepth=1 / infinite time
```

No human-difficulty classifier, general complexity classifier or scientific decision is imported into production logic.

## Predevelopment support result

The support rule and source block were frozen before any C004 implementation. Canonical execution:

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
artifact ZIP SHA-256 = 5012c904789dff9dc9ec4144d2987afcf59ae7e8d7c712ffe1ca76f2e8f23b2e
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
```

Result:

```text
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
historical trajectory candidates = 432
exact D2/D3 TopSet-disjoint = 54
minimum estimable = 48
support gate = PASS
Namua primary targets = 42
Mtaji primary targets = 12
candidate code used = false
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
public code changed = false
```

This is engineering estimability evidence only. It does not resolve the formal Position Complexity Study result.

## Runtime-signal boundary frozen before implementation

The planned runtime signal uses a deterministic selected-root-move change, not exact TopSet computation. The baseline-only probe found:

```text
exact TopSets overlap but deterministic canonical best changes = 5
exact TopSets overlap and deterministic canonical best stays unchanged = 197
```

Therefore C004 prospectively separates:

1. **primary target** — exact D2/D3 TopSet-disjoint roots;
2. **boundary-trigger stratum** — TopSets overlap but deterministic best changes; safety/cost only, no benefit inference;
3. **negative control** — deterministic best unchanged; trigger must remain zero and feature-on/off must be exactly equivalent.

## PBAI-C004-v1 exact mechanism

Canonical contract:

```text
candidates/PBAI-C004-v1.json
```

Mechanism:

```text
feature flag = pbaiC004D23RootTtFirst
public default = false
allowed public code surface = public/ai.js only
mechanism = enhanced-alpha-beta root move ordering only
activation earliest = depth 4
```

Within one `analyzeMove` call, if D2 and D3 both complete without timeout and their deterministic selected root move keys differ, subsequent depths >=4 use the current root TT preferred move as TT-first. Internal nodes remain baseline.

Prohibited:

```text
runtime exact TopSet computation
scientific difficulty/complexity classifier use
extra time or depth budget
evaluation/quiescence changes
persistent cache/table
forced move
engine/config/worker/UI changes
```

## Development gates

Primary target fixed-depth D4 feature-on/off:

```text
median nodes(on/off) <= 0.95
fraction roots candidate nodes <= baseline >= 0.55
feature-on trigger >= 1 per primary target
feature-off trigger = 0
root-score mismatches = 0
selected move outside frozen D4 top set = 0
catastrophic new losses = 0
```

Boundary-trigger stratum:

```text
same semantic hard gates
aggregate node ratio candidate/baseline <= 1.10
no benefit claim
```

Negative controls require zero trigger and exact feature-on/off equality for selected move, root score and the frozen search counters.

Global PBAI-C gates remain mandatory and cannot be relaxed.

## Current authorization boundary

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = true only after this exact-contract change merges
PBAI-C005 authorized = false
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

The contract branch itself contains no candidate implementation and no `public/` change. After merge, create a fresh isolated C004 development branch from the resulting `main`; development benefit/safety must pass before validation becomes authorized. `KEEP-AI-GEN2` remains an acceptable final program outcome.
