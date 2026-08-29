# RCPR-STUDY1 — Resume Here

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## 1. Authoritative restart point

`RCPR-STUDY1` is closed at Stage 1 and integrated into `main`.

```text
baseline main before Study = 37480777246aa306c6ca3d0679d936b5e0107071
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082 / completed / failure
Stage 1 decision = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
final research head = 374d25d2f09ba661aaa8ae8e2e0a06eb03536786
integration PR = #73 / merged
main integration commit = 28f888f9819605d2b19707067afc48f2a6d3ed27
```

Do not dispatch, rerun, replace, extend, or reinterpret the consumed Stage 1 execution. All RCPR workflows in integrated `main` are closed-study archival stubs.

## 2. Read order

Read in this order:

1. `README.md`
2. `STUDY_1_OVERVIEW.md`
3. `STUDY_1_FINAL_REPORT.md`
4. `CURRENT_STATUS.md`
5. `checkpoints/2026-08-29-main-integration.md`
6. `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`
7. `results/STAGE_1_DEVELOPMENT_RESULT.json`
8. `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
9. `../../research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`
10. `DECISION_REGISTER.md`
11. `REPRODUCIBILITY_INDEX.md`
12. `RESEARCH_LOG.md`
13. `STUDY_1_PROTOCOL.md`
14. `preregistration/STUDY_START_FREEZE.md`

## 3. Terminal Stage 1 evidence

Production job `98936414477` succeeded and emitted a production-only readiness pass, including 600 roots, 599 primary-estimable roots, 134 high-divergence roots and `RICH_ALL` with overall OOF AUROC `0.7093403948001926`.

Independent job `99007180273` failed exact technical verification. The verifier recorded:

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
```

The production values are provenance only and are not accepted as an independently verified scientific result.

## 4. Root cause

Exactly four of 600 rows failed feature-vector hash equality. The mismatch was isolated to `MOVE_SET_ENTROPY.indexEntropy` and to floating-point addition order:

```text
production: Map insertion-order accumulation
independent: object integer-key enumeration order
maximum observed absolute difference: 4.440892098500626e-16
```

RAW states, continuation measurements, `D_range`, high-divergence labels, model development and readiness recomputation otherwise matched. This is a technical representation-determinism failure, but the frozen exact-equality gate means the Stage 1 decision remains `STAGE1-TECHNICAL-INVALID`.

## 5. Immutable no-rescue boundary

Do not:

- rerun seeds `28610001..28613072`;
- add a tolerance or rounding rule to retrospectively pass this Stage 1;
- replace the verifier and replay the same consumed block;
- promote the production-only result;
- authorize `RCPR-S2-FORMAL-2026-08-28-v1`;
- reuse Stage 1 development rows as formal evidence;
- modify prior G2-01..G2-05 or Research Generation 1 decisions.

## 6. Main integration

PR #73 was merged only after the final branch audit, `mergeable=true`, no unresolved review threads, and all five PR workflows passed on head `374d25d2f09ba661aaa8ae8e2e0a06eb03536786`:

```text
Second-generation research agenda audit = 33235980651 / success
DRSSE Study 1 Closure CI = 33235980612 / success
PCEM closure consistency audit = 33235980641 / success
SSGTC closure consistency audit = 33235980551 / success
Phase Transition Research CI = 33235980568 / success
```

Merge semantics:

```text
PR = #73
merge method = merge
merge commit = 28f888f9819605d2b19707067afc48f2a6d3ed27
```

## 7. Immediate program continuation

There is no further scientific execution inside `RCPR-STUDY1`.

The immediate next agenda item is:

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
priority = P1
status = planned / new prospective independent study
```

Before G2-07 outcome generation, reacquire the current remote `main` HEAD and prospectively freeze its formal Study ID, title, Stage IDs, endpoints, representation, source semantics, seed blocks, technical controls and authorization barrier. `RCPR-STUDY1` rows must not become G2-07 formal evidence.

## 8. Future rich-representation replication boundary

A future independent study may revisit deterministic rich critical-position representation only after technical hardening:

1. freeze deterministic entropy category ordering and numeric/hash semantics;
2. implement production and independent calculations separately under that semantic contract;
3. add adversarial technical fixtures with integer-like category keys in nonnumeric encounter order;
4. require exact equality for all 310 features;
5. allocate fresh scientific evidence and authorization.

Such work must receive a distinct independent title/identity and must not be named or treated as a reopening/rescue of `RCPR-STUDY1`.

The correct restart instruction is: **treat G2-06 / RCPR-STUDY1 as closed `STAGE1-TECHNICAL-INVALID` and integrated into main; do not rerun it; begin G2-07 only under a fresh prospective contract from the then-current main.**
