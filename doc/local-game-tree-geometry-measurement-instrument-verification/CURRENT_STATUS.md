# CURRENT STATUS — LGTGMIV-STUDY1

Updated: 2026-09-01

## Formal state

- Study: `LGTGMIV-STUDY1`
- Program position: post-G3-01 / pre-G3-02 independent prerequisite
- Status: `ACTIVE / STAGE-1-PASS / STAGE-2-AUTHORIZED / STAGE-2-TOOLING-SMOKE-PASS / STAGE-2-NOT-YET-EXECUTED`
- Stage 0: `LGTGMIV-S0-TECHNICAL-2026-08-31-v1 / STAGE0-PASS`
- Stage 1: `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1 / STAGE1-PASS`
- Active stage: `LGTGMIV-S2-FORMAL-2026-08-31-v1`
- Stage 2: `AUTHORIZED FOR ONE FORMAL EXECUTION / NOT YET EXECUTED`
- Stage 1 promoted measurement families: all five frozen LGTGMIV families
- formal eligible measurement families: not yet determined; requires Stage 2 formal holdout

## Stage 0 formal record

- prospective Study freeze commit: `1ffdfb631cd1f7f56a798fe62c6e0cd732547b17`
- Stage 0 implementation commit: `aa8dee624c09ff03af476bb7d82f850d7c8c3223`
- formal workflow run: `33386868192`
- formal workflow result commit: `044b39cd414f208226c989c17aeb61ae412d80a2`
- Stage 0 PASS checkpoint commit: `01cbe6f60450c562bcfb96bd78780f399d57684f`
- Stage 1 authorization commit: `df40f33f136568f79debeb8011c04e11786169e2`

Exact production / independent Stage 0 agreement:

- `stageReconstructionCoreSha256 = 33c63d62cfaf9f38d81680f42e799a5084e2ef86686810bbe46f543a9fbe42b9`
- `stageScientificCoreSha256 = 38871e544593fa4e0120fe77bbb48c47e643bb89d816acfde2dfd1dd9bdc0c0b`

## Stage 1 formal record

Stage 1 fresh development evidence has been generated once and is immutable under the no-rescue rule.

- one-shot execution trigger commit: `d45fa5e394a2ade36c18dc75a33eff68221e4889`
- GitHub Actions formal run: `33450205296`
- result commit: `52812f37197df74e90d1864720ad1b7e6f13d7fa`
- read-only audit run: `33450472967`
- audit result commit: `c81b52d32b6c53dbb6eefb851663bfacbab05a6e`
- Stage 1 disposition: `STAGE1-PASS`
- Stage 1 global gate: PASS
- selected population: 8 Namua + 8 Mtaji = 16 unique RAW roots
- relative depth: 5
- consumed fresh seed block: `31110001..31110128`
- `stageReconstructionCoreSha256 = 2f641919bf067428416afd65a9a502c30c2ad3261cfe6b1355499809076505ac`
- `stageScientificCoreSha256 = 91c4ed0a23edbf12398ca644db7d6864011f4d26c88da93019095decf524f271`
- scientific result file SHA-256: `ee2d2519d1f3c47c501719fed358afab0ce1638a7ff3264e8a60724c154e150b`
- telemetry file SHA-256: `c542a995c69a2606cd3b08dc6ed0121b88f708c461e08179c87e72c184756eb6`

All 16 roots had exact production / independent reconstruction agreement. All five frozen families had exact root-level and stage-level agreement and were promoted:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

Stage 1 same-evidence rerun or repair is permanently prohibited.

## Stage 2 authorization and tooling state

A separate prospective authorization exists at `authorizations/2026-09-01-stage-2-formal-authorization.md`. It authorizes exactly one formal execution of the frozen Stage 2 holdout:

- seed block: `31120001..31120192`
- target roots: 12 Namua + 12 Mtaji = 24
- relative depth: 5
- tested families: Stage 1 promoted set only, i.e. all five families above
- dual exclusion firewall: G3-01 + Stage 1 RAW root/full trajectory/first-16 prefix identities

The Stage 2 non-scientific tooling smoke also passed:

- tooling workflow commit: `ff6810176b396de0a5265567888ba3cb9449b204`
- workflow run: `33451567682`
- job: `99682401722 / success`
- checkpoint: `checkpoints/2026-09-01-stage-2-tooling-smoke-pass.md`

At this status update the Stage 2 fresh holdout block has **not** been generated or read. The Stage 2 no-rescue boundary has therefore not yet been crossed.

## Evidence consumption state

- G3-01 block `31010001..31010096`: consumed historically by G3-01; exclusion identity use only in this Study
- Stage 1 block `31110001..31110128`: consumed once; immutable
- Stage 2 block `31120001..31120192`: `NOT GENERATED / NOT READ`

## Permanent upstream boundaries

`LGTGMF-STUDY1` remains permanently `CLOSED / TECHNICAL-INVALID`; its formal eligible families remain `[]`; its Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`. This Study does not repair, rescue or reinterpret G3-01.

Research Generation 2 remains closed. Authoritative scientific state identity remains RAW-only `pits,reserve,houseOwned,player,phase,winner,pending`; validated transform set remains `[]`.

## Protected evidence

Protected standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

## Downstream boundary

G3-02..G3-08 automatic start remains blocked. Even a successful Stage 2 and successful closure of this prerequisite require a separate Research Generation 3 post-closure authorization review before G3-02 can start.
