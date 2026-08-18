# Bao la Kiswahili 研究成果索引

この文書は、本リポジトリで行う実験研究・調査研究の**中央入口**です。

ゲームの実装・利用方法を知りたい場合はルートの [`README.md`](../README.md) を参照してください。ここでは研究成果を、初見向けOverview、科学的正本、研究運用文書へ辿れる形で整理します。

---

## 研究文書の基本構造

独立研究では可能な範囲で次の3層を分けます。

1. **Overview / Conclusion** — 初見向け成果概要
2. **Final Report / Integrated Research** — 科学的・技術的な統合正本
3. **Plan / Status / Register / Log** — preregistration、decision、current status、provenance

Overviewはformal decisionやinterpretation boundaryを拡張しません。矛盾がある場合は各研究のFinal Report / formal result / decision registerを優先します。

---

## 研究成果

### 1. 局面相転移点研究 — Study 1

**研究題目:** Baoにおける局面相転移点の発見と、`capture-branch-expansion`の確認  
**状態:** Study 1 closed / repository closure complete

`capture-branch-expansion`をbounded strategic-transition phenotypeとして同定し、固定条件でdepth2とdepth3のsearch-profile ordering逆転をformalに確認しました。普遍的Bao phase-transition lawは主張しません。

**最初に読む:**

- [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`phase-transition/STUDY_1_FINAL_REPORT.md`](phase-transition/STUDY_1_FINAL_REPORT.md)
- [`phase-transition/CURRENT_STATUS.md`](phase-transition/CURRENT_STATUS.md)
- [`phase-transition/README.md`](phase-transition/README.md)

---

### 2. 定石研究 — 第一次研究

**状態:** `completed-without-provisional-joseki`

現在のルール実装とAI条件で標準初期局面から一般化可能な定石候補を検証しました。第一次研究は完了しましたが、一般定石として採用できる暫定定石は0件でした。

**最初に読む:**

- [`joseki/README.md`](joseki/README.md)
- [`joseki/JOSEKI_FIRST_STUDY_CONCLUSION.md`](joseki/JOSEKI_FIRST_STUDY_CONCLUSION.md)

**詳細:**

- [`JOSEKI_RESEARCH.md`](JOSEKI_RESEARCH.md)
- [`JOSEKI_RESEARCH_PLAN.md`](JOSEKI_RESEARCH_PLAN.md)

---

### 3. 先攻・後攻差研究

Baoの開始時の先攻・後攻差、および生成局面における手番価値を、自己対局・ランダム開局・共有開局比較などで検証する研究です。

**統合研究記録:**

- [`FIRST_PLAYER_ADVANTAGE_RESEARCH.md`](FIRST_PLAYER_ADVANTAGE_RESEARCH.md)

**関連追試計画:**

- [`PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md`](PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md)
- [`NAMUA_SYMMETRY_RESEARCH_PLAN.md`](NAMUA_SYMMETRY_RESEARCH_PLAN.md)

---

### 4. 局面類型と棋風 — Study 1

**研究題目:** Baoにおける局面類型と棋風の発見・検証  
**状態:** research complete / final integration complete

固定representationではMtajiに`MTAJI-M1 / MTAJI-M2`というbounded two-type morphologyが独立formal confirmationされました。Namuaでは離散typeをpromoteせず`N-ACT / N-CON`をexploratory continuous coordinatesとして保持し、discrete playing-style clusteringは支持されませんでした。

**最初に読む:**

- [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`position-typology/STUDY_1_FINAL_REPORT.md`](position-typology/STUDY_1_FINAL_REPORT.md)
- [`position-typology/REPRODUCIBILITY_INDEX.md`](position-typology/REPRODUCIBILITY_INDEX.md)
- [`position-typology/CURRENT_STATUS.md`](position-typology/CURRENT_STATUS.md)
- [`position-typology/README.md`](position-typology/README.md)

---

### 5. Namua→Mtaji Strategic Temporal Transition — Study 1

**研究題目:** BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — `capture-branch-expansion`からMtaji morphologyへの時間的接続  
**状態:** Study 1 closed / formal decision `not-confirmed`

現engineではfirst Mtajiがdeterministic Namua clock (`firstMtajiPly = 44`) に従うためtiming endpointを棄却し、fresh held-out P2-D2 corpusでfirst-Mtaji morphology associationを検証しました。matched-set exact testは`p_two_sided = 1.0`でformal decisionは`not-confirmed`です。

**最初に読む:**

