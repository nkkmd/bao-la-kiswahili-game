# Research Generation 4 — 再開位置

更新日: 2026-09-27  
状態: **`G4-08 CLOSED / PRE-MAIN AUDIT PASS / READY FOR MAIN INTEGRATION REVIEW / MAIN NOT INTEGRATED / NEXT SCIENTIFIC AGENDA NOT AUTHORIZED`**

## 再開時の読む順序

1. research branch `research/g4-08-rule-semantic-geometry-transition` のHEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`checkpoints/2026-09-27-g4-08-pre-main-audit.md`](checkpoints/2026-09-27-g4-08-pre-main-audit.md)でmain統合前監査結果を確認する。
4. [`../rule-semantic-geometry-transition/CURRENT_STATUS.md`](../rule-semantic-geometry-transition/CURRENT_STATUS.md)でG4-08 closureを確認する。
5. [`../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json)でStage 2 canonical resultを確認する。
6. [`../rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md`](../rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md)でrun / artifact / firewall provenanceを確認する。
7. [`../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md`](../research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md)でclosure decisionを確認する。
8. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)で次agendaのfrozen dependencyを確認する。

## 現在地

```text
G4-01 = COMPLETE / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-08 = CLOSED / STAGE2-FORMAL-COMPLETE / 24 NON-ESTIMABLE / PRE-MAIN AUDIT PASS / MAIN NOT INTEGRATED
G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-08 canonical result

### Stage 1 v3

```text
run = 36303568642 / attempt 1 / success
fresh reads = 512
measured event units = 64
unique geometry roots = 97
support-only formal candidates = 24 / 24
formal inference = false
```

### Stage 2

```text
pre-fresh audit run = 36314109864 / attempt 1 / PASS
audit HEAD = d2e22fa9b4ca8286480beda2a89b5e287bcdad9c
formal run = 36314208922 / attempt 1 / success
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
artifact ID = 10929684128
artifact SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
fresh Stage 2 reads = 1024 / 1024
accepted source trajectories = 0
measured event units = 0
formal family = 24
NON-ESTIMABLE = 24
production / independent exact agreement = true
G4-10 depth-11 access = 0
```

Frozen firewall source rejection:

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
```

`NON-ESTIMABLE`はno-effectを意味しない。frozen freshness gate後にformal event unitsが残らなかったためdirectional conclusionを形成できなかった。

## Freshness exhaustion diagnostic

Stage 2全1024 trajectoriesとStage 1 v3全512 identity rowsが同じply-0 initial RAW rootを含む。

```text
2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
```

このrootはfrozen firewallに含まれていたため、trajectory/prefix collisionで先に除外された13件を除く1011件はreachable-root collisionとなった。

この診断を使ったStage 2 rescueは禁止。ply-0除外、firewall grammar変更、seed extension、replacement population、same-evidence rerunを行わない。

## Main統合前監査

最終整合性監査は完了し、**`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`** と判定した。

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

## 次の作業

G4-08 scientific executionとmain統合前最終整合性監査は完了済みだが、**まだ`main`へ統合していない**。

次に行う場合の順序:

1. remote `main`を再読込し、監査時baselineからdriftしていないことを確認する。
2. driftがなければcompareで`behind = 0`、merge base、意図しない差分の不在を再確認する。
3. ユーザーから明示的に指示された場合のみ、G4-08 research branchを`main`へ統合する。
4. G4-09またはG4-10へ進む場合は、統合とは別に独立authorization reviewを行う。

## No-rescue / protected boundary

- G4-08 Stage 0 v1 rerun禁止。
- G4-08 Stage 1 v1/v2/v3 rerun・seed reuse禁止。
- G4-08 Stage 2 v1 rerun禁止。
- Stage 2 block `40823001..40824024` reuse禁止。
- Stage 2 firewallの事後修正によるrescue禁止。
- `NON-ESTIMABLE`をnegative scientific resultへ変換しない。
- G3-11 depth-10 rerun禁止。
- G4-10 depth-11 access禁止。
- public AIへの自動反映禁止。
- 明示指示なしのmain統合禁止。