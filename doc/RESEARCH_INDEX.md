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

- [`blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`](blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md) — Study 1科学的統合
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

### 13. Symmetry / Isomorphic Positions — Study 1

**研究題目:** Baoにおける対称性と同型局面の厳密検証 — rule-semantic state transformations, move-equivariant graph isomorphism, and validated canonicalization
**状態:** **Study 1 closed / formal result 0 validated / 0 rejected / 5 `NON-ESTIMABLE`**
**作業branch:** `research/symmetry-isomorphic-positions`

このprospective independent machine-only studyは、visual symmetryではなく、state transformation・player permutation・exact move bijectionが合法手集合、transition、terminal/winner semanticsを保存するかを検証した。candidate semantics、fresh seed block、root selection、depth、exact gatesをformal outcome前にfreezeした。

Technically invalidated v1 diagnosticはseeds `22910001..22910064`、Namua / Mtaji / Mtaji-houseless各8 roots、depth 3で実行され、3 candidates / 5 preregistered scopesはいずれもproduction / independent双方でfresh bounded-local mismatch 0だった。negative controlは638 fresh mismatches、IDENTITYはfresh mismatch 0だったが、v1はcandidate-decision runとしてtechnical invalidationされているため、これらはdiagnostic evidenceのみである。

mandatoryとしたRestricted Endgame Study 1のimmutable 8-state exact-oracle reconstructionでIDENTITY positive control自身がPASSしなかったため、v1は`TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION`となった。corrected v2はdraft runnerに留まり、formal spec / authorization / independent verifier / resultを作成せず未承認・未実行で終了した。したがってvalid formal candidate-decision runが存在せず、Study-level closureは5 outcomesすべて`NON-ESTIMABLE`である。read-only diagnosticで確認した3 terminal stateRowsのidentity limitationは、上流Restricted Endgame Study 1のformal decisionを変更しない。

**最初に読む:**

- [`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md`](symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`symmetry-isomorphic-positions/results/STAGE_1_FORMAL_RESULT.json`](symmetry-isomorphic-positions/results/STAGE_1_FORMAL_RESULT.json) — canonical compact formal result
- [`symmetry-isomorphic-positions/REPRODUCIBILITY_INDEX.md`](symmetry-isomorphic-positions/REPRODUCIBILITY_INDEX.md) — hash / workflow / artifact provenance
- [`symmetry-isomorphic-positions/CURRENT_STATUS.md`](symmetry-isomorphic-positions/CURRENT_STATUS.md) — closure状態とdownstream boundary
- [`symmetry-isomorphic-positions/DECISION_REGISTER.md`](symmetry-isomorphic-positions/DECISION_REGISTER.md) — prospective decisions / no-rescue / closure

**Boundary:** formalにvalidatedされたtransformは0件。Study 1からcanonicalization、symmetry-group claim、symmetry-reduced state countingは承認しない。State Space / Game Tree Complexity Studyはraw state identityで進行できる。このfollow-up requirementは`ORISC-STUDY1`として独立に実施され、Axis A `NOT-CONFIRMED` / Axis B `NOT-AUTHORIZED-NOT-EXECUTED`で閉じたため、symmetry reductionは引き続き未承認である。

---

### 14. Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation — Study 1

