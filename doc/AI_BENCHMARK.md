# Bao AI ベンチマーク

設計判断、途中試行、測定上の限界は`AI_DEVELOPMENT_LOG.md`を参照する。

## 実行方法

プロジェクトルートから次を実行する。

```sh
node bao-la-kiswahili/tools/benchmark.js --games 100 --seed 20260706 \
  --first hard --second normal --first-profile legacy --second-profile legacy \
  --time-limit 0 --max-depth 2
```

`first`と`second`は対戦者の識別子で、各局ごとにSouthとNorthを交代する。`--time-limit 0`は時間切れを無効化し、指定深度まで必ず探索するため、同じ環境・シードで勝敗を再現する比較試験に適している。

実機と同じ時間制限を測る場合は次を使用する。

```sh
node bao-la-kiswahili/tools/benchmark.js --games 100 --seed 20260706 \
  --first hard --second normal --time-limit 450 --max-depth 4
```

時間制限を使う試験では端末負荷により到達深度と勝敗が変わり得る。機械処理用の結果は`--json`で出力できる。

主なオプション:

| オプション | 既定値 | 内容 |
| --- | ---: | --- |
| `--games` | 100 | 対局数 |
| `--seed` | 20260706 | 乱数シード |
| `--first` | hard | 比較元AI |
| `--second` | normal | 対戦AI |
| `--first-profile` | bao | 比較元の評価関数（bao / bao-v2 / legacy） |
| `--second-profile` | bao | 対戦相手の評価関数（bao / bao-v2 / legacy） |
| `--first-search` | phase2 | 比較元の探索（phase2 / legacy / mcts） |
| `--second-search` | phase2 | 対戦相手の探索（phase2 / legacy / mcts） |
| `--max-turns` | 300 | 引き分けとする最大手数 |
| `--opening-plies` | 0 | ペアごとに共有するランダム序盤手数 |
| `--opening-phase` | any | 開始フェーズ（any / namua / mtaji） |
| `--time-limit` | 50 | 1手の探索時間。0は無制限 |
| `--max-depth` | 4 | 最大探索深度 |
| `--mcts-iterations` | なし | MCTSの最大simulation数。未指定で時間制限まで実行、時間無制限時は200 |
| `--mcts-playout-turns` | 80 | MCTSの1simulationあたり最大プレイアウト手数 |
| `--mcts-exploration` | 1.414... | UCTの探索係数 |
| `--mcts-policy` | evaluation | MCTSのプレイアウト方策（random / capture / balanced / evaluation） |
| `--mcts-root` | visits | MCTSのroot着手選択（visits / value） |
| `--mcts-reward` | evaluation | MCTSの報酬設計（evaluation / terminal / fast-terminal） |
| `--mcts-prior` | none | MCTS root子ノードの事前評価（none / static） |
| `--mcts-prior-weight` | 1 | static priorの仮想訪問数 |
| `--mcts-candidate-limit` | 0 | MCTS root候補を上位N手へ制限。0は無制限 |
| `--mcts-candidate-source` | static | root候補制限の評価元（all / static / phase2） |
| `--mcts-candidate-depth` | 1 | `phase2`候補評価で使う浅い探索深度 |

## Phase 0基準成績

計測日: 2026-07-06

環境: Node.js v24.6.0

条件: 100局、seed 20260706、hard対normal、固定深度2、時間切れなし

| 指標 | 結果 |
| --- | ---: |
| hard勝敗 | 98勝2敗0分 |
| hard勝率 | 98.0% |
| hard South勝率 | 96.0% |
| hard North勝率 | 100.0% |
| South / North勝利数 | 48 / 52 |
| 平均手数 | 40.4 |
| hard平均 / 最大思考時間 | 4.29ms / 44.55ms |
| hard平均探索ノード数 | 22 |
| hard到達深度 | 2 |

思考時間は参考値であり、勝敗の再現条件には含めない。

## 回帰テスト

```sh
node bao-la-kiswahili/test/engine.test.js
node bao-la-kiswahili/test/ai.test.js
node bao-la-kiswahili/test/benchmark.test.js
node bao-la-kiswahili/test/evaluation.test.js
node bao-la-kiswahili/test/tactical.test.js
node bao-la-kiswahili/test/search.test.js
node bao-la-kiswahili/test/ai-config.test.js
node bao-la-kiswahili/test/ai-worker.test.js
node bao-la-kiswahili/test/worker-integration.test.js
node bao-la-kiswahili/test/ai-weights.test.js
node bao-la-kiswahili/test/tune-weights.test.js
node bao-la-kiswahili/test/successive-tune.test.js
node bao-la-kiswahili/test/mcts-grid.test.js
node bao-la-kiswahili/test/phase7-grid.test.js
node bao-la-kiswahili/test/phase7-validate.test.js
node bao-la-kiswahili/test/phase7-decision.test.js
node bao-la-kiswahili/test/phase7-longrun.test.js
```

戦術テストは、即時勝利、捕獲連鎖、nyumbaの利用、nyumbaの温存、namuaからmtajiへの移行、大きな反撃の回避、mtaji耐久を対象とする。

戦術局面ごとの診断出力:

