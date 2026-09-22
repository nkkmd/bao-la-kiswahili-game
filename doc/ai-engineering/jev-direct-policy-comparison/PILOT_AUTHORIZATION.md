# Jev Direct Policy — paid pilot authorization

Date: 2026-09-22

Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`

## Decision

**AUTHORIZED — PAID PILOT ONLY**

The user explicitly instructed the study to start the paid pilot after the runtime freeze and offline QA gates had passed.

This authorization is limited to the preregistered pilot:

- 2 fresh paired openings
- side swap for each opening
- 4 games total
- Jev Direct Policy vs `AI-GEN4-RELEASE-001` expert standard
- Jev model pinned to `jev-1.13.0`
- pilot budget ceiling USD 0.10
- overall study hard ceiling USD 1.00
- no automatic retry
- maximum 2 paid attempts per logical Jev decision, where attempt 2 requires explicit resume after a technical pause

It does **not** authorize the 64-game formal comparison. Formal execution requires a separate post-pilot technical audit and separate authorization.

## Frozen bindings

- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- pilot spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Immediate external recheck

Immediately before authorization, the TypeSafe official documentation was rechecked and remained consistent with the frozen assumptions:

- versioned model: `jev-1.13.0`
- input price: USD 0.042 / 1M input tokens
- request context: 64k tokens; 32k for state plus the longest question
- Choice limit: 255 options

If these assumptions change before the local command is actually run, execution must stop and be reviewed again.

## Production boundary

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY` remains unchanged. This pilot does not authorize a public-AI change, AI generation change, deployment, or main integration.
