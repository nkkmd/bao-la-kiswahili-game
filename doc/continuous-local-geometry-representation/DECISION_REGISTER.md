# CLGR-STUDY1 — Decision Register

Updated: 2026-09-03

| ID | Decision | Status | Scientific consequence |
|---|---|---|---|
| CLGR-D001 | Post-G3-08 program review | `G3-09-AUTHORIZED` | Study freezeとtechnical-only Stage 0のみ許可。fresh Stage 1は別authorization。 |
| CLGR-D002 | Formal Study ID | `CLGR-STUDY1` | Freeze後immutable。 |
| CLGR-D003 | Baseline main | `6c218b9cc3f492fb96d051768702682fef9bb66a` | Review source-of-truth。 |
| CLGR-D004 | Research branch | `research/g3-09-continuous-local-geometry-representation` | mainから科学開発を分離。 |
| CLGR-D005 | Measurement foundation | `LGTGMIV F1-F5 ONLY` | RAW-only / relative depth 5。 |
| CLGR-D006 | Representation | `CLGR-R1-EXACT-SQUASHED-L1` | single primary family; post-development family selection禁止。 |
| CLGR-D007 | Axis universe | `A1..A6 FROZEN` | exact local-geometry level panel。 |
| CLGR-D008 | Scaling | `q/(1+q) EXACT RATIONAL` | data-independent; z-score/min-max/PCA禁止。 |
| CLGR-D009 | Weighting | `EQUAL WEIGHT 1` | learned/favorable weighting禁止。 |
| CLGR-D010 | Distance | `EXACT L1` | float toleranceなし。 |
| CLGR-D011 | Neighborhood | `k=3 / TIE-INCLUSIVE` | exact cutoff tiesを保持。 |
| CLGR-D012 | Phase handling | `METADATA STRATUM ONLY` | phaseをcoordinate/scalingへ使用しない。 |
| CLGR-D013 | Stage 1 seeds | `31910001..31910256` | 24 Namua + 24 Mtaji target。 |
| CLGR-D014 | Stage 2 seeds | `31920001..31920384` | 36 Namua + 36 Mtaji target。 |
| CLGR-D015 | Technical seeds | `31909001..31909008` | scientific use永久禁止。 |
| CLGR-D016 | Sampling unit | `ONE ROOT PER UNIQUE SOURCE TRAJECTORY` | within-trajectory repeated-root inflationを回避。 |
| CLGR-D017 | Root selection | `PHASE HASH ASSIGNMENT + MIN HASH RANK` | geometry/search/outcome blind。 |
| CLGR-D018 | Stage 1 pass rule | `48/48 exact + nondegeneracy gates` | PASS時のみStage 2 review eligibility。 |
| CLGR-D019 | Stage 2 formal endpoints | `E1..E6 EXACT GATES` | coordinate/distance/neighborhood/reconstruction/order/definedness。 |
| CLGR-D020 | Formal statistics | `NO NULL-HYPOTHESIS TEST` | exact conjunctive eligibility; p-value/multiplicity N/A。 |
| CLGR-D021 | Formal decision labels | `ELIGIBLE / NOT-ELIGIBLE / NON-ESTIMABLE / TECHNICAL-INVALID` | representation instrumentのみ。 |
| CLGR-D022 | G3-08 partial data | `PROHIBITED SCIENTIFIC INPUT` | persistence/memory evidenceを再利用しない。 |
| CLGR-D023 | G3-08 relay-limit | `TECHNICAL DESIGN INFO ONLY` | fail-closed/resource設計にのみ利用。 |
| CLGR-D024 | G3-04/G3-07 outcomes | `CONTEXT ONLY` | feature/scaling/weight/distance selectionに使用禁止。 |
| CLGR-D025 | Production/independent | `MANDATORY STRUCTURAL SEPARATION` | CLGR aggregation相互import禁止。 |
| CLGR-D026 | Scientific equality | `CANONICAL EXACT PRIMITIVES` | object prototype/runtime metadata非依存。 |
| CLGR-D027 | Resource ceilings | `FROZEN BEFORE FRESH ACCESS` | fresh後の緩和禁止。 |
| CLGR-D028 | Execution ceiling | `MAX 1 SCIENTIFIC EXECUTION PER STAGE` | duplicate execution invalid。 |
| CLGR-D029 | No-rescue | `CROSSES AT FIRST STAGE 1 FRESH ACCESS` | same-evidence repair/rerun、seed/feature/rule変更禁止。 |
| CLGR-D030 | Protected depth-10 | `SEALED / NOT GENERATED / NOT READ / NOT PEEKED` | G3-09で使用禁止。 |
| CLGR-D031 | Main integration | `EXPLICIT USER INSTRUCTION ONLY` | branch closure後も自動統合しない。 |
| CLGR-D032 | Stage 0 authorization | `AUTHORIZED / TECHNICAL-ONLY` | Stage 1/2 seed accessなし。 |
| CLGR-D033 | Stage 0 v1 | `TECHNICAL-INVALID / PRE-FRESH / NO RERUN` | synthetic relay sentinelのtechnical fixture failure。scientific contract変更なし。 |
| CLGR-D034 | Stage 0 v2 | `STAGE0-PASS` | fresh-free technical versioning後、representation/exactness/implementation separationを確認。 |
| CLGR-D035 | Stage 1 preauthorization v1 | `SYNTAX-INVALID / PRE-FRESH / NO RERUN` | audit script local variable collision。fresh seed accessなし。 |
| CLGR-D036 | Stage 1 preauthorization v2 | `STAGE1-PREAUTH-STATIC-AUDIT-PASS` | source binding、firewall、未武装workflow、no-rescue boundaryを確認。 |
| CLGR-D037 | Stage 1 authorization | `STAGE1-AUTHORIZED / MAX 1` | seeds `31910001..31910256`のみexactly-one fresh executionを許可。 |
| CLGR-D038 | Stage 1 execution | `STAGE1-PASS` | 24 Namua + 24 Mtaji、48/48 exact、6/6 axes nondegeneracy pass。 |
| CLGR-D039 | Stage 1 canonical result | `1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529` | immutable development result。formal eligibilityではない。 |
| CLGR-D040 | Stage 1 seed block | `CONSUMED` | same-evidence rerun禁止。 |
| CLGR-D041 | Stage 2 eligibility review | `ELIGIBLE FOR SEPARATE AUTHORIZATION REVIEW` | Stage 1 PASSのみ。Stage 2自動authorizeではない。 |
| CLGR-D042 | Stage 2 preauthorization | `STAGE2-PREAUTH-STATIC-AUDIT-PASS` | Stage 1 identity-only exclusion、no-refit、source bindingをfresh-free確認。 |
| CLGR-D043 | Stage 2 authorization | `CLGR-STAGE2-AUTHORIZED / MAX 1` | seeds `31920001..31920384`のみexactly-one formal executionを許可。 |
| CLGR-D044 | Stage 2 selection | `36 NAMUA + 36 MTAJI = 72` | frozen formal population selection completed。 |
| CLGR-D045 | Stage 2 execution | `TECHNICAL-INVALID` | 61 root measurements後、formal root index 61でrelay-limit fail-closed。 |
| CLGR-D046 | Stage 2 failure identity | `MTAJI / seed 31920066` | root `e2260d76...b8087c`; error `relay-limit enumeration 43481b84...be86b`。 |
| CLGR-D047 | Stage 2 scientific summary | `NOT AUTHORIZED` | 61 partial formal measurementsからformal inference禁止。 |
| CLGR-D048 | Stage 2 seed block | `CONSUMED` | rerun、extension、root replacement、ceiling緩和禁止。 |
| CLGR-D049 | Formal representation eligibility | `NOT ESTABLISHED` | `FORMAL-ELIGIBLE`でも`FORMAL-NOT-ELIGIBLE`でもない。 |
| CLGR-D050 | Study closure | `CLOSED / TECHNICAL-INVALID` | G3-09をno-rescueで終了。 |
| CLGR-D051 | Future CLGR work | `NEW PROSPECTIVE STUDY REQUIRED` | relay-limit-safe redesignはCLGR-STUDY1のrepairとして扱わない。 |
| CLGR-D052 | G3-10 downstream | `NOT AUTHORIZED` | separate post-G3-09 current-state reviewでdependencyを再評価。 |
| CLGR-D053 | Protected depth-10 at closure | `SEALED / NOT GENERATED / NOT READ / NOT PEEKED` | G3-11 protected evidenceを維持。 |
| CLGR-D054 | Main integration at closure | `NOT AUTHORIZED / NOT PERFORMED` | user明示指示までresearch branchをreview-readyに保持。 |
