# PCRPR-STUDY1 — Study Closure Checkpoint

Date: 2026-08-29

## Final scientific state

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
Study = CLOSED / MAIN INTEGRATED
main integration = COMPLETE / PR #77 / 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

## Terminal incident

- production computation and artifact upload: success
- independent scientific replay computation: success
- production/independent terminal development-core SHA256: exact match
- independent result artifact upload: failed due GitHub Actions `CreateArtifact` timeout after five attempts
- mandatory full final comparer: skipped because full independent artifact was unavailable
- frozen decision mapping applied without relaxation: `STAGE1-TECHNICAL-INVALID`

## Canonical closure records

- `../STUDY_1_FINAL_REPORT.md`
- `../CURRENT_STATUS.md`
- `../DECISION_REGISTER.md`
- `../REPRODUCIBILITY_INDEX.md`
- `../RESEARCH_LOG.md`
- `../results/STAGE_1_DEVELOPMENT_RESULT.json`
- `../results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `2026-08-29-post-closure-workflow-archive.md`

## Workflow state

All PCRPR Stage 0/Stage 1 technical, preauthorization, source-freeze and scientific workflows on this branch have been replaced by notice-only archival stubs. Original executable blobs are retained in Git history and the workflow-archive checkpoint.

## Shared central documents

Final integration preparation synchronized the G2-07 closure into all three shared entry documents without rewriting unrelated study content:

- repository root `README.md` now includes the G2-07 / `PCRPR-STUDY1` closure entry;
- `doc/RESEARCH_INDEX.md` now includes a dedicated G2-07 Study 1 section and identifies G2-08 as the next unstarted machine-only agenda item;
- `doc/FUTURE_RESEARCH_AGENDA.md` now marks G2-07 completed, records the technical-invalid closure, and advances the next unstarted machine-only agenda item to G2-08.

The central-doc materializer used anchor-validated local replacements and passed its explicit reference checks before committing the synchronized documents.

## Next research boundary

The next independent machine-only agenda candidate is `G2-08 — Machine Decision-Failure Taxonomy Study 1`. Starting G2-08 requires a fresh remote-main audit and a new prospective contract; it is not part of this closure checkpoint.
