# G5-04 — 保存結果の入口

[RESULT.json](RESULT.json)は128 source、2908 probe、固定8候補と完全閉包8件を示す。[VERIFICATION.json](VERIFICATION.json)は全source・両probe・閉包遷移・全解と既読集合の独立一致である。

- [EVIDENCE.json.gz](EVIDENCE.json.gz): 全sourceとdraw、深さ2/4の全probe・反例、旧読取集合、候補、全閉包・厳密解と今回の既読集合。
- [SEED_READS.jsonl](SEED_READS.jsonl)、[START.json](START.json)、[LEASE.json](LEASE.json): 読取前消費journal、開始、runの区画消費。
- [CANDIDATES_FROZEN.json](CANDIDATES_FROZEN.json): 全source処理後、解析前固定の8候補。
- [CHECKPOINT.json](CHECKPOINT.json)、[DOMAIN_IN_PROGRESS.json](DOMAIN_IN_PROGRESS.json): 実行中の保存境界で、再開認可や最終結果ではない原記録。
- [CI_RECEIPT.json](CI_RECEIPT.json): ソース・前確認・trigger・lease・mirror・run・artifactと各stepの来歴。
- [VALUE_DESCRIPTION.json](VALUE_DESCRIPTION.json)、[DESCRIPTION_MANIFEST.json](DESCRIPTION_MANIFEST.json): 保存解の全root手の記述と別hash結合。勝敗価値差0件・同価値内DTF差3件を分離する。探索比較・新規生成・再選定は0件。

[報告](../REPORT.md)と[再現性](../REPRODUCIBILITY.md)に意味と再確認手順を示す。JSON field、ID、hash、パス、判断tokenは機械正本として原表記を保持する。
