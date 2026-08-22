# Preregistration records

Current records:

## Stage 0 / Stage 1

- `STAGE_0_DESIGN_FREEZE.json` — construct/search/seed reservation before present-Study scientific data.
- `STAGE_1_EXPLORATORY_SPEC.json` — frozen prospective Stage 1 exploratory contract.
- `STAGE_1_EXECUTION_SOURCE_FREEZE.json` — exact validated Stage 1 scientific source-file SHA-256 map.
- `STAGE_1_EXPLORATORY_AUTHORIZATION.json` — explicit source-bound Stage 1 generation authorization.

Stage 1 identity:

```text
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
seeds = 22400001..22402048
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
promoted exploratory candidates = 4
```

Stage 1 is complete and integrated to main. Its support is not reusable as Stage 2 confirmation evidence.

## Stage 2 formal confirmation

Current frozen design records:

- `STAGE_2_FORMAL_CANDIDATES.json` — one-to-one freeze of the four Stage 1 promoted candidates and two shared support groups.
- `STAGE_2_FORMAL_SPEC.json` — prospective Stage 2 population, identity firewall, support selection, endpoints, estimability, multiplicity, verification, decision and no-rescue contract.

Stage 2 identity:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze ID = BMP-S2-CANDIDATES-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 097aa6450f270254ec6dee2a7fd7e74a2d8298cae36923a39e822b2137172730
fresh reserved/fixed seeds = 22500001..22504096
games = 4096
```

Formal candidate mapping:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 share the same frozen Namua support-group roots. C04 uses the Mtaji support group.

Stage 2 requires three-axis Stage 1 identity exclusion:

```text
historicalTrajectoryHash overlap = 0
openingPrefixHash overlap = 0
ruleStateKey overlap = 0
```

No replacement or seed extension is permitted.

## Current authorization state

```text
Stage 2 candidate/spec design = FROZEN
Stage 2 tooling = MATERIALIZED
local technical validation = PENDING
Stage 2 source-file SHA freeze = NOT CREATED
STAGE_2_FORMAL_AUTHORIZATION.json = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
Stage 2 formal inference = NOT YET PERFORMED
```

Freezing candidate/spec files does not authorize generation. A separate authorization may be created only after validator, contract/tooling tests, syntax checks, status/source-hash audit, clean source tree, and exact source-file SHA-256 freeze all pass.
