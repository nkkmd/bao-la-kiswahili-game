# Bao la Kiswahili 定石研究

Version: 0.10.0
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

1. P002・P003の固定局面で探索depthを段階的に増やし、終局首位へ切り替わるhorizonを測る。
2. depth増加でも切り替わらない場合、評価関数と探索horizonの寄与を分離する交差条件を設ける。
3. 独立seed・別低分岐局面で切替depthまたは不一致の再現性を確認する。
4. 低分岐以外のMCTSではcandidate制限・priorを再設計してから再評価する。

現時点では全4初手が応手頑健性基準に未達で、標準初期局面の一般定石候補はない。これは現在のAI比較内の判定で、理論的な劣等手・最善手の証明ではない。`provisional-joseki`と`validated`はいずれも未認定である。

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

## 12. J001の全North応手固定継続

全4初手比較で首位だったJ001 `index 5 / right`について、直後のNorth合法応手4通りを一つずつ固定し、bao depth 1〜4、legacy depth 2、bao-v2 depth 2を両側へ適用した。4応手×6条件の24局である。

結果確認前に、全24局の終局・再生一致、各応手でSouth 3/6勝以上、全体でSouth 12/24勝以上を`response-robust-screening`条件とした。この試験単独では定石への昇格を行わない。

| North応手 | South勝 | North勝 | 打切り |
| --- | ---: | ---: | ---: |
| `index 5 / left` | 0 | 6 | 0 |
| `index 6 / right` | 1 | 5 | 0 |
| `index 6 / left` | 2 | 4 | 0 |
| `index 5 / right` | 4 | 2 | 0 |

全体はSouth 7勝、North 17勝で、各応手最低は0/6勝だった。完全性条件には合格したが、二つの勝敗条件に失敗したため`response-sensitive`と判定する。North `index 5 / left`は6条件すべてでNorth勝となり、J001を一般的な初手候補として扱うための明確な反例になった。このためJ001を`unresolved`から現行候補として`refuted`へ変更する。

Phase 1の短期評価がNorth `index 5 / left`を最悪応手としたのはbao depth 3だけだった。他5条件は別の応手を短期最悪としたため、人間向け定石ページの「主要応手」は全応手固定継続の最終勝敗を優先し、短期探索値を補助指標とする。

完全性監査:

- 4応手、6条件、24局、全局120 ply以内に終局
- 固定したNorth応手を含む1,413着手を再適用し、最終state hashと勝者を照合
- 欠損0、partial 0、timeout 0
- verification hash: `ac7a963a3dc95b98f2cab301beaccee7594c693334ada49d28619be68ae5326f`
- 詳細は`doc/joseki/J001_REPLY_RESULTS.md`を参照

## 13. 全4初手・全14 North応手の固定継続

J001以外の3初手について残る10個の合法North応手後局面を、同じ6条件で60局追加評価した。J001の既検証24局は同一の条件設定・seed規則・source hashを確認して再利用し、全14応手後局面・84局へ統合した。

結果確認前に、初手順位を「最悪応手でのSouth勝数、全応手合計South勝数、Phase 1順位」の順で定義した。各応手でSouth 3/6勝以上、かつ全応手合計50%以上を`response-robust-screening`条件とした。

| 順位 | South初手 | 最悪応手South勝 | 合計South勝 | South率 | 判定 |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | `index 6 / right` | 2/6 | 14/24 | 58.3% | response-sensitive |
| 2 | `index 5 / left` | 1/6 | 11/24 | 45.8% | response-sensitive |
| 3 | `index 6 / left` | 1/6 | 3/12 | 25.0% | response-sensitive |
| 4 | `index 5 / right` | 0/6 | 7/24 | 29.2% | response-sensitive |

4初手すべてが応手別最低勝数の基準に未達し、判定は`no-response-robust-candidate`となった。最上位の`index 6 / right`は合計では過半数を超えたが、North `index 5 / right`固定時に2/6勝で、一般推奨に必要な応手耐性を満たさなかった。

