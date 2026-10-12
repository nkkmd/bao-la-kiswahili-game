# 全閉包BFS統合の結果と限界

## 結論と検証範囲

RCBI-S0-FIXTURE-2026-10-13-v1の判断はCOMPACT-FULL-CLOSURE-FIXTURE-PASS-NOT-SCIENTIFIC-AUTHORIZATIONである。科学用遷移と可逆RAW codecを全合法手BFSへ統合し、固定10 fixtureで独立参照走査・snapshot復号・同期journal再生が一致した。完全5 fixtureは独立二解法の全結果・DTF・最適手・反復成分も一致した。Baoの完全例は既知1 fixtureだけである。

| 固定fixture | 状態/辺 | 終了と解釈 |
| --- | ---: | --- |
| 既知Bao forced-win | 3 / 2 | COMPLETE、自然終局2・勝ち1。既読の全閉包を復元した |
| 既知Bao relay・上限1 | 1 / 1 | ADMIN-CUTOFF、未知・未展開境界を保存。合法手同値判定のprobe観測も保持 |
| 抽象合流 | 4 / 4 | COMPLETE、同じRAWへの二辺のreasonを別々に保持 |
| 抽象境界循環 | 2 / 2 | COMPLETE、解は2 RECURRENTでwinner/DTF null。DRAWを付与しない |
| 抽象手内反復 | 1 / 1 | MOVE-RECURRENT、完全反復列・周期を保存、solution null |
| 抽象管理停止 | 1 / 1 | ADMIN-CUTOFF、state/solution null |
| 抽象256状態 | 256 / 509 | COMPLETE、全合法手・全辺・独立解が一致 |
| 抽象1024状態 | 1024 / 2045 | COMPLETE、全合法手・全辺・独立解が一致 |
| 抽象状態上限2 | 2 / 2 | STATE-LIMIT、受理できない自然子も保存・遮断へ追加 |
| 抽象辺上限1 | 2 / 1 | EDGE-LIMIT、合法手一覧と未処理境界を保持 |

抽象RAWのpitは状態番号の人工符号であり、Baoの合法遷移・到達性・自然終局の証拠ではない。実Baoの手内反復や512超の自然停止を新たに確認した結果でもない。旧G5-05の8候補・27代表・2 guard witnessを延長していない。

## 保存と独立復元

RAWは旧hashで識別し、33 byteの可逆payloadで保持する。初回境界metadataと各辺のreason/turn、合法手表、展開状態、未知witness、未展開境界、観測識別をheaderへ保存し、辺は3個のuint32で保持する。各記録はhash連鎖journalへfsyncし、snapshotはfsync/renameする。独立codecで復号した全記録と、別のjournal再生器で復元した全記録が参照BFSと一致した。

9テストは完全閉包・合流・循環・各停止・不正snapshot・改変/切断journal・共有成分・時間/RSS停止・guard終局混入・合法手欠落・矛盾witnessを検証した。途中journalはINTERRUPTED-JOURNALの部分記録として読めるが、完全解析や科学実行再開には承認しない。プロセス強制終了・容量枯渇・科学run復旧を認証する検証ではない。

| 例 | 主snapshot | 参照JSON | 共通journal | 主+記録 / 参照+同記録 | gzip後の主+記録 / 参照+同記録 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 既知Bao完全例 | 2268 | 3227 | 5294 | 7562 / 8521 | 1562 / 1652 |
| 抽象256状態 | 294366 | 387209 | 697698 | 992064 / 1084907 | 119822 / 130526 |
| 抽象1024状態 | 1183851 | 1558974 | 2804486 | 3988337 / 4363460 | 543730 / 592780 |

単位はbyteである。参照JSONは同じcanonical記録を保存した比較であり、旧科学runnerの保存量とは比較していない。header・辺metadata・停止証拠を含む。journalは同一の監査記録を両方式へ加えた公平な計算上の比較で、参照runnerに別journalを実装した実測ではない。1024状態の無圧縮総量は約8.6%減ったが、journalが総量の約70%を占める。RAWだけの削減率を全体へ外挿しない。上限1のBao未知例ではgzip込み総量が1757対1744 byteとなり、主方式が13 byte大きかった。

## 実行資源と補助計測

全fixtureの保存・復号・独立解・既読読込は6520 ms、最大RSS 441556992 byte（約421 MiB）だった。証拠JSONは8562543 byte、gzipは1079093 byteで上限内に収まった。

初回の別プロセス測定は12行すべてru_maxrssが170184704 byteだった。この値では方式間のRSS差を評価できない。親から生成した時点の水準が残る可能性を留保し、初回[BENCHMARK.json](results/BENCHMARK.json)を保持して[補助契約](MEASUREMENT_SUPPLEMENT.md)を追加した。補助計測の全12行も[PROCESS_MEASUREMENT.json](results/PROCESS_MEASUREMENT.json)へ保存した。

| 抽象fixture・方式 | 走査+serialization時間の中央値 | Linux VmHWMの中央値 |
| --- | ---: | ---: |
| 256・主方式 | 124.936 ms | 54923264 byte |
| 256・参照方式 | 194.255 ms | 55930880 byte |
| 1024・主方式 | 317.786 ms | 61353984 byte |
| 1024・参照方式 | 599.642 ms | 68243456 byte |

各3回、Node v24.19.0・Linux x64・同じ固定入力である。初回時間と補助時間の変動を含め全行を保持する。BFSとserializationを含み、journal fsync・解法・既読集合読込を含まない。主方式と参照方式はcodecだけでなく走査データ構造も異なるため、差をcodec単独の効果とは呼ばない。この小さな抽象例の数値は科学BFSの資源改善、5000状態を超える完全解析、実Bao反復の解消を証明しない。

## 遮断と次の条件

旧102329識別に対し、今回のBao境界/microstate射影15識別はすべて既読だった。抽象RAWは別区分の1026識別として保持し、保守的遮断へ追加した結果、全体は103355識別となった。抽象RAWをBao到達性や科学候補へ昇格しない。共有観測成分は二検算が一致し、2 Bao例は別成分、8抽象例は1成分だった。部分領域の非共有を完全独立性の証明としない。

新規科学source・seed・候補・旧witness延長・正式検定は0件である。全閉包要件を保持し、有限戦略証明を適格性の代用にしない。次は別Studyの供給登録を具体化できるが、未知停止・資源・journalを含む保存上限・検算・区画と一度限りのleaseを先に固定する必要がある。旧失敗rootを延長せず、技術fixtureや開発証拠を正式holdoutへ転用しない。正式関係は未登録・未実行で、主要指標をDTFへ差し替えない。
