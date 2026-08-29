# RCPR-STUDY1 — Central documentation materialization authorization

Date: 2026-08-29  
Scope: administrative / documentation-only

Authorized action:

- update only `README.md`, `doc/RESEARCH_INDEX.md`, `doc/FUTURE_RESEARCH_AGENDA.md`, and `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md` to reflect the already-fixed G2-06 closure;
- run `tools/experiments/materialize-g2-06-central-docs.py` once under fail-closed exact-anchor semantics;
- run the Generation 2 agenda audit and `git diff --check` before committing;
- commit only those four central documents from the materialization workflow.

Not authorized:

- any change to Stage 0/1 scientific source, seed block, representation, threshold, model, endpoint, result, decision, or interpretation boundary;
- any same-block Stage 1 rerun, replacement, or extension;
- any Stage 2 authorization or execution;
- any reinterpretation of production-only readiness as a formal scientific result.

Canonical G2-06 closure remains:

```text
RCPR-STUDY1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
```

This authorization exists only to synchronize repository navigation and program chronology before final pre-main integration audit.