**研究題目:** 限定終盤exact oracleの表現整合性・raw-state identity監査と独立symmetry confirmation — oracle representation integrity, reconstruction contract, and prospective symmetry validation
**状態:** **COMPLETED / Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` / Axis B `NOT-AUTHORIZED-NOT-EXECUTED`**
**作業branch:** `research/oracle-representation-integrity-symmetry-confirmation`

このprospective independent machine-only studyは、Restricted Endgame Study 1のexact solutionそのものと、後からrepositoryへ保存されたstate-row representationを明示的に分離し、後者がraw-state reconstruction / downstream transform-validation anchorとして成立するかを新しいformal endpointとして検証した。

Stage 0Aでは元のREWR scientific workflow artifactをread-onlyで回収し、original production / independentの8 raw rowsが完全一致し、全stateが64 seedsを表現していることを確認した。repository-facing resultとの差は3 terminal rowsの`pending`だけに限定され、materialization mechanismは証拠不足のため`UNRESOLVED-PROVENANCE-GAP`として残した。

Formal Axis Aではproduction / independent別実装が凍結rootから同じraw graphを再構成した。

```text
states = 8
edges = 7
state/transition hashes = immutable REWR identityとexact match
all reconstructed represented seed totals = 64
terminal accounting mismatches = 0
transition successor mismatches = 0
A-G12 production/independent equality = PASS
```

一方、3 immutable repository-facing terminal rowsがstored-row re-hash (`A-G8`) と reconstructed raw-state binding (`A-G9`) をFAILし、差分fieldはすべて`pending`のみだった。repository rowは63 seeds、reconstructed raw stateは64 seedsを表現した。repository reconstructionがmandatory IDENTITY controlの一部だったため`A-G11=FAIL`となり、formal decisionは:

```text
ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
```

である。production / independentが同じfailure locationとgate分類を再現したため、implementation disagreementによる`NON-ESTIMABLE`ではない。

Conditional Stage 2 candidate contractはAxis A outcome前にfreeze済みだったが、Stage 1 `CONFIRMED`とIDENTITY PASSがauthorization prerequisiteだったため、Axis Bは`NOT-AUTHORIZED-NOT-EXECUTED`となった。したがってORISC-T01/T02/T03にはformal pass/fail labelを付与していない。

**最初に読む:**

- [`oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`](oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`oracle-representation-integrity-symmetry-confirmation/STUDY_1_FINAL_REPORT.md`](oracle-representation-integrity-symmetry-confirmation/STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`oracle-representation-integrity-symmetry-confirmation/results/STAGE_1_FORMAL_RESULT.json`](oracle-representation-integrity-symmetry-confirmation/results/STAGE_1_FORMAL_RESULT.json) — canonical Axis A formal result
- [`oracle-representation-integrity-symmetry-confirmation/results/STUDY_1_FINAL_RESULT.json`](oracle-representation-integrity-symmetry-confirmation/results/STUDY_1_FINAL_RESULT.json) — Study-level closure
- [`oracle-representation-integrity-symmetry-confirmation/REPRODUCIBILITY_INDEX.md`](oracle-representation-integrity-symmetry-confirmation/REPRODUCIBILITY_INDEX.md) — source/hash/workflow/artifact provenance
- [`oracle-representation-integrity-symmetry-confirmation/CURRENT_STATUS.md`](oracle-representation-integrity-symmetry-confirmation/CURRENT_STATUS.md) — closure状態とdownstream boundary
- [`oracle-representation-integrity-symmetry-confirmation/DECISION_REGISTER.md`](oracle-representation-integrity-symmetry-confirmation/DECISION_REGISTER.md) — prospective decisions / no-rescue / closure

**Boundary:** `REWR-STUDY1`の`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`やvalue/DTF/optimal moveを変更しない。`SIP-STUDY1`の5 `NON-ESTIMABLE` closureも変更しない。ORISC Axis Bは未実行なので、非自明symmetry candidateがfalseであることも示さない。validated transform setは空のままで、canonicalization / symmetry-group claim / symmetry-reduced state countingは未承認。State Space / Game Tree Complexityはauthoritative raw state identityだけを用いるRAW-ONLY研究として進行可能である。

---

### 15. State Space / Game Tree Complexity — Study 1

**研究題目:** Baoにおける状態空間とゲーム木複雑度の定量化 — authoritative raw-state identity に基づく reachable-state growth, transposition structure, branching complexity, and bounded game-tree expansion
**状態:** **COMPLETED / formal decision `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`**
**作業branch:** `research/state-space-game-tree-complexity`

このprospective independent machine-only studyは、ORISC-STUDY1のdownstream contractに従い、未検証symmetry reduction / canonicalizationを一切使用せず、authoritative raw-state identityだけでreachable-state graphとgame-tree occurrenceを定量化した。

Formal Stage 2ではstandard initial stateからraw-state depth 8まで、parent depth 0..7をcomplete expansionするbounded graphと、depth 8までのnon-deduplicated game treeをoutcome前にfreezeし、fresh evidenceで全域を列挙した。Productionとseparate-process independent verifierは全frozen domainを別々に再列挙して完全一致した。

```text
reachable raw states through depth 8 = 24,848
graph transition occurrences (parent depths 0..7) = 25,648
duplicate encounters = 801
multi-parent states = 763

game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940
raw-state / tree-node ratio = 0.803076823632074
```

Canonical identities:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

**最初に読む:**

- [`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md`](state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json`](state-space-game-tree-complexity/results/STAGE_2_FORMAL_RESULT.json) — canonical formal result
- [`state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md`](state-space-game-tree-complexity/REPRODUCIBILITY_INDEX.md) — workflow / artifact / hash / verifier索引
- [`state-space-game-tree-complexity/CURRENT_STATUS.md`](state-space-game-tree-complexity/CURRENT_STATUS.md) — closure状態とclaim boundary
- [`state-space-game-tree-complexity/DECISION_REGISTER.md`](state-space-game-tree-complexity/DECISION_REGISTER.md) — prospective decisions / no-rescue / closure

**Boundary:** exact claimはstandard-rootのfrozen depth-8 RAW-ONLY domainだけに限定される。`Bao state space = 24,848`、full game-tree exact count、depth-8 growthのfull-game extrapolation、global transposition ratio、symmetry-reduced count、validated canonicalization、full-game estimatorは主張しない。より深い列挙・推定・symmetry reductionは新しいprospective study/versioned protocolを必要とする。

---

### 16. Practical Comeback / Error-Inducing Move — Study 1

**研究題目:** Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証
**状態:** **Study 1 complete / Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**
**作業branch:** `research/practical-comeback-error-inducing-moves`

このprospective independent studyは、reference-policy上のmove qualityと、frozen imperfect-opponent policy下のbounded-horizon empirical comebackを分離し、reply-defense concentration、first-reply reference-error dependence、move optimality gapをmachine-operationalに測定した。

Stage 0は`TECHNICAL-PASS`。Stage 1ではfresh 3,072 gamesから300 disadvantaged roots（Namua/Mtaji 150/150）を選択し、1,065 exact root-move interventionsと18,105 continuation rowsを測定した。productionとindependent verifierはsource generation、RAW identity、selection、measurement、discoveryを再構築して一致した。

```text
candidateAuditCount = 55
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
scientificLabel = EXPLORATORY-ONLY
```

55 candidate definitionsは全て、少なくともfrozen promotion conjunctionを満たさなかった。特に55/55がminimum unique-root / trajectory / opening-prefix supportと、error-condition / defense-condition root supportを満たさなかった。near-miss promotion、threshold relaxation、favorable subgroup rescueは行っていない。

Stage 1 promoted candidateが0件だったためStage 2はauthorize/executeせず、reserved seeds `23300001..23306144`は未消費である。

**最初に読む:**

- [`practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md`](practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md) — 初見向け成果概要

**詳細・正本:**

