# Research Generation 4 — 入口

更新日: 2026-09-28  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01..G4-09 MAIN INTEGRATED / G4-10 PROTECTED`**

## このProgramが調べること

第四世代研究は、Research Generation 3で測定可能になったbounded RAW local game-tree geometryについて、主に次を検証する。

1. 別phase、root family、source policy、rule contextへどこまで移送できるか。
2. 完全解析可能な限定domainでexact game-theoretic consequenceとどう関係するか。
3. 時間的持続、rule-semantic event、search reliabilityとどう結びつくか。

第三世代のclosed Studyをrepairまたは再判定するProgramではない。各Studyはfresh evidence、事前登録、独立検証、no-rescue boundaryを用いる。

## 現在の状態

| Wave | Agenda | 目的 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim-transfer compatibility instrument | `COMPLETE / MAIN INTEGRATED` |
| A | `G4-02` | corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| A | `G4-03` | width / search-ranking transfer | `COMPLETE / MAIN INTEGRATED` |
| A | `G4-04` | geometry-trajectory transfer | `COMPLETE / 8-OF-8 GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| B | `G4-05` | exact microdomain oracle foundation | `COMPLETE / MAIN INTEGRATED` |
| B | `G4-06` | geometry / exact consequence bridge | `COMPLETE / MAIN INTEGRATED` |
| C | `G4-07` | multiscale memory / return | `COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED` |
| C | `G4-08` | rule-semantic geometry transition | `CLOSED / 24-OF-24 NON-ESTIMABLE / MAIN INTEGRATED` |
| C | `G4-09` | search reliability / exact agreement | `CLOSED / MODULE-A NOT ELIGIBLE / MODULE-B FIXED8 EXACT-CENSUS COMPLETE / MAIN INTEGRATED` |
| D | `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT AUTHORIZED / NOT ACCESSED` |
| 独立 | `G4-P01` | canonicalization re-foundation | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | human / expert evidence | `DEFERRED` |

Public AI change authorized by RG4 = `false`。

## G4-01〜G4-08

G4-01〜G4-08は研究実行と文書closureを完了し、`main`へ統合済み。詳細は各Studyのcanonical recordを参照する。

- G4-01: `COMPATIBILITY-ELIGIBLE-ALL`
- G4-02: `CLOSED / NO SCIENTIFIC DECISION`
- G4-03: 12 tests = 9 `GENERALIZATION-CONFIRMED` / 1 `NOT-GENERALIZED` / 2 `NON-ESTIMABLE`
- G4-04: 8 / 8 `GENERALIZATION-CONFIRMED`
- G4-05: fixed late-game microdomains内でexact-oracle foundation確立
- G4-06: fixed 8 exact microdomains内でgeometry / exact-consequence mapping完了
- G4-07: 16-slot family = 6 `REVERSAL-CONFIRMED` / 10 `NOT-CONFIRMED`
- G4-08: 24 / 24 `NON-ESTIMABLE` / no directional scientific conclusion

これらをwhole-Bao universal law、public AI adoption、human difficultyへ自動拡張しない。

## G4-09 — search reliability / exact agreement

G4-09 `GCSREA-STUDY1` は、一般domainでのsearch-output stabilityと、fixed exact microdomainでのexact agreementを分離して扱った。

### Module A

Stage 1では768 fresh seedsから128 rootsを選定したが、3 search contrastsすべてでdefined rootsが109となり、事前固定minimum 120を満たさなかった。

```text
formal candidate slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
formal inference = false
```

したがってgeneral-domain formal holdoutへ進まない。これはno-effect resultではない。候補Stage 2 namespace `40923001...`は未読のまま封印する。

### Module B

G4-05固定8 exact microdomainをfinite censusとして一度だけ測定した。

```text
run = 36359283198 / attempt 1 / success
final artifact ID = 10945085978
artifact ZIP SHA-256 = 9a02241b2fb28d9aac936d3d203e39d9a2bba3eee5905fa02aa4ecbca725ef7b
result core SHA-256 = c74f9f3baa5065c5ae6df70dbbccdeb50c0adba5006d2d647fa6931cd3764e20
fixed domains = 8
forced domains = 2
nontrivial domains = 6
search configurations = 6
nontrivial cells = 36 / 36 estimable
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
```

唯一の非EQUALセルは`D2_Q0 × domain 4`で、exact-optimal 2手のうちsearch TopSetが1手だけを含む`SEARCH-SUBSET-EXACT`だった。canonical-bestとPV firstはいずれもexact optimal set内だった。

このfixed-eight censusをwhole-Bao accuracy / correctness probabilityへ一般化しない。configuration winnerも選ばない。

正式closure:

**`CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE`**

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — RG4全体の最新状態
2. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開位置
3. [`../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md`](../geometry-conditioned-search-reliability-exact-agreement/CURRENT_STATUS.md) — G4-09最新状態
4. [`../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../geometry-conditioned-search-reliability-exact-agreement/results/stage-2/STAGE_2_CANONICAL_RECORD.json) — G4-09 exact-census canonical record
5. [`../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md`](../research-program-decisions/2026-09-28-g4-09-search-reliability-exact-agreement-study1-closure.md) — G4-09 closure
6. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract

## 次に許可される作業

G4-09のscientific execution・closure・pre-main consistency audit・`main`統合は完了した。G4-09に対する追加科学実行は行わない。次のscientific agendaを開始する場合は別の明示的authorization reviewを必要とする。

G4-10はG4-09 closureや将来のmain統合によって自動認可されない。depth-11 accessには別の明示的authorization reviewが必要。

## 解釈・保護境界

- closed Studyのsame-evidence rerun / rescueを行わない。
- G4-08 NON-ESTIMABLEをno-effect / counterexampleへ読み替えない。
- G4-09 Module A support gateを事後緩和しない。
- G4-09候補general Stage 2 namespaceを同Studyで読まない。
- G4-09 fixed-8 exact censusをrerunしない。
- fixed-8結果をwhole-Bao correctness probabilityへ一般化しない。
- G4-10 depth-11へアクセスしない。
- RG4結果をpublic AIへ自動反映しない。
