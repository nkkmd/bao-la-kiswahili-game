# Bao AI artifacts

このディレクトリは、自己対戦チューナーの出力や一時的な候補重みなど、公開用の静的ファイルと分けて保存したい成果物を置く場所です。

既定のチューナー出力:

- `ai-weights-tuned.json`
- `ai-weights-successive.json`
- `phase9-tune.json`: Phase 9自己対戦チューニングv2の候補選抜レポート
- `phase9-promoted/`: Phase 9で500局級の最終確認へ進める候補重み
- `phase9-longrun.json`: Phase 9最終確認をchunk単位で集計したレポート
- `phase9-decision.json`: Phase 9最終確認結果の採用判定レポート
- `phase9-tune-smoke.json`: Phase 9軽量候補選抜スモーク
- `phase9-smoke-decision.json`: Phase 9軽量候補選抜の判定
- `phase9-longrun-smoke.json`: Phase 9 longrun chunk 1のスモーク集計
- `phase9-longrun-smoke-decision.json`: Phase 9 longrun chunk 1の判定
- `phase9-tune-medium.json`: Phase 9中規模候補探索レポート
- `phase9-promoted-medium/`: Phase 9中規模探索でlongrunへ進める候補重み
- `phase9-longrun-medium-candidate-02.json`: Phase 9中規模候補`candidate-02`の500局longrun
- `phase9-longrun-medium-candidate-02-decision.json`: Phase 9中規模候補`candidate-02`の採用判定
- `phase9-longrun-medium-candidate-11.json`: Phase 9中規模候補`candidate-11`の500局longrun
- `phase9-longrun-medium-candidate-11-decision.json`: Phase 9中規模候補`candidate-11`の採用判定
- `phase9-tune-full.json`: Phase 9本格探索レポート

比較用に保存している基準重み:

- `ai-weights-phase3.json`: Phase 4採用前のBao評価重み

Phase別の測定出力:

- `phase8-hard-smoke.json`: Phase 8のhard 500ms級スモーク比較
- `phase8-expert-smoke.json`: Phase 8のexpert 1.5秒級スモーク比較
- `phase8-hard-medium.json`: Phase 8のhard 500ms級中規模入口比較
- `phase8-expert-medium.json`: Phase 8のexpert 1.5秒級中規模入口比較
- `phase8-expert-final.json`: Phase 8のexpert 1.5秒級最終確認
- `phase11-tt-ordering.json`: Phase 11のTT最善手優先・固定深度局面比較
- `phase11-tt-ordering-holdout.json`: Phase 11のTT最善手優先・未使用seed確認
- `phase11-q-capture-ordering.json`: Phase 11のQuiescence捕獲順序・固定深度比較
- `phase11-q-capture-ordering-holdout.json`: Phase 11のQuiescence捕獲順序・未使用seed確認
- `phase11-q-capture-time-namua.json`: Phase 11のQuiescence捕獲順序・namua時間制限スモーク
- `phase11-q-capture-time-mtaji.json`: Phase 11のQuiescence捕獲順序・mtaji時間制限スモーク
- `phase11-history-ordering.json`: Phase 11のhistory heuristic・固定深度比較
- `phase11-history-ordering-holdout.json`: Phase 11のhistory heuristic・未使用seed確認
- `phase11-aspiration.json`: Phase 11のaspiration window・固定深度比較
- `phase11-aspiration-holdout.json`: Phase 11のaspiration window・未使用seed確認
- `phase11-eval-cache.json`: Phase 11の評価キャッシュ・固定深度比較
- `phase11-eval-cache-holdout.json`: Phase 11の評価キャッシュ・未使用seed確認
- `phase11-eval-cache-time-namua.json`: Phase 11の評価キャッシュ・namua時間制限スモーク
- `phase11-eval-cache-time-mtaji.json`: Phase 11の評価キャッシュ・mtaji時間制限スモーク

採用済みの評価重みの正本は`../public/ai-weights.js`です。このディレクトリ内のJSONは検証候補として扱います。
