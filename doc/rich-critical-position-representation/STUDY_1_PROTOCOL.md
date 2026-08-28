# RCPR-STUDY1 — Protocol

## 1. Study identity

```text
Program = G2-06
Study ID = RCPR-STUDY1
Research Generation = Research Generation 2
Formal title = Rich Critical-Position Representation Study 1
Baseline main = 37480777246aa306c6ca3d0679d936b5e0107071
Branch = research/g2-06-rich-critical-position-representation
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
```

The study-start prospective authority is `preregistration/STUDY_START_FREEZE.md`.

## 2. Scientific target

The target is a reproducible rich representation of information available at or before a selected root that can be frozen on fresh development evidence and then evaluated once on a fully independent formal population for its ability to identify fixed-policy empirical continuation-divergence structure.

This is not a reclassification of the 139/600 high-divergence roots from Research Generation 1 and not a rescue of the prior 1183-candidate grammar.

## 3. Primary construct continuity

The default criticality construct is inherited only as an operational measurement definition from the closed Critical Positions / Outcome Branching Study 1:

```text
p_hat(s,m) = root-actor wins / frozen replicate count
D_range(s) = max_m p_hat(s,m) - min_m p_hat(s,m)
highDivergence(s) = D_range(s) >= 0.30
```

The exact continuation instrument, replicate count, maximum post-root plies, source identities, PRNG semantics, and tie-breaking must be newly frozen for RCPR before Stage 1 outcome generation. The prior study's measured roots/outcomes are not reused.

`D_range` is a policy-conditioned empirical continuation quantity. It is not a game-theoretic winning probability and not a validated calibrated Bao win probability.

## 4. Authoritative identity

RAW state identity is exactly:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded:

```text
turn,reason
```

The validated transformation set is `[]`. No canonicalization or symmetry reduction is allowed.

Historical root-occurrence provenance may be added for temporal-context features, but RAW identity remains the scientific state identity and mandatory cross-stage state-overlap firewall.

## 5. Leakage classes

Every feature has one frozen class:

