# G4-09 / GCSREA-STUDY1 — Stage 1 development complete

Date: 2026-09-27  
Stage: `GCSREA-S1-DEVELOPMENT-2026-09-27-v1`  
Disposition: **`STAGE1-DEVELOPMENT-COMPLETE / MODULE-A 0-OF-9 SUPPORTED / MODULE-B ORACLE-INTEGRITY READY`**

## Canonical scientific execution

```text
workflow run = 36326278830 / attempt 1
trigger SHA = 2102cf7aa9b55cb0d630ffcbaf7c37ae2607241b
lease commit = 9c103c25bc9ddb87a74f97531dcd6be9b895d373
artifact ID = 10934387075
artifact ZIP SHA-256 = 2ee8edf9c988de7a721f14887181b80bf517e810a2d49f6d429228eeeb425cd0
STAGE_1_RESULT.json SHA-256 = 353906fc38939c2a02fd99e46ca7f44af8bc36d99fa71e9bd3fec1757ae7f499
Stage 2 identity exclusion SHA-256 = 8526e4c01ba304eb88721c80c5c4280f6806dae2e7007a1a4fbcbcc191a4e8f4
fresh scientific reads = 768
scientific executions = 1 / 1
scientific rerun = 0
```

Stage 1本体のexecution stepはsuccessで完了した。8 source cellsはすべて16 rootずつ確保され、selected rootsは128、production / independentはexact agreementだった。

## Output-boundary false positive

元workflowはpost-executionの`Verify output-boundary firewall`でfailureになった。

原因はraw JSONに対する部分文字列検索で、禁止token `pValue` が

```text
"pValuesComputed": false
```

という「p-valueを計算していないことを示すnegative boolean field name」に一致したためである。

これはscientific payload violationではない。元runをrerunせず、canonical artifactだけを読む独立post-execution auditを実行した。

```text
post-execution audit run = 36327949203 / attempt 1 / success
source SHA = 672b1250650d40842a2df3ffe9dabf2a3a03570f
audit artifact ID = 10935245092
audit artifact ZIP SHA-256 = 28e42a14789dcb25e1c7133b888d31e384cbcfade3d97b01099ba373c318fc15
disposition = STAGE1-POSTEXECUTION-ARTIFACT-AUDIT-PASS
fresh scientific reads by audit = 0
scientific rerun = false
```

構造検査では、`pValuesComputed:false`と`riskDifferencesComputed:false`以外にp-value / risk-difference data-bearing payloadはなく、effect direction、formal confirmation / counterexample label、winner subgroup summaryも存在しなかった。

## Module A — GENERAL-SEARCH-STABILITY

Frozen support gate:

```text
minimum geometry-defined roots = 120
minimum search-contrast-defined roots = 120
geometry variation required in both phases = true
minimum high roots = 20
minimum low roots = 20
```

Stage 1 result:

```text
selected roots = 128
search-defined roots:
  SC1-DEPTH = 109
  SC2-NODE-BUDGET = 109
  SC3-QUIESCENCE = 109
formal candidate slots = 9
SUPPORTED-FOR-FORMAL-HOLDOUT = 0
NOT-SUPPORTED-FOR-FORMAL-HOLDOUT = 9
```

全9 slotは、prospectiveに固定した`minimumSearchContrastDefinedRoots=120`に対して`109`だったためformal holdout eligibilityを満たさなかった。

このStageではeffect direction、risk difference、association p-valueを計算していないため、これはno-effect / negative association / counterexampleではない。

**Module AについてStage 2 fresh general-domain holdoutへ進まない。候補namespace `40923001...` は未読のまま保持する。**

## Module B — EXACT-MICRODOMAIN-AGREEMENT

Stage 1ではG4-05固定8 exact microdomainを実際のsearch outputと比較していない。

実施したのは保存済み`(seed, ply, rootStateKey)`からの再物質化と、state-set / transition-set / solution digest / root value / DTF / optimal move setのproduction / independent integrity確認だけであり、全8 domainでPASSした。

```text
fixed exact domains = 8
oracle integrity = PASS
actual search-vs-exact measurements = 0
candidate rescan = 0
domain replacement = 0
```

したがってModule Bは、別preregistration / authorizationの下で固定8 domainのfinite census exact-agreement measurementへ進む余地が残る。固定8をwhole-Bao correctness probabilityへ一般化してはならない。

## Protected boundaries

```text
G4-10 depth-11 access = 0
Stage 2 general fresh seed access = 0
public AI change = false
main integration = not performed
```

## Canonical record

`doc/geometry-conditioned-search-reliability-exact-agreement/results/stage-1/STAGE_1_CANONICAL_RECORD.json`
