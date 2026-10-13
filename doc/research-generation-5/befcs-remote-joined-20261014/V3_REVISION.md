# 第3版 — 停止後の書込み遮断と判定失敗時の終了

状態: 技術修正版。科学用hostは未解放、BEFCS-STUDY1は未登録・未実行である。

## 修正の根拠

第2版head `67984fa90b305cb8092f80d8b74392b94a659fcb`、run `38474301794` / attempt 1では通常完了と最終mirror拒否のcaseが失敗した。実Gitが途中で `fatal error in commit_refs` を返し、それぞれ22 ACKと44 ACKで停止した。全128 sourceの完了・最終mirror故障注入点へは到達していない。GitHub内部で拒否された理由はこの記録だけでは確定しない。通信をretryせず、技術refを巻き戻さず、失敗を予定した故障の合格へ読み替えない。

hostは未知の書込み結果を検出してguardをlockし、workerを停止した。ただしserviceの期待値assertionが失敗すると、resource timerとwatchdogが残り、20分の全体停止までserviceが続いた。通常caseのhostのexit code 0は128件の成功を意味しない。

第1版・第2版の短縮期限caseでは、host自身の時間チェックによるsession停止や未完成workerの終了から、旧pipelineの回復mirrorが実行された。第2版はCI上successだったが、停止後の全追加write遮断が成立したとは主張しない。旧RESULT・入力manifest・CIのsuccess/failureは原byteのまま保存し、今回の解釈は別記録である。

## 修正する処理

1. 新guardの停止と旧session.stopを結合し、host側で停止した場合も後続consume/mirrorを拒否する。最初の通信失敗理由は後続の停止理由で上書きしない。
2. 最終mirrorは保存済みworker結果のworkerCompleteがtrueの場合だけ許可する。未完成・途中停止のworkerを終了回復mirrorへ進めない。
3. serviceの完了判定が失敗しても、自分のwork区画の停止命令を証拠保存より先に発行し、resource timerを解除し、自分のwatchへ終了通知を送る。通知・終了待ちが失敗した場合も自分のwatch子だけを停止し、元の判定失敗を保持する。
4. 短縮期限caseでfinalMirrorSaved falseと、保存済みhostがある場合のguard lockを明示的に要求する。期限後の回収は診断保存であり、期限内完了へ昇格しない。

旧pipeline・worker・session・registry・watchdogの実装は変更していない。改修対象はPR #202の新guard・host・service管理と追加lifecycleである。5 case・128技術source・fixture seed 1、親1 GiB、区画512/448/64 MiB、保存256 MiBと16 MiB reserve、全体20分と終了180秒、短縮30秒/終了10秒は変更しない。

## 原記録と入力

[取得記録](results/CI_ACQUIRED_RECEIPT.json)に第1版・第2版の全10原ZIP、全memberのhash、元のrun/head/job/attemptを保存する。[取得後確認](CI_ACQUIRED_CONFIRMATION.md)で失敗と検算範囲を説明する。第2版の変更可能17入力はresults/V2_SOURCE_SNAPSHOT.json.gzに原byteのbase64として保持する。旧SOURCE_MANIFEST・SOURCE_MANIFEST_V2・PROTECTED_INPUTS・local結果は変更しない。第3版入力はSOURCE_MANIFEST_V3へ別固定し、取得結果はCI_ACQUIRED_BINDINGへ分離する。

新しい技術runは新run IDの別fixture refを使用する。既存refへの再実行・追加write・削除・巻戻しはしない。GitHub通信失敗にretryを加えない。技術修正の検証は科学Studyの再実行ではない。

## 未完条件

この修正とローカル検査だけで科学実行を認可しない。実Git/cgroupの修正版CI、その取得後検算、起動からartifact保全までの全資源・単一時計、科学API/初期状態、途中closure/microstate証拠、最終SPEC/CONTRACT/AUTH/hash/レビュー/専用triggerは未完である。

科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355識別の遮断、全合法手完全閉包、未知の保持、不足時終了、追加/差替え/旧root・witness延長/予算増加/retry禁止、正式関係未登録/未実行、主課題の勝敗価値損失、main・公開AI未変更を保持する。次は[V3の再開位置](V3_RESUME_HERE.md)を読む。
