# WSLの読取専用確認と親監督の実装前設計

> 最新の続きは[容量検算と方式の停止点](capacity-20261020/README.md)を参照する。WSLの共有値を受領し、標準x64配布物全体の通常展開案は容量不足と確認した。以下の未測定表示と次工程は台帳作成時点の履歴として保持する。次は軽量経路の契約適合レビューであり、科学実行を認可しない。

> 続きは[入力・容量・権限・通信の台帳](EXECUTION_LEDGER_20261020.md)を参照する。次は選択実行fileの読取専用採寸であり、全工程成立と科学実行は未認可のままである。

## 結論と証拠の位置付け

2026-10-20（日本時間）、ユーザーが自身のWSLで実行して会話へ貼り付けた出力を確認した。WSLは親監督の検証候補である。専用環境の準備成立、制限の実効性、全工程成立は未確認であり、`wholeLifecycleOsProven: false`と科学実行未認可を維持する。この文書は実行契約や配備スクリプトではない。

照合したmainは`d01685a0156e1b56238d24d680d089248720d74b`。PR #210の統合`3ae1592fc071893bbf4447a41d93a96ca6f11560`以降は、PR #211によるルートREADME整理とAGENTS.mdの方針追記だけである。PR #210時点のtree `69c8f0689bb07909c29ff1c84f054683e7d6df22`を現在treeと取り違えない。

以下は貼付出力からの転記であり、観察器が署名した原資料、直接操作、独立検証の結果ではない。貼付出力の欠落部分を補完せず、この文書のhashを観測時点の原出力hashとは呼ばない。ChatGPT側のhost観察とも区別する。

## ユーザーが共有した観察結果

| 項目 | 共有出力から確認した値 |
| --- | --- |
| WSLとディストリビューション | WSL 3.0.3.0、Ubuntu、Running、VERSION 2 |
| Windows | 10.0.26200.9457 |
| WSLの版表示にあるkernel | 6.18.54.1-1 |
| Linuxのkernel | 6.18.54.1-microsoft-standard-WSL2 |
| Linux | Ubuntu 24.04.1 LTS、VERSION_ID 24.04、noble |
| PID 1とsystemd | systemd、255.4-1ubuntu8.17、状態running |
| ユーザー | uid/gid 1000、sudoグループ所属。sudoの実行権限自体は未検証 |
| cgroup mount | cgroup2、rw,nosuid,nodev,noexec,relatime,nsdelegate |
| ルートcontroller一覧 | cpuset cpu io memory hugetlb pids rdma |
| ルートsubtree_control | cpu memory pids |
| シェルの所属 | 0::/non-systemd |
| user@1000.service | active、Delegate=yes、/user.slice/user-1000.slice/user@1000.service |
| user manager | 同じControlGroupを返した |
| 委任先controllersとsubtree_control | ともにcpu memory pids |
| 委任先memory.maxとmemory.swap.max | ともにmax |
| 委任先のtest -w | 終了値0。実際の書込試験はしていない |
| ルートで存在したファイル | cgroup.kill、memory.max、memory.swap.max、memory.peak、memory.events |
| メモリ | 合計3.8 GiB、available 2.5 GiB（表示上の丸め値） |
| swap | /dev/sdc、1 GiB、有効。表示使用量200 KiB |
| /と/tmp | /dev/sdd、ext4、空き943 GiB（表示上の丸め値） |
| /dev/shm | tmpfs、1.9 GiB |
| 基本ツール | Python 3.12.3、Node v24.6.0、Git 2.43.0、systemd-run、timeout |

最初の`wsl --version`と`wsl -l -v`はLinux内のWsman Shell 0.2.1を呼んでいた。その版をWSLの版と解釈しない。後続の`wsl.exe`出力により上表を確認した。観察のためにWSL更新、再起動、設定変更、導入、cgroup書込、runner登録を案内していない。

