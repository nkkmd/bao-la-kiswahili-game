# PBAI-P5 — 事前固定した検証条件

状態: `FROZEN`。新規seedの生成・改善効果の観測前に本契約をcommitする。候補はP4の同一実装であり、前回の結果を知った上で計画した再検証である。正式Program名と開始認可は[開始レビュー](AUTHORIZATION_REVIEW.md)、比較sourceは[baseline](BASELINE.json)を正本とする。

## 唯一の候補と禁止する変更

`PBAI-C011-v1` は共通のapplyMove処理へ記録方式を追加し、探索用経路だけevent.stateを省く。eventのkind・順序・position・count等を全件維持する。最終状態のJSONコピーは残す。moveVariants内のstop/use判定も同じ記録方式で実行する。AIは探索インスタンスへ軽量エンジンの窓口を束縛し、評価内の捕獲計算も同じ窓口を使う。グローバルな一時切替やルールの二重実装はしない。

feature flagは `pbaiC011LightweightTransitions`、既定false。対象はhard/expert、既定のbao評価・phase2探索。easy/normalおよび明示的なlegacy/mcts/bao-v2指定では有効にしない。公開の通常API・UI・Worker・研究向け詳細イベントの既定動作を維持する。

候補数は1、組合せは0。ring事前計算、JSONコピー置換、評価重み、着手順序、TT、延長、枝刈り、終局条件、予算配分、学習、手番間再利用、対称変換は変更しない。失敗後の類似候補追加・閾値緩和・seed追加は禁止する。

## データ分離と局面抽出

乱数は既存benchmarkと同じMulberry32を別の固定実装で使う。source policyは通常baselineによる合法variant一様選択。各seedは最大96手を生成する。採用phaseはseedの偶奇でNamua/Mtajiを交互に割り当て、Namuaはply 12..40、Mtajiは44..88の非終局局面のうち最初に合法variant数2以上となる局面を選ぶ。性能や評価値による選択はしない。

1系列1rootとし、RAW identity（pits,reserve,houseOwned,player,phase,winner,pending）、最初の12手のopening prefix、全source系列のdigestをsplit内外で一意化する。足りない場合は同じ固定blockの次seedへ進む。block終了時に不足すればHOLD、追加しない。標準初期局面を共有すること自体は重複とせず、12手prefixより前の共有も明記する。対局seedはdecision root用と別blockにする。

| 用途 | seed block | 採用数 |
| --- | --- | --- |
| baseline診断予約（今回は未使用） | 821000001..821000008 | 0系列 |
| 正確性の新規系列 | 825000001..825000064 | 全64系列、最大96手 |
| development局面 | 822000001..822004096 | phase別16、計32 |
| validation局面 | 823000001..823004096 | phase別16、計32 |
| 最終holdout局面 | 824000001..824004096 | phase別32、計64 |
| development対局 | 826000001..826004096 | phase別4ペア、計16局 |
| validation対局 | 827000001..827004096 | phase別8ペア、計32局 |
| 最終holdout対局 | 828000001..828008192 | phase別128ペア、計512局 |
| 統計再標本化 | 829000001 | データ生成には使わない |

過去の保護seed・holdoutは使わない。既存の戦術fixtureは既知の回帰用であり新規棋力証拠ではない。開いたseed、棄却理由、選択root、prefix・系列・RAW hashを全件保存する。中断時は完成済み行を読み、同じ対局をやり直さない。部分実行があるペアは無断で再測定せず評価不能として記録する。

## 正確性のgate

通常baselineをgit commitから別moduleとして読み、candidate通常・軽量と比較する。各訪問状態の全合法variant（houseChoiceを含む）、各variantの最終状態全field、通常経路の全詳細event、軽量経路のstate以外の全eventを一致させる。入力非破壊、snapshot非共有、総石数も確認する。

