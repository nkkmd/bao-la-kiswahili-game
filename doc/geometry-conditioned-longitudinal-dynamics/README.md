# G3-10 / GCLD-STUDY1 — Geometry-Conditioned Longitudinal Dynamics Study 1

更新日: 2026-09-04

## 状態

```text
Study ID = GCLD-STUDY1
Program position = Research Generation 3 / G3-10
Study status = CLOSED / FORMAL-COMPLETE
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS
Stage 2 = FORMAL-COMPLETE
formal endpoints = 4 CONFIRMED / 1 NOT-CONFIRMED / 0 NON-ESTIMABLE
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = COMPLETE / FAST-FORWARD / source tip 28b64d1cb02904e0c57886ae2046cd681ab64387 / force=false
```

## 研究題目

**Geometry-Conditioned Longitudinal Dynamics Study 1 — Prospective exact trajectory-level validation of directionality, persistence, return, chronology-conditioned circulation, and first-order path dependence in formally eligible continuous bounded RAW local-game-tree geometry in Bao without reliance on discrete strategic regimes**

日本語正式題目:

**Baoにおける局所ゲーム木幾何の長期trajectory構造のprospective exact検証 — discrete strategic regimeに依存せず、formal-eligible continuous bounded RAW geometryを用いてdirectionality、persistence、return、chronology-conditioned circulation、first-order path dependenceをtrajectory-levelで検証する**

## Formal result

Stage 2では48本のgeometry-blind fresh candidate trajectoryを固定し、47/48が全15 checkpointでresource-eligibleとなった。事前固定順の最初の32本をformal populationとして測定し、production / independent実装はexact一致した。

| Endpoint | Formal decision | Contrast direction |
| --- | --- | --- |
| C1 Directionality / path efficiency | **CONFIRMED** | ACTUAL-GREATER |
| C2 Persistence / lag-distance gradient | **CONFIRMED** | ACTUAL-GREATER |
| C3 Return fraction | **CONFIRMED** | ACTUAL-LESS |
| C4 Chronology-conditioned circulation | NOT-CONFIRMED | — |
| C5 First-order directional path dependence | **CONFIRMED** | ACTUAL-GREATER |

これらは32個のendpoint-preserving temporal controlsに対するtrajectory-level contrastについて、exact two-sided sign testと5 endpoint固定Holm family（FWER=0.05）を適用した結果である。checkpointは独立sampleとして扱っていない。

## 解釈境界

本Studyがformalに示したのは、`CRCLGR-R1-EXACT-SQUASHED-L1`で表したbounded RAW depth-5 local geometry trajectoryに、単純なcheckpoint順序破壊では説明されにくいchronology-dependent structureが複数endpointで存在することである。

一方、次は示していない。

- causal dynamics
- physical hysteresis
- discrete strategic regimeの妥当性
- human difficulty / cognition
- best-move quality
- game-theoretic value
- whole-game geometry
- protected standard-root complete exact depth-10 holdoutに関する結果

特にC4は`NOT-CONFIRMED`であり、geometry-space circulationをphysical hysteresisの証拠として扱ってはならない。

## 正本

- [Study protocol](STUDY_1_PROTOCOL.md)
- [Final report](STUDY_1_FINAL_REPORT.md)
- [Current status](CURRENT_STATUS.md)
- [Decision register](DECISION_REGISTER.md)
- [Reproducibility index](REPRODUCIBILITY_INDEX.md)
- [Stage 2 formal result](results/stage-2/STAGE_2_FORMAL_RESULT.json)
- [Stage 2 formal inference](results/stage-2/STAGE_2_FORMAL_INFERENCE.json)

Historical Research Generation 3 `PROGRAM_PLAN.md`はhistorical recordとして変更しない。current stateは本ディレクトリとResearch Generation 3のcurrent-facing文書を正本とする。
