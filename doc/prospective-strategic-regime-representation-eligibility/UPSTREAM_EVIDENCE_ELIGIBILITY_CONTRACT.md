# PSRRE-STUDY1 — upstream evidence利用資格契約

## 1. 目的

本契約は、`PSRRE-STUDY1`へ持ち込める既存証拠・概念・raw observable・classifier・representation componentを、scientific outcome生成前に固定するものである。既存Studyのnegative / inconclusive / non-estimable / technical-invalid / not-authorized resultを変更するものではない。

## 2. eligibility vocabulary

### `FORMALLY-ELIGIBLE`

既存Studyのformal decisionと再現性記録が当該constructを明示的に支持し、本Studyでの利用scopeが元のvalidated scopeを越えないもの。

### `BOUNDED-EXACT-ELIGIBLE`

prospectively frozen bounded domain内だけでexact claimが成立し、そのdomainを越えて外挿しないもの。

### `TECHNICAL-REFERENCE-ONLY`

scientific inputとしては使わないが、instrument design、fixture、resource estimate、failure prevention、implementation comparisonには使用できるもの。

### `DEVELOPMENT-CANDIDATE-ONLY`

既存概念をvalidated resultとして流用せず、本Study用にfresh定義し、fresh Stage 1 evidenceで新規candidateとして評価できるもの。

### `INELIGIBLE`

本Studyのvalidated input、formal classifier、formal regime labelとして直接使用してはならないもの。

## 3. Research Generation 2 upstream audit

| upstream | canonical status | PSRRE-STUDY1 eligibility | 固定する境界 |
| --- | --- | --- | --- |
| `G2-01 / PEOCR-STUDY1` | `INCONCLUSIVE`, primary=`null` | calibration mapping=`INELIGIBLE`; technical setup=`TECHNICAL-REFERENCE-ONLY` | validated win-probability axisとして使わない |
| `G2-02 / SRDR-STUDY1` | `INCONCLUSIVE`, primary=`null` | formal profile/classifier=`INELIGIBLE`; raw stability observable concept=`DEVELOPMENT-CANDIDATE-ONLY` | secondary profileをformal search-reliability labelへ昇格しない |
| `G2-03 / STSCV-STUDY1` | `INCONCLUSIVE`; transforms=`NON-ESTIMABLE`; validated set=`[]` | transforms/canonicalization=`INELIGIBLE`; RAW identity boundaryはauthoritative | symmetry reduction禁止 |
| `G2-04 / REEOE-STUDY1` | `INCONCLUSIVE`; fresh exact oracleなし | `TECHNICAL-REFERENCE-ONLY` | incomplete closureをstrategic labelへ使わない |
| `G2-05 / DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | `BOUNDED-EXACT-ELIGIBLE` | standard initial RAW root depth 0..9以外へ外挿しない |
| `G2-06 / RCPR-STUDY1` | `STAGE1-TECHNICAL-INVALID`; Stage 2未実行 | rich classifier / production model=`INELIGIBLE`; raw feature idea=`DEVELOPMENT-CANDIDATE-ONLY` | production-only readinessをscientific evidenceにしない |
| `G2-07 / PCRPR-STUDY1` | `STAGE1-TECHNICAL-INVALID`; Stage 2未実行 | `F05_ALL` / `lambda=100` / model=`INELIGIBLE`; raw reply observable concept=`DEVELOPMENT-CANDIDATE-ONLY` | full independent artifact未成立を無視しない |
| `G2-08 / MDFT-STUDY1` | `NON-ESTIMABLE`; Stage 2未実行 | taxonomy / promoted leaves=`INELIGIBLE`; disagreement等のraw concept=`DEVELOPMENT-CANDIDATE-ONLY` | development leafをvalidated taxonomyにしない |
| `G2-09 / TMGC-STUDY1` | `TECHNICAL-INVALID`; scientific evidence生成なし | generalization/counterexample boundary=`INELIGIBLE` | G1 C03 scopeを拡張しない |
| `G2-10 / UMSSR-STUDY1` | Stage 1=`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`; final=`NOT-AUTHORIZED-NOT-EXECUTED` | final 40-feature/K-means representation contract=`INELIGIBLE` as direct frozen representation; technical implementation lessons=`TECHNICAL-REFERENCE-ONLY`; raw observable concepts may be independently redefined as `DEVELOPMENT-CANDIDATE-ONLY` | threshold/K/feature dictionary/seed/population/near-missを救済しない |

## 4. Research Generation 1の限定利用

### `TM-S2-C03`

canonical decision `CONFIRMED`は不変である。元のfrozen scope内だけ`FORMALLY-ELIGIBLE`候補とする。ただし、direct executable useはStage 0でproduction / independent exact reconstructionを確認できる場合に限る。

G2-09はgeneralization evidenceを生成していないため、phase / morphology / search condition / state familyを跨ぐ一般化labelとして使わない。

### `MTAJI-M1 / MTAJI-M2`

historical bounded morphology claimは変更しない。ただし、G2-08 / G2-10時点でcanonical executable reconstructionには制約があった。本Studyのdirect inputには採用しない。必要な場合は別のprospective executable-reconstruction contractを先に設ける。

## 5. G2-10固有のno-rescue firewall

本Studyでは次を行わない。

- G2-10 support / silhouette / stability thresholdの緩和
- `K=2..6`の拡張・差替え
- G2-10 40-feature dictionaryへのPCA / latent featureの後付け
- favorable root / subgroup抽出
- consumed Stage 1 seeds `29310001..29314096`のrerun / replacement / extension
- reserved Stage 2 seeds `29410001..29418192`の流用
- near-miss candidateのpromotion
- G2-10 final decision、population、endpoint、feature dictionary、representation boundaryの変更

## 6. 本Studyでfresh再定義できるconcept

次は、既存validated outputとしてではなく、fresh `DEVELOPMENT-CANDIDATE-ONLY` conceptとしてのみ再定義できる。

- search-condition間のbest-move / top-set / score stability
- reply-set width / reply composition / reply-quality dispersion
- raw structural occupancy / material balance / legal-action structure
- one-ply successor dispersion

再定義する場合は、exact formula、missing semantics、scaling、serializationをStage 1 scientific seed消費前に固定する。

## 7. RAW identity / transform firewall

```text
validated transform set = []
canonicalization = false
symmetry reduction = false
```

RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`とする。`turn` / `reason`をidentityへ含めない。

## 8. outcome後のeligibility変更禁止

Stage 1またはStage 2 outcomeを見た後にeligibility categoryを変更しない。scientific input不足を理由にtechnical-invalid / non-estimable upstream outputをvalidated inputへ昇格しない。
