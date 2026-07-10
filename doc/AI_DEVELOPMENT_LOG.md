# Bao AI 開発記録

Version: 0.1.2
更新日: 2026-07-10

## 1. この文書の役割

この文書は、Bao AIを将来再評価・再実装するときに、採用した設計だけでなく、判断理由、失敗した試行、測定条件、既知の限界を追跡できるようにするための記録である。

関連文書の役割は次のように分ける。

| 文書 | 役割 |
| --- | --- |
| `AI_ROADMAP.md` | Phase 0-5の強化目標、実装順序、完了条件 |
| `AI_ADVANCED_ROADMAP.md` | Phase 6以降の追加強化計画と知見整理テンプレート |
| `AI_BENCHMARK.md` | 再実行コマンドと正式な基準成績 |
| `AI_DEVELOPMENT_LOG.md` | 設計判断、試行錯誤、前提、限界、変更履歴 |
| `SYSTEM_DESIGN.md` | ゲーム全体の構成と責務 |

正式な比較値は`AI_BENCHMARK.md`を正とする。この文書の途中成績は、探索条件が異なる場合があるため、相互に直接比較しない。

## 1.1 ディレクトリ構成

Cloudflare Pagesへ公開するファイルと、Bao AIの検証・強化用ファイルを分離する。

| ディレクトリ | 役割 |
| --- | --- |
| `public/` | Cloudflare Pagesへ公開する静的ファイル。UI、ルールエンジン、AI、Worker、PWA関連ファイルを置く |
| `tools/` | Node.jsで実行するベンチマーク、重みチューナー、successive halving |
| `test/` | ルール、AI、探索、Worker、チューナーの回帰テスト |
| `artifacts/` | チューナー出力や一時的な候補重みなど、公開物と分けたい成果物 |
| `doc/` | ロードマップ、ベンチマーク、開発記録、設計文書 |

Cloudflare Pagesの公開ディレクトリは`bao-la-kiswahili/public`に設定する。

## 2. 不変の設計原則

- 合法手生成と局面遷移には必ず`engine.js`を使う
- AI自身は盤面を書き換えない
- 強化前の評価を削除せず、比較可能な`legacy`プロファイルとして残す
- 勝率だけでなく、先後別勝率、思考時間、ノード数、到達深度を記録する
- 固定深度試験と時間制限試験を区別する
- 戦術回帰テストを悪化させた候補は、自己対戦成績だけで採用しない
- ルール変更とAI変更を同じ評価系列として扱わない
- Phase 7以降の評価関数変更は、Phase 6で整理したカテゴリ別戦術回帰を通過する

## 3. 現在のAI構成

### 難易度

| 難易度 | 選択方法 |
| --- | --- |
| easy | 合法手からランダム選択 |
| normal | 1手後の評価上位3手からランダム選択 |
| hard | 反復深化、Minimax、Alpha-Beta枝刈り |

hardのブラウザ既定値は最大深度4、時間制限450msである。時間切れ時は最後に完了した反復深化の着手を返す。

### 評価プロファイル

- `bao`: 現在の既定評価
- `bao-v2`: Phase 7の実験評価。既存特徴量を局面カテゴリ別に重み補正する
- `legacy`: Phase 0時点の評価。比較対照として保持

`bao`評価は`legacy`評価を基礎点とし、Bao固有特徴量の差分を加える。完全な置換ではなく補正方式にした理由は、初期の全面置換が旧評価より大幅に弱くなったためである。
`bao-v2`は既定UIには使わず、ベンチマークと戦術診断で明示的に指定する。

### 公開API

| API | 用途 |
| --- | --- |
| `chooseMove` | UIから着手だけを取得 |
| `analyzeMove` | 着手と探索統計を取得 |
| `evaluate` | 現在のBao評価 |
| `evaluateWithProfile` | `bao`／`bao-v2`などの評価プロファイルを指定して評価 |
| `evaluationBreakdown` | 特徴量、適用重み、寄与値、局面カテゴリを診断 |
| `evaluationCategory` | `bao-v2`用の局面カテゴリを取得 |
| `legacyEvaluate` | Phase 0評価 |
| `evaluateFeatures` | プレイヤー間の特徴量差分 |
| `playerMetrics` | 一方のプレイヤーの生特徴量 |
| `EVALUATION_WEIGHTS` | namua／mtaji別の重み |

### 探索プロファイル

- `phase2`: 現在の既定探索
- `legacy`: Phase 1完了時点の反復深化とAlpha-Beta探索

Phase 2探索は、局面キー、Transposition Table、Principal Variation Search、前回反復深化の最善手、killer move、手番に応じた静的着手順、Quiescence Search、終局距離評価を使用する。

## 4. 評価関数

評価値は次の形で求める。

```text
Bao評価 = legacy評価 + Σ((自分の特徴量 - 相手の特徴量) × フェーズ別重み)
```

終局値は位置評価より常に優先し、勝利を`1,000,000`、敗北を`-1,000,000`とする。

### 特徴量の定義

| 特徴量 | 現在の定義 | 主な意図 |
| --- | --- | --- |
| `boardSeeds` | 自陣2列の石数 | 全体の戦力 |
| `frontSeeds` | 前列の石数 | 捕獲と敗北耐性 |
| `frontOccupied` | 石がある前列穴数 | 前列が空になる危険の抑制 |
| `frontConnections` | 隣接して埋まった前列穴の組数 | 前列の連結性 |
| `reusablePits` | 2個以上ある自陣穴数 | 再び動かせる穴 |
| `mobility` | passを除く合法手数 | 特にmtajiの可動性 |
| `captureMoves` | 捕獲合法手数 | 捕獲選択肢 |
| `maxCapture` | 合法な各捕獲を実際に適用したときの最大総捕獲数 | 次手の捕獲力と相手の反撃力 |
| `relayShape` | 捕獲中のrelay／captureイベント最大数と再利用穴の組合せ | 捕獲後のrelay形の近似 |
| `frontSafety` | 前列占有穴数に基づく段階値 | 前列崩壊リスク |
| `houseValue` | nyumba所有と穴の石数 | 利用・維持価値 |
| `reserveEfficiency` | 前列占有穴数をreserve残量で正規化 | namuaの投入効率 |
| `transitionShape` | reserveが4以下のときの前列・連結・再利用穴 | mtaji移行時の形 |
| `tempo` | 手番なら1 | 手番差 |

`maxCapture`は単純な対面穴の石数ではない。`engine.js`で各捕獲を適用し、relay sowingを含む全`capture`イベントを合計する。この精密化はPhase 1の勝率改善に大きく寄与した一方、評価コストを増加させた。

### 現在の重み

| 特徴量 | namua | mtaji |
| --- | ---: | ---: |
| boardSeeds | 1 | 2 |
| frontSeeds | 1 | 2 |
| frontOccupied | 5 | 7 |
| frontConnections | 3 | 4 |
| reusablePits | 3 | 5 |
| mobility | 2 | 3 |
| captureMoves | 3 | 5 |
| maxCapture | 8 | 8 |
| relayShape | 1 | 1 |
| frontSafety | 8 | 12 |
| houseValue | -7 | 0 |
| reserveEfficiency | 1 | 0 |
| transitionShape | 2 | 0 |
| tempo | 2 | 3 |

重みの正本は`ai.js`の`EVALUATION_WEIGHTS`である。この表は説明用の写しなので、変更時は両方を更新する。

## 5. 測定方法

### 再現可能な比較

- 乱数生成器へ明示的なseedを渡す
- `--time-limit 0`で時間切れを無効にする
- `--max-depth`で固定深度を指定する
- 偶数局と次の奇数局で同じランダム序盤局面を共有する
- 2局目ではAIのSouth／Northを交換する

この2局1組をpaired openingと呼ぶ。決定論的なhard同士で初期局面だけを繰り返すと、実質的に先後各1局しか試験できないため導入した。

### 性能比較

ブラウザ相当の性能を見る場合は時間制限を有効にする。ただし、CPU性能、他プロセス、JIT、温度制御により到達深度と勝敗が変化し得る。時間制限試験は同じseedでも勝敗の完全再現を保証しない。

### 記録すべき条件

新しい結果を残すときは最低限、次を記録する。

- 日付と実行環境
- コードのcommit ID
- ルールエンジンの版またはcommit ID
- 対局数とseed
- 両AIのlevelとevaluation profile
- opening plies、最大手数
- 固定深度または時間制限
- 勝敗、先後別勝率、引き分け
- 平均・最大思考時間、ノード数、到達深度、timeout数
- 戦術回帰テストの結果

## 6. 開発履歴

### 2026-07-06: Phase 0 測定基盤

実装:

- `analyzeMove`と探索統計
- seed付き自己対戦
- 先後交代、JSON出力、固定深度実行
- 戦術局面と再現性テスト
- Phase 0の`legacy`基準成績

判断:

- UI互換性のため`chooseMove`の既存シグネチャを維持した
- 時間制限による非決定性を避けるため、正式な比較値には固定深度を使用した
- 後の改善と比較できるよう旧評価を削除しない方針とした

### 2026-07-06: Phase 1 Bao固有評価

実装:

- namua／mtaji別の特徴量と重み
- `bao`／`legacy`プロファイル切替
- paired opening
- 評価項目単体テスト
- 捕獲連鎖を含む実捕獲量の計測

主な試行:

| 試行 | 条件 | 結果 | 判断 |
| --- | --- | ---: | --- |
| Bao特徴量による全面置換 | 標準初期局面、深度3、20局 | 0勝20敗 | 特徴量の絶対値が基礎的な盤面評価を圧倒したため不採用 |
| legacyを基礎点にした補正 | 標準初期局面、深度3、10局 | 0勝10敗 | relayとnyumba等の補正がまだ強すぎた |
| paired opening導入後の補正評価 | 6 opening plies、深度2、100局 | 54勝46敗 | 改善はしたが65%条件に未達 |
| 捕獲量を対面穴から実遷移へ変更 | 同条件、200局 | 123勝77敗（61.5%） | 有効だが完了条件に未達 |
| 実捕獲量の重みを8へ調整 | 同条件、200局 | 135勝65敗（67.5%） | Phase 1候補として採用 |

重要な観察:

- relayやnyumbaを単純に高く評価すると弱くなった
- Baoでは「大きな捕獲」「nyumba維持」が常に良いとは限らない
- 実際のrelay結果を`engine.js`で評価する方が、対面穴だけの近似より有効だった
- 正確な捕獲評価により、旧評価の平均4.11msに対してBao評価は平均20.72msへ増加した

### 2026-07-06: Phase 2 探索改善

実装:

