# Bao今後の研究アジェンダ

Version: 5.6.0

更新日: 2026-09-25  
Research Generation 2: **Closed (2026-08-31)**（完了）  
Research Generation 3: **Closed and integrated to `main` (2026-09-04)**（完了・統合済み）  
Research Generation 4: **G4-01 complete / G4-02 closed without scientific decision / G4-03 complete / G4-04 complete / G4-05 complete**

この文書は、完了した研究を短く振り返りながら、次に研究する価値のある問いを整理するためのものです。候補として記載しただけでは、Study開始、seedアクセス、計算実行、公開AI変更は承認されません。

## 1. 現在地

Baoについて限定された条件で再現可能に述べられる事実は増えましたが、全状態空間、全ゲーム木、普遍的な戦略類型、人間の難しさ、game-theoreticな最適性は確立していません。

```text
authoritative scientific state identity = RAW
validated transform set = []
whole-Bao state-space / game-tree size = NOT ESTABLISHED
validated Bao win-probability mapping = NOT ESTABLISHED
human difficulty / expert-judgment law = NOT ESTABLISHED
Research Generation 2 core = CLOSED
Research Generation 3 core = CLOSED
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN NOT INTEGRATED
G4-06 = NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

研究成果の索引は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)、第二・第三世代の統合結果はそれぞれ[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)と[`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)、第四世代の最新状態は[`research-generation-4/CURRENT_STATUS.md`](research-generation-4/CURRENT_STATUS.md)を参照してください。

## Research Generation 4 — 現在のProgram

第四世代は、第三世代で測定可能になった局所ゲーム木幾何について、**意味、移送可能性、exact帰結**を検証するProgramです。計画の正本[`research-generation-4/PROGRAM_PLAN.md`](research-generation-4/PROGRAM_PLAN.md)はprospective freezeとして保持し、事後結果に合わせて書き換えません。

| Wave | Agenda | 研究方向 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| B | `G4-05` | fresh exact microdomain oracle foundation | `COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN NOT INTEGRATED` |
| B | `G4-06` | geometry / game-theoretic consequence bridge | `NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT AUTHORIZED` |
| C | `G4-07..G4-09` | multiscale memory、rule-semantic transition、search reliability | `NOT AUTHORIZED` |
| D | `G4-10` | protected fresh depth-11 exact reachability topology | `PROTECTED / NOT AUTHORIZED` |
| 独立 | `G4-P01`、`G4-H01` | canonicalization再基礎化とhuman / expert研究 | `NOT AUTHORIZED / DEFERRED` |

### G4-01

`LGTTCI-STUDY1`でSFCDF・SILGM・GCLDの3 familyについてfresh-domain researchを行うcompatibility/readiness条件を確認し、`COMPATIBILITY-ELIGIBLE-ALL`で完了しました。これはgeneralizationそのものの確認ではありません。

### G4-02

G3-04由来C1/C6のtransferをStudy 1〜4としてprospectiveに実施しましたが、formal Stage 2 measurement前のtechnical failureで終了し、正式状態は`CLOSED / NO SCIENTIFIC DECISION`です。このtechnical closureをgeneralization失敗やcounterexampleのnegative scientific evidenceへ読み替えません。

### G4-03

G3-07でformal confirmationされたroot legal width HIGH stratumとranking-preorder changeのassociationを、fresh source-policy × root-family domainsへ移送検証しました。

```text
Stage 2 canonical run = 35993172710 / attempt 1 / success
fresh formal seeds = 40322001..40323536 / 1536 / exactly once
selected roots = 192 / 192
production / independent exact = true
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

対象associationはfresh domainsへ広く移送されましたが、無条件のuniversal lawではありません。またbest move correctness、game-theoretic value、AI strength、人間のdifficulty、causal mechanismを示す結果ではありません。

詳細は[`local-width-search-ranking-transfer/README.md`](local-width-search-ranking-transfer/README.md)を参照してください。

### G4-04

G3-10でformal confirmationされたC1・C2・C3・C5のtrajectory-level directionを、fresh P1/P2 source-policy domainsへprospectiveに移送検証しました。

```text
Stage 2 canonical run = 36095831961 / attempt 1 / success
fresh seed block = 40423001..40424024 / 1024
seed reads = 369
formal measured trajectories = 64
production / independent exact = true
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

C1・C2・C5はP1/P2ともpositive direction、C3はP1/P2ともnegative directionでG3-10と一致し、8/8 formal testsすべて`GENERALIZATION-CONFIRMED`でした。

