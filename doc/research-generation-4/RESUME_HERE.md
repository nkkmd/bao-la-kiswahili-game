# Research Generation 4 — 再開位置

更新日: 2026-09-28  
状態: **`G4-01..G4-10 CORE SCIENTIFIC AGENDA COMPLETE / G4-10 CLOSED NON-ESTIMABLE / MAIN INTEGRATION PENDING`**

## 再開時の読む順序

1. remote `main` HEADと[`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
2. [`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md)でG4-01〜G4-10のProgram-level conclusionを確認する。
3. [`../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md`](../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md)でG4-10の現在状態を確認する。
4. [`../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md`](../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md)でG4-10のformal resultと解釈境界を確認する。
5. [`../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json`](../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json)でcanonical numeric/provenance recordを確認する。
6. [`../fresh-depth11-exact-reachability-topology/REPRODUCIBILITY_INDEX.md`](../fresh-depth11-exact-reachability-topology/REPRODUCIBILITY_INDEX.md)でsource/artifact identityを確認する。
7. [`../research-program-decisions/2026-09-28-g4-10-fresh-depth11-exact-reachability-topology-study1-closure.md`](../research-program-decisions/2026-09-28-g4-10-fresh-depth11-exact-reachability-topology-study1-closure.md)でG4-10 closure decisionを確認する。
8. [`checkpoints/2026-09-28-g4-10-pre-main-consistency-audit.md`](checkpoints/2026-09-28-g4-10-pre-main-consistency-audit.md)でpre-main audit PASSを確認する。
9. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)はprospective frozen planとして変更せず参照する。

## 現在地

```text
G4-01 = COMPLETE / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8 GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-08 = CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / MAIN INTEGRATED
G4-09 = CLOSED / MODULE-A NOT ELIGIBLE / MODULE-B FIXED8 EXACT-CENSUS COMPLETE / MAIN INTEGRATED
G4-10 = CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP / RESEARCH BRANCH
RG4 core G4-01..G4-10 = SCIENTIFIC AGENDA COMPLETE
G4-P01 = INDEPENDENT / NOT AUTHORIZED
G4-H01 = DEFERRED
public AI change = false
G4-10 main integration = NOT YET PERFORMED
```

## G4-10 canonical outcome

Study: `FDERT-STUDY1`

```text
Stage = FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1
Actions run = 36368880428 / attempt 1 / success
scientific executions authorized = 1
scientific executions actual = 1
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
stop reason = UNIQUE_STATE_CAP
frozen cumulative distinct RAW-state ceiling = 2000000
formal decision = NON-ESTIMABLE
T1 = NON-ESTIMABLE
T2 = NON-ESTIMABLE
T3 = NON-ESTIMABLE
T4 = NON-ESTIMABLE
```

productionはdepth 11構築中に事前固定したstate ceilingへ到達した。partial depth-11 layerをformal evidenceへ昇格しない。

## G4-10 integrity

Fresh complete 0..10 prefixはhistorical G3-11 canonical exact prefixと完全一致した。

```text
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
production materialized-file hash verification = PASS
independent complete-prefix verification = PASS
integrity = PASS
```

Complete prefix:

```text
cumulative distinct RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
tree-edge occurrences through parent depth 9 = 631100
```

これらはG4-10のdepth-11 resultではなく、complete prefix integrity confirmationである。

## G4-10 provenance

```text
trigger SHA = 787105a3016bac1172e669faf400fcc7cdd70dd5
formal-result file SHA-256 = 7be828231d25ad0e9ee0a698992c3ccb726768b6329a6ad935548d4a46c72e1d
scientific-result core SHA-256 = a9649b654ae315fe7d234ccc5511252db6154e84d146bd9444185e9441f52484
lease artifact = 10948226759
production artifact = 10949100069
compact artifact = 10948857115
```

one-shot authorizationは消費済みであり、same-evidence rerunは認可されない。

## 次の作業

G4-10に対する追加scientific executionは行わない。

Research Generation 4 final synthesis、current-facing文書同期、研究索引・future agenda更新、pre-main consistency auditは完了した。監査判定は **`PASS / READY FOR SEPARATE MAIN-INTEGRATION GATE`**。

次に許可されるrepository operationは、別gateとしての`main`統合判断である。明示的に統合作業へ進むまではresearch branchに留め、科学結果、resource ceiling、formal classification、no-rescue boundaryを変更しない。

## No-rescue / protected boundary

- G4-10 state ceilingを増加しない。
- G4-10 wall-clockを延長しない。
- larger / alternate runnerやlocal machineへ移して同Studyを救済しない。
- G4-10 same-evidence rerun / repairを行わない。
- partial depth-11 count / topologyをformal result、estimate、lower bound、trendへ昇格しない。
- depth 12へ進まない。
- symmetry / canonicalization rescueを行わない。
- G2-12 estimatorをG4-10 reinterpretationへ使用しない。
- G3-11 formal decisionを再判定しない。
- G4-08 `NON-ESTIMABLE`をno-effectへ読み替えない。
- G4-09 Module A eligibility gateを事後緩和しない。
- G4-09 fixed-eight censusをwhole-Bao correctness probabilityへ一般化しない。
- RG4 resultをpublic AIへ自動反映しない。
