# G2-05 — 深層RAW状態空間の完全列挙

Research Generation 2 `G2-05` / `DRSSE-STUDY1`。

正式判断: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**。

本Studyでは、結果を見る前に固定したstandard initial Bao RAW stateからdepth 9までを、symmetry reductionやcanonicalizationを使わず完全列挙し、complete bounded domainを独立に再現しました。

canonical bounded endpointは次のとおりです。

```text
RAW states through depth 9 = 102857
depth-labelled legal edges from depths 0..8 = 106773
tree node occurrences through depth 9 = 136645
tree / cumulative RAW-state ratio = 1.328494900687362
```

## 最初に読む文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md)
- [`results/STUDY_1_FINAL_RESULT.json`](results/STUDY_1_FINAL_RESULT.json)

## closure後レビューの判断

- [`checkpoints/2026-08-28-pr71-review-disposition.md`](checkpoints/2026-08-28-pr71-review-disposition.md) — PR reviewで確認された2つのlatent implementation concernを記録し、accepted canonical runへ影響しない理由とfrozen formal source / no-rerun boundaryを保存しています。

## 将来の実装強化

- [`../research-program-decisions/2026-08-28-post-g2-05-raw-enumeration-hardening.md`](../research-program-decisions/2026-08-28-post-g2-05-raw-enumeration-hardening.md) — resource-censored prefix verification、final ambient / resource check、negative control、新しいsource identity / authorization、post-merge read-only closure audit、G2-12でbounded exact RAW enumerationを再利用する場合の要件を、将来のmandatory requirementとして固定しています。

このhardening recordはprospective onlyです。`DRSSE-S2-FORMAL-2026-08-28-v1`を変更・再実行せず、accepted G2-05 decisionも変更しません。

exact resultはfrozen standard-root depth-9 RAW domainに限定されます。Bao全体のstate-space countやfull-game complexity estimateではありません。
