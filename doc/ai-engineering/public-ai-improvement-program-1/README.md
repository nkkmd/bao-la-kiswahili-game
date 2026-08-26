# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** PBAI-A/B/C COMPLETE / **C001 HOLD / C002 HOLD / C004 HOLD / no candidate authorized** / public AI unchanged

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
closed candidate = PBAI-C001-v1 / DEVELOPMENT-BENEFIT-FAIL / HOLD
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

## 4. Closed candidate — PBAI-C001-v1

Primary engineering input was Phase Transition Study 1 E-020/H18 (`CONFIRMED` only within its fixed scientific scope). C001 prospectively tested a new engineering-only hypothesis: on nonterminal Namua roots with at least two legal variants and all variants captures, route hard/expert enhanced-family search through the existing legacy branch. Public default remained off and only isolated `public/ai.js` was modified.

Baseline-only support passed (`108 >= 32`, 64 frozen targets), then premetric trigger/control/regression safety passed before benefit inspection. Binding D4-reference development results were:

```text
TopSet agreement delta = +0.015625; required >= +0.05 => FAIL
mean normalized rank-loss delta = -0.011718750000000028; required <= -0.02 => FAIL
severe-loss-rate excess = +0.015625; required <= 0 => FAIL
catastrophic new losses = 0 => PASS
median search-work ratio = 0.2772631454984396; required <= 1.50 => PASS
fraction roots with search-work ratio >2 = 0; required <= 0.10 => PASS
```

The efficiency gain cannot compensate for failed decision-quality gates because the contract is conjunctive.

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #61 = CLOSED WITHOUT MERGE
validation = NOT EXECUTED
release holdout = NOT EXECUTED
public/main implementation = unchanged
same-version rescue = prohibited
```

Canonical result: [`candidates/PBAI-C001-v1-development-result.json`](candidates/PBAI-C001-v1-development-result.json)

This engineering failure does not alter Phase Transition Study 1 E-020/H18 and does not establish a universal preference for or against legacy search.

## 5. Closed candidate — PBAI-C002-v1

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

## 6. Closed candidate — PBAI-C004-v1

Position Complexity / Difficulty Study 1のreproducible D2/D3 search measurementをengineering inputとしたroot-ordering candidate。Studyのformal decisionは`INCONCLUSIVE`のまま維持する。

Predevelopment supportは54/48でPASSし、isolated implementationのpremetric safetyもPASSしたが、frozen D4 practical-benefit median-node gate `1.000 <= 0.950` がFAILした。Measured semantic/boundary/control gatesは全PASSしたが、primary endpoint failureは救済しない。

Canonical result: [`candidates/PBAI-C004-v1-development-result.json`](candidates/PBAI-C004-v1-development-result.json)

```text
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #58 = CLOSED WITHOUT MERGE
validation = NOT EXECUTED
release holdout = NOT EXECUTED
public/main implementation = unchanged
```

## 7. Remaining candidate inventory

```text
PBAI-C003 = EVIDENCE-AUDIT-READY
  restricted exact-oracle lookup plumbing
  strict RAW identity including pending required
  exact support only within frozen 8-state domain

PBAI-C005 = EVIDENCE-AUDIT-READY
  evaluation semantics sanitation
  no score-to-win-probability claim permitted
```

Neither candidate is authorized for implementation. A prospective support/contract step is required before any new candidate code.

## 8. Program flow and authorization

```text
PBAI-A  Research Generation 1 evidence audit                    COMPLETE
PBAI-B  AI-GEN2 exact public baseline freeze                    COMPLETE
PBAI-C  global numeric benchmark/release-gate freeze            COMPLETE
C002    isolated candidate                                      NON-ESTIMABLE / HOLD
C004    isolated candidate                                      DEVELOPMENT-BENEFIT-FAIL / HOLD
C001    isolated candidate                                      DEVELOPMENT-BENEFIT-FAIL / HOLD
PBAI-F  fresh validation                                        NOT AUTHORIZED
release holdout                                                 NOT AUTHORIZED
```

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementation = 0
public/main candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

The current public implementation remains frozen `AI-GEN2`; no PBAI candidate implementation has been merged to `main`. `KEEP-AI-GEN2` remains an acceptable final program outcome.
