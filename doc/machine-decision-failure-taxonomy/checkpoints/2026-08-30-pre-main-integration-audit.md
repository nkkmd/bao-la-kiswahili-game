# G2-08 / MDFT-STUDY1 — Pre-Main Integration Audit

Date: 2026-08-30

## Scope

This audit checks whether the closed G2-08 research branch is suitable to propose for integration into `main`. It does not itself modify `main` and does not authorize reopening Stage 1 or executing Stage 2.

## Remote state

```text
remote main HEAD = cb660e166460e0f19d4ba16d5283fa880d55757f
closure-consistency HEAD inspected = 208468184864934042bca4a08730917ab4a3f704
merge base = cb660e166460e0f19d4ba16d5283fa880d55757f
branch behind main = 0
```

The branch was created from the current `main` used at study initiation, and `main` has not advanced during the study as of this audit.

## Scientific state

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Scientific Stage 1 seeds are consumed and immutable; Stage 2 seeds remain reserved/unconsumed.

## Difference-scope check

The audited branch-to-main compare contains only:

1. G2-08 study documentation and canonical result records;
2. G2-08 research-only experiment libraries/runners;
3. G2-08 GitHub Actions technical/scientific/closure workflows;
4. localized updates to root `README.md`, `doc/RESEARCH_INDEX.md`, and `doc/FUTURE_RESEARCH_AGENDA.md`;
5. G2-08 documentation materialization/audit utilities.

No file under `public/` is modified. No deployed gameplay behavior, public AI evaluator/search implementation, AI-generation configuration, or AI-engineering program file is changed by this branch.

## Closure-document consistency

- root README has a G2-08 result entry;
- central Research Index contains G2-08 section 24 and marks the Study closed / `NON-ESTIMABLE`;
- the G2-07 boundary no longer calls G2-08 unstarted;
- Future Research Agenda marks G2-08 completed and identifies G2-09 as the next unstarted machine-only agenda item;
- study Overview, Final Report, Current Status, Decision Register, Reproducibility Index, Research Log, Resume Here and result/checkpoint files agree on the closure state.

## Technical evidence preservation

Mandatory Stage 1 artifact upload completed successfully. Canonical production/independent core hashes and full-shard hashes are exact matches and are recorded in repository-facing manifests/checkpoints.

## No-rescue audit

No post-outcome change was made to:

- opening-prefix readiness floor;
- maximum source-policy share ceiling;
- selected-root quota;
- source policy definitions;
- leaf assignment thresholds;
- promotion gates;
- search/reference conditions;
- Stage 1 seed block;
- mandatory verification/artifact requirements.

The six leaf-level `promoted=true` calculations are explicitly kept as development observations and are not treated as a valid taxonomy.

## Pre-integration disposition

```text
PRE-MAIN-INTEGRATION-AUDIT-PASS
PR-CREATION-AUTHORIZED
MERGE-NOT-PERFORMED-BY-THIS-AUDIT
```
