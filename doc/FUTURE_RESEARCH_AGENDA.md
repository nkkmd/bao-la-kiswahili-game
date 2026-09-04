# Bao今後の研究アジェンダ

Version: 4.0.0

更新日: 2026-09-04
Research Generation 2: **Closed (2026-08-31)**（2026-08-31に完了）
Research Generation 3: **Closed and integrated to `main` (2026-09-04)**（完了・`main`へ統合済み）

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
```

研究結果の索引は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)、第二・第三世代の統合結果はそれぞれ[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)と[`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)を参照してください。

## 2. 今後の優先課題

以下は、現時点で科学的価値が高い候補です。優先順位は固定されたauthorizationではなく、新しいprogramを設計するときの判断材料です。

### 2.1 一般化と反例の境界を新しいStudyとして検証する

Research Generation 3では、G3-04・G3-07・G3-10に限定的なformal resultsが残りましたが、G3-12は`TECHNICAL-INVALID`で閉じたため、別populationへのgeneralizationやcounterexampleのformal decisionはありません。

再検討する場合はG3-12をrepairまたは再開せず、新しいStudy ID、fresh population、fresh seeds、適合するroot contract、結果を見る前に固定したdecision mappingを用います。

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

構造的複雑さ、search workload、decision ambiguity、prediction instabilityは別のconstructです。将来も一つのdifficulty scoreへ安易に統合しません。

### 4.4 手筋・悪手・錯覚

machine-reproducible motifやerror patternは、traditional tesuji、人間の錯覚、教育上の重要性を自動的には意味しません。人間向けの主張には独立したhuman evidenceが必要です。

### 4.5 形勢評価と勝率校正

既存のcalibration Studyは`INCONCLUSIVE`です。engine evaluationをvalidated Bao win probabilityとして表示または研究上のground truthとして使ってはいけません。

### 4.6 限定終盤と必勝圏

frozen 8-state domainではexact solutionが成立しましたが、全Mtaji、全終盤、Bao全体へ一般化できません。拡張する場合はreachable-root contractとresource ceilingを新たに固定します。

### 4.7 逆転可能性と勝負手 — Study 1完了

Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`) complete / Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`（CI互換の固定表現）

`PCEM-STUDY1`は、frozen imperfect-opponent policy下でpractical comebackを測定しました。55 candidate auditsのうちpromotion gateを通過した候補は0件でした。

PCEM-STUDY1はStage 1 `EXPLORATORY-ONLY` / promoted candidate 0で閉じており、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。

これは勝負手の不存在、人間に対する錯誤誘発の否定、game-theoreticな最適性を意味しません。再検討する場合は、new study ID、fresh preregistration、fresh evidenceを用いる。

### 4.8 重要局面と勝敗分岐

高いempirical continuation divergenceを持つrootは観測されましたが、frozen grammarからpromotionされたcandidate classは0件でした。別grammarを試す場合は結果後の救済にせず、独立Studyとして固定します。

### 4.9 状態空間とゲーム木

standard initial RAW rootでは、depth 8・9・10までのbounded exact resultsが世代をまたいで蓄積されました。これらはwhole-Bao sizeではなく、depthごとに限定されたexact resultです。

## 5. 推奨する研究プログラム

次の順序は、将来programを設計する際の一案です。

1. **[完了] Baoを記述する語彙とRAW identityの構築**
2. **[完了] 限定domainにおけるexact analysisと独立検証**
3. **[完了] Local game-tree geometryのbounded measurement**
4. **[候補] 新しいgeneralization / counterexample Study**
5. **[完了] 逆転可能性と勝負手 — Study 1（Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`）**
6. **[候補] Qualified human / expert evidenceの収集**
7. **[候補] 新規authorization下でのdepth 11以深のexact研究**

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
