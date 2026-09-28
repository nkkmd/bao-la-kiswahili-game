# G4-10 / FDERT-STUDY1 — Decision Register

更新日: 2026-09-28

| ID | 項目 | 決定 | 理由 |
| --- | --- | --- | --- |
| FDERT-D001 | Study identity | `FDERT-STUDY1` | G3-11のversion incrementではなくRG4の新規protected Studyとする。 |
| FDERT-D002 | authoritative state | `RAW-ONLY` | `pits,reserve,houseOwned,player,phase,winner,pending`をidentityとする。 |
| FDERT-D003 | transform | `validated transform set = []` | symmetry/canonicalizationをstate reductionへ使用しない。 |
| FDERT-D004 | protected target | standard initial RAW root / depth 11 | Program PlanのG4-10 agendaに固定。 |
| FDERT-D005 | Stage 0 real fixture | maximum depth 2 | depth-11 outcomeを開かずtechnical compatibilityを検証する。 |
| FDERT-D006 | Stage 0 v1 | `TECHNICAL-INVALID` | self-referential source guard false positive。protected evidence消費0。 |
| FDERT-D007 | Stage 0 v1 rerun | `PROHIBITED` | versioned refreeze principleを維持。 |
| FDERT-D008 | Stage 0 v2 | `PASS` | shallow compatibility、fail-closed、independent controlsが全PASS。 |
| FDERT-D009 | production hardening | `ROW-STREAMED-BOUNDED-MEMORY` | large layer JSONLの一括文字列化を避ける。 |
| FDERT-D010 | Stage 0 v3 | `HARDENING-PASS` | legacy/hardenedのdepth-2 topology/state/edgeがexact一致。 |
| FDERT-D011 | execution environment | GitHub Actions first | durable provenanceと中断耐性を優先。 |
| FDERT-D012 | state ceiling | `2,000,000 cumulative RAW states` | depth-11をprobeせず、事前にadministrative ceilingとして固定。 |
| FDERT-D013 | edge/work ceiling | `12,000,000` | G3-11 hardened ceilingを維持し、outcomeに合わせて変更しない。 |
| FDERT-D014 | RSS ceiling | `12 GiB` | 16GB standard runnerにOS/runtime余裕を残す。 |
| FDERT-D015 | wall ceiling | `7,200 s / enumerator` | production/independentを別jobに分ける。 |
| FDERT-D016 | artifact ceiling | `2 GiB uncompressed` | runner diskとdurable upload余裕を確保。 |
| FDERT-D017 | historical G3-11 use | `INTEGRITY ONLY` | 0..10 prefix exact matchを確認するがG3-11を再判定しない。 |
| FDERT-D018 | formal T1 | depth-11 novelty continuation | complete layer時だけ判定。 |
| FDERT-D019 | formal T2 | depth-11 tree/RAW divergence | complete layer時だけ判定。 |
| FDERT-D020 | formal T3 | cumulative tree/RAW ratio continuation | exact cross-productで判定。 |
| FDERT-D021 | formal T4 | duplicate/multi-predecessor persistence | complete layer時だけ判定。 |
| FDERT-D022 | scientific execution | `1 authorized / 1 actual` | durable lease前提のone-shot holdout。 |
| FDERT-D023 | Stage 1 production | `RESOURCE-LIMIT / UNIQUE_STATE_CAP` | depth 11構築中にfrozen cumulative RAW state ceilingへ到達。 |
| FDERT-D024 | complete prefix | `0..10 EXACT / integrity PASS` | G3-11 canonical prefixとSHA projectionが完全一致。 |
| FDERT-D025 | independent verification | complete prefix exact | productionがdepth11 incompleteのため、claimed-complete prefixを独立再列挙。 |
| FDERT-D026 | formal decision | `NON-ESTIMABLE` | complete depth-11 layerが成立しなかった。 |
| FDERT-D027 | T1..T4 | `NON-ESTIMABLE` | partial depth-11 dataをdirectional resultへ昇格しない。 |
| FDERT-D028 | partial depth-11 values | `DIAGNOSTIC ONLY / NO FORMAL USE` | preregistered partial-result quarantineを維持。 |
| FDERT-D029 | same-evidence rerun | `PROHIBITED` | ceiling increase・alternate runner rescueを含め禁止。 |
| FDERT-D030 | depth 12 | `NOT AUTHORIZED` | G4-10 scope外。 |
| FDERT-D031 | whole-Bao extrapolation | `PROHIBITED` | resource cutoffをstate-space growth lawへ読み替えない。 |
| FDERT-D032 | public AI | `NO CHANGE / NOT AUTHORIZED` | research closureをproduction engineeringへ自動接続しない。 |
| FDERT-D033 | main integration | `SEPARATE GATE` | Study closureとmain統合を分離する。 |

## 最終決定

**`G4-10 / FDERT-STUDY1 = CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP`**

このclosureはresource ceilingを守った正式なprogram outcomeであり、same Study/versionでのrescueを行わない。
