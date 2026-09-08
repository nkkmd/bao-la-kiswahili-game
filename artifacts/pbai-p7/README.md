# PBAI-P7 — 保存済み成果物

正式判断は[final-result.json](final-result.json)の`TECHNICAL-INVALID / HOLD`。最終512局は完了したが、必須検算が0／−0の比較で停止した。後から追加した診断・集計の成功は、正式判断の変更を意味しない。

## 記録の内容

- [全記録archive](final-evidence.tar.gz)と[SHA-256索引](final-evidence-index.json) — 元の実行と終了後調査の382ファイル
- [開発用評価](development-summary.json)と[検証用評価](validation-summary.json) — 時間・誤差・戦術の要約
- [開発対局](development-matches.json)、[検証対局](validation-matches.json)、[最終対局](holdout-matches.json) — 保存済み成績
- [終了後の原因調査](postclosure-incident.json)と[全件照合](postclosure-replay-verification.json) — ゼロ符号差2件と照合結果
- [終了後の記述的集計](postclosure-independent-audit.json) — 同じ数値式による参考計算。内部の改善判定をProgramの正式判断へ読み替えない
- [開始marker](run/RUN_STARTED.json) — 再実行を防ぐためGitへ保存した開始記録

archiveのSHA-256は`c74f07dabcc7e4eb6630513aba3b076de7f3697b114b0c7882e82bcd3a791a9b`。元の実行commitは`89276ddf1fcb06f313403028901c417867755a6a`。各ファイルのbyte数とhashは索引を正本とする。

## 読取専用の確認

```sh
python tools/engineering/verify-pbai-p7-archive.py
```

この確認は新規の生成・学習・時間測定・対局を行わない。正式な成功ファイル`replay-verification.json`と`independent-audit.json`は存在せず、`postclosure-*`は終了後の診断として明示的に区別する。元の結果や開始markerを置き換えない。

[最終報告](../../doc/ai-engineering/public-ai-improvement-program-7/PROGRAM_FINAL_REPORT.md)と[再現性](../../doc/ai-engineering/public-ai-improvement-program-7/REPRODUCIBILITY_INDEX.md)を参照する。
