# Research Generation 4 — 入口

更新日: 2026-09-27  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01..G4-07 MAIN INTEGRATED / G4-08 CLOSED・MAIN NOT INTEGRATED / G4-09 NOT AUTHORIZED / G4-10 PROTECTED`**

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
| C | `G4-08` | rule-semantic geometry transition | `CLOSED / 24-OF-24 NON-ESTIMABLE / MAIN NOT INTEGRATED` |
| C | `G4-09` | search reliability / exact agreement | `DEPENDENCY-GATED / NOT AUTHORIZED` |
| D | `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT AUTHORIZED / NOT ACCESSED` |
| 独立 | `G4-P01` | canonicalization re-foundation | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | human / expert evidence | `DEFERRED` |

Public AI change authorized by RG4 = `false`。

## G4-01〜G4-07

G4-01〜G4-07は研究実行と文書closureを完了し、`main`へ統合済み。

- G4-01: `COMPATIBILITY-ELIGIBLE-ALL`
- G4-02: `CLOSED / NO SCIENTIFIC DECISION`
- G4-03: 12 tests = 9 `GENERALIZATION-CONFIRMED` / 1 `NOT-GENERALIZED` / 2 `NON-ESTIMABLE`
- G4-04: 8 / 8 `GENERALIZATION-CONFIRMED`
- G4-05: fixed late-game microdomains内でexact-oracle foundation確立
- G4-06: fixed 8 exact microdomains内でgeometry / exact-consequence mapping完了
- G4-07: 16-slot family = 6 `REVERSAL-CONFIRMED` / 10 `NOT-CONFIRMED`

これらをwhole-Bao universal law、public AI adoption、human difficultyへ自動拡張しない。

## G4-08 — rule-semantic geometry transition

G4-08 `BRSGT-STUDY1` は、次の4 event familyをpoolせず個別に扱った。

1. capture
2. nyumba use-vs-stop
3. reserve decrement nontransition
4. Namua→Mtaji

RepresentationはRAW-only、relative depth 5、validated transform set `[]`。

### Stage 1 v3

```text
run = 36303568642 / success
fresh reads = 512
measured event units = 64
unique geometry roots = 97
formal-holdout-supported slots = 24 / 24
formal inference = false
```

Stage 1 effect direction/valueはformal family選定へ使用していない。

### Stage 2

pre-fresh audit attempt 1はartifact nested pathのtechnical mismatchでfresh access前に停止。scientific contractを変更せずartifact normalizationとaudit-key参照だけを修正し、Run `36314109864`でpre-fresh static auditをPASSした。

one-shot formal execution:

```text
run = 36314208922 / attempt 1 / success
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
artifact ID = 10929684128
artifact SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
fresh block = 40823001..40824024
fresh reads = 1024 / 1024
accepted source trajectories = 0
measured event units = 0
formal family = 24
NON-ESTIMABLE = 24
```

Frozen freshness firewall source rejection:

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
```

正式closureは:

**`CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / NO DIRECTIONAL SCIENTIFIC CONCLUSION`**

`NON-ESTIMABLE`はno-effectのnegative resultではない。freshness gate後にformal event unitsが残らなかったため、capture / nyumba / reserve decrement / Namua→Mtajiのgeometry directionを推定できなかった。

### Freshness exhaustion diagnostic

Stage 2全1024 trajectoriesとStage 1 v3全512 identity rowsに共通するply-0 initial RAW rootがfrozen firewallへ含まれていた。

```text
2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
```

このためtrajectory/prefix collisionで先に除外された13件以外の1011件はreachable-root collisionとなった。

このpost-execution diagnosticを使ったsame-Study rescue、ply-0除外、firewall grammar変更、seed extension、replacement populationは行わない。

詳細:

- [`../rule-semantic-geometry-transition/README.md`](../rule-semantic-geometry-transition/README.md)
- [`../rule-semantic-geometry-transition/CURRENT_STATUS.md`](../rule-semantic-geometry-transition/CURRENT_STATUS.md)
- [`../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md`](../rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md)
- [`../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md`](../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md)

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — RG4全体の最新状態
2. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開位置
3. [`../rule-semantic-geometry-transition/CURRENT_STATUS.md`](../rule-semantic-geometry-transition/CURRENT_STATUS.md) — G4-08 closure
4. [`../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json) — G4-08 canonical formal summary
5. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract

## 次に許可される作業

G4-08はscientific executionを閉じたが、まだ`main`へ統合していない。

現在許可されるのはG4-08関連文書の最終整合性監査と、ユーザーの明示指示がある場合のmain統合準備・統合である。

G4-09 / G4-10はG4-08 closureによって自動認可されない。新しいscientific agendaへ進む場合は独立authorization reviewが必要。

## 解釈・保護境界

- closed Studyのsame-evidence rerun / rescueを行わない。
- G4-08 Stage 2 block `40823001..40824024`を再利用しない。
- G4-08 NON-ESTIMABLEをno-effect / counterexampleへ読み替えない。
- G4-10 depth-11へアクセスしない。
- RG4結果をpublic AIへ自動反映しない。
- 明示指示なしにG4-08をmainへ統合しない。
