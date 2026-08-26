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
PBAI-C001-v1 predevelopment support = PASS (108 >= 32; 64 selected)
PBAI-C001-v1 exact contract = FROZEN ON CONTRACT BRANCH
PBAI-C001-v1 development = AUTHORIZED ONLY AFTER CONTRACT MERGE
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 1 only after C001 contract merge
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

PBAI-C001 contract-freeze work-start main
= 06ef21c5ca3ef1bca90aa37a5ca5d4b2cf262bde

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

Predevelopment support passed (`54 >= 48`) and isolated implementation safety passed. The prospectively frozen primary benefit gate failed:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
median gate = FAIL

fraction candidate nodes <= baseline = 46/54 = 0.8518518519
required >= 0.55
fraction gate = PASS
```

All measured semantic/boundary/control safety gates passed, including root-score mismatches `0`, D4 TopSet violations `0`, catastrophic new losses `0`, boundary aggregate node ratio `1.000`, and negative-control failures `0`.

Canonical development provenance:

```text
run = 32918902388
job = 98028290217
artifact = 9589217604
artifact ZIP SHA-256 = f5552a1b8386cf58a585ea92cd5443f9d306d70630e1ef4afa78fd96404f4e8f
PR #58 = CLOSED WITHOUT MERGE
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
```

Position Complexity / Difficulty Study 1 remains formal `INCONCLUSIVE`; same-version C004 rescue is prohibited.

## Active contract candidate — PBAI-C001-v1

### Research boundary

Primary Research Generation 1 input is Phase Transition Study 1 E-020 / H18:

```text
formal decision = CONFIRMED
scope = hard / bao / depth3 only
observed direction = legacy produced more capture-branch-expansion events than phase2
```

The engineering program does **not** infer:

```text
legacy is stronger = false / unauthorized
legacy chooses better moves = false / unauthorized
capture-branch-expansion improves winning = false / unauthorized
legacy is universally preferable = false / unauthorized
```

C001-v1 is a new engineering hypothesis.

### Predevelopment support firewall and result

The target definition and development source were frozen before implementation or candidate-outcome measurement:

```text
target = nonterminal Namua root
legal moveVariants >= 2
all legal moveVariants type = capture
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
minimum estimable = 32
target maximum = 64
```

Canonical execution:

```text
run = 32952267253
job = 98126097111
artifact = 9600601764
artifact ZIP SHA-256 = b240f1d8ffd0e3e6022db2524d1bbc1204489098def079c7c96a20dcc41a99ce
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
eligible targets = 108
selected targets = 64
support gate = PASS
Mtaji controls selected = 32
Namua non-forced controls selected = 20
candidate implementation observed = false
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
public code changed = false
```

Selected-set bindings:

```text
target refs SHA-256 = aeaccee4052ba12c86d129b53775e3589479ffeac71edf8f0ad39fac81d4d323
Mtaji-control refs SHA-256 = 64c2ade7ced2e8d27b9a3a2747930277afa7a1b7c805eea7a36112c45b1993e9
Namua-non-forced-control refs SHA-256 = 12d3ce9caf882fed077aff64020c065fe835076f06c646360223470bd5d4e77d
```

### Exact mechanism frozen before candidate outcome

Canonical contract:

```text
candidates/PBAI-C001-v1.json
```

Mechanism:

```text
feature flag = pbaiC001NamuaForcedCaptureLegacy
public default = false
levels = hard / expert
allowed public code surface = public/ai.js only
```

For an eligible current root that would otherwise use the enhanced alpha-beta family, feature ON routes only that `analyzeMove` call through the already-existing legacy iterative-deepening alpha-beta branch.

Explicit `mcts` remains MCTS; explicit `legacy` remains legacy; easy/normal are unaffected.

Prohibited:

```text
scientific CBE classifier lookup
trajectory-history or future-outcome trigger
new search algorithm
extra depth/time budget
evaluation profile/weight changes
quiescence parameter changes
persistent cache/table
forced move
engine/config/worker/UI changes
```

### Frozen development benefit gate

Primary target = frozen 64 eligible roots.

Candidate and baseline:

```text
hard / bao / maxDepth=3 / timeLimitMs=Infinity
```

Independent reference:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
bao / D4 / quiescenceDepth=1 / infinite time
```

Required:

```text
TopSet agreement delta candidate-baseline >= +0.05
mean normalized rank-loss delta candidate-baseline <= -0.02
severe-loss-rate excess <= 0
catastrophic new losses = 0
median search-work ratio <= 1.50
fraction roots with search-work ratio >2 <= 0.10
```

Search work is `stats.nodes + stats.quiescenceNodes`.

Feature-ON Mtaji and Namua-non-forced controls must not trigger and must preserve feature-OFF selected move, rootScore and completedDepth.

Validation and release-holdout population selectors/minimum support are frozen in the exact contract, but those seed blocks remain inaccessible now.

## Current authorization boundary

```text
PBAI-C001 authorized = true only after exact-contract merge
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 1 only after C001 contract merge
active candidate implementation = 0
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
public/main candidate implementations = 0
AI-GEN3 promotion = NOT-AUTHORIZED
```

After the exact-contract PR merges, create a fresh isolated C001 development branch from the resulting `main`. Development failure or non-estimability closes/HOLDs v1 without same-version rescue. `KEEP-AI-GEN2` remains an acceptable final program outcome.
