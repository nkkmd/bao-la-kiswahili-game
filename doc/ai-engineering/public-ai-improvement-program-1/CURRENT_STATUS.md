# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Status

```text
PROGRAM = ESTABLISHED
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = COMPLETE
AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C global benchmark / numeric non-regression / release gates = COMPLETE / FROZEN
PBAI-C gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
PBAI-D first exact candidate contract = PBAI-C002-v1 / FROZEN
PBAI-C002 = AUTHORIZED-FOR-DEVELOPMENT after contract merge
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 1
candidate implementations = 0
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

PBAI-D contract-freeze work-start main
= 1cc5377178047e03f9225634c63eae9025480de7

PBAI-P1 scientific evidence cutoff
= 2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

The scientific cutoff remains unchanged. PBAI-D is engineering governance and does not modify any Research Generation 1 formal decision or import Research Generation 2 results.

## Frozen baseline and global gates

PBAI-B exact comparison target:

```text
AI-GEN2-BASELINE-2026-08-26-v1
```

PBAI-C global gate spec:

```text
PBAI-C-GLOBAL-GATES-2026-08-26-v1
```

Global strength, decision-quality, operational, correctness, split/holdout and PWA release-safety gates remain unchanged and cannot be relaxed by a candidate-specific contract.

## PBAI-D candidate selection

The first authorized development candidate is:

```text
PBAI-C002-v1
```

Research evidence source:

```text
Tactical Motifs / Tesuji Study 1
TM-S2-C03 = CONFIRMED
canonical key = 7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba
```

Formal C03 definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move abstraction = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

The engineering contract preserves the interpretation boundary: C03 is a machine-reproducible tactical motif under the frozen research operationalization. It is not established as a forced win, traditional/expert tesuji, human-important move, pedagogical rule or general Bao law. The human/expert follow-up remained `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` and is not negative human evidence.

## PBAI-C002-v1 exact mechanism

Canonical contract:

```text
candidates/PBAI-C002-v1.json
```

Mechanism:

```text
feature flag = pbaiC002C03Ordering
public default = off
allowed public code surface = public/ai.js only
mechanism = move ordering only
selective extension = prohibited
evaluation bonus = prohibited
forced move = prohibited
depth/time-budget change = prohibited
persistent table/cache = prohibited
```

Runtime trigger:

```text
phase = mtaji
actor reusablePits = count of actor's 16 pits with >=2 seeds = 0..2
minimum legal moveVariants = 2
at least one C03 coarse-family legal move
at least one non-C03 legal alternative
C03 family = takata / mtaji / row 1 / direction right / coarse-no-index
```

The research consequence `actorNyumbaSeedsDeltaSign=0` is deliberately **not** used as a runtime trigger. The paired diagnostic definition is also excluded from runtime logic.

Ordering priority is conservative: it may not override immediate-win ordering, enabled TT-first preference or captured-seed ordering. Multiple matching C03 moves receive equal candidate priority, so no post hoc pit-index preference is introduced.

## Candidate-specific benefit gate

Primary intended benefit is fixed-depth D4 search-node efficiency on eligible C03 target roots with feature on versus feature off.

Development and validation require:

```text
median nodes(on/off) <= 0.95
fraction roots candidate nodes <= baseline nodes >= 0.55
```

Release holdout, if later authorized, requires:

```text
median nodes(on/off) <= 0.97
fraction roots candidate nodes <= baseline nodes >= 0.52
```

Target-root semantic hard gates:

```text
root-score mismatch = 0
selected move outside frozen D4 reference top set = 0
catastrophic new loss = 0
```

Target-root counts:

```text
development target = 64, minimum estimable 48
validation target = 128, minimum estimable 96
release-holdout target = 256, minimum estimable 192
```

If support is insufficient, the candidate is `NON-ESTIMABLE/HOLD`; replacement from another seed block after outcome inspection is prohibited.

Negative controls are Namua roots and Mtaji roots with reusablePits >=3. Feature-on must not trigger there and must exactly reproduce feature-off fixed-depth move/root-score/search counters.

## Cost / rollback / no-rescue

```text
additional persistent memory = 0 bytes
additional public/ai.js bytes <= 4096
new public asset = prohibited
mechanism versions under PBAI-C002-v1 = 1
post-outcome trigger retuning = prohibited
post-outcome ordering-placement retuning = prohibited
post-outcome threshold retuning = prohibited
```

Before public adoption, rollback is simply feature-off to the frozen baseline path. Any later public release must also satisfy the PBAI-C PWA cache-version and rollback contract.

## Holdout firewall

```text
release holdout ranges = FROZEN
release holdout execution = NOT-AUTHORIZED
```

Holdout execution still requires:

```text
implementation complete
fresh development checks complete
fresh validation PASS
candidate source/config hash frozen
explicit PBAI-F authorization
```

## Current authorization state

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = true
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 1
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
public AI code changed by PBAI-P1 = false
AI-GEN3 promotion = NOT-AUTHORIZED
```

Authorization does not mean validation or adoption. No public AI implementation is part of the PBAI-D contract-freeze change.

## Next permitted work

After the contract-freeze PR is merged, create an isolated `PBAI-C002-v1` development branch from the resulting `main`, implement only the frozen move-ordering feature behind `pbaiC002C03Ordering` with default `false`, add candidate-specific tests/instrumentation, and run only the authorized development block first.

Validation remains separate and release holdout remains blocked.

A failed or non-estimable candidate is an acceptable engineering result:

```text
KEEP-AI-GEN2
```