- 盤面、手番、フェーズ、reserve、nyumba所有、勝者を含む局面キー
- 反復深化をまたいで使うTransposition Table
- exact／lower／upper boundの区別
- 前回反復深化とTTの最善手、killer move、捕獲量、静的評価による着手順序
- Principal Variation Search
- 捕獲局面を既定で1手延長するQuiescence Search
- より早い勝利とより遅い敗北を選ぶ終局距離評価
- qnode、cache hit、cache storeの統計
- 比較用`legacy`探索プロファイル

判断:

- 初期のquiescence深度4は代表局面の深度1だけで約500ノードを消費し、戦術選択も悪化したため不採用とした
- quiescence既定深度は1とし、捕獲手の順序付けでは高価な静的評価を省略した
- 捕獲手は即時勝利と実捕獲量で並ぶため、静的評価の省略による順序情報の損失は限定的と判断した
- 終局距離を含むTT値の安全性のため、TT内部キーには局面キーに加えて探索plyを含めた
- 時間切れで中断された呼び出しはstore処理まで戻らないため、不完全値を確定値として保存しない

検証:

- 450ms比較で平均717対353ノード、2.03倍
- 代表中盤で深度7および深度6へ到達
- 未使用seedの200局比較で126勝74敗、63.0%

注意:

- 2.03倍にはQuiescence Searchのqnodeを含む
- 固定深度2の勝率比較でもPhase 2側だけ捕獲延長が入る
- cache hit率は探索形状や局面に強く依存する

### 2026-07-06: Phase 3 Web Worker

実装:

- `ai-worker.js`へ探索を分離
- 盤面、難易度、探索設定をstructured clone可能なメッセージで送信
- 新規対局時にWorkerをterminateして探索を即時中止
- 世代IDと局面キーによる古い結果の破棄
- 結果適用直前の合法手検証
- Worker非対応／起動失敗時の同期フォールバック
- 探索開始から終了までの思考中表示と`aria-busy`
- 端末性能別の探索時間・最大深度
- 長考難易度「ムタアラム」
- Worker関連ファイルのService Worker事前キャッシュ

端末別設定:

| tier | 判定の目安 | むずかしい | ムタアラム |
| --- | --- | --- | --- |
| low | 2コア以下または2GB以下 | 400ms / 深度6 | 1.5秒 / 深度10 |
| standard | 上記以外 | 500ms / 深度8 | 2秒 / 深度12 |
| high | 8コア以上かつ4GB以上 | 600ms / 深度10 | 3秒 / 深度14 |

判断:

- Workerは検索ごとに生成し、完了または中止時にterminateする。TTは1回の探索内で完結しており、Worker常駐による探索資産の損失がないためである
- Workerへcancelメッセージを送っても同期探索中は受信できないため、確実に止められるterminate方式を採用した
- Workerが使えない環境でも対局不能にしないため同期探索を残した。この場合だけUI停止の可能性がある
- 古い結果対策はterminateだけに依存せず、世代ID、開始局面キー、現在局面キーの照合も行う

検証:

- Node.jsの実Workerスレッドで探索中もメイン側5msタイマーが継続
- 1秒探索を20ms後にterminateし、結果が配送されないことを確認
- Worker返却手の合法性と入力局面の不変性を単体テスト
- `ai-worker.js`、`ai-config.js`をオフライン事前キャッシュへ追加

制約:

- この開発環境にはヘッドレスブラウザがなく、実ブラウザでの描画fpsは自動測定していない
- `file://`等でWorker生成が拒否された場合は同期フォールバックになる
- `navigator.deviceMemory`がないブラウザでは4GBとして扱う

### 2026-07-06: Phase 4 自己対戦チューナー

実装:

- 評価重みを`ai-weights.js`へ分離
- 既定値を変更せず、AIごとに候補重みを注入するAPI
- seed付き突然変異による候補自動生成
- hill climbingによる世代更新
- 現行AIと直近3世代を相手にするアーカイブ対戦
- opening plies 4／8／12による途中局面開始
- 学習用seedと検証用seedの分離
- Wilson 95%下限による統計判定
- JSON候補の保存とベンチマークへの再読込
- 任意候補から再開する`--initial-weights`
- namua／mtajiを指定する開始局面生成
- 対象フェーズだけを変異する`--mutate-phases`
- 多数候補を段階的に削減する`successive-tune.js`

試行:

| 試行 | 学習 | holdout | 判断 |
| --- | --- | --- | --- |
| 2世代×4候補、変異幅2 | 全世代50% | 20局50% | 着手を変える候補がなく不採用 |
| 3世代×8候補、変異幅4 | 世代2で75%、世代3で62.5% | 40局20勝20敗 | 候補ごとに異なる局面を使う比較上の欠陥を発見。不採用 |
| 公平化、深度1、3世代×8候補 | 世代1／3で75% | 40局20勝20敗 | holdoutで信号がなく不採用 |
| 公平化、深度2、2世代×6候補 | 世代2で75% | 40局21勝19敗 | 52.5%、Wilson下限37.5%のため不採用 |
| `houseValue: 5`周辺、深度2 | 62.5% | 60局31勝29敗 | 51.7%、Wilson下限39.3%のため不採用 |
| mtaji限定変異、深度2 | 75% | 60局29勝31敗 | holdoutで悪化し不採用 |
| namua限定変異、深度2 | 50% | 60局30勝30敗 | 更新なし |
| successive halving、namua深度1 | 最終20局55% | 60局26勝34敗 | holdoutで反転し不採用 |
| successive halving、mtaji深度1 | 最終20局50% | 60局30勝30敗 | 更新なし |
| successive halving、namua深度2 | 最終20局60% | 60局26勝34敗 | 大変異でもholdoutで反転し不採用 |
| successive halving複数seed評価 | smoke testのみ | 4局2勝2敗 | 初期選抜ノイズ対策の実装確認。正式候補ではない |
| 複数seed版successive halving、namua深度1 | 最終24局58.3% | 500局279勝221敗 | Wilson下限51.4%で採用 |

初期実装では同世代の候補に異なるseedとopeningを割り当てていた。候補の強さと局面差を分離できないため、全候補を同一条件で比較するよう修正した。修正後も有意な候補は得られておらず、既定重みは変更していない。

判断:

- 学習成績が高くてもholdoutで優位が消えた候補は採用しない
- 予備holdoutで信号がない候補に500局の計算資源を使わない
- 500局検証でWilson 95%下限が50%を超えた`namua.houseValue: -7`を採用する
- Wilson 95%下限が50%を超えた場合だけ`statisticallySuperior`と判定する

次の調整では候補あたりの学習局数を増やし、複数の学習seedで平均してからholdoutへ進める。候補探索と正式検証でopening pliesの集合も分離する。

追加試験から、単一または少数の重み変更では着手系列が変わらない平坦な領域が広いことが分かった。今後は候補の並列評価、複数項目をまとめた大きな変異、successive halvingによる候補削減を検討する。固定深度2のnamua試験は特に高コストである。

successive halvingにより24候補の広域探索を現実的な時間で実行できた一方、最初の2局だけで候補を4分の1へ減らす設定は選抜ノイズが大きかった。深度2で最終学習60%の候補もholdout 43.3%へ反転した。次回は初期ラウンドの局数とseed数を増やし、paired game単位の分散を考慮する。

2026-07-07に`successive-tune.js`へ`--round-repeats`を追加した。各ラウンドで同じ候補を複数seed／openingに通し、平均スコアで生存候補を選ぶ。既定は`3,2,1`で、初期ラウンドほど多くのseedを使う。これにより2局だけの偶然で候補が残る問題を緩和する。短いsmoke testではCLI、JSON出力、保存処理が正常に動作し、検証4局は2勝2敗だった。この結果は局数が少ないため重み候補の根拠には使わない。

同条件の正式探索では、namuaの`houseValue`を`1`から`-7`へ下げる候補が残った。未使用seedとopening plies 4／8／12を含む合計500局で279勝221敗、勝率55.8%、Wilson 95%下限51.4%となり、Phase 4の採用条件を満たした。候補重みで戦術回帰テストも通過したため、この重みを既定値へ反映した。Phase 3基準重みは`artifacts/ai-weights-phase3.json`へ保存した。

深度2の予備検証では100局で52勝48敗だった。悪化は確認されなかったが、深度2条件で統計的優位を示すには追加検証が必要である。

## 7. 公開向けに整理した知見

この節は、記事、発表、READMEなどへ転用することを前提とした要約である。公開時は「この実装と測定条件で観測した結果」と「他のゲームにも適用できる可能性がある解釈」を区別する。

### 7.1 Bao固有の局面評価

#### 知見1: 大量捕獲を単純に高く評価するだけでは弱くなる

Baoでは、その手で多く取れることと、最終的に有利になることが一致しない場合がある。捕獲後の配置、relay sowing、相手の反撃、前列の形が次の局面へ影響するためである。

観測:

- 捕獲量やrelay、nyumbaの価値を大きくした初期評価は旧評価に大敗した
- `relayShape`や`houseValue`を単純に増減した自己対戦候補はholdoutで優位を示さなかった
- Bao特徴量による全面置換は標準初期局面・深度3の20局で0勝20敗だった

公開時の注意:

- 「大量捕獲は悪い」と一般化しない
- 現在の特徴量定義と探索深度において、捕獲量単独では不十分だったという結果である

#### 知見2: 捕獲量は対面穴ではなくrelay終了まで実行して測る方が有効だった

最初は対面穴の石数を捕獲価値としていたが、`engine.js`で合法手を実際に適用し、relay sowing中の全`capture`イベントを合計する方式へ変更した。

観測:

- 近似捕獲量を使った200局では123勝77敗、61.5%
- 実遷移捕獲量の重みを調整した200局では135勝65敗、67.5%
- 代償として平均思考時間は旧評価4.11msからBao評価20.72msへ増えた

解釈:

- 1手の内部遷移が長いゲームでは、着手前の局所情報だけでなく、ルールエンジンによる手の完了結果を特徴量に使う価値がある
- 評価精度と評価単価の交換条件があるため、後段のキャッシュや探索順序改善と一緒に設計する必要がある

### 7.2 探索アルゴリズム

#### 知見3: 汎用的な探索改善は有効だが、ゲーム固有の延長探索は浅く制限する必要があった

Transposition Table、PVS、反復深化の最善手、killer move、手番別の着手順を導入した。捕獲が続く局面にはQuiescence Searchを追加した。

観測:

- 450ms比較で平均探索ノード数は353から717へ増え、2.03倍になった
- 代表中盤局面で深度6および7へ到達した
- Phase 1探索との200局で126勝74敗、63.0%だった
- Quiescence深度4は深度1の代表局面だけで約500ノードを消費し、戦術選択も悪化した
- Quiescence既定深度を1にすると性能と戦術回帰の均衡が取れた

