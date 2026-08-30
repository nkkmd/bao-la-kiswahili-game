# Bao 今後の研究課題

Version: 2.0.0
Status: Active
作成日: 2026-07-21
更新日: 2026-08-30

## 1. 目的

この文書は、先攻・後攻差研究および第一次定石研究の完了後に検討する、Bao la Kiswahili の新しい研究方向を整理した研究アジェンダである。

ここで扱う課題は、既存研究の試行数追加、別seedによる追試、既存候補の結果後の救済ではない。囲碁・将棋で発展してきた局面分類、手筋、形勢判断、終盤解析、認知研究、計算複雑性研究などを参考にしつつ、Bao固有の構造へ置き換えた独立の研究領域を対象とする。

本書は実装ロードマップではない。各課題を実際に開始する際は、研究目的、仮説、測定方法、データ形式、判定基準、停止条件を個別の研究計画として定義する。

2026-08-26から、本書は第一世代研究のclosure記録に加えて**第二世代の純粋研究アジェンダ**を保持する。第二世代研究はBaoそのものについての再現可能な知識を増やすことを目的とし、publicで使用中のBao AIの棋力向上・製品品質・deployment結果をscientific endpointまたは成功基準に含めない。完了した研究成果をAI改善へ利用する工程は、研究プログラムとは独立したengineering trackとして別管理する。engineering側の結果によって既存Studyまたは第二世代Studyのformal decisionを変更しない。

第一世代節に残るAI・教材・解説への言及は、研究成果の**潜在的downstream利用**を示す歴史的・構想上の記述であり、第二世代研究のendpointではない。各第二世代Studyでは研究用engine / evaluator / search semantics / population / seed / identity contractをprospectively freezeし、public AIがその後変更されても当該Studyのscientific instrumentをretroactiveに変更しない。

2026-08-23時点で、第1段階の「局面の相転移点」「局面類型と棋風」「Namua→Mtaji移行前後の戦略的転移構造」「局面複雑度と難易度」「手筋の発見と体系化」のStudy 1はいずれも完了した。Tactical Motifs / Tesuji Study 1では、fresh Stage 2 formal corpusによる4 canonical candidateの検証まで完了し、`TM-S2-C03`のみ`CONFIRMED`、C01/C02/C04は`NOT-CONFIRMED`となった。

C03のHuman / Expert Validation Study 1も完了した。machine/instrument側ではfresh 1,536-game corpus、independent full recomputation、near-miss control matching、42 unique formal positionsのdeterministic freezeまで完了した。一方human側は、独立研究者としてfrozen expert criteriaを満たす対象へ現実的にアクセスする経路を確保できず、scientific recruitmentを開始しないまま`N=0`で閉じた。human axisのformal labelは`INCONCLUSIVE-NOT-ESTIMABLE`であり、これはC03へのnegative human evidenceではない。

第2段階では、measurement dependencyを理由に先行させたPosition Evaluation / Win-Rate Calibration Study 1も完了した。Stage 1ではphase-stratified isotonic mappingをexploratoryに選択し、fresh Stage 2では全2,048局のindependent verificationとStage 1 identity overlap 0を達成した。しかしstrict identity firewallとno-replacement selection後に3つのpreregistered estimability gateが未達となったため、formal decisionは`INCONCLUSIVE`である。mappingはformalにvalidatedされたBao勝率ではない。

Blunder / Misvaluation Patterns Study 1もStage 2 formal confirmationまで完了した。Stage 1では2,048 fresh games、1,200 selected roots、5,295 exact legal movesから4 exploratory candidatesをpromotionした。Stage 2ではfresh 4,096 games、3,559 unique historical trajectories、2,678 formal measurementsを用い、independent corpus/measurement verificationとStage 1 identity overlap `0 / 0 / 0`を達成した。4候補すべてestimableだったが、formal resultは**0 `CONFIRMED` / 4 `NOT-CONFIRMED`**である。C01-C03はstructural/reply failure signature自体を高率に再現したが、共通D3-inferior recurrenceがconfirmation floorを満たさず、C04はfailure recurrenceとD3-inferior recurrenceの両方が事前floorを満たさなかった。

Critical Positions / Outcome Branching Study 1も完了した。fresh 3,072-game Stage 1 corpusからoutcome-blindに600 roots（Namua/Mtaji 300/300）を選択し、2,666 exact root-move interventionsを測定・独立再測定した。全600 rootsがprimary-estimableで、`D_range >= 0.30`のhigh-divergence rootsは139/600（Namua 52、Mtaji 87）だった。一方、frozen one-to-two-token structural grammarから得た1,183 candidate auditsのうちpromotion gateをすべて通過したcandidateは0で、Stage 2 formal targetは形成されなかった。Stage 2 generationはauthorize/executeせず、reserved seeds `22700001..22706144`は未消費のままStudy 1をnegative exploratory resultとして閉じた。

Restricted Endgame / Winning Regions Study 1も完了した。outcome-blindなStage 0 technical selectionと独立graph reconstructionを経て、standard initial stateから到達証明を持つ1つのMtaji rootのcomplete forward closure（8 states / 7 legal edges）をprospectively freezeした。Stage 1ではproduction solverと別実装のindependent verifierが全state rows、state/edge hashes、value、DTF、optimal movesを完全一致させ、formal decisionは`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`となった。frozen rootはPlayer 0の`WIN`, DTF=3で、unique optimal moveは`capture:mtaji:1:4:left:::false`である。このexact claimは8-state bounded domainだけに限定される。

