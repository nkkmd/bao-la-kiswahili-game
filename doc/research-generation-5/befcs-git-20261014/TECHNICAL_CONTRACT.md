# 認証付きGit通信の技術契約

基底はPR #200 / `1f0f75c4a80b12d4c016c71f14bc4b4151e89fa4`である。旧registry、session、科学入口、原記録とmanifestを変更しない。科学seed・Bao RAW・source生成・科学Studyの登録を行わない。

## 対象と専用namespace

固定文字列prefixだけを用いる。技術leaseはlogical ID 1..4で、科学seedではない。5 caseを正常完了、古いexpected SHA、commit成功後の応答喪失注入、consume前のproxy接続拒否、終了mirror時のproxy接続拒否に固定する。

実通信の対象は既定repositoryのみで、refは`refs/heads/research/g5-git-fixture-<runId>-a1-<mode>`に限定する。実験branch `research/g5-befcs-git-preflight`のpush・attempt 1のみで実行する。既存refは拒否し、技術refは削除・巻戻しせず証拠として保持する。科学用ref、main、既存研究branchを操作しない。

認証にはActionsの短命tokenを使い、environmentだけを経由する。checkoutでcredentialを永続化せず、Git configの一時environmentにだけheaderを設定する。traceを無効化し、保存エラー内のtokenとencoded headerを伏せる。token・auth headerをmanifestやartifactへ保存しない。

## 事前の判断規則

正常caseはlease→prefix mirror→consume→remote再照合→ACK→最終mirrorとする。競合caseはGit自身の`[rejected] (stale info)`とremote head不変を確認し、sessionを停止する。古いexpected SHAのpushは隔離技術refに対してのみ行い、拒否を確認できなければ合格としない。

応答喪失caseは実Git commitの後、adapterのcallbackで応答を抑止する。marker1・ACK0を保持し、同sessionのretryを拒否する。これは実network応答喪失ではなく、commit成立後のhost応答抑止である。

proxy caseは`http.proxy=http://127.0.0.1:1`のGit clientで実接続拒否を起こす。consume前ではmarker0・ACK0、終了mirrorではmarker1・ACK1・最終mirrorなしを保持する。失敗後は正常通信の読取・原object保存だけを行い、consume/mirrorを再開しない。

各caseのremoteから取得した生commit・tree・blobをGit bundleへ保存し、別repositoryへ復元して旧独立検算器で履歴と全mirror bytesを照合する。1 commitあたり1取引、lease/consume/mirrorの順序、未ACK marker、snapshot・prefixのhashを確認する。GitHub API snapshotの一致だけを生object復元の代わりにしない。

## 資源と限界

実Gitのhost・認証通信・pack・独立再検算を、1 GiB・swap0・pids64の同じsystemd cgroupで実行する。研究write・tmp・registry・pack・bundleは専用256 MiB ext4内へ置き、16 MiBを物理予約する。service内の通常終了を全体20分から終了180秒を引いた境界で止め、systemdの20分上限も置く。

Actionsのcheckout・service起動・外側制御・artifact転送は、このserviceの資源・期限へ統合していない。共通128 sourceと監督区画を含む科学全pipelineの合格ではない。実Git接続費用が128 sourceの全予算で成立するかは未測定で、科学hostのreleaseを許可しない。

local caseのproxy故障は固定例外の注入であり、実network試験とは別分類にする。実認証・kernel上限・実proxy拒否はActions結果の取得後にだけ確定する。失敗・timeout・artifact不足では未完とし、科学契約や上限を変更して救済しない。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全合法手完全閉包・未知・不足時終了・追加/差替え/旧root延長/予算増加/retry禁止、正式関係未登録/未実行、主課題の勝敗価値損失、main/公開AI未変更を保持する。
