# Research Generation 4 — 現在の状態

更新日: 2026-09-18  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / WAVE A NEXT STUDY NOT YET AUTHORIZED`**

## Program全体

第四世代のprospective program planは`main`へ統合済みであり、G4-01を最初の実行Studyとして完了した。

```text
Program baseline plan = FROZEN / INTEGRATED TO MAIN
Core agenda = G4-01..G4-10
Independent tracks = G4-P01, G4-H01
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
G4-02 = NOT AUTHORIZED
G4-03 = NOT AUTHORIZED
G4-04 = NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized by RG4 = false
G4-01 main integration = NOT YET AUTHORIZED
```

## G4-01の完了

G4-01の正式Studyは`LGTTCI-STUDY1`である。

Stage 0は`STAGE0-PASS`。旧Stage 1は実行環境消失により`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じ、旧`401...` namespaceをquarantineした。

再試験Stage 1Rでは新しい`402...` primary namespaceを使い、GitHub Actionsでfresh acquisitionを一度だけ実行した。1536/1536 source evidenceを取得し、paired reserve使用は0だった。

元fresh workflowのdownstream technical failure後は、fresh seedを再読せず、保存済みimmutable source artifactだけを入力とするdownstream-only recoveryを実施した。

最終結果:

```text
SFCDF = compatible
SILGM = compatible
GCLD = compatible
Stage 1R decision = COMPATIBILITY-ELIGIBLE-ALL
measurement tasks = 22 / 22 success
recovery run = 35265290422 / success
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
```

G4-01 closure state:

`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`

詳細:

- [`../local-game-tree-geometry-transfer-compatibility-instrument/README.md`](../local-game-tree-geometry-transfer-compatibility-instrument/README.md)
- [`../local-game-tree-geometry-transfer-compatibility-instrument/checkpoints/2026-09-18-stage1r-final-result.md`](../local-game-tree-geometry-transfer-compatibility-instrument/checkpoints/2026-09-18-stage1r-final-result.md)
- [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md)

## Agenda別の現在状態

| Agenda | 役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL` |
| `G4-02` | corridor / tree-graph transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-03` | width / search-ranking transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-04` | geometry-trajectory transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-05` | exact microdomain oracle foundation | `CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-06` | geometry / exact consequence bridge | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-07` | multiscale memory / return | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-08` | rule-semantic transition | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-09` | search reliability / exact agreement | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT-AUTHORIZED-NOT-ACCESSED` |
| `G4-P01` | canonicalization re-foundation | `INDEPENDENT / NON-BLOCKING / NOT-AUTHORIZED` |
| `G4-H01` | human / expert evidence | `DEFERRED / INDEPENDENT / NON-BLOCKING` |

`ELIGIBILITY-GATE-SATISFIED-BY-G4-01`は実行authorizationではない。G4-02/G4-03/G4-04はそれぞれprospective authorization reviewを必要とする。

## 保護された境界

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-01 old 401... namespace = QUARANTINED / NO REUSE
G4-01 Stage 1R fresh workflow = EXECUTED ONCE / NO RERUN
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative state identity = RAW
```

## 次の一手

G4-01の研究実行は完了している。

次の研究作業を行う場合は、Wave AのG4-02、G4-03、G4-04のいずれかについてcurrent-state authorization reviewを実施する。G4-01の`COMPATIBILITY-ELIGIBLE-ALL`だけを根拠にscientific seedへ自動アクセスしてはならない。

また、G4-01を`main`へ統合する場合もユーザーの明示指示が必要である。

## 文書上の正本

- [`README.md`](README.md) — 第四世代研究の入口
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
- [`RESUME_HERE.md`](RESUME_HERE.md) — 現在の安全な再開位置
- [`../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md`](../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md) — G4-01の正式状態
- [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md) — G4-01 closure decision