この結果は本StudyのP1/P2 full-trajectory domainsに限定されます。RF1/RF2はsupport descriptorのみでformal subgroup inferenceを行っていません。whole-Bao universal law、game-theoretic value、best move correctness、AI strength、人間のdifficultyを示す結果でもありません。

G4-04はPR #165で`main`へ統合済みです。formal result、one-shot/no-rescue boundary、public AI非変更は統合後も変わりません。

詳細は[`geometry-trajectory-dynamics-transfer/README.md`](geometry-trajectory-dynamics-transfer/README.md)を参照してください。

### G4-05

G4-05 `RLEMOF-STUDY1` は、fresh reachable late-game rootsからoutcome-blind / resource-feasibility-onlyに限定microdomainを選択し、complete legal-transition closureとproduction / independent exact solver agreementをprospectiveに検証しました。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-ACCEPTED
Stage 2 canonical run = 36120286922 / attempt 1 / success
fresh seed block = 40523001..40524024 / 1024 games / maxPly 320
Stage 1 RAW identity firewall roots = 8307
fresh RAW overlap excluded count = 0
eligible candidates = 21
inspected candidates = 10
formal complete domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
```

candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのままfail-closedしました。resource cap増加、root replacement、seed extension、same-evidence rerunは行っていません。

8 formal domainsではexact graph / solution / root resultまで独立一致しました。8 domainのrecurrent countは0でしたが、`RECURRENT`は公式ルール上の`DRAW`ではなく、draw inferenceは認可していません。whole-Bao solution、arbitrary late-game generalization、AI strength、人間のdifficulty、public AI変更も主張しません。

Program Plan上、G4-06はG4-05がformal-eligible exact oracle domainを生成した場合だけ実行候補になります。G4-05はこのdependencyを満たしたため、G4-06を次の個別authorization review候補として扱えます。

G4-05はresearch branch上でclosure済みですが、`main`統合は未実施です。

詳細は[`reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md)を参照してください。

## 2. 今後の優先課題

以下は科学的価値の高い候補です。優先順位はauthorizationではありません。

### 2.1 G4-06 — geometry / exact game-theoretic consequence bridge

次のcore candidateはG4-06です。G4-05で成立したformal exact oracle domainを基盤として、bounded local geometryとexact game-theoretic consequenceの関係をprospectiveに検証する候補です。

G4-05の結果はG4-06のdependencyを満たしますが、G4-06そのものを自動authorizationしません。開始する場合は新しいStudyとしてauthorization reviewから始め、geometry claim / endpoint mapping、exact-domain inheritance、identity firewall、formal population、decision rule、resource ceiling、independent verification、no-rescue / no-rerun ruleをfresh evidence access前に固定します。

G4-05の8 formal domainsを結果後に都合のよいgeometry patternへ合わせて選び直したり、engine evaluation・自己対局勝率・deeper searchをexact valueの代替にしたりしません。限定microdomain内の関係をwhole-Bao optimalityへ一般化しません。

### 2.2 一般化と反例の境界

G3-12は`TECHNICAL-INVALID`で閉じ、G4-02もscientific decisionなしで終了しました。一方、G4-03ではfresh transfer domainにおけるpositive generalizationが多数確認され、G4-04ではprospectively frozen P1/P2 domainsで8/8 formal testsが`GENERALIZATION-CONFIRMED`となりました。

今後一般化境界を追加検証する場合も、closed Studyのrepair/reopenやsame-evidence rescueではなく、新しいprospective Study identityを用います。G4-04の8/8をRF1/RF2 subgroupや任意source policy、whole-Bao universal lawへ拡張しません。

### 2.3 depth 11以深を扱うexact研究

G3-11はstandard initial RAW rootのdepth 10を一度だけ完全列挙しました。depth 11は未承認・未アクセスです。

新しい研究では必要資源、停止条件、partial resultの扱い、独立再列挙方法を事前固定します。depth 10のsame-evidence rerunや、depth 0〜10からの事後的whole-game extrapolationは行いません。

### 2.4 state representationとlong-horizon transition

G2-10と`PSRRE-STUDY1`からG2-11へ渡せるeligible frozen strategic representationは得られませんでした。第三世代で成立したresource-bounded local geometry representationもstrategic regimeそのものではありません。

representation-free descriptor、別のprospective representation family、または限定したlongitudinal questionを新規Studyとして設計できます。

### 2.5 RAW identityを保ったcanonicalization検証