```text
A PRE_ROOT_OBSERVABLE
B ROOT_DERIVED_OUTCOME_INDEPENDENT
C SEARCH_DERIVED_OUTCOME_INDEPENDENT
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

Only A-C are predictor-eligible. D is forbidden.

Examples:

- board/reserve/house/phase at the root -> A;
- exact legal-move geometry generated from the root -> B;
- one-move successor / bounded reply graph generated deterministically from the root -> B;
- fixed shallow-search best/second-best gaps generated before continuation measurement -> C;
- pre-root previous-ply descriptors -> A when the historical prefix ends strictly before the root;
- continuation wins, future winner, rollout states, `D_range`, post-root empirical outcome -> D.

## 6. Prospectively declared representation-family search space

Stage 0/1 may evaluate only:

```text
LOCAL_PIT_TOPOLOGY
CAPTURE_GRAPH
LEGAL_MOVE_GEOMETRY
REPLY_GRAPH
RESERVE_HOUSE_RELATION
MOVE_SET_ENTROPY
SEARCH_GAP_VECTOR
LOCAL_TEMPORAL_CONTEXT
```

No additional feature family may be introduced after Stage 1 scientific outcomes are observed.

A family may be excluded before Stage 1 outcome generation for a documented technical reason such as ambiguous semantics, non-determinism, missingness that cannot be frozen, leakage risk, independent-recomputation failure, or infeasible resource cost. Such exclusion is recorded as technical/development governance, not a scientific result.

## 7. Stage 0 — `RCPR-S0-TECHNICAL-2026-08-28-v1`

Stage 0 is technical-only.

Required outputs:

1. exact feature dictionary with name, type, leakage class, phase applicability, missingness rule, and source dependency;
2. deterministic root serializer and occurrence/history provenance contract;
3. production feature extractor prototype;
4. structurally separate independent feature recomputation path;
5. search-profile specification if any class-C family remains eligible;
6. positive-control matrix;
7. negative-control matrix;
8. resource/throughput characterization;
9. Stage-0 eligibility disposition for each of the eight declared families.

Mandatory negative controls include at minimum:

- missing/corrupted `pending`;
- mismatched RAW key;
- a post-root history row entering temporal context;
- continuation outcome fields supplied to the feature builder;
- representation dependence on mutated continuation result;
- Stage identity overlap injection;
- search profile/hash drift;
- feature-schema order/name/type drift;
- production/independent feature mismatch;
- phase-applicability corruption.

Stage 0 emits no G2-06 scientific confirmation evidence.

## 8. Stage 1 — `RCPR-S1-DEVELOPMENT-2026-08-28-v1`

Stage 1 uses a fresh development population and development-only criticality outcomes.

Before Stage 1 outcome generation, a Stage 1 preregistration must freeze:

- fresh source seed block and generation strata;
- source-game count;
- root-selection algorithm, quotas, exclusion rules, and no-replacement semantics;
- continuation instrument and exact source hashes;
- root criticality measurement parameters;
- Stage-0-eligible feature schema;
- development model/distance/classifier search space;
- deterministic model-selection procedure;
- grouping/cross-validation rule where applicable;
- allowed preprocessing, interactions, and regularization;
- zero-promotion/development-blocked rule;
- resource ceilings and technical-failure handling.

Stage 1 may use its own outcomes for development only. It may not use Research Generation 1 CPOB outcomes or any G2-06 Stage 2 outcomes.

The preferred development architecture is a deterministic supervised representation-validation pipeline with group-aware resampling by historical trajectory, while preserving an outcome-independent feature extractor. Alternative distance/clustering semantics remain eligible only if frozen before Stage 1 outcome generation.

Stage 1 must output a single formal target contract or close without Stage 2 authorization.

## 9. Stage 1 -> Stage 2 transition freeze

If Stage 1 forms a formal target, the transition freeze must bind exactly one representation/scoring contract, including:

- final included feature list and order;
- feature-family membership;
- transformations/scaling/imputation;
- interaction/composition terms;
- fitted coefficients/parameters/centroids or deterministic fitting replay contract;
- score definition;
- operating threshold or candidate mapping;
- exact primary endpoint;
- exact acceptance thresholds;
- secondary endpoint list;
- multiplicity rule;
- uncertainty method;
- support/phase/trajectory/recurrence gates;
- Stage 2 source population/seed block;
- formal sample-size/estimability gates;
- Stage 1 overlap firewall;
- production and verifier source hashes.

No Stage 2 scientific outcome may exist before this freeze is committed.

## 10. Formal endpoint design principles

The Stage 2 primary endpoint must measure out-of-development reproducibility, not in-sample fit.

The transition freeze must prospectively select a primary design from appropriate metrics such as:

- discrimination against the frozen high-divergence label;
- calibration of a frozen score against observed high-divergence frequency;
- predicted-positive enrichment with minimum support;
- recurrence/stability across phase and trajectory strata;
- a jointly gated combination of the above.

The exact metric, threshold, confidence/uncertainty method, and gate conjunction must be chosen from Stage 1 development evidence and frozen before Stage 2 outcomes. No favorable Stage 2 metric may replace the primary after outcome inspection.

A valid positive decision requires all mandatory integrity/estimability/independent-verification gates plus the frozen primary scientific criterion. Failure of an estimability/global gate is not converted to a negative scientific result when the endpoint is not estimable.

## 11. Stage 2 — `RCPR-S2-FORMAL-2026-08-28-v1`

Stage 2 may run only after:

1. Stage 0 technical PASS;
2. Stage 1 target formation under the frozen development procedure;
3. complete transition/formal spec committed;
4. source/blob hashes frozen;
5. fresh Stage 2 seed/population frozen;
6. Stage 1 identity-overlap firewall frozen;
7. independent verifier frozen;
8. explicit scientific authorization committed.

The formal runner must not read Stage 1 outcome rows except the frozen model/representation parameters explicitly authorized by the transition contract.

## 12. Independent verification

The independent verifier must not import production feature or classifier helpers. It must independently:

- reconstruct source/population selection;
- recompute RAW keys;
- reconstruct overlap firewalls;
- recompute all predictor features from raw root inputs/history;
- replay the frozen score/classifier/distance semantics;
- independently recompute criticality outcomes or verify them through a structurally separate continuation-measurement path as frozen by the formal spec;
- recompute the formal endpoint and decision core;
- compare canonical row/set/result hashes.

A verifier that only rereads production scores/results is insufficient.

## 13. Formal decision taxonomy

The exact final labels and decision conjunction will be frozen in the Stage 2 formal spec. The study-level taxonomy is constrained to:

```text
CONFIRMED-WITHIN-FROZEN-REPRESENTATION-AND-POPULATION
NOT-CONFIRMED
INCONCLUSIVE
NON-ESTIMABLE
```

Technical/authorization classifications remain separate, including:

```text
STAGE0-TECHNICAL-FAILED
STAGE1-DEVELOPMENT-BLOCKED
TECHNICAL-INVALID
VERIFICATION-FAILED
NOT-AUTHORIZED-NOT-EXECUTED
```

No positive label may be issued without mandatory independent verification.

## 14. G2-05 hardening boundary

This Study does not currently make a bounded exact enumeration claim, so G2-05 H1/H2 exact-prefix mechanics are out of scope. G2-06 adopts the general pre-formal negative-control, new-source/fresh-authorization, and post-merge read-only closure-audit requirements. Any later exact-enumeration reuse triggers explicit prospective adoption or stricter supersession of the applicable H1-H5 rules before scientific evidence generation.

## 15. No-rescue rule

The prior CPOB 600 roots, 139 high-divergence roots, 1183 audits, and near misses are not training/development/formal rows. Stage 1 rows are not Stage 2 evidence.

After Stage 2 outcome generation, no feature-family change, classifier substitution, threshold relaxation, favorable subgroup selection, phase-only switch, seed extension, replacement, alternate primary metric, or same-evidence defect repair is authorized.

## 16. Interpretation boundary

A positive result is bounded to the frozen population, continuation instrument, representation, score/classifier, and endpoint. It is not a proof of game-theoretic turning points, human salience, causality, universal Bao taxonomy, public-AI improvement, or full-game solution.

A negative/inconclusive/non-estimable result does not imply that Bao has no important positions or that richer representations are impossible in other prospectively specified domains.
