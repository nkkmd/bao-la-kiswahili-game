# G4-09 final pre-main documentation audit

Date: 2026-09-28  
Agenda: `G4-09`  
Study: `GCSREA-STUDY1`  
Disposition: **`PASS / DOCUMENTATION-SYNCHRONIZED / READY-FOR-MAIN-INTEGRATION-REVIEW`**

## Purpose

This checkpoint records the final documentation-only correction and re-audit performed after two stale current-facing next-step descriptions were found following the earlier pre-main audit.

Historical checkpoints, preregistrations, authorizations, canonical scientific records, and the frozen prospective `PROGRAM_PLAN.md` were not rewritten.

## Corrected current-facing documents

Two stale next-step descriptions were synchronized to the already-completed pre-main audit state:

1. `doc/research-generation-4/README.md`
   - removed the stale statement that final documentation/scope audit was still pending;
   - now records `PASS / READY-FOR-MAIN-INTEGRATION-REVIEW` and identifies main integration review as the next explicit operation.
2. `doc/geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`
   - removed the stale instruction to perform a separate final audit;
   - now records that the pre-main consistency audit has already passed and that main integration review is next.

No scientific statement or canonical result was changed.

## Audited branch state

Immediately before this checkpoint was added:

```text
remote main HEAD = fc0f345034639c03dc10b0537c331ae44ee47b3b
research HEAD = 2856faa92e8c8129b8a9e9cf8ee82c9dd8bcccb0
compare status = ahead
ahead main = 89
behind main = 0
merge base = fc0f345034639c03dc10b0537c331ae44ee47b3b
```

The research branch remained a clean descendant of current remote `main`.

## Scientific state unchanged

G4-09 remains closed as:

**`CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

Protected scientific facts remain unchanged:

```text
Stage 1 scientific run = 36326278830 / attempt 1
Stage 2 exact scientific run = 36359283198 / attempt 1 / success
Stage 2 exact scientific rerun = 0
candidate general Stage 2 namespace = unread
G4-05 candidate rescan = 0
G4-05 domain replacement = 0
G4-10 depth-11 access = 0
public AI change = false
```

The fixed-eight exact-census result remains a finite-census description only and is not a whole-Bao correctness probability or search-configuration ranking.

## Cross-document consistency

After the correction, the following current-facing documents agree on the same lifecycle state:

- `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/geometry-conditioned-search-reliability-exact-agreement/README.md`
- `doc/geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`

The current lifecycle state is:

**`G4-09 CLOSED ON RESEARCH BRANCH / PRE-MAIN CONSISTENCY AUDIT PASS / MAIN INTEGRATION REVIEW NEXT / G4-10 PROTECTED`**

## Scope audit

The final `main...research/g4-09-search-reliability-exact-agreement` comparison contains G4-09 research workflows, preregistration, authorizations, execution evidence, canonical records, experimental tools, and research documentation updates.

No net changed file is under `public/`.

```text
public/ changed files = 0
public AI production changes = 0
engine deployment changes = 0
```

No G4-10 depth-11 access was introduced by the documentation correction.

## Historical-record handling

Earlier checkpoints remain immutable point-in-time records. Their prior readiness conclusions are not rewritten. This checkpoint records the corrected present state and supersedes only their current-facing lifecycle snapshot.

## Decision

**`PASS / DOCUMENTATION-SYNCHRONIZED / READY-FOR-MAIN-INTEGRATION-REVIEW`**

No known scientific, documentation, ancestry, deployment-scope, or protected-boundary blocker remains.

This checkpoint does not integrate `main`. Immediately before any main integration operation, re-fetch both branch heads and confirm:

1. research branch remains ahead-only (`behind = 0`);
2. merge base remains current `main` HEAD;
3. no net `public/` change exists;
4. G4-10 remains protected / not accessed;
5. no new unrelated commit has appeared on either branch.
