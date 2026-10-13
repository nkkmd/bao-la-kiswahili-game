# hostを含む全資源包絡の技術契約

対象は固定文字列prefix、技術用1〜4論理IDとGitHubの技術専用refである。Bao状態、source生成、PRNG、科学seedへ接続しない。`TECHNICAL-ENVELOPE-FIXTURE`以外の資源入口と、科学分類・提案科学区画・attempt 2のtransport入口を副作用前に拒否する。

## 固定する範囲

| 資源 | 上限と課金対象 |
| --- | --- |
| 全体時間 | 1200000 ms。通常処理は1020000 msで終了予約へ入り、最後の180000 msは停止・保存・検算へ使う。 |
| 領域時間 | 180000 ms。領域時間と終了予約が両方残らないと開始しない。 |
| メモリ | host、worker、Git、mirror、検算、離脱した子processを同じ1 GiB cgroupへ入れ、memory.currentとkernelの上限で合算する。追加swapは0。 |
| 保存 | 268435456 byteから通常処理の16777216 byte終了予約を引く。全作業領域のevidence、control、Git object、mirror、一時検算と累積remote payloadを保守的に加算する。 |
| 子process | pids32、networkなし。leader終了後に離脱子を停止し、終了mirror前に生存を確認する。 |
| 通信 | 残余時間以下のtimeoutと1 MiB出力予約でGit子processを監督する。実GitHub fixtureは別connector経路であり、このcgroup内通信ではない。 |

disk会計はlogical byteと割当byteの大きい側を数え、hard linkもpathごとに加算する。疎ファイル、symlink、特殊fileによる過少計数を許さない。容量予約とremote累積課金を行うが、汎用的なkernel disk quotaを実装したという主張はしない。fixtureのwriteは固定小容量である。

## 停止と通信不明

whole-block leaseは最初から隔離済み・再試行不可とする。consumeはremote更新と再読取照合が両方成立して初めて許可を返す。更新が成立しても応答をadapterで失わせた場合は許可0、永続markerを保持して停止し、同じsessionを再試行しない。送信前失敗・終了mirror不成立・残余予算不足でも完了扱いにしない。

GitHub fixtureの成功応答喪失は意図的注入であり、実network障害の観測ではない。古いexpected SHAを使うprobeで実UNKNOWNサービスエラーを観測した場合はheadを再読取し、拒否理由が取得できない限りCAS拒否の実証へ昇格しない。停止後の読取確認はmarkerを消さず、ACKへ転用しない。

## 科学用配備の未完条件

科学workerとの全workload結合、認証を含むcgroup内実remote transport、remote Git object・packの総量、kernel disk quotaまたは同等の全write予約、OOMでhost自身が終了した場合の外部保存、container起動から外部終了検算までの単一hard deadlineは未完である。この技術契約だけで科学hostを解放しない。最後にSPEC・契約・認可範囲・全入力hash・CI・実行前レビュー・専用triggerを固定する。

BEFCS-STUDY1とBEFCS-S1-SUPPLY-2026-10-13-v1、50613001..50613128は未登録・未予約・未消費。128 source、最大8候補、ply48以後の第一適格root、103355件遮断、10k状態/128k辺、全合法手完全閉包、未知の保持、追加/差替え/旧root・witness延長/上限引上げ/retry禁止、主課題・正式関係未登録/未実行、main・公開AI未変更を保持する。
