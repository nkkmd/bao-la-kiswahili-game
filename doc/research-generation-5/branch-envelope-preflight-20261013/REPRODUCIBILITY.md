# 技術preflightの再現性

## 正本とhash

[SOURCE_MANIFEST.json](SOURCE_MANIFEST.json)は新しいsource/独立再生/保存/BFS wrapper、テスト、CONFIG、技術契約、workflowを固定する。[PROTECTED_INPUTS.json](PROTECTED_INPUTS.json)は555先行入力・原記録・公開資産のbyte hashを保持する。[OUTPUT_BINDING.json](OUTPUT_BINDING.json)は機械結果・圧縮証拠・実行計測を固定する。科学用source manifestとは別の技術記録である。

[RESULT.json](results/RESULT.json)は判断・固定fixture結果・遮断数・証拠hashを、[TECHNICAL_EVIDENCE.json.gz](results/TECHNICAL_EVIDENCE.json.gz)は全source trace/screen・閉包・bundle indexと全片を、[EXECUTION.json](results/EXECUTION.json)は初回process時間・RSSを保存する。容量試験の大きな固定bytesは再生成可能なfixtureであり、結果へ境界と全片bytesを残す。

## 再生コマンド

Node 24.19.0で以下を実行する。`--check`は保存済みfixtureだけを再生し、科学sourceを生成しない。

```sh
node --test test/g5-branch-envelope.test.cjs test/g5-compact-bfs.test.cjs
node tools/research/g5-branch-envelope/run.cjs --check
```

技術workflowは`.github/workflows/g5-branch-envelope-preflight.yml`で、contents権限はreadだけである。source hash・保護入力・結果・全gzip証拠bytesを照合する。GitHub CI runと最終headはPR本文へ記録する。

fixture専用seedはCONFIGのallowlistに限る。提案の科学seed blockを読む入口は拒否する。固定fixtureの再生を科学区画の再試行認可へ読み替えない。
