# SRDR-STUDY1 — 研究ログ

## 2026-08-27 — Study-start audit

- remote `main`を再取得し、`db6980bffb7e6853751914da628db8936c76d81e`がhandoffで示されたpost-G2-01 provenance anchorとexactに一致することを確認
- open pull request 0を確認
- Research Generation 2 residual branchをaudit。`research/g2-01-position-evaluation-empirical-outcome-calibration-replication`と`research/g2-01-stage1-implementation-backup`はいずれも`main`よりbehindかつ`ahead_by = 0`で、未統合のcompeting G2 workなし
- `FUTURE_RESEARCH_AGENDA.md`、`RESEARCH_INDEX.md`、second-generation program decisionからResearch Generation 2 common contractとG2-02 agenda positionを再構築
- `PEOCR-STUDY1 = INCONCLUSIVE`とstrict no-rescue boundaryを再構築
- Position Complexity / Difficulty Study 1を`INCONCLUSIVE`、PCX-H1=`INCONCLUSIVE`、PCX-H2=`NOT-CONFIRMATORILY-EVALUATED`として再確認

## 2026-08-27 — Search implementation audit

現在の`public/ai.js::analyzeMove()`は`maxDepth`、`timeLimitMs`、quiescence depth / order control、TT / history ordering control、aspiration setting、stable-best / adaptive controlをsupportしています。

既存position-complexity diagnosticはexhaustive legal-root score、exact tie、TopSet、canonical best、ranking情報を提供します。

Dedicated deterministic node-budget semanticsとreproducible PV reconstructionは、既知のscientific capabilityと仮定せずStage 0 technical feasibility questionとして扱いました。

## 2026-08-27 — Prospective Study freeze

固定内容:

```text
Program label = G2-02
Study ID = SRDR-STUDY1
Formal title = Search Reliability / Decision Robustness Study 1
Branch = research/g2-02-search-reliability-decision-robustness
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
```

このfreeze時点ではG2-02 scientific outcomeは存在していませんでした。

## 2026-08-27 — Stage 0 technical validation

- technical execution前にStage 0 source hashを固定
- controlled search instrumentがfrozen fixture上で既存exact-root diagnosticと一致
- RAW identity / source non-mutation、repeat determinism、node-budget semantics、deterministic PV reconstructionがPASS
- node-budget decisionは全root candidateが完了した最後のiterative-deepening depthだけを採用し、partial root iterationは破棄する方式へ固定
- complete-depth scoreが同じでもmove orderingによりnode consumptionが変わることを確認したため、scientific move orderingは固定必須とした
- Stage 0 decision: `PASS`

## 2026-08-27 — Stage 1 prospective freeze / authorization

scientific generation前に固定:

```text
games = 1280
seeds = 25011001..25012280
one state per historical trajectory
RAW-state dedup
no seed extension
no replacement
search grid = D1_Q1, D2_Q1, D3_Q1, D2_Q0, D2_Q2, B64, B256, B1024
move ordering = canonical lexical
score tie tolerance = 0
```

final preauthorization / source-freeze commitは`753425610573354ae6394ae414666c3bc62c5365`です。

Stage 1 authorizationは`eed7c6adbc234f5c3bf95b6bcd35b67d68b0eada`でcommitし、run `33067208005`がreserved Stage 1 seed blockをexactにconsumeしました。

## 2026-08-27 — Stage 1 generation / independent-verifier fail-closed event

Stage 1 production完了:

```text
games = 1280
unique historical trajectories = 1057
distinct opening prefixes = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
selection hash = ed00623f244310b29bc25c0885f287321d4430df1b4d8e4a3a061c06dfc62052
stored production measurement hash = 9b3425d546bdb59176fb49711161b0d5b79fb368039d65a89946ad37efb98532
```

frozen independent verifierは1280 game replayと1018 remeasurementをすべて完了し、game / selection / measurement-row mismatchは0でした。selection hashも一致しました。

ただしaggregate canonical measurement hashがstored production pre-serialization hashと一致せず、verifierは正しくfail closedしました。

```text
independent canonical measurement hash = 76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea
```

この時点ではreadiness analysisをskipしました。

## 2026-08-28 — Stage 1 verification serialization defect investigation

original Stage 1 artifactを保持したまま、新しいscientific trajectory生成やscientific state remeasurementを行わず調査しました。

root causeをexactに再現:

- exact-depth production compact objectのmemory上に`attemptedDepth: undefined`と`abortedDepth: undefined`が存在
- frozen production `stableStringify()`はpre-persistence measurement hashでそのobject keyをliteral `undefined`としてencode
- normal JSON persistenceはvalue=`undefined`のobject propertyをomit
- independent verifierはsemanticに同一rowを再構築したが2つのundefined-only fieldを作成しなかった
- persisted artifactのcanonical hashingでindependent verifier hashをexact再現
- 2つのundefined fieldを戻すとstored production hashをexact再現

これはscientific measurement mismatchではなく、representation-only verification-hash serialization defectとして分類しました。

search result、trajectory、RAW state、move identity、score、TopSet、ranking、PV、search grid、endpoint、threshold、seed、selectionは一切変更していません。

Correction ID:

`SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1`

## 2026-08-28 — Stage 1 corrected verification / development profile

Correction workflow run `33123555267`はstrict forensic preconditionをすべてPASSした後、既にfrozenなStage 1 analyzerを適用しました。

