# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**完了日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** **PROGRAM COMPLETE / KEEP-AI-GEN2**

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
scientific evidence cutoff = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
next adopted public lineage reserved = AI-GEN3
```

`AI-GEN3`はexplicit `ADOPT` + actual public-default deployment後のみ付与する。PBAI-P1ではその条件は成立しなかったため、public lineageは`AI-GEN2`のままである。

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

No candidate later reached release-candidate status, so release holdout was never authorized or executed.

## 4. Final candidate outcomes

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

### PBAI-C003-v1

Restricted exact-oracle plumbing was stopped before implementation by a prospectively required strict RAW identity gate.

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

This remains consistent with ORISC-STUDY1 `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` and does not revise REWR-STUDY1 `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`.

### PBAI-C004-v1

Search-instability-aware root ordering. Support and safety passed, but the frozen median-node benefit endpoint failed:

```text
median nodes(candidate/baseline) = 1.000 > 0.950
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #58 = CLOSED WITHOUT MERGE
```

Position Complexity / Difficulty Study 1 remains `INCONCLUSIVE`.

### PBAI-C005

Evaluation-semantics sanitation began with the required read-only current-production audit. No public surface was found that presents engine evaluation as validated win probability, win rate, winning chance, calibrated probability or confidence probability.

```text
actionable current production semantics defect = false
implementation = NOT CREATED
PBAI-C005 = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
CLOSED WITHOUT IMPLEMENTATION
```

Canonical:

- [`C005_PRODUCTION_SURFACE_AUDIT.md`](C005_PRODUCTION_SURFACE_AUDIT.md)
- [`candidates/PBAI-C005-production-surface-audit-result.json`](candidates/PBAI-C005-production-surface-audit-result.json)

Position Evaluation / Win-Rate Calibration Study 1 remains `INCONCLUSIVE`; engine score→validated Bao win probability remains unauthorized.

## 5. Final authorization boundary

```text
PBAI-C001 authorized = false / HOLD
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false / HOLD
PBAI-C004 authorized = false / HOLD
PBAI-C005 authorized = false / HOLD
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
public deployments caused by PBAI-P1 = 0
original candidate inventory remaining = 0
AI-GEN3 = RESERVED / NOT-PROMOTED
```

## 6. Final program outcome

All original candidate families have explicit final dispositions. None satisfied the sequence required for public adoption.

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public implementation = frozen AI-GEN2
public AI code changed by PBAI-P1 = false
```

`KEEP-AI-GEN2` is not a failure state; it is the prospectively authorized outcome when no candidate meets the engineering acceptance requirements.

Canonical final report: [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md).

## 7. Scientific boundaries retained

```text
Research Generation 2 evidence
= NOT INCLUDED

engine score -> validated Bao win probability
= NOT AUTHORIZED

machine search complexity -> human difficulty
= NOT AUTHORIZED

machine reply pressure -> human error inducement
= NOT AUTHORIZED

unvalidated symmetry / canonicalization
= NOT AUTHORIZED

current AI.stateKey
= not Research Generation 1 authoritative RAW identity
```

Authoritative RAW identity remains:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

## 8. Canonical program documents

- [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md)
- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`C005_PRODUCTION_SURFACE_AUDIT.md`](C005_PRODUCTION_SURFACE_AUDIT.md)

Future materially different AI engineering work should use a new prospective candidate/program identity and an explicitly new evidence cutoff rather than reopening PBAI-P1 candidate versions.
