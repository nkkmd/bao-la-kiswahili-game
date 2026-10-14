# G5-04 — 再現性と証拠索引

## 固定正本

[契約](CONTRACT.md)、[SPEC](SPEC.json)、[ソースmanifest](SOURCE_MANIFEST.json)、[認可](AUTHORIZATION.json)をソース固定コミット `2201b082f9ea46833b6effbcb62be5898b9b450d` に結合した。旧3 Studyの圧縮証拠と依存エンジン・識別・解法もバイトhashで固定している。

[trigger](executions/TRIGGER.json)、[耐久lease](executions/LEASE.json)、[CI来歴](results/CI_RECEIPT.json)、[結果入口](results/README.md)から保存正本へ進む。原証拠は `6a103cf4f55ec9e7ec84cf31f6d878fae3fb3ef4` で保存し、artifact期限後も研究ブランチで利用できる。

## 再確認

次の前確認は既知fixture、後半は保存済みsource・両probe・全閉包・全解の独立再生と保存解の記述を行う。新規科学区画を生成しない。

```bash
node --test test/g5-04-supply.test.cjs
node tools/research/g5-04/verify.cjs doc/research-generation-5/g5-04/results
node tools/research/g5-04/describe-values.cjs doc/research-generation-5/g5-04/results
```

保存解記述は[DESCRIPTION_MANIFEST](results/DESCRIPTION_MANIFEST.json)に別結合する。勝敗価値差0件と同価値内DTF差3件を分離し、探索の選択誤りや正式関係結果へ読み替えない。

`CHECKPOINT.complete: false` と最後の `DOMAIN_IN_PROGRESS.json` は実行中の保存境界の原記録である。最終判断はRESULT・VERIFICATION・CI来歴で確認し、このmarkerからの解析延長は認可しない。
