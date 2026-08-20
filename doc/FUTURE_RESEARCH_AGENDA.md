# Bao 今後の研究課題

Version: 1.7.0  
Status: Active  
作成日: 2026-07-21  
更新日: 2026-08-20

## 1. 目的

この文書は、先攻・後攻差研究および第一次定石研究の完了後に検討する、Bao la Kiswahili の新しい研究方向を整理した研究アジェンダである。

ここで扱う課題は、既存研究の試行数追加、別seedによる追試、既存定石候補の再検証ではない。囲碁・将棋で発展してきた局面分類、手筋、形勢判断、終盤解析、認知研究、計算複雑性研究などを参考にしつつ、Bao固有の構造へ置き換えた独立の研究領域を対象とする。

本書は実装ロードマップではない。各課題を実際に開始する際は、研究目的、仮説、測定方法、データ形式、判定基準、停止条件を個別の研究計画として定義する。

2026-08-20時点で、第1段階の「局面の相転移点」「局面類型と棋風」「Namua→Mtaji移行前後の戦略的転移構造」「局面複雑度と難易度」「手筋の発見と体系化」のStudy 1はいずれも完了した。Tactical Motifs / Tesuji Study 1では、fresh Stage 2 formal corpusによる4 canonical candidateの検証まで完了し、`TM-S2-C03`のみ`CONFIRMED`、C01/C02/C04は`NOT-CONFIRMED`となった。

さらにC03のHuman / Expert Validation Study 1も完了した。machine/instrument側ではfresh 1,536-game corpus、independent full recomputation、near-miss control matching、42 unique formal positionsのdeterministic freezeまで完了した。一方human側は、独立研究者としてfrozen expert criteriaを満たす対象へ現実的にアクセスする経路を確保できず、scientific recruitmentを開始しないまま`N=0`で閉じた。human axisのformal labelは`INCONCLUSIVE-NOT-ESTIMABLE`であり、これはC03へのnegative human evidenceではない。

第2段階では、measurement dependencyを理由に悪手・錯覚研究より先行させたPosition Evaluation / Win-Rate Calibration Study 1も完了した。Stage 1ではphase-stratified isotonic mappingをexploratoryに選択し、fresh Stage 2では全2,048局のindependent verificationとStage 1 identity overlap 0を達成した。しかしstrict identity firewallとno-replacement selection後に3つのpreregistered estimability gateが未達となったため、formal decisionは`INCONCLUSIVE`である。Descriptive Brier valuesは良好だったがformal criteriaへは進まず、mappingはformalにvalidatedされたBao勝率ではない。

Position Complexity / Difficulty Study 1のprimary formal decisionは`INCONCLUSIVE`であり、同一formal corpusを別optimizer/toleranceで再解析してformal labelを救済することはfuture workとして扱わない。Tactical Motifs Study 1についても、C01/C02/C04を追加game・paired-definition substitution・threshold変更で救済しない。C03のhuman/expert validationを再び行う場合も、完了済みHuman / Expert Validation Study 1の`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`を上書きしない。Position Evaluation / Win-Rate Calibration Study 1についても、同じStage 2に追加game・seed extension・overlap replacement・gate緩和・mapping refitを加えてformal decisionを救済しない。

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

今後の研究では、単純な勝率比較から対象を広げ、次の問いを中心に置く。

> Baoの局面にはどのような構造があり、どのような原理で戦略が変化し、それを人間が理解可能な知識として記述できるか。

完了済みStudyのformal decision、事前登録条件、negative/null/inconclusive/non-estimable result、解釈境界は後続研究によって変更しない。後続研究は、既存Studyの救済や再定義ではなく、新しい研究課題として開始する。

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

## 4. 研究課題

### 4.1 局面の相転移点

#### 現在の状態

**Study 1完了。**

- 初見向け概要: [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)
- 科学的正本: [`phase-transition/STUDY_1_FINAL_REPORT.md`](phase-transition/STUDY_1_FINAL_REPORT.md)

Study 1では`capture-branch-expansion`をboundedなstrategic-transition phenotypeとして保持し、固定条件でdepth2とdepth3のsearch-profile orderingが逆転することまで確認した。一方、universal Bao phase-transition law、一般的なsearch-profile × depth interaction、reserve・nyumba・front-row・mobilityを包含する一般理論は確立していない。これらは後続する独立研究の対象である。

