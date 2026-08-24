# Bao 今後の研究課題

Version: 1.12.0  
Status: Active  
作成日: 2026-07-21  
更新日: 2026-08-24

## 1. 目的

この文書は、先攻・後攻差研究および第一次定石研究の完了後に検討する、Bao la Kiswahili の新しい研究方向を整理した研究アジェンダである。

ここで扱う課題は、既存研究の試行数追加、別seedによる追試、既存候補の結果後の救済ではない。囲碁・将棋で発展してきた局面分類、手筋、形勢判断、終盤解析、認知研究、計算複雑性研究などを参考にしつつ、Bao固有の構造へ置き換えた独立の研究領域を対象とする。

本書は実装ロードマップではない。各課題を実際に開始する際は、研究目的、仮説、測定方法、データ形式、判定基準、停止条件を個別の研究計画として定義する。

2026-08-23時点で、第1段階の「局面の相転移点」「局面類型と棋風」「Namua→Mtaji移行前後の戦略的転移構造」「局面複雑度と難易度」「手筋の発見と体系化」のStudy 1はいずれも完了した。Tactical Motifs / Tesuji Study 1では、fresh Stage 2 formal corpusによる4 canonical candidateの検証まで完了し、`TM-S2-C03`のみ`CONFIRMED`、C01/C02/C04は`NOT-CONFIRMED`となった。

C03のHuman / Expert Validation Study 1も完了した。machine/instrument側ではfresh 1,536-game corpus、independent full recomputation、near-miss control matching、42 unique formal positionsのdeterministic freezeまで完了した。一方human側は、独立研究者としてfrozen expert criteriaを満たす対象へ現実的にアクセスする経路を確保できず、scientific recruitmentを開始しないまま`N=0`で閉じた。human axisのformal labelは`INCONCLUSIVE-NOT-ESTIMABLE`であり、これはC03へのnegative human evidenceではない。

第2段階では、measurement dependencyを理由に先行させたPosition Evaluation / Win-Rate Calibration Study 1も完了した。Stage 1ではphase-stratified isotonic mappingをexploratoryに選択し、fresh Stage 2では全2,048局のindependent verificationとStage 1 identity overlap 0を達成した。しかしstrict identity firewallとno-replacement selection後に3つのpreregistered estimability gateが未達となったため、formal decisionは`INCONCLUSIVE`である。mappingはformalにvalidatedされたBao勝率ではない。

Blunder / Misvaluation Patterns Study 1もStage 2 formal confirmationまで完了した。Stage 1では2,048 fresh games、1,200 selected roots、5,295 exact legal movesから4 exploratory candidatesをpromotionした。Stage 2ではfresh 4,096 games、3,559 unique historical trajectories、2,678 formal measurementsを用い、independent corpus/measurement verificationとStage 1 identity overlap `0 / 0 / 0`を達成した。4候補すべてestimableだったが、formal resultは**0 `CONFIRMED` / 4 `NOT-CONFIRMED`**である。C01-C03はstructural/reply failure signature自体を高率に再現したが、共通D3-inferior recurrenceがconfirmation floorを満たさず、C04はfailure recurrenceとD3-inferior recurrenceの両方が事前floorを満たさなかった。

Critical Positions / Outcome Branching Study 1も完了した。fresh 3,072-game Stage 1 corpusからoutcome-blindに600 roots（Namua/Mtaji 300/300）を選択し、2,666 exact root-move interventionsを測定・独立再測定した。全600 rootsがprimary-estimableで、`D_range >= 0.30`のhigh-divergence rootsは139/600（Namua 52、Mtaji 87）だった。一方、frozen one-to-two-token structural grammarから得た1,183 candidate auditsのうちpromotion gateをすべて通過したcandidateは0で、Stage 2 formal targetは形成されなかった。Stage 2 generationはauthorize/executeせず、reserved seeds `22700001..22706144`は未消費のままStudy 1をnegative exploratory resultとして閉じた。

