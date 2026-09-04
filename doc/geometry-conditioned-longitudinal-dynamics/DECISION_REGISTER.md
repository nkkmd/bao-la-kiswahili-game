# GCLD-STUDY1 — DECISION REGISTER

更新日: 2026-09-04

| Decision | Status | Evidence / boundary |
| --- | --- | --- |
| G3-10 program authorization | `G3-10-AUTHORIZED` | post-CRCLGR reviewでhistorical G3-10 dependencyが満たされたと判断 |
| Formal Study identity | `GCLD-STUDY1` | fresh scientific evidence前にfreeze |
| Representation | `CRCLGR-R1-EXACT-SQUASHED-L1` | CRCLGR-STUDY1のformal-eligible continuous bounded RAW representation |
| Inferential unit | `trajectory` | checkpoint/windowを独立sampleとして扱わない |
| Primary endpoints | C1..C5 fixed | directionality, persistence, return, chronology-conditioned circulation, first-order path dependence |
| Temporal controls | 32 fixed endpoint-preserving permutations | geometry/outcome independent SHA-256 ordering |
| Formal test | exact two-sided sign test | trajectory-level contrastのみ |
| Multiplicity | Holm, fixed family size 5, FWER=0.05 | NON-ESTIMABLE endpointがあってもfamily縮小しない |
| Stage 0 | `STAGE0-PASS` | technical-only; scientific inferenceなし |
| Stage 1 | `STAGE1-PASS` | 24/24 candidates, 24/24 eligible, 16 measured; effect/p-value promotionなし |
| Stage 2 initial wrapper | `PRE-FRESH-ACCESS-TECHNICAL-ABORT` | run 33809894513; fresh seed read 0; scientific execution consumed 0 |
| Stage 2 V2 | `FORMAL-COMPLETE` | run 33810395545; exactly one first-fresh scientific execution |
| C1 directionality/path efficiency | **`CONFIRMED`** | 31 positive / 1 negative / 0 ties; Holm-adjusted exact p=`165/2147483648`; ACTUAL-GREATER |
| C2 persistence/lag-distance gradient | **`CONFIRMED`** | 30 positive / 2 negative / 0 ties; Holm-adjusted exact p=`1587/2147483648`; ACTUAL-GREATER |
| C3 return fraction | **`CONFIRMED`** | 1 positive / 28 negative / 3 ties; Holm-adjusted exact p=`15/33554432`; ACTUAL-LESS |
| C4 chronology-conditioned circulation | `NOT-CONFIRMED` | 12 positive / 20 negative / 0 ties; Holm-adjusted exact p=`462411533/2147483648` |
| C5 first-order directional path dependence | **`CONFIRMED`** | 24 positive / 8 negative / 0 ties; Holm-adjusted exact p=`15033173/1073741824`; ACTUAL-GREATER |
| Study lifecycle | `CLOSED / FORMAL-COMPLETE` | all 5 primary endpoint decisions materialized; 4 confirmed, 1 not-confirmed |
| Same-evidence rerun | `NOT AUTHORIZED` | Stage 1 first fresh access以降のno-rescue rule |
| Seed extension / trajectory replacement | `NOT PERFORMED / PROHIBITED` | frozen population contract maintained |
| G3-09 partial scientific reuse | `PROHIBITED / NOT PERFORMED` | identity-only firewall projectionのみ使用 |
| Protected standard-root depth-10 | `SEALED / NOT GENERATED / NOT READ / NOT PEEKED` | Study全期間でaccess false |
| Historical RG3 PROGRAM_PLAN edit | `PROHIBITED / NOT PERFORMED` | historical recordを維持 |
| Main integration | `COMPLETE / FAST-FORWARD` | explicit user authorization 2026-09-04; `0bcd1695b6dbd044acf2eed91740d282c63dbb07` → `28b64d1cb02904e0c57886ae2046cd681ab64387`; `force=false` |

## Interpretation boundary

`CONFIRMED`は、prospectively固定されたtrajectory-level temporal-order controlとのcontrastがformal testでfamily-wise thresholdを通過したことを意味する。causality、physical hysteresis、strategic regime、human cognition、game-theoretic valueを確認したという意味ではない。

C4の`NOT-CONFIRMED`は、operational geometry-space circulation endpointについてformal confirmationが得られなかったことを意味する。別のhysteresis定義を同Study内で事後導入して救済することは認めない。
