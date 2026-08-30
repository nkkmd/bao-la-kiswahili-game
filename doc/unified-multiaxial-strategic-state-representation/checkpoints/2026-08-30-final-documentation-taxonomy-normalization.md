# UMSSR-STUDY1 — 最終文書taxonomy正規化

日付: 2026-08-30
状態: **DOCUMENTATION-TAXONOMY-NORMALIZED / SCIENTIFIC-RESULT-UNCHANGED**

## 検出事項

最終関連文書監査で、Stage 1の正式development disposition `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`を、一部closure文書がStudy-level formal decisionとしても記載していた。

凍結済み`STUDY_1_PROTOCOL.md` §13では、Stage 1 vocabularyと`Stage 2 / Study` vocabularyを明示的に分離している。Stage 1ではeligible representationが0だったためStage 2 prerequisiteを満たさず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。

## 正規化後

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
selectedRepresentation = null
Stage 1 seeds = CONSUMED
Stage 2 seeds = RESERVED / UNCONSUMED
```

## 科学的非変更事項

次は変更していない。

- accepted Stage 1 scientific artifact
- Stage 1 seed consumption
- 40-feature dictionary / active feature set
- deterministic K-means `K=2..6`
- support / silhouette / stability threshold
- candidate K metrics
- production / independent exact verification
- Stage 2 non-authorization
- G2-11 candidate-input prohibition
- no-rescue rule

この正規化はscientific resultの再判定ではなく、凍結済みdecision taxonomyへclosure文書を整合させるdocumentation-only correctionである。
