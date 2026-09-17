# LGTTCI-STUDY1 — 再開位置

更新日: 2026-09-17  
状態: **`STAGE 0 AUTHORIZED / NOT EXECUTED`**

## 現在地

```text
Study = LGTTCI-STUDY1
Program position = Research Generation 4 / G4-01
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Research branch = research/g4-01-transfer-compatibility-instrument
Stage 0 = LGTTCI-S0-TECHNICAL-2026-09-17-v1 / AUTHORIZED / NOT-EXECUTED
Stage 1 = LGTTCI-S1-COMPATIBILITY-2026-09-17-v1 / NOT-AUTHORIZED-NOT-EXECUTED
fresh compatibility seed access = 0
formal effect generation = 0
```

## 再開時の読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
3. [`authorizations/STAGE_0_AUTHORIZATION.json`](authorizations/STAGE_0_AUTHORIZATION.json)
4. [`../research-program-decisions/2026-09-17-post-rg3-pre-g4-01-authorization-review.md`](../research-program-decisions/2026-09-17-post-rg3-pre-g4-01-authorization-review.md)
5. G3-12 final reportのtechnical failure節

## 次に行うこと

Stage 0用のproduction/independent compatibility wrapperとrunnerを実装する。

実装では特に次を守る。

- `rootLegalWidth < 2`をsearch helper呼出し前に検出する。
- singleton rootでは`NON-ESTIMABLE / ROOT-LEGAL-WIDTH-LT2`を返し、`silgm-production.js` / `silgm-independent.js`のhard assertionへ到達させない。
- rankable rootだけでfrozen search conditionsを実行する。
- production wrapperはindependent wrapperをimportしない。
- independent wrapperはproduction wrapperをimportしない。
- technical fixture seed `44010001..44010064`だけを使用する。
- Stage 1 seed `40111001..40113384`へアクセスしない。
- G3-12のseed、selected root、partial measurementをreadしない。

Stage 0実行後は、result artifact、source hash、resource telemetry、production/independent一致を監査する。PASSしてもStage 1を自動開始せず、post-Stage0 authorization reviewを行う。

## 禁止事項

- fresh compatibility seedの先行read
- G3-12のsame-evidence replay
- G3-11 depth 10の再実行
- G4-10 depth 11へのアクセス
- formal effect、p-value、generalization/counterexample decisionの生成
- Stage 0結果確認後のroot contract・source policy・support gate緩和
- `main`への進行中Studyの統合
