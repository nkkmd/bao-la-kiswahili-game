# Research Program Decision — Practical Comeback / Error-Inducing Move Study 1 Closure

Date: 2026-08-25  
Study: `PCEM-STUDY1`  
Status: COMPLETED

## Decision

Practical Comeback / Error-Inducing Move Study 1 completed as a new prospective independent RAW-ONLY machine study.

```text
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
candidateAuditCount = 55
promotedCandidateCount = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Canonical Stage 1 evidence:

```text
generatedGames = 3072
selectedRoots = 300
Namua roots = 150
Mtaji roots = 150
exactRootMoveInterventions = 1065
totalContinuationRows = 18105
stage1ResultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

Production and independent reconstruction agreed on source generation, root selection, RAW identity, measurement, discovery, and zero promotion.

## Zero-promotion boundary

All 55 audited candidate definitions failed the frozen promotion conjunction. In particular, 55/55 failed the frozen minimum unique-root, unique-historical-trajectory, distinct-opening-prefix, unique error-condition root, and unique defense-condition root support requirements.

No threshold relaxation, near-miss promotion, favorable subgroup selection, candidate grammar expansion, opponent-policy substitution, or manual Stage 2 target selection is authorized as a rescue of this Study.

Because no Stage 1 candidate was promoted:

```text
stage2GenerationAuthorized = false
reservedStage2Seeds = 23300001..23306144
reservedStage2SeedsConsumed = false
```

Stage 1 rows may not be reused as Stage 2 formal evidence.

## Representation contract preserved

Authoritative downstream identity remains:

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
pendingRequired = true
sum(pits)+sum(reserve)+sum(pending) = 64
```

No symmetry reduction, seat-swap canonicalization, reflection canonicalization, quotient identity, or unvalidated transform-based deduplication was used.

## Interpretation boundary

This Study does **not** establish:

- an objectively superior move class;
- a game-theoretically winning or optimal move class;
- true Bao winning probability;
- practical comeback effectiveness across all opponent strengths;
- human opponent error probability;
- human reply difficulty, deception, pressure, or confusion;
- expert/traditional recognition as a Bao winning try.

The result is restricted to the frozen population, D3/D2 machine-reference semantics, `P_MEDIUM_D1_TOP3` primary imperfect opponent, 96-ply bounded endpoint, `PCEM-T1..T8` candidate grammar, and preregistered promotion rules.

## Upstream decisions unchanged

This closure does not alter or rescue any completed Bao study, including:

- Position Evaluation / Win-Rate Calibration Study 1 — `INCONCLUSIVE`; its mapping remains unvalidated as Bao win probability;
- Blunder / Misvaluation Patterns Study 1 — 0 `CONFIRMED` / 4 `NOT-CONFIRMED`;
- Critical Positions / Outcome Branching Study 1 — Stage 1 promoted candidates 0 / Stage 2 not executed;
- Position Complexity / Difficulty Study 1 — `INCONCLUSIVE`;
- Restricted Endgame / Winning Regions Study 1 — `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` only within its frozen domain;
- Symmetry / Isomorphic Positions Study 1 — 0 validated / 0 rejected / 5 `NON-ESTIMABLE`;
- ORISC-STUDY1 Axis A — `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`;
- ORISC-STUDY1 Axis B — `NOT-AUTHORIZED-NOT-EXECUTED`;
- State Space / Game Tree Complexity Study 1 — `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.

Any future investigation of alternative practical-comeback structures must be a new prospective study or an explicitly versioned new protocol using fresh evidence and a pre-outcome design.