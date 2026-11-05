# 親監督・通信主体・workの権限と停止境界

## 今回の到達点

2026-11-05、main `f3bd7a1e96fcd5fcc371ed7356bc2d54afc492ff`、tree `0d34f3256ebfbba6f856acdcdd9cd3b43740ddfc`を確認した。未統合PR・追跡済み差分はなく、無関係な未追跡一時ファイル1件は保持した。[Node20のAPI境界](../work-api-20261105/README.md)を受け、専用system側制御と異なるUIDによる役割分離を優先候補とする。**配備方式の採用・実装認可ではない。** 同一UIDのuser unitとDelegate=yesだけの案は、制限解除・manager呼出しを閉じられないため成立案にしない。

今回具体化したのは、役割ごとの権限、通信FDの扱い、子孫停止の確認、予約時間への移行、保存終端の不足である。launcherの必要権限、固定unit構成、IPC方式、最終保存主体と費用は未確定で、runner改変・build・登録・実行、新規remote結合試験へ進まない。

## 根拠とユーザー環境との区別

[既存親設計](../PARENT_EXECUTION_DESIGN.md)、[WSL候補](../WSL_PARENT_PLAN_20261020.md)、[通信境界](../TRANSPORT_DECISION_20261030.md)、[全工程監査](../../lifecycle-review-20261017/README.md)、[完了判定表](../../befcs-capsule-20261016/COMPLETION_GATES.md)と照合した。[SOURCES.json](SOURCES.json)にsystemd v255とLinux v6.18の固定upstream commit・文書pathを保存する。tag署名の検証や、ユーザーのUbuntu/WSL buildとの同一性確認は行っていない。公式文書からの設計推論であり、ユーザーWSLでの動作証拠ではない。

architecture x86_64、systemd running、user service active・Delegate=yes、cpu/memory/pids、memory/swap上限maxという共有値は過去観察として保持する。現在値や、専用system serviceの作成権限・namespace機能の実効性を推測しない。ChatGPT側のhostで代替実証しない。

## 役割ごとに許す範囲

全役割は共通予算領域Cに含める。Cはprocessを直接置かない集約cgroupとし、その子に監督S、通信B、runner R、work Wの領域を分ける設計候補である。子領域は別予算ではなく、合計をCの1 GiB・swap 0で制限する。各役割のUID、子上限・監督用memory予約・pids上限は未固定で、0や十分な余裕と仮定しない。

| 役割 | 必要な権限・入力 | 与えない権限 |
| --- | --- | --- |
| S: 親監督 | 固定した対象領域の観測・停止、許可の一度限り発行、容量予約、停止prefix管理 | 通常取得の汎用通信、任意unit管理、任意shell、上限拡大 |
| B: 通信主体 | 対象・操作・body hash・期限を結合した限定IPC、必要接続と専用credential | 任意URL代理、未許可の再送、cgroup書込、work実行、任意helper起動 |
| R: runner | 固定job/head/attempt照合、runner用領域、許可済みIPC | 直接egress、Bの秘密、cgroup/manager操作、任意UID切替え |
| W: work | 完備した固定codeと入力、専用書込先、限定IPC | 科学seedの先行読取、直接egress、runner登録秘密、制限解除 |

RからWへのUID切替えを、runnerへのsetuid capability付与で済ませない。起動・資格切替えを担う最小launcherと、誰がその要求を認証するかが必要である。launcherを新設するなら、そのcode/runtime・初回ロード・memory・logも計数する。Sにsystem managerの汎用操作権やroot shellを渡す案も採用しない。対象cgroupだけの停止権限を渡せる具体経路が閉じるまで起動不可とする。

## 迂回を拒否する境界

| 経路 | 必要な拒否・検証 |
| --- | --- |
| 新規socket | R/Wは外向き通信を拒否し、許すIPCだけを限定する。PrivateNetworkやaddress family制限は候補で、設定名だけを成立証拠にしない |
| 継承FD・FD転送 | 起動時FDをrole別に列挙し、許可IPCと入出力以外を閉じる。外向きsocket、manager/daemon FD、credential FDを継承しない。IPCのancillary dataによるFD受渡しも許可しない |
| manager・daemon | user/system bus、user manager、container daemon、外部agent socketとWindows側連携経路への到達を確認する。接続失敗1件を全迂回禁止の証明にしない |
| cgroup・資格 | R/W/Bからcgroup移動・limit書換え・sudo・setuid実行・追加capability・他UID操作を拒否する。別UIDだけで全拒否が成立したとしない |
| filesystem | roleごとの固定読取・専用書込、tmp/cache/log/crash出力・FD経由の書込を台帳へ含める。広いhomeやhost socketのbindを持ち込まない |
| IPC認証 | peer UIDだけでなくrun/job/head/attempt、role、操作ID、phase、byte/hashとsequenceを結合する。子がS/Bを名乗れない経路が必要 |

