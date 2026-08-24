# Bao la Kiswahili 研究成果索引

この文書は、本リポジトリで行う実験研究・調査研究の**中央入口**です。

ゲームの実装・利用方法を知りたい場合はルートの [`README.md`](../README.md) を参照してください。ここでは、研究成果を「初めて読む人」「詳細を検証したい人」「研究を再開する人」が、それぞれ適切な文書へ辿れるように整理します。

---

## 研究文書の基本構造

今後、独立した研究が増える場合は、可能な範囲で次の3層を分けます。

1. **Overview / Conclusion — 初見向け成果概要**
   - 何を調べ、何が分かり、何が分からなかったかを人間向けに説明する入口
   - 実験IDや内部運用を知らなくても読めることを重視する
2. **Final Report / Integrated Research — 科学的・技術的な統合記録**
   - 実験条件、統計、chronology、境界条件、negative resultを含む正本
3. **Plan / Status / Register / Log — 研究運用・provenance**
   - preregistration、hypothesis、decision、current status、実験台帳、archiveなど

Overviewは読みやすさを優先しますが、formal decisionやscientific claimを独自に拡張しません。矛盾がある場合は、各研究で指定されたFinal Report / Conclusion / formal registerを優先します。

Current-facingな人間向け文書でformal decision / evidence labelを明示する場合は、正本のcanonical uppercase token（例: `CONFIRMED`、`NOT-CONFIRMED`、`INCONCLUSIVE`、`INCONCLUSIVE-NOT-ESTIMABLE`、`NOT-CONFIRMATORILY-EVALUATED`）を使用します。一般語としてのconfirmed/inconclusive等や、履歴・machine-readable schemaに保存された文字列は、表記統一だけを目的として機械的に書き換えません。

---

## 研究成果

### 1. 局面相転移点研究 — Study 1

**研究題目:** Baoにおける局面相転移点の発見と、`capture-branch-expansion`の確認  
**状態:** Study 1 closed / repository closure complete

第1研究では、Baoの対局中に再現可能な戦略的転移候補を検出できるかを調べ、`capture-branch-expansion`を中心phenotypeとして同定しました。固定 `hard / bao` 条件では、depth2でphase2 > legacy、depth3でlegacy > phase2というsearch-profile orderingの逆転がそれぞれformalに確認されています。ただし一般的なdepth interactionや普遍的Bao phase-transition lawは主張しません。

**最初に読む:**

- [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`phase-transition/STUDY_1_FINAL_REPORT.md`](phase-transition/STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`phase-transition/STUDY_1_VOCABULARY.md`](phase-transition/STUDY_1_VOCABULARY.md) — 用語・機械定義
- [`phase-transition/CURRENT_STATUS.md`](phase-transition/CURRENT_STATUS.md) — 現在地と固定済み判断
- [`phase-transition/README.md`](phase-transition/README.md) — 研究ディレクトリ案内

---

### 2. 定石研究 — 第一次研究

**状態:** `completed-without-provisional-joseki`

現在のルール実装とAI条件を使って、標準初期局面から一般化可能な定石候補を検証した研究です。第一次研究は成功条件を満たして完了しましたが、標準初期局面の一般定石として採用できる暫定定石は0件でした。個別の強制勝ち支持局面や探索収束反例は、一般定石とは区別して保存されています。

**最初に読む:**

- [`joseki/README.md`](joseki/README.md) — 第一次研究の結論と成果物索引
- [`joseki/JOSEKI_FIRST_STUDY_CONCLUSION.md`](joseki/JOSEKI_FIRST_STUDY_CONCLUSION.md) — 第一次研究の最終結論

**詳細:**

- [`JOSEKI_RESEARCH.md`](JOSEKI_RESEARCH.md) — 研究方法・全フェーズの統合記録
- [`JOSEKI_RESEARCH_PLAN.md`](JOSEKI_RESEARCH_PLAN.md) — 研究課題・判定基準・完了条件

---

### 3. 先攻・後攻差研究

