# 8 ply葉 MCTS頑健性試験

生成日時: 2026-07-17T14:42:56.975Z

判定: `unstable`

同一の8 ply葉局面をphase2 bao depth 2とseed付きMCTSで比較した。合法手が1つしかない強制手局面は一致率から除外した。

## 事前固定条件

- seed数: 3
- iteration: 12
- playout上限: 16手
- phase2一致率閾値: 60.0%
- 3 seed完全一致率閾値: 70.0%

## 結果

- 全葉: 1252（強制手 67、選択あり 1185）
- phase2推奨手との一致: 26.7%
- seed間完全一致: 8.4%
- timeout: 0
- 完全性: 合格

| seed | phase2一致 | 平均playout手数 / simulation |
| --- | ---: | ---: |
| mcts-s1 | 26.6% | 15.47 |
| mcts-s2 | 26.8% | 15.44 |
| mcts-s3 | 26.7% | 15.45 |
