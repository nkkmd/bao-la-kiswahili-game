# Bao la Kiswahili 定石研究

Version: 0.1.0
更新日: 2026-07-17

## 1. 現在の到達点

第一段階のうち、標準初期局面から4 plyまでの全数開局木、depth 1〜4、legacy／bao／bao-v2評価、完全性検証、初手・応手表の生成を完了した。

標準初期局面にはSouthの合法初手が4通りあり、その後のNorthの合法応手は合計14通りだった。rootを含む19局面、18辺を生成し、転置はなかった。12 AI条件で全19局面を評価したため、評価結果は228件である。

4 plyへ全数拡張すると、ply別系列数は1、4、14、38、124、合計181ノードとなった。ユニーク局面は176件で、5件の転置を検出した。全181局面を同じ12条件で評価し、2,172評価を完了した。

## 2. 初手スクリーニング結果

基準条件C0はphase2探索、bao評価、depth 2とした。各初手についてNorthの全合法応手後局面を評価し、South視点の最小探索評価を最悪応手評価とした。

| 順位 | South初手 | C0最悪応手評価 | North最善応手 | depth 1〜4上位3 | depth 2評価方式上位3 |
| ---: | --- | ---: | --- | ---: | ---: |
| 1 | `index 5 / left` | 184 | `index 4 / side right`のcapture | 4/4 | 3/3 |
| 2 | `index 6 / left` | 59 | `index 4 / side right`のcapture | 2/4 | 3/3 |
| 3 | `index 5 / right` | 11 | `index 6 / right`のtakata | 3/4 | 3/3 |
| 4 | `index 6 / right` | 2 | `index 6 / right`のtakata | 3/4 | 0/3 |

内部着手表現を含む完全な表は`doc/joseki/OPENING_INDEX.md`、機械可読な条件別順位と全応手評価は`artifacts/joseki-study/summaries/phase-1-summary.json`に保存した。

## 3. 解釈

`index 5 / left`はC0で最も高い保守的評価を持ち、baoの全4深度で上位3から外れず、depth 2の全3評価方式でも上位3だった。このため、第一次の最有力な`screened`候補とする。

ただし、これは暫定定石の認定ではない。bao評価の最上位初手はdepth 1で`index 5 / right`、depth 2と4で`index 5 / left`、depth 3で`index 6 / right`となった。最悪応手評価の符号も深度によって変化しており、浅い探索評価を絶対的な局面価値として解釈できない。継続自己対局、最大手数感度、MCTS、6〜8 plyの主要変化、戦術説明が未完了である。

`index 6 / right`はC0平均応手評価が第2位である一方、最悪応手評価では最下位となった。平均値だけでは特定応手への脆弱性を見落とす例であり、仮説H2を今後検証する具体例になる。

4 ply木をC0でminimax集計しても、`index 5 / left`が最悪時評価139で第1位だった。以下は`index 6 / right`が2、`index 5 / right`が-7、`index 6 / left`が-74だった。最有力初手は2 plyスクリーニングと一致したが、他3手の順位は変化した。最悪応手は`index 4 / side right`のcapture、その後のSouth最善継続は`index 2 / side right`のcaptureだった。この系列は次段階の重点検証対象とする。

## 4. 完全性監査

- tree hash: `290189b74fbde08b3560f8f1f03df2cfc41916545d0df0d5530de305f77eb5b0`
- 19ノード、18辺、228評価
- 欠損0、重複条件0、partial 0
- 局面hash、系列hash、条件設定hash、source hashが一致
- 確定済み座席交換変換Dで19局面、56合法手、56遷移が完全一致
- 同一入力から同一tree hashを生成するテストに合格
- 完了済み結果の再利用とpartial拒否のテストに合格
- 4 ply: 181ノード、180辺、2,172評価、partial 0
- 4 ply座席交換監査: 181局面、585合法手、585遷移が完全一致
- 4 ply tree hash: `6ece7c3558585325128c7acb0ab5fba028d8353720b534448c964b4aaad44c5c`

## 5. 次の研究課題

1. 各2 ply局面から基準AIの継続自己対局を行い、最悪応手評価と勝敗の整合性を確認する。
2. 初手4通りを共有開始局面としてdepth、評価方式、MCTS条件で比較する。
3. `index 5 / left`の主要応手4通りを4〜8 plyへ延長する。
4. 捕獲、nyumba維持、強制系列のどれが評価差へ寄与するか局面特徴とPVで説明する。
5. 最大手数120／180と複数seedで結果の反転率を測る。

現時点の状態ラベルは、全4初手とも`screened`である。`provisional-joseki`、`validated`、`refuted`はいずれも未認定とする。
