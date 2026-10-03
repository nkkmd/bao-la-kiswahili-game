# AI-GEN4先後差研究ツール

[研究計画](../../../doc/first-player-gen4/PROTOCOL.md)と[再現・再開手順](../../../doc/first-player-gen4/REPRODUCIBILITY_INDEX.md)を先に確認してください。

`common.cjs`は公開経路・seed・ソース照合、`run.cjs`は1手単位の保存と対局、`aggregate.cjs`は全棋譜再生と保守的区間、`verify.py`は別言語の勝敗・手数再集計を担当します。科学条件を変えた場合は同じsource manifestで再開できません。

旧研究の結果や公開AIを改修するツールではありません。途中結果を正式結論にせず、全域の完全性検証後に報告してください。
