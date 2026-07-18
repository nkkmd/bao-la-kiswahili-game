# P003 11/13 ply有界終局の独立監査

生成日時: 2026-07-18T05:25:30.227Z

判定: `all-candidates-unresolved-through-13-ply`

AI評価器・alpha-beta・quiescenceを使わず、現ルールエンジンの合法手生成・遷移・終局判定だけで三値AND/OR探索を行った。各候補について、SouthとNorthのどちらが範囲内の終局勝ちを強制できるかを別々に判定した。

| horizon | 着手 | 三値結果 | South証明探索nodes | North証明探索nodes |
| ---: | --- | --- | ---: | ---: |
| 11 | `capture:namua:0:2:right:left::false` | unresolved | 6,084 | 8,300 |
| 11 | `capture:namua:0:2:left:right::false` (self-play win-count leader) | unresolved | 2,588 | 2,765 |
| 11 | `capture:namua:0:4:right:left::false` (consensus) | unresolved | 2,024 | 760 |
| 11 | `capture:namua:0:4:left:right::false` | unresolved | 489 | 479 |
| 13 | `capture:namua:0:2:right:left::false` | unresolved | 33,149 | 43,910 |
| 13 | `capture:namua:0:2:left:right::false` (self-play win-count leader) | unresolved | 13,686 | 13,966 |
| 13 | `capture:namua:0:4:right:left::false` (consensus) | unresolved | 10,265 | 3,768 |
| 13 | `capture:namua:0:4:left:right::false` | unresolved | 2,409 | 2,271 |

全4候補は11 plyでも13 plyでも`unresolved`だった。したがって、depth 11の評価値順位は短い強制終局の有無では説明できない。

Unresolved means neither player can force a terminal win within the bounded horizon. It is not a draw, an equal-position judgment, or a move ranking.

## 集計

- 11 ply: 4/4 unresolved、23,489 nodes、memo 10,717
- 13 ply: 4/4 unresolved、123,424 nodes、memo 55,776

## 完全性

- source sha256: `b85b3472755b00cda84f4e5b2b2f58d3e5f723e9d8af557e1e38c271520aac16`
- rules engine sha256: `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c`
- verification hash: `b269577e154d86b93ac1f3abcc8b72a1418f623a3b3f6f5605d55d2fafb4707c`