Symmetry / Isomorphic Positions Study 1も完了した。technically invalidated v1 executionのfresh bounded-local diagnosticsでは3 scientific candidates・5 preregistered scopesすべてでproduction / independent双方がexact mismatch 0を再現したが、mandatory oracle reconstructionでIDENTITY positive controlがFAILしたためv1はcandidate-decision runとして無効化された。corrected v2はformal spec / authorization / independent verifier / resultを作成せず未承認・未実行で終了した。したがってvalid formal candidate-decision runは完成せず、Study-level resultは0 validated / 0 rejected / 5 `NON-ESTIMABLE`で閉じた。post-v1 read-only diagnosticで確認したoracle terminal-row identity limitationはRestricted Endgame Study 1のformal decisionを変更しない。

Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 (`ORISC-STUDY1`)も完了した。Axis Aではproduction / independent別実装が凍結rootからimmutable 8-state / 7-edge raw graphを完全一致で再構成し、全stateの64-seed representation、terminal captured/pending accounting、transition successor bindingを確認した。一方、repository-facing oracleの3 terminal rowsがstored-row re-hash / reconstructed raw-state bindingをFAILし、差分fieldは`pending`のみだった。production / independentは同じfailureを再現したためformal decisionは`ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`である。Stage 2 symmetry candidate contractはAxis A outcome前にfreeze済みだったが、Axis A `CONFIRMED`とIDENTITY PASSがauthorization prerequisiteだったためAxis Bは`NOT-AUTHORIZED-NOT-EXECUTED`で閉じた。validated transformation setは引き続き空である。

完了済みStudyのformal decisionを後続研究で変更しない。Blunder / Misvaluation Patterns Study 1についても、同じStage 2 dataへの追加game、seed extension、threshold/floor緩和、candidate再定義、alternate primary depth/evaluator、favorable subgroupによる救済を行わない。Critical Positions / Outcome Branching Study 1についても、Stage 1 outcomeを見た後のgrammar拡張、near-miss promotion、threshold relaxation、manual Stage 2 target selectionによる救済を行わない。ORISC-STUDY1についてもrepository rowの後付け修正によるAxis A再判定や、同Study内でのStage 2 authorization追加による救済を行わない。

2026-08-25時点で、Baoに精通したhuman/expert participantへの現実的アクセスを確保できないため、「人間とAIの判断差」は当面保留とする。human claimをmachine-only evidenceで代替しない。machine-only sequenceでは限定終盤、Symmetry Study 1、ORISC-STUDY1に続き、State Space / Game Tree Complexity Study 1も完了した。

