# LWSRT-STUDY1 — Stage 1 upstream identity firewall materialization record

Date: 2026-09-24  
Stage: `LWSRT-S1-DEVELOPMENT-2026-09-24-v1`  
Class: **IDENTITY-ONLY / PRE-FRESH**

## Result

`UPSTREAM_IDENTITY_FIREWALL.json` was materialized and checked before any `40312001..40312768` access.

- G3-07 Stage 1: reuse the repository's existing identity-only file; 48 selected rows.
- G3-07 Stage 2: canonical result artifact `9879091983`, digest `sha256:5ada1dcb0ceab7d89ea0bfc78410a14c3875ba03a01e31a243950706349de70a`, yielded 72 selected identity rows. Only identity fields were retained for canonical digests.
- G4-01 Stage 1R SILGM: canonical recovery source bundle artifact `10517090411`, digest `sha256:3e1312fbd2fed104dc25ea53448b5f76feee2f37bc2b34ef09274e4df690a65b`, contains 768 SILGM source rows. The audited sets contain 768 source seeds, 766 unique full-trajectory hashes, and 665 unique non-null RAW-root hashes.
- G4-01 Stage 1R opening-prefix hashes are not present in that recovery source bundle. They were not reconstructed and **no opening-prefix non-overlap claim is made for this upstream source**.
- G4-01 interrupted Stage 1 identities are not claimed as audited; the full `40112001..40112768` namespace remains quarantined.
- G4-01 reserve was unused (`reserveUsed=false`), but `41212001..41212768` remains excluded.

The exact canonical row/set digests are frozen in `prereg/UPSTREAM_IDENTITY_FIREWALL.json`. Any later runtime materialization must reproduce those counts and digests exactly or fail closed.

## Scientific boundary

No HIGH-vs-LOW effect, direction, p-value, search endpoint result, game outcome, or candidate promotion was retained from upstream evidence during this materialization. Fresh G4-03 Stage 1 seed access remained **0**.

This record does **not** authorize Stage 1 execution. A separate post-Stage0 / pre-fresh authorization is required.