これにより、標準初期局面の単一初手を一般定石として選ぶ第一次路線を終了する。負の結果は「どの初手も理論的に悪い」という意味ではなく、現在の決定論的AI条件では相手応手を無視した単一推奨を支持できないという意味である。次は最上位初手と最悪応手を組にした2 ply局面、および低分岐強制捕獲局面を条件付きパターンとして研究する。

完全性監査:

- 4初手、全14合法North応手、6条件、84局
- 新規60局、検証済みJ001 24局を統合
- 全84局が120 ply以内に終局
- 固定North応手を含む4,931着手を再適用し、最終state hashと勝者を照合
- 欠損0、partial 0、timeout 0
- verification hash: `ab72da9337d3bf255522772931af9c057819127cc0b94d32a9cec483be0160f0`
- 詳細は`doc/joseki/ALL_REPLY_RESULTS.md`を参照

## 14. 条件付き局面P001の全第3手比較

全応手比較で最上位だったSouth `index 6 / right`と、その最悪応手North `index 5 / right`の後を、最初の条件付き局面P001とした。P001はnamua、South手番、両者reserve 21・nyumba所有、捕獲手なし、両者合法手4、South視点静的bao評価-3である。

Southの合法第3手4通りを固定し、同じ6条件で24局を終局まで継続した。結果確認前に、South勝数が単独または同率首位かつ4/6勝以上を条件付き候補基準とした。

| South第3手 | South勝 | 自然推奨条件数 | 判定 |
| --- | ---: | ---: | --- |
| `index 7 / right` | 3/6 | 0/6 | screened-out |
| `index 5 / left` | 2/6 | 5/6 | screened-out |
| `index 5 / right` | 1/6 | 1/6 | screened-out |
| `index 7 / left` | 1/6 | 0/6 | screened-out |

首位手も絶対基準4/6に届かず、判定は`no-conditional-candidate`となった。また、6条件中5条件が自然選択した`index 5 / left`は2/6勝で、自然推奨されなかった`index 7 / right`の3/6勝を下回った。短期推奨一致を条件付き定石の根拠にできない具体的反例である。

この非捕獲4分岐系列は第4手へ延長しない。次はPhase 6とMCTS iteration感度試験の双方で探索収束可能性が確認された、合法手2〜4の強制捕獲局面へ対象を移す。

完全性監査:

- P001 state hash: `10316a873e4d70c19cf34afc0f3736c4971e772772dae4aa2caa5f97df4d67a5`
- 4候補、6条件、24局、全局120 ply以内に終局
- 固定第3手を含む1,269着手を再適用し、最終state hashと勝者を照合
- 欠損0、partial 0、timeout 0
- verification hash: `7ce6ab2ddd1f7b6cd005fc0ed5143175983a951a169d440b56ecc3338958c341`
- 詳細は`doc/joseki/CONDITIONAL_P001_RESULTS.md`と`doc/joseki/patterns/P001.md`を参照

## 15. 低分岐強制捕獲局面P002

MCTS感度試験の`2-4/forced-capture`標本4局面を再監査した。phase2全6条件と192 iteration MCTS全3 seedが同じ手を選ぶ局面は2件だった。事前に「合法手数最少、同数ならnode ID順」と選定規則を固定し、合法手2の`p8-c1f65bf10696`をP002とした。

P002はnamua、South手番、両者reserve 18、nyumba解放済み、South盤上18石対North10石、前列13対10、静的bao評価+187である。合法手は同じ穴から捕獲方向・kichwa側が異なる2手だけだった。

既存phase2全6条件は`capture:namua:0:2:right:left::false`を選び、South視点探索値は+356〜+614だった。192 iteration MCTSも3 seedすべて同じ手を選び、128〜144 visit、平均価値0.423〜0.503を与えた。対案は48〜64 visit、平均価値0.280〜0.298だった。

両合法手を固定し、同じ6条件で12局を終局まで継続した。

| South捕獲手 | South勝 | phase2一致 | MCTS一致 | 判定 |
| --- | ---: | --- | --- | --- |
| `capture:namua:0:2:left:right::false` | 5/6 | no | no | screened-out |
| `capture:namua:0:2:right:left::false` | 3/6 | yes | yes | screened-out |

