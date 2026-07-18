# P003 depth 11 timeout枝の限定再計測

生成日時: 2026-07-18T02:13:13.600Z

判定: `depth-11-all-candidate-values-complete`

depth 11の4候補比較で唯一timeoutした非注目候補だけを、同じseed・探索設定のまま個別上限60秒から120秒へ延長した。rootと他3候補は再計算していない。

- move: `capture:namua:0:2:right:left::false`
- completed depth: 10
- timed out: no
- South score: -295
- nodes: 95786
- elapsed ms: 72025.8

This retry changes only the timed-out child limit from 60 to 120 seconds; the root and other child results remain the saved depth-11 results.

## 完全性

- child state hash match: yes
- source hash match: yes
- verification hash: `f1c5c2254a428a2ac2b081009a3545a34bd871d6e7c17d5c3ec4327a0bb02637`
