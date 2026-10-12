# G5-05 — 再現性と保存

## 正本と実行来歴

[仕様](SPEC.json)、[認可](AUTHORIZATION.json)、[ソース結合](SOURCE_MANIFEST.json)、[契約](CONTRACT.md)、[実行前レビュー](PREEXECUTION_REVIEW.md)は実行前の原記録として保持する。AUTHORIZATIONのAUTHORIZED-SUPPLY-ONCEはユーザー指示に基づくこの開発供給のみを認可した。正式関係やmain統合の認可ではない。

| 記録 | 識別 |
| --- | --- |
| 固定ソース | 5788018db4cd596284f2118cab1e89322c27c141 |
| 技術push CI | 38313409621、success |
| 別trigger | ad87177dc290bfc0d8c573c42b54fca5483c6b3e |
| 永続lease | ee4da295807e298a5ccc381bbd9c5e9d6d2bfd56 |
| 原証拠mirror | 5cfe0f00629f65995a2d6be5889cebbe68bb8940 |
| Actions | [38313556402](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38313556402)、attempt 1、success |
| artifact | 11776130841、g5-05-supply-38313556402-1 |
| binding | d5e65dd984548470c7d0dbac7913cad4cfa7f5532cf2bb7457d82818c01cbf0a |

[CI_RECEIPT](results/CI_RECEIPT.json)でjob、artifact、step、原検算のバイト一致を辿れる。圧縮EVIDENCEのSHA-256はbe9ec19e16527d462d9e6581d6be3f985732d76780888ee41244b790bf07c0e6、状態journalのSHA-256は70ae4392c19098e23fa9f6a10b2c720d9f405bef8fd9886d5cf48b8816ef07eeである。

## 保存記録の意味

SEED_READS.jsonlは生成前の消費、STATE_READS.jsonlは新規読取RAW状態の重複除去とfsync記録、EVIDENCE.json.gzは全軌跡/screen/部分閉包/途中単位、CANDIDATES_FROZEN.jsonは閉包前の候補固定、RESULT.jsonは最終要約、VERIFICATION.jsonは独立検算である。CHECKPOINTのcomplete falseは再開を許さない保存checkpointの設定であり、最終判断はRESULTにある。DOMAIN_IN_PROGRESSは最後の試行の開始記録で、結果の全8領域処置が最終状態である。

事後記述は[DESCRIPTION_MANIFEST](DESCRIPTION_MANIFEST.json)で記述器・原証拠・来歴・旧既読入力を結合し、[DESCRIPTION_BINDING](DESCRIPTION_BINDING.json)で[DESCRIPTION](results/DESCRIPTION.json)のバイトを固定する。Science用source manifest・generator・verifier・原結果を変更せず、追加は読取専用の記述器と監査workflowである。

## 再生

リポジトリroot・Node 24で `node --test test/g5-05-supply.test.cjs` は12技術fixtureだけを用いる。新規科学区画を再生成しない。

原結果の一時コピーに対して `node tools/research/g5-05/verify.cjs COPY_DIRECTORY` を実行し、VERIFICATION.jsonが原バイトと一致することを確認する。記述の再生は `node tools/research/g5-05/describe-saved.cjs --check`。新しいSaved Supply Audit workflowはcontents readで同じ検算を行う。科学実行器を再起動せず、leaseを削除・上書きしない。