```sh
BAO_TACTICAL_DIAG=1 node bao-la-kiswahili/test/tactical.test.js
```

候補重みを検証する場合:

```sh
BAO_AI_WEIGHTS=bao-la-kiswahili/artifacts/candidate.json \
  BAO_TACTICAL_DIAG=1 node bao-la-kiswahili/test/tactical.test.js
```

診断出力はJSON Linesで、カテゴリ、選択手、root評価、着手後評価、探索統計を含む。Phase 7以降の採用判定では、自己対戦成績に加えてこの戦術回帰を通過することを条件にする。

`bao-v2`評価の戦術診断:

```sh
BAO_AI_PROFILE=bao-v2 BAO_TACTICAL_DIAG=1 \
  node bao-la-kiswahili/test/tactical.test.js
```

候補補正表を使う場合は`BAO_AI_ADJUSTMENTS=/path/to/adjustments.json`を併用する。`bao-v2`は実験用評価プロファイルで、既定UIの`bao`評価は変更しない。比較する場合は`--first-profile bao-v2 --second-profile bao`のように明示する。

`bao-v2`評価の短い比較スモーク:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 8 --seed 20260731 \
  --opening-plies 4 --first hard --second hard \
  --first-profile bao-v2 --second-profile bao \
  --time-limit 150 --max-depth 4 --max-turns 80 --json
```

この条件は正式な強さ判定ではなく、Phase 7の実験評価が戦術回帰と短時間探索で大きく崩れていないかを見るための軽量確認である。

`bao-v2`カテゴリ補正候補の軽量グリッド:

```sh
node bao-la-kiswahili/tools/phase7-grid.js --games 4 --seed 20260732 \
  --repeats 1 --opening-plies 4 --time-limit 120 --max-depth 3 \
  --max-turns 70 --variants base,endurance-light,endurance-heavy,attack-light
```

このグリッドは候補の初期ふるい分け用である。出力には`score`に加えて`tactical=通過数/総数`を含む。上位候補は`tactical=7/7`を満たしたものに限定し、より多いseed／局数のベンチマークで再確認する。

namua/mtajiをまたいだ保存付きスモーク:

```sh
node bao-la-kiswahili/tools/phase7-grid.js --games 2 --seed 20260734 \
  --repeats 1 --opening-plies 2,4 --opening-phases namua,mtaji \
  --time-limit 100 --max-depth 3 --max-turns 60 \
  --variants base,endurance-light,namua-transition-heavy,attack-light \
  --min-score 0.5 --promote-top 2 \
  --output bao-la-kiswahili/artifacts/phase7-grid.json \
  --promote-dir bao-la-kiswahili/artifacts/phase7-promoted
```

`--output`を指定すると、候補ごとの補正表、戦術通過数、opening条件別の短い成績をJSONで保存する。`--promote-dir`を指定すると、`tactical=7/7`かつ`--min-score`以上の上位候補補正表だけを個別JSONとして保存する。

promote候補の中規模検証入口:

```sh
node bao-la-kiswahili/tools/phase7-validate.js \
  --input bao-la-kiswahili/artifacts/phase7-grid.json \
  --games 12 --seed 20260740 --repeats 2 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-validation.json
```

この検証もPhase 7候補の整理用であり、500局級の正式採用判定ではない。

2026-07-08の軽量validate結果は`bao-la-kiswahili/artifacts/phase7-validation.json`に保存した。`endurance-light`のみ4勝4敗、`tactical=7/7`でeligible、`namua-transition-heavy`と`endurance-heavy`は3勝5敗でholdだった。

`endurance-light`単体の中規模前チェック:

```sh
node bao-la-kiswahili/tools/phase7-validate.js \
  --candidate bao-la-kiswahili/artifacts/phase7-promoted/03-endurance-light.json \
  --games 8 --seed 20260770 --repeats 2 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-endurance-light-validation.json
```

2026-07-08の結果は`bao-la-kiswahili/artifacts/phase7-endurance-light-validation.json`に保存した。総合は16勝16敗、`tactical=7/7`でeligible。namua 4手開始は2勝6敗、mtaji 4手開始は6勝2敗で、採用根拠ではなく局面差を見るための材料として扱う。

namua序盤補正を戻す対照候補:

```sh
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
```

2026-07-08の結果は`bao-la-kiswahili/artifacts/phase7-namua-safe-validation.json`に保存した。`endurance-namua-safe`はnamua-opening補正を既定`bao`相当に戻し、mtaji-enduranceだけ`endurance-light`と同じにする対照候補である。単体validateは7勝9敗、score 43.8%、`tactical=7/7`でholdだったため、長い自己対戦候補にはしない。

候補横並びの中規模前チェック:

```sh
node bao-la-kiswahili/tools/phase7-grid.js --games 4 --seed 20260810 \
  --repeats 2 --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --variants base,endurance-light,endurance-namua-safe \
  --min-score 0.5 --promote-top 2 \
  --output bao-la-kiswahili/artifacts/phase7-candidate-comparison.json \
  --promote-dir bao-la-kiswahili/artifacts/phase7-promoted-candidate-comparison
