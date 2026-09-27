# G4-09 — Geometry-Conditioned Search Reliability and Exact Agreement Study 1

Program: `Research Generation 4 / G4-09`  
Study ID: `GCSREA-STUDY1`  
Branch: `research/g4-09-search-reliability-exact-agreement`  
状態: **`CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

## 研究の問い

Baoの局所ゲーム木幾何は、search configurationを変えたときのranking / TopSet / PV等の出力安定性とどのように関係するか。また、G4-05で完全解析済みの固定exact microdomainに限った場合、search outputはexact value-preserving / optimal move setとどの条件で一致するか。

本Studyは次の2 moduleを混同しない。

- `GENERAL-SEARCH-STABILITY`: 一般domainではsearch-output stabilityのみを扱い、higher-resource searchをtruthとしない。
- `EXACT-MICRODOMAIN-AGREEMENT`: G4-05の固定8 exact microdomainだけをtruth-bearing oracle domainとして扱う。

## 最終状態

### Module A — GENERAL-SEARCH-STABILITY

Stage 1 one-shot scientific executionはRun `36326278830 / attempt 1`で768 fresh seedsを一度だけ読み、128 rootsを選定した。production / independentはexact agreementだった。

prospective support gate `minimumSearchContrastDefinedRoots=120`に対し、3 search contrastsすべてdefined rootsは109だったため、9/9 geometry×search slotsが`NOT-SUPPORTED-FOR-FORMAL-HOLDOUT`となった。

formal inference、p-value、risk difference、effect directionは計算していない。したがってこれはno-effect resultではなく、**formal Stage 2へ進むためのsupport条件を満たさなかったclosure**である。

候補general Stage 2 namespace `40923001...`は未読のまま封印する。

### Module B — EXACT-MICRODOMAIN-AGREEMENT

G4-05固定8 domainをfinite censusとして、one-shot認可・durable premeasurement leaseの下でactual search-vs-exact measurementを一回だけ実行した。

```text
run = 36359283198 / attempt 1 / success
lease commit = 05bcd129dfc84193bd786a27b9a6adcdeeca88e5
final artifact ID = 10945085978
artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
fixed domains = 8
forced domains = 2
nontrivial domains = 6
search configurations = 6
nontrivial cells = 36
estimable = 36 / 36
```

固定census内の記述結果:

```text
canonical-best ∈ exact optimal set = 36 / 36
PV first move ∈ exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
```

唯一の非EQUALセルは`D2_Q0 × domain 4`だった。exact optimal setが2手であるのに対しsearch TopSetがそのうち1手だけを含んだため`SEARCH-SUBSET-EXACT`となった。canonical-bestとPV firstはいずれもexact optimal set内だった。

production / independentのsearch outputとclassifierは完全一致した。

## 解釈境界

固定8 domainはrandom sampleではない。

- `36/36`をwhole-Bao correctness probability / accuracyへ一般化しない。
- `35/36`を一般的なsearch精度へ変換しない。
- configuration winner / AI strength rankingを選ばない。
- higher-resource searchをtruthとしない。
- geometry因果効果、人間のdifficulty、public AI棋力を主張しない。
- p-value / confidence intervalは計算していない。

## 保護境界

```text
Stage 2 general fresh seed access = 0
G4-05 candidate rescan / replacement = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = not performed
scientific rerun after lease = 0 / not authorized
```

## 読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
3. [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)
4. [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)
5. [`prereg/STAGE_2_EXACT_CENSUS_SPEC.json`](prereg/STAGE_2_EXACT_CENSUS_SPEC.json)
6. [`results/stage-2/STAGE_2_CANONICAL_RECORD.json`](results/stage-2/STAGE_2_CANONICAL_RECORD.json)
7. [`checkpoints/2026-09-28-stage-2-exact-census-complete.md`](checkpoints/2026-09-28-stage-2-exact-census-complete.md)
8. [`../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md`](../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md)

## No-rescue / no-rerun

- Stage 1 support gateを事後緩和しない。
- Module Aのseed extension / replacement / subgroup rescueをしない。
- Stage 2 exact censusをrerunしない。
- G4-05 candidate rescan / replacementをしない。
- 同じStudyへnew exact domainsを追加しない。
- G4-10 depth-11へアクセスしない。
- public AIへ自動反映しない。
