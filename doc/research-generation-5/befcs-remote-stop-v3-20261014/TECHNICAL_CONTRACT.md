# 第3版の技術契約

## 目的と固定条件

第2版の途中Git失敗後に成功assertionが失敗し、managerのtimer/watchが全体期限まで残った経路を修正する。期限停止後に未完成workerの最終mirrorを保存できた問題も遮断する。先行10件の原証拠・成功・失敗・不完全な停止条件を保持する。

共通128技術source、全体20分、終了180秒、親1 GiB、work/control/watchの512/448/64 MiB、256 MiBの物理領域と16 MiBの終了容量予約を変更しない。期限故障だけは従来と同じ30秒/予約10秒で検証する。5 caseは通常・host OOM・応答抑止・期限・最終mirror拒否である。技術版・専用ref・専用branchを新設し、旧refの取引を再実行・巻戻し・削除しない。通信失敗をretryしない。

## 停止と保存の順序

session.stopをtransport guardの停止へ結合する。最終mirrorはworkerの完成記録がある場合だけ許可し、未完成時は容量解放・Git writeの前に停止する。guardに最初の理由を保持し、以後のacquire/consume/mirrorと旧回復書込みを拒否する。診断のためのreadはwriteを伴わない範囲で保持する。

managerの本処理を終了管理で囲む。成功・失敗とも自分のwork cgroupへのkillを発行し、空の確認後、sampling timerを解除し、自分のwatchへ終了通知を送る。その後に終了receiptを保存する。停止確認に失敗した場合はwatchを解除しない。最初のエラーをcleanup・保存エラーで上書きしない。旧コード・worker・session・registry・watchdogのbyteは変更しない。

終了receiptの`technicalComplete: false`は保存した終了管理だけで技術完了を認定しないことを意味する。case全体の判定はRESULT・完成記録・原Git・独立検算で別途行う。期限後回収は期限内完了へ読み替えず、旧SCENARIO内の途中時点の完了表示も認可に使わない。

## 成功条件と未完条件

ローカル検査では未完成最終write・session停止後write・通信拒否後writeを拒否し、実timerを持つ子が判定失敗後に終了することを確認する。実Git/cgroupの5 caseについて、新しい固定入力hash、原log、原ZIP、全member hash、raw Git履歴・ACK・完全/途中prefix、停止・終了receiptを取得後に照合する。新しい途中失敗も成功に読み替えない。

外側checkout・起動・artifact保全を含む全資源/単一時計、科学reference API/initial stateの配線、途中closure/microstate停止witness、最終SPEC/CONTRACT/AUTH/hash/CI/review/専用triggerは未完である。科学実行を許可する技術版ではない。

103355件遮断・全合法手完全閉包・未知・不足時終了、追加/差替え/旧root延長/予算増加/retry禁止、正式関係未登録・未実行、主課題の勝敗価値損失を保持する。科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行、main/公開AI未変更を維持する。

機械field、path、command、hash、固定英語decision、原Git/logはcanonicalまたはexact-outputの例外として保持する。通常説明文と見出しは日本語で記述する。
