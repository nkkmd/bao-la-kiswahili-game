# G4-09 / GCSREA-STUDY1 — Stage 2 exact census complete

Date: 2026-09-28  
Stage: `GCSREA-S2-EXACT-CENSUS-2026-09-27-v1`  
Disposition: **`STAGE2-EXACT-CENSUS-COMPLETE / FIXED-8 FINITE CENSUS / 36-OF-36 NONTRIVIAL CELLS ESTIMABLE`**

## Canonical scientific execution

```text
workflow run = 36359283198 / attempt 1 / success
code freeze = c1425c6b67d85f4e7f42032fc04aaf968f151454
trigger SHA = d0f276262944edc6fd1143e6b71d6526ad4221c5
lease commit = 05bcd129dfc84193bd786a27b9a6adcdeeca88e5
raw artifact ID = 10945220729
raw artifact ZIP SHA-256 = ef5f36298844fe7b9f6d5a62d478d05131f314cd8e766affe3e6c4cdde5ff600
final artifact ID = 10945085978
final artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
scientific measurements = 1 / 1
scientific rerun = 0
```

Durable leaseはactual search-vs-exact measurementより前にGitHubへcommitされた。今後このworkflowをrerunしてもlease存在確認でmeasurement前に拒否されるため、same-Study scientific rerunは行わない。

## Premeasurement integrity

```text
exact oracle integrity = PASS
exact-oracle core SHA-256 = 924922e5072cfe19facb954ce24cf8207d15a38f3fb861e08a4e4d5f1daf8a7c
fixed domains = 8
actual search-vs-exact measurements before lease = 0
production / independent legal identity = exact
```

G4-05 candidate rescan / replacementは行っていない。

## Fixed census

PopulationはG4-05 / G4-06から固定済みの8 exact microdomainである。

```text
fixed domains = 8
forced width-1 domains = 2
nontrivial width-2 domains = 6
search configurations = 6
nontrivial domain × configuration cells = 36
estimable = 36
non-estimable = 0
```

Forced roots `domain 6` / `domain 8`はpreregistrationどおりsearch helperを呼ばず、合法手が一意であることを別枠で記録した。

## Exact-agreement result

非自明36セルでは:

```text
canonical-best ∈ exact optimal set = 36 / 36
PV first move ∈ exact optimal set = 36 / 36
exact-optimal best rank = rank 1 in 36 / 36
TopSet relation:
  EQUAL = 35
  SEARCH-SUBSET-EXACT = 1
  SEARCH-SUPERSET-EXACT = 0
  OVERLAP = 0
  DISJOINT = 0
```

`35/36`や`36/36`をwhole-Bao accuracy / correctness probabilityとして解釈しない。これは固定された8 microdomain × 6 search configurationsのfinite census内の記述である。

### 唯一のTopSet非一致

```text
configuration = D2_Q0
domainIndex = 4
relation = SEARCH-SUBSET-EXACT
exact optimal set =
  capture:mtaji:1:4:left:::false
  capture:mtaji:1:7:left:::false
search TopSet =
  capture:mtaji:1:4:left:::false
canonical-best exact-optimal = true
PV-first exact-optimal = true
exact-optimal best rank = 1
exact-optimal worst rank = 2
```

したがってこのセルでもsearchがexact-optimalでない手を首位に置いたわけではない。exact oracleが同価値とする2手のうち、search TopSetが一方だけを首位同率集合へ残したため`SEARCH-SUBSET-EXACT`となった。

## Configuration-wise descriptive census

```text
D2_Q1          : EQUAL 6 / 6
D3_Q1          : EQUAL 6 / 6
D2_Q0          : EQUAL 5 / 6, SEARCH-SUBSET-EXACT 1 / 6
D2_Q2          : EQUAL 6 / 6
B256_Q1_MAXD3  : EQUAL 6 / 6
B1024_Q1_MAXD3 : EQUAL 6 / 6
```

全構成でcanonical-best exact-optimal membershipは6/6、PV-first exact-optimal membershipも6/6だった。

## Independent verification and resource boundary

```text
production search executions = 36
independent search executions = 36
total = 72
production / independent search exact = true
production / independent classifier exact = true
structured result verification = PASS
elapsed = 0.55 s
peak RSS = 73556 KiB
result bytes = 68023
```

## Interpretation boundary

このStageで許される結論は、固定8 exact microdomainにおけるsearch outputとexact optimal setの記述的agreementだけである。

以下は主張しない。

- whole-Bao correctness probability / accuracy
- configurationのwinner / strength ranking
- higher-resource searchをtruthとする解釈
- geometryの因果効果
- human difficulty / human error
- public AIの棋力改善または採用根拠

p-value / confidence intervalは計算していない。

## Protected boundaries

```text
general Stage 2 fresh seed reads = 0
candidate namespace 40923001... = unread
G4-05 rescan = 0
G4-05 domain replacement = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = not performed
```

## Canonical record

`doc/geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json`
