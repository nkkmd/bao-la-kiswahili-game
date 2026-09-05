# CLGR-STUDY1 — 最終報告

日付: 2026-09-03

## 1. 最終判断

**`CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Research Generation 3における位置づけ: **G3-09 — Continuous Local-Geometry Representation Study 1**。

formal representation eligibilityは**確立されなかった**。Stage 1 developmentは結果を見る前に固定したgateをPASSしたが、exactly-onceのfresh Stage 2 formal executionは、必須のdepth-5 RAW enumeration中にfail closedした。fresh Stage 2 evidenceへのアクセス後にfailureが発生したため、rerunやrescueを行わずStudyを閉じた。

## 2. 研究の問いとclaim boundary

本Studyは、bounded RAW local game-tree geometryをbinary candidateまたはdiscrete event classへ早期に縮約せず、再現可能なcontinuous multiaxial representationとして保持できるかを検証した。

唯一のprimary representationは、結果を見る前に次のとおり固定した。

`CLGR-R1-EXACT-SQUASHED-L1`

このrepresentationは、formal-eligibleな`LGTGMIV-STUDY1`のF1〜F5 measurement foundationから、RAW-only relative depth 5で導出した6 exact axisを用いる。各非負exact rational axis value `q=n/d`はdata-independentに`n/(n+d)`へ変換し、axis weightを等しくしてexact L1 distanceを使用した。learned weight、PCA、clustering、z-score、phase-specific scaling、development後のfeature selection、その他のdata-dependentなrepresentation family selectionは認めなかった。

本Studyは、win probability、人間にとっての難しさ、best moveの正しさ、causal mechanism、strategic regime validity、game-theoretic forcingを検証または主張していない。

## 3. upstreamとprotected evidenceの境界

immutable upstream stateとして次を維持した。

- `LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`
- eligible measurement familyはF1〜F5である
- representation = RAW-only
- relative depth = 5
- validated transform set = `[]`
- G3-08 partial Stage 1 measurementをG3-09 scientific inputとして使用することは禁止した
- G3-08 `relay-limit` knowledge = technical-design-only
- G3-04 / G3-07 formal outcomeはcontextに限り、representation-selection inputには使用しない

standard-initial complete exact RAW depth-10 holdoutは、次の状態を維持した。

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

この状態はStudy全体を通じて変わらなかった。

## 4. 結果を見る前に固定したStudy contract

reviewしたbaseline remote `main`:

`6c218b9cc3f492fb96d051768702682fef9bb66a`

research branch:

`research/g3-09-continuous-local-geometry-representation`

formal Stage:

- `CLGR-S0-TECHNICAL-2026-09-03-v1` / technical-only
- `CLGR-S0-TECHNICAL-2026-09-03-v2` / fresh evidence前のv1 technical failure後に作成したtechnical-only replacement version
- `CLGR-S1-DEVELOPMENT-2026-09-03-v1`
- `CLGR-S2-FORMAL-2026-09-03-v1`

scientific seed namespace:

- Stage 1 = `31910001..31910256`
- Stage 2 = `31920001..31920384`

technical seed `31909001..31909008`はscientific useから恒久的に除外した。

## 5. Stage 0の結果

Stage 0 v1は、synthetic relay-limit negative-controlの期待値がimplementation error stringへ過度に依存していたため、fresh scientific access前にfailedした。v1は再実行していない。

scientific contractの境界を越えておらず、Stage 1 / Stage 2 seedも未読だったため、representation、feature universe、scientific population、seed namespace、gate、resource ceilingを変更せず、別versionのfresh-free technical v2を許可した。

Stage 0 v2:

```text
workflow run = 33748876201
result artifact = 9890713293
artifact ZIP SHA-256 = 4f5b63b30146aa97b30f5adfa2b615eb360cba77236d6288042b2c320c72041b
stage disposition = STAGE0-PASS
fresh Stage 1 access = false
fresh Stage 2 access = false
protected depth-10 access = false
```

technical fixtureについて、bounded depth-5 reconstruction、6 axis、transformed coordinate、exact L1 distanceがproduction / independent implementation間でexactに一致した。

## 6. Stage 1 developmentの結果

fresh Stage 1は、fresh-free static preauthorization auditがPASSした後にだけ別途authorizeした。authorizationはexactly one executionだけを許可し、seed extension、root replacement、same-evidence rerun、Stage 2 access、protected depth-10 accessを明示的に禁止した。

exactly-onceのStage 1 execution:

```text
workflow run = 33750400172
result artifact = 9891394814
lease artifact = 9891283252
artifact ZIP SHA-256 = 6a8ebc0d242027ad6a634555a290df1284626839e4397e87b06551e2fc726fc9
population = 24 Namua + 24 Mtaji = 48
stage disposition = STAGE1-PASS
stage2Eligible = true
canonical scientific result SHA-256 = 1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529
```

結果を見る前に固定したdevelopment gateは次のとおりPASSした。

- populationは48/48 completeだった
- 6 axisすべてを定義できた
- production / independent RAW reconstructionがexactに一致した
- production / independent coordinateがexactに一致した
- full pairwise exact L1 distance matrixがexactに一致した
- `k=3` tie-inclusive neighborhoodがexactに一致した
- root-order invarianceがexactだった
- distinct coordinate vectorはNamua 24 / Mtaji 24で、それぞれminimum 8を上回った
- 両phaseで少なくとも4種類のvalueを持つaxisは6/6で、minimum 4を上回った

Stage 1はdevelopment evidenceに限られる。Stage 1のPASS自体はformal eligible representationを確立せず、Stage 2を自動的にauthorizeもしない。

## 7. Stage 2のformal authorization

Stage 1のexact-byte mirroringとidentity-only exclusion materializationの後、Stage 2を別途reviewした。

Stage 2 formal inputには、Stage 1 coordinate value、favorable axis direction、learned weight、refitしたrepresentation familyを残していない。Stage 1から引き継いだのは、結果を見る前に許可したformal eligibility gate resultと、evidence overlapを防ぐために必要な48-root identity exclusionだけである。

fresh-free Stage 2 preauthorization auditの記録:

```text
workflow run = 33751580785
audit artifact = 9891748675
audit disposition = STAGE2-PREAUTH-STATIC-AUDIT-PASS
fresh Stage 2 seed access = false
protected depth-10 access = false
```

formal populationは36 Namua + 36 Mtaji = 72 rootで固定し、execution ceilingはexactly oneのまま維持した。

## 8. Stage 2のformal result

exactly-onceのfresh Stage 2 execution:

```text
workflow run = 33751818456
result artifact = 9892142995
lease artifact = 9891829617
artifact ZIP SHA-256 = 7fbb28407a1233911b581875c76bef44287cd5f21cc63ab7405f3ec621c94e26
formal-result JSON SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
selected population = 36 Namua + 36 Mtaji = 72
completed root measurements before fail-closed = 61
formal decision = TECHNICAL-INVALID
scientific summary authorized = false
same-evidence rerun authorized = false
protected depth-10 access = false
```

必須のexact depth-5 RAW reconstructionはformal root index 61でfailedした。

```text
phase = mtaji
source seed = 31920066
root RAW SHA-256 = e2260d76b2f40fa24ebe2183ca0cc865f48dc7c951737414ef8c498143b8087c
technical error = relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b
```

これはtechnical execution failureであり、continuous representationがscientifically eligibleまたはnot eligibleであることのevidenceではない。

61件のpartial formal measurementからformal nondegeneracy summary、phase comparison、downstream usefulness claim、representation-level scientific inferenceを導出してはならない。

## 9. exact artifactの保存

Stage 2のimmutable Actions artifactはexact hashで検証し、次へmirrorした。

`results/stage-2/`

technical-only mirror run `33752894852`を用いた。mirror workflowはscientific recomputationをauthorizeまたはexecuteしていない。

正本となるStage 2 fileは次を含む。

- `results/stage-2/STAGE_2_SELECTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-2/STAGE_2_FORMAL_RESULT.json`

closure時点のformal-result repository blob SHAは、workflow / artifact provenanceとともに`REPRODUCIBILITY_INDEX.md`へ記録した。

## 10. 科学的解釈

Study-levelで正しく述べられる解釈は次のとおりである。

**結果を見る前に固定したcontinuous representationはfresh development gateをPASSしたが、fresh formal holdoutを完了できなかった。したがってformal eligibilityは未確立のままである。**

次の結論を導くことは禁止する。

- `CLGR-R1-EXACT-SQUASHED-L1`がformally eligibleである
- `CLGR-R1-EXACT-SQUASHED-L1`がformally not eligibleである
- 61件のpartial Stage 2 rootがいずれかのaxisをvalidateまたはinvalidateする
- Stage 2 partial measurementがphase differenceまたはneighborhood stabilityを確立する
- `CLGR-STUDY1`内でfailureをrepairできる

Stage 1 development PASSはimmutable Study provenanceの一部として残るが、failedしたformal holdoutの代わりにはならない。

## 11. no-rescue boundary（救済的変更を禁止する境界）

Stage 2 fresh accessは実施済みで、seed blockも消費済みである。`CLGR-STUDY1`では次を恒久的に禁止する。

- same-evidence rerun
- relay-limit handlingを変更した後のseed `31920066`再実行
- seedのextensionまたはreplacement
- root replacement
- resource ceilingのrelaxation
- featureの追加または削除
- normalizationまたはtransformの変更
- weightingの変更
- distance metricの変更
- representation familyの変更
- formal endpointまたはnondegeneracy gateの変更
- favorable subgroup selection
- 61件のpartial formal measurementをcomplete formal sampleとして使用すること

将来relay-limit-safeなcontinuous-representation Studyを行う場合は、新しいprospective independent Study / versionと別個のauthorizationが必要である。これを`CLGR-STUDY1`のcompletionまたはrepairとして説明してはならない。

## 12. downstream programの境界

historical `PROGRAM_PLAN.md`は変更していない。

G3-09はformally validated continuous representationを確立しなかったため、このclosureによってG3-10が**自動的にauthorizeされることはない**。G3-10のactionには、validated local-geometry coordinateへのdependencyを満たしたか、新しいprerequisiteが必要かを検討する、別個のpost-G3-09 current-state authorization reviewが必要である。

このreportはG3-10 scientific executionについてdecisionを行わない。

## 13. 最終closure

```text
G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = TECHNICAL-INVALID / PRE-FRESH / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 1 = STAGE1-PASS / exactly one fresh execution / seed block consumed
Stage 2 = TECHNICAL-INVALID / exactly one fresh execution / seed block consumed
formal continuous-representation eligibility = NOT ESTABLISHED
Stage 2 partial formal scientific reuse = PROHIBITED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

これによりresearch branch上でscientific Studyを閉じた。repository / document consistency reviewは進められるが、`main`へのintegrationには明示的なユーザー指示を必要とした。その指示に基づく統合は後に完了しており、現在状態は`CURRENT_STATUS.md`を参照する。