公開時の注意:

- 2.03倍にはqnodeを含み、Phase 1と完全に同じ探索木ではない
- 時間制限試験は実行環境によって変動する

#### 知見4: 終局距離を持つTTは探索plyの扱いに注意が必要

より早い勝利と、避けられない敗北を遅らせるため、終局値へ探索plyを反映した。同じ盤面でもrootからの距離が違えば終局値が異なるため、TT内部キーには局面だけでなくplyも含めた。

これは、距離付き勝敗値をTransposition Tableへ保存するときの一般的な正確性上の注意点として公開できる。

### 7.3 自己対戦と実験設計

#### 知見5: 候補ごとに異なる開始局面を使うと、重み差と局面差を混同する

初期チューナーは候補ごとに異なるseedとopeningを使用していた。この条件では候補の学習スコアを公平に比較できない。

対応:

- 同一世代の候補を同じseed、同じpaired openingで比較するよう修正した
- 1つの開始局面を2局で共有し、AIのSouth／Northを交換した
- 学習用seedとholdout seedを分離した

この失敗は、ゲームAIのパラメータ探索ではアルゴリズム以前に実験設計が重要である、という公開価値の高い事例である。

#### 知見6: 小規模自己対戦の高勝率はholdoutで容易に消える

観測:

- 学習75%の候補がholdoutで20勝20敗になった
- 深度2で学習75%だった`houseValue`候補はholdout 21勝19敗、52.5%だった
- その周辺候補も60局で31勝29敗、51.7%だった
- mtaji限定で学習75%だった候補はholdout 29勝31敗へ悪化した

対応:

- Wilson 95%下限が50%を超えた場合だけ統計的優位と判定する
- 予備holdoutで信号がない候補は500局試験へ進めない
- 不採用候補も削除せず記録する

#### 知見7: 重み空間には着手系列が変化しない平坦な領域が広い

単一重みを±4した56候補の粗いスクリーニングでは、54候補が同じ1勝1敗だった。フェーズ限定の深度1・2学習でも全候補50%となる試行があった。

考えられる理由:

- legacy評価が基礎点として強く、補正重みの小変更が順位を変えない
- Minimaxでは葉の数値が変わってもrootの最善手が変わらない場合が多い
- 決定論的AI同士では同じ着手系列が繰り返される

今後の公開可能な検証テーマ:

- 複数項目をまとめた大きな変異
- successive halving
- 候補評価の並列化
- 重み変化に対する着手変更率の直接測定

#### 知見8: Successive halvingは計算量を減らすが、初期選抜が小さすぎると過学習を増幅する

24候補を2局、6局、20局と段階的に削減する方式により、全候補を20局評価するより少ない対局数で広域探索できた。しかし、深度2で最終学習60%だった候補はholdoutで43.3%に反転した。

解釈:

- successive halving自体ではなく、最初の2局という小さすぎる選抜単位が問題だった
- paired openingを使っても、1ペアだけでは開始局面固有の戦術へ適応しやすい
- 計算量削減と候補選抜の信頼性を両立するには、初期ラウンドから複数seedを使う必要がある

### 7.4 ブラウザ実装

#### 知見9: 同期探索中のWorkerはcancelメッセージを処理できない

Worker内でJavaScript探索が同期実行されている間、同じWorkerへ送ったcancelメッセージはイベントループへ戻るまで処理されない。そのため即時中止には`terminate()`を採用した。

さらに、競合状態への防御として次を併用した。

- 探索世代ID
- 探索開始時と現在の局面キー照合
- 着手適用直前の合法手検証

Node.jsの実Worker統合テストでは、探索中もメイン側タイマーが進むことと、terminate後に結果が配送されないことを確認した。

### 7.5 現時点で公開できる結論

| 主張 | 根拠 | 確度・制約 |
| --- | --- | --- |
| relay完了まで実行した捕獲評価は近似より有効だった | Phase 1の200局比較 | 現在のエンジン、特徴量、深度に限定 |
| Phase 2探索はPhase 1探索より強かった | 未使用seedの200局で63.0% | qnodeを含み、探索木は同一でない |
| 小標本の学習勝率は採用根拠にならない | 複数のholdout失敗 | 候補数・局数はまだ小さい |
| 公平な候補比較には同一paired openingが必要 | 初期チューナーの比較欠陥 | Bao以外にも適用可能な実験原則 |
| 即時Worker中止にはterminateが確実 | 実Worker統合テスト | 同期JavaScript探索を前提とする |
| 複数seed版successive halvingで有意な重み候補を発見 | 500局で279勝221敗、Wilson下限51.4% | 深度1・namua開始中心。深度2は100局52勝48敗で追加検証余地あり |

### 7.6 公開記事の構成案

1. Baoとrelay sowingがAI実装を難しくする理由
2. 測定基盤を先に作った理由
3. 旧評価からBao固有評価への改善
4. 効いた特徴量と逆効果だった単純化
5. TT、PVS、Quiescence Searchによる探索改善
6. ブラウザUIを止めないWorker設計
7. 自己対戦チューニングで発見した過学習と比較の欠陥
8. 現時点で未解決の課題

公開時は`AI_BENCHMARK.md`のコマンド、seed、局数、探索深度を併記し、成功値だけでなく不採用試行も示す。

### 7.7 今後の記録ルール

各Phaseまたは重要な実験の終了時に、この節へ次を追記する。

- 一文で説明できる知見
- それを支持する再実行可能な測定結果
- 反例、不採用試行、適用範囲
- 他のゲームAIやブラウザ実装へ一般化できる可能性
- 公開前に追加検証が必要な点

## 8. 現在の検証結果

| Phase | 状態 | 主な検証結果 |
| --- | --- | --- |
| Phase 0 | 完了 | seed付き自己対戦、探索統計、戦術回帰を再実行可能にした |
| Phase 1 | 完了 | 旧評価との200局で135勝65敗、67.5% |
| Phase 2 | 完了 | 探索ノード2.03倍、代表中盤で深度6以上、旧探索との200局で63.0% |
| Phase 3 | 完了 | 実Workerでメインタイマー継続とterminate後の結果破棄を確認 |
| Phase 4 | 完了 | `namua.houseValue: -7`候補が500局で279勝221敗、Wilson下限51.4%。戦術回帰も通過 |
| Phase 5 | 完了 | MCTS単体は16局相当で2勝14敗。hybrid候補制限も短い比較で改善せず、比較研究として不採用 |
| Phase 6 | 完了 | 戦術回帰を7カテゴリへ整理し、Phase 7以降の採用ゲートに組み込んだ |
| Phase 7 | 完了 | `bao-v2` baseは500局で259勝241敗、Wilson下限47.4%。戦術回帰は通過したが採用条件未達のため既定評価へ採用しない |

詳細な条件と再実行コマンドは`AI_BENCHMARK.md`に記載する。

戦術回帰テスト:

- 即時勝利
- 捕獲連鎖
- nyumba利用
- nyumba温存
- namuaからmtajiへの移行
- 大きな即時反撃の回避

## 9. 既知の限界と再検証課題

### 評価上の限界

- `relayShape`はイベント長と再利用穴による近似で、relay後の全戦術を表現しない
- `houseValue`は所有と石数中心で、崩壊確率を明示的に予測しない
- 着地点から次の自手までの捕獲可能性は独立特徴量になっていない
- 仮想的に相手手番へ切り替えて合法手を測るため、実際の手順依存性を完全には表現しない
- 特徴量計算中に捕獲手を適用するため、葉評価が旧評価より高価である

### ベンチマーク上の限界

- Phase 1の重み調整と最終200局は同じseed `20260706`を使っており、独立したholdout検証ではない
- 6手のランダム序盤だけに適応している可能性がある
- 固定深度2の完了判定であり、ブラウザ既定の450ms・最大深度4で同じ勝率を保証しない
- 200局は強さの目安にはなるが、paired gameの相関を考慮した信頼区間は算出していない
- Phase 4採用候補は深度1・namua開始中心の500局で有意だったが、深度2の予備検証は100局52勝48敗で有意ではない
- 現在の記録は未コミット作業時に作成されており、commit IDがまだない

次回の再検証では、調整に使っていない複数seed、異なるopening plies、中盤開始局面、450ms条件を使う。

## 10. 変更時の手順

1. 変更前の全回帰テストを実行する
2. 比較対象を新しいprofileとして残すか、commit IDで固定する
3. 学習用seedで候補を絞る
4. 未使用の検証用seedでpaired benchmarkを実行する
5. 先後別勝率と性能劣化を確認する
6. 戦術回帰テストを実行する
7. `AI_BENCHMARK.md`へ正式結果を追加する
8. この文書へ設計判断、失敗した候補、既知の限界を追記する
9. `AI_ROADMAP.md`の完了状態を更新する

結果が悪化した場合も、再発防止に役立つ試行は削除せず要約を残す。

## 11. 次のPhaseへの申し送り

Phase 5では、採用済みAlpha-Beta AIを基準にMCTSを比較検証する。

申し送り:

- MCTS比較では、Phase 4採用後の`bao`評価・`phase2`探索を基準にする
- 同一思考時間、同一opening、同一seedでAlpha-BetaとMCTSを比較する
- ランダムプレイアウトだけでなく、捕獲優先や評価関数終端を含む方策を比較する
- 深度1で採用した`namua.houseValue: -7`は、深度2以上と実時間条件で継続監視する

Phase 4採用前の比較対象重みは`artifacts/ai-weights-phase3.json`に保存している。

### 11.1 Phase 5準備メモ

2026-07-07に、MCTS比較研究へ入るための最小実験環境を追加した。

実装:

- `analyzeMove`の`searchProfile: "mcts"`で実験用MCTSを呼べるようにした
- UCT風の木探索、捕獲と評価関数を使う短いプレイアウト、評価関数による非終局スコアを追加した
- `benchmark.js`に`--mcts-iterations`、`--mcts-playout-turns`、`--mcts-exploration`を追加した
- ベンチマーク集計にsimulation数、平均プレイアウト手数、最大プレイアウト手数を追加した
- MCTSが合法手を返し、random callbackで再現できることを`ai.test.js`で確認するようにした

判断:

- このMCTSは本採用AIではなく、方策比較の足場として扱う
- 時間無制限で反復数未指定の場合は無限ループを避けるため200 simulationsを既定にした
- Alpha-Betaの`completedDepth`とは意味が異なるため、MCTS比較ではdepthよりsimulation数とプレイアウト長を主に見る
- プレイアウトは完全ランダムにせず、即時勝利、捕獲、評価関数を使う。Phase 5の次段階ではこの方策を複数用意して比較する

