# Checkpoint — TMHV Stage 1 local execution handoff

Date: 2026-08-17

Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

## State at handoff

Stage 1 tooling and authorization are complete. Scientific machine corpus generation has not yet been executed.

Authorized scientific execution commit:

`12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`

Validated implementation commit:

`03838e5d88329dd4b3c1f8e06598bbbc6d6a92cc`

Stage 1 spec SHA-256:

`c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`

Stage 1 authorization SHA-256:

`d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`

Historical C03 candidate-definition SHA-256:

`667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

## Authorized next operations

On a clean local/Colab checkout of the authorized commit:

1. validate spec/tooling/authorization;
2. generate exactly 1,536 games from seeds `22100001..22101536`;
3. run independent full replay/search verification;
4. only if verification passes, run stimulus target/control selection;
5. preserve compact artifacts and hashes;
6. stop before scientific human recruitment.

## Required compact return artifacts

- `manifest.json`
- `verification.json`
- `stimulus-pool-audit.json`
- `stimulus-pool.json`
- SHA-256 sums for the above

If generation or verification fails, return the available compact artifacts and terminal error instead; do not rescue by selective regeneration, source edits, corpus extension, or threshold relaxation.

## Human-data firewall

The following remain unauthorized:

- scientific expert recruitment;
- formal human endpoint responses;
- scientific human inference;
- `HUMAN-EXPERT-VALIDATED` claim.

Current human evidence remains:

`humanExpertEvidence = NOT-YET-COLLECTED`