```

2026-07-08の結果は`bao-la-kiswahili/artifacts/phase7-candidate-comparison.json`に保存した。`base`と`endurance-namua-safe`が9勝7敗、`endurance-light`が8勝8敗で、全候補`tactical=7/7`だった。補正候補が`base`を明確に上回らないため、長い自己対戦へ進む場合は`bao-v2` base対`bao`を主軸にし、補正候補は追試扱いにする。

`bao-v2` base単体の中規模前チェック:

```sh
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

2026-07-08の結果は`bao-la-kiswahili/artifacts/phase7-base-validation.json`と`bao-la-kiswahili/artifacts/phase7-base-decision.json`に保存した。総合は12勝12敗、`tactical=7/7`でeligible。namua/mtajiの各条件もすべて3勝3敗で、崩れてはいないが改善証拠でもない。`phase7-decision.js`ではscore 50.0%、Wilson 95%下限31.4%、局数不足のため`long-run-candidate`と判定した。500局でWilson 95%下限50%超えに必要な目安は272勝相当で、現時点では追加476局が必要である。長い自己対戦へ進む場合は、補正候補ではなく`bao-v2` base対`bao`を主軸にして、統計的に負けていないことを最小基準にする。

Phase 7の長期検証へ進む場合の判定プリセット:

```sh
node bao-la-kiswahili/tools/phase7-longrun.js \
  --candidate bao-la-kiswahili/artifacts/phase7-promoted-candidate-comparison/02-base.json \
  --games 50 --chunks 5 --run-chunks 1 --seed 20260900 \
  --opening-plies 4,8 --opening-phases namua,mtaji \
  --time-limit 150 --max-depth 4 --max-turns 100 \
  --min-score 0.5 --min-games 500 --min-wilson 0.5 \
  --output bao-la-kiswahili/artifacts/phase7-base-longrun.json \
  --decision-output bao-la-kiswahili/artifacts/phase7-base-longrun-decision.json
```

この設定は50局 x 5 chunks x 2 opening phasesで合計500局になる。`--run-chunks 1`は1 chunkだけ進める指定で、同じコマンドを再実行すると既存の`phase7-base-longrun.json`から続きのchunkを追加する。実行時間が長いため、短時間作業中には複数chunkをまとめて回さない。

2026-07-08に1 chunk目を実行し、`bao-la-kiswahili/artifacts/phase7-base-longrun.json`と`bao-la-kiswahili/artifacts/phase7-base-longrun-decision.json`へ保存した。100局時点では48勝52敗、score 48.0%、Wilson 95%下限38.5%、`tactical=7/7`、decisionは`hold`。内訳はnamua 4手開始が21勝29敗、mtaji 8手開始が27勝23敗だった。

同日に2 chunk目まで進めた。200局時点では102勝98敗、score 51.0%、Wilson 95%下限44.1%、`tactical=7/7`、decisionは`long-run-candidate`。chunk 2単体ではnamua 4手開始が29勝21敗、mtaji 8手開始が25勝25敗で、chunk 1のnamua負けを一部戻した。まだ採用ラインではなく、500局完走まで追う場合も採用前提にはしない。

さらにchunk 4まで進めた。400局時点では206勝194敗、score 51.5%、Wilson 95%下限46.6%、`tactical=7/7`、decisionは`long-run-candidate`。chunk 3単体はnamua 29勝21敗、mtaji 25勝25敗、chunk 4単体はnamua 25勝25敗、mtaji 25勝25敗だった。500局で272勝相当に届くには、最後の100局で66勝34敗以上が必要で、採用ライン到達はかなり厳しい。

最終chunkまで完走した。500局では259勝241敗、score 51.8%、Wilson 95%下限47.4%、`tactical=7/7`、decisionは`hold`。chunk 5単体はnamua 28勝22敗、mtaji 25勝25敗だった。戦術回帰は維持したが、Wilson下限50%超えの採用条件を満たさないため、`bao-v2` baseは既定評価として採用しない。

## Phase 5 MCTS準備

MCTSは`--first-search mcts`または`--second-search mcts`で実験できる。現在の実装は、採用済みAlpha-Betaを置き換えるものではなく、Phase 5の比較研究用の足場である。

反復数固定のスモークテスト:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 2 --seed 20260715 \
  --first hard --second easy --first-search mcts \
  --time-limit 0 --mcts-iterations 16 --mcts-playout-turns 8 \
  --mcts-policy capture
```

同一思考時間での初期比較:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 20 --seed 20260715 \
  --opening-plies 8 --first hard --second hard \
  --first-search mcts --second-search phase2 \
  --time-limit 450 --max-depth 8 --mcts-playout-turns 80 \
  --mcts-policy capture --mcts-root visits --mcts-reward evaluation
```

MCTS比較では、通常の勝率、先後別勝率、平均思考時間に加えて、`mcts ... sims/move`と平均プレイアウト手数を記録する。プレイアウト単価が高い場合、同じ450msでもAlpha-Betaより探索情報が薄くなる可能性がある。

プレイアウト方策:

| 方策 | 内容 | 用途 |
| --- | --- | --- |
| `random` | 合法手からランダム | 最低限の下限比較 |
| `capture` | 即時勝利と捕獲量を優先 | Baoらしさと軽さの初期候補 |
| `balanced` | 捕獲に加えて前列手と端からの向きを軽く評価 | 非捕獲手の同点を減らす軽量候補 |
| `evaluation` | 捕獲量に加えて評価関数を使用 | 判断材料は多いが高コスト |

