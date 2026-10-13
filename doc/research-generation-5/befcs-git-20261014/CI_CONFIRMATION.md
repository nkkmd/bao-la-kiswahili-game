# 実認証Gitと取得証拠の確定

実装head `2879c65dc7dba706d9834edc639fd987663efaac`、tree `c72a563bd160f12b299da4bff1557132dce0dbb8`のPR12＋push1、計13ワークフローがすべてsuccessとなった。実認証はpush run `38428546919` / attempt 1 / job `115404573219`で行い、local job `115404305259`も合格した。認証・実Git・競合・2種類のproxy拒否・raw bundle再生・artifact保存まで全stepが合格している。

## 実測結果

| case | commit | marker / ACK | 最終mirror | 結果 |
| --- | ---: | ---: | --- | --- |
| 正常 | 4 | 1 / 1 | あり | FINISHED |
| 古いexpected SHA | 2 | 0 / 0 | なし | Gitがstale infoで拒否、head不変、STOPPED |
| commit後応答抑止 | 3 | 1 / 0 | なし | 未ACK 1を保持、STOPPED |
| consume前proxy拒否 | 2 | 0 / 0 | なし | 実Gitが接続拒否、STOPPED |
| 終了mirror時proxy拒否 | 3 | 1 / 1 | なし | 最終mirror未完、STOPPED |

全caseでretryを拒否した。失敗後は証拠の読取・bundle保存のみで、consumeとmirrorを再開していない。取得後に5つの別repositoryから14 commit・全mirror blobを独立検算し、接続機能のreadでも全5 refのheadが一致した。応答抑止はhost adapter注入で、実network応答喪失とは区別する。

同一serviceのkernel memory.maxは1 GiB、swap.maxは0、pids.maxは64。peakは77684736 byte（約74 MiB）、OOM kill 0。終了時write計上は2674688 byte、service内実行は約33.029秒だった。専用ext4の物理256 MiB、16 MiB終了予約を使用した。外側の起動・監督・artifact転送を含む科学全pipelineの全資源/期限を保証したという意味ではない。

## 原ZIPと取得記録

artifact `11829937107`の原ZIPは322683 byte、SHA-256は`5113d5f54d320bcdc06ff81341b03dc50fe3f4e24c03d944711ab4dd38f83438`でGitHub metadataと一致した。全376 memberのbytes/hashをCI_FILE_HASHES.json.gzへ保存し、CI_RESULTとCI_TECHNICAL_EVIDENCEを原byteで別保存した。expiryは2027-01-11T16:12:12Zである。token・auth headerのファイル保存はなく、Git config内にもextraheaderがないことを確認した。

初回byte取得は503、その後の2回も503となったが、保存済みartifactの読取だけを再試行して取得できた。workflow・技術取引・科学実行を再実行していない。失敗記録を成功へ付け替えず、CI_RECEIPTへ取得経過を保持する。

旧科学gate・registry/session・2232実行入力・2222保護入力・local OUTPUT_BINDINGを変更せず、CI_OUTPUT_BINDINGへ取得出力を別固定する。科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全閉包・未知・救済禁止・正式関係未登録/未実行、main/公開AI未変更を維持する。
