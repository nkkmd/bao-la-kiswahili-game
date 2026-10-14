# 取得後検算の結果と限界

## 結論

第1版run `38473413073`（head `430c902b822d0a86aa3a3cfb3452dc837c3c3f4b`）と第2版run `38474301794`（head `67984fa90b305cb8092f80d8b74392b94a659fcb`）を別々に保持する。ZIPのbytes/digest・全member hash、生Gitの全線形履歴・mirror blob、ACK成立commitの祖先関係、最後のmirrorとローカルの保存source/prefixを独立検算する。欠けたscreenや次手を補わない。

第1版は5 case中4 caseがfixtureとして合格し、期限caseは回収tmpのEACCESで失敗した。第2版は5 case中3 caseが合格し、2 caseは意図した試験の完了前にGit pushが失敗した。修正版の通常完了と最終mirror拒否の成立は未確認である。

## 保存範囲

remote完全/途中は最後のremote mirrorから検算できたsource数であり、markerやACKと区別する。

| 版 | case | CI | marker / ACK | remote完全 / 途中 | ローカル完全 / 途中 | 判断 |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | 通常 | success | 128 / 128 | 128 / 0 | 128 / 0 | 1抽象閉包・最終mirror・技術完了 |
| 1 | host OOM | success | 1 / 1 | 0 / 0 | 1 / 0 | 停止fixture合格・処理未完 |
| 1 | 応答抑止 | success | 1 / 0 | 0 / 0 | 0 / 0 | 未ACK 1・処理未完 |
| 1 | 期限 | failure | 4 / 4 | 3 / 1 | 3 / 1 | 回収EACCES・fixture不合格 |
| 1 | 最終mirror拒否 | success | 128 / 128 | 127 / 1 | 128 / 0 | 拒否fixture合格・技術未完 |
| 2 | 通常 | failure | 22 / 22 | 21 / 0 | 22 / 0 | 途中Gitエラー・未完 |
| 2 | host OOM | success | 1 / 1 | 0 / 0 | 1 / 0 | 停止fixture合格・処理未完 |
| 2 | 応答抑止 | success | 1 / 0 | 0 / 0 | 0 / 0 | 未ACK 1・処理未完 |
| 2 | 期限 | success | 2 / 1 | 1 / 0 | 1 / 0 | 期限後回収合格・処理未完 |
| 2 | 最終mirror拒否 | failure | 44 / 44 | 41 / 1 | 44 / 0 | 意図した拒否より前のGitエラー |

第2版最終mirror拒否caseのremote途中sourceは保存済み7手だけを検算する。第2版期限caseの未ACK 1はsource読取済みと推定しない。親cgroupの最大peakは660996096 byteで、1 GiB以内だった。外側checkout・起動・artifact転送と取得後検算を含む全資源の保証ではない。

## 新たな未完条件

第2版の2失敗caseではGitから`remote: fatal error in commit_refs`が返った。通常caseは22 ACK・16 mirror、もう一方は44 ACK・21 mirrorでguardが固定停止し、後続書込みと回復mirrorを拒否した。サービス内部原因や一般的発生頻度は確定していない。取引・fixtureを再実行していない。

SCENARIOとraw bundleは保存できたが、その後のcase成功assertionが失敗し、RESULTとCOMPLETEDはなかった。managerのtimerとwatchが残り、全体の期限前停止まで待った。失敗時も元のエラーを保持して終了receiptを保存し、timer/watchを予約予算内で終了する経路が次の課題である。SCENARIO内の`completionWithinDeadline: true`は途中記録時点の値であり、全体完了の認可に使わない。

第1版の失敗を第2版へ置換せず、旧manifest・14実装入力snapshot・原ZIP・失敗metadataを保持する。期限後回収や取得後検算を科学実行の期限内完了へ読み替えない。

科学seed0・leaseなし・Study未登録/未実行、103355遮断・全閉包・未知・不足時終了・救済禁止・正式関係未登録/未実行・主課題・main/公開AI未変更を維持する。
