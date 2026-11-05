# 有限bufferによるraw読戻し部品

[ローカル検査報告](../../../doc/research-generation-5/raw-readback-local-20261105/README.md)を参照する。ユーザーが認可した範囲は、この部品の実装と、科学処理・外部通信を使わないローカル検査までである。

## 機能と入力

`client.cjs`の`createRawReader`へ、`request`、有限の単調時計期限`deadline`、必要なら時計`now`と要求期限`requestMs`を渡す。通信実装・認証情報・既定のfetchは持たず、GET操作を注入先へ一回渡すだけである。POST、ref作成、lease、consume、科学moduleのimportは行わない。

`verifyBlob`は固定manifest由来の`bytes`、`sha256`、`gitBlob`を開始時にコピーし、raw byte streamのSHA-256とGit blob hashを検算する。入力の後続変更、部分応答、redirect、圧縮応答、長さ不一致を拒否する。`request`へはraw/identity、redirect拒否とAbortSignalを渡すが、下位adapterがそれらを守ることは別の検証が必要である。

| 項目 | 制限・動作 |
| --- | --- |
| 1 blob | 最大48 MiB |
| 1 instance | 最大6要求、期待データ累積256 MiB。成功した同じblobも再要求しない |
| 読取buffer | BYOB byte streamの1 MiB backing bufferを再利用。全bodyを連結・返却しない |
| 余剰検出 | 期待量の後に最大1 byteをprobe。全6要求で最大6 byte分も予約する |
| 時間 | 共通期限と最大10秒の要求期限。応答待ちとbody待ちの双方を対象にする |
| 失敗 | instanceを停止し、後続要求・再試行・予算返却をしない。遅着応答もcancelする |
| 同時要求 | 2本目を通信前に拒否。進行中の1本を成功へ偽装しない |
| 結果 | `blobReadbackVerified`とsize/hashだけ。D全体のACK・T/U_api成立を認定しない |

`reservedDataBytes`は試行した期待量、`reservedBodyBytes`は余剰probe予約を含み、失敗しても減らない。`receivedBodyBytes`はclientが観測・処理したbyteで、transportのqueue、拒否後の下位受信、HTTP header/TLSの総wire量ではない。snapshotのbuffer量もOS全体のpeak RSSではない。

## ローカル検査

```bash
node --test tools/research/g5-raw-readback/client.test.cjs
```

テストはメモリ内BYOB streamだけを注入する。server、socket、実GitHub endpoint、科学sourceは使用しない。このテストは既存CIの`test/g5-*.cjs`列挙に追加せず、今回許可されたローカルだけで実行した。workflowは変更しない。

## 未成立の範囲

実HTTP adapterのraw転送・redirect/内側retry拒否・認証・quota、Node24.19.0への適合、P/M/R/Cの同時memory、OS強制停止、D全体の保存/ACK、最終T/U_apiは未検証である。event loopを同期処理が占有する場合や、下位処理がAbortSignalを無視して動き続ける場合の強制停止はOS監督の担当で、この部品では保証しない。instanceを作り直せば局所状態は新しくなるため、科学的なdurable一度限り性の代用にもならない。

今回の結果を実行契約全体の採用や科学実行の認可へ昇格させない。旧capsule client・旧科学gate・旧証拠・実行workflowは保持する。
