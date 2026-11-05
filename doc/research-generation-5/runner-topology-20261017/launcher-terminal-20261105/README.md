# 停止専用FDと最終保存順序の候補

## 結論

2026-11-05、最新main `263454bf23f5697ac5060ebdb5a084705fafcbf4`、tree `7adef5d47f8e0ccb17d4d559246c169c9959dc78`を照合した。未統合PR・追跡済み差分はなく、無関係な未追跡一時ファイル1件は保持した。[役割分離設計](../authority-stop-20261105/README.md)に続き、監督へ渡す権限を停止専用FDへ絞る候補と、有限な保存対象を区別する順序を具体化した。

**実装・配備に進める経路はまだ成立していない。** FDを使う起動担当の初回ロード、namespaceと権限の適合、最後の制御記録の外部保全が残る。6つの既存gateを合格へ更新せず、科学実行は認可しない。[機械可読台帳](DESIGN.json)にも未固定値をnull、全gateをOPENとして保存する。

## 停止権限を狭める候補

起動担当Lが固定runのCとS/B/R/W領域を準備し、SへR/W/Bのcgroup.killの書込用FDとcgroup.events等の読取用FDだけを渡す候補を優先する。Lはtaskの任意path・unit名・UID・実行commandを受け取る常駐管理serviceにしない。資格切替え・配置を済ませた後は、再起動・追加生成の受付を閉じる設計とする。

| 主体・資源 | 限定する内容 | 未成立の条件 |
| --- | --- | --- |
| Lの起動契約 | runに結合した固定role、UID、code hash、entrypoint、領域とFD表 | 実装言語・実行file・必要権限・全依存・費用は未固定 |
| Sの停止FD | 当該runのB/R/Wに結合する停止用FDだけ。値1の停止要求を出す | kernel/namespace条件、誤配布・FD転送・閉鎖・cgroup再利用の拒否が必要 |
| Sの観測FD | 対象ID、events、memory等の読取だけ | 対象領域の生存期間と同一性、停止時刻の原証拠が必要 |
| R/W/B | 停止FD、cgroup directory FD、資格切替え権限を受け取らない | mount可視性、継承FD、manager/daemon到達を含む迂回禁止は未実証 |
| 起動後の追加work | 既に固定資格で待つWへの限定開始許可を候補とする | 実Actionsのjob/step/head/attempt来歴との結合は未設計。代替executorを実jobと呼ばない |

SにCのdirectory FD、memory.max、cgroup.procs、manager socket、汎用root capabilityを渡さない。FD番号自体をidentityとせず、Lが確定した対象・種別・権限・runと照合する。Sは受領FDを他roleへ送らず、R/W/BのIPCはFD受渡しを受理しない。停止要求を出してもpopulated=0になるまでは停止完了としない。

Lの最初のロードをC外で実行し、終了後にコピーだけ計数する案は採用しない。LをOS基盤とみなして費用を消す案も採用しない。Cの制限・t0より前に必要な特権準備を誰が行い、どこまで既存信頼基盤かを固定し、その契約適合が閉じるまでLを実装しない。各roleの待機時間・memoryも全工程内である。

## 固定kernelソースで確認した制限

