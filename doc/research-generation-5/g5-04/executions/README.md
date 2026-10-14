# G5-04 — 実行認可と消費記録の入口

[TRIGGER.json](TRIGGER.json)は凍結ソースと技術push CIの成功を結合する。[LEASE.json](LEASE.json)はActions38263687093 / attempt 1が50412001..50412128全体をseedアクセス前に消費済みにした耐久記録である。

既存leaseは区画の再実行を拒否する。価値差や候補数が不足しても、同sourceの延長・追加・再選定・上限増加は認可しない。[認可](../AUTHORIZATION.json)と[最終報告](../REPORT.md)を参照する。
