# Research Generation 4 — 再開位置

更新日: 2026-09-27  
状態: **`G4-07 COMPLETE ON RESEARCH BRANCH / PRE-MAIN AUDIT NEXT`**

## 再開時の読む順序

1. remote `main` HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`../multiscale-local-geometry-memory-return/CURRENT_STATUS.md`](../multiscale-local-geometry-memory-return/CURRENT_STATUS.md)でG4-07 closure状態を確認する。
4. [`../multiscale-local-geometry-memory-return/FINAL_REPORT.md`](../multiscale-local-geometry-memory-return/FINAL_REPORT.md)で正式解釈を確認する。
5. [`../multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json`](../multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json)でcanonical formal resultを確認する。
6. [`../multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md`](../multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md)でrun / artifact / firewall provenanceを確認する。
7. [`../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`](../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md)でclosure decisionを確認する。
8. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でfrozen program roleと次agendaのdependencyを確認する。

## 現在地

```text
G4-01 = COMPLETE / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / RESEARCH BRANCH CLOSED / MAIN NOT INTEGRATED
G4-08..G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-07 canonical result

```text
Stage 0 = STAGE0-PASS
Stage 1 canonical run = 36247459779 / attempt 1 / success
Stage 1 support-only promoted slots = 16 / 24
Stage 2 canonical run = 36278926636 / attempt 1 / success
Stage 2 head = f73e2ade42b3379b9eaf2007292a057cfeaf88f0
Stage 2 artifact ID = 10919769185
Stage 2 artifact SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
fresh Stage 2 scientific seed reads = 363
formal measured trajectories = 64 / P1 32 / P2 32
formal family = 16
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
production / independent exact agreement = true
G4-10 depth-11 access = 0
```

全6 axisのlag 1が`REVERSAL-CONFIRMED`。lag 2の6 slotとformal-family内lag 4の4 slotは`NOT-CONFIRMED`。

preregistered bounded persistence summary:

```text
A1 = NONE
A2 = NONE
A3 = NONE
A4 = NONE
A5 = NONE
A6 = NONE
```

これは「temporal structureなし」を意味しない。same-sign persistence chainがlag 1から始まらず、最短lagで全6 axisにopposite-sign confirmationが出たという限定結果である。

return endpointはdescriptive only。universal oscillation / mean-reversion law、causal mechanism、physical half-lifeへ読み替えない。

## No-rescue / protected boundary

G4-07 Stage 2はone-shot formal executionとして完了済み。以下は禁止。

- Stage 1 / Stage 2 same-evidence rerun
- seed extension
- replacement population
- lag / axis / checkpoint / policyの事後変更
- threshold relaxation
- favorable subgroup rescue
- formal familyの結果後変更
- G3-11 depth-10 rerun
- G4-10 depth-11 access without separate authorization
- public AIへの自動反映

## 次にRG4を進める場合

まず **G4-07 pre-main consistency audit / main-integration review** を行う。

確認対象:

- G4-07 canonical recordとraw artifact digestの一致
- FINAL_REPORT / CURRENT_STATUS / closure decisionの整合
- RG4中央README / CURRENT_STATUS / RESUME_HEREとの整合
- branch scopeにpublic AI production changeがないこと
- G4-10 depth-11 accessが0であること
- same-evidence rerun / seed extensionが発生していないこと

問題がなければmain統合を別途判断する。main統合前にG4-08やG4-09へ進まない。

## 禁止事項

- G4-02 closed Studiesのrepair / reopen / rerun
- G4-03 / G4-04 formal stagesのrerun
- G4-05 candidate rescan / seed extension / root replacement / resource rescue
- G4-06 post-outcome rerun / metric変更 / depth変更 / subgroup rescue
- G4-07 Stage 1 / Stage 2のrerun / rescue
- G4-07 resultのwhole-Bao lawへの一般化
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AIへの自動反映
