# `PBAI-C017-PERFORMANCE-001` — 技術的不成立記録

実行run: [GitHub Actions #36410898125](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36410898125)  
事前確認: PASS  
正式性能結果: **なし**  
状態: **TECHNICAL-INVALID**

## 発生事象

事前確認ではAI-GEN4 release回帰、baseline/candidate pinned source、runner/aggregatorの構文検査がすべて成功した。8つのperformance shardは固定depth解析を開始したが、最初に選ばれた局面のwarm-upとpaired測定後、記録rowの組立時に`ReferenceError: warmupCandidateFirst is not defined`で停止した。実装内の変数名`warmCandidateFirst`と記録fieldの参照名が一致していなかった。

全shardが失敗し、Actions artifactは0件。runnerが完了rowを逐次保存しない設計だったため、開始済みsampleの個別timer値を回収できない。baseline/candidateの差、速度推定、信頼区間は生成されず、このrunから性能についての主張は行わない。

## seed扱いと次の工程

固定block `2026093001..2026093064`は全shardに割当て、各shardで測定を開始した。完了seed/samplesの完全な一覧を残せないため、block全体を**消費済み・再利用禁止**として扱う。バグを直してこのblockを再実行したり、部分的に穴埋めしたりしない。

次の試験には新しいidentityとfresh blockを使う。実行runnerはseed/sampleごとにatomic checkpointを書き、shardの`always()` artifact uploadで中断時点までの完了・進行状態が残ることを、performance実行前のpreflightで確認する。前試行とseed・結果・推定値は結合しない。
