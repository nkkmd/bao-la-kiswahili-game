# PBAI-P1 — FINAL CHECKPOINT / RESUME HERE

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
Status: **PROGRAM COMPLETE / KEEP-AI-GEN2**

This file is the canonical restart entry point if PBAI-P1 is reviewed later. The Program is closed; it has no pending candidate-development task.

## 1. Final source state

PBAI-C005 read-only audit began from:

```text
remote main = 7f3ea339f7eec0668c641774eb6c2dcd37040a38
scientific evidence cutoff = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
Research Generation 2 evidence included = false
```

After the final closure PR is merged, the resulting remote `main` is the final repository source of truth. Always retrieve it before any later review.

## 2. Final read order

For a later audit/review, read in this order:

1. `doc/ai-engineering/public-ai-improvement-program-1/RESUME_HERE.md`
2. `doc/ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md`
3. `doc/ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`
4. `doc/ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`
5. `doc/ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`
6. `doc/ai-engineering/public-ai-improvement-program-1/C005_PRODUCTION_SURFACE_AUDIT.md`
7. `doc/ai-engineering/public-ai-improvement-program-1/README.md`
8. `doc/ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`
9. `doc/ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`
10. `doc/ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`
11. `doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`

## 3. Final candidate dispositions

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PBAI-C005 = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD / CLOSED WITHOUT IMPLEMENTATION

original candidate inventory remaining = 0
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
public adoption = NONE
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

Canonical candidate files include:

```text
candidates/PBAI-C001-v1-development-result.json
candidates/PBAI-C002-v1-development-result.json
candidates/PBAI-C003-v1-predevelopment-support-spec.json
candidates/PBAI-C003-v1-predevelopment-support-result.json
candidates/PBAI-C004-v1-development-result.json
candidates/PBAI-C005-production-surface-audit-result.json
```

## 4. C005 final closure

C005 asked whether the current public product/code/diagnostics actually represented engine evaluation as a validated win probability or similar probability/confidence quantity.

The read-only audit found:

```text
user-facing engine evaluation display = absent
user-facing win-probability display = absent
score -> probability conversion = absent
diagnostic rootScore export = absent
probability/confidence terminology in public/ = absent for audited terms
actionable current production semantics defect = false
```

Internal `score` variables remain internal heuristic/search/diagnostic quantities and were not found to carry prohibited win-probability semantics.

Therefore:

```text
PBAI-C005
= NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
= CLOSED WITHOUT IMPLEMENTATION
```

No exact correction contract was needed because there was no demonstrated defect to correct.

## 5. C003 boundary retained

C003-v1 did **not** measure practical reachability because the strict RAW identity precondition failed first.

```text
support workflow run = 32960056255
job = 98150197902
support branch head = 3a91ba211263de37115e0e22ad857df3f2e6b142
PR #63 = CLOSED WITHOUT MERGE
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
reachability measurement executed = false
hit count = null / unmeasured
zero-hit conclusion = NOT AUTHORIZED
```

First observed binding mismatch:

```text
stored = 469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
strict RAW recomputed = 7849cf1069ca9c966d111bb83a1fb36915abedb4a8533083778fb67f71a39a70
identity difference = pending
```

This remains consistent with ORISC-STUDY1 and does not revise REWR-STUDY1.

## 6. Standing scientific boundaries

- Position Evaluation / Win-Rate Calibration Study 1 = `INCONCLUSIVE`; no engine score -> validated Bao win probability.
- Position Complexity / Difficulty Study 1 = `INCONCLUSIVE`; machine search complexity is not human difficulty.
- Tactical Motif Human / Expert Validation Study 1 = `INCONCLUSIVE-NOT-ESTIMABLE`, N=0.
- Restricted Endgame Study 1 exactness is only for the frozen 8-state domain.
- ORISC-STUDY1 Axis A = representation integrity NOT-CONFIRMED; no symmetry/canonicalization authorization.
- Research Generation 2 is separate and was not incrementally fed into PBAI-P1.

Authoritative Research Generation 1 RAW state identity:

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
```

Current `AI.stateKey` omits `pending`; it is not a research-derived exact-tablebase key.

## 7. Final program outcome

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
public AI code changed by PBAI-P1 = false
PBAI-P1 public releases = 0
Research Generation 2 evidence included = false
```

No release holdout was consumed because no candidate reached release-candidate status.

## 8. Future-work rule

PBAI-P1 has no next candidate task. Do not reopen same-version candidates to rescue their outcomes.

A materially different future AI engineering effort requires a new prospective candidate/program identity and an explicitly frozen evidence cutoff. Research Generation 2 may inform such a later program only through that new prospective boundary; it does not retroactively enter PBAI-P1.
