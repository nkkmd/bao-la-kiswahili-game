# Bao今後の研究アジェンダ

Version: 5.2.0

更新日: 2026-09-18
Research Generation 2: **Closed (2026-08-31)**（2026-08-31に完了）
Research Generation 3: **Closed and integrated to `main` (2026-09-04)**（完了・`main`へ統合済み）
Research Generation 4: **Program plan frozen / G4-01 complete / G4-02 SFCDFT-STUDY1 Stage 1 technical-invalid (2026-09-18)**（G4-01完了・G4-02 Stage 1は技術的不成立）

この文書は、完了した研究を短く振り返りながら、次に研究する価値のある問いを整理するためのものです。ここに候補として記載しただけでは、Studyの開始、seedへのアクセス、計算実行、公開AIの変更は承認されません。

## 1. 現在地

これまでの研究から、Baoについて限定された条件で再現可能に述べられる事実は増えました。一方で、全状態空間、全ゲーム木、普遍的な戦略類型、人間の難しさ、game-theoreticな最適性は確立していません。

現在の重要な境界は次のとおりです。

```text
authoritative scientific state identity = RAW
validated transform set = []
whole-Bao state-space / game-tree size = NOT ESTABLISHED
validated Bao win-probability mapping = NOT ESTABLISHED
human difficulty / expert-judgment law = NOT ESTABLISHED
Research Generation 2 core = CLOSED
Research Generation 3 core = CLOSED
Research Generation 4 program plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = SFCDFT-STUDY1 STAGE 1 TECHNICAL-INVALID / NO-DECISION
G4-02 Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-03 / G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

研究結果の索引は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)、第二・第三世代の統合結果はそれぞれ[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)と[`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)、第四世代の現在状態は[`research-generation-4/CURRENT_STATUS.md`](research-generation-4/CURRENT_STATUS.md)を参照してください。

## Research Generation 4 — 実行開始済みの次世代Program

第四世代は、第三世代で測定可能になった局所ゲーム木幾何について、**意味、移送可能性、exact帰結**を検証するProgramとして計画を固定しました。計画の正本は[`research-generation-4/PROGRAM_PLAN.md`](research-generation-4/PROGRAM_PLAN.md)であり、事後結果に合わせて書き換えません。

| Wave | Agenda | 研究方向 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `SFCDFT-STUDY1 STAGE 1 TECHNICAL-INVALID / NO-DECISION` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| B | `G4-05..G4-06` | fresh exact microdomainとgeometry / game-theoretic consequence bridge | `NOT AUTHORIZED` |
| C | `G4-07..G4-09` | multiscale memory、rule-semantic transition、search reliability | `NOT AUTHORIZED` |
| D | `G4-10` | protected fresh depth-11 exact reachability topology | `PROTECTED / NOT AUTHORIZED` |
| 独立 | `G4-P01`、`G4-H01` | canonicalization再基礎化とhuman / expert研究。coreを阻害しない | `NOT AUTHORIZED / DEFERRED` |

G4-01 `LGTTCI-STUDY1`は、SFCDF・SILGM・GCLDの3 familyについてfresh-domain transfer研究を行うためのcompatibility/readiness条件を検証し、`COMPATIBILITY-ELIGIBLE-ALL`で完了しました。これはG3由来claimのfresh-domain一般化、effect direction、counterexampleの成立／不成立を示す結果ではありません。

G4-02では、initial authorization reviewの`PREREQUISITE-REQUIRED`を、旧G4-01 seedを再読・rerunせずにlegacy limitationを明示したmethodology amendmentとidentity-only firewallで解消しました。authorization review V2で正式Study `SFCDFT-STUDY1`のprospective設計が承認され、Stage 0は`PASS`しました。

その後、別のpre-access binding / execution authorizationを通してStage 1 fresh compatibility populationを一度だけ実行しました。primary 384 slotsのうち375件はsealed sourceとなりましたが、9件がmandatory first-16 opening-prefix serializer invariantを満たせずdeterministic failureとなりました。frozen protocolのdecision mappingを適用し、Stage 1を`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`として閉じました。

375件を用いたseed-free recovery、primary rerun、failed-slot repair、paired reserveによる置換は行っていません。Stage 2も未認可・未アクセスで、seed readsは0です。したがってG4-02からgeneralization / counterexampleについてpositive/negativeいずれの科学的updateも得ていません。

G4-03、G4-04を進める場合は引き続き個別authorization reviewが必要です。各Studyのfresh evidence、formal claim、population、endpoint、selection rule、resource ceilingは結果を見る前に固定します。G3-12のrepair、G3-12 Stage 2 seedの流用、G3-11 depth 10の再実行、authorization前のdepth 11 accessは行いません。

## 2. 今後の優先課題

以下は、現時点で科学的価値が高い候補です。優先順位は固定されたauthorizationではなく、新しいprogramを設計するときの判断材料です。