Baoのゲーム開始時の先攻・後攻差、および生成局面における手番価値を、自己対局・ランダム開局・共有開局比較などで検証する研究です。結果はAI条件、探索深度、開局分布への依存を明示して解釈します。

**統合研究記録:**

- [`FIRST_PLAYER_ADVANTAGE_RESEARCH.md`](FIRST_PLAYER_ADVANTAGE_RESEARCH.md)

**関連追試計画:**

- [`PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md`](PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md)
- [`NAMUA_SYMMETRY_RESEARCH_PLAN.md`](NAMUA_SYMMETRY_RESEARCH_PLAN.md)

---

### 4. 局面類型と棋風 — Study 1

**研究題目:** Baoにおける局面類型と棋風の発見・検証  
**状態:** research complete / final integration complete  
**作業branch:** `research/position-typology-and-playing-style`

Baoのposition typeとplaying styleをstate-level / trajectory-levelに分離して探索・検証した研究です。固定representationではMtajiに`MTAJI-M1 / MTAJI-M2`というbounded two-type morphologyが独立formal confirmationされました。一方、Namuaでは離散typeをpromoteせずN-ACT/N-CONというexploratory continuous representationを保持し、discrete playing-style clusteringも支持されませんでした。Stage 4で得たexact 4D style geometryは独立Stage 5で`NOT-CONFIRMED`です。

closed phase-transition Study 1とのsecondary bridgeでは、E-018 D2 / E-019 D3 / E-020 D3の固定scopeにおける`capture-branch-expansion` 59件がすべてNamuaに位置し、N-ACTの高い側との記述的関係が観測されました。これはhypothesis-generation evidenceであり、新しいformal confirmationやcausal mediationではありません。

**最初に読む:**