State Space / Game Tree Complexity Study 1は、ORISCのRAW-ONLY downstream contractを維持してstandard initial stateからdepth 8までのbounded reachable raw-state graphとgame treeをprospectively freezeし、production / independent双方の全域再列挙一致により`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`で閉じた。exact resultは24,848 raw states / 25,648 graph transition occurrences / 30,941 game-tree node occurrences / 30,940 tree edgesである。ただしこれはfrozen depth-8 domainだけのexact claimであり、Bao全体のstate-space sizeやfull game-tree complexityを解いたことを意味しない。canonicalization / symmetry-reduced state countingは引き続き未承認で、より深い列挙・full-game estimation・symmetry reductionは新しいprospective study/versioned protocolとして扱う。

Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`)も完了した。RAW-ONLY identityを維持し、fresh 3,072-game Stage 1 corpusから300 disadvantaged roots（Namua/Mtaji 150/150）、1,065 exact root-move interventions、18,105 continuation rowsを測定し、independent verifierがsource generation、selection、measurement、discoveryを再構築して一致した。frozen `PCEM-T1..T8` grammarから55 candidate auditsを得たが、promotion gateを全て通過したcandidateは0だったため、Stage 1は`EXPLORATORY-ONLY`で閉じ、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`とした。reserved Stage 2 seeds `23300001..23306144`は未消費である。同じStage 1 dataに対するthreshold relaxation、near-miss promotion、favorable subgroup、candidate grammar expansion、opponent-policy substitutionによる救済は行わない。

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
- Symmetry / Isomorphic Positions Study 1 — [`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md)（Study 1 complete / 0 validated / 0 rejected / 5 `NON-ESTIMABLE`; invalidated v1 fresh bounded-local mismatch 0、corrected v2未実行）
- Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 — [`oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`](oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md)（Study complete / Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` / Axis B `NOT-AUTHORIZED-NOT-EXECUTED`）
- State Space / Game Tree Complexity Study 1 — [`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md)（Study complete / `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN` / standard-root depth 8で24,848 raw states / 30,941 game-tree node occurrences / RAW-ONLY）
- Practical Comeback / Error-Inducing Move Study 1 — [`practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md`](practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md)（Study complete / Stage 1 `EXPLORATORY-ONLY` / 55 candidate audits / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`）

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

### 4.7 逆転可能性と勝負手 — Study 1完了

#### 現在の状態

**Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`) complete / Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`。**

- 初見向け概要: [`practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md`](practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md)
- 科学的正本: [`practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md`](practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md)
- Canonical compact result: [`practical-comeback-error-inducing-moves/results/STAGE_1_EXPLORATORY_RESULT.json`](practical-comeback-error-inducing-moves/results/STAGE_1_EXPLORATORY_RESULT.json)
- Artifact provenance: [`practical-comeback-error-inducing-moves/results/STAGE_1_ARTIFACT_PROVENANCE.json`](practical-comeback-error-inducing-moves/results/STAGE_1_ARTIFACT_PROVENANCE.json)

Study 1では、reference-policy上のmove qualityとfrozen imperfect-opponent policy下のbounded-horizon empirical comebackを分離した。RAW-ONLY identityを維持し、D3 referenceでmachine-reference disadvantagedと判定したfresh rootsから、strict-reference-inferior move、reply-defense concentration、first-reply reference-error dependence、bounded comebackを測定した。

```text
generated games = 3072
unique historical trajectories = 2764
selected roots = 300 = 150 Namua + 150 Mtaji
exact root-move interventions = 1065
continuation rows = 18105
candidate audits = 55
candidates passing promotion gates = 0
promoted candidates = 0
scientificLabel = EXPLORATORY-ONLY
```

Productionとindependent verifierはsource generation、root selection、RAW identity、measurement、discoveryを独立に再構築して一致した。55 candidate definitionsはすべてfrozen promotion conjunctionを満たさず、特にminimum unique-root / trajectory / opening-prefix supportとerror-condition / defense-condition root supportを満たさなかった。

Stage 1 promoted candidateが0件だったためStage 2はauthorize/executeせず、reserved seeds `23300001..23306144`は未消費である。

#### Boundary / future use

この結果は、「Baoに実戦的な勝負手が存在しない」「相手の誤りを誘発する手が存在しない」「人間に難しい応手を要求する構造が存在しない」という証明ではない。また、objective superiority、game-theoretic winning move、true Bao winning probability、human error probability、expert/traditional winning-try recognitionも確立しない。

同じStage 1 outcomeを見た後にthresholdを緩和する、near-missをpromotionする、favorable subgroupを選ぶ、candidate grammarを拡張する、opponent policyを置換する、Stage 1 rowsをStage 2 evidenceとして再利用することは禁止する。

より豊富なmove/reply representation、別のprospectively frozen imperfect-opponent family、human/expert response difficulty、traditional winning-try recognitionを検証する場合は、新しいprospective independent studyとfresh evidenceを使用する。

#### 期待成果

将来の独立研究では、PCEM-STUDY1を救済せず、machine-operational practical comeback structureとhuman/expert difficultyを別axisとして検証し、十分な再現性と外部妥当性が得られた場合に限って、劣勢時の実戦型AIや教材化へ接続する。

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

このraw exact oracleはSymmetry / Isomorphic Positions Study 1と、そのrepresentation contractを独立監査した`ORISC-STUDY1`のupstream anchorとして使用された。ORISCはraw 8-state / 7-edge graph自体を再構成したが、repository-facing state-row bindingを`NOT-CONFIRMED`とした。この結果はRestricted Endgame Study 1のexact decisionを変更しない。今後もStudy 1自体へsymmetry reductionをretrofitしない。

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

#### Follow-up studyの完了

このfollow-up requirementは、**Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 (`ORISC-STUDY1`)**として新しいprospective contractで実施済みである。

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated symmetry transformation set = []
```

ORISC Axis Aではraw graphそのものはproduction / independent双方でexact reconstructionできたが、repository-facing oracleの3 terminal rowsがre-hash / raw-state bindingをFAILした。IDENTITYがmandatory repository reconstruction requirementを満たさなかったため、pre-outcome frozen symmetry candidate contractは実行されなかった。既存SIP-STUDY1の5 `NON-ESTIMABLE` decisionは変更しない。

#### Downstream boundary

State Space / Game Tree Complexity Studyはauthoritative raw state identityで進行できる。SIP-STUDY1またはORISC-STUDY1のT01/T02/T03をstate reductionに使用してはならない。symmetry reductionを再検証する場合は、closed ORISCを修正・救済せず、新しいprospective study/versioned protocolを必要とする。

---

### 4.12 状態空間とゲーム木複雑度 — Study 1完了

#### 現在の状態

**State Space / Game Tree Complexity Study 1 complete / formal decision `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.**

- 初見向け概要: [`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md)
- 科学的正本: [`state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md`](state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md)
- Formal result: [`state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json`](state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json)
- Reproducibility: [`state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md`](state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md)

Study 1はORISC-STUDY1のdownstream representation firewallを維持し、`pits,reserve,houseOwned,player,phase,winner,pending`のraw identityのみを使用した。`turn/reason`はidentityから除外し、missing `pending`はengine entry前にhard reject、全accepted stateで64-seed conservationを要求した。SIP/ORISC transform、seat swap、reflection、canonicalization、symmetry quotientは使用していない。

Formal Stage 2はfresh evidenceでstandard rootからparent depth 0..7を完全展開し、raw-state depth 8までとnon-deduplicated tree depth 8までをexact enumerationした。

```text
reachable raw states through depth 8 = 24,848
graph transition occurrences parent depth 0..7 = 25,648
duplicate encounters = 801
multi-parent states = 763

game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940
raw-state / tree-node ratio = 0.803076823632074
```

Independent verifierはproduction serializer/formal runner/Stage 1 artifact codeをimportせず、frozen graph/tree全域を再列挙し、countとset hashを完全一致させた。

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

#### Boundary / future use

このexact resultはfrozen standard-root depth-8 RAW-ONLY domainだけに限定する。`Bao state space = 24,848`とは主張しない。full Bao state-space / full game-tree exact count、global growth law、global transposition ratio、full-game estimator、symmetry-reduced count、validated canonicalizationは未解決である。

Stage 1のpartial depth-9 rowsをestimateへ読み替えたり、結果後にcapを上げたりしない。より深いRAW-only exact enumeration、full-game estimation、またはsymmetry-reduced countingを検討する場合は、現Studyを延長・救済せず、新しいprospective study/versioned protocolとしてresource rule・estimatorまたはtransform authorizationを事前固定する。

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
3. **[完了] Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation — Study 1（Axis A `NOT-CONFIRMED` / Axis B `NOT-AUTHORIZED-NOT-EXECUTED`）**
4. **[完了] 状態空間とゲーム木複雑度 — Study 1 (`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`)**
5. **[完了] 逆転可能性と勝負手 — Study 1（Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`）**

限定終盤と必勝圏 Study 1のbounded exact solutionはそのformal boundaryのまま保持する。Symmetry Study 1ではinvalidated v1 fresh diagnosticsとしてzero-mismatchを観測した一方、valid formal candidate-decision runは完成せず5/5 `NON-ESTIMABLE`で閉じた。ORISC-STUDY1はそのoracle representation prerequisiteを独立に実施し、raw graph reconstruction自体はexact一致したがrepository-facing row bindingを`NOT-CONFIRMED`とし、conditional symmetry stageを未実行で閉じた。したがってcanonical representationやsymmetry reductionをState Space研究の前提にしない。State Space / Game Tree Complexity Study 1もRAW-ONLYで完了し、frozen depth-8 domainのbounded exact countを確立した。PCEM-STUDY1もfresh Stage 1 evidenceとfull independent reconstructionまで完了したが、55 candidate auditsからpromoted candidateは0で、Stage 2は未承認・未実行で閉じた。これらの完了研究を同一data・threshold変更・near-miss promotion・post-outcome再定義で救済せず、次のmachine-only研究はnew study IDまたはversioned prospective protocolとfresh evidenceを用いて設計する。

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

ORISC-STUDY1によって、exact-solved raw graphとrepository-facing representationを別endpointとして扱う必要性がformalに確認された。今後のtablebase / exact-oracle研究では、solver output、archived workflow artifact、repository-facing projection、raw identity keyのbinding contractを明示的に保存し、downstream利用時にrepresentation integrityを別gateとして扱う。

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

PCEM-STUDY1はStage 1 `EXPLORATORY-ONLY` / promoted candidate 0で閉じており、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。同じStage 1 dataに対するthreshold relaxation、near-miss promotion、favorable subgroup selection、candidate grammar expansion、opponent-policy substitution、Stage 1 rowsのStage 2 evidenceへの再利用は行わない。practical comeback / error-inducing moveを再検証する場合は、new study ID、fresh preregistration、fresh evidenceを用いる。

ORISC-STUDY1はcompleted studyであり、repository-facing rowsを修正して同一formal Axis Aを再実行したり、pre-outcome candidate contractを後からStage 2へ昇格させたりしない。representation repairやsymmetry re-confirmationを行う場合は、new study IDまたは明示的なnew version、fresh prospective authorization、outcome前のcontract freezeを必要とする。

STSCV-STUDY1は`INCONCLUSIVE` / 3 candidates `NON-ESTIMABLE`で閉じた。Fresh Stage 2 production outcome後に判明したindependent verifier implementation defectを修正して同じevidenceを再実行し、candidate decisionを救済しない。state transformation / canonicalizationを再検証する場合は、new study IDまたは明示的なnew version、fresh prospective authorization、fresh formal evidenceを必要とする。STSCV production-only zero-mismatch diagnosticsをvalidated transformとしてdownstream state deduplicationへ使用しない。

State Space / Game Tree Complexity Studyを開始する場合、少なくともStudy 1ではauthoritative raw state identityをstate-count identityとし、ORISC/SIPでformal validationされていないtransformをcanonicalizationやdeduplicationへ使用しない。symmetry-reduced countは別のvalidated symmetry studyなしにformal primary resultとして主張しない。

TMGC-STUDY1は`TECHNICAL-INVALID`で閉じ、Stage 1/2 scientific seedsは未消費である。同Study内でindependent boundary aggregatorを修正してtooling smokeをrerunし、Stage 1 authorizationを後付けしない。C03 generalization / counterexampleを再検証する場合はnew prospective Studyまたはexplicit new version、fresh technical-entry contract、fresh authorizationを使用する。

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

## 9. 第二世代研究アジェンダ

### 9.1 位置づけ

第一世代のmachine-only研究系列は一通りclosureした。human/expert evidenceを必要とする「人間とAIの判断差」はparticipant access制約のため当面保留であり、machine evidenceで代替しない。

第二世代の作業英語名は次とする。

**Bao Second-Generation Research Program — Robust Measurement, Strategic Representation, Temporal Structure, and Exact Analysis**

日本語作業名:

**Bao第二世代研究計画 — 測定の頑健化、戦略表現の高度化、時間構造の統合、exact解析の拡張**

以下の`G2-01`〜`G2-12`および`G2-H01`は**Agenda上の順序ラベルであり、正式Study IDではない**。正式な研究題目、Study ID、stage ID、seed range、endpoint、threshold、estimability gate、停止条件は、各研究開始時に既存命名規則との整合を確認したうえでoutcome生成前にprospectively固定する。

第二世代の中心目的は、第一世代で確立したmeasurement boundary、negative / inconclusive / non-estimable result、bounded exact resultを保持したまま、より頑健な測定、より豊かな戦略表現、時間構造、exact knowledgeを新しいfresh evidenceで検証することである。

### 9.2 研究とAI改善の分離

第二世代は純粋な研究プログラムとして完結させる。

- public AIの棋力、対局勝率、応答速度、ユーザー体験、deployment成否を研究endpointにしない。
- 研究結果をpublic AIへ実装したかどうかをStudyの成功条件にしない。
- public AIの改善結果を用いて、既存Studyまたは第二世代Studyのformal decisionを変更しない。
- public AIの新しいversionを将来の研究instrumentとして使用する場合は、そのversionを別のresearch instrumentとしてoutcome前にfreezeする。
- 研究成果は完了後、独立したengineering trackへのinputになり得るが、そのtranslation / implementation / benchmark / deploymentは本Agendaの研究課題に含めない。

したがって研究とengineeringの関係は原則として一方向とする。

```text
completed research result
        ↓
separate AI engineering program
```

engineering上の観測から新しい科学的疑問が生じた場合は、既存Studyへ戻して結果を変更せず、新しいprospective research questionとして別Studyを開始する。

### 9.3 第二世代共通科学contract

各core Studyは少なくとも次を満たす。

1. 第一世代のformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更・救済しない。
2. 第一世代dataはhypothesis generation、resource planning、failure-mode identification、technical fixtureには利用できるが、第二世代のformal confirmation evidenceへ無条件に再利用しない。
3. formal claimには原則fresh evidenceを用い、development / exploratory / confirmationのidentity firewallを明示する。
4. research engine commit、evaluator、search semantics、depth / node budget、policy、seed rangeをoutcome生成前にfreezeする。
5. authoritative state identityは、別のvalid formal transformation studyが成立するまでは`pits,reserve,houseOwned,player,phase,winner,pending`のRAW identityとする。`turn`と`reason`はidentityへ含めない。
6. symmetry / reflection / seat swap / quotient identity / canonicalizationは、G2-03等の独立Studyでformal validationされるまでstate deduplicationへ使用しない。
7. engine evaluation、empirical continuation outcome、game-theoretic value、search reliability、structural complexity、decision criticality、practical comeback、machine decision failure、human difficulty/errorを別constructとして保持する。
8. resource cutoff、administrative cutoff、missing evidenceをwin/loss/drawまたはscientific nullへ読み替えない。
9. independent verifierまたは同等のindependent reconstructionを原則として設け、productionと同じscientific logicを無検証で共有しない。
10. solver output、workflow artifact、repository-facing projection、raw identity bindingを別々に追跡し、representation integrityをdownstream利用の独立gateとする。
11. negative / null / inconclusive / non-estimable / not-authorized resultも正常なclosure outcomeとして保存する。
12. AI実装・AI品質向上をscientific endpointに混入させない。

### 9.4 Wave A — Measurement and Exact Foundations

#### G2-01 — Position Evaluation / Empirical Outcome Calibration Replication Study 1

**状態:** **完了 / `PEOCR-STUDY1` / formal decision `INCONCLUSIVE`**

中心課題:

> engine evaluationとfresh empirical continuation outcomeの対応を、第一世代Study 1のestimability failureを救済せず、identity-firewall attritionを事前に見込んだ十分なfresh populationでformalに検証できるか。

第一世代Position Evaluation / Win-Rate Calibration Study 1の`INCONCLUSIVE`はimmutableとする。Study 1のisotonic mappingをvalidated Bao win probabilityとして使用しない。

最低限、phase-aware calibration、held-out reliability、Brier / log loss、calibration slope / intercept、uncertainty、identity firewall、sample-count estimabilityをoutcome前に固定する。Study 1 mappingの単純な再判定ではなく、新しいreplication Studyとして設計する。

Stage 2 formal replication result:

```text
games = 8192 / 8192
all 8 shard independent replay = PASS
final Stage 1 overlap = trajectory 0 / opening 0 / RAW state 0
unique trajectories after firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
formal decision = INCONCLUSIVE
primary formal branch = not entered (`primary = null`)
```

この`INCONCLUSIVE`は第一世代resultの救済でもmodel failureの`NOT-CONFIRMED`でもない。strict identity firewall後のformal populationが3つのprospective estimability gateへ届かなかったためである。同じdataへの追加seed、replacement、gate relaxation、mapping refit、near-miss exceptionによる救済を行わない。

**Priority:** P0

#### G2-02 — Search Reliability / Decision Robustness Study 1

**状態:** **完了 / `SRDR-STUDY1` / formal decision `INCONCLUSIVE`**

中心課題:

> 同一raw stateに対するbest move、TopSet、move ranking、score gap、principal variationは、depth、node budget、quiescence等のprospectively frozen探索条件を変えたときどの程度安定するか。

Stage 0 technical validationを経て、Stage 1は1,280 fresh games / 1,018 selected RAW statesで全readiness gateをPASSし、`PROFILE-FROZEN-DEVELOPMENT`を固定した。Stage 2は1,536 fresh held-out games / seeds `25021001..25022536`、Stage 1 trajectory + opening-prefix + RAW-state firewall、同一8-condition search gridで実行した。

```text
Stage 2 games = 1536 / 1536
independent game replay mismatches = 0
selected RAW states = 1007
Namua / Mtaji = 518 / 489
selection mismatches = 0
measurement mismatches = 0
selection / measurement hashes = exact match
Stage 1 overlap = trajectory 0 / opening 0 / RAW state 0
unique trajectories after firewall = 1040 < 1050
formal decision = INCONCLUSIVE
primary formal criterion = null
```

唯一のfailed gateはunique trajectoriesのpreregistered minimumだった。10 trajectory不足でもseed extension、replacement、gate relaxation、near-miss exceptionを行わない。D3/B1024等のhigher-resource conditionはtruthではなくfrozen search referenceである。

Descriptive secondary profileは今後のnew hypothesis / resource planning inputには利用できるが、G2-02のformal confirmationやhuman difficulty、engine correctness、public AI strengthへ読み替えない。

**Priority:** P0 / completed

#### G2-03 — State Transformation Semantics / Canonicalization Validation Study 1

**状態:** **完了 / `STSCV-STUDY1` / formal decision `INCONCLUSIVE` / 3 candidates `NON-ESTIMABLE`**

中心課題:

> representation bindingを最初から明示したfresh raw-state evidenceに対して、candidate state transformationsがrule-semantic validity、legal-move equivariance、successor binding、graph isomorphismを満たすか。

SIP-STUDY1の5 `NON-ESTIMABLE`およびORISC-STUDY1 Axis A `NOT-CONFIRMED` / Axis B `NOT-AUTHORIZED-NOT-EXECUTED`を変更せず、新しいRAW-state development / held-out evidenceとrepresentation-first contractを用いた。

Stage 1は72 fresh development roots（Namua/Mtaji/Mtaji-houseless各24）を使用し、trajectory seed / opening prefix / RAW state identityをStage 2からfirewallした。Stage 2はseeds `26032001..26032768`、各stratum 32 roots、depth 3、candidate mismatch tolerance 0をoutcome前にfreezeし、hardened prefreeze run `33145713610`とexplicit authorization commit `c7619ded9f682b499a02d023b40ac54ba4dc95ca`を経て実行した。

Fresh held-out production measurementは96 rootsを凍結quotaどおり選択し、T01/T02/T03のproduction-only candidate mismatchをすべて0とした。しかしmandatory independent verifierがformal-result assembly時に次のtechnical errorで停止した。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

そのためmandatory S2-G5をcomplete canonical independent-verification resultとして確立できず、canonical hashesとworkflow artifactもmaterializeされなかった。Prospectively frozen global-failure ruleに従い:

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

と閉じた。Production-only zero-mismatch diagnosticsをvalidationへ昇格させず、technical failureをscientific `NOT-VALIDATED`へも読み替えていない。Verifier defectはfresh Stage 2 outcome後に判明したため、同じevidenceへのsource repair / rerunを行わない。

したがってG2-03完了後もcanonicalization / symmetry-reduced state countingは未承認であり、authoritative scientific state identityは引き続きRAW-onlyである。

**Priority:** P0 / completed

#### G2-04 — Restricted Endgame Exact Oracle Expansion Study 1

**状態:** **完了 / `REEOE-STUDY1` / formal decision `INCONCLUSIVE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> prospectively selectedした複数のrestricted raw-state domainsについて、complete forward closureとexact retrograde analysisによりgame-theoretic value、cycle structure、distance、optimal-move multiplicityを完全解析できるか。

第一世代8-state exact domainのformal decisionを拡張解釈せず、423,733-state historical candidateへ単純cap追加して再開しない新しいprospective RAW-only Studyとして実施した。

Stage 0 technical controlはREWR 8-state / 7-edge graph、solution、predecessor relationを独立再構築してPASS。Stage 1 v1はproduction development後のindependent-verifier startup defectによりsame-evidence rerunをせずtechnical-invalidとして閉じた。Fresh Stage 1 v2はseeds `24041001..24041512`、同一のstructural/resource/acceptance designで再実施した。

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

Production / independentはfull scan、eligible set、selected roots、closure classificationを一致させたが、frozen feasibility rule `complete closures >= 3`を満たさなかった。そのためStage 1 v2は`STAGE1-DEVELOPMENT-BLOCKED`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`となり、fresh G2-04 exact oracleは生成されなかった。

**G2-04はG2-03の成功を前提としない。** 実際にvalidated transform set `[]`のままRAW-onlyで実施し、symmetry reduction / canonicalizationを使用しなかった。cap増加、domain shrinkage、root/seed replacement、partial-closure promotionによるsame-study rescueも行っていない。

この`INCONCLUSIVE` closureは「Bao endgameのexact expansionが不可能」を意味しない。異なるstructural/resource contractを試す場合はnew prospective independent Study/versioned protocolとfresh evidenceを必要とする。

**Priority:** P0 / completed

#### G2-05 — Deep RAW State-Space Enumeration Study 1

**状態:** **完了 / `DRSSE-STUDY1` / formal decision `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

中心課題:

> standard rootまたはprospectively fixed rootsから、第一世代depth-8 domainを超えるbounded depthまでRAW-only complete enumerationを行い、per-depth reachable-state growth、branching、transposition structure、tree/graph occurrence比をexactに記述できるか。

Study-start時点でstandard initial RAW root、target depth 9、resource ceilings、complete-layer rule、formal decision taxonomyをfreezeした。Stage 0 technical validationとfresh Stage 1 development readinessを通過後、Stage 2を一度だけauthorizeして実行し、productionとindependent full-domain re-enumerationが一致した。

```text
complete layers = 0..9
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

SSGTC-STUDY1のpartial depth-9 rows、G2-04 selected roots / partial closures、G2-05 Stage 1 rows / rootsはformal evidenceへ再利用しなかった。validated transform setは`[]`で、symmetry reduction / canonicalizationは未使用である。

本Studyは**bounded exact enumerationだけ**を扱い、full-game growth estimationを同一Study内で結果後に追加しない。したがってfull Bao state-space / game-tree sizeの推定はG2-12へ残す。

**Priority:** P0 / completed

### 9.5 Wave B — Rich Strategic Representation

#### G2-06 — Rich Critical-Position Representation Study 1

**状態:** **完了 / `RCPR-STUDY1` / Stage 1 `STAGE1-TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> Critical Positions / Outcome Branching Study 1で139/600 high-divergence rootsが観測された一方simple one-to-two-token grammarでpromotion 0だったことを踏まえ、outcome前に固定したより豊かなrepresentationならfresh populationでdecision-critical structureを再現可能に識別できるか。

Stage 0でlocal pit topology、capture graph、legal-move geometry、reply graph、reserve / house relation、move-set entropy、search-gap vector、local temporal contextの8 families / 310 scalar featuresをtechnical validationした。Stage 1はfresh 3,072-game block、600 roots、`D_range >= 0.30`、deterministic model-selection / readiness ruleをoutcome前にfreezeしてconsume-once実行した。

Productionでは599 primary-estimable roots、134 high-divergence rootsを得てproduction readiness checksをPASSした。一方、mandatory independent recomputationはcorpus / root selection / continuation / model / readinessを再現したものの、4/600 rowsでrepresentation exact hashが一致しなかった。frozen fail-closed ruleに従いStage 1は`STAGE1-TECHNICAL-INVALID`で閉じ、production-only readinessをformal targetへ昇格させなかった。

Read-only postmortemでは4件の差は`MOVE_SET_ENTROPY.indexEntropy`における浮動小数点加算順の差と局所化されたが、outcome後にexact-equality gateをtoleranceへ変更して救済しない。Stage 1 seed blockは消費済みでsame-block rerun / replacement / extensionは禁止、Stage 2は未承認・未実行である。

第一世代1183 auditsのnear-miss promotion、threshold relaxation、manual Stage 2 target selectionも行っていない。

**Priority:** P0 / completed

#### G2-07 — Practical Comeback / Reply-Pressure Representation Study 1

**状態:** completed / `PCRPR-STUDY1` closed / Stage 1 `STAGE1-TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`

**結果要約:** Stage 0 technical validationはPASS。Fresh Stage 1は3,072 games / 400 roots / 1,429 exact root-move rowsをproductionとstructurally independent replayで完走し、selected family `F05_ALL`、ridge `lambda=100`、development core hashまで一致した。一方、independent full artifactのGitHub Actions uploadが`CreateArtifact` timeoutで失敗し、prospectively必須だったfull final exact verificationをmaterializeできなかったため、frozen fail-closed ruleに従い`STAGE1-TECHNICAL-INVALID`で閉じた。Stage 1 blockは消費済みでsame-block rerun/repair/replacement/extensionは未承認。Stage 2は未承認・未実行でreserved seedsは未消費。Production-only性能値はunverified provenanceに限定する。

中心課題:

> PCEM-STUDY1の`PCEM-T1..T8` grammarを救済せず、reply-set width、defense-maintaining reply fraction、reply-quality distribution、punishment concentration、opponent-policy sensitivity等を明示した新しいreply representationによりmachine-operational practical comeback structureをfresh evidenceで記述できるか。

PCEM-STUDY1の55 audits / promoted 0 / Stage 2 non-authorizationはimmutable。machine reply pressureをhuman difficulty、human deception、human error probabilityと同一視しない。

**Priority:** P1

#### G2-08 — Machine Decision-Failure Taxonomy Study 1

**状態:** completed / `MDFT-STUDY1 = NON-ESTIMABLE`

中心課題:

> 「悪手class」を直接promotionするのではなく、machine/search decision failureを再現可能なmechanistic failure modesへ分解できるか。

Stage 0は`STAGE0-TECHNICAL-PASS`。Fresh Stage 1は4,096 games、4,068 unique trajectories、512 selected roots（Namua/Mtaji 256/256）を用い、production / independent full recomputationとmandatory artifact preservationをexact一致で完了した。しかしprospectively frozen global readiness gateのうち、distinct opening prefixes `2836 < 3000`とLOW_CAPTURE selected share `170/512 = 0.33203125 > 0.32`が未達となったため、Stage 1は`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`、Study formal decisionは`NON-ESTIMABLE`である。

Leaf-level development promotion formulaはF01/F02/F03/F05/F06/F10でtrueだったが、global readiness failure後にこれらをtaxonomy/Stage 2 targetへ救済しない。F04/F07/F08はfalse、F09はhistorical morphology classifierをexact再構築できずscientific evidence前にtechnical-ineligibleだった。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、reserved seeds `29010001..29018192`は未消費である。

BMP Study 1の0 `CONFIRMED` / 4 `NOT-CONFIRMED`、G2-07 technical-invalid closure、その他既存研究のformal decisionは変更しない。同じStage 1 evidenceへのthreshold relaxation、source-policy reweighting、root deletion、seed extension、replacement populationによる救済は禁止する。

**Priority:** completed

#### G2-09 — Tactical Motif Generalization / Counterexample Study 1

**状態:** **完了 / `TMGC-STUDY1 = TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> 第一世代でmachine-confirmedされた`TM-S2-C03`について、phase、morphology、search condition、state familyを変えたfresh evidenceで成立範囲とcounterexample domainをformalに特定できるか。

Stage 0はC03 exact semantics、RAW identity、historical source binding、independent technical reconstruction、source diversity/resource feasibilityをPASSし、`STAGE0-TECHNICAL-PASS`となった。Direct Namua transportはfrozen Mtaji back-row C03 exactと同一constructにならないため`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`としてscientific counterexample populationから除外した。

Stage 1/2 population、seed、marginal boundary axes、5 search instruments、identity firewall、multiplicity、decision ruleはscientific seed消費前にfreezeした。しかしStage 1 scientific authorization前のtechnical-only tooling smoke run `33287035754`で、independent boundary aggregatorが`ReferenceError: topSetRate is not defined`を発生させ、canonical smoke resultをmaterializeできなかった。

Frozen smoke contractはtooling failure後のsame-study repairを認めていなかったため、変数名を修正してrerunせずStage 1を`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`、Studyを`TECHNICAL-INVALID`として閉じた。Stage 1 scientific seeds `29110001..29114096`とStage 2 seeds `29210001..29218192`はともに未消費である。

このclosureは`TM-S2-C03 = CONFIRMED`を変更せず、C03がgeneralizeしないこともcounterexample boundaryが存在することも示さない。修正版を検証する場合はnew prospective Studyまたはexplicit new versionとしてfresh technical-entry contractとauthorizationを固定する。

**Priority:** completed

### 9.6 Wave C — Integration and Theory

#### G2-10 — Unified Multiaxial Strategic State Representation Study 1

**状態:** **完了 / `UMSSR-STUDY1 = NOT-AUTHORIZED-NOT-EXECUTED` / Stage 1 `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> phase、search reliability、structural state、legal branching、reply-pressure raw structure、tactical structure、decision raw observable、local graph等を単一scalarへ早期圧縮せず、複数軸を保持するBao strategic-state / regime representationとしてfresh evidence上で再現可能に構成できるか。

開始前にG2-01〜G2-09を監査し、`FORMALLY-ELIGIBLE` / `BOUNDED-EXACT-ELIGIBLE` / `TECHNICAL-REFERENCE-ONLY` / `DEVELOPMENT-CANDIDATE-ONLY` / `INELIGIBLE`のupstream evidence eligibility contractをfreezeした。G2-06/07のtechnical-invalid representation、G2-08のnon-estimable taxonomy、G2-09の未生成generalization boundaryをvalidated inputへ昇格させず、validated transform set `[]`のためRAW identityを維持した。

Stage 1はfresh 4,096 gamesを生成し、4,068 unique trajectories / 3,711 distinct opening prefixesから、8 phase/source-policy strata各64、計512 unique RAW rootsをoutcome-blind ruleで選択した。40/40 featuresがactiveとなり、production / independent implementationはsource、selection、feature analysis、scaler、candidate K metrics、representation decision、readiness objectを全てexact一致させた。Scientific readinessとresource gateも全項目PASSした。

Representation selectionはdimensionality reductionなし、deterministic K-means `K=2..6`とし、minimum cluster support `>= 0.10`、mean silhouette `>= 0.05`、five-fold assignment stability `>= 0.80`をscientific seed消費前に固定した。K=2はstability、K=3はsupport/stability、K=4/K=5はsupport、K=6はsupport/stabilityが未達となり、eligible candidateは0だった。

したがってfrozen decision mappingをそのまま適用し:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

で閉じた。これはtechnical failureやnon-estimable resultではなく、凍結したStudy 1 contract内でStage 2へ昇格可能なrepresentationを得られなかったformal negative development resultである。

このclosureをminimum support / stability threshold緩和、K range変更、PCA / latent representation /別clustering法の事後追加、favorable subgroup、Stage 1 seed rerun / extensionで救済しない。また`UMSSR-STUDY1`からG2-11へ渡せるvalidated / frozen representationは生成されなかった。

**Priority:** completed

#### G2-11 — Long-Horizon Strategic Transition Structure Study 1

**状態:** planned / downstream temporal study

中心課題:

> strategic-state representationを用いて、対局中にどのregimeからどのregimeへ遷移し、どの状態がpersistent / transient / bottleneck / recurrentとなるかを再現可能に記述できるか。

Namua→Mtaji Study 1で棄却した`time-to-first-Mtaji` / survival / hazard / acceleration / delayをstrategic endpointとして再利用しない。transition matrix、regime persistence、trajectory family、transition asymmetry等を候補とするが、primary endpointはoutcome前にfreezeする。

G2-10 `UMSSR-STUDY1`は実際にrepresentation gateを満たさず、`selectedRepresentation = null`で閉じた。したがって`UMSSR-STUDY1`由来representationをG2-11のinputとして使用しない。G2-11を開始する前に、long-horizon transitionへ入力可能なrepresentationを新しいprospective Studyまたは明示的versioned protocolで構築・freezeし、そのeligibilityをoutcome前に固定する必要がある。

**Priority:** P2

#### G2-12 — State-Space / Game-Tree Growth Estimation Study 1

**状態:** planned / exact-enumerationとは別Study

中心課題:

> bounded exact layersからfull-game state-space / game-tree growthを推定するprospectively specified estimatorを構築し、fresh deeper exact holdout layersに対してそのcalibration / coverage / errorを検証できるか。

G2-05等の完了済みbounded exact dataはestimator developmentやresource planningに利用できるが、formal validationに用いるdeeper exact holdoutの結果を見る前にestimator family、fitting rule、uncertainty method、acceptance criteriaをfreezeする。

推定が不安定またはnon-estimableなら、その結果を正式closureとし、Bao全体のstate-space sizeを点推定として強制的に報告しない。

**Priority:** P2

### 9.7 Human Track — core machine programから独立

#### G2-H01 — Human / Expert Strategic Judgment Study 1

**状態:** participant access確保まで保留可能 / core studiesのdependencyにしない

中心課題候補:

- human-perceived difficulty
- human-perceived critical positions
- misconception / oversight
- expert tactical-motif recognition
- practical winning-try recognition
- instructional salience

第一世代Human / Expert Validation Study 1の`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`は変更しない。qualified participant accessが確保できない限りmachine-only proxyでformal human claimを代替しない。

### 9.8 Dependencyと推奨実施順

第二世代は1から12までを単純直列には実施しない。

```text
Second-Generation Common Scientific Contract
        │
        ├───────── G2-01 Calibration Replication
        ├───────── G2-02 Search Reliability
        ├───────── G2-03 State Transformation Validation
        ├───────── G2-04 Exact Oracle Expansion (RAW-only可)
        └───────── G2-05 Deep RAW Enumeration

G2-02 ───────────────┐
                     ├─ G2-06 Rich Critical Representation
                     └─ G2-08 Decision-Failure Taxonomy

PCEM-STUDY1 boundary ─── G2-07 Reply-Pressure Representation
TM-S2-C03 boundary ───── G2-09 Motif Generalization / Counterexamples

G2-02 + G2-06..09 closures
        ↓
G2-10 Unified Multiaxial Strategic State
        ↓
NO ELIGIBLE FROZEN REPRESENTATION
        ↓
new prospective representation protocol required before G2-11
        ↓
G2-11 Long-Horizon Strategic Transitions

G2-05 bounded exact enumeration
        ↓
G2-12 prospectively specified Growth Estimation + fresh exact holdout

G2-H01 Human Track = independent / non-blocking
```

G2-03は`STSCV-STUDY1 = INCONCLUSIVE` / 3 candidates `NON-ESTIMABLE`として完了し、validated transform setは空のままである。したがってG2-04とG2-05は予定どおりRAW-onlyで進行可能であり、validated transformが得られない限りsymmetry reductionを導入しない。

開始優先度は次を推奨する。

```text
P0: G2-01, G2-02, G2-03, G2-04, G2-05, G2-06
P1: G2-07 (completed), G2-08 (completed), G2-09 (completed), G2-10 (completed) (completed)
P2: G2-11, G2-12
Separate / non-blocking: G2-H01
```

`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`、`G2-05`は`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`として、それぞれprospective ruleに従い完了した。`G2-06`は`RCPR-STUDY1`としてStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`、`G2-07`は`PCRPR-STUDY1`としてStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。`G2-08`も`MDFT-STUDY1 = NON-ESTIMABLE`としてclosedとなり、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。G2-03のvalidated transform setは空のままで、既存Studyの未実行Stage 2を後続Studyで救済しない。G2-01..G2-10はclosure済みである。`G2-10`はscientific readiness、resource gate、production / independent exact verificationをPASSした一方、prospectively fixed `K=2..6`の全候補がpromotion criterionを満たさずStage 1を`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`で閉じ、Study formal decisionとStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、Stage 2 seedsは未消費である。したがってG2-11へ`UMSSR-STUDY1`由来representationを持ち込まず、G2-11開始前にnew prospective representation Studyまたはexplicit versioned protocolを必要とする。

### 9.9 第二世代プログラムの完了条件

第二世代はpositive resultの数で完了判定しない。次を満たした時点をprogram closureの目安とする。

1. G2-01〜G2-12が、それぞれprospectively specified stop ruleに従ってformal closureしている。dependency gateにより`NOT-AUTHORIZED-NOT-EXECUTED`となる場合も、事前規則に従ったclosureなら完了として扱える。
2. negative / null / inconclusive / non-estimable resultをpositiveへ救済せず保存している。
3. 第一世代のformal decisionsとinterpretation boundariesが変更されていない。
4. research engine / data identity / seed / artifact provenanceが各Studyで再現可能に保存されている。
5. evaluation、empirical outcome、exact value、search reliability、machine failure、human constructが分離されている。
6. multiaxial strategic-state representationについてformalな採否またはnon-estimable decisionがある。
7. long-horizon transition structureについてformalな採否またはnon-estimable decisionがある。
8. expanded restricted exact-domain研究とdeeper RAW enumerationがそれぞれclosureしている。
9. state-space / game-tree growth estimationがformal validationされるか、または推定不能性を含む明確なformal closureを持つ。
10. 第二世代全体を統合するfinal synthesis文書が作成されている。
11. public AIの棋力向上・deployment成否を第二世代Studyのscientific successへ読み替えていない。

第二世代の完了とは「すべての仮説が確認された」ことではなく、**設定した研究課題に対して再現可能なscientific decisionを与え、その境界を保存したこと**を意味する。
