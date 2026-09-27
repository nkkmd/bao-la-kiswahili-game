# G4-09 pre-main consistency audit — pending documentation sync

Date: 2026-09-28  
Agenda: `G4-09`  
Study: `GCSREA-STUDY1`  
Disposition: **`NOT-READY-FOR-MAIN-INTEGRATION / SCIENTIFIC-CLOSURE-COMPLETE / TWO-CURRENT-FACING-DOCS-STILL-STALE`**

## Audited state

```text
remote main HEAD = fc0f345034639c03dc10b0537c331ae44ee47b3b
audited research HEAD = 86588982c9e9d687d825d6c52d69c22eecca3821
compare status = ahead
behind main = 0
ahead main = 74
merge base = fc0f345034639c03dc10b0537c331ae44ee47b3b
```

The branch therefore remains a clean descendant of the current remote `main`; no rebase or merge-from-main is required at this checkpoint.

## Scientific closure status

G4-09 scientific execution is closed.

```text
Module A = NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT
Module B = FIXED8-EXACT-CENSUS-COMPLETE
Stage 2 exact run = 36359283198 / attempt 1 / success
Stage 2 exact scientific rerun = 0
G4-10 depth-11 access = 0
public AI change = false
```

Canonical Stage 2 record and closure review were reread after creation and agree with the final Actions artifact:

```text
final artifact ID = 10945085978
artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
nontrivial cells estimable = 36 / 36
canonical-best in exact optimal set = 36 / 36
PV first in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
```

These are fixed finite-census descriptions only and are not whole-Bao probability estimates.

## Branch scope audit

The `main...research/g4-09-search-reliability-exact-agreement` compare contains G4-09-specific workflows, preregistration, authorization/evidence/execution records, experimental tools, and RG4 current-facing documentation updates.

No changed file is under `public/`.

Therefore:

```text
public/ changed files = 0
public AI production changes = 0
engine deployment changes = 0
```

## Documentation already synchronized

The following current-facing documents now describe G4-09 as closed on the research branch:

- `doc/geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`
- `doc/geometry-conditioned-search-reliability-exact-agreement/README.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`

The frozen prospective `doc/research-generation-4/PROGRAM_PLAN.md` is intentionally not rewritten after outcome observation.

## Remaining inconsistency

Two current-facing long-form entry documents still contain the pre-G4-09 state and therefore block a PASS decision:

1. `doc/RESEARCH_INDEX.md`
   - still says G4-09 is not authorized / not executed.
2. `doc/FUTURE_RESEARCH_AGENDA.md`
   - still says G4-09 is the next unauthorized scientific candidate.

These statements are now stale. They must be updated without deleting the existing historical study summaries.

## Decision

**Do not integrate to `main` yet.**

The scientific record is complete and branch scope is clean, but current-facing documentation is not fully synchronized. After the two remaining documents are corrected, rerun the documentation/status search and branch-scope comparison. Only then may this checkpoint be superseded by a `PASS / READY-FOR-MAIN-INTEGRATION-REVIEW` record.

## Protected boundaries

- Do not rerun G4-09 Stage 1 or Stage 2 scientific execution.
- Do not relax the Module A support gate.
- Do not read the reserved general Stage 2 namespace under the same Study.
- Do not rescan or replace G4-05 fixed domains.
- Do not access G4-10 depth 11.
- Do not change public AI or `public/` as part of G4-09 scientific closure.
- Do not fast-forward `main` until the remaining documentation inconsistency is resolved and a final audit passes.
