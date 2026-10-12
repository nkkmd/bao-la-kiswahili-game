# G5-03 — 保存結果の入口

[RESULT.json](RESULT.json)は64 source、674 probe、固定8候補と完全閉包8件を示す。[VERIFICATION.json](VERIFICATION.json)は全source・probe・閉包遷移・全解と既読集合の独立一致を示す。供給成功を正式関係の確認へ昇格しない。

- [EVIDENCE.json.gz](EVIDENCE.json.gz): 全sourceとdraw、全probe・早期反例、旧読取集合、候補、全閉包・厳密解、今回の既読集合の圧縮正本。
- [SEED_READS.jsonl](SEED_READS.jsonl)、[START.json](START.json)、[LEASE.json](LEASE.json): 読取前消費journal、開始、runの区画消費。
- [CANDIDATES_FROZEN.json](CANDIDATES_FROZEN.json): 全source処理後、解析前固定の8候補。
- [CHECKPOINT.json](CHECKPOINT.json)、[DOMAIN_IN_PROGRESS.json](DOMAIN_IN_PROGRESS.json): 実行中の保存境界。最終結果と別の原記録で、再開認可ではない。
- [CI_RECEIPT.json](CI_RECEIPT.json): ソース・前確認・trigger・lease・mirror・run・artifact・各stepの来歴。
- [VALUE_DESCRIPTION.json](VALUE_DESCRIPTION.json)、[DESCRIPTION_MANIFEST.json](DESCRIPTION_MANIFEST.json): 保存解だけの事後記述と別hash結合。root内で価値差・DTF差のある事例は0件。探索比較・新規生成・再選定は0件。

[報告](../REPORT.md)と[再現性](../REPRODUCIBILITY.md)に意味と再確認手順を示す。JSON、ID、hash、パス、判断tokenは機械正本として原表記を保持する。
