# G4-09 — Geometry-Conditioned Search Reliability and Exact Agreement Study 1

Program: `Research Generation 4 / G4-09`  
Study ID: `GCSREA-STUDY1`  
Research branch: `research/g4-09-search-reliability-exact-agreement`  
Baseline `main`: `fc0f345034639c03dc10b0537c331ae44ee47b3b`  
状態: **`PREREGISTERED / STAGE0-ONLY AUTHORIZED / FRESH SCIENTIFIC ACCESS NOT AUTHORIZED`**

## 1. 目的

本Studyは、Baoのbounded RAW local game-tree geometryとsearch reliabilityの関係を、次の2 moduleへ分離してprospectiveに検証する。

1. **GENERAL-SEARCH-STABILITY** — fresh general-domain RAW stateにおいて、固定search configuration間のranking、TopSet、canonical-best、PV等の出力安定性と局所geometryの関係を扱う。
2. **EXACT-MICRODOMAIN-AGREEMENT** — G4-05で完全解析済みの固定8 exact microdomainに限定し、search outputとexact value-preserving / optimal move informationの一致を扱う。

一般domainではhigher-resource searchをtruthとみなさない。exact correctnessという語を使用するのは、G4-05 exact oracleへ正しく再結合できた固定microdomainだけとする。

## 2. 上流dependency

- G4-02: `CLOSED / NO SCIENTIFIC DECISION`。program上のclosureのみ満たす。positive / negative scientific evidenceとして使用しない。
- G4-03: 一般domain moduleの直接的なhypothesis / methodology reference。scientific seed、trajectory、selected root、endpoint value、p-valueは再利用しない。
- G4-05: exact module prerequisiteを満たす。固定8 domainをimmutable upstream oracleとして扱い、candidate rescan、replacement、STATE-LIMIT rescueをしない。
- G4-06: fixed-domain rematerializationとexact integrity bindingの方法論だけを参照する。12 relationのoutcomeをG4-09 threshold選択へ使用しない。
- G4-07 / G4-08: methodology referenceのみ。G4-08の`NON-ESTIMABLE`をno-relation evidenceへ読み替えない。
- G2-02: historical search-reliability design referenceのみ。formal `INCONCLUSIVE`を救済しない。

## 3. identity / representation boundary

```text
authoritative RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
representation = RAW-ONLY
validated transform set = []
local geometry relative depth = 5
higher-resource search = reference configuration only / NOT truth
```

symmetry / canonicalization、engine scoreのwin probability化、人間difficultyへの読み替えを行わない。

## 4. Stage構成

### Stage 0 — technical-only

`TECHNICAL-FIXTURE`だけを使い、次を検証する。

- search configurationごとのproduction / independent exact agreement
- ranking / TopSet / canonical-best / PV stability semanticsの二経路一致
- RAW depth-5 geometryの二経路一致
- exact value-preserving move setとのagreement分類 semantics
- exact set relation `EQUAL / A-SUBSET-B / A-SUPERSET-B / OVERLAP / DISJOINT`
- canonical JSON / digest determinism
- future scientific namespaceがsealedであること
- G4-05 fixed exact rootsへの新規scientific measurementが0であること
- G4-10 depth-11 accessが0であること

Stage 0ではG4-05の実際の8 rootへsearchを掛けない。exact agreementはsynthetic move-set fixtureだけでsemantic validationする。

### Stage 1 — development

**未認可**。

Stage 0 PASS後も自動認可しない。別authorization review前に少なくとも以下をfreezeする。

- fresh source policy
- seed block / count / assignment
- state/root eligibility
- geometry predictor family
- search configuration family
- primary / secondary stability endpoint
- support / estimability gate
- freshness firewall manifest
- resource ceiling
- exact-domain moduleをStage 1で扱うか否か
- production / independent implementation binding
- no-rescue rule

Stage 1は原則としてsupport / definedness / exactness / resource readinessを扱い、formal heldout decisionは生成しない。

### Stage 2 — formal heldout

**未認可**。

Stage 1終了後に別authorizationを要求する。fresh heldout population、formal family、threshold、directionまたはdirection-free rule、multiplicity、decision mappingをfresh access前に固定する。

## 5. Stage 0 search grid

technical validationでは、G2-02 / G4-03で使用実績のあるcontrolled-search semanticsの範囲から次を固定する。

```text
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

technical contrastは次の3つ。

```text
TC-DEPTH       = D2_Q1 vs D3_Q1
TC-NODE-BUDGET = B256_Q1_MAXD3 vs B1024_Q1_MAXD3
TC-QUIESCENCE  = D2_Q0 vs D2_Q2
```

Stage 0ではeffect directionやscientific hypothesis testを行わない。

## 6. Stage 0 geometry

technical fixture上で既存`SILGM` depth-5 RAW geometry familyのproduction / independent一致を確認する。

```text
SILGM-G1-ROOT-LEGAL-WIDTH
SILGM-G2-CUMULATIVE-TREE-OCCURRENCE
SILGM-G3-DUPLICATE-TRANSITION-FRACTION
SILGM-G4-CUMULATIVE-TREE-RAW-RATIO
SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION
```

Stage 0 rootはinitial RAW stateと、そのcanonical-first childの最大2 rootだけとする。

## 7. Stage 0 exact-agreement semantics

実際のG4-05 rootを使わず、合法move universeを模したsynthetic fixtureで次を検証する。

- search TopSet = exact set
- search TopSet ⊂ exact set
- search TopSet ⊃ exact set
- partial overlap
- disjoint
- canonical-bestがexact set内か
- ranking上位`k=3`によるexact-set coverage
- PV first moveがexact set内か

このStage 0結果はBaoのsearch correctnessについて科学的な値を与えない。

## 8. Freshness / no-reuse boundary

future general-domain scientific access前に、重複可能な上流scientific identityをidentity-only firewallとして固定する。最低限G2-02、G4-03、およびsource overlapが可能なG4-04 / G4-07 / G4-08を審査対象にする。

候補namespace:

```text
Stage 1 candidate start = 40913001
Stage 2 candidate start = 40923001
```

現時点ではstart候補だけであり、**read未認可**。end、count、assignment、reserve ruleは未固定である。

## 9. Exact oracle boundary

G4-05 fixed 8 domainsを将来利用する場合、各rootを固定`(seed, ply, rootStateKey)`から再物質化し、少なくとも次が保存済みoracleと完全一致したときだけG4-09 search measurementへ進む。

```text
state-set
transition-set
solution digest
root exact value
DTF
optimalMoveKeys
```

candidate rescan、domain replacement、state-limit rescue、G4-05 decision再評価は禁止する。

## 10. Execution policy

長時間処理はGitHub Actionsを第一候補とする。ただしActionsの都合に合わせてscientific target、sample size、configuration familyを変更しない。

fresh stageでは、source SHA、workflow run / attempt、execution lease、artifact ID / SHA-256、canonical result SHA-256、fresh reads、protected-evidence access countを保存する。

## 11. No-rescue rule

最初のfresh scientific read後、同Study/version内で次を行わない。

- seed extension / replacement
- source-policy replacement
- search-grid replacement
- geometry familyのpost-hoc selection
- exact-domain replacement
- support threshold緩和
- multiplicity緩和
- favorable subgroup rescue
- same-evidence repair rerun

technical defectが発見された場合は、事前規定に従いfail closedし、新version / new authorizationとして扱う。

## 12. Public AI boundary

本Studyはpublic AIの自動変更を認可しない。scientific resultが得られても、公開AIへの採用は別のengineering review / validation programを必要とする。