事前条件は首位、4/6勝以上、phase2・MCTS consensusとの一致をすべて要求した。非consensus手は勝敗条件を満たしたがcross-method一致がなく、consensus手はcross-method一致を満たしたが勝敗条件に届かなかった。したがって判定は`no-conditional-candidate`である。

低分岐強制捕獲層で探索がseed間収束するという以前の観測は再現したが、その収束先が終局勝敗でも優れるという仮説は反証された。結果確認後に5/6勝手だけを候補へ格上げしない。両方向の評価反転trace比較は次節で行う。

完全性監査:

- node: `p8-c1f65bf10696`
- state hash: `5a8aac4659368e29d2788d9375a48a08694b15e42f14dd357d5eb3f389eb6eaf`
- 2候補、6条件、12局、全局120 ply以内に終局
- 固定捕獲手を含む502着手を再適用し、最終state hashと勝者を照合
- 欠損0、partial 0、timeout 0
- verification hash: `e8cb32bc6c724ca39d6b6b2868b498cc3ab09e8d247136bcf29e086c0eb32097`
- 詳細は`doc/joseki/FORCED_P002_RESULTS.md`と`doc/joseki/patterns/P002.md`を参照

## 16. P002両捕獲手の評価反転trace比較

P002の12局について、固定捕獲直後から終局までの全502保存局面を、条件差を除いた共通のphase2・bao depth 2で再評価した。固定手直後のSouth探索値はconsensus手+474、非consensus手+15、静的bao評価は579対389だった。phase2・MCTSがconsensus手へ収束したことは、直後の評価器出力とは整合する。

静的評価の190点差では、consensus手のfrontSafetyが40点、frontOccupiedが10点、frontSeedsが9点、boardSeedsが8点だけ優位だった。非consensus手はmaxCaptureで24点、relayShapeで3点を取り返したが及ばなかった。Northの合法応手はconsensus手後が1手、非consensus手後が3手だった。ただし6条件の保存継続が実際に選んだ初回応手は各側とも同一で、初回応手の選択分散だけでは勝敗差を説明できない。

consensus手が敗れたbao-d1、bao-d2、bao-v2-d2の恒久的な探索値負転は43、49、49 plyだった。対して非consensus手のSouth勝5局は11 plyで一度負になっても後に回復した。非consensus手が唯一敗れたbao-d3だけは47 plyで恒久的に負となった。直後評価、最初の負転、短い探索窓のいずれも終局勝敗を安定分類できない。

したがって今回の不一致は「探索が直後の形を評価できない」のではなく、「前列安全性などの直後優位が長い強制系列で維持されるかを評価できない」と整理する。これは相関的診断であり、frontSafetyを単独原因とは断定しない。次は同じ選定層の別局面で、直後frontSafety差、相手応手数、恒久負転時期の再現性を確認する。

完全性監査:

- 2固定手、6条件、12 trace、502局面
- 全着手を再適用し、12終局state hashが保存成果物と一致
- 共通再評価: phase2、bao、depth 2、時間制限なし
- summary hash: `76d1e8eff74a7c669e1043d1db79be81fe15d965055298509af6939beeadf7e0`
- 詳細は`doc/joseki/P002_REVERSAL_ANALYSIS.md`を参照

## 17. P003によるfrontSafety仮説の対照検証

P002選定時にcross-method一致を満たしたもう一つの局面`p8-701bf2f6430d`をP003とした。P003は合法手4、全手captureで、phase2全6条件と192 iteration MCTS全3 seedが`capture:namua:0:4:right:left::false`を推奨していた。

結果確認前に全4合法手×6条件、P002と同じ首位・4/6以上・cross-method一致という候補条件を固定した。さらに固定手直後のfrontSafetyとNorth合法応手数を比較し、いずれも全4手で2と同値であることを確認した。P002で見られたfrontSafety差と応手数差を除いた対照になる。