最初の比較では、20局程度の短い時間制限試験でsimulation単価を確認し、その後にpaired openingの局数を増やす。

### 11.2 MCTSプレイアウト方策の分離

2026-07-07に、MCTSのプレイアウト方策を`random`、`capture`、`evaluation`から選べるようにした。

実装:

- `--mcts-policy`をベンチマークCLIへ追加した
- `random`は合法手から一様に選ぶ
- `capture`は即時勝利と捕獲量を優先し、評価関数を呼ばない
- `evaluation`は捕獲量に加えて評価関数の非終局スコアを使う
- プレイアウト中にも時間制限を確認し、長いsimulationで制限を大きく超えないようにした

判断:

- `evaluation`は重く、短いスモークでもsimulation単価が高い
- Phase 5初期比較では、まず`capture`を軽量なBao向け方策として測る
- `random`は強さを期待する候補ではなく、MCTS木探索自体の下限比較に使う

### 11.3 MCTS capture方策の軽量化

2026-07-07に、`capture`方策のプレイアウト単価を下げた。

変更:

- 以前の`capture`方策はプレイアウト中の各局面で全候補へ`applyMove`を実行し、捕獲イベントを数えていた
- 軽量化後は、合法手情報と盤面から即時捕獲量を推定し、選んだ1手だけを`applyMove`する
- 相手前列を空にできる捕獲は、安い即時勝利候補として高く評価する
- MCTSの`completedDepth`はAlpha-Beta深度と意味が違うため0のままにし、simulation数を主指標とする

短いスモーク:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 2 --seed 20260716 \
  --opening-plies 4 --first hard --second hard \
  --first-search mcts --second-search phase2 \
  --time-limit 100 --max-depth 4 \
  --mcts-playout-turns 40 --mcts-policy capture
```

結果はMCTSが0勝2敗、平均約5896 simulations/move、平均105.85msだった。軽量化により探索量は増えたが、短い比較ではPhase 2探索へ勝てていない。次の課題は、root選択、報酬設計、またはプレイアウト方策の質を改善することである。

### 11.4 MCTS root選択の比較口

2026-07-07に、MCTSのroot着手選択を`visits`と`value`から選べるようにした。

実装:

- `--mcts-root`をベンチマークCLIへ追加した
- `visits`は従来通り、訪問数最多のroot手を選ぶ
- `value`は平均報酬最大のroot手を選び、訪問数をタイブレークに使う
- 不正なroot選択はAI APIとベンチマークCLIの両方で拒否する

短い比較:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 2 --seed 20260716 \
  --opening-plies 4 --first hard --second hard \
  --first-search mcts --second-search phase2 \
  --time-limit 100 --max-depth 4 \
  --mcts-playout-turns 40 --mcts-policy capture --mcts-root value
```

`visits`、`value`ともにこの2局ではPhase 2探索へ0勝2敗だった。局数が少ないため強さの結論ではなく、root選択を比較できる実験条件が揃ったことを今回の成果とする。

### 11.5 MCTS報酬設計の比較口

2026-07-07に、MCTSの報酬設計を`evaluation`、`terminal`、`fast-terminal`から選べるようにした。

実装:

- `--mcts-reward`をベンチマークCLIへ追加した
- `evaluation`は従来通り、非終局局面を評価関数で`[-1, 1]`へ正規化する
- `terminal`は勝ちを`1`、負けを`-1`、非終局を`0`として返す
- `fast-terminal`は勝敗にプレイアウト手数を少し反映し、早い勝ちと遅い負けを優遇する
- 時間切れで未完了のプレイアウトはsimulation数へ加えず、backpropもしないようにした

短い比較:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 2 --seed 20260716 \
  --opening-plies 4 --first hard --second hard \
  --first-search mcts --second-search phase2 \
  --time-limit 100 --max-depth 4 \
  --mcts-playout-turns 40 --mcts-policy capture \
  --mcts-root visits --mcts-reward fast-terminal
```

同条件では`evaluation`と`fast-terminal`が1勝1敗、`terminal`が0勝2敗だった。局数が少ないため強さの結論ではなく、報酬設計を比較できる実験条件が揃ったことを今回の成果とする。

### 11.6 MCTSグリッド比較

2026-07-07に、MCTS設定の短いグリッド比較用CLIを追加した。

実装:

- `tools/mcts-grid.js`を追加した
- `policy × root × reward`の組み合わせを同一条件で比較する
- `--repeats`と`--seed-step`で複数seedを集計できる
- 結果をMCTS側のスコア順に並べる
- `--json`で機械処理用の詳細結果を出力できる
- `mcts-grid.test.js`で候補展開、ソート、不正値拒否を確認する

短いスモーク:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --seed 20260717 \
  --repeats 2 --seed-step 10 \
  --opening-plies 4 --time-limit 80 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 40 --policies capture \
  --roots value --rewards evaluation,fast-terminal
```

結果:

| 候補 | 勝敗 |
| --- | ---: |
| `capture/value/evaluation` | 0勝4敗 |
| `capture/value/fast-terminal` | 0勝4敗 |

この結果は短い予備比較なので採用判断には使わない。単発seedで見えた1勝1敗は揺れが大きく、複数seedではまだPhase 2探索へ勝てていない。次の段階では、より有望な方策改善を入れるか、候補を絞って局数を増やす。

### 11.7 MCTS balanced方策

2026-07-07に、`capture`より少しだけ情報を増やした軽量プレイアウト方策`balanced`を追加した。

実装:

- `balanced`は評価関数を呼ばず、盤面から即時捕獲量を推定する
- 捕獲手は`capture`と同様に優先する
- 非捕獲手では前列の手と、端から内側へ向かう手を少し優遇する
- `benchmark.js`と`mcts-grid.js`の許可方策へ`balanced`を追加した

短いグリッド:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 2 \
  --seed 20260717 --seed-step 10 --opening-plies 4 \
  --time-limit 80 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies capture,balanced \
  --roots value --rewards evaluation,fast-terminal
```

結果は全候補が0勝4敗だった。`balanced/value/fast-terminal`は平均simulation数が多く、軽量候補としては動くが、勝率改善は確認できていない。

### 11.8 MCTS root prior

2026-07-07に、MCTSのroot子ノードへ事前評価を入れる`static` priorを追加した。

実装:

- `--mcts-prior`を`none`と`static`から選べるようにした
- `--mcts-prior-weight`で仮想訪問数を指定できるようにした
- `static`はroot直下の合法手を一度展開し、評価関数で正規化した値を仮想訪問として入れる
- `mcts-grid.js`でも`--priors`として候補比較できるようにした

短いグリッド:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 2 \
  --seed 20260718 --seed-step 10 --opening-plies 4 \
  --time-limit 80 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies balanced \
  --roots value --rewards fast-terminal \
  --priors none,static --mcts-prior-weight 1
```

結果は`none`が1勝3敗、`static`が0勝4敗だった。root priorは比較可能になったが、この条件では改善していない。評価関数をrootで呼ぶコストと、仮想訪問による初期バイアスが不利に働いている可能性がある。

### 11.9 MCTS root候補制限

2026-07-07に、MCTSのroot候補を静的評価上位N手へ絞れるようにした。

実装:

- `--mcts-candidate-limit`を追加した
- 0は無制限、1以上ならrootの合法手を評価関数で並べて上位N手だけをMCTS対象にする
- `mcts-grid.js`では`--candidate-limits`で複数候補を比較できる

短いグリッド:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 2 \
  --seed 20260719 --seed-step 10 --opening-plies 4 \
  --time-limit 80 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies balanced \
  --roots value --rewards fast-terminal \
  --priors none --candidate-limits 0,3
```

結果は無制限が0勝4敗、3手制限が1勝3敗だった。まだPhase 2探索には届かないが、root幅を絞る方向は追加検証する価値がある。

### 11.10 MCTS候補制限幅の予備比較

2026-07-07に、root候補制限の幅を`0,2,3,4`で比較した。

条件:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 2 \
  --seed 20260720 --seed-step 10 --opening-plies 4 \
  --time-limit 80 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies capture,balanced \
  --roots value --rewards fast-terminal \
  --priors none --candidate-limits 0,2,3,4
```

上位結果:

| 候補 | 勝敗 |
| --- | ---: |
| `capture/value/fast-terminal/none/4` | 1勝3敗 |
| `balanced/value/fast-terminal/none/0` | 1勝3敗 |
| `balanced/value/fast-terminal/none/3` | 1勝3敗 |

その他の候補は0勝4敗だった。候補制限4と`balanced`の無制限／3手制限は追加検証候補だが、まだPhase 2探索に届く兆候としては弱い。

### 11.11 MCTS候補制限の追加検証

2026-07-07に、候補制限の上位候補を4 repeatsへ増やして再検証した。

条件:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 4 \
  --seed 20260721 --seed-step 10 --opening-plies 4 \
  --time-limit 80 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies capture,balanced \
  --roots value --rewards fast-terminal \
  --priors none --candidate-limits 0,3,4
```

結果:

| 候補 | 勝敗 | スコア |
| --- | ---: | ---: |
| `capture/value/fast-terminal/none/0` | 3勝5敗 | 37.5% |
| `capture/value/fast-terminal/none/4` | 1勝7敗 | 12.5% |
| `balanced/value/fast-terminal/none/3` | 1勝7敗 | 12.5% |
| `capture/value/fast-terminal/none/3` | 0勝8敗 | 0.0% |
| `balanced/value/fast-terminal/none/4` | 0勝8敗 | 0.0% |
| `balanced/value/fast-terminal/none/0` | 0勝8敗 | 0.0% |

2 repeatsで見えた候補制限4と`balanced` 3手制限の手応えは、4 repeatsでは維持されなかった。現時点では候補制限よりも、`capture/value/fast-terminal`を無制限で使う方がまだ相対的に良い。ただしそれでも37.5%であり、Phase 2探索を上回る候補ではない。

### 11.12 MCTS単体候補の追加比較

2026-07-07に、現時点で相対的に最も良かった`capture/value/fast-terminal/none/0`を16局相当で再検証した。

条件:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 4 --repeats 4 \
  --seed 20260722 --seed-step 10 --opening-plies 4 \
  --time-limit 100 --max-depth 4 --max-turns 120 \
  --mcts-playout-turns 40 --policies capture \
  --roots value --rewards fast-terminal \
  --priors none --candidate-limits 0
```

結果:

| 候補 | 勝敗 | スコア |
| --- | ---: | ---: |
| `capture/value/fast-terminal/none/0` | 2勝14敗 | 12.5% |

この条件では、MCTS単体候補はPhase 2探索へ明確に劣る。現時点でMCTS単体を採用する根拠はなく、以降はMCTSをAlpha-Betaの置換としてではなく、hybridまたは比較研究上の不採用判断として扱う。