短い性能確認（2026-07-07、Node.js v24.6.0）:

```sh
node bao-la-kiswahili/tools/benchmark.js --games 2 --seed 20260716 \
  --opening-plies 4 --first hard --second hard \
  --first-search mcts --second-search phase2 \
  --time-limit 100 --max-depth 4 \
  --mcts-playout-turns 40 --mcts-policy capture
```

| 指標 | MCTS capture | Phase 2 |
| --- | ---: | ---: |
| 勝敗 | 0勝2敗 | 2勝0敗 |
| 平均思考時間 | 105.85ms | 99.37ms |
| 平均simulation数 | 5896 | - |
| 平均探索ノード数 | 12 | 119 |

この2局は強さの判定ではなく、MCTS capture方策の単価確認である。軽量化によりsimulation数は増えたが、この条件ではまだPhase 2探索を上回っていない。

root着手選択:

| 方策 | 内容 | 用途 |
| --- | --- | --- |
| `visits` | 訪問数最多のroot手を選ぶ | 従来の安定寄り選択 |
| `value` | 平均報酬最大のroot手を選ぶ | 短時間で価値差を強く見る比較 |

同じ100ms・2局条件では、`visits`も`value`もPhase 2に0勝2敗だった。現時点では採用判断に使わず、root選択を比較可能にした段階として扱う。

報酬設計:

| 方策 | 内容 | 用途 |
| --- | --- | --- |
| `evaluation` | 非終局は評価関数を`[-1, 1]`へ正規化 | 既存評価を活かす基準 |
| `terminal` | 勝ち1、負け-1、非終局0 | 終局結果だけを見る比較 |
| `fast-terminal` | 勝敗に終局までの手数を少し反映 | 早い勝ちと遅い負けを優遇 |

同じ100ms・2局条件では、`evaluation`と`fast-terminal`が1勝1敗、`terminal`が0勝2敗だった。局数が少ないため強さの結論ではなく、報酬設計を比較可能にした段階として扱う。

### MCTSグリッド比較

`policy × root × reward`の候補を同一条件で短く比較するには次を使う。

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --seed 20260717 \
  --repeats 2 --seed-step 10 \
  --opening-plies 4 --time-limit 100 --max-depth 4 --max-turns 120 \
  --mcts-playout-turns 40 --policies capture,balanced \
  --roots visits,value --rewards evaluation,fast-terminal
```

`--repeats`を指定すると、`seed + repeat * seedStep`で複数seedを回し、候補ごとに集計する。2026-07-07の短い2 repeatsスモークでは、`capture/value/evaluation`と`capture/value/fast-terminal`はいずれも0勝4敗だった。これは候補選抜用の予備結果であり、強さの正式判定には使わない。

追加の`balanced`方策スモークでも、同じ2 repeats条件では上位の`balanced/value/fast-terminal`が0勝4敗だった。simulation数は増えたが、勝率改善はまだ確認できていない。

root prior:

| 方策 | 内容 | 用途 |
| --- | --- | --- |
| `none` | 事前評価なし | 従来比較 |
| `static` | root子へ評価関数による仮想訪問を入れる | 木探索初期化の比較 |

2026-07-07の短い2 repeats比較では、`balanced/value/fast-terminal/none`が1勝3敗、`static`が0勝4敗だった。`static` priorはこの条件では改善していない。

root候補制限:

`--mcts-candidate-limit`でroot合法手を上位N手に絞れる。`--mcts-candidate-source static`は静的評価、`phase2`は浅いPhase 2探索で候補を評価する。`all`は候補制限を使わない比較用である。2026-07-07の短い2 repeats比較では、`balanced/value/fast-terminal`で無制限が0勝4敗、3手制限が1勝3敗だった。まだ負け越しだが、root幅を絞る方向には追加検証の余地がある。

候補制限幅`0,2,3,4`と`capture/balanced`の予備比較では、`capture/value/fast-terminal/none/4`、`balanced/value/fast-terminal/none/0`、`balanced/value/fast-terminal/none/3`がそれぞれ1勝3敗で並んだ。その他は0勝4敗だった。

上位候補を4 repeatsへ増やした再検証では、`capture/value/fast-terminal/none/0`が3勝5敗、候補制限4と`balanced` 3手制限は1勝7敗だった。候補制限の優位は維持されず、現時点ではMCTS候補はPhase 2探索を上回っていない。

現時点で相対的に最良だった`capture/value/fast-terminal/none/0`を16局相当で再検証したところ、2勝14敗、スコア12.5%だった。MCTS単体をPhase 2探索の置換として採用する根拠はない。

hybrid候補制限:

```sh
node bao-la-kiswahili/tools/mcts-grid.js --games 2 --repeats 2 \
  --seed 20260724 --seed-step 10 --opening-plies 4 \
  --time-limit 100 --max-depth 4 --max-turns 80 \
  --mcts-playout-turns 30 --policies capture \
  --roots value --rewards fast-terminal --priors none \
  --candidate-sources static,phase2 --candidate-limits 2,3 \
  --mcts-candidate-depth 2
