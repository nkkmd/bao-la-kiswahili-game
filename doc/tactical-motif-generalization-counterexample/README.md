# tactical motifの一般化範囲と反例領域 — `TMGC-STUDY1`

- 研究世代: `G2-09`
- Study ID: `TMGC-STUDY1`
- 研究開始時のremote `main`: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`
- 正式状態: **Study closed / `TECHNICAL-INVALID`**

## 正式研究題目

**Baoにおけるmachine-confirmed tactical motifの一般化可能範囲と反例領域のprospective検証 — phase, morphology, search condition, state familyを横断したTM-S2-C03のgeneralization boundary / counterexample boundaryの再現可能な特定**

## 結論

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = TECHNICAL-INVALID
```

Stage 1 scientific authorization前のtechnical-only tooling smokeでindependent boundary aggregatorが`ReferenceError`を発生させ、prospectively mandatoryだったproduction/independent exact verificationを完遂できなかった。事前freezeしたfailure mappingに従い、同一Study内で修正rerunによる救済を行わずclosureした。

Stage 1 scientific seeds `29110001..29114096`とStage 2 seeds `29210001..29218192`はともに未消費である。したがってC03のgeneralization/counterexampleについてscientific resultは生成されていない。

Research Generation 1の`TM-S2-C03 = CONFIRMED`、C01/C02/C04の`NOT-CONFIRMED`、human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`は変更しない。

## 最初に読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 人間向け概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合

## 詳細・正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — prospective protocol
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — terminal state
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — prospectiveな判断とno-rescue closureの記録
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — workflow / source / artifact provenanceの再現性索引
- `results/STAGE_1_TECHNICAL_INVALID_RESULT.json` — Stage 1のcanonicalなtechnical-invalid結果
- `results/STUDY_1_FINAL_RESULT.json` — Study-level terminal result
- [`checkpoints/2026-08-30-stage1-tooling-smoke-technical-invalid.md`](checkpoints/2026-08-30-stage1-tooling-smoke-technical-invalid.md) — failure closure checkpoint

## state identity・人間検証に関する境界

Authoritative identityはRAW identityのみ。validated transform setは空で、canonicalization / symmetry reductionは使用しない。本Studyはmachine-onlyであり、人間/expert recognition、difficulty、error probability、traditional terminologyを推定しない。
