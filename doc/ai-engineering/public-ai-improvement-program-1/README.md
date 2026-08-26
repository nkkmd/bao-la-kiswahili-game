# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** PBAI-A/B/C COMPLETE / **C002 HOLD / C004 HOLD / C001 SUPPORT PASS + EXACT CONTRACT FROZEN** / public AI unchanged

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
closed candidate = PBAI-C002-v1 / NON-ESTIMABLE / HOLD
closed candidate = PBAI-C004-v1 / DEVELOPMENT-BENEFIT-FAIL / HOLD
active exact contract = PBAI-C001-v1
next adopted public lineage reserved = AI-GEN3
```

`AI-GEN3`はcandidate authorization、development、validation、release-candidate作成だけでは付与しない。Explicit `ADOPT` + actual public-default deployment後のみpromotionする。

## 3. Completed prerequisites

### PBAI-A — Research Generation 1 evidence audit

14-Study evidence core、engineering-use tier、prohibited inference、Research Generation 2 exclusion、RAW identity boundaryをfreezeした。

Canonical: [`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md)

### PBAI-B — exact AI-GEN2 baseline

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
baseline public-source commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

Exact public source hashes、rules binding、evaluation/search/config、Worker/fallback、PWA/cache semanticsをfreezeした。

### PBAI-C — global engineering gates

Candidate implementation/outcomeが0の状態でstrength / decision-quality / operational / correctness / holdout gatesをfreezeした。

Canonical:

- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)

Release-holdout ranges are frozen but execution remains **NOT-AUTHORIZED**.

## 4. Closed candidate — PBAI-C002-v1

`TM-S2-C03 = CONFIRMED`をengineering inputとしたmove-ordering-only candidate。Prospectively frozen development populationでeligible targetが5件しかなく、minimum 48に達しなかった。

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
public/main implementation = unchanged
```

Scientific `TM-S2-C03 = CONFIRMED`は変更しない。同versionのpopulation/trigger/threshold rescueは禁止する。

Canonical result: [`candidates/PBAI-C002-v1-development-result.json`](candidates/PBAI-C002-v1-development-result.json)

## 5. Closed candidate — PBAI-C004-v1

Position Complexity / Difficulty Study 1のreproducible D2/D3 search measurementをengineering inputとしたroot-ordering candidate。Studyのformal decisionは`INCONCLUSIVE`のまま維持する。

Predevelopment supportは54/48でPASSし、isolated implementationのpremetric safetyもPASSしたが、frozen D4 practical-benefit gateは:

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL

fraction candidate nodes <= baseline = 46/54 = 0.8518518519
required >= 0.55
=> PASS
```

Measured semantic/boundary/control gatesは全PASSした。Pooled node ratio `0.9652576`はprimary endpointではないため救済に使わない。

Canonical result: [`candidates/PBAI-C004-v1-development-result.json`](candidates/PBAI-C004-v1-development-result.json)

```text
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #58 = CLOSED WITHOUT MERGE
validation = NOT EXECUTED
release holdout = NOT EXECUTED
public/main implementation = unchanged
```

同versionのmechanism/trigger/order/target/boundary/threshold rescueは禁止する。

## 6. Active exact contract — PBAI-C001-v1

Primary engineering inputはPhase Transition Study 1 E-020/H18である。

```text
formal decision = CONFIRMED
scope = hard / bao / depth3 only
scientific observation = legacy produced more capture-branch-expansion events than phase2
```

PBAI-P1はこれを「legacyが強い」「より良い手を選ぶ」「勝率が高い」と解釈しない。C001-v1は独立したengineering hypothesisである。

### Predevelopment support

Candidate implementation前にtarget/source/minimumをfreezeした。

```text
target = nonterminal Namua root
legal moveVariants >= 2
all legal moveVariants type = capture
source block = 31300001..31300512
population = 128 Namua + 128 Mtaji
minimum estimable = 32
target maximum = 64
```

Baseline-only result:

```text
run = 32952267253
job = 98126097111
artifact = 9600601764
artifact ZIP SHA-256 = b240f1d8ffd0e3e6022db2524d1bbc1204489098def079c7c96a20dcc41a99ce
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
eligible targets = 108
selected targets = 64
support = PASS
candidate code used = false
candidate benefit metrics observed = false
validation/holdout accessed = false
```

Canonical:

- [`candidates/PBAI-C001-v1-predevelopment-support-spec.json`](candidates/PBAI-C001-v1-predevelopment-support-spec.json)
- [`candidates/PBAI-C001-v1-predevelopment-support-result.json`](candidates/PBAI-C001-v1-predevelopment-support-result.json)
- [`candidates/PBAI-C001-v1.json`](candidates/PBAI-C001-v1.json)

### Exact mechanism

```text
feature = pbaiC001NamuaForcedCaptureLegacy
public default = off
levels = hard / expert
allowed public source surface = public/ai.js only
```

For an eligible current root that would otherwise use the enhanced alpha-beta family, feature ON routes only that `analyzeMove` call through the already-existing legacy iterative-deepening alpha-beta branch.

Explicit MCTS and explicit legacy semantics remain unchanged; easy/normal remain unchanged.

Not authorized:

```text
scientific CBE classifier
trajectory-history/future-outcome trigger
new search algorithm
extra depth/time budget
evaluation profile/weight change
quiescence parameter change
persistent cache/table
forced move
engine/config/worker/UI change
```

### Frozen intended-benefit gate

Development uses the frozen 64 primary roots:

```text
candidate/baseline = hard / bao / D3 / infinite time
reference = independent frozen exact-full-window D4 bao
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

Mtaji and Namua-non-forced controls must not trigger and must preserve feature-off move/rootScore/completedDepth.

Validation and release-holdout selectors/minimum support are frozen prospectively but remain inaccessible now.

## 7. Program flow

```text
PBAI-A  Research Generation 1 evidence audit                    COMPLETE
PBAI-B  AI-GEN2 exact public baseline freeze                    COMPLETE
PBAI-C  global numeric benchmark/release-gate freeze            COMPLETE
C002    isolated candidate                                      NON-ESTIMABLE / HOLD
C004    isolated candidate                                      DEVELOPMENT-BENEFIT-FAIL / HOLD
C001-D  baseline-only support + exact contract                  SUPPORT PASS / FROZEN
C001-E  isolated development                                    NEXT AFTER CONTRACT MERGE
PBAI-F  fresh validation                                        NOT AUTHORIZED YET
release holdout                                                 NOT AUTHORIZED
```

## 8. Current authorization boundary

```text
PBAI-C001 authorized = true only after exact-contract merge
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 1 only after C001 contract merge
active candidate implementation = 0
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

The current public implementation remains frozen `AI-GEN2`; no PBAI candidate implementation has been merged to `main`.

After the C001 contract merges, only a fresh isolated C001-v1 development branch may implement the candidate. Failure, non-estimability or lack of practical benefit remain valid outcomes; `KEEP-AI-GEN2` remains acceptable.
