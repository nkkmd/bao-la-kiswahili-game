# G5-02 — 実行認可と区画消費の入口

[TRIGGER.json](TRIGGER.json)は凍結ソースと成功した技術push CIに結合する実行開始記録である。[LEASE.json](LEASE.json)はActions run 38237119716 / attempt 1がseedアクセス前に50212001..50212032全体を消費済みにした耐久記録である。

このleaseの存在により新規科学区画の再実行を拒否する。結果が未完でも、source追加・上限引上げ・同区画再開は認可しない。[認可](../AUTHORIZATION.json)と[最終報告](../REPORT.md)を参照する。
