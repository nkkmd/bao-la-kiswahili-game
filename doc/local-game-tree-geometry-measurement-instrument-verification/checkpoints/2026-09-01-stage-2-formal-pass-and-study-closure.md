# LGTGMIV-STUDY1 — Stage 2 formal PASS and Study closure basis

Date: 2026-09-01

## Formal Stage 2 disposition

`LGTGMIV-S2-FORMAL-2026-08-31-v1` completed its single authorized fresh holdout execution with:

`FORMAL-ELIGIBLE-ALL`

The formal workflow was run `33452082425` and committed the immutable Stage 2 result at commit `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`.

## Population and exact verification

- fresh holdout block consumed: `31120001..31120192`
- selected population: 12 Namua + 12 Mtaji = 24 unique RAW roots
- relative horizon: depth 5
- production / independent root reconstruction exact agreement: 24/24
- Stage 2 global gate: PASS
- resource gate: PASS
- dual G3-01 + Stage 1 exclusion firewall: PASS
- protected standard-root exact depth-10 evidence: not generated / not read

All five Stage 1-promoted families passed the frozen Stage 2 exact root/stage family gate:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

## Canonical hashes

- `stageReconstructionCoreSha256 = 307c907a90cd7239a617278a2378f4e048b10f16877428a3c886de5377b01a1d`
- `stageScientificCoreSha256 = 97ad7dc21e1758d31fa09e487389bf5d3935b1d98daf3eaa2f1b524d7169f9a4`
- scientific result file SHA-256: `9a28e629440a1d9212ad67ef78451deba869747d313dc75462693701074e1f96`
- telemetry file SHA-256: `0db24cc1d1f59432a519dfaad88ffffe8d2217d1cebf4291b6361dc8f2778bc0`

Family stage hashes:

- F1: `a9953979274fa8092053d5daed64c2284339728ed9d125d2143b246b2ac3dfe9`
- F2: `3b000e509ec19faefd6fd6c1161e503570373c47715e1de436cc4fdfb0343f39`
- F3: `2d787070c7f49936dcf11ed26d290caeacc76a0feab63ba075c362b6919120f9`
- F4: `b0cd2e8c1264df81472d8e354962ec15bb970dbec39d6d84926e25f778eabf8a`
- F5: `75688449f5f86fb8c027aa8d7ab4b3a05a8e9ed18614f95d841d23161e31b5b2`

## Read-only independent post-result audit

GitHub Actions run `33452400324` completed successfully and committed `results/stage-2/posthoc-audit-summary.json` at commit `ad057e499e34f70493ac1d7332fe42332323d293`.

The audit did not import the Bao engine, did not generate a trajectory, and did not re-execute scientific measurement. It verified the committed result file hashes, 24-root structure, exact family/root flags, resource telemetry and protected-evidence flags.

Audit summary:

- `passed = true`
- exact reconstruction roots: 24/24
- each formal family exact roots: 24/24
- stage elapsed: `159574.533277 ms`
- stage artifact bytes: `6086521`
- resource audit: PASS
- scientific re-execution: false

## Study closure

The prospectively frozen closure rule therefore yields:

`LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`

This establishes bounded formal eligibility of the five LGTGMIV measurement families for the frozen RAW-only, depth-5 local reconstruction instrument and populations used by this Study. It does not establish whole-Bao game-tree geometry, symmetry-reduced geometry, deeper-horizon validity, causal strategic value, or game-theoretic value.

G3-01 remains permanently `CLOSED / TECHNICAL-INVALID` with eligible families `[]`. This Study does not rescue it.

G3-02..G3-08 remain blocked. `automaticG302StartAuthorized = false`; a separate Research Generation 3 post-closure authorization review is required before G3-02.

Protected standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`
