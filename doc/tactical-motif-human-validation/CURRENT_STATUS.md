# CURRENT_STATUS — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-17

## Current state

**STAGE 1 MACHINE STIMULUS POOL READY / HUMAN DATA COLLECTION NOT STARTED**

Stage 0 design is complete. Stage 1 prospective machine-stimulus contract, generator, independent verifier, target/control matcher, and position-only renderer were implemented and validated before scientific machine generation. The fixed 1,536-game corpus has now been generated locally from the exact authorized clean source tree, independently recomputed in full with zero mismatches, and passed every prospectively frozen stimulus-readiness gate.

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

Stage ID:

`TMHV-S1-STIMULUS-2026-08-17-v1`

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

This seed block is fresh and non-overlapping with Tactical Motifs Study 1.

## Stage 1 scientific machine execution

Local execution completed from the exact authorized clean source tree under Node `v24.6.0` / Linux x64.

Generation:

- games generated: `1536 / 1536`
- unique historical trajectories: `1453`
- duplicate trajectory groups: `71`
- largest duplicate group: `4`
- distinct opening prefixes: `1278`
- six strata: `256` games each
- source tree dirty: `false`
- generation summary hash: `6af30d6827e36a0c8a9ba0a4856b2e590da98bab0021111ba014655ffd85e581`

Independent verification:

- `passed = true`
- `fullSearchRecomputation = true`
- games verified: `1536`
- mismatch count: `0`
- verification identity hash: `225e603e5fc60970901c89431a0155a83ffad2ed1de0ede83941cd2fc955c397`

## Stage 1 stimulus pool readiness

Selection was outcome-blind and inspected no human response.

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

Target generation strata represented: `6 / 6`.

All frozen readiness gates passed:

- unique historical trajectories
- distinct opening prefixes
- C03 target supply
- P_ONLY supply
- M_ONLY supply
- MORPH_NEAR supply
- matched P_ONLY supply
- matched M_ONLY supply
- matched MORPH_NEAR supply
- target generation-strata coverage

No replacement and no control reuse were performed.

Stimulus pool hash:

`6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

Stage 1 machine conclusion:

`MACHINE STIMULUS POOL READY`

This is an instrument-readiness conclusion only. It is not human validation and does not authorize expert/traditional/pedagogical claims.

## Primary task candidate

Three-position blinded principle discrimination:

```text
C03 target A
C03 target B
matched non-C03 control
```

Participant selects the pair sharing a reusable move principle. Chance correctness is `1/3`. Planned formal blocks remain 12, balanced 4 per control family, subject to prospective exact stimulus freeze and Stage 2 preregistration.

## Authorization state

Completed/authorized machine work:

- fixed Stage 1 machine corpus generation
- independent full replay/search verification
- target/control selection and matching audit
- readiness evaluation
- rendering / stimulus-identity technical audit
- non-scientific dry runs under the pilot firewall

Still not authorized:

- expert recruitment for scientific participation
- formal human responses
- human outcome inspection
- Stage 2 inference
- human/expert-validated tesuji claims

## Next required work

1. Preserve and SHA-256 hash the compact Stage 1 artifacts: `manifest.json`, `verification.json`, `stimulus-pool-audit.json`, and `stimulus-pool.json`.
2. Audit those compact artifacts against the recorded Stage 1 identities and pool hash.
3. Prospectively freeze the exact formal stimulus identities / 12-block construction and any separate secondary move-choice stimuli.
4. Complete ethics determination, consent, secure storage, and expert recruitment feasibility without eligibility relaxation.
5. Freeze and validate the Stage 2 machine-readable human preregistration before any formal human response.
6. Only after those gates may scientific expert recruitment / response collection be separately authorized.

If expert recruitment later proves insufficient, the valid human result remains `INCONCLUSIVE-NOT-ESTIMABLE`; Stage 1 machine readiness does not rescue human estimability.
