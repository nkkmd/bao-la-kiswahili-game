# REEOE-STUDY1 — Main Integration Checkpoint

Date: 2026-08-28

## Integration

```text
Program = G2-04
Study ID = REEOE-STUDY1
Integration PR = #70
Baseline main before Study = aba61596e6440e9d54be6f1e9520f65e983000b3
Final research head = 9763402fc75d40e241b654022ddbab99adb680dc
Merge commit = 79d623c4f3b83f6366702f8058ed20428988645e
Integrated branch = main
Formal decision = INCONCLUSIVE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Fresh exact oracle produced = false
```

## Scientific closure remains unchanged

The Study-level closure remains:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
Stage 1 v2 = STAGE1-DEVELOPMENT-BLOCKED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal decision = INCONCLUSIVE
```

Fresh Stage 1 v2 selected 8 roots after a full 512-trajectory scan and produced 0 complete closures under the frozen development contract:

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
minimum complete closures required = 3
```

No resource-cap increase, domain shrinkage, root/seed replacement, partial-closure promotion, solver substitution, symmetry reduction, canonicalization, or other same-study rescue was used during closure or integration.

## Pre-merge documentation and consistency audit

Before merge:

- root `README.md` included the G2-04 closure and linked the Study Overview;
- `doc/RESEARCH_INDEX.md` included G2-04 as completed and linked the canonical final records;
- `doc/FUTURE_RESEARCH_AGENDA.md` marked G2-04 complete as `REEOE-STUDY1 = INCONCLUSIVE`, Stage 2 not executed, and retained G2-05/G2-06 as the next uncompleted P0 candidates;
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md` recorded the G2-04 program closure;
- Study README, Overview, Final Report, Current Status, Decision Register, Research Log, Reproducibility Index, preregistrations, authorizations, results, and checkpoints were cross-audited;
- machine-readable `results/STUDY_1_FINAL_RESULT.json` matched the human-readable closure documents;
- Stage 0, Stage 1 v1, Stage 1 v2, and the one-shot central-document finalizer workflows were converted to closed/invalidated archival stubs as appropriate;
- PR #70 description was updated from its stale Study-start wording to the final closure state;
- no PR review submission, unresolved review thread, or PR comment existed;
- the research branch was ahead of `main` by 49 commits and behind by 0;
- `main` remained at the audited baseline until merge;
- PR #70 was mergeable and no longer draft.

## Final pre-merge CI / audit state

All final PR workflows on research head `9763402fc75d40e241b654022ddbab99adb680dc` passed:

```text
Second-generation research agenda audit = success (run 33153061165)
Phase Transition Research CI = success (run 33153061168)
PCEM closure consistency audit = success (run 33153061214)
SSGTC closure consistency audit = success (run 33153061163)
```

## Integration operation

PR #70 was merged with expected head SHA protection and history-preserving merge semantics:

```text
expected head = 9763402fc75d40e241b654022ddbab99adb680dc
merge method = merge
merge commit = 79d623c4f3b83f6366702f8058ed20428988645e
```

## Downstream boundary

Integration does not change any G2-01, G2-02, G2-03, Research Generation 1, REWR, ORISC, SSGTC, or AI-engineering decision. RAW state identity remains authoritative and the validated transform set remains empty.

Any future exact-oracle expansion under a materially different structural/resource contract requires a new prospective independent Study/versioned protocol with fresh evidence. The next independent P0 Research Generation 2 work may proceed under a fresh contract after a new repository-state audit.