| South捕獲手 | 直後bao | South勝 | consensus | 判定 |
| --- | ---: | ---: | --- | --- |
| `capture:namua:0:2:left:right::false` | 101 | 5/6 | no | screened-out |
| `capture:namua:0:4:right:left::false` | 192 | 4/6 | yes | screened-out |
| `capture:namua:0:2:right:left::false` | 142 | 2/6 | no | screened-out |
| `capture:namua:0:4:left:right::false` | 151 | 0/6 | no | screened-out |

首位手はcross-method条件を満たさず、合意手は首位条件を満たさないため、`no-conditional-candidate`となった。直後静的評価が最下位の手が終局首位であり、P002の不一致が別の低分岐局面でも再現した。

首位手と合意手の12 trace・577局面を共通phase2・bao depth 2で再評価すると、固定手直後の探索値は首位手-374、合意手+56だった。合意手のbao-d4敗戦は43 ply、首位手の唯一のlegacy-d2敗戦は45 plyまで恒久負転しなかった。探索は直後に430点差で首位手を退けたが、終局結果は逆だった。

この対照から、frontSafety優位や相手応手数差は探索・終局不一致の必要条件ではない。単一の直後特徴を原因とする説明を退け、次はP002・P003を通じた評価差の持続時間、強制捕獲系列長、恒久負転時期を集約する。

完全性監査:

- 4固定手、6条件、24局、全局120 ply以内に終局
- 固定捕獲手を含む1,169着手を再適用し、最終state hashと勝者を照合
- 首位・合意2手の12 trace、577局面を共通depth 2で再評価
- timeout 0、partial 0
- continuation verification hash: `7853f5b641f612356bdd6b9a68ea74175597ec8540d32ce000e39341d4307c8d`
- trace summary hash: `7651f88c94b60cc2fcaeceaeab84b9f474c945cffe3bacd8c5e906fcdf54a628`
- 詳細は`doc/joseki/FORCED_P003_RESULTS.md`、`doc/joseki/P003_REVERSAL_ANALYSIS.md`、`doc/joseki/patterns/P003.md`を参照

## 18. P002・P003の強制系列横断比較

P002・P003について、終局首位手とcross-method合意手の計24 traceを同じ定義で再生し、固定手後の冒頭連続強制捕獲局面数、全強制捕獲局面数、恒久的な探索値負転を集約した。

| 局面 | 終局首位手勝 | 合意手勝 | 合意手の直後探索値差 | 合意手の直後静的値差 |
| --- | ---: | ---: | ---: | ---: |
| P002 | 5/6 | 3/6 | +459 | +190 |
| P003 | 5/6 | 4/6 | +430 | +91 |

両局面とも探索は合意手を430点以上高く評価したが、非合意手が終局首位となった。P003ではfrontSafetyとNorth応手数が同値であるため、この2特徴は不一致の必要条件ではない。

冒頭連続強制捕獲系列は全24 traceで3〜52 plyに分布した。P002合意手のSouth勝は3〜38、North勝は3〜43、P003合意手のSouth勝は7〜42、North勝は13〜37で、勝敗範囲が重なった。系列の長短を単純な閾値にしても終局を分類できない。

North勝となった7 traceで恒久的な探索値負転は17、43、43、45、47、49、49 plyに現れ、中央値は45 plyだった。浅い探索が直後優位を誤認するだけでなく、その誤認が長い系列の終盤まで維持される場合が多い。

以上から、frontSafety差、相手応手数差、強制捕獲系列長のいずれも単独の必要条件・十分条件として採用しない。次は同じP002・P003局面で探索depthを段階的に増やし、終局首位手へ推奨が切り替わるhorizonが存在するかを測る。

完全性監査:

- 2局面、2比較手、6条件、24 trace
- 全trace hashをP002・P003評価反転成果物と照合
- 強制捕獲判定は各保存局面の全合法手から再計算
- summary hash: `e0df259c4e058095cadcc055a19f19fdd30f7277a6250687f3428fee6ab70151`
- 詳細は`doc/joseki/FORCED_CONVERGENCE_COMPARISON.md`を参照
