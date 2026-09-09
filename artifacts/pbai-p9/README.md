# PBAI-P9：保存証拠の案内

正式判断は `STRENGTH-IMPROVED-IN-COLD-WORKER-DOMAIN` である。主要256局は151勝105敗、勝点率58.984375%、95%区間55.078125〜62.890625%となった。公開判断は `NO-RELEASE / KEEP-AI-GEN3` である。意味と限界は[最終報告](../../doc/ai-engineering/public-ai-improvement-program-9/PROGRAM_FINAL_REPORT.md)を参照する。

[最終判定](FINAL_RESULT.json)、[独立集計](independent-audit.json)、[棋譜再生確認](replay-verification.json)、[開始記録](RUN_STARTED.json)を保存した。段階別要約は[pilot](pilot-matches.json)、[holdout](holdout-matches.json)、[low](low-matches.json)である。これらの工程名は機械的識別子として保持する。

[全証拠アーカイブ](final-evidence.tar.gz)は195ファイル、1681267バイトである。[索引](final-evidence-index.json)に全件のサイズとSHA256を記録した。アーカイブのSHA256は次の値である。

```text
df78cb5b91c4e4e474313b81adb6153ab04c53a8b5b9e8c4c781ea7f9545f58c
```

保存内容には全176ペアの棋譜、採用・棄却を含む元軌跡記録、seedと各手のアクセス記録、段階別要約、監視の開始・終了、独立検算、console出力、凍結コミットのブラウザ結果を含む。ブラウザは[78件の原結果](browser-frozen-report.json)と[出自](browser-frozen-provenance.json)も個別に参照できる。

`python tools/engineering/verify-pbai-p9-archive.py` をリポジトリのルートで実行すると、測定せずに195ファイルと凍結ソース74ファイルを確認する。正式実行や時間付き対局を再実行せず、開始markerと元の記録を保持する。
