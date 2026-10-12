# G5-01 Stage 1 — 保存済み開発証拠

`RESULT.json` は実行要約、`EVIDENCE.json.gz` はsource全着手・候補・試行閉包・読取識別一覧、`VERIFICATION.json` は独立再生と検算の記録である。seed消費は `SEED_READS.jsonl`、開始来歴は `START.json` とlease、候補固定は `CANDIDATES_FROZEN.json` に保存する。

`CHECKPOINT.json` は処理途中の行政的な保存記録であり、最終状態は `RESULT.json` を正本とする。自動resumeや科学的な同一区画の再実行を許可するものではない。

`SUPPLY_DIAGNOSTIC.json` は保存済みsourceを使う事後の説明用集計で、元の実行結果・契約を変更しない。[報告](../REPORT.md)で意味と限界を説明する。

候補0件のため、新規の完全閉包・解は含まれない。`completeDomains: 0` を閉包解析で全候補が失敗したという結果に読み替えない。
