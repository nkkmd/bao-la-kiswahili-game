# Bao AI 次期強化ロードマップ

Version: 0.1.1  
Status: Draft  
作成日: 2026-07-07

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

Phase 0-5で得た到達点:

| 項目 | 状態 |
| --- | --- |
| 測定基盤 | seed付き自己対戦、paired opening、探索統計、戦術回帰を整備済み |
| 評価関数 | `legacy + Bao特徴量補正`方式でPhase 0評価より強化済み |
| 探索 | Transposition Table、PVS、killer move、Quiescence Searchを導入済み |
| UI | Web Workerで長時間探索とUI応答性を両立済み |
| 重み調整 | successive halvingと複数seed検証で`namua.houseValue: -7`を採用済み |
| MCTS | 単体、root prior、候補制限、hybrid候補制限を比較し、不採用 |

今後の仮説:

- Baoではプレイアウト型探索より、局面理解と着手順序の改善が効きやすい
- 強化の安全性は、固定戦術局面の質と数に大きく依存する
- `namua`と`mtaji`の二分だけでは、評価重みの表現力が足りなくなる可能性がある

## 3. 基本方針

1. まず戦術局面を増やし、改善の安全柵を強くする
2. 評価関数は特徴量追加より、局面カテゴリ分割と重み整理を優先する
3. 探索は深くするだけでなく、局面ごとの時間配分と着手順序を改善する
4. 自己対戦チューニングは、勝率だけでなく戦術回帰ペナルティを組み込む
5. 人間の対局ログを使う場合も、採用判断は再現可能なベンチマークへ落とし込む

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

## 9. 推奨順序

次に進める初回実行順は、Phase番号順ではなく、採用判断の依存関係を優先する。

1. Phase 6で戦術局面セットを拡充する
2. Phase 9で重みチューニングv2を回す
3. Phase 8で、Phase 9後の基準AIに対する実用時間配分を改善する
4. Phase 10で対人ログを取り込む

Phase 7は採用見送りで完了したため、次は既定`bao`を基準にする。Phase 8は実用上重要だが、重みや評価候補を再探索する場合も、Phase 7で不採用となった`bao-v2`補正を初期値へ混ぜない。

上の順序は初回の進め方であり、各Phaseの結果に応じた戻り作業を禁止するものではない。

Phase 9の結果次第では、Phase 8へ戻って探索予算を再評価する。Phase 9で採用候補となる重みが得られた場合は、その候補を新しい基準AIとして、固定探索予算と適応探索予算を改めて比較する。Phase 9後にUI応答性、timeout率、平均思考時間、最大思考時間が悪化した場合も、Phase 8を優先して再確認する。

Phase 7へ戻るのは、Phase 9で既存の重み表現だけでは改善できない偏った失敗が見えた場合に限る。特定カテゴリの戦術回帰だけが継続して失敗する、またはnamua/mtajiなど局面カテゴリ別に明確な弱点が残る場合は、`bao-v2`全体を採用前提にせず、必要なカテゴリ評価だけを限定的に再検討する。

## 10. 採用判定ルール

新しい候補は、次のどれかを満たした場合に採用候補とする。

- Phase 4基準AIに対し、500局以上で統計的優位を示す
- 勝率は同等だが、Phase 6戦術局面の解決率が明確に上がる
- UI応答性を維持したまま、同等勝率で平均思考時間または最大思考時間が下がる

次の場合は不採用または保留とする。

- 自己対戦勝率だけ高く、戦術回帰を悪化させる
- 時間制限試験でだけ強く、固定深度や複数seedで再現しない
- Cloudflare Pagesで公開する`public/`の安定性を下げる
- 採用理由を局面または測定値で説明できない

## 11. 知見整理テンプレート

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

## 12. 次の最小作業単位

最初の着手としては、Phase 6の準備を行う。

1. `tactical.test.js`の既存局面をカテゴリ別に棚卸しする
2. 足りないカテゴリを一覧化する
3. 局面作成ヘルパーの必要性を判断する
4. まず2〜3局面だけ追加し、現行AIで通るか確認する
5. 通らない局面は、期待手が妥当か、評価関数の限界か、探索深度の問題かを分類する

この最小単位を完了してから、Phase 7以降へ進む。