- [`practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md`](practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md) — Study 1科学的最終統合
- [`practical-comeback-error-inducing-moves/results/STAGE_1_EXPLORATORY_RESULT.json`](practical-comeback-error-inducing-moves/results/STAGE_1_EXPLORATORY_RESULT.json) — canonical compact Stage 1 result
- [`practical-comeback-error-inducing-moves/results/STAGE_1_INDEPENDENT_VERIFICATION.json`](practical-comeback-error-inducing-moves/results/STAGE_1_INDEPENDENT_VERIFICATION.json) — independent reconstruction result
- [`practical-comeback-error-inducing-moves/REPRODUCIBILITY_INDEX.md`](practical-comeback-error-inducing-moves/REPRODUCIBILITY_INDEX.md) — workflow / artifact / hash / verifier索引
- [`practical-comeback-error-inducing-moves/CURRENT_STATUS.md`](practical-comeback-error-inducing-moves/CURRENT_STATUS.md) — terminal stateとclaim boundary

**Boundary:** 本Studyはobjective superiority、game-theoretic winning move、true Bao winning probability、human difficulty/error inducement、expert/traditional winning-try recognitionを示さない。結果はfrozen population、D3/D2 reference semantics、`P_MEDIUM_D1_TOP3`、96-ply endpoint、candidate grammar、promotion rulesに限定される。

---

### 17. Position Evaluation / Empirical Outcome Calibration Replication — Study 1

**研究題目:** Baoにおける形勢評価値と経験的継続結果の校正再検証 — strict identity firewall下でのfresh held-out replication
**Program:** `G2-01` / **Study ID:** `PEOCR-STUDY1` / **Research Generation 2**
**状態:** **Study complete / formal decision `INCONCLUSIVE`**
**作業branch:** `research/g2-01-position-evaluation-empirical-outcome-calibration-replication`

第二世代最初のprospective independent studyとして、Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`を変更・救済せず、fresh development + held-out formal populationでstatic Bao evaluationとempirical continuation outcomeのcalibration replicationを実施した。

Stage 1は2,048 fresh gamesで全readiness gateをPASSし、phase-stratified isotonic PAVA mappingを`MODEL-FROZEN-DEVELOPMENT`として固定した。Stage 2は8,192/8,192 gamesと全8 shard independent replay、統合selection/measurement independent verification、Stage 1 overlap `0 / 0 / 0`を達成した。

一方strict firewall後のformal populationは、`3898 < 4500` unique trajectories、`3570 < 4000` selected unique RAW states、Mtaji `1747 < 1750`となり、3つのpreregistered estimability gateが未達だった。このためformal decisionは**`INCONCLUSIVE`**。co-primary Brier/log-loss formal branchは未実行で`primary = null`であり、`NOT-CONFIRMED`やvalidated Bao win probabilityとは解釈しない。

**最初に読む:**

- [`position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md`](position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`position-evaluation-empirical-outcome-calibration-replication/STUDY_1_FINAL_REPORT.md`](position-evaluation-empirical-outcome-calibration-replication/STUDY_1_FINAL_REPORT.md)
- [`position-evaluation-empirical-outcome-calibration-replication/results/STAGE_2_FORMAL_RESULT.json`](position-evaluation-empirical-outcome-calibration-replication/results/STAGE_2_FORMAL_RESULT.json)
- [`position-evaluation-empirical-outcome-calibration-replication/REPRODUCIBILITY_INDEX.md`](position-evaluation-empirical-outcome-calibration-replication/REPRODUCIBILITY_INDEX.md)
- [`position-evaluation-empirical-outcome-calibration-replication/CURRENT_STATUS.md`](position-evaluation-empirical-outcome-calibration-replication/CURRENT_STATUS.md)

**Boundary:** 同じStage 2 dataに追加game、seed extension、replacement、gate relaxation、mapping refit、near-miss exception、favorable subgroupを適用してformal decisionを救済しない。game-theoretic / human / causal / public-AI-quality claimは本Study外。

---

### 18. Search Reliability / Decision Robustness — Study 1

**研究題目:** Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証
**Program:** `G2-02` / **Study ID:** `SRDR-STUDY1` / **Research Generation 2**
**状態:** **Study complete / formal decision `INCONCLUSIVE`**

同一RAW stateに対するmachine search decisionの安定性を、depth / node budget / quiescenceのprospectively frozen gridで検証した。Stage 1は1,280 fresh gamesから1,018 statesを測定して`PROFILE-FROZEN-DEVELOPMENT`となった。Stage 2は1,536 fresh held-out games、1,007 selected statesを用い、独立verifierが全game replay・selection・measurementをzero mismatchで再構築した。

しかし、strict Stage 1 firewall後のunique historical trajectoriesが`1040 < 1050`となり、唯一のpreregistered estimability gate failureとなった。このためprimary formal criterionは評価されず`null`、formal decisionは`INCONCLUSIVE`である。10 trajectory不足への追加seed・replacement・gate relaxationは行っていない。

Descriptive secondary profileではD2→D3 canonical-best agreement `0.734856`、Q2→Q1 `0.748759`、B1024→D3 `0.941410`が観測されたが、higher-resource searchはtruthではなく、これらをformal confirmation、human difficulty、engine correctnessへ昇格させない。

**最初に読む:**

- [`search-reliability-decision-robustness/STUDY_1_OVERVIEW.md`](search-reliability-decision-robustness/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`search-reliability-decision-robustness/STUDY_1_FINAL_REPORT.md`](search-reliability-decision-robustness/STUDY_1_FINAL_REPORT.md)
- [`search-reliability-decision-robustness/results/STAGE_2_FORMAL_RESULT.json`](search-reliability-decision-robustness/results/STAGE_2_FORMAL_RESULT.json)
- [`search-reliability-decision-robustness/results/STAGE_2_VERIFICATION.json`](search-reliability-decision-robustness/results/STAGE_2_VERIFICATION.json)
- [`search-reliability-decision-robustness/REPRODUCIBILITY_INDEX.md`](search-reliability-decision-robustness/REPRODUCIBILITY_INDEX.md)
- [`search-reliability-decision-robustness/CURRENT_STATUS.md`](search-reliability-decision-robustness/CURRENT_STATUS.md)
- [`search-reliability-decision-robustness/DECISION_REGISTER.md`](search-reliability-decision-robustness/DECISION_REGISTER.md)

**Boundary:** 同じStage 2 evidenceを追加seed、threshold relaxation、alternate primary、favorable subgroupで救済しない。`D3`/`B1024`をgame-theoretic truthとみなさない。formal再検証はnew prospective Study/versionとfresh evidenceを必要とする。

---

### 19. State Transformation Semantics / Canonicalization Validation — Study 1

**研究題目:** Baoにおける状態変換意味論とcanonicalizationの厳密検証 — rule-semantic validity, legal-move equivariance, successor binding, graph isomorphism, and prospective canonicalization authorization
**Program:** `G2-03` / **Study ID:** `STSCV-STUDY1` / **Research Generation 2**
**状態:** **Study complete / formal decision `INCONCLUSIVE` / 3 candidates `NON-ESTIMABLE`**

SIP-STUDY1の5 `NON-ESTIMABLE`、ORISC Axis A `NOT-CONFIRMED` / Axis B未実行を変更せず、representation bindingを最初から明示したfresh RAW-state evidenceでstate transformationを検証した。Stage 1は72 fresh development rootsを使い、trajectory seed / opening prefix / RAW stateをStage 2からfirewallした。Stage 2はseeds `26032001..26032768`、Namua/Mtaji/Mtaji-houseless各32 roots、depth 3、zero mismatch toleranceをoutcome前にfreezeし、hardened prefreezeとexplicit authorizationを経て実行した。

Fresh held-out production measurementは凍結quotaどおり96 rootsを選択し、T01 seat-swap-local、T02 LR-Mtaji-houseless、T03 compositionのproduction-only mismatchは全て0だった。しかしmandatory independent verifierがformal-result assembly時に`ReferenceError: standardStartReachablePopulationDedupDecision is not defined`で停止し、complete independent verification / formal result / canonical hashes / workflow artifactをmaterializeできなかった。

Prospectively frozen global-failure ruleは、1つでもglobal gateがPASSしない場合にStudy `INCONCLUSIVE`、candidate `NON-ESTIMABLE`、canonicalization `NON-ESTIMABLE`とする。したがって最終closureは:

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
validated transform set = []
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
```

