# G4-09 pre-main consistency audit — PASS

Date: 2026-09-28  
Agenda: `G4-09`  
Study: `GCSREA-STUDY1`  
Disposition: **`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

## Audited state

```text
remote main HEAD = fc0f345034639c03dc10b0537c331ae44ee47b3b
audited research HEAD = 5ee785f6ac5dcc7c24e1405aa6fb5ba4e24e3320
compare status = ahead
behind main = 0
ahead main = 81
merge base = fc0f345034639c03dc10b0537c331ae44ee47b3b
```

The research branch is a clean descendant of current remote `main`; no merge-from-main or rebase is required for integration review.

## Scientific closure

G4-09 scientific execution is closed and was not rerun during this audit.

```text
Module A = NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT
Module B = FIXED8-EXACT-CENSUS-COMPLETE
Stage 2 exact run = 36359283198 / attempt 1 / success
Stage 2 exact scientific rerun = 0
candidate general Stage 2 namespace = unread
G4-10 depth-11 access = 0
public AI change = false
```

Canonical fixed-census record remains:

```text
fixed domains = 8
forced domains = 2
nontrivial domains = 6
search configurations = 6
estimable nontrivial cells = 36 / 36
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
```

These are fixed finite-census descriptions only, not whole-Bao probability estimates or a configuration ranking.

## Current-facing documentation audit

The two stale entry documents identified by the preceding audit were synchronized:

1. `doc/RESEARCH_INDEX.md`
   - now states G4-09 is closed on the research branch;
   - links the G4-09 current-status record;
   - keeps G4-10 protected / not accessed.
2. `doc/FUTURE_RESEARCH_AGENDA.md`
   - now states G4-09 is closed on the research branch;
   - removes the stale claim that G4-09 is the next unauthorized candidate;
   - records the no-rescue boundary and keeps G4-10 protected / not authorized / not accessed.

Other current-facing RG4 documents were reread and remain consistent:

- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`

The prospective `doc/research-generation-4/PROGRAM_PLAN.md` remains frozen and was not rewritten after observing outcomes.

## Branch-scope audit

The `main...research/g4-09-search-reliability-exact-agreement` net diff contains G4-09 research workflows, preregistration, authorizations, execution evidence, canonical records, experimental tools, and research documentation updates.

No net changed file is under `public/`.

```text
public/ changed files = 0
public AI production changes = 0
engine deployment changes = 0
```

Temporary maintenance-only files used while synchronizing documentation do not remain in the final tree. They did not access scientific evidence, execute search measurements, modify canonical results, touch `public/`, or access G4-10.

A first documentation-sync workflow definition failed YAML parsing before any job was created. It was corrected without changing scientific code or evidence; corrected documentation-sync run `36362483882` completed successfully, and the temporary workflow was then removed. This is an administrative documentation event, not a scientific rerun.

## Protected-boundary audit

Confirmed unchanged:

- do not rerun G4-09 Stage 1 scientific execution;
- do not relax Module A support gates;
- do not read candidate general Stage 2 namespace `40923001...` under this Study;
- do not rerun or extend the fixed-eight exact census;
- do not rescan or replace G4-05 fixed domains;
- do not access G4-10 depth 11;
- do not infer whole-Bao correctness probability from the fixed census;
- do not auto-adopt RG4 results into public AI.

## Decision

**`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

No scientific, documentation, branch ancestry, deployment-scope, or protected-holdout blocker remains at this audit point.

This PASS does **not** itself integrate `main`. Main integration remains a separate explicit operation. Before that operation, reread the branch head and remote `main` head and confirm the branch remains ahead-only with the same merge base.
