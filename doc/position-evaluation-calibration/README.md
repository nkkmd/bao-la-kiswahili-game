# Position Evaluation / Win-Rate Calibration Study 1

研究題目: **Baoにおける形勢評価値と実現勝率の校正 — phase-aware empirical win-probability calibration と評価値の解釈境界**

Status: **STUDY 1 CLOSED / FORMAL DECISION INCONCLUSIVE**  
開始日: 2026-08-18  
完了日: 2026-08-20

## 結論

Stage 1ではfresh 1,024-game exploratory corpusからphase-stratified isotonic mappingを選択した。Phase-aware logisticは凍結済み数値収束gateを満たさずineligibleであり、救済は行っていない。

Fresh Stage 2は2,048 games / seeds `22300001..22302048`で実施し、全局のindependent replay/measurement verificationがPASSした。Stage 1との最終identity overlapもtrajectory / opening / rule-stateの3軸すべて0だった。

しかしStage 2では、厳格なStage 1 identity firewallとno-replacement selection後に3つのestimability gateが未達となった。

```text
unique trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

したがってfrozen decision ruleにより:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

となる。

これはformal calibration failureではない。minimum-support条件のためheld-out calibration claimを確認も棄却もできなかったという結果である。

Descriptiveにはpooled Brier `0.155501...`、Namua `0.226781...`、Mtaji `0.080129...`だったが、formal performance criteriaはestimability failureのため未評価であり、これらの値で結果を救済しない。

## 最初に読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要

## 科学的・技術的な正本

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1全体の科学的統合
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) — Stage 2 canonical formal result
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hashes / artifacts / tooling索引
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態とimmutable boundaries
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — frozen scientific decisions / no-rescue rules
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) — stage/experiment index
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronology

## Machine-readable records

```text
results/STAGE_1_READINESS_AUDIT.json
results/STAGE_1_CALIBRATION_RESULT_SUMMARY.json
results/STAGE_2_READINESS_AUDIT.json
results/STAGE_2_FORMAL_RESULT_SUMMARY.json
```

## Frozen preregistration / authorization

```text
preregistration/STAGE_1_EXPLORATORY_SPEC.json
preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json
preregistration/STAGE_2_FORMAL_SPEC.json
preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
```

## Historical status labels

`STAGE_0_TECHNICAL_PROTOCOL.md`、`STAGE_1_EXPLORATORY_PROTOCOL.md`、`STAGE_2_FORMAL_PROTOCOL.md`、`HYPOTHESES.md`、`STATISTICAL_ANALYSIS_PLAN.md`、`SEED_AUDIT.md`、`STAGE_1_RUNBOOK.md`、`STAGE_2_RUNBOOK.md`には、prospective freezeまたは実行時点の `PENDING` / `NOT AUTHORIZED` / `OPEN` 等の表記が意図的に残っている。これらは当時のauthorization chronologyとpreregistration provenanceを保存する履歴文書であり、現在状態を示すものではない。

現在のscientific stateは [`CURRENT_STATUS.md`](CURRENT_STATUS.md)、[`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)、[`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) を正本とする。freeze-time文書を結果判明後に現在形へ書き換えて、当時の事前状態を消去しない。

## Interpretation boundary

本研究のcalibration mappingをformalにvalidatedされたBao勝率として扱わない。game-theoretic probability、human advantage perception、causal effect、別engine/search/populationへのgeneralizationも主張しない。

将来formal calibrationを再検証する場合は、同じStage 2 corpusを救済せず、identity-firewall attritionを事前に見込んだfresh prospective independent studyとする。