- [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`position-typology/STUDY_1_FINAL_REPORT.md`](position-typology/STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`position-typology/STUDY_1_VOCABULARY.md`](position-typology/STUDY_1_VOCABULARY.md) — confirmed / exploratory / rejectedを分けた最終語彙
- [`position-typology/REPRODUCIBILITY_INDEX.md`](position-typology/REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
- [`position-typology/CURRENT_STATUS.md`](position-typology/CURRENT_STATUS.md) — closure状態と固定境界
- [`position-typology/README.md`](position-typology/README.md) — 研究ディレクトリ案内

---

### 5. Namua→Mtaji Strategic Temporal Transition — Study 1

**研究題目:** BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — `capture-branch-expansion`からMtaji morphologyへの時間的接続  
**状態:** Study 1 closed / repository closure complete / formal decision `NOT-CONFIRMED`  
**作業branch:** `research/namua-mtaji-temporal-transition`

この独立prospective studyは、局面相転移点Study 1で固定されたNamua `capture-branch-expansion`と、局面類型と棋風Study 1でconfirmedされたfrozen `MTAJI-M1 / MTAJI-M2` morphologyの時間的bridgeを検討しました。

Stage 0/1で、現engineではfirst Mtajiがdeterministic Namua clock (`firstMtajiPly = 44`) に従うことが判明したため、first-Mtaji timingをsurvival/hazard endpointとして扱う設計を棄却しました。そのうえでStage 2では、fixed `P2-D2`のみのfresh held-out 4096-game corpus、earliest fully ascertained Namua CBE exposure、exact-ply R3-M 1:20 matchingを事前固定しました。

Formal estimabilityはG1/G2ともPASSしました。

```text
morphology-eligible exposed trajectories = 30
matched sets = 30
unique R3-M controls = 600
```

First-Mtaji M1はexposed 26/30 (0.8667)、matched controls 509/600 (0.8483)でしたが、唯一のpreregistered matched-set exact conditional Poisson-binomial testは `p_two_sided = 1.0` で、formal decisionは **`NOT-CONFIRMED`** です。小さな正の記述差はpositive trendとして救済しません。

この結果は、P2-D2内のfirst-Mtaji morphology associationが確認されなかったことを意味します。CBEにlater structureが存在しないこと、因果的null、Mtaji timing効果、P2-D2外への一般化は意味しません。

**最初に読む:**

- [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`](namua-mtaji-transition/STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md`](namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md) — Stage 2 canonical formal result
- [`namua-mtaji-transition/REPRODUCIBILITY_INDEX.md`](namua-mtaji-transition/REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
- [`namua-mtaji-transition/CURRENT_STATUS.md`](namua-mtaji-transition/CURRENT_STATUS.md) — closure状態とimmutable boundaries
- [`namua-mtaji-transition/README.md`](namua-mtaji-transition/README.md) — 研究ディレクトリ案内

---

### 6. Position Complexity / Difficulty — Study 1

**研究題目:** Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離  
**状態:** Study 1 closed / formal decision `INCONCLUSIVE`  
**作業branch:** `research/position-complexity-difficulty`

このprospective independent studyは、Baoの「難しい局面」を単一difficulty scoreへ圧縮せず、structural complexity、search workload、decision ambiguity、prediction instabilityへ分離して測定することを目的としました。Stage 0でexact root candidate / TopSet / best-second gap / depth-transition diagnosticをtechnical validationし、Stage 1 exploratory corpusでは666 unique rule statesを測定して全Stage 2 readiness gateをPASSしました。

Fresh Stage 2 formal corpusは1024局で、全局を独立replay/search verifierで確認し、862 unique rule statesをformal populationとして測定しました。Namua 424、Mtaji 438、D2→D3 instability 203、stable 659で、count/coverage gatesはすべてPASSしました。

Primary PCX-H1は`D23Instability ~ phase + log1pLegalMoveCount`のunpenalized logistic likelihood-ratio testでした。しかしfull modelのBFGS optimizerがprecision lossでpreregistered `finite and converged` gateを満たさなかったため、formal decisionは **`INCONCLUSIVE`** です。計算上のp値だけで`NOT-CONFIRMED`へ変更しません。Key secondary PCX-H2もH1 gatekeepingとsecondary reduced-model non-convergenceにより`NOT-CONFIRMATORILY-EVALUATED`です。

**最初に読む:**

- [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`position-complexity/STUDY_1_FINAL_REPORT.md`](position-complexity/STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`position-complexity/STAGE_2_FORMAL_RESULT.md`](position-complexity/STAGE_2_FORMAL_RESULT.md) — Stage 2 canonical formal result
- [`position-complexity/REPRODUCIBILITY_INDEX.md`](position-complexity/REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
- [`position-complexity/CURRENT_STATUS.md`](position-complexity/CURRENT_STATUS.md) — closure状態とimmutable boundaries
- [`position-complexity/README.md`](position-complexity/README.md) — 研究ディレクトリ案内

---

### 7. Tactical Motifs / Tesuji — Study 1

**研究題目:** Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証  
**状態:** **Study 1 closed / complete — C03 `CONFIRMED`, C01/C02/C04 `NOT-CONFIRMED`**  
**作業branch:** `research/tactical-motif-discovery`

このprospective independent studyは、特定のopening sequenceに依存せず、異なる局面に再出現する `position → move → reply structure → downstream consequence/value` の構造を抽出し、transferable tactical motifとして検証しました。

Stage 1では768-game fresh exploratory corpusから715 unique rule states / 3,148 exact legal move recordsを測定し、3,116,520 raw pattern instances、323,676 unique pattern keysを列挙しました。105,501 detailed candidatesのうち948件が全promotion gateを通過し、事前固定ranking/capsにより8 exploratory definitionsをpromotionしました。8定義は4つのexact `supportIdentityHash` pairを形成しましたが、Stage 1の8定義は変更せず凍結しています。

Stage 2ではfresh dataを見る前に各pairのlowest Stage 1 rankをcanonical formal candidateとして固定し、3,072 fresh games / seeds `22000001–22003072`で4候補×2 co-primary endpointsを検証しました。全3,072局を独立replay/search verificationし、4候補すべてがestimability gateを通過、6,605 formal measurementsのintegrityもPASSしました。

8 planned p-valuesをHolm-BonferroniでFWER 0.05に制御したformal evaluationでは、**TM-S2-C03のみ`CONFIRMED`**、C01/C02/C04は`NOT-CONFIRMED`でした。C03はMtajiで`reusablePits=0-2`の局面における`takata / row 1 / right / coarse-no-index`で、`actorNyumbaSeedsDeltaSign=0`を構造結果とする候補です。fresh 1,272 rootsでstructural success 97.88%、D3 top-set 73.66%、D3 median以上86.95%、D3 unique-worst 7.08%でした。

**最初に読む:**

- [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`tactical-motifs/README.md`](tactical-motifs/README.md) — 研究ディレクトリ入口

**詳細・正本:**

- [`tactical-motifs/STUDY_1_FINAL_REPORT.md`](tactical-motifs/STUDY_1_FINAL_REPORT.md) — Study 1科学的統合
- [`tactical-motifs/STAGE_2_FORMAL_RESULT.md`](tactical-motifs/STAGE_2_FORMAL_RESULT.md) — Stage 2 canonical formal result
- [`tactical-motifs/REPRODUCIBILITY_INDEX.md`](tactical-motifs/REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
- [`tactical-motifs/CURRENT_STATUS.md`](tactical-motifs/CURRENT_STATUS.md) — closure状態とfixed boundaries
- [`tactical-motifs/DECISION_REGISTER.md`](tactical-motifs/DECISION_REGISTER.md) — scientific decisions / no-rescue boundaries

**Boundary:** C03の`CONFIRMED`はfrozen Bao engine/search operationalizationにおける**machine-reproducible transferable tactical motif**までです。traditional/expert-recognized tesuji、human importance、pedagogical value、他engine/rulesへのgeneralizationは別studyを要します。

---

### 8. Tactical Motif Human / Expert Validation — Study 1

**研究題目:** Baoにおけるmachine-confirmed tactical motifのHuman / Expert Validation — TM-S2-C03は人間の熟練者にも手筋として認識されるか  
**状態:** **Study 1 complete — machine/instrument stage complete / human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**  
**作業branch:** `research/tactical-motif-human-validation`

Machine/instrument側ではfresh 1,536-game corpusを生成し、全1,536局をindependent full recomputationでmismatch 0まで確認しました。prospective C03 target / near-miss controlsを構成し、全readiness gateをPASSしたうえで、12 primary blocks、24 C03 targets、12 matched controls、6 secondary move-choice targetsからなる42 unique formal positionsをdeterministically freezeしました。

Human側は、所属機関によらない独立研究としてformal recruitmentを開始する前の時点で、frozen expert criteriaを満たすBao専門家・研究者・競技者へ現実的にアクセスする経路を確保できませんでした。

```text
accessible eligible experts = 0
scientific recruitment started = false
formal human responses = 0
minimum included experts required = 10
```

expert criteriaやminimum Nを緩和せず、human axisを`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`として閉じました。これはhuman negative resultではありません。

Final evidence state:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

**最初に読む:**

- [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md`](tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`tactical-motif-human-validation/CURRENT_STATUS.md`](tactical-motif-human-validation/CURRENT_STATUS.md) — closure状態とimmutable boundaries
- [`tactical-motif-human-validation/STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`](tactical-motif-human-validation/STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json) — machine-readable N=0 closure
- [`tactical-motif-human-validation/DECISION_REGISTER.md`](tactical-motif-human-validation/DECISION_REGISTER.md) — scientific decisions / no-rescue boundaries
- [`tactical-motif-human-validation/EXPERIMENT_INDEX.md`](tactical-motif-human-validation/EXPERIMENT_INDEX.md) — stage/experiment index

**Boundary:** N=0はC03へのnegative human evidenceではありません。将来qualified expertsへのアクセスが可能になっても、このclosed Study 1をretroactiveに書き換えず、新規prospective studyまたはnew responses前に明示的にversionedされたprospective reopeningとして扱います。

---

### 9. Position Evaluation / Win-Rate Calibration — Study 1

**研究題目:** Baoにおける形勢評価値と実現勝率の校正 — phase-aware empirical win-probability calibration と評価値の解釈境界  
**状態:** **Study 1 closed / formal decision `INCONCLUSIVE`**  
**作業branch:** `research/position-evaluation-winrate-calibration`

このprospective independent studyは、static `bao` evaluationをそのまま勝率とみなさず、frozen sampled-state populationとdeterministic continuation policyのもとでempirical continuation win probabilityへ校正できるかを検証しました。

Stage 1はfresh 1,024-game corpus / 830 selected statesで全readiness gateをPASSしました。事前固定した2 candidateのうちphase-aware logisticはfold 1 Mtajiでfrozen numerical convergence gateを満たさずineligibleとなり、phase-stratified isotonicが唯一のeligible candidateとして選択されました。

```text
Stage 1 isotonic pooled CV Brier = 0.1532240986334561
Namua = 0.2296469061338478
Mtaji = 0.07106958057053532
```

Stage 2はfresh 2,048 games / seeds `22300001..22302048`で実施し、全局のindependent replay/measurement verificationがPASS、final Stage 1 overlapもtrajectory/opening/rule-stateの全軸で0でした。

しかしstrict Stage 1 identity firewallとno-replacement selection後に:

```text
unique trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

となり、3つのpreregistered estimability gateが未達でした。したがってbootstrapとprimary performance criteriaはformal decisionに入らず、final decisionは **`INCONCLUSIVE`** です。

Descriptiveにはpooled Brier `0.155501...`、Namua `0.226781...`、Mtaji `0.080129...`でしたが、これらはformal confirmationへ昇格しません。

**最初に読む:**

- [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`](position-evaluation-calibration/STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md`](position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md) — Stage 2 canonical formal result
- [`position-evaluation-calibration/REPRODUCIBILITY_INDEX.md`](position-evaluation-calibration/REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
- [`position-evaluation-calibration/CURRENT_STATUS.md`](position-evaluation-calibration/CURRENT_STATUS.md) — closure状態とimmutable boundaries
- [`position-evaluation-calibration/DECISION_REGISTER.md`](position-evaluation-calibration/DECISION_REGISTER.md) — frozen decisions / no-rescue boundaries

**Boundary:** Study 1のisotonic mappingはexploratory development artifactであり、formalにvalidatedされたBao勝率ではありません。game-theoretic value、human advantage perception、causal effect、別engine/search/populationへのgeneralizationも主張しません。

---

### 10. Blunder / Misvaluation Patterns — Study 1

**研究題目:** Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証  
**状態:** **Study 1 closed / Stage 2 formal complete — 0 `CONFIRMED` / 4 `NOT-CONFIRMED`**  
**作業branch:** `research/blunder-misvaluation-patterns-stage2-formal`

このprospective independent studyは、「負けた手」やstatic evaluationだけで悪手を定義せず、同一局面の全合法手についてD3+Q1 exact search-based decision loss、構造変化、response envelope、horizon/static misvaluationを分離して測定し、局面横断的に再出現するmachine-reproducible error patternを探索・検証しました。

Stage 1は2,048 fresh games / seeds `22400001..22402048`で実施し、1,884 unique historical trajectoriesを独立full replay/search verificationしました。outcome-blind selectionで1,200 unique rule states（Namua/Mtaji 600/600）を固定し、5,295 exact legal movesを測定しました。frozen matcher/failure grammarから16,421 matchers / 123,624 detailed candidatesを列挙し、事前固定ranking/capsにより4件をexploratory candidateとしてpromotionしました。

Fresh Stage 2は4,096 games / seeds `22500001..22504096`で実施し、3,559 unique historical trajectoriesを独立full replay/search verificationしました。Stage 1 identity firewall後のoutcome-blind support-group selectionはG01 Namua 1,868 states、G02 Mtaji 810 statesで、final Stage 1 overlapはtrajectory/opening/rule-stateの全軸で`0 / 0 / 0`でした。2,678 formal D3 measurementsを独立verifierが再計算し、measurement hashを一致させました。

Formal evaluationは4 candidates × 2 co-primary endpoints = 8 testsをHolm-Bonferroni FWER 0.05で評価しました。4候補すべてestimableでしたが、最終結果は:

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
CONFIRMED = 0
```

C01-C03はfrozen structural/reply failure signature自体は高率に再現した一方、共通のD3-inferior recurrenceは`868/1868 = 0.464668...`でpreregistered confirmation floor `0.70`を満たしませんでした。C04はfailure recurrence `508/810 = 0.627160...`がfloor `0.65`未満、D3-inferior recurrence `411/810 = 0.507407...`もfloor `0.70`未満でした。

**最初に読む:**

- [`blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`blunder-misvaluation-patterns/README.md`](blunder-misvaluation-patterns/README.md) — 研究ディレクトリ入口

**詳細・正本:**

- [`blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`](blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md) — Study 1科学的最終統合
- [`blunder-misvaluation-patterns/results/STAGE_2_FORMAL_RESULT.json`](blunder-misvaluation-patterns/results/STAGE_2_FORMAL_RESULT.json) — canonical compact Stage 2 formal result
- [`blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md`](blunder-misvaluation-patterns/REPRODUCIBILITY_INDEX.md) — commit / hash / artifact / tooling索引
- [`blunder-misvaluation-patterns/CURRENT_STATUS.md`](blunder-misvaluation-patterns/CURRENT_STATUS.md) — closure状態とfixed boundaries
- [`blunder-misvaluation-patterns/DECISION_REGISTER.md`](blunder-misvaluation-patterns/DECISION_REGISTER.md) — frozen decisions / no-rescue boundaries

**Boundary:** `NOT-CONFIRMED`は、exact frozen machine-operational patternがStage 2 confirmation ruleを通らなかったことを意味します。「その手はgame-theoretically悪手ではない」という証明ではありません。human misconception、expert/traditional recognition、pedagogical value、causal mechanism、別engine/search/populationへのgeneralizationも主張しません。同じStage 2 dataへのthreshold緩和、alternate depth/evaluator、favorable subgroup、seed extensionなどによる救済は行いません。

---

### 11. Critical Positions / Outcome Branching — Study 1

**研究題目:** Baoにおける重要局面と勝敗分岐点の同定 — move-sensitive continuation divergence と decision-critical position structure の抽出・検証  
**状態:** **Study 1 closed after Stage 1 negative exploratory result / promoted candidates 0 / Stage 2 not executed**  
**作業branch:** `research/critical-positions-outcome-branching`

このprospective independent studyは、同一root stateの全exact legal moveVariantsを別々にinterveneし、その後を事前固定した`P1_NORMAL_TOP3` continuation policyで進めたときのroot-actor empirical continuation outcome divergenceを測定しました。engine/search value、ranking instability、structural branch divergence、game-theoretic value、human-perceived importanceは別constructとして保持しています。

Stage 1はfresh 3,072 games / seeds `22600001..22603072`で実施しました。independent full corpus replay、outcome-blind root selection、全exact legal move interventionのcontinuation/secondary/structural measurement、independent full continuation remeasurement / secondary / structural recomputationをすべてPASSしました。

```text
selected roots = 600 = 300 Namua + 300 Mtaji
measured exact root-move interventions = 2666
primary-estimable roots = 600 / 600
high-divergence threshold = D_range >= 0.30
Namua high-divergence roots = 52 / 300
Mtaji high-divergence roots = 87 / 300
overall high-divergence roots = 139 / 600
```

Frozen deterministic discoveryでは、phase + 1〜2個のpre-root structural tokensから1183 candidate auditsを構成しましたが、preregistered support/diversity/recurrence/median-divergence gatesをすべて通過したcandidateは0でした。

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
manualOverridePerformed = false
```

`zeroPromotedCandidatesAllowed = true`はprospectively frozenでした。したがってこれは解析失敗ではなく、**高いfixed-policy empirical continuation divergenceを示すfresh rootsは観測されたが、今回凍結した単純なstructural grammarでは再現可能なcandidate classをpromotionできなかった**というnegative exploratory discovery resultです。

Stage 2はexact Stage 1 promoted-candidate mappingを事前freezeしてから開始する設計でした。promoted candidateが0だったためformal targetがなく、Stage 2 generationはauthorize/executeしていません。reserved seeds `22700001..22706144`は未消費です。near-miss promotion、grammar拡張、threshold緩和、manual overrideはno-rescue違反となるため実施していません。

**最初に読む:**

- [`critical-positions-outcome-branching/STUDY_1_OVERVIEW.md`](critical-positions-outcome-branching/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md`](critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md) — Study 1科学的最終統合
- [`critical-positions-outcome-branching/results/STAGE_1_EXPLORATORY_SUMMARY.json`](critical-positions-outcome-branching/results/STAGE_1_EXPLORATORY_SUMMARY.json) — canonical compact exploratory summary
- [`critical-positions-outcome-branching/REPRODUCIBILITY_INDEX.md`](critical-positions-outcome-branching/REPRODUCIBILITY_INDEX.md) — seed/hash/artifact/tooling索引
- [`critical-positions-outcome-branching/CURRENT_STATUS.md`](critical-positions-outcome-branching/CURRENT_STATUS.md) — closure状態とfixed boundaries
- [`critical-positions-outcome-branching/DECISION_REGISTER.md`](critical-positions-outcome-branching/DECISION_REGISTER.md) — frozen decisions / no-rescue / closure decision

**Boundary:** この結果はStage 2 `NOT-CONFIRMED`ではありません。また「Baoに重要局面が存在しない」「game-theoretic turning pointがない」「人間が重要と感じる局面がない」という結論でもありません。今回のfrozen machine policy・population・grammarに限定されたexploratory resultです。

---

### 12. Restricted Endgame / Winning Regions — Study 1

**研究題目:** Baoにおける限定終盤と必勝圏の完全解析 — constrained endgame state spaces における exact game-theoretic value, cycle structure, and distance-to-win の列挙・後退解析  
**状態:** **Study 1 complete / formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`**  
**作業branch:** `research/restricted-endgame-winning-regions`

このprospective independent machine-only studyでは、standard initial stateから到達証明を持つ1つのMtaji rootと、そのrootからの全合法手によるcomplete raw-state forward closureをoutcome生成前に固定し、symmetry reductionなしでexact retrograde analysisを行った。

Final frozen domainとexact resultは次のとおり。

```text
roots = 1
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
```

Frozen rootはPlayer 0 to moveの`WIN`、absolute forced winner = Player 0、`DTF = 3`で、unique optimal moveは`capture:mtaji:1:4:left:::false`だった。Production solverと独立実装verifierは全state rows、state/edge hashes、value counts、RECURRENT SCCs、solution hashまで完全一致した。

より大きいone-shot候補は423,733 states / 426,938 edgesまで展開したが、1着手が1,000,000 microstepsのadministrative cutoffへ到達したためexact不適格となった。このcutoffをgame resultへ読み替えず、事前規則どおり追加cap拡張は行わなかった。

**最初に読む:**

- [`restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`restricted-endgame-winning-regions/STUDY_1_FINAL_REPORT.md`](restricted-endgame-winning-regions/STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json`](restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json) — canonical exact oracle
- [`restricted-endgame-winning-regions/REPRODUCIBILITY_INDEX.md`](restricted-endgame-winning-regions/REPRODUCIBILITY_INDEX.md) — hash / workflow / verification索引
- [`restricted-endgame-winning-regions/CURRENT_STATUS.md`](restricted-endgame-winning-regions/CURRENT_STATUS.md) — closure状態とclaim boundary
- [`restricted-endgame-winning-regions/DECISION_REGISTER.md`](restricted-endgame-winning-regions/DECISION_REGISTER.md) — frozen decisions / no-rescue boundary

**Boundary:** exact claimはfrozen 8-state restricted domainだけに限定される。Bao全体、全Mtaji、全終盤が解けたこと、Baoにcycle/drawがないこと、engine evaluationがgame-theoretically正しいこと、symmetry/isomorphismが成立することは意味しない。

---

## 将来研究

既存研究から切り出された独立課題や、新しい研究テーマは次に集約します。

- [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)

局面相転移点研究Study 1の未解決課題には、search-tree / PV / cutoff / horizon mechanism、reserve、nyumba、front-row control、capture-to-mobility、forcing-to-free-choiceなどがあります。これらはStudy 1の未完了作業ではなく、新規studyとして扱います。

局面類型と棋風Study 1からの主要future study候補には、N-ACT/N-CONの独立formal replication、新しいplaying-style model family、MTAJI-M1/M2の人間/expert validation、より広いengine/search implementationでのexternal validityがあります。Stage 5 held-out corpusを再定義してconfirmationを救済することはfuture workに含めません。

Namua→Mtaji temporal-transition Study 1の`NOT-CONFIRMED` resultについても、同一formal corpusのcandidate-ply subgroup、alternative comparator、追加game、別seed、threshold変更による救済はfuture workに含めません。

Position Complexity / Difficulty Study 1の`INCONCLUSIVE` resultについて、同じStage 2 dataを別optimizer/toleranceで再解析してformal decisionを救済することはfuture workに含めません。再検証する場合はfresh prospective replicationを使用します。

Tactical Motifs / Tesuji Study 1は完了しました。C01/C02/C04を追加gameやpaired-definition substitutionで救済しません。C03 human axisのN=0 closureもretroactiveに変更しません。

Position Evaluation / Win-Rate Calibration Study 1の`INCONCLUSIVE`についても、同じStage 2へ追加game、seed extension、identity-overlap replacement、estimability-threshold緩和、mapping refitを加えてformal decisionを救済しません。formal calibration generalizationを再検証する場合は、identity-firewall attritionを事前に織り込んだfresh prospective independent studyとします。

Blunder / Misvaluation Patterns Study 1は0 `CONFIRMED` / 4 `NOT-CONFIRMED`で閉じました。同じStage 2 dataを追加game、seed extension、threshold/floor緩和、candidate再定義、alternate primary depth/evaluator、favorable subgroupで救済しません。C01-C03で観測されたstructural/reply failure signatureの再現性は新しい仮説生成には利用できますが、現Studyのformal decisionを変更しません。追試する場合は新しいprospective independent studyとfresh evidenceを使用します。

Critical Positions / Outcome Branching Study 1はStage 1で0 promoted candidatesとなり閉じました。同じStage 1 outcomeを見た後にgrammarを広げる、near-missをpromotionする、support/divergence thresholdを緩和する、Stage 2 targetを手動選択することはfuture workに含めません。より豊富なstructural representationや別candidate grammarを検証する場合は、新しいprospective independent studyとしてfresh design/evidenceを用います。

---

## 新しい研究を追加するときの推奨導線

新しい研究成果を公開可能な形で閉じる場合は、可能なら次を用意します。

```text
doc/<research-area>/
├── README.md                 # 研究ディレクトリの案内
├── STUDY_N_OVERVIEW.md       # 初見向け成果概要
├── STUDY_N_FINAL_REPORT.md   # 科学的な統合正本
└── ...                       # status / vocabulary / checkpoints / registers
```

研究の性質によって命名は変えて構いません。重要なのは、**初見向け入口と科学的正本を分け、中央のこの `RESEARCH_INDEX.md` から辿れるようにすること**です。

研究が完了したら、この索引へ最低限次を追加します。

- 研究名
- 状態
- 1〜3文の成果要約
- 初見向け文書
- 科学的・技術的な正本

これにより、研究成果が増えてもルートREADMEを個別実験リンクで肥大化させず、研究全体を一覧できます。