Namua→Mtaji、捕獲連鎖、nyumba stop/use、pass、front-empty、no-move、relay-limitを既知fixture・人工境界fixtureで補完する。人工fixtureは棋力証拠にしない。relay-limitは実際の512上限のfixtureを優先し、得られなければ両sourceの上限だけを1にした境界制御を使い、512境界の未検証を記録して正確性gateをHOLDとする。

独立検算はbaseline詳細eventから盤面を順に再生する別処理を作り、reserve、lift、sow、relay、captureとpending終局の数量整合性を検算する。候補のeventや最終状態から期待値を作らない。ルール真実の新証明ではなく、固定baselineとの意味同等性を判定する。

全不一致0、境界coverage全件、既存関連回帰PASSをC→Dの条件とする。不一致があれば `CORRECTNESS-FAIL / REJECT`、coverage不足は `NON-ESTIMABLE / HOLD`。効果未観測時の純粋な実装不具合は原因とdiffを記録して修正できる。効果を見た後に探索意味の変更で救済しない。

## 固定深度・速度のgate

全採用rootでhard/expert、D2とD3、Infinity（時間切れなし）、同一seed、同じbao重み・既定探索設定を比較する。baseline、候補flag-off、候補flag-onの選択手とelapsedMs以外の全statsが完全一致すること。Infinityは成果物でnullになる場合も、実行はInfinityとして記録する。入力・評価内イベントも比較する。

速度はhard D3を主要条件とし、rootごとに各方式2回warmup、6回測定、baseline/candidateの順をrootと反復の偶奇で交互にする。Node単一プロセス、同時性能測定なし。測定間の強制GCは行わず、GCを含むwall-clockを測る。方式別経過時間、反復前後heapUsed、rss、プロセスmaxRSS、timeoutを保存する。heap差はpeak allocation量と解釈しない。

root別6反復中央値のcandidate/baseline比を集計する。両phaseで中央値比<=0.90、全体のroot別p95遅延比<=1.10、各方式の観測rss最大値比<=1.25、固定深度timeout=0、全stats不一致=0をPASS条件とする。時間が短いrootも結果後に除外しない。中央値比>=1.05またはp95比>1.25は `PERFORMANCE-REJECT`、それ以外の未達は `IMPROVEMENT-UNCONFIRMED / HOLD`。その後のsplitは開かない。

## 同時間での探索・戦術・対局

正確性と当該splitの速度gate成立後のみ実行する。各rootでstandard-hard（500ms/D8）とstandard-expert（2000ms/D12）を各方式1回、順序交互で比較する。時間配分の計算を変更しない。割当時間はbaselineがroot準備後に開始する既存方式のまま、呼出全体のwall-clockも測る。平均完了深度、nodes、timeout、wall-clock p95、割当+max(50ms,10%)超過率を報告する。

運用gateは両levelでcandidate平均深度>=baseline、candidate p95 wall-clock<=baseline*1.10+25ms、candidate超過率<=baseline+0.05、crash/illegal=0。未達は `OPERATIONAL-HOLD`。深度改善は棋力改善と同一視しない。

戦術回帰は既存8ケースを指定深度・Infinityでbaseline/off/onへ実施し全件通過を要求する。既存の高資源選択手は真の最善手と断定しない。

対局比較はhard/bao/phase2、両者同じ100ms、最大深度8、最大160手（opening後）、先後交換の2局1ペア。これは短時間の工学比較であり、標準公開hard 500msでの棋力やスマートフォンの棋力を直接証明しない。baseline診断ではD2にも約1〜115msの幅があり、浅い探索の改善を観察可能な100msと、完了可能な固定512局を選んだ。標準公開予算での探索能力は上記運用比較で別に確認する。

引分は160手到達時のみ勝点0.5、勝者なら1/0。relay-limitは引分へ変更しない。ゲーム内のRAW系列重複、2ペア間の完全同一対局系列を監査する。重複ペアを後から削除せず、共有系列でペアを連結したclusterを推論単位にする。先後ペアの得点平均を主要値とし、phase均等集計する。

