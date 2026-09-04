# CRCLGR-STUDY1 — Study 1最終報告

日付: 2026-09-03

## formal status（正式状態）

**`CLOSED / FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION`**

## 1. 研究の問い

本Studyは、LGTGMIVでformal-eligibleとなっているRAW-only relative depth-5 exact local-game-tree geometry primitivesから事前固定したcontinuous multiaxial representationを、resource workloadを事後的に都合よく除外せず、canonical structured-data digestとdeterministic pre-root reconstructibility eligibilityの下でfresh population上に再現可能に確立できるかを検証した。

対象representationは `CRCLGR-R1-EXACT-SQUASHED-L1` であり、six exact axesを `q/(1+q)` にexact rational transformし、equal-weight exact L1を距離として用いる。

## 2. 独立性の境界

本Studyは`CLGR-STUDY1`および`RRCLGR-STUDY1`とは別のprospective Studyである。

- G3-09 Stage 1/2 measured coordinatesはscientific inputとして使用していない。
- RRCLGR Stage 1 fresh measurementsはscientific inputとして使用していない。
- G3-09 identity-only selectionはupstream firewallとしてのみ使用した。
- G3-04/G3-07のformal outcomeをaxis、weight、scaling、threshold、population、phase allocationの選択に使用していない。
- protected standard-initial exact depth-10 holdoutにはアクセスしていない。

RRCLGRで判明したstructured Arrayのlow-level digest type defectは、fresh scientific evidenceではなくtechnical hardening informationとしてStage 0設計にのみ反映した。

## 3. Stage 0の結果

Stage IDは`CRCLGR-S0-TECHNICAL-2026-09-03-v1`である。

Actions runは`33761178143`である。

最終状態は**`STAGE0-PASS`**である。

Stage 0はtechnical-onlyであり、Stage 1/2 scientific seed accessは行っていない。

必須controlには次を含めた。

- structured canonical serializationについて、production / independent / referenceがexactに一致すること
- structured canonical digestのexactness
- low-level digestのtype guard
- synthetic six-axis / squashのexactness
- exact L1 / k=3 tie-inclusive neighborhoodの一致
- candidate-core digest生成までを含む実technical candidate-selection path
- 4 Namua + 4 Mtajiのtechnical candidate completion
- bounded preflightのexact一致
- 各phaseで少なくとも1件のexact depth-5 technical measurement
- 強制relay-limit時のfail-closed動作
- deterministic counter-ceiling時のfail-closed動作
- implementationの分離

## 4. Stage 1の結果

Stage IDは`CRCLGR-S1-DEVELOPMENT-2026-09-03-v1`である。

fresh seed blockは`32110001..32110256`である。

Actions runは`33761678941`である。

最終状態は**`STAGE1-PASS`**である。

承認されたscientific executionを1回だけ実行した。

### populationとpreflight

- candidate manifestは32 Namua + 32 Mtajiで、64/64 completeだった
- resource-eligible = Namua 31/32, Mtaji 32/32;
- 固定済みminimumはphaseごとに28/32だった
- measured populationは24 Namua + 24 Mtajiで、48/48だった

### development gate（開発段階の判定条件）

- canonical candidate digestのexactnessはPASSだった
- 6 axisすべてが定義可能で、PASSだった
- production / independentのexact一致はPASSだった
- pairwise L1のexactnessはPASSだった
- k=3 neighborhoodのexactnessはPASSだった
- root-order invariance = PASS;
- distinct coordinate vectorはNamua 24、Mtaji 23で、minimum 8を満たしてPASSだった
- 両phaseで4種類以上のexact valueを持つaxisは6/6で、minimum 4を満たしてPASSだった

canonical Stage 1 scientific resultのSHA-256:

`e964970c71b270aaee8857fdd99b5041abcdb2f43ba83b600aa7764b2dda613f`

durable artifact:

- artifact ID `9895942440`;
- ZIP SHA-256 `b940b79fb4c541111b14756d51de43c069158c46d860e0f2df0fdbe7d48e78eb`;
- exact-byte mirror `8b3c7ca9c3fed220a40297d03a73b4b162708c3b`を保存した。

## 5. Stage 2のformal validation

Stage IDは`CRCLGR-S2-FORMAL-2026-09-03-v1`である。

fresh seed blockは`32120001..32120384`である。

