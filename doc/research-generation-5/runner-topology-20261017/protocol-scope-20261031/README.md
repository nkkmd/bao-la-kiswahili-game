# 既存通信経路の対応と容量の下限

## 結論と調査範囲

2026-10-31、main `c4505ee0761fcd2ed33f5de89f5aa1a2fc98b8b8`を確認した。未統合PRと追跡済み差分はなく、未追跡一時ファイル3件は保持して混入させない。

**最終科学workflowは未固定である。** shell中心の案を固定済み実行経路と呼ばず、既存capsule技術workflowと選択した取得・保存・registryコードだけを静的に照合した。[入力一覧](INPUTS.json)に4ファイルのコミット・Git blob・byte・SHA-256を記録する。完全なcall graphや全protocolの網羅ではない。

既存経路にはrunnerのHTTP以外に、Git smart HTTP、Node fetch、artifact保全がある。専用送信主体をHTTP handlerだけに接続して全経路を覆ったことにはできない。全必要protocolと容量の成立は未認定であり、runner改変・build・登録・実行、新規remote結合試験、科学実行は開始しない。

## 既存技術経路の対応表

pathはINPUTS.jsonの4入力を指す。下記は既存技術経路の観察で、将来の科学経路への採用要求ではない。

| 機能 | 固定入力から確認した箇所 | 必要な分類と未完 |
| --- | --- | --- |
| Actionsの初期準備 | g5-befcs-capsule.ymlのcheckout、setup-node 24.19.0 | 現行は外部Actionを含む。script中心案で置換する場合も取得・依存物・準備費用を消さない。Actionの推移依存とrunner通信は未網羅 |
| 初回code取得 | capsule/run.cjs:23〜25のGit HTTPS remote、protocol.version=2、blob:none fetch、sparse checkout | Git smart HTTP・認証・proxy・TLSを含む別client経路。固定commit取得と全必要blob取得の取引境界が必要 |
| 遅延取得の可能性 | 同じ箇所のremote.origin.promisor=trueとpartialclonefilter=blob:none | checkout等が不足blobを要求し得る。今回のソース読取から実通信回数や発生を断定しない。明示fetch一回を全取得一回と数えない |
| 原image外部保存 | capsule/transport.cjsのclientとpreserve | Node fetchでGit Data REST APIへ送信。redirect:errorと書かれていても下位Node transportの無再送は未監査 |
| registryの一度限り制御 | operations/registry.cjs:12〜17、20〜38 | ls-remote、fetch、force-with-lease push、照合用ls-remoteがある。GitのCASを汎用REST書込みで同値と仮定しない。科学leaseはこの調査で取得しない |
| artifact保全 | g5-befcs-capsule.yml末尾のupload-artifact | 元fixtureでは計測scope外。最終経路では同一予算内の保存主体・receipt・停止終端へ結合する必要がある |
| runnerの認証・受信・終了報告 | 既存の[client部分台帳](../client-map-20261020/README.md)と[listener調査](../shell-route-20261020/README.md) | この4入力の外にある。通常/Broker・OAuth等を除外せず、全client監査を続ける |

capsule/preserveの通常分岐は、コード上でblob2件、tree、commit、refの5 POSTと、ref、commit、blob2件の4 GETを順に呼ぶ。ACK抑止分岐は5 POSTの後に未ACKを返す。この9/5は関数内の明示call数で、実際のHTTP送信回数・下位retry・科学用最大要求数ではない。成功済みの取引を再実行して確かめない。

## 設定を分類する順序

最終経路が未固定なので、proxy・client証明書・callbackを「不要」と確定しない。必要、不使用を強制、未確認の三分類を、次の主体ごとに埋める。

