# G2-12 / SSGTGE-STUDY1 — main integration complete

Date: 2026-08-31

## Integration authorization

After the Study had closed as `TECHNICAL-INVALID` and all central documentation had been synchronized on the research branch, a final consistency audit found no documentation inconsistency requiring scientific or central-document repair. The user then explicitly authorized integration to `main`.

## Immediate pre-integration audit

```text
remote main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
research branch = 741ba02ffa944a9569b262841465bfc78db8220a
compare status = ahead
research branch ahead_by = 16
research branch behind_by = 0
merge base = c5efcdb7972d1bc775a2857c1b0641c35c9df622
```

No unrelated `main` advance or divergence was present.

## Integration action

`main` was fast-forwarded without force to:

```text
741ba02ffa944a9569b262841465bfc78db8220a
```

After that fast-forward, integration-status-only documentation was updated on `main` so that pre-integration statements such as `Main integration = NOT PERFORMED` would not remain as current-state claims.

Recorded post-integration documentation commits include:

```text
CURRENT_STATUS = a440ac2308fb8e7305beeeb6cbb49446d9a9d08f
RESUME_HERE = 5fc9f00958d5215be2cd6e08e6ee6c67c485a70d
REPRODUCIBILITY_INDEX = 65fd0f6ec94f0ee49f481f76b98b35bf07ee71d4
```

## Scientific boundary

The integration and status synchronization do not alter any scientific result or authorization.

```text
Study formal decision = TECHNICAL-INVALID
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
canonical selectedEstimator = null
fresh depth 10 = NOT GENERATED / NOT READ
fresh depth 11 = NOT GENERATED / NOT READ
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN / unchanged
G2-11 = NOT-AUTHORIZED / unchanged
```

No tolerance relaxation, same-evidence rerun, Stage 2 authorization, fresh depth-10/11 generation/read, estimator rescue, or G2-11 authorization was performed as part of integration.
