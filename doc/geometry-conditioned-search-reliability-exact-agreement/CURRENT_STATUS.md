# G4-09 / GCSREA-STUDY1 — Current Status

Date: 2026-09-28  
Branch: `research/g4-09-search-reliability-exact-agreement`

## Current disposition

**`G4-09 CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

GCSREA-STUDY1の科学実行は完了し、same-Studyで追加実行しない。

## Module A — GENERAL-SEARCH-STABILITY

Stage 1 one-shot scientific execution:

```text
run = 36326278830 / attempt 1
artifact ID = 10934387075
artifact ZIP SHA-256 = 2ee8edf9c988de7a721f14887181b80bf517e810a2d49f6d429228eeeb425cd0
fresh scientific reads = 768
selected roots = 128
production / independent exact = true
scientific rerun = 0
```

Frozen support gateに対し:

```text
SC1-DEPTH defined = 109
SC2-NODE-BUDGET defined = 109
SC3-QUIESCENCE defined = 109
minimum required = 120
formal candidate slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
formal inference performed = false
```

したがってModule Aはformal Stage 2へ進めない。これはno-effect resultではない。

候補Stage 2 general-domain namespace `40923001...` は未読のまま封印する。

## Module B — EXACT-MICRODOMAIN-AGREEMENT

Stage 2 fixed-eight exact censusはone-shot認可とdurable premeasurement leaseの下で完了した。

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

Fixed finite census:

```text
fixed G4-05 exact domains = 8
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

Exact-agreement summary within the fixed census:

```text
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
TopSet SUPERSET / OVERLAP / DISJOINT = 0
```

唯一のTopSet非一致は`D2_Q0 × domain 4`の`SEARCH-SUBSET-EXACT`である。exact optimal setの2手のうちsearch TopSetが1手だけを含んだが、canonical-bestとPV firstはexact optimal set内にあり、exact-optimal best rankは1だった。

Forced roots `domain 6` / `domain 8`はpreregistrationどおりsearch helperを実行せず、別枠でforced legal classificationを記録した。

## Interpretation boundary

固定8 domainはrandom sampleではない。したがって`36/36`や`35/36`をwhole-Bao correctness probability / accuracyへ一般化しない。

```text
p-values = not computed
confidence intervals = not computed
configuration winner = not selected
whole-Bao probability estimate = not computed
higher-resource search treated as truth = false
public AI adoption authorized = false
```

## Protected boundaries

```text
Stage 2 general-domain fresh access = 0
candidate namespace 40923001... = unread
G4-05 candidate rescan = 0
G4-05 domain replacement = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = COMPLETE / FAST-FORWARD
```

## Canonical records

1. [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)
2. [`results/stage-2/STAGE_2_CANONICAL_RECORD.json`](results/stage-2/STAGE_2_CANONICAL_RECORD.json)
3. [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)
4. [`checkpoints/2026-09-28-stage-2-exact-census-complete.md`](checkpoints/2026-09-28-stage-2-exact-census-complete.md)
5. [`../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md`](../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md)

## Next

G4-09に対する追加科学実行は行わない。pre-main consistency auditと`main`へのnon-force fast-forward統合は完了している。

同Studyをreopen / rerun / rescueしない。新しいscientific agendaへ進む場合は別Study / 別authorizationを必要とする。G4-10 depth-11は引き続き別authorizationなしにアクセスしない。