| 主体 | 確認すべき設定・意味 |
| --- | --- |
| runner SDK / OAuth | credential・token更新、proxy、server/client証明書、redirect、cookie、圧縮、body検算完了点 |
| Git取得 / registry | Git設定、credential helper、環境変数、proxy、TLS検証、HTTP protocol・pack・CAS、promisor追加取得、hookや外部helperの起動 |
| Node REST保存 | fetchの実装版・下位接続、headerとtoken所有、redirect拒否、stream上限、JSON/base64検算、body完了・意味検算 |
| artifact保存 | 使用codeとruntime、送信対象・一時複製・ACK、認証・retry、全子停止後の最終書込み |
| 専用IPC / 送信主体 | peer認証、許可の一度限り消費、操作別schema、秘密の保持、通常停止と保存専用許可、取消と故障 |

Git executableの1ファイルhashやNodeの版だけでは全依存を固定できない。Gitのhelper、共有library、証明書、設定、Node transportを含む実入力が必要である。単なる環境proxy設定でIPCの迂回を防げたとは認めない。

## 既存目録から再計算した部品下限

数値は[保存配布目録](../capacity-20261020/RUNNER_PACKAGE_INVENTORY.json.gz)と[過去のWSL単体file観察](../capacity-20261020/README.md)の論理byteである。現在WSLの再採寸、最小依存集合、実割当量、実行成功の証拠ではない。

| 仮定する保持集合 | 論理byteの和 | 判定 |
| --- | ---: | --- |
| runner bin全体265 file | 84243487 | 一部品で、単独の実行可能性は未証明 |
| bin全体 + 同梱Node20 + 同梱Node24 | 309165639 | 保存256 MiBを40730183 byte超過。既存の除外判断を維持 |
| bin全体 + 同梱Node20 + 過去WSLの6実行file | 324594063 | 保存256 MiBを56158607 byte超過。新しい配置案もこの保持集合のままでは成立しない |
| bin全体 + 同梱Node24 + 旧code + 過去Python/Git + 終了予約 | 250844197 | 既存の単一runtime仮定。差17591259 byteを利用可能量としない |

WSLの6実行fileの論理和は141417888 byteで、Nodeを含む。上の第3行はNode20とWSL Nodeの両方を保持する仮定であり、同一実体の役割重複ではない。現在その構成が必須だとは主張しない。最終jobに内部Node20と科学用Node24の両方が必要か、単一runtimeへまとめられるかは未確定である。

旧code11746870 byteは過去の候補集合で最終科学inputではない。最後の行にはroot script、shell、全共有依存、証明書、設定、IPC/送信主体、追加科学input、filesystem metadata、log/tmp、spool、remote object、最終receiptが不足する。未計数の項目は0とせず、根拠のない推定サイズで成立へ近付けない。標準x64 runner全体の通常展開679562451 byteも引き続き除外する。

## 次の具体的な工程

次は実行不可の設計資料として、受理するjob/head/attempt、script step、全必要入力、取得・registry・保存操作を一つの候補経路へ列挙する。これは科学用workflowの登録やtrigger追加ではない。全protocolを専用IPCへ渡せるか、Gitの原子的制御・Actions来歴・最終保存を保てるかを評価し、必要runtimeと最小依存集合を絞る。

経路が決まる前に汎用HTTP仲介器を実装しない。上限内の実現性が確認できなければ成立不足として止め、予算引上げ・runtimeの計数除外・別protocolへの無言の置換で救済しない。[送信境界設計](../TRANSPORT_DECISION_20261030.md)の候補と採用の区別を維持する。

## 研究境界と再現性

第五世代研究は継続中。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを保持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を維持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128の読取・生成、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更せず、WSL更新・再起動・導入・mount・cgroup/network/証明書変更も行わない。

INPUTS.jsonは固定コミットの4原文をgit showで読み、Git blob・byte・SHA-256へ照合する。部品和は保存目録の通常fileと過去観察の値から再計算する。現在checkoutの保存監査には[現在用手順](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使う。旧manifest・workflow・結果を更新せず、静的確認を動作試験へ昇格しない。説明・見出しは日本語、ID/path/field/hash/commandは機械定義例外で、CI・レビュー・統合の実際の状態はPR記録を参照する。