Actions runは`33763404167`である。

承認されたformal scientific executionを1回だけ実行した。

### candidate populationの構成

- candidate manifestは48 Namua + 48 Mtajiで、96/96 completeだった
- candidate selectionにはgeometryを使用していない
- candidate selectionにはresource preflightを使用していない
- Stage 2 selectionではStage 1 scientific measurementをloadしていない

### preflight supportの状態

- Namua resource-eligible = 48/48;
- Mtaji resource-eligible = 47/48;
- 固定済みminimumはphaseごとに42/48だった
- support gateはPASS。

coordinate生成前に、96行の完全なpreflight manifestを固定した。

### formal measured populationの構成

- 36 Namua + 36 Mtaji = 72/72;
- すでに固定したpreflight manifestから選択した
- coordinate生成前にpopulationを固定した
- coordinate生成後のroot replacementは承認していない

### exact integrity endpointの結果

- production / independent depth-5 reconstructionのexact一致はPASSだった
- six-axis coordinateのexactnessはPASSだった
- すべてのcoordinateが定義可能で、PASSだった
- pairwise exact L1は2556/2556件だった
- pairwise L1のproduction / independent exact一致はPASSだった
- k=3 tie-inclusive neighborhoodのexact一致はPASSだった
- canonical order invarianceはPASSだった

### formal nondegeneracyの結果

異なるcoordinate vectorの件数は次のとおりである。

- Namua = 36;
- Mtaji = 36;
- 固定済みminimumはphaseごとに12だった
- 判定はPASS。

各axisで得た異なるexact valueの数を、Namua / Mtajiの順で示す。

- A1 root legal widthは9 / 9だった
- A2 cumulative tree occurrenceは36 / 35だった
- A3 cumulative distinct RAW statesは36 / 35だった
- A4 cumulative tree / RAW ratioは33 / 9だった
- A5 duplicate-transition fractionは33 / 9だった
- A6 unit-width occupancy fractionは36 / 34だった

6 axisすべてが、両phaseで4種類以上のvalueを要求する固定済みruleをPASSした。最低条件は4 axisだった。

## 6. formal decision（正式判断）

**`FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION`**

formal eligibleとなったrepresentation:

**`CRCLGR-R1-EXACT-SQUASHED-L1`**

canonical Stage 2 scientific resultのSHA-256:

`c43ba119dbbc91f4145129dc5b24e886b0f436b577185cfb54d5f44619e5b0f5`

Stage 2のdurable artifact:

- artifact ID `9896703676`;
- ZIP SHA-256 `614f6b7bb487473c92a609e48b3ecee21ba3d23223e28e425078744310b66787`;
- exact-byte mirror `d1083ca07986fdbe3ab78d6bd4c12850e1200ef8`を保存した。

## 7. 解釈上の境界

このformal decisionは、結果を見る前に固定したCRCLGR coordinate systemが、**固定済みdeterministic pre-root reconstructibility contractで定義したresource-bounded population内で**、再現可能なcontinuous representation instrumentとしてeligibleであることを意味する。

この判断は次を意味しない。

- whole-gameまたはunrestricted state-spaceのcoverage
- strategic regimeとしてのvalidity
- 因果的な解釈
- valueまたはwin probabilityのcalibration
- 人間の戦略概念としての意味
- G3-10のlongitudinal path dependence、directionality、persistence、return、hysteresis

これらはそれぞれ別の科学的な問いである。

## 8. G3-10への帰結

historical G3-10にはvalidated local-geometry coordinateが必要だった。CRCLGRは、明確に限定したresource-eligible domain内で、freshかつformal-eligibleなcoordinate instrumentを提供した。これにより、G3-09後に特定されたrepresentation eligibilityの不足は解消された。

ただし、CRCLGR closure時点のG3-10は、別のcurrent-state authorization reviewにより、endpointを遡及的にredesignせずhistorical dependencyを満たすことを確認し、G3-10 scientific contractを結果確認前に固定するまで**NOT AUTHORIZED**のままとした。そのreviewは後に完了しており、後続状態は`CURRENT_STATUS.md`を参照する。

## 9. protected evidenceと統合状態

```text
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
CRCLGR same-evidence rerun = NOT AUTHORIZED
main integration = NOT AUTHORIZED / NOT PERFORMED
```