```

短いhybrid比較では、`phase2`候補評価の2手制限と3手制限はいずれも1勝3敗、スコア25.0%だった。これは`static` 2手制限と同点であり、Phase 2探索を候補選別に使う追加コストに見合う改善は確認できなかった。

Phase 5結論:

2026-07-07時点では、MCTS単体もhybrid候補制限もPhase 2探索を上回っていない。MCTSは最高AIへの採用候補ではなく、比較研究として不採用とする。将来再開する場合は、MCTSをAlpha-Betaの置換ではなく、終盤局面や明確な不確実性局面に限定した補助探索として別フェーズで検証する。

## Phase 1基準成績

計測日: 2026-07-06  
環境: Node.js v24.6.0  
条件: 200局、seed 20260706、6手のpaired opening、hard同士、固定深度2、時間切れなし

```sh
node bao-la-kiswahili/tools/benchmark.js --games 200 --seed 20260706 \
  --opening-plies 6 --first hard --second hard \
  --first-profile bao --second-profile legacy --time-limit 0 --max-depth 2
```

| 指標 | Bao評価 | 旧評価 |
| --- | ---: | ---: |
| 勝敗 | 135勝65敗0分 | 65勝135敗0分 |
| 勝率 | 67.5% | 32.5% |
| South勝率 | 71.0% | 36.0% |
| North勝率 | 64.0% | 29.0% |
| 平均思考時間 | 20.72ms | 4.11ms |
| 最大思考時間 | 208.56ms | 43.55ms |
| 平均探索ノード数 | 20 | 20 |

同じランダム序盤局面を2局1組で共有し、AIのSouthとNorthを入れ替えることで、開始局面の偏りを抑えている。Bao評価は旧評価を基礎点として、namua／mtaji別の盤面構造、実遷移から得た捕獲量とrelay形、nyumba、reserve、可動性、テンポを補正する。

## Phase 2基準成績

### 450ms探索性能

計測日: 2026-07-06

環境: Node.js v24.6.0

条件: 10局、seed 20260709、8手のpaired opening、Bao評価、最大深度8、1手450ms

```sh
node bao-la-kiswahili/tools/benchmark.js --games 10 --seed 20260709 \
  --opening-plies 8 --first hard --second hard \
  --first-profile bao --second-profile bao \
  --first-search phase2 --second-search legacy --time-limit 450 --max-depth 8
```

| 指標 | Phase 2探索 | Phase 1探索 |
| --- | ---: | ---: |
| 平均探索ノード数 | 717 | 353 |
| ノード比 | 2.03倍 | 1.00倍 |
| 平均到達深度 | 4.58 | 4.21 |
| 最大到達深度 | 8 | 8 |
| 平均qnode数 | 417 | 0 |
| TT hit / store | 3,762 / 32,887 | 0 / 0 |
| TT hit率 | 10.3% | 0% |
| 勝敗 | 5勝5敗 | 5勝5敗 |

qnodeを含む総探索ノード数で比較する。Phase 2探索は捕獲局面を既定で1手延長するため、同じ表示深度でも探索内容は同一ではない。時間制限試験の値は端末負荷により変動する。

12手のランダム合法手から作った代表中盤局面では、seed 101で深度7、seed 606で深度6へ450ms前後で到達した。

### Phase 1探索との勝率

条件: 200局、seed 20260708、8手のpaired opening、Bao評価、固定深度2、時間切れなし

```sh
node bao-la-kiswahili/tools/benchmark.js --games 200 --seed 20260708 \
  --opening-plies 8 --first hard --second hard \
  --first-profile bao --second-profile bao \
  --first-search phase2 --second-search legacy --time-limit 0 --max-depth 2
```

| 指標 | Phase 2探索 | Phase 1探索 |
| --- | ---: | ---: |
| 勝敗 | 126勝74敗0分 | 74勝126敗0分 |
| 勝率 | 63.0% | 37.0% |
| South勝率 | 64.0% | 38.0% |
| North勝率 | 62.0% | 36.0% |
| 平均探索ノード数 | 81 | 26 |
| 平均思考時間 | 82.42ms | 39.53ms |

固定深度試験でもPhase 2はQuiescence Searchによる捕獲延長を行う。この比較のseedはPhase 1の重み調整に使用していない。

## Phase 3 Worker検証

Node.jsの実WorkerスレッドへブラウザWorker互換層を設定し、次を自動検証する。

- AI探索中もメインスレッドの5msタイマーが継続する
- Workerをterminateした後に古い探索結果が配送されない
- Workerが返す着手を`engine.js`で合法手として検証できる
- Worker入力の局面が変更されない
- 低性能／標準／高性能端末で探索上限が切り替わる

ブラウザ側では世代ID、探索開始時の局面キー、現在の局面キーを照合し、さらに適用直前に`engine.js`で合法性を検証する。Worker非対応または起動失敗時は同期探索へフォールバックする。

## Phase 4予備学習

最初の試行では学習用seed `41001`、検証用seed `42001`を分離し、3世代、各世代8候補、突然変異幅4でhill climbingを実行した。ただし後の監査で、同世代の候補ごとに異なるseed／openingを使っており、学習スコアを公平に比較できないことが判明した。holdout 20勝20敗という不採用判断は変わらないが、世代別学習スコアは参考値に格下げする。

```sh
node bao-la-kiswahili/tools/tune-weights.js --generations 3 --candidates 8 \
  --games 4 --validation-games 40 --training-seed 41001 \
  --validation-seed 42001 --step 4 --max-depth 1 \
  --opening-plies 4,8,12 --output /tmp/bao-weights.json
