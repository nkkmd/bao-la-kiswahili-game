# RCPR-STUDY1 — Resume Here

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## 1. Authoritative restart point

`RCPR-STUDY1` is closed at Stage 1.

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
research branch = research/g2-06-rich-critical-position-representation
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082 / completed / failure
Stage 1 decision = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Do not dispatch, rerun, replace, extend, or reinterpret the consumed Stage 1 execution.

## 2. Read order

Read in this order:

1. `CURRENT_STATUS.md`
2. `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`
3. `results/STAGE_1_DEVELOPMENT_RESULT.json`
4. `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
5. `../../research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`
6. `authorizations/STAGE_1_EXECUTE.json`
7. `preregistration/STAGE_1_EXECUTION_ADDENDUM.json`
8. `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
9. `DECISION_REGISTER.md`
10. `REPRODUCIBILITY_INDEX.md`
11. `RESEARCH_LOG.md`
12. `STUDY_1_PROTOCOL.md`
13. `preregistration/STUDY_START_FREEZE.md`

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

RAW states, continuation measurements, `D_range`, high-divergence labels, model development and readiness recomputation otherwise matched. This is a technical verifier/representation determinism defect, but the frozen exact-equality gate means the Stage 1 decision remains `STAGE1-TECHNICAL-INVALID`.

## 5. Immutable no-rescue boundary

Do not:

- rerun seeds `28610001..28613072`;
- add a tolerance or rounding rule to retrospectively pass this Stage 1;
- replace the verifier and replay the same consumed block;
- promote the production-only result;
- authorize `RCPR-S2-FORMAL-2026-08-28-v1`;
- reuse Stage 1 development rows as formal evidence;
- modify prior G2-01..G2-05 or Research Generation 1 decisions.

## 6. Immediate program continuation

There is no further scientific execution inside `RCPR-STUDY1`.

The Research Generation 2 program decision avoids reopening closed studies as generic “Study 2” retries. The immediate next agenda item is:

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
priority = P1
status = planned / new prospective independent study
```

Before G2-07 outcome generation, start from a fresh repository-state audit and prospectively freeze its formal Study ID, title, Stage IDs, endpoints, representation, source semantics, seed blocks, technical controls and authorization barrier. `RCPR-STUDY1` rows must not become G2-07 formal evidence unless the G2-07 prospective design independently declares an allowed historical method-only reference boundary before any outcome generation.

## 7. Future rich-representation replication boundary

A future independent study may revisit deterministic rich critical-position representation only after technical hardening:

1. freeze deterministic entropy category ordering and numeric/hash semantics;
2. implement production and independent calculations separately under that semantic contract;
3. add adversarial technical fixtures with integer-like category keys in nonnumeric encounter order;
4. require exact equality for all 310 features;
5. allocate fresh scientific evidence and authorization.

Such work must receive a distinct independent title/identity and must not be named or treated as a reopening/rescue of `RCPR-STUDY1`.

The correct restart instruction is: **treat G2-06 / RCPR-STUDY1 as closed `STAGE1-TECHNICAL-INVALID`; do not rerun it; synchronize program closure as needed; then begin G2-07 only under a fresh prospective contract.**
