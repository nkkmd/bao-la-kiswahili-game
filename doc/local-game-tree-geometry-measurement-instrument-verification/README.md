# Local Game-Tree Geometry Measurement Instrument Verification

## Status

`LGTGMIV-STUDY1` is **closed** as a new, prospective, independent Research Generation 3 prerequisite Study positioned after G3-01 and before any G3-02 authorization.

Formal title:

**Local Game-Tree Geometry Measurement Instrument Verification Study 1**

日本語題目:

**Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**

Formal decision:

**`FORMAL-ELIGIBLE-ALL`**

All five prospectively frozen LGTGMIV measurement families are formally eligible within this Study's bounded RAW-only depth-5 local reconstruction contract.

Research branch:

`research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`

Study-start source baseline:

`a53aabd26f78ac408445aff2d18ace3b21b827d7`

Repository integration:

- scientific research-branch head: `1777ba717ced88be64cbaf981ce7096372046334`
- `main` integration: **COMPLETE**
- final closure audit: `33466581297 / success`
- checkpoint: [`checkpoints/2026-09-01-main-integration-complete.md`](checkpoints/2026-09-01-main-integration-complete.md)

## Why this Study exists

G3-01 (`LGTGMF-STUDY1`) reconstructed its fresh bounded local trees/graphs exactly at root/family level in production and independent implementations, but its frozen stage-manifest contract incorrectly allowed implementation-dependent runtime/resource observations into the canonical stage digest. The resulting stage digest mismatch made G3-01 permanently `TECHNICAL-INVALID` after evidence read.

This Study did not repair or rescue that result. It used the failure mode only as design information and started under a new identity, new prospective contract and new fresh evidence firewall.

## Final evidence

### Stage 0

- technical instrument validation: `STAGE0-PASS`
- workflow run: `33386868192`
- fresh scientific seed use: none

### Stage 1

- fresh block: `31110001..31110128`
- population: 8 Namua + 8 Mtaji = 16 roots
- relative depth: 5
- disposition: `STAGE1-PASS`
- exact reconstruction: 16/16
- promoted families: 5/5

### Stage 2

- fresh holdout: `31120001..31120192`
- population: 12 Namua + 12 Mtaji = 24 roots
- relative depth: 5
- formal workflow run: `33452082425`
- immutable result commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`
- exact reconstruction: 24/24
- each family exact roots: 24/24
- resource gate: PASS
- formal decision: `FORMAL-ELIGIBLE-ALL`
- read-only audit run: `33452400324 / success`

Formal eligible families:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

## Immutable boundaries

G3-01 remains:

- `CLOSED / TECHNICAL-INVALID`
- formal eligible measurement families: `[]`
- Stage 2: `NOT-AUTHORIZED-NOT-EXECUTED`
- consumed Stage 1 seeds: `31010001..31010096`

Research Generation 2 remains closed. Scientific state identity remains RAW-only with fields `pits,reserve,houseOwned,player,phase,winner,pending`; validated transform set remains empty.

The standard initial RAW-root exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

G3-02..G3-08 remain blocked. `automaticG302StartAuthorized = false`; a separate post-closure program authorization review is required.

## Documents

- `STUDY_1_OVERVIEW.md` — initial question, result and claim boundary
- `STUDY_1_PROTOCOL.md` — frozen scientific/technical contract
- `STUDY_1_FINAL_REPORT.md` — final integrated scientific report
- `CURRENT_STATUS.md` — closed current state
- `DECISION_REGISTER.md` — immutable decisions and stage dispositions
- `REPRODUCIBILITY_INDEX.md` — specs, code, workflows, outputs and hashes
- `preregistration/` — machine-readable frozen contracts
- `checkpoints/` — prospective, stage and closure checkpoints
- `authorizations/` — explicit stage progression and execution authorization artifacts
- `results/` — immutable stage results and read-only audits
