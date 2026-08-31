# LGTGMIV-STUDY1 — Stage 2 one-shot execution trigger

Date: 2026-09-01

## Trigger decision

This artifact triggers the single authorized execution of `LGTGMIV-S2-FORMAL-2026-08-31-v1` under the already-frozen Study protocol, Stage 2 preregistration and separate Stage 2 authorization.

It does not change any seed, population, root-selection rule, horizon, representation, move identity, metric family, scientific serialization, resource ceiling, gate or formal decision rule.

## Satisfied prerequisites

Before this trigger was committed:

- Stage 1 disposition was `STAGE1-PASS` with all global gates PASS.
- all five prospectively frozen families were promoted.
- separate Stage 2 authorization existed at `authorizations/2026-09-01-stage-2-formal-authorization.md`.
- Stage 2 non-scientific tooling smoke passed: run `33451567682`.
- Stage 2 pre-execution audits passed: runs `33451887834` and `33451948317`.
- final pre-execution checkpoint was committed at `checkpoints/2026-09-01-stage-2-preexecution-pass.md`.
- Stage 1 production and independent measurement instruments were verified unchanged from Stage 1 result commit `52812f37197df74e90d1864720ad1b7e6f13d7fa`.
- no Stage 2 scientific result existed.
- Stage 2 fresh block `31120001..31120192` had not been generated or read.
- protected standard initial RAW-root complete exact depth-10 holdout remained sealed/unread.

## Authorized execution boundary

The execution may now open exactly the frozen Stage 2 fresh formal holdout:

- seeds: `31120001..31120192`
- target population: 12 Namua + 12 Mtaji = 24 unique RAW roots
- relative local horizon: depth 5
- tested families: exactly the five Stage 1-promoted LGTGMIV families
- exclusion firewall: G3-01 plus Stage 1 RAW-root, full-source-trajectory and first-16-prefix identities

No other fresh or protected evidence is authorized.

## No-rescue boundary

Upon the first generation or read of Stage 2 fresh evidence, the Stage 2 no-rescue boundary becomes permanent. A failure, negative result, non-estimability or technical invalidity must be accepted under the frozen protocol. The same Stage 2 evidence must not be regenerated or rerun as a formal rescue after a defect or unfavorable result.

## Downstream boundary

This trigger does not authorize G3-02 or any later Research Generation 3 Study. G3-02..G3-08 remain blocked pending a separate post-closure program authorization review, regardless of the Stage 2 result.

Protected standard initial RAW-root complete exact depth-10 holdout remains outside authorization:

`SEALED / NOT GENERATED / NOT READ`
