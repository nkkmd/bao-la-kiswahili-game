# CURRENT STATUS — LGTGMIV-STUDY1

Updated: 2026-09-01

## Formal state

- Study: `LGTGMIV-STUDY1`
- Program position: post-G3-01 / pre-G3-02 independent prerequisite
- Status: **`CLOSED / FORMAL-ELIGIBLE-ALL`**
- Stage 0: `LGTGMIV-S0-TECHNICAL-2026-08-31-v1 / STAGE0-PASS`
- Stage 1: `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1 / STAGE1-PASS`
- Stage 2: `LGTGMIV-S2-FORMAL-2026-08-31-v1 / FORMAL-ELIGIBLE-ALL`
- formal eligible measurement families: all five frozen LGTGMIV families
- scientific execution: complete
- Study-level scientific rerun authorization: none

Formal eligible families:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

## Stage 0 record

- prospective Study freeze: `1ffdfb631cd1f7f56a798fe62c6e0cd732547b17`
- implementation: `aa8dee624c09ff03af476bb7d82f850d7c8c3223`
- formal run: `33386868192`
- result commit: `044b39cd414f208226c989c17aeb61ae412d80a2`
- disposition: `STAGE0-PASS`
- `stageReconstructionCoreSha256 = 33c63d62cfaf9f38d81680f42e799a5084e2ef86686810bbe46f543a9fbe42b9`
- `stageScientificCoreSha256 = 38871e544593fa4e0120fe77bbb48c47e643bb89d816acfde2dfd1dd9bdc0c0b`

## Stage 1 record

- authorization: `df40f33f136568f79debeb8011c04e11786169e2`
- formal run: `33450205296`
- result commit: `52812f37197df74e90d1864720ad1b7e6f13d7fa`
- read-only audit result commit: `c81b52d32b6c53dbb6eefb851663bfacbab05a6e`
- population: 8 Namua + 8 Mtaji = 16 unique RAW roots
- depth: 5
- consumed block: `31110001..31110128`
- disposition: `STAGE1-PASS`
- global gate: PASS
- promoted families: 5/5
- `stageReconstructionCoreSha256 = 2f641919bf067428416afd65a9a502c30c2ad3261cfe6b1355499809076505ac`
- `stageScientificCoreSha256 = 91c4ed0a23edbf12398ca644db7d6864011f4d26c88da93019095decf524f271`

Stage 1 evidence is immutable. Same-block formal rerun/repair is prohibited.

## Stage 2 formal record

- separate authorization: `authorizations/2026-09-01-stage-2-formal-authorization.md`
- tooling smoke run: `33451567682 / success`
- pre-execution audits: `33451887834 / success`, `33451948317 / success`
- execution trigger commit: `ba1358b39b30b042b7aedb5eaca819147d6d54ee`
- formal run: `33452082425 / success`
- immutable result commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`
- read-only post-result audit run: `33452400324 / success`
- read-only audit result commit: `ad057e499e34f70493ac1d7332fe42332323d293`
- population: 12 Namua + 12 Mtaji = 24 unique RAW roots
- depth: 5
- consumed block: `31120001..31120192`
- production / independent exact root reconstruction: 24/24
- each formal family exact roots: 24/24
- global gate: PASS
- resource gate: PASS
- formal decision: `FORMAL-ELIGIBLE-ALL`

Canonical Stage 2 hashes:

- `stageReconstructionCoreSha256 = 307c907a90cd7239a617278a2378f4e048b10f16877428a3c886de5377b01a1d`
- `stageScientificCoreSha256 = 97ad7dc21e1758d31fa09e487389bf5d3935b1d98daf3eaa2f1b524d7169f9a4`
- scientific result file SHA-256: `9a28e629440a1d9212ad67ef78451deba869747d313dc75462693701074e1f96`
- telemetry file SHA-256: `0db24cc1d1f59432a519dfaad88ffffe8d2217d1cebf4291b6361dc8f2778bc0`

Read-only audit confirmed `stageElapsedMs = 159574.533277`, `stageArtifactBytes = 6086521`, resource PASS, no engine import and no scientific re-execution.

Stage 2 evidence is immutable. Same-block formal rerun/repair is prohibited.

## Scientific boundary

This Study establishes bounded formal eligibility of the five LGTGMIV families for the frozen RAW-only depth-5 local tree/graph reconstruction instrument. It does not establish whole-Bao state/game-tree size, deeper-horizon validity, symmetry-reduced geometry, strategic value, search causality, game-theoretic value or human difficulty.

Authoritative state identity remains RAW-only:

`pits,reserve,houseOwned,player,phase,winner,pending`

Validated transform set remains `[]`.

## Permanent upstream boundary

`LGTGMF-STUDY1` remains permanently:

`CLOSED / TECHNICAL-INVALID`

G3-01 eligible families remain `[]`; G3-01 Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`. This Study does not repair or rescue G3-01.

Research Generation 2 remains closed.

## Protected evidence

Protected standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

## Downstream boundary

`automaticG302StartAuthorized = false`.

G3-02..G3-08 remain blocked. A separate Research Generation 3 post-closure authorization review is required before G3-02 can start.
