# PBAI-P2 Research Generation 2 Evidence Audit

Status: **FROZEN / PBAI-P2-A COMPLETE**  
Program: `PBAI-P2`  
Scientific evidence cutoff: `cd200b85c1eb24aa4419bd5a9573552f3682f00d`

## 1. Canonical evidence core

PBAI-P2のResearch Generation 2 evidenceは、cutoff時点の次をprogram-level正本とする。

- `doc/research-generation-2/FINAL_SYNTHESIS.md`
- `doc/research-generation-2/PROGRAM_FINAL_RESULT.json`
- `doc/research-generation-2/CURRENT_STATUS.md`
- `doc/research-program-decisions/2026-08-31-research-generation-2-program-closure.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`

candidate justificationに追加detailが必要な場合のみ、同cutoff時点の各Study final report / result / decision registerを読む。

## 2. Program-level formal boundary

```text
Research Generation 2 core program = CLOSED / INTEGRATED TO MAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
```

Authoritative RAW identity:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

## 3. Tier A — direct engineering constraint / strong input

### A1. G2-05 bounded exact RAW enumeration

`G2-05 / DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`。

Standard initial RAW rootからdepth 0..9について、productionとindependent implementationがcomplete exact enumerationを一致させた。

Canonical bounded endpoints:

```text
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
```

Exact branching / transposition facts within the frozen domain:

```text
first duplicate arrivals = child depth 4
duplicate arrivals at depth 9 = 3116
states with multiple predecessor RAW states at depth 9 = 2658
tree / cumulative RAW-state occurrence ratio through depth 9
= 1.328494900687362
```

これはtransposition-aware engineeringを検討する直接根拠になるが、Bao全体へtransposition rate、branching rate、growth rateを外挿してはいけない。

### A2. RAW identity / no canonicalization constraint

Research Generation 2全体でvalidated transform setは`[]`であり、authoritative RAW identityを維持する。

したがってPBAI-P2 search/cache identity、overlap firewall、artifact bindingでsymmetry-reduced keyをauthoritative state identityとして使用しない。

### A3. formal prohibition boundaries

次はpositive scientific factではなく、engineering designを制約するTier A boundaryである。

```text
engine score != validated Bao win probability
validated strategic-regime representation = none
whole-game growth estimator = none
whole-Bao state-space / game-tree estimate = unauthorized
human construct inference from machine evidence = unauthorized
```

## 4. Tier B — hypothesis-forming only

Tier Bは、新しいengineering hypothesisを作るための限定的inputであり、validated scientific factとして扱わない。

### B1. G2-02 search-condition descriptors

`SRDR-STUDY1 = INCONCLUSIVE`。formal primary criterionはestimability gate `1040 < 1050`により`null`。

ただし事前指定済みsecondary bounded machine-search descriptorとして次が保存されている。

```text
D1_Q1 vs D2_Q1 canonical-best agreement = 0.637537
D2_Q1 vs D3_Q1 = 0.734856
D2_Q0 vs D2_Q1 = 0.643496
D2_Q2 vs D2_Q1 = 0.748759
B64 vs D3 = 0.644751
B256 vs D3 = 0.795432
B1024 vs D3 = 0.941410
```

これらはPBAI-C008のようなfresh search-stability engineering hypothesisを形成する材料にはできるが、true-best-move stability、optimality、human difficultyとは呼ばない。

### B2. G2-06 rich representation development lessons

`RCPR-STUDY1 = STAGE1-TECHNICAL-INVALID`。production-only/development representationをvalidated representationとして使用しない。

Engineering process lessonとして、exact representation equality、floating-point ordering、independent reconstructionをcandidate verification designへ反映することは許可する。

### B3. G2-07 reply-pressure development structure

`PCRPR-STUDY1 = STAGE1-TECHNICAL-INVALID`。productionとindependent computation summaryは一致したがmandatory independent full artifactがmaterializeせず、formal promotionされなかった。

