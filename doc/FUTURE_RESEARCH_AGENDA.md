# Bao 今後の研究課題

Version: 1.8.0  
Status: Active  
作成日: 2026-07-21  
更新日: 2026-08-22

## 1. 目的

この文書は、先攻・後攻差研究および第一次定石研究の完了後に検討する、Bao la Kiswahili の新しい研究方向を整理した研究アジェンダである。

ここで扱う課題は、既存研究の試行数追加、別seedによる追試、既存候補の結果後の救済ではない。囲碁・将棋で発展してきた局面分類、手筋、形勢判断、終盤解析、認知研究、計算複雑性研究などを参考にしつつ、Bao固有の構造へ置き換えた独立の研究領域を対象とする。

本書は実装ロードマップではない。各課題を実際に開始する際は、研究目的、仮説、測定方法、データ形式、判定基準、停止条件を個別の研究計画として定義する。

2026-08-22時点で、第1段階の「局面の相転移点」「局面類型と棋風」「Namua→Mtaji移行前後の戦略的転移構造」「局面複雑度と難易度」「手筋の発見と体系化」のStudy 1はいずれも完了した。Tactical Motifs / Tesuji Study 1では、fresh Stage 2 formal corpusによる4 canonical candidateの検証まで完了し、`TM-S2-C03`のみ`CONFIRMED`、C01/C02/C04は`NOT-CONFIRMED`となった。

C03のHuman / Expert Validation Study 1も完了した。machine/instrument側ではfresh 1,536-game corpus、independent full recomputation、near-miss control matching、42 unique formal positionsのdeterministic freezeまで完了した。一方human側は、独立研究者としてfrozen expert criteriaを満たす対象へ現実的にアクセスする経路を確保できず、scientific recruitmentを開始しないまま`N=0`で閉じた。human axisのformal labelは`INCONCLUSIVE-NOT-ESTIMABLE`であり、これはC03へのnegative human evidenceではない。

第2段階では、measurement dependencyを理由に先行させたPosition Evaluation / Win-Rate Calibration Study 1も完了した。Stage 1ではphase-stratified isotonic mappingをexploratoryに選択し、fresh Stage 2では全2,048局のindependent verificationとStage 1 identity overlap 0を達成した。しかしstrict identity firewallとno-replacement selection後に3つのpreregistered estimability gateが未達となったため、formal decisionは`INCONCLUSIVE`である。mappingはformalにvalidatedされたBao勝率ではない。

その後開始したBlunder / Misvaluation Patterns Study 1では、Stage 0 technical/construct auditとStage 1 fresh exploratory discoveryが完了した。2,048 fresh games、1,200 selected roots、5,295 exact legal movesを用い、全generation/selection/measurement readiness gateをPASSした。frozen matcher/failure grammarから16,421 matchers / 123,624 detailed candidatesを列挙し、11件がpromotion gateを通過、deterministic ranking/capsにより4件をexploratory candidateとしてpromotionした。**Study 1全体はまだ継続中であり、次はfresh-data Stage 2 formal confirmationである。**

完了済みStudyのformal decisionを後続研究で変更しない。またBlunder / Misvaluation Patterns Study 1のStage 1 supportをStage 2 confirmation evidenceとして再利用しない。

## 2. 既存研究との境界

既存の研究・開発基盤では、主に次を扱っている。

