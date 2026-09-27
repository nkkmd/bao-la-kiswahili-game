# Research Generation 4 — 現在の状態

更新日: 2026-09-28  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01..G4-08 MAIN INTEGRATED / G4-09 CLOSED ON RESEARCH BRANCH / G4-10 PROTECTED`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-08 = CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / MAIN INTEGRATED
G4-09 = CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE / NOT YET MAIN INTEGRATED
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized by RG4 = false
```

## G4-01〜G4-08

G4-01〜G4-08は各Studyのno-rescue / protected-boundaryを保持したまま研究完了し、`main`へ統合済み。

主要な最終状態:

- `G4-01`: `COMPATIBILITY-ELIGIBLE-ALL`
- `G4-02`: `CLOSED / NO SCIENTIFIC DECISION`
- `G4-03`: 12 tests = 9 `GENERALIZATION-CONFIRMED` / 1 `NOT-GENERALIZED` / 2 `NON-ESTIMABLE`
- `G4-04`: 8 / 8 `GENERALIZATION-CONFIRMED`
- `G4-05`: 8 complete exact microdomains
- `G4-06`: 12 / 12 relations emitted within frozen N=8 microdomains
- `G4-07`: 16-slot formal family = 6 `REVERSAL-CONFIRMED` / 10 `NOT-CONFIRMED`
- `G4-08`: 24 / 24 `NON-ESTIMABLE` / no directional scientific conclusion

詳細は各Studyのcanonical recordとclosure recordを参照する。これらの結果をwhole-Bao law、AI strength、人間のdifficultyへ拡張しない。

## G4-09 — search reliability / exact agreement

Study: `GCSREA-STUDY1`  
Branch: `research/g4-09-search-reliability-exact-agreement`

### Module A — GENERAL-SEARCH-STABILITY

Stage 1はfresh developmentをone-shotで完了した。

```text
run = 36326278830 / attempt 1
fresh reads = 768
selected roots = 128
production / independent exact = true
minimum search-contrast-defined roots = 120
SC1 / SC2 / SC3 defined roots = 109 / 109 / 109
formal candidate slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
formal inference = false
```

したがってModule Aは`NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT`として閉じた。これはno-effect resultではない。候補general Stage 2 namespace `40923001...`は未読のまま封印する。

### Module B — EXACT-MICRODOMAIN-AGREEMENT

G4-05固定8 exact microdomainをfinite censusとして、one-shot認可とdurable leaseの下でStage 2 actual measurementを完了した。

```text
run = 36359283198 / attempt 1 / success
code freeze = c1425c6b67d85f4e7f42032fc04aaf968f151454
trigger SHA = d0f276262944edc6fd1143e6b71d6526ad4221c5
lease commit = 05bcd129dfc84193bd786a27b9a6adcdeeca88e5
final artifact ID = 10945085978
artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
scientific measurements = 1 / 1
scientific rerun = 0
```

Fixed census:

```text
fixed domains = 8
forced width-1 domains = 2
nontrivial domains = 6
search configurations = 6
nontrivial domain×configuration cells = 36
estimable = 36 / 36
production / independent search exact = true
production / independent classifier exact = true
```

Descriptive exact agreement within the fixed census:

```text
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
TopSet SUPERSET / OVERLAP / DISJOINT = 0
```

唯一のnon-EQUAL cellは`D2_Q0 × domain 4`で、exact-optimal 2手のうちsearch TopSetが1手だけを残す`SEARCH-SUBSET-EXACT`だった。canonical-best / PV firstはいずれもexact optimal set内だった。

固定8はrandom sampleではないため、`36/36`や`35/36`をwhole-Bao accuracy / correctness probabilityへ一般化しない。configuration winnerも選ばない。

### G4-09 closure

G4-09は以下で閉じる。

**`CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

same-Studyでseed extension、threshold relaxation、replacement、exact rerun、new exact domain追加を行わない。

Canonical records:

- [`../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`](../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md)
- [`../geometry-conditioned-search-reliability-exact-agreement/results/stage-1/STAGE_1_CANONICAL_RECORD.json`](../geometry-conditioned-search-reliability-exact-agreement/results/stage-1/STAGE_1_CANONICAL_RECORD.json)
- [`../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../geometry-conditioned-search-reliability-exact-agreement/checkpoints/2026-09-28-stage-2-exact-census-complete.md`](../geometry-conditioned-search-reliability-exact-agreement/checkpoints/2026-09-28-stage-2-exact-census-complete.md)
- [`../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md`](../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md)

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-04` | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| `G4-05` | `COMPLETE / EXACT-ORACLE-FOUNDATION / MAIN INTEGRATED` |
| `G4-06` | `COMPLETE / FORMAL-BRIDGE-MAPPING / MAIN INTEGRATED` |
| `G4-07` | `COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED` |
| `G4-08` | `CLOSED / FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-09` | `CLOSED / MODULE-A NOT ELIGIBLE / MODULE-B FIXED8 EXACT-CENSUS COMPLETE / NOT YET MAIN INTEGRATED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-09のscientific executionは閉じた。次はG4-09 branchのcurrent-facing文書、canonical records、branch scope、`public/`差分、G4-10保護境界を最終監査し、`main`統合可否を判断する段階である。

G4-10は引き続きprotectedであり、G4-09 closureや将来のmain統合によって自動認可されない。depth-11へ進む場合は別の明示的authorization reviewが必須である。

## 保護境界

- closed Studiesをrepair / reopen / rerunしない。
- G4-08 Stage 2のfreshness exhaustionをno-effect resultへ読み替えない。
- G4-09 Module A support gateを緩和しない。
- G4-09候補general Stage 2 namespace `40923001...`を同Studyで読まない。
- G4-09 fixed-8 exact censusをrerunしない。
- G4-09 fixed-8結果をwhole-Bao correctness probabilityへ一般化しない。
- G3-11 depth-10をrerunしない。
- G4-10 depth-11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — prospective frozen plan
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../geometry-conditioned-search-reliability-exact-agreement/README.md`](../geometry-conditioned-search-reliability-exact-agreement/README.md)
- [`../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`](../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md)
- [`../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md`](../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md)
