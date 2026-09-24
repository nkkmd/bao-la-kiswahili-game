# Bao今後の研究アジェンダ

Version: 5.4.0

更新日: 2026-09-24  
Research Generation 2: **Closed (2026-08-31)**（完了）  
Research Generation 3: **Closed and integrated to `main` (2026-09-04)**（完了・統合済み）  
Research Generation 4: **G4-01 complete / G4-02 closed without scientific decision / G4-03 complete**

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
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / NOT YET MAIN INTEGRATED
G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

研究成果の索引は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)、第四世代の最新状態は[`research-generation-4/CURRENT_STATUS.md`](research-generation-4/CURRENT_STATUS.md)を参照してください。

## Research Generation 4 — 現在のProgram

第四世代は、第三世代で測定可能になった局所ゲーム木幾何について、**意味、移送可能性、exact帰結**を検証するProgramです。計画の正本[`research-generation-4/PROGRAM_PLAN.md`](research-generation-4/PROGRAM_PLAN.md)はprospective freezeとして保持し、事後結果に合わせて書き換えません。

| Wave | Agenda | 研究方向 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| B | `G4-05..G4-06` | fresh exact microdomainとgeometry / game-theoretic consequence bridge | `NOT AUTHORIZED` |
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

SC1 DEPTHは4/4 domainsでformal generalization、SC2 NODE-BUDGETはP1の2 domainsでgeneralization・P2の2 domainsはMtaji support不足でnon-estimable、SC3 QUIESCENCEは3/4 domainsでgeneralization・P2×RF2はHolm補正後`NOT-GENERALIZED`でした。

対象associationはfresh domainsへ広く移送されましたが、無条件のuniversal lawではありません。またbest move correctness、game-theoretic value、AI strength、人間のdifficulty、causal mechanismを示す結果ではありません。

詳細は[`local-width-search-ranking-transfer/README.md`](local-width-search-ranking-transfer/README.md)を参照してください。

## 2. 今後の優先課題

以下は科学的価値の高い候補です。優先順位はauthorizationではありません。

### 2.1 G4-04 — geometry-trajectory transfer

次のcore candidateはG4-04です。G3-10で限定的にformal resultを得たgeometry-conditioned longitudinal dynamicsを、G4-01でcompatibility確認済みのfresh source policy / root familyへどこまで移せるかを検証します。

開始する場合は、G4-03と同様に別Studyとしてauthorization reviewから始めます。fresh population、fresh seed namespace、claim、endpoint、selection、multiple-testing、resource ceiling、execution environment、no-rescue ruleを結果を見る前に固定します。

G4-01のcompatibility eligibilityだけで自動的にscientific executionを開始しません。

### 2.2 一般化と反例の境界

G3-12は`TECHNICAL-INVALID`で閉じ、G4-02もscientific decisionなしで終了しました。一方、G4-03ではfresh transfer domainにおけるpositive generalizationが多数確認されました。

今後一般化境界を追加検証する場合も、closed Studyのrepair/reopenやsame-evidence rescueではなく、新しいprospective Study identityを用います。`NOT-GENERALIZED`、`NON-ESTIMABLE`、`COUNTEREXAMPLE-CONFIRMED`を相互に読み替えません。

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

G4-03のsearch-ranking resultも公開AIの棋力改善を直接示すものではありません。

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

### 4.3 局面複雑度と探索の不安定性

局面複雑度、local width、search instabilityの間には限定domainでformalな関係が確認された例がありますが、それらを単一の普遍的difficulty指標とは扱いません。

G4-03はroot legal widthとranking-preorder changeのassociationがfresh domainsへ広く移ることを示しました。一方でnon-estimable domainとnot-generalized domainも存在したため、今後はphase、source policy、root family、search contrastを明示したprospective validationを続ける価値があります。
