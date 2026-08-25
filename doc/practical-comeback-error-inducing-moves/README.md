# PCEM-STUDY1 — Practical Comeback / Error-Inducing Move Study 1

研究題目: **Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証**

Working English title: **Practical Comeback / Error-Inducing Move Study 1**

Status: **STUDY 1 COMPLETE**

Study ID: `PCEM-STUDY1`  
Study slug: `practical-comeback-error-inducing-moves`  
Study-start baseline remote `main`: `587472b7e1a3f6e390cdfea6ed0d8e0971d5711d`  
Working branch: `research/practical-comeback-error-inducing-moves`

## Final result

```text
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
Stage 1 candidate audits = 55
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The study therefore does not claim that a reproducible practical-comeback / error-inducing move class was established under the frozen design.

## Purpose

This prospective independent Bao study asked whether a move that is not necessarily the strongest-policy best move can nevertheless produce a higher bounded-horizon empirical comeback frequency against a prospectively frozen imperfect-opponent policy by concentrating successful defense into a narrow machine-reference reply set.

The study did **not** reopen, rescue, reinterpret, or re-adjudicate any completed upstream study.

## Mandatory construct separation

The study kept separate:

1. strongest-policy value / best-response robustness;
2. bounded-horizon empirical comeback frequency under a frozen imperfect opponent policy;
3. opponent reply-set narrowness;
4. opponent-error dependence;
5. machine-operational reply difficulty / punishment concentration;
6. root-move optimality gap.

No machine-only reply metric is a claim about human difficulty, psychology, expert recognition, or traditional Bao terminology.

## Evidence summary

```text
generated games = 3072
selected roots = 300 (Namua 150 / Mtaji 150)
exact root-move interventions = 1065
total continuation rows = 18105
candidate definitions audited = 55
promoted candidates = 0
```

Canonical Stage 1 workflow `32820391017` completed successfully and independent verification reproduced source generation, selection, RAW identity, measurement, and discovery.

## Representation firewall

Authoritative downstream state identity is RAW-ONLY and contains exactly:

`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.

`turn` and `reason` are excluded from identity. Missing `pending` is invalid before engine entry. Every accepted state must satisfy:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

No symmetry reduction, seat swap, reflection canonicalization, quotient identity, or transform-based deduplication is authorized.

## Documents

- `STUDY_1_OVERVIEW.md` — concise final overview.
- `STUDY_1_FINAL_REPORT.md` — complete final scientific report.
- `CURRENT_STATUS.md` — authoritative terminal study state.
- `DECISION_REGISTER.md` — prospective and terminal decisions.
- `RESEARCH_LOG.md` — chronological study log.
- `REPRODUCIBILITY_INDEX.md` — protocol, code, workflow, artifact, hash and verifier index.
- `protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md` — measurement dependency audit.
- `preregistration/STUDY_START_FIREWALL.md` — immutable upstream/no-rescue firewall.
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json` — frozen Stage 1 design.
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` — Stage 1 generation authorization.
- `preregistration/STAGE_1_EXECUTION_AMENDMENT_1.json` — pre-outcome execution-only parallelization amendment.
- `preregistration/STAGE_2_FORMAL_SKELETON.md` — unexecuted Stage 2 skeleton.
- `results/STAGE_1_EXPLORATORY_RESULT.json` — compact canonical Stage 1 result.
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json` — compact independent verification result.
- `results/STAGE_2_NON_AUTHORIZATION.json` — frozen Stage 2 non-authorization.

## Merge boundary

No merge to `main`, auto-merge, or branch deletion is authorized without explicit user instruction.
