# RCPR-STUDY1 — Main Integration Checkpoint

Date: 2026-08-29

## Integration

```text
Program = G2-06
Study ID = RCPR-STUDY1
Integration PR = #73
Baseline main before Study = 37480777246aa306c6ca3d0679d936b5e0107071
Final research head = 374d25d2f09ba661aaa8ae8e2e0a06eb03536786
Merge method = merge
Merge commit = 28f888f9819605d2b19707067afc48f2a6d3ed27
Integrated branch = main
Stage 1 decision = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Canonical scientific closure remains unchanged

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block 28610001..28613072 = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement / extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Canonical Stage 1 provenance:

```text
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
workflow run = 33196954082
production job = 98936414477 / success
independent verification job = 99007180273 / failure
production artifact = 9704250489
verification artifact = 9708956844
```

Production-only readiness observations remain provenance only and are not promoted.

## Final pre-merge consistency audit

Before PR #73 was opened, the following were cross-audited against the machine-readable closure and found consistent:

- root `README.md`;
- Study `README.md`;
- `STUDY_1_OVERVIEW.md`;
- `STUDY_1_FINAL_REPORT.md`;
- `CURRENT_STATUS.md`;
- `DECISION_REGISTER.md`;
- `REPRODUCIBILITY_INDEX.md`;
- `RESEARCH_LOG.md`;
- `RESUME_HERE.md`;
- `STUDY_1_PROTOCOL.md`;
- `results/STAGE_1_DEVELOPMENT_RESULT.json`;
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`;
- `doc/RESEARCH_INDEX.md`;
- `doc/FUTURE_RESEARCH_AGENDA.md`;
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`;
- `doc/research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`.

The audit found and corrected before merge:

1. missing G2-06 entries/status in root/central research navigation;
2. stale planned-G2-06 program chronology;
3. still-executable closed-study RCPR workflows;
4. missing Study directory `README.md` and integrated `STUDY_1_FINAL_REPORT.md`.

No correction changed frozen scientific source, outcome, threshold, representation, classifier, seed block, endpoint, or decision.

## Central-document synchronization

```text
first administrative run = 33235620735 / failed before commit on whitespace validation only
successful run = 33235667801
second-generation research agenda audit = PASS
git diff --check = PASS
central-document integration commit = 61513669232ab79b245927087e065b3bb3dcdf6d
```

The successful materialization changed exactly root `README.md`, `doc/RESEARCH_INDEX.md`, `doc/FUTURE_RESEARCH_AGENDA.md`, and the canonical second-generation program decision.

## Workflow archive

Before PR creation, all RCPR technical/development/materialization workflows were replaced by read-only archival stubs in commit `f82aad08e543b6df37a947180479fe08b671e2e3`. The former executable blobs and canonical runs are preserved in `2026-08-29-post-closure-workflow-archive.md`.

No further RCPR-STUDY1 evidence generation or automatic central-document materialization is authorized.

## Final PR CI and review state

All PR workflows passed on final research head `374d25d2f09ba661aaa8ae8e2e0a06eb03536786`:

```text
Second-generation research agenda audit = success / run 33235980651
DRSSE Study 1 Closure CI = success / run 33235980612
PCEM closure consistency audit = success / run 33235980641
SSGTC closure consistency audit = success / run 33235980551
Phase Transition Research CI = success / run 33235980568
```

Immediately before integration:

```text
PR #73 = open / non-draft / mergeable
review submissions = 0
unresolved review threads = 0
expected head = 374d25d2f09ba661aaa8ae8e2e0a06eb03536786
```

PR #73 was merged with expected-head SHA protection and history-preserving merge semantics.

## Scope / downstream boundary

The merged G2-06 diff contains no changes to current public rule/AI files or AI-engineering state. The Stage 1 scientific instrument remains historically bound to its source commit; post-outcome code was not repaired and rerun.

G2-06 does not validate `RICH_ALL`, the production AUROC, a reusable critical-position classifier, game-theoretic turning points, human criticality, or universal Bao taxonomy.

The next unstarted machine-only Research Generation 2 agenda item is:

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
```

G2-07 requires a new prospective contract and fresh evidence from the then-current main. It does not reopen or rescue `RCPR-STUDY1`.
