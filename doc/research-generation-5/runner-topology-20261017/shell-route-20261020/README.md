# shell中心のActions経路と起動前通信の静的監査

## 結論

main `07cf1707f2aeae054ca7a528ccb0ee139ac84f3a`から、前段で優先したshell中心の実Actions job経路を調べた。**外部JavaScript Actionsを使わないことだけでは、初回通信失敗時のretry拒否は成立しない。** 未改変runnerには、jobのstepを処理する以前のsession作成・受信・再接続にもretry経路がある。

これはshell中心の経路全般の不可能性や、既存jobでretryが発生したという主張ではない。今回除外するのは「usesをなくし、親scope・単一job・attempt 1だけで通信retryなしを成立させる案」である。科学実行・実機試験は開放しない。

次は、**最初の通信失敗後、内部の次要求が送られる前に停止できる追加制御**の設計可能性をレビューする。runnerを改変する案と、通信境界で要求を制御する案を比較する段階で、いずれも採用・実装済みではない。登録や新しいremote fixtureは行わない。

## 保存した根拠

公式コミット`397b032cbf865e9c3ddfab89d533ec19325e1273`から3ソースを読み、保存byteをGit blob・byte数・SHA-256で照合した。[取得元](SOURCE_ORIGIN.json)、[MIT LICENSE](upstream/LICENSE)、[機械可読判断](REVIEW.json)を保存する。HTTP原応答、実バイナリの一致証明、ソースのcompile/実行ではない。

| 資料 | 確認した経路と意味 |
| --- | --- |
| [Runner.cs](upstream/src/Runner.Listener/Runner.cs) | GetMessageListenerはUseV2Flowに応じてBrokerMessageListenerまたは通常listenerを選ぶ。RunAsyncでsession作成を経てmessage queueを処理する。runOnceのjob終了待ちがあっても、それ以前のsession・受信処理を取り除かない |
| [MessageListener.cs](upstream/src/Runner.Listener/MessageListener.cs) | CreateSessionAsyncのloopで再試行可能例外の後に30秒待機して次の試行へ進む。GetNextMessageAsyncでも例外分類後に接続再作成・backoffを行う経路がある |
| [BrokerMessageListener.cs](upstream/src/Runner.Listener/BrokerMessageListener.cs) | session作成のloopと待機、受信失敗後のbackoff・接続更新の経路がある。受信側に最大retry数があることは、初回失敗で停止することと異なる |

SkipSessionRecoverは、session期限切れからの再作成条件に関係する。その他の再試行可能例外を処理する分岐まで一律に無効化するとは扱わない。ephemeralやrunOnceを「最初の通信失敗で停止する設定」へ読み替えない。下位HTTP client・認証・job取得・終了報告等の全通信監査は未完であり、今回の3ソースから全retry箇所を網羅したとは主張しない。

一方、既存保存[ActionManager.cs](../upstream/src/Runner.Worker/ActionManager.cs)のLoadActionには、Script参照をScriptActionExecutionDataへする分岐がある。Repository/ContainerRegistry参照の処理とは区別される。これはscript stepという別経路がある根拠で、未登録workflowの推移的な全参照・暗黙処理がscriptだけと証明したものではない。shell中心の案がActions archive取得やNodeの一部を減らす可能性と、runner全体の通信条件を満たすことを分ける。

## 既存条件との対応

| 条件 | shell中心化だけで分かったこと | 残る判定 |
| --- | --- | --- |
| 本物の単一job・attempt 1 | Actionsを保持する案なので、その来歴を得る候補ではある | head/workflow/job/attemptを受理前に照合する実装は未確定 |
| 初回準備以前の親scope・共通時計 | stepの種類ではsession作成時刻を覆えない | runner起動前からの強制が必要 |
| 初回通信失敗後のretry拒否 | 通常・Broker両listenerにstepと独立したretry経路がある | 追加制御なしでは成立しない |
| 最小runtime集合 | Script用のexecution分岐はある | 内部Node不要、単一Nodeで起動成功とは未確認 |
| 容量・memory・swap | 前段の部分容量計算を保持 | 全input・全書込・remote・依存物・peakは未確定 |
| 全子停止・最終receipt | shell中心化では完成しない | 親終了までの計数と保存終端は未確定 |

