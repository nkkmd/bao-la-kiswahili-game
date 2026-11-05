# Node20の限定API照合と停止・資源境界

## 現在の結論

2026-11-05、main `d02892f18f7ba873110f4f20a634fb223382867e`と前回保存資料を確認した。未統合PR・追跡済み差分はなく、無関係な未追跡一時ファイル1件は保持した。[配布Node本体の同一性](../node-binary-20261105/README.md)に続き、固定26ファイルから選んだAPI参照をNode v20.20.2の公式文書へ対応付けた。

選択した27記号のうち、Node APIの25記号には対応する文書見出しがあった。structuredCloneとtoReversedの2記号は[前回の固定資料](../node20-version-20261031/README.md)を参照する。これはAPI不存在の一部を除く確認で、全依存・挙動・出力の互換性を認定しない。

特に、同期Git呼出しのtimeoutと現在processのRSS観測だけでは、子processを含む停止期限・1 GiBの制限は成立しない。Node20共用・Node24除外は未認定のままとし、科学codeや凍結済み実装を変更せず、親監督・専用通信主体の設計条件へ反映する。

## 対象と再現性

[読取器](inventory.py)は既存[SCAN.json](../work-deps-20261031/SCAN.json)の26入力を固定commitから読み、各byte数・SHA-256・Git blobを確認してから、限定正規表現で記号の行・列を保存する。JavaScriptをimport・実行せず、manifest指定の科学データやseedを開かない。[USES.json](USES.json)はその結果、[API_MAP.json](API_MAP.json)は固定公式文書への対応表である。

```bash
python3 doc/research-generation-5/runner-topology-20261017/work-api-20261105/inventory.py > /tmp/g5-work-api.json
diff -u doc/research-generation-5/runner-topology-20261017/work-api-20261105/USES.json /tmp/g5-work-api.json
```

この索引はAST解析・型解析・call graphではない。同一行の複数参照も別件で数え、コメント・文字列・同名変数の一致を含み得る。alias経由、Buffer instanceのmethod、Hashのupdate/digest、pathのmethod、一般標準API、動的読込・native依存・将来入力は網羅しない。structuredCloneのalias代入も参照に含む。参照件数を実行回数・通信回数へ読み替えない。

公式資料はNode tag v20.20.2の固定commit `3626fea570e44896ad99aaf3bf6e59def5adede5`のdoc/api配下を読んだ。API_MAP.jsonは原文全文の複製ではなく、参照pathと見出しの保存である。見出し一致を、使用option・例外・全platformでの同値性へ一般化しない。

## 照合した範囲

| 対象 | 固定文書との対応 | 残る条件 |
| --- | --- | --- |
| cp.execFileSync | child_process.mdに存在。cwd、env、input、encoding、stdio、timeout、maxBufferのoption記載を確認 | child tree停止・Git/helperの全通信許可・CASとreceiptが別途必要 |
| process.resourceUsage、performance.now | process.md、perf_hooks.mdに存在。maxRSSは現在processの最大RSS、単位はkilobyte | 全process・親・runner・cache等のOS制限、swap無効、終了予約の証明ではない |
| fsの10記号 | fs.mdに同期APIの見出しが存在 | write全量、失敗prefix、fsync/renameとdirectory、容量peakの検証が必要 |
| Bufferの5記号、crypto.createHash | buffer.md、crypto.mdに存在 | encode/decode、JSON/hashのbyte一致、native依存、memory peakは未検証 |
| assertの5記号 | assert.mdに存在。対象codeはnode:assert/strictを使う | equal/notEqual/deepEqualはstrict側のaliasとして読む。通常assertの緩い比較の説明を流用しない |
| structuredClone、toReversed | 前回の固定globals文書・V8ソースで存在を確認済み | clone対象、配列の疎密・prototype、独立検算の一致は未検証 |

fsの対象はcloseSync、existsSync、fsyncSync、mkdirSync、openSync、readFileSync、renameSync、rmSync、writeFileSync、writeSyncである。公式[child_process文書](https://github.com/nodejs/node/blob/3626fea570e44896ad99aaf3bf6e59def5adede5/doc/api/child_process.md)、[process文書](https://github.com/nodejs/node/blob/3626fea570e44896ad99aaf3bf6e59def5adede5/doc/api/process.md)、[fs文書](https://github.com/nodejs/node/blob/3626fea570e44896ad99aaf3bf6e59def5adede5/doc/api/fs.md)を主要な根拠とする。

## 具体的な停止条件と保存条件

scientific-registry.cjsとfixture側registry.cjsの10行目は、Gitにtimeout 30000・maxBuffer 16778240を指定するが、killSignalを指定していない。公式仕様では既定SIGTERMを送り、その後も子が終了するまでexecFileSyncは戻らない。子がsignalを処理して終了しなければ待ち続ける。このため30秒を返却期限、あるいは全子孫の強制終了期限として扱わない。同期call中は同じNode内のtimerによる監督へ依存できない。

compact.cjsの12行目とreference.cjsの8行目はprocess.resourceUsage().maxRSSを観測する。これは現在processの値で、Git/helper・runner・親監督を含む全体量ではない。ループでの観測はOSによるhard limitの代わりにもならない。親監督と子孫全体を含むmemory制限・swap無効・終了期限は、独立したOS境界で閉じる必要がある。

journal.cjsの5行目はfs.writeSyncの返却byte数を確認せず、その後fsyncSyncとhash更新へ進む。公式文書は返却値を実書込byte数としている。今回、短い書込が実際に発生したとは認定しないが、全量書込を確認できない場合の停止・prefix封印・最終保存の条件が残る。過去の完全journal検証を否定せず、凍結実装をその場で修正しない。snapshotの一時file・本file・directory fsync、Git object・index・log・tmpも容量外へ移さない。

## 次に設計する境界

次は親監督、runner、通信専用主体、通信を持たないworkの権限を分け、同期callや子孫の停止を親が強制できる経路を具体化する。通信専用主体も同じ時間・memory・保存予算内へ含める。Gitの期待旧ref付きCAS、consume receipt後のreadValue開放、helperや下位transportの無再送を保つ。単に別processへ移すだけでは成立としない。

その後、固定既知fixtureで何を検証すべきかを先に設計する。新規科学seed、旧root/witnessの延長、全合法手閉包の緩和や未知の除去へ進まない。Node24除外や候補の容量和は未証明仮説であり、最終入力集合・全保存peakが閉じるまで予算適合を認定しない。runner改変・build・登録・実行、新規remote結合試験は開始しない。

## 維持する状態と品質

第五世代研究は継続中で、主要課題は探索順位変動と厳密勝敗価値損失の関係である。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・leaseなし・科学実行未認可、wholeLifecycleOsProven=falseを維持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と選定差0件を保持する。

公開ゲーム・AI-GEN4・Worker、科学実装・凍結記録・実行認可を変更しない。ユーザーWSLの過去観察を現在値と仮定せず、今回のChatGPT側静的読取と区別する。WSL設定変更・導入は行わない。

人間向け監査対象は本READMEと研究案内5文書の更新部分。英語だけの見出し・通常説明文、リンク切れ、意図しない既存code block・canonical値変更は0件とする。JSON/Python/path/ID/fieldと公式見出しは機械定義・原資料の例外で、日本語で意味と限界を説明した。[現在用保存監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を適用し、CI・自己レビュー・統合結果はPR記録へ残す。
