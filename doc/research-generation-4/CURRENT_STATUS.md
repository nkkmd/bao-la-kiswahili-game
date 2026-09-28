# Research Generation 4 — 現在の状態

更新日: 2026-09-28  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01..G4-09 MAIN INTEGRATED / G4-10 CLOSED NON-ESTIMABLE ON RESEARCH BRANCH / CORE SCIENTIFIC AGENDA COMPLETE`**

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
G4-09 = CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE / MAIN INTEGRATED
G4-10 = CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP / RESEARCH BRANCH
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
RG4 core G4-01..G4-10 scientific agenda = COMPLETE / ALL CLOSED
Public AI change authorized by RG4 = false
main integration of G4-10 = NOT YET PERFORMED
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

### Module A

```text
run = 36326278830 / attempt 1
fresh reads = 768
selected roots = 128
SC1 / SC2 / SC3 defined roots = 109 / 109 / 109
minimum defined roots = 120
formal candidate slots = 9
SUPPORTED = 0
NOT-SUPPORTED = 9
formal inference = false
```

Module Aは`NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT`で閉じた。これはno-effect resultではない。

### Module B

G4-05固定8 exact microdomainをfinite censusとして完了した。

```text
run = 36359283198 / attempt 1 / success
fixed domains = 8
nontrivial domain×configuration cells = 36 / 36 estimable
canonical-best in exact optimal set = 36 / 36
PV first move in exact optimal set = 36 / 36
TopSet EQUAL = 35 / 36
TopSet SEARCH-SUBSET-EXACT = 1 / 36
```

G4-09 final:

**`CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE / MAIN INTEGRATED`**

## G4-10 — protected fresh depth-11 exact reachability topology

Study: `FDERT-STUDY1`  
Branch: `research/g4-10-fresh-depth11-exact-reachability-topology`

Protected Stage 1はone-shot authorizationとdurable leaseの下で実行した。

```text
Actions run = 36368880428 / attempt 1 / success
scientific executions authorized = 1
scientific executions actual = 1
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
stop reason = UNIQUE_STATE_CAP
frozen max cumulative distinct RAW states = 2000000
```

正式判定:

**`NON-ESTIMABLE`**

T1〜T4はすべて`NON-ESTIMABLE`。

### Integrity

Fresh complete 0..10 prefixはG3-11 canonical exact prefixと完全一致した。

```text
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
production materialized-file hash verification = PASS
independent complete-prefix verification = PASS
integrityPassed = true
```

complete prefix through depth 10:

```text
cumulative distinct RAW states = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences = 631101
tree-edge occurrences = 631100
```

これらはdepth-11 resultではなくintegrity confirmationである。

### Why NON-ESTIMABLE

productionはdepth-11構築中にprospectively frozen cumulative RAW-state ceilingへ到達した。partial layerはformal evidenceへ昇格しないため、depth-11 exact topologyは確立されていない。

resource ceiling増加、alternate runner rescue、same-evidence rerun、depth 12 extensionを行わない。

Canonical records:

- [`../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md`](../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md)
- [`../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md`](../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md)
- [`../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json`](../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json)
- [`../research-program-decisions/2026-09-28-g4-10-fresh-depth11-exact-reachability-topology-study1-closure.md`](../research-program-decisions/2026-09-28-g4-10-fresh-depth11-exact-reachability-topology-study1-closure.md)

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
| `G4-09` | `CLOSED / MODULE-A NOT ELIGIBLE / MODULE-B FIXED8 EXACT-CENSUS COMPLETE / MAIN INTEGRATED` |
| `G4-10` | `CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP / RESEARCH BRANCH` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## Core program status

G4-01〜G4-10はすべてformal closureを持つ。Program Planはpositive resultの数ではなく、dependency gateと事前固定stop ruleに従ったclosureをcore completion条件としているため、G4-10 `NON-ESTIMABLE`は正当なcore completion resultである。

次はResearch Generation 4 final synthesisとpre-main documentation consistency auditを行う。

## 保護境界

- closed Studiesをrepair / reopen / rerunしない。
- G4-08の24/24 `NON-ESTIMABLE`をno-effect resultへ読み替えない。
- G4-09 Module A gateを緩和しない。
- G4-09 fixed-8 censusをwhole-Bao correctness probabilityへ一般化しない。
- G3-11 depth-10 formal decisionを再判定しない。
- G4-10 state ceilingを増加しない。
- G4-10 partial depth-11 evidenceをformal resultへ昇格しない。
- G4-10 same-evidence rerun / alternate-runner rescueを行わない。
- depth 12へ進まない。
- RG4 resultをpublic AIへ自動反映しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective plan / outcome-editしない
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../fresh-depth11-exact-reachability-topology/README.md`](../fresh-depth11-exact-reachability-topology/README.md)
- [`../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md`](../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md)
- [`../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md`](../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md)
- [`../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json`](../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json)
