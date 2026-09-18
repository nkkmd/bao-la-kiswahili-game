# Research Generation 4 — 現在の状態

更新日: 2026-09-18  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 AUTHORIZATION REVIEW = PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED`**

## Program全体

第四世代のprospective program planは`main`へ統合済みであり、G4-01を最初の実行Studyとして完了した。G4-01のformal closure後、root README・中央研究索引・今後の研究アジェンダを含むrepository-wide consistency auditも`PASS`した。

```text
Program baseline plan = FROZEN / INTEGRATED TO MAIN
Core agenda = G4-01..G4-10
Independent tracks = G4-P01, G4-H01
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
repository-wide consistency audit = PASS
G4-02 = PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED
G4-03 = NOT AUTHORIZED
G4-04 = NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized by RG4 = false
G4-01 main integration = AUTHORIZED BY USER / PR #151
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
- [`checkpoints/2026-09-18-g4-01-repository-consistency-audit.md`](checkpoints/2026-09-18-g4-01-repository-consistency-audit.md)

## リポジトリ全体の整合性監査

G4-01 closure後、main統合前のcurrent-facing文書を再監査した。root `README.md`、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`に残っていたG4-01開始前の記述を修正し、Research Generation 4側およびG4-01正本と同期した。

監査時点の最終判定:

`PASS / CURRENT-FACING-DOCUMENTS-SYNCHRONIZED / MAIN-NOT-MERGED`

prospectiveにfreezeした`PROGRAM_PLAN.md`、preregistration、authorization/binding文書は歴史的正本として事後変更していない。

## Agenda別の現在状態

| Agenda | 役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL` |
| `G4-02` | corridor / tree-graph transfer | `PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED` |
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

## G4-02のauthorization review

2026-09-18にpost-G4-01 current-state G4-02 authorization reviewを実施した。formal decisionは**`PREREQUISITE-REQUIRED`**であり、G4-02のscientific Studyはまだ開始していない。

G4-01によってSFCDFのcompatibility/readinessは満たされた。一方、RG4共通contractはformal heldoutをcompatibility evidenceから`seed / source trajectory / opening prefix / RAW root`で分離するよう要求するが、G4-01 Stage 1Rの保存source recordにはopening-prefix identityが保持されていない。G4-01の旧seed再読とfresh workflow rerunはいずれもfrozen contractで禁止されている。

したがって、既存immutable artifactだけでopening-prefix identityを回収できることを確認するか、G4-02と分離したProgram-level methodology reviewを先に行う必要がある。prerequisite解消前にG4-02 Study ID、formal seed block、scientific execution contractを確定しない。

正本: [`../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md`](../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md)

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

G4-01の研究実行とmain統合前の文書整合性監査は完了している。2026-09-18にユーザーからPR #151による`main`統合の明示承認を受領した。

G4-02についてはauthorization reviewが`PREREQUISITE-REQUIRED`で完了した。まずG4-01 compatibility evidenceとのopening-prefix identity分離を、旧seed再読なしで監査可能にするprerequisiteを解決する。解決後にG4-02 authorization reviewを再実施し、`AUTHORIZED`となるまでscientific seedへアクセスしない。G4-03/G4-04も引き続き個別authorization reviewを必要とする。

G4-01の`main`統合承認は、後続Studyのscientific executionや公開AI変更の承認を含まない。

## 文書上の正本

- [`README.md`](README.md) — 第四世代研究の入口
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
- [`RESUME_HERE.md`](RESUME_HERE.md) — 現在の安全な再開位置
- [`checkpoints/2026-09-18-g4-01-repository-consistency-audit.md`](checkpoints/2026-09-18-g4-01-repository-consistency-audit.md) — main統合前の文書整合性監査
- [`../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md`](../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md) — G4-01の正式状態
- [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md) — G4-01 closure decision
- [`../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md`](../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md) — G4-02 authorization review (`PREREQUISITE-REQUIRED`)