systemd v255のsystemd.exec文書では、RestrictAddressFamiliesはsocket作成の制限であり、渡されたsocketには適用されない。PrivateNetworkもfilesystem上のAF_UNIX socketを一律に消すものではない。したがってnamespace、mount可視性、継承FD、権限を合わせて設計する。IPCが使えるとは未確認であり、ChatGPT側のAF_UNIX制限をWSLの値として転記しない。

## 停止とOOMの順序

1. 初回準備前に共通開始点t0とCの制限を成立させる。監督の初回ロード・設定準備を後付けで範囲外へ出さない。unit生成や起動前処理の担当・費用も未解決欄へ残す。
2. 最初の通信失敗・検算失敗・監督異常で通常許可を不変に閉じる。経過1020秒に達した場合も新規workと通常取得を閉じ、実行中取引の取消・送信有無不明を記録する。IPC再接続や新しい操作IDで失敗取引を再発行しない。
3. R/Wのprocess treeを、対象cgroupの同一性と継承範囲を確認して停止する。Node同期callやSIGTERM処理に依存せず、固定された強制停止経路を使う。cgroup.killへの書込成功だけを停止完了とせず、cgroup.eventsのpopulated=0と対象範囲を確認する。
4. Bは通常許可を閉じたまま、事前固定済みの保存専用許可だけを扱う。失敗した保存の救済的retryはしない。Bの停止確認と制御記録も同じ予算に含める。
5. 全体期限1200秒までに保存・全子停止を確認できなければ未完成とする。強制終了要求時刻と終了確認時刻を分け、SIGKILLを送ればその瞬間に全taskが消えるとは仮定しない。期限後回収を期限内完成へ昇格しない。

Linux v6.18のcgroup文書で、cgroup.killは対象と子孫をSIGKILLし、populatedは生存processの有無を示す。対象cgroupの置換・空になった後の再起動・外部daemonへの脱出を禁止しなければ、この観測だけで全scopeを閉じられない。

C全体を無条件のgroup OOM対象にするとSまで失われ、同じ実行内の保存を保証できない。R/Wの子上限とS/B用のメモリを先に分ける必要があるが、予約値・kernel charge・全peakは未測定である。下位OOM後もS/Bが必ず生存するとは認定しない。祖先OOM・host障害・停止不能では、存在するprefixと不明状態を保持し、完成・外部ACKを作らない。

systemdのKillMode=control-groupやRuntimeMaxSecだけでこの順序が実現したとはしない。v255ではRuntimeMaxSecはactive状態の時間に関係し、停止処理の時間が別にある。Type=oneshotには適用されず、notify系では延長経路もある。起動前準備、停止待ち、ExecStopPost、外部保存を同じt0/1200秒へ結合する設計が必要で、既定の停止猶予を上限へ加算しない。

## 最終保存に残る終端問題

原imageを封印し、digestで制御記録と結合する。R/W停止済みの記録をBが保存する案でも、そのreceiptより後のB停止・S終了はreceiptの内容にならない。逆にB停止後の記録を別uploaderが保存すれば、新しい子と費用を追加することになる。Sの終了記録をS自身が終了後に作る順序も成立しない。

必要なのは、外部ACKが覆う有限の対象一覧、ローカル最終tail、OSが記録する停止時刻・全process不在、独立検算が読む終端の役割を事前に分け、全ての費用・保全先を既存契約へ結び付けることである。**この終端は未確定であり、本書で解決済みにしない。** OS managerやjournalを新たな無料の保存主体と扱わず、ExecStopPost・別service・事後取得によって欠けた実行内ACKを補完しない。

## 変更が必要になり得る項目と次の一手

専用非管理UID、system側の対象限定起動・停止、role別cgroup、network/mount可視性、継承FD整理、限定IPC、書込領域、credential注入と破棄が変更候補である。追加するpackage、unit内容、管理者操作、後片付けはまだ確定していない。現在はWSL更新・再起動・設定変更・導入・mount・cgroup/network/証明書変更を行わず、ユーザーへ実行コマンドも案内しない。

次は[残条件台帳](OPEN_GATES.json)のうち、最小launcherの権限と最後の保存・停止の有限な終端を先に詰める。これを満たす入力・依存と全保存peakが現行256 MiB内に収まらなければ成立不足として止める。Node24除外や部品和を確定値へ昇格しない。全経路・下位無再送・権限・容量・最終receiptが未成立の間は配備・結合試験を始めない。

## 研究境界と文書品質

第五世代研究は継続中で、主要課題は探索順位変動と厳密勝敗価値損失の関係である。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを保持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を維持する。

提案seedの読取・生成、旧区画再実行・旧root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Worker・科学実装・凍結記録を変更しない。

本READMEと研究案内5文書の追補、計6文書を日本語品質の監査対象とする。英語だけの見出し・通常説明文、リンク切れ、意図しない既存code block・canonical情報変更は0件を要求する。JSON/path/ID/field/設定名と原資料の識別子は例外で、日本語の説明を添える。[現在用保存監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を適用し、CI・自己レビュー・統合結果はPR記録へ残す。
