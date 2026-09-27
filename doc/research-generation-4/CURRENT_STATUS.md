# Research Generation 4 — 現在の状態

更新日: 2026-09-27  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01..G4-07 MAIN INTEGRATED / G4-08 CLOSED・PRE-MAIN AUDIT PASS・MAIN NOT INTEGRATED / G4-09 NOT AUTHORIZED / G4-10 PROTECTED`**

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
G4-08 = CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / PRE-MAIN AUDIT PASS / MAIN NOT INTEGRATED
G4-09 = DEPENDENCY-GATED / NOT-AUTHORIZED
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized by RG4 = false
```

## G4-01〜G4-07

G4-01〜G4-07は各Studyのno-rescue / protected-boundaryを保持したまま研究完了し、`main`へ統合済み。

主要な最終状態:

- `G4-01`: `COMPATIBILITY-ELIGIBLE-ALL`
- `G4-02`: `CLOSED / NO SCIENTIFIC DECISION`
- `G4-03`: 12 tests = 9 `GENERALIZATION-CONFIRMED` / 1 `NOT-GENERALIZED` / 2 `NON-ESTIMABLE`
- `G4-04`: 8 / 8 `GENERALIZATION-CONFIRMED`
- `G4-05`: 8 complete exact microdomains
- `G4-06`: 12 / 12 relations emitted within frozen N=8 microdomains
- `G4-07`: 16-slot formal family = 6 `REVERSAL-CONFIRMED` / 10 `NOT-CONFIRMED`

これらの結果をwhole-Bao law、game-theoretic value、AI strength、人間のdifficultyへ拡張しない。

## G4-08 — Bao rule-semantic geometry transition

G4-08 `BRSGT-STUDY1` は、capture、nyumba use-vs-stop、reserve decrement nontransition、Namua→Mtajiの4 event familiesについて、RAW relative depth 5 local geometryのevent-conditioned transitionをprospectiveに検証した。

### Stage 0

Stage 0 v1はtechnical-invalid。v2はRun `36295553800`で`STAGE0-PASS`。

### Stage 1

v1 / v2はtechnical-invalidとして各fresh namespaceを閉じた。v3はRun `36303568642`でsupport-only developmentを完了した。

```text
Stage 1 v3 fresh reads = 512
measured event units = 64
unique geometry roots = 97
production / independent exact agreement = true
formal inference = false
supported formal slots = 24 / 24
```

Stage 1のeffect direction/valueはStage 2 family membershipへ使用していない。

### Stage 2 pre-fresh verification

最初のstatic audit Run `36313405735` はG4-08 Stage 1 v3 artifactのnested pathをworkflowがtop-levelとして期待したためfresh access前に停止した。科学seed readは0。

artifact layout normalizationとstatic auditの現行spec-key参照だけをtechnical correctionし、科学spec・seed・formal family・inference ruleは変更しなかった。

再監査:

```text
run = 36314109864 / attempt 1 / PASS
job = 108605445752
audit HEAD = d2e22fa9b4ca8286480beda2a89b5e287bcdad9c
artifact ID = 10930605637
fresh Stage 2 reads = 0
```

### Stage 2 formal holdout

source-bound one-shot authorization後、Run `36314208922`でfixed 1024-slot populationをexactly once readした。

```text
run = 36314208922 / attempt 1 / success
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
artifact ID = 10929684128
artifact ZIP SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
seed block = 40823001..40824024
fresh reads = 1024 / 1024
no-rescue boundary crossed = true
production / independent exact agreement = true
```

Frozen identity firewallによるsource rejection:

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
total rejected = 1024
accepted source trajectories = 0
measured event units = 0
```

Formal family 24 slots:

```text
INCREASE-CONFIRMED = 0
DECREASE-CONFIRMED = 0
NOT-CONFIRMED = 0
NON-ESTIMABLE = 24
TECHNICAL-INVALID = 0
```

したがってG4-08は **`CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / NO DIRECTIONAL SCIENTIFIC CONCLUSION`** とする。

これはno-effectのnegative resultではない。freshness gate後にformal event unitsが残らず、effect directionを推定できなかったという結果である。

### Freshness exhaustion diagnostic

post-execution identity diagnosticでは、Stage 2全1024 trajectoriesとStage 1 v3全512 identity rowsが共通のply-0 initial RAW rootを持ち、そのrootがfrozen firewallへ含まれていたことを確認した。

```text
initial RAW root = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
```

trajectory collision 6件とopening-prefix collision 7件を先に除外した後、残る1011 trajectoriesはこのcommon initial rootでRAW-root collisionとなった。

この診断を使ったsame-Study rescue、ply-0除外、firewall grammar変更、seed extension、replacement populationは行わない。

### Pre-main consistency audit

G4-08 closure後のcurrent-facing文書、canonical record、closure record、prospective Program Plan、branch scope、protected boundaryを再監査し、`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`と判定した。

```text
reviewed main HEAD = 2023860419d13b6f294b0600943de8fb4e50b1bb
audited research HEAD = 62b8961a416fa8140de2163d682a92b1fafea848
behind main = 0
merge base = reviewed main HEAD
public/ changed files = 0
public AI production changes = 0
G4-10 depth-11 access = 0
```

監査記録: [`checkpoints/2026-09-27-g4-08-pre-main-audit.md`](checkpoints/2026-09-27-g4-08-pre-main-audit.md)

G4-08 canonical records:

- [`../rule-semantic-geometry-transition/CURRENT_STATUS.md`](../rule-semantic-geometry-transition/CURRENT_STATUS.md)
- [`../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md`](../rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md)
- [`../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md`](../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md)
- [`checkpoints/2026-09-27-g4-08-pre-main-audit.md`](checkpoints/2026-09-27-g4-08-pre-main-audit.md)

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
| `G4-08` | `CLOSED / FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / PRE-MAIN AUDIT PASS / MAIN NOT INTEGRATED` |
| `G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次に許可される作業

G4-08 scientific executionとmain統合前最終整合性監査は完了した。

現在許可される次の作業は、実際の統合直前にremote `main`を再読込してdriftがないことを確認し、ユーザーから明示的なmain統合指示がある場合のみG4-08 research branchを`main`へ統合すること。G4-09 / G4-10はG4-08 closureやmain統合によって自動認可されない。

## 保護境界

- G4-02 closed Studiesをrepair / reopen / rerunしない。
- G4-03〜G4-07のclosed formal stagesをrerun / rescueしない。
- G4-08 Stage 0 v1、Stage 1 v1/v2/v3、Stage 2 v1をrerun / rescueしない。
- G4-08 Stage 2 block `40823001..40824024`を再利用しない。
- G4-08 freshness exhaustionをno-effect resultへ読み替えない。
- G3-11 depth-10をrerunしない。
- G4-10 depth-11へアクセスしない。
- RG4 resultをpublic AIへ自動反映しない。
- G4-08をユーザーの明示なしに`main`へ統合しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`checkpoints/2026-09-27-g4-08-pre-main-audit.md`](checkpoints/2026-09-27-g4-08-pre-main-audit.md)
- [`../rule-semantic-geometry-transition/README.md`](../rule-semantic-geometry-transition/README.md)
- [`../rule-semantic-geometry-transition/CURRENT_STATUS.md`](../rule-semantic-geometry-transition/CURRENT_STATUS.md)
- [`../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md`](../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md)