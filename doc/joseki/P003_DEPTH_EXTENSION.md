# P003 depth 9〜10 延長

生成日時: 2026-07-18T01:44:34.376Z

判定: `no-terminal-best-switch-through-completed-depth`

P002がdepth 8で終局勝ちを検出したため、未解決のP003だけをdepth 9〜10へ延長した。候補値差はterminal-best − consensusである。

`terminal-best`は近似自己対局6条件の勝数首位手を表す内部名であり、真の最善手を意味しない。

| depth | 状態 | 推奨 | root値 | 候補値差 | nodes | ms |
| ---: | --- | --- | ---: | ---: | ---: | ---: |
| 9 | complete | consensus | 0 | -260 | 7899 | 33588.6 |
| 10 | complete | consensus | 237 | -198 | 16037 | 72699.8 |

最深完了depthは10、terminal-bestへの切替は観測なし。より深いdepthでの切替を否定しない。

## 完全性

- 記録: 2/2
- timeout: 0
- verification hash: `f38735dfe924ff0f2467dc552df8e23d6c16cf9094d3e9bd10fdfd9176dce94d`
