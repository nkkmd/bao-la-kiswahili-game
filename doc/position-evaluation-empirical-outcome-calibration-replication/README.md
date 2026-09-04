# G2-01 — 形勢評価と実現勝敗の校正再検証

program上の位置: `G2-01`
Study ID: `PEOCR-STUDY1`
状態: **完了 / 正式判断 `INCONCLUSIVE`**
研究世代: **Research Generation 2**

正式英語名: **Position Evaluation / Empirical Outcome Calibration Replication Study 1**

## 結論

Research Generation 1の`PEC-STUDY1 = INCONCLUSIVE`を変更・救済せず、新しいfresh populationを用いて、actor-relative static Bao evaluationとempirical continuation outcomeのheld-out calibration replicationを実施しました。

Stage 1は2,048 fresh gamesで全readiness gateをPASSし、phase-stratified isotonic PAVA mappingを`MODEL-FROZEN-DEVELOPMENT`として固定しました。

Stage 2は8,192/8,192 fresh gamesを生成し、8 shardすべての独立replay、統合後のselection / measurement独立verification、Stage 1とのcross-stage overlap `0 / 0 / 0`を達成しました。

しかし、strict firewall後に3つのestimability gateが未達となりました。

```text
unique trajectories after firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
```

正式判断は`PEOCR-STUDY1 = INCONCLUSIVE`です。Primary Brier / log-loss formal branchには入っておらず、`NOT-CONFIRMED`ではありません。

## 最初に読む文書

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
6. [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
7. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)

## 変更しない境界

- Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`はimmutableです。
- RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`を維持します。
- formal deduplicationにsymmetry / canonicalizationは使用していません。
- Stage 2 seed extension、replacement、gate relaxation、mapping refit、subgroup rescueは承認されていません。
- game-theoretic、human-perception、causal、public-AI-quality、AI-generationに関するclaimは本Studyの範囲外です。
