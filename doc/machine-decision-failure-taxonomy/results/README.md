# MDFT-STUDY1 Results

更新日: 2026-08-30
状態: **Study closed / `NON-ESTIMABLE`**

このディレクトリにはResearch Generation 2 `G2-08` / `MDFT-STUDY1`のcanonical resultを保存します。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

主要result:

- `STAGE_0_TECHNICAL_RESULT.json` — Stage 0 technical result。scientific inferenceではありません。
- `STAGE_1_DEVELOPMENT_RESULT.json` — Stage 1 canonical development result。
- `STAGE_1_FINAL_EXACT_COMPARISON.json` — production / independent exact comparison。
- `STAGE_1_ARTIFACT_MANIFEST.json` — Actions artifact / full shard provenance。

Stage 1 seeds `28910001..28914096`は`CONSUMED`、Stage 2 seeds `29010001..29018192`は`RESERVED / UNCONSUMED`です。

Stage 1はtechnical integrityとmandatory artifact preservationを満たしましたが、distinct opening prefixes `2836 < 3000`とLOW_CAPTURE share `170/512 = 0.33203125 > 0.32`の2 global readiness gateが未達だったため`NON-ESTIMABLE`で閉じました。Leaf-level promotion calculationがtrueだったF01/F02/F03/F05/F06/F10もvalidated taxonomyまたはStage 2 targetへ昇格させません。

詳細は`../STUDY_1_FINAL_REPORT.md`、`../CURRENT_STATUS.md`、`../DECISION_REGISTER.md`、`../REPRODUCIBILITY_INDEX.md`を参照してください。
