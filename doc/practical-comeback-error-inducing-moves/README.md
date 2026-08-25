# PCEM-STUDY1 — Practical Comeback / Error-Inducing Move Study 1

研究題目: **Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証**

Working English title: **Practical Comeback / Error-Inducing Move Study 1**

Status: **RESEARCH START / PROTOCOL DEVELOPMENT / NO SCIENTIFIC OUTCOME YET**

Study ID: `PCEM-STUDY1`

Study slug: `practical-comeback-error-inducing-moves`

Study-start baseline remote `main`: `587472b7e1a3f6e390cdfea6ed0d8e0971d5711d`

Working branch: `research/practical-comeback-error-inducing-moves`

## Purpose

This is a new prospective independent Bao study. It asks whether a move that is not necessarily the strongest-policy best move can nevertheless produce a higher bounded-horizon empirical comeback frequency against a prospectively frozen imperfect-opponent policy by concentrating successful defense into a narrow or demanding reply set.

The study does **not** reopen, rescue, reinterpret, or re-adjudicate any completed upstream study.

## Mandatory construct separation

The study keeps the following quantities separate:

1. strongest-policy value / best-response robustness;
2. bounded-horizon empirical comeback frequency under a frozen imperfect opponent policy;
3. opponent reply-set narrowness;
4. opponent-error dependence;
5. machine-operational reply difficulty / punishment concentration;
6. root-move optimality gap.

No machine-only reply metric is a claim about human difficulty, psychology, expert recognition, or traditional Bao terminology.

## Representation firewall

Authoritative downstream state identity is RAW-ONLY and contains exactly:

`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.

`turn` and `reason` are excluded from identity. Missing `pending` is invalid before engine entry. Every accepted state must satisfy:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

No symmetry reduction, seat swap, reflection canonicalization, quotient identity, or transform-based deduplication is authorized.

## Stage architecture

- Stage 0 — technical / construct feasibility only; `scientificInferenceAuthorized = false`.
- Stage 1 — fresh exploratory discovery; `EXPLORATORY-ONLY`; fresh seed block.
- Stage 2 — fresh formal confirmation only if prospectively frozen Stage 1 promotion produces at least one candidate; otherwise `NOT-AUTHORIZED-NOT-EXECUTED`.

Stage 1 rows may not be reused as Stage 2 formal evidence.

## Documents

- `STUDY_1_OVERVIEW.md` — current human-facing overview without scientific results.
- `CURRENT_STATUS.md` — authoritative current study state.
- `DECISION_REGISTER.md` — fixed research-start decisions and later prospective decisions.
- `RESEARCH_LOG.md` — chronological study log.
- `REPRODUCIBILITY_INDEX.md` — baseline, protocol, code, artifact and verifier index.
- `protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md` — measurement dependency audit.
- `preregistration/STUDY_START_FIREWALL.md` — immutable upstream and no-rescue firewall.
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md` — technical-only Stage 0 protocol.
- `preregistration/STAGE_1_DESIGN_SKELETON.md` — Stage 1 design skeleton; numerical rules must be frozen before Stage 1 outcome inspection.
- `preregistration/STAGE_2_FORMAL_SKELETON.md` — Stage 2 formal skeleton; not an authorization.

## Merge boundary

No merge to `main`, auto-merge, or branch deletion is authorized without explicit user instruction.