Restricted Endgame / Winning Regions Study 1も完了した。outcome-blindなStage 0 technical selectionと独立graph reconstructionを経て、standard initial stateから到達証明を持つ1つのMtaji rootのcomplete forward closure（8 states / 7 legal edges）をprospectively freezeした。Stage 1ではproduction solverと別実装のindependent verifierが全state rows、state/edge hashes、value、DTF、optimal movesを完全一致させ、formal decisionは`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`となった。frozen rootはPlayer 0の`WIN`, DTF=3で、unique optimal moveは`capture:mtaji:1:4:left:::false`である。このexact claimは8-state bounded domainだけに限定される。

Symmetry / Isomorphic Positions Study 1も完了した。technically invalidated v1 executionのfresh bounded-local diagnosticsでは3 scientific candidates・5 preregistered scopesすべてでproduction / independent双方がexact mismatch 0を再現したが、mandatory oracle reconstructionでIDENTITY positive controlがFAILしたためv1はcandidate-decision runとして無効化された。corrected v2はformal spec / authorization / independent verifier / resultを作成せず未承認・未実行で終了した。したがってvalid formal candidate-decision runは完成せず、Study-level resultは0 validated / 0 rejected / 5 `NON-ESTIMABLE`で閉じた。post-v1 read-only diagnosticで確認したoracle terminal-row identity limitationはRestricted Endgame Study 1のformal decisionを変更しない。

完了済みStudyのformal decisionを後続研究で変更しない。Blunder / Misvaluation Patterns Study 1についても、同じStage 2 dataへの追加game、seed extension、threshold/floor緩和、candidate再定義、alternate primary depth/evaluator、favorable subgroupによる救済を行わない。Critical Positions / Outcome Branching Study 1についても、Stage 1 outcomeを見た後のgrammar拡張、near-miss promotion、threshold relaxation、manual Stage 2 target selectionによる救済を行わない。

2026-08-24の研究運用上、Baoに精通したhuman/expert participantへの現実的アクセスを確保できないため、「人間とAIの判断差」は当面保留とする。human claimをmachine-only evidenceで代替しない。machine-only sequenceでは限定終盤と必勝圏 Study 1に続き、**対称性と同型局面 Study 1も完了したがformal resultは5/5 `NON-ESTIMABLE`**であり、validated transformation setは空である。したがってState Space / Game Tree Complexity Studyは**raw state identityなら進行可能**だが、本Study 1のT01/T02/T03をsymmetry reductionへ使用してはならない。symmetry-reduced countを扱いたい場合は、Restricted Endgame Study 1をretrofitせず、oracle terminal-state representation / captured-seed accounting / raw-state identity contractを独立監査する新しいprospective Studyを先行させる。

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
- Blunder / Misvaluation Patterns Study 1 — [`blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md)（Study 1 closed / 0 `CONFIRMED` / 4 `NOT-CONFIRMED`）
- Critical Positions / Outcome Branching Study 1 — [`critical-positions-outcome-branching/STUDY_1_OVERVIEW.md`](critical-positions-outcome-branching/STUDY_1_OVERVIEW.md)（Study 1 closed after Stage 1 negative exploratory result / promoted candidates 0 / Stage 2 not executed）
- Restricted Endgame / Winning Regions Study 1 — [`restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md)（Study 1 complete / `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` / 8 states / 7 edges）
- Symmetry / Isomorphic Positions Study 1 — [`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md)（Study 1 complete / 0 validated / 0 rejected / 5 `NON-ESTIMABLE`; fresh bounded-local mismatch 0, mandatory oracle-anchor G12 failed）

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

Study 1では、固定representation / population内でMtajiの`MTAJI-M1 / MTAJI-M2`二類型をformalにconfirmedした。Namuaでは離散typeをpromoteせず、`N-ACT / N-CON`をexploratory continuous coordinatesとして保持した。discrete playing-style cluster setは支持されず、探索で得たexact `STYLE-C1..C4` 4D geometryも独立確認では`NOT-CONFIRMED`となった。

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
**状態:** Study 1 closed / formal decision `NOT-CONFIRMED`

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

**状態:** Study 1 closed / complete。Stage 2 formal decision: C03 `CONFIRMED`; C01/C02/C04 `NOT-CONFIRMED`。

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

### 4.5 悪手・誤評価パターン — Study 1完了

#### 現在の状態

**Study 1 closed / Stage 2 formal confirmation complete / 0 `CONFIRMED` / 4 `NOT-CONFIRMED`。**

- 初見向け概要: [`blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md)
- 科学的正本: [`blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`](blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md)
- Formal result: [`blunder-misvaluation-patterns/results/STAGE_2_FORMAL_RESULT.json`](blunder-misvaluation-patterns/results/STAGE_2_FORMAL_RESULT.json)
- Reproducibility: [`blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md`](blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md)

