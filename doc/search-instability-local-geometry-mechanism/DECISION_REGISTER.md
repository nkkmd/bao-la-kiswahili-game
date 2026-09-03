# SILGM-STUDY1 — Decision Register

更新日: 2026-09-03

| ID | Decision | Status | Scientific consequence |
|---|---|---|---|
| SILGM-D001 | Post-G3-06 program review | `G3-07-AUTHORIZED` | Prospective Study definition + technical-only Stage 0 may proceed; fresh Stage 1 remains blocked. |
| SILGM-D002 | Additional prerequisite Study | `NONE` | LGTGMIV F1-F5 plus Stage-0 revalidation of search/association semantics is sufficient. |
| SILGM-D003 | Formal Study ID | `SILGM-STUDY1` | Immutable after freeze. |
| SILGM-D004 | Historical `Mechanism` label | `NON-CAUSAL` | Only bounded association/concentration/structural-relation claims are authorized. |
| SILGM-D005 | Study baseline | `ba48c5c3643649655137d5d3c07988fdc84bee9d` | Post-authorization main is the branch baseline. |
| SILGM-D006 | Research branch | `research/g3-07-search-instability-local-geometry-mechanism` | Scientific development isolated from main. |
| SILGM-D007 | Representation | `RAW-ONLY / transforms=[] / depth=5` | No symmetry/canonical quotient. |
| SILGM-D008 | State identity | `7 FIELDS` | pits,reserve,houseOwned,player,phase,winner,pending. |
| SILGM-D009 | Move identity | `8 FIELDS` | type,phase,row,index,direction,side,houseChoice,houseTwo. |
| SILGM-D010 | Geometry source | `LGTGMIV F1-F5 ONLY` | No G3-02/03/05/06 candidate direction or telemetry inheritance. |
| SILGM-D011 | Geometry metrics | `G1..G5 FROZEN` | root width, cumulative tree occurrence, duplicate-transition fraction, cumulative tree/RAW ratio, unit-width occupancy. |
| SILGM-D012 | Search conditions | `6 CONDITIONS / 3 PEER CONTRASTS` | Depth, node-budget and quiescence perturbations; no truth/reference asymmetry. |
| SILGM-D013 | Search endpoints | `E1..E5 FROZEN` | canonical-best, TopSet, ranking preorder, best-second gap, PV prefix2 changes stay separate. |
| SILGM-D014 | Score tie tolerance | `0` | Exact score ties only; no post-result epsilon. |
| SILGM-D015 | Canonical best | `DETERMINISTIC REPRESENTATIVE ONLY` | Does not imply objective unique best move. |
| SILGM-D016 | Stage IDs | `S0/S1/S2 FROZEN` | Technical, development, formal stages separated. |
| SILGM-D017 | Technical namespace | `31709001..31709008` | Scientific use prohibited. |
| SILGM-D018 | Stage 1 namespace | `31710001..31710256` | Reserved, not consumed at freeze. |
| SILGM-D019 | Stage 2 namespace | `31720001..31720384` | Reserved, not consumed at freeze. |
| SILGM-D020 | Engineering collision | `31700001..31700512 PROHIBITED` | Existing public-AI engineering validation namespace is not reused. |
| SILGM-D021 | Stage 1 population | `24 NAMUA + 24 MTAJI` | One selected root per distinct source trajectory; no seed extension. |
| SILGM-D022 | Stage 2 population | `36 NAMUA + 36 MTAJI` | Fresh held-out roots; no seed extension. |
| SILGM-D023 | Source selection | `HASH-ASSIGNED PHASE + MIN HASH RANK` | Geometry/search/outcome blind selection. |
| SILGM-D024 | Development threshold | `PHASE-SPECIFIC EXACT MIDPOINT MEDIAN` | Stage 1 only; Stage 2 uses frozen thresholds. |
| SILGM-D025 | Promotion support | `HIGH/LOW >=8; CHANGED/UNCHANGED >=4 PER PHASE` | Weak/degenerate Stage-1 candidates are not promoted. |
| SILGM-D026 | Promotion direction | `NONZERO SAME SIGN IN BOTH PHASES` | Direction fixed before formal evidence. |
| SILGM-D027 | Metric competition | `MAX EXACT |RD| SUM; LEXICAL TIE` | At most one G1..G5 metric per contrast×endpoint slot. |
| SILGM-D028 | Max promoted candidates | `15` | One candidate per 3×5 slot. |
| SILGM-D029 | Stage 2 support | `HIGH/LOW >=10; CHANGED/UNCHANGED >=6 PER PHASE` | Failure yields candidate NON-ESTIMABLE. |
| SILGM-D030 | Formal test | `EXACT STRATIFIED CONDITIONAL HYPERGEOMETRIC CONVOLUTION` | Phase-stratified association, not causal inference. |
| SILGM-D031 | Formal tail | `ONE-SIDED FROZEN STAGE-1 DIRECTION` | Direction cannot be changed after formal evidence. |
| SILGM-D032 | Multiplicity | `HOLM / FWER 1/20` | Applies over estimable promoted candidates. |
| SILGM-D033 | Exact arithmetic | `INTEGER / REDUCED RATIONAL / BIGINT` | No scientific float tolerance or rounding. |
| SILGM-D034 | G2-02 reuse | `TECHNICAL PRECEDENT ONLY` | Scientific rows/results not reused; larger-resource search is not truth. |
| SILGM-D035 | G3-04 reuse | `CONTEXT ONLY` | C1/C6 values/directions do not select G3-07 thresholds/candidates. |
| SILGM-D036 | G3-06 reuse | `IDENTITY-EXCLUSION ONLY` | Selection mismatch diagnostics and event/mechanism directions are prohibited. |
| SILGM-D037 | Production/independent separation | `MANDATORY` | Independent G3-07 search/aggregation may not import production G3-07 implementation. |
| SILGM-D038 | Canonical equality | `SORTED JSON -> UTF-8 -> SHA-256 EXACT` | Runtime prototype identity is not a scientific equality primitive. |
| SILGM-D039 | Resource probe | `TECHNICAL FIXTURES ONLY` | Fresh scientific roots cannot be used to choose ceilings. |
| SILGM-D040 | Fresh execution integrity | `MAX 1 PER STAGE` | Lease, source binding, single trigger, concurrency guard, artifact-before-mirror, audit required. |
| SILGM-D041 | No-rescue | `FROZEN` | Crosses at first fresh generation/read; no same-evidence repair/rerun or redesign. |
| SILGM-D042 | Protected depth-10 | `SEALED / NOT GENERATED / NOT READ` | No generation/read/peek/trial enumeration/resource estimate. |
| SILGM-D043 | Stage 0 v1 | `AUTHORIZED / NOT YET EXECUTED` | Technical-only; pass does not authorize fresh Stage 1. |
| SILGM-D044 | Main integration | `EXPLICIT USER INSTRUCTION REQUIRED` | No automatic merge after closure. |

Canonical machine-readable contract: `prereg/STUDY_1_SPEC.json`.
