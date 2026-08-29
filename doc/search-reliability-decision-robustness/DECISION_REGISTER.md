# SRDR-STUDY1 — 判断台帳

## D-001 — Study identity

日付: 2026-08-27

`G2-02`をResearch Generation 2の新しい独立Studyとして開始しました。

```text
Formal title = Search Reliability / Decision Robustness Study 1
Study ID = SRDR-STUDY1
Japanese working title = Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証
```

`G2-02`はAgenda上の順序labelであり、正式なStudy IDではありません。

## D-002 — baselineとbranch

```text
Study-start remote main = db6980bffb7e6853751914da628db8936c76d81e
Prior expected main = db6980bffb7e6853751914da628db8936c76d81e
Match = true
Research branch = research/g2-02-search-reliability-decision-robustness
Open PRs at start = 0
```

残存していたG2-01 branchは`main`よりbehindでahead commitはなく、競合するactive research branchではありませんでした。

## D-003 — Research Generation 2内での位置づけ

`SRDR-STUDY1`はWave A / P0 `G2-02` measurement-foundation Studyです。G2-01とは独立しており、Research Generation 2の後続研究でsearch-reliability情報を利用する場合の前段研究として位置づけます。

## D-004 — upstreamの変更しない判断

次の判断は変更しません。

```text
PEOCR-STUDY1 = INCONCLUSIVE
Position Complexity / Difficulty Study 1 overall = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

G2-01 dataとPosition Complexityのscientific rowをG2-02 formal evidenceとして使用することは禁止します。既存instrumentとfailure modeはtechnical designとresource planningにのみ利用できます。

## D-005 — primary constructの境界

Primary construct:

```text
machine search reliability / decision robustness
under prospectively frozen search-condition perturbations
```

これはhuman difficulty、structural complexity、empirical win probability、game-theoretic value、engine evaluation correctness、public-AI strength、human perceptionと同一ではありません。

higher-resource conditionは`frozen search reference`にすぎず、true optimal playのoracleとは扱いません。

## D-006 — RAW state identity

Formal identityは次です。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` / `reason`は除外します。formal deduplicationではsymmetry reduction、reflection equivalence、player-seat canonicalization、state canonicalization、未検証isomorphismを禁止します。

## D-007 — Stage構成

Study開始時に次を固定しました。

```text
SRDR-S0-TECHNICAL-2026-08-27-v1
SRDR-S1-DEVELOPMENT-2026-08-27-v1
SRDR-S2-FORMAL-2026-08-27-v1
```

Stage 0はtechnical / non-scientific、Stage 1はfresh development / construct characterizationで、観察後は消費済みとします。Stage 2はfresh held-out formal replicationです。

## D-008 — Stage 0 technical spec

Stage 0 machine-readable specは次で固定しました。

```text
preregistration/STAGE_0_TECHNICAL_SPEC.json
SHA-256 = 12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificSeedUseAllowed = false
```

## D-009 — candidate search axes

Stage 0ではdepth、node budget、quiescence、move ordering、PV extractionを、利用可能なpublic-search controlとともに技術評価しました。

科学的sensitivity axisとして結果を見る前にpromoteしたのはdepth、node budget、quiescenceです。制限のないfactorial gridは承認していません。

## D-010 — implementation boundary

Public `AI.analyzeMove()`が基礎となるengine / search / evaluator behaviorを提供します。deterministic node-budget semanticsとPV extractionは研究instrumentationです。

Formal G2-02ではdeeper / higher-budget searchをtruthとして解釈しません。

## D-011 — move / tie / ranking / PV規則

Scientific ruleは次で固定しました。

```text
move identity = exact AI.moveKey
scientific move ordering = lexical canonical
score tie tolerance = 0
TopSet = all exact maximum-score legal moves
canonical best = lexical minimum member of TopSet
Top-k = k=3 or all moves if fewer than 3
ranking ties = exact-score ties with average ranks for correlation
PV = canonical-exact-nominal-pv/quiescence-score-only/v1
```

結果に応じたtie toleranceやTopSetの変更は承認しません。

## D-012 — population / firewall原則

Fresh historically reachable RAW statesを必要とします。selectionはsearch-reliability outcomeを参照せず行います。

