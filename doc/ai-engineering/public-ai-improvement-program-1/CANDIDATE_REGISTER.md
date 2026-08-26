# PBAI-P1 Candidate Register

Status: **PBAI-C002-v1 HOLD / PBAI-C004-v1 HOLD / PBAI-C001-v1 SUPPORT PASS + EXACT CONTRACT FROZEN**

Canonical controls:

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
C001 support spec = candidates/PBAI-C001-v1-predevelopment-support-spec.json
C001 support result = candidates/PBAI-C001-v1-predevelopment-support-result.json
C001 contract = candidates/PBAI-C001-v1.json
C002 contract = candidates/PBAI-C002-v1.json
C002 result = candidates/PBAI-C002-v1-development-result.json
C004 support spec = candidates/PBAI-C004-v1-predevelopment-support-spec.json
C004 support result = candidates/PBAI-C004-v1-predevelopment-support-result.json
C004 contract = candidates/PBAI-C004-v1.json
C004 result = candidates/PBAI-C004-v1-development-result.json
```

Candidate status vocabulary:

```text
PROPOSED
EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT
DEVELOPMENT-ONLY
VALIDATION-READY
RELEASE-CANDIDATE
ADOPTED
REJECTED
HOLD
WITHDRAWN
```

## Current candidate states

| ID | Candidate family | Research Generation 1 basis | Current status | Key boundary |
| --- | --- | --- | --- | --- |
| `PBAI-C001` | Phase/search-aware root search routing | bounded phase/search dependence; E-020/H18 fixed-condition search-profile result | **`AUTHORIZED-FOR-DEVELOPMENT` after exact-contract merge** | new engineering hypothesis only; no claim that legacy is stronger/better; feature default off; `public/ai.js` only |
| `PBAI-C002` | `TM-S2-C03`-aware move ordering | `TM-S2-C03` machine-confirmed motif | **`HOLD / NON-ESTIMABLE`** | v1 target support 5 < frozen minimum 48; PR #55 closed without merge; no same-version rescue |
| `PBAI-C003` | Restricted exact-oracle lookup plumbing | exact 8-state domain plus ORISC RAW-binding constraints | `EVIDENCE-AUDIT-READY` | exact-domain membership only; strict RAW key including `pending`; zero false hits and fallback required |
| `PBAI-C004` | Search-instability-aware root ordering | reproducible exact D2/D3 search measurement; Position Complexity Study formal `INCONCLUSIVE` | **`HOLD / DEVELOPMENT-BENEFIT-FAIL`** | v1 passed support/safety but failed frozen median-node benefit gate; PR #58 closed without merge; no same-version rescue |
| `PBAI-C005` | Evaluation semantics sanitation | Calibration Study 1 `INCONCLUSIVE`; score is not validated probability | `EVIDENCE-AUDIT-READY` | no score→win-probability mapping; decision behavior changes require separate prospective authorization |

## PBAI-C001-v1 predevelopment support

The support rule and source block were frozen before candidate implementation or candidate outcome inspection.

Eligibility:

```text
nonterminal
phase = namua
legal moveVariants >= 2
all legal moveVariants type = capture
```

Canonical baseline-only execution:

```text
run = 32952267253
job = 98126097111
artifact = 9600601764
artifact ZIP SHA-256 = b240f1d8ffd0e3e6022db2524d1bbc1204489098def079c7c96a20dcc41a99ce
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
population = 128 Namua + 128 Mtaji = 256
eligible targets = 108
selected development targets = 64
minimum estimable = 32
support gate = PASS
Mtaji controls selected = 32
Namua non-forced controls available/selected = 20/20
candidate code used = false
candidate benefit metrics observed = false
validation/holdout seeds accessed = false
```

Selection bindings:

```text
target refs SHA-256 = aeaccee4052ba12c86d129b53775e3589479ffeac71edf8f0ad39fac81d4d323
Mtaji-control refs SHA-256 = 64c2ade7ced2e8d27b9a3a2747930277afa7a1b7c805eea7a36112c45b1993e9
Namua-non-forced-control refs SHA-256 = 12d3ce9caf882fed077aff64020c065fe835076f06c646360223470bd5d4e77d
```

This is engineering estimability evidence only. It does not show that legacy search is stronger, selects better moves, or improves winning chances.

## PBAI-C001-v1 exact mechanism

```text
feature flag = pbaiC001NamuaForcedCaptureLegacy
public default = false
levels = hard / expert
allowed public source surface = public/ai.js only
```

For an eligible current root that would otherwise use the enhanced alpha-beta family, feature ON routes that single `analyzeMove` call through the already-existing legacy iterative-deepening alpha-beta branch.

Explicit `mcts` remains MCTS; explicit `legacy` remains legacy; easy/normal are unaffected.

Not authorized:

```text
scientific CBE classifier lookup
trajectory-history/future-outcome trigger
new search algorithm
extra depth or time budget
evaluation profile/weight change
quiescence parameter change
persistent cache/table
forced move
engine/config/worker/UI change
```

### Frozen intended-benefit gate

Development target = frozen 64 eligible roots. Candidate and baseline use:

```text
hard / bao / maxDepth=3 / timeLimitMs=Infinity
```

Reference = frozen independent exact-full-window D4 `bao` root-candidate reference.

Required development result:

```text
TopSet agreement delta candidate-baseline >= +0.05
mean normalized rank-loss delta candidate-baseline <= -0.02
severe-loss-rate excess <= 0
catastrophic new losses = 0
median search-work ratio <= 1.50
fraction roots with search-work ratio >2 <= 0.10
```

Search work is `stats.nodes + stats.quiescenceNodes`.

Mtaji and Namua-non-forced feature-ON controls must not trigger and must preserve feature-OFF selected move, rootScore and completedDepth.

Validation and release-holdout target selectors and minimum support are frozen in `candidates/PBAI-C001-v1.json` but **neither future block is authorized for access now**.

## Closed candidate — PBAI-C002-v1

```text
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji = 256
eligible targets = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
```

This engineering result does not change `TM-S2-C03 = CONFIRMED` and does not establish that C03 is ineffective.

## Closed candidate — PBAI-C004-v1

Predevelopment support passed with 54 exact D2/D3 TopSet-disjoint roots. Its isolated root-ordering implementation then passed premetric safety but failed the frozen primary practical-benefit gate:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
median gate = FAIL

fraction candidate nodes <= baseline = 46/54 = 0.8518518519
required >= 0.55
fraction gate = PASS
```

