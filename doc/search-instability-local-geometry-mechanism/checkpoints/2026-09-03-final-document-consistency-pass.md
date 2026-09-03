# SILGM-STUDY1 — Final document consistency pass

Date: 2026-09-03

## Disposition

Final research-branch documentation consistency audit:

**`PASS`**

This checkpoint does not merge or integrate the research branch to `main`.

## Audited repository state

```text
repository = nkkmd/bao-la-kiswahili-game
research branch = research/g3-07-search-instability-local-geometry-mechanism
audited branch HEAD before this checkpoint = ad5d8e3a744f77e981be798a057783334d66efbe
main HEAD = ba48c5c3643649655137d5d3c07988fdc84bee9d
main integration = NOT PERFORMED
main integration authorization = EXPLICIT USER INSTRUCTION REQUIRED
```

The final audit re-fetched `main` after central-document synchronization and confirmed that it remained exactly `ba48c5c3643649655137d5d3c07988fdc84bee9d`.

## Scientific closure consistency

All current-facing G3-07 records agree on:

```text
Study = SILGM-STUDY1
Study lifecycle = CLOSED / FORMAL-COMPLETE
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS / 1 authorized / 1 actual / 24 Namua + 24 Mtaji
Stage 2 = STAGE2-PASS / 1 authorized / 1 actual / 36 Namua + 36 Mtaji
Stage 1 promoted = 8
Stage 2 estimable = 7
CONFIRMED = 3
NOT-CONFIRMED = 4
NON-ESTIMABLE = 1
Stage 2 canonical scientific-result SHA-256 = 05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9
no-rescue = CROSSED / CLOSED
```

The three formal confirmations remain separate candidate-level results:

1. depth × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
2. node-budget × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
3. quiescence × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`

No new omnibus test or causal claim was introduced during documentation synchronization.

## Interpretation consistency

The final documents consistently retain the bounded interpretation:

- association, not causal mechanism;
- search-condition contrasts are peers, not truth/reference comparisons;
- ranking-preorder change is not equated with bad play or search failure;
- confirmed G1 association is not generalized to game-theoretic difficulty, value, human difficulty or universal complexity;
- four `NOT-CONFIRMED` candidates are not treated as universal absence of association;
- one `NON-ESTIMABLE` candidate is not treated as null;
- no claim is extended beyond the frozen RAW-only relative-depth-5 geometry contract.

## Protected evidence consistency

All current-facing RG3 documents now state or preserve the same protected-evidence boundary:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

for the standard-initial RAW-root complete exact depth-10 holdout.

No protected holdout generation, read, peek, partial enumeration or resource probe was performed during G3-07 or during documentation finalization.

## Historical program-plan integrity

`doc/research-generation-3/PROGRAM_PLAN.md` remains intentionally historical and was not rewritten.

```text
PROGRAM_PLAN Git blob before/after documentation finalization
= 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
```

The current state is expressed only through current-facing documents and closure records.

## Central current-facing documents

Final audited Git blobs:

```text
README.md
= f01847566dc925a3298c963ad2eece486a38be4f

doc/RESEARCH_INDEX.md
= 5d75167ed1d2cfcfe0f6fa0b36df5a0e940f4017

doc/FUTURE_RESEARCH_AGENDA.md
= d073d458e1d888a0879f8bd5eb5d8eb1f7bdfba8

doc/research-generation-3/README.md
= cc036a81f154e941433fc8a3b5fa7c7e72315641

doc/research-generation-3/CURRENT_STATUS.md
= 368f1a6ec95a24a19dab7ff9e290adf60ef616b6

doc/research-generation-3/PROGRAM_PLAN.md
= 2bb90c11f1625f63f40a7eab8a3de7774505a1ac
```

Current-facing documents identify:

```text
G3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE
G3-08 = NOT AUTHORIZED
next scientific action = separate post-G3-07 current-state G3-08 authorization review
```

G3-06 text that referred to a required G3-07 authorization review is now explicitly qualified as a **G3-06 closure-time historical boundary**, avoiding conflict with the completed G3-07 state.

## Central-document finalization provenance

### v1 control-plane failure

```text
workflow run = 33720291212
result = FAILURE BEFORE DOCUMENT MUTATION
cause = syntax-invalid temporary JavaScript finalizer
scientific consequence = NONE
central document changes = 0
```

The invalid v1 JavaScript finalizer was subsequently removed from the branch.

### v2 current-facing synchronization

```text
workflow run = 33720462012
job = 100538361286
artifact = 9880030417
artifact ZIP SHA-256 = 5001e5407ace387243786ab3d0238fe2adf6c54294e242f31130b86033c37f2c
synchronization commit = 3e69852fb468bba66e3fce5412fd18c15da404fa
changed paths = exactly 5 whitelisted current-facing documents
PROGRAM_PLAN blob check = PASS
```

### v3 consistency correction

```text
workflow run = 33720730267
job = 100539146721
artifact = 9880123699
artifact ZIP SHA-256 = 121bb13ceab76d661b42a8df15e809779cabe944daea6b957b28e515b60bd478
consistency commit = ad5d8e3a744f77e981be798a057783334d66efbe
changed paths = exactly 4 whitelisted current-facing documents
PROGRAM_PLAN blob check = PASS
protected holdout wording = PASS
G3-06 historical-boundary qualification = PASS
G3-08 NOT-AUTHORIZED boundary = PASS
```

## Canonical G3-07 closure records

- `../README.md`
- `../STUDY_1_FINAL_REPORT.md`
- `../CURRENT_STATUS.md`
- `../DECISION_REGISTER.md`
- `../REPRODUCIBILITY_INDEX.md`
- `../results/stage-1/STAGE_1_RESULT_SUMMARY.json`
- `../results/stage-2/STAGE_2_RESULT_SUMMARY.json`
- `2026-09-03-stage-2-formal-complete-study-closure.md`
- `../../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`
- `../../research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md`

## Final boundary

G3-07 scientific work and branch documentation are complete.

G3-08 — Local Geometry Persistence / Memory-Length Study 1 — is **not automatically authorized**. A separate post-G3-07 current-state authorization review is required before any G3-08 scientific execution.

**Do not merge or integrate this research branch to `main` until the user explicitly instructs it.**