```

| 世代 | 学習スコア | 更新 |
| --- | ---: | --- |
| 1 | 50.0% | なし |
| 2 | 75.0% | あり |
| 3 | 62.5% | あり |

最終候補はmtajiの`frontSeeds`を2から6、`mobility`を3から7へ変更した。未使用seedの40局検証は20勝20敗、勝率50.0%、Wilson 95%下限35.2%だった。優位性がないため候補は不採用とし、既定重みは変更していない。

Phase 4完了条件の500局試験は、後述の`namua.houseValue: -7`候補で実施し、統計的優位を確認した。

### 公平性修正後の追加試験

全候補を世代内で同じseed／openingへ揃えた。

| 探索深度 | 学習条件 | 最終候補 | holdout |
| --- | --- | --- | ---: |
| 1 | 3世代×8候補、seed 51001 | namua `boardSeeds -3`、`relayShape 5`、mtaji `frontConnections 0` | seed 52001、20勝20敗（50.0%） |
| 2 | 2世代×6候補、seed 61001 | namua `houseValue 5` | seed 62001、21勝19敗（52.5%） |

深度2候補のWilson 95%下限は37.5%で、統計的優位はない。いずれも不採用とし、既定重みは変更していない。

### フェーズ別追加試験

ベンチマークにnamua／mtajiを指定した開始局面生成を追加し、チューナーには`--opening-phases`と`--mutate-phases`を追加した。これにより、対象フェーズの局面だけで対象フェーズの重みだけを変異できる。

| 対象 | 条件 | 学習結果 | holdout |
| --- | --- | --- | ---: |
| mtaji | 深度1、3世代×8候補、変異幅4 | 更新なし | 30勝30敗 |
| mtaji | 深度2、1世代×8候補、変異幅6 | 更新なし | 30勝30敗 |
| mtaji限定変異 | 深度2、2世代×8候補、変異幅6 | `relayShape: 1 → -5` | 29勝31敗 |
| namua限定変異 | 深度2、1世代×8候補、変異幅4 | 更新なし | 30勝30敗 |

また、`houseValue: 5`候補を初期値にした局所探索では`frontSeeds: 1 → 3`が選ばれたが、未使用seed 72001の60局は31勝29敗（51.7%）、Wilson下限39.3%だった。すべて不採用である。

### Successive halving追加試験

多数候補へ同じ局数を割り当てる代わりに、少数局で候補を段階的に削減する`successive-tune.js`を追加した。

| 対象 | 候補／ラウンド局数 | 最終学習 | holdout |
| --- | --- | ---: | ---: |
| namua、深度1、変異幅8 | 24候補、2→6→20局 | 55.0% | 26勝34敗（43.3%） |
| mtaji、深度1、変異幅8 | 24候補、2→6→20局 | 50.0% | 30勝30敗（50.0%） |
| namua、深度2、変異幅12 | 12候補、2→6→20局 | 60.0% | 26勝34敗（43.3%） |

深度2の最終候補はnamuaの`maxCapture: 8 → 20`、`houseValue: 1 → 25`だった。学習では改善して見えたがholdoutで反転したため不採用とした。早期ラウンド2局の選抜はノイズが大きく、次回は初期局数を増やす必要がある。

2026-07-07に`successive-tune.js`へ`--round-repeats`を追加した。初期ラウンドほど複数seed／openingで候補を評価し、平均スコアで選抜する。

短い実装確認:

```sh
node bao-la-kiswahili/tools/successive-tune.js --candidates 4 \
  --round-games 2,2 --round-repeats 2,1 --keep 0.5 \
  --validation-games 4 --training-seed 131001 --validation-seed 132001 \
  --step 4 --max-depth 1 --opening-plies 0,2 \
  --opening-phases namua --mutate-phases namua \
  --output /tmp/bao-successive-smoke.json
```

結果は検証4局で2勝2敗、Wilson 95%下限15.0%だった。これはCLIと集計処理の確認であり、正式候補としては扱わない。

次の正式探索候補:

```sh
node bao-la-kiswahili/tools/successive-tune.js --candidates 24 \
  --round-games 4,8,24 --round-repeats 3,2,1 --keep 0.5 \
  --validation-games 100 --training-seed 141001 --validation-seed 142001 \
  --step 8 --max-depth 1 --opening-plies 4,8,12 \
  --opening-phases namua --mutate-phases namua \
  --output bao-la-kiswahili/artifacts/ai-weights-successive.json
