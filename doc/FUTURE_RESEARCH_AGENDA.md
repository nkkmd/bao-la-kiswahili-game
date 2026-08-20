# Bao 今後の研究課題

Version: 1.7.0  
Status: Active  
作成日: 2026-07-21  
更新日: 2026-08-20

## 1. 目的

この文書は、先攻・後攻差研究および第一次定石研究の完了後に検討する、Bao la Kiswahili の独立研究課題を整理する研究アジェンダである。

ここで扱うfuture workは、完了済み研究の試行数追加、別seedによる有意化探索、既存候補の閾値変更や別解析による救済ではない。局面分類、手筋、形勢判断、終盤解析、認知研究、計算複雑性研究などをBao固有の構造へ置き換え、各テーマを新しいprospective studyとして扱う。

本書は実装ロードマップではない。各研究を開始する際は、目的、仮説、population、measurement、seed、判定基準、停止条件、解釈境界を個別に事前固定する。

2026-08-20時点で、第1段階の5つのStudy 1に加え、第2段階の最初の研究であるPosition Evaluation / Win-Rate Calibration Study 1まで完了した。

主要な完了状態は次のとおりである。

```text
Phase Transition Study 1 = closed
Position Typology / Playing Style Study 1 = closed
Namua→Mtaji Temporal Transition Study 1 = NOT-CONFIRMED
Position Complexity / Difficulty Study 1 = INCONCLUSIVE
Tactical Motifs / Tesuji Study 1 = C03 CONFIRMED; C01/C02/C04 NOT-CONFIRMED
C03 Human / Expert Validation Study 1 = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
```

Position Evaluation / Win-Rate Calibration Study 1ではStage 1でphase-stratified isotonic mappingをexploratoryに選択したが、fresh Stage 2で3つのpreregistered estimability gateが未達となったため、held-out calibration generalizationはformalに確認も棄却もされていない。したがってこのmappingを「formalにvalidatedされたBao勝率」として後続研究の前提にしない。

## 2. 既存研究との境界

既存の研究・開発基盤では、主に次を扱っている。

