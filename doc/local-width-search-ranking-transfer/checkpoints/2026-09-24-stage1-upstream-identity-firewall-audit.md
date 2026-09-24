# LWSRT-STUDY1 — Stage 1 upstream identity firewall audit

Date: 2026-09-24  
Stage: `LWSRT-S1-DEVELOPMENT-2026-09-24-v1`

## Disposition

`PASS-WITH-EXPLICIT-UNAUDITABLE-PREFIX-BOUNDARY`

Fresh LWSRT Stage 1 seed access during this audit: **0**.

## Audited upstream identities

- G3-07 Stage 1: existing identity-only exclusion file; 48 rows; source seed / full trajectory / opening prefix / selected RAW root.
- G3-07 Stage 2: 72 selected rows extracted identity-only from immutable result artifact `9879091983`; no measurement/formal fields retained.
- G4-01 Stage 1R SILGM: 768 primary source records from source bundle artifact `10517090411`; 766 unique full trajectories and 665 unique selected RAW roots materialized; reserve use = 0.
- G4-01 interrupted Stage 1 (`40112001..40112768`): no auditable final result exists, so the entire namespace remains quarantined and identity non-overlap is **not claimed**.

## Identity hash semantics

G3-07 and G4-01 use different full-trajectory hash encodings. G3-07 hashes the stable canonical replay path containing `moveKey` + `afterRawStateSha256`; G4-01 hashes newline-joined canonical move keys. LWSRT must therefore derive both upstream-specific identities from each fresh replay and must not compare these hash strings across incompatible semantics. RAW-root identity is common.

## Identity-set digest contract

Audit set/row digestは次の固定規約で計算する。

```text
stableCanonicalJson:
  primitive = JSON.stringify(value)
  array     = supplied orderを保持
  object    = keyをlexicographic ascendingで再帰的に整列
  whitespace = none

digest bytes = UTF-8(stableCanonicalJson(value) + "\n")
digest = SHA-256(digest bytes)
```

`sourceSeed` setはnumeric ascending、SHA-256 string setはlexicographic ascendingとする。G3-07 Stage 2 identity rowsは`sourceSeed → selectedPly → rootRawSha256`で整列する。この規約で以下の固定digestを再計算し、全件一致を確認した。末尾LFを含まない別表現は本Studyのidentity-set digestではない。

## Explicit boundary

The G4-01 Stage 1R recovery source bundle does not retain opening move prefixes or `openingPrefixSha256`. No fresh replay was performed to reconstruct them. Therefore LWSRT does **not** claim G4-01 Stage 1R opening-prefix non-overlap. The runtime firewall rejects auditable G4-01 source-seed, full-trajectory and selected-RAW-root collisions.

This boundary is permitted by the frozen protocol rule that unauditable identity classes must not be represented as proven non-overlap. It does not authorize relaxing any other firewall class.

## Canonical identity digests

G3-07 Stage 2:

- identity rows: `f24e938df618c132dcc2d9a103c5acc63f8e4936f56722a473c8b89ec988b582` / 72
- sourceSeed set: `22f12dd9bc94fa26a87980f133fb31d9a66dfb119e8fe2b1ba428a26fdbd8b9b` / 72
- rootRawSha256 set: `54465f87b04672c1ed565420afa1908ad689a005ab01cbf24d7684d2790b8ec8` / 72
- fullTrajectorySha256 set: `2bb0fc19ccc2c2e005caff8bcacb9fd9c8e6c5b239d79dc7c2f784287a6b54ea` / 72
- openingPrefixSha256 set: `77c2de075829ad6ca53a45986eff3f7d74ddf1eab4cef56dfd1a2c5f2bb1f878` / 72

G4-01 Stage 1R unique sets:

- sourceSeed: `06a42ba8158704a2ceca1c410245b8332fa044959ed6ed21faf0ba217a091c39` / 768
- fullTrajectorySha256: `75931e2c42dc2053d6fee5bca3e7f6eadf02f89551856e8ca8293dad0e44053a` / 766
- selectedRawRootSha256: `71614b0092fe8f0001b6d7ed9f2b16104bcd06d3d65fb00c9bcb8553f0809598` / 665

## Authorization effect

This audit by itself does not authorize Stage 1. A separate post-Stage0 / pre-fresh Stage 1 authorization review is required.
