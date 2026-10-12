# G5-03 — 認可と区画消費の入口

[TRIGGER.json](TRIGGER.json)は凍結ソースと成功した技術push CIを結合する。[LEASE.json](LEASE.json)はActions38239145152 / attempt 1が50312001..50312064全体をseedアクセス前に消費済みにした耐久記録である。

既存leaseにより再実行を拒否する。候補の価値差が0件でも同sourceの延長・追加・再選定を認可しない。[認可](../AUTHORIZATION.json)と[最終報告](../REPORT.md)を参照する。
