# PCRPR-STUDY1 — Resume Here

Updated: 2026-08-29

## Current safe state

```text
Program = G2-07 / Research Generation 2
Study ID = PCRPR-STUDY1
Branch = research/g2-07-practical-comeback-reply-pressure-representation
Baseline remote main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
scientificOutcomeGenerated = false
Stage 0 = PLANNED-TECHNICAL-ONLY / NOT YET EXECUTED
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 28710001..28713072 = RESERVED / UNCONSUMED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
```

## Read order before continuing

1. `preregistration/STUDY_START_FREEZE.md`
2. `STUDY_1_PROTOCOL.md`
3. `CURRENT_STATUS.md`
4. `DECISION_REGISTER.md`
5. `REPRODUCIBILITY_INDEX.md`
6. `RESEARCH_LOG.md`
7. `checkpoints/2026-08-29-study-start-freeze.md`

Then re-check remote `main` and compare it with the recorded baseline before any new source freeze or authorization.

## Immediate next work

The next permitted work is **Stage 0 technical / representation feasibility only** for:

```text
PCRPR-S0-TECHNICAL-2026-08-29-v1
```

Stage 0 should define and independently validate:

- exact root-move/reply serialization and canonical ordering;
- exact semantics for all 12 declared representation families;
- leakage classification and future/outcome-field rejection;
- deterministic floating-point accumulation order;
- canonical IEEE-754/binary64 serialization and hash inputs;
- integer-like-key adversarial ordering fixtures;
- reply-order permutation invariance where semantically required;
- zero/one/many-reply and terminal-successor handling;
- exact production/independent representation equality;
- search/policy-distribution configuration binding;
- resource feasibility for the reserved Stage 1 design.

Stage 0 is technical-only and must not generate or inspect PCRPR scientific target outcomes.

## Not authorized

Do not:

- generate Stage 1 source games from `28710001..28713072`;
- generate Stage 2 source games from `28810001..28816144`;
- consume any PCRPR scientific seed;
- rerun/repair RCPR seed block `28610001..28613072`;
- reuse PCEM Stage 1 rows or its reserved Stage 2 seeds as PCRPR evidence;
- relax/promote `PCEM-T1..T8` candidates or near misses;
- introduce symmetry/canonicalization;
- add representation families after Stage 1 outcomes;
- introduce post-outcome numeric tolerance, threshold, model, endpoint or population rescue;
- make human-difficulty/error/deception claims from machine-only evidence.

## Authorization path

Before Stage 1 scientific generation, create and freeze a dedicated Stage 1 specification, exact feature schema, source/search/policy hashes, resource ceiling, independent verifier, decision rule and explicit authorization. The authorization must bind the consume-once execution-start boundary.

Stage 2 requires its own later transition freeze and explicit authorization; Stage 1 success alone is insufficient.
