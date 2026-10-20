# 軽量実行経路の契約適合レビュー

## 結論と次の対象

main `5ec5e5935c386d0782d3e5536e94a0254eb66961`から、保存済み配布一覧と同版の固定公式ソースを照合した。**実装・実機試験へ進める方式はまだ成立していない。** 次の静的監査対象を、実GitHub Actions jobを保持しつつ外部のJavaScript Actionsを使わない、shellのrun stepを中心とする経路へ絞る。これは方式の採用や科学実行許可ではない。

標準runner全体の通常展開が256 MiBを超える[前段の結論](../capacity-20261020/README.md)を保持する。一方、通常fileのうちbinは84243487 byteであり、全679562451 byteがrunner本体の最小必須量とは確認していない。不要部分の選別可能性と、動作・保存まで成立したことを区別する。

Actionsを使わない独立executorは容量を削減できる可能性があるが、現行の「単一job・attempt 1・CI来歴・専用trigger」との適合が未確認である。ローカルのattempt値を1へ設定して実GitHub jobのreceiptを代用しない。現契約の変更を伴う案として保留し、実装へ自動移行しない。

## 固定ソースから分かったruntimeの分離

公式コミット`397b032cbf865e9c3ddfab89d533ec19325e1273`の3ソースを追加保存し、コネクターが返したGit blobと保存byteを照合した。[取得元とhash](SOURCE_ORIGIN.json)、[MIT LICENSE](upstream/LICENSE)を参照する。新たな配布archive取得・展開・実行はしていない。

| ソース | 確認した意味 | 主張しないこと |
| --- | --- | --- |
| [NodeUtil.cs](upstream/src/Runner.Common/Util/NodeUtil.cs) | GetInternalNodeVersionの既定はnode20。BuiltInNodeVersionsもnode20だけで、内部runtimeの強制指定はその集合で検査される。Actions側は別の選択関数・flagを持つ | node24を指定すれば内部runtimeも必ず同じ実体になる、とはしない |
| [HashFilesFunction.cs](upstream/src/Runner.Worker/Expressions/HashFilesFunction.cs) | 旧・新両式評価実装のhashFilesは内部runtimeのexternals内Nodeを起動する | 全てのjobでhashFilesが必ず呼ばれる、とはしない |
| [NodeScriptActionHandler.cs](upstream/src/Runner.Worker/Handlers/NodeScriptActionHandler.cs) | JavaScript ActionはStepHostが決めたruntimeのexternals内Nodeを起動する | 今回の未登録jobが必ずnode24を選ぶ、またはruntime選択全体を監査済み、とはしない |

したがって、内部のnode20経路とnode24のJavaScript Actionを両方残す構成で、同梱Nodeを1個にできると仮定しない。ソース上の選択と配布物の実行バイナリ対応・runtime互換性は別に検証する。既存jobの版表示を追加ソース・配布バイナリとの同一性証明へ昇格しない。

## 配布一覧からの選別案の容量

すべて前段でhash確認済みの[項目一覧](../capacity-20261020/RUNNER_PACKAGE_INVENTORY.json.gz)の通常file論理量であり、実機の割当量・実行成功・最小依存集合の測定ではない。

| 部品 | 論理byte |
| --- | ---: |
| bin全体 | 84243487 |
| externals/node20/bin/node | 98932688 |
| externals/node24/bin/node | 125989464 |
| 上記3項目の和 | 309165639 |

bin全体とこの2実行fileを保持する選別案は、root script・依存物・科学input・workより前に256 MiBを40730183 byte超える。この選別案は採用しない。binのさらなる選別が不可能と証明したわけではなく、両runtimeの必要性を未確認のjob全般へ一般化しない。

単一runtimeという未検証の仮定では、bin全体と同梱node24実行fileだけで210232951 byteとなる。これに旧code11746870 byte、WSLで共有されたPython論理量8020928 byte、Git論理量4066232 byte、終了容量予約16777216 byteを加えた部品和は250844197 byteで、256 MiBとの差は17591259 byte（約16.78 MiB）である。

この差は利用可能なwork量ではない。root script、shell、共有library、証明書、設定、unit・監督code、追加科学input、filesystem metadata、log・tmp、圧縮一時物、remote保存物、最終receiptが未計数である。Nodeの同梱版を科学用runtimeへ採用したり、旧codeを最終科学inputへ昇格したりしない。旧192 MiB imageの維持や圧縮率も仮定しない。最後の保存量だけで途中peakを代用しない。

## 同じ契約で比較した方式

