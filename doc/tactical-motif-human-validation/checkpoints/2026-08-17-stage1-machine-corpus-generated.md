# Stage 1 machine corpus generated

Date: 2026-08-17
Stage: `TMHV-S1-STIMULUS-2026-08-17-v1`

Status: `MACHINE CORPUS GENERATED / INDEPENDENT VERIFICATION PENDING`

## Execution identity

- authorized source commit: `12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`
- spec SHA-256: `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`
- authorization SHA-256: `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`
- historical C03 candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- execution platform: Linux x64
- Node.js: `v24.6.0`
- source tree dirty: `false`
- generation exit: `0`

## Generated corpus

- games: `1536 / 1536`
- seeds: `22100001..22101536`
- unique historical trajectories: `1453`
- duplicate historical trajectory groups: `71`
- largest historical trajectory group: `4`
- distinct opening prefixes: `1278`
- summary hash: `6af30d6827e36a0c8a9ba0a4856b2e590da98bab0021111ba014655ffd85e581`

Generation strata were exactly balanced at 256 games each:

- `B-D1`: 256
- `B-D2`: 256
- `B-D3`: 256
- `LS-D2`: 256
- `V2-D2`: 256
- `LE-D2`: 256

## Scientific boundary

This checkpoint records successful materialization only. It does **not** constitute independent verification or Stage 1 readiness.

At this checkpoint:

- `machineStimulusDevelopmentOnly = true`
- `humanDataCollectionAuthorized = false`
- `scientificHumanInferenceAuthorized = false`
- `verification.json` has not yet been produced
- `stimulus-pool-audit.json` has not yet been produced

No human recruitment, human response collection, or human/expert inference is authorized.

## Next required action

Run the frozen independent full verifier over all 1,536 games. Selection is blocked unless verification records:

- `passed = true`
- `fullSearchRecomputation = true`
- `gamesVerified = 1536`
- `mismatchCount = 0`