```

### Phase 4採用候補

複数seed版successive halvingにより、namuaの`houseValue`を`1`から`-7`へ変更する候補を得た。Phase 3基準重みは`artifacts/ai-weights-phase3.json`へ保存している。

探索条件:

```sh
node bao-la-kiswahili/tools/successive-tune.js --candidates 24 \
  --round-games 4,8,24 --round-repeats 3,2,1 --keep 0.5 \
  --validation-games 100 --training-seed 141001 --validation-seed 142001 \
  --step 8 --max-depth 1 --opening-plies 4,8,12 \
  --opening-phases namua --mutate-phases namua \
  --output bao-la-kiswahili/artifacts/ai-weights-successive.json
```

探索ラウンド:

| ラウンド | 候補数 | 生存数 | 局数／repeat | repeats | 最高学習スコア |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 24 | 12 | 4 | 3 | 75.0% |
| 2 | 12 | 6 | 8 | 2 | 68.8% |
| 3 | 6 | 3 | 24 | 1 | 58.3% |

500局検証:

| 条件 | 勝敗 | 勝率 |
| --- | ---: | ---: |
| seed 142001、opening 12 | 54勝46敗 | 54.0% |
| seed 142101、opening 12 | 55勝45敗 | 55.0% |
| seed 142201、opening 4 | 68勝32敗 | 68.0% |
| seed 142301、opening 8 | 51勝49敗 | 51.0% |
| seed 142401、opening 12 | 51勝49敗 | 51.0% |
| 合計 | 279勝221敗 | 55.8% |

合計500局のWilson 95%下限は51.4%で、統計的優位の判定条件を満たした。候補重みで戦術回帰テストも通過した。

```sh
env BAO_AI_WEIGHTS=bao-la-kiswahili/artifacts/ai-weights-successive.json \
  node bao-la-kiswahili/test/tactical.test.js
```

深度2の予備検証では100局で52勝48敗、勝率52.0%だった。悪化は確認されなかったが、この条件では統計的優位ではない。

## Phase 11：TT最善手優先の固定深度比較

Phase 2探索の既定着手順序を基準に、即時勝利の次にTTまたは前回反復深化の最善手を探索する`tt-first`候補を比較する。評価関数、探索深度、Quiescence深度は変更しない。

再実行コマンド:

```sh
node bao-la-kiswahili/tools/phase11-compare.js \
  --seed 20261000 --positions-per-phase 8 \
  --opening-plies 8 --opening-phases namua,mtaji \
  --max-depth 4 --candidate tt-first \
  --output bao-la-kiswahili/artifacts/phase11-tt-ordering.json
```

結果:

| 指標 | 既定順序 | TT最善手優先 |
| --- | ---: | ---: |
| 対象局面 | 16 | 16 |
| 最終着手一致 | - | 16/16 |
| 合計nodes | 6,465 | 5,401 |
| 合計quiescence nodes | 4,222 | 3,499 |
| node改善／悪化／同数 | - | 7／0／9 |
| node削減率 | - | 16.5% |

固定深度のため、elapsed timeではなくnodesと着手一致を主指標にする。実行順、JIT、CPU状態の影響を受けるelapsed timeはartifactへ診断値として残すが、採用根拠には使わない。

未使用seed確認:

```sh
node bao-la-kiswahili/tools/phase11-compare.js \
  --seed 20262000 --positions-per-phase 8 \
  --opening-plies 8 --opening-phases namua,mtaji \
  --max-depth 4 --candidate tt-first \
  --output bao-la-kiswahili/artifacts/phase11-tt-ordering-holdout.json
```

| 指標 | 既定順序 | TT最善手優先 |
| --- | ---: | ---: |
| 最終着手一致 | - | 16/16 |
| 合計nodes | 5,097 | 5,060 |
| node改善／悪化／同数 | - | 6／1／9 |
| node削減率 | - | 0.7% |

初回とholdoutを合わせた32局面の合計は11,562から10,461 nodesへの9.5%削減だった。ただし半数以上の局面でnode数が同じため局面別削減率の中央値は0%であり、未使用seedでは効果がほぼ消えた。採用条件を満たさないため、時間制限自己対戦へ進めず保留とする。`ttMoveFirst`の既定値は`false`を維持する。

## Phase 11：Quiescence捕獲順序

Quiescence Search内の捕獲手を、即時勝利、relay完了までの実捕獲量の順に並べる。通常探索の順序と評価関数は変更しない。

固定深度比較:

```sh
node bao-la-kiswahili/tools/phase11-compare.js \
  --seed 20261000 --positions-per-phase 8 \
  --opening-plies 8 --opening-phases namua,mtaji \
  --max-depth 4 --candidate q-capture \
  --output bao-la-kiswahili/artifacts/phase11-q-capture-ordering.json
node bao-la-kiswahili/tools/phase11-compare.js \
  --seed 20262000 --positions-per-phase 8 \
  --opening-plies 8 --opening-phases namua,mtaji \
  --max-depth 4 --candidate q-capture \
  --output bao-la-kiswahili/artifacts/phase11-q-capture-ordering-holdout.json
