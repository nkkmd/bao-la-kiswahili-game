# Bao AI 次期強化ロードマップ

Version: 0.2.0
Status: Active
作成日: 2026-07-07
更新日: 2026-07-10

この文書は、`AI_ROADMAP.md`のPhase 0-5完了後に進める追加強化計画である。既存ロードマップは測定基盤、Bao固有評価、探索改善、Worker化、自己対戦チューニング、MCTS比較研究を完了済みの履歴として残し、この文書では次の一段を扱う。

正式な測定条件と基準成績は`AI_BENCHMARK.md`、設計判断と失敗した試行は`AI_DEVELOPMENT_LOG.md`へ記録する。この文書は「何を、どの順序で、どの完了条件で進めるか」を管理する。

## 1. 目的

Bao AIをさらに強化する。ただし、Phase 5でMCTSを不採用としたため、主軸は新しい探索方式の追加ではなく、既存のAlpha-Beta系探索と評価関数をより正確にすることに置く。

次期強化で守る条件:

- Cloudflare Pagesで公開する`public/`の品質を維持する
- UIの応答性とWorker構成を悪化させない
- 戦術回帰テストを増やし、自己対戦勝率だけで採用判断しない
- 測定条件、反例、不採用判断を後で知見として抽出できる形で残す

## 1.1 強化アプローチ

このBao AI強化は、軽量なブラウザ実行を前提にした「古典的ゲームAI + Bao固有のドメイン知識 + 自己対戦チューニング」のアプローチである。ニューラルネットや大規模MCTSで局面理解を丸ごと学習するのではなく、人間がBaoで重要な特徴を設計し、Alpha-Beta系探索で先を読み、自己対戦と戦術回帰で採用可否を測定する。

中心になる要素:

| 要素 | 役割 |
| --- | --- |
| ルールエンジン | 合法手生成と局面遷移を一元的に保証する |
| 評価関数 | 捕獲、前列安全性、nyumba、reserve、namua/mtaji移行などを点数化する |
| Alpha-Beta系探索 | 評価関数だけでは見えない数手先の得失を読む |
| 戦術回帰 | 自己対戦勝率だけでは見落とすBaoらしい判断を固定局面で守る |
| 自己対戦チューニング | 手作業の重みを複数seedの対局結果で調整する |
| Worker実行 | 強さを上げてもUIの応答性を維持する |

この方式の利点は、ブラウザで動き、説明しやすく、失敗時に原因を追いやすいことである。一方で、強さは特徴量設計、戦術局面の質、測定条件の妥当性に強く依存する。そのため、今後の知見整理では「どのBao特徴が効いたか」「探索で解けた問題か、評価関数が必要だった問題か」「自己対戦では強いが戦術的に不自然な候補はなかったか」を重点的に記録する。

大まかな処理の流れ:

```text
ルールエンジン
  ↓
合法手生成
  ↓
Bao固有の局面評価
  ↓
Alpha-Beta系探索
  ↓
自己対戦・戦術回帰で検証
  ↓
評価関数と探索を改善
```

## 2. 現在地

Phase 0-9で得た到達点:

| 項目 | 状態 |
| --- | --- |
| 測定基盤 | seed付き自己対戦、paired opening、探索統計、戦術回帰を整備済み |
| 評価関数 | `legacy + Bao特徴量補正`方式でPhase 0評価より強化済み |
| 探索 | Transposition Table、PVS、killer move、Quiescence Searchを導入済み |
| UI | Web Workerで長時間探索とUI応答性を両立済み |
| 重み調整 | successive halvingと複数seed検証で`namua.houseValue: -7`を採用済み |
| MCTS | 単体、root prior、候補制限、hybrid候補制限を比較し、不採用 |
| 戦術回帰 | 7カテゴリへ整理済み。ただし今後の変更を守るには局面数がまだ少ない |
| 評価関数v2 | 局面カテゴリ別補正を500局で検証し、統計的優位がなく採用見送り |
| 適応探索予算 | 早期終了と局面別予算を比較し、mtajiの反例により既定UI採用見送り |
| 重み調整v2 | 500局級候補を複数検証したが、現行`bao`を統計的に上回らず採用見送り |

今後の仮説:

- Baoではプレイアウト型探索や既存重みの再探索より、局面理解と着手順序の改善が効きやすい
- 同じ時間内で探索を深くするには、高価な評価の再利用とAlpha-Betaの枝刈り効率改善が重要である
- 強化の安全性は固定戦術局面の質と数に大きく依存し、現在の7局だけでは反例の網羅性が足りない
- 新特徴量は先に設計せず、探索深度を上げても解けない反例から必要性を判断する

## 3. 基本方針

1. Phase 8で見つかったmtaji反例を固定し、戦術回帰の安全柵を広げる
2. 評価意味を変えない探索順序、キャッシュ、枝刈り効率の改善を優先する
3. 探索改善は1項目ずつ比較し、同一固定深度と同一時間の両方で測る
4. 評価特徴量は、深い探索でも解けない反例が集まった場合だけ追加する
5. 人間の対局ログを使う場合も、採用判断は再現可能なベンチマークへ落とし込む
6. 自己対戦の統計判定では、同じopeningを共有するpaired gameの相関を考慮する

## 4. Phase 6：戦術局面セットの拡充

目安: 2〜4日