development/validationは候補全体勝点率>=0.45、各phase>=0.35、crash/illegal=0を次split条件とする。最終は512局完了、独立cluster>=200、各phaseの一意opening=128、完全棋譜の独立replay PASSを必要とする。未達なら `STRENGTH-NON-ESTIMABLE / HOLD`。

最終棋力PASSは勝点率>=0.53、cluster bootstrap 10000回の両側95%区間下限>0.50、各phase勝点率>=0.45、既知戦術全件PASS、運用gate PASS。Wilson区間は引分除外の勝敗に対する参考値として併記し、独立性の根拠にしない。最終区間上限<0.50またはphase勝点率<0.40なら `STRENGTH-REGRESSION / REJECT`。それ以外は速度だけの改善として閉じる。途中成績で標本数を増減しない。

## 環境・資源・最終判断

Node v24.19.0/Linux x64/AMD EPYC 9V74で実行する。各stage単一CPUプロセス、heap上限2048MiB、全体wall-clock上限4時間、1局最大5分、1探索最大60秒。上限・中断・成果物不整合は評価不能HOLDで止める。計算が時間を超えたことを棋力敗北にしない。baseline診断以外の測定と既存重い研究testを並列に走らせない。

ブラウザ相当のglobal scriptとimportScripts/message Worker経路をVMおよび実worker_threadsで検証する。利用可能なら実Chromiumでも確認する。VM/Node Workerは実ブラウザ端末性能の証拠ではない。未検証端末・実サイト配備を明記する。

最終判断を区別する: 全splitの同等性・速度が成立すれば `EQUIVALENT-COMPUTATION-SPEEDUP`、さらに最終棋力gate成立なら `STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`。棋力が有意でなければ `SPEED-ONLY-IMPROVEMENT`。未達は上記HOLD/REJECTへ対応させる。公開判断は全結果にかかわらず `NO-RELEASE / KEEP-AI-GEN2 / AWAITING-USER-INSTRUCTION`。PRはレビュー可能な候補・証拠であり、正式採用・配備ではない。

## 再検証の独立性と資源管理

PBAI-P4のHOLDを維持し、PBAI-C011-v1を改名・改修しない。新しいcandidate IDは発行しない。P4の結果は設計判断に影響した既知情報であり、P5の最終標本へ混ぜない。KNOWN_DATA_EXCLUSIONS.jsonに旧3archiveの採用RAW、全source監査prefix・系列、保存済み対局中のRAWをまとめ、新しい採用rootを除外する。seedの新規性だけで局面の独立性を主張しない。

今回の4時間は、監視器がRUN_STARTED.jsonを作成した時点から、正確性、全splitの測定、独立検算、最終判断の保存までを含む連続wall-clockである。チャット・通信待ちも除外しない。準備文書、commit、公開操作の待機はこの開始前に済ませる。開始後は人間・モデルによるstage間の手順確認を挟まず、同じ監視器がgateを読んで次段階を開始する。各子プロセスはheap上限2048MiB、単一測定のままとする。

外側のPython監視器は子のイベントループに依存せず、wall-clockとmonotonic clockの早い方で期限を監視する。期限到達・SIGINT・SIGTERMでは子process groupを停止し、HOLDを保存する。正常exitでも次段階gate不成立なら進めない。開始markerが既にあれば再開始を拒否し、既存の完了JSONも上書きしない。準備時に人工的な無応答子プロセスで期限停止と再開始拒否を試験する。

チャットが途切れても監視器が生存していればその1回の処理を監視する。環境停止で開始markerだけが残った場合はINCOMPLETEとして扱い、期限を作り直さず、未完了ペアをやり直さない。プロセス死亡後の同一run復帰は認可しない。アーカイブと判定文書の整備は測定停止後に行えるが、時間内に未成立だった科学的gateを後からPASSへ変更しない。

P4の既知観測では測定自体は4時間より短く、stage間の長い待機が問題だった。連続実行で待機を除く設計としたが、新しいseedで4時間以内に完了する保証はない。上限を超えれば再びHOLDで閉じ、延長しない。正式な実サイト性能・標準500msでの棋力検証へ範囲を広げない。
