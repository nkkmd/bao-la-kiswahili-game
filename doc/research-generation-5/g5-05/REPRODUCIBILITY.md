# G5-05 — 再現性と保存

[仕様](SPEC.json)、[認可](AUTHORIZATION.json)、[ソース結合](SOURCE_MANIFEST.json)と[契約](CONTRACT.md)を事前固定する。AUTHORIZATIONはユーザーの継続指示に基づく開発供給だけを認可する。ソース固定コミットと技術CI合格を確認してから、[実行記録](executions/README.md)へ別triggerと消費leaseを追加する。

リポジトリroot・Node 24で `node --test test/g5-05-supply.test.cjs` を用いる。この技術テストは既知/抽象fixtureだけで、50513001..50513064を読まない。科学実行器はActionsのrun・attempt・trigger・binding・区画と永続leaseを照合し、既存STARTや再実行を拒否する。

保存済み証拠だけの再検算は `node tools/research/g5-05/verify.cjs doc/research-generation-5/g5-05/results` で行う。これは新規対局の生成ではない。SEED_READS.jsonlは生成前の消費、STATE_READS.jsonlは新規読取RAW状態の重複除去記録、EVIDENCE.json.gzは全軌跡/screen/閉包/途中単位、RESULT.jsonは要約、VERIFICATION.jsonは独立検算である。元結果を上書きする再実行はしない。検算は一時コピーで行うことを推奨する。