### 11.13 MCTS hybrid候補制限とPhase 5結論

2026-07-07に、MCTSのroot候補制限で浅いPhase 2探索を使えるようにした。

実装:

- `--mcts-candidate-source`を追加し、`all`、`static`、`phase2`を選べるようにした
- `--mcts-candidate-depth`を追加し、`phase2`候補評価の深さを指定できるようにした
- `mcts-grid.js`では`--candidate-sources`でstatic候補制限とhybrid候補制限を同条件で比較できる

条件:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 2 \
  --seed 20260724 --seed-step 10 --opening-plies 4 \
  --time-limit 100 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies capture \
  --roots value --rewards fast-terminal --priors none \
  --candidate-sources static,phase2 --candidate-limits 2,3 \
  --mcts-candidate-depth 2
```

結果:

| 候補 | 勝敗 | スコア |
| --- | ---: | ---: |
| `capture/value/fast-terminal/none/phase2/3` | 1勝3敗 | 25.0% |
| `capture/value/fast-terminal/none/phase2/2` | 1勝3敗 | 25.0% |
| `capture/value/fast-terminal/none/static/2` | 1勝3敗 | 25.0% |
| `capture/value/fast-terminal/none/static/3` | 0勝4敗 | 0.0% |

浅いPhase 2探索をroot候補選別へ使っても、static候補制限を上回る改善は確認できなかった。候補評価のぶん時間切れも増えやすく、MCTS単体の弱さを補う根拠にはならない。

Phase 5結論:

MCTS単体はPhase 2探索へ明確に劣り、hybrid候補制限も短い確認で改善しなかった。Phase 5は比較研究として完了し、MCTSは最高AIへの採用候補から外す。今後の強化はAlpha-Beta系探索、評価関数、戦術局面の回帰拡充を主軸にする。

### 11.14 Phase 6 戦術局面セット拡充

2026-07-08に、Phase 7以降の評価関数変更を安全に判定するため、戦術回帰セットをカテゴリ別に整理した。

実装:

- `test/tactical.test.js`をカテゴリ、局面、探索深度、合格条件を持つケース配列へ整理
- 戦術カテゴリを7種類に拡充
- mtajiで捕獲がない局面でも、可動性と前列維持を優先する耐久ケースを追加
- `BAO_TACTICAL_DIAG=1`でカテゴリ、選択手、評価値、探索統計をJSON Lines出力する診断モードを追加
- `BAO_AI_WEIGHTS`による候補重み検証と診断出力を併用できるよう維持

現在のカテゴリ:

| カテゴリ | 人間目線の正解理由 |
| --- | --- |
| `forced-win` | 前列を空にできる即時勝利は位置評価より優先する |
| `capture-relay` | Baoでは1回の捕獲量だけでなく、その後のrelay captureが大きい |
| `nyumba-destruction` | nyumba維持の価値より、崩して継続した後の形が上回る局面がある |
| `nyumba-preservation` | 短期捕獲があっても、nyumba所有と前列形を残す方が安定する局面がある |
| `namua-endgame` | reserveが尽きる直前は、mtaji移行後に動ける前列を残す必要がある |
| `two-ply-counter-avoidance` | 大きな捕獲を取っても、次手でより大きい反撃を許すなら避ける |
| `mtaji-endurance` | mtajiでは捕獲だけでなく、可動性と前列の広さが敗北耐性になる |

判断:

- 期待手をすべて厳密一致にせず、一部は「勝利する」「大きな反撃を許さない」「前列形を残す」など、局面意図に近い合格条件にした
- 既存の`analyzeMove`統計を使い、AI本体には診断用APIを増やさない
- Phase 7以降でAIが間違えた場合は、まず診断出力のroot評価と着手後評価を比較し、探索深度で解ける問題か評価関数の特徴量不足かを切り分ける

検証:

```sh
node bao-la-kiswahili/test/tactical.test.js
```

結果: pass

### 11.15 Phase 7 評価関数 v2 初期実装

2026-07-08に、既定の`bao`評価を変更せず、実験用`bao-v2`評価プロファイルを追加した。

実装:

- `ai-weights.js`へ評価プロファイル一覧を追加
- `benchmark.js`で`--first-profile bao-v2`と`--second-profile bao-v2`を指定可能にした
- `evaluationCategory`で局面を`namua-opening`、`namua-midgame`、`namua-endgame`、`mtaji-attack`、`mtaji-endurance`、`mtaji-closing`、`mtaji-balanced`へ分類
- `bao-v2`では新特徴量を増やさず、既存特徴量の重みをカテゴリ別に小さく補正する
- `evaluationBreakdown`でlegacy基礎点、特徴量差分、適用重み、特徴量ごとの寄与、合計評価を取得可能にした
- `BAO_AI_PROFILE=bao-v2`で戦術回帰を実験プロファイルに切り替えられるようにした
- 探索中の`bao-v2`評価では診断用オブジェクトを作らず、特徴量とカテゴリ判定で同じ`playerMetrics`結果を再利用する高速経路を追加した
- `bao-v2`のカテゴリ補正を`ai-weights.js`へデータ化し、`evaluationAdjustments`として注入可能にした
- `phase7-grid.js`を追加し、カテゴリ補正候補を短い同条件ベンチとPhase 6戦術回帰通過数で比較できるようにした
- `phase7-grid.js`を複数opening phase/pliesに対応させ、namua/mtajiをまたいだ短い候補確認とJSON保存を可能にした
- `phase7-grid.js`に`--min-score`、`--max-tactical-failures`、`--promote-top`、`--promote-dir`を追加し、長め検証へ送る候補補正表を個別JSONで保存できるようにした
- `phase7-validate.js`を追加し、promote候補を複数seed/phaseで再検証する中規模検証入口を用意した
- `phase7-decision.js`を追加し、validate/grid結果からWilson下限、局数不足、戦術回帰結果をまとめて判定できるようにした
- `phase7-longrun.js`を追加し、500局級検証をchunk単位で分割・再開できるようにした

判断:

- 既定UIと既存ベンチマークの安定性を優先し、`bao`の重みと評価経路は採用済み基準として維持する
- Phase 7の初手では新特徴量を増やさず、Phase 6で増やした戦術カテゴリへ既存特徴量の効き方を対応づける
- `maxCapture`の過大評価対策は、frontSafetyが悪い局面やmtaji耐久カテゴリで重みを下げる形に留めた
- `mobility`と`frontSafety`は削らず、`mtaji-endurance`で両方を強めることで耐久局面の診断対象にした。今後、自己対戦で過剰重複が見えた場合に片方を抑える
- カテゴリ補正の探索ではコード編集を避け、補正表の差し替えで比較する。これにより、失敗候補をログに残しやすくする
- 長い自己対戦へ進める前に、短いグリッドで`tactical=7/7`と最低スコアを満たした候補だけをpromoteする。promoteは採用ではなく、次段検証への整理である
- validate段階も採用ではなく、500局級検証へ進める候補を絞るための中間ゲートとして扱う

検証:

```sh
BAO_AI_PROFILE=bao-v2 node bao-la-kiswahili/test/tactical.test.js
node bao-la-kiswahili/tools/benchmark.js --games 4 --seed 20260730 \
  --opening-plies 4 --first hard --second hard \
  --first-profile bao-v2 --second-profile bao \
  --time-limit 0 --max-depth 2 --max-turns 80 --json
node bao-la-kiswahili/tools/benchmark.js --games 8 --seed 20260731 \
  --opening-plies 4 --first hard --second hard \
  --first-profile bao-v2 --second-profile bao \
  --time-limit 150 --max-depth 4 --max-turns 80 --json
node bao-la-kiswahili/tools/phase7-grid.js --games 4 --seed 20260732 \
  --repeats 1 --opening-plies 4 --time-limit 120 --max-depth 3 \
  --max-turns 70 --variants base,endurance-light,endurance-heavy,attack-light
node bao-la-kiswahili/tools/phase7-grid.js --games 2 --seed 20260734 \
  --repeats 1 --opening-plies 2,4 --opening-phases namua,mtaji \
  --time-limit 100 --max-depth 3 --max-turns 60 \
  --variants base,endurance-light,namua-transition-heavy,attack-light \
  --min-score 0.5 --promote-top 2 \
  --output bao-la-kiswahili/artifacts/phase7-grid.json \
  --promote-dir bao-la-kiswahili/artifacts/phase7-promoted
node bao-la-kiswahili/tools/phase7-validate.js \
  --input bao-la-kiswahili/artifacts/phase7-grid.json \
  --games 12 --seed 20260740 --repeats 2 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-validation.json
node bao-la-kiswahili/tools/phase7-validate.js \
  --candidate bao-la-kiswahili/artifacts/phase7-promoted/03-endurance-light.json \
  --games 8 --seed 20260770 --repeats 2 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-endurance-light-validation.json
node bao-la-kiswahili/tools/phase7-grid.js --games 2 --seed 20260780 \
  --repeats 1 --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 120 --max-depth 3 --max-turns 70 \
  --variants endurance-light,endurance-namua-safe \
  --min-score 0.5 --promote-top 2 \
  --output bao-la-kiswahili/artifacts/phase7-namua-safe-grid.json \
  --promote-dir bao-la-kiswahili/artifacts/phase7-promoted-namua-safe
node bao-la-kiswahili/tools/phase7-validate.js \
  --candidate bao-la-kiswahili/artifacts/phase7-promoted-namua-safe/01-endurance-namua-safe.json \
  --games 4 --seed 20260790 --repeats 2 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-namua-safe-validation.json
node bao-la-kiswahili/tools/phase7-grid.js --games 4 --seed 20260810 \
  --repeats 2 --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --variants base,endurance-light,endurance-namua-safe \
  --min-score 0.5 --promote-top 2 \
  --output bao-la-kiswahili/artifacts/phase7-candidate-comparison.json \
  --promote-dir bao-la-kiswahili/artifacts/phase7-promoted-candidate-comparison
node bao-la-kiswahili/tools/phase7-validate.js \
  --candidate bao-la-kiswahili/artifacts/phase7-promoted-candidate-comparison/02-base.json \
  --games 6 --seed 20260830 --repeats 2 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-base-validation.json
node bao-la-kiswahili/tools/phase7-decision.js \
  --input bao-la-kiswahili/artifacts/phase7-base-validation.json \
  --candidate base \
  --output bao-la-kiswahili/artifacts/phase7-base-decision.json
