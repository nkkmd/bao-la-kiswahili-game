# CURRENT_STATUS — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-18

## Current state

**STAGE 1 EXACT FORMAL MACHINE STIMULI FROZEN / HUMAN DATA COLLECTION NOT STARTED**

The fixed Stage 1 machine corpus was generated from the exact authorized clean source tree, independently recomputed with zero mismatches, passed every prospectively frozen pool-readiness gate, passed compact-artifact identity/integrity audit, and has now been deterministically reduced to the exact private formal machine stimulus set under the prospectively frozen freeze rule. Exact board identities remain private; the repository records only cryptographic commitments and aggregate audit metadata.

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

Independent checks passed across all 1,554 stored target-control matches, including zero same-trajectory violations, zero same-opening-prefix violations, zero duplicate controls/targets within family, and zero matching-cost violations above `10`.

## Exact formal machine stimulus freeze

Freeze ID:

`TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

Prospective selection-spec SHA-256:

`67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5`

Private exact freeze SHA-256 commitment:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

Returned public-safe freeze audit SHA-256:

`e994ddeb2875831a7a79e1181aa2bbbb39658316ebffcf896c7953265cdd70b3`

Materialization result:

```text
primary blocks              = 12
primary positions           = 36
primary C03 targets         = 24
primary controls            = 12
P_ONLY controls             = 4
M_ONLY controls             = 4
MORPH_NEAR controls         = 4
secondary move-choice C03   = 6
total unique formal states  = 42
```

All formal-freeze checks passed:

- primary block count;
- control balance;
- secondary count;
- expected 42 unique formal positions;
- unique rule states;
- unique historical trajectories;
- unique opening prefixes;
- primary actor normalized South;
- primary phase Mtaji;
- human-data authorization remains false.

Aggregate generation-condition provenance across the 42 positions is:

```text
LS-D2 = 10
LE-D2 = 10
B-D1  = 10
V2-D2 = 10
B-D2  = 1
B-D3  = 1
```

This distribution is preserved, not repaired. The prospectively frozen formal-stimulus rule required one secondary item per generation stratum but did not define primary generation-condition balance as a gate. Post-materialization rebalancing, substitution, aesthetic reselection, and human-outcome-dependent reselection are prohibited.

Exact rule-state identities, board states, seeds, and participant SVGs remain in the gitignored private local artifact only. `STAGE_1_FORMAL_STIMULUS_FREEZE_AUDIT.json` contains no exact stimulus identities.

## Authorization state

Completed machine/instrument work:

- fixed Stage 1 machine corpus generation;
- independent full replay/search verification;
- target/control selection and matching audit;
- readiness evaluation;
- compact artifact identity/integrity audit;
- deterministic exact formal-stimulus selection rule freeze and CI validation;
- exact private formal-stimulus materialization and public cryptographic commitment.

Still not authorized:

- expert recruitment for scientific participation;
- formal human responses;
- human outcome inspection;
- Stage 2 inference;
- human/expert-validated tesuji claims.

## Next required work

1. Complete applicable ethics-review determination and finalize consent/withdrawal/retention materials before scientific recruitment.
2. Establish secure participant/contact/linkage storage and withdrawal workflow outside public Git.
3. Complete expert recruitment feasibility under the already frozen eligibility criteria; do not relax criteria to reach the minimum sample.
4. Freeze Kiswahili/English formal instrument wording and document content-equivalence review.
5. Freeze and validate the Stage 2 machine-readable human preregistration: participant/exclusion/missing/stopping rules, exact primary endpoint/test/alpha/effect gate, secondary multiplicity policy, data schema, and no-rescue firewall.
6. Issue a separate human-data collection authorization only after every pre-collection gate is satisfied.

If recruitment is insufficient, the valid human result remains `INCONCLUSIVE-NOT-ESTIMABLE`. Stage 1 machine readiness/freeze cannot rescue human estimability.