```

| 条件 | 着手一致 | 既定nodes | 候補nodes | 削減率 | 改善／悪化／同数 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 初回seed | 16/16 | 6,465 | 5,803 | 10.2% | 13／0／3 |
| holdout | 16/16 | 5,097 | 4,777 | 6.3% | 12／0／4 |
| 合計 | 32/32 | 11,562 | 10,580 | 8.5% | 25／0／7 |

局面別削減率の中央値は初回5.6%、holdout 3.0%である。多くの局面で小さく改善したが、採用条件の中央値10%削減には届かなかった。

100ms時間制限スモーク:

| 開始phase | 勝敗 | 候補平均深度 | 既定平均深度 | 候補／既定timeout |
| --- | ---: | ---: | ---: | ---: |
| namua | 両者1勝1敗2分 | 2.20 | 2.08 | 78／78 |
| mtaji | 両者2勝2敗 | 3.26 | 3.29 | 26／26 |

勝敗とtimeoutは同等だが、到達深度の改善はphase間で一貫しない。`orderQuiescenceCaptures`の既定値は`false`を維持し、候補は保留とする。

## Phase 11：history heuristic

quiet moveがalpha-beta cutoffを起こしたときに`depth²`を加点し、同じ手番の同種着手をkiller moveの後、静的評価の前へ並べる。

| 条件 | 着手一致 | 既定nodes | 候補nodes | 削減率 | 改善／悪化／同数 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 初回seed | 16/16 | 6,465 | 6,460 | 0.1% | 1／0／15 |
| holdout | 16/16 | 5,097 | 5,097 | 0.0% | 0／0／16 |

再実行時は`phase11-compare.js --candidate history`を使う。既存のkiller moveと静的順序へ追加しても探索木がほぼ変わらず、採用根拠がない。`historyHeuristic`の既定値は`false`を維持し、時間制限試験へ進めない。

## Phase 11：aspiration window

前回反復深化のroot評価を中心に固定幅の探索窓を設定し、fail-highまたはfail-lowなら全幅で再探索する。

| 条件 | 幅 | 着手一致 | 既定nodes | 候補nodes | node増減 | 全幅再探索 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 初回seed | 50 | 16/16 | 6,465 | 7,196 | +11.3% | 34 |
| holdout | 50 | 16/16 | 5,097 | 5,544 | +8.8% | 36 |
| 初回seed追試 | 100 | 16/16 | 6,465 | 7,206 | +11.5% | 診断のみ |
| 初回seed追試 | 200 | 16/16 | 6,465 | 6,956 | +7.6% | 診断のみ |

幅50は`phase11-compare.js --candidate aspiration --aspiration-window 50`で再実行できる。幅を広げても全幅再探索のコストを回収できず、すべて既定探索よりnode数が増えた。`aspirationWindow`の既定値は0を維持し、不採用とする。

## Phase 11：評価キャッシュ

同一探索内で、局面キーと評価視点が同じBao評価を再利用する。探索木、着手順序、評価値は変更しない。

固定深度4:

| 条件 | 着手一致 | 既定評価計算 | 候補評価計算 | 削減率 | cache hits |
| --- | ---: | ---: | ---: | ---: | ---: |
| 初回seed | 16/16 | 3,435 | 2,615 | 23.9% | 820 |
| holdout | 16/16 | 2,599 | 2,120 | 18.4% | 479 |

両条件ともnodesとQuiescence nodesは完全に一致した。比較ツールは局面ごとにbaseline先行とcandidate先行を交互にし、JITの実行順バイアスを緩和する。elapsed timeは初回で約13.0%、holdoutで約1.6%減少したが、環境変動があるため評価計算数を固定深度の主指標とする。

100ms時間制限スモーク:

| 開始phase | 候補勝敗 | 既定勝敗 | 候補平均深度 | 既定平均深度 | 候補／既定timeout |
| --- | ---: | ---: | ---: | ---: | ---: |
| namua | 1勝0敗3分 | 0勝1敗3分 | 2.28 | 2.21 | 78／77 |
| mtaji | 2勝2敗 | 2勝2敗 | 3.78 | 3.54 | 34／38 |

候補は同じ時間内でより多くのnodeを探索し、両phaseで平均到達深度が上がった。局数が少ないため採用判断には使わず、中規模時間制限検証へ進める。`evaluationCache`の既定値は現時点で`false`とする。

150ms中規模入口は、長時間プロセスの中断を避けるため4局ずつ2 chunkに分けた。

| 開始phase | 候補勝敗 | 既定勝敗 | 候補平均深度 | 既定平均深度 | 候補／既定timeout | 候補／既定最大時間 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| namua | 1勝0敗7分 | 0勝1敗7分 | 2.52 | 2.50 | 157／157 | 175.5／174.4ms |
| mtaji | 4勝4敗 | 4勝4敗 | 4.13 | 3.83 | 66／66 | 166.7／182.8ms |

候補はnamuaで評価要求15,832回のうち4,209回、mtajiで10,192回のうち3,431回をcache hitにした。候補はより深く探索したため評価要求自体は増えたが、実評価計算はnamua 11,623回で既定14,561回、mtaji 6,761回で既定7,992回より少なかった。

中規模入口では勝敗、timeout、最大時間の悪化を確認せず、特にmtajiの平均深度が上がった。次はhard相当450〜500ms、cache entry数、最大思考時間を確認する。長いベンチマークを直接連結すると実行環境側で出力前に終了したため、以降もchunkごとにJSONの完全性を検証して集計する。
