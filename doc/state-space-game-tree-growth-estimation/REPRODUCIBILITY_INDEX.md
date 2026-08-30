# SSGTGE-STUDY1 — Reproducibility Index

## Canonical identity

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Branch = research/g2-12-state-space-game-tree-growth-estimation
```

## Prospective authorities

- `preregistration/STUDY_START_FREEZE.md` — human-readable scientific contract frozen before fresh holdout outcome generation.
- `preregistration/STUDY_START_SPEC.json` — machine-readable equivalent.
- `authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json` — initial technical-only boundary.
- `checkpoints/2026-08-30-study-start-freeze.md` — startup checkpoint.

## Upstream immutable evidence

Primary development anchor:

- `../deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json`
- `../deep-raw-state-space-enumeration/STUDY_1_PROTOCOL.md`
- `../deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`

Expected immutable G2-05 values:

```text
formalDecision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
rootRawStateKey = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
lastCompleteDepth = 9
cumulativeRawStates = 102857
treeNodeOccurrencesThrough9 = 136645
```

## Stage 0 v1 — permanently technical-invalid

```text
Stage ID = SSGTGE-S0-TECHNICAL-2026-08-30-v1
implementation freeze commit = 00b89802c9d40313cc0309bc36f59eecc53899b2
authorization commit = 76afec9b0ba3d1c5ef84cb42bc3d205360da9b97
workflow run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
Stage disposition = STAGE0-TECHNICAL-INVALID
```

Canonical failure records:

- `results/STAGE_0_V1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-08-30-stage0-v1-technical-invalid.md`

No scientific evidence was generated and v1 will not be rerun.

## Stage 0 v2 — accepted technical correction

```text
Stage ID = SSGTGE-S0-TECHNICAL-2026-08-30-v2
corrective predecessor = v1 technical-invalid
scientific contract changed = false
implementation/source freeze commit = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization commit = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
workflow run = 33323689667
job = 99289968446
artifact = 9735609030
artifact size = 13991 bytes
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
Stage disposition = STAGE0-TECHNICAL-PASS
```

Primary v2 files:

- `preregistration/STAGE_0_V2_TECHNICAL_SPEC.json`
- `results/STAGE_0_V2_SOURCE_HASHES.json`
- `authorizations/STAGE_0_V2_TECHNICAL_EXECUTE.json`
- `results/STAGE_0_V2_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-30-stage0-v2-prospective-freeze.md`
- `checkpoints/2026-08-31-stage0-v2-technical-acceptance.md`
- `tools/experiments/lib/ssgtge-production.js`
- `tools/experiments/lib/ssgtge-independent.js`
- `tools/experiments/run-ssgtge-stage0-v2-technical.js`
- `tools/experiments/verify-ssgtge-stage0-v2-independent.js`
- `.github/workflows/ssgtge-stage0-v2-technical.yml`

Accepted canonical result identities:

```text
artifact STAGE_0_V2_TECHNICAL_RESULT.json SHA256 = 8b3f19a3a182133a46236abc979a11a93f8fd921053aa507333c566b7c5a5923
artifact stage0-v2-production-result.json SHA256 = 5b7c74d364b362d8c13c77220306b57952f7c8a35d0ea0c6752fc380a475a04d
productionCoreSha256 = 6cc54143124c80e3cc4e2f4653b13840706a112ef6dfbcad5a81cba973848426
independent resultCoreSha256 = f7bbd991ad61befc24d8164b90ae1e8fd8c254454a2fe96469013e1d1c898b5a
independent enumeration core SHA256 = c1e5db4b98fcb1c7e406a67b0dd74aeff8c1ecf0ddfc43ad06200fc0a59af817
development source summary SHA256 = 04debfa47516d0288d9baf5cf1ff0d761c83c27ada16d9ea43c02be66887659a
```

Exact technical fixture replay target:

```text
target depth = 2
target complete = true
cumulative RAW states = 19
depth-labelled legal edges = 18
cumulative tree node occurrences = 19
RAW state set SHA256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
```

Independent checks require materialized verification and full independent depth-2 recomputation, all five frozen negative controls, and no import of the production growth estimator/serializer.

Stage 0 evidence firewall remains:

```text
real G2-05 candidate evaluation = false
fresh depth 10/11 generated/read = false
scientific inference = false
```

## Planned Stage 1 reproducibility

Stage 1 may now be prospectively prepared, but remains unauthorized until its own source freeze and separate execution authorization are committed.

It must materialize:

- exact development input summary/hash for G2-05 depth 0..9;
- all candidate rolling-origin predictions;
- all 8-cell error vectors per candidate;
- eligibility flags under max absolute log error `<= 0.15`;
- deterministic winner selection;
- selected estimator parameters;
- `q`, `R1`, `R2`;
- frozen depth 10/11 point predictions and envelopes;
- production and independent recomputation hashes.

## Planned Stage 2 reproducibility

Before formal authorization, Stage 2 must bind exact source/blob hashes and the complete Stage 1 frozen estimator artifact. Fresh depth 10/11 scientific counts remain prohibited until that separate freeze and authorization exist.

No formal scientific decision is valid without mandatory independent verification.
