# 全閉包統合の再現性

[SOURCE_MANIFEST.json](SOURCE_MANIFEST.json)は基底80800aec8ba502718a889657a763c89dbf53f257と29入力を固定する。manifest SHA256は48e1e762f2a1fd9119db7bbab9d8620107408e7e07520e77140e4b3a058b1e53である。旧科学記録と先行方法コード・結果を同じバイトで読む。

固定fixtureの再生は次のコマンドで実行する。科学sourceを生成せず、結果とgzip内の元JSONをbyte単位で比較する。

```sh
node --test test/g5-compact-bfs.test.cjs
node tools/research/g5-compact-bfs/run.cjs --check
```

[TECHNICAL_EVIDENCE.json.gz](results/TECHNICAL_EVIDENCE.json.gz)はcanonical全領域・解・base64 snapshot・元journalを収める。各snapshot/journalのSHA256は[RESULT.json](results/RESULT.json)にある。元証拠JSONのSHA256はf156d587098c699f74c93edb48f4b472457f3cb311941e4ab4f35731169b5263である。

EXECUTION、BENCHMARK、PROCESS_MEASUREMENTは元の時刻/資源測定記録として保持し、CIで数値を再生成・上書きしない。[MEASUREMENT_MANIFEST.json](MEASUREMENT_MANIFEST.json)は補助observerと補助契約、初回測定を別に結ぶ。[OUTPUT_BINDING.json](OUTPUT_BINDING.json)は全結果・入力manifest・補助コード・補助契約・workflowを結ぶ。CIは固定証拠再生と全出力hashを確認する。

`--write` とmeasure-runは技術成果物の作成用であり、保存済み元記録の上書きや科学run再試行に使わない。再現のための固定fixture実行は新規科学区画の消費ではない。独立参照コードは主BFS/主codec/主復号器をimportせず、共通の旧RAW/手key契約を用いる。
