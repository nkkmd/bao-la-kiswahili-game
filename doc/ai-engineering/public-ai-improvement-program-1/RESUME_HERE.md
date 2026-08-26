# PBAI-P1 — RESUME HERE

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

This file is the restart entry point after the C003-v1 predevelopment closure. At the beginning of a new session, **always retrieve the current remote `main` HEAD first** and record it. Do not assume the SHA below is still the latest.

## 1. Pause-state identity

Program state immediately before this closure was based on:

```text
main = 5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06
scientific evidence cutoff = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
baseline = AI-GEN2-BASELINE-2026-08-26-v1
global gates = PBAI-C-GLOBAL-GATES-2026-08-26-v1
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT AUTHORIZED
Research Generation 2 evidence included = false
```

After this closure is merged, use the resulting remote `main` as source of truth.

## 2. Read order

Read in this order before making changes:

1. `doc/ai-engineering/public-ai-improvement-program-1/RESUME_HERE.md`
2. `doc/ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`
3. `doc/ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`
4. `doc/ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`
5. `doc/ai-engineering/public-ai-improvement-program-1/README.md`
6. `doc/ai-engineering/public-ai-improvement-program-1/GENERATION_1_EVIDENCE_AUDIT.md`
7. `doc/ai-engineering/public-ai-improvement-program-1/BASELINE_SPEC.md`
8. `doc/ai-engineering/public-ai-improvement-program-1/BENCHMARK_PROTOCOL.md`
9. `doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`
10. candidate-specific result files listed below.

## 3. Candidate dispositions at pause

```text
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD
PBAI-C005 = EVIDENCE-AUDIT-READY / NOT AUTHORIZED
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation = NOT-AUTHORIZED
release holdout = NOT-AUTHORIZED
public adoption = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

Canonical candidate files:

```text
candidates/PBAI-C001-v1-development-result.json
candidates/PBAI-C002-v1-development-result.json
candidates/PBAI-C003-v1-predevelopment-support-spec.json
candidates/PBAI-C003-v1-predevelopment-support-result.json
candidates/PBAI-C004-v1-development-result.json
```

## 4. C003-v1 closure — do not reinterpret

C003-v1 did **not** measure practical reachability because the strict RAW identity precondition failed first.

```text
support freeze source main = 5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06
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

This is consistent with the already-completed ORISC-STUDY1 result:

```text
ORISC formal decision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
repository stored-row rehash mismatch count = 3
repository RAW binding mismatch count = 3
identity field differences = pending
```

Do **not**:

- call C003 a 0-hit result;
- relax identity by dropping `pending`;
- use current `AI.stateKey` for exact oracle membership;
- repair/replace immutable REWR stored keys inside C003-v1;
- use symmetry/seat/reflection canonicalization;
- expand the seed block or substitute synthetic fixtures to rescue C003-v1;
- revise REWR-STUDY1 or ORISC-STUDY1 formal decisions.

A materially different C003 approach would require a new prospective candidate/version and a new pre-outcome contract.

## 5. Scientific boundaries that remain binding

- Position Evaluation / Win-Rate Calibration Study 1 = `INCONCLUSIVE`; no engine score -> validated Bao win probability.
- Position Complexity / Difficulty Study 1 = `INCONCLUSIVE`; machine search complexity is not human difficulty.
- Tactical Motif Human / Expert Validation Study 1 = `INCONCLUSIVE-NOT-ESTIMABLE`, N=0.
- Restricted Endgame Study 1 exactness is only for the frozen 8-state domain.
- ORISC-STUDY1 Axis A = representation integrity NOT-CONFIRMED; no symmetry/canonicalization authorization.
- Symmetry / Isomorphic Positions Study 1 validated nontrivial transformations = 0.
- Research Generation 2 is separate and must not be incrementally fed into PBAI-P1.

Authoritative Research Generation 1 RAW state identity:

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
```

Current `AI.stateKey` omits `pending`; it is not an authoritative research-derived exact-tablebase key.

## 6. Exact next task

The next task is **PBAI-C005 read-only production-surface audit**.

Purpose:

> Determine whether the current public Bao product/code actually presents engine evaluation as a win probability, confidence probability, calibrated winning chance, or other semantics prohibited by Position Evaluation / Win-Rate Calibration Study 1.

Start read-only. Inspect at least:

```text
public/index.html
public/main.js
public/ai.js
public/ai-config.js
public/diagnostics.js
public/ai-worker.js
doc/AI_DEVELOPMENT_LOG.md
doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md
doc/position-evaluation-calibration/DECISION_REGISTER.md
doc/position-evaluation-calibration/TECHNICAL_SEMANTICS_AUDIT.md
```

Also search the repository for user-facing or programmatic terms such as:

```text
win probability
win rate
winning chance
probability
confidence
evaluation score
score
勝率
確率
```

### C005 decision boundary

Do not assume C005 needs code.

If the audit finds **no current public semantics violation**, record that C005 has no actionable production defect under the current surface and consider closing/holding it without implementation.

If the audit finds a **concrete current semantics defect**, first freeze prospectively:

- exact affected public surface;
- exact correction mechanism;
- feature/release behavior if applicable;
- candidate-specific correctness/benefit endpoint;
- development/validation/holdout boundary;
- rollback rule;
- no score-to-win-probability claim.

Only after that may implementation be authorized.

## 7. Standing release rules

```text
feature default before adoption = off
feature-off must reproduce frozen AI-GEN2
public/engine.js frozen hash must remain unchanged unless separate rules work is authorized
release holdout cannot be used for tuning
AI-GEN3 only after formal ADOPT + actual public-default deployment
KEEP-AI-GEN2 is an acceptable final PBAI-P1 outcome
```

## 8. First checks in the new session

1. Fetch remote `main` and record full SHA.
2. Confirm `public/engine.js` SHA-256 remains `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c`.
3. Confirm `public/ai.js` SHA-256 remains `2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e` unless a later explicitly adopted change is documented.
4. Confirm no open PBAI candidate implementation PR exists that supersedes this checkpoint.
5. Confirm `AUTHORIZED-FOR-DEVELOPMENT = 0`.
6. Then perform the C005 read-only production-surface audit.
