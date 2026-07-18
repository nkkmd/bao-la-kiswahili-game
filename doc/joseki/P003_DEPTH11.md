# P003 depth 11 追試

生成日時: 2026-07-18T02:06:40.853Z

判定: `root-complete-with-candidate-timeout`

P003のdepth 9〜10完了後、同じphase2・bao・quiescence depth 1でdepth 11を追試した。rootおよび各固定子局面は個別に60秒上限とした。

| depth | 状態 | 推奨 | root値 | 自己対局勝数首位−合意 | nodes | 合計ms |
| ---: | --- | --- | ---: | ---: | ---: | ---: |
| 11 | timed-out | consensus | -45 | -257 | 33286 | 162706.2 |

The depth-11 root and the focal consensus-versus-self-play-leader comparison completed, but one other fixed-child analysis timed out; the all-candidate comparison is incomplete.

root探索はdepth 11を完了してconsensus手を維持した。自己対局勝数首位手とconsensus手の固定子解析もdepth 10を完了し、値差は-257だった。一方、別の非合意手1件がdepth 9完了後に60秒timeoutとなったため、4候補全体の値比較は完了していない。

## 完全性

- completed depth: 11
- focal comparison complete: yes
- timed-out candidate: `capture:namua:0:2:right:left::false`
- timeout: 1
- source hash match: yes
- verification hash: `0900eff032d7dc018db21d00a80db0b9453a2f4ce21e26227ad4d3852527e0f6`