実施状況: 完了（2026-07-08）

### 狙い

評価関数と探索をさらに触る前に、「悪化させてはいけないBaoらしい局面」を増やす。Phase 1-4では自己対戦勝率が主指標だったが、次期強化では戦術局面の品質を先に上げる。

### 追加する局面カテゴリ

| カテゴリ | 例 |
| --- | --- |
| 2手後の反撃回避 | 直後の捕獲は大きいが、次手で前列を崩される局面 |
| nyumba破壊判断 | nyumba維持より崩した方が有利な局面 |
| nyumba温存判断 | 短期捕獲より温存が有利な局面 |
| namua終盤 | reserve残量が少なく、mtaji移行形が勝敗に直結する局面 |
| mtaji耐久 | 捕獲より可動性と前列維持が重要な局面 |
| 強制勝ち | 即時勝利ではないが、数手以内の勝ち筋がある局面 |
| 強制負け回避 | すべて悪い中で最も敗北を遅らせる局面 |

### 実装内容

- `tactical.test.js`をカテゴリ別に整理する
- 局面作成ヘルパーを追加し、盤面意図を読みやすくする
- 各局面に「期待手」または「避けるべき手」を明示する
- 戦術局面ごとに評価値、探索深度、選択手を記録できる診断出力を検討する

### 完了条件

- [x] 新規カテゴリを最低6種類追加する
- [x] 追加局面の意図がコメントまたはテスト名で説明されている
- [x] 現行AIが全戦術回帰を通過する
- [x] 後続Phaseの採用判定に使える「戦術回帰セット」として文書化する

### 実装結果

`test/tactical.test.js`をカテゴリ駆動の戦術回帰セットへ整理した。各ケースはカテゴリ、テスト名、探索深度、局面、合格条件を持つ。

現在のカテゴリ:

| カテゴリ | 意図 |
| --- | --- |
| `forced-win` | 即時勝利を逃さない |
| `capture-relay` | relay sowingを含む複数捕獲を読む |
| `nyumba-destruction` | nyumbaを崩した方が得な局面で使用する |
| `nyumba-preservation` | 短期捕獲よりnyumba温存が得な局面で維持する |
| `namua-endgame` | 最後のreserve投入後、mtajiで戦える前列形を残す |
| `two-ply-counter-avoidance` | 大きな即時反撃を許す手を避ける |
| `mtaji-endurance` | mtajiで捕獲より可動性と前列維持を優先する |

診断出力:

```sh
BAO_TACTICAL_DIAG=1 node bao-la-kiswahili/test/tactical.test.js
```

各局面について、カテゴリ、選択手、root評価、着手後評価、探索統計をJSON Linesで出力する。Phase 7以降で重み候補を試す場合は`BAO_AI_WEIGHTS=/path/to/weights.json`と併用する。

### 知見化メモ

記録すること:

- 人間目線の正解理由
- AIが間違えた場合の失敗理由
- 評価関数のどの特徴量が効いたか
- 探索深度を上げると解けるのか、評価関数が必要なのか

## 5. Phase 7：評価関数 v2

目安: 1〜2週間

実施状況: 完了（2026-07-08、採用見送り）

### 狙い

現在の`legacy + Bao特徴量補正`を維持しつつ、局面カテゴリに応じた評価の粗さを減らす。特徴量を闇雲に増やすのではなく、既存特徴量の効き方を整理する。

### 検討する改善

- `namua`を序盤、中盤、終盤に分ける
- `mtaji`を攻撃局面、耐久局面、終盤詰め局面に分ける
- `houseValue`を固定重みではなく、reserve残量や前列状態で変化させる
- `maxCapture`の過大評価を抑えるため、反撃リスクとセットで評価する
- `mobility`と`frontSafety`の重複を確認し、過剰に同じ形を評価していないか検証する
- 特徴量ごとの寄与を診断出力し、採用理由を説明できるようにする

### 実装方針

- [x] 既存の`bao`評価は残し、必要なら`bao-v2`相当の実験プロファイルを用意する
- [x] 重みは`ai-weights.js`で比較可能に管理する
- [x] 自己対戦だけでなく、Phase 6の戦術局面を採用条件に含める
- [x] 変更が大きい場合は、1特徴量または1カテゴリずつ採用する

### 途中実装

2026-07-08時点で、既定の`bao`評価を維持したまま、実験用`bao-v2`評価プロファイルを追加した。`bao-v2`は新特徴量を増やさず、既存特徴量を局面カテゴリ別に重み補正する。

導入済みの局面カテゴリ:

| カテゴリ | 補正意図 |
| --- | --- |
| `namua-opening` | reserve効率と前列占有を少し重視する |
| `namua-midgame` | 既存`bao`重みを維持する |
| `namua-endgame` | mtaji移行形、前列連結、nyumba消費判断を重視する |
| `mtaji-attack` | 捕獲手数、最大捕獲、tempoを重視する |
| `mtaji-endurance` | 可動性、前列占有、frontSafetyを重視し、maxCaptureを少し抑える |
| `mtaji-closing` | 少石数終盤で前列維持と総石数を重視する |
| `mtaji-balanced` | 既存`bao`重みを維持する |

