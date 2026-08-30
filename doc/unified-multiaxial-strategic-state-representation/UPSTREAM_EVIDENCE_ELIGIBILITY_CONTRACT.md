# UMSSR-STUDY1 — upstream evidence利用資格契約

## 1. 目的

G2-10へ持ち込むupstream evidence、axis、classifier、feature family、representation componentの利用資格を、G2-10 outcomeを見る前に固定する。

本契約は「positiveな既存結果だけを選ぶ」ための仕組みではない。technical-invalid、non-estimable、inconclusive、not-authorizedを、それぞれの意味のまま保持するためのscientific firewallである。

## 2. eligibility vocabulary

### A. `FORMALLY-ELIGIBLE`

既存Studyのformal decisionと再現性記録が、そのconstructを明示的に支持しており、G2-10で利用するscopeが元のvalidated scopeを越えないもの。

formal eligibilityは自動的な実装可用性を意味しない。repositoryからexact reconstructionできない場合は、Stage 0でG2-10へのdirect executable inputを停止する。

### B. `BOUNDED-EXACT-ELIGIBLE`

exact claimがprospectively frozen bounded domain内に限定され、そのdomainを越えない場合だけ利用できるもの。domain外への外挿は不可。

### C. `TECHNICAL-REFERENCE-ONLY`

scientific validationには使えないが、instrument design、fixture、resource estimate、failure prevention、implementation comparison等のtechnical referenceとして利用できるもの。

### D. `DEVELOPMENT-CANDIDATE-ONLY`

upstream概念やraw observableをG2-10用に新しいcandidateとして再定義し、fresh Stage 1 development対象にできるもの。既存Studyのvalidated resultとして流用しない。

### E. `INELIGIBLE`

G2-10のscientific input、validated axis、formal classifier、formal regime labelとして直接使用してはならないもの。必要ならdistinctなG2-10 candidateとしてゼロから再定義できるが、その場合は元resultのformal statusを継承しない。

## 3. upstream Study audit

| upstream | canonical status | G2-10 eligibility | 固定する境界 |
| --- | --- | --- | --- |
| `G2-01 / PEOCR-STUDY1` | `INCONCLUSIVE`, primary=`null` | `TECHNICAL-REFERENCE-ONLY` | calibration mappingをvalidated outcome-probability axisとして使わない |
| `G2-02 / SRDR-STUDY1` | `INCONCLUSIVE`, primary=`null` | `TECHNICAL-REFERENCE-ONLY`; raw stability observablesはfresh再定義時のみ`DEVELOPMENT-CANDIDATE-ONLY` | secondary profileをformal search-reliability classifierへ昇格しない |
| `G2-03 / STSCV-STUDY1` | `INCONCLUSIVE`, transforms=`NON-ESTIMABLE`, validated set=`[]` | transform / canonicalizationは`INELIGIBLE`; RAW identity contractはauthoritative technical boundaryとして使用 | symmetry reduction禁止 |
| `G2-04 / REEOE-STUDY1` | `INCONCLUSIVE`, fresh exact oracleなし | `TECHNICAL-REFERENCE-ONLY` | Stage 0のhistorical 8-state controlをfresh exact strategic axisとみなさない |
| `G2-05 / DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | `BOUNDED-EXACT-ELIGIBLE` | exact claimはstandard initial RAW root depth 0..9だけ。fresh stateへ値を外挿しない |
| `G2-06 / RCPR-STUDY1` | Stage 1 `STAGE1-TECHNICAL-INVALID`; Stage 2未実行 | rich classifier / `RICH_ALL` / production metricsは`INELIGIBLE`; raw feature ideasはfresh再定義時のみ`DEVELOPMENT-CANDIDATE-ONLY` | production-only outputをaccepted scientific resultにしない |
| `G2-07 / PCRPR-STUDY1` | Stage 1 `STAGE1-TECHNICAL-INVALID`; Stage 2未実行 | `F05_ALL`, `lambda=100`, model/performanceは`INELIGIBLE`; reply-set raw observablesはfresh再定義時のみ`DEVELOPMENT-CANDIDATE-ONLY` | stdout hash一致をfull independent verificationの代用にしない |
| `G2-08 / MDFT-STUDY1` | Study `NON-ESTIMABLE`; Stage 2未実行 | promoted leaves / taxonomy / classifierは`INELIGIBLE`; disagreement等のraw observablesはfresh再定義時のみ`DEVELOPMENT-CANDIDATE-ONLY` | development promotionをvalidated taxonomyにしない |
| `G2-09 / TMGC-STUDY1` | Study `TECHNICAL-INVALID`; scientific evidence生成なし | G2-09 generalization / counterexample boundaryは`INELIGIBLE` | Stage 1/2 scientific seeds未消費。generalization claimは存在しない |

## 4. Research Generation 1からの限定利用

### `TM-S2-C03`

Research Generation 1のcanonical decision `CONFIRMED`は不変である。元のfrozen constructと元scopeを越えない利用は`FORMALLY-ELIGIBLE`候補とする。ただしG2-09から新しいgeneralization domainは得られていないため、phase / morphology / search condition / state familyを跨ぐ一般化labelとして使用しない。

Stage 0でexact reconstruction、move identity、classification semantics、source bindingをproduction / independent双方が確認できなければ、G2-10のdirect executable axisとしては使用しない。

### `MTAJI-M1 / MTAJI-M2` morphology

Research Generation 1でconfirmedされたbounded morphology claim自体は変更しない。ただしG2-08 Stage 0ではhistorically frozen classifierを現repository sourceからexact再構築できず、`MDFT-F09 = TECHNICALLY-INELIGIBLE`となった。

したがってG2-10では、historical morphology claimを意味論上のupstream evidenceとして認識しても、classifier outputを直接利用してはならない。Stage 0でcanonical executable reconstructionを別実装を含めて確立できた場合に限り元scopeで`FORMALLY-ELIGIBLE` inputへ昇格できる。確立できない場合、morphology概念を使うにはG2-10のfresh `DEVELOPMENT-CANDIDATE-ONLY` representationとして再定義する。

## 5. direct-use禁止

次をG2-10のvalidated axisとして直接使用しない。

- G2-01 calibration mapping
- G2-02 secondary profileをformal classifier化したもの
- G2-03 transform / symmetry / canonicalization
- G2-06 `RICH_ALL`、operating threshold、AUROC等
- G2-07 `F05_ALL`、`lambda=100`、OOF metrics等
- G2-08 promoted leaf setをtaxonomyとして固定したもの
- G2-09 generalization / counterexample boundary
- not-authorized Stage 2のtarget / seed / hypothetical result

## 6. no-rescue rule

G2-10 outcomeを見た後にupstream eligibility categoryを変更しない。G2-10で都合のよいaxisだけをformal inputへ昇格しない。

G2-10用のfresh candidateとして再定義したものは、元Studyのformal decisionを変更せず、G2-10内で独立に評価する。