Production-only zero-mismatch diagnosticsをformal validationへ救済せず、technical verifier failureをscientific rejectionへも読み替えていない。Verifier defectはfresh outcome生成後に判明したため、同じStage 2 evidenceへのsource修正・再実行は行わない。

**最初に読む:**

- [`state-transformation-semantics-canonicalization-validation/STUDY_1_OVERVIEW.md`](state-transformation-semantics-canonicalization-validation/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`state-transformation-semantics-canonicalization-validation/STUDY_1_FINAL_REPORT.md`](state-transformation-semantics-canonicalization-validation/STUDY_1_FINAL_REPORT.md)
- [`state-transformation-semantics-canonicalization-validation/results/STAGE_2_FORMAL_RESULT.json`](state-transformation-semantics-canonicalization-validation/results/STAGE_2_FORMAL_RESULT.json)
- [`state-transformation-semantics-canonicalization-validation/results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json`](state-transformation-semantics-canonicalization-validation/results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json)
- [`state-transformation-semantics-canonicalization-validation/REPRODUCIBILITY_INDEX.md`](state-transformation-semantics-canonicalization-validation/REPRODUCIBILITY_INDEX.md)
- [`state-transformation-semantics-canonicalization-validation/CURRENT_STATUS.md`](state-transformation-semantics-canonicalization-validation/CURRENT_STATUS.md)
- [`state-transformation-semantics-canonicalization-validation/DECISION_REGISTER.md`](state-transformation-semantics-canonicalization-validation/DECISION_REGISTER.md)

**Boundary:** canonicalization for scientific population identity / symmetry-reduced state countingは未承認のまま。SIP、ORISC、SSGTC、G2-01、G2-02のformal decisionを変更しない。Transformation hypothesesを再検証する場合はnew prospective Studyまたはexplicitly new versioned protocolとfresh evidenceを必要とする。

---

### 20. Restricted Endgame Exact Oracle Expansion — Study 1

