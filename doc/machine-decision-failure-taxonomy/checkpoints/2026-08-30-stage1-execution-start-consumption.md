# MDFT-STUDY1 — Stage 1 Execution Start / Consume-Once Record

日付: 2026-08-30 (JST)

## Authorized execution

```text
Stage = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Authorization commit = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
GitHub Actions run = 33277102013
Execution-start gate = PASS
Scientific computation step = STARTED
```

## Seed consumption boundary

At successful execution-start gate completion, the frozen scientific block became permanently consumed:

```text
seeds = 28910001..28914096
games = 4096
status = CONSUMED
same-block rerun = NOT AUTHORIZED
repair = NOT AUTHORIZED
replacement = NOT AUTHORIZED
extension = NOT AUTHORIZED
```

This consumption status is independent of the eventual scientific disposition and independent of later computation, verification, serialization or artifact-transfer success/failure.

The block must never be returned to `UNCONSUMED`.

## Current result state at checkpoint creation

```text
Stage 1 scientific outcome = NOT YET AVAILABLE
Stage 1 canonical disposition = PENDING CURRENT AUTHORIZED RUN
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
```

No result-dependent taxonomy change is authorized while run `33277102013` is in progress.