| 方式 | 単一job・attempt 1の来歴 | 容量 | retry禁止 | 今回の処置 |
| --- | --- | --- | --- | --- |
| 標準配布物全体 | 本物のActions来歴を得る構成候補 | 全体648.08 MiBで超過 | 内部retry経路あり | 通常展開案は除外 |
| bin全体とNode20/24の両実行fileを保持 | 同上 | 3部品だけで超過 | 選別ではretryが消えない | この選別案は除外 |
| 単一runtime・shell中心のActions jobと選別runner | 本物のjobを保つ候補。受理前head等の照合は未実装 | 全入力・保存peakは未確定 | Actions取得経路を使わなくても、runner自身の接続・受信・保存通信が未監査 | 次の静的経路監査だけを優先 |
| 直接起動する独立executor | 実Actions job/attemptの代用は未成立 | 全入力・保存peakは未確定 | 自作取得を一度限りにしても全通信の実証ではない | 契約変更案の比較対象として保留 |
| runner・runtimeを事前配置して計数外へ移す | 外側処理の計数が欠ける | 見かけだけ削減 | 未解決 | 現行条件成立の方法として除外 |

## 優先する静的監査の具体的範囲

次は科学seedを使わず、配布物をさらに取得せず、固定ソース・workflow案・依存目録から下記を確認する。自己hostへの登録や実OS試験はまだ行わない。

1. shell中心のworkflow案では、remote/localのuses、再利用workflow、composite、container/service、hashFiles、post処理、artifact Action等を含めて推移的な経路を列挙する。使わないと宣言するだけで内部Nodeが不要と認定しない。実ジョブのserver flag・runtime選択・暗黙処理を固定できるかを確認する。
2. 初回code取得をrunner起動前の親scope・共通時計内で行う経路を定義する。Actions checkoutやsetup-nodeを外しても、その取得・準備費用を消さない。科学inputの未確定集合・code hash・失敗停止・保存を同じ台帳へ接続する。
3. runnerの登録・session作成・job待機/受信・再接続・自動更新・終了報告の通信を監査する。旧ActionManagerのarchive取得retryが使われないとしても、runner全体の通信retryなしとは宣言しない。初回取得失敗を外側監視で検出するだけで、内部の次要求が防止された証明にしない。
4. その経路の最小実行集合をファイル単位に固定する。binを残せば起動する、単一Nodeで全て動く、Alpine部分だけを消せばよい、という未検証の推測で削除しない。OSとの共有依存物・読取専用領域も契約に従って計数する。
5. 親監督自身・全work・圧縮・転送・最終artifact保全・全子停止までの単一時計とmemory/swap・容量の強制を定義する。単一job終了、受理するhead/attempt、同一科学区画の一度限り消費は別々に照合する。

上記は新しいremote結合試験の起動許可ではない。入口選別・通信失敗停止・容量peak・権限分離・最終保存receiptの未解決欄が閉じた後で、既知データ限定の新しい結合試験契約を作る。成功済みの外部保存取引や旧科学実行は反復しない。

## 残る科学工程と境界

全工程成立後にも、科学reference API・固定初期状態・独立source再生・全合法手完全閉包・途中closure/microstate停止証拠の接続が必要である。最終SPEC・CONTRACT・AUTHORIZATION・全入力hash・保護集合・CI receipt・実行前レビュー・科学専用triggerを固定するまで科学実行を開放しない。

20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiBを維持する。103355件遮断、未知、固定有限開発コーパス、G5-05の先行候補rootだけを集合へ追加する凍結規則と採用35代表・8候補の差0件も保持する。主要課題をDTF・近似探索・実戦勝率へ差し替えない。旧区画やroot/witnessの再実行・延長、source追加、候補差替え、上限増加、救済的retryをしない。

第五世代研究は継続中で、主要準備未成立は仮説否定ではない。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・科学実行未認可、wholeLifecycleOsProvenはfalse。提案seed 50613001..50613128を読取・生成しない。公開ゲーム・AI-GEN4・Workerは変更しない。

## 再現と文書品質

[再計算結果](REVIEW.json)は保存一覧と固定ソースから導いた限定判断である。再計算器は通信、mount、C#のcompile/実行、科学APIやseedの読込を行わない。

```bash
python3 tools/research/g5-runner-topology/review-lightweight.py
python3 tools/research/g5-runner-topology/test-review-lightweight.py
```

3ソースは公式MIT原文の例外として保存し、同コミットのLICENSEと著作権表示を保持した。SOURCE_ORIGIN.jsonは取得元とGit blob・保存byte/hashを結ぶ正規化記録で、HTTP原応答ではない。path・hash・field・ID・exact commandは機械定義の例外とし、結果・意味・未成立理由・次の工程は日本語で説明する。旧原manifest・配布一覧・科学契約は変更しない。CI・レビュー・統合の実際の結果はPR記録で確認する。

ローカルでは新規の判断照合・改変拒否2検査、既存archive3検査・host4検査・runner保存照合3検査が合格した。人間向け変更9文書の新規部分について、英語だけの説明見出し・通常説明文、壊れた相対リンク、既存code block・canonical情報の意図しない変更は0件。新規C#原文・MIT LICENSEは原資料例外として保持した。git diff --checkも合格した。これらをrunnerの実行成功や通信retryの実効的禁止へ昇格しない。
