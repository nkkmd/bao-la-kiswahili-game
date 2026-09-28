# G4-09 main integration review readiness

Date: 2026-09-28  
Agenda: `G4-09`  
Study: `GCSREA-STUDY1`  
Disposition: **`READY-FOR-MAIN-INTEGRATION-REVIEW / NOT-YET-INTEGRATED`**

## Audited parent state

Immediately before this checkpoint was added:

```text
remote main HEAD = fc0f345034639c03dc10b0537c331ae44ee47b3b
research HEAD = d3bea675052203cc9fe9eea7aed811e86eade405
compare status = ahead
ahead main = 86
behind main = 0
merge base = fc0f345034639c03dc10b0537c331ae44ee47b3b
```

The research branch therefore remains a clean descendant of current remote `main`.

## Scientific state

No scientific execution was performed during the pre-main documentation/audit work.

G4-09 remains closed as:

**`CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

Protected scientific facts remain unchanged:

```text
Stage 1 scientific run = 36326278830 / attempt 1
Stage 2 exact scientific run = 36359283198 / attempt 1 / success
Stage 2 exact scientific rerun = 0
candidate general Stage 2 namespace = unread
G4-05 rescan = 0
G4-05 replacement = 0
G4-10 depth-11 access = 0
public AI change = false
```

The fixed-eight exact-census result remains a finite-census description only and is not a whole-Bao correctness probability or search-configuration ranking.

## Documentation state

The current-facing documents now agree on the post-audit state:

- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`

The resume point is now:

**`G4-09 CLOSED ON RESEARCH BRANCH / PRE-MAIN CONSISTENCY AUDIT PASS / MAIN INTEGRATION REVIEW NEXT / G4-10 PROTECTED`**

The frozen prospective `doc/research-generation-4/PROGRAM_PLAN.md` was not outcome-edited.

## Net branch scope

The final `main...research/g4-09-search-reliability-exact-agreement` comparison contains G4-09 research workflows, preregistration, authorizations, execution evidence, canonical records, experimental tools, and research documentation updates.

No net changed file is under `public/`.

```text
public/ changed files = 0
public AI production changes = 0
engine deployment changes = 0
```

Temporary maintenance files/workflows used to synchronize documentation are absent from the final tree.

## Administrative audit trail

During documentation synchronization only:

- a transient empty `__noop__` file was accidentally created and immediately deleted; it is absent from the net tree and did not touch scientific data, `public/`, or G4-10;
- the first current-doc synchronization workflow definition failed YAML parsing before a job was created;
- the corrected current-doc synchronization run `36362483882` succeeded;
- the first post-audit status synchronization run `36362654842` failed fail-closed because a closure-record link occurred twice while the maintenance script required exactly one occurrence;
- the narrowed post-audit status synchronization run `36362801622` succeeded;
- both temporary synchronization workflows were removed after use.

None of these administrative events reran Stage 1 or Stage 2, accessed fresh scientific evidence, changed canonical scientific results, accessed G4-10, or changed public AI/runtime files.

## Decision

**`READY-FOR-MAIN-INTEGRATION-REVIEW / NOT-YET-INTEGRATED`**

No known scientific, documentation, ancestry, deployment-scope, or protected-boundary blocker remains.

This checkpoint does not authorize or perform G4-10 access and does not itself move `main`. Immediately before any main integration operation, re-fetch both branch heads and confirm:

1. research branch is still ahead-only (`behind = 0`);
2. merge base is still current `main` HEAD;
3. no net `public/` change exists;
4. G4-10 remains protected / not accessed;
5. no new unrelated commit has appeared on either branch.
