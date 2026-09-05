# Research Generation 4 — 現在の状態

更新日: 2026-09-05  
Program: `Bao Fourth-Generation Research Program`  
状態: **`PROGRAM PLAN FROZEN / INTEGRATED TO MAIN / SCIENTIFIC EXECUTION NOT AUTHORIZED`**

## Program全体

第四世代のprospective program planは作成済みである。個別Studyの科学実行、seed生成・読取、formal computation、過去Studyの再実行、公開AI変更は承認されていない。

```text
Baseline main = ed30395d98e4dd43cbbc5435752b9ba1943d789e
Planning branch = research/g4-program-plan
Planning PR = #103
Core agenda = G4-01..G4-10
Independent tracks = G4-P01, G4-H01
Program plan = FROZEN
Scientific execution authorized = none
Scientific evidence generated = none
Scientific seeds accessed = none
Main integration = COMPLETE / merge commit 692bcb40f52c097ca89bf7fea842b6f77fbdf19e
```

## Agenda別の開始状態

| Agenda | 役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` | claim-transfer compatibility instrument | `CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-02` | corridor / tree-graph transfer | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-03` | width / search-ranking transfer | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-04` | geometry-trajectory transfer | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-05` | exact microdomain oracle foundation | `CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-06` | geometry / exact consequence bridge | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-07` | multiscale memory / return | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-08` | rule-semantic transition | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-09` | search reliability / exact agreement | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT-AUTHORIZED-NOT-ACCESSED` |
| `G4-P01` | canonicalization re-foundation | `INDEPENDENT / NON-BLOCKING / NOT-AUTHORIZED` |
| `G4-H01` | human / expert evidence | `DEFERRED / INDEPENDENT / NON-BLOCKING` |

## 保護された境界

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative state identity = RAW
```

## 次の一手

次に許可される研究作業は、G4-01の科学実行ではなく、**post-RG3 / pre-G4-01 current-state authorization review**である。

reviewが明示的に`AUTHORIZED`を示すまで、Study ID、scientific seed block、formal population、endpointを確定したとみなさず、scientific outcomeを生成・readしない。

## 文書上の正本

- [`README.md`](README.md) — 初見向け入口
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — prospective program contract
- [`RESUME_HERE.md`](RESUME_HERE.md) — 再開手順
- [`checkpoints/2026-09-05-research-generation-4-program-plan-main-integration-complete.md`](checkpoints/2026-09-05-research-generation-4-program-plan-main-integration-complete.md) — 計画の`main`統合完了記録
- [`../research-program-decisions/2026-09-05-research-generation-4-program-planning-and-integration-authorization.md`](../research-program-decisions/2026-09-05-research-generation-4-program-planning-and-integration-authorization.md) — 計画策定と統合のauthorization境界

Program計画はPR #103を通じて`main`へ統合済みである。この統合完了は個別Studyのscientific executionを承認しない。