validated transform setは現在も空です。visual symmetryや便宜的なstate compressionをformal validationなしにscientific identityへ導入しません。

terminal stateを含むfull identity fields、move equivariance、winner / pending semantics、independent reconstructionを事前固定した新規Studyとして扱います。

### 2.6 人間・熟練者による判断研究

過去のhuman trackはqualified participantへの現実的アクセスを確保できずdeferしました。`N=0`は人間に関するnegative evidenceではありません。

実施する場合は参加資格、recruitment、minimum N、説明・同意、匿名化、分析計画を回答収集前に固定します。machine geometryやsearch instabilityをhuman difficultyの代用にしません。

### 2.7 評価・探索・実戦性の再検証

評価値、empirical outcome、search reliability、practical comebackはそれぞれ異なるendpointです。将来の研究でも単一の「強さ」へまとめず、測定対象とpopulationを明示します。

G4-03のsearch-ranking resultも、G4-04のtrajectory-transfer resultも、G4-05のexact microdomain resultも、公開AIの棋力改善を直接示すものではありません。

## 3. 新しいStudyに共通する必須条件

結果を見る前に少なくとも次を固定します。

1. Study ID、科学的問い、対象population
2. RAW identityを含むデータ同一性
3. development / formal / holdoutの分離
4. seed block、使用回数、アクセス条件
5. endpoint、threshold、multiple-testing rule
6. estimability・resource・verification gate
7. technical failureとscientific resultの区別
8. stopping ruleとno-rescue rule
9. productionと独立実装の役割
10. 人間・因果・game-theoretic claimの禁止境界

`INCONCLUSIVE`、`NON-ESTIMABLE`、`NOT-CONFIRMED`、`NOT-GENERALIZED`、`TECHNICAL-INVALID`、`NOT-AUTHORIZED-NOT-EXECUTED`は互いに置き換えません。

## 4. Research Generation 1から残る研究課題

第一世代では、局面類型、戦術、評価、限定終盤、状態空間を記述する語彙と検証手順を構築しました。各結果の詳細は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)を参照してください。

### 4.1 局面の相転移点

`capture-branch-expansion`は限定されたmachine scopeで確認されています。別の探索条件、phase、root familyへ広げる場合は新しいprospective replicationが必要です。

### 4.2 局面類型と棋風

Mtajiではbounded two-type morphologyが確認されましたが、普遍的なBao局面分類や人間の棋風分類は確立していません。別representationを用いる場合は新規Studyとして扱います。

### 4.3 局面複雑度・探索不安定性・trajectory dynamics

局面複雑度、local width、search instability、continuous geometry trajectoryは別constructです。限定domainでformalな関係やdirectionが確認された例がありますが、それらを単一の普遍的difficulty指標とは扱いません。

G4-03はroot legal widthとranking-preorder changeのassociationがfresh domainsへ広く移ることを示しました。G4-04はG3-10由来C1/C2/C3/C5 directionがfresh P1/P2 domainsへ8/8で移送されることを確認しました。ただし、いずれも固定domain外へ無条件に一般化しません。

### 4.4 手筋・悪手・錯覚

machine-reproducible motifやerror patternは、traditional tesuji、人間の錯覚、教育上の重要性を自動的には意味しません。人間向けの主張には独立したhuman evidenceが必要です。

### 4.5 形勢評価と勝率校正

既存のcalibration Studyは`INCONCLUSIVE`です。engine evaluationをvalidated Bao win probabilityとして表示または研究上のground truthとして使ってはいけません。

### 4.6 限定終盤と必勝圏

frozen 8-state domainではexact solutionが成立し、G4-05ではfresh reachable late-game rootsから8 complete formal microdomainsを構築して独立exact agreementを確認しました。それでも全Mtaji、全終盤、Bao全体へ一般化できません。

G4-05のformal decisionは`EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`です。これをwhole-Bao solution、DRAW分布、arbitrary root optimalityへ拡張しません。

### 4.7 逆転可能性と勝負手 — Study 1完了

Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`) complete / Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`（CI互換の固定表現）

`PCEM-STUDY1`は、frozen imperfect-opponent policy下でpractical comebackを測定しました。55 candidate auditsのうちpromotion gateを通過した候補は0件でした。

PCEM-STUDY1はStage 1 `EXPLORATORY-ONLY` / promoted candidate 0で閉じており、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。

これは勝負手の不存在、人間に対する錯誤誘発の否定、game-theoreticな最適性を意味しません。再検討する場合は、new study ID、fresh preregistration、fresh evidenceを用いる。

### 4.8 重要局面と勝敗分岐

