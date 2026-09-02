# G3-02 final document consistency audit

Date: 2026-09-02
Scope: current-facing documentation and closure-state consistency only
Study: `G3-02 / EBRWS-STUDY1`
Research branch: `research/g3-02-effective-branching-reply-width-structure`
Pre-checkpoint branch HEAD: `8099af1ef8e25506287355782b56ad01521428bf`
Remote `main` HEAD verified during audit: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`

## Audit outcome

Final cross-document audit completed with the scientific disposition unchanged:

```text
EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 0 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed 31220001..31220288 = NOT CONSUMED
protected standard-root depth-10 holdout = SEALED / NOT GENERATED / NOT READ
research workflow = COMPLETE ON RESEARCH BRANCH
main integration = NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION
```

No scientific runner, seed generation, Stage 2 execution, same-evidence repair, replication, rescue, threshold change, endpoint change, or reinterpretation was authorized or performed during this audit.

## Documents checked

The audit cross-checked at minimum:

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`
- `doc/research-generation-3/PROGRAM_PLAN.md`
- `doc/effective-branching-reply-width-structure/README.md`
- `doc/effective-branching-reply-width-structure/CURRENT_STATUS.md`
- `doc/effective-branching-reply-width-structure/DECISION_REGISTER.md`
- `doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`
- `doc/effective-branching-reply-width-structure/STUDY_1_FINAL_REPORT.md`
- `doc/effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md`
- `doc/effective-branching-reply-width-structure/results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- EBRWS-specific GitHub Actions workflow closure state

## Stale current-facing text found and corrected

The audit identified documentation-only stale wording; none changed the formal scientific outcome.

1. `doc/FUTURE_RESEARCH_AGENDA.md`
   - update date was stale at `2026-09-01`;
   - Wave A G3-02 entry still described the pre-start `AUTHORIZATION REVIEW REQUIRED / NOT STARTED` state despite later closure;
   - current-state block did not explicitly expose research-branch completion and the main-integration hold.
2. `doc/research-generation-3/README.md`
   - an early closure sentence could be read as asserting only one Stage 1 execution in total, despite the later audit finding one authorized execution plus one unauthorized duplicate.
3. `doc/effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md`
   - one-shot / second-execution wording was clarified so that the authorized one-shot is distinguished from the later `INVALID-DO-NOT-USE` duplicate.
4. root `README.md`, `doc/RESEARCH_INDEX.md`, and the Study `README.md`
   - scientific status was already correct, but the current repository boundary was made explicit: G3-02 research work is complete on the research branch and `main` integration awaits explicit user instruction.

## Documentation-only repair execution

A one-shot documentation workflow was used only to materialize the current-facing text corrections.

Attempt 1:

- run `33575446643`
- job `100078287962`
- materialization step: success
- validation step: failure due to Markdown trailing-space formatting introduced by the docs-only patch
- commit step: skipped
- repository documentation change from this run: none
- scientific execution: none

The formatting-only materializer issue was corrected before retry.

Attempt 2:

- run `33575534664`
- job `100078567049`
- materialization: success
- `git diff --check`: success
- historical `PROGRAM_PLAN.md` no-change guard: success
- docs commit: `aa6ae3aca3203c20a3e1ea59b9a8b29a76a3bf54`

The one-shot documentation workflow was then disabled in commit:

`8099af1ef8e25506287355782b56ad01521428bf`

Its closure state is `CLOSED / DISABLED` with a false job guard.

## Historical plan immutability

`doc/research-generation-3/PROGRAM_PLAN.md` remains the historical prospective plan and was not rewritten.

Verified blob SHA on both the research branch and `main`:

`2bb90c11f1625f63f40a7eab8a3de7774505a1ac`

Its historical header may therefore still say `PROSPECTIVE PROGRAM PLAN / NOT YET STARTED`; this is intentional and not a current-state inconsistency. Current state is carried by `CURRENT_STATUS.md`, the RG3 README, the central research index, and the future agenda.

## Main integration boundary

Remote `main` remained at:

`ca6a1e4a9b41d79d873fa71385972e402ffa5197`

No merge, fast-forward, pull-request merge, or direct `main` update was performed.

## Final consistency decision

`PASS — NO KNOWN CURRENT-FACING G3-02 DOCUMENTATION INCONSISTENCY REMAINS WITHIN THE AUDITED SET.`

This PASS concerns repository documentation consistency only. It does not alter the immutable scientific decision `EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID` and does not authorize G3-03 or any later Research Generation 3 study.