- 先攻・後攻の有利差
- 固定開局を共有するペア対局
- 定石候補の抽出と検証
- seed付き自己対局
- 評価関数および探索方式の比較
- 戦術局面回帰
- 実対局由来の局面監査
- 局面相転移点Study 1 — [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- 局面類型と棋風Study 1 — [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)
- Namua→Mtaji Strategic Temporal Transition Study 1 — [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)
- Position Complexity / Difficulty Study 1 — [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md)
- Tactical Motifs / Tesuji Study 1 — [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md)
- Tactical Motif Human / Expert Validation Study 1 — [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md)
- Position Evaluation / Win-Rate Calibration Study 1 — [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md)
- Blunder / Misvaluation Patterns Study 1 — [`blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md)（Stage 1 exploratory complete / Stage 2 not started）

今後の研究では、単純な勝率比較から対象を広げ、次の問いを中心に置く。

> Baoの局面にはどのような構造があり、どのような原理で戦略が変化し、それを人間が理解可能な知識として記述できるか。

完了済みStudyのformal decision、事前登録条件、negative/null/inconclusive/non-estimable result、解釈境界は後続研究によって変更しない。後続研究は、既存Studyの救済や再定義ではなく、新しい研究課題または事前固定された次stageとして進める。

## 3. 研究上の共通原則

1. 自己対局AIの評価をBao上の絶対的正解とはみなさない。
2. 機械的観測、統計的傾向、棋力判断、理論的証明を区別する。
3. 局面番号や特定手順だけでなく、再利用可能な構造として知識を表現する。
4. namuaとmtajiを必要に応じて分離して分析する。
5. 人間向け概念と機械向け特徴量を安易に同一視しない。
6. 研究結果には適用範囲、既知の反例、未解決点を残す。
7. 研究用データは再現可能な局面形式、条件、seed、AI設定とともに保存する。
8. exploratory mappingやdescriptive metricをformal confirmationへ昇格させない。
9. downstream studyはupstream studyの未確認resultをconfirmed instrumentとして扱わない。
10. exploratory stageで得たsupportを、fresh confirmation stageのevidenceとして再利用しない。

## 4. 研究課題

### 4.1 局面の相転移点

#### 現在の状態

**Study 1完了。**

- 初見向け概要: [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- 科学的正本: [`phase-transition/STUDY_1_FINAL_REPORT.md`](phase-transition/STUDY_1_FINAL_REPORT.md)

Study 1では`capture-branch-expansion`をboundedなstrategic-transition phenotypeとして保持し、固定条件でdepth2とdepth3のsearch-profile orderingが逆転することまで確認した。一方、universal Bao phase-transition law、一般的なsearch-profile × depth interaction、reserve・nyumba・front-row・mobilityを包含する一般理論は確立していない。

#### 中心課題

Baoの対局において、局面の価値基準や最善戦略が不可逆的に変化する地点を特定する。

#### 主な対象

- namuaからmtajiへの移行
- nyumbaの消失または機能変化
- reserveが特定範囲を下回る局面
- 前列支配の崩壊または固定化
- 捕獲重視から可動性重視への移行
- 強制系列中心から自由選択中心への移行

#### 期待成果

手数によらないBao固有の序盤・中盤・終盤分類、および局面フェーズ判定基準。

---

### 4.2 局面類型と棋風

#### 現在の状態

**Study 1完了。**

- 初見向け概要: [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-typology/STUDY_1_FINAL_REPORT.md`](position-typology/STUDY_1_FINAL_REPORT.md)

Study 1では、固定representation / population内でMtajiの`MTAJI-M1 / MTAJI-M2`二類型をformalにconfirmedした。Namuaでは離散typeをpromoteせず、`N-ACT / N-CON`をexploratory continuous coordinatesとして保持した。discrete playing-style cluster setは支持されず、探索で得たexact `STYLE-C1..C4` 4D geometryも独立確認では`not-confirmed`となった。

#### 中心課題

Baoに繰り返し現れる局面構造と、対局者またはAIが選びやすい戦略傾向を分類する。

#### 類型候補

- 捕獲重視型
- nyumba維持型
- 前列制圧型
- reserve温存型
- 早期mtaji移行型
- 可動性重視型
- 強制系列型
- 持久型

これらは当初の候補語彙であり、Study 1の結果によって確認済み類型へ自動的に昇格したものではない。

#### 期待成果

Bao固有の棋風語彙、対局スタイル分類、異なる戦略傾向を持つAI、学習者向けスタイル診断。

---

### 4.2.1 Namua→Mtaji移行前後の戦略的転移構造 — Study 1完了

**研究題目:** BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — `capture-branch-expansion`からMtaji morphologyへの時間的接続  
**状態:** Study 1 closed / formal decision `not-confirmed`

- 初見向け概要: [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)
- 科学的正本: [`namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`](namua-mtaji-transition/STUDY_1_FINAL_REPORT.md)
- Formal result: [`namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md`](namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md)

Stage 0/1で、現engineのstandard trajectoryではNamua→Mtaji移行がreserve exhaustionによるdeterministic clockであることが確立した。

```text
initial total reserve = 44
Namua total reserve at ply t = 44 - t
first Mtaji observation = ply 44
```

したがって`time-to-first-Mtaji` / survival / hazard / acceleration / delayをstrategic inferential endpointとして扱わない。

Stage 2はP2-D2、4096 games、earliest fully ascertained Namua CBE exposure、exact-ply R3-M 1:20 matchingで実施した。

```text
morphology-eligible exposed trajectories = 30
matched sets = 30
unique controls = 600
Exposed MTAJI-M1 = 26/30
Matched-control MTAJI-M1 = 509/600
p_two_sided = 1.0
formal decision = NOT-CONFIRMED
```

同一corpusのsubgroup、alternative comparator、追加game、threshold変更、Mtaji classifier refitによる救済は行わない。

---

### 4.3 局面複雑度と難易度 — Study 1完了

**状態:** Study 1完了 / formal decision `INCONCLUSIVE`

- 初見向け概要: [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-complexity/STUDY_1_FINAL_REPORT.md`](position-complexity/STUDY_1_FINAL_REPORT.md)
- Formal result: [`position-complexity/STAGE_2_FORMAL_RESULT.md`](position-complexity/STAGE_2_FORMAL_RESULT.md)

Study 1ではstructural complexity、search workload、decision ambiguity、prediction instabilityを分離した。Fresh Stage 2は1024 games / 862 unique rule statesでcount/coverage gateをPASSしたが、primary logistic modelがBFGS precision lossによりfrozen convergence gateを満たさなかった。

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

同じStage 2 corpusを別optimizer/toleranceで再解析してformal decisionを救済しない。再検証する場合は数値手法を事前固定したfresh prospective replicationとする。

Human difficultyはmachine workload/ambiguity/instabilityとは別に独立検証する。

---

### 4.4 手筋の発見と体系化 — Study 1完了

**状態:** Study 1 closed / complete。Stage 2 formal decision: C03 confirmed; C01/C02/C04 not-confirmed。

- 初見向け概要: [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md)
- 科学的正本: [`tactical-motifs/STUDY_1_FINAL_REPORT.md`](tactical-motifs/STUDY_1_FINAL_REPORT.md)
- Formal result: [`tactical-motifs/STAGE_2_FORMAL_RESULT.md`](tactical-motifs/STAGE_2_FORMAL_RESULT.md)

Stage 1では768-game fresh corpusから715 unique rule states / 3,148 exact move recordsを測定し、105,501 detailed candidatesから8 exploratory definitionsをpromotionした。Stage 2ではfresh 3,072 gamesを用い、4 canonical candidates × 2 co-primary endpointsをformal評価した。

`TM-S2-C03`のみ`CONFIRMED`。C01/C02/C04は`NOT-CONFIRMED`。

Confirmed C03:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

C01/C02/C04を追加game・paired-definition substitution・threshold変更で救済しない。C03のtraditional/expert recognition、human importance、pedagogical value、external validityは別studyを要する。

---

### 4.4.1 C03 Human / Expert Validation — Study 1完了

**状態:** machine/instrument stage complete / human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`

- 初見向け概要: [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md)
- 科学的正本: [`tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md`](tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md)

Machine/instrument側ではfresh 1,536-game corpus、independent full recomputation、near-miss control matching、42 unique formal positionsのdeterministic freezeまで完了した。

Human側はfrozen expert criteriaを満たす対象への現実的アクセス経路を確保できず、scientific recruitmentを開始しないまま閉じた。

```text
accessible eligible experts = 0
scientific recruitment started = false
persons contacted for scientific recruitment = 0
formal human responses = 0
minimum included experts required = 10
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
```

N=0はnegative human evidenceではない。将来再検証する場合は新規prospective studyまたはnew responses前にversionedされたprospective reopeningとする。

---

### 4.5 悪手・誤評価パターン — Study 1進行中

#### 現在の状態

**Stage 1 exploratory discovery完了 / 4 candidates promoted / Stage 2 formal confirmation未開始。**

- Study概要: [`blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md)
- Stage 1正本: [`blunder-misvaluation-patterns/STAGE_1_EXPLORATORY_REPORT.md`](blunder-misvaluation-patterns/STAGE_1_EXPLORATORY_REPORT.md)
- Reproducibility: [`blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md`](blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md)
- Canonical discovery result: [`blunder-misvaluation-patterns/results/STAGE_1_DISCOVERY_RESULT.json`](blunder-misvaluation-patterns/results/STAGE_1_DISCOVERY_RESULT.json)

#### Stage 1 design boundary

Calibration Study 1のformal resultは`INCONCLUSIVE`であるため、exploratory isotonic mappingをformal validated win probabilityとして使用しなかった。Primary machine referenceは`bao` / exact full-window root candidates / D3+Q1 / root actorとした。

Human dataなしではhuman misconceptionを主張せず、machine-reproducible bad-move / value-misestimation structureに限定した。

#### Stage 1 population / readiness

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
independent full replay/search verification = PASS
selected unique rule states = 1200
Namua / Mtaji = 600 / 600
measured exact legal moves = 5295
selection readiness = PASS
measurement readiness = PASS
```

replacement sampling、phase reassignment、seed extension、threshold retuningは行っていない。

#### Stage 1 discovery

```text
matcherCount = 16421
lowSupportMatcherCount = 9553
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
promotedCandidateCount = 4
manualOverridePerformed = false
```

Promoted candidates:

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

4件は**exploratory candidates**であり、confirmed Bao blunderではない。

#### Immediate next stage

次は`BMP-S1-C01..C04`のexact definitionを結果後に変更せず、fresh seed / fresh corpusでStage 2 formal confirmationをprospectively設計する。

Stage 1 supportはStage 2 confirmation evidenceとして再利用しない。

Stage 2 generationは次が完了するまで禁止する。

```text
formal Stage 2 spec
canonical contract validation
execution tooling validation
exact source-file hash freeze
explicit source-bound authorization
```

Stage 2 reserved capacity `22500001..22504096`はreservationであってauthorizationではない。

Human misconception、expert recognition、pedagogical valueを扱う場合は対応するhuman/expert evidenceを別axisで収集する。

---

### 4.6 形勢判断と勝率校正 — Study 1完了

**状態:** Study 1 closed / formal decision `INCONCLUSIVE`

- 初見向け概要: [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`](position-evaluation-calibration/STUDY_1_FINAL_REPORT.md)
- Formal result: [`position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md`](position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md)

Stage 1ではfresh 1,024-game corpus / 830 selected statesを用い、phase-stratified isotonicをexploratoryに選択した。

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Stage 2はfresh 2,048 gamesでindependent verificationとStage 1 overlap 0を達成したが、strict identity firewall/no-replacement後に3 estimability gatesが未達だった。

```text
unique historical trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
OVERALL FORMAL DECISION = INCONCLUSIVE
```

同じStage 2 corpusへのadditional games、replacement、gate relaxation、mapping refitによる救済は行わない。formal calibrationを再検証する場合はidentity-firewall attritionを事前に見込んだfresh prospective replicationとする。

「互角」「やや有利」「優勢」「勝勢」等のformal validated Bao勝率基準はStudy 1では確立していない。

---

### 4.7 逆転可能性と勝負手

#### 中心課題

理論上の最善手と、実戦で相手に誤りを要求して逆転可能性を高める手を区別する。

#### 主な指標

- 最善応手に対する評価
- 平均的応手に対する勝率
- 応手の唯一性
- 分岐数
- 相手AIの強度別誤答率
- 候補手ごとの逆転率

Calibration Study 1のmappingをformal validated win probabilityとして前提にしない。勝率をprimary endpointに使う場合は、新研究内でfresh continuation outcomeまたはprospectively validated measurementを定義する。

#### 期待成果

劣勢時の勝負手分類、実戦型AI、難しい応手を要求する局面の教材化。

---

### 4.8 限定終盤と必勝圏

#### 中心課題

完全なゲーム解析ではなく、制約された終盤局面を列挙・後退解析し、必勝・必敗・循環・勝利距離を求める。

#### 対象候補

- reserveが0
- nyumbaなし
- 総種数が一定以下
- 非空穴数が一定以下
- 合法手数が少ない
- 特定の種数分布に限定する

#### 期待成果

Bao終盤テーブルベース、終盤完全手、必勝問題、評価関数およびルールエンジンの検証用正解データ。

---

### 4.9 重要局面と勝敗分岐点

#### 中心課題

一局の全着手から、勝敗や戦略方針を大きく変えた少数の局面を抽出する。

#### 判定候補

- fresh continuation outcomeまたはprospectively validな勝率指標の急変
- 評価値の急変
- 最善手との差が大きい着手
- 唯一手が存在した局面
- 相転移を起こした着手
- 以後の局面類型を変えた着手
- 不可逆な構造損失

Calibration Study 1のisotonic mappingをformal validated勝率変化として使わない。

Blunder / Misvaluation Patterns Study 1のStage 1 candidatesを利用する場合も、Stage 2 formal confirmation前はexploratory contextに限定する。

#### 期待成果

勝着、敗着、疑問手、分岐点を中心とする自動棋譜解説、一局から少数問を生成する復習機能。

---

### 4.10 人間とAIの判断差

#### 中心課題

初心者、熟練者、評価関数のみのAI、浅い探索AI、深い探索AIが、どの局面で異なる判断を行うかを調べる。

#### 測定候補

- 選択手
- 判断時間
- 候補手数
- 形勢予測
- 理由説明
- 読み筋の長さ
- 見落とした反撃

#### 期待成果

熟達過程のモデル、初心者が優先して学ぶべき概念、人間らしいAI、説明機能の改善。

Human evidenceが必要なclaimをmachine self-playで代替しない。

---

### 4.11 対称性と同型局面

#### 中心課題

盤面表示が異なっていても、合法手、局面遷移、勝敗が本質的に同じ局面を体系化する。

#### 研究対象

- 左右反転
- プレイヤー交換
- 穴番号の正規化
- namuaとmtajiで成立する変換の違い
- 合法手グラフの同型
- canonical formの構築

#### 期待成果

重複局面削減、研究データ圧縮、Transposition Table効率化、対称性を利用したテスト生成。

---

### 4.12 状態空間とゲーム木複雑度

#### 中心課題

Baoの計算論的規模を推定し、他の盤上ゲームやマンカラ系ゲームと比較可能な基礎値を得る。

#### 主な対象

1. 到達可能な合法局面数
2. 可能な対局系列数
3. phase別の実効分岐係数
4. 平均対局長と分布
5. 強制手がゲーム木を圧縮する割合
6. 対称性を除いた局面数

#### 期待成果

Baoの探索困難性に対する定量的説明、研究用基準値、ゲームAI方式選択の理論的根拠。

## 5. 推奨する研究プログラム

### 第1段階: Baoを記述する語彙の構築

1. **[完了] 局面の相転移点 — Study 1**
2. **[完了] 局面類型と棋風 — Study 1**
3. **[完了] Namua→Mtaji移行前後の戦略的転移構造 — Study 1 (`not-confirmed`)**
4. **[完了] 局面複雑度と難易度 — Study 1 (`inconclusive`)**
5. **[完了] 手筋の発見と体系化 — Study 1（C03 `CONFIRMED` / C01,C02,C04 `NOT-CONFIRMED`）**

第1段階の5 Studyは完了した。既存のnegative/inconclusive resultを別研究で救済しない。

### 第2段階: 理解、教育、解説への展開

現在の優先順位:

1. **[完了] 形勢判断と勝率校正 — Study 1 (`INCONCLUSIVE`)**
2. **[Stage 1 exploratory完了] 悪手・誤評価パターン — Study 1 / Stage 2 formal confirmation next**
3. 重要局面と勝敗分岐点
4. 人間とAIの判断差

Position Evaluation / Win-Rate Calibration Study 1によって、engine evaluationとempirical continuation outcomeを分離して扱うtechnical measurement foundationは得られたが、formal held-out validationはestimability failureで未解決である。

Blunder / Misvaluation Patterns Study 1 Stage 1では、exact search-based decision lossとstructural/response failureを用いたmachine-only discovery pipelineを確立し、4 exploratory candidatesを得た。**現在の最優先工程は、この4候補をfresh dataでprospectively formal confirmationするStage 2である。**

Stage 2 confirmationではStage 1 supportを再利用せず、candidate definition、population、seed、estimability gate、endpoint、multiplicity handling、decision ruleをformal outcome生成前に固定する。

Human misconceptionを主張する段階では、新しいhuman evidenceを必要とする。

### 第3段階: 理論および完全解析への展開

1. 限定終盤と必勝圏
2. 対称性と同型局面
3. 状態空間とゲーム木複雑度
4. 逆転可能性と勝負手

この段階では、数学的・計算論的性質と実戦的選択の違いを研究する。

## 6. 特に優先する三本柱

### 6.1 Bao局面分類学

相転移、局面類型、棋風、複雑度を統合し、Baoの局面を体系的に記述する。局面相転移点Study 1、局面類型と棋風Study 1、Namua→Mtaji Study 1、Position Complexity / Difficulty Study 1は完了した。Position Complexity Study 1のformal `inconclusive`を再検証する場合は、同一formal corpusの再解析ではなく、数値手法を事前固定したfresh prospective replicationとする。Human difficultyはmachine complexity layerとは別に独立検証する。

### 6.2 Bao手筋・悪手・錯覚体系

定石とは異なる局面横断的な手筋と、典型的な誤判断を対応付ける。

Tactical Motifs / Tesuji Study 1では4 canonical candidatesのうちC03がfresh Stage 2 formal confirmationを通過した。C03 Human / Expert Validation Study 1ではmachine/instrument pipelineとformal stimulus freezeまでは完了したが、human evidenceはN=0で非推定可能だった。

Blunder / Misvaluation Patterns Study 1 Stage 1ではmachine-reproducible bad-move / error-pattern taxonomyを探索し、4 exploratory candidatesをpromotionした。次の主要工程はfresh Stage 2 formal confirmationである。

Calibration Study 1がformal `INCONCLUSIVE`だったため、bad-move severityをformal validated win-probability lossとして定義しない。Human misconception validationは別evidence axisとして分離する。

### 6.3 Bao終盤科学

限定局面の完全解析、必勝圏、勝利距離、終盤テーブルベースを扱う。

## 7. 個別研究を開始・継続する条件

各研究課題または次stageを実施へ移す際は、最低限次を定義する。

- 研究課題と既存研究との差
- 検証可能な仮説
- 対象とするphaseおよび局面集合
- 使用するAI、探索深度、時間制限、seed
- 収集する特徴量とデータ形式
- 統計単位と相関の扱い
- 人間レビューが必要な箇所
- 成功基準、否定基準、estimability gate、停止条件
- 成果物の保存先

完了済み研究から派生する新研究では、既存Studyのformal decisionsを変更しないこと、endpoint・comparator・population・seed・decision ruleを結果を見る前に定義すること、confirmed/exploratory/descriptive vocabularyを同じ証拠水準として扱わないことを開始条件に含める。

Namua→Mtajiを扱う場合、現engineではfirst-Mtaji timingがdeterministic progressionであるため、`time-to-first-Mtaji` / survival / hazard / acceleration / delayをstrategic endpointとして再利用しない。

Position Complexity / Difficulty Study 1のH1を再検証する場合、既存Stage 2 corpusのoptimizer/tolerance変更による再判定は行わない。optimizer、収束基準、failure handling、fresh seed blockをprospective preregistrationで固定してから新規evidenceを生成する。

Tactical Motifs / Tesuji Study 1のC01/C02/C04を既存Stage 2 dataの再解析、追加seed、paired-definition substitution、threshold変更で救済しない。C03についてhuman/expert recognitionを再検証する場合は、Human / Expert Validation Study 1の`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`を変更しない新規prospective studyまたはversioned prospective reopeningとする。

Position Evaluation / Win-Rate Calibration Study 1を再検証する場合、既存Stage 2 corpusへ追加game、seed extension、identity-overlap replacement、readiness gate緩和、mapping refitを加えない。formal calibration generalizationはfresh prospective replicationとする。Study 1 isotonic mappingをformal validated probabilityとしてdownstream primary endpointに使用しない。

Blunder / Misvaluation Patterns Study 1 Stage 2を開始する場合、次を追加条件とする。

```text
Stage 1 candidate definitions BMP-S1-C01..C04 = immutable inputs
Stage 1 support/data = confirmation evidenceとして再利用しない
fresh Stage 2 seed block / population = outcome生成前に固定
formal endpoint / estimability / multiplicity / decision rule = preregistered
source-file identity = frozen
scientific generation = separate explicit authorization後のみ
```

Human evidenceなしではhuman error mechanismをformalに主張しない。

## 8. 到達目標

長期的な目標は、Baoを単にプレイ可能なゲーム、または勝率を比較できるAI対象として扱うだけでなく、次の形へ発展させることである。

- 局面を分類できる
- 戦略転換を説明できる
- 手筋と悪手・錯覚を証拠水準を分けて言語化できる
- 形勢評価とempirical outcomeの関係を再現可能に検証できる
- 重要局面を抽出できる
- 限定終盤を証明できる
- 人間の学習過程を支援できる

中心となる研究方針は次のとおりである。

> Baoの局面を分類し、局面間に共通する戦略原理を発見し、それを人間が理解できる知識へ変換する。