#### 中心課題

Baoの対局において、局面の価値基準や最善戦略が不可逆的に変化する地点を特定する。

#### 主な対象

- namuaからmtajiへの移行
- nyumbaの消失または機能変化
- reserveが特定範囲を下回る局面
- 前列支配の崩壊または固定化
- 捕獲重視から可動性重視への移行
- 強制系列中心から自由選択中心への移行

#### 研究方法の例

各手についてreserve、nyumba状態、合法手数、捕獲手数、最大捕獲量、前列占有、評価値、候補手順位、最善手安定性を時系列化し、急激な変化点を検出する。

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

#### 研究方法の例

多数の対局から捕獲頻度、nyumba保持期間、reserve消費速度、前列占有率、relay長、合法手数、mtaji移行時点、評価変動などを抽出し、クラスタリングと代表局面分析を行う。

#### 期待成果

Bao固有の棋風語彙、対局スタイル分類、異なる戦略傾向を持つAI、学習者向けスタイル診断。

---

### 4.2.1 Namua→Mtaji移行前後の戦略的転移構造 — Study 1完了

#### 研究題目

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Status: **Study 1 closed / formal decision `not-confirmed`**

- 初見向け概要: [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)
- 科学的正本: [`namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`](namua-mtaji-transition/STUDY_1_FINAL_REPORT.md)
- Formal result: [`namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md`](namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md)

#### 研究の起点

局面類型Study 1の固定cross-study bridgeでは、対象となった`capture-branch-expansion` 59件がすべてNamuaに位置し、Mtajiとの同時点overlapが0だった。そのため、`capture-branch-expansion`とconfirmed Mtaji morphology `MTAJI-M1 / MTAJI-M2`の直接対応は推定できなかった。

この未推定部分を、同一時点の対応付けではなくprospectiveな時間的接続として独立研究化した。

#### Design-stageで判明した決定的境界

Stage 0/1で、現engineのstandard trajectoryではNamua→Mtaji移行がreserve exhaustionによるdeterministic clockであることが確立した。

```text
initial total reserve = 44
Namua total reserve at ply t = 44 - t
first Mtaji observation = ply 44
```

Stage 2 formal corpusでも、Mtajiへ到達した3886/3886 gamesがply 44でfirst Mtajiへ移行し、progression violationは0だった。

したがって、当初候補だった

```text
time-to-first-Mtaji
first-Mtaji survival
first-Mtaji hazard
CBEによるMtaji acceleration / delay
```

は、現engineにおけるstrategic inferential endpointとして棄却された。candidate-to-first-Mtaji距離は戦略的survival timeではなく、rule-derived deterministic progressionである。

この境界はformal outcome inspection前に固定されており、negative result後の再解釈ではない。

#### Frozen Stage 2 formal question

Formal analysisは、timingではなくfirst-Mtaji morphology associationへ限定された。

```text
condition = P2-D2 only
hard / bao / phase2 / depth2
games = 4096
seeds = 20280001..20284096
```

Exposure:

```text
earliest fully ascertained Namua CBE per unique historical trajectory
```

Comparator:

```text
R3-M
exact candidate ply
not Category A at index
same forced-capture status
no Namua CBE anywhere in control trajectory
first-Mtaji morphology eligible
20 unique controls per exposure
global control non-reuse
```

Estimability:

```text
morphology-eligible exposed trajectories = 30
G1 >= 20 -> PASS
G2 exactly 20 controls/exposure -> PASS
matched sets = 30
unique controls = 600
```

#### Formal result

```text
Exposed MTAJI-M1 = 26 / 30 = 0.8667
Matched-control MTAJI-M1 = 509 / 600 = 0.8483
mean matched risk difference = +0.01833
MH common OR = 1.1618
```

Single preregistered matched-set exact conditional Poisson-binomial test:

```text
observed T = 26
p_two_sided = 1.0
alpha = 0.05
```

Formal decision:

> **NOT-CONFIRMED**

P2-D2内のfirst-Mtaji morphology associationは確認されなかった。小さな正の記述差をtrendとして救済しない。