診断APIとして`AI.evaluationBreakdown(state, player, { evaluationProfile: "bao-v2" })`を追加した。特徴量、適用重み、寄与値、合計評価を確認できる。
探索中の評価では診断用オブジェクトを作らず、特徴量とカテゴリ判定で同じ`playerMetrics`結果を再利用する高速経路を使う。

短い確認:

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

結果: 戦術回帰は通過。4局固定深度スモークは`bao-v2` 2勝2敗、8局時間制限スモークは`bao-v2` 4勝4敗。どちらも正式な強さ判定には使わない。`phase7-grid.js`は各候補についてPhase 6戦術回帰の通過数も表示し、複数のopening phase/pliesをまたいで短く比較できる。短い複数フェーズ確認では`base`が3勝1敗、その他候補は小差で、全候補`tactical=7/7`だった。さらに`--min-score`、`--promote-top`、`--promote-dir`で長め検証へ送る補正表をJSON保存できる。`phase7-validate.js`はpromote候補を読み込み、複数seed/phaseで再評価する入口である。`phase7-decision.js`はvalidate/grid結果からWilson下限と局数不足を明示し、長期検証候補と採用候補を分ける。`phase7-longrun.js`は500局級検証をchunk単位で分割・再開する。2026-07-08の軽量validateでは`endurance-light`のみ4勝4敗、`tactical=7/7`でeligible、他2候補は3勝5敗でholdだった。追加で`endurance-light`単体を32局相当へ増やしたところ16勝16敗、`tactical=7/7`でeligibleだったが、namua 4手開始は2勝6敗、mtaji 4手開始は6勝2敗と局面差が出た。namua序盤を既定補正へ戻す`endurance-namua-safe`も試したが、単体validateは7勝9敗、`tactical=7/7`、score 43.8%でholdだった。さらに`base`、`endurance-light`、`endurance-namua-safe`を同一seedで横並び比較したところ、`base`と`endurance-namua-safe`が9勝7敗、`endurance-light`が8勝8敗だった。`bao-v2` baseの500局longrunは259勝241敗、score 51.8%、Wilson 95%下限47.4%、`tactical=7/7`、decisionは`hold`だった。補正候補が`base`を明確に上回っておらず、`base`も採用条件に届かないため、`bao-v2` baseは既定評価として採用しない。40局固定深度2の比較は実行時間が長く中断したため、Phase 7の正式検証では局数、深度、時間制限条件を分けて測る。

長い自己対戦へ進む前の候補条件:

- `phase7-grid.js`で`tactical=7/7`を満たす
- namua/mtajiなど複数opening条件の短時間スモークでtimeout率と平均思考時間が`bao`から大きく悪化しない
- `--promote-dir`で保存した候補補正表をPhase 6戦術診断へ再投入できる
- `phase7-validate.js`でpromote候補を複数seed/phaseへ再投入できる
- `phase7-decision.js`でWilson下限、局数不足、戦術回帰結果をまとめて判定できる
- `phase7-longrun.js`で500局級検証をchunk単位で分割・再開できる
- 500局級検証では`phase7-decision.js`で採用可否を再判定し、Wilson 95%下限50%超えを最低ラインにする
- 4〜8局の結果だけで採用せず、次段でseedと局数を増やす

### 完了時の判定

- 採用条件: Phase 4基準AIとの500局で統計的に優位、または戦術回帰の明確な改善を示す
- 結果: `bao-v2` baseは500局で259勝241敗、Wilson 95%下限47.4%のため統計的優位なし。戦術回帰は`tactical=7/7`を維持したが、明確な改善は示さなかった
- 判定: 採用見送り。既定評価は既存`bao`を維持する
- 記録: 変更した重み、特徴量、候補、採用見送り理由を`AI_DEVELOPMENT_LOG.md`へ記録した

### 終了判断

Phase 7では、局面カテゴリ別評価と診断API、候補比較ツール、longrun判定基盤を追加した。一方で、`bao-v2` baseおよびカテゴリ補正候補は採用条件を満たさなかったため、既定評価は既存`bao`のまま維持する。`bao-v2`は今後の診断・実験プロファイルとして残すが、UI既定や採用済みAIには昇格しない。

### 知見化メモ

記録すること:

- 強くなった局面カテゴリ: longrunではnamua 4手開始がchunkによって21勝29敗から29勝21敗まで揺れ、安定した改善とは言えない
- 弱くなった局面カテゴリ: 初期chunkのnamua 4手開始で21勝29敗となり、`bao-v2` baseの序盤補正は採用根拠にならなかった
- 有効だった特徴量と、期待ほど効かなかった特徴量: 既存特徴量のカテゴリ別重み補正だけでは500局で統計的優位を作れなかった
- Bao固有の直感として再利用できる表現: 自己対戦候補は局面カテゴリ別に分けて読み、scoreだけでなくWilson下限と戦術回帰を同時に見る

## 6. Phase 8：適応的探索予算

目安: 4〜7日

実施状況: 完了（2026-07-08、既定UI採用見送り）

### 狙い

端末別の固定`maxDepth`と`timeLimitMs`に加えて、局面の難しさに応じた時間配分を行う。強制手や合法手が少ない局面では軽く、複雑な捕獲局面やmtaji終盤では厚く読む。

### 検討する指標

- 合法手数
- 捕獲手数
- 最大捕獲量
- 前列崩壊リスク
- phaseとreserve残量
- 前回探索の平均ノード速度
- 反復深化で最善手が安定しているか

