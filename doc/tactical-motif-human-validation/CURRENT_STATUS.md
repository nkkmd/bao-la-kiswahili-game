# CURRENT_STATUS — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-17

## Current state

**STAGE 1 ARTIFACT AUDIT PASS / FORMAL FREEZE RULE VALIDATED / EXACT PRIVATE MATERIALIZATION PENDING / HUMAN DATA COLLECTION NOT STARTED**

The fixed Stage 1 machine corpus has been generated from the exact authorized clean source tree, independently recomputed with zero mismatches, passed all prospectively frozen stimulus-readiness gates, and passed compact-artifact identity/integrity audit. A deterministic exact formal-stimulus freeze rule has now been prospectively fixed and CI-validated before exact formal identities are materialized.

## Repository baseline

Study-start `main` HEAD:

`3cc40d83917660dd815c785ff0e0c754666d9a0e`

Study branch:

`research/tactical-motif-human-validation`

## Historical evidence boundary

Immutable Tactical Motifs Study 1 decisions remain:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

C03 machine evidence remains `CONFIRMED` regardless of any future human result.

Current human evidence:

```text
humanExpertEvidence = NOT-YET-COLLECTED
```

## Stage 1 frozen identity

Stage ID: `TMHV-S1-STIMULUS-2026-08-17-v1`

- games: `1536`
- seeds: `22100001..22101536`
- six generation strata × `256`
- first 8 plies: seeded-uniform exact `E.moveVariants`
- max ply: `100`
- no extension / no replacement
- spec SHA-256: `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`
- historical C03 definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- authorization SHA-256: `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`
- authorized source commit: `12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`

## Stage 1 machine execution

Generation:

- games generated: `1536 / 1536`
- unique historical trajectories: `1453`
- distinct opening prefixes: `1278`
- six strata: `256` each
- source tree dirty: `false`
- generation summary hash: `6af30d6827e36a0c8a9ba0a4856b2e590da98bab0021111ba014655ffd85e581`

Independent verification:

- `passed = true`
- `fullSearchRecomputation = true`
- games verified: `1536`
- mismatch count: `0`
- verification identity hash: `225e603e5fc60970901c89431a0155a83ffad2ed1de0ede83941cd2fc955c397`

## Stage 1 stimulus pool readiness

Class counts:

```text
C03_TARGET = 687
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

Matched counts:

```text
P_ONLY     = 277
M_ONLY     = 605
MORPH_NEAR = 672
```

All ten frozen readiness gates passed. Target generation strata represented: `6 / 6`. No replacement and no control reuse were performed.

Pool hash:

`6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

Machine conclusion:

`MACHINE STIMULUS POOL READY`

## Compact artifact audit

Audit ID: `TMHV-S1-ARTIFACT-AUDIT-2026-08-17-v1`

Bundle SHA-256:

`88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`

Artifact SHA-256:

```text
manifest.json            24d23be9e08ef392f1eab5f767dc069cad4a819c2211f2f2c88c64801038dea4
verification.json        39f642eb65de48da99ba6c491d5647eb23c33e40631d3db36995e4cb725b0866
stimulus-pool-audit.json ccf376539588b5b06ad5ca0b16bba1b61b096506d9b1e0c00f29f785a1338c27
stimulus-pool.json       a1ee4f6749a6f6b433122ea896975deef45fa6b2fb41c1a9edc53955a302f5a8
```

Independent artifact checks passed, including all 1,554 stored target-control matches: same-trajectory violations `0`, same-opening-prefix violations `0`, duplicate controls within family `0`, duplicate targets within family `0`, and matching-cost violations above `10` = `0`.

Participant-facing rendering audit also passed: actor normalized to South, Mtaji phase, restricted participant-stimulus fields, and no detected hidden-cue terminology.

## Formal stimulus freeze rule

Freeze ID:

`TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

The prospectively frozen construction requires:

- 12 three-position primary blocks;
- exactly 4 `P_ONLY`, 4 `M_ONLY`, 4 `MORPH_NEAR` controls;
- 24 unique C03 primary target positions;
- global no-reuse of rule state, historical trajectory, or opening prefix across all 36 primary positions;
- target B matched to target A with exact Stage 1 nuisance cost, maximum `10`;
- 6 secondary C03 move-choice positions, one per generation stratum;
- no primary/secondary recurrence;
- exactly `42` unique formal positions;
- no manual aesthetic substitution or human-outcome-dependent reselection.

GitHub Actions run `32040413639`, job `95418609369`: **SUCCESS**, including the deterministic formal-freezer test.

Exact selected board identities and SVGs are intentionally not public before formal collection. They will be materialized only in a gitignored private local artifact and committed publicly only by SHA-256 commitment plus aggregate audit metadata.

## Authorization state

Completed machine/instrument work:

- fixed Stage 1 machine corpus generation;
- independent full replay/search verification;
- target/control selection and matching audit;
- readiness evaluation;
- compact artifact identity/integrity audit;
- deterministic exact formal-stimulus selection rule freeze and CI validation.

Still not authorized:

- expert recruitment for scientific participation;
- formal human responses;
- human outcome inspection;
- Stage 2 inference;
- human/expert-validated tesuji claims.

## Next required work

1. Materialize the exact 42 formal positions locally using the validated freezer against the exact audited artifacts.
2. Preserve the exact private freeze file locally; return only the public-safe freeze audit and SHA-256 commitment.
3. Record the private freeze SHA-256 commitment in the repository without publishing exact formal positions.
4. Complete ethics determination, consent, secure storage, language-equivalence review, and expert recruitment feasibility without relaxing eligibility criteria.
5. Freeze and validate the Stage 2 machine-readable human preregistration before any formal human response.
6. Only after those gates may scientific expert recruitment / response collection be separately authorized.

If later recruitment is insufficient, the valid human result remains `INCONCLUSIVE-NOT-ESTIMABLE`. Stage 1 machine readiness does not rescue human estimability.
