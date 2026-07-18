# P002 評価反転trace比較

生成日時: 2026-07-18T01:08:50.791Z

P002の両捕獲手について、6条件・12局の全保存局面を共通のbao深さ2で再評価した。以下は評価器の挙動を診断する相関的分析であり、単独の敗着や一般的な手の優劣を証明するものではない。

## 固定手直後の差

- alternative静的評価: 389
- consensus静的評価: 579
- alternative − consensus: -190
- legacy評価差: -146

| 特徴 | alternative | consensus | 寄与差 |
| --- | ---: | ---: | ---: |
| frontSafety | 0 | 5 | -40 |
| maxCapture | 3 | 0 | 24 |
| frontOccupied | 4 | 6 | -10 |
| frontSeeds | 11 | 20 | -9 |
| boardSeeds | 19 | 27 | -8 |
| frontConnections | 4 | 5 | -3 |
| relayShape | 6 | 3 | 3 |
| reserveEfficiency | 2 | 3 | -1 |

固定手直後、Northの合法応手はconsensus側が1手、alternative側が3手だった。保存継続で実際に選ばれた初回応手は、それぞれ1種類、1種類である。

## 条件別trace

| 条件 | 固定手 | 勝者 | 初期探索値 | 初期静的値 | 最初の探索負転 | 恒久探索負転 | 符号反転 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| bao-d1 | consensus | North | 474 | 579 | 15 | 43 | 19 |
| bao-d1 | alternative | South | 15 | 389 | 11 | なし | 20 |
| bao-d2 | consensus | North | 474 | 579 | 17 | 49 | 29 |
| bao-d2 | alternative | South | 15 | 389 | 11 | なし | 30 |
| bao-d3 | consensus | South | 474 | 579 | なし | なし | 0 |
| bao-d3 | alternative | North | 15 | 389 | 11 | 47 | 17 |
| bao-d4 | consensus | South | 474 | 579 | なし | なし | 0 |
| bao-d4 | alternative | South | 15 | 389 | 11 | なし | 30 |
| legacy-d2 | consensus | South | 474 | 579 | 17 | なし | 18 |
| legacy-d2 | alternative | South | 15 | 389 | 11 | なし | 22 |
| bao-v2-d2 | consensus | North | 474 | 579 | 17 | 49 | 29 |
| bao-v2-d2 | alternative | South | 15 | 389 | 11 | なし | 38 |

## 解釈

- consensus手直後は盤上石・前列石・前列安全性などの短期特徴が高く、静的bao評価で大きく先行する。phase2とMCTSの一致はこの局面形の差と整合する。
- alternative手は直後評価では劣るが、6継続中5勝した。したがって直後の形の優位は、相手応手後の長期的な終局結果を十分に代理していない。
- consensus敗戦3局で探索値が恒久的に負となるのは43/49 plyと遅い。alternative勝戦は11 plyで一度負転しても後に回復する。短期の符号や最初の反転だけでも終局を分類できない。
- consensus側はNorth応手が1手に強制されるが、それでも条件により勝敗が分かれた。原因を単一plyへ還元するより、捕獲後の前列安全性と長い強制応手列を次の特徴候補として扱う。
- この分析を根拠にalternative手を定石へ昇格しない。P002の事前cross-method基準を満たしていないためである。

## 完全性

- 対局trace: 12
- 再評価局面: 502
- 全終局state一致: yes
- summary hash: `76d1e8eff74a7c669e1043d1db79be81fe15d965055298509af6939beeadf7e0`
