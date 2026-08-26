# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** PBAI-A/B/C COMPLETE / **C002 HOLD / C004 HOLD** / no candidate currently authorized / public AI unchanged

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
closed candidate = PBAI-C002-v1 / NON-ESTIMABLE / HOLD
closed candidate = PBAI-C004-v1 / DEVELOPMENT-BENEFIT-FAIL / HOLD
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

`TM-S2-C03 = CONFIRMED`をengineering inputとしたmove-ordering-only candidate。Isolated implementation safety checksはPASSしたが、prospectively frozen development populationでeligible targetが5件しかなく、minimum 48に達しなかった。

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

Primary engineering inputはPosition Complexity / Difficulty Study 1の**reproducible exact D2/D3 search measurement**である。Studyのformal decision自体は`INCONCLUSIVE`のまま維持する。

### Predevelopment support

Candidate implementation前にsupport ruleをfreezeし、PBAI-C development blockだけをbaseline-onlyで測定した。

```text
population = 128 Namua + 128 Mtaji = 256
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
exact TopSet-disjoint primary roots = 54
minimum estimable = 48
SUPPORT = PASS
boundary overlap-but-canonical-best-changed = 5
stable-best control support = 197
candidate code used = false
candidate benefit metrics observed = false
```

Canonical:

- [`candidates/PBAI-C004-v1-predevelopment-support-spec.json`](candidates/PBAI-C004-v1-predevelopment-support-spec.json)
- [`candidates/PBAI-C004-v1-predevelopment-support-result.json`](candidates/PBAI-C004-v1-predevelopment-support-result.json)
- [`candidates/PBAI-C004-v1.json`](candidates/PBAI-C004-v1.json)

### Exact v1 mechanism tested

```text
feature = pbaiC004D23RootTtFirst
public default = off
allowed public source surface = public/ai.js only
mechanism = enhanced-alpha-beta root TT-best-first ordering after completed D2→D3 selected-best change
activation earliest = D4
internal-node ordering = unchanged
```

Runtime exact TopSet computation、scientific human-difficulty/general-complexity classifier、extra time/depth、evaluation/quiescence change、persistent cache/table、forced move、engine/config/worker/UI changeは認可しなかった。

The candidate was implemented only on isolated PR #58 and never merged to `main`.

### Premetric safety

D4 benefitを観測する前に以下をPASSした。

```text
source-surface / frozen engine / size budget = PASS
feature-off exact baseline behavior = PASS
existing engine/AI/evaluation/search/config/worker/tactical regressions = PASS
validation/holdout firewall = PASS
54 primary runtime-trigger coverage = PASS
32 stable-best controls trigger=0 = PASS
D3 feature-on/off exactness = PASS
```

### Frozen D4 result

Primary candidate-specific benefit gateはconjunctionであり、median node ratioとfraction non-worseの双方を必要とした。

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
=> FAIL

fraction roots candidate nodes <= baseline = 46/54 = 0.8518518519
required >= 0.55
=> PASS
```

Measured semantic/boundary/control gatesはすべてPASSした。

```text
root-score mismatch = 0
candidate outside frozen D4 TopSet = 0
catastrophic new loss = 0
primary trigger failure = 0
boundary aggregate node ratio = 1.000 <= 1.10
negative-control trigger failure = 0
negative-control exactness failure = 0
```

Pooled primary nodesはcandidate `39,869`、baseline `41,304`、ratio `0.9652576`だったが、これは事前固定primary acceptance endpointではないためmedian failureを救済しない。

Canonical development result: [`candidates/PBAI-C004-v1-development-result.json`](candidates/PBAI-C004-v1-development-result.json)

Provenance:

```text
run = 32918902388
job = 98028290217
artifact = 9589217604
artifact ZIP SHA-256 = f5552a1b8386cf58a585ea92cd5443f9d306d70630e1ef4afa78fd96404f4e8f
PR #58 = CLOSED WITHOUT MERGE
```

Therefore:

```text
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
validation = NOT EXECUTED
release holdout = NOT EXECUTED
public adoption = NOT AUTHORIZED
AI-GEN3 = NOT-AUTHORIZED
```

The result does not revise Position Complexity / Difficulty Study 1 (`INCONCLUSIVE`) and does not show that every search-instability mechanism is ineffective. It only closes the prospectively frozen v1 engineering mechanism. Same-version mechanism/trigger/order/target/boundary/threshold rescue is prohibited.

## 6. Program flow

```text
PBAI-A  Research Generation 1 evidence audit                    COMPLETE
PBAI-B  AI-GEN2 exact public baseline freeze                    COMPLETE
PBAI-C  global numeric benchmark/release-gate freeze            COMPLETE
C002    isolated candidate                                      NON-ESTIMABLE / HOLD
C004-D  predevelopment support + exact contract                 COMPLETE
C004-E  isolated development                                    BENEFIT-GATE FAIL / HOLD
NEXT    different EVIDENCE-AUDIT-READY candidate                NOT YET AUTHORIZED
PBAI-F  fresh validation                                        NOT REACHED
release holdout                                                 NOT AUTHORIZED
```

## 7. Current authorization boundary

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementation = 0
isolated development implementation attempts = 2
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

The current public implementation remains frozen `AI-GEN2`; no PBAI candidate implementation has been merged to `main`.

The next permitted operation is evidence audit and prospective contract freeze for a different candidate. Failure, non-estimability or lack of practical benefit are valid outcomes; `KEEP-AI-GEN2` remains acceptable.
