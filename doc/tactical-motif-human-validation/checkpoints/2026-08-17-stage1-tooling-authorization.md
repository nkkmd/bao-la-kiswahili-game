# Stage 1 tooling validation and machine-stimulus authorization

Date: 2026-08-17

Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

## Validation

Implementation commit:

`03838e5d88329dd4b3c1f8e06598bbbc6d6a92cc`

GitHub Actions:

- run `31955303204`
- job `95184928361`
- conclusion: `success`

Validated before scientific machine generation:

- Stage 1 frozen specification and historical C03 SHA binding
- inherited seat-swap / position-feature / tactical-motif instrumentation
- dedicated Stage 1 generator/matcher module
- actor-to-South position-only SVG renderer
- deterministic tiny technical replay smoke
- non-generative status/source-hash reporting
- absent-authorization firewall

No 1,536-game scientific stimulus corpus was generated in CI.

## Frozen hashes

- Stage 1 spec SHA-256: `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`
- historical C03 candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

The exact source-file SHA-256 mapping printed by the successful CI run is frozen in `preregistration/STAGE_1_STIMULUS_AUTHORIZATION.json`.

## Authorization

Authorized:

- local generation of the fixed 1,536-game machine stimulus corpus;
- independent full replay/search verification;
- outcome-blind C03 target/control classification and matching;
- renderer/identity audits;
- non-scientific instrument dry runs under the pilot firewall.

Not authorized:

- expert recruitment as scientific participants;
- formal human response collection;
- human outcome inspection;
- Stage 2 formal inference;
- any human/expert-recognized tesuji claim.

Any authorization-bound source change invalidates machine generation until revalidation and a new authorization boundary are recorded.
