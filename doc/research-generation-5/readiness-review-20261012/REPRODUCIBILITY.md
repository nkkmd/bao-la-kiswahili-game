# 準備再評価 — 再現性と原記録の保持

[ソースmanifest](SOURCE_MANIFEST.json)は終了済み4 Studyの依存コード、仕様・認可、lease・trigger、結果・圧縮証拠・検算・来歴とレビューコード・設計案を結合する。原証拠はそれぞれのStudyに保持し、このレビューへ修正コピーしない。

次のコマンドは人工・既知fixtureのgateテストと、保存証拠の一時コピーに対する4 verifierの独立再生を行う。新規科学seedや対局は生成しない。

```bash
node --test test/g5-readiness.test.cjs
node tools/research/g5-readiness/review.cjs --check
```

全ての原VERIFICATIONと再生結果が同じバイトであることを確認し、一時コピーを削除する。レビューの結果も保存JSONとdeep一致する。再計算のelapsedや現在時刻を科学結果に混入させない。

[RESULT_BINDING.json](results/RESULT_BINDING.json)はレビュー出力のバイトhashを別に保持する。ソース固定後に生成・修正して循環hashを作らない。[結果入口](results/README.md)と[研究ログ](RESEARCH_LOG.md)を参照する。
