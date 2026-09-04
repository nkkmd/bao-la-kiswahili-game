# 2026-09-04 — G3-12 main integration complete

## Decision

**`COMPLETE / FAST-FORWARD / force=false`**

G3-12 `LGTGGC-STUDY1`のresearch branch closureを、明示的ユーザー指示に基づいて`main`へ統合した。

```text
Study = LGTGGC-STUDY1
Final scientific decision = CLOSED / TECHNICAL-INVALID
Source research tip = 146a515671838606034efd9d4c3120e9b4c597f2
Previous main = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
Integration method = fast-forward
Force = false
```

## Scientific boundary

本統合はrepository integration/bookkeepingのみであり、科学的判断を変更しない。

```text
Stage 0 = v3 / STAGE0-PASS
Stage 1 = EXECUTED EXACTLY ONCE / TECHNICAL-INVALID
SFCDF Stage 1 = STAGE1-PASS / development readiness only
SILGM Stage 1 = STAGE1-TECHNICAL-INVALID
GCLD Stage 1 = NOT EXECUTED / seeds unread
Stage 2 = NOT AUTHORIZED / NOT EXECUTED / seeds unread
Formal generalization decisions = NONE
Formal counterexample decisions = NONE
same-evidence rerun = NOT AUTHORIZED
G3-11 depth-10 rerun = false
depth 11 access = false
G2-12 estimator scientific input = false
```

## Documentation bookkeeping

統合後のcurrent-facing整合性を保つため、root README、Research Index、Future Research Agenda、RG3 README/CURRENT_STATUS、G3-12 README/CURRENT_STATUS/Reproducibility Indexを`main integration COMPLETE`へ更新した。Decision RegisterのD029は統合前のhistorical boundaryとして保持し、D030で統合完了を追記した。Final Reportおよびpre-main checkpointは当時の記録として変更していない。

## Result

**G3-12 main integration and post-integration bookkeeping are complete.**