### 実装内容

- [x] `AIConfig.searchOptions`に局面情報を渡せる設計を追加する
- [x] Workerへのリクエスト形式を後方互換に保つ
- [x] 探索中に最善手が安定した場合の早期終了を追加する
- [x] expert相当では、難局だけ時間を多く使う設定を試す
- [x] 固定予算と適応予算を比較するPhase 8用ツールを追加する
- [x] 複数seed・中規模局数の入口で採用範囲を判定する

### 途中実装

2026-07-08時点で、固定予算の上に薄い適応層を追加した。既定UIでは`AIConfig.searchOptions(level, navigator, state)`が現在局面を受け取り、従来の`maxDepth`と`timeLimitMs`を局面複雑度で調整する。Workerへ送る`options`オブジェクトは従来形式のままなので、古い呼び出しやfallback経路はそのまま動く。

導入済みの局面指標:

| 指標 | 用途 |
| --- | --- |
| 合法手数 | 少ない局面は軽く、多い局面は厚く読む |
| 捕獲手数 | 捕獲選択肢が多い局面を難局寄りにする |
| 最大捕獲量 | 大きい捕獲がある局面を厚く読む |
| 前列占有 | 前列が薄い局面を崩壊リスクとして扱う |
| phaseとreserve残量 | mtaji終盤、namua終盤を難局寄りにする |

探索統計には`allocatedTimeMs`、`baseTimeLimitMs`、`adaptiveComplexity`、`earlyStopped`、`stableIterations`、`rootBestChanges`を追加した。`tools/benchmark.js`では`--first-adaptive`、`--second-adaptive`で片側だけ適応予算を使えるようにし、平均・最大割当時間、早期終了数、平均複雑度を出力する。

hardの適応予算は固定予算を超えない実験設定にし、expertは3000msを絶対上限にした。局面の複雑度で倍率を掛けるだけだと、high端末のhard 600msが800ms超へ伸びる可能性があり、UI応答性の条件に反するためである。

比較ツール:

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

軽量スモーク結果:

| 条件 | 結果 |
| --- | --- |
| hard 500ms, namua 4/8手 | どちらも2分。適応側は平均344.0ms/317.2ms、固定側は504.1ms/504.2ms。timeoutは適応14/13、固定30/30 |
| hard 500ms, mtaji 4/8手 | どちらも1勝1敗。適応側は平均61.2ms/204.9ms、固定側は296.5ms/477.8ms。timeoutは適応0/4、固定2/24 |
| expert 1500ms, namua 4手 | どちらも1勝1敗。適応側は平均119.8ms、固定側は1502.7ms。timeoutは適応0、固定1 |
| expert 1500ms, mtaji 4手 | どちらも1勝1敗。適応側は平均144.8ms、固定側は1154.0ms。timeoutは適応0、固定1 |

戦術ケースの時間制限確認では、hard 500msは固定・適応とも5/7で、`nyumba-destruction`と`two-ply-counter-avoidance`を落とした。expert 1500msは固定・適応とも7/7だった。したがって、現時点ではhardの戦術改善を採用根拠にせず、同等勝率スモークで平均思考時間とtimeoutを下げた候補として扱う。

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

結果:

| 条件 | 適応予算 | 固定予算 | 判定 |
| --- | --- | --- | --- |
| hard 500ms入口 | 3勝4敗9分、平均462.6ms、timeout 219 | 4勝3敗9分、平均467.3ms、timeout 220 | 時間改善が小さく、勝敗が小さく悪化。既定UIには採用しない |
| expert 1500ms入口 | 2勝2敗4分、平均809.6ms、timeout 29 | 2勝2敗4分、平均1437.1ms、timeout 68 | 勝敗同等で平均時間とtimeoutが改善。追加確認へ進める候補 |

この時点ではexpertのみ既定候補に見えたが、追加確認で早期終了による勝敗悪化が見えた。早期終了を無効化して再測すると勝敗とtimeoutは同等になった一方、平均・最大思考時間は適応側が悪化した。そのため、既定UIの`AIConfig.searchOptions`はhard/expertとも固定予算を維持する。`AIConfig.adaptiveSearchOptions`と`benchmark.js --first-adaptive/--second-adaptive`は追試用に残す。

最終確認:

```sh
node bao-la-kiswahili/tools/phase8-compare.js --games 4 --seed 20260960 \
  --repeats 2 --levels expert --opening-plies 4 \
  --opening-phases namua,mtaji --time-limit 1500 --max-depth 10 \
  --max-turns 24 \
  --output bao-la-kiswahili/artifacts/phase8-expert-final.json
```

| 条件 | 適応予算 | 固定予算 | 判定 |
| --- | --- | --- | --- |
| expert 1500ms最終 | 4勝4敗8分、平均1536.2ms、最大2038.8ms、timeout 127 | 4勝4敗8分、平均1442.7ms、最大1531.7ms、timeout 127 | 勝敗・timeout同等だが時間悪化。既定UIには採用しない |

### 完了時の判定

- `hard`: 採用見送り。固定予算内に収めると時間改善が小さく、勝敗悪化の疑いを消せなかった
- `expert`: 採用見送り。早期終了ありでは時間短縮したが勝敗悪化の反例があり、早期終了なしでは時間が悪化した
- 採用するもの: `phase8-compare.js`、探索統計、`adaptiveSearchOptions`、`benchmark.js`の適応比較オプション
- 既定UI: hard/expertとも固定の`searchOptions`を維持する

