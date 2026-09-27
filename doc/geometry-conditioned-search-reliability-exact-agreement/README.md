# G4-09 — Geometry-Conditioned Search Reliability and Exact Agreement Study 1

Program: `Research Generation 4 / G4-09`  
Study ID: `GCSREA-STUDY1`  
Branch: `research/g4-09-search-reliability-exact-agreement`  
状態: **`STAGE1-CLOSED / MODULE-A-NOT-ELIGIBLE / MODULE-B-EXACT-CENSUS-PREPARATION`**

## 研究の問い

Baoの局所ゲーム木幾何は、search configurationを変えたときのranking / TopSet / PV等の出力安定性とどのように関係するか。また、G4-05で完全解析済みの固定exact microdomainに限った場合、search outputはexact value-preserving / optimal move setとどの条件で一致するか。

本Studyは次の2 moduleを混同しない。

- `GENERAL-SEARCH-STABILITY`: 一般domainではsearch-output stabilityのみを扱い、higher-resource searchをtruthとしない。
- `EXACT-MICRODOMAIN-AGREEMENT`: G4-05の固定8 exact microdomainだけをtruth-bearing oracle domainとして扱う。

## 現在地

Stage 0 technical validationとStage 1 developmentは完了した。

Stage 1 one-shot scientific executionはRun `36326278830 / attempt 1`で768 fresh seedsを一度だけ読んだ。128 rootsを選定し、production / independent exact agreementを確認した。

Module Aではprospective support gate `minimumSearchContrastDefinedRoots=120`に対し、3 contrastsすべて`109`だったため、9/9 geometry×search slotsが`NOT-SUPPORTED-FOR-FORMAL-HOLDOUT`となった。formal inference、p-value、risk difference、effect directionは計算していないため、これはno-effect resultではない。

元workflowの最終failureは`pValuesComputed:false`を禁止substring `pValue`として拾ったpost-execution verifier false positiveだった。scientific runはrerunせず、artifact-only audit Run `36327949203 / attempt 1`で検証しPASSした。

Module BはG4-05固定8 domainのoracle integrityまでPASSしているが、actual search-vs-exact measurementは0のままである。現在認可されているのは、その固定8をfinite censusとして扱うpreregistrationとtechnical preflightまで。

## 現在の境界

```text
Module A formal Stage 2 = NOT ELIGIBLE
Stage 2 general fresh seed access = 0
candidate namespace 40923001... = UNREAD
Module B actual fixed-8 search-vs-exact measurement = NOT YET AUTHORIZED
G4-05 candidate rescan / replacement = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = not performed
```

## 読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
3. [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
4. [`prereg/STAGE_1_DEVELOPMENT_SPEC.json`](prereg/STAGE_1_DEVELOPMENT_SPEC.json)
5. [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)
6. [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)
7. [`../research-program-decisions/2026-09-27-g4-09-stage1-closure-stage2-route-review.md`](../research-program-decisions/2026-09-27-g4-09-stage1-closure-stage2-route-review.md)

## 保護境界

- G2-02をrepair / rescueしない。
- G4-03のscientific evidenceを再利用しない。
- G4-05のcandidate rescan、replacement、STATE-LIMIT rescueをしない。
- G4-06 relation resultをthreshold選択へ使用しない。
- Stage 1 support gateを事後緩和しない。
- Module Aのseed extension / replacement / subgroup rescueをしない。
- G4-10 depth-11へアクセスしない。
- fixed 8 exact censusをwhole-Bao correctness probabilityへ一般化しない。
- public AIへ自動反映しない。
