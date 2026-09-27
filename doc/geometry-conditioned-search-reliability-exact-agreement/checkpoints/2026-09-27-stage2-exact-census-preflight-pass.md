# G4-09 / GCSREA-STUDY1 — Stage 2 exact-census technical preflight PASS

Date: 2026-09-27  
Stage: `GCSREA-S2-EXACT-CENSUS-2026-09-27-v1`  
Disposition: **`STAGE2-EXACT-CENSUS-PREFLIGHT-PASS / ACTUAL-MEASUREMENT-NOT-YET-AUTHORIZED`**

## Canonical technical preflight

```text
workflow run = 36328650822 / attempt 1 / success
source SHA = 89df316f34d2d04f717fdbcfb6d24247e06eafe1
artifact ID = 10934528767
artifact ZIP SHA-256 = b878b4b5fa04458f171621d24b3be17afe39c1c08b64c9ee2fc66e2673876929
STAGE_2_EXACT_PREFLIGHT_RESULT.json SHA-256 = 3b0dd7671a7a7ced1fccca80140c1ee2ca84715b1dfaf54bca6a251e5b877866
EXACT_ORACLE_INTEGRITY_PREFLIGHT.json SHA-256 = 04a86213f6c41f30c50bc6727216a22bf57e91ef254c06412eb23d587021ec0f
```

## Preflight result

```text
fixed domains = 8
forced width-1 roots = 2
nontrivial width-2 roots = 6
search configurations = 6
synthetic classifier fixtures = 6
production / independent classifier exact agreement = true
exact oracle integrity = PASS
exact oracle core SHA-256 = 924922e5072cfe19facb954ce24cf8207d15a38f3fb861e08a4e4d5f1daf8a7c
actual fixed-8 search measurements = 0
general Stage 2 fresh seed reads = 0
G4-05 candidate rescan = 0
G4-05 domain replacement = 0
G4-10 depth-11 access = 0
public AI change = false
scientific measurement performed = false
```

Synthetic fixturesでは `EQUAL` / `SEARCH-SUBSET-EXACT` / `SEARCH-SUPERSET-EXACT` / `OVERLAP` / `DISJOINT` およびrank tieをproduction / independentの別実装で完全一致させた。forced-root fixtureもsearch helperを呼ばない`TRIVIAL-FORCED-LEGAL`として一致した。

## Initial technical failure

最初のtechnical preflight Run `36328549345` は、既存exact-oracle preflightのconsole summaryにある`fixedDomainCount`を保存JSON直下にも存在すると新verifierが誤認したためfail closedした。

保存JSONでは`core.fixedDomainCount` / `core.actualSearchVsExactMeasurements`である。revision 2ではこのschema参照だけを修正した。

```text
first run scientific measurement = 0
first run exact oracle integrity = PASS
search configuration / endpoint / population changes = 0
```

したがってこれはtechnical verifier schema mismatchであり、scientific evidenceではない。

## Boundary after PASS

このcheckpointでもactual fixed-8 search-vs-exact measurementは未実行である。

次に許されるのは、measurement runnerの実装とactual searchを呼ばないpre-measurement source/identity audit、source freeze、final one-shot measurement authorization reviewまでである。

actual measurement開始には別の明示的authorizationが必要。
