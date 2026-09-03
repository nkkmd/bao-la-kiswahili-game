# SILGM-STUDY1 — Decision Register

更新日: 2026-09-03

| ID | Decision | Status | Scientific consequence |
|---|---|---|---|
| SILGM-D001 | Post-G3-06 program review | `G3-07-AUTHORIZED` | Prospective Study definition and governed scientific stages may proceed only after stage-specific authorization. |
| SILGM-D002 | Additional prerequisite Study | `NONE` | LGTGMIV F1-F5 plus stage-specific technical validation is sufficient. |
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
| SILGM-D016 | Scientific Stage IDs | `S1/S2 FROZEN` | Development and formal stages remain separated from technical Stage 0 versions. |
| SILGM-D017 | Technical namespace | `31709001..31709008` | Scientific use prohibited. |
| SILGM-D018 | Stage 1 namespace | `31710001..31710256 / CONSUMED` | Exactly-one Stage 1 execution completed; cannot be reused. |
| SILGM-D019 | Stage 2 namespace | `31720001..31720384 / CONSUMED` | Exactly-one Stage 2 execution completed; cannot be reused. |
| SILGM-D020 | Engineering collision | `31700001..31700512 PROHIBITED` | Existing public-AI engineering validation namespace is not reused. |
| SILGM-D021 | Stage 1 population | `24 NAMUA + 24 MTAJI` | Achieved exactly; one selected root per trajectory, no seed extension. |
| SILGM-D022 | Stage 2 population | `36 NAMUA + 36 MTAJI` | Achieved exactly; fresh held-out roots, no seed extension. |
| SILGM-D023 | Source selection | `HASH-ASSIGNED PHASE + MIN HASH RANK` | Geometry/search/outcome blind selection. |
| SILGM-D024 | Development threshold | `PHASE-SPECIFIC EXACT MIDPOINT MEDIAN` | Stage 1 thresholds frozen into promoted identities; Stage 2 did not refit them. |
| SILGM-D025 | Promotion support | `HIGH/LOW >=8; CHANGED/UNCHANGED >=4 PER PHASE` | Weak/degenerate Stage-1 candidates were not promoted. |
| SILGM-D026 | Promotion direction | `NONZERO SAME SIGN IN BOTH PHASES` | Direction frozen before formal evidence. |
| SILGM-D027 | Metric competition | `MAX EXACT |RD| SUM; LEXICAL TIE` | At most one G1..G5 metric per contrast×endpoint slot. |
| SILGM-D028 | Max promoted candidates | `15` | One candidate per 3×5 slot. |
| SILGM-D029 | Stage 2 support | `HIGH/LOW >=10; CHANGED/UNCHANGED >=6 PER PHASE` | Formal candidate failing support is NON-ESTIMABLE. |
| SILGM-D030 | Formal test | `EXACT STRATIFIED CONDITIONAL HYPERGEOMETRIC CONVOLUTION` | Phase-stratified association, not causal inference. |
| SILGM-D031 | Formal tail | `ONE-SIDED FROZEN STAGE-1 DIRECTION` | Direction did not change after Stage 1. |
| SILGM-D032 | Multiplicity | `HOLM / FWER 1/20` | Applied over 7 estimable promoted candidates. |
| SILGM-D033 | Exact arithmetic | `INTEGER / REDUCED RATIONAL / BIGINT` | No scientific float tolerance or rounding. |
| SILGM-D034 | G2-02 reuse | `TECHNICAL PRECEDENT ONLY` | Scientific rows/results not reused; larger-resource search is not truth. |
| SILGM-D035 | G3-04 reuse | `CONTEXT ONLY` | C1/C6 values/directions did not select G3-07 thresholds/candidates. |
| SILGM-D036 | G3-06 reuse | `IDENTITY-EXCLUSION ONLY` | Selection mismatch diagnostics and event/mechanism directions are prohibited. |
| SILGM-D037 | Production/independent separation | `MANDATORY` | Independent G3-07 search/aggregation may not import production G3-07 implementation. |
| SILGM-D038 | Canonical equality | `SORTED JSON -> UTF-8 -> SHA-256 EXACT` | Runtime prototype identity is not a scientific equality primitive. |
| SILGM-D039 | Resource probe | `TECHNICAL FIXTURES ONLY` | Fresh scientific roots were not used to choose ceilings. |
| SILGM-D040 | Fresh execution integrity | `MAX 1 PER STAGE` | Lease, source binding, single trigger, concurrency guard, artifact-before-mirror, audit required. |
| SILGM-D041 | No-rescue | `CROSSED / CLOSED` | Stage 1 and Stage 2 evidence cannot be repaired, extended or rerun within this Study. |
| SILGM-D042 | Protected depth-10 | `SEALED / NOT GENERATED / NOT READ / NOT PEEKED` | Remains unavailable to the Study. |
| SILGM-D043 | Stage 0 v1 | `TECHNICAL-INVALID / NO RERUN` | Synthetic expected G5 fraction was wrong; no scientific evidence generated. |
| SILGM-D044 | Stage 0 v2 | `TECHNICAL-INVALID / NO RERUN` | Fixed technical Mtaji seed unavailable; no scientific evidence generated. |
| SILGM-D045 | Stage 0 v3 | `PRECOMPUTATION-TECHNICAL-INVALID` | Verifier self-reference; zero computation and zero lease. |
| SILGM-D046 | Stage 0 v4 | `STAGE0-PASS` | Technical feasibility validated. |
| SILGM-D047 | Stage 0 v4 deterministic core | `fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076` | Frozen technical provenance. |
| SILGM-D048 | Stage 1 preauthorization audit | `PASS` | Fresh-free source binding, firewall, independence and unarmed fail-closed validated. |
| SILGM-D049 | Stage 1 authorization | `STAGE1-AUTHORIZED / EXECUTED ONCE` | Authorization nonce `SILGM-S1-AUTH-2026-09-03-V1-01`; no rerun. |
| SILGM-D050 | Stage 1 result | `STAGE1-PASS` | Valid 24+24 development population and exact production/independent agreement. |
| SILGM-D051 | Stage 1 canonical result | `20209db1b87bdf3e87f48f1968014154d6f2862820eabea40be645cd1f924470` | Canonical raw scientific-result identity. |
| SILGM-D052 | Stage 1 promoted set | `8 CANDIDATES` | Only these eight frozen identities entered Stage 2; they were hypotheses, not confirmations. |
| SILGM-D053 | Stage 2 input materialization v1 | `FRESH-FREE CONTROL-PLANE FAILURE` | Stage-1 gzip transport encoding mismatch; Stage 2 seed access remained zero; no same-trigger reuse. |
| SILGM-D054 | Stage 2 input materialization v2 | `PASS` | Formal input limited to 8 promoted identities plus 48 Stage-1 identity exclusions; formal input core `6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0`. |
| SILGM-D055 | Stage 2 preauthorization audit | `STAGE2-PREAUTH-STATIC-AUDIT-PASS` | 17 bindings, 8 candidates, 48 exclusions, separation, formal test/Holm and unarmed fail-closed validated without Stage-2 seed access. |
| SILGM-D056 | Stage 2 authorization | `STAGE2-AUTHORIZED / EXECUTED ONCE` | Separate authorization review commit `49a5bf7aa33e69c20ed79cf64a0d18eca628426a`; nonce `SILGM-S2-AUTH-2026-09-03-V1-01`. |
| SILGM-D057 | Stage 2 result | `STAGE2-PASS` | Valid 36+36 formal population, exact selection agreement, resource gates PASS. |
| SILGM-D058 | Stage 2 canonical result | `05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9` | Canonical raw scientific-result identity; result artifact `9879091983`. |
| SILGM-D059 | Formal estimability | `7 ESTIMABLE / 1 NON-ESTIMABLE` | Node-budget × E4 × G2 failed frozen Mtaji changed>=6 support gate and received no p-value. |
| SILGM-D060 | Formal confirmation 1 | `CONFIRMED` | Depth × E3 ranking preorder × G1 root legal width / `HIGHER-IN-HIGH`; exact p `78185629/18730440540`, Holm rank 3, threshold `1/100`. |
| SILGM-D061 | Formal confirmation 2 | `CONFIRMED` | Node-budget × E3 ranking preorder × G1 root legal width / `HIGHER-IN-HIGH`; exact p `467/107003475`, Holm rank 1, threshold `1/140`. |
| SILGM-D062 | Formal confirmation 3 | `CONFIRMED` | Quiescence × E3 ranking preorder × G1 root legal width / `HIGHER-IN-HIGH`; exact p `96013549/4043768323725`, Holm rank 2, threshold `1/120`. |
| SILGM-D063 | Other estimable promoted candidates | `4 NOT-CONFIRMED` | Frozen formal criteria were not satisfied after Holm; no rescue/refit. |
| SILGM-D064 | Joint interpretation | `BOUNDED NON-CAUSAL ASSOCIATION` | Across three separate peer contrasts, formal confirmations consistently link high G1 root legal width with concentration of E3 ranking-preorder change; no new omnibus test is inferred. |
| SILGM-D065 | Study lifecycle | `CLOSED / FORMAL-COMPLETE` | G3-07 scientific execution is complete; future validation requires a new prospective Study/version. |
| SILGM-D066 | Main integration at Study closure | `EXPLICIT USER INSTRUCTION REQUIRED / NOT PERFORMED AT CLOSURE` | Study closure itself did not authorize merge/integration to main. |
| SILGM-D067 | Post-closure main integration | `COMPLETE / FAST-FORWARD` | Later explicit user instruction authorized integration of research branch tip `7f14538aa0ec3edd2045649025715219ffea17ec`; scientific decisions unchanged. |
| SILGM-D068 | Post-G3-07 downstream review | `COMPLETED / G3-08 CLOSED TECHNICAL-INVALID` | Separate review later authorized G3-08; `LGPML-STUDY1` subsequently closed technical-invalid. This does not modify G3-07 evidence or formal decisions. |

Canonical machine-readable Study contract: `prereg/STUDY_1_SPEC.json`.

Compact scientific records:

- `results/stage-1/STAGE_1_RESULT_SUMMARY.json`
- `results/stage-2/STAGE_2_RESULT_SUMMARY.json`
- `STUDY_1_FINAL_REPORT.md`
- `REPRODUCIBILITY_INDEX.md`