確認コマンド:

```sh
for f in bao-la-kiswahili/test/*.test.js; do node "$f" || exit 1; done
node bao-la-kiswahili/test/tactical.test.js
node bao-la-kiswahili/tools/benchmark.js --games 2 --seed 88 \
  --first hard --second hard --first-adaptive \
  --time-limit 20 --max-depth 2 --max-turns 6
```

次に行うこと:

- Phase 9へ進む場合は、既定`bao`と固定探索予算を基準にする
- 適応探索を再開する場合は、時間短縮ではなく着手品質悪化の反例を先に潰す
- `adaptiveComplexity`は今後の診断指標として残すが、現状の単純な倍率には採用根拠がない

### 完了条件

- 既定UIで体感応答性を悪化させない
- 450〜600ms級のhard、1.5〜3秒級のexpertで平均勝率または戦術解決率を改善する
- timeout率、平均思考時間、最大思考時間を記録する

### 知見化メモ

記録すること:

- Baoで「読むべき局面」を判別できた指標
- 時間を増やしても改善しなかった局面
- UI品質と強さのトレードオフ

## 7. Phase 9：自己対戦チューニング v2

目安: 1〜2週間

実施状況: 完了（2026-07-09、採用見送り）

### 狙い

Phase 4のsuccessive halvingを発展させ、より過学習しにくい重み探索にする。勝率だけでなく、戦術回帰と複数カテゴリの局面成績を評価に混ぜる。

### 実装内容

- [x] 学習seed、検証seed、最終確認seedを明確に分ける
- [x] 複数の基準AIと対戦する
- [x] Phase 6の戦術局面で失敗した候補にペナルティを与える
- [x] 候補ごとの局面カテゴリ別成績を保存する
- [x] 採用候補は500局以上の最終検証へ進める

### 途中実装

2026-07-08時点で、Phase 9用の入口として`tools/phase9-tune.js`を追加した。既定`bao`を初期値に候補重みを生成し、successive halvingで候補を絞る。各候補は自己対戦勝率だけでなく、Phase 6戦術回帰の失敗数に応じたペナルティ、複数基準AI、namua/mtajiカテゴリ別成績で評価する。

既定の基準AI:

| 基準 | 意図 |
| --- | --- |
| `default` | 現行の採用済み`bao`重み |
| `artifacts/ai-weights-phase3.json` | Phase 4採用前の重み。Phase 4基準との差分確認に使う |

seedの使い分け:

| seed | 用途 |
| --- | --- |
| `trainingSeed` | 候補生成とsuccessive halvingの学習評価 |
| `validationSeed` | 生存候補の短い検証 |
| `finalSeed` | 500局級の最終確認コマンド |

軽量スモーク例:

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 4 --round-games 2 --round-repeats 1 \
  --validation-games 8 --final-games 500 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --max-depth 1 \
  --output bao-la-kiswahili/artifacts/phase9-tune-smoke.json
```

本格探索へ進む場合の入口:

```sh
node bao-la-kiswahili/tools/phase9-tune.js \
  --candidates 24 --round-games 2,6,20 --round-repeats 3,2,1 \
  --validation-games 48 --final-games 500 \
  --opening-plies 4,8,12 --opening-phases namua,mtaji \
  --baselines default,bao-la-kiswahili/artifacts/ai-weights-phase3.json \
  --max-depth 1 \
  --output bao-la-kiswahili/artifacts/phase9-tune.json
```

`phase9-tune.js`は採用候補を`artifacts/phase9-promoted/`へ保存し、500局級の最終確認用`benchmark.js`コマンドをレポート内に残す。採用判断はこの最終確認結果を`tools/phase9-decision.js`で集計し、Wilson 95%下限と戦術回帰を確認してから行う。

最終確認結果の判定例:

```sh
node bao-la-kiswahili/tools/phase9-decision.js \
  --input bao-la-kiswahili/artifacts/phase9-tune.json \
  --candidate candidate-01 \
  --final-reports bao-la-kiswahili/artifacts/phase9-final-namua.json,bao-la-kiswahili/artifacts/phase9-final-mtaji.json \
  --min-games 500 --min-wilson 0.5 \
  --output bao-la-kiswahili/artifacts/phase9-decision.json
```

`--final-reports`を指定しない場合は、`phase9-tune.js`の短いvalidation結果を使って`long-run-candidate`か`hold`を判定する。500局級のJSONを渡した場合だけ、採用候補として十分な局数とWilson下限を満たすかを判定する。

500局級確認を分割して進める場合:

```sh
node bao-la-kiswahili/tools/phase9-longrun.js \
  --input bao-la-kiswahili/artifacts/phase9-tune.json \
  --candidate candidate-01 \
  --games 500 --chunks 5 --run-chunks 1 \
  --output bao-la-kiswahili/artifacts/phase9-longrun.json \
  --decision-output bao-la-kiswahili/artifacts/phase9-decision.json
