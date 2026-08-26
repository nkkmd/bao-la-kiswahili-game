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
PBAI-D PBAI-C002-v1 exact contract = COMPLETE / FROZEN
PBAI-E PBAI-C002-v1 development = NON-ESTIMABLE / HOLD
PBAI-C002 development PR #55 = CLOSED WITHOUT MERGE
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
isolated development implementation attempts = 1
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

PBAI-P1 scientific evidence cutoff
= 2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

The scientific cutoff remains unchanged. No Research Generation 2 outcome was imported.

## Frozen baseline and global gates

```text
exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
```

Global strength, decision-quality, operational, correctness, split/holdout and PWA release-safety gates remain unchanged.

## PBAI-C002-v1 isolated development

Research source remains:

```text
Tactical Motifs / Tesuji Study 1
TM-S2-C03 = CONFIRMED
canonical key = 7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba
```

This research decision is unchanged. The engineering candidate tested a much narrower prospective construct: root-only move ordering under feature flag `pbaiC002C03Ordering`, default off, with no extension/evaluation bonus/forced move/depth-time change/cache/engine/config/worker/UI change.

### Pre-metric safety result

The isolated implementation on draft PR #55 passed:

```text
feature default/off baseline equivalence = PASS
root-only C03 trigger boundary = PASS
Namua negative-control exactness = PASS
Mtaji reusablePits>=3 negative-control exactness = PASS
existing engine/AI/evaluation/search/config/worker/tactical regressions = PASS
public surface isolation = PASS
frozen engine hash = PASS
holdout firewall = PASS
public/ai.js size increase = 1325 bytes <= 4096
```

These results authorize only population materialization under the already frozen development block; they do not establish candidate benefit.

## PBAI-C002-v1 development population result

Canonical result:

```text
candidates/PBAI-C002-v1-development-result.json
```

Canonical workflow provenance:

```text
run = 32914807381
job = 98016194190
artifact = 9587768831
artifact ZIP SHA-256 = bbf591baa19bdc33eb2a747e11e8fd390fd0fb33c84efd215cadbd19942d6d16
```

Frozen materialization result:

```text
source seed block = 31300001..31300512
population digest = e016daa0f4669ac7730d34725de16d8c1ff10c398ca07867f47e81df0b399ea7
population support = 128 Namua + 128 Mtaji = 256
historical trajectory candidates = 432
eligible C002 target roots = 5
required minimum estimable target roots = 48
Namua negative controls = 32 / 32
Mtaji reusablePits>=3 negative controls = 32 / 32
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
```

The support gate therefore failed before candidate node/score metrics were executed.

## Formal engineering decision for C002-v1

The prospectively frozen contract required:

```text
minimum estimable development target roots = 48
observed eligible target roots = 5
```

and prohibited replacing the source block or selector after observing support. Therefore:

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit evaluation = NOT EXECUTED
fresh validation = NOT EXECUTED
release holdout = NOT EXECUTED
public adoption = NOT AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

PR #55 was closed without merge. Its isolated development branch is retained as engineering provenance only. `main` and the public path remain the frozen `AI-GEN2` implementation.

This does **not** change the Research Generation 1 scientific result `TM-S2-C03 = CONFIRMED`, and it does not show that C03 is ineffective. It only shows that `PBAI-C002-v1` is not estimable under its prospectively fixed engineering population/endpoint.

No same-version rescue is allowed:

```text
change source block after support observation = prohibited
change selector after support observation = prohibited
retune trigger/order/threshold under PBAI-C002-v1 = prohibited
```

A materially different C002 proposal would require a new prospective version and contract.

## Current candidate state

```text
PBAI-C001 = EVIDENCE-AUDIT-READY
PBAI-C002 = HOLD / NON-ESTIMABLE
PBAI-C003 = EVIDENCE-AUDIT-READY
PBAI-C004 = EVIDENCE-AUDIT-READY
PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
release holdout execution = NOT-AUTHORIZED
```

## Next permitted work

Select a different `EVIDENCE-AUDIT-READY` candidate and freeze its exact mechanism, candidate-specific benefit gate, development population and no-rescue contract before authorization. No candidate code may be merged to `main` merely because isolated tests pass.

`KEEP-AI-GEN2` remains an acceptable final engineering outcome.