```

結果:

| 条件 | 結果 |
| --- | --- |
| Phase 6戦術回帰 | pass |
| 4局固定深度2スモーク | `bao-v2` 2勝2敗、平均209.17ms/手。`bao`は2勝2敗、平均215.27ms/手 |
| 8局150msスモーク | `bao-v2` 4勝4敗、平均135.28ms/手、timeout 154。`bao`は4勝4敗、平均135.04ms/手、timeout 154 |
| Phase 7グリッド4候補 | `base`、`endurance-heavy`、`attack-light`、`endurance-light`がすべて2勝2敗、`tactical=7/7`。平均時間のみ小差 |
| 複数フェーズグリッド4候補 | `base`が3勝1敗、`attack-light`と`namua-transition-heavy`が2勝1敗1分、`endurance-light`が1勝2敗1分。全候補`tactical=7/7` |
| promote smoke | `attack-light`と`endurance-light`を候補JSONとして保存。どちらも1勝1敗2分、`tactical=7/7` |
| validate smoke | grid出力から`attack-light`と`endurance-light`を読み込み、どちらも1勝1敗2分、`tactical=7/7` |
| 軽量validate前チェック | `endurance-light`のみ4勝4敗、`tactical=7/7`、eligible。`namua-transition-heavy`と`endurance-heavy`は3勝5敗でhold |
| endurance-light単体validate | 16勝16敗、`tactical=7/7`、eligible。namua 4手開始は2勝6敗、mtaji 4手開始は6勝2敗 |
| endurance-namua-safe確認 | 軽量グリッドは2勝2敗、`tactical=7/7`。単体validateは7勝9敗、score 43.8%、`tactical=7/7`でhold |
| 候補横並び比較 | `base`と`endurance-namua-safe`が9勝7敗、`endurance-light`が8勝8敗。全候補`tactical=7/7` |
| base単体validate | 12勝12敗、`tactical=7/7`、eligible。namua/mtaji各条件はすべて3勝3敗 |
| base decision | score 50.0%、Wilson 95%下限31.4%、局数不足のため`long-run-candidate`。500局での目安は272勝相当 |
| base longrun chunk 1 | 48勝52敗、score 48.0%、Wilson 95%下限38.5%、`tactical=7/7`、decisionは`hold`。namua 4手開始は21勝29敗、mtaji 8手開始は27勝23敗 |
| base longrun chunk 2まで | 102勝98敗、score 51.0%、Wilson 95%下限44.1%、`tactical=7/7`、decisionは`long-run-candidate`。chunk 2単体ではnamua 4手開始29勝21敗、mtaji 8手開始25勝25敗 |
| base longrun chunk 4まで | 206勝194敗、score 51.5%、Wilson 95%下限46.6%、`tactical=7/7`、decisionは`long-run-candidate`。最後の100局で66勝以上が必要 |
| base longrun 500局 | 259勝241敗、score 51.8%、Wilson 95%下限47.4%、`tactical=7/7`、decisionは`hold`。採用条件未達 |

注意:

- 4局スモークは強さの判定には使わない
- 8局時間制限スモークも強さの判定には使わず、UI相当条件での大きな性能悪化確認に留める
- Phase 7グリッドの4局結果は候補選抜の予備確認であり、採用判断には使わない
- 長い自己対戦へ進める候補は、まず`tactical=7/7`を満たすことを前提にする
- 複数フェーズグリッドは候補を落とすための予備確認であり、少局数の順位だけで採用しない
- promoteされたJSONは次段の中規模検証用であり、UI既定や`bao`評価は変更しない
- validate結果も少局数なら採用根拠にせず、候補整理と失敗候補の除外に使う
- 2026-07-08の軽量validateでは、長い自己対戦へ送るなら暫定で`endurance-light`だけを候補にする。ただし4勝4敗なので改善根拠ではない
- 追加の`endurance-light`単体validateも総合は16勝16敗で、採用根拠にはならない。namua序盤で弱く、mtaji短手数で強い可能性があるため、長い自己対戦へ進める前に局面カテゴリ別の勝敗を必ず分けて読む
- `endurance-namua-safe`はnamua序盤補正を戻す対照実験として残すが、単体validateでholdになったため長い自己対戦候補にはしない
- 候補横並び比較では補正候補が`base`を明確に上回っていない。Phase 7の長い自己対戦を回す場合は、補正採用前提ではなく`bao-v2` base対`bao`を主軸にし、補正候補は追試扱いにする
- `base`単体validateは五分であり、崩れてはいないが改善証拠でもない。長い自己対戦へ進む前に、採用判断の最小基準を「`bao-v2 base`が`bao`へ統計的に負けていないこと」として明確にする
- `phase7-decision.js`の`long-run-candidate`は採用可ではなく、戦術回帰と最低scoreを満たすが局数またはWilson下限が不足している状態を表す
- 500局級検証で採用候補にするには、Wilson 95%下限50%超えを最低ラインにする。引き分けなしなら272勝相当が目安
- 500局級検証は`phase7-longrun.js`で50局 x 5 chunks x 2 opening phasesとして分割し、短時間作業中は1 chunkずつ進める
- longrun 2 chunk目まででは200局で102勝98敗となり、decisionは`long-run-candidate`へ戻った。ただしWilson 95%下限は44.1%で採用ラインには遠く、Phase 7 baseを採用前提にしない判断は維持する
- longrun 4 chunk目まででは400局で206勝194敗、Wilson 95%下限46.6%。500局で272勝相当に届くには最後の100局で66勝以上が必要で、採用ライン到達はかなり厳しい
- longrun 500局は259勝241敗、Wilson 95%下限47.4%で採用条件未達。`bao-v2` baseは既定評価として採用しない
- 40局固定深度2の比較は実行時間が長く中断した。`bao-v2`はカテゴリ判定と診断可能性を追加したぶん、正式比較では局数、深度、時間制限を分けて測る
- `evaluationBreakdown`は診断用であり、探索中の高頻度呼び出しに追加で使うと評価コストが増える

### 11.16 Phase 7 終了判断

2026-07-08に、Phase 7は完了とする。`bao-v2` baseは500局longrunで259勝241敗、score 51.8%、Wilson 95%下限47.4%、`tactical=7/7`だった。戦術回帰は維持したが、採用条件であるWilson 95%下限50%超えに届かなかったため、既定評価には採用しない。

採用しないもの:

- `bao-v2` base
- `endurance-light`
- `endurance-heavy`
- `namua-transition-heavy`
- `attack-light`
- `endurance-namua-safe`

残すもの:

- `bao-v2`評価プロファイル
- `evaluationBreakdown`と局面カテゴリ診断
- `phase7-grid.js`
- `phase7-validate.js`
- `phase7-decision.js`
- `phase7-longrun.js`
- Phase 7の各artifact

知見:

- 既存特徴量のカテゴリ別重み補正だけでは、500局で統計的優位を作れなかった
- 少局数では候補がeligibleに見えても、longrunではWilson下限が採用ラインに届かない
- namua/mtajiの局面別成績はchunkごとに揺れるため、合計scoreだけで採用しない
- `bao-v2`は強化候補ではなく、今後の診断・実験基盤として扱う

次への引き継ぎ:

- Phase 8へ進む場合は、評価関数より探索予算、timeout、局面別時間配分を優先する
- Phase 9へ進む場合は、既定`bao`を基準にし、Phase 7で採用しなかった補正を初期値へ混ぜない
- 新しい評価候補を作る場合は、新特徴量または探索で解けない失敗局面を先に特定してから試す

### 2026-07-08: Phase 8 適応的探索予算 着手

目的:

固定の`maxDepth`と`timeLimitMs`だけでなく、局面の難しさに応じてhard/expertの予算を上下させる足場を作る。

変更内容:

- `AIConfig.searchOptions(level, capabilities, state)`が現在局面を受け取れるようにした
- 後方互換用に`baseSearchOptions`と`adaptiveSearchOptions`を分けた
- 局面メトリクスとして合法手数、捕獲手数、最大捕獲量、前列占有、phase、reserve残量、盤上石数を計算する
- 適応予算では固定`timeLimitMs`へ複雑度倍率を掛け、難局では`maxDepth`を最大+1、単純局面では-1する
- Phase 2探索で、root最善手が一定深度で安定した場合に早期終了できるようにした
- 探索統計に`allocatedTimeMs`、`baseTimeLimitMs`、`adaptiveComplexity`、`earlyStopped`、`stableIterations`、`rootBestChanges`を追加した
- UIはWorkerリクエスト形式を変えず、`options`に適応済み予算を入れるだけにした
- `benchmark.js`に`--first-adaptive`、`--second-adaptive`を追加し、片側だけ適応予算で比較できるようにした
- `phase8-compare.js`を追加し、level、opening plies、opening phaseをまたいで固定予算と適応予算を比較できるようにした
- hardの適応予算は固定予算を超えない実験設定にし、expertは3000msを絶対上限にした
- hard/expertとも最終的に既定UIでは固定予算を維持する設定にした

判断:

- Workerのmessage schemaは変えない。古い呼び出しやfallbackの安全性を優先し、適応判断は`options`生成時に完結させる
- 評価関数には触らない。Phase 7の採用見送りを受け、Phase 8は既定`bao`の探索予算だけを対象にする
- 早期終了は既定探索側の汎用機能にしたが、発火条件は`options`で明示された場合だけ使う
- 複雑度倍率だけだとhard 600msやexpert 3000msのUI目標を超え得るため、hardは固定予算を上限にし、expertは3000msを絶対上限にする
- hard 500msでは、早期終了を厳しくしても切っても`mtaji/8`反例が残った。最終的にhardの既定適応化は見送り、追試用APIだけ残す
- expert 1500msでは、早期終了ありの中規模入口で平均時間とtimeoutは改善したが、追加seedでmtaji反例が出た。早期終了を切ると勝敗は同等へ戻ったが、時間改善が消えたため既定適応化は見送る

確認:

```sh
for f in bao-la-kiswahili/test/*.test.js; do node "$f" || exit 1; done
node bao-la-kiswahili/test/tactical.test.js
```

結果:

- 全テスト通過
- Phase 6戦術回帰通過

軽量スモーク:

```sh
node bao-la-kiswahili/tools/phase8-compare.js --games 2 --seed 20260880 \
  --levels hard --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 500 --max-depth 8 --max-turns 30 \
  --output bao-la-kiswahili/artifacts/phase8-hard-smoke.json
node bao-la-kiswahili/tools/phase8-compare.js --games 2 --seed 20260900 \
  --levels expert --opening-plies 4 --opening-phases namua,mtaji \
  --time-limit 1500 --max-depth 10 --max-turns 16 \
  --output bao-la-kiswahili/artifacts/phase8-expert-smoke.json
```

| 条件 | 適応予算 | 固定予算 | 判断 |
| --- | --- | --- | --- |
| hard namua 4手 | 0勝0敗2分、平均344.0ms、timeout 14 | 0勝0敗2分、平均504.1ms、timeout 30 | 同等勝敗で時間短縮 |
| hard namua 8手 | 0勝0敗2分、平均317.2ms、timeout 13 | 0勝0敗2分、平均504.2ms、timeout 30 | 同等勝敗で時間短縮 |
| hard mtaji 4手 | 1勝1敗、平均61.2ms、timeout 0 | 1勝1敗、平均296.5ms、timeout 2 | 同等勝敗で時間短縮 |
| hard mtaji 8手 | 1勝1敗、平均204.9ms、timeout 4 | 1勝1敗、平均477.8ms、timeout 24 | 同等勝敗で時間短縮 |
| expert namua 4手 | 1勝1敗、平均119.8ms、timeout 0 | 1勝1敗、平均1502.7ms、timeout 1 | 同等勝敗で時間短縮 |
| expert mtaji 4手 | 1勝1敗、平均144.8ms、timeout 0 | 1勝1敗、平均1154.0ms、timeout 1 | 同等勝敗で時間短縮 |

戦術時間制限確認:

- hard 500msは固定・適応とも5/7。`nyumba-destruction`と`two-ply-counter-avoidance`を落としたため、hardの戦術解決率改善は示していない
- expert 1500msは固定・適応とも7/7
- Phase 8の現時点の根拠は、戦術改善ではなく、軽量自己対戦で同等勝敗を保ちながら平均思考時間とtimeoutを下げた点に限る
- ただし局数が少ないため採用判定ではなく、次の中規模検証へ進める候補扱いとする

中規模入口:

```sh
node bao-la-kiswahili/tools/phase8-compare.js --games 4 --seed 20260920 \
  --levels hard --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 500 --max-depth 8 --max-turns 40 \
  --output bao-la-kiswahili/artifacts/phase8-hard-medium.json
node bao-la-kiswahili/tools/phase8-compare.js --games 4 --seed 20260940 \
  --levels expert --opening-plies 4 --opening-phases namua,mtaji \
  --time-limit 1500 --max-depth 10 --max-turns 24 \
  --output bao-la-kiswahili/artifacts/phase8-expert-medium.json
```

| 条件 | 適応予算 | 固定予算 | 判断 |
| --- | --- | --- | --- |
| hard 500ms | 3勝4敗9分、平均462.6ms、最大528.1ms、timeout 219 | 4勝3敗9分、平均467.3ms、最大535.2ms、timeout 220 | 時間差が小さく、勝敗が小さく悪化したため既定UIには採用しない |
| expert 1500ms | 2勝2敗4分、平均809.6ms、最大1892.7ms、timeout 29 | 2勝2敗4分、平均1437.1ms、最大1516.1ms、timeout 68 | 追加確認へ進める候補 |

追加確認:

```sh
node bao-la-kiswahili/tools/phase8-compare.js --games 4 --seed 20260960 \
  --repeats 2 --levels expert --opening-plies 4 \
  --opening-phases namua,mtaji --time-limit 1500 --max-depth 10 \
  --max-turns 24 \
  --output bao-la-kiswahili/artifacts/phase8-expert-final.json
```

| 条件 | 適応予算 | 固定予算 | 判断 |
| --- | --- | --- | --- |
| expert 1500ms最終 | 4勝4敗8分、平均1536.2ms、最大2038.8ms、timeout 127 | 4勝4敗8分、平均1442.7ms、最大1531.7ms、timeout 127 | 勝敗・timeout同等だが時間悪化。既定UIには採用しない |

最終判断:

- hard適応予算は時間短縮が小さく、着手品質悪化の疑いを打ち消せない。hardでは固定500〜600msの予測しやすさを優先する
- expert適応予算は早期終了ありなら時間短縮するが、着手品質の反例がある。早期終了なしなら時間が悪化する
- 既定UIでは`searchOptions`がhard/expertとも固定予算を返す。再実験は`adaptiveSearchOptions`または`benchmark.js --first-adaptive`で明示的に行う

### 2026-07-08: Phase 8 終了判断

Phase 8は採用見送りで完了とする。

採用しないもの:

- hardの既定適応予算
- expertの既定適応予算
- 早期終了を使った既定探索短縮

残すもの:

- `AIConfig.adaptiveSearchOptions`
- `AIConfig.positionMetrics`
- `AIConfig.complexityScore`
- `analyzeMove`の適応予算・早期終了関連統計
- `benchmark.js --first-adaptive` / `--second-adaptive`
- `phase8-compare.js`
- Phase 8の各artifact

知見:

- 合法手数、捕獲手数、最大捕獲量、前列占有、phase/reserveだけの線形な複雑度では、読むべき局面を安定して判別できなかった
- 早期終了は平均時間を大きく下げる一方、mtajiで必要な深度を削り、勝敗を悪化させる反例があった
- hardでは固定予算内の小さな時間短縮より、着手品質と応答時間の予測しやすさを優先する
- expertでは時間を伸ばすだけではtimeout率も勝敗も改善せず、最大思考時間だけが悪化する場合がある

次に測ること:

- Phase 9へ進む場合は、既定`bao`と固定探索予算を基準にする
- 適応探索を再開する場合は、まずPhase 8のmtaji反例を診断局面化する
- `adaptiveComplexity`が実際のtimeout、深度不足、戦術失敗と相関するか確認する

### 2026-07-08: Phase 9 自己対戦チューニング v2 着手

Phase 9用の入口として`tools/phase9-tune.js`を追加した。Phase 4の`successive-tune.js`を直接置き換えるのではなく、既定`bao`重みを基準に候補生成し、次の情報を同じレポートへ保存する。

- 学習seed、検証seed、最終確認seedを分ける
- 現行`default`重みと`artifacts/ai-weights-phase3.json`の複数基準AIに対して比較する
- Phase 6戦術回帰で失敗した候補へスコアペナルティを与える
- 候補ごとにbaseline、opening phase、opening plies別のカテゴリ成績を保存する
- 採用候補を`artifacts/phase9-promoted/`へ保存し、500局級の最終確認用`benchmark.js`コマンドを出力する

軽量スモーク:

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 4 --round-games 2 --round-repeats 1 \
  --validation-games 8 --final-games 500 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --max-depth 1 \
  --output bao-la-kiswahili/artifacts/phase9-tune-smoke.json
```

本格探索入口:

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 24 --round-games 2,6,20 --round-repeats 3,2,1 \
  --validation-games 48 --final-games 500 \
  --opening-plies 4,8,12 --opening-phases namua,mtaji \
  --baselines default,bao-la-kiswahili/artifacts/ai-weights-phase3.json \
  --max-depth 1 \
  --output bao-la-kiswahili/artifacts/phase9-tune.json
```

判断メモ:

- Phase 9ではPhase 7で不採用となった`bao-v2`補正を初期値に混ぜない
- 既定探索予算はPhase 8で採用見送りになったため、固定探索予算を基準にする
- 500局級の最終確認でWilson 95%下限が50%を超え、戦術回帰を悪化させない候補だけを採用候補にする

### 2026-07-08: Phase 9 最終判定入口

`tools/phase9-decision.js`を追加した。`phase9-tune.js`のvalidation結果だけでは採用判断に不足するため、promote候補に対して別途実行した複数の`benchmark.js --json`結果を集計し、500局級の採用判定を行う入口である。

判定対象:

- `phase9-tune.js`の`finalists`
- 候補名で絞り込んだ1候補
- 任意個数の`benchmark.js --json`出力

判定内容:

- final reportを指定しない場合は、短いvalidation結果を使って`long-run-candidate`または`hold`を判定する
- final reportを指定した場合は、複数JSONのfirst competitor成績を合算し、wins/losses/draws、score、Wilson 95%下限、timeout、平均思考時間を集計する
- `minGames`、`minScore`、`minWilson`、戦術回帰失敗数を同時に満たす候補だけを`adopt-candidate`にする

例:

```sh
node bao-la-kiswahili/tools/phase9-decision.js \
  --input bao-la-kiswahili/artifacts/phase9-tune.json \
  --candidate candidate-01 \
  --final-reports bao-la-kiswahili/artifacts/phase9-final-namua.json,bao-la-kiswahili/artifacts/phase9-final-mtaji.json \
  --min-games 500 --min-wilson 0.5 \
  --output bao-la-kiswahili/artifacts/phase9-decision.json
```

### 2026-07-08: Phase 9 longrun分割実行入口

`tools/phase9-longrun.js`を追加した。`phase9-tune.js`が候補と最終確認コマンドを出すだけでは、500局級検証を一気に回す必要があるため、Phase 7と同様にchunk単位で分割・再開できる入口を用意した。

主な動作:

- `phase9-tune.json`から候補、候補重み、基準AI、opening条件を読む
- `baseline x opening phase`のbucketへ分けて、各chunkで固定探索予算の自己対戦を実行する
- chunkごとに`phase9-longrun.json`へ集計を書き出す
- `phase9-decision.js`を呼び、`phase9-decision.json`を毎回更新する

例:

```sh
node bao-la-kiswahili/tools/phase9-longrun.js \
  --input bao-la-kiswahili/artifacts/phase9-tune.json \
  --candidate candidate-01 \
  --games 500 --chunks 5 --run-chunks 1 \
  --output bao-la-kiswahili/artifacts/phase9-longrun.json \
  --decision-output bao-la-kiswahili/artifacts/phase9-decision.json
```

判断メモ:

- `run-chunks 1`で1 chunkだけ進め、結果を見ながら再実行できる
- `games`は`chunks x baseline数 x opening phase数`で割り切れる必要がある
- Phase 9の採用判断は`phase9-longrun.json`単体ではなく、更新された`phase9-decision.json`の`decision`を見る

### 2026-07-09: Phase 9 軽量スモークとlongrun

Phase 9の候補選抜からlongrun入口まで、軽量条件で実測した。

候補選抜:

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 4 --round-games 2 --round-repeats 1 \
  --validation-games 8 --final-games 500 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --max-depth 1 \
  --output bao-la-kiswahili/artifacts/phase9-tune-smoke.json
node bao-la-kiswahili/tools/phase9-decision.js \
  --input bao-la-kiswahili/artifacts/phase9-tune-smoke.json \
  --candidate candidate-01 \
  --min-games 500 --min-wilson 0.5 \
  --output bao-la-kiswahili/artifacts/phase9-smoke-decision.json
```

結果:

| 候補 | validation | Wilson 95%下限 | 戦術回帰 | 変更 | 判定 |
| --- | --- | --- | --- | --- | --- |
| `candidate-01` | 5勝3敗、score 62.5% | 30.6% | 7/7 | `namua.boardSeeds: 1 -> -3`, `mtaji.captureMoves: 5 -> 1`, `mtaji.transitionShape: 0 -> 4` | `long-run-candidate` |
| `candidate-02` | 5勝3敗、score 62.5% | 30.6% | 7/7 | `namua.boardSeeds: 1 -> -3`, `namua.tempo: 2 -> 6` | validation通過、promote対象外 |

`candidate-01`をpromoteし、longrunを実行した。

```sh
node bao-la-kiswahili/tools/phase9-longrun.js \
  --input bao-la-kiswahili/artifacts/phase9-tune-smoke.json \
  --candidate candidate-01 \
  --games 500 --chunks 5 --run-chunks 4 \
  --output bao-la-kiswahili/artifacts/phase9-longrun-smoke.json \
  --decision-output bao-la-kiswahili/artifacts/phase9-longrun-smoke-decision.json
```

longrun 500局結果:

| 条件 | 結果 |
| --- | --- |
| 合計 | 264勝236敗、score 52.8%、Wilson 95%下限48.4%、`tactical=7/7`、decisionは`hold` |
| 現行`default` namua 8手 | 62勝63敗 |
| 現行`default` mtaji 4手 | 64勝61敗 |
| Phase 4前重み namua 4手 | 75勝50敗 |
| Phase 4前重み mtaji 8手 | 63勝62敗 |

chunk別結果:

| chunk | 結果 |
| --- | --- |
| 1 | 55勝45敗、score 55.0% |
| 2 | 54勝46敗、score 54.0% |
| 3 | 48勝52敗、score 48.0% |
| 4 | 52勝48敗、score 52.0% |
| 5 | 55勝45敗、score 55.0% |

判断:

- 500局に到達したが、Wilson 95%下限が50%を超えないため採用しない
- 伸びている主因はPhase 4前重みへのnamua 4手比較で、現行`default`への優位は示せていない
- `candidate-01`は戦術回帰を悪化させていないが、既定重みへ反映しない

### 2026-07-09: Phase 9 中規模候補探索

軽量スモークより候補数とラウンドを増やし、中規模の候補探索を実行した。

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 12 --round-games 2,6,12 --round-repeats 2,1,1 \
  --validation-games 24 --final-games 500 \
  --opening-plies 4,8,12 --opening-phases namua,mtaji \
  --baselines default,bao-la-kiswahili/artifacts/ai-weights-phase3.json \
  --max-depth 1 --promote-top 2 \
  --promote-dir bao-la-kiswahili/artifacts/phase9-promoted-medium \
  --output bao-la-kiswahili/artifacts/phase9-tune-medium.json
```

validation結果:

| 候補 | validation | Wilson 95%下限 | 戦術回帰 | 変更 | 判断 |
| --- | --- | --- | --- | --- | --- |
| `candidate-11` | 13勝11敗、score 54.2% | 35.1% | 7/7 | `namua.boardSeeds: 1 -> -3`, `mtaji.relayShape: 1 -> 5` | default mtaji 4手で5勝7敗の偏りがあるため、longrun優先度を下げる |
| `candidate-02` | 13勝11敗、score 54.2% | 35.1% | 7/7 | `namua.boardSeeds: 1 -> -3`, `namua.tempo: 2 -> 6` | default namua/mtajiがどちらも6勝6敗で崩れが少ないためlongrunへ進める |

`candidate-02`を500局longrunへ進めた。

```sh
node bao-la-kiswahili/tools/phase9-longrun.js \
  --input bao-la-kiswahili/artifacts/phase9-tune-medium.json \
  --candidate candidate-02 \
  --games 500 --chunks 5 --run-chunks 5 \
  --output bao-la-kiswahili/artifacts/phase9-longrun-medium-candidate-02.json \
  --decision-output bao-la-kiswahili/artifacts/phase9-longrun-medium-candidate-02-decision.json
```

longrun結果:

| 条件 | 結果 |
| --- | --- |
| 合計 | 264勝236敗、score 52.8%、Wilson 95%下限48.4%、`tactical=7/7`、decisionは`hold` |
| 現行`default` namua 12手 | 62勝63敗 |
| 現行`default` mtaji 8手 | 63勝62敗 |
| Phase 4前重み namua 4手 | 75勝50敗 |
| Phase 4前重み mtaji 12手 | 64勝61敗 |

chunk別結果:

| chunk | 結果 |
| --- | --- |
| 1 | 57勝43敗、score 57.0% |
| 2 | 53勝47敗、score 53.0% |
| 3 | 52勝48敗、score 52.0% |
| 4 | 47勝53敗、score 47.0% |
| 5 | 55勝45敗、score 55.0% |

判断:

- `candidate-02`も500局でWilson 95%下限が50%を超えず、採用しない
- 軽量スモークの`candidate-01`と同じく、合計score 52.8%に留まった
- 現行`default`相手はほぼ五分で、Phase 4前重みへのnamua比較だけが強く見える
- `namua.boardSeeds: -3`は複数候補で残ったが、現行`bao`を統計的に上回る根拠にはなっていない

`candidate-11`も500局longrunへ進めた。

```sh
node bao-la-kiswahili/tools/phase9-longrun.js \
  --input bao-la-kiswahili/artifacts/phase9-tune-medium.json \
  --candidate candidate-11 \
  --games 500 --chunks 5 --run-chunks 5 \
  --output bao-la-kiswahili/artifacts/phase9-longrun-medium-candidate-11.json \
  --decision-output bao-la-kiswahili/artifacts/phase9-longrun-medium-candidate-11-decision.json
```

longrun結果:

| 条件 | 結果 |
| --- | --- |
| 合計 | 269勝231敗、score 53.8%、Wilson 95%下限49.4%、`tactical=7/7`、decisionは`hold` |
| 現行`default` namua 12手 | 63勝62敗 |
| 現行`default` mtaji 8手 | 66勝59敗 |
| Phase 4前重み namua 4手 | 75勝50敗 |
| Phase 4前重み mtaji 12手 | 65勝60敗 |

chunk別結果:

| chunk | 結果 |
| --- | --- |
| 1 | 53勝47敗、score 53.0% |
| 2 | 53勝47敗、score 53.0% |
| 3 | 53勝47敗、score 53.0% |
| 4 | 53勝47敗、score 53.0% |
| 5 | 57勝43敗、score 57.0% |

判断:

- `candidate-11`は269勝で、500局のWilson 95%下限50%超え目安である272勝に3勝足りない
- 現行`default`相手では小差の優位に見えるが、統計的採用根拠には届かない
- `mtaji.relayShape: 5`は大きく崩れてはいないが、既定重みへ反映しない

### 2026-07-09: Phase 9 本格探索と終了判断

ロードマップに記載した本格探索条件で候補探索を実行した。

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 24 --round-games 2,6,20 --round-repeats 3,2,1 \
  --validation-games 48 --final-games 500 \
  --opening-plies 4,8,12 --opening-phases namua,mtaji \
  --baselines default,bao-la-kiswahili/artifacts/ai-weights-phase3.json \
  --max-depth 1 --promote-top 2 \
  --promote-dir bao-la-kiswahili/artifacts/phase9-promoted-full \
  --output bao-la-kiswahili/artifacts/phase9-tune-full.json
```

validation結果:

| 候補 | validation | Wilson 95%下限 | 戦術回帰 | 変更 | 判定 |
| --- | --- | --- | --- | --- | --- |
| `candidate-05` | 23勝25敗、score 47.9% | 34.5% | 7/7 | `mtaji.frontOccupied: 7 -> 3`, `mtaji.mobility: 3 -> -1`, `mtaji.frontSafety: 12 -> 8` | `hold` |
| `candidate-04` | 22勝26敗、score 45.8% | 32.6% | 7/7 | `mtaji.captureMoves: 5 -> 9`, `mtaji.reserveEfficiency: 0 -> 4` | `hold` |
| `candidate-22` | 22勝26敗、score 45.8% | 32.6% | 7/7 | `mtaji.frontOccupied: 7 -> 11`, `mtaji.captureMoves: 5 -> 9`, `mtaji.reserveEfficiency: 0 -> 4` | `hold` |

本格探索ではpromote候補が出なかった。軽量探索と中規模探索では500局級へ進む候補が出たが、いずれも採用条件に届かなかった。

Phase 9の最終判断:

- 採用しないもの:
  - 軽量探索の`candidate-01`: 500局で264勝236敗、Wilson 95%下限48.4%
  - 中規模探索の`candidate-02`: 500局で264勝236敗、Wilson 95%下限48.4%
  - 中規模探索の`candidate-11`: 500局で269勝231敗、Wilson 95%下限49.4%
  - 本格探索finalists: validation段階で50%未満のためlongrunへ進めない
- 残すもの:
  - `phase9-tune.js`
  - `phase9-decision.js`
  - `phase9-longrun.js`
  - Phase 9の各artifact
- 既定重み:
  - `public/ai-weights.js`は変更しない

知見:

- `namua.boardSeeds: -3`は複数候補で残ったが、現行`default`相手には統計的優位を作れなかった
- Phase 4前重みには勝ちやすい候補でも、現行`bao`にはほぼ五分である
- mtaji重みを大きく動かす候補は戦術回帰を維持してもvalidationで伸びにくい
- Phase 9の探索空間では、既存`bao`を上回る採用候補を得られなかった

次に測ること:

- Phase 8へ戻る条件である「Phase 9採用候補」は出なかったため、適応探索の再評価は優先しない
- さらに強化する場合は、既存重みの微調整より、戦術局面の追加、評価特徴量そのものの見直し、または対人ログからの反例収集を優先する

### 2026-07-10: Phase 11 安全柵の準備

目的:

探索順序を変更する前に、Phase 8で着手品質悪化が疑われたmtaji局面を、時間制限に依存しない戦術回帰へ変換する。

実装:

- Phase 8 hard `mtaji/8`のseed `20260923`から開始局面を再生成した
- 固定探索で着手が深度によって切り替わる局面を抽出した
- `mtaji-depth-trap`カテゴリとして`test/tactical.test.js`へ追加した

観測:

- 深度1は前列7番穴から左方向を選ぶ
- 深度2〜5は同じ穴から右方向を選ぶ
- 深度6〜7は左方向へ戻り、選択が安定する
- 現行Phase 2探索の深度6では647 nodes、187 cutoffs、20 cache hitsだった

判断:

- Phase 8 artifactはシナリオ単位の集計で、敗着時点の局面を保存していなかった。そのため当時の時間制限対局を厳密に再現した正解手とは位置付けない
- 同じseed系列から得た「深度不足で着手が変わるmtaji局面」として、Phase 11で探索効率を悪化させない安全柵に使う
- Phase 11の探索候補は、この局面を深度6で解き、既存7カテゴリも維持することを最低条件とする
