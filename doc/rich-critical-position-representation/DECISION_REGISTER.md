# RCPR-STUDY1 — Decision Register

Updated: 2026-08-29

## D01 — Study identity

```text
Program = G2-06
Study ID = RCPR-STUDY1
Formal title = Rich Critical-Position Representation Study 1
```

Decision: prospectively frozen before G2-06 scientific outcome generation.

## D02 — Stage architecture

```text
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
```

Stage 0 is technical-only; Stage 1 is fresh development only; Stage 2 is fresh formal validation only and requires a separate explicit authorization.

## D03 — Upstream immutability

All Research Generation 1 and G2-01..G2-05 decisions remain immutable. The historical Critical Positions 600 roots, 139 high-divergence roots, 1,183 candidate audits and zero-promotion closure are not G2-06 training, tuning or formal evidence.

## D04 — RAW-only scientific identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` and `reason` are excluded. Missing `pending` fails closed. `validated transform set = []`; no canonicalization or symmetry reduction is authorized.

## D05 — Historical identity helper not authorized for RCPR identity

Historical helpers that construct seat-canonical or mirrored identities are not authorized as G2-06 scientific identity. RCPR uses dedicated RAW-only serialization/keying.

## D06 — Leakage taxonomy

```text
A PRE_ROOT_OBSERVABLE
B ROOT_DERIVED_OUTCOME_INDEPENDENT
C SEARCH_DERIVED_OUTCOME_INDEPENDENT
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

Only A-C are predictor eligible. D is forbidden.

## D07 — Prospectively declared representation families

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

No new family may be added after Stage 1 scientific outcomes are observed.

## D08 — Criticality construct continuity

`D_range` across exact root moves under the frozen continuation policy is reused only as a measurement definition on fresh G2-06 evidence. The frozen high-divergence boundary is `D_range >= 0.30`. Historical measured roots/outcomes are prohibited.

## D09 — Stage 1/2 identity firewall

Stage 1 and Stage 2 must have zero overlap on source-game seed, historical trajectory, opening prefix where available, selected RAW state key, representation-row identity, and complete pre-root history-window hash when temporal context is used.

## D10 — Independent verifier structure

The independent verifier may share the authoritative Bao rule engine but may not import the production RCPR feature extractor, classifier helper, or RAW serializer. It must recompute representation and endpoint independently from raw inputs.

## D11 — G2-05 hardening applicability

G2-06 adopts the relevant governance principles of pre-formal controls, fresh source identity/authorization after scientific source changes, and read-only closure auditing. Exact-enumeration rules are not claimed by this study.

## D12 — Fail-closed formal behavior

No scientific threshold, feature family, classifier, distance, clustering, aggregation, interaction, phase population, primary endpoint, or verifier acceptance criterion may be repaired or changed after the relevant scientific outcome is observed to obtain a preferred result.

## D13 — Stage 1 seed block permanently consumed

The authorized workflow run `33196954082` crossed the frozen execution-start boundary. Archived `execution-start.json` records:

```text
scientificStage1SeedBlockConsumed = true
seedStart = 28610001
seedEnd = 28613072
```

Decision: this block is permanently consumed for `RCPR-STUDY1`. Same-block rerun, replacement and extension are not authorized.

## D14 — Production-only output is not an accepted Stage 1 result

Production job `98936414477` succeeded and all production readiness gates passed. The production output included 599 primary-estimable roots, 134 high-divergence roots, `RICH_ALL` as the selected family set and overall OOF AUROC `0.7093403948001926`.

Decision: because independent verification did not pass, these values are retained as provenance-only **production-only unverified development output**. They cannot authorize Stage 2, establish a positive G2-06 scientific result, or be treated as confirmatory evidence.

## D15 — Exact independent representation mismatch governs

Independent job `99007180273` recorded:

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
technicalPass = false
```

Exactly four of 600 rows failed exact feature-vector hash equality. The prospectively frozen verifier required exact equality; therefore the technical gate fails regardless of the small numerical magnitude of those mismatches.

## D16 — Stage 1 final decision

Decision:

**`STAGE1-TECHNICAL-INVALID`**

The technical postmortem localized the mismatch to `MOVE_SET_ENTROPY.indexEntropy`: production `Map` insertion-order accumulation and independent object integer-key enumeration produce IEEE-754 differences of approximately `2.22e-16` to `4.44e-16` on four rows.

This localization is explanatory only. No post-hoc tolerance, rounding rule, verifier replacement, or same-seed replay is authorized to rescue `RCPR-STUDY1`.

## D17 — Stage 2 blocked and successor boundary

`RCPR-S2-FORMAL-2026-08-28-v1` remains **`NOT-AUTHORIZED-NOT-EXECUTED`** and will not be authorized from the Stage 1 production-only output.

Any continuation must be a new prospective successor study. Before successor scientific evidence generation it must:

1. freeze canonical entropy category-order/numeric-hash semantics;
2. pass adversarial independent technical fixtures, including integer-like keys in nonnumeric encounter order;
3. demonstrate exact equality for all 310 features;
4. freeze a new study/spec/source commit;
5. allocate a fresh consume-once scientific seed block; and
6. obtain a new explicit authorization.

`RCPR-STUDY1` development rows are not successor formal evidence.
