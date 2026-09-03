# SILGM Stage 0 v1 — Technical-invalid closure

Date: 2026-09-03  
Study: `SILGM-STUDY1`  
Stage: `SILGM-S0-TECHNICAL-2026-09-03-v1`  
Disposition: **`STAGE0-TECHNICAL-INVALID / NO RERUN`**

## Execution identity

```text
trigger commit = 04255ea198924368b8852875b0548e442a43bc1e
workflow run = 33700545077
job = 100478681835
actual v1 technical executions = 1
max authorized v1 technical executions = 1
```

Authorization/source-binding verification completed before computation. The durable pre-computation lease was uploaded before the computation step.

Lease artifact:

```text
artifact id = 9873342069
name = silgm-stage0-v1-lease-33700545077
ZIP SHA-256 = 3f067da7e5d26e368fe2be4f6efbf10a66f3266493284a6ee9b78e40b086d8b5
trigger head = 04255ea198924368b8852875b0548e442a43bc1e
tooling parent = 7a4dcee6660e764a55f20e9fcc1e492c1093c0db
```

Result artifact:

```text
artifact id = 9873342559
name = silgm-stage0-v1-result-33700545077
ZIP SHA-256 = 1c447eaba7700ccc9ff78ebd2cbe7af057f10f105231ef88d78b161eee9b453c
canonical JSON SHA-256 = 7ccf7ed9f01ac60cc2973eeecdb4de34c76b06d5d7c5acf95d616d840d784aaa
```

The result artifact was uploaded despite the computation-step failure and was recovered without scientific recomputation.

## Failure

Canonical error:

```text
fraction 7/17 != 7/23
```

The synthetic Stage-0 fixture contains 7 depth-labelled unit-width nonterminal RAW-state presences and 17 positive-reply nonterminal RAW-state presences. Production and independent geometry derivation therefore returned the exact value `7/17`. The v1 hand-derived assertion incorrectly expected `7/23`.

This is a **technical fixture expectation defect**. It is not a disagreement between production and independent geometry implementations and it is not scientific evidence about G3-07.

## Evidence boundary

The failure occurred during the synthetic hand-derived geometry assertion, before `technicalRoot(...)` was called. Therefore v1 did not reach technical source-root generation, search-condition execution, or any G3-07 fresh scientific population.

Canonical result records:

```text
freshStage1SeedAccess = false
freshStage2SeedAccess = false
protectedDepth10Access = false
```

Thus:

```text
fresh G3-07 scientific evidence = NOT GENERATED / NOT READ
Stage 1 seed namespace = RESERVED / NOT CONSUMED
Stage 2 seed namespace = RESERVED / NOT CONSUMED
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## No-rerun decision

The same Stage-0 v1 execution is not rerun. The v1 trigger, authorization, result and failure are immutable provenance.

The frozen v1 contract permits a new technical version only while fresh scientific evidence remains untouched and only if the scientific Study contract is unchanged. A prospective v2 may therefore correct the synthetic expected denominator before v2 computation. It may not change Study ID, fresh seed blocks, populations, geometry metrics, search conditions, search endpoints, promotion rules, formal test, multiplicity, interpretation boundary, or protected-evidence rule.
