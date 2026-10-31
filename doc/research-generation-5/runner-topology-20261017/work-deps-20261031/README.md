# work入口の静的依存とGit仲介の条件

## 結論

2026-10-31、main `e8da76a89e42c534960ba060df154e9538b32bc3`を照合した。未統合PR・追跡済み差分はなく、未追跡一時ファイル12件は変更・追加対象へ含めない。

候補のNode20共用について、4入口からliteral requireを追った有限の索引を保存した。26ファイル・48参照、node組込みmodule 5種類で、今回の走査に外部package・未解決literal・computed requireの構文一致はなかった。**Node20互換性の成立ではない。** Git仲介についてはCASと読取前receiptの条件を具体化したが、仲介方式は未実装・未採用である。

## 対象と再現

[SCAN.json](SCAN.json)のentriesはscientific-source.cjs、independent-scientific-source.cjs、scientific-closure.cjs、host.cjsの4入口で、各pathを完全に記録する。[scan.py](scan.py)は固定コミットの追跡済みファイルをgit showで読み、UTF-8本文のliteral requireを正規表現で走査する。JavaScriptをimport・実行しない。

```bash
python3 doc/research-generation-5/runner-topology-20261017/work-deps-20261031/scan.py > /tmp/g5-work-deps.json
diff -u doc/research-generation-5/runner-topology-20261017/work-deps-20261031/SCAN.json /tmp/g5-work-deps.json
```

ローカルの完全なGit履歴が必要で、通信やcheckoutの自動取得は行わない。出力は入力のGit blob・byte数・SHA-256、参照元行・specifier・解決先、組込みmodule、未解決・computed箇所を含む。固定コミットの検算であり、現在worktree全体の同一性や依存充足を保証しない。

走査はAST解析ではない。コメント・文字列の一致を含み得て、到達しないfixtureも保守的に辿る。alias、module解決設定、eval、動的import、native依存、読み込むデータ、callback経由のAPIとworkerを網羅しない。今回の未一致を「存在しない」と断定せず、最小依存集合・全call graph・科学用最終入力へ昇格させない。

## Node20共用で残る確認

| 確認範囲 | 観察した内容 | 判定 |
| --- | --- | --- |
| 組込みmodule | node:assert/strict、node:child_process、node:crypto、node:fs、node:path | module名の列挙のみ。使用method・option・戻り値の同値性は未確認 |
| globalと標準API | structuredClone、performance.now、toReversed等 | ring-engineの配列変換やfixtureにtoReversedがある。構文が読めることを意味保存へ読み替えない |
| 科学gate | science-gate.cjsは最終7資料とhash・認可を確認 | 調査でgateを呼ばず、科学入口は閉鎖のまま。将来データ依存はこのliteral索引の外 |
| 科学codeの外部状態 | fsによるjournal/snapshot、child_processによるGit、manifest指定入力 | filesystem・process・protocol・memory/timeの動作は未確認 |
| 公開engineと独立実装 | measurementからpublic/engine.js、別遷移と独立solverへ到達 | 原文読取のみ。新規科学source・旧witness延長・局面生成なし |

同梱Node20の正確なpatch版、V8版、全APIの対応、同一byte出力、独立検算、停止/資源特性が必要である。今回参照した一般的なNode20という名前を、同梱binaryの版確認へ置換しない。公式API資料の確認も同梱版の特定後に行う。Node24を正式入力から除外せず、候補JSONのnode20WorkCompatibilityProven=falseを維持する。

## 科学registryから確認したCASの順序

根拠は固定コミットのtools/research/g5-befcs-host/scientific-registry.cjsで、SCAN.jsonに原文hashを含む。読取だけで、remoteへの接続や科学lease取得はしていない。

| 箇所 | 保つべき意味 | 仲介で認めない置換 |
| --- | --- | --- |
| head/read | remote refを観測し、そのSHAの内容を取得 | 任意のcached headを現在値へ読み替える |
| commit前 | 期待旧headとの一致を確認し、親付きcommitを作る | 事前GETだけで原子的更新が成立したとする |
| push | refと期待旧SHAを指定するforce-with-lease | 期待旧SHAの条件を持たない汎用REST更新へ置換する |
| push後 | up-to-dateを拒否し、remote headが新commitと一致することを照合 | push応答不明を成功扱い、同じpushを再送、別経路で救済する |
| consume | consume markerをcommitし、そのreceipt確定後にreadValueを呼ぶ | brokerへ渡した時点で読取を開放する、receipt欠落後にmarkerを補完する |

readとpushの間には他者更新があり得るため、前確認だけをCASとしない。仲介主体はGit smart HTTPの複数要求と、操作単位のcommit/read/consumeを結合し、最初の失敗後の次送信を閉じる必要がある。Gitをそのまま実行する別主体を置くだけでは、libcurlやhelperを含む下位retryの無効化・全送信許可を証明しない。

Git commandを一度だけ呼ぶこととHTTP要求が一度だけであることは別条件である。認証challenge・接続失敗・ref更新の応答不明を含む台帳と最終receiptを固定するまで、科学用Git codeは改変せず、科学lease・consumeを試さない。

## 次の限定工程と容量

次は既存の固定runner archiveがある場合だけ、同梱Node20の版を静的に特定し、その版のAPI資料と26ファイルの使用箇所を対応付ける。binaryを実行して版を得る方法は使わず、静的資料で特定できなければ未確定で止める。全workや全workflowの依存を26ファイルへ縮小した扱いにしない。

Git仲介は、期待旧ref・操作ID・各HTTP許可・readValue開放を結ぶ具体的な境界設計を先に行う。既定Git/helperを無監査のまま通信主体として採用しない。全client、無再送、OS隔離、最小依存、保存peak、最終receiptが閉じる前はrunner改変・build・登録・実行、新規remote結合試験へ進まない。

[候補台帳](../candidate-route-20261031/README.md)の部品和223787421 byteはNode20共用の未証明仮説である。26ファイル索引を最終code集合として差し替えたり、Python/Git/Node24を計数外へ移したりしない。容量不足なら成立不足として停止する。

## 研究境界と品質

第五世代研究は継続中。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを保持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を維持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128の読取・生成、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更せず、WSLへの導入・設定変更も行わない。科学APIの既知fixture接続と最終事前固定も引き続き残る。

説明・見出しは日本語とし、JSON/path/field/hash/commandと走査用Pythonは機械定義の例外で、その役割・限界を本書で説明する。現在checkoutは[現在用監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)で照合し、原manifest・凍結記録は変更しない。CI・レビュー・統合の結果はPR記録を参照する。
