# 実Git結合の技術報告

## 問題と変更

先行工程では128 sourceと監督はlocal Git、実Gitは固定文字列だけの別fixtureだった。本工程は旧worker・registry・pipeline・監督を変更せず、新しいhost・transport guard・collectorを追加して結合する。

旧hostの停止後回復mirrorは、通信不明後にも新たなremote書込みを行いうる。新guardは通信・期限失敗後の全書込みを拒否し、既存markerと未ACKをそのまま保持する。observerは読取・bundle保存・検算だけで、consume/mirrorを再開しない。

## 固定caseと判断

| case | 必須の確認 | 完了の扱い |
| --- | --- | --- |
| 正常 | 128 ACK・全source独立一致・1候補/1閉包・最終mirror | 技術完了 |
| host OOM | ACK1後にcontrol OOM・watchからwork停止 | 未完・再開なし |
| 応答抑止 | 最初のconsume成立・ACK0・後続書込み拒否 | 未ACK1を保持 |
| 30秒期限 | work/controlへの期限前kill・prefix回収 | 期限後保存・未完 |
| 最終mirror通信拒否 | 128 source完成後の実proxy拒否 | worker完成でも技術未完 |

ローカルでは新規guard/拒否/prefix検算と、既存joined/pipelineの計15検査が合格した。共通128 sourceのlocal結合結果と実Git/cgroupのCI結果は[結果入口](results/README.md)へ別保存する。実測を取得するまで実Git結合の合格を主張しない。

## 境界

親1 GiB・swap0とwork512/control448/watch64 MiB、write256 MiB・16 MiB予約、全体20分・終了180秒を保持する。短縮期限fixtureは30秒/終了10秒で、科学上限を変更しない。workerはmodule初期化前にworkへ移し、認証environmentを削除する。

外側のcheckout・service起動・制御・artifact転送を含む全資源/単一時計の証明、科学API/初期状態の最終配線、科学途中closure/microstate witness、最終事前固定と別triggerは未完である。期限後の診断保存を期限内完了へ読み替えない。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全閉包・未知・不足時終了・追加/差替え/旧root延長/上限引上げ/retry禁止・正式関係未登録/未実行、主課題とmain/公開AI未変更を保持する。
