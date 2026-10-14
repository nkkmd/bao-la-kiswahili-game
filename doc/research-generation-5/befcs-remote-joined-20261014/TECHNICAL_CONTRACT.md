# 共通128 sourceと実Gitの結合契約

基底はPR #201 / `65747ada06be99a43d62109ab78a0edd0d47ba28`である。旧worker・registry・pipeline・監督・原記録・manifestを変更しない。科学source・科学seed・科学lease・BEFCS-STUDY1の登録は使用しない。

## 固定workloadとcase

既知抽象FIRST-48、fixture seed 1、128技術sourceの生成・独立再生・第一適格root固定・重複除外・全合法手閉包を既存workerで行う。全RAWは既存103355識別内である。技術registryのlogical ID 1..128は科学seedではない。

5 caseを通常完了、host OOM、commit後応答抑止、30秒期限停止、最終mirrorの実proxy接続拒否に固定する。host OOMはACK1・source0保存後の次requestで注入する。応答抑止は最初のconsumeのremote成立後・ACK前に注入する。最終mirror拒否は全128 sourceと閉包の処理後に実proxy接続拒否を起こす。

実Gitのrefは`refs/heads/research/g5-remote-joined-<runId>-a1-<mode>`だけで、既存refを拒否する。専用branch push・attempt1・既定repositoryだけで実行する。技術refは削除・巻戻しせず保持する。科学用registry、main、公開AIを操作しない。

## 同時適用する予算

親1 GiB・swap0、work512 MiB・control448 MiB・watch64 MiBを固定する。workerはmodule/source/PRNG初期化前にworkへ移し、workerのtokenとGit認証environmentを削除する。host・実Git/pack・observer・独立bundle再生はcontrol、watchdogはwatchへ置く。Docker daemonは使わない。

write・tmp・両Git・bundle・回収証拠は専用256 MiB ext4内へ置き、16 MiBを物理予約する。通常caseは全体20分・終了180秒・停止余裕1秒、短縮期限caseは30秒・終了10秒・余裕1秒とする。短縮値を科学契約の上限へ適用しない。

各caseはActionsの別matrix jobで実行し、故障caseの失敗で他caseを取消さない。科学上の全体予算をcase数分へ増やすものではない。科学供給の費用と成功をこの抽象fixtureから保証しない。

## 停止と保存の規則

通信不明・期限超過・最終mirror失敗では新transportのwrite guardを固定停止にし、旧hostの終了回復経路にも追加consume/mirrorを許可しない。成立したmarkerを巻き戻さず、未ACKを保持する。失敗後のobserverは読取・原object保存・検算だけを行い、実行を再開しない。

watchdogはwork/controlのkill descriptorを先に開き、同期証拠保存より先に停止命令を出す。host OOM時もwatch区画からworkを停止する。最終evidence取得はwork空を確認後に限る。期限caseの外側回収は期限後の診断保存と明示し、期限内完了・完全source・科学再開とは数えない。

raw registry・全mirror journalのhash chainを独立bundleから復元する。最新mirror内の完成sourceは旧独立source検算、途中sourceはPR #200の保存prefix検算を使う。checkpointのnullと古いsnapshotを補わず、保存されていない次手/screenを生成しない。通常完了では128 ACK・全source・1候補/1完全閉包・最終mirrorを要求する。最終mirror拒否ではworkerが完成しても技術完了falseとする。

## 未完条件

Actionsのcheckout・service起動・外側制御・artifact転送を親1 GiBと単一20分時計へ統合した証明は未完である。30秒期限caseの外側保存もその証明に使わない。科学API/initial stateの最終配線、科学途中closure・microstate停止witness、最終SPEC/CONTRACT/AUTH/hash/CI/review/別triggerは残る。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全合法手完全閉包・未知・不足時終了・追加/差替え/旧root延長/上限引上げ/retry禁止、正式関係未登録/未実行、主課題の勝敗価値損失、main/公開AI未変更を維持する。
