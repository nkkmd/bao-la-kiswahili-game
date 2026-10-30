# runnerのruntime指定とtransport置換の静的確認

## 結論

2026-10-30、main `6f7e394b5b8c78027809d3ca7f3b9ba2683a3c76`から、固定runner `397b032cbf865e9c3ddfab89d533ec19325e1273`のbuild指定と保存済みclient原文を確認した。未統合PR・開始時のローカル差分はなかった。Linux x64を対象とするが、runtime patch版と全依存物は未確定である。

新たに分かった阻害要因は、**Vss/Rawの最内側transportを別型のIPC実装へ置き換えるだけでは、既存設定の適用を維持できない**ことである。設定移管と認証・証明書・proxyの契約を先に設計する。runner改変・build・登録・実行、remote結合試験は開始しない。

## 固定資料とruntimeの意味

GitHubから同じ固定コミットの4ファイルを取得し、UTF-8 byteをGit blob SHA-1へ照合した。[取得元一覧](SOURCE_ORIGIN.json)にpath・Git blob・byte数・SHA-256を保存した。HTTP原応答やbinaryの保存ではない。[MIT LICENSE](LICENSE)と原文を保持する。

| 原文 | 確認した指定 | 限界 |
| --- | --- | --- |
| [global.json](upstream/src/global.json) | SDK versionは8.0.424 | SDK指定であり、配布runtimeのpatch版・実際に使ったSDKの証明ではない |
| [Listener project](upstream/src/Runner.Listener/Runner.Listener.csproj) | net8.0、SelfContained=true、TargetLatestRuntimePatch=true、linux-x64を含むRID一覧 | restore/publish時の入力と成果物なしにruntime patchを確定しない |
| [Worker project](upstream/src/Runner.Worker/Runner.Worker.csproj) | 同じframework・self-contained・patch選択指定 | 直接PackageReferenceだけでは推移依存やnative依存を網羅しない |
| [共通build指定](upstream/src/Directory.Build.props) | Linuxかつlinux-x64またはPackageRuntime空欄でX64定数を追加 | RIDの選択と実行binary同一性・ユーザーWSLでの動作は別条件 |

SelfContained指定があるため、WSLのdotnetコマンドの有無や版だけを調べても、候補配布物が使用するSystem.Net.Httpの同定にはならない。現時点でWSLへのdotnet導入や版確認は要求しない。次は固定配布物または固定publish入力に由来するruntimeconfig/deps、runtime componentのhashと版対応を静的に特定する。配布archiveを再取得したり実行したりはしない。ローカル原archiveがなければ取得手順を先に設計する。

## 保存済みclient原文からの設定適用先

以下のpathと行は[部分台帳の原文bundle](../client-map-20261020/MATCHED_SOURCES.json.gz)を対象とする。全817ファイルの再走査や完全なcall graphではない。

| 系統・位置 | 静的に確認した処理 | 置換前に必要な判断 |
| --- | --- | --- |
| HostContext.cs:806〜809、HttpClientHandlerFactory.cs:10〜17 | extensionとfactoryの戻り値はHttpClientHandler。factoryはProxyを設定して生成 | 戻り値を一般化する場合、callerの具体型設定を列挙して移管する |
| VssHttpMessageHandler.cs:47〜73、482〜506 | DelegatingHandlerを内側へ辿り、最終handlerをHttpClientHandlerへ型変換。成功時にredirect、credential、proxy、cookie、圧縮等を設定 | guardを既存transportの外に置く場合は内側の再送が残る。別型の末端へ置換するとこの型分岐の設定は適用されない |
| RawHttpMessageHandler.cs:27〜51、285〜303 | 同じ内側探索と型変換でcredential、proxy、cookie等を設定 | Vss側だけの修正では不足。設定の同値性と意図的拒否を区別して固定する |
| VssOAuthTokenHttpClient.cs:104〜135 | 別のHttpClientHandlerへproxy、client証明書、server証明書callbackを適用し、retry handlerで包む | token経路専用の設定・秘密の扱い・送信許可を統合する |

Vss/RawがHttpMessageInvokerを作ることは、下位transportの無再送を示さない。ApplySettingsが型不一致で設定を飛ばすことを、不要設定の安全な削除と解釈しない。IPCへcredentialや証明書設定を渡すなら、秘密の所有者、使用範囲、検証callbackの意味、拒否時の停止を別途固定する。任意callbackをそのまま別processへ転送できると仮定しない。

## 共通factoryのcaller候補

同じ保存32原文内でCreateHttpClientHandlerの呼出しを確認した範囲は次のとおりである。宣言・返却も含む索引と区別し、一覧外にcallerがないとは主張しない。

| 保存原文のpath（src配下） | 行 |
| --- | --- |
| Runner.Common/JobServer.cs | 102、125 |
| Runner.Common/RunnerDotcomServer.cs | 118 |
| Runner.Listener/Checks/CheckUtil.cs | 132、204 |
| Runner.Listener/Configuration/ConfigurationManager.cs | 781、841 |
| Runner.Listener/SelfUpdater.cs / SelfUpdaterV2.cs | 326 / 291 |
| Runner.Worker/ActionManager.cs | 1664 |
| Runner.Worker/Dap/DapDebugger.cs | 227 |
| Runner.Worker/JobExtension.cs | 1106 |

DAPの228行にはAllowAutoRedirect=falseの具体型設定がある。実jobでDAPを使用するという意味ではない。更新・構成・診断経路も、未使用と宣言するだけで全監査から除外しない。T05の直接pipeline、非HTTP、子process、未一致785原文や外部runtimeの到達性は未完である。

## 次の停止条件

1. runtimeconfig/depsと実componentを特定し、対象System.Net.Httpの下位再送・認証・redirectを静的監査する。SDK 8.0.424をruntime版として使わない。
2. transport設定を一覧化し、既存transportを残す方式と別主体へ移管する方式の同値性・拒否条件を比較する。全caller・認証・保存まで閉じる前にsourceを変更しない。
3. [通信・権限境界設計](../BOUNDARY_DESIGN_20261030.md)の迂回禁止・権限分離・全入力容量・最終receiptを満たせる一経路へ固定する。未測定容量は0とせず、容量不足なら停止する。

標準x64 runner全体の通常展開案は679562451 byteで256 MiBを超える判断を維持する。runtime資料の同定が容量成立を意味することはない。新規のWSL操作や設定変更は不要である。

## 境界と再現

第五世代研究は継続中。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを維持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を保持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128を読取・生成せず、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更しない。全工程成立後の科学API接続と最終事前固定は引き続き残る。

原文4ファイルの再照合はSOURCE_ORIGIN.jsonのGit blob・byte数・SHA-256と保存byteを比較する。callerと設定の行位置は既存bundleを復号して照合する。保存台帳はinventory-clients.py --verify-saved、現在checkoutは[現在用監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)で確認する。全走査・compile・実行は行わない。

人間向け説明と見出しは日本語で、XML/JSON・上流原文・LICENSE・path・ID・command・hashは原資料または機械定義の例外である。原文の英語と改行を保持し、通常説明を日本語で補った。CI・レビュー・統合の実際の状態はPR記録を参照する。