## 起動方式の候補と権限の境界

候補は、初回準備より前に親の制限を設定し、その中の監督プロセスがrunnerを起動する方式である。親監督自身とrunner、取得、work、圧縮、転送、保存処理を同じ予算へ入れる。ユーザー用systemdが利用できることは確認したが、ユーザーunitを採用済みとはしない。

現在のユーザーは委任先を書込み可能である。同じ権限のタスクが別unitを作る、cgroupを移動する、上限を書き換える経路を残したまま強制制限と認定しない。実装前に、専用の非管理ユーザーとsystem側の一時unitを使う案、または同等の隔離案を比較する。cgroupの書込権、user managerのsocket、system managerの操作権、sudo、外部daemonを経由した脱出を閉じる方法を固定する。単なる委任やNoNewPrivilegesの指定だけを証明にしない。必要な管理権限と具体的変更はまだ未確定で、追加アカウントやunitは作成していない。

OSの強制停止主体とその資源・書込、親の初回ロード、unit生成、事前配置inputも範囲台帳へ記載する。OS管理機構を信頼基盤とする境界が既存契約に収まるかをレビューし、外側に新しい監督プログラムを置いて無言で予算外にしない。タスクから制限解除できず、OOMや監督故障でも全子を止められる経路が決まるまでは起動しない。

## 固定する資源と工程

| 制約 | 実装前に決める内容と必要証拠 |
| --- | --- |
| メモリ1 GiB・swap無効 | 親のmemory.max=1073741824、memory.swap.max=0と全子の継承を確認。WSL全体のswapは変更しない。memory.peak、memory.events、停止理由を保存する |
| 全体20分 | runner起動前、初回準備より前に共通開始点を置く。job待機・取得・圧縮・転送・保存・全子停止を1200秒に含める |
| 終了予約180秒 | 開始後1020秒で新規workを止め、残りで停止証拠と保存を処理。期限後回収は期限内完成にしない |
| 保存256 MiB | 全input、runner、cache、workspace、log、tmp、image、圧縮一時物、制御記録、remote保存byteを列挙。保守的合算のpeakと最終量を区別する |
| 終了容量予約16 MiB | 268435456 byteの合算上限内で16777216 byteを通常workから保護。予約解放・停止保存まで含む |

空き943 GiBやtmpfsのサイズは256 MiBの強制証拠ではない。ローカル有限imageだけでもremoteとの合算上限は強制できない。remoteへ保存する前に対象byteを予約し、送信前後のローカル複製・圧縮出力・remote残存分を含める台帳が必要である。全書込先を限定する方法、予約域の保護方法、外部logやcrash dumpの扱いは未実装である。

runner配布物の版・hash・展開後物理量、共有ライブラリ、Node/Python、事前配置inputの費用は未採寸である。収まると推測せず、次は科学seedを読まない入力目録と容量見積りを作る。新たな取得が必要なら、対象・取得方法・保存予算を先に設計する。収まらない場合は成立不足とし、巨大なrunnerを事前配置という理由で除外したり、上限を引き上げたりしない。

## 通信・job・最終保存の設計条件

固定runnerソースには内部retry経路がある。親scopeに入れるだけではretryを禁止できず、backoffの無効化もretry回数0の証明ではない。対象経路を列挙し、初回取得の失敗後に次の要求を出せない実装と観測を固定する。通信失敗後に別経路で取得し直す救済も認めない。版の表示を配布バイナリhashの証明にしない。

対象repository・workflow・head・job・attempt 1を受理前に照合し、想定外job、attempt 2以降、再接続・自動再起動による重複実行を拒否する。単一job後終了の設定だけを一度限りの科学消費の証明にしない。登録・認証・job受信の経路は未確定で、登録は行わない。

