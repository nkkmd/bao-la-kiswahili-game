# Research Generation 3 — G3-06 main integration complete

Date: 2026-09-03
Status: **MAIN-INTEGRATION-COMPLETE**

## Integration provenance

```text
Study = G3-06 / BRMGI-STUDY1
pre-integration main = b0cbd9f562bb803597acb313360c064dadd73299
audited research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
audited research head = f8eda131b81f0d6e3bc9f804ddfce875c9cd8d2b
pre-integration relation = branch 75 commits ahead / 0 behind
merge base = b0cbd9f562bb803597acb313360c064dadd73299
PR used for diff / mergeability audit = #97
PR changed files = 68
PR mergeable before integration = true
integration method = fast-forward ref update / force=false
fast-forward integrated head = f8eda131b81f0d6e3bc9f804ddfce875c9cd8d2b
post-integration study README commit = 381dc2fedebc22df4daa75fd50f3c1d84258c206
post-integration CURRENT_STATUS commit = bd7b6438c4b4d718bae6b36c0540624e6b36e529
main integration = COMPLETE
```

GitHub recognized PR #97 as merged when `main` reached the audited research head; its merge commit SHA is the fast-forwarded research head itself. No squash, rebase, separate merge commit, history rewrite, scientific rerun, or forced ref update was used.

## Pre-integration safety checks

The pre-integration compare established that the research branch was strictly ahead of `main` with no divergence. GitHub PR mergeability was `true` before integration.

The 68 changed files were limited to:

- G3-06 / BRMGI workflows and technical/scientific tooling;
- BRMGI preregistration, authorization, firewall, exact-byte result artifacts, checkpoints, final report and current-facing documents;
- Research Generation 3 / root current-facing documentation required to expose the closure.

The PR changed-file list did **not** include:

- `doc/research-generation-3/PROGRAM_PLAN.md`;
- `public/engine.js`;
- unrelated prior-study scientific result artifacts.

Pre-integration documentation audits:

```text
final document consistency audit = 33685739339 / SUCCESS
chronology clarification audit = 33686212803 / SUCCESS
```

Those audits guarded the historical program plan, frozen BRMGI protocol/preregistration, and Stage 1 scientific result bytes against documentation-only mutation.

## Scientific state preserved

```text
BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID / 1 authorized / 1 actual
Stage 1 seed = 31610001..31610256 / CONSUMED
technical error = production/independent selection mismatch
geometry measurement = NOT REACHED
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31620001..31620384 / NOT CONSUMED
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

The integration does not convert the Stage 1 technical-invalid result into a positive, negative, null, or causal scientific result. It does not authorize same-evidence selector repair/rerun, Stage 2 execution, or use of BRMGI selection diagnostics as validated downstream evidence.

## Post-integration current-facing updates

After the fast-forward, only integration status was updated in:

- `doc/bao-rule-mechanism-geometry-intervention/README.md`;
- `doc/bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md`.

The scientific final report, frozen protocol/preregistration, historical authorization/closure records, and Stage 1 result bytes were not rewritten for integration.

## Next program boundary

G3-07 remains **`NOT AUTHORIZED`**.

The next scientific action, if pursued, is a separate post-G3-06 current-state authorization review. BRMGI technical-invalid selection provenance must not be promoted into positive or negative mechanism/search-instability evidence.

Protected standard initial RAW-root complete exact depth-10 holdout remains **`SEALED / NOT GENERATED / NOT READ`**.
