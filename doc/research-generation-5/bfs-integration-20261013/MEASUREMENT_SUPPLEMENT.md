# 子プロセスRSSの補助計測契約

初回[BENCHMARK.json](results/BENCHMARK.json)の12個の最大RSSはすべて170184704 byteだった。初回記録とsource manifestは保持する。OSのru_maxrssに親プロセス生成時の水準が残る可能性があるため、この値から方式間のメモリ差を判定しない。

RCBI-S0M-MEASUREMENT-2026-10-13-v1では同じ256/1024抽象fixture・同じ二方式・各3回を追加計測する。既存benchmarkコードを変更せず、終了時にLinux `/proc/self/status` のVmHWM/VmRSSとru_maxrssを併記するobserverを追加する。新規科学sourceは0件である。入力を[MEASUREMENT_MANIFEST.json](MEASUREMENT_MANIFEST.json)へ固定する。

補助値は各Nodeプロセス全体の計測で、BFSとserializationを含みjournal fsync・解法・既読集合読込を含まない。初回と補助の全行を保存し、好都合な試行だけを選ばない。VmHWMは共有ライブラリ等も含む高水位であり、RAW表だけのメモリではない。速度/RSS改善を合格条件や新規科学実行の根拠へ昇格しない。