**研究題目:** Baoにおける限定終盤exact oracleの拡張 — prospectively selected RAW-state domains に対する complete forward closure, exact retrograde analysis, cycle structure, distance, and optimal-move multiplicity の厳密解析
**Program:** `G2-04` / **Study ID:** `REEOE-STUDY1` / **Research Generation 2**
**状態:** **Study complete / formal decision `INCONCLUSIVE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

このprospective independent RAW-only studyは、複数のrestricted endgame domainsをoutcome-blindに選び、complete forward closureを証明できたdomainだけをexact retrograde analysisへ進める設計を検証した。Stage 0ではREWR 8-state / 7-edge oracleをtechnical fixtureとしてproduction / independent双方で再構築し、4 negative controlsを検出した。

Stage 1 v1はproduction development後にindependent verifierのstartup path defectが判明したためsame-evidence rerunをせずtechnical-invalidとして閉じた。Fresh Stage 1 v2は同じstructural/resource/acceptance designのままseeds `24041001..24041512`を用い、production / independentがfull 512-trajectory scan、eligible set、first-eight selected roots、closure classificationsを一致させた。

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

Frozen feasibility ruleはindependently verified complete closures `>=3`を要求していたため、Stage 1 v2は`STAGE1-DEVELOPMENT-BLOCKED`。cap増加、domain shrinkage、root replacement、seed extension、partial-closure promotion、symmetry/canonicalizationによる救済を行わず、Stage 2を未承認・未実行で閉じた。

**最初に読む:**

- [`restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md`](restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`restricted-endgame-exact-oracle-expansion/STUDY_1_FINAL_REPORT.md`](restricted-endgame-exact-oracle-expansion/STUDY_1_FINAL_REPORT.md)
- [`restricted-endgame-exact-oracle-expansion/results/STUDY_1_FINAL_RESULT.json`](restricted-endgame-exact-oracle-expansion/results/STUDY_1_FINAL_RESULT.json)
- [`restricted-endgame-exact-oracle-expansion/REPRODUCIBILITY_INDEX.md`](restricted-endgame-exact-oracle-expansion/REPRODUCIBILITY_INDEX.md)
- [`restricted-endgame-exact-oracle-expansion/CURRENT_STATUS.md`](restricted-endgame-exact-oracle-expansion/CURRENT_STATUS.md)
- [`restricted-endgame-exact-oracle-expansion/DECISION_REGISTER.md`](restricted-endgame-exact-oracle-expansion/DECISION_REGISTER.md)

**Boundary:** fresh G2-04 exact oracleは生成されていない。`STATE-LIMIT` / `ADMIN-CUTOFF`はgame outcomeではなく、`MOVE-NONTERMINATION`もgame-level `RECURRENT` / `DRAW`へ読み替えない。将来別のstructural/resource contractでexact expansionを試す場合はnew prospective Study/versionとfresh evidenceを必要とする。

---

### 21. Deep RAW State-Space Enumeration — Study 1

**研究題目:** Baoにおける深層RAW状態空間の完全列挙 — prospectively fixed roots に対する bounded-depth complete enumeration, reachable-state growth, branching structure, transposition structure, and tree/graph occurrence ratio の厳密解析
**Program:** `G2-05` / **Study ID:** `DRSSE-STUDY1` / **Research Generation 2**
**状態:** **Study complete / formal decision `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

Standard initial RAW rootをoutcome前に固定し、authoritative RAW identityのみを用いてdepth 0..9の全reachable layerとparent depths 0..8の全合法edge expansionを完全列挙した。Production materializationとmandatory independent full-domain re-enumerationはいずれもPASSした。

```text
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

Depth 9では78,009 unique RAW states、105,704 tree occurrences、3,116 duplicate arrivals、2,658 multi-predecessor statesをexactに記録した。validated transform setは`[]`のままで、symmetry reduction / canonicalizationは使用していない。

**最初に読む:**

- [`deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`](deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`deep-raw-state-space-enumeration/STUDY_1_FINAL_REPORT.md`](deep-raw-state-space-enumeration/STUDY_1_FINAL_REPORT.md)
- [`deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json`](deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json)
- [`deep-raw-state-space-enumeration/results/STUDY_1_FINAL_RESULT.json`](deep-raw-state-space-enumeration/results/STUDY_1_FINAL_RESULT.json)
- [`deep-raw-state-space-enumeration/REPRODUCIBILITY_INDEX.md`](deep-raw-state-space-enumeration/REPRODUCIBILITY_INDEX.md)
- [`deep-raw-state-space-enumeration/CURRENT_STATUS.md`](deep-raw-state-space-enumeration/CURRENT_STATUS.md)
- [`deep-raw-state-space-enumeration/DECISION_REGISTER.md`](deep-raw-state-space-enumeration/DECISION_REGISTER.md)

**Boundary:** exact claimはprospectively frozen standard-root depth-9 RAW domainだけに限定される。G2-04を救済せず、G1 SSGTCのformal decisionも変更しない。full Bao state-space / game-tree complexity、unbounded growth、asymptotic extrapolationはG2-05のendpointではなく、G2-12等のnew prospective Studyを必要とする。

---

### 22. Rich Critical-Position Representation — Study 1

**研究題目:** Baoにおける重要局面の豊かな構造表現の構築とprospective検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別
**Program:** `G2-06` / **Study ID:** `RCPR-STUDY1` / **Research Generation 2**
**状態:** **Study closed / Stage 1 `STAGE1-TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

Stage 0では8 representation families / 310 scalar featuresのproduction・independent exact agreementとmandatory controlsをPASSした。Stage 1はfresh 3,072-game blockと600-root targetをprospectively freezeし、consume-once authorizationの下でproductionを一度だけ実行した。

Productionでは599 rootsがprimary-estimable、134 rootsが`D_range >= 0.30` high-divergenceで、`RICH_ALL`がselected family setとなった。Production readiness checksはPASSしたが、mandatory independent verifierで4/600 representation rowsのexact feature-vector hashが不一致となったため、production-only readinessをformal target formationへ昇格させなかった。

Post-failure read-only postmortemでは4件すべての差分が`MOVE_SET_ENTROPY.indexEntropy`の浮動小数点加算順に由来する最下位bit級差と特定された。ただしこれは結果後のdiagnosticであり、frozen exact-equality gateをtoleranceへ変更してStudyを救済していない。

**最初に読む:**

