# UMSSR-STUDY1 — 再開位置

## 現在の安全な状態

G2-10の専用branchは作成済みで、scientific evidence生成前のinitial prospective freezeをmaterializeする段階にある。

```text
branch = research/g2-10-unified-multiaxial-strategic-state-representation
baseline main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
Study = UMSSR-STUDY1
Stage 0 = NOT-YET-EXECUTED
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds = RESERVED / UNCONSUMED
Stage 2 seeds = RESERVED / UNCONSUMED
```

## 次回最初に読む

1. `CURRENT_STATUS.md`
2. `DECISION_REGISTER.md`
3. `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
4. `CANDIDATE_AXIS_INVENTORY.md`
5. `STUDY_1_PROTOCOL.md`
6. `prereg/STUDY_1_INITIAL_CONTRACT.json`
7. `REPRODUCIBILITY_INDEX.md`

## 次に行う作業

1. initial freeze commitの内容を再取得し、文書間のStudy ID / Stage ID / seed / RAW identity / eligibility categoryが一致することを監査する。
2. 日本語品質ゲートを初期文書へ適用する。
3. Stage 0 technical-only contract / fixtures / validatorを実装する。
4. scientific seedを使わずにStage 0 technical smokeを行う。
5. Stage 0 PASS後にのみ、Stage 1のsource / feature / model-selection / readiness / promotion / decision mappingをmachine-readable specへfreezeする。
6. Stage 1 explicit authorization artifactが存在するまで`29310001..29314096`を消費しない。

## 禁止

- G2-06〜G2-09のdevelopment outputをvalidated axisとして昇格しない。
- G2-09の未消費seedをG2-10で再利用しない。
- symmetry / canonicalizationを導入しない。
- G2-11のlong-horizon endpointを先取りしない。
- outcomeを見る前に固定すべきthreshold / feature / clustering ruleを後付けしない。
