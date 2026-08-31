# Research Generation 2 — Final Synthesis

更新日: 2026-08-31  
対象: Bao Second-Generation Research Program  
Core agenda: `G2-01..G2-12`  
状態: **PROGRAM CLOSED ON RESEARCH BRANCH / PENDING MAIN INTEGRATION**

## 1. 最終結論

Research Generation 2のcore machine programは、設定した研究課題に対してprospective contract、fresh evidence、independent verification、fail-closed gate、no-rescue ruleを維持しながら一通りformal closureした。

本programの完了は「多くのpositive hypothesisが確認された」ことを意味しない。むしろ第二世代では、positive resultだけでなく、`INCONCLUSIVE`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`、dependency-gated `NOT-AUTHORIZED-NOT-EXECUTED`を同じ科学的規律で保存したことが中心成果である。

特に最終的なprogram boundaryは次のとおりである。

```text
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 long-horizon transition structure = NON-ESTIMABLE
G2-11 execution = NOT-AUTHORIZED-NOT-EXECUTED
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
G2-H01 human track = deferred / non-blocking
Research Generation 2 core program = CLOSED
```

## 2. Program designと守られた原則

第二世代はResearch Generation 1のformal decisionを変更・救済するための追試系列ではなく、新しいfresh evidenceを使う独立研究系列として設計された。

全体を通じて次の原則を維持した。

1. Studyごとにformal identity、population、seed、endpoint、threshold、stopping ruleをoutcome前に固定する。
2. development evidenceとformal held-out evidenceを可能な限り分離する。
3. production computationだけでなくindependent verificationをformal gateとして用いる。
4. gate failure後にthreshold、population、seed、candidate、verifierを結果都合で変更しない。
5. negative / null / inconclusive / non-estimable / technical-invalidを正常なclosureとして保存する。
6. RAW identityを、formalにvalidatedされたtransformが得られない限りauthoritativeとする。
7. public Bao AIの棋力・deployment・UXをscientific endpointへ混入させない。
8. human claimをmachine-only evidenceで代替しない。

## 3. Core agendaの最終状態

| Agenda | Study / state | 最終状態 | 主要境界 |
| --- | --- | --- | --- |
| `G2-01` | `PEOCR-STUDY1` | `INCONCLUSIVE` | strict identity firewall後のestimability gate未達。validated Bao win-probability mappingではない |
| `G2-02` | `SRDR-STUDY1` | `INCONCLUSIVE` | formal populationのunique trajectory gate未達。primary criterion未評価 |
| `G2-03` | `STSCV-STUDY1` | `INCONCLUSIVE`; candidates `NON-ESTIMABLE` | mandatory independent formal artifact未成立。validated transform set `[]` |
| `G2-04` | `REEOE-STUDY1` | `INCONCLUSIVE` | fresh selected rootsでcomplete closure 0、Stage 2未承認 |
| `G2-05` | `DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | standard initial RAW rootからdepth 0..9のbounded exact claimのみ |
| `G2-06` | `RCPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | exact representation equality failure後のsame-block rerunなし |
| `G2-07` | `PCRPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | mandatory independent full artifact未materialize、Stage 2未承認 |
| `G2-08` | `MDFT-STUDY1` | `NON-ESTIMABLE` | prospective global readiness gate未達、taxonomyをformal promotionせず |
| `G2-09` | `TMGC-STUDY1` | `TECHNICAL-INVALID` | scientific seed消費前のtechnical tooling gate failure、formal generalization evidenceなし |
| `G2-10` | `UMSSR-STUDY1` | Stage 1 `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`; Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED` | eligible frozen strategic representationなし |
| `G2-11` | Study ID未付与 | `NON-ESTIMABLE`; execution `NOT-AUTHORIZED-NOT-EXECUTED` | required frozen representation dependencyを満たせずscientific executionなし |
| `G2-12` | `SSGTGE-STUDY1` | `TECHNICAL-INVALID` | independent numerical-equivalence gate failure。canonical estimator `null`、fresh depth 10/11未生成・未読 |

G2-11の前には、G2-10を救済しない独立prerequisiteとして`PSRRE-STUDY1`も実施した。これはStage 1をproduction / independent full-exactで完遂したが、prospectively fixed feature-variation readiness `20`に対してobserved `15`で停止し、formal decision `NON-ESTIMABLE`、`selectedRepresentation = null`で閉じた。

## 4. 測定・評価研究から得られたもの

G2-01とG2-02は、評価値や探索出力を「それらしい数値」としてそのまま科学的量へ読み替えないための境界を強化した。

G2-01ではfresh held-out replicationとindependent verificationまで到達したが、strict identity firewall後のformal populationがpreregistered estimability requirementsを満たさず`INCONCLUSIVE`となった。したがってexploratory mappingをvalidated Bao win probabilityとして扱わない。

G2-02でもsearch condition間のrobustnessをformalに評価する前提となるpopulation gateが僅かに未達となり、primary criterionを結果都合で実行しなかった。

この2研究の統合的意義は、評価値・探索安定性を下流研究の便利なground truthとして無条件利用しないことにある。

## 5. State transformation / exact analysisの最終境界

G2-03はstate transformation semanticsとcanonicalizationのformal validationを目指したが、mandatory independent formal-result materializationが成立せず、candidate transformsはformalにvalidatedされなかった。

したがって第二世代を通じて:

```text
validated transform set = []
canonicalization authorized = false
symmetry-reduced state counting authorized = false
RAW state identity = authoritative
```

を維持した。

この保守的境界によって、G2-04とG2-05は未検証symmetry reductionへ依存せずRAW-onlyで進められた。

G2-04ではfresh restricted-endgame domainsのcomplete closureを十分数確保できなかったため`INCONCLUSIVE`となった。一方G2-05ではstandard initial RAW rootからdepth 9までのcomplete bounded enumerationをformalに成立させた。

G2-05のcanonical bounded exact resultは:

```text
complete exact layers = 0..9
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
```

である。

これは第二世代で最も強いexact resultの一つだが、Bao全体のstate-space size、full game-tree size、symmetry-reduced countを意味しない。

## 6. Rich representation / practical structure研究の教訓

G2-06とG2-07では、それぞれrich critical-position representationとpractical comeback / reply-pressure representationを構築した。

両Studyとも科学的計算そのものでは多くのdevelopment structureを得たが、mandatory exact verification / artifact gateでformal promotionを止めた。

- G2-06では4/600 representation rowsのexact mismatchを結果後にfloating-point差として許容しなかった。
- G2-07ではproduction / independent development coreが一致していても、mandatory independent full artifactのmaterialization failureを無視しなかった。

この扱いにより、production-onlyまたはdiagnostic-only evidenceをformal representationとして後続研究へ渡さない境界が維持された。

## 7. Machine decision-failure / tactical generalization

G2-08はmachine decision-failure taxonomyをfresh evidenceで構築しようとしたが、global readiness gateが未達で`NON-ESTIMABLE`となった。局所的なfailure signalをtaxonomyとしてformal promotionしなかった。

G2-09はResearch Generation 1でconfirmedされた`TM-S2-C03`のgeneralization / counterexample boundaryを新しく検証する計画だったが、scientific seed消費前のtechnical tooling smokeで失敗したため`TECHNICAL-INVALID`で閉じた。

したがってResearch Generation 1の`TM-S2-C03 = CONFIRMED`は元のfrozen scopeでのみ保持され、第二世代はその一般化可能性についてformal scientific evidenceを追加していない。

## 8. Strategic-state representationの最終結論

G2-10ではsearch reliability、structural state、reply pressure、decision-failure evidence、tactical structure等を統合する40-feature representationをfresh evidence上で構築し、deterministic K-means `K=2..6`をprospectively評価した。

Scientific readiness、resource gate、production / independent exact verificationはPASSしたが、support / silhouette / five-fold assignment stabilityのfrozen promotion conjunctionを満たすcandidateが0だった。

したがって:

```text
selectedRepresentation = null
```

で閉じた。

この結果を救済せず、Pre-G2-11 `PSRRE-STUDY1`として28-feature・別representation familyをfresh evidenceで独立検証した。しかし今度はcandidate selectionへ入る前のfeature-variation readinessで`15 < 20`となり`NON-ESTIMABLE`で閉じた。

ここから得られるformal conclusionは限定的である。

- Baoにstrategic regimeが存在しないとは言えない。
- K-means以外のrepresentationが無効とは言えない。
- 28/40 feature families自体が無意味とは言えない。
- 現Generationでprospectively検証したcontractから、G2-11へ渡せるeligible frozen representationは得られなかった。

## 9. G2-11を実行せず閉じる理由

G2-11はstrategic-state / regime representationを用いてlong-horizon transition structureを記述する計画だった。

しかしrepresentation inputがformalに成立しないままG2-11を開始すると、次の問題が生じる。

1. outcomeを見ながらrepresentationを選ぶ逆流が発生する。
2. G2-10またはPSRREのnegative / non-estimable closureを事後救済することになる。
3. transition resultの意味がrepresentation choiceに識別不能に依存する。

そのため、追加のrepresentation prerequisite StudyをResearch Generation 2内で繰り返すのではなく、program boundaryとしてG2-11を次のように閉じる。

```text
Formal Study ID = NOT ASSIGNED
Scientific disposition = NON-ESTIMABLE
Execution disposition = NOT-AUTHORIZED-NOT-EXECUTED
Scientific outcome generated = false
```

これはlong-horizon strategic transitionが存在しないというnegative resultではない。**現Generationで要求した入力表現が成立しなかったため、問いをformalに評価できなかった**という結論である。

## 10. Growth estimationの最終境界

G2-12はG2-05 depth 0..9 exact summariesをdevelopment evidenceとして、finite estimator familyからgrowth estimatorを選び、fresh exact depth-10 holdoutで検証する設計だった。

Stage 0 v2はtechnical PASSとなり、Stage 1 production-onlyでは`E2-LOG-QUADRATIC-D2PLUS`がproposalされた。しかしmandatory independent implementationとのprediction differenceが、outcome前に固定したcross-implementation relative tolerance `1e-12`を超えた。

同じdevelopment evidenceのrerun、tolerance relaxation、verifier修正後の再判定を行わず:

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
selectedEstimator = null
fresh depth 10/11 = not generated / not read
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

で閉じた。

したがって第二世代は、bounded exact growthをdepth 9まで測定したが、Bao全体のstate-space / game-tree growth estimatorをformalにvalidatedしていない。

## 11. Human Track

`G2-H01 — Human / Expert Strategic Judgment Study 1`はcore machine programから独立したnon-blocking trackとして定義されていた。

qualified Bao participantへの現実的アクセスを確保できないため、G2-H01は開始しない。machine self-playやsearch failureをhuman misconception / expert judgmentのproxyとしてformal claimへ置き換えない。

この未実施は、program開始時からcore `G2-01..G2-12`のdependencyではないため、Research Generation 2 core closureを妨げない。

## 12. 第二世代で分かったこと

第二世代全体を統合すると、最も確かな知識は「何をどこまで言えるか」というboundaryそのものにある。

### Formalに強く残ったもの

- RAW state identityを基準とする再現可能な研究パイプライン
- standard initial RAW rootからdepth 9までのcomplete exact enumeration
- negative / inconclusive / non-estimable outcomeを結果後に救済しない運用
- productionとindependent verificationを分離するfail-closed research discipline
- researchとpublic AI engineeringの明確な分離

### Formalに成立しなかったもの

- validated transformation / canonicalization
- validated multiaxial strategic-regime representation
- formal long-horizon strategic transition structure
- validated full-game state-space growth estimator
- whole-Bao state-space / game-tree size
- human/expert strategic-judgment claims

これらは「存在しない」と判定されたのではなく、多くの場合**current prospective contractではformal claimへ到達できなかった**。

## 13. Research Generation 2完了条件の監査

Agenda Section 9.9で定義したprogram closure条件と同じ番号・意味で次のように評価する。

1. `G2-01..G2-12`のformal closure: **PASS**。G2-11はdependency-gated agenda-level `NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED`としてclosure。
2. negative / null / inconclusive / non-estimable resultを救済せず保存: **PASS**。
3. Research Generation 1のformal decisionsとinterpretation boundariesを変更していない: **PASS**。
4. research engine / data identity / seed / artifact provenanceを各Studyで再現可能に保存: **PASS**。
5. evaluation / empirical outcome / exact value / search reliability / machine failure / human constructの分離: **PASS**。
6. multiaxial strategic-state representationについてformal decision: **PASS**。G2-10 no eligible frozen representation、PSRRE `NON-ESTIMABLE`。
7. long-horizon transition structureについてformal disposition: **PASS**。G2-11 `NON-ESTIMABLE`、execution not authorized。
8. expanded restricted exact-domain研究とdeeper RAW enumeration closure: **PASS**。
9. state-space / game-tree growth estimationの明確なformal closure: **PASS**。G2-12 `TECHNICAL-INVALID`。
10. 第二世代final synthesis文書: **PASS**。本書。
11. public AI outcomeをscientific successへ読み替えない: **PASS**。

fresh / held-out / identity firewall等のprospective separation、independent verification、fail-closed handlingもprogram governanceとして維持したが、これらはSection 9.9の11項目を置き換えるものではなく、その達成を支える追加的controlである。

したがってResearch Generation 2 core programはformalにclosure可能である。

## 14. 将来への引き継ぎ

第二世代の未成立課題を将来再検討する場合、Research Generation 2のclosed Studyをreopenしない。

新しい研究世代または独立programでは、必要に応じて次を新規prospective questionとして設定できる。

- strategic-state representation familyそのものの再設計
- representation-free long-horizon descriptors
- stronger numerical-equivalence contractを持つgrowth estimation
- deeper exact RAW enumeration
- independent state transformation / canonicalization validation
- qualified human/expert evidence collection

いずれも第二世代のthreshold、seed、population、failureを結果後に修正してpositive resultへ変換するものではない。

## 15. Canonical records

Program-level closureのcanonical recordsは次である。

- `doc/research-generation-2/PROGRAM_FINAL_RESULT.json`
- `doc/research-generation-2/CURRENT_STATUS.md`
- `doc/research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md`
- `doc/research-program-decisions/2026-08-31-research-generation-2-program-closure.md`
- 各G2 StudyのFinal Report / result / reproducibility records

Research Generation 2は、positive resultを最大化するプログラムではなく、**Baoについて再現可能に言えることと言えないことを、結果後の救済なしに切り分けるプログラム**として完了する。