## 次に比較する追加制御

| 案 | 成立させる必要がある証拠 | 今回の状態 |
| --- | --- | --- |
| 固定runnerの通信を失敗時即停止へ改変 | listener以外の認証・job取得・下位HTTP client・終了報告も含む全経路、依存物とbuild来歴、固定バイナリhash、最小file集合、通信故障時の停止証拠 | 設計レビューのみ。source変更・build・採用なし |
| 通信境界で次要求を拒否し停止 | 接続/TLS/HTTP/応答不明をどう識別するか、最初の失敗を次要求より前に検出・遮断する順序、隠れた下位retryの扱い、制御主体の同一予算・権限・信頼基盤 | 設計レビューのみ。proxy・証明書・network設定変更なし |
| 独立executorへ移行 | 単一Actions job・attempt・CI receipt・triggerの条件との対応、契約変更の明示的レビュー | [前段](../lightweight-20261020/README.md)どおり保留。ローカルattempt=1は代用にならない |

単にlogのretry文字列を監視して後からkillする、backoffを0にする、特定例外だけ止める、通信要求を一律1回にして認証・正当な待機も混同する、といった方法を無検証で採用しない。正常なlong pollと失敗した取引のretryを区別し、取引対象・回数・失敗停止を事前に定義する。20分timeoutがあるだけでは次要求の抑止を証明しない。

追加制御の候補を決める前に、対象通信の取引台帳と停止順序、下位retryの観測可能性、最小依存集合、全資源、全保存の終端を具体化する。未解決のままWSLへ設定やrunnerを導入しない。対象範囲の変更・基盤側への費用移動・上限増加を自動承認しない。

## 研究の現在地と不変の境界

第五世代研究全体は継続中で、今回の技術判断は仮説否定ではない。主要課題は探索順位変動と厳密勝敗価値損失の関係であり、DTF・近似探索・実戦勝率へ差し替えない。BEFCSと正式関係は未登録・未実行、科学seed消費0・科学leaseなし・科学実行未認可、wholeLifecycleOsProvenはfalseを維持する。

20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパスの解釈を保持する。旧区画・root/witnessの再実行や延長、source追加、候補差替え、救済的retry、成功済み外部保存取引の反復をしない。提案seed 50613001..50613128は読取・生成しない。G5-05の先行候補rootだけを集合へ追加する凍結規則と採用35代表・8候補の差0件を変えない。

全工程成立後にも、科学reference API・固定初期状態・独立source再生・全合法手完全閉包・途中closure/microstate停止証拠と、最終SPEC・CONTRACT・AUTHORIZATION・全入力hash・保護集合・CI receipt・実行前レビュー・科学専用triggerの接続が残る。公開ゲーム・AI-GEN4・Workerは変更しない。

## 再現と品質

再計算器は保存済み固定ソースのhashと限定判断だけを照合する。通信、mount、runner登録、C# compile/実行、科学API読込は行わない。既存の成功取引の再実行ではない。

```bash
python3 tools/research/g5-runner-topology/review-shell-route.py
python3 tools/research/g5-runner-topology/test-review-shell-route.py
```

保存したC#とLICENSEは原資料例外で、同commitの著作権表示を保持する。source originは正規化した取得元・hashの記録、JSON/path/field/hash/ID/commandは機械定義の例外である。現在案内と本書の新規説明・見出しは日本語で記述し、意味・限界・未成立を説明する。実際のCI・レビュー・main統合はPR記録で確認する。

ローカルでは新規の限定判断・改変拒否2検査、前段レビュー2検査、旧runner保存照合3検査が合格した。人間向け変更9文書の新規部分について、英語だけの説明見出し・通常説明文、壊れた相対リンク、既存code block・canonical情報の意図しない変更は0件。C#原文・MIT LICENSEは原資料例外として保持し、保存byteのGit blob・SHA-256を照合した。上流Runner.csの691行にある空白だけの行は、原文のGit blob一致を保つため末尾空白の例外として保持した。この1原文fileを除くgit diff --checkは合格。これらは静的監査であり、実機や下位HTTP clientの全挙動の実証ではない。
