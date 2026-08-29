# G2-02 — 探索信頼性と意思決定頑健性

`G2-02` / `SRDR-STUDY1`は完了済みのResearch Generation 2 prospective independent Studyです。

正式判断:

```text
INCONCLUSIVE
```

Stage 2のsearch measurementとindependent verificationは成功しましたが、事前登録したestimability gateの1件がunique trajectoriesで10不足しました（`1040 < 1050`）。

そのためprimary formal criterionは評価されず`null`であり、結果は`NOT-CONFIRMED`ではありません。

## 読む順序

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
6. [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)

## 境界

higher-resource searchはfrozen comparison referenceであり、game-theoretic truthではありません。

本Studyはhuman difficulty、engine correctness、optimal play、empirical win probability、public AI strengthをvalidateしません。

`INCONCLUSIVE` resultを、同じStage 2 seed blockのextensionやfailed gateのrelaxationで救済することはできません。
