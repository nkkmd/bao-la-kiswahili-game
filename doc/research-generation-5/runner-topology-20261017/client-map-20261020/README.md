# 通信clientの生成箇所とguard差込位置の部分台帳

## 今回の到達点

main `9b33eef4be2d05c9884cfbaa9704428c45add573`と[要求guardの設計](../fail-first-20261020/README.md)を照合し、固定runnerソースを走査した。対象C#817ファイルから、32ファイル・72件のconstructor/factory構文一致を得た。**共通HttpClientHandlerFactoryへの1か所の差込みだけでは、確認した全経路を覆えない。** Vss、Raw、OAuth、直接pipeline生成と、HTTP以外・子processを別系統に分ける必要がある。

今回固定したのは、有限のソース走査範囲・構文候補・差込検討箇所である。全clientを列挙し終えたこと、到達するcall graph、全egressの仲介、最内側transportの無再送、guard実装の成立は認定しない。

## ソース取得と保存範囲

公式[runner v2.337.0の固定コミット](https://github.com/actions/runner/commit/397b032cbf865e9c3ddfab89d533ec19325e1273)を読取専用checkoutへ取得し、HEADが`397b032cbf865e9c3ddfab89d533ec19325e1273`、treeが`1cf45b8c44018e52dfde0edb4ab4141f5ac9a19a`であることを確認した。runnerのbuild・実行・登録はしていない。WSLの状態をこの作業環境から観察したものでもない。

走査対象は追跡済みの`src/Runner.*/`と`src/Sdk/`配下の`.cs`。`src/Test/`、C#以外、外部.NET runtimeやOS、生成済みbinaryの内部は対象外である。各対象fileのbyteをGit blobへ照合してから走査した。未追跡fileは混ぜていない。

保存物は次のとおりである。

| 資料 | 内容と限界 |
| --- | --- |
| [走査manifest・索引](SCAN.json.gz) | 全817対象のpath/Git blob/byte/SHA-256/一致数、固定regex、全一致行を保存。コメント・宣言を含む文字列探索で、72件は実際の通信回数ではない |
| [一致した32ソースの原文](MATCHED_SOURCES.json.gz) | 一致fileのUTF-8原byteを復元できるJSONをgzip化。BOM・改行・原文の空白を保持。元の配布archiveや実行binaryではない |
| [照合値と状態](REVIEW.json) | source commit/tree、圧縮保存物のhash・byte数、対象数と未成立fieldを保存 |
| [MIT LICENSE](LICENSE) | 固定checkoutの著作権表示を保持 |

圧縮JSONはkey順・空白なしの直列化をmtime=0でgzip化した派生成果物である。元のHTTP原応答とは扱わない。未一致785ファイルはmanifestと固定Git blobで識別し、原文をこの保存bundleには含めていない。CIは一致原文・索引・未成立fieldを照合するが、全817ファイルの再走査やGit tree全体の独立復元は行わない。全走査の再現には固定checkoutが必要である。

## 差込位置を分ける部分台帳

下記pathはすべて固定コミットのsrc配下で、原文と行位置は保存bundle・索引から照合できる。表は確認できた系統であり、完全な到達可能性分類ではない。

| 系統 | 確認した生成箇所 | 必要な差込・迂回対策と未確認部分 |
| --- | --- | --- |
| T01 共通factory系 | Runner.Common/HostContext.cs、HttpClientHandlerFactory.csと、それを呼ぶJobServer、RunnerDotcomServer、ConfigurationManager、ActionManager等 | CreateClientHandlerの戻り値は具体型HttpClientHandler。DelegatingHandlerへ差し替えるならinterface・caller・設定適用への影響を確認する。下位redirect等が内側で起きる問題は別に残る |
| T02 Vss系 | Sdk/Common/Common/VssHttpMessageHandler.csの既定transport生成、VssConnection、VssHttpClientBase、VssUtil | 共通factoryを経由しない既定constructorがある。認証loopより内側に許可を置き、既定・overload・派生生成を統一する必要がある |
| T03 Raw系 | RawHttpMessageHandler、RawConnection、RawHttpClientBase、VssUtil、RunServer、BrokerServer | Vssとは別の既定transportとpipeline生成がある。T02だけの変更では覆ったことにしない |
| T04 OAuth token系 | Sdk/WebApi/WebApi/OAuth/VssOAuthTokenHttpClient.csのCreateMessageHandler | 独自にHttpClientHandlerを生成し、retry handlerで包む。token取得を通常要求と同じ許可台帳へ登録し、秘密を保存しない |
| T05 直接connection・pipeline系 | LocationService、FileContainerServer、Runner.Sdk/ActionPlugin、LaunchServer、ResultsServer等 | VssUtilを通さない生成や再生成を点検する。内側constructorの統一と全callerの対応を検証する。plugin等が実jobで無効なことは別の到達性証拠が必要 |
| T06 HTTP以外 | VSockSecretNotifier、DapDebugger、WebSocketDapBridge等 | socket/WebSocketをHTTP guardで扱ったことにしない。VSockは通常のInternet HTTP要求ではなく、DAPにはdebug用途の経路がある。実jobでの有効化条件・local/remoteの範囲・無効化強制を分類する。今回の走査から既存jobでの利用を断定しない |
| T07 子process・外部runtime | Git、Node、shell等のwork・保存・取得client | C#constructor索引には出ない通信があり得る。固定workflow/codeの到達性と、OS側の迂回禁止・権限分離が未成立。親cgroupに入ることだけで通信がguardを通る証明にはしない |

T01だけを変更する、VssUtilだけを変更する、最外側の追加handlerだけを置く、という単一箇所案は、この台帳の確認済み経路さえ網羅した証明にならない。既定constructorを残したまま一部callerだけguard付きoverloadへ移すことも認定しない。

## 構文探索の限界とtransportの停止点

regexは固定し、通常のnew、target-typed new、factory名を探索する。コメントやmethod宣言も一致し、複数patternが同じ行に一致することもある。reflection、alias、複数行の構文、別名factory、動的plugin、native code、子processを網羅する解析ではない。未一致を「通信なし」と判定しない。

HttpClientHandlerFactoryが存在しても、Vss/Raw/OAuth側は直接HttpClientHandlerを作る。Vss/Raw handlerは内側handlerを辿ってtransportへ設定を適用するため、guardを間に入れる際は設定の適用先・順序を壊さないか確認する。自動redirect、認証challenge、接続切断時の要求再実行などがguardより内側で起こらないことを、実際に固定する.NET runtimeとtransportで調べる必要がある。今回はrunner repoのC#に限ったため、その下位保証は未監査である。

全clientをsource上で差し替えることと、子process等の直接送信をOS側で禁止することは別の条件である。source guardだけの迂回禁止を推測で宣言せず、専用の非管理主体・許可されたIPC・network境界・親監督の権限を具体化する。WSLでその制御を設定・試験したことにはしない。

## 次に進める具体的な作業

1. 差込案はT01〜T05の全生成経路を列挙した上で、既定transport生成をguard管理下へ集約するsource差分として設計する。具体型interface、認証・証明書・proxy設定、body検算と保存専用許可への影響を示す。まだsourceを改変・buildしない。
2. T06/T07を含む未管理通信の範囲を固定し、採用しない機能の到達性・無効化強制と、許可のない直接送信を閉じるOS境界を設計する。source上の不使用宣言や環境変数だけを強制の代用にしない。
3. 実行対象architectureとruntime入力を固定し、.NET/System.Net.Httpを含む下位transport・依存物・全入力量を特定する。WSLのarchitectureは未共有なので、対象binaryを決める前にユーザー環境でuname -mの読取が必要である。ここでCPUや版を推測しない。
4. 容量・権限・全通信・最終保存の経路が確定してから、既知データの結合試験を契約化する。原子的な許可消費・最初の失敗後の次送信拒否・停止保存は未実装で、今回の索引照合をその試験へ昇格しない。

WSLでの追加導入、network/cgroup/証明書設定、runner登録、remote fixtureの起動は行わない。必要な変更は具体化とレビューが済むまで案内しない。

## 維持する研究境界

第五世代研究は継続中、主要準備未成立は仮説否定ではない。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・実行未認可、wholeLifecycleOsProvenはfalseのままである。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiBを維持する。

103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の先行候補rootだけを集合へ追加する規則と採用35代表・8候補の差0件を保持する。主課題をDTF・近似探索・実戦勝率へ差し替えず、提案seed 50613001..50613128を読取・生成しない。旧区画・root/witness延長、source追加、候補差替え、上限増加、救済的retry、成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更しない。

全工程成立後にも、科学reference API・固定初期状態・独立source再生・全合法手閉包・途中closure/microstate停止証拠と、最終SPEC・CONTRACT・AUTHORIZATION・全入力hash・保護集合・CI receipt・実行前レビュー・科学専用triggerの固定が残る。

## 再現と品質

保存分の照合と境界検査は次を使う。通信、C#実行、科学API読込はしない。

```bash
python3 tools/research/g5-runner-topology/inventory-clients.py --verify-saved
python3 tools/research/g5-runner-topology/test-inventory-clients.py
```

別途、既にある固定checkoutを全走査する場合は次を使う。source commitの不一致やbyteの変更は拒否し、通信やcheckoutを自動で行わない。

```bash
python3 tools/research/g5-runner-topology/inventory-clients.py /path/to/fixed-runner-checkout
```

圧縮bundle内のC#原文・MIT LICENSEは原資料例外で、原文と著作権表示を保持する。原文の末尾空白を読みやすさのために削らず、Git blob一致を優先した。JSON/path/field/hash/ID/commandは機械定義の例外とし、通常説明文・見出し・限界は日本語で記述する。CI・レビュー・main統合の実際の状態はPR記録で確認する。

今回の品質確認では、新規3検査、軽量経路2検査、shell経路2検査と既存要求guard記録の一致が合格した。上記9文書の相対リンク切れ0件を確認し、新規説明・見出しは日本語、原資料・機械定義は明示した例外として保持した。保存索引の照合を全ソース再走査や実行試験とは扱わない。
