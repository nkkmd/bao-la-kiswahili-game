# `PBAI-C017-PERFORMANCE-002` — 独立wall-clock性能検証契約

状態: **FROZEN BEFORE PERFORMANCE MEASUREMENT**  
固定日: 2026-09-28  
分類: **DEVELOPMENT-ONLY / UNINSTRUMENTED PAIRED FIXED-DEPTH TIMING**  
前試行: [`PBAI-C017-PERFORMANCE-001` 技術的不成立記録](../../../artifacts/pbai-p14/C017_PERFORMANCE_001_TECHNICAL_FAILURE.md)  
candidate: `PBAI-C017-v1`  
baseline: `AI-GEN4-BASELINE-2026-09-28-v1` / commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
candidate source: commit `e9e98290d600bc342a748b80d4589473a0b5ac57`

## 1. 問いと前試行からの変更

計装なしで、同じfresh fixed-depth局面に対するAI-GEN4とC017をpaired実行し、探索深度を揃えたwall-clock時間を比較する。前試行は全shardが最初の測定rowを組み立てる際のrunner変数名誤りで停止した。性能推定値やraw artifactは作られず、前blockは消費済み扱いとして再使用しない。

このrunではrunnerを修正し、開発用seedで測定・逐次checkpoint・aggregate前検査を行うpreflightを必須にする。各shardは開始時点からatomic checkpointを作り、warm-up・各paired repeat・sample完了・seed完了ごとに更新する。Actions `always()` uploadは成功/失敗を問わず最新checkpointを保存する。技術失敗時は部分状態を監査し、正式性能推定を出さない。

## 2. 固定sourceと探索経路

- baseline sourceはcommit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`、candidate sourceはcommit `e9e98290d600bc342a748b80d4589473a0b5ac57`から`git show`で固定読込する。
- regression suite、source SHA-256、公開実装差分が`public/ai-candidate.js`だけであることを確認する。
- 経路は`BaoReleaseConfig.searchOptions("expert", {hardwareConcurrency: 4, deviceMemory: 4}, state)`から`BaoReleaseAI.analyzeMove`まで。現行PBAI-C015評価器とAI-GEN4 release adapterを通す。
- candidate側のみ`pbaiC017ReuseSearchTransitions: true`。その他のoptionsは同一。
- 条件: expert、maxDepth 4、timeLimit Infinity、aspirationWindow 0、stableBestDepths 0。
- 計測中にapplyMove counter、debug hook、coverage、CPU profilerを使わない。`stats.elapsedMs`を記録する。
- 元のdevelopment block `2026092901..2026092964`からseed `2026092901`だけをpreflightで使う。preflightの数値は正式性能結果へ含めない。

## 3. fresh seedと局面選択

- seed block: **`2026100101..2026100164`**（64 seeds、PERFORMANCE-002専用）
- 2026-09-28のGitHub code searchで両端seed `2026100101` と`2026100164`は各0件。PBAI-P14の他blockと重複させない。
- baseline engineによるdeterministic self-play prefixを最大128 ply生成し、最初のply 12以後のNamua局面を1件、最初のMtaji局面（variant数2以上）を1件採る。
- 全64 seedを処理し、欠測phase/sampleを追加seedで補わない。同seed由来の2phaseは一つのclusterとして扱う。
- 1局面ごとに1 warm-upと7 paired measured repeatsを行う。warm-up順および各反復のbaseline/candidate順はPERFORMANCE-001と同じ固定counterbalance規則を使う。
- 各局面のvariant選択・乱数source・探索条件はbaseline/candidateで一致させる。各paired runでmove、rootScore、elapsedを除くstatsが完全一致しなければtechnical failure。

## 4. 集計とprimary endpoint

各局面で7回のbaseline時間、candidate時間の中央値を取り、`log(candidateMedianMs / baselineMedianMs)`を計算する。同seedに複数phaseがあればseed内平均を取る。primary endpointはseed-level log比の平均から得る相対elapsed削減率:

`100 × (1 − exp(meanLogRatio))`

95%区間はseedをclusterとして10,000回resampleするpercentile bootstrap。固定bootstrap seedは`26093001`。同seed内のphaseを分割してresampleしない。

## 5. 事前gate

次をすべて満たした場合のみ`UNINSTRUMENTED-PERFORMANCE-PASS`:

1. preflightで固定baseline/candidate読込、既存回帰、同値性smoke test、計測・aggregate syntax、checkpoint完了検査がPASSし、PERFORMANCE seedに触れない。
2. 8 shardがすべて`COMPLETE`、seed coverageが正確、重複なし。全shardに途中checkpoint artifactが残る。
3. 48局面以上、Namua 16局面以上、Mtaji 16局面以上。各phaseは16 distinct seed以上に由来。
4. 各局面のwarm-upと7 paired repeatsが記録され、全反復で固定depth出力が一致、depth 4完了、timeoutなし。
5. すべての測定timer値が有限で正。
6. 推定時間短縮が3%以上、seed-cluster bootstrap 95% CI下限が0%より大きい。
7. baseline/candidate source hashがshard間で一致し、唯一の公開実装差分が`ai-candidate.js`。

1または2〜5の技術条件未達は`TECHNICAL-INVALID` / `TECHNICAL-INCOMPLETE`。有効実行でsample gateや6を満たさない場合は`NO-MATERIAL-WALL-CLOCK-IMPROVEMENT`とし、A1性能主張を停止する。結果後のseed追加、再利用、反復数・depth・bootstrap・閾値の変更、run選別はしない。

## 6. Actions中断対策と境界

GitHub Actionsで8 matrix shard（各8 seeds）、`fail-fast: false`、最大4 shard同時、各shard timeout 60分とする。checkpoint JSONはatomic renameで定期保存し、shard jobは`always()` artifact uploadする。canonical aggregateは全8 shardが正常完了した場合だけ作る。失敗runの部分checkpointは進捗/技術監査専用で、formal endpointへ混ぜない。途中停止後にformal判定を完成する必要があっても、消費seedを黙って再実行せず、状態とidentityを確認して別計画を立てる。

この契約は固定深度wall-clock性能のみを評価する。時間制限付き棋力比較、公開採用、main統合、production releaseは別段階の判断とする。