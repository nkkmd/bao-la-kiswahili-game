# RESEARCH_LOG — Tactical Motif Human / Expert Validation Study 1

## 2026-08-16 — Study initiation / Stage 0

- Verified current GitHub `main` HEAD as `3cc40d83917660dd815c785ff0e0c754666d9a0e`.
- Confirmed exact match to the study-initiation reference SHA; no main delta required review.
- Recovered Tactical Motifs Study 1 final decisions and C03 canonical definition from repository source of truth.
- Reconfirmed Study 1 boundary: C03 is machine-confirmed only; expert/traditional/pedagogical claims were explicitly deferred.
- Audited Stage 2 formal candidate/spec and Stage 1 candidate freeze.
- Audited Stage 2 corpus/state reconstruction and candidate matching tooling.
- Audited gameplay board renderer, diagnostic state serialization, and `.gitignore` local-artifact boundary.
- Selected cross-position principle discrimination as the Stage 0 confirmatory center; move-choice retained as secondary.
- Defined outcome-blind expert eligibility framework and prior-C03-exposure exclusion for the primary cohort.
- Reserved a fresh Stage 1 machine seed block `22100001..22101536` with no extension/replacement.
- Defined C03 near-miss primary control classes; C01/C02/C04 limited to secondary calibration.
- Chose participant-level exact inference to avoid pseudoreplication from repeated position ratings.
- Established minimum primary expert count `10` and planned `12` primary blocks/participant.
- Established ethics/privacy/data-governance gate; no human scientific data were collected.
- Created branch `research/tactical-motif-human-validation` and initialized independent study documents.

Stage 0 conclusion:

`PASS FOR STAGE 1 MACHINE/INSTRUMENT DEVELOPMENT — HUMAN DATA COLLECTION NOT AUTHORIZED`

## 2026-08-17 — Stage 1 prospective machine-stimulus contract

- Froze Stage ID `TMHV-S1-STIMULUS-2026-08-17-v1`.
- Froze fresh population at 1536 games / seeds `22100001..22101536` / six strata ×256 / first 8 plies seeded-uniform exact moveVariants / max ply100 / no extension / no replacement.
- Froze Stage 1 spec SHA-256 `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`.
- Bound historical C03 by candidate-definition SHA-256 `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`, canonical rank 5, and immutable candidate key.
- Defined `C03_TARGET`, `P_ONLY`, `M_ONLY`, and `MORPH_NEAR` before scientific corpus generation.
- Froze deterministic one-state-per-trajectory-per-class selection and duplicate rule-state collapse.
- Froze no-reuse matching with same-trajectory and same-opening-prefix exclusions.
- Defined primary instrument candidate as two C03 targets + one matched control, with 1/3 random pair-selection probability.
- Implemented actor-to-South position-only renderer using validated player-swap only; no column/direction reversal.

## 2026-08-17 — Stage 1 tooling validation

Implementation commit:

`03838e5d88329dd4b3c1f8e06598bbbc6d6a92cc`

GitHub Actions run `31955303204`, job `95184928361` completed successfully.

Passed before scientific machine generation:

- frozen spec validator;
- historical C03 SHA/identity validator;
- inherited symmetry/position-feature/tactical-motif tests;
- dedicated Stage 1 tooling test;
- deterministic 9-ply technical replay smoke;
- actor-normalized renderer smoke;
- non-generative status/source-hash reporting;
- absent-authorization generation firewall.

Scientific Stage 1 games generated in CI: `0`.

## 2026-08-17 — Stage 1 generation authorization

- Issued source-hash-bound authorization after successful tooling validation.
- Authorization SHA-256: `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`.
- Authorization commit: `12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`.
- Authorization-binding GitHub Actions run `31955362114`, job `95185068008`: success.
- Machine stimulus generation: authorized.
- Human data collection: not authorized.
- Scientific human inference: not authorized.

## 2026-08-17 — Local execution environment boundary

- Attempted to obtain the exact authorized repository tree in the assistant local runtime for scientific generation.
- Local `git clone` failed because the runtime could not resolve `github.com`.
- Did not move scientific generation into GitHub Actions as a workaround because the Stage 1 protocol explicitly reserves Actions for contract/tooling validation.
- No corpus-size extension, threshold change, matching change, or alternative source tree was used.

Current Stage 1 execution state:

`TOOLING VALIDATED / MACHINE GENERATION AUTHORIZED / SCIENTIFIC CORPUS GENERATION PENDING LOCAL OR COLAB EXECUTION`

Human scientific data collected to date: `0`.
