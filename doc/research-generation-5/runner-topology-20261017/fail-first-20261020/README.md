# 最初の通信失敗で停止する追加制御の設計レビュー

## 結論と採用していない範囲

main `4b0d379e308b81d37cf6cf8ea07f843912a341de`から、[shell経路監査](../shell-route-20261020/README.md)に残った追加制御を具体化した。優先する設計候補は、**実際のHTTP要求が送信される境界に置く、一度限りの送信許可と共有停止状態を持つguard**である。runner側の全clientへこの境界を強制するsource管理を前提とし、未改変runnerに外側handlerを足すだけの案ではない。

これは設計候補の選択であり、guardの実装・build・配備・実OS成立・科学実行を認めたものではない。下位transportの動作と全client経路、容量、権限分離、保存まで未確定なので、新規remote fixtureを開始しない。

## 固定ソースで追加確認したこと

公式コミット`397b032cbf865e9c3ddfab89d533ec19325e1273`から5ソースを読み、保存byteをGit blob・byte数・SHA-256で照合した。[取得元](SOURCE_ORIGIN.json)、[MIT LICENSE](upstream/LICENSE)を保存する。HTTP原応答や実バイナリ同一性の証明ではない。

| 資料 | 今回の根拠と意味 |
| --- | --- |
| [VssUtil.cs](upstream/src/Runner.Sdk/Util/VssUtil.cs) | GITHUB_ACTIONS_RUNNER_HTTP_RETRYの読取後、MaxRetryRequestを3〜10へ補正する箇所がある。環境変数を0にするだけでは、示されたhelperでretry設定を0へできない |
| [VssConnection.cs](upstream/src/Sdk/WebApi/WebApi/VssConnection.cs) | MaxRetryRequestが正なら、追加delegating handlerの列の最後にVssHttpRetryMessageHandlerを加えてpipelineを作る。単に追加した外側handlerが最初の送信失敗を必ず観測するとはしない |
| [VssHttpRetryMessageHandler.cs](upstream/src/Sdk/Common/Common/VssHttpRetryMessageHandler.cs) | MaxRetries+1を試行上限にするloopと、再試行可能応答・例外の後の再送経路がある。request単位のoptions上書きもあるが、全clientへ適用済みとは扱わない |
| [VssHttpMessageHandler.cs](upstream/src/Sdk/Common/Common/VssHttpMessageHandler.cs) | 内側invokerへのSendAsyncを認証challenge処理のloopから呼ぶ。transportにAllowAutoRedirect等を設定する。一般のretry handlerだけを外しても、認証やredirectを含む全送信を一度限りにした証明にはならない |
| [BrokerServer.cs](upstream/src/Runner.Common/BrokerServer.cs) | GetRunnerMessageAsyncがRetryRequest経由で受信要求を呼ぶ一方、ACKにはNo retriesの注釈がある。ある操作のretryなしを、別操作や下位client全体へ一般化しない |

これらは存在する経路の静的確認であり、全通信実装の網羅、全設定でのretry発生、既存jobでのretry観測を主張しない。VssConnectionでretry設定0の経路があり得ることと、現在の全helper・認証・listenerでretryを拒否できることは別である。

## 方式比較と優先候補

| 方式 | 今回の評価 |
| --- | --- |
| 環境変数だけを0へ変更 | 対象helperの下限補正を解消できず、採用しない |
| listenerのloopだけを削除 | SDK、認証、Brokerラッパー等の経路が残り得るため単独では採用しない |
| 最も外側の追加HTTP handlerだけで失敗を監視 | 内側でretryが完了してから最終結果だけ届く可能性があり、保証方法として採用しない |
| log監視・後追いkill | 最初の失敗と次要求の間に確実に介入した証拠にならず、採用しない |
| 透過proxyやCONNECT tunnelだけで制御 | 暗号化された要求・応答の分類と遮断順序が未成立で、選択しない |
| TLS終端proxyを新設 | trust store・認証・redirect・全通信の経路強制・容量が追加される。今回は優先せず、設定変更を行わない |
| source管理下の最内側要求guard | 実送信と最初の応答/例外を同じ境界で扱い、上位がretryを試みても次送信を拒否する設計候補として優先。ただし下位transportの自動処理と全clientの迂回防止が未監査 |

guardより内側に自動redirect・認証再送・HTTP要求の再実行があれば保証は成立しない。HttpClientHandler等の既定値や配布バイナリの動作を推測で埋めず、下位transport・runtime・依存物を固定して監査する必要がある。

## 送信許可と停止状態の具体案

通常の通信は初期案では同時に1取引だけとし、次の許可を発行する主体を親監督に限定する。runner内部のlistener・認証・受信・input取得・job終了報告を含め、guardを通らないclientを認めない。正当なlong pollも待機時間・終了予約内に収まる必要があり、直列化でrunnerが進めない場合は設計不足とする。未検証のまま並列通信を許して解決したことにしない。

| 状態・事象 | 必要な処理と次要求への扱い |
| --- | --- |
| 許可前 | 親が取引ID、phase、method、宛先、対象hash/byte上限、期限、期待応答、許可済み認証方式を固定。許可のない要求は送信しない |
| 送信直前 | 許可を原子的に消費して記録する。同じ許可で2回目のSendAsyncはできない。送信前記録や容量予約の失敗でも閉じる |
| 応答待ち・body読取中 | 許可は使用済みで、次取引は未許可のまま保持する。header成功だけでは完了にしない |
| body読取・検算・意味確認が全成功 | callerの検算完了を親へ結び付けて取引を完了し、条件を満たす場合だけ別取引を許可する。callerの完了通知が実装できなければ先へ進まない |
| timeout・接続失敗・応答不明・不正応答・body欠落・hash不一致・未許可redirect/認証再送 | 最初の理由を不変の停止状態へ記録し、通常通信の許可発行を閉じる。新workと待機要求を取消し、同じ対象を再取得しない |
| 上位listener/SDKが再呼出し | 未使用の許可がないため送信を拒否する。上位のretry loopが回ったことと、通信が再送されたことを区別して記録する |

