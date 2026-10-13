# 第1版・第2版の原CIを取得した確認

第1版run `38473413073` / head `430c902b822d0a86aa3a3cfb3452dc837c3c3f4b`と第2版run `38474301794` / head `67984fa90b305cb8092f80d8b74392b94a659fcb`のattempt 1、全10原ZIPを取得した。全ZIP digestと全member hash、token形式の内容検査を確認し、[取得receipt](results/CI_ACQUIRED_RECEIPT.json)とresults/acquiredへ別保存する。原成果物の取得は実験の再実行ではない。

| 版・case | CIの原判定 | ACK / marker | 保存記録の意味 |
| --- | --- | --- | --- |
| 第1版・通常 | success | 128 / 128 | 全128 source・1閉包・最終mirrorが成立 |
| 第1版・host OOM | success | 1 / 1 | host停止、科学用再開なし |
| 第1版・応答抑止 | success | 0 / 1 | 成立済みmarkerと未ACK1を保持 |
| 第1版・短縮期限 | failure | 4 / 4 | 回収tmpのEACCES、RESULTとSCENARIOなし。bundleとlocal保存prefixだけを独立検算 |
| 第1版・最終mirror proxy拒否 | success | 128 / 128 | worker完了、終了mirrorなし、技術完了false |
| 第2版・通常 | failure | 22 / 22 | Git commit_refs拒否、128件未完、終了mirrorなし |
| 第2版・host OOM | success | 1 / 1 | host停止、科学用再開なし |
| 第2版・応答抑止 | success | 0 / 1 | 成立済みmarkerと未ACK1を保持 |
| 第2版・短縮期限 | success | 1 / 2 | 未ACK1とprefixを保持。ただし停止後の回復mirrorがあり、全write遮断は未成立 |
| 第2版・最終mirror proxy拒否 | failure | 44 / 44 | Git commit_refs拒否。予定した終了mirror拒否点へ未到達 |

旧successを取消して原RESULTを改変することも、旧failureを第3版の合格へ付け直すこともしない。第2版の通常/proxy失敗でhost exit codeが0だったことも、処理成功を意味しない。内部HOST_RESULTとguard reason、未完SCENARIOを併読する。

独立検算は原bundleから全Git履歴・lease/marker/mirrorのhashとjournalを再生し、最後のremote mirrorとlocal保存sourceをそれぞれ旧完成source検算または保存prefix検算へ渡す。途中snapshotのnull、未保存の手・screenを補わない。全10caseの独立検算が一致し、[取得後結果](results/ACQUIRED_REPLAY.json)へ固定した。全10技術refの現headも原bundleと一致した。成功RESULTが存在するcaseでは証拠digest・資源区画を検算し、実行headの元の入力manifest digestとも一致した。第1版期限caseの取得後に導出する検算行は診断出力であり、存在しなかったSCENARIOやRESULTを原成果物へ追加しない。

科学source生成・科学seed消費は0、科学leaseなし、Study未登録/未実行、main・公開AI未変更である。修正と未完条件は[V3修正](V3_REVISION.md)、次工程は[V3再開位置](V3_RESUME_HERE.md)を参照する。

原ZIPを各artifact IDのdirectoryへ解凍した後、次で保存済み証拠を再検算できる。新sourceの生成や旧refへの書込みは行わない。

```sh
node tools/research/g5-befcs-remote-joined/verify-history.cjs <extracted-artifact-parent> <diagnostic-output.json>
```