All frozen semantic/boundary/control safety gates passed, including root-score mismatches `0`, selected move outside frozen D4 TopSet `0`, catastrophic new losses `0`, boundary aggregate node ratio `1.000`, and negative-control failures `0`.

Descriptive pooled primary node ratio `39869/41304 = 0.9652576` was not the primary endpoint and cannot rescue the failed median gate.

Canonical development provenance:

```text
run = 32918902388
job = 98028290217
artifact = 9589217604
artifact ZIP SHA-256 = f5552a1b8386cf58a585ea92cd5443f9d306d70630e1ef4afa78fd96404f4e8f
candidate branch head = 992130acdd4f58180045291bb6bc540f9bc3c0ba
PR #58 = CLOSED WITHOUT MERGE
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
```

This does not alter Position Complexity / Difficulty Study 1 from `INCONCLUSIVE` and does not establish that all search-instability-aware mechanisms are ineffective.

## No-rescue / holdout firewall

```text
C001 same-version mechanism/trigger/population/threshold retuning after outcome = prohibited
C002 same-version rescue = prohibited
C004 same-version mechanism/trigger/order/target/boundary/threshold rescue = prohibited
validation execution = NOT-AUTHORIZED until the active candidate passes development
release holdout execution = NOT-AUTHORIZED
public adoption = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

## Current authorization state

```text
PBAI-C001 authorized = true only after exact-contract merge
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 1 after C001 contract merge
active candidate implementation = 0
isolated development implementation attempts = 2
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

After the C001 exact-contract change merges, the only permitted next candidate implementation is a fresh isolated `PBAI-C001-v1` development branch from the resulting `main`. `KEEP-AI-GEN2` remains a valid program outcome.
