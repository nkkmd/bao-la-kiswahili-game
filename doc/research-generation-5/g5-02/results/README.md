# G5-02 — 保存結果の入口

[RESULT.json](RESULT.json)は規定の供給工程完了、候補8件、完全閉包0件を示す。[VERIFICATION.json](VERIFICATION.json)は保存済み32 sourceと40282辺の独立照合合格であり、未完閉包の厳密解を保証しない。

- [EVIDENCE.json.gz](EVIDENCE.json.gz): 全sourceの着手・乱数draw、旧読取集合、候補、部分閉包、状態上限の子局面、今回の読取集合を保存する圧縮正本。
- [SEED_READS.jsonl](SEED_READS.jsonl)、[START.json](START.json)、[LEASE.json](LEASE.json): seed読取前消費journal、開始、当該runの区画消費を示す。
- [CANDIDATES_FROZEN.json](CANDIDATES_FROZEN.json): 全32 source処理後、解析前に固定した8候補。
- [CHECKPOINT.json](CHECKPOINT.json)、[DOMAIN_IN_PROGRESS.json](DOMAIN_IN_PROGRESS.json): 実行中の保存境界。falseや最後のmarkerは最終結果と別の原記録であり、再開認可ではない。
- [CI_RECEIPT.json](CI_RECEIPT.json): ソース、前確認、trigger、lease、mirror、run・artifact・各stepの来歴。
- [SAVED_GRAPH_DIAGNOSTIC.json](SAVED_GRAPH_DIAGNOSTIC.json)、[DIAGNOSTIC_MANIFEST.json](DIAGNOSTIC_MANIFEST.json): 保存辺だけの事後記述と別ソース結合。追加生成・解析・再選定は0件。

[最終報告](../REPORT.md)と[再現性](../REPRODUCIBILITY.md)に意味と再確認手順を示す。JSON field、hash、判断tokenは機械記録として原表記を保持する。
