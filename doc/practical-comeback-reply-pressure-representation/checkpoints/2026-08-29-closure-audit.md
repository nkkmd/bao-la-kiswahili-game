# PCRPR-STUDY1 — Closure Audit

Date: 2026-08-29

## Remote state

```text
remote main at study-start / pre-merge baseline = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
research branch closure audit = COMPLETE
main integration = PENDING PR MERGE
```

Remote `main` remained at the study-start baseline throughout scientific execution and research-branch closure. Central integration preparation was performed only on `research/g2-07-practical-comeback-reply-pressure-representation` before merge.

## Diff scope audit

The research branch was originally created from `e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5`. Scientific/research implementation changes remain confined to PCRPR-specific paths:

1. `.github/workflows/pcrpr-*`
2. `doc/practical-comeback-reply-pressure-representation/**`
3. `tools/experiments/*pcrpr*`

Final integration preparation additionally updates only these shared documentation entry points:

4. repository root `README.md`
5. `doc/RESEARCH_INDEX.md`
6. `doc/FUTURE_RESEARCH_AGENDA.md`

No pre-existing `public/engine.js`, `public/ai.js`, `public/ai-weights.js`, Bao rule semantics, public gameplay code, or unrelated scientific result was modified by G2-07.

## Terminal record audit

Present and synchronized:

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `README.md`
- `STUDY_1_OVERVIEW.md`
- `RESUME_HERE.md`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-post-closure-workflow-archive.md`
- `checkpoints/2026-08-29-study-closure.md`

All record the same terminal scientific state:

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = CLOSED
```

## Workflow audit

All six PCRPR scientific/technical workflow files are notice-only archival stubs after closure. Former executable blob IDs and canonical run IDs are preserved in `2026-08-29-post-closure-workflow-archive.md`.

The one-shot central-document materializer was used only during integration preparation to make anchor-validated localized edits to the three shared documents. It is temporary integration tooling and must not remain in the merged main tree.

## Shared central-document audit

The previously deferred shared-document synchronization is now complete on the research branch:

- root `README.md` contains the G2-07 closure entry after G2-06;
- `doc/RESEARCH_INDEX.md` contains dedicated section 23 for `PCRPR-STUDY1`, preserving the fail-closed decision and human-claim boundary;
- `doc/FUTURE_RESEARCH_AGENDA.md` marks G2-07 completed and advances the next unstarted machine-only agenda item to G2-08.

The materialization workflow verified these expected anchors before committing the central-document changes.

## Audit conclusion

```text
PCRPR-STUDY1 research-branch closure = COMPLETE
central document synchronization = COMPLETE
main integration = READY AFTER TEMPORARY MATERIALIZER CLEANUP AND PR AUDIT
next scientific execution in PCRPR-STUDY1 = NOT AUTHORIZED
```