```

`phase9-longrun.js`は`phase9-tune.js`の候補、基準AI、opening条件を読み、chunk単位でfinal確認を進める。各chunk後にaggregateとdecisionを更新するため、長い検証を中断・再開できる。

軽量スモークでは、`candidate-01`と`candidate-02`がどちらもvalidation 5勝3敗、`tactical=7/7`で長期検証候補になった。promoteした`candidate-01`のlongrunは500局で264勝236敗、score 52.8%、Wilson 95%下限48.4%、`tactical=7/7`だった。採用ラインに届かないため、既定重みには反映しない。

中規模探索では`candidate-11`と`candidate-02`がvalidation 13勝11敗、`tactical=7/7`で残った。default相手の崩れが少ない`candidate-02`を500局longrunへ進めたが、結果は264勝236敗、score 52.8%、Wilson 95%下限48.4%、`tactical=7/7`で、こちらも採用ラインに届かなかった。

追加で`candidate-11`も500局longrunへ進めたところ、269勝231敗、score 53.8%、Wilson 95%下限49.4%、`tactical=7/7`だった。採用目安の272勝に3勝足りず、Phase 9の中規模候補はどちらも既定重みへ反映しない。

本格探索では候補24、`round-games=2,6,20`、`round-repeats=3,2,1`、validation 48局で候補を絞ったが、finalists 3件はいずれもvalidationで50%を下回り、promote候補は出なかった。Phase 9では既定`bao`を統計的に上回る重み候補を得られなかったため、既定重みは変更しない。

### 完了時の判定

- 結果: 軽量、中規模、本格探索を通して戦術回帰を維持する候補は得られたが、500局級でWilson 95%下限50%を超える候補はなかった
- 採用見送り: `candidate-01`、`candidate-02`、`candidate-11`および本格探索finalists
- 既定評価: 既存`bao`重みを維持する
- 次に進む場合: Phase 8の再評価へは進まず、Phase 10または戦術局面・探索空間の見直しを優先する

### 完了条件

- Phase 4基準AIに対して統計的優位を示す
- 戦術回帰を悪化させない
- 候補生成から最終採用まで再実行可能なコマンドを保存する

### 知見化メモ

記録すること:

- 勝率だけ高く、戦術で落ちた候補
- 複数seedで安定した候補
- 過学習が疑われる条件
- 今後のチューニングで避けるべき探索空間

## 8. Phase 10：対人ログによる改善ループ

目安: 中長期

実施状況: 未着手

### 狙い

実際の対局でAIが間違えた局面や、人間が悩んだ局面を収集し、戦術回帰やベンチマーク開始局面へ変換する。人間にとって納得感のあるAIへ近づける。

### 前提

プライバシーと公開品質を優先する。ログ保存を行う場合は、明示的な同意、匿名化、保存範囲の最小化を検討する。サーバー保存を行わない場合でも、ローカルで局面をコピーして開発用テストへ移す運用は可能。

### 実装候補

- 開発用に現在局面をJSONとしてコピーする機能
- AIの選択手、上位候補、評価値を表示する診断モード
- 人間が「この手はおかしい」と印を付けるローカル記録
- 集めた局面を`test/`または`artifacts/`に移し、再現テスト化する

### 完了条件

- 対人局面を再現可能なテストまたはベンチマークに変換できる
- 個人情報や不要な操作ログを保存しない
- 対人由来の改善も自己対戦と戦術回帰で検証する

### 知見化メモ

記録すること:

- 人間が違和感を持ちやすいAIの手
- 勝率には出にくいが体験品質に効く改善
- 対人ログをテストへ落とし込むときの判断基準

## 9. Phase 11：探索効率 v2

目安: 1〜2週間

実施状況: 進行中（2026-07-10）

### 狙い

評価関数と固定探索予算を変えず、着手順序、Transposition Table、評価再利用を改善して、同じ時間内により深く安定して読む。Phase 8のように局面ごとの時間を推定するのではなく、各局面へ割り当てた時間そのものの利用効率を上げる。

### 前提となる安全柵

- Phase 8で勝敗が悪化したmtaji局面を最低1局、固定戦術回帰へ追加する
- 現在の7カテゴリを維持し、探索改善で失敗した局面は削除せず追加する
- 各候補でroot最善手、到達深度、ノード数、cutoff数、cache hit数、timeout数を記録する
- 評価関数、探索順序、TT表現を同時に変更しない

### 実装候補と順序

1. TTまたは前回反復深化の最善手を、即時勝利を除く他の着手より先に探索する
2. Quiescence Search内の捕獲手を、即時勝利と実捕獲量で順序付ける
3. quiet moveへhistory heuristicを追加し、killer moveと役割を分ける
4. 前回反復深化のroot評価を中心にaspiration windowを導入する
5. 同一探索内で着手後局面、局面評価、捕獲結果を再利用する評価キャッシュを検討する
6. 終局距離値をTT保存時に正規化し、探索plyをTTキーから外せるか独立候補として検証する

TT最善手優先、Quiescence着手順序、history heuristic、aspiration windowは、それぞれ別の探索プロファイルまたはオプションで比較する。複数項目をまとめて採用せず、寄与が確認できた項目だけを積み上げる。

### 途中結果

2026-07-10に、安全柵と最初の比較候補を実装した。

- Phase 8 hard `mtaji/8`のseedから、深度2〜5と深度6〜7で着手が分かれる`mtaji-depth-trap`局面を追加した
- `ttMoveFirst`オプションを追加し、既定探索は従来順序のまま維持した
- `benchmark.js`へ`--first-tt-move-first`／`--second-tt-move-first`を追加した
- `phase11-compare.js`で、同じ生成局面を固定深度探索し、着手と探索統計を比較できるようにした

固定深度4、namua/mtaji各8局面の初回比較では、16/16局面で着手が一致した。TT最善手優先は7局面でノード数を削減し、悪化0局面、合計6465から5401 nodesへの16.5%削減だった。

未使用seed `20262000`の16局面でも着手はすべて一致したが、node数は5097から5060への0.7%削減に縮小し、改善6、悪化1、同数9だった。2系列32局面の合計削減率は9.5%で、局面ごとの中央値は改善なしとなり、事前の採用条件へ届かなかった。TT最善手優先は既定化せず保留とし、時間制限自己対戦へ進めない。次はQuiescence捕獲順序を独立候補として比較する。

Quiescence捕獲順序は、即時勝利とrelay完了までの実捕獲量で捕獲手を並べる候補として比較した。初回16局面は10.2%、holdout 16局面は6.3%の合計node削減となり、32/32で着手一致、改善25、悪化0だった。一方、局面別削減率の中央値は初回5.6%、holdout 3.0%で、10%条件に届かなかった。100msの短い自己対戦でも勝敗とtimeoutは同等だったが、到達深度はnamuaで小さく改善、mtajiで小さく悪化した。安定した実時間改善を示さないため既定化せず、次はhistory heuristicを独立比較する。

quiet move用history heuristicは、非捕獲手によるcutoffへ`depth²`を加点し、killer moveの後、静的評価の前に並べる候補として比較した。初回16局面は6465から6460 nodes、holdout 16局面は5097の同数で、全着手が一致した。既存のkiller moveと静的順序に対する追加効果がほぼないため、時間制限試験へ進めず不採用とする。次はaspiration windowを独立比較する。

aspiration windowは前回反復深化のroot評価を中心に幅50で探索し、fail-high／fail-low時に全幅で再探索する候補として比較した。着手は32/32で一致したが、初回は11.3%、holdoutは8.8%のnode増加となり、合計70回の再探索が発生した。幅100、200でも初回系列はそれぞれ11.5%、7.6%増加し、改善しなかった。固定幅aspirationは不採用とし、次は評価・着手後局面キャッシュを検討する。

評価キャッシュは、同一探索内の局面・評価視点をキーにBao評価を再利用する候補として比較した。探索木とroot着手は32/32で完全に一致し、実評価計算は初回23.9%、holdout 18.4%削減した。100msスモークではnamuaが候補1勝0敗3分、mtajiが両者2勝2敗で、平均到達深度はnamua 2.21→2.28、mtaji 3.54→3.78へ上昇した。中規模時間制限検証へ進める候補とし、既定値は検証完了まで`false`を維持する。

150ms・各8局の中規模入口は、namuaで候補1勝0敗7分、mtajiで両者4勝4敗だった。平均深度はnamua 2.50→2.52、mtaji 3.83→4.13、timeoutは両者同数だった。mtajiの最大思考時間は182.8msから166.7msへ下がった。次は450〜500ms級とcache容量・GC影響を確認し、既定化の可否を判断する。

500ms確認ではnamuaの平均深度が3.81→3.88、mtajiが9→10となり、勝敗悪化はなかった。探索ごとのcache peakは最大287 entriesで、2,048上限に対するevictionは0だった。固定深度で探索意味が一致し、実評価計算の削減が未使用seedでも再現し、150ms・500msで深度を悪化させなかったため、評価キャッシュをhard/expertの既定へ採用する。easy/normalは従来経路を維持する。

### 測定方法

固定深度試験では、同一局面・同一深度で次を比較する。

- 選択手の一致率と戦術回帰通過数
- 総ノード数、Quiescence node数、cutoff数
- cache hit率とcache store数
- 平均・最大思考時間

時間制限試験では、hard 450〜600ms、expert 1.5〜3秒を分けて次を比較する。

- completed depthの分布
- timeout率
- paired openingによる勝敗
- 先後別、namua/mtaji別の成績

### 完了条件

次のいずれかを満たし、かつ戦術回帰を悪化させない候補だけを採用する。

- 同一固定深度・同一選択手で、代表局面の中央値ノード数または思考時間を10%以上削減する
- 同一時間制限で平均completed depthを上げ、500局以上で現行探索に対する統計的優位を示す
- 同等勝率を維持しながら、timeout率または最大思考時間を明確に下げる

TT終局距離正規化は正確性リスクが高いため、上記に加えて、同一盤面へ異なるplyで到達する回帰テストと、早い勝利・遅い敗北を守るテストを必須とする。

### 不採用条件

- ノード数は減るが、mtaji反例または既存戦術回帰を悪化させる
- 固定深度では改善するが、ブラウザ相当時間で到達深度または勝率が再現しない
- 複数変更を同時に入れ、どの変更が効いたか説明できない
- キャッシュ追加によるメモリ増加やGC停止で最大思考時間が悪化する

## 10. Phase 12：反例駆動の評価改善

目安: 中長期

実施状況: 未着手

### 狙い

Phase 10の対人局面とPhase 11の探索診断から、探索を深くしても解けない誤着手を集め、その失敗だけを説明できる新特徴量を検討する。Phase 7とPhase 9で改善しなかった既存特徴量のカテゴリ補正・重み再探索は、反例なしには再開しない。

### 候補特徴量

- `replyCaptureRisk`: 着手後に許す相手の最大捕獲量
- `postRelaySafety`: relay終了後の前列占有、連結、再利用可能穴
- `forcedCaptureDepth`: 強制捕獲系列が続く長さ
- `houseSurvival`: nyumbaを相手の次手以降まで維持できる見込み
- `mobilityAfterReply`: 相手の有力な反撃後にも残る可動性

候補名は仮称であり、実際の反例を説明できない特徴量は実装しない。高価な特徴量は全葉で計算せず、着手順序、限定延長、評価キャッシュとの組合せも検討する。

### 完了条件

- 新特徴量ごとに、導入理由となる複数の反例局面がある
- 反例局面で改善し、既存戦術回帰を悪化させない
- 固定深度とブラウザ相当時間の両方で性能コストを記録する
- 未使用seedとpaired openingを使う500局以上の最終確認、または戦術解決率の明確な改善を示す

## 11. 推奨順序

次に進める初回実行順は、Phase番号順ではなく、採用判断の依存関係を優先する。

1. Phase 11の安全柵として、Phase 8のmtaji反例を固定戦術局面へ変換する
2. Phase 11でTT最善手優先とQuiescence捕獲順序を別々に比較する
3. 効果が確認できた場合だけ、history heuristic、aspiration window、評価キャッシュへ進む
4. Phase 10のローカル局面コピーと違和感記録を追加し、対人反例を蓄積する
5. 深い探索でも解けない反例が複数集まった場合だけPhase 12へ進む

Phase 7〜9は採用見送りで完了したため、Phase 11は既定`bao`評価、Phase 2探索、固定探索予算を基準にする。Phase 7で不採用となった`bao-v2`補正やPhase 8の適応予算を初期候補へ混ぜない。

上の順序は初回の進め方であり、各Phaseの結果に応じた戻り作業を禁止するものではない。

Phase 8の適応探索予算へ戻るのは、Phase 11で探索効率を改善した後も局面カテゴリ別の明確な時間不足が残る場合に限る。単純な合法手数や捕獲量ではなく、実測したroot best変化、探索深度、timeoutとの相関から難局指標を再設計する。

Phase 7またはPhase 9へ戻るのは、Phase 12で既存評価の偏った失敗を複数局面で説明できた場合に限る。`bao-v2`全体を採用前提にせず、必要な特徴量またはカテゴリだけを独立候補として検証する。

## 12. 採用判定ルール

新しい候補は、次のどれかを満たした場合に採用候補とする。

- Phase 4基準AIに対し、500局以上で統計的優位を示す
- 勝率は同等だが、Phase 6戦術局面の解決率が明確に上がる
- UI応答性を維持したまま、同等勝率で平均思考時間または最大思考時間が下がる
- 同一固定深度と同一選択手で、探索ノード数または思考時間が再現可能に減る

次の場合は不採用または保留とする。

- 自己対戦勝率だけ高く、戦術回帰を悪化させる
- 時間制限試験でだけ強く、固定深度や複数seedで再現しない
- Cloudflare Pagesで公開する`public/`の安定性を下げる
- 採用理由を局面または測定値で説明できない

統計的優位の判定は従来のWilson 95%下限を継続して記録する。ただし、同じopeningを共有する2局には相関があるため、今後はopening pair単位の勝点差またはbootstrap信頼区間も併記し、個別対局を完全に独立とみなした値だけで境界候補を採用しない。

## 13. 知見整理テンプレート

後でBao AI強化の知見をまとめるため、各実験は次の形で記録する。

```text
### YYYY-MM-DD: 実験名