historical trajectoryあたり最大1 stateを選択し、その後RAW-state deduplicationを行います。Stage 1 scientific unitは観察後に消費済みとなり、Stage 2 formal evidenceとして再利用できません。

## D-013 — formal decision taxonomy

Study-level taxonomyは次で固定しました。

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE
```

technical execution failureはscientific failureではなく、`NOT-CONFIRMED`へ読み替えることはできません。

## D-014 — no-rescueとengineering分離

結果確認後のseed extension、favorable state replacement、search-grid substitution、threshold relaxation、tie tolerance change、subgroup rescue、failed-gate exception、alternate primaryは承認しません。

`PBAI-P1`および将来のAI Engineering判断によってG2-02の科学的判断を変更することもできません。

## D-015 — Stage 0 decision

日付: 2026-08-27

Stage 0はすべてのtechnical gateをPASSしました。

Node-budget semanticsは、全root candidateを完了した最後のiterative-deepening depthだけを採用し、partial iterationを破棄する方式に固定しました。PV reconstructionはdeterministic postprocessingです。

Scientific move orderingは固定を維持する必要があります。complete-depth scoreが変わらなくてもorderingによりnode consumptionが変化し得るためです。

Decision:

```text
STAGE 0 = PASS
```

## D-016 — Stage 1 prospective populationとgrid

日付: 2026-08-27

Stage 1では次を固定しました。

```text
games = 1280
seeds = 25011001..25012280
maxPly = 80
no extension
no replacement
search grid = D1_Q1 / D2_Q1 / D3_Q1 / D2_Q0 / D2_Q2 / B64 / B256 / B1024
```

Stage 1 source-freeze commitは`753425610573354ae6394ae414666c3bc62c5365`です。Scientific generationはpreauthorizationとsource-hash freezeの後にのみ明示的に承認しました。

## D-017 — Stage 1 verification-hash correctionの分類

日付: 2026-08-28

Initial Stage 1 independent verifierは、すべてのscientific replayとremeasurementを次の状態で完了しました。

```text
game replay mismatches = 0
selected-state mismatches = 0
measurement-row mismatches = 0
selection hash match = true
```

最終aggregate hashだけが異なりました。原因は、frozen production pre-serialization representationにexact-depth `attemptedDepth: undefined`と`abortedDepth: undefined`が存在し、JSON persistenceではそれらのpropertyが省略されたことです。

この差はimmutable artifactから両方向にexactに再現できました。正式分類は次です。

```text
verification-hash-serialization-defect
scientific measurement mismatch = false
scientific regeneration authorized = false
seed reconsumption authorized = false
```

Correction ID: `SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1`。

この判断はscientific gateを緩和するものではなく、scientific outcomeの救済でもありません。

## D-018 — Stage 1 development decision

日付: 2026-08-28

厳格なrepresentation-only correction後、事前固定したStage 1 readiness gateはすべてPASSしました。

```text
games = 1280
unique historical trajectories = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
corrected independent verification = PASS
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Decision:

```text
STAGE 1 = PROFILE-FROZEN-DEVELOPMENT
```

これはdevelopment characterizationであり、Study-level formal decisionではありません。

## D-019 — Stage 2 consumed-identity firewall

日付: 2026-08-28

Stage 2では、corrected immutable Stage 1 artifactをconsumed-identity exclusionとStage 2 preregistration / resource planningにのみ使用します。Stage 1 rowはformal evidenceではありません。

Stage 2 firewallは次で固定しました。

```text
historicalTrajectoryHash overlap -> exclude / no replacement
openingPrefixHash overlap -> exclude / no replacement
selected RAW rawStateKey overlap -> exclude / no replacement
required post-firewall overlap = 0 / 0 / 0
```

## D-020 — Stage 2 formal criterion

日付: 2026-08-28

Stage 2 outcomeを見る前に、formal criterion `mixed-material-sensitivity-and-high-budget-convergence/v1`を固定しました。

すべてのidentity / measurement / reproducibility / estimability gateがPASSした後、次の3条件をすべて要求します。

```text
P1: D2_Q1 vs D3_Q1 pooled canonical-best disagreement
    95% Wilson lower bound >= 0.20
P2: D2_Q2 vs D2_Q1 pooled canonical-best disagreement
    95% Wilson lower bound >= 0.20
P3: B1024_Q1_MAXD3 vs D3_Q1 pooled canonical-best agreement
    95% Wilson lower bound >= 0.90
```

