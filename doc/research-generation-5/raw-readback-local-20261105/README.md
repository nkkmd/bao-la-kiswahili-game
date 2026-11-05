# raw読戻し部品の実装とローカル検査

## 結果と認可範囲

ユーザーは「科学処理・外部通信なしで、raw読戻しclientの実装と既知データによるローカル検査まで」という提案に対して「進めてください」と指示した。この範囲に限定し、旧clientを変更せず[独立した部品](../../../tools/research/g5-raw-readback/README.md)とローカルテストを追加した。サブエージェントは使っていない。

最終ローカル検査はNode **v24.22.1**で13件成功・失敗0件だった。[結果とsource hash](LOCAL_RESULT.json)に保存する。科学runtime候補のNode24.19.0での結果や、実HTTP・実OSの成立証拠ではない。

## 実装で閉じた部分

既存JSON clientの24 MiB応答制限に対し、新部品はraw byte streamをBYOBで読み、1 MiBのclient側bufferを再利用して二つのhashを更新する。全48 MiBの応答をJSON/base64化したり、Bufferへ連結して蓄積したりしない。固定した期待量・hashを処理中に呼出側から差し替えることも拒否する。

要求先は固定Git blob IDから作るGET pathだけで、通信関数は注入必須である。既定のfetch・認証情報・書込操作はない。したがって今回の実装はraw応答を有限に検算するclient部品であり、外部ネットワークに接続可能な完成HTTP adapterではない。

## 検査した境界

| 検査 | 結果 |
| --- | --- |
| 48 MiBの固定0xa5列 | Python hashlibで別途求めたSHA-256/Git blob hashと一致 |
| 6片合計256 MiB | 境界ちょうどは一致、超過予約は新しい要求の前に拒否 |
| 過大size、不正hash、期限切れ | 要求前に拒否 |
| 切断、短縮、余分な1 byte、同長改変、Git hashだけの不一致 | 完了にせず停止。後続要求・再送なし |
| 部分HTTP status、redirect、圧縮、長さ不一致 | raw検算へ進めない |
| 応答待ち/body待ちの停止 | 要求期限でAbortSignalを発火し、待機を打切る |
| 遅着応答 | cancelし、新しい要求で救済しない |
| 共通期限到達・時計逆行・外側stop | 成功扱いにしない |
| 同時要求、成功blobの重複、7要求目 | 新しい通信を開始しない |
| 非BYOB stream、空blob | 前者は拒否、後者は空blobの二hashを検査 |
| await中の呼出側manifest変更 | 開始時の固定値を使い、予約量のすり替えを拒否 |

余剰検出には期待量の後の最大1 byteが必要であり、最大6要求のprobe 6 byteも予約する。これは科学データ容量を増やすものではなく、D保存のmetadata等の余裕へ計上すべき制御費用である。clientの観測byteと下位transport/HTTP/TLS全体の費用は区別する。

## 合格にしていない条件

- 実GitHub raw endpoint、送信・読戻し、redirect/内側retryの全経路、token隔離は未検証。
- 全実要求数・1 GiB通信予約・D600 MiB・C16 MiBへの結合は未成立。
- OS cgroup、1 GiB/R512 MiB/C128 MiB、全子孫停止・監督喪失時の強制停止は未検証。
- D全体のref/commit/manifest照合によるACK、T保存、U_api受領は未成立。
- 科学用の永続一度限り性、最終入力、science gate、科学登録/実行は解禁しない。

ローカルの13件合格を、前回のU12や30行全体の実行条件合格へ変換しない。今回増えたのはraw body検算部品のローカル証拠である。S/Kの信頼範囲や[選択済みの設計方針](../execution-contract-review-20261105/USER_SELECTION.md)、B1一括未採用を変更しない。

## 再現と保存

```bash
node --test tools/research/g5-raw-readback/client.test.cjs
```

全入力はテスト内の既知byte、clock、stream、通信関数の代役だけである。科学module、提案seed、保存済み科学軌跡を読まず、socket・HTTP server・実外部取引を作らない。巨大なfixtureファイルも保存しない。旧capsule/科学実装・原証拠・workflowは変更しない。

新テストはtools側に置き、既存の`test/g5-*.cjs`によるCIには組み込まない。今回の新しい検査はローカルだけで、専用remote試験workflowは追加・起動しない。既存保存監査CIが起動する場合は、以前の記録を照合するものとして別に結果を記録する。

基点はPR #236のhead `3d021598d2b25d783968b238ee8e65b5fd1b761b`。評価資料と実装を混在させないため、そのbranchをbaseとする別のdraft PRへ保存する。mainのillustrated-rules.yml保存監査不整合は今回修正せず、必要CIが成立するまで統合しない。hashes-onlyと完全監査を区別し、今回完全archive監査に成功したとは報告しない。

BEFCSの科学seed消費0・leaseなし・未登録/未実行・未認可、旧wholeLifecycleOsProven=false、全体の実装移行停止を保持する。今回の限定client実装認可を、他の監督/adapter実装・新規実機試験・科学実行の認可へ拡張しない。公開ゲーム・AI-GEN4・Worker・ユーザーWSLは変更しない。

## 品質確認と停止点

新しい人間向けREADME 2件と研究案内等の更新部分を日本語で監査し、英語だけの説明見出し/通常説明文・リンク切れ・意図しない旧canonical値/code block変更を0件とする。ID・path・hash・field・command・API名は識別子例外である。コードとテストの自己レビューでは、待機中の入力すり替え、遅着応答、取消し、quota予約の非返却、bufferと実RSSの区別を確認した。独立レビューは未実施。

今回の停止点はraw client部品とローカル検査までである。実HTTP adapter、外部結合、OS検証、科学登録/実行には進まない。
