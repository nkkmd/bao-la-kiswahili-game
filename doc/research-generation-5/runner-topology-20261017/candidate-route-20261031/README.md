# 単一runtime仮説による候補経路台帳

## 今回絞った候補と判定

2026-10-31、main `b55ba31ca13120f83f149958e602c7d08948848e`と[前段の通信・容量照合](../protocol-scope-20261031/README.md)を確認した。未統合PR・追跡済み差分はない。未追跡一時ファイル8件は保持し、今回の変更に含めない。

候補をG5-PARENT-SCRIPT-S20-DRAFT-001として[機械可読台帳](CANDIDATE.json)へまとめた。**実行不可・未採用の設計**であり、workflow・head・run・jobの未固定値はnullのまま保持する。Actionsへのworkflow登録・runner登録・trigger作成は行わない。nullを一致済み・不要・0へ読み替えない。

容量比較の対象を、script中心の実Actions jobとrunner内部Node20をworkにも共用する仮説へ絞る。ただしNode20で既存科学codeと独立検算が同じ意味で動くことは未証明である。Node24を最終入力から除外した扱いにせず、既存のNode24検証結果をNode20へ移送しない。科学codeをimport・実行して互換性を試す工程も今回は行わない。

## 一つの候補経路に置いた順序

| phase | 主体と処理 | 通信・判定条件 |
| --- | --- | --- |
| P0 | 親監督の制限・時計・全入力台帳を確立 | 初回ロード・準備より前。親自身も同じ予算に含め、成立しなければrunnerを起動しない |
| P1 | 登録・認証・session・job metadata受信 | 専用送信主体の許可だけを使う設計。全client・下位transport・認証順序は未完 |
| P2 | repository/workflow/head/run/job/attempt 1を照合 | metadata受信とjobの実行受理を区別する。照合前のAction取得・code実行を拒否できる差込位置が必要 |
| P3 | 固定code・入力を取得して完備性を照合 | Git smart HTTPを専用経路へ仲介。promisor追加取得も含め、不足blobを後続workが直接取得できない境界を設計する |
| P4 | 既知fixtureのworkと独立検算 | runner/workに直接通信を許さず、science gateを閉じる。ここで新規科学seedを読まない |
| P5 | registryの将来接続条件を照合 | この候補では科学lease・consumeを実行しない。CAS・読取前consumeの同値性と操作許可を別途固定する |
| P6 | 停止prefix封印・圧縮・外部保全 | 事前固定した保存専用許可だけで処理。body検算・receipt・未ACKを保持し、失敗保存を再送しない |
| P7 | 全子停止・最終記録と保存終端の確定 | 最後の記録主体とreceiptの範囲は未確定。計数外uploaderを起動せず、未確定なら未完成とする |

P1〜P7の通信を、C# handler差込だけで覆ったことにしない。Git・Node REST・Actions artifactも[送信境界設計](../TRANSPORT_DECISION_20261030.md)の許可台帳へ対応付ける。runnerの通常/Broker・OAuth、job終了報告、取消・cleanupも全client監査の対象である。

P5は将来の科学工程の接続点を残すための設計欄で、既知fixtureから科学処理へ自動的に進むphaseではない。正式認可前は科学leaseと提案seedへの入口を閉じる。技術用registryを試験する場合も、経路確定後の別契約・別fixtureとして設計する。

## script経路の制限案

候補では外部/ローカルuses、再利用workflow、composite、container/service、hashFiles、外部Actionのpost処理を使用しない案とする。これだけでNode20以外のruntimeが不要と証明したことにはならない。受理前のjob payload検査、server側flag、内部準備と終了処理まで静的到達性を確認する。

checkout/setup-node/upload-artifactを外す場合も、対応する初回取得・準備・最終保全の役割をP3/P6/P7へ残す。runnerを使わない独立executorへ移行した扱いにせず、実Actions job・attempt・来歴と同じ条件で照合する。最終workflowは未作成で、上の制限を強制する実装もない。

## runtimeと入力の処置

| 対象 | 今回の候補上の処置 | 未成立条件 |
| --- | --- | --- |
| .NET runner | 固定x64版のbin全体を容量比較の出発点に残す | binだけでの起動・全依存・binary/source対応は未証明 |
| 内部Node20 | workとの単一実体共用を比較する | 既存code・検算の意味保存と必要内部処理を静的に確認する |
| Node24 | 両実体保持の容量超過を保持 | 単一Node20案の互換性が未成立なので、正式な除外を認定しない |
| Python/Git | 過去の単体file値を例示計数へ残す | helper・標準library・共有依存・設定・証明書は未計数 |
| 専用送信主体 | 言語/runtimeをまだ選ばない | Git protocol・CAS・認証・下位無再送・IPCを一経路で満たす依存集合が未確定 |
| code/科学input | 旧code量は過去集合の例示に限る | 最終入力とhash・保護集合を事前固定し、seedを生成して量を測らない |

## 容量の比較と優先する確認

bin84243487、Node20実行file98932688、旧code11746870、過去Python8020928、過去Git4066232、終了予約16777216 byteの和は223787421 byte。256 MiBとの差44648035 byteは算術残額で、利用可能量ではない。Node20共用の仮定が成立しなければ、この部品和で最終経路を評価できない。

root script、shell、全共有依存、証明書、設定、親監督、IPC/送信主体、最終科学input、filesystem metadata、log/tmp、spool、圧縮物、remote object、最終receiptを含むpeakはnullである。各phaseの同時存在とremote保存予約を計数し、reserveを通常workへ流用しない。事前配置を理由に費用を除外しない。

次の確認を依存順に進める。

1. Node20共用の静的互換性と必要入力を列挙し、Node24が残る場合は同じ容量判定へ戻す。未確認のままruntimeを削除しない。
2. Git smart HTTP・registry CASを仲介する方法を特定する。単純なREST書込みをforce-with-leaseの代替にしない。
3. 全clientの設定移管、下位無再送、OS隔離、job照合、全入力peak、最終receiptの阻害条件を閉じる。

これらが閉じる前はrunner改変・build・登録・実行、新規remote結合試験へ進まない。この候補の選択は実装許可ではなく、成立不足なら不足として止める。上限増加・無言のprotocol置換・科学条件の変更で救済しない。

## 研究境界と監査

第五世代研究は継続中。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを維持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を保持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128の読取・生成、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更せず、WSL更新・再起動・導入・mount・cgroup/network/証明書変更も行わない。全工程成立後の科学API接続と最終事前固定は引き続き残る。

台帳は実行設定ではなく、現時点の候補・未固定値・阻害条件の一覧である。部品値の根拠は前段の保存目録・過去観察を参照し、現在checkoutは[現在用監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)で検算する。凍結済みmanifest・原記録は変更しない。説明・見出しは日本語、JSON/ID/path/field/hash/commandは機械定義例外で、その意味と限界を日本語で示した。CI・レビュー・統合はPR記録で確認する。