### 2.1 一般化と反例の境界を新しいStudyとして検証する

Research Generation 3では、G3-04・G3-07・G3-10に限定的なformal resultsが残りましたが、G3-12は`TECHNICAL-INVALID`で閉じたため、別populationへのgeneralizationやcounterexampleのformal decisionはありません。

G4-01では、これら3 familyについて後続のfresh-domain transfer研究を設計・実施するためのcompatibility/readiness条件が満たされることを確認しました。ただし、generalizationそのものは検証していません。

G4-02では`SFCDFT-STUDY1`をprospectiveに開始しましたが、Stage 1 serializer integrity violationによって`TECHNICAL-INVALID / NO-DECISION`で閉じました。このtechnical failureをC1/C6の一般化失敗や反例として扱ってはいけません。

G4-02の同じ科学課題を再検証する場合は`SFCDFT-STUDY1`をrepair/reopenせず、今回のfailureをtechnical development informationとして扱います。新しいStudy / Stage identity、新しいfresh seed namespace、short trajectoryを明示的に扱うserializer contract、prior G4-02 populationを除外するfreshness firewallを結果前に固定し、新しいauthorization reviewから開始します。

G4-03またはG4-04へ進む場合も、それぞれ新しいStudyとしてauthorization reviewから開始し、G3-12をrepairまたは再開せず、fresh population、fresh seeds、適合するroot contract、結果を見る前に固定したdecision mappingを用います。

### 2.2 depth 11以深を扱うexact研究

G3-11はstandard initial RAW rootのdepth 10を一度だけ完全列挙し、H1〜H4を`DEEPER-CONFIRMED`としました。depth 11は未承認・未アクセスです。

新しい研究では、必要資源、停止条件、partial resultの扱い、独立再列挙の方法を事前に固定する必要があります。depth 10のsame-evidence rerunや、depth 0〜10からの事後的なwhole-game extrapolationは行いません。

### 2.3 state representationとlong-horizon transition

G2-10と`PSRRE-STUDY1`からG2-11へ渡せるeligible frozen strategic representationは得られませんでした。第三世代ではresource-bounded local geometry representationが成立しましたが、これはstrategic regimeそのものではありません。

今後は、representation-free descriptor、別のprospective representation family、または明示的に限定したlongitudinal questionを新規Studyとして設計できます。過去のthreshold、feature set、seedを結果後に調整して再判定してはいけません。

### 2.4 RAW identityを保ったcanonicalization検証

validated transform setは現在も空です。visual symmetryや便宜的なstate compressionを、formal validationなしにscientific identityへ導入してはいけません。

新しい検証では、terminal stateを含むfull identity fields、move equivariance、winner / pending semantics、independent reconstructionを事前に固定し、失敗した既存Studyの救済とは分離します。

### 2.5 人間・熟練者による判断研究

過去のhuman trackは、qualified participantへの現実的なアクセスが確保できず、machine-only coreを妨げない形でdeferされました。`N=0`は人間に関するnegative evidenceではありません。

実施する場合は、参加資格、recruitment経路、minimum N、説明文、同意、匿名化、分析計画を回答収集前に固定します。machine geometryやsearch instabilityを人間の難しさの代用にしません。

### 2.6 評価・探索・実戦性の再検証

評価値、empirical outcome、search reliability、practical comebackは、過去のStudyでそれぞれ別の境界を持ちます。将来の研究でもこれらを単一の「強さ」へまとめず、測定対象とpopulationを明示します。

## 3. 新しいStudyに共通する必須条件

新しいStudyは、結果を見る前に少なくとも次を固定します。

1. Study ID、科学的な問い、対象population
2. RAW identityを含むデータ同一性
3. development / formal / holdoutの分離
4. seed block、使用回数、アクセス条件
5. endpoint、threshold、multiple-testing rule
6. estimability・resource・verification gate
7. technical failureとscientific resultの区別
8. stopping ruleとno-rescue rule
9. productionと独立実装の役割
10. 人間・因果・game-theoretic claimの禁止境界

`INCONCLUSIVE`、`NON-ESTIMABLE`、`NOT-CONFIRMED`、`TECHNICAL-INVALID`、`NOT-AUTHORIZED-NOT-EXECUTED`は互いに置き換えません。

## 4. Research Generation 1から残る研究課題

第一世代では、局面類型、戦術、評価、限定終盤、状態空間を記述する語彙と検証手順を構築しました。各結果の詳細は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)を参照してください。

### 4.1 局面の相転移点

`capture-branch-expansion`は限定されたmachine scopeで確認されています。別の探索条件、phase、root familyへ広げる場合は、新しいprospective replicationが必要です。

### 4.2 局面類型と棋風

Mtajiではbounded two-type morphologyが確認されましたが、普遍的なBao局面分類や人間の棋風分類は確立していません。別representationを用いる場合は、既存結果と混同しない新規Studyとして扱います。

### 4.3 局面複雑度と探索の不安定性