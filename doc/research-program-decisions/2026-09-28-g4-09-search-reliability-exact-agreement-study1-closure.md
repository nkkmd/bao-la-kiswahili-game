# G4-09 / GCSREA-STUDY1 — Study closure review

Date: 2026-09-28  
Agenda: `G4-09`  
Study: `GCSREA-STUDY1`

## Decision

**`G4-09 CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

GCSREA-STUDY1の科学実行をここで閉じる。

- `GENERAL-SEARCH-STABILITY`はStage 1のprospective support gateを満たさなかったため、general-domain formal holdoutへ進まない。
- `EXACT-MICRODOMAIN-AGREEMENT`はG4-05固定8 exact microdomainのfinite censusを、一回限りの認可・durable leaseの下で完了した。
- 追加seed、replacement population、threshold relaxation、same-Study rescue、scientific rerunは行わない。
- G4-10 depth-11、public AI変更、main統合はこのclosureでは認可しない。

## Module A closure basis

Stage 1 canonical scientific execution:

```text
run = 36326278830 / attempt 1
artifact ID = 10934387075
artifact ZIP SHA-256 = 2ee8edf9c988de7a721f14887181b80bf517e810a2d49f6d429228eeeb425cd0
fresh reads = 768
selected roots = 128
production / independent exact = true
```

Frozen support gate `minimumSearchContrastDefinedRoots=120`に対し、SC1/SC2/SC3はいずれも109だった。

```text
formal candidate slots = 9
SUPPORTED-FOR-FORMAL-HOLDOUT = 0
NOT-SUPPORTED-FOR-FORMAL-HOLDOUT = 9
formal inference = false
```

これはsearch stabilityとgeometryの関係が存在しないことを示すnegative scientific resultではない。formal holdoutへ進むための事前support条件を満たさなかった、というclosureである。

候補general Stage 2 namespace `40923001...`は未読のまま封印する。

## Module B completion basis

Stage 2 exact census:

```text
run = 36359283198 / attempt 1 / success
code freeze = c1425c6b67d85f4e7f42032fc04aaf968f151454
trigger SHA = d0f276262944edc6fd1143e6b71d6526ad4221c5
lease commit = 05bcd129dfc84193bd786a27b9a6adcdeeca88e5
final artifact ID = 10945085978
final artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
scientific measurements = 1 / 1
scientific rerun = 0
```

Population / execution:

```text
fixed exact domains = 8
forced width-1 domains = 2
nontrivial domains = 6
search configurations = 6
nontrivial domain×configuration cells = 36
estimable = 36 / 36
production search executions = 36
independent search executions = 36
production / independent search exact = true
production / independent classifier exact = true
```

Descriptive exact agreement within this fixed census:

```text
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
TopSet SUPERSET / OVERLAP / DISJOINT = 0
```

唯一のnon-EQUAL cellは`D2_Q0 × domain 4`で、exact-optimal 2手のうちsearch TopSetが1手だけを含む`SEARCH-SUBSET-EXACT`だった。canonical-bestとPV firstはいずれもexact optimal set内にあり、exact-optimal best rankは1だった。

## Scientific interpretation

Module Bの結果は、**G4-05で固定済みの8 microdomainを対象としたfinite census**である。

したがって:

- `36/36`をBao全体のcorrectness probability / accuracyへ変換しない。
- `35/36` TopSet equalityを一般化されたsearch精度として扱わない。
- configuration間の記述差からwinner / AI strength rankingを選ばない。
- higher-resource searchをtruthとみなさない。truth-bearing constructはfixed exact oracleに限定する。
- geometryの因果効果、人間のdifficulty、public AIの棋力向上を主張しない。
- p-value / confidence intervalは計算していない。

## No-rescue / no-rerun closure

G4-09を追加科学実行で救済・拡張しない。

```text
Module A seed extension = NOT AUTHORIZED
Module A threshold relaxation = NOT AUTHORIZED
Module A replacement / subgroup rescue = NOT AUTHORIZED
Stage 2 exact rerun = NOT AUTHORIZED
G4-05 rescan / replacement = NOT AUTHORIZED
new exact domains under same Study = NOT AUTHORIZED
```

新しい問いを追う場合は別Study / 別authorizationを要求する。

## Protected boundaries at closure

```text
Stage 2 general fresh seed reads = 0
G4-05 candidate rescan = 0
G4-05 domain replacement = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = not performed
```

## Canonical records

- `doc/geometry-conditioned-search-reliability-exact-agreement/results/stage-1/STAGE_1_CANONICAL_RECORD.json`
- `doc/geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json`
- `doc/geometry-conditioned-search-reliability-exact-agreement/checkpoints/2026-09-27-stage-1-development-complete.md`
- `doc/geometry-conditioned-search-reliability-exact-agreement/checkpoints/2026-09-28-stage-2-exact-census-complete.md`

## Integration boundary

このclosureはresearch branch上の科学実行を閉じるだけであり、`main`への統合を自動認可しない。main統合前にはcurrent-facing文書、canonical records、branch scope、public/差分、G4-10保護境界を別途最終監査する。
