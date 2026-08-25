# PBAI-P1 Decision Register

## Program decisions frozen at establishment

### D01 — Separate engineering track

PBAI-P1はResearch Trackとは独立する。engineering resultは既存研究のformal decisionを変更しない。

### D02 — Evidence cutoff

PBAI-P1はprogram-start anchor `2db7c4d65771066e914f32cbc4116fcc3e9e386a`までのGeneration-1 completed researchを科学的inputとする。Generation-2 outcomeを途中追加しない。

### D03 — No implementation at program establishment

Program文書の追加だけではpublic AIコードを変更しない。Phase A/B/C完了前のcandidate implementationを承認しない。

### D04 — Research labels remain intact

`CONFIRMED`、`NOT-CONFIRMED`、`INCONCLUSIVE`、`NON-ESTIMABLE`、bounded exact、exploratory/descriptive等をengineering都合で再ラベルしない。

### D05 — No unvalidated win-probability semantics

Position Evaluation / Win-Rate Calibration Study 1はformal `INCONCLUSIVE`であり、既存mappingをvalidated Bao win probabilityとしてpublic UIまたはAI primary logicへ導入しない。

### D06 — RAW identity remains authoritative

validated transform setが存在しないため、unvalidated symmetry/reflection/seat swap/canonicalizationをproduction state identity、TT key、tablebase keyへ導入しない。

### D07 — Human claims remain separate

machine search complexity、reply concentration、error dependenceをhuman difficulty/error/deceptionとして表示しない。

### D08 — Ablation before combination

複数mechanismを同時導入せず、原則single-candidate comparisonから開始する。

### D09 — Holdout protection

release holdoutはcandidate tuningへ使用しない。holdout消耗時はnew blockをprospectively freezeする。

### D10 — Release safety dominates strength

rule correctness、invalid-state、crash、major operational regressionをstrength improvementで相殺しない。

## Future decisions

PBAI-B以降のbaseline ID、benchmark numeric thresholds、candidate authorization、adoption/rejection、release/rollback decisionは本registerへ追記する。
