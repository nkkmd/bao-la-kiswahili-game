# G5-03 — 再現性と証拠索引

## 固定記録

[契約](CONTRACT.md)、[仕様](SPEC.json)、[ソースmanifest](SOURCE_MANIFEST.json)、[認可](AUTHORIZATION.json)をソース固定コミット `8eb7e46b0fd5ce38d69f0c0579bf3d622fd2654a` に結合した。旧2 Studyの圧縮証拠とエンジン・RAW・解法もバイトhashで固定した。

[trigger](executions/TRIGGER.json)と[耐久lease](executions/LEASE.json)、[CI来歴](results/CI_RECEIPT.json)、[結果入口](results/README.md)を読む。原証拠の保存コミットは `8e4090020bd474e7d8ae7a2d40c19a2d14c8c02c` で、artifact期限後も研究ブランチの正本を利用できる。

## 保存証拠の再確認

次のコマンドは既知fixture確認、保存source・probe・辺・全解の独立再生、保存解だけの事後記述を行う。新規科学区画の生成は行わない。

```bash
node --test test/g5-03-supply.test.cjs
node tools/research/g5-03/verify.cjs doc/research-generation-5/g5-03/results
node tools/research/g5-03/describe-values.cjs doc/research-generation-5/g5-03/results
```

事後記述は[DESCRIPTION_MANIFEST](results/DESCRIPTION_MANIFEST.json)に別結合する。probeと閉包・解を区別し、8 rootの全手同価値を正式な関係の不存在へ拡張しない。

`CHECKPOINT.complete: false` と最後の `DOMAIN_IN_PROGRESS.json` は実行中の保存境界の原記録である。最終完了はRESULT・VERIFICATIONとCI来歴で確認する。これらのmarkerからの新規解析再開は認可しない。
