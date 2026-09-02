# BECT-STUDY1 — Stage 1 technical-invalid / Study closure checkpoint

Date: 2026-09-02

## Formal decision

**`BECT-STUDY1 = CLOSED / TECHNICAL-INVALID`**

```text
Stage 0 v2 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal promoted candidate set = []
```

## Stage 1 exactly-one execution

```text
authorized scientific content HEAD = 5ba3706193a06902650b82f1232d19bb2cee2c1e
authorization commit = 5cceaeeece7c6d7949815a47b7ef918bbae72e59
trigger commit = 75b29fd33215bd98652613975c5b0c900f065b9d
workflow run = 33636606641
lease commit = bf1f8a5940bfb87f8c92d482728aa89ce398b749
authorized scientific executions = 1
actual scientific executions = 1
Stage 1 seed = 31510001..31510240 / CONSUMED
fresh access started = true
no-rescue boundary = CROSSED / ACTIVE
```

## Technical-invalid cause

```text
relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529
```

The canonical runner result is `TECHNICAL-INVALID`. The runner wrote the result before exiting with code 2.

Partial telemetry contains 25 measured roots from the first selected trajectory, plies 16..40. Production/independent scientific equality and frozen resource gates passed for those 25 roots, but the partial data are diagnostic-only and cannot support candidate promotion or substantive scientific claims.

## Durable artifact

```text
artifact ID = 9849245665
artifact name = bect-stage1-development-result-33636606641
artifact ZIP SHA-256 = 0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc
scientific-result.json SHA-256 = a21ad5449dfa090e4ff2ed87ebc64a48b5fb0755eabd0dcfe375358bde7d0b96
telemetry.json SHA-256 = 0608c9f035a19c4908ba02d0b462e2e0f4ca08226df3ec1062d2086dbca7f2b4
execution-summary.json SHA-256 = b54f441cadac0252dc15deac07c90974bc28e18d26d2dd3934b3fb6707fb352f
```

Exact-byte mirror:

```text
mirror workflow run = 33637372364
mirror commit = ac2bd2ca101a9002c69131c2c39ebbfbb98368a1
scientific recomputation = false
```

## No-rescue consequence

No same-evidence rerun, relay-limit repair-and-rescue, seed extension, root replacement, endpoint/event redefinition, resource-ceiling change, favorable subset selection or partial-telemetry promotion is authorized.

## Stage 2

Stage 2 requires valid Stage 1 completion and a nonempty frozen promoted candidate set. Neither condition is met.

```text
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

## Closure interpretation

This is a technical validity result, not a negative/null scientific finding about branch expansion/compression transitions in Bao. Partial Stage 1 telemetry remains provenance only.
