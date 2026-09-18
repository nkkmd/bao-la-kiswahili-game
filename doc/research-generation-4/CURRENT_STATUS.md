# Research Generation 4 — 現在の状態

更新日: 2026-09-19  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY3 STAGE 1 FORMAL-PREPARATION-ELIGIBLE / STAGE 2 NOT AUTHORIZED`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 3 preregistration = FROZEN
G4-02 Study 3 Study2 firewall prerequisite = SATISFIED
G4-02 Study 3 Stage 0 = STAGE0-PASS
G4-02 Study 3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
G4-02 Study 3 Stage 2 = NOT AUTHORIZED / fresh reads 0
G4-02 scientific transfer decision = NONE
G4-03 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized by RG4 = false
Current G4-02 branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## G4-02 Study 3 Stage 1

anchor-bounded source replayを用いたStage 1 compatibility-only one-shot executionは成功した。

```text
Stage ID = SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1
canonical run = 35396341311 / attempt 1 / SUCCESS
execution head = b2a70b198c343bf05b9c81ac15fa546858955cdf
primary sources = 384 / 384 sealed
retry = 0
reserve = 0
deterministic failure = 0
root shortage = 99
engine-guard censoring = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 SUCCESS
final decision = FORMAL-PREPARATION-ELIGIBLE
final result artifact = 10567663854
artifact digest = sha256:a36e4cbad1fb885065badd9b1ad519f065e221cb9af4ea4669e56ea13192b2ba
deterministic core = 498decdc808558d2e019d1ddf7aeec6c66d2a8074c6478e117a24bc9301e4dab
```

各domainで8/8 pairがC1/C6 definedかつresource pass。Stage 1はeffect magnitude、direction、p-value、generalization/counterexample decisionを生成していない。

Stage 1 primary namespace `40511001..40511384` は消費済み・再利用禁止。Stage 1 reserve `41511001..41511384` は未読だが、完了済みStage 1の回復には使用しない。

Stage 2 primary `40521001..40521768` とreserve `41521001..41521768` は未読のまま。

## G4-02の経緯

### Study 1

`SFCDFT-STUDY1`はshort trajectory serializer orderingによりStage 1を`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。repair/reopenしていない。

### Study 2

`SFCDFT-STUDY2`はserializer問題をprospectiveに修正したが、Stage 1 run `35345143248`で2 sourceがengine `relay-limit` safety guardへ到達したため、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。Study 2もrepair/reopenしていない。

### Study 3

`SFCDFT-STUDY3`では科学的contractを変更せず、source replayをassigned anchor pair完成時に即停止するanchor-bounded designへ変更した。Stage 0 PASS後、Stage 1 compatibilityを正式に通過した。

正式Stage:

```text
SFCDFT3-S0-TECHNICAL-2026-09-19-v1
SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1
SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1
```

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `SFCDFT-STUDY3 STAGE1 FORMAL-PREPARATION-ELIGIBLE / STAGE2 NOT-AUTHORIZED` |
| `G4-03` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-04` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-05` | `CANDIDATE / NOT-AUTHORIZED` |
| `G4-06`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## 次の一手

G4-02 Study 3 Stage 2 formal held-out executionのpre-access preparationへ進む。frozen C1/C6 contract・fixed-eight family・exact sign test + Holm-Bonferroni・freshness firewall・resource ceilings・one-shot executionをprospectiveに固定し、seed-free preflightとauthorization reviewを完了するまでStage 2 scientific seedを読まない。

## 保護境界

- Study 1/2をrepair/reopenしない。
- Study 1/2 scientific seedを再読しない。
- Study 3 Stage 1をrerunしない。
- Study 3 Stage 1 seedを再利用しない。
- Study 3 Stage 2 scientific seedをpre-authorizationで読まない。
- G3-12のrepair/replayをしない。
- G4-10 depth11へアクセスしない。
- public AIへ自動反映しない。
- current G4-02 branchをユーザーの明示承認なしに`main`へ統合しない。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_3_PROTOCOL.md)
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study3/STUDY_3_STAGE_1_COMPATIBILITY_RESULT.json)