「要求1回」を単なるURL文字列の一致で判定しない。同じ宛先への正当な次のlong pollと失敗取引のretry、認証取引と科学input取得、保存とACK検算を、事前の取引ID・phase・対象で区別する。URL変更・別client・token更新で使用済み許可を新規取引へ偽装できないようにする。

期待する成功statusや認証方式・redirectは操作別に事前固定する。未定義のchallengeを自動再送で救済しない。例えば401を受けてtoken更新・元要求再送が必要な経路は、その送信順序と現契約への適合を先にレビューする。未レビューの認証交渉を無言で成功扱いや計数外へ置かない。認証情報・秘密を証拠へ書かず、秘匿化した宛先・取引ID・対象hashで結合する。

## 故障後の保存と全子停止

通常通信の停止後も、固定済みローカルprefixを保存するための専用許可は、事前に契約へ列挙したものだけを親が発行する案とする。これは失敗したsource取得や保存の再送を許可する仕組みではない。保存対象・保存先・byte/hash・最大要求数を固定し、receiptの照合に必要な読取と、失敗取引のretryを区別する。

保存中の故障・応答不明では再送や別保存先への救済を行わず、未ACK・未完成を保持する。remoteに保存されていないと仮定して容量予約を返さない。guard故障時は通常通信を開かず、親側で保持できるprefixまでを記録して止める。全子停止と最終receiptの順序・終端を固定するまで、完成を宣言しない。

親監督・guard・runner・認証・work・圧縮・保存・全子停止を同じ20分・1 GiB・swap無効・保存256 MiBへ含め、終了予約180秒と16 MiBを保護する。入力・runtime・trust store・log・tmp・buffer・remote制御objectも台帳へ含める。新しいguardやproxyの費用を基盤側へ移して上限成立としない。

## 実装前に閉じる条件

1. Vss/Raw/Broker/RunService、認証provider、archive取得、保存clientなど、全client生成箇所と下位transportを一覧にし、guardの差込位置・生成権限・迂回禁止を固定する。今回は全clientを列挙できたとは主張しない。
2. 取引台帳を確定し、初回失敗の分類、原子的な許可消費、body/意味検算完了、通常通信の停止と保存専用許可、キャンセル・全子停止の順序を定める。
3. source差分と依存物を最小化し、build来歴・固定バイナリhash・選別file・全入力量・書込peak・最終receiptを具体化する。既存版表示をカスタムbuildの証明にしない。容量不足なら不足として止める。
4. 専用環境と経路を確定した後に、既知データ限定の結合試験契約を作る。正常、初回失敗、応答不明、body欠落、内側の再送、並行呼出し、guard故障、停止・保存失敗を検証し、次要求の外向き送信がなかった原証拠を独立検算する。

本書ではsourceを改変・buildせず、proxyや証明書、WSL設定、runner登録を行わない。契約案や擬似的な状態説明を、実装・原子的動作・実OS成立の証明へ読み替えない。

## 科学工程と境界

第五世代研究は継続中。全工程未成立・科学実行未認可、科学seed消費0・leaseなし、BEFCSと正式関係は未登録・未実行を維持する。主要準備未成立は仮説否定ではない。103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結選定規則と採用35代表・8候補の差0件を保持する。

主課題は探索順位変動と厳密勝敗価値損失の関係であり、DTF・近似探索・実戦勝率へ差し替えない。旧区画・root/witness延長、source追加、候補差替え、上限増加、救済的retry、成功済み外部保存取引の反復をしない。提案seed 50613001..50613128を読取・生成しない。公開ゲーム・AI-GEN4・Workerを変更しない。

全工程成立後にも、科学reference API・固定初期状態・独立source再生・全合法手閉包・途中closure/microstate停止証拠と、最終SPEC・CONTRACT・AUTHORIZATION・全入力hash・保護集合・CI receipt・実行前レビュー・科学専用triggerの固定が残る。

## 再現性と品質

[静的照合結果](REVIEW.json)は原ソースの保存整合と設計上の未成立状態を示す。再計算器は通信・C#実行・科学API読込をしない。原ソース取得にはGitHubを使用しており、既存取引を再実行したものではない。

```bash
python3 tools/research/g5-runner-topology/review-fail-first.py
```

C#原文・MIT LICENSEは原資料例外で、著作権表示を保持する。source originは正規化した取得元・Git blob・byte/hashの記録でHTTP原応答ではない。JSON/path/field/hash/ID/commandは機械定義の例外とし、判断・設計・限界は日本語で説明する。CI・レビュー・main統合の実際の状態はPR記録で確認する。

ローカルでは静的照合、origin・LICENSE・原ソースの3改変拒否確認、前段shell監査2検査・軽量レビュー2検査が合格した。人間向け変更9文書の新規部分について、英語だけの説明見出し・通常説明文、壊れた相対リンク、既存code block・canonical情報の意図しない変更は0件。上流原文の末尾空白はVssHttpRetryMessageHandler.csの110行とVssConnection.csの90/139/157/167/206/255/269/333/365/472/483/494/505/516/560/572/680/685/692/722/739行にあり、Git blob一致のため保持する。この2原文fileを除くgit diff --checkを確認する。これらの検査はguardの動作試験・原子的性質・無再送の実OS証明ではない。
