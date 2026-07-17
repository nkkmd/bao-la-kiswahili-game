# Bao la Kiswahili 定石研究

Version: 0.3.0
更新日: 2026-07-18

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

1. 新候補`index 5 / right`についてNorthの全合法第2手を固定し、応手別の最悪終局結果を測る。
2. bao depth 3・4で新候補が敗れる系列を追跡し、深度差と評価ホライズンを分離する。
3. 最悪応手評価と自己対局方策が選ぶ応手の不一致を、全応手固定継続で解消する。
4. 低分岐以外のMCTSではcandidate制限・priorを再設計してから再評価する。

現時点では旧候補`index 5 / left`を現行主要候補として`refuted`、新首位`index 5 / right`を`unresolved`とする。これは現在のAI比較内の判定で、理論的な劣等手・最善手の証明ではない。`provisional-joseki`と`validated`はいずれも未認定である。

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

## 8. MCTS iteration感度試験

短時間MCTSの不安定性がiteration不足だけで説明できるかを調べるため、8 ply葉を合法手数2〜4、5〜7、8以上と、強制捕獲／混合の組合せで6層に分けた。各層からtree hashと固定saltによるhash順で4局面を抽出し、計24局面を結果確認前に固定した。同じ3 seedで12、48、192 iterationを比較した。

事前判定は、192 iterationのseed完全一致率50%以上、12から192 iterationの改善20ポイント以上、timeout 0とした。

| iteration | seed完全一致率 | phase2一致率 | 選択手平均visit |
| ---: | ---: | ---: | ---: |
| 12 | 8.3% | 29.2% | 3.32 |
| 48 | 12.5% | 31.9% | 15.47 |
| 192 | 25.0% | 31.9% | 58.19 |

iteration増加でseed一致は改善したが、192 iterationでも25.0%、改善幅16.7ポイントに留まり、両事前閾値へ届かなかった。phase2一致率も31.9%で頭打ちになったため、全体の差を短時間MCTSの探索不足だけで説明できない。

ただし層別には明瞭な差があった。192 iterationで合法手2〜4の強制捕獲層は4/4局面が3 seed完全一致となった。一方、合法手5〜7の両層と合法手8以上の強制捕獲層は0/4だった。MCTSの頑健性は捕獲の有無だけでなくroot分岐数へ強く依存する。

この結果から、現在のMCTSを全8 ply葉へ一律に適用する方法は`unstable`を維持する。低分岐の強制捕獲局面については局面パターン検証の補助証拠として使用できる可能性があるが、高分岐局面ではさらにiterationを増やす前にcandidate制限、prior、探索方式の設計を見直す。候補初手`index 5 / left`の状態は引き続き`screened`とする。

完全性監査:

- 6層、24局面、216評価、18,144 simulation
- 欠損0、partial 0、timeout 0
- source hash、tree hash、sample hash、condition hashが一致
- sample hash: `a91c13a9493364e2690be7c2e794978de6de1df48fed1ebfc92d9117279d56b6`
- verification hash: `f4532f85981284b35faa695bec9c88cebb41dca43e799bc465ddc0811c5b9c3d`
- 詳細は`doc/joseki/MCTS_SENSITIVITY.md`を参照

## 9. Phase 6 局面パターン横断集計

候補木の全8 ply葉1,252件について、C0評価、6 phase2条件の推奨手、3 seed短時間MCTS、合法手数、強制捕獲、nyumba所有、盤上・前列・nyumba石差を同じnode IDで結合した。終局2局面を除く1,250局面でC0評価との関係を調べた。

分岐数が増えると探索方式内の推奨手安定性が低下した。強制捕獲局面のphase2全6条件一致率は合法手2〜4で34.0%、5〜7で23.2%、8以上で16.7%だった。短時間MCTSの3 seed一致率は同じ順に15.5%、2.6%、2.1%だった。iteration感度試験で低分岐強制捕獲層だけが192 iterationで収束した結果と整合する。

C0評価とのSpearman順位相関は、South−Northの盤上石差が0.53、前列石差が0.45、nyumba石差が0.27、合法手数が0.07だった。石差は評価順位と関連する一方、合法手数は評価値そのものより推奨手の安定性に関係している。mate相当値を含むためPearson相関は0.10以下であり、線形な効果量として解釈しない。

nyumba所有別のC0中央値はSouthのみ所有234、両者所有221、両者なし180、Northのみ所有98.5だった。Southのみ所有群の正値率は97.3%だったが、C0 -292を含む負評価反例が存在する。逆にSouthがnyumbaを失った局面にもmate相当値やC0 605の正評価例があり、nyumba維持だけを推奨原則にはできない。

現段階で再利用可能な原則候補は次のように限定する。

1. 盤上石差、とくに前列石差はC0評価順位の説明候補になる。
2. 合法手数は局面価値の直接指標ではないが、探索結果の頑健性を左右する。
3. nyumba維持は有利群と関連するが、石差・強制捕獲系列・具体的応手を伴う条件付き原則として扱う。
4. 強制捕獲という分類だけでは不十分で、root分岐数を必ず併記する。

これらは記述統計であり因果関係ではない。反例局面と完全な群別集計は`doc/joseki/POSITION_PATTERNS.md`、機械可読結果は`artifacts/joseki-study/summaries/position-patterns-summary.json`に保存した。状態は`descriptive-patterns`とし、暫定定石認定には使用しない。

