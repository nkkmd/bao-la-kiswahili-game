# Stage 1 full replay/search verification PASS — selection gate open

Date: 2026-08-22

Study: `BMP-STUDY1`
Stage: `BMP-S1-EXPLORATORY-2026-08-20-v1`

## Execution identity

The investigator returned exact local repository state before verification:

```text
branch = research/blunder-misvaluation-patterns
HEAD = 897dcd2cb8775f8c129dbbde01167eef1f973089
```

The independent verifier then completed full replay and trajectory-search recomputation.

## Returned verification result

```text
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
passed = true
fullSearchRecomputation = true
gamesVerified = 2048
uniqueHistoricalTrajectories = 1884
distinctOpeningPrefixes = 1621
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
sourceCommit = 897dcd2cb8775f8c129dbbde01167eef1f973089
sourceTreeDirty = false
```

Exact condition counts:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

These counts match the generation manifest exactly.

The verifier-reported 16-file scientific source SHA-256 map also matched the source-bound authorization map.

Machine-readable verification record:

```text
results/STAGE_1_VERIFICATION_RESULT.json
result commit = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
```

## Decision

```text
Stage 1 independent full replay/search verification = PASS
selection gate = OPEN
selection readiness = NOT YET EVALUATED
measurement = BLOCKED PENDING SELECTION READINESS
discovery = BLOCKED
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

## Next authorized operation

Run only the frozen outcome-blind state-selection phase:

```text
--phase select
```

Selection must use the frozen trajectory collapse, phase assignment, state hash ranking, duplicate-rule-state collapse, and exact Namua/Mtaji quota rules. No score, regret, failure signature, outcome, candidate promotion or manual replacement may influence selection.

If selection readiness fails, no seed extension, phase reassignment, replacement sampling or threshold relaxation is authorized.
