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
| CLGR-D013 | Stage 1 seeds | `31910001..31910256 / NOT CONSUMED` | 24 Namua + 24 Mtaji target。 |
| CLGR-D014 | Stage 2 seeds | `31920001..31920384 / NOT CONSUMED` | 36 Namua + 36 Mtaji target。 |
| CLGR-D015 | Technical seeds | `31909001..31909008` | scientific use永久禁止。 |
| CLGR-D016 | Sampling unit | `ONE ROOT PER UNIQUE SOURCE TRAJECTORY` | within-trajectory repeated-root inflationを回避。 |
| CLGR-D017 | Root selection | `PHASE HASH ASSIGNMENT + MIN HASH RANK` | geometry/search/outcome blind。 |
| CLGR-D018 | Stage 1 pass | `48/48 exact + nondegeneracy gates` | PASS時のみStage 2 review eligibility。 |
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