reply-set width、defense-maintaining reply fraction、reply-quality distribution、punishment concentration、opponent-policy sensitivity等のconceptはfresh engineering hypothesis生成に限って使用可能。production-only selected family `F05_ALL`、`lambda=100`、production performance metricをvalidated premiseまたはPBAI-P2 thresholdとして使用しない。

Artifact transport failureから、mandatory verifier evidenceをsingle upload pathへ依存させないengineering infrastructure lessonを採用することは許可する。これはG2-07の再判定ではない。

### B4. G2-08 / G2-10 / PSRRE design lessons

`MDFT-STUDY1 = NON-ESTIMABLE`、`UMSSR-STUDY1 selectedRepresentation = null`、`PSRRE-STUDY1 selectedRepresentation = null`。

failure-mode vocabularyやrepresentation readinessの設計経験はengineering process / hypothesis generationに使えるが、taxonomy、cluster、strategic regimeをvalidated inputとしてpublic AIへ埋め込まない。

### B5. G2-12 verification-process lesson

`SSGTGE-STUDY1 = TECHNICAL-INVALID`, `selectedEstimator = null`。

production/independent numerical-equivalence gateを厳密に扱うprocess lessonは利用できる。production-only estimator proposalやwhole-game extrapolationは利用できない。

## 5. Tier C — prohibited inference / positive premiseとして使用不可

以下をcandidate benefit premise、candidate triggerのvalidated meaning、adoption justificationとして使用しない。

- G2-01 exploratory mappingをvalidated win probabilityとすること
- G2-02 higher-resource searchをgame-theoretic truthとすること
- G2-03 transform / canonicalizationをvalidated扱いすること
- G2-04 incomplete endgame domainsをexact oracleとして扱うこと
- G2-06 / G2-07 technical-invalid production-only resultをformal representationとして扱うこと
- G2-08 taxonomyをformal machine-failure taxonomyとしてpromotionすること
- G2-09 generalization/counterexample claimを生成すること
- G2-10 or PSRRE representationをselected strategic regimeとして使用すること
- G2-11 transition resultが存在すると扱うこと
- G2-12 estimatorをselected estimatorとして使用すること
- depth-9 bounded growthをwhole-Bao state-space / game-treeへ外挿すること
- machine evidenceからhuman error/difficulty/expert judgmentを推論すること

## 6. PBAI-P1 no-rescue cross-check

次のPBAI-P1 candidate identitiesはclosedであり、PBAI-P2でsame-version / threshold / seed / subgroup / minor-mechanism tweakにより救済しない。

```text
PBAI-C001-v1
PBAI-C002-v1
PBAI-C003-v1
PBAI-C004-v1
PBAI-C005
```

PBAI-P2 initial candidatesは新しいG2-grounded mechanismとして`PBAI-C006`以降を使用する。

## 7. Evidence-to-candidate trace

| Candidate | Evidence tier | Authorized premise | Explicitly prohibited inference |
| --- | --- | --- | --- |
| `PBAI-C006-v1` | Tier A | authoritative RAW identity; current public cache key differs by omitting `pending` | current public AI is already proven incorrect |
| `PBAI-C007-v1` | Tier A | bounded exact transpositions exist; public TT is bounded and uses eviction | Bao-wide transposition rate; guaranteed speedup |
| `PBAI-C008-v1` | Tier B | bounded search-condition sensitivity descriptors can motivate fresh engineering test | G2-02 primary result confirmed; higher-resource search is truth |
| `PBAI-C009-v1` | Tier B | reply-width concept can motivate a fresh exact single-reply extension | G2-07 representation/model validated; human pressure/error claim |

## 8. Audit disposition

```text
PBAI-P2-A = COMPLETE
scientific cutoff = frozen
Tier A/B/C classification = frozen
G3 evidence included = false
Research Generation 1 scientific evidence reused = false
candidate outcome observed before audit freeze = false
```