Canonical artifact:

```text
artifact ID = 9667419537
artifact = g2-02-stage1-development-v1-verified-canonical
ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
canonical persisted / independent measurement hash = 76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea
```

frozen Stage 1 readiness gateはすべてPASSしました。

Stage 1 decision:

```text
PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

Stage 1 rowはnon-confirmatory development evidenceのままで、Stage 2 formal rowとして使用禁止です。

## 2026-08-28 — Stage 2 formal rule freeze

Stage 2 scientific outcomeより前に次を固定しました。

```text
games = 1536
seeds = 25021001..25022536
maxPly = 80
no extension
no replacement
search grid unchanged from Stage 1
```

immutable corrected Stage 1 artifactに対して3-part consumed-identity firewallを固定しました。

1. historical trajectory overlap exclusion
2. opening-prefix overlap exclusion
3. selected authoritative RAW-state overlap exclusion

すべてno-replacementで、post-firewall overlapは0を要求します。

Primary formal criterion `mixed-material-sensitivity-and-high-budget-convergence/v1`では3つのdecision-bearing Wilson-lower-bound conditionを固定しました。

```text
P1 depth disagreement lower bound >= 0.20
P2 quiescence disagreement lower bound >= 0.20
P3 B1024-to-D3 agreement lower bound >= 0.90
```

formal gateをすべてPASSした後、3条件すべて成立で`CONFIRMED`です。gate failureは`INCONCLUSIVE`、gate PASS後にprimary criterionが1つでもFAILすれば`NOT-CONFIRMED`です。

Stage 1 undefined-field splitの再発を防ぐため、Stage 2 measurement hashingではstable serialization前にmeasurement coreをJSON roundtripすることもprospectiveに固定しました。

## 2026-08-28 — Stage 2 preauthorization / explicit authorization

Stage 2 formal workflow追加後、preauthorization workflow trigger coverageに新しいStage 2 workflow fileが含まれていないことを発見しました。

Stage 2 scientific generationはまだ未承認でreserved Stage 2 seedも未使用だったため、trigger coverageをprospectiveに修正しました。

final common source commit:

`e176cafc15d2dde7b8767de6961959bb7ee9bb7b`

同commit上で:

```text
preauthorization run 33124483699 = success
source-freeze run 33124483869 = success
Stage 2 spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
reserved Stage 2 seed consumed before authorization = false
```

Explicit Stage 2 authorization commit:

`bec87d54540c96c24353f2eeadc25338c53e54eb`

Formal workflow run `33124538584`はexplicit authorization gateをPASSし、immutable Stage 1 consumed-identity firewall artifactをdownloadしてfrozen Stage 2 generation / firewall-selection / measurement stepへ入りました。

この時点ではformal resultはまだ宣言しておらず、Stage 2 outcomeに応じたrescue modificationも承認していません。

## 2026-08-28 — Stage 1 verification correction

- new scientific seedをconsumeせずoriginal Stage 1 artifactをrecover
- 1280/1280 replay、1018/1018 selected-state measurements、row mismatch 0を確認
- aggregate hash discrepancyをJSON persistenceでomitされるpre-serialization `undefined` keyへisolated
- representation-only correctionを実行。scientific row、grid、seed、criterion変更なし
- Stage 1 decisionを`PROFILE-FROZEN-DEVELOPMENT`へ固定

## 2026-08-28 — Stage 2 formal closure

- Source-freeze commit: `e176cafc15d2dde7b8767de6961959bb7ee9bb7b`
- Explicit authorization commit: `bec87d54540c96c24353f2eeadc25338c53e54eb`
- Formal workflow run `33124538584`が成功
- 1536/1536 gamesを生成しindependent replay
- 1007 selected RAW statesを独立remeasure。selection / measurement mismatch 0、hash exact-match
- Stage 1 cross-stage overlap: trajectory / opening-prefix / RAW state = `0 / 0 / 0`
- frozen estimability gate 1件がFAIL: firewall後unique historical trajectories `1040 < 1050`
- Formal decision=`INCONCLUSIVE`; `primaryFormalCriterion = null`
- rescue、extension、replacement、threshold relaxation未実施

## 2026-08-28 — Repository closure / main integration

- deterministic closure finalizationがimmutable Stage 2 artifactをvalidateし、canonical compact result recordをmaterialize
- root `README.md`、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`、Study overview / final report / status / decision register / reproducibility indexをcanonical resultと照合
- large per-game / selected-state / full-measurement Stage 2 artifactは意図的にGit historyから除外し、hashのみ記録
- closure workflowをidempotent化しfinal research headで再実行成功
- merge前final research head: `f6814e4e828ea07ec309f6f7352c825494d8ff20`
- branchは`main`より66 commits ahead / 0 behind、competing open PRなし、unresolved review threadなし
- 通常PR workflow 5件すべてPASS: G2-02 technical validation、second-generation research agenda audit、SSGTC closure audit、PCEM closure audit、repo-wide Phase Transition Research CI
- PR `#68`を`main`へmerge、merge commit=`ee5f0a5e769516d635fe8b70e42244a8dc8d9b34`
- repository integrationによるscientific evidence、formal gate、decision、interpretation boundaryの変更なし
- final scientific decisionは`SRDR-STUDY1 = INCONCLUSIVE`、`primaryFormalCriterion = null`のまま
