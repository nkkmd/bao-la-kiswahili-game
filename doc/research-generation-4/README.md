# Research Generation 4 — 入口

更新日: 2026-09-28  
Program: `Bao Fourth-Generation Research Program`  
状態: **`CORE G4-01..G4-10 SCIENTIFIC AGENDA COMPLETE / G4-10 CLOSED NON-ESTIMABLE ON RESEARCH BRANCH`**

## このProgramが調べたこと

第四世代研究は、Research Generation 3で測定可能になったbounded RAW local game-tree geometryについて、次をprospectiveに検証した。

1. 別phase、root family、source policy、rule contextへどこまで移送できるか。
2. 完全解析可能な限定domainでexact game-theoretic consequenceとどう関係するか。
3. 時間的持続、rule-semantic event、search reliabilityとどう結びつくか。
4. standard initial RAW rootのprotected deeper exact domainをどこまで完全解析できるか。

第三世代のclosed Studyをrepairまたは再判定するProgramではない。各Studyはfresh evidence、事前登録、独立検証、no-rescue boundaryを用いた。

## Core agenda の現在状態

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
| D | `G4-10` | protected depth-11 exact topology | `CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP / RESEARCH BRANCH` |
| 独立 | `G4-P01` | canonicalization re-foundation | `NOT AUTHORIZED / NON-BLOCKING` |
| 独立 | `G4-H01` | human / expert evidence | `DEFERRED / NON-BLOCKING` |

Public AI change authorized by RG4 = `false`。

## G4-09

`GCSREA-STUDY1`は一般domain search-output stabilityとfixed exact microdomain agreementを分離した。

Module Aは3 search contrastsすべてでdefined roots 109となり、事前固定minimum 120を満たさなかったため`NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT`で閉じた。これはno-effect resultではない。

Module BはG4-05固定8 exact microdomainのfinite censusを完了し、36/36 nontrivial cellsでcanonical-bestとPV first moveがexact optimal set内、TopSetは35/36 `EQUAL`、1/36 `SEARCH-SUBSET-EXACT`だった。このN=8 fixed censusをwhole-Bao correctness probabilityへ一般化しない。

## G4-10

`FDERT-STUDY1`はstandard initial RAW rootからcomplete exact depth 11を一度だけ構築するprotected Studyとして実行した。

```text
Actions run = 36368880428 / attempt 1
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
stop reason = UNIQUE_STATE_CAP
frozen cumulative RAW-state ceiling = 2000000
formal decision = NON-ESTIMABLE
T1..T4 = NON-ESTIMABLE
```

Fresh complete 0..10 prefixはG3-11 canonical exact prefixと完全一致し、materially separate independent implementationでもcomplete prefix integrityを確認した。

```text
prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
cumulative RAW states through depth 10 = 451127
depth-labelled edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
```

partial depth-11 dataはformal evidenceへ昇格しない。state ceiling増加、alternate runner rescue、same-evidence rerun、depth 12 extensionを行わない。

## Program completion

G4-01〜G4-10はすべてformal closureを持つ。Program Planはpositive resultの数をcompletion条件としていないため、G4-10のpreregistered resource closure `NON-ESTIMABLE`を含め、RG4 core scientific agendaは完了条件を満たす方向にある。

最終判断は[`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md)とpre-main consistency auditで固定する。

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — RG4全体の最新状態
2. [`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md) — 第四世代の統合結果
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開位置
4. [`../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md`](../fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md) — G4-10 latest
5. [`../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md`](../fresh-depth11-exact-reachability-topology/FINAL_REPORT.md) — G4-10 final report
6. [`../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json`](../fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json) — G4-10 canonical summary
7. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective contract / outcome-editしない

## 次に許可される作業

G4-10に対する追加scientific executionは行わない。次に行うのはRG4 final synthesis、current-facing文書同期、日本語品質・リンク・状態整合監査、pre-main auditである。

`main`統合はStudy closureから分離した別gateとする。

## 解釈・保護境界

- closed Studyのsame-evidence rerun / rescueを行わない。
- G4-08 `NON-ESTIMABLE`をno-effect / counterexampleへ読み替えない。
- G4-09 Module A support gateを事後緩和しない。
- G4-09 fixed-8 censusをwhole-Bao correctness probabilityへ一般化しない。
- G3-11 formal decisionをG4-10で再判定しない。
- G4-10 partial depth-11 evidenceをformal resultへ昇格しない。
- G4-10のresource ceilingを事後拡張しない。
- depth 12へ進まない。
- RG4結果をpublic AIへ自動反映しない。