目的:

仮説:

変更内容:

測定条件:

結果:

採用判断:

効いた局面:

弱くなった局面:

一般化できる知見:

次に試すこと:
```

知見として特に残したい軸:

- Baoのどの戦術が評価関数で表現しやすいか
- 探索深度で解ける問題と、評価関数が必要な問題の違い
- `namua`と`mtaji`で同じ特徴量が逆効果になる条件
- 自己対戦で強く見えるが人間目線では不自然な手
- ブラウザAIとしての強さと快適さのバランス

## 14. 次の最小作業単位

最初の着手としては、Phase 11のうち評価意味を変えない小さな比較を行う。

1. Phase 8のartifactから勝敗が悪化したmtaji局面を1局以上再現し、固定戦術回帰へ追加する
2. 探索順序の基準値として、代表局面の選択手、ノード数、cutoff数、cache hit数、到達深度を保存する
3. 即時勝利を最優先に保ったまま、TT最善手を他の着手より先に探索する候補を実装する
4. 同一固定深度で既存探索と比較し、選択手と戦術回帰を維持したままノード数が減るか確認する
5. TT最善手優先とは分けて、Quiescence Searchの捕獲手順序候補を実装・比較する
6. 結果を`AI_BENCHMARK.md`へ、設計判断と反例を`AI_DEVELOPMENT_LOG.md`へ追記する

この最小単位で効果が確認できた候補だけをPhase 11の次段へ進める。効果がない場合はhistory heuristic等を重ねず、反例と探索統計を見直す。