#### Stage 1 discovery

Stage 1ではfresh 2,048 games / 1,884 unique historical trajectoriesを独立verificationし、1,200 unique rule statesと5,295 exact legal movesを測定した。

```text
matcherCount = 16421
detailedCandidateCount = 123624
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

#### Stage 2 formal confirmation

Fresh Stage 2:

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
independent full replay/search verification = PASS
G01 Namua selected/measured states = 1868
G02 Mtaji selected/measured states = 810
total formal measurements = 2678
final Stage 1 identity overlap = 0 / 0 / 0
independent measurement verification = PASS
```

4候補すべてestimability gateをPASSし、4 candidates × 2 co-primary endpointsの8 testsをHolm-Bonferroni FWER 0.05で評価した。

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
CONFIRMED = 0
```

C01-C03のfailure recurrenceはそれぞれ`0.923983 / 0.797645 / 0.794968`と高率だったが、共通D3-inferior recurrenceは`0.464668`でconfirmation floor `0.70`未満だった。C04はfailure recurrence `0.627160 < 0.65`、D3-inferior recurrence `0.507407 < 0.70`だった。

#### Boundary / future use

この結果は、exact frozen machine-operational candidate patternがformal confirmation ruleを通らなかったことを意味する。「その手はgame-theoretically悪手ではない」という証明ではない。

C01-C03のstructural/reply failure signature再現性は新しいhypothesis generationには利用できるが、現Studyのformal resultをpositiveへ変更しない。同一Stage 2への追加game、seed extension、threshold/floor緩和、candidate再定義、alternate primary depth/evaluator、favorable subgroupによる救済は禁止する。新しく検証する場合はfresh prospective independent studyとする。

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

### 4.8 限定終盤と必勝圏 — Study 1完了

#### 現在の状態

**Study 1 complete / formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`。**

