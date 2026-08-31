# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / DEPENDENCY REASSESSMENT REQUIRED AFTER G3-01
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のprogram state、G3-01 closure、dependency boundary、protected evidence
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — 第三世代全体のprospective program plan正本
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md) — G3-01の初見向け概要
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md) — G3-01最終報告
- [`../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`](../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md) — 第三世代をlocal game-tree geometry方向として採用したprogram-level decision
- [`../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md`](../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md) — G3-01 closureとdownstream dependency decision

## G3-01から確定した現在のboundary

G3-01は`LGTGMF-STUDY1`としてprospectively実行した。Stage 1 fresh developmentではNamua 6 / Mtaji 6の全12 rootsについてproduction / independentのroot-level measurement coreとF1〜F5 family digestがexact一致した。

一方、凍結済みcanonical stage manifestの`stageCoreSha256`へruntime-dependentなelapsed / RSS等を含めたimplementation defectによりdeterministic stage-level verification contractを満たさなかった。fresh evidence生成後のsame-evidence repairは禁止していたため、Stage 1は`STAGE1-TECHNICAL-INVALID`、Studyは`TECHNICAL-INVALID`で閉じ、Stage 2を実行していない。

したがって、G3-02〜G3-08を同じmeasurement instrumentのまま自動開始しない。次のscientific Studyには、新しいprospective measurement prerequisiteまたはprogram-level dependency再設計が必要である。

## 研究方向

第三世代の元の研究方向は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、局面周辺のlocal game tree / reachable RAW graphを直接測定することにある。

中心候補は次である。

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

ただしG3-01 closure後は、これらへ進む前にmeasurement dependencyを解決する必要がある。

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

をimmutable upstream boundaryとして維持する。

standard initial RAW rootのcomplete exact depth-10 layerはG3-11用にsealedしたままであり、G3-01では生成・readしていない。
