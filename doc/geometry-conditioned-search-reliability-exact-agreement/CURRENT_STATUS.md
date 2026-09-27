# G4-09 / GCSREA-STUDY1 — Current Status

Date: 2026-09-27  
Branch: `research/g4-09-search-reliability-exact-agreement`

## Current disposition

**`STAGE1-CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-EXACT-CENSUS-PREPARATION-AUTHORIZED`**

## Completed

- Stage 0 technical-only validation: PASS.
- Stage 1 pre-fresh audit: PASS.
- Stage 1 one-shot authorization: completed.
- Stage 1 fresh development execution: completed once.
- Stage 1 post-execution artifact-only audit: PASS.
- Stage 1 canonical record: fixed.

## Stage 1 canonical evidence

```text
scientific run = 36326278830 / attempt 1
scientific artifact ID = 10934387075
scientific artifact ZIP SHA-256 = 2ee8edf9c988de7a721f14887181b80bf517e810a2d49f6d429228eeeb425cd0
fresh scientific reads = 768
selected roots = 128
production / independent exact = true
scientific rerun = 0

post-execution audit run = 36327949203 / attempt 1 / success
audit artifact ID = 10935245092
audit artifact ZIP SHA-256 = 28e42a14789dcb25e1c7133b888d31e384cbcfade3d97b01099ba373c318fc15
```

元scientific workflowの最終failureは`pValuesComputed:false`を禁止substring `pValue`として誤検出したoutput-boundary verifier false positiveであり、artifact-only auditによりscientific payload violationではないことを確認した。

## Module A — GENERAL-SEARCH-STABILITY

```text
source cells = 8 / 8 represented
selected roots = 128
SC1-DEPTH defined = 109
SC2-NODE-BUDGET defined = 109
SC3-QUIESCENCE defined = 109
frozen minimum search-defined = 120
formal candidate slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
formal inference performed = false
```

Module Aはformal Stage 2へ進めない。これはno-effect resultではない。

候補Stage 2 general-domain namespace `40923001...` は未読のまま保持する。

## Module B — EXACT-MICRODOMAIN-AGREEMENT

```text
fixed G4-05 exact domains = 8
oracle integrity = PASS
actual search-vs-exact measurements = 0
G4-05 candidate rescan = 0
G4-05 replacement = 0
```

現在認可されているのは、固定8 domainをfinite censusとして扱うexact moduleのpreregistrationとtechnical preflightまでである。

actual search-vs-exact measurementはまだ未認可。

## Protected boundaries

```text
G4-10 depth-11 access = 0
Stage 2 general-domain fresh access = 0
public AI change = false
main integration = not performed
```

## Next

1. Module B exact-census preregistrationを固定する。
2. actual fixed-8 measurementを行わないtechnical preflightを実施する。
3. preflight PASS後、別のfinal measurement authorization reviewを行う。
4. その認可がある場合だけfixed-8 actual search-vs-exact censusを一回実行する。
