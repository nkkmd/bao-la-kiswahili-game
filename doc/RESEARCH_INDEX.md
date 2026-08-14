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

Baoのposition typeとplaying styleをstate-level / trajectory-levelに分離して探索・検証した研究です。固定representationではMtajiに`MTAJI-M1 / MTAJI-M2`というbounded two-type morphologyが独立formal confirmationされました。一方、Namuaでは離散typeをpromoteせずN-ACT/N-CONというexploratory continuous representationを保持し、discrete playing-style clusteringも支持されませんでした。Stage 4で得たexact 4D style geometryは独立Stage 5で`not-confirmed`です。

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
**状態:** Study 1 closed / repository closure complete / formal decision `not-confirmed`  
**作業branch:** `research/namua-mtaji-temporal-transition`

この独立prospective studyは、局面相転移点Study 1で固定されたNamua `capture-branch-expansion`と、局面類型と棋風Study 1でconfirmedされたfrozen `MTAJI-M1 / MTAJI-M2` morphologyの時間的bridgeを検討しました。

Stage 0/1で、現engineではfirst Mtajiがdeterministic Namua clock (`firstMtajiPly = 44`) に従うことが判明したため、first-Mtaji timingをsurvival/hazard endpointとして扱う設計を棄却しました。そのうえでStage 2では、fixed `P2-D2`のみのfresh held-out 4096-game corpus、earliest fully ascertained Namua CBE exposure、exact-ply R3-M 1:20 matchingを事前固定しました。

Formal estimabilityはG1/G2ともPASSしました。

```text
morphology-eligible exposed trajectories = 30
matched sets = 30
unique R3-M controls = 600
```

First-Mtaji M1はexposed 26/30 (0.8667)、matched controls 509/600 (0.8483)でしたが、唯一のpreregistered matched-set exact conditional Poisson-binomial testは `p_two_sided = 1.0` で、formal decisionは **`not-confirmed`** です。小さな正の記述差はpositive trendとして救済しません。

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
**状態:** Study 1 closed / formal decision `inconclusive`  
**作業branch:** `research/position-complexity-difficulty`

このprospective independent studyは、Baoの「難しい局面」を単一difficulty scoreへ圧縮せず、structural complexity、search workload、decision ambiguity、prediction instabilityへ分離して測定することを目的としました。Stage 0でexact root candidate / TopSet / best-second gap / depth-transition diagnosticをtechnical validationし、Stage 1 exploratory corpusでは666 unique rule statesを測定して全Stage 2 readiness gateをPASSしました。

Fresh Stage 2 formal corpusは1024局で、全局を独立replay/search verifierで確認し、862 unique rule statesをformal populationとして測定しました。Namua 424、Mtaji 438、D2→D3 instability 203、stable 659で、count/coverage gatesはすべてPASSしました。

Primary PCX-H1は`D23Instability ~ phase + log1pLegalMoveCount`のunpenalized logistic likelihood-ratio testでした。しかしfull modelのBFGS optimizerがprecision lossでpreregistered `finite and converged` gateを満たさなかったため、formal decisionは **`inconclusive`** です。計算上のp値だけで`not-confirmed`へ変更しません。Key secondary PCX-H2もH1 gatekeepingとsecondary reduced-model non-convergenceにより`not-confirmatorily-evaluated`です。

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
**状態:** Stage 1 exploratory discovery complete / Stage 2 formal generation authorized, not yet generated  
**作業branch:** `research/tactical-motif-discovery`

このprospective independent studyは、特定のopening sequenceに依存せず、異なる局面に再出現する `position → move → reply structure → downstream consequence/value` の構造を抽出し、transferable tactical motifとして検証する研究です。

Stage 1では768-game fresh exploratory corpusから715 unique rule states / 3,148 exact legal move recordsを測定し、3,116,520 raw pattern instances、323,676 unique pattern keysを列挙しました。105,501 detailed candidatesのうち948件が全promotion gateを通過し、事前固定ranking/capsにより8 exploratory definitionsがStage 2 planningへpromotionされました。8定義は4つのexact `supportIdentityHash` pairを形成しますが、Stage 1では8定義をそのまま凍結しています。

