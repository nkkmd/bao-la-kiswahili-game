# PBAI-P6 — 保存済みの検証証拠

正式判断は`DEVELOPMENT-GATE-FAIL / HOLD`。論理ゲート型候補は開発用評価の速度条件を満たさず、対局・validation・holdoutへ進まなかった。

- [最終判断](final-result.json)
- [開発用の比較集計](development-summary.json)
- [学習記録](training.json)
- [PythonとJavaScriptの出力照合](export-verification.json)
- [source再生と教師再計算](replay-verification.json)
- [指標と条件の独立集計](independent-audit.json)
- [全22ファイルのarchive](final-evidence.tar.gz)と[SHA-256索引](final-evidence-index.json)
- [archiveの全件照合](archive-audit.json)

詳しい意味と限界は[最終報告](../../doc/ai-engineering/public-ai-improvement-program-6/PROGRAM_FINAL_REPORT.md)を参照する。runディレクトリの開始markerは再実行防止のためGitに保持している。archiveを検算用に展開する場合は別ディレクトリを使い、測定を再開始しない。