根拠はLinux v6.18 commit `7d0a66e4bb9081d75c82ec4957c50034cb0ea449`の[kernel/cgroup/cgroup.c](https://github.com/torvalds/linux/blob/7d0a66e4bb9081d75c82ec4957c50034cb0ea449/kernel/cgroup/cgroup.c)である。これは上流の静的読取で、WSL buildとの同一性・FD移譲後の実効性を証明しない。

| 関数 | 確認した分岐 | 候補への帰結 |
| --- | --- | --- |
| cgroup_kill_write | 入力1、対象のlive確認、threaded cgroup拒否を経てkillへ進む | 任意文字列を渡す管理APIにしない。dead/threadedの拒否を保存する |
| cgroup_file_write | nsdelegate・非委任file・記録した非init namespaceのroot対象という条件でEPERMを返し得る | 事前openだけでは成功保証にならない。open時のnamespaceと実行構成を固定する |
| cgroup_file_open | open時のcgroup namespaceをfile contextへ保存する | FDの現在の保有者UIDだけでは、適用される条件を説明できない |
| cgroup_css_set_fork | CLONE_INTO_CGROUPでもcgroupの書込・移動権限を検査する | directory FDを渡すだけで無権限の配置ができると仮定しない |

CLONE_INTO_CGROUPを使う実装は選択していない。必要権限をtaskへ広げる救済をせず、候補Lの権限と初回起動の一つの経路を先に閉じる。参照原文を実行・buildせず、設定変更もしない。

## 保存順序の比較

[全工程台帳](../EXECUTION_LEDGER_20261020.md)は最後の親停止をOS側終了状態へ結合し、[完了判定表](../../befcs-capsule-20261016/COMPLETION_GATES.md)は封印後journal/ACKとartifact保全を同じ予算へ含めることを要求する。[原capsule](../../befcs-capsule-20261016/README.md)の成功済み保存は再実行しない。

| 候補 | 順序 | 判断 |
| --- | --- | --- |
| Bが最終保存し、その後SがB停止を記録 | R/W停止→B保存・ACK→B停止→S tail | B停止後のtailの保全が未解決。これだけで完成にしない |
| 外側uploaderで穴を埋める | 全子停止→別serviceのupload | 新規主体の時計・memory・保存が計数外になるなら除外 |
| Sが子を作らず最終送信 | R/W/B停止→Sが固定対象を保存→ACK→S終了 | 子停止後の新規uploaderを避ける候補。ただしSの通信権限・transport・最終ACK記録の保全・OS終了証拠が未成立 |
| receipt自身を含むimageを再保存 | 保存→ACKを追加→再保存を反復 | 有限な終了点にならず、成功取引の反復・無制限な保存を招くため除外 |

Sを最終送信者とする案では、通常通信の権限をSへ開放しない。必要なのは、通常Bを停止した後に一度だけ使える保存専用権限、固定対象とbody hash、固定要求数、無再送transport、直接送信の依存物である。この権限移行は前段Sの通常通信禁止を変えず、追加の保存機能・秘密・費用としてレビューする。未固定なのでこの案も未採用とする。

## 先に固定すべき有限な終端

外部保存対象Dは、封印image、manifest、封印後のどのsequenceまでの制御journal、R/W/B停止証拠を含むかを送信前に固定する。最終ACK AはDの対象ID・byte数・digest・受理結果へ結合し、Dに後からAを入れ直さない。Aの観測時刻と親終了時刻を同一時刻と扱わない。

ただし、Dの対象固定だけでは全工程成立しない。Aを含む最終制御記録Tの保持・外部保全、Sの自己申告以外の終了証拠E、T/Eを覆う保存終端と全費用が必要である。Tをローカルに残すだけで外部保全済みとはしない。Eを実行後に読めても、元実行に欠けたACKや期限内保存を補わない。T/Eの対象を無言で保存契約から除外しない。

従って現段階では「DへのACKあり」「全子停止済み」「親終了確認あり」を別条件として保持する。どれかが欠ければ未完成で、後日remoteにDを発見しても実行内ACKへ昇格しない。1200秒・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiBを変更せず、この有限な終端の保全が閉じなければ候補を成立不足とする。

## 次の工程と維持する境界

次はLの初回準備を含む計数経路と、D/A/T/Eの保全対象・保持主体・終端を契約へ照合する。S最終送信案に必要な最小transport・依存と全保存peakも同時に評価する。新しいuploaderを足すだけ、保存対象を減らすだけの解消はしない。実行可能なunitやlauncherは作成せず、runner改変・build・登録・実行、新規remote結合試験を開始しない。

第五世代研究は継続中。主要課題、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を保持する。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseである。提案seedの読取・生成、旧区画/root/witness延長、source追加、候補差替え、上限増加、救済的retry、成功済み保存取引の反復をしない。公開ゲーム・AI-GEN4・Worker・凍結実装を変更せず、ユーザーWSLの現在値を仮定しない。

人間向け監査対象は本書と研究案内5文書の追補、計6文書。英語だけの見出し・通常説明文、壊れた相対リンク、意図しない既存code block・canonical情報変更を0件とする。設定名・関数名・ID・path・fieldは機械定義の例外で、日本語で意味を説明する。[現在用保存監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を適用し、CI・自己レビュー・統合結果はPR記録へ残す。