Stage 2はfresh dataを見る前に、各support-equivalence pairからStage 1 rankの最上位定義をcanonical candidateとして固定し、4 candidate × 2 co-primary endpointsをformalに検証する設計をfreezeしました。fresh corpusは3,072 games / seeds `22000001–22003072`、8 planned p-valuesはHolm-BonferroniでFWER 0.05を制御します。pre-generation numeric auditでexact-binomial計算をlog-spaceへhardeningし、scientific data 0件のまま再validation / source-hash authorizationまで完了しています。

**最初に読む:**

- [`tactical-motifs/README.md`](tactical-motifs/README.md) — 研究概要・現在地・主要文書への入口
- [`tactical-motifs/STAGE_1_EXPLORATORY_RESULT.md`](tactical-motifs/STAGE_1_EXPLORATORY_RESULT.md) — Stage 1 exploratory result

**詳細・正本:**

- [`tactical-motifs/CURRENT_STATUS.md`](tactical-motifs/CURRENT_STATUS.md) — 現在地とscientific authorization state
- [`tactical-motifs/STAGE_1_CANDIDATE_FREEZE.json`](tactical-motifs/STAGE_1_CANDIDATE_FREEZE.json) — Stage 1 promoted definitionsのcompact freeze
- [`tactical-motifs/STAGE_2_FORMAL_PROTOCOL.md`](tactical-motifs/STAGE_2_FORMAL_PROTOCOL.md) — Stage 2 formal protocol
- [`tactical-motifs/STAGE_2_EXECUTION_RUNBOOK.md`](tactical-motifs/STAGE_2_EXECUTION_RUNBOOK.md) — Stage 2 stable-runtime execution order
- [`tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json`](tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json) — 4 canonical formal candidates
- [`tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json`](tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json) — machine-readable formal contract
- [`tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`](tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json) — hardened exact-source authorization
- [`tactical-motifs/DECISION_REGISTER.md`](tactical-motifs/DECISION_REGISTER.md) — scientific decisions / no-rescue boundaries

**Boundary:** Stage 2 `CONFIRMED`となっても、現時点のformal claimはfrozen Bao engine/search operationalizationにおけるmachine-reproducible transferable tactical motifまでです。traditional/expert recognition、human importance、pedagogical valueは別studyを要します。

---

## 将来研究

既存研究から切り出された独立課題や、新しい研究テーマは次に集約します。

- [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)

局面相転移点研究Study 1の未解決課題には、search-tree / PV / cutoff / horizon mechanism、reserve、nyumba、front-row control、capture-to-mobility、forcing-to-free-choiceなどがあります。これらはStudy 1の未完了作業ではなく、新規studyとして扱います。

局面類型と棋風Study 1からの主要future study候補には、N-ACT/N-CONの独立formal replication、新しいplaying-style model family、MTAJI-M1/M2の人間/expert validation、より広いengine/search implementationでのexternal validityがあります。Stage 5 held-out corpusを再定義してconfirmationを救済することはfuture workに含めません。

Namua→Mtaji temporal-transition Study 1の`not-confirmed` resultについても、同一formal corpusのcandidate-ply subgroup、alternative comparator、追加game、別seed、threshold変更による救済はfuture workに含めません。新しいstructural-trajectory question、mechanistic analysis、human/expert validation、別conditionでのexternal validityを扱う場合は、新規prospective studyとして分離します。

Position Complexity / Difficulty Study 1の`inconclusive` resultについて、同じStage 2 dataを別optimizer/toleranceで再解析してformal decisionを救済することはfuture workに含めません。数値収束問題を解消してH1を再検証する場合は、optimizer/convergence procedureを事前固定した新しいprospective independent replicationとfresh corpusを使用します。Human difficulty validationも別studyです。

Tactical Motifs / Tesuji Study 1は現在Stage 2 formal generation直前です。fresh Stage 2 resultが出る前に、human/expert/traditional tesuji validationやpedagogical valueを同じformal studyへ追加しません。これらはmachine-reproducible Stage 2 completion後の別prospective validation studyとして扱います。

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