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
candidate-specific exact gate contract = NOT-YET-FROZEN / REQUIRED IN PBAI-D BEFORE EACH AUTHORIZATION
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
candidate evidence-audit-ready = 5
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
```

## Canonical naming

- `AI-GEN2` is the current public lineage.
- `AI-GEN2-BASELINE-2026-08-26-v1` is the frozen exact comparison target, not a new lineage.
- `AI-GEN3` remains reserved until explicit `ADOPT` plus actual public-default deployment.
- `legacy`, `bao`, and `bao-v2` are profile/search identifiers, not AI generations.
- Research uses `Research Generation 1` / `Research Generation 2`; those numbers do not map to AI generations.

## Source-of-truth progression

```text
PBAI-A work-start main
= f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8

PBAI-B baseline public-source anchor
= f4ae3b11901180cbe417b3e643e2b357d8045d2d

PBAI-C work-start main after PBAI-B merge
= 0887551fd2e67c6e90c5171465b3354f9042adc4

PBAI-P1 scientific evidence cutoff
= 2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

The scientific cutoff remains immutable. PBAI-B/C engineering documents do not add Research Generation 2 evidence or modify any Research Generation 1 formal result.

## PBAI-A — complete

PBAI-A froze the 14-Study Research Generation 1 evidence core, E1/E2/E3/E4 engineering uses, prohibited inferences, candidate traceability, Research Generation 2 exclusion, and authoritative RAW identity boundary.

Current candidate evidence state:

```text
PBAI-C001 = EVIDENCE-AUDIT-READY
PBAI-C002 = EVIDENCE-AUDIT-READY
PBAI-C003 = EVIDENCE-AUDIT-READY
PBAI-C004 = EVIDENCE-AUDIT-READY
PBAI-C005 = EVIDENCE-AUDIT-READY
```

## PBAI-B — complete

Frozen exact baseline:

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
generationLineage = AI-GEN2
repository source = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public directory = public/
public endpoint = https://bao-la-kiswahili.cultivationdata.net/
baselineFrozen = true
```

Canonical files:

- `BASELINE_SPEC.md`
- `baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`

Public hard settings:

```text
low      D6  / 400ms
standard D8  / 500ms
high     D10 / 600ms
```

Expert settings:

```text
low      D10 / 1500ms
standard D12 / 2000ms
high     D14 / 3000ms
```

Default evaluation is `bao`; hard/expert uses enhanced alpha-beta iterative deepening; adaptive public default is false; quiescence depth is 1; TT max entries are 50,000; hard/expert evaluation cache max is 2,048; PWA cache is `bao-la-kiswahili-v24`.

Current `AI.stateKey` omits `pending` and is therefore not interchangeable with Research Generation 1 authoritative RAW identity. That property is frozen as a baseline boundary, not converted into a retrospective scientific claim.

PBAI-B changed no `public/` asset.

## PBAI-C — global numeric gates frozen

Canonical protocol and machine-readable spec:

```text
BENCHMARK_PROTOCOL.md
benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json
```

The gate freeze occurred while:

```text
candidate implementations = 0
candidate outcomes observed = 0
AUTHORIZED-FOR-DEVELOPMENT = 0
```

### Playing-strength floor

Deterministic paired hard-vs-hard comparison:

```text
maxDepth = 3
timeLimitMs = Infinity
pair = same opening, candidate/baseline swap South/North
```

Validation and release holdout each require:

```text
core observed candidate score >= 0.50
one-sided 95% pair-bootstrap lower bound >= 0.47
each core phase observed score >= 0.48
each seat observed score >= 0.47
each challenge opening stratum observed score >= 0.45
```

Locked validation + holdout requires:

```text
core observed score >= 0.50
one-sided 95% lower bound >= 0.48
each core phase >= 0.49
each seat >= 0.48
```

Bootstrap:

```text
unit = opening pair
replicates = 20,000
analysis seed = 31999991
```

### Decision-quality floor

Fresh roots use a frozen baseline D4 full-window `bao` reference. Validation and holdout each require:

```text
new catastrophic loss count = 0
severe-loss excess <= +0.01
top-set agreement delta >= -0.02
mean normalized rank-loss delta <= +0.02
```

Locked validation + holdout tightens those floors to:

```text
new catastrophic loss count = 0
severe-loss excess <= +0.005
top-set agreement delta >= -0.01
mean normalized rank-loss delta <= +0.01
```

### Operational floor

Same-root/same-host comparison requires:

```text
crash / exception = 0
illegal move = 0
invalid state = 0
median elapsed candidate/baseline <= 1.05
p95 elapsed candidate/baseline <= 1.10
median completed-depth delta >= -1
fraction roots candidate >=2 depths lower <= 0.05
timeout-rate increase <= +0.05
direct/Worker deterministic mismatch = 0
added public static candidate assets <= 524,288 bytes
```

A candidate adding persistent tables/caches must freeze an additional memory budget before implementation.

### Correctness hard gates

```text
public/engine.js frozen SHA must remain unchanged
existing tactical regression failures = 0
candidate-specific regression failures = 0
required relevant test failures = 0
unvalidated symmetry/canonicalization = prohibited
Research Generation 1 RAW identity violation = prohibited
scientifically prohibited inference in implementation/UI = prohibited
```

No playing-strength or operational improvement may compensate for these failures.

### Frozen split / holdout firewall

Core strength blocks, challenge strata, decision-quality root-source blocks and operational root-source blocks are all frozen in the gate spec under engineering seed namespaces `31000001..31801024` with non-overlapping ranges.

Release holdout ranges are reserved but **not authorized to execute** at PBAI-C. Holdout execution requires validation PASS, frozen candidate source/config hash, and explicit PBAI-F authorization. Same-holdout retuning after inspection is prohibited.

### Candidate isolation

Each candidate must be implemented behind an explicit flag/configuration:

```text
feature off = frozen baseline comparator
feature on = exactly one PBAI candidate
public default before adoption = off
```

Combined mechanisms require a separate candidate ID after component ablations.

## Candidate-specific gate still required before implementation

PBAI-C freezes the global floors. It does **not** authorize a generic candidate mechanism.

Before any one candidate becomes `AUTHORIZED-FOR-DEVELOPMENT`, PBAI-D must freeze that candidate's:

- exact mechanism and feature flag;
- intended-benefit endpoint and minimum practical benefit;
- target/control strata;
- candidate-local development/validation/holdout seeds or fixtures;
- runtime/memory budget where applicable;
- failure/rollback contract;
- confirmation that global PBAI-C thresholds remain unchanged.

Candidate-specific rules may add requirements but cannot relax the global PBAI-C gates.

## Current authorization state

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false
PBAI-C003 authorized = false
PBAI-C004 authorized = false
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

## Next required work

**PBAI-D — exact single-candidate contract + development authorization.**

The next candidate must be selected from the evidence-audit-ready registry, receive one exact mechanism/flag and candidate-specific benefit/validation contract, and only then may code be written on an isolated development branch.

No acceptable candidate is also a valid outcome:

```text
KEEP-AI-GEN2
```

## Explicitly not done

- no evaluation-weight change;
- no phase/morphology bonus;
- no tactical C03 production hard-code;
- no adaptive/selective deepening implementation;
- no exact-oracle connection to public AI;
- no score→win-probability conversion;
- no symmetry/canonicalization introduction;
- no release-holdout execution;
- no PBAI-P1-caused public deployment;
- no `AI-GEN3` promotion.