- [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`](namua-mtaji-transition/STUDY_1_FINAL_REPORT.md)
- [`namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md`](namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md)
- [`namua-mtaji-transition/REPRODUCIBILITY_INDEX.md`](namua-mtaji-transition/REPRODUCIBILITY_INDEX.md)
- [`namua-mtaji-transition/CURRENT_STATUS.md`](namua-mtaji-transition/CURRENT_STATUS.md)

---

### 6. Position Complexity / Difficulty — Study 1

**研究題目:** Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離  
**状態:** Study 1 closed / formal decision `inconclusive`

Fresh Stage 2 formal corpusで862 unique rule statesを測定しましたが、primary logistic modelのBFGS optimizerがpreregistered convergence gateを満たさなかったためformal decisionは`inconclusive`です。計算上のp値だけでlabelを救済しません。

**最初に読む:**

- [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`position-complexity/STUDY_1_FINAL_REPORT.md`](position-complexity/STUDY_1_FINAL_REPORT.md)
- [`position-complexity/STAGE_2_FORMAL_RESULT.md`](position-complexity/STAGE_2_FORMAL_RESULT.md)
- [`position-complexity/REPRODUCIBILITY_INDEX.md`](position-complexity/REPRODUCIBILITY_INDEX.md)
- [`position-complexity/CURRENT_STATUS.md`](position-complexity/CURRENT_STATUS.md)

---

### 7. Tactical Motifs / Tesuji — Study 1

**研究題目:** Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証  
**状態:** Study 1 closed / complete — C03 confirmed, C01/C02/C04 not-confirmed

Fresh exploratory corpusから候補を抽出し、fresh 3,072-game Stage 2 formal corpusで4 canonical candidatesを検証しました。Holm-Bonferroni FWER 0.05のformal evaluationで`TM-S2-C03`のみ`CONFIRMED`、C01/C02/C04は`NOT-CONFIRMED`でした。

C03はMtajiで`reusablePits=0-2`の局面における`takata / row 1 / right / coarse-no-index`で、`actorNyumbaSeedsDeltaSign=0`を構造結果とするmachine-reproducible transferable tactical motifです。

**最初に読む:**

- [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md)
- [`tactical-motifs/README.md`](tactical-motifs/README.md)

**詳細・正本:**

- [`tactical-motifs/STUDY_1_FINAL_REPORT.md`](tactical-motifs/STUDY_1_FINAL_REPORT.md)
- [`tactical-motifs/STAGE_2_FORMAL_RESULT.md`](tactical-motifs/STAGE_2_FORMAL_RESULT.md)
- [`tactical-motifs/REPRODUCIBILITY_INDEX.md`](tactical-motifs/REPRODUCIBILITY_INDEX.md)
- [`tactical-motifs/CURRENT_STATUS.md`](tactical-motifs/CURRENT_STATUS.md)

**Boundary:** C03の`CONFIRMED`はmachine evidenceです。traditional/expert-recognized tesuji、human importance、pedagogical valueは別studyを要します。

---

### 8. Tactical Motif Human / Expert Validation — Study 1

**研究題目:** Baoにおけるmachine-confirmed tactical motifのHuman / Expert Validation — TM-S2-C03は人間の熟練者にも手筋として認識されるか  
**状態:** **Study 1 complete — machine/instrument stage complete / human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**  
**作業branch:** `research/tactical-motif-human-validation`

Tactical Motifs Study 1でmachine-confirmedとなった`TM-S2-C03`を、人間のBao expertが異なる局面に共通するtransferable move principleとして認識するかを検証するためのprospective independent studyです。

Machine/instrument側では、fresh 1,536-game corpusを生成し、全1,536局をindependent full recomputationでmismatch 0まで確認しました。prospective C03 target / near-miss controlsを構成し、all readiness gatesをPASSしたうえで、12 primary blocks、24 C03 targets、12 matched controls、6 secondary move-choice targetsからなる**42 unique formal positions**をdeterministically freezeしました。

Private exact-stimulus freeze SHA-256:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

Human側は、所属機関によらない独立研究としてformal recruitmentを開始する前の時点で、frozen expert criteriaを満たすBao専門家・研究者・競技者へ現実的にアクセスする経路を確保できませんでした。

```text
accessible eligible experts = 0
scientific recruitment started = false
formal human responses = 0
minimum included experts required = 10
```

そのためexpert criteriaやminimum Nを緩和せず、human axisを**`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**として閉じました。これはhuman negative resultではなく、expert recognitionについてformal inferenceできなかったという結果です。

Final evidence state:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

**最初に読む:**

- [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md`](tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md)
- [`tactical-motif-human-validation/CURRENT_STATUS.md`](tactical-motif-human-validation/CURRENT_STATUS.md)
- [`tactical-motif-human-validation/STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`](tactical-motif-human-validation/STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json)
- [`tactical-motif-human-validation/DECISION_REGISTER.md`](tactical-motif-human-validation/DECISION_REGISTER.md)
- [`tactical-motif-human-validation/EXPERIMENT_INDEX.md`](tactical-motif-human-validation/EXPERIMENT_INDEX.md)

**Boundary:** N=0はC03へのnegative human evidenceではありません。将来expert accessが可能になっても、このclosed Study 1をretroactiveに書き換えず、新規prospective studyまたは明示的versioned reopeningとして扱います。

---

## 将来研究

既存研究から切り出された独立課題や、新しい研究テーマは次に集約します。

- [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)

完了済み研究のformal decision、negative/null/inconclusive/non-estimable result、threshold、classifier、population、interpretation boundaryを後続研究で救済しません。

Tactical Motif Human / Expert Validation Study 1について、将来qualified expertsへのアクセスが可能になった場合は、今回の`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`を変更する追試ではなく、新しいprospective human-validation studyまたはnew responses前に明示的にversionedされたprospective reopeningとして扱います。

---

## 新しい研究を追加するときの推奨導線

新しい研究成果を公開可能な形で閉じる場合は、可能なら次を用意します。

```text
doc/<research-area>/
├── README.md
├── STUDY_N_OVERVIEW.md
├── STUDY_N_FINAL_REPORT.md
└── ...
```

研究が完了したら、この索引へ最低限、研究名・状態・成果要約・Overview・科学的正本を追加します。
