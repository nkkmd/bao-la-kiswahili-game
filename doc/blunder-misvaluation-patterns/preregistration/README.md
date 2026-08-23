# Preregistration records

Updated: 2026-08-23  
Status: **STUDY 1 CLOSED / STAGE 2 FORMAL EXECUTION COMPLETE**

## Stage 0 / Stage 1

- `STAGE_0_DESIGN_FREEZE.json` — construct/search/seed reservation before present-Study scientific data.
- `STAGE_1_EXPLORATORY_SPEC.json` — frozen prospective Stage 1 exploratory contract.
- `STAGE_1_EXECUTION_SOURCE_FREEZE.json` — exact validated Stage 1 scientific source-file SHA-256 map.
- `STAGE_1_EXPLORATORY_AUTHORIZATION.json` — explicit source-bound Stage 1 generation authorization.

Stage 1 immutable identity:

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
promoted exploratory candidates = 4
```

Stage 1 is complete and integrated to `main`. Its support was not reused as Stage 2 confirmation evidence.

## Stage 2 formal confirmation

Frozen/authorized records:

- `STAGE_2_FORMAL_CANDIDATES.json` — one-to-one freeze of the four Stage 1 promoted candidates and two shared support groups.
- `STAGE_2_FORMAL_SPEC.json` — prospective Stage 2 population, identity firewall, selection, endpoints, estimability, multiplicity, verification, decision and no-rescue contract.
- `STAGE_2_EXECUTION_SOURCE_FREEZE.json` — exact validated Stage 2 scientific source-file SHA-256 map.
- `STAGE_2_FORMAL_AUTHORIZATION.json` — explicit source-bound authorization for Stage 2 formal scientific generation.

Stage 2 identity:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze ID = BMP-S2-CANDIDATES-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
validated execution HEAD = 011b9a56ecb95046f7d61a331b76dea093aa7663
technical validation result commit = 3d5a1a33f673c9c98ba6a5ed2862b25c8d76e777
source freeze commit = 11670e528dccff063b8e66be9ff190e61e4e4e77
final corrected authorization commit = a9eee06c6a1ad36f9e65948f5d78eff58a91d561
fresh fixed seeds = 22500001..22504096
games = 4096
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
```

Formal candidate mapping:

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

C01/C02/C03 shared the same frozen Namua support-group roots. C04 used the Mtaji support group.

Stage 2 required and achieved final zero overlap with Stage 1 on:

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

No replacement or seed extension was performed.

## Authorization correction audit

The initial authorization commit `a0e7d9ee619d081749039271f039b32267699d4b` contained one clerical source-hash transcription error and was never used. It was corrected before scientific generation. The final authorization is `a9eee06c6a1ad36f9e65948f5d78eff58a91d561`.

## Completed execution chain

```text
generate                                        COMPLETE (4096 / 4096)
-> independent full replay/search verification PASS
-> support-group selection                     PASS
-> formal measurement                          COMPLETE (2678 rows)
-> independent measurement verification        PASS
-> formal evaluation                           COMPLETE
```

Final formal state:

```text
formal candidates = 4
estimable = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

Canonical result records are in [`../results/`](../results/), with scientific interpretation in [`../STUDY_1_FINAL_REPORT.md`](../STUDY_1_FINAL_REPORT.md). The preregistration and authorization records here remain immutable historical inputs and are not modified to accommodate the observed result.