原imageを封印後、digestで結合する制御記録と保存先の対象識別・byte数・digest・受理結果を定義する。最終receiptには固定した保存対象一覧と終端を対応させる。receipt自身をそれ以前の封印imageへ戻す循環条件は作らない。receiptのローカル保持・外部保全の役割と費用、runnerが最後に書くlogをどこで閉じるかも固定する。全子停止確認後の最終記録を誰が作成し、どの時計・予算で保存するかは未解決である。確認できないものは未ACK・未完成として保持する。

## 次の工程と停止条件

1. 全input・書込先・通信先・権限の台帳と容量見積りを作り、既存範囲との適合を確認する。
2. 権限分離、開始点、強制停止、有限保存、retry拒否、単一job、最終receiptを実装可能な一つの経路に固定する。未解決欄が残れば新規remote結合試験を起動しない。
3. その後に、科学モジュールを読まない既知データ用の結合試験契約・実装・回収手順を作る。正常、初回取得失敗、終了予約、OOM、容量超過、ACK欠落、停止失敗について、全工程の原証拠と独立検算を要求する。部分合格の寄せ集めを全工程成立へ昇格しない。
4. ユーザーのWSLで必要となる変更とコマンドは、対象・影響・後片付けを具体化してから案内する。現時点で追加の操作は不要である。

全工程成立後にも科学reference API、固定初期状態、独立source再生、全合法手完全閉包、途中closure/microstate停止証拠の接続と、最終SPEC・CONTRACT・AUTHORIZATION・全入力hash・保護集合・CI receipt・実行前レビュー・科学専用triggerの固定が残る。

## 維持する研究境界と再現性

第五世代研究は継続中、主要準備はPRIMARY-READINESS-NOT-METで仮説否定ではない。BEFCS-STUDY1と正式関係は未登録・未実行。科学seed消費0・科学leaseなし・科学実行未認可を維持する。提案seed 50613001..50613128を読取・生成しない。103355件遮断、全合法手完全閉包、未知、固定有限開発コーパスとしての解釈を保持する。旧区画・root/witnessの再実行や延長、source追加、候補差替え、上限増加、救済的retry、成功済み外部保存取引の反復を行わない。主課題をDTF・近似探索・実戦勝率へ差し替えない。公開ゲーム・AI-GEN4・Workerを変更しない。

観察値の再確認は環境変化の確認であり、同じ値の再現や成立判定を保証しない。過去の保存証拠の再検算には[方式調査](README.md)、[計測範囲監査](../lifecycle-review-20261017/README.md)、[現在checkout用監査](../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を用いる。本書は保存済み原manifestやVERIFICATION.jsonのhashを付け直さない。

## 現在用監査器の互換修正

再開時の完全監査は、PR #211で正当に更新済みのAGENTS.mdを旧blobとの不一致として拒否した。現在用監査器だけを修正し、PR #211の祖先性・固定blob・現在byte一致を要求する。その他の旧保存ファイル・原snapshot・workflow固定・科学未実行境界の検査は保持する。凍結済み原監査器・manifest・bindingは変更しない。これはWSLの制限成立や科学実行の認可とは無関係である。

## 今回の検証と日本語品質

現在用監査器の8テスト、runner保存照合の3テスト、計測範囲の3テスト、原capsule改変拒否の3テストが合格した。runner・計測範囲・capsuleの保存検算も合格。現在checkoutの完全監査では原ZIP5件・3,361 file・43,364,710 byte、24 PR head、旧snapshot23件を確認した。原保存入力のAGENTS.md以外のblob照合を保持した。

人間向け変更9文書の新規部分は日本語で、変更文書の相対リンク切れ0件、英語だけの説明見出し・通常説明文0件、既存code block・canonical情報の意図しない変更0件である。ID・path・field・hash・コマンド・転記した出力値は機械定義または原出力の例外で、日本語の説明を添えた。git diff --checkも合格した。これは保存資料と文書の確認であり、WSLの実OS試験ではない。CI・レビュー・main統合の実際の状態はPR記録で確認する。