これらのthresholdはdevelopment後に固定したsubstantive rounded definitionですが、Stage 1 point estimateやconfidence limitをそのまま複写したものではありません。

Formal rule:

```text
any gate fails -> INCONCLUSIVE
all gates pass + P1/P2/P3 all pass -> CONFIRMED
all gates pass + any of P1/P2/P3 fails -> NOT-CONFIRMED
```

Phase-stratified metric、ranking metric、PV metricはmandatory secondary reportingのままであり、primary decisionを救済できません。

## D-021 — Stage 2 hash contract

日付: 2026-08-28

Stage 1 serialization defectの再発を防ぐため、Stage 2では次を固定しました。

```text
measurement core
-> JSON roundtrip
-> stable canonical serialization
-> SHA-256
```

したがって、undefined-only object propertyがhidden pre-persistence hash splitを生むことはありません。

## D-022 — Stage 2 authorization

日付: 2026-08-28

authorization前にStage 2 preauthorization trigger coverageを修正し、すべてのStage 2 workflow source changeがtechnical contractとsource-freeze workflowの双方を再triggerするようにしました。

同じsource commit上で次を確認しました。

```text
source commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
preauthorization run 33124483699 = success
source-freeze run 33124483869 = success
Stage 2 spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
```

Stage 2はcommit `bec87d54540c96c24353f2eeadc25338c53e54eb`で明示的に承認しました。

承認範囲は次に限定します。

```text
games = 1536
seeds = 25021001..25022536
frozen grid / firewall / gates / formal criterion only
extension = false
replacement = false
no-rescue = active
```

Formal run `33124538584`がauthorized Stage 2 executionです。そのrunがindependent verificationをPASSし、frozen analyzerがcanonical resultを生成するまでformal decisionは存在しませんでした。

## D-023 — Stage 1 development closure

日付: 2026-08-28

Stage 1は`PROFILE-FROZEN-DEVELOPMENT`で完了しました。representation-only verification hash correctionはscientific measurement rowを一切変更せず、Stage 1からのformal inferenceも承認していません。

## D-024 — Stage 2 formal ruleとauthorization closure

日付: 2026-08-28

Stage 2は1,536 games / seed `25021001..25022536`、Stage 1 trajectory + opening-prefix + RAW-state firewall、変更しないsearch grid、固定formal gate、全gate PASS後にのみ評価するthree-criterion primary conjunctionとして事前固定しました。

Source-freeze commit: `e176cafc15d2dde7b8767de6961959bb7ee9bb7b`  
Authorization commit: `bec87d54540c96c24353f2eeadc25338c53e54eb`

## D-025 — Formal Stage 2 decision

日付: 2026-08-28

Independent verifierはgame / selection / measurement mismatch 0、exact hash matchでPASSしました。

事前登録したestimability gateのうち1件だけがFAILしました。

```text
1040 < 1050 unique historical trajectories after the Stage 1 firewall
```

固定済みtaxonomyにより、

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

です。

10-trajectory shortfallにnear-miss exceptionは適用しません。

## D-026 — no-rescue closure

日付: 2026-08-28

Stage 2 seed extension、replacement、threshold relaxation、alternate primary、favorable subgroup、secondary metricのreinterpretationは承認しません。

将来formal re-testを行う場合は、新しいprospective Study / versionとfresh evidenceが必要です。Public AI Engineeringによってこのdecisionを変更することもできません。

## D-027 — repository integration

日付: 2026-08-28

canonical closure documentation、idempotent closure-finalization rerun、root-document consistency review、unresolved PR review thread 0、通常PR workflow全PASSを確認した後、PR `#68`を`main`へmergeしました。

```text
final research head = f6814e4e828ea07ec309f6f7352c825494d8ff20
integration merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
formal decision unchanged = INCONCLUSIVE
primaryFormalCriterion unchanged = null
scientific evidence changed by integration = false
```

Repository integrationはadministrative / provenance closureにすぎず、scientific decision、threshold、endpoint、population、search condition、interpretation boundaryを変更しません。
