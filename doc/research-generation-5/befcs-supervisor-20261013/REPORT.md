# 監督区画の検証報告

## 検証する問い

observer自身がOOMで終了しても、総メモリ上限を増やさずwatchdogがworkerを停止できるかを確認する。親cgroupに1 GiB、子区画に768/192/64 MiBを設定し、swapを全区画で0にする。上限合計、実際のmemory.max・memory.swap.max・memory.peak・memory.eventsを保存する。

## 判定方法

正常caseは既知192 MiB payloadのchecksumと終了を確認する。worker OOMはworkのoom_kill増分、observer OOMはcontrolのoom_kill増分とwatchdogのworker停止を要求する。期限caseは同期的に停止したobserverに対して、watchdogが5秒でwork、15秒でwork/controlをcgroup.killで停止する。worker・observerの完了記録がなく、systemdの終了が非成功であることを確認する。未完を正常完了に読み替えない。

## 現在の結果

CI実測は未確定である。実行入力はSOURCE_MANIFEST.json、旧記録はPROTECTED_INPUTS.jsonへ別固定する。CI原結果と実行head・run・artifact・digestは取得後にresultsへ追加する。結果を見て旧入力manifestを付け替えない。

## 解釈の限界

本試験は制御機構の最小構成だけを評価する。128 source・独立閉包・復旧Git bundle・Docker daemon・実remote transportの全結合は未検証である。親cgroup自体のOOMでwatchdogまで失われた場合に外側から証拠を回収する契約も未完である。科学実行、主課題登録、正式関係登録、公開AI採用を認める結果ではない。

科学提案のsource数・上限・第一適格root・103355件遮断を保持する。未知をDRAW/0/敗北へ変換せず、追加source・差替え・旧root延長・上限引上げ・retryを行わない。