#### Future-work boundary

この完了研究について、次はfuture workに含めない。

- 同一formal corpusでcandidate-ply subgroupを探すことによるprimary resultの救済
- alternative comparatorへの切替
- 追加game / 別seedによる有意化探索
- CBE / Category-A thresholdの緩和
- Mtaji classifierのrefit / relabeling
- deterministic clockをsurvival/hazard endpointとして再包装すること

将来扱う場合は、別のscientific questionとしてprospectively分離する。

新しい研究候補には、例えば次がある。

- Namua progression上のfull structural trajectoryを、事前固定したrule-state representationで調べる研究
- front-row / nyumba / mobility / forcing lifecycle / search-tree mechanismの新規mechanistic study
- MTAJI-M1/M2とCBEのhuman/expert validation
- P2-D2以外でのexternal validityをfresh corpusで検証する研究

いずれもNamua→Mtaji Study 1の`not-confirmed` decisionを変更しない。

---

### 4.3 局面複雑度と難易度 — Study 1完了

#### 現在の状態

**Study 1完了 / formal decision `inconclusive`。**

- 初見向け概要: [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-complexity/STUDY_1_FINAL_REPORT.md`](position-complexity/STUDY_1_FINAL_REPORT.md)
- Formal result: [`position-complexity/STAGE_2_FORMAL_RESULT.md`](position-complexity/STAGE_2_FORMAL_RESULT.md)

Study 1では「難しい局面」を単一scoreに圧縮せず、`structural complexity`、`search workload`、`decision ambiguity`、`prediction instability`を分離して機械再現可能に測定した。Stage 1 exploratoryではstructural branching、D2→D3 instability、D2 best-second marginの関係を設計開発し、fresh Stage 2 formal corpusでprimary associationを検証した。

Stage 2では1024 gamesをfull verificationし、862 unique rule statesをformal populationとした。count/coverage gateはすべてPASSしたが、preregistered primary full logistic modelがBFGS precision lossにより`converged=false`となり、事前固定したfinite+converged gateを満たさなかった。

したがって:

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

計算上のH1 `p = 0.086676...`を使って`not-confirmed`へ変更せず、H2の小さい計算上のp値もconfirmationへ昇格させない。

#### Study 1で分離した難易度層

1. **探索難易度 / search workload**: node数、cutoff、evaluation count等
2. **判断難易度 / decision ambiguity**: root candidate valueの近接性、best-second gap、tie
3. **予測難易度 / prediction instability**: depth変更に伴うexact TopSetの変化
4. **構造難易度 / structural complexity**: 合法手数、capture/relay/front-row/reserve等のstate structure
5. **人間難易度**: Study 1では未検証。誤答率、判断時間、候補生成、説明等は独立future study

#### Future-work boundary

同じStage 2 formal corpusについて、次はfuture workに含めない。

- optimizer/toleranceを変更してformal decisionを救済すること
- seed/gameを追加して再判定すること
- alternative depth pair・endpoint・metricへ切り替えること
- phase interaction / phase-stratified analysisをprimary rescueに使うこと
- H2の計算上の小さいp値をformal confirmationへ昇格させること

H1 scientific questionを再検証する場合は、**robust optimizer / convergence procedureを事前固定し、fresh seed block / fresh corpusを使う新しいprospective numerical-method replication**とする。

Human difficultyを扱う場合も、machine workload/ambiguity/instabilityを人間の難しさと同一視せず、人間・expert dataを用いた独立studyとする。

---

### 4.4 手筋の発見と体系化 — Study 1完了

#### 現在の状態

**Study 1 closed / complete。Stage 2 formal decision: C03 confirmed; C01/C02/C04 not-confirmed。**

- 初見向け概要: [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md)
- 科学的正本: [`tactical-motifs/STUDY_1_FINAL_REPORT.md`](tactical-motifs/STUDY_1_FINAL_REPORT.md)
- Formal result: [`tactical-motifs/STAGE_2_FORMAL_RESULT.md`](tactical-motifs/STAGE_2_FORMAL_RESULT.md)

Stage 1では768-game fresh corpusから715 unique rule states / 3,148 exact move recordsを測定し、3,116,520 raw pattern instancesを列挙した。105,501 detailed candidatesのうち948件が全promotion gateを通過し、事前固定ranking/capsによって8 exploratory definitionsをpromotionした。

8定義は4つのexact `supportIdentityHash` pairを形成した。Stage 1の8定義自体は変更せず、Stage 2ではfresh dataを見る前に各pairのlowest Stage 1 rankをcanonical formal candidateとして固定した。

Fresh Stage 2では3,072 games / seeds `22000001–22003072`を生成し、全局をindependent full replay/search verificationした。4候補すべてがestimability gateをPASSし、6,605 formal measurementsのintegrityもPASSした。4 candidate × 2 co-primary endpointsの8 planned testsをHolm-BonferroniでFWER 0.05に制御した結果、`TM-S2-C03`のみ`CONFIRMED`となった。

Confirmed C03のfrozen machine definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Fresh 1,272 rootsで、structural success 97.88%、D3 top-set 73.66%、D3 at-or-above-median 86.95%、D3 unique-worst 7.08%。opening prefixesは1,121種類、generation strataは6種類すべてに広がった。

C01はstructural recurrence 69.44%を示したがD3 top-set 49.34%でformal confirmationに失敗した。C02/C04もco-primary endpointsを満たさず、3候補はいずれも`NOT-CONFIRMED`として固定する。

#### Future-work boundary

Study 1の結果に対して次は行わない。

- C01/C02/C04への追加game・別seedによる救済
- paired diagnostic definitionへの差し替え
- candidate merge/split
- threshold / endpoint / depthの変更による再判定
- Stage 1 exploratory metricsを使ったformal resultの再解釈

C03について次を扱う場合は、新しいprospective studyとする。

- traditional / expert-recognized tesuji validation
- human strategic importance
- beginner / pedagogical value
- 別engine / evaluator / search profileでのexternal validity
- human-vs-machine decision comparison

#### 現在の解釈境界

C03の`CONFIRMED`が意味するのは、frozen Bao engine/search operationalizationにおける**machine-reproducible transferable tactical motif**までである。

traditional/expert-recognized tesuji、human importance、beginner importance、pedagogical valueはStudy 1では主張しない。

---

### 4.4.1 C03 Human / Expert Validation — Study 1完了

#### 現在の状態

**Study 1 complete — machine/instrument stage complete / human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`。**

- 初見向け概要: [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md)
- 科学的正本: [`tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md`](tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md)
- Human-axis closure: [`tactical-motif-human-validation/STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`](tactical-motif-human-validation/STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json)

Tactical Motifs Study 1でmachine-confirmedとなった`TM-S2-C03`を、Bao expertが局面横断的な再利用可能原理として認識するかを検証するための独立prospective studyとして開始した。

Machine/instrument側では次を完了した。

```text
fresh machine games = 1536
independent verification mismatch = 0
C03_TARGET = 687
matched P_ONLY = 277
matched M_ONLY = 605
matched MORPH_NEAR = 672
formal primary blocks = 12
formal unique positions = 42
```

Exact formal positionsはdeterministic ruleでfreezeされ、private exact freeze SHA-256は次で固定された。

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

Human側では、所属機関によらない独立研究としてscientific recruitment開始前の時点で、frozen expert criteriaを満たすBao専門家・研究者・競技者へ現実的にアクセスする経路を確保できなかった。

```text
accessible eligible experts = 0
scientific recruitment started = false
persons contacted for scientific recruitment = 0
formal human responses = 0
minimum included experts required = 10
```

minimum Nやexpert criteriaを緩和せず、human axisは`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`として閉じた。これはexpertがC03を認識しないというnegative evidenceではない。

Final evidence state:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

#### Future-work boundary

将来qualified expertへのアクセスが可能になってhuman/expert recognitionを再検証する場合、今回のN=0 closureをretroactiveに変更しない。新しいprospective independent study、またはnew responses前に明示的にversionedされたprospective reopeningとして扱う。

---

### 4.5 悪手と錯覚パターン

#### 現在の優先度

**第2段階の次期推奨研究。**

Position Evaluation / Win-Rate Calibration Study 1は完了したため、研究順序上はこのテーマへ進める。ただしCalibration Study 1のformal resultは`INCONCLUSIVE`であり、Stage 1 isotonic mappingをformalにvalidatedされたwin probabilityとして利用してはならない。

悪手severityのformal endpointには、fresh continuation outcomes、exact search-based regret / decision loss、または新研究内でprospectively frozenされた別measurementを使う。Calibration Study 1 mappingを使う場合はexploratory/descriptive contextに限定する。

また「錯覚」のうち人間の誤認理由を直接扱う部分はhuman dataを必要とする。Human dataなしの研究はmachine-observed bad-move pattern / search error / value misestimationまでに限定する。

#### 中心課題

初心者、人間一般、浅い探索AIが繰り返し陥る誤判断を分類する。

#### 錯覚候補

- 即時捕獲量の過大評価
- nyumba維持の絶対視
- reserveの過度な温存
- relay終了後の配置の見落とし
- 相手の強制捕獲を自分の利益と誤認
- 一手後の可動性低下の見落とし
- 見かけ上の左右対称性への依存

#### 研究方法の例

誤った候補手について、選択理由、浅深度差、反撃系列、特徴量変化、人間の説明を比較し、失敗原因を再利用可能なカテゴリへ整理する。Human dataを使わないstageでは、人間の説明を推定せずmachine-reproducible error structureとして記述する。

#### 期待成果

初心者向け注意点、誤答理由付き問題集、悪手説明機能、人間らしい難易度調整。ただしhuman-facing claimは対応するhuman evidenceを得た段階でのみ行う。

---

### 4.6 形勢判断と勝率校正 — Study 1完了

#### 現在の状態

**Study 1 closed / formal decision `INCONCLUSIVE`。**

- 初見向け概要: [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md)
- 科学的正本: [`position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`](position-evaluation-calibration/STUDY_1_FINAL_REPORT.md)
- Formal result: [`position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md`](position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md)

#### 中心課題

AIのstatic actor-perspective evaluationと、frozen continuation policy / sampled-state populationのもとでのempirical continuation win probabilityの対応をprospectively校正し、fresh held-out dataでgeneralizationを確認できるかを検証した。

#### Stage 1 development

Fresh 1,024-game corpusから830 selected binary statesを得て、全readiness gateとindependent verificationをPASSした。

事前固定した候補は:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

Phase-aware logisticはfold 1 Mtajiで100 iterations後もfrozen gradient tolerance `1e-10`を満たさずineligibleとなった。alternate optimizerやtolerance緩和で救済しなかった。

Phase-stratified isotonicはeligibleで、frozen selection ruleにより選択された。

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
selected family = phase-stratified-isotonic
```

#### Stage 2 formal evaluation

Fresh formal corpus:

```text
games = 2048
seeds = 22300001..22302048
independent verification = PASS
final Stage 1 trajectory/opening/rule-state overlap = 0 / 0 / 0
```

しかしstrict Stage 1 identity firewallとno-replacement selection後に3つのestimability gateが未達となった。

```text
unique historical trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

Frozen formal ruleにより:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
paired bootstrap = not decision-eligible
primary performance criteria = not decision-eligible
```

Descriptive-only values:

```text
pooled frozen-model Brier = 0.15550141283724248
phase-only reference Brier = 0.2510612273133199
observed paired Brier skill = +0.09555981447607745
Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
```

これらは事前absolute thresholds以下だったが、estimability gateが先に失敗したためformal confirmationへ昇格しない。

#### Study 1で得たもの

- evaluationとempirical outcomeを分離する測定枠組み
- phase-aware calibration development pipeline
- exploratory frozen isotonic mapping
- fresh formal corpusのindependent replay/measurement verification
- Stage 1/2 identity leakageを0にするfirewall
- estimability failureを結果後に救済しないdecision discipline

#### Future-work boundary

同じStage 2 corpusについて次は行わない。

- additional games / seed extension
- overlap-excluded unitsのreplacement
- estimability gateの緩和
- Stage 1 mappingのrefit / smoothing
- descriptive Brier thresholdを使ったformal relabeling

formal calibration generalizationを再検証する場合は、identity-firewall attritionを事前に見込んだfresh prospective replicationとする。

#### 期待成果との関係

「互角」「やや有利」「優勢」「勝勢」等のformalにvalidatedされたBao固有勝率基準はStudy 1では確立していない。Stage 1 mappingはexploratory artifactとして利用可能だが、観戦用勝率表示やdownstream formal severity scaleへそのまま昇格させない。

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

Calibration Study 1のmappingをformalにvalidatedされたwin probabilityとして前提にしない。勝率をprimary endpointに使う場合は、新研究内でfresh continuation outcomeまたはprospectively validated measurementを定義する。

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

Calibration Study 1のisotonic mappingをformalにvalidatedされた勝率変化として使わない。

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

既存のnamua対称性研究とは異なり、個別の不一致原因だけでなく、Bao全体の局面同値関係を研究対象とする。

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

#### 研究方法の例

完全列挙が困難な場合は、到達可能性判定、canonical form、自己対局標本、ランダムウォーク、モンテカルロ推定を組み合わせる。

#### 期待成果

Baoの探索困難性に対する定量的説明、研究用基準値、ゲームAI方式選択の理論的根拠。

## 5. 推奨する研究プログラム

### 第1段階: Baoを記述する語彙の構築

現在の優先順位:

1. **[完了] 局面の相転移点 — Study 1**
2. **[完了] 局面類型と棋風 — Study 1**
3. **[完了] Namua→Mtaji移行前後の戦略的転移構造 — Study 1 (`not-confirmed`)**
4. **[完了] 局面複雑度と難易度 — Study 1 (`inconclusive`)**
5. **[完了] 手筋の発見と体系化 — Study 1（C03 `CONFIRMED` / C01,C02,C04 `NOT-CONFIRMED`）**

第1段階の5つのStudy 1は完了した。state morphology、strategic-transition phenotype、Namua→Mtaji bridgeの境界、machine-reproducible complexity layersに加え、fresh formal confirmationを通過したmachine-reproducible transferable tactical motif C03を得た。

局面複雑度Study 1のformal `inconclusive`を他研究で救済しない。また手筋Study 1のnegative candidatesを追加gameやontology変更で救済しない。

### 第2段階: 理解、教育、解説への展開

現在の優先順位:

1. **[完了] 形勢判断と勝率校正 — Study 1 (`INCONCLUSIVE`)**
2. **悪手と錯覚パターン — 次期推奨**
3. 重要局面と勝敗分岐点
4. 人間とAIの判断差

Position Evaluation / Win-Rate Calibration Study 1によって、engine evaluationとempirical continuation outcomeを分離して扱うtechnical measurement foundationとexploratory mappingは得られた。しかしformal held-out validationはestimability failureで未解決である。

したがって次の悪手研究は開始可能だが、今回のisotonic mappingをformalに校正済みの勝率として前提にしない。bad-move severityのprimary endpointはfresh continuation outcomes、exact search regret、または新研究内で事前固定した独立measurementとするのが適切である。

C03 Human / Expert Validation Study 1のN=0は、人間の錯覚やexpert judgmentを必要としないmachine-only研究を先行させる実務的理由にはなるが、悪手研究を否定するnegative evidenceではない。Human misconceptionを主張する段階では新しいhuman evidenceを必要とする。

### 第3段階: 理論および完全解析への展開

優先課題:

1. 限定終盤と必勝圏
2. 対称性と同型局面
3. 状態空間とゲーム木複雑度
4. 逆転可能性と勝負手

この段階では、数学的・計算論的性質と実戦的選択の違いを研究する。

## 6. 特に優先する三本柱

### 6.1 Bao局面分類学

相転移、局面類型、棋風、複雑度を統合し、Baoの局面を体系的に記述する。局面相転移点Study 1、局面類型と棋風Study 1、Namua→Mtaji Study 1、Position Complexity / Difficulty Study 1は完了した。Position Complexity Study 1のformal `inconclusive`を再検証する場合は、同一formal corpusの再解析ではなく、数値手法を事前固定したfresh prospective replicationとする。Human difficultyはmachine complexity layerとは別に独立検証する。

### 6.2 Bao手筋・錯覚体系

定石とは異なる局面横断的な手筋と、典型的な誤判断を対応付ける。

Tactical Motifs / Tesuji Study 1はこの柱の最初のmachine-reproducible motif studyとして完了した。4 canonical candidatesのうちC03がfresh Stage 2 formal confirmationを通過した。C03 Human / Expert Validation Study 1ではmachine/instrument pipelineとformal stimulus freezeまでは完了したが、human evidenceはN=0で非推定可能だった。

次の主要課題はmachine-reproducible bad-move / error-pattern taxonomyである。Calibration Study 1がformal `INCONCLUSIVE`だったため、bad-move severityをformal validated win-probability lossとして直ちに定義せず、fresh outcomesやexact search-based regretを用いる。Human misconception validationは別evidence axisとして分離する。

### 6.3 Bao終盤科学

限定局面の完全解析、必勝圏、勝利距離、終盤テーブルベースを扱う。

## 7. 個別研究を開始する条件

各研究課題を実施へ移す際は、最低限次を定義する。

- 研究課題と既存研究との差
- 検証可能な仮説
- 対象とするphaseおよび局面集合
- 使用するAI、探索深度、時間制限、seed
- 収集する特徴量とデータ形式
- 統計単位と相関の扱い
- 人間レビューが必要な箇所
- 成功基準、否定基準、estimability gate、停止条件
- 成果物の保存先

完了済み研究から派生する新研究では特に、既存Studyのformal decisionsを変更しないこと、endpoint・comparator・population・seed・decision ruleを結果を見る前に定義すること、confirmed/exploratory/descriptive vocabularyを同じ証拠水準として扱わないことを開始条件に含める。

Namua→Mtajiを扱う場合、現engineではfirst-Mtaji timingがdeterministic progressionであるため、`time-to-first-Mtaji` / survival / hazard / acceleration / delayをstrategic endpointとして再利用しない。異なるengine semanticsを研究対象にする場合は、それ自体を別システム・別studyとして明示する。

Position Complexity / Difficulty Study 1のH1を再検証する場合、既存Stage 2 corpusのoptimizer/tolerance変更による再判定は行わない。optimizer、収束基準、failure handling、fresh seed blockを新しいprospective preregistrationで固定してから新規evidenceを生成する。

Tactical Motifs / Tesuji Study 1は完了済みである。C01/C02/C04を既存Stage 2 dataの再解析、追加seed、paired-definition substitution、threshold変更で救済しない。C03についてhuman/expert recognitionを再検証する場合は、Tactical Motif Human / Expert Validation Study 1の`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`を変更しない新しいprospective independent study、またはnew responses前に明示的にversionedされたprospective reopeningとして、対象population・判定基準・評価者・analysis plan・ethics boundaryを事前固定する。traditional recognition、pedagogical value、external validityもそれぞれ別の証拠軸として扱う。

Position Evaluation / Win-Rate Calibration Study 1を再検証する場合、既存Stage 2 corpusへ追加game、seed extension、identity-overlap replacement、readiness gate緩和、mapping refitを加えない。formal calibration generalizationを再検証する場合は、Stage 1 identity firewallによるattritionを事前に見込んだfresh seed block / fresh corpusのprospective independent replicationとする。Study 1 isotonic mappingをformalにvalidatedされたprobabilityとしてdownstream primary endpointに使用しない。

Bad Move / Misconception Patterns Studyを開始する場合、machine-only bad-move patternとhuman misconception claimを分離する。Human evidenceなしではhuman error mechanismをformalに主張しない。またCalibration Study 1のmappingをprimary severity scaleにするなら、それ自体を新study内でprospectively validateするか、fresh continuation outcome等をprimaryにする。

## 8. 到達目標

長期的な目標は、Baoを単にプレイ可能なゲーム、または勝率を比較できるAI対象として扱うだけでなく、次の形へ発展させることである。

- 局面を分類できる
- 戦略転換を説明できる
- 手筋と錯覚を言語化できる
- 形勢評価とempirical outcomeの関係を再現可能に検証できる
- 重要局面を抽出できる
- 限定終盤を証明できる
- 人間の学習過程を支援できる

中心となる研究方針は次のとおりである。

> Baoの局面を分類し、局面間に共通する戦略原理を発見し、それを人間が理解できる知識へ変換する。