完全性監査:

- tree 1,252葉、C0評価あり1,250件
- Phase 4 verification hash: `d962e21c278aca860f9c0ebf35c8370613395ba2205a3f138302307d24693d68`
- MCTS verification hash: `8c2507cacfcf0cd85e0132c0b26f444ce3eb7c10fc465c78be1e47fd6f27952e`
- analysis hash: `5f3e6ab8c84ae5f124ed73fdf0cb0d852ae33bb9ef93d9bf69dbe0856abd677b`

## 10. 主要系列からの継続自己対局

Phase 4の6条件が選んだ8 ply principal leafを重複除去すると3局面だった。この3局面から、bao depth 1〜4、legacy depth 2、bao-v2 depth 2を両側へ同一適用して自己対局し、最大120手と180手を比較した。合計36局である。

結果確認前に、180手終局率75%以上、8 ply評価符号と勝者の一致率60%以上、120→180手の勝者反転率10%以下を整合基準とした。

| 最大手数 | 対局 | South勝 | North勝 | 打切り | 終局率 | 評価符号・勝者一致 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 120 | 18 | 8 | 10 | 0 | 100.0% | 44.4% |
| 180 | 18 | 8 | 10 | 0 | 100.0% | 44.4% |

全局が120手以内に終局したため、最大手数180への延長による変化はなく、勝者反転率は0%だった。一方、評価符号と勝者の一致は8/18、44.4%で事前閾値へ届かなかった。legacy depth 2だけは3/3で一致したが、bao depth 1〜4とbao-v2 depth 2はいずれも1/3だった。

C0本線の8 ply葉はSouth視点+38だったが、C0自己対局ではNorthが62 plyでfront-empty勝ちした。したがって、現在の浅い探索評価の符号を長期勝敗の予測として解釈する方法は`inconsistent`と判定する。

この試験は候補初手と他の3初手を同一方策で直接比較していないため、`index 5 / left`の相対的な初手順位を反証するものではない。候補は`screened`を維持するが、勝敗整合性を根拠とした昇格はできない。次の勝敗試験では全4初手を共有応手・共有継続方策で対比較する必要がある。

完全性監査:

- principal leaf 3局面、6条件、2最大手数、36局
- 全1,960継続着手を合法手から再適用し、最終state hashと勝者を照合
- 欠損0、partial 0、timeout 0
- corpus hash: `37b68473e265c735f0cc41e97a219dc63db36f4d4f8367df266288f440f8259c`
- verification hash: `49a646e263e3aa6ca3eeebe76fc4b3e87f73f1ab304c00c6139ec1b2eb46e15a`
- 詳細は`doc/joseki/CONTINUATION_RESULTS.md`を参照

## 11. 全4初手の継続比較とPhase 7

旧C0候補の相対順位を最終勝敗で検証するため、標準初期局面の合法4初手をそれぞれ指した直後から、bao depth 1〜4、legacy depth 2、bao-v2 depth 2を両側へ同一適用した。前試験の全局が120 ply以内に終局したため上限を120 plyに固定し、計24局を実行した。

結果確認前に、旧C0候補のSouth勝数が他の全初手以上なら相対支持、6条件中4勝以上なら絶対支持と定義した。

| 順位 | 初手 | South勝 | North勝 | 打切り |
| ---: | --- | ---: | ---: | ---: |
| 1 | `index 5 / right` | 3 | 3 | 0 |
| 2 | `index 6 / left` | 1 | 5 | 0 |
| 3 | `index 6 / right` | 1 | 5 | 0 |
| 4 | `index 5 / left`（旧C0） | 0 | 6 | 0 |

旧C0候補は相対支持・絶対支持の両方に失敗した。短期探索では2・4 plyの基準順位第1位だったが、終局までの共通条件比較では全条件でNorth勝となったため、現行の主要候補としては`refuted`へ変更する。ただし、人間対局や完全探索に対する理論的反証ではない。

bao depth 2のC0対局を全48局面で再評価すると、South視点の深さ2探索値は符号を13回、静的評価は19回反転した。探索値の最初の正→負反転は5 plyだが回復を繰り返し、25 ply到達後に負のままとなった。単独の早期敗着というより、浅い評価の振動と長期脅威の取り逃しが主要な診断結果である。

新しい比較首位`index 5 / right`も3勝3敗に留まり、事前の絶対支持基準4/6を満たさない。このためPhase 7では[J001](joseki/openings/J001.md)を`unresolved`候補として記録し、[未解決系列](joseki/UNRESOLVED_LINES.md)に全応手固定継続、深度3・4の敗因、応手定義の不一致を登録した。暫定定石は認定しない。

完全性監査:

- 4初手、6条件、24局、全局120 ply以内に終局
- 1,399継続着手を合法手から再適用し、最終state hashと勝者を照合
- 欠損0、partial 0、timeout 0
- verification hash: `7cb5632e7afd4afb759d3e0f3cd1fe9ad4bde5457daae6e3cc022d1c675a2173`
- C0 trace: 48局面、trace hash `3fde4f65cab0f616935e3e29b76b0c416d54a9df4ba218625f817d1a4073167d`
- 詳細は`doc/joseki/FIRST_MOVE_CONTINUATIONS.md`と`doc/joseki/C0_LOSS_ANALYSIS.md`を参照
