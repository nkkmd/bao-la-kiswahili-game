# Bao la Kiswahili 定石研究

Version: 0.2.0
更新日: 2026-07-17

## 1. 現在の到達点

第一段階のうち、標準初期局面から4 plyまでの全数開局木、depth 1〜4、legacy／bao／bao-v2評価、完全性検証、初手・応手表の生成を完了した。さらに最有力初手を複数条件の推奨手で8 plyまで延長し、同じ8 ply葉で短時間MCTSのseed頑健性を検証した。

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

1. 8 ply主要系列から基準AIの継続自己対局を行い、探索評価と勝敗の整合性を確認する。
2. 層化した少数局面へMCTS iterationを増やして適用し、短時間MCTSの不安定性が探索不足か方式差かを分離する。
3. 捕獲、nyumba維持、強制系列のどれが評価差へ寄与するか局面特徴とPVで説明する。
4. 最大手数120／180と複数seedで結果の反転率を測る。

現時点の状態ラベルは、全4初手とも`screened`である。`provisional-joseki`、`validated`、`refuted`はいずれも未認定とする。

## 6. 8 ply候補系列の重点検証

`index 5 / left`を固定し、C0上位3手とbao depth 1〜4、legacy depth 2、bao-v2 depth 2の推奨手の和集合を各分岐点で保持した。生成木は1,932ノード、8 ply葉1,252件、ユニーク局面1,497件で、転置435件を検出した。

全8 ply葉を6条件で評価し、7,512評価を完走した。内部ノードは枝選択時に評価済みのため正式比較から除外し、葉だけを共有局面として比較した。

C0の保守的本線は次のとおりだった。

```text
1. takata  index 5 / left
2. capture index 4 / side left
3. capture index 2 / side right
4. capture index 4 / side left
5. capture index 4 / side left
6. capture index 2 / side right
7. capture index 0 / side left
8. capture index 4 / side right
```

内部着手キーを含む完全な系列は`doc/joseki/CANDIDATE_LINES.md`を参照する。

| 条件 | 保守的評価 | C0本線との一致 |
| --- | ---: | ---: |
| bao depth 1 | -162 | 2/8 |
| bao depth 2 | 38 | 8/8 |
| bao depth 3 | -229 | 8/8 |
| bao depth 4 | 65 | 4/8 |
| legacy depth 2 | 79 | 2/8 |
| bao-v2 depth 2 | 35 | 8/8 |

初手とNorthの第1応手は全6条件で一致した。3〜4 plyは4条件、5〜8 plyはbao depth 2、depth 3、bao-v2 depth 2の3条件が一致した。固定系列としての安定性は4 ply以降で低下するが、短い強制系列と局面条件の組として扱う仮説H6と整合する。

評価値の符号が深度間で反転し、depth 1とlegacyでは3 ply目から別系列となるため、現時点では`screened`を維持する。継続自己対局、MCTS、最大手数感度、戦術的説明を通過するまで`provisional-joseki`へ昇格させない。

Phase 4完全性監査:

- tree hash: `ab4d564df61213cdcc97a37d969bc2d3f33aa9dae9f3cc0a78848f303b8074fa`
- 8 ply葉1,252件、6条件、7,512評価
- 欠損0、partial 0
- tree、state、sequence、condition、source hashが一致
- 1,932局面、8,726合法手、8,726遷移の座席交換監査に合格

## 7. Phase 5 短時間MCTSスクリーニング

結果を見る前に、既存のscreeningプロファイルと同じMCTS強度を固定した。bao評価、evaluation playout方策、visitsによるroot選択、12 iteration、playout上限16手、3 seedを使用した。選択可能局面におけるphase2 bao depth 2との推奨手一致率60%以上、3 seed完全一致率70%以上、timeout 0を通過条件とした。

8 ply葉1,252件を各3 seedで評価し、3,756結果、45,000 simulationを完了した。合法手0の終局2局面は0 simulation、合法手1の65局面と合わせた67局面を一致率から除外した。

| 指標 | 結果 | 事前閾値 | 判定 |
| --- | ---: | ---: | --- |
| phase2推奨手一致率 | 26.7% | 60.0%以上 | 未達 |
| 3 seed完全一致率 | 8.4% | 70.0%以上 | 未達 |
| timeout | 0 | 0 | 合格 |

seed別phase2一致率は26.6%、26.8%、26.7%であり、seedによる平均値の偏りよりも、個々の局面で推奨手が分散する問題が大きかった。平均playout長は約15.45手で上限16手に近く、12 iterationでは各候補へ十分なvisitを配分できていない。選択された手の平均visit数も3.79に留まった。

したがって、この条件のMCTS結果は`unstable`とする。これは8 ply候補系列や初手`index 5 / left`の反証ではない。比較対象は候補木の8手そのものではなく、各8 ply葉からの次の推奨手であり、かつ短時間MCTSのseed内安定性が低いためである。候補初手は`screened`を維持し、次は合法手数と局面特徴で層化した少数局面に限定してiteration感度を調べる。

完全性監査:

- 1,252ノード、3,756評価、45,000 simulation
- 欠損0、partial 0、timeout 0
- source hash、tree hash、condition hashが一致
- tree hash: `ab4d564df61213cdcc97a37d969bc2d3f33aa9dae9f3cc0a78848f303b8074fa`
- verification hash: `8c2507cacfcf0cd85e0132c0b26f444ce3eb7c10fc465c78be1e47fd6f27952e`
- 詳細は`doc/joseki/MCTS_ROBUSTNESS.md`を参照
