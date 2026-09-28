# `PBAI-C017-v1` — 独立wall-clock性能検証契約

状態: **FROZEN BEFORE PERFORMANCE MEASUREMENT**  
固定日: 2026-09-28  
分類: **DEVELOPMENT-ONLY / UNINSTRUMENTED PAIRED PERFORMANCE VALIDATION**  
candidate: `PBAI-C017-v1`、開発合格記録[`C017_DEVELOPMENT_RESULT.md`](../../../artifacts/pbai-p14/C017_DEVELOPMENT_RESULT.md)  
baseline: `AI-GEN4-BASELINE-2026-09-28-v1` / commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
candidate source: commit `e9e98290d600bc342a748b80d4589473a0b5ac57`（development gate runのsource SHA）

## 1. 問い

計装なしで、同じfresh fixed-depth局面に対する`AI-GEN4`とdefault-offのままの`PBAI-C017-v1`をpaired実行し、探索深度を揃えたときのwall-clock所要時間を比較する。これは、開発gateで確認した`applyMove`呼出し削減が実際の1手解析時間に反映されるかを調べる検証である。

本試験は固定深度の処理時間を比較する。時間制限付き対局における探索深度増加、棋力向上、利用者環境上の速度、公開採用を直接判定しない。

## 2. 固定sourceと探索経路

- baselineは`git show 22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b:public/*`から読む。
- candidateは`git show e9e98290d600bc342a748b80d4589473a0b5ac57:public/*`から読む。試験用branchや作業tree上の別sourceへ暗黙に切り替えない。
- 既存release regressionを実行し、source SHA-256をartifactへ残す。許可された公開実装差分が`public/ai-candidate.js`のみであることを確認する。
- 実行経路は`BaoReleaseConfig.searchOptions("expert", {hardwareConcurrency: 4, deviceMemory: 4}, state)`から`BaoReleaseAI.analyzeMove`までとし、`PBAI-C015-v1`評価器を含む現行AI-GEN4 release adapterを通す。
- candidate側のみ`pbaiC017ReuseSearchTransitions: true`を指定する。baseline側には指定しない。他のsearch optionは両者で同一。
- 固定条件: expert、maxDepth 4、timeLimit Infinity、aspirationWindow 0、stableBestDepths 0。候補/基準は各局面で同じseed-derived random sourceを使う。
- 計測中はapplyMove counter、debug hook、coverage、CPU profiler等を使わない。時間は`stats.elapsedMs`を記録する。計測コードはAI内部へ注入しない。

## 3. fresh seedと局面選択

- seed block: **`2026093001..2026093064`**（64 seeds、独立検証専用）
- 2026-09-28のGitHub code searchで両端seed `2026093001` と`2026093064`は各0件。support blockおよびdevelopment blockを流用しない。
- baseline engineで各seedのdeterministic self-play prefixを最大128 ply生成し、最初のply 12以後のNamua局面を最大1件、最初のMtaji局面（variant数2以上）を最大1件採る。同seed由来の2局面を独立seedとして数えない。
- seedは全64件を処理し、欠測phase/sampleを追加seedや後からの選択で補わない。
- 出力はseedごと・phaseごとの選定局面、各反復時間、生データと全探索statsを保存する。

## 4. 反復・順序・集計

- 各局面についてbaselineとcandidateをそれぞれ1回warm-upし、warm-up時間をprimary endpointに含めない。warm-up実行順はseedとplyの偶奇で反転する。
- その後、各候補を**7回ずつ**測る。各反復ではbaseline/candidateの順序を`(seed + ply + repetition) % 2`で交互化する。
- 各局面でbaselineとcandidateの中央値を計算し、`log(candidateMedianMs / baselineMedianMs)`を求める。同seedに複数phaseがある場合はそのlog比をseed内で平均する。primary effectは全seedのseed-level log比平均を時間短縮率へ変換した値 `100 × (1 − exp(meanLogRatio))` とする。
- 95%区間はseed単位のcluster bootstrap 10,000回、固定bootstrap seed `26093001`のpercentile区間とする。1seedに属する両phaseをまとめてresampleする。
- 各baseline/candidate対応runでmove、rootScore、completedDepth、elapsedMsを除く全statsが一致し、depth 4完了・timeoutなしでなければtechnical failureとする。timer値だけが変化してよい。

## 5. 事前gateと判定

次をすべて満たす場合のみ`UNINSTRUMENTED-PERFORMANCE-PASS`:

1. Actions 8 shard、seed 64件を重複・欠落なく処理し、すべてのshard artifactを保存する。
2. 有効sampleは48局面以上、Namua 16局面以上、Mtaji 16局面以上で、各phaseは16 distinct seed以上から得る。
3. 全反復でbaseline/candidateの固定深度出力が一致し、depth 4完了・timeout 0。
4. 全timer値が有限で正。
5. primary point estimateの時間短縮が**3%以上**であり、seed-cluster bootstrap 95% CI下限が0%を上回る。
6. 全shardのsource hash、固定反復回数、seed coverageをaggregate jobが検証する。

gate 1〜4の失敗は`TECHNICAL-INVALID`。技術的に有効でもgate 2または5を満たさない場合は`NO-MATERIAL-WALL-CLOCK-IMPROVEMENT`として本A1の性能主張を停止する。result確認後のseed追加、depth・反復数・bootstrap・閾値変更、最速runだけの選別は行わない。部分実行はformal結果でない。

## 6. Actions中断対策と境界

GitHub Actions matrixを8 shard（各8 seed）、`fail-fast: false`、1 shardあたり60分timeoutで実行する。各shardは全run raw JSONを`always()` uploadし、8 shardすべて成功した場合だけcanonical aggregateを作る。途中停止・runner故障は部分artifactを保持してtechnical/incomplete扱いとし、未完了を不合格や対局結果に数えない。必要な再実行は失敗原因を調査してから未完了shardだけに限定する。新しいseedや既消費seedの差替えはしない。

本契約は未計装の固定深度wall-clock検証のみを許可する。時間制限付きstrength matchup、公開採用、main統合、production releaseは別の段階・判断として扱う。