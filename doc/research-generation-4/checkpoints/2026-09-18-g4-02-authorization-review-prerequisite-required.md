# 2026-09-18 — G4-02 認可レビューcheckpoint

Agenda: `G4-02`  
対象review: `G4-02-AUTHORIZATION-REVIEW-2026-09-18-V1`  
状態: **`PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED`**

## 判定

post-G4-01 current-state G4-02 authorization reviewを完了した。

```text
reviewed main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
G4-02 authorization = PREREQUISITE-REQUIRED
G4-02 Study ID = NOT ASSIGNED
G4-02 scientific seed access = 0
G4-02 scientific outcome generated = false
heavy scientific execution = false
main integration = NOT AUTHORIZED / NOT PERFORMED
```

blocking prerequisiteは、RG4共通contractがformal heldoutに要求する`seed / source trajectory / opening prefix / RAW root`分離のうち、G4-01 Stage 1R保存source recordからopening-prefix identityを監査できないことである。

G4-01のfrozen execution amendmentでは`completedSourceRereadAuthorized = false`、`fullFreshWorkflowRerunAuthorized = false`であるため、旧seedの再読による後付け再構成は行わない。

詳細な判定理由と10項目gate reviewは[`../../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md`](../../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md)を正本とする。

## 安全な再開位置

1. G4-01の既存immutable artifact/provenanceだけでopening-prefix identityを回収可能か確認する。
2. 回収可能ならidentity-only exclusion manifestをdurableに固定する。
3. 不可能なら、G4-02とは別のProgram-level methodology reviewを先に行う。
4. prerequisite解消後、G4-02 authorization reviewを再実施する。
5. `AUTHORIZED`になるまでStudy ID、formal seed block、scientific execution contractを確定せず、scientific seedへアクセスしない。

## 維持する境界

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