- 先攻・後攻の有利差
- 固定開局を共有するペア対局
- 第一次定石研究
- seed付き自己対局
- 評価関数・探索方式の比較
- 戦術局面回帰
- 実対局由来の局面監査
- 局面相転移点 Study 1 — [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- 局面類型と棋風 Study 1 — [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)
- Namua→Mtaji Strategic Temporal Transition Study 1 — [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)
- Position Complexity / Difficulty Study 1 — [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md)
- Tactical Motifs / Tesuji Study 1 — [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md)
- Tactical Motif Human / Expert Validation Study 1 — [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md)
- Position Evaluation / Win-Rate Calibration Study 1 — [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md)

完了済みStudyのformal decision、negative/null/inconclusive/non-estimable result、事前登録条件、population、endpoint、解釈境界は後続研究によって変更しない。

特に次をfuture workとして扱わない。

- Position Complexity Study 1を既存Stage 2 dataの別optimizer/toleranceで救済すること
- Tactical Motifs C01/C02/C04を追加game、paired-definition substitution、threshold変更で救済すること
- C03 Human / Expert Validation Study 1のN=0をhuman negative evidenceとして読み替えること
- Namua→Mtaji Study 1のdeterministic first-Mtaji clockをsurvival/hazard endpointとして再包装すること
- Position Evaluation / Win-Rate Calibration Study 1へ追加game、seed extension、identity-overlap replacement、estimability-threshold緩和、mapping refitを加えて`INCONCLUSIVE`を変更すること

## 3. 研究上の共通原則

1. 自己対局AIの評価をBao上の絶対的正解とはみなさない。
2. 機械的観測、統計的傾向、棋力判断、理論的証明を区別する。
3. 局面番号や特定手順だけでなく、再利用可能な構造として知識を表現する。
4. NamuaとMtajiを必要に応じて分離する。
5. 人間向け概念と機械特徴量を同一視しない。
6. 適用範囲、反例、未解決点を明示する。
7. data / seed / AI条件 / source version / identityを再現可能に保存する。
8. exploratory mappingやdescriptive metricをformal confirmationへ昇格させない。
9. downstream studyはupstream studyの未確認resultをconfirmed instrumentとして扱わない。

## 4. 研究課題

### 4.1 局面の相転移点 — Study 1完了

**現在の状態:** Study 1 closed。

- [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- [`phase-transition/STUDY_1_FINAL_REPORT.md`](phase-transition/STUDY_1_FINAL_REPORT.md)

Study 1では`capture-branch-expansion`をbounded strategic-transition phenotypeとして保持し、固定条件でsearch-profile orderingのdepth依存逆転を確認した。一方、universal Bao phase-transition law、一般的depth interaction、reserve・nyumba・front-row・mobilityを統合する一般理論は未確立である。

将来候補:

- search-tree / PV / cutoff / horizon mechanism
- nyumbaの機能変化
- front-row支配の崩壊・固定化
- capture-to-mobility transition
- forcing-to-free-choice transition

これらは新しいprospective studyとして扱う。

---

### 4.2 局面類型と棋風 — Study 1完了

**現在の状態:** Study 1 closed。

- [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)
- [`position-typology/STUDY_1_FINAL_REPORT.md`](position-typology/STUDY_1_FINAL_REPORT.md)

Study 1ではMtaji `MTAJI-M1 / MTAJI-M2` bounded morphologyをformalにconfirmedした。Namuaでは離散typeをpromoteせず、`N-ACT / N-CON`をexploratory continuous coordinatesとして保持した。Discrete playing-style clusterは支持されず、`STYLE-C1..C4` exact geometryもheld-outでnot-confirmedだった。

将来候補:

- N-ACT/N-CONのfresh formal replication
- 新しいplaying-style model family
- MTAJI-M1/M2 human/expert validation
- 別engine/search条件でのexternal validity

既存Stage 5を再定義してSTYLE-C1..C4を救済しない。

---

### 4.2.1 Namua→Mtaji移行前後の戦略的転移構造 — Study 1完了

Status: **formal decision `NOT-CONFIRMED`**

- [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)
- [`namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`](namua-mtaji-transition/STUDY_1_FINAL_REPORT.md)

現engineのstandard trajectoryではfirst Mtajiがreserve exhaustionによりdeterministically ply 44に現れる。このため`time-to-first-Mtaji`、hazard、acceleration/delayはstrategic endpointとして用いない。

Fresh Stage 2ではP2-D2のfirst-Mtaji morphology associationを検証したが、formal resultは`NOT-CONFIRMED`だった。

将来候補はfull structural trajectory、front-row/nyumba/mobility/forcing lifecycle、mechanistic search analysis、別conditionでのexternal validityであり、同一formal corpusのsubgroup/comparator変更による救済ではない。

---

### 4.3 局面複雑度と難易度 — Study 1完了

Status: **formal decision `INCONCLUSIVE`**

- [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md)
- [`position-complexity/STUDY_1_FINAL_REPORT.md`](position-complexity/STUDY_1_FINAL_REPORT.md)

Study 1はstructural complexity、search workload、decision ambiguity、prediction instabilityを機械再現可能に分離したが、primary formal logistic modelがfrozen convergence gateを満たさず`INCONCLUSIVE`となった。H2は`NOT-CONFIRMATORILY-EVALUATED`である。

H1を再検証する場合は、robust optimizer / convergence procedureを事前固定したfresh independent replicationとする。Human difficultyはmachine complexityと別軸で検証する。

---

### 4.4 手筋の発見と体系化 — Study 1完了

Status: **C03 CONFIRMED / C01,C02,C04 NOT-CONFIRMED**

- [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md)
- [`tactical-motifs/STUDY_1_FINAL_REPORT.md`](tactical-motifs/STUDY_1_FINAL_REPORT.md)

C03はfrozen Bao engine/search operationalization内のmachine-reproducible transferable tactical motifとしてconfirmedされた。traditional tesuji、human importance、pedagogical valueは未確認である。

C01/C02/C04を追加gameやontology/threshold変更で救済しない。

将来候補:

- C03 traditional/expert recognition
- beginner/pedagogical validation
- external validity
- C03とは独立した新規motif family探索

---

### 4.4.1 C03 Human / Expert Validation — Study 1完了

Status: **human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**

- [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md)
- [`tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md`](tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md)

Machine/instrument pipelineと42 formal positionsのdeterministic freezeまで完了したが、qualified Bao expertへの現実的アクセスを確保できずscientific recruitmentを開始しないままN=0で閉じた。

N=0はnegative human evidenceではない。将来再検証する場合は新しいprospective study、またはnew responses前にversionedされたprospective reopeningとする。

---

### 4.5 悪手と錯覚パターン

#### 現在の優先度

**第2段階の次期推奨研究。**

Position Evaluation / Win-Rate Calibration Study 1は完了したため、研究順序上はこのテーマへ進める。ただしCalibration Study 1のformal resultは`INCONCLUSIVE`であり、Stage 1 isotonic mappingをformalにvalidatedされたwin probabilityとして利用してはならない。

したがって次の研究では、machine-onlyのbad-move / misvaluation patternをまず独立に定義するのが適切である。Formal severity endpointには、fresh continuation outcomes、exact search-based regret/decision loss、または新研究内でprospectively frozenされた別のmeasurementを使い、Calibration Study 1 mappingを使う場合はexploratory/descriptive covariateに限定する。

「錯覚」という語で人間の誤認理由を主張するにはhuman dataが必要である。Human dataなしの研究は、machine-observed blunder pattern / search error / value misestimationまでに限定する。

#### 中心課題

初心者、人間一般、浅い探索AIが繰り返し陥りうる誤判断候補を、まずmachine-reproducible patternとして分類する。

#### 候補

- 即時捕獲量の過大評価
- nyumba維持の絶対視
- reserveの過度な温存
- relay終了後配置の見落とし
- 相手の強制捕獲を自分の利益と誤認する構造
- 一手後の可動性低下
- 見かけ上の左右対称性への依存

#### 期待成果

machine-reproducible bad-move taxonomy、説明可能なerror pattern、将来のhuman misconception validation用stimulus、悪手説明機能のmeasurement foundation。

---

### 4.6 形勢判断と勝率校正 — Study 1完了

Status: **Study 1 closed / formal decision `INCONCLUSIVE`**

- 初見向け概要: [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`](position-evaluation-calibration/STUDY_1_FINAL_REPORT.md)
- Formal result: [`position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md`](position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md)

Stage 1 fresh exploratory corpusではphase-aware logisticとphase-stratified isotonicをprospectively比較し、logisticがfrozen numerical convergence gateを満たさなかったため、isotonicを唯一のeligible candidateとして選択した。

```text
Stage 1 selected states = 830
pooled isotonic CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Stage 2 fresh formal corpus:

```text
games = 2048
seeds = 22300001..22302048
independent verification = PASS
final Stage 1 identity overlaps = 0 / 0 / 0
```

しかしstrict Stage 1 identity firewallとno-replacement selection後に3つのestimability gateが未達となった。

```text
unique historical trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

そのためfrozen decision ruleにより:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
paired bootstrap = not decision-eligible
primary performance criteria = not decision-eligible
```

Descriptive-only:

```text
pooled Brier = 0.15550141283724248
Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
```

これらはformal confirmationを意味しない。

#### Future-work boundary

同じStage 2 corpusへ追加game、別seed、identity-overlap replacement、readiness gate緩和、mapping refit、descriptive thresholdの事後利用を加えてStudy 1を救済しない。

formal calibration generalizationを再検証する場合は、Stage 1 identity firewallによるattritionを事前に見込んだfresh prospective replicationとする。

---

### 4.7 逆転可能性と勝負手

#### 中心課題

理論上の最善手と、実戦で相手に誤りを要求して逆転可能性を高める手を区別する。

候補指標:

- 最善応手に対する評価
- 平均的応手に対する結果
- 応手の唯一性
- 分岐数
- AI強度別誤答率
- 候補手ごとの逆転率

Calibration Study 1のmappingをformal win probabilityとして前提にしない。

---

### 4.8 限定終盤と必勝圏

#### 中心課題

制約された終盤局面を列挙・後退解析し、必勝・必敗・循環・勝利距離を求める。

対象候補:

- reserve = 0
- nyumbaなし
- 総種数または非空穴数が小さい
- 合法手数が少ない
- 特定種数分布

期待成果はBao終盤テーブルベース、完全手、必勝問題、engine/evaluatorの正解データである。

---

### 4.9 重要局面と勝敗分岐点

#### 中心課題

一局の全着手から、勝敗見込みや戦略方針を大きく変えた少数局面を抽出する。

判定候補:

- fresh continuation outcomeの大きな変化
- exact best-move regret
- 唯一手
- strategic transition
- irreversible structural loss

Calibration Study 1 mappingをformalにvalidatedされた勝率変化として使わない。

---

### 4.10 人間とAIの判断差

#### 中心課題

初心者、熟練者、static evaluator、浅い探索AI、深い探索AIがどの局面で異なる判断を行うかを調べる。

測定候補:

- 選択手
- 判断時間
- 候補手数
- 形勢予測
- 理由説明
- 読み筋
- 見落とした反撃

Human evidenceが必要なclaimをmachine self-playで代替しない。

---

### 4.11 対称性と同型局面

#### 中心課題

盤面表示が異なっていても合法手・遷移・勝敗が本質的に同じ局面を体系化する。

研究対象:

- 左右反転
- player交換
- pit numbering正規化
- Namua/Mtajiで成立する変換差
- legal-move graph同型
- canonical form

期待成果は重複局面削減、研究data圧縮、TT効率化、symmetry test生成である。

---

### 4.12 状態空間とゲーム木複雑度

#### 中心課題

Baoの計算論的規模を推定する。

主な対象:

1. 到達可能合法局面数
2. 対局系列数
3. phase別実効分岐係数
4. 対局長分布
5. 強制手によるtree圧縮
6. 対称性除去後の局面数

完全列挙が困難な場合はcanonicalization、random walk、self-play sampling、Monte Carlo estimationを組み合わせる。

## 5. 推奨する研究プログラム

### 第1段階: Baoを記述する語彙の構築

1. **[完了] 局面の相転移点 — Study 1**
2. **[完了] 局面類型と棋風 — Study 1**
3. **[完了] Namua→Mtaji移行前後の戦略的転移構造 — Study 1 (`NOT-CONFIRMED`)**
4. **[完了] 局面複雑度と難易度 — Study 1 (`INCONCLUSIVE`)**
5. **[完了] 手筋の発見と体系化 — Study 1（C03 `CONFIRMED` / C01,C02,C04 `NOT-CONFIRMED`）**

第1段階は完了した。完了済みresultを後続研究で救済しない。

### 第2段階: 理解、教育、解説への展開

現在の優先順位:

1. **[完了] 形勢判断と勝率校正 — Study 1 (`INCONCLUSIVE`)**
2. **悪手と錯覚パターン — 次期推奨**
3. 重要局面と勝敗分岐点
4. 人間とAIの判断差

勝率校正Study 1によってevaluation→empirical outcomeを扱う技術基盤とexploratory mappingは得られたが、formal held-out validationはestimability failureで未解決である。そのため後続研究は「formalに校正済みの勝率」を前提にせず、新しいprimary endpointをprospectively定義する。

悪手研究はmachine-only stageから開始可能である。ただしhuman misconceptionを主張する場合は別途human dataを必要とする。

### 第3段階: 理論および完全解析への展開

1. 限定終盤と必勝圏
2. 対称性と同型局面
3. 状態空間とゲーム木複雑度
4. 逆転可能性と勝負手

## 6. 特に優先する三本柱

### 6.1 Bao局面分類学

相転移、局面類型、棋風、複雑度を統合してBao局面を体系的に記述する。完了済みStudyのinconclusive/not-confirmed結果を同一dataの再解析で変更しない。

### 6.2 Bao手筋・錯覚体系

Tactical Motifs Study 1でC03 machine motifをconfirmedしたが、human recognitionはN=0で未推定である。次の実務的主要課題は、machine-reproducible bad-move / error-pattern taxonomyと、将来human validation可能なinstrumentの構築である。

### 6.3 Bao終盤科学

限定局面の完全解析、必勝圏、勝利距離、終盤tablebaseを扱う。

## 7. 個別研究を開始する条件

各研究課題を実施へ移す際は、最低限次を定義する。

- 既存研究との差
- 検証可能な仮説
- phase / population
- AI / search / seed
- 特徴量・outcome・data format
- statistical unit / identity / pseudoreplication control
- human reviewが必要なclaim
- success / failure / estimability gate
- stopping / no-rescue rule
- artifact保存先

完了済み研究から派生する場合は、既存formal decisionを変更しないこと、endpoint/comparator/population/seed/decision ruleを新しいoutcomeを見る前に固定すること、confirmed/exploratory/descriptive evidenceを区別することを開始条件に含める。

追加の固有境界:

- Namua→Mtaji: current engineのfirst-Mtaji timingをstrategic survival/hazard endpointとして再利用しない。
- Position Complexity: H1再検証はfresh seedとprospectively frozen numerical methodで行う。
- Tactical Motifs: C01/C02/C04を既存evidenceの再定義で救済しない。
- C03 Human Validation: N=0をnegative human evidenceへ変換しない。
- Position Evaluation / Win-Rate Calibration: Study 1のisotonic mappingをformal validated probabilityとして扱わない。formal replicationはfresh corpusで行う。
- Bad-move study: calibration mappingをprimary formal severity scaleにする場合は、それ自体を新研究内でprospectively validateするか、fresh continuation outcomeをprimaryにする。

## 8. 到達目標

長期的な目標はBaoを単にプレイ可能なゲームやAI勝率比較対象として扱うだけでなく、次の形へ発展させることである。

- 局面を分類できる
- 戦略転換を説明できる
- 手筋とerror patternを言語化できる
- 形勢評価とempirical outcomeの関係を再現可能に扱える
- 重要局面を抽出できる
- 限定終盤を証明できる
- 人間の学習過程を支援できる

中心方針:

> Baoの局面を分類し、局面間に共通する戦略原理を発見し、それを再現可能かつ人間が理解できる知識へ変換する。