高いempirical continuation divergenceを持つrootは観測されましたが、frozen grammarからpromotionされたcandidate classは0件でした。別grammarを試す場合は結果後の救済にせず、独立Studyとして固定します。

### 4.9 状態空間とゲーム木

standard initial RAW rootでは、depth 8・9・10までのbounded exact resultsが世代をまたいで蓄積されました。Study 1の正式判断は`SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`で、depth 0〜8のreachable RAW statesは24,848、tree node occurrencesは30,941です。これらはwhole-Bao sizeではなく、depthごとに限定されたexact resultです。

## 5. 推奨する研究プログラム

次の順序は、将来programを設計する際の一案です。

1. **[完了] Baoを記述する語彙とRAW identityの構築**
2. **[完了] 限定domainにおけるexact analysisと独立検証**
3. **[完了] Local game-tree geometryのbounded measurement**
4. **[進行] Research Generation 4 — G4-01/G4-03/G4-04/G4-05完了。G4-02は科学的判定なしで終了。次候補はG4-06 geometry / exact consequence bridge**
5. **[完了] 逆転可能性と勝負手 — Study 1（Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`）**
6. **[独立・未承認] G4-H01によるqualified human / expert evidenceの収集**
7. **[計画済み・未承認] G4-10によるfresh depth-11 exact研究**

## 6. 研究と公開AI改善の分離

研究の目的は、Baoについて再現可能に言えることと、まだ言えないことを明確にすることです。公開AIの目的は、品質・安全性・計算コスト・後方互換性を満たす変更を選ぶことです。

そのため、次を維持します。

- public AIの棋力、対局勝率、応答速度、ユーザー体験、deployment成否を研究endpointにしない。
- research resultだけを根拠に公開AIの候補を自動採用しない。
- engineering benchmarkの改善をscientific confirmationへ読み替えない。
- 公開AIの履歴は[`AI_ENGINEERING_INDEX.md`](AI_ENGINEERING_INDEX.md)で管理する。

## 7. 完了の定義

研究programの完了は、positive resultの数では決めません。各問いに対して、formal result、`NOT-CONFIRMED`、`INCONCLUSIVE`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`、dependency-gated closureのいずれかを、根拠と境界を保ったまま記録できたときに完了とします。

## 8. 新しい世代を始める前の確認

