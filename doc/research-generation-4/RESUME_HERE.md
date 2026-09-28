# Research Generation 4 — 再開位置

更新日: 2026-09-28  
状態: **`G4-09 MAIN INTEGRATED / G4-10 PROTECTED / NEXT SCIENTIFIC AGENDA NOT AUTHORIZED`**

## 再開時の読む順序

1. remote `main` HEADと[`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
2. [`../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`](../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md)でG4-09 closure状態を確認する。
3. [`../geometry-conditioned-search-reliability-exact-agreement/results/stage-1/STAGE_1_CANONICAL_RECORD.json`](../geometry-conditioned-search-reliability-exact-agreement/results/stage-1/STAGE_1_CANONICAL_RECORD.json)でModule A closure basisを確認する。
4. [`../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json)でModule B exact-census resultを確認する。
5. [`../geometry-conditioned-search-reliability-exact-agreement/checkpoints/2026-09-28-stage-2-exact-census-complete.md`](../geometry-conditioned-search-reliability-exact-agreement/checkpoints/2026-09-28-stage-2-exact-census-complete.md)でrun / artifact / lease / protected boundaryを確認する。
6. [`../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md`](../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md)でclosure decisionを確認する。
7. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)はprospective frozen planとして変更せず参照する。

## 現在地

```text
G4-01 = COMPLETE / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-08 = CLOSED / STAGE2-FORMAL-COMPLETE / 24 NON-ESTIMABLE / MAIN INTEGRATED
G4-09 = CLOSED / MODULE-A NOT ELIGIBLE / MODULE-B FIXED8 EXACT-CENSUS COMPLETE / MAIN INTEGRATED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-09 Module A

Stage 1 canonical run:

```text
run = 36326278830 / attempt 1
fresh reads = 768
selected roots = 128
SC1 / SC2 / SC3 search-defined = 109 / 109 / 109
frozen minimum = 120
formal candidate slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
formal inference = false
```

Module Aは`NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT`として閉鎖。これはno-effect resultではない。

候補general Stage 2 namespace `40923001...`は未読であり、同Studyでは使用しない。

## G4-09 Module B

One-shot exact census:

```text
run = 36359283198 / attempt 1 / success
code freeze = c1425c6b67d85f4e7f42032fc04aaf968f151454
trigger SHA = d0f276262944edc6fd1143e6b71d6526ad4221c5
lease commit = 05bcd129dfc84193bd786a27b9a6adcdeeca88e5
final artifact ID = 10945085978
artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
scientific measurement = 1 / 1
scientific rerun = 0
```

Fixed census result:

```text
fixed exact domains = 8
forced = 2
nontrivial = 6
search configurations = 6
nontrivial cells = 36 / 36 estimable
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
production / independent search exact = true
production / independent classifier exact = true
```

唯一のnon-EQUALは`D2_Q0 × domain 4`の`SEARCH-SUBSET-EXACT`。search TopSetがexact-optimal 2手のうち1手だけを残したもので、canonical-best / PV firstはexact-optimalだった。

この結果をwhole-Bao correctness probabilityへ一般化しない。

## Protected boundary

```text
Stage 2 general fresh reads = 0
G4-05 rescan = 0
G4-05 replacement = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = COMPLETE / FAST-FORWARD
```

Durable leaseが存在するため、Stage 2 exact censusはrerunしない。

## 次の作業

G4-09 scientific execution・closure・pre-main consistency audit・`main`統合は完了した。G4-09に対する追加科学実行やsame-Study rescueは行わない。

次のscientific agendaは未認可である。G4-10も引き続き別authorizationなしにアクセスしない。新しい研究へ進む場合はfresh evidence access前に独立authorization reviewを行う。

## No-rescue / protected boundary

- closed Studyのrerun / rescue禁止。
- G4-09 Module A support threshold relaxation禁止。
- G4-09 Module A seed extension / replacement / subgroup rescue禁止。
- G4-09 Stage 2 exact-census rerun禁止。
- fixed-eight resultのwhole-Bao一般化禁止。
- G3-11 depth-10 rerun禁止。
- G4-10 depth-11 access禁止。
- public AIへの自動反映禁止。
