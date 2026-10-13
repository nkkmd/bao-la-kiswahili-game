# 分岐包絡Studyの一度限り運用を調べる技術契約

## 対象と範囲

技術IDは`BEFCS-OPS-PREFLIGHT-2026-10-13-v1`である。継続指示に基づき、先行[技術preflight](../branch-envelope-preflight-20261013/REPORT.md)の後に残った全区画lease、読取前consume、稼働中・終了時mirror、合算RSSとcontainer上限を固定fixtureで検査する。

registry fixtureの1〜128は論理IDであり、PRNGへ渡さない。提案科学範囲`50613001..50613128`を技術入口が拒否する。科学sourceを生成するCLI、科学認可、科学triggerは追加しない。旧candidateやguard witnessは延長しない。

## 永続記録と競合

隔離したGit repositoryとbare remoteで、全区画取得・各読取marker・各mirrorを一commitずつ保存する。ref取得時のSHAを条件とするcompare-and-swapで競合更新を拒否し、remote receiptを照合してからcallbackへ進む。全区画は取得時に再利用禁止とし、消費済み番号の読直し、同一Stage、範囲重複、attempt 2、run/binding不一致を拒否する。

読取り前markerがremoteへ保存されなければcallbackへ進まない。marker保存後のcallback失敗でも消費記録を取り消さない。独立verifierは主registryをimportせず、親commit、全履歴、consume順序、各blobと全file hashを検査する。fixtureのcallbackは番号の一致を確認するだけで、Bao局面も乱数列も作らない。

## 監督・保存

Linuxの同じPID namespace・process groupに属する全processのRSSを合算する。`process.pid`と`/proc`側PIDが異なる環境では`NSpgid`とnamespaceを照合する。時間、合算RSS、mirror失敗でgroupを停止し、SIGTERMを無視した場合はSIGKILLへ移る。leader終了後も子を残さない。ポーリング監視は瞬間的な厳密上限を保証しないため、Dockerのcgroup上限を別に確認する。

journalは改変のない完全prefixだけを検算し、末尾断片・temporary snapshotを含む取得byteをmirrorへ保持する。完全prefixの検算と科学的完了は別状態で、coverageの解はnullである。content hashごとに64 KiB片を再利用し、累積object上限256 MiB・registry metadata上限16 MiBへ達したら新しいmirrorを拒否する。これは技術moduleの保守的な追加停止条件で、科学保存契約の代替ではない。

稼働中mirrorは一度に一処理だけとし、未完mirrorを無制限にqueueへ追加しない。最終mirrorはworker groupを停止した後に実行する。技術fixtureではGit remoteを使い、保存commitとbyteを独立再生する。実際のGitHub通信障害、token権限、科学用全128 sourceの保存量や時刻条件は未検証である。

## 実cgroup確認

ローカルにはDockerがないため、GitHub Actionsで固定メモリ負荷を128 MiBと提案上限1 GiBのcontainerへ投入する。swap追加分を許可せず、networkを無効にする。`OOMKilled=true`・exit 137とbind mountへfsyncしたprefixを検査する。OOMは管理停止であり、勝者・DRAW・0へ変換しない。

## 固定入力・出力・解釈

PROTECTED_INPUTSは旧科学区画・先行技術記録・公開資産を固定し、SOURCE_MANIFESTは新しいmodule・test・workflow・契約・CONFIGを固定する。保存済みGit bundleを独立復元し、output hashと全履歴を検算する。Docker receiptはActionsのartifactとして保存し、実行後に別receiptへ確定する。

技術合格は科学登録・認可・全閉包供給ではない。[科学契約案](CONTRACT_DRAFT.md)は未登録案である。科学source入口と独立再生、科学用全保存・container監督の統合、最終freeze、CI receipt、保護入力、別triggerの一致を残す。科学seed消費0、科学leaseなし、正式関係未登録・未実行、main・公開AI未変更を維持する。
