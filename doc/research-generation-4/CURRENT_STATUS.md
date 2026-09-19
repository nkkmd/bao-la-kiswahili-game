# Research Generation 4 — 現在の状態

更新日: 2026-09-20  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION`**

## Program全体

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
G4-02 Study 3 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED
G4-02 Study 4 Stage 0 = PASS
G4-02 Study 4 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
G4-02 Study 4 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED
G4-02 scientific transfer decision = NONE
G4-02 overall = CLOSED / NO SCIENTIFIC DECISION
G4-02 documentation closure = COMPLETE
G4-02 main integration = COMPLETE / PR #154 / merge commit 8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd
G4-03 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-05 = CANDIDATE / NOT-AUTHORIZED
G4-06..G4-09 = DEPENDENCY-GATED / NOT-AUTHORIZED
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized by RG4 = false
```

## G4-01

G4-01 `LGTTCI-STUDY1`は、SFCDF・SILGM・GCLDの3 familyについてfresh-domain transfer研究を行うためのcompatibility/readiness instrumentを検証し、`COMPATIBILITY-ELIGIBLE-ALL`で完了した。これはgeneralizationやeffect directionを確認した結果ではない。

G4-01はユーザーの明示承認を経て`main`へ統合済みである。

## G4-02 — 最終状態

G4-02はG3-04由来のC1/C6について、fresh source-policy × root-family domainsへの移送可能範囲と反例境界をformalに検証するために実施した。

Study 1〜4をそれぞれ独立したprospective boundaryとして扱い、technical failure後のsame-study repair/rerunを行わなかった。

### Study 1

short trajectoryのmandatory first-16 opening-prefix serializer invariant違反によりStage 1を`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。repair/reopenしていない。

### Study 2

Stage 1 canonical executionでdeterministic relay-limit failureが発生し、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じた。reserve救済やrerunは行っていない。

### Study 3

scientific contractを変更せずsource replayをanchor-bounded化した。Stage 0はPASS、Stage 1は`FORMAL-PREPARATION-ELIGIBLE`。

Stage 2 canonical run `35427427920` はclassify-finalまで成功したがmandatory `bundle-source`工程で失敗し、formal measurementが開始されなかったため`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED / NO RERUN`で閉じた。

### Study 4

Study 3の科学的contractを変更せず、fresh scientific access前のartifact pipeline検証を強化したprospective successorとして実施した。

Stage 0:

```text
run = 35435952961
status = PASS / TECHNICAL PIPELINE VALIDATED
fresh scientific seed reads = 0
```

Stage 1:

```text
run = 35441719931
execution SHA = b84b53a3369490cafad2b428feddee20323f3e82
primary sources = 384 / 384
retry = 0
reserve = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 success
decision = FORMAL-PREPARATION-ELIGIBLE
```

Stage 2 canonical execution:

```text
run = 35450625402
execution SHA = 0acd54a23fd8e1f1226c307fe948c251d64f336d
attempt = 1
primary source acquisition = 768 / 768 completed
retry = 0
paired reserve = 0
deterministic failure = 0
classify-final = success / ready=true
bundle-source = failure
error = source identity mismatch
formal measurement = NOT STARTED
formal aggregate = NOT STARTED
8-cell decision vector = NOT GENERATED
```

事後のidentity-only audit `35452797563` はcanonical sealed source artifacts 768件をfresh seed再読なしで検査し、top-level `studyId` mismatch 0、`stageId` mismatch 0、duplicate slot 0で成功した。したがってbundle時のmismatchは保存済みartifactのtop-level identity監査では再現しなかったが、これをsame-evidence rescueには使用しない。

frozen protocolに従いStudy 4 Stage 2を`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / FAIL-CLOSED`で閉じた。

## G4-02の科学的解釈境界

G4-02ではformal Stage 2 hypothesis testが完了していないため、次のいずれも割り当てない。

```text
GENERALIZES-WITHIN-FROZEN-DOMAIN
COUNTEREXAMPLE-BOUNDARY-DETECTED
NOT-CONFIRMED
NON-ESTIMABLE
```

最終Stageの裁定は`TECHNICAL-INVALID`であり、G4-02全体のscientific transfer decisionは`NONE`である。

これはC1/C6が一般化しないこと、反例が存在すること、effectがないことを意味しない。凍結済みone-shot条件下で有効なformal transfer判定を取得できなかった、という終了状態である。

G4-02内に追加successor Studyを自動生成しない。将来同じ問いを扱う場合は、G4-02 repair/reopenではなく別Agendaまたは新しいprospective Studyとしてauthorizationから開始する。

## Agenda別の状態

| Agenda | 現在の状態 |
| --- | --- |
| `G4-01` | `COMPLETE / MAIN INTEGRATED` |
| `G4-02` | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-04` | `ELIGIBILITY-GATE-SATISFIED / NOT-AUTHORIZED` |
| `G4-05` | `CANDIDATE / NOT-AUTHORIZED` |
| `G4-06`〜`G4-09` | `DEPENDENCY-GATED / NOT-AUTHORIZED` |
| `G4-10` | `PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED` |
| `G4-P01` | `INDEPENDENT / NOT-AUTHORIZED` |
| `G4-H01` | `DEFERRED` |

## G4-02 documentation closure

G4-02の最終状態は、ルート`README.md`、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`、RG4入口文書、RG4 current/resume文書、G4-02 current status、machine-readable Stage 2 result、Study 4 Stage 2 checkpoint、Agenda closure checkpointへ反映済みである。

live-state文書に古いStudy進行状態が残っていないこと、machine-readable closure recordsがJSONとして妥当であること、主要なローカルMarkdownリンクが解決することを専用GitHub Actions workflowで監査した。これはdocumentation-only validationであり、fresh scientific seedへのアクセスやscientific executionを行っていない。

G4-02について追加のscientific executionは行わない。第四世代研究をその後継続する場合、G4-03またはG4-04など次のAgendaについて**個別のauthorization review**から開始する。G4-01のeligibility gateだけでfresh scientific executionが自動承認されることはない。

G4-02 research branchはユーザーの明示承認によりPR #154で`main`へ統合済みである。統合記録は[`checkpoints/2026-09-20-g4-02-main-integration-complete.md`](checkpoints/2026-09-20-g4-02-main-integration-complete.md)を参照する。

## 保護境界

- G4-02 Study 1〜4をrepair/reopen/rerunしない。
- closed scientific seedを救済目的で再読しない。
- G3-12をrepair/replayしない。
- G4-10 depth11へアクセスしない。
- G4-02の結果をpublic AIへ自動反映しない。
- G4-02統合後の追加変更は、既存の科学的closureを再解釈せず、新たな作業として扱う。

## 正本

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
- [`RESUME_HERE.md`](RESUME_HERE.md)
- [`checkpoints/2026-09-20-g4-02-closed-no-scientific-decision.md`](checkpoints/2026-09-20-g4-02-closed-no-scientific-decision.md)
- [`checkpoints/2026-09-20-g4-02-main-integration-complete.md`](checkpoints/2026-09-20-g4-02-main-integration-complete.md)
- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_4_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_4_PROTOCOL.md)
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)
- [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md)