# G4-08 / BRSGT-STUDY1 — Stage 1 v2 technical invalidation

Date: 2026-09-27

## Disposition

`BRSGT-S1-DEVELOPMENT-2026-09-27-v2` is **STAGE1-TECHNICAL-INVALID / NO-RERUN-SAME-VERSION**.

This is not a scientific negative result. No rule-semantic geometry claim may be confirmed, rejected, weakened, or strengthened from this run.

## Execution provenance

- static audit run: `36299573408`
- audited source HEAD: `d5cc6be4a8bc883841484d74b4e861751548e04c`
- scientific workflow run: `36299638508`
- run attempt: `1`
- job: `108564791144`
- execution HEAD: `9c2bf9c9b66622e0830d351fe32db97151d5a5af`
- binding result: `STAGE1-V2-BINDING-PASS`
- generated runner SHA-256: `06b787a2f9b9da26f701a575cead722efab16450bbf33c1ecfd66f46afb874f0`
- artifact ID: `10924877658`
- artifact ZIP SHA-256: `66b4c37e6d623af645944745da7a0c99698053a3b2a8e5e95076cbf20dc04976`

## Pre-fresh guards

Before fresh execution:

- catch-path self-test: PASS
- generated runner materialization: PASS
- one-shot source binding: PASS
- generated runner SHA authorization binding: PASS
- v1 seed reuse: false
- Stage 2 access: false
- G4-10 depth-11 access: false
- public AI/main integration: false

The catch self-test created a valid failure artifact with fresh-read count 0, proving that the v1 failure-handler defect was corrected in v2.

## Exact failure

The retained `STAGE_1_FAILURE.json` records:

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
technicalError = missing limit distinctRawStates
noRescueBoundaryCrossed = true
freshScientificSeedReads = 512
firstSeedRead = 40814001
lastSeedRead = 40814512
formalInferencePerformed = false
effectValuesRetained = false
effectSignsRetained = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
```

Failure artifact SHA-256:

`29e51970c6358d89087602aa390261451568c47becb6572ba4a80db3cd9855fe`

## Root cause

The failure is a preflight limit-interface schema mismatch.

`CRCLGR boundedPreflight()` requires:

```text
distinctRawStates
uniqueTransitions
parentExpansions
legalMoveEvaluations
treeNodeOccurrences
```

BRSGT v2's inherited `rawLimits()` passed:

```text
globalDistinctRawStates
uniqueCanonicalTransitions
parentExpansions
legalMoveVariantsEnumerated
treeNodeOccurrences
```

Thus three key names are wrong:

```text
globalDistinctRawStates       -> distinctRawStates
uniqueCanonicalTransitions    -> uniqueTransitions
legalMoveVariantsEnumerated   -> legalMoveEvaluations
```

The existing G4-04 technical runner already uses the correct compatibility mapping, confirming this is an interface-contract defect rather than a scientific-design issue.

## Fresh-evidence boundary

The entire v2 block was read exactly once:

`40814001..40814512` / 512 slots.

Therefore the entire block is **CONSUMED-NO-REUSE**. No v2 rerun is permitted, even though the defect is now understood.

## Scientific boundary

No geometry effect result was retained and no formal inference was performed. Stage 2 and G4-10 remained unopened. The failure occurred in the eligibility/preflight path before a valid Stage 1 scientific result could be produced.

## Requirements before a v3

A v3 is technically defensible only if it remains version-isolated and preserves the scientific contract. Required safeguards:

1. new Stage 1 version identity;
2. new non-overlapping fresh seed block;
3. v1 and v2 blocks explicitly quarantined;
4. exactly the three preflight limit-key mappings corrected;
5. pre-fresh contract self-test that calls the same `preflightContinuous()` interface with the generated limit object;
6. existing catch-path self-test retained;
7. new static audit and frozen source binding;
8. new one-shot authorization and trigger;
9. no Stage 2, G4-10, public AI, or main integration access.

Canonical machine-readable record:

`results/stage-1-v2/STAGE_1_V2_CANONICAL_FAILURE_RECORD.json`
