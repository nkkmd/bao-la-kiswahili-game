# 監督区画の検証報告

## 検証する問い

observer自身がOOMで終了しても、総メモリ上限を増やさずwatchdogがworkerを停止できるかを確認する。親cgroupに1 GiB、子区画に768/192/64 MiBを設定し、swapを全区画で0にする。上限合計、実際のmemory.max・memory.swap.max・memory.peak・memory.eventsを保存する。

プロセス移動より前のpage chargeは起動元の親/controlに残るため、各子のpeakを足して全体値にしない。親memory.peakと親memory.maxを全体判断に使い、残った起動chargeも同じ1 GiB内へ含める。親residentが空であることを、親のchargeが0であることへ読み替えない。

## 判定方法

正常caseは既知192 MiB payloadのchecksumと終了を確認する。worker OOMはworkのoom_kill増分、observer OOMはcontrolのoom_kill増分とwatchdogのworker停止を要求する。期限caseは同期的に停止したobserverに対して、watchdogが5秒でwork、15秒でwork/controlをcgroup.killで停止する。worker・observerの完了記録がなく、systemdの終了が非成功であることを確認する。未完を正常完了に読み替えない。

## 現在の結果

第2版run 38401380127は4 case・23検査・保存stepがすべて合格した。PR側12ワークフローもすべてsuccessである。親memory.peakは正常256200704、worker OOM 858345472、observer OOM 418369536、期限caseの停止前最終sample 257609728 byteで、全caseの親上限は1073741824、swapは0だった。

worker OOMではwork、observer OOMではcontrolのoom_killがそれぞれ1増加した。observer OOM後もwatchdogが存続し、workを停止した。deadlineは通常停止4999.346 ms、全体work停止発動15000.138 ms、control停止発動15151.694 msだった。約152 msの遅延を保持し、期限内完了とは判定しない。停止前のRESOURCE.jsonを停止後の最終sampleへ読み替えない。科学用の厳密な全体期限保証は未完である。

取得artifactは111 fileで、ZIP digestと各file hash、保存済みrecord・OOM event・SIGKILL・既知checksum・watchdog readyを独立に検算した。入力7 fileと旧記録2153 fileは不変である。初回の4 case合格後にartifact保存がEACCESで失敗した履歴と、第1版入力を別保存した。CI原結果・ZIP・検算記録はresultsへ追加し、実行入力manifestは結果に合わせて付け替えていない。

## 解釈の限界

本試験は制御機構の最小構成だけを評価する。128 source・独立閉包・復旧Git bundle・Docker daemon・実remote transportの全結合は未検証である。親cgroup自体のOOMでwatchdogまで失われた場合に外側から証拠を回収する契約も未完である。科学実行、主課題登録、正式関係登録、公開AI採用を認める結果ではない。

科学提案のsource数・上限・第一適格root・103355件遮断を保持する。未知をDRAW/0/敗北へ変換せず、追加source・差替え・旧root延長・上限引上げ・retryを行わない。
