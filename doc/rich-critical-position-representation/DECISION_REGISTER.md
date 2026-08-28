# RCPR-STUDY1 — Decision Register

Updated: 2026-08-28

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

All Research Generation 1 and G2-01..G2-05 decisions remain immutable. In particular, the Research Generation 1 Critical Positions Study's 600 roots, 139 high-divergence roots, 1,183 audits, near misses and zero-promotion closure are not G2-06 training, tuning or formal evidence.

## D04 — RAW-only scientific identity

Authoritative state identity is:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` and `reason` are excluded. Missing `pending` fails closed. `validated transform set = []`; no canonicalization or symmetry reduction is authorized.

## D05 — Historical identity helper not authorized for RCPR identity

Repository audit found that `tools/experiments/lib/position-typology-features.js::identityKeys()` computes a `seatCanonicalKey` using `mirrorState()`.

Decision: do not use this helper as the G2-06 scientific identity implementation. RCPR must use a dedicated RAW-only serializer/keyer. Historical code may remain a technical comparison fixture only.

## D06 — Leakage taxonomy

Every predictor feature is classified as A/B/C/D:

```text
A PRE_ROOT_OBSERVABLE
B ROOT_DERIVED_OUTCOME_INDEPENDENT
C SEARCH_DERIVED_OUTCOME_INDEPENDENT
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

Only A-C are predictor eligible. D is forbidden and must be actively rejected by the production interface and negative controls.

## D07 — Prospectively declared representation families

Only the following families may enter Stage 0/1 development:

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

The prior operational fixed-policy construct (`D_range` across exact root moves, with the prior `D_range >= 0.30` boundary as the default continuity reference) may be reused as a measurement definition only on fresh G2-06 evidence. Prior measured roots/outcomes are prohibited.

Exact G2-06 continuation source/profile/replicate/max-ply/PRNG semantics must be newly frozen before Stage 1 outcome generation.

## D09 — Stage 1/2 identity firewall

Stage 1 and Stage 2 must have zero overlap on source-game seed, historical trajectory, opening prefix where available, selected RAW state key, and representation-row identity. If temporal context is used, the complete pre-root history-window hash is additionally firewalled.

## D10 — Independent verifier structure

The independent formal verifier may share the authoritative Bao rule engine but may not import the production RCPR feature extractor, production classifier helper, or production RAW serializer. It must recompute features and the final endpoint independently from raw inputs.

## D11 — G2-05 hardening applicability

Because G2-06 does not presently make an exact bounded-enumeration claim, G2-05 H1/H2/H6 exact-enumeration mechanics are not directly active. G2-06 adopts H3/H4/H5 governance principles: pre-formal controls, new source identity/fresh authorization after scientific source changes, and post-merge read-only closure audit.

If an exact-enumeration scientific claim is later proposed, applicable H1-H5 rules must be prospectively adopted or superseded by stricter rules before evidence generation.

## D12 — Fail-closed formal behavior

No scientific threshold, feature family, classifier, distance, clustering, aggregation, interaction, phase population, or primary endpoint may be repaired or changed after the relevant formal outcome is observed to obtain a preferred result. Technical defects discovered after formal outcome generation follow the frozen fail-closed taxonomy.
