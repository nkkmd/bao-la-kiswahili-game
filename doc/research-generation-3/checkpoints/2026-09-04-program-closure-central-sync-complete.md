# 2026-09-04 — Research Generation 3 program closure central sync complete

## Decision

**`RG3-PROGRAM-CLOSURE-CENTRAL-SYNC-COMPLETE`**

Research Generation 3 final synthesis / program closureを、closure branch上のcurrent-facing central documentationへ同期した。

```text
Repository = nkkmd/bao-la-kiswahili-game
Closure branch = research/g3-final-program-closure
Baseline main = fd6c8e2a4510d5937b47a87735854e8459b2646f
Scientific execution = NONE
Scientific seed access = NONE
Main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Canonical program-level records materialized before sync

- `doc/research-generation-3/FINAL_SYNTHESIS.md`
- `doc/research-generation-3/PROGRAM_FINAL_RESULT.json`
- `doc/research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`
- `doc/research-program-decisions/2026-09-04-research-generation-3-program-closure.md`

Program decision:

```text
RESEARCH-GENERATION-3 = CLOSED / MAIN-INTEGRATION-PENDING
G3-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING
PROGRAM_PLAN Section 16 completion conditions = 14 / 14 PASS
```

## Central documents synchronized

1. root `README.md`
2. `doc/RESEARCH_INDEX.md`
3. `doc/FUTURE_RESEARCH_AGENDA.md`
4. `doc/research-generation-3/README.md`
5. `doc/research-generation-3/CURRENT_STATUS.md`

Current-facing state now distinguishes:

- G3-12 Study integration itself = already COMPLETE on main before this closure branch;
- Research Generation 3 program-level closure = CLOSED on `research/g3-final-program-closure`;
- generation-level main integration = NOT AUTHORIZED / NOT PERFORMED until explicit user instruction.

## Technical-only sync chronology

A one-time branch-local documentation synchronization workflow was used. No scientific runner, seed block, result computation, or main ref was touched.

### Run 1

```text
Actions run = 33860030044
job = 100982106758
result = failure
failure point = documentation synchronization step
current-facing document commit = none
scientific access = none
main change = none
```

Failure cause: the helper expected a pre-G3-12-main-integration central-document string, while current main already contained the completed G3-12 integration bookkeeping.

### Run 2

```text
Actions run = 33860190996
job = 100982618344
result = failure
failure point = documentation synchronization step
current-facing document commit = none
scientific access = none
main change = none
```

The helper was made idempotent/tolerant but still contained stale post-G3-12 text assumptions. It again failed before the Program Plan verification and commit steps.

### Run 3

```text
Actions run = 33860330426
job = 100983057162
result = success
Synchronize generation closure documentation = success
Verify historical program plan unchanged = success
Commit synchronized documentation = success
scientific access = none
main change = none
```

The final technical correction matched the actual post-G3-12-integration current state and used bounded marker/regex replacements only.

## Historical Program Plan integrity

The workflow required:

```text
doc/research-generation-3/PROGRAM_PLAN.md blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
```

and passed this exact check. Historical prospective `PROGRAM_PLAN.md` was not retroactively rewritten.

## Temporary synchronization tooling removal

After successful synchronization, the following one-time files were removed from the closure branch:

- `.github/workflows/g3-final-program-closure-doc-sync.yml`
- `tools/experiments/sync-g3-final-program-closure-docs.py`
- `doc/research-generation-3/authorizations/g3-final-program-closure-doc-sync-trigger.txt`

They are not part of the intended final closure tree.

## Scientific / protected-evidence boundary

This synchronization did not:

- rerun G3-11 depth 10;
- access depth 11;
- repair or replay G3-12 Stage 1;
- access G3-12 Stage 2 seeds;
- reuse G2-12 estimator scientific input;
- add symmetry/canonicalization;
- alter any Study formal decision.

## Next action

Perform a final repository/document consistency audit on the closure branch, including branch-vs-main diff review and verification that temporary synchronization files are absent.

`main` integration remains outside authorization until explicit user instruction.
