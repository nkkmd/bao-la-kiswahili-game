# 保存済み技術結果

LOCAL_RESULTとLOCAL_EVIDENCEはlocal bare Gitの共通128 source・write guard結合の正本で、実認証やkernel資源の合格ではない。入力・旧保護入力とlocal出力hashを別照合する。

local正常caseは128 ACK・146 commit・全128 sourceの独立一致・1候補/1閉包・最終mirrorが成立した。応答抑止caseは2 commit・marker1/ACK0で固定停止し、回復mirrorを拒否した。2265入力・2250保護入力のhashとOUTPUT_BINDINGを照合する。

実Git/cgroup結果は5 matrix jobのartifactから取得後に別保存する。通常の128 source完成、host OOM、応答抑止の未ACK、30秒期限prefix、最終mirror通信拒否を区別する。CI receipt・ZIP digest・member hash・raw bundle・resource/stopを確認するまで実結合の合格を主張しない。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全閉包・未知・救済禁止・正式関係未登録/未実行、main/公開AI未変更を維持する。

第1版の期限回収EACCESはV1_DEADLINE_FAILURE、14実装入力はV1_SOURCE_SNAPSHOTへ保持した。原SOURCE_MANIFEST・PROTECTED_INPUTS・local出力は変更せず、修正後入力はSOURCE_MANIFEST_V2へ別固定する。[第2版の変更](../V2_REVISION.md)を参照する。

## 取得証拠の確定

第1版・第2版の計10 artifact・全4431 member・原ZIP計53692694 byteをresults-v1/results-v2へ保存した。第1版期限と第2版の通常・最終mirror拒否caseは失敗のまま保持する。[取得後検算と判断](../../befcs-remote-review-20261014/README.md)に、保存範囲と次の未完条件を示す。修正版全体の技術合格は主張しない。