- [`rich-critical-position-representation/STUDY_1_OVERVIEW.md`](rich-critical-position-representation/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`](rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json)
- [`rich-critical-position-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json`](rich-critical-position-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json)
- [`rich-critical-position-representation/CURRENT_STATUS.md`](rich-critical-position-representation/CURRENT_STATUS.md)
- [`rich-critical-position-representation/DECISION_REGISTER.md`](rich-critical-position-representation/DECISION_REGISTER.md)
- [`rich-critical-position-representation/REPRODUCIBILITY_INDEX.md`](rich-critical-position-representation/REPRODUCIBILITY_INDEX.md)

**Boundary:** Stage 1 seed block `28610001..28613072`は消費済みでsame-block repair/rerun、replacement、extensionは未承認。Stage 1 rowsはStage 2 formal evidenceへ再利用しない。G2-06を結果後に修正して再判定しない。G2-07以降も独立prospective contractとして進み、G2-08〜G2-10までclosure済みである。G2-10は`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`で閉じ、G2-11へ渡せるvalidated / frozen representationを生成していない。次のdownstream transition研究にはnew prospective representation protocolが必要であり、詳細は`FUTURE_RESEARCH_AGENDA.md`を正本とする。

---

### 23. Practical Comeback / Reply-Pressure Representation — Study 1

**研究題目:** Baoにおける実戦的逆転可能性とreply pressureの豊かな機械表現の構築・prospective検証 — reply-set width, defense-maintaining reply fraction, reply-quality distribution, punishment concentration, and opponent-policy sensitivity によるpractical comeback structureの再現可能な記述
**Program:** `G2-07` / **Study ID:** `PCRPR-STUDY1` / **Research Generation 2**
**状態:** **Study closed / Stage 1 `STAGE1-TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

G2-07は、閉鎖済み`PCEM-STUDY1`の55 candidate audits / promoted 0を救済せず、reply-centeredな80-scalar representationでmachine-operational practical comeback structureをfresh evidence上に記述できるかを検討した。Stage 0ではcanonical exact-move/reply ordering、deterministic binary64 arithmetic、exact cross-implementation feature equalityをtechnical validationした。

Fresh Stage 1では3,072 gamesから400 disadvantaged roots（Namua/Mtaji 200/200）、1,429 exact root-move rowsを構築した。Productionとstructurally independent replayは双方で`F05_ALL` / ridge `lambda=100`を選択し、`developmentCoreSha256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2`まで一致した。しかしindependent full result artifactのGitHub Actions `CreateArtifact`が5回timeoutし、prospectively必須だったfull final exact comparerを実行できなかった。したがってfrozen fail-closed ruleに従いStage 1は`STAGE1-TECHNICAL-INVALID`で閉じた。

Production-only performanceはunverified provenanceとして保存するが、accepted Stage 1 evidence、validated representation、formal target、Stage 2 evidenceへ昇格しない。Stage 1 seed block `28710001..28713072`は消費済みで、same-block rerun / repair / replacement / extensionは未承認。Stage 2 seeds `28810001..28816144`は未消費のまま`NOT-AUTHORIZED-NOT-EXECUTED`である。Machine reply pressureはhuman difficulty、deception、error probability、psychological pressureを意味しない。

**最初に読む:**

- [`practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md`](practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`practical-comeback-reply-pressure-representation/STUDY_1_FINAL_REPORT.md`](practical-comeback-reply-pressure-representation/STUDY_1_FINAL_REPORT.md)
- [`practical-comeback-reply-pressure-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`](practical-comeback-reply-pressure-representation/results/STAGE_1_DEVELOPMENT_RESULT.json)
- [`practical-comeback-reply-pressure-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json`](practical-comeback-reply-pressure-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json)
- [`practical-comeback-reply-pressure-representation/CURRENT_STATUS.md`](practical-comeback-reply-pressure-representation/CURRENT_STATUS.md)
- [`practical-comeback-reply-pressure-representation/DECISION_REGISTER.md`](practical-comeback-reply-pressure-representation/DECISION_REGISTER.md)
- [`practical-comeback-reply-pressure-representation/REPRODUCIBILITY_INDEX.md`](practical-comeback-reply-pressure-representation/REPRODUCIBILITY_INDEX.md)

**Boundary:** G2-07のStage 1 blockは消費済みで、artifact-transfer failureを理由としたsame-block rerunや、development-core一致のみを根拠とするpost-hoc verification条件緩和は行わない。Stage 2は未承認のまま閉鎖する。G2-08〜G2-10はいずれも独立prospective Studyとして完了済みである。G2-10はeligible representation 0で閉じたため、G2-11へ本Study群のunvalidated representationを事後昇格させない。

---


### 24. Machine Decision-Failure Taxonomy — Study 1

**研究題目:** Baoにおける機械的意思決定失敗の構造分類 — horizon failure, reply undercoverage, ranking instability, tactical oversight, valuation failure, morphology mismatch, and long-horizon structural misvaluation のprospective分離・再現可能なtaxonomy構築
**Program:** `G2-08` / **Study ID:** `MDFT-STUDY1` / **Research Generation 2**
**状態:** **Study closed / formal decision `NON-ESTIMABLE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

Stage 0は`STAGE0-TECHNICAL-PASS`。Fresh Stage 1では4,096 gamesから512 roots（Namua/Mtaji 256/256）を選択し、productionとstructurally independent implementationがsource generation、selection、analysis rows、development coreをexact一致させ、mandatory full artifactsも保存した。

一方、prospectively frozen global readiness gateのうち、distinct opening prefixesが`2836 < 3000`、最大single source-policy shareがLOW_CAPTURE `170/512 = 0.33203125 > 0.32`で未達となった。このためStage 1は`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`、Studyは`NON-ESTIMABLE`で閉じた。

F01/F02/F03/F05/F06/F10はleaf-level development promotion formulaを満たしたが、global readiness failureのためvalidated/frozen taxonomyまたはStage 2 targetへ昇格しない。F04/F07/F08はpromotion false、F09はscientific entry前にtechnical-ineligibleだった。Stage 2 seeds `29010001..29018192`は未消費である。

**最初に読む:**

- [`machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md`](machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`machine-decision-failure-taxonomy/STUDY_1_FINAL_REPORT.md`](machine-decision-failure-taxonomy/STUDY_1_FINAL_REPORT.md)
- [`machine-decision-failure-taxonomy/CURRENT_STATUS.md`](machine-decision-failure-taxonomy/CURRENT_STATUS.md)
- [`machine-decision-failure-taxonomy/DECISION_REGISTER.md`](machine-decision-failure-taxonomy/DECISION_REGISTER.md)
- [`machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md`](machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md)


---

### 25. Tactical Motif Generalization / Counterexample — Study 1

**研究題目:** Baoにおけるmachine-confirmed tactical motifの一般化可能範囲と反例領域のprospective検証 — phase, morphology, search condition, state familyを横断したTM-S2-C03のgeneralization boundary / counterexample boundaryの再現可能な特定
**Program:** `G2-09` / **Study ID:** `TMGC-STUDY1` / **Research Generation 2**
**状態:** **Study closed / formal decision `TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

Research Generation 1で唯一machine-confirmedされた`TM-S2-C03`をimmutable upstreamとして、fresh evidence上のgeneralization domain / counterexample domainをprospectively検証する独立Studyとして開始した。Stage 0ではC03 exact semantics、RAW identity、historical source binding、independent technical reconstruction、source diversity/resource feasibilityを検証し、`STAGE0-TECHNICAL-PASS`となった。Direct Namua transportはfrozen C03 exactと同一constructにならないため`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`とした。

Stage 1/2 population、seed、marginal axes、search instruments、firewall、multiplicity、decision ruleをscientific seed消費前に固定し、Stage 1 authorization前のtechnical-only tooling smokeをrun `33287035754`で実施した。syntax checksはPASSしたが、independent boundary aggregatorが`ReferenceError: topSetRate is not defined`で停止し、mandatory canonical smoke resultをmaterializeできなかった。

Prospectively frozen smoke failure mappingはsame-study repairを認めていなかったため、変数名修正によるrerunを行わず、Stage 1を`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`、Studyを`TECHNICAL-INVALID`で閉じた。Stage 1 seeds `29110001..29114096`とStage 2 seeds `29210001..29218192`は未消費である。したがってC03 generalization / counterexampleについてscientific positive/negative resultは存在しない。

**最初に読む:**

- [`tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md`](tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`tactical-motif-generalization-counterexample/STUDY_1_FINAL_REPORT.md`](tactical-motif-generalization-counterexample/STUDY_1_FINAL_REPORT.md)
- [`tactical-motif-generalization-counterexample/results/STUDY_1_FINAL_RESULT.json`](tactical-motif-generalization-counterexample/results/STUDY_1_FINAL_RESULT.json)
- [`tactical-motif-generalization-counterexample/results/STAGE_1_TECHNICAL_INVALID_RESULT.json`](tactical-motif-generalization-counterexample/results/STAGE_1_TECHNICAL_INVALID_RESULT.json)
- [`tactical-motif-generalization-counterexample/CURRENT_STATUS.md`](tactical-motif-generalization-counterexample/CURRENT_STATUS.md)
- [`tactical-motif-generalization-counterexample/DECISION_REGISTER.md`](tactical-motif-generalization-counterexample/DECISION_REGISTER.md)
- [`tactical-motif-generalization-counterexample/REPRODUCIBILITY_INDEX.md`](tactical-motif-generalization-counterexample/REPRODUCIBILITY_INDEX.md)

**Boundary:** `TM-S2-C03 = CONFIRMED`を取消さず、C01/C02/C04を救済しない。Stage 1 partial technical computationをgeneralization/counterexample evidenceへ昇格させない。実装修正版を検証する場合は、新しいprospective Studyまたは明示的新version、fresh technical-entry contract、fresh authorizationを必要とする。


---

### 26. Unified Multiaxial Strategic State Representation — Study 1

**研究題目:** Baoにおける多軸戦略状態表現の統合的構築とprospective検証 — search reliability, structural state, reply pressure, decision-failure evidence, tactical structure等のevidence-eligible axesを用いた再現可能なstrategic-state / regime representationの構築
**Program:** `G2-10` / **Study ID:** `UMSSR-STUDY1` / **Research Generation 2**
**状態:** **Study closed / formal decision `NOT-AUTHORIZED-NOT-EXECUTED` / Stage 1 `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

G2-01〜G2-09のformal closureを救済せず、upstream evidence eligibilityを先に固定したうえで、fresh population上に40-feature multiaxial strategic-state vectorを構築し、deterministic K-means `K=2..6`からStage 2へ昇格可能なregime representationを選択できるかをprospectively検証した。

Stage 1 accepted run `33297178656`は4,096 gamesを生成し、4,068 unique trajectories、3,711 distinct opening prefixesを得た。8 phase/source-policy strataから各64 roots、計512 rootsを選択し、40/40 featuresがactiveだった。Production / independent implementationはsource records、selection、analysis rows、scaler、candidate K metrics、representation decision、readiness objectをすべてexact一致させ、scientific readiness gateとresource gateも全項目PASSした。

一方、scientific seed消費前に固定したpromotion criteriaはminimum cluster support `>= 0.10`、mean silhouette `>= 0.05`、five-fold assignment stability `>= 0.80`を全て要求した。K=2はstability未達、K=3はsupport/stability未達、K=4とK=5はsupport未達、K=6はsupport/stability未達で、eligible candidateは0だった。このため`selectedRepresentation = null`とし、`FROZEN_REPRESENTATION.json`を生成しなかった。

この結果はtechnical-invalidでもnon-estimableでもなく、凍結したStudy 1 contract内でStage 2へpromoteできるrepresentationが得られなかった正式なnegative development resultである。Threshold relaxation、K range変更、PCA等の事後追加、favorable subgroup、Stage 1 rerun / seed extensionによる救済は行わない。

Stage 2はfrozen representationを検証する契約だったため、authorization prerequisiteを満たさず`NOT-AUTHORIZED-NOT-EXECUTED`で閉じた。Stage 2 seeds `29410001..29418192`は未消費である。`UMSSR-STUDY1`からG2-11へ渡せるvalidated / frozen representationはない。

**最初に読む:**

- [`unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md`](unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md)

**詳細・正本:**

- [`unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json`](unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json)
- [`unified-multiaxial-strategic-state-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`](unified-multiaxial-strategic-state-representation/results/STAGE_1_DEVELOPMENT_RESULT.json)
- [`unified-multiaxial-strategic-state-representation/CURRENT_STATUS.md`](unified-multiaxial-strategic-state-representation/CURRENT_STATUS.md)
- [`unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md`](unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md)
- [`unified-multiaxial-strategic-state-representation/REPRODUCIBILITY_INDEX.md`](unified-multiaxial-strategic-state-representation/REPRODUCIBILITY_INDEX.md)

**Boundary:** 本StudyはBaoにstrategic regimeが存在しないことを示さない。凍結した40-feature / deterministic K-means `K=2..6` / promotion ruleの組合せではeligible representationが得られなかったことだけを示す。別representationを検証する場合はnew prospective Studyまたはexplicit versioned protocolとfresh evidenceを必要とし、G2-11へ本Studyのunvalidated representationを持ち込まない。


## 将来研究

**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite

`G2-10 / UMSSR-STUDY1`はeligible frozen representationを生成せず閉じたため、`G2-11`を直接開始しない。次はG2-10を救済・再定義しない**新しいprospective independent strategic-representation prerequisite Study**を実施し、G2-11へ入力可能なrepresentation eligibilityをfresh evidenceで検証する。正式Study ID・最終題目・Stage構成は研究開始時にcurrent remote `main`を再監査して固定する。詳細は[`research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md`](research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md)を参照。

既存研究から切り出された独立課題や、新しい研究テーマは次に集約します。

- [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)

2026-08-26から、同Agenda Version 2.0.0に**第二世代の純粋研究プログラム**を追加した。第二世代は12 core studies + 独立Human Trackとして、測定の頑健化、rich strategic representation、temporal structure、exact analysis / bounded growth estimationを扱う。`G2-xx`はAgenda順序ラベルであり正式Study IDではない。

publicで使用中のBao AIの品質向上は第二世代研究のendpointではなく、完了済み研究結果を入力とする**独立engineering track**として扱う。AI実装・benchmark・deploymentの結果によって研究のformal decisionを変更しない。Program-level decisionは[`research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`](research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md)を参照する。

局面相転移点研究Study 1の未解決課題には、search-tree / PV / cutoff / horizon mechanism、reserve、nyumba、front-row control、capture-to-mobility、forcing-to-free-choiceなどがあります。これらはStudy 1の未完了作業ではなく、新規studyとして扱います。

局面類型と棋風Study 1からの主要future study候補には、N-ACT/N-CONの独立formal replication、新しいplaying-style model family、MTAJI-M1/M2の人間/expert validation、より広いengine/search implementationでのexternal validityがあります。Stage 5 held-out corpusを再定義してconfirmationを救済することはfuture workに含めません。

Namua→Mtaji temporal-transition Study 1の`NOT-CONFIRMED` resultについても、同一formal corpusのcandidate-ply subgroup、alternative comparator、追加game、別seed、threshold変更による救済はfuture workに含めません。

Position Complexity / Difficulty Study 1の`INCONCLUSIVE` resultについて、同じStage 2 dataを別optimizer/toleranceで再解析してformal decisionを救済することはfuture workに含めません。再検証する場合はfresh prospective replicationを使用します。

Tactical Motifs / Tesuji Study 1は完了しました。C01/C02/C04を追加gameやpaired-definition substitutionで救済しません。C03 human axisのN=0 closureもretroactiveに変更しません。

Position Evaluation / Win-Rate Calibration Study 1の`INCONCLUSIVE`についても、同じStage 2へ追加game、seed extension、identity-overlap replacement、estimability-threshold緩和、mapping refitを加えてformal decisionを救済しません。formal calibration generalizationを再検証する場合は、identity-firewall attritionを事前に織り込んだfresh prospective independent studyとします。

Blunder / Misvaluation Patterns Study 1は0 `CONFIRMED` / 4 `NOT-CONFIRMED`で閉じました。同じStage 2 dataを追加game、seed extension、threshold/floor緩和、candidate再定義、alternate primary depth/evaluator、favorable subgroupで救済しません。C01-C03で観測されたstructural/reply failure signatureの再現性は新しい仮説生成には利用できますが、現Studyのformal decisionを変更しません。追試する場合は新しいprospective independent studyとfresh evidenceを使用します。

Critical Positions / Outcome Branching Study 1はStage 1で0 promoted candidatesとなり閉じました。同じStage 1 outcomeを見た後にgrammarを広げる、near-missをpromotionする、support/divergence thresholdを緩和する、Stage 2 targetを手動選択することはfuture workに含めません。より豊富なstructural representationや別candidate grammarを検証する場合は、新しいprospective independent studyとしてfresh design/evidenceを用います。

ORISC-STUDY1はAxis A `NOT-CONFIRMED`、Axis B未実行で閉じました。同じclosed Study内でrepository rowを書き換えてAxis Aを再判定したり、Stage 2 authorizationを後付けしたりしません。repository representationを修復・置換して再評価する場合や非自明symmetryを再検証する場合は、新しいprospective study/versioned protocolとfresh authorizationを使用します。

STSCV-STUDY1は`INCONCLUSIVE`、3 candidatesすべて`NON-ESTIMABLE`で閉じました。production-only zero-mismatch diagnosticsをvalidated transformへ昇格させず、outcome後にindependent verifier sourceを修正して同じStage 2 evidenceを再実行することもfuture workに含めません。state transformation / canonicalizationを再検証する場合はnew prospective Studyまたはexplicitly new versioned protocol、fresh authorization、fresh formal evidenceを用います。

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
