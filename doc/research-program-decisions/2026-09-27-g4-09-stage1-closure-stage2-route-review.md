# G4-09 / GCSREA-STUDY1 — Stage 1 closure and Stage 2 route review

Date: 2026-09-27  
Agenda: `G4-09`  
Study: `GCSREA-STUDY1`

## Decision

**`STAGE1-CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-AUTHORIZED-FOR-PREREGISTRATION-AND-TECHNICAL-PREFLIGHT-ONLY`**

このreviewはStage 1を閉じ、次の作業範囲だけを認可する。

1. `GENERAL-SEARCH-STABILITY`はformal Stage 2へ進めない。
2. candidate Stage 2 general-domain seed namespaceは未読のまま封印する。
3. `EXACT-MICRODOMAIN-AGREEMENT`は、G4-05固定8 domainを対象とするfinite-census設計のpreregistrationとtechnical preflightだけを認可する。
4. actual search-vs-exact measurementはまだ認可しない。
5. G4-10 depth-11、public AI変更、main統合は認可しない。

## Stage 1 basis

Canonical scientific execution:

```text
run = 36326278830 / attempt 1
artifact ID = 10934387075
artifact ZIP SHA-256 = 2ee8edf9c988de7a721f14887181b80bf517e810a2d49f6d429228eeeb425cd0
fresh reads = 768
selected roots = 128
production / independent exact = true
formal inference = false
```

元workflowの最終failureは、raw JSONの`pValuesComputed:false`を禁止substring `pValue`として拾ったpost-execution verifier false positiveだった。scientific runはrerunしていない。

Artifact-only audit:

```text
run = 36327949203 / attempt 1 / success
artifact ID = 10935245092
artifact ZIP SHA-256 = 28e42a14789dcb25e1c7133b888d31e384cbcfade3d97b01099ba373c318fc15
disposition = STAGE1-POSTEXECUTION-ARTIFACT-AUDIT-PASS
fresh scientific reads by audit = 0
scientific rerun = false
```

## Module A closure

Frozen support gateの`minimumSearchContrastDefinedRoots=120`に対し、3 search contrastsすべてでdefined rootsは109だった。

```text
SC1-DEPTH = 109
SC2-NODE-BUDGET = 109
SC3-QUIESCENCE = 109
formal geometry x search slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
```

他のsupport条件をpost-hocに緩和しない。seed extension、replacement、search-grid変更、threshold変更、subgroup rescueも行わない。

したがってModule Aは`NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT`として閉じる。

これはsearch stabilityとgeometryの関係が存在しないことを意味しない。Stage 1ではeffect direction、risk difference、association p-valueを計算していない。

## General Stage 2 seed boundary

候補として予約していた`40923001`開始namespaceは、Module Aがsupport gateを通らなかったため使用しない。

```text
Stage 2 general fresh seed reads = 0
seed extension = NOT AUTHORIZED
replacement population = NOT AUTHORIZED
same-study rescue = NOT AUTHORIZED
```

このnamespaceを別目的に流用する場合は別Study / 別authorizationを要求する。

## Module B route

Module BはStage 1でactual search-vs-exact valuesを一切観測していない。固定8 domainのoracle integrityだけを再検証し、全domainでupstream canonical recordと一致した。

次段階では、**G4-05で既に固定された8 domainだけをfinite censusとして扱う**。

許可する準備作業:

- exact-census Stage IDの固定
- fixed-8 manifest binding
- search configuration familyの固定
- exact-agreement endpoint semanticsの固定
- production / independent implementation binding
- output schema / digestの固定
- resource ceilingの固定
- actual measurement前のtechnical preflight

まだ許可しないもの:

- fixed 8に対するactual search execution
- exact agreement counts / ratesの観測
- new exact domainの追加
- G4-05 candidate rescan / replacement
- G4-10 depth-11 access
- whole-Bao correctness probabilityへの一般化
- public AI変更

## Required exact-census interpretation boundary

固定8はG4-05で成立したeligible microdomainのfinite setであり、random sampleではない。

したがって将来のexact module結果は:

- 8 domain内のfinite-census agreementとして報告する。
- `x/8`をwhole-Bao probability estimateとして扱わない。
- higher-resource searchをtruthとして扱わず、truthはexact oracleだけに限定する。
- search configuration間の差をAI strength一般へ直結させない。

## Protected boundaries

```text
G4-10 depth-11 access = 0
public AI change = false
main integration = not authorized
```

## Next authorized work

**Module B exact-census preregistration + technical preflight only.**

actual search-vs-exact measurementを開始する前に、別のfinal measurement authorization reviewを必須とする。
