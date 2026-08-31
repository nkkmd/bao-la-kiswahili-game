# Reproducibility Index — LGTGMIV-STUDY1

## Formal identity and closure

- Study ID: `LGTGMIV-STUDY1`
- baseline: `a53aabd26f78ac408445aff2d18ace3b21b827d7`
- branch: `research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`
- final status: `CLOSED / FORMAL-ELIGIBLE-ALL`
- authoritative identity: RAW-only `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`

## Prospective contract documents

- `README.md`
- `CURRENT_STATUS.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `DECISION_REGISTER.md`
- `preregistration/STUDY_START_SPEC.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `checkpoints/2026-08-31-study-start-freeze.md`
- `authorizations/2026-08-31-stage-0-technical-authorization.md`
- Study freeze commit: `1ffdfb631cd1f7f56a798fe62c6e0cd732547b17`

## Stage 0 — technical validation

Implementation:

- `tools/experiments/lib/lgtgmiv-stage0-production.js`
- `tools/experiments/lib/lgtgmiv-stage0-independent.js`
- `tools/experiments/run-lgtgmiv-stage0-technical.js`
- `.github/workflows/lgtgmiv-stage0-technical.yml`
- implementation commit: `aa8dee624c09ff03af476bb7d82f850d7c8c3223`

Formal execution:

- workflow run: `33386868192`
- result commit: `044b39cd414f208226c989c17aeb61ae412d80a2`
- result: `results/stage-0/technical-validation.json`
- checkpoint: `checkpoints/2026-08-31-stage-0-technical-pass.md`
- disposition: `STAGE0-PASS`

Hashes:

- `stageReconstructionCoreSha256 = 33c63d62cfaf9f38d81680f42e799a5084e2ef86686810bbe46f543a9fbe42b9`
- `stageScientificCoreSha256 = 38871e544593fa4e0120fe77bbb48c47e643bb89d816acfde2dfd1dd9bdc0c0b`

Stage 0 consumed no Stage 1/2 fresh scientific seeds and did not generate/read the protected depth-10 holdout.

## Stage 1 — fresh development

Authorization:

- `authorizations/2026-08-31-stage-1-development-authorization.md`
- authorization commit: `df40f33f136568f79debeb8011c04e11786169e2`

Instrument:

- `tools/experiments/lib/lgtgmiv-stage1-production.js`
- `tools/experiments/lib/lgtgmiv-stage1-independent.js`
- `tools/experiments/run-lgtgmiv-stage1-development.js`
- `.github/workflows/lgtgmiv-stage1-development.yml`

Fresh evidence:

- seed block: `31110001..31110128`
- population: 8 Namua + 8 Mtaji = 16 unique RAW roots
- depth: 5
- one-shot execution trigger commit: `d45fa5e394a2ade36c18dc75a33eff68221e4889`
- workflow run: `33450205296`
- result commit: `52812f37197df74e90d1864720ad1b7e6f13d7fa`
- `results/stage-1/scientific-result.json`
- `results/stage-1/telemetry.json`
- `results/stage-1/execution-summary.json`
- read-only audit run: `33450472967`
- audit result commit: `c81b52d32b6c53dbb6eefb851663bfacbab05a6e`
- checkpoint: `checkpoints/2026-09-01-stage-1-development-pass.md`
- disposition: `STAGE1-PASS`

Hashes:

- `stageReconstructionCoreSha256 = 2f641919bf067428416afd65a9a502c30c2ad3261cfe6b1355499809076505ac`
- `stageScientificCoreSha256 = 91c4ed0a23edbf12398ca644db7d6864011f4d26c88da93019095decf524f271`
- scientific result file SHA-256: `ee2d2519d1f3c47c501719fed358afab0ce1638a7ff3264e8a60724c154e150b`
- telemetry file SHA-256: `c542a995c69a2606cd3b08dc6ed0121b88f708c461e08179c87e72c184756eb6`

Promoted families: all five frozen LGTGMIV families.

Stage 1 evidence is immutable; formal same-block rerun is prohibited.

## Stage 2 — fresh formal holdout

Authorization and pre-execution verification:

- `authorizations/2026-09-01-stage-2-formal-authorization.md`
- `checkpoints/2026-09-01-stage-2-tooling-smoke-pass.md`
- `checkpoints/2026-09-01-stage-2-preexecution-pass.md`
- tooling smoke workflow: `.github/workflows/lgtgmiv-stage2-tooling.yml`
- tooling smoke run: `33451567682 / success`
- pre-execution audit runs: `33451887834 / success`, `33451948317 / success`

Stage 2 selection/firewall:

- `tools/experiments/lib/lgtgmiv-stage2-production.js`
- `tools/experiments/lib/lgtgmiv-stage2-independent.js`
- `tools/experiments/verify-lgtgmiv-stage2-tooling.js`

Formal runner/workflow:

- `tools/experiments/run-lgtgmiv-stage2-formal.js`
- runner commit: `90a7d5c09d3dd7660172a652529bb044c3b7b69d`
- runner blob SHA: `4280b4c00f6591f39ba511498fc0f6b8adeed1ba`
- `.github/workflows/lgtgmiv-stage2-formal.yml`
- workflow commit: `df7c1d5f6a02a4e9b474e8911524007344ad88f7`
- workflow blob SHA: `00647d9b66be8dae1075d644993ec9669bf3966a`
- one-shot trigger: `authorizations/2026-09-01-stage-2-execution-trigger.md`
- trigger commit: `ba1358b39b30b042b7aedb5eaca819147d6d54ee`

Fresh evidence:

- seed block: `31120001..31120192`
- population: 12 Namua + 12 Mtaji = 24 unique RAW roots
- depth: 5
- formal workflow run: `33452082425 / success`
- immutable result commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`
- `results/stage-2/scientific-result.json`
- `results/stage-2/telemetry.json`
- `results/stage-2/execution-summary.json`
- disposition: `FORMAL-ELIGIBLE-ALL`

Canonical hashes:

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

## Stage 2 read-only audit

- `tools/experiments/audit-lgtgmiv-stage2-result.js`
- `.github/workflows/lgtgmiv-stage2-result-audit.yml`
- workflow run: `33452400324 / success`
- audit result commit: `ad057e499e34f70493ac1d7332fe42332323d293`
- `results/stage-2/posthoc-audit-summary.json`
- audit: PASS
- exact root reconstruction: 24/24
- each family exact roots: 24/24
- stage elapsed: `159574.533277 ms`
- stage artifact bytes: `6086521`
- scientific re-execution performed: false
- engine imported by audit: false

## Final eligible family set

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

## Evidence consumption and protection

- G3-01 block `31010001..31010096`: historical consumed block; exclusion identity use only in this Study
- Stage 1 `31110001..31110128`: consumed once; immutable
- Stage 2 `31120001..31120192`: consumed once; immutable
- protected standard-root exact depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`

## Hash policy and claim boundary

Scientific canonical objects use SHA-256 lowercase hex over UTF-8 canonical JSON without trailing newline. Runtime/resource telemetry is never an input to root/stage scientific digests.

The final eligibility claim is bounded to the frozen RAW-only depth-5 local reconstruction instrument and populations. It does not authorize whole-Bao state/game-tree estimates, canonicalization/symmetry reduction, deeper-horizon extrapolation, strategic-value claims, or G3-02 automatic start.