- 既存世代のclosed Studyをrepairやreopenとして扱っていないか
- fresh evidenceと既使用evidenceを分離できているか
- protected holdoutへのアクセスが明示的に承認されているか
- 実行資源とindependent verificationが現実的か
- current-facing文書とmachine-readable artifactが一致しているか
- [`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を満たすか

## 9. 第二世代研究アジェンダ

### 9.1 位置づけ

第二世代は純粋な研究プログラムとして完結させる。core `G2-01..G2-12`は2026-08-31に閉じ、すべてのformal dispositionを`main`へ統合しました。

以下の`G2-xx`はAgenda上の順序ラベルであり、正式Study IDではないものを含みます。正式IDと最終結果は各Studyのcanonical recordを優先します。

G2-04はG2-03の成功を前提としない。G2-03でvalidated transformを得られなくても、G2-04はRAW identityを用いる独立研究として実行できる設計でした。

### 9.2 Wave A — 測定とexact基盤

#### G2-01 — Position Evaluation / Empirical Outcome Calibration Replication Study 1 — 最終状態

`PEOCR-STUDY1`は`INCONCLUSIVE`。strict identity firewall後のestimability gateが未達で、validated win-probability mappingは得られませんでした。

#### G2-02 — Search Reliability / Decision Robustness Study 1 — 最終状態

`SRDR-STUDY1`は`INCONCLUSIVE`。formal population gate未達のためprimary criterionを評価していません。

#### G2-03 — State Transformation Semantics / Canonicalization Validation Study 1 — 最終状態

`STSCV-STUDY1`は`INCONCLUSIVE`、candidate outcomesは`NON-ESTIMABLE`。validated transform setは`[]`です。

#### G2-04 — Restricted Endgame Exact Oracle Expansion Study 1 — 最終状態

`REEOE-STUDY1`は`INCONCLUSIVE`。fresh selected rootsで必要なcomplete closure数を満たさず、Stage 2は未承認です。

#### G2-05 — Deep RAW State-Space Enumeration Study 1 — 最終状態

**状態:** **完了 / `DRSSE-STUDY1` / formal decision `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

standard initial RAW rootからdepth 0〜9を完全列挙し、cumulative RAW states 102857を得ました。本Studyは**bounded exact enumerationだけ**を扱い、full-game growth estimationを同一Study内で結果後に追加しない。

### 9.3 Wave B — 戦略表現

#### G2-06 — Rich Critical-Position Representation Study 1 — 最終状態

`RCPR-STUDY1`は`STAGE1-TECHNICAL-INVALID`。exact representation equality gateのfailure後にsame-block rerunを行っていません。

#### G2-07 — Practical Comeback / Reply-Pressure Representation Study 1 — 最終状態

`PCRPR-STUDY1`は`STAGE1-TECHNICAL-INVALID`。mandatory independent full artifactが成立せず、Stage 2は未承認です。

#### G2-08 — Machine Decision-Failure Taxonomy Study 1 — 最終状態

`MDFT-STUDY1`は`NON-ESTIMABLE`。global readiness gate未達のためtaxonomyをformal promotionしていません。

#### G2-09 — Tactical Motif Generalization / Counterexample Study 1 — 最終状態

`TMGC-STUDY1`は`TECHNICAL-INVALID`。scientific seed消費前にtechnical tooling gateで停止し、formal generalization evidenceはありません。

### 9.4 Wave C — 統合と理論

#### G2-10 — Unified Multiaxial Strategic State Representation Study 1 — 最終状態

`UMSSR-STUDY1`はeligible frozen representationを生成せず、`selectedRepresentation = null`。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`です。

#### G2-11 — Long-Horizon Strategic Transition Structure Study 1 — 最終状態

G2-10と独立前提Study `PSRRE-STUDY1`から必要なrepresentationが得られなかったため、正式Study IDを付与せず、scientific disposition `NON-ESTIMABLE`、execution `NOT-AUTHORIZED-NOT-EXECUTED`として閉じました。long-horizon transitionが存在しないという結果ではありません。

#### G2-12 — State-Space / Game-Tree Growth Estimation Study 1 — 最終状態

`SSGTGE-STUDY1`は`TECHNICAL-INVALID`。canonical `selectedEstimator = null`で、fresh depth 10/11は生成・読取とも行っていません。

### 9.5 人間研究 — core machine programから独立

#### G2-H01 — Human / Expert Strategic Judgment Study 1 — 最終状態

qualified participantへのアクセスを確保できず、`DEFERRED / INDEPENDENT / NON-BLOCKING`です。`N=0`をnegative human evidenceとして扱いません。

### 9.6 第二世代の最終境界

第二世代ではRAW identity、fresh evidence、independent verification、fail-closed、no-rescueを維持しました。Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`)も完了した。

第二世代の正本は[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)です。

## 10. 第三世代研究アジェンダ

第三世代 `G3-01..G3-12`は2026-09-04に完了し、`main`へ統合済みです。RAW-only bounded local game-tree geometryを中心に、測定器、branch / reply structure、tree / graph divergence、corridor / funnel、search instability、continuous representation、longitudinal dynamics、protected depth-10 exact holdout、generalization境界を検討しました。

### 10.1 世代全体の最終状態

| 区分 | 最終状態 |
| --- | --- |
| G3-04 | C1・C6が`CONFIRMED` |
| G3-07 | 3件`CONFIRMED`、4件`NOT-CONFIRMED`、1件`NON-ESTIMABLE` |
| G3-10 | C1・C2・C3・C5が`CONFIRMED`、C4が`NOT-CONFIRMED` |
| G3-11 | depth-10 exact、H1〜H4 `DEEPER-CONFIRMED` |
| G3-01・02・03・05・06・08・09・12 | `TECHNICAL-INVALID` |
| G3-H01 | `DEFERRED / INDEPENDENT / NON-BLOCKING` |

### 10.2 何が分かり、何が未確定か

限定されたpopulationとrelative depth 5の範囲では、local corridor / tree-graph structure、local widthとsearch-output changeの関連、continuous geometry trajectoryの一部、depth 10でのexact continuationが確認されました。

一方、これらはwhole-Bao law、causal mechanism、game-theoretic value、人間の難しさ、普遍的なgeneralizationを示しません。G3-12がtechnical-invalidで閉じたため、formalなgeneralization / counterexample decisionもありません。

### 10.3 保護された証拠と今後の扱い

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G3-12 Stage 2 = NOT AUTHORIZED / NOT EXECUTED / seeds UNREAD
```

後続研究は第三世代のrepairではなく、新しいprospective Studyまたは新しいResearch Generationとして計画します。詳細は[`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)を参照してください。
