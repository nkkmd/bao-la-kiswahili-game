# Research Generation 3

Bao第三世代研究計画のprogram-level文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = PROSPECTIVE PLAN / NOT YET STARTED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Scientific Study execution = NOT STARTED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — 第三世代全体の詳細研究計画。研究目的、固定境界、measurement principle、Wave A-D、G3-01〜G3-12、G3-H01、dependency、completion conditionsを定義する正本
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のprogram state、upstream boundary、protected evidence、次の候補Study
- [`../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`](../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md) — 第三世代をlocal game-tree geometry / effective branching方向として採用したprogram-level decision

## 研究方向

第三世代は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、局面を離散strategic regimeへ強制的に分類する前に、局面周辺のlocal game tree / reachable RAW graphを直接測定する。

中心対象は次である。

- effective branching / reply width
- transposition concentration
- tree / graph divergence
- structural forcing corridor / decision funnel
- branch expansion / compression
- Bao rule mechanism
- search instability mechanism
- geometry persistence / memory
- continuous local-geometry representation
- representation-free longitudinal dynamics
- protected depth-10 exact holdout
- generalization / counterexample boundary

## Upstream boundary

Research Generation 1 / 2のclosed Studyをreopen / rescueしない。

特に、

```text
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
```

を第三世代開始時点のimmutable upstream boundaryとする。

正式なG3 Study ID、Stage ID、seed、population、endpoint、threshold等は各Study開始時にprospectively固定する。本directoryのprogram計画だけではscientific Study executionをauthorizeしない。
