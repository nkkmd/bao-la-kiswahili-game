# 配布runtimeの静的同定と内側retryの確認

## 結論

2026-10-30、main `53e7ec20973d32bfc99aa20ddf9b6e9116912bb8`と保存目録を確認した。未統合PR・開始時のローカル差分はなかった。固定Linux x64配布物のListener/Worker両runtimeconfigとdepsは、Microsoft.NETCore.App **8.0.30**を示す。前段で確認したSDK 8.0.424とは別の値である。

対応する公式.NET tagのHttpConnectionPoolには内側retryがある。**未改変の標準transportを外側guardで包むだけの案では、初回失敗後の次送信拒否を保証できない。** 今回は静的確認で、配布binaryとソースの厳密対応、実際のretry発生、全経路の網羅を証明していない。runner改変・build・登録・実行、remote結合試験、科学実行は開始しない。

## 取得範囲と保存証拠

現在のscratchと/tmpのファイル一覧では原archiveが見つからなかった。この探索範囲外にも存在しないとは断定しない。取得前に対象を公式v2.337.0のLinux x64 archive、226430031 byte、SHA-256 `70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613`へ限定した。

curlのfail・location・retry 0・max-time 120・max-filesize 226430031で一度だけ取得し、終了値0、byte数とhash一致を確認した。通常redirectの追跡と失敗後retryを区別し、後者・代替URLは使わなかった。公式URLはhttps://github.com/actions/runner/releases/download/v2.337.0/actions-runner-linux-x64-2.337.0.tar.gz である。

これは調査資料の取得で、科学用全工程試験や成功済み外部保存取引の反復ではない。取得・静的読取の費用を科学用20分・256 MiB内の成立証拠へ転用しない。原archiveをリポジトリへ格納せず、既存の[容量目録](../capacity-20261020/README.md)と同じhashで識別する。

hash確認後、tarをstreamで読み、固定9項目の通常fileだけを検算した。filesystemへのarchive展開、リンク追跡、DLL/native code実行はしない。4 JSONの内容だけを派生bundleへ保存した。

| 保存物 | 内容と限界 |
| --- | --- |
| [CONFIGS.json.gz](CONFIGS.json.gz) | Listener/Workerそれぞれのruntimeconfig.jsonとdeps.jsonの原byteをbase64値として持つJSONをgzip化。原archive・HTTP原応答ではない |
| [COMPONENTS.json](COMPONENTS.json) | 4 JSON、System.Net.Http.dll、System.Private.CoreLib.dll、libcoreclr.so、libhostfxr.so、libhostpolicy.soの9項目のbyte数・SHA-256。binary本体は格納しない |
| [HttpConnectionPool.cs.gz](HttpConnectionPool.cs.gz) | 公式.NET固定ソースの原byteをgzip化した派生保存物 |
| [SOURCE_ORIGIN.json](SOURCE_ORIGIN.json) | .NET tag・commit・path・Git blob・原文byte/hash・LICENSE blobの照合値 |
| [LICENSE.TXT](LICENSE.TXT) | 同じ.NET固定コミットのMIT原文と著作権表示 |

## runtime同定の範囲

両runtimeconfigのincludedFrameworksはMicrosoft.NETCore.App 8.0.30で、depsのruntimeTargetは.NETCoreApp,Version=v8.0/linux-x64、runtimepack項目はruntimepack.Microsoft.NETCore.App.Runtime.linux-x64/8.0.30で一致した。両depsにあるSystem.Net.Http.dllのassemblyVersionは8.0.0.0、fileVersionは8.0.3026.36720である。これはdepsの宣言で、DLL内部metadataを直接読んだ値とは区別する。

公式dotnet/runtimeのtag v8.0.30はcommit `a83db3e0eb2defb6220e15dae2f1a0462fdbf99f`を指す。タグ名とruntimepack版の対応で監査対象ソースを選んだが、配布DLLがこのtreeから同じ条件でbuildされた証明ではない。native TLS・名前解決・共有libraryの全依存や実binaryの動作保証も未完である。

## 下位retryの静的根拠

対象pathはsrc/libraries/System.Net.Http/src/System/Net/Http/SocketsHttpHandler/HttpConnectionPool.cs。Git blob `a4221c9f039dc3cbb339b0fd0278ea5704a29335`と原byteを照合した。

| 行 | 確認した処理 | 解釈の境界 |
| --- | --- | --- |
| 58〜59 | 接続失敗のMaxConnectionFailureRetriesは3 | 全要求が必ずretryされる意味ではない |
| 1024〜1028 | SendWithVersionDetectionAndRetryAsyncがwhile loopを持つ | 外側SendAsync呼出し1回と内部送信1回を同一視しない |
| 1128〜1149 | RetryOnConnectionFailureを捕捉し、上限未到達なら回数を増やしてloopへ戻る | 最終例外だけを外側guardで捕捉しても、先行する内部試行を観測できたことにならない |
| 1151〜1165 | 許可されたversion policyではHTTP/1.1へ落として再試行する | HTTP version固定だけで他のretryを全て消したとは判定しない |
| 1167〜1174 | stream上限の例外後に別HTTP/2接続での再試行へ戻る | retryを接続失敗分類だけで監査し終えない |

HTTP認証・redirect・proxy・DNS/TLSを含む全transportの監査は残る。TCPのpacket再送とHTTP要求の再実行を混同せず、どの単位を許可消費・失敗停止の対象とするかは事前契約へ明記する。今回は既存jobで再送が起きたという主張をしない。

## 次の設計と停止点

標準transportの上にguardを置く案を、下位無再送の成立方法として採用しない。次は送信境界をどこまで管理するかを決め、別主体のtransport、設定移管、下位再送の拒否、実componentと固定ソースの対応、全容量を同じ設計で比較する。既定runtimeを改変・buildして解決した扱いにはしない。

[前段の設定移管](../runtime-20261030/README.md)と[権限境界](../BOUNDARY_DESIGN_20261030.md)の未完条件を維持する。新たなruntime/transportの費用を計数外へ移さず、標準x64 runnerの通常展開679562451 byteが256 MiBを超える判断も保持する。全client・子process・設定・無再送・権限・容量・最終receiptが閉じるまで結合試験へ進まない。

## 再現と研究境界

CONFIGS.json.gzをgzip復号してJSONを読み、各base64値をbyteへ戻すと4原文を再構成できる。COMPONENTS.jsonの./bin/と原文名を対応させ、byte数・SHA-256を照合する。HttpConnectionPool.cs.gzを復号し、SOURCE_ORIGIN.jsonの原文byte/hash/Git blobと行番号を照合する。binary hashの再検算には同じhashの既存archiveが必要で、CIに再取得を要求しない。

科学seed消費0・leaseなし・未認可、BEFCSと正式関係の未登録/未実行、wholeLifecycleOsProven=falseを保持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を維持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128の読取・生成、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更せず、WSLの導入・設定変更も行わない。全工程成立後の科学API接続と最終事前固定は残る。

上流ソース・LICENSEとJSON原文は原資料例外、path・hash・field・ID・commandは機械定義例外として保持し、目的・結論・限界・次工程は日本語で説明した。保存監査は[現在用手順](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を用い、hash監査と完全独立再検算を区別する。CI・レビュー・main統合の結果はPR記録を参照する。
