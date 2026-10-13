# 共通workload・物理容量・外部回収の技術契約

科学workerと共通のpipelineに既知抽象fixtureを接続し、source生成・独立再生・第一適格rootの固定・全合法手完全閉包・保存までをhostと同じcgroupで確認する。全caseの論理leaseは1〜128、技術用seedは既知抽象fixtureの1だけで、提案科学seedへ接続しない。科学分類・source数変更・上限変更は副作用前に拒否する。

## 制限する資源と範囲

| 対象 | 事前固定する制限 |
| --- | --- |
| primary cgroup | host・worker・Git・mirror・離脱子を1 GiBへ合算。追加swap 0、pids32、networkなし、root filesystemは読取専用。 |
| 研究write | 新規通常fileだけをformatした256 MiB ext4内へevidence/control/registry/remote Git/tmp/回収bundleを置く。filesystem metadataを含め物理容量で制限する。 |
| 終了保存 | 16 MiBを物理確保して通常writeから取り置く。停止後に解放し、mirror・bundle・検算へ使う。 |
| 全体時計 | filesystem準備からprimary起動・停止・外部回収・独立検算・image圧縮まで1200000 ms。終了180000 msを全体内に予約する。image事前取得とCI集約はcase時計の範囲外。 |
| 領域 | 共通workerの180000 ms。通常処理の時計から終了予約を既に引いているため、領域枠不足なら開始しない。 |
| 短縮deadline fixture | 全体15000 ms、終了予約10000 ms。通常20分の提案上限を変更するものではなく、別に明示した停止専用fixtureである。 |
| 外部監督 | isolated observerのprocess groupと、このcaseのDocker PIDから照合したcgroup v2だけをkernelで停止する。通常期限でprimaryを停止し、全体期限でobserverのGit等も停止する。 |

mountとformatは隔離Actions runnerで、`wx`で新規作成したcase専用fileに限定する。既存disk/deviceを対象にしない。root cgroup、別case、無関係なpathを停止対象にしない。外部watchdog/observerとDocker daemonのメモリはprimary cgroupに含まれず、この工程で科学用の全資源総量が成立したという主張はしない。

## 固定する6 case

通常128 source、host自身のOOM、実ENOSPC、外部deadline、離脱子、終了mirror失敗を確認する。OOM/ENOSPC/離脱子は最初のsource checkpoint後・次のconsume前に注入する。外部回収前にはcontainer停止を確認し、以後のconsume数不変・ACKなしを検算する。停止済みprefixを全証拠へ昇格せず、解釈とsolutionは未知のまま保持する。

通信先は同じ容量制限内のbare Gitであり、認証付き実GitHub通信ではない。終了mirror失敗caseでは外部mirrorも意図的に作らず、ローカルimageとbundleだけを保存する。その他の外部回収はmarkerを増やさず、sourceの続きを生成しない。Git履歴・保存prefix・候補・閉包は前工程の独立validatorで検算する。

## 科学実行前に残る条件

外部watchdog/observer/Docker制御の資源総量と保存先、認証付き実GitHub transport・CAS拒否理由・remote packの量、科学payloadの最終配備・全入力hash/認可/CI/レビュー/専用triggerは未完である。外部全体期限後の診断保存を科学runの期限内完了へ昇格しない。6 caseのActions結果取得までは合格を主張しない。

BEFCS-STUDY1、BEFCS-S1-SUPPLY-2026-10-13-v1、50613001..50613128は未登録・未予約・未消費。128 source・最大8候補・ply48以後の第一適格root、103355件遮断、10k状態/128k辺/180秒、全合法手完全閉包・未知の保持、追加/差替え/旧root・witness延長/上限引上げ/retry禁止、主課題・正式関係未登録/未実行、main・公開AI未変更を保持する。
