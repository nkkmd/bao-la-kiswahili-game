# LGPML-STUDY1 — Final Document Consistency Pass

Date: 2026-09-03

## Disposition

**`PASS`**

G3-08 / `LGPML-STUDY1` のtechnical-invalid closure後、study-level正本、Research Generation 3 current-facing文書、central research index / agenda、historical program boundary、protected evidence、main integration boundaryを再照合した。

## Canonical Study state

```text
Study = LGPML-STUDY1
Program position = Research Generation 3 / G3-08
Study lifecycle = CLOSED / TECHNICAL-INVALID
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / 1 authorized / 1 actual
Stage 1 seed = 31810001..31810256 / CONSUMED
technical error = relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31820001..31820384 / NOT CONSUMED
same-evidence rescue = PROHIBITED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Stage 1 result integrity

Canonical repository result:

`results/stage-1/scientific-result.json`

Confirmed fields:

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
authorizedScientificExecutions = 1
actualScientificExecutions = 1
freshScientificSeedAccess = true
seedBlockConsumed = true
noRescueBoundaryCrossed = true
stage2AutomaticallyAuthorized = false
protectedDepth10Access = false
formalPromotedCandidateSet = []
promotedCandidateCount = 0
```

Durable artifact provenance:

```text
run = 33731577464
job = 100572486927
result artifact = 9886738874
artifact ZIP SHA-256 = ef2ed1d6c28b30461d03f3a294cb3cb3d11d9f951fa24b6e6f2a94f546d6f53c
scientific-result.json SHA-256 = e8bb384dd8ba526029ee62753836847f25b45546e013fb4b224f5ab02c68a46c
exact-result mirror commit = 79fb4c51940d255e05c8e1c5469f1f759b81bf26
scientific recomputation during mirror = false
```

## Study-level documents checked

- `README.md`
- `STUDY_1_PROTOCOL.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `results/stage-0-v1/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-1/scientific-result.json`

All current-facing Study documents agree on `CLOSED / TECHNICAL-INVALID`, promoted `[]`, Stage 2 non-execution, no-rescue, and protected depth-10 sealing.

## Central-document sync

Branch-only central finalization:

```text
workflow run = 33743264469
job = 100609851462
trigger commit = 8a650fc6e92e782cae98595709b7784433a1bc3a
central documentation commit = 1c9f69fab7b1162d2ba9743c57e2472b30f1a579
workflow conclusion = success
```

Updated current-facing files:

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`

The current program state is recorded as:

```text
G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state authorization review required
```

## Historical plan integrity

`doc/research-generation-3/PROGRAM_PLAN.md` remains historical and was not retrospectively edited.

```text
Git blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
```

This matches the pre-G3-08/current-study expected historical blob.

## Stage 2 / protected evidence check

Verified absent on the research branch:

- `doc/local-geometry-persistence-memory-length/authorizations/lgpml-stage2-trigger.txt`
- `doc/local-geometry-persistence-memory-length/results/stage-2/scientific-result.json`

Therefore no Stage 2 scientific execution was armed or materialized.

Protected standard-initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

## Main integration boundary

Remote `main` was re-read after central-document finalization and remains:

`9f6abd3c9b146bb88c11dd04963052300e4cdc3b`

No G3-08 commit has been integrated to main. The research branch remains separate until an explicit user instruction authorizes integration.

## Interpretation boundary

The final documentation consistently treats the Stage 1 failure as a technical validity result, not as evidence that local geometry persistence is absent. Partial Stage 1 trajectory output is retained only as technical provenance and cannot be promoted, reanalyzed for G3-08 scientific conclusions, or used to rescue the Study.

Final consistency decision:

**`PASS / READY-TO-WAIT-FOR-EXPLICIT-MAIN-INTEGRATION-INSTRUCTION`**
