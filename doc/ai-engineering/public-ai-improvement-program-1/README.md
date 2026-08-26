# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** PBAI-A/B/C COMPLETE / **C001 HOLD / C002 HOLD / C003 HOLD / C004 HOLD / C005 not authorized** / public AI unchanged

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
closed candidate = PBAI-C001-v1 / DEVELOPMENT-BENEFIT-FAIL / HOLD
closed candidate = PBAI-C002-v1 / NON-ESTIMABLE / HOLD
closed candidate = PBAI-C003-v1 / NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
closed candidate = PBAI-C004-v1 / DEVELOPMENT-BENEFIT-FAIL / HOLD
remaining candidate = PBAI-C005 / EVIDENCE-AUDIT-READY / NOT AUTHORIZED
next adopted public lineage reserved = AI-GEN3
```

`AI-GEN3`はexplicit `ADOPT` + actual public-default deployment後のみ付与する。

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

Release holdout execution remains **NOT-AUTHORIZED**.

## 4. Candidate outcomes

### PBAI-C001-v1

Phase/search-aware legacy-routing hypothesis. Baseline-only support and premetric safety passed. Search work fell strongly, but three prospectively frozen decision-quality benefit gates failed.

```text
TopSet delta = +0.015625 < +0.05 => FAIL
rank-loss delta = -0.01171875 > -0.02 => FAIL
severe-loss excess = +0.015625 > 0 => FAIL
catastrophic new losses = 0 => PASS
median search-work ratio = 0.2772631455 => PASS
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #61 = CLOSED WITHOUT MERGE
```

Phase Transition Study 1 E-020/H18 remains unchanged.

### PBAI-C002-v1

`TM-S2-C03` move-ordering candidate. Frozen target support was insufficient:

```text
eligible targets = 5
minimum estimable = 48
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
PR #55 = CLOSED WITHOUT MERGE
```

`TM-S2-C03 = CONFIRMED` remains unchanged.

### PBAI-C004-v1

Search-instability-aware root ordering. Support and safety passed, but the frozen median-node benefit endpoint failed:

```text
median nodes(candidate/baseline) = 1.000 > 0.950
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #58 = CLOSED WITHOUT MERGE
```

Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

### PBAI-C003-v1

Restricted exact-oracle plumbing was stopped before implementation by a prospectively required strict RAW identity gate.

Frozen support question:

```text
512 deterministic development trajectories
seeds = 31300001..31300512
max plies = 160
support = natural visit to >=1 nonterminal state in frozen 8-state REWR domain
identity = pits,reserve,houseOwned,player,phase,winner,pending
AI.stateKey / symmetry / seat/reflection canonicalization / missing-pending coercion = prohibited
```

Binding result:

```text
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
known affected rows = 3
identity difference = pending
reachability measurement executed = false
hit count = unmeasured / null
zero-hit conclusion = NOT AUTHORIZED
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
PR #63 = CLOSED WITHOUT MERGE
```

This is consistent with the already-completed ORISC-STUDY1 result `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`; it is not a new scientific finding and does not revise REWR-STUDY1 `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`.

Canonical:

- [`candidates/PBAI-C003-v1-predevelopment-support-spec.json`](candidates/PBAI-C003-v1-predevelopment-support-spec.json)
- [`candidates/PBAI-C003-v1-predevelopment-support-result.json`](candidates/PBAI-C003-v1-predevelopment-support-result.json)

## 5. Remaining candidate — PBAI-C005

```text
candidate family = evaluation semantics sanitation
scientific basis = Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
engine score -> validated Bao win probability = NOT ESTABLISHED
current authorization = NONE
```

The next permitted step is a **read-only current production-surface audit**. Inspect `public/` code/UI/diagnostic surfaces to determine whether the current product actually presents engine evaluation as a win probability or otherwise violates the calibration boundary.

Do not implement C005 merely because the research study was inconclusive. If no current semantics problem exists, close/hold C005 without a code candidate. If a concrete current problem exists, freeze a new exact prospective C005 contract and candidate-specific benefit/correctness criteria before implementation.

## 6. Current authorization boundary

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementation = 0
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

The current public implementation remains frozen `AI-GEN2`; no PBAI candidate implementation has been merged to `main`. `KEEP-AI-GEN2` remains an acceptable final program outcome.

## 7. Restart entry point

For continuation in a new chat/session:

1. retrieve and record current remote `main` HEAD;
2. read [`RESUME_HERE.md`](RESUME_HERE.md) first;
3. verify the frozen AI-GEN2 hashes and that authorization remains zero;
4. begin with the C005 read-only production-surface audit, not implementation.
