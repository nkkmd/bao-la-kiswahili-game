# P003 depth 11 全候補値の統合結果

生成日時: 2026-07-18T02:15:47.895Z

判定: `depth-11-all-candidate-values-complete`

初回60秒上限で完了したrootと3候補に、唯一timeoutした候補の120秒限定再計測を統合した。4候補全ての固定子解析がdepth 10を完了し、rootのdepth 11推奨と候補順位が一致した。

| 順位 | 着手 | South値 | 再計測 | 上限ms | nodes | ms |
| ---: | --- | ---: | --- | ---: | ---: | ---: |
| 1 | `capture:namua:0:4:right:left::false` (consensus) | -45 | no | 60000 | 22861 | 16197.2 |
| 2 | `capture:namua:0:4:left:right::false` | -173 | no | 60000 | 19963 | 12812.9 |
| 3 | `capture:namua:0:2:right:left::false` | -295 | yes | 120000 | 95786 | 72025.8 |
| 4 | `capture:namua:0:2:left:right::false` (self-play win-count leader) | -302 | no | 60000 | 58380 | 49541.6 |

consensus手がSouth値-45で首位を維持した。自己対局勝数首位手は-257点下であり、depth 11でも推奨切替はない。

The retry changes the time limit for one child only. All searches otherwise use the same phase2, bao, quiescence-depth-1 configuration and deterministic seed scheme.

## 完全性

- root completed depth: 11
- completed candidates: 4
- retried candidates: 1
- root/top一致: yes
- source hash: `4ac83c5e9160b0705b04f384225a178e700c135130e193e9ba474ab3ba408499`
- input hash: `c47221c82389eaa3845974c6779f8b4c7391f29ced0f724f2f04cae292cfb1fc`
- verification hash: `43492bf42b101987a36ca8e2439dbd86a5412c132660567113248a293ddd1947`