- 初見向け概要: [`restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md)
- 科学的正本: [`restricted-endgame-winning-regions/STUDY_1_FINAL_REPORT.md`](restricted-endgame-winning-regions/STUDY_1_FINAL_REPORT.md)
- Canonical oracle: [`restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json`](restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json)

Study 1ではMtaji-only、historically reachable root、raw state identity、no symmetry reduction、complete legal forward closureを採用した。Outcome-blind Stage 0 selectionでfinal domainを固定し、Stage 1 exact solutionとindependent full verificationを完了した。

```text
roots = 1
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
```

Frozen rootはPlayer 0 to moveの`WIN`、absoluteWinner = 0、`DTF = 3`、unique optimal move = `capture:mtaji:1:4:left:::false`。より大きいone-shot candidateは423,733 states / 426,938 edgesまで展開したが、1着手が1,000,000 microstepsの`ADMIN-CUTOFF`へ達したためexact不適格となり、cutoffをdraw/lossへ読み替えず追加cap拡張も行わなかった。

Exact claimはfrozen 8-state domainだけに限定する。Bao全体、全Mtaji、全終盤、cycle absence、engine evaluation correctness、symmetry成立は主張しない。

#### 後続利用

このraw exact oracleを次のSymmetry / Isomorphic Positions Studyで候補変換がstate value・optimal move set・DTFを保存するか検証するground truthとして利用する。Study 1自体へsymmetry reductionをretrofitしない。
---

### 4.9 重要局面と勝敗分岐点 — Study 1完了

#### 現在の状態

**Critical Positions / Outcome Branching Study 1 closed after Stage 1 negative exploratory result / promoted candidates 0 / Stage 2 not executed。**

- 初見向け概要: [`critical-positions-outcome-branching/STUDY_1_OVERVIEW.md`](critical-positions-outcome-branching/STUDY_1_OVERVIEW.md)
- 科学的正本: [`critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md`](critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md)
- Compact summary: [`critical-positions-outcome-branching/results/STAGE_1_EXPLORATORY_SUMMARY.json`](critical-positions-outcome-branching/results/STAGE_1_EXPLORATORY_SUMMARY.json)

Study 1では「評価値の急変」をvalidated win-probability changeとして扱わず、同一root stateの全exact legal movesをinterveneした後のfixed-policy empirical continuation outcome divergenceをprimary constructとした。

Fresh Stage 1:

```text
games = 3072
selected roots = 600 = 300 Namua + 300 Mtaji
measured exact root-move interventions = 2666
primary-estimable roots = 600 / 600
high-divergence threshold = D_range >= 0.30
Namua high-divergence roots = 52 / 300
Mtaji high-divergence roots = 87 / 300
overall high-divergence roots = 139 / 600
```

independent full corpus replay、outcome-blind selection、continuation/secondary/structural measurement、independent full remeasurement/recomputationはいずれもPASSした。

Frozen deterministic discovery:

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
manualOverridePerformed = false
zeroPromotedCandidatesAllowed = true
```

したがって、**高いfixed-policy empirical continuation divergenceを持つfresh rootsは観測されたが、今回のfrozen one-to-two-token pre-root structural grammarでは、support/diversity/recurrence/median-divergence条件をすべて満たす再現可能なstructural classをpromotionできなかった**、がStudy 1のbounded conclusionである。

これはStage 2 `NOT-CONFIRMED`ではない。また「Baoに重要局面が存在しない」「true/game-theoretic turning pointがない」「human/expertにとって重要な局面がない」という証明でもない。

Stage 2はexact Stage 1 promoted-candidate mappingを事前freezeする設計だったが、promoted candidateが0だったためformal targetが存在しなかった。Stage 2 generationはauthorize/executeせず、reserved seeds `22700001..22706144`は未消費である。

#### 今後の研究候補

今回の結果を救済せず、より豊富なstructural representation、interaction grammar、trajectory/context featureを用いてhigh-divergence rootの再現可能な分類を試みる場合は、新しいprospective independent studyとして実施する。

Calibration Study 1のisotonic mappingをformal validated勝率変化として使わない。Blunder / Misvaluation Patterns Study 1のC01-C04もvalidated critical-position markerとして使用しない。

#### 期待成果

将来の独立研究では、勝着、敗着、疑問手、分岐点を中心とする自動棋譜解説、一局から少数問を生成する復習機能へ接続可能な、より再現性の高いcritical-position representationを目指す。

---

### 4.10 人間とAIの判断差

#### 現在の実行状態

**当面保留。** Baoに精通したqualified human/expert participantへの現実的アクセスを確保できないため、human evidenceを必要とする本研究には着手しない。アクセス可能性が変化するまでmachine-only代替研究へ置換せず保留する。この運用判断はhuman/AI differenceについてのscientific resultではない。

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

#### 現在の実行状態

**Study 1完了 / formal result 0 validated / 0 rejected / 5 `NON-ESTIMABLE`.**

- 初見向け概要: [`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md)
- 科学的正本: [`symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md`](symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md)

Technically invalidated v1のfresh historically reachable bounded-local diagnosticsではT01 seat swap、T02 houseless-Mtaji LR、T03 compositionの5 preregistered scopesすべてでexact mismatch 0だった。しかしmandatory exact-oracle reconstructionのIDENTITY positive control failureによりv1はcandidate-decision runとして無効化され、corrected v2は未承認・未実行で終了した。valid formal candidate-decision runは完成していないためvalidated transformは0件で、canonicalization / symmetry group / symmetry-reduced state countingは未承認である。

Post-outcome read-only diagnosticで確認したterminal state-row identity limitationは、完了済みRestricted Endgame Study 1を変更・救済する根拠として使わない。

#### 今後の独立研究候補

**Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation**（作業名）として、terminal-state representation、captured-seed accounting、raw-rule-state identity、state-key serializationを新規prospective contractで独立監査する。必要ならその後にfresh symmetry confirmationを行う。既存SIP-STUDY1の5 `NON-ESTIMABLE` decisionは変更しない。

#### Downstream boundary

State Space / Game Tree Complexity Studyはraw state identityで進行できる。本Study 1のT01/T02/T03をstate reductionに使用してはならない。

---

### 4.12 状態空間とゲーム木複雑度

#### 現在の実行状態

**machine-only次研究候補。** raw state identityによる状態空間・ゲーム木複雑度研究は着手可能。一方、symmetry-reduced canonical state countはSymmetry Study 1で未承認のため、T01/T02/T03によるreductionを使用しない。symmetry-reduced countをformal targetに含める場合は、別prospective studyでanchor integrityとtransform validationを先に確立する。

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
3. **[完了] Namua→Mtaji移行前後の戦略的転移構造 — Study 1 (`NOT-CONFIRMED`)**
4. **[完了] 局面複雑度と難易度 — Study 1 (`INCONCLUSIVE`)**
5. **[完了] 手筋の発見と体系化 — Study 1（C03 `CONFIRMED` / C01,C02,C04 `NOT-CONFIRMED`）**

第1段階の5 Studyは完了した。既存のnegative/inconclusive resultを別研究で救済しない。

### 第2段階: 理解、教育、解説への展開

現在の状態:

1. **[完了] 形勢判断と勝率校正 — Study 1 (`INCONCLUSIVE`)**
2. **[完了] 悪手・誤評価パターン — Study 1（0 `CONFIRMED` / 4 `NOT-CONFIRMED`）**
3. **[完了] 重要局面と勝敗分岐点 — Study 1（139/600 high-divergence roots / promoted candidates 0 / Stage 2 not executed）**
4. **[当面保留] 人間とAIの判断差 — qualified human/expert participantへのアクセス確保まで着手しない**

Position Evaluation / Win-Rate Calibration Study 1によって、engine evaluationとempirical continuation outcomeを分離して扱うtechnical measurement foundationは得られたが、formal held-out validationはestimability failureで未解決である。

Blunder / Misvaluation Patterns Study 1によって、exact search-based decision lossとstructural/response failureを用いたmachine-only discovery→fresh formal confirmation pipelineは実装・検証された。ただし4候補はいずれもfull confirmationを通過しなかった。C01-C03のstructural failure recurrenceは将来の新規仮説を動機づけうるが、現Studyのpositive resultへ昇格させない。

Critical Positions / Outcome Branching Study 1によって、全exact legal root movesへのinterventionとfixed-policy continuation outcomeを用いるmachine-only criticality measurement pipelineはfull independent verificationまで実装・検証された。high-divergence roots自体は139/600観測されたが、frozen structural grammarからformal Stage 2 candidateへpromotionできるclassは0だった。これは新しいrepresentation研究を動機づけうるが、同Study内でのgrammar/threshold rescueは行わない。

第2段階で残る「人間とAIの判断差」はhuman evidence依存であり、現状のparticipant access制約下では着手しない。human misconceptionを主張する段階では新しいhuman evidenceを必要とし、machine self-playを代替証拠として用いない。したがって、現在のmachine-only研究プログラムは第3段階へ進む。

### 第3段階: 理論および完全解析への展開

1. **[完了] 限定終盤と必勝圏 — Study 1 (`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`)**
2. **[完了] 対称性と同型局面 — Study 1（5/5 `NON-ESTIMABLE`）**
3. **[推奨先行候補] Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation — new prospective Study**
4. **[raw identityなら着手可] 状態空間とゲーム木複雑度**
5. **[後続候補] 逆転可能性と勝負手**

限定終盤と必勝圏 Study 1のbounded exact solutionはそのformal boundaryのまま保持する。Symmetry Study 1ではinvalidated v1 fresh diagnosticsとしてzero-mismatchを観測した一方、valid formal candidate-decision runは完成せず、corrected v2は未承認・未実行のままStudy-level 5/5 `NON-ESTIMABLE`で閉じた。したがってcanonical representationやsymmetry reductionをState Space研究の前提にしない。raw-state State Space研究は進行可能であり、symmetry-reduced countが必要な場合のみ、上流Studyを変更しない新規oracle-integrity / symmetry-confirmation研究を先行させる。

## 6. 特に優先する三本柱

### 6.1 Bao局面分類学

相転移、局面類型、棋風、複雑度を統合し、Baoの局面を体系的に記述する。局面相転移点Study 1、局面類型と棋風Study 1、Namua→Mtaji Study 1、Position Complexity / Difficulty Study 1は完了した。Position Complexity Study 1のformal `INCONCLUSIVE`を再検証する場合は、同一formal corpusの再解析ではなく、数値手法を事前固定したfresh prospective replicationとする。Human difficultyはmachine complexity layerとは別に独立検証する。

Critical Positions / Outcome Branching Study 1ではfixed-policy high-divergence rootsを抽出するmeasurement基盤は成立したが、単純なstructural grammarによる再現可能class promotionは0だった。重要局面分類学を発展させる場合は、より豊富なrepresentationを新規prospective studyで検証する。

### 6.2 Bao手筋・悪手・錯覚体系

定石とは異なる局面横断的な手筋と、典型的な誤判断を対応付ける。

Tactical Motifs / Tesuji Study 1では4 canonical candidatesのうちC03がfresh Stage 2 formal confirmationを通過した。C03 Human / Expert Validation Study 1ではmachine/instrument pipelineとformal stimulus freezeまでは完了したが、human evidenceはN=0で非推定可能だった。

Blunder / Misvaluation Patterns Study 1はfresh Stage 2まで完了し、4候補すべてestimableだったが0 `CONFIRMED` / 4 `NOT-CONFIRMED`で閉じた。C01-C03のstructural/reply failure signaturesは高率に再現した一方、D3-inferior co-primary endpointを満たさなかった。したがって、これらをconfirmed blunder patternとして教材・解説へ直接昇格させない。

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

Blunder / Misvaluation Patterns Study 1はStage 2まで完了しているため、同Studyの「次stage」として再開しない。C01-C04を再検証する場合も、既存Stage 2への追加game、seed extension、threshold/floor緩和、candidate edit、alternate primary depth/evaluator、favorable subgroupでformal decisionを変更しない。新しい問い、endpoint、population、seed、source identity、decision ruleをoutcome生成前に固定した**新規prospective independent study**としてのみ扱う。C01-C03のstructural failure recurrenceを新研究のhypothesis-generation inputに使うことはできるが、現Studyのconfirmation evidenceにはならない。

Critical Positions / Outcome Branching Study 1はStage 1 negative exploratory resultとして閉じているため、同Studyの「Stage 2 target」を後から作らない。既存Stage 1 dataを見た後のcandidate grammar broadening/narrowing、near-miss promotion、support/divergence threshold relaxation、manual target selection、Stage 2 seed consumptionは行わない。より豊かなrepresentationを検証する場合は、new study ID、fresh preregistration、fresh evidenceを用いる。